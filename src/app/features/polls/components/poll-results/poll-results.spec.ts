import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollResults } from './poll-results';

const options = [{ id: 'option-1', text: 'First', votes: 2 }];

describe('PollResults', () => {
  let component: PollResults;
  let fixture: ComponentFixture<PollResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollResults],
    }).compileComponents();

    fixture = TestBed.createComponent(PollResults);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
