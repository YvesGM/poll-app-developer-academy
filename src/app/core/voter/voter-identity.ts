import { Injectable, signal, WritableSignal } from '@angular/core';

const VOTER_TOKEN_STORAGE_KEY = 'poll-app-voter-token-v2';
const VOTED_POLLS_STORAGE_KEY = 'poll-app-voted-polls-v2';
const COMPLETED_POLLS_STORAGE_KEY = 'poll-app-completed-polls-v1';

@Injectable({ providedIn: 'root' })
export class VoterIdentityService {
  private readonly votedKeysState = signal<ReadonlySet<string>>(new Set(this.readStoredSet(VOTED_POLLS_STORAGE_KEY)));
  private readonly completedPollsState = signal<ReadonlySet<string>>(new Set(this.readStoredSet(COMPLETED_POLLS_STORAGE_KEY)));
  readonly voterToken = this.getOrCreateVoterToken();

  /** Checks whether this browser session completed one survey. @param pollId Survey id. @returns Completion state. */
  hasCompletedPoll(pollId: string): boolean {
    return this.completedPollsState().has(pollId);
  }

  /** Checks whether this session submitted one option. @param pollId Survey id. @param questionId Question id. @param optionId Option id. @returns Vote state. */
  hasVotedOption(pollId: string, questionId: string, optionId: string): boolean {
    return this.votedKeysState().has(this.optionVoteKey(pollId, questionId, optionId));
  }

  /** Stores one submitted option for this browser session. @param pollId Survey id. @param questionId Question id. @param optionId Option id. */
  markVotedOption(pollId: string, questionId: string, optionId: string): void {
    this.storeSetValue(VOTED_POLLS_STORAGE_KEY, this.votedKeysState, this.optionVoteKey(pollId, questionId, optionId));
  }

  /** Marks one survey completed for this browser session. @param pollId Survey id. */
  markCompletedPoll(pollId: string): void {
    this.storeSetValue(COMPLETED_POLLS_STORAGE_KEY, this.completedPollsState, pollId);
  }

  /** Returns or creates the session voter token. @returns Session-scoped voter token. */
  private getOrCreateVoterToken(): string {
    const existingToken = sessionStorage.getItem(VOTER_TOKEN_STORAGE_KEY);
    return existingToken || this.createVoterToken();
  }

  /** Creates and stores one session voter token. @returns Newly stored token. */
  private createVoterToken(): string {
    const token = crypto.randomUUID();
    sessionStorage.setItem(VOTER_TOKEN_STORAGE_KEY, token);
    return token;
  }

  /** Reads one serialized session set. @param key Storage key. @returns Valid string values. */
  private readStoredSet(key: string): string[] {
    const rawValue = sessionStorage.getItem(key);
    if (!rawValue) return [];
    try {
      return this.filterValidKeys(JSON.parse(rawValue) as unknown);
    } catch {
      return [];
    }
  }

  /** Filters unknown values to strings. @param value Parsed value. @returns String values. */
  private filterValidKeys(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  }

  /** Builds one option-scoped vote key. @param pollId Survey id. @param questionId Question id. @param optionId Option id. @returns Storage key. */
  private optionVoteKey(pollId: string, questionId: string, optionId: string): string {
    return `${pollId}:${questionId}:${optionId}`;
  }

  /** Adds one value to a session-backed signal set. @param key Storage key. @param state Signal state. @param value Value to add. */
  private storeSetValue(
    key: string,
    state: WritableSignal<ReadonlySet<string>>,
    value: string,
  ): void {
    const next = new Set(state());
    next.add(value);
    state.set(next);
    sessionStorage.setItem(key, JSON.stringify([...next]));
  }
}
