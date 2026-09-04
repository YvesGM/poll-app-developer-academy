import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Poll } from '../../models/poll.model';
import { PollCard } from './poll-card';

const poll: Poll = {
  id: 'poll-1',
  category: 'Technology',
  title: 'Test survey',
  question: 'Which option?',
  description: null,
  deadline: null,
  createdAt: new Date('2026-09-01T10:00:00Z'),
  options: [{ id: 'option-1', text: 'First', votes: 2 }],
};

describe('PollCard', () => {
  let component: PollCard;
  let fixture: ComponentFixture<PollCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PollCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('poll', poll);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
