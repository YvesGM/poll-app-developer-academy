import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollCreate } from './poll-create';

describe('PollCreate', () => {
  let component: PollCreate;
  let fixture: ComponentFixture<PollCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(PollCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
