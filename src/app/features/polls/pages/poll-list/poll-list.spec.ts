import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollList } from './poll-list';

describe('PollList', () => {
  let component: PollList;
  let fixture: ComponentFixture<PollList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollList],
    }).compileComponents();

    fixture = TestBed.createComponent(PollList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
