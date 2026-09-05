import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { CurrentTimeService } from '../../../../core/time/current-time';
import { PollService } from '../../services/poll';
import { PollDetail } from './poll-detail';

const pollServiceStub = {
  hasCompletedPoll: () => false,
  hasVotedOption: () => false,
  error: signal<string | null>(null).asReadonly(),
  getPollById: () => undefined,
  isPast: () => false,
  loading: signal(false).asReadonly(),
  submitVotes: async () => true,
};

const currentTimeStub = {
  currentTime: signal(new Date('2026-09-04T10:00:00Z')).asReadonly(),
};

describe('PollDetail', () => {
  let component: PollDetail;
  let fixture: ComponentFixture<PollDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollDetail],
      providers: [
        provideRouter([]),
        { provide: PollService, useValue: pollServiceStub },
        { provide: CurrentTimeService, useValue: currentTimeStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PollDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
