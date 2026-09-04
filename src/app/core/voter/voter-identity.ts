import { Injectable, signal } from '@angular/core';

const VOTER_TOKEN_STORAGE_KEY = 'poll-app-voter-token-v1';
const VOTED_POLLS_STORAGE_KEY = 'poll-app-voted-polls-v1';

@Injectable({
  providedIn: 'root',
})
export class VoterIdentityService {
  private readonly votedPollIdsState = signal<ReadonlySet<string>>(
    new Set(this.readVotedPollIds()),
  );

  readonly voterToken = this.getOrCreateVoterToken();

  /**
   * Checks whether the current browser has already voted in a survey.
   * @param pollId Survey identifier to inspect.
   * @returns Whether the survey is recorded as voted.
   */
  hasVoted(pollId: string): boolean {
    return this.votedPollIdsState().has(pollId);
  }

  /**
   * Persists that the current browser has voted in a survey.
   * @param pollId Survey identifier to record.
   */
  markVoted(pollId: string): void {
    const next = new Set(this.votedPollIdsState());
    next.add(pollId);
    this.votedPollIdsState.set(next);
    this.persistVotedPollIds(next);
  }

  /**
   * Returns the existing voter token or creates and stores a new one.
   * @returns Stable browser voter token.
   */
  private getOrCreateVoterToken(): string {
    const existingToken = localStorage.getItem(VOTER_TOKEN_STORAGE_KEY);
    if (existingToken) {
      return existingToken;
    }
    return this.createVoterToken();
  }

  /**
   * Creates and persists one browser voter token.
   * @returns Newly persisted voter token.
   */
  private createVoterToken(): string {
    const token = crypto.randomUUID();
    localStorage.setItem(VOTER_TOKEN_STORAGE_KEY, token);
    return token;
  }

  /**
   * Reads persisted survey identifiers that this browser already voted in.
   * @returns Persisted survey identifiers.
   */
  private readVotedPollIds(): string[] {
    const rawValue = localStorage.getItem(VOTED_POLLS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }
    return this.parseVotedPollIds(rawValue);
  }

  /**
   * Parses persisted voted survey identifiers safely.
   * @param rawValue Serialized local-storage value.
   * @returns Valid survey identifiers or an empty list for invalid JSON.
   */
  private parseVotedPollIds(rawValue: string): string[] {
    try {
      return this.filterValidPollIds(JSON.parse(rawValue) as unknown);
    } catch {
      return [];
    }
  }

  /**
   * Filters an unknown persisted value to valid survey identifier strings.
   * @param value Parsed local-storage value.
   * @returns String identifiers contained in the value.
   */
  private filterValidPollIds(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.filter((item): item is string => typeof item === 'string');
  }

  /**
   * Persists the complete voted-survey identifier set.
   * @param pollIds Survey identifiers to serialize.
   */
  private persistVotedPollIds(pollIds: ReadonlySet<string>): void {
    localStorage.setItem(VOTED_POLLS_STORAGE_KEY, JSON.stringify([...pollIds]));
  }
}
