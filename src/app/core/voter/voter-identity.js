import { Injectable, signal } from '@angular/core';
import * as i0 from "@angular/core";
const VOTER_TOKEN_STORAGE_KEY = 'poll-app-voter-token-v1';
const VOTED_POLLS_STORAGE_KEY = 'poll-app-voted-polls-v1';
export class VoterIdentityService {
    votedPollIdsState = signal(new Set(this.readVotedPollIds()), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "votedPollIdsState" }] : /* istanbul ignore next */ []));
    voterToken = this.getOrCreateVoterToken();
    /**
     * Checks whether the current browser has already voted in a survey.
     * @param pollId Survey identifier to inspect.
     * @returns Whether the survey is recorded as voted.
     */
    hasVoted(pollId) {
        return this.votedPollIdsState().has(pollId);
    }
    /**
     * Persists that the current browser has voted in a survey.
     * @param pollId Survey identifier to record.
     */
    markVoted(pollId) {
        const next = new Set(this.votedPollIdsState());
        next.add(pollId);
        this.votedPollIdsState.set(next);
        this.persistVotedPollIds(next);
    }
    /**
     * Returns the existing voter token or creates and stores a new one.
     * @returns Stable browser voter token.
     */
    getOrCreateVoterToken() {
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
    createVoterToken() {
        const token = crypto.randomUUID();
        localStorage.setItem(VOTER_TOKEN_STORAGE_KEY, token);
        return token;
    }
    /**
     * Reads persisted survey identifiers that this browser already voted in.
     * @returns Persisted survey identifiers.
     */
    readVotedPollIds() {
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
    parseVotedPollIds(rawValue) {
        try {
            return this.filterValidPollIds(JSON.parse(rawValue));
        }
        catch {
            return [];
        }
    }
    /**
     * Filters an unknown persisted value to valid survey identifier strings.
     * @param value Parsed local-storage value.
     * @returns String identifiers contained in the value.
     */
    filterValidPollIds(value) {
        if (!Array.isArray(value)) {
            return [];
        }
        return value.filter((item) => typeof item === 'string');
    }
    /**
     * Persists the complete voted-survey identifier set.
     * @param pollIds Survey identifiers to serialize.
     */
    persistVotedPollIds(pollIds) {
        localStorage.setItem(VOTED_POLLS_STORAGE_KEY, JSON.stringify([...pollIds]));
    }
    static ɵfac = function VoterIdentityService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || VoterIdentityService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: VoterIdentityService, factory: VoterIdentityService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(VoterIdentityService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], null, null); })();
