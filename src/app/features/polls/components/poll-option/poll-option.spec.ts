import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollOption } from './poll-option';

describe('PollOption', () => {
  let component: PollOption;
  let fixture: ComponentFixture<PollOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollOption],
    }).compileComponents();

    fixture = TestBed.createComponent(PollOption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
