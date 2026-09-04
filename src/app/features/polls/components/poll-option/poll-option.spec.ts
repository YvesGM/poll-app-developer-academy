import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollOption } from './poll-option';

const option = { id: 'option-1', text: 'First', votes: 2 };

describe('PollOption', () => {
  let component: PollOption;
  let fixture: ComponentFixture<PollOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollOption],
    }).compileComponents();

    fixture = TestBed.createComponent(PollOption);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('option', option);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
