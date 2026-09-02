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

  hasVoted(pollId: string): boolean {
    return this.votedPollIdsState().has(pollId);
  }

  markVoted(pollId: string): void {
    const next = new Set(this.votedPollIdsState());
    next.add(pollId);
    this.votedPollIdsState.set(next);
    localStorage.setItem(VOTED_POLLS_STORAGE_KEY, JSON.stringify([...next]));
  }

  private getOrCreateVoterToken(): string {
    const existingToken = localStorage.getItem(VOTER_TOKEN_STORAGE_KEY);

    if (existingToken) {
      return existingToken;
    }

    const token = crypto.randomUUID();
    localStorage.setItem(VOTER_TOKEN_STORAGE_KEY, token);
    return token;
  }

  private readVotedPollIds(): string[] {
    const rawValue = localStorage.getItem(VOTED_POLLS_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    try {
      const parsedValue: unknown = JSON.parse(rawValue);

      if (!Array.isArray(parsedValue)) {
        return [];
      }

      return parsedValue.filter(
        (value): value is string => typeof value === 'string',
      );
    } catch {
      return [];
    }
  }
}
