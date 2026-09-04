import { Injectable } from '@angular/core';

import { SupabaseService } from '../../../core/supabase/supabase';
import {
  PollOptionRow,
  PollQuestionRow,
  PollRow,
  VoteRow,
} from '../mappers/poll.mapper';
import { CreatePollInput, CreatePollQuestionInput } from '../models/poll.model';

export interface PollDataSnapshot {
  polls: PollRow[];
  questions: PollQuestionRow[];
  options: PollOptionRow[];
  votes: VoteRow[];
}

@Injectable({ providedIn: 'root' })
export class PollRepository {
  /** Creates a Supabase-backed repository. @param supabase Supabase provider. */
  constructor(private readonly supabase: SupabaseService) {}

  /** Loads all persisted survey rows. @returns Complete survey snapshot. */
  async fetchSnapshot(): Promise<PollDataSnapshot> {
    const [polls, questions, options, votes] = await Promise.all([
      this.fetchPollRows(),
      this.fetchQuestionRows(),
      this.fetchOptionRows(),
      this.fetchVoteRows(),
    ]);
    return { polls, questions, options, votes };
  }

  /** Inserts one survey record. @param input Validated survey input. @returns Persisted survey row. */
  async insertPoll(input: CreatePollInput): Promise<PollRow> {
    const result = await this.supabase.client
      .from('polls')
      .insert(this.buildPollInsert(input))
      .select('id, category, title, question, description, deadline, created_at')
      .single();
    if (result.error || !result.data) throw result.error ?? new Error('Survey insert failed.');
    return result.data as PollRow;
  }

  /** Inserts survey questions. @param pollId Survey id. @param questions Question inputs. @returns Persisted question rows. */
  async insertPollQuestions(
    pollId: string,
    questions: CreatePollQuestionInput[],
  ): Promise<PollQuestionRow[]> {
    const payload = questions.map((item, index) => ({
      poll_id: pollId,
      text: item.question,
      position: index,
      allow_multiple: item.allowMultiple,
    }));
    const result = await this.supabase.client
      .from('poll_questions')
      .insert(payload)
      .select('id, poll_id, text, position, allow_multiple');
    if (result.error || !result.data) throw result.error ?? new Error('Question insert failed.');
    return result.data as PollQuestionRow[];
  }

  /** Inserts all answer options. @param pollId Survey id. @param questions Input questions. @param rows Persisted questions. @returns Persisted options. */
  async insertPollOptions(
    pollId: string,
    questions: CreatePollQuestionInput[],
    rows: PollQuestionRow[],
  ): Promise<PollOptionRow[]> {
    const payload = this.buildOptionInsert(pollId, questions, rows);
    const result = await this.supabase.client.from('poll_options').insert(payload).select('id, poll_id, question_id, text');
    if (result.error || !result.data) throw result.error ?? new Error('Option insert failed.');
    return result.data as PollOptionRow[];
  }

  /** Inserts one browser vote. @param pollId Survey id. @param questionId Question id. @param optionId Option id. @param voterToken Browser token. @returns Persistence error. */
  async insertVote(
    pollId: string,
    questionId: string,
    optionId: string,
    voterToken: string,
  ): Promise<unknown> {
    const { error } = await this.supabase.client.from('votes').insert({
      poll_id: pollId,
      question_id: questionId,
      option_id: optionId,
      voter_token: voterToken,
    });
    return error;
  }

  /** Deletes a partially created survey. @param pollId Survey id. */
  async deletePartialPoll(pollId: string): Promise<void> {
    await this.supabase.client.from('polls').delete().eq('id', pollId);
  }

  /** Fetches survey rows. @returns Persisted survey rows. */
  private async fetchPollRows(): Promise<PollRow[]> {
    const result = await this.supabase.client
      .from('polls')
      .select('id, category, title, question, description, deadline, created_at')
      .order('deadline', { ascending: true, nullsFirst: false });
    if (result.error) throw result.error;
    return (result.data ?? []) as PollRow[];
  }

  /** Fetches question rows. @returns Persisted question rows. */
  private async fetchQuestionRows(): Promise<PollQuestionRow[]> {
    const result = await this.supabase.client
      .from('poll_questions')
      .select('id, poll_id, text, position, allow_multiple')
      .order('position');
    if (result.error) throw result.error;
    return (result.data ?? []) as PollQuestionRow[];
  }

  /** Fetches answer rows. @returns Persisted answer rows. */
  private async fetchOptionRows(): Promise<PollOptionRow[]> {
    const result = await this.supabase.client.from('poll_options').select('id, poll_id, question_id, text');
    if (result.error) throw result.error;
    return (result.data ?? []) as PollOptionRow[];
  }

  /** Fetches vote rows. @returns Persisted vote rows. */
  private async fetchVoteRows(): Promise<VoteRow[]> {
    const result = await this.supabase.client.from('votes').select('option_id');
    if (result.error) throw result.error;
    return (result.data ?? []) as VoteRow[];
  }

  /** Builds the survey insert payload. @param input Survey input. @returns Poll insert payload. */
  private buildPollInsert(input: CreatePollInput): Omit<PollRow, 'id' | 'created_at'> {
    return {
      category: input.category,
      title: input.title,
      question: input.questions[0].question,
      description: input.description,
      deadline: input.deadline?.toISOString() ?? null,
    };
  }

  /** Builds flattened answer inserts. @param pollId Survey id. @param questions Inputs. @param rows Persisted questions. @returns Option payload. */
  private buildOptionInsert(
    pollId: string,
    questions: CreatePollQuestionInput[],
    rows: PollQuestionRow[],
  ): Array<{ poll_id: string; question_id: string; text: string }> {
    return rows.flatMap((row, index) =>
      questions[index].options.map((text) => ({ poll_id: pollId, question_id: row.id, text })),
    );
  }
}
