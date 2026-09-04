import { Injectable } from '@angular/core';

import { SupabaseService } from '../../../core/supabase/supabase';
import { PollOptionRow, PollRow, VoteRow } from '../mappers/poll.mapper';
import { CreatePollInput } from '../models/poll.model';

export interface PollDataSnapshot {
  polls: PollRow[];
  options: PollOptionRow[];
  votes: VoteRow[];
}

@Injectable({
  providedIn: 'root',
})
export class PollRepository {
  /**
   * Creates a repository backed by the configured Supabase client.
   * @param supabase Supabase client provider used for persistence.
   */
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Loads all persisted rows required to assemble the survey state.
   * @returns Complete persisted survey snapshot.
   */
  async fetchSnapshot(): Promise<PollDataSnapshot> {
    const [polls, options, votes] = await Promise.all([
      this.fetchPollRows(),
      this.fetchOptionRows(),
      this.fetchVoteRows(),
    ]);
    return { polls, options, votes };
  }

  /**
   * Inserts one survey record.
   * @param input Validated survey creation input.
   * @returns Persisted survey row.
   */
  async insertPoll(input: CreatePollInput): Promise<PollRow> {
    const result = await this.supabase.client
      .from('polls')
      .insert(this.buildPollInsert(input))
      .select('id, category, title, question, description, deadline, created_at')
      .single();
    if (result.error || !result.data) throw result.error ?? new Error('Survey insert failed.');
    return result.data as PollRow;
  }

  /**
   * Inserts every answer option belonging to a new survey.
   * @param pollId Parent survey identifier.
   * @param options Answer texts to persist.
   * @returns Persisted option rows.
   */
  async insertPollOptions(pollId: string, options: string[]): Promise<PollOptionRow[]> {
    const result = await this.supabase.client
      .from('poll_options')
      .insert(options.map((text) => ({ poll_id: pollId, text })))
      .select('id, poll_id, text');
    if (result.error || !result.data) throw result.error ?? new Error('Option insert failed.');
    return result.data as PollOptionRow[];
  }

  /**
   * Inserts one browser vote.
   * @param pollId Survey identifier.
   * @param optionId Selected option identifier.
   * @param voterToken Stable browser voter token.
   * @returns Persistence error when the insert fails.
   */
  async insertVote(pollId: string, optionId: string, voterToken: string): Promise<unknown> {
    const { error } = await this.supabase.client.from('votes').insert({
      poll_id: pollId,
      option_id: optionId,
      voter_token: voterToken,
    });
    return error;
  }

  /**
   * Deletes a partially created survey after option persistence fails.
   * @param pollId Partially created survey identifier.
   */
  async deletePartialPoll(pollId: string): Promise<void> {
    await this.supabase.client.from('polls').delete().eq('id', pollId);
  }

  /**
   * Fetches survey rows ordered by their deadline.
   * @returns Persisted survey rows.
   */
  private async fetchPollRows(): Promise<PollRow[]> {
    const result = await this.supabase.client
      .from('polls')
      .select('id, category, title, question, description, deadline, created_at')
      .order('deadline', { ascending: true, nullsFirst: false });
    if (result.error) throw result.error;
    return (result.data ?? []) as PollRow[];
  }

  /**
   * Fetches all persisted answer option rows.
   * @returns Persisted option rows.
   */
  private async fetchOptionRows(): Promise<PollOptionRow[]> {
    const result = await this.supabase.client.from('poll_options').select('id, poll_id, text');
    if (result.error) throw result.error;
    return (result.data ?? []) as PollOptionRow[];
  }

  /**
   * Fetches vote rows used to calculate option totals.
   * @returns Persisted vote rows.
   */
  private async fetchVoteRows(): Promise<VoteRow[]> {
    const result = await this.supabase.client.from('votes').select('option_id');
    if (result.error) throw result.error;
    return (result.data ?? []) as VoteRow[];
  }

  /**
   * Builds the database payload for one survey insert.
   * @param input Validated survey creation input.
   * @returns Database insert payload.
   */
  private buildPollInsert(input: CreatePollInput): Omit<PollRow, 'id' | 'created_at'> {
    return {
      category: input.category,
      title: input.title,
      question: input.question,
      description: input.description,
      deadline: input.deadline?.toISOString() ?? null,
    };
  }
}
