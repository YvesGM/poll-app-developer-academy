import { Injectable, signal } from '@angular/core';
import { mapPollRow, mapPollRows } from '../mappers/poll.mapper';
import { subscribeToPollChanges } from './poll-realtime';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/supabase/supabase";
import * as i2 from "../../../core/voter/voter-identity";
import * as i3 from "./poll-repository";
export class PollService {
    supabase;
    voterIdentity;
    repository;
    pollsState = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "pollsState" }] : /* istanbul ignore next */ []));
    loadingState = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loadingState" }] : /* istanbul ignore next */ []));
    errorState = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "errorState" }] : /* istanbul ignore next */ []));
    realtimeChannel;
    polls = this.pollsState.asReadonly();
    loading = this.loadingState.asReadonly();
    error = this.errorState.asReadonly();
    /**
     * Creates the realtime subscription and loads the initial survey state.
     * @param supabase Supabase client provider.
     * @param voterIdentity Browser voter identity provider.
     * @param repository Survey persistence repository.
     */
    constructor(supabase, voterIdentity, repository) {
        this.supabase = supabase;
        this.voterIdentity = voterIdentity;
        this.repository = repository;
        this.realtimeChannel = subscribeToPollChanges(this.supabase.client, () => void this.loadPolls(false));
        void this.loadPolls();
    }
    /** Removes the Supabase realtime channel when the service is destroyed. */
    ngOnDestroy() {
        void this.supabase.client.removeChannel(this.realtimeChannel);
    }
    /**
     * Loads surveys, options, and vote counts from Supabase.
     *
     * @param showLoading Whether the public loading signal should be toggled.
     */
    async loadPolls(showLoading = true) {
        this.beginLoad(showLoading);
        try {
            const snapshot = await this.repository.fetchSnapshot();
            this.storeSnapshot(snapshot);
        }
        catch (error) {
            this.setError(error, 'Failed to load surveys.');
        }
        finally {
            this.setLoading(showLoading, false);
        }
    }
    /**
     * Returns one survey by its identifier.
     * @param id Survey identifier.
     * @returns Matching survey when loaded.
     */
    getPollById(id) {
        return this.polls().find((poll) => poll.id === id);
    }
    /**
     * Checks whether a survey deadline has passed.
     * @param poll Survey to inspect.
     * @param referenceDate Time used for the comparison.
     * @returns Whether the survey is past.
     */
    isPast(poll, referenceDate = new Date()) {
        return poll.deadline !== null && poll.deadline.getTime() <= referenceDate.getTime();
    }
    /**
     * Checks whether a survey is still active.
     * @param poll Survey to inspect.
     * @param referenceDate Time used for the comparison.
     * @returns Whether the survey is active.
     */
    isActive(poll, referenceDate = new Date()) {
        return !this.isPast(poll, referenceDate);
    }
    /**
     * Checks whether the current browser identity has already voted.
     * @param pollId Survey identifier to inspect.
     * @returns Whether the browser already voted.
     */
    hasVoted(pollId) {
        return this.voterIdentity.hasVoted(pollId);
    }
    /**
     * Creates a survey and its answer options.
     *
     * @param input Validated survey input.
     * @returns Created survey or `null` when persistence fails.
     */
    async createPoll(input) {
        this.clearError();
        let pollRow = null;
        try {
            pollRow = await this.repository.insertPoll(input);
            return await this.createAndStorePoll(pollRow, input.options);
        }
        catch (error) {
            return this.handleCreateFailure(error, pollRow?.id);
        }
    }
    /**
     * Persists one vote for a survey option.
     *
     * @param pollId Survey identifier.
     * @param optionId Selected option identifier.
     * @returns Whether the vote was stored successfully.
     */
    async vote(pollId, optionId) {
        this.clearError();
        if (!this.canVote(pollId)) {
            return false;
        }
        const error = await this.repository.insertVote(pollId, optionId, this.voterIdentity.voterToken);
        if (error) {
            return this.handleVoteError(error, pollId);
        }
        await this.completeVote(pollId);
        return true;
    }
    /** Clears the latest public service error. */
    clearError() {
        this.errorState.set(null);
    }
    /**
     * Prepares state for a survey load operation.
     * @param showLoading Whether visible loading state is enabled.
     */
    beginLoad(showLoading) {
        this.setLoading(showLoading, true);
        this.clearError();
    }
    /**
     * Maps and stores a complete persisted survey snapshot.
     * @param snapshot Persisted rows to map and store.
     */
    storeSnapshot(snapshot) {
        const polls = mapPollRows(snapshot.polls, snapshot.options, snapshot.votes);
        this.pollsState.set(polls);
    }
    /**
     * Adds one newly created survey to the local signal state.
     * @param poll Survey to append.
     */
    appendPoll(poll) {
        this.pollsState.update((polls) => [...polls, poll]);
    }
    /**
     * Persists options and stores the newly assembled survey.
     * @param pollRow Persisted parent survey row.
     * @param options Answer texts to persist.
     * @returns Newly assembled survey model.
     */
    async createAndStorePoll(pollRow, options) {
        const optionRows = await this.repository.insertPollOptions(pollRow.id, options);
        const poll = mapPollRow(pollRow, optionRows, new Map());
        this.appendPoll(poll);
        return poll;
    }
    /**
     * Rolls back partial creation and exposes its persistence error.
     * @param error Creation failure to expose.
     * @param pollId Partially created survey identifier.
     * @returns Always `null` for the failed creation.
     */
    async handleCreateFailure(error, pollId) {
        await this.rollbackCreatedPoll(pollId);
        this.setError(error, 'Failed to create survey.');
        return null;
    }
    /**
     * Removes a partially created survey after an option insert failure.
     * @param pollId Partially created survey identifier.
     */
    async rollbackCreatedPoll(pollId) {
        if (!pollId) {
            return;
        }
        await this.repository.deletePartialPoll(pollId);
    }
    /**
     * Checks all local conditions that allow a vote to be submitted.
     * @param pollId Survey identifier to inspect.
     * @returns Whether voting is allowed.
     */
    canVote(pollId) {
        const poll = this.getPollById(pollId);
        return Boolean(poll && !this.isPast(poll) && !this.hasVoted(pollId));
    }
    /**
     * Handles duplicate-vote and general persistence errors.
     * @param error Vote persistence error.
     * @param pollId Survey identifier associated with the vote.
     * @returns Always `false` for the failed vote.
     */
    handleVoteError(error, pollId) {
        if (this.isDuplicateVoteError(error)) {
            this.voterIdentity.markVoted(pollId);
            return false;
        }
        this.setError(error, 'Failed to save vote.');
        return false;
    }
    /**
     * Marks a successful vote locally and refreshes the survey state.
     * @param pollId Survey identifier associated with the vote.
     */
    async completeVote(pollId) {
        this.voterIdentity.markVoted(pollId);
        await this.loadPolls(false);
    }
    /**
     * Checks whether a Supabase error represents a unique constraint violation.
     * @param error Unknown persistence error.
     * @returns Whether the unique constraint code is present.
     */
    isDuplicateVoteError(error) {
        return this.hasErrorCode(error, '23505');
    }
    /**
     * Checks an unknown error object for a specific database error code.
     * @param error Unknown persistence error.
     * @param code Database error code to match.
     * @returns Whether the supplied code is present.
     */
    hasErrorCode(error, code) {
        return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
    }
    /**
     * Stores a readable public error message.
     * @param error Unknown error to translate.
     * @param fallback Message used when no readable error exists.
     */
    setError(error, fallback) {
        this.errorState.set(this.getErrorMessage(error, fallback));
    }
    /**
     * Extracts a readable message from an unknown error value.
     * @param error Unknown error to inspect.
     * @param fallback Message used when extraction fails.
     * @returns Readable error message.
     */
    getErrorMessage(error, fallback) {
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
    setLoading(enabled, value) {
        if (enabled) {
            this.loadingState.set(value);
        }
    }
    static ɵfac = function PollService_Factory(__ngFactoryType__) { /* @ts-ignore */
    return new (__ngFactoryType__ || PollService)(i0.ɵɵinject(i1.SupabaseService), i0.ɵɵinject(i2.VoterIdentityService), i0.ɵɵinject(i3.PollRepository)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PollService, factory: PollService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PollService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], () => [{ type: i1.SupabaseService }, { type: i2.VoterIdentityService }, { type: i3.PollRepository }], null); })();
