import { Injectable, OnDestroy, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';

import { SupabaseService } from '../../../core/supabase/supabase';
import { VoterIdentityService } from '../../../core/voter/voter-identity';
import { Poll } from '../models/poll.model';

type PollRow = {
  id: string;
  question: string;
  closed: boolean;
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
          .select('id, question, closed, created_at')
          .order('created_at', { ascending: false }),
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
          question: poll.question,
          closed: poll.closed,
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
      this.errorState.set(this.getErrorMessage(error, 'Failed to load polls.'));
    } finally {
      if (showLoading) {
        this.loadingState.set(false);
      }
    }
  }

  getPollById(id: string): Poll | undefined {
    return this.polls().find((poll) => poll.id === id);
  }

  hasVoted(pollId: string): boolean {
    return this.voterIdentity.hasVoted(pollId);
  }

  async createPoll(question: string, optionTexts: string[]): Promise<Poll | null> {
    this.errorState.set(null);

    const { data: pollRow, error: pollError } = await this.supabase.client
      .from('polls')
      .insert({ question })
      .select('id, question, closed, created_at')
      .single();

    if (pollError || !pollRow) {
      this.errorState.set(
        this.getErrorMessage(pollError, 'Failed to create poll.'),
      );
      return null;
    }

    const { data: optionRows, error: optionError } = await this.supabase.client
      .from('poll_options')
      .insert(
        optionTexts.map((text) => ({
          poll_id: pollRow.id,
          text,
        })),
      )
      .select('id, poll_id, text');

    if (optionError || !optionRows) {
      await this.supabase.client.from('polls').delete().eq('id', pollRow.id);
      this.errorState.set(
        this.getErrorMessage(optionError, 'Failed to create poll options.'),
      );
      return null;
    }

    const poll: Poll = {
      id: pollRow.id,
      question: pollRow.question,
      createdAt: new Date(pollRow.created_at),
      closed: pollRow.closed,
      options: optionRows.map((option) => ({
        id: option.id,
        text: option.text,
        votes: 0,
      })),
    };

    this.pollsState.update((polls) => [poll, ...polls]);
    return poll;
  }

  async vote(pollId: string, optionId: string): Promise<boolean> {
    this.errorState.set(null);

    const currentPoll = this.getPollById(pollId);

    if (!currentPoll || currentPoll.closed || this.hasVoted(pollId)) {
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

  async closePoll(pollId: string): Promise<boolean> {
    this.errorState.set(null);

    const { error } = await this.supabase.client
      .from('polls')
      .update({ closed: true })
      .eq('id', pollId);

    if (error) {
      this.errorState.set(this.getErrorMessage(error, 'Failed to close poll.'));
      return false;
    }

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
      this.errorState.set(this.getErrorMessage(error, 'Failed to delete poll.'));
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
