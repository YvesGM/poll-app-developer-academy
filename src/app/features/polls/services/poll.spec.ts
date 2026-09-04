import { TestBed } from '@angular/core/testing';
import { SupabaseService } from '../../../core/supabase/supabase';
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
  hasVoted: () => false,
  markVoted(): void {},
  voterToken: 'voter-token',
};
const repositoryStub = {
  fetchSnapshot: async () => ({ polls: [], options: [], votes: [] }),
};

describe('PollService', () => {
  let service: PollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useValue: supabaseStub },
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
