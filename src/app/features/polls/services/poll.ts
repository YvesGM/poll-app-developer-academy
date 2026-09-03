import { Injectable, OnDestroy, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';

import { SupabaseService } from '../../../core/supabase/supabase';
import { VoterIdentityService } from '../../../core/voter/voter-identity';
import {
  CreatePollInput,
  Poll,
  PollCategory,
} from '../models/poll.model';

type PollRow = {
  id: string;
  category: PollCategory;
  title: string;
  question: string;
  description: string | null;
  deadline: string | null;
  created_at: string;
};

type PollOptionRow = {
  id: string;
  poll_id: string;
  text: string;
};

type VoteRow = {
  option_id: string;
};

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

  constructor(
    private readonly supabase: SupabaseService,
    private readonly voterIdentity: VoterIdentityService,
  ) {
    this.realtimeChannel = this.createRealtimeChannel();
    void this.loadPolls();
  }

  ngOnDestroy(): void {
    void this.supabase.client.removeChannel(this.realtimeChannel);
  }

  async loadPolls(showLoading = true): Promise<void> {
    if (showLoading) {
      this.loadingState.set(true);
    }

    this.errorState.set(null);

    try {
      const [pollsResult, optionsResult, votesResult] = await Promise.all([
        this.supabase.client
          .from('polls')
          .select(
            'id, category, title, question, description, deadline, created_at',
          )
          .order('deadline', { ascending: true, nullsFirst: false }),
        this.supabase.client.from('poll_options').select('id, poll_id, text'),
        this.supabase.client.from('votes').select('option_id'),
      ]);

      if (pollsResult.error) {
        throw pollsResult.error;
      }

      if (optionsResult.error) {
        throw optionsResult.error;
      }

      if (votesResult.error) {
        throw votesResult.error;
      }

      const polls = (pollsResult.data ?? []) as PollRow[];
      const options = (optionsResult.data ?? []) as PollOptionRow[];
      const votes = (votesResult.data ?? []) as VoteRow[];

      const voteCounts = new Map<string, number>();

      for (const vote of votes) {
        voteCounts.set(vote.option_id, (voteCounts.get(vote.option_id) ?? 0) + 1);
      }

      this.pollsState.set(
        polls.map((poll) => ({
          id: poll.id,
          category: poll.category,
          title: poll.title,
          question: poll.question,
          description: poll.description,
          deadline: poll.deadline ? new Date(poll.deadline) : null,
          createdAt: new Date(poll.created_at),
          options: options
            .filter((option) => option.poll_id === poll.id)
            .map((option) => ({
              id: option.id,
              text: option.text,
              votes: voteCounts.get(option.id) ?? 0,
            })),
        })),
      );
    } catch (error) {
      this.errorState.set(this.getErrorMessage(error, 'Failed to load surveys.'));
    } finally {
      if (showLoading) {
        this.loadingState.set(false);
      }
    }
  }

  getPollById(id: string): Poll | undefined {
    return this.polls().find((poll) => poll.id === id);
  }

  isPast(poll: Poll, referenceDate = new Date()): boolean {
    return poll.deadline !== null && poll.deadline.getTime() <= referenceDate.getTime();
  }

  isActive(poll: Poll, referenceDate = new Date()): boolean {
    return !this.isPast(poll, referenceDate);
  }

  hasVoted(pollId: string): boolean {
    return this.voterIdentity.hasVoted(pollId);
  }

  async createPoll(input: CreatePollInput): Promise<Poll | null> {
    this.errorState.set(null);

    const { data: pollRow, error: pollError } = await this.supabase.client
      .from('polls')
      .insert({
        category: input.category,
        title: input.title,
        question: input.question,
        description: input.description,
        deadline: input.deadline?.toISOString() ?? null,
      })
      .select(
        'id, category, title, question, description, deadline, created_at',
      )
      .single();

    if (pollError || !pollRow) {
      this.errorState.set(
        this.getErrorMessage(pollError, 'Failed to create survey.'),
      );
      return null;
    }

    const { data: optionRows, error: optionError } = await this.supabase.client
      .from('poll_options')
      .insert(
        input.options.map((text) => ({
          poll_id: pollRow.id,
          text,
        })),
      )
      .select('id, poll_id, text');

    if (optionError || !optionRows) {
      await this.supabase.client.from('polls').delete().eq('id', pollRow.id);
      this.errorState.set(
        this.getErrorMessage(optionError, 'Failed to create survey options.'),
      );
      return null;
    }

    const poll: Poll = {
      id: pollRow.id,
      category: pollRow.category as PollCategory,
      title: pollRow.title,
      question: pollRow.question,
      description: pollRow.description,
      deadline: pollRow.deadline ? new Date(pollRow.deadline) : null,
      createdAt: new Date(pollRow.created_at),
      options: optionRows.map((option) => ({
        id: option.id,
        text: option.text,
        votes: 0,
      })),
    };

    this.pollsState.update((polls) => [...polls, poll]);
    return poll;
  }

  async vote(pollId: string, optionId: string): Promise<boolean> {
    this.errorState.set(null);

    const currentPoll = this.getPollById(pollId);

    if (!currentPoll || this.isPast(currentPoll) || this.hasVoted(pollId)) {
      return false;
    }

    const { error } = await this.supabase.client.from('votes').insert({
      poll_id: pollId,
      option_id: optionId,
      voter_token: this.voterIdentity.voterToken,
    });

    if (error) {
      if (this.isDuplicateVoteError(error)) {
        this.voterIdentity.markVoted(pollId);
        return false;
      }

      this.errorState.set(this.getErrorMessage(error, 'Failed to save vote.'));
      return false;
    }

    this.voterIdentity.markVoted(pollId);
    await this.loadPolls(false);
    return true;
  }

  async deletePoll(pollId: string): Promise<boolean> {
    this.errorState.set(null);

    const { error } = await this.supabase.client
      .from('polls')
      .delete()
      .eq('id', pollId);

    if (error) {
      this.errorState.set(this.getErrorMessage(error, 'Failed to delete survey.'));
      return false;
    }

    this.pollsState.update((polls) => polls.filter((poll) => poll.id !== pollId));
    return true;
  }

  clearError(): void {
    this.errorState.set(null);
  }

  private createRealtimeChannel(): RealtimeChannel {
    return this.supabase.client
      .channel('poll-app-live-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'polls' },
        () => void this.loadPolls(false),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'poll_options' },
        () => void this.loadPolls(false),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => void this.loadPolls(false),
      )
      .subscribe();
  }

  private isDuplicateVoteError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    );
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }

    return fallback;
  }
}
