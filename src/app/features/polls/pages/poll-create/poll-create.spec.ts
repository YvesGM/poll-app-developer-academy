import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { PollService } from '../../services/poll';
import { PollCreate } from './poll-create';

const pollServiceStub = {
  clearError(): void {},
  createPoll: async () => null,
  error: signal<string | null>(null).asReadonly(),
};

describe('PollCreate', () => {
  let component: PollCreate;
  let fixture: ComponentFixture<PollCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollCreate],
      providers: [{ provide: PollService, useValue: pollServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(PollCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
