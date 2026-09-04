import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should provide the application router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(
      fixture.debugElement.query((node) => node.componentInstance instanceof RouterOutlet),
    ).toBeTruthy();
  });
});
