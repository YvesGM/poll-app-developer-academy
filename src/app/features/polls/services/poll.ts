import { Injectable, OnDestroy, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';

import { SupabaseService } from '../../../core/supabase/supabase';
import { VoterIdentityService } from '../../../core/voter/voter-identity';
import { mapPollRow, mapPollRows, PollRow } from '../mappers/poll.mapper';
import { CreatePollInput, Poll } from '../models/poll.model';
import { subscribeToPollChanges } from './poll-realtime';
import { PollDataSnapshot, PollRepository } from './poll-repository';

@Injectable({
  providedIn: 'root',
})
export class PollService implements OnDestroy {
  private readonly pollsState = signal<Poll[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly realtimeChannel: RealtimeChannel;

  readonly polls = this.pollsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * Creates the realtime subscription and loads the initial survey state.
   * @param supabase Supabase client provider.
   * @param voterIdentity Browser voter identity provider.
   * @param repository Survey persistence repository.
   */
  constructor(
    private readonly supabase: SupabaseService,
    private readonly voterIdentity: VoterIdentityService,
    private readonly repository: PollRepository,
  ) {
    this.realtimeChannel = subscribeToPollChanges(
      this.supabase.client,
      () => void this.loadPolls(false),
    );
    void this.loadPolls();
  }

  /** Removes the Supabase realtime channel when the service is destroyed. */
  ngOnDestroy(): void {
    void this.supabase.client.removeChannel(this.realtimeChannel);
  }

  /**
   * Loads surveys, options, and vote counts from Supabase.
   *
   * @param showLoading Whether the public loading signal should be toggled.
   */
  async loadPolls(showLoading = true): Promise<void> {
    this.beginLoad(showLoading);
    try {
      const snapshot = await this.repository.fetchSnapshot();
      this.storeSnapshot(snapshot);
    } catch (error) {
      this.setError(error, 'Failed to load surveys.');
    } finally {
      this.setLoading(showLoading, false);
    }
  }

  /**
   * Returns one survey by its identifier.
   * @param id Survey identifier.
   * @returns Matching survey when loaded.
   */
  getPollById(id: string): Poll | undefined {
    return this.polls().find((poll) => poll.id === id);
  }

  /**
   * Checks whether a survey deadline has passed.
   * @param poll Survey to inspect.
   * @param referenceDate Time used for the comparison.
   * @returns Whether the survey is past.
   */
  isPast(poll: Poll, referenceDate = new Date()): boolean {
    return poll.deadline !== null && poll.deadline.getTime() <= referenceDate.getTime();
  }

  /**
   * Checks whether a survey is still active.
   * @param poll Survey to inspect.
   * @param referenceDate Time used for the comparison.
   * @returns Whether the survey is active.
   */
  isActive(poll: Poll, referenceDate = new Date()): boolean {
    return !this.isPast(poll, referenceDate);
  }

  /**
   * Checks whether the current browser identity has already voted.
   * @param pollId Survey identifier to inspect.
   * @param questionId Question identifier to inspect.
   * @returns Whether the browser already voted.
   */
  hasVoted(pollId: string, questionId: string): boolean {
    return this.voterIdentity.hasVoted(pollId, questionId);
  }

  /**
   * Checks whether the current browser identity selected one option.
   * @param pollId Survey identifier to inspect.
   * @param questionId Question identifier to inspect.
   * @param optionId Option identifier to inspect.
   * @returns Whether this option was already selected.
   */
  hasVotedOption(pollId: string, questionId: string, optionId: string): boolean {
    return this.voterIdentity.hasVotedOption(pollId, questionId, optionId);
  }

  /**
   * Creates a survey and its answer options.
   *
   * @param input Validated survey input.
   * @returns Created survey or `null` when persistence fails.
   */
  async createPoll(input: CreatePollInput): Promise<Poll | null> {
    this.clearError();
    let pollRow: PollRow | null = null;
    try {
      pollRow = await this.repository.insertPoll(input);
      return await this.createAndStorePoll(pollRow, input);
    } catch (error) {
      return this.handleCreateFailure(error, pollRow?.id);
    }
  }

  /**
   * Persists one vote for a survey option.
   *
   * @param pollId Survey identifier.
   * @param questionId Question identifier.
   * @param optionId Selected option identifier.
   * @returns Whether the vote was stored successfully.
   */
  async vote(
    pollId: string,
    questionId: string,
    optionId: string,
    allowMultiple = false,
  ): Promise<boolean> {
    this.clearError();
    if (!this.canVote(pollId, questionId, optionId, allowMultiple)) return false;
    const error = await this.repository.insertVote(
      pollId, questionId, optionId, this.voterIdentity.voterToken,
    );
    if (error) return this.handleVoteError(error, pollId, questionId, optionId, allowMultiple);
    await this.completeVote(pollId, questionId, optionId, allowMultiple);
    return true;
  }

  /** Clears the latest public service error. */
  clearError(): void {
    this.errorState.set(null);
  }

  /**
   * Prepares state for a survey load operation.
   * @param showLoading Whether visible loading state is enabled.
   */
  private beginLoad(showLoading: boolean): void {
    this.setLoading(showLoading, true);
    this.clearError();
  }

  /**
   * Maps and stores a complete persisted survey snapshot.
   * @param snapshot Persisted rows to map and store.
   */
  private storeSnapshot(snapshot: PollDataSnapshot): void {
    const polls = mapPollRows(snapshot.polls, snapshot.questions, snapshot.options, snapshot.votes);
    this.pollsState.set(polls);
  }

  /**
   * Adds one newly created survey to the local signal state.
   * @param poll Survey to append.
   */
  private appendPoll(poll: Poll): void {
    this.pollsState.update((polls) => [...polls, poll]);
  }

  /**
   * Persists options and stores the newly assembled survey.
   * @param pollRow Persisted parent survey row.
   * @param input Validated survey input.
   * @returns Newly assembled survey model.
   */
  private async createAndStorePoll(pollRow: PollRow, input: CreatePollInput): Promise<Poll> {
    const questionRows = await this.repository.insertPollQuestions(pollRow.id, input.questions);
    const optionRows = await this.repository.insertPollOptions(pollRow.id, input.questions, questionRows);
    const poll = mapPollRow(pollRow, questionRows, optionRows, new Map());
    this.appendPoll(poll);
    return poll;
  }

  /**
   * Rolls back partial creation and exposes its persistence error.
   * @param error Creation failure to expose.
   * @param pollId Partially created survey identifier.
   * @returns Always `null` for the failed creation.
   */
  private async handleCreateFailure(error: unknown, pollId: string | undefined): Promise<null> {
    await this.rollbackCreatedPoll(pollId);
    this.setError(error, 'Failed to create survey.');
    return null;
  }

  /**
   * Removes a partially created survey after an option insert failure.
   * @param pollId Partially created survey identifier.
   */
  private async rollbackCreatedPoll(pollId: string | undefined): Promise<void> {
    if (!pollId) {
      return;
    }
    await this.repository.deletePartialPoll(pollId);
  }

  /**
   * Checks all local conditions that allow a vote to be submitted.
   * @param pollId Survey identifier to inspect.
   * @param questionId Question identifier to inspect.
   * @returns Whether voting is allowed.
   */
  private canVote(
    pollId: string,
    questionId: string,
    optionId: string,
    allowMultiple: boolean,
  ): boolean {
    const poll = this.getPollById(pollId);
    if (!poll || this.isPast(poll)) return false;
    return allowMultiple
      ? !this.hasVotedOption(pollId, questionId, optionId)
      : !this.hasVoted(pollId, questionId);
  }

  /**
   * Handles duplicate-vote and general persistence errors.
   * @param error Vote persistence error.
   * @param pollId Survey identifier associated with the vote.
   * @param questionId Question identifier associated with the vote.
   * @returns Always `false` for the failed vote.
   */
  private handleVoteError(
    error: unknown,
    pollId: string,
    questionId: string,
    optionId: string,
    allowMultiple: boolean,
  ): boolean {
    if (this.isDuplicateVoteError(error)) {
      this.markVoteLocally(pollId, questionId, optionId, allowMultiple);
      return false;
    }
    this.setError(error, 'Failed to save vote.');
    return false;
  }

  /**
   * Marks a successful vote locally and refreshes the survey state.
   * @param pollId Survey identifier associated with the vote.
   * @param questionId Question identifier associated with the vote.
   */
  private async completeVote(
    pollId: string,
    questionId: string,
    optionId: string,
    allowMultiple: boolean,
  ): Promise<void> {
    this.markVoteLocally(pollId, questionId, optionId, allowMultiple);
    await this.loadPolls(false);
  }

  /** Stores the correct local marker for single- or multiple-answer questions. */
  private markVoteLocally(
    pollId: string,
    questionId: string,
    optionId: string,
    allowMultiple: boolean,
  ): void {
    if (allowMultiple) this.voterIdentity.markVotedOption(pollId, questionId, optionId);
    else this.voterIdentity.markVoted(pollId, questionId);
  }

  /**
   * Checks whether a Supabase error represents a unique constraint violation.
   * @param error Unknown persistence error.
   * @returns Whether the unique constraint code is present.
   */
  private isDuplicateVoteError(error: unknown): boolean {
    return this.hasErrorCode(error, '23505');
  }

  /**
   * Checks an unknown error object for a specific database error code.
   * @param error Unknown persistence error.
   * @param code Database error code to match.
   * @returns Whether the supplied code is present.
   */
  private hasErrorCode(error: unknown, code: string): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
  }

  /**
   * Stores a readable public error message.
   * @param error Unknown error to translate.
   * @param fallback Message used when no readable error exists.
   */
  private setError(error: unknown, fallback: string): void {
    this.errorState.set(this.getErrorMessage(error, fallback));
  }

  /**
   * Extracts a readable message from an unknown error value.
   * @param error Unknown error to inspect.
   * @param fallback Message used when extraction fails.
   * @returns Readable error message.
   */
  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error !== 'object' || error === null || !('message' in error)) {
      return fallback;
    }
    return typeof error.message === 'string' ? error.message : fallback;
  }

  /**
   * Toggles loading only when the caller requested a visible loading state.
   * @param enabled Whether loading updates are enabled.
   * @param value Loading state to store.
   */
  private setLoading(enabled: boolean, value: boolean): void {
    if (enabled) {
      this.loadingState.set(value);
    }
  }
}
