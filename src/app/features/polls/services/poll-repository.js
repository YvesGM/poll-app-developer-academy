import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/supabase/supabase";
export class PollRepository {
    supabase;
    /**
     * Creates a repository backed by the configured Supabase client.
     * @param supabase Supabase client provider used for persistence.
     */
    constructor(supabase) {
        this.supabase = supabase;
    }
    /**
     * Loads all persisted rows required to assemble the survey state.
     * @returns Complete persisted survey snapshot.
     */
    async fetchSnapshot() {
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
    async insertPoll(input) {
        const result = await this.supabase.client
            .from('polls')
            .insert(this.buildPollInsert(input))
            .select('id, category, title, question, description, deadline, created_at')
            .single();
        if (result.error || !result.data)
            throw result.error ?? new Error('Survey insert failed.');
        return result.data;
    }
    /**
     * Inserts every answer option belonging to a new survey.
     * @param pollId Parent survey identifier.
     * @param options Answer texts to persist.
     * @returns Persisted option rows.
     */
    async insertPollOptions(pollId, options) {
        const result = await this.supabase.client
            .from('poll_options')
            .insert(options.map((text) => ({ poll_id: pollId, text })))
            .select('id, poll_id, text');
        if (result.error || !result.data)
            throw result.error ?? new Error('Option insert failed.');
        return result.data;
    }
    /**
     * Inserts one browser vote.
     * @param pollId Survey identifier.
     * @param optionId Selected option identifier.
     * @param voterToken Stable browser voter token.
     * @returns Persistence error when the insert fails.
     */
    async insertVote(pollId, optionId, voterToken) {
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
    async deletePartialPoll(pollId) {
        await this.supabase.client.from('polls').delete().eq('id', pollId);
    }
    /**
     * Fetches survey rows ordered by their deadline.
     * @returns Persisted survey rows.
     */
    async fetchPollRows() {
        const result = await this.supabase.client
            .from('polls')
            .select('id, category, title, question, description, deadline, created_at')
            .order('deadline', { ascending: true, nullsFirst: false });
        if (result.error)
            throw result.error;
        return (result.data ?? []);
    }
    /**
     * Fetches all persisted answer option rows.
     * @returns Persisted option rows.
     */
    async fetchOptionRows() {
        const result = await this.supabase.client.from('poll_options').select('id, poll_id, text');
        if (result.error)
            throw result.error;
        return (result.data ?? []);
    }
    /**
     * Fetches vote rows used to calculate option totals.
     * @returns Persisted vote rows.
     */
    async fetchVoteRows() {
        const result = await this.supabase.client.from('votes').select('option_id');
        if (result.error)
            throw result.error;
        return (result.data ?? []);
    }
    /**
     * Builds the database payload for one survey insert.
     * @param input Validated survey creation input.
     * @returns Database insert payload.
     */
    buildPollInsert(input) {
        return {
            category: input.category,
            title: input.title,
            question: input.question,
            description: input.description,
            deadline: input.deadline?.toISOString() ?? null,
        };
    }
    static ɵfac = function PollRepository_Factory(__ngFactoryType__) { /* @ts-ignore */
    return new (__ngFactoryType__ || PollRepository)(i0.ɵɵinject(i1.SupabaseService)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PollRepository, factory: PollRepository.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PollRepository, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], () => [{ type: i1.SupabaseService }], null); })();
