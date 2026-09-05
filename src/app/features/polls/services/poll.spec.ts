import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SupabaseService } from '../../../core/supabase/supabase';
import { CurrentTimeService } from '../../../core/time/current-time';
import { VoterIdentityService } from '../../../core/voter/voter-identity';
import { PollService } from './poll';
import { PollRepository } from './poll-repository';

const channel = {
  on: () => channel,
  subscribe: () => channel,
};
const supabaseStub = {
  client: {
    channel: () => channel,
    removeChannel: async () => 'ok',
  },
};
const voterIdentityStub = {
  hasCompletedPoll: () => false,
  hasVotedOption: () => false,
  markCompletedPoll(): void {},
  markVotedOption(): void {},
  voterToken: 'voter-token',
};
const currentTimeStub = {
  currentTime: signal(new Date('2026-09-04T10:00:00Z')).asReadonly(),
};
const repositoryStub = {
  insertVotes: async () => null,
  completeExpiredPolls: async () => 0,
  fetchSnapshot: async () => ({ polls: [], questions: [], options: [], votes: [] }),
};

describe('PollService', () => {
  let service: PollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useValue: supabaseStub },
        { provide: CurrentTimeService, useValue: currentTimeStub },
        { provide: VoterIdentityService, useValue: voterIdentityStub },
        { provide: PollRepository, useValue: repositoryStub },
      ],
    });
    service = TestBed.inject(PollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
