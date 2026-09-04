import { Injectable, OnDestroy, signal } from '@angular/core';

const CLOCK_UPDATE_INTERVAL_MS = 60_000;

@Injectable({
  providedIn: 'root',
})
export class CurrentTimeService implements OnDestroy {
  private readonly currentTimeState = signal(new Date());
  private readonly intervalId = setInterval(
    () => this.currentTimeState.set(new Date()),
    CLOCK_UPDATE_INTERVAL_MS,
  );

  readonly currentTime = this.currentTimeState.asReadonly();

  /** Stops periodic time updates when the service is destroyed. */
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
