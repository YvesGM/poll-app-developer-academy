import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { CurrentTimeService } from '../../../../core/time/current-time';
import { PollService } from '../../services/poll';
import { PollList } from './poll-list';

const pollServiceStub = {
  clearError(): void {},
  error: signal<string | null>(null).asReadonly(),
  isActive: () => true,
  isPast: () => false,
  loadPolls: async () => undefined,
  loading: signal(false).asReadonly(),
  polls: signal([]).asReadonly(),
};

const currentTimeStub = {
  currentTime: signal(new Date('2026-09-04T10:00:00Z')).asReadonly(),
};

describe('PollList', () => {
  let component: PollList;
  let fixture: ComponentFixture<PollList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollList],
      providers: [
        provideRouter([]),
        { provide: PollService, useValue: pollServiceStub },
        { provide: CurrentTimeService, useValue: currentTimeStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PollList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
