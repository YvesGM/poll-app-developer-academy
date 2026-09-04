import { Injectable, signal } from '@angular/core';

const VOTER_TOKEN_STORAGE_KEY = 'poll-app-voter-token-v1';
const VOTED_POLLS_STORAGE_KEY = 'poll-app-voted-polls-v1';

@Injectable({ providedIn: 'root' })
export class VoterIdentityService {
  private readonly votedKeysState = signal<ReadonlySet<string>>(new Set(this.readVotedKeys()));
  readonly voterToken = this.getOrCreateVoterToken();

  /** Checks whether this browser voted on one question. @param pollId Survey id. @param questionId Question id. @returns Vote state. */
  hasVoted(pollId: string, questionId: string): boolean {
    const keys = this.votedKeysState();
    return keys.has(this.voteKey(pollId, questionId)) || keys.has(pollId);
  }

  /** Checks whether this browser voted for one option. @param pollId Survey id. @param questionId Question id. @param optionId Option id. @returns Vote state. */
  hasVotedOption(pollId: string, questionId: string, optionId: string): boolean {
    return this.votedKeysState().has(this.optionVoteKey(pollId, questionId, optionId));
  }

  /** Persists a single-answer question vote marker. @param pollId Survey id. @param questionId Question id. */
  markVoted(pollId: string, questionId: string): void {
    this.storeVoteKey(this.voteKey(pollId, questionId));
  }

  /** Persists a multiple-answer option vote marker. @param pollId Survey id. @param questionId Question id. @param optionId Option id. */
  markVotedOption(pollId: string, questionId: string, optionId: string): void {
    this.storeVoteKey(this.optionVoteKey(pollId, questionId, optionId));
  }

  /** Returns or creates the voter token. @returns Stable browser token. */
  private getOrCreateVoterToken(): string {
    const existingToken = localStorage.getItem(VOTER_TOKEN_STORAGE_KEY);
    return existingToken || this.createVoterToken();
  }

  /** Creates and stores a voter token. @returns Newly stored token. */
  private createVoterToken(): string {
    const token = crypto.randomUUID();
    localStorage.setItem(VOTER_TOKEN_STORAGE_KEY, token);
    return token;
  }

  /** Reads persisted vote keys. @returns Valid persisted keys. */
  private readVotedKeys(): string[] {
    const rawValue = localStorage.getItem(VOTED_POLLS_STORAGE_KEY);
    if (!rawValue) return [];
    return this.parseVotedKeys(rawValue);
  }

  /** Parses persisted vote keys. @param rawValue Serialized value. @returns Valid keys. */
  private parseVotedKeys(rawValue: string): string[] {
    try {
      return this.filterValidKeys(JSON.parse(rawValue) as unknown);
    } catch {
      return [];
    }
  }

  /** Filters unknown values to strings. @param value Parsed value. @returns String keys. */
  private filterValidKeys(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  }

  /** Builds a question-scoped vote key. @param pollId Survey id. @param questionId Question id. @returns Storage key. */
  private voteKey(pollId: string, questionId: string): string {
    return `${pollId}:${questionId}`;
  }

  /** Builds an option-scoped vote key. @param pollId Survey id. @param questionId Question id. @param optionId Option id. @returns Storage key. */
  private optionVoteKey(pollId: string, questionId: string, optionId: string): string {
    return `${pollId}:${questionId}:${optionId}`;
  }

  /** Stores one vote key and persists the updated set. @param key Vote key to store. */
  private storeVoteKey(key: string): void {
    const next = new Set<string>(this.votedKeysState());
    next.add(key);
    this.votedKeysState.set(next);
    this.persistVotedKeys(next);
  }

  /** Persists all vote keys. @param keys Keys to store. */
  private persistVotedKeys(keys: ReadonlySet<string>): void {
    localStorage.setItem(VOTED_POLLS_STORAGE_KEY, JSON.stringify([...keys]));
  }
}
