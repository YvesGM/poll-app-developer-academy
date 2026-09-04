import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CurrentTimeService } from '../../../../core/time/current-time';
import { Poll } from '../../models/poll.model';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

@Component({
  imports: [RouterLink],
  selector: 'app-poll-card',
  styleUrl: './poll-card.scss',
  templateUrl: './poll-card.html',
})
export class PollCard {
  private readonly currentTimeService = inject(CurrentTimeService);

  readonly poll = input.required<Poll>();
  readonly highlight = input(false);

  /**
   * Formats the remaining survey lifetime for the deadline badge.
   * @returns Dynamic deadline label for the current minute.
   */
  protected deadlineLabel(): string {
    const deadline = this.poll().deadline;
    if (!deadline) return 'No deadline';
    const remainingMs = deadline.getTime() - this.currentTimeService.currentTime().getTime();
    if (remainingMs <= 0) return 'Ended';
    if (remainingMs >= DAY_MS) return this.formatRemaining(remainingMs, DAY_MS, 'Day');
    if (remainingMs >= HOUR_MS) return this.formatRemaining(remainingMs, HOUR_MS, 'Hour');
    return this.formatRemaining(remainingMs, MINUTE_MS, 'Minute');
  }

  /**
   * Formats one rounded-up remaining-time unit.
   * @param remainingMs Remaining duration in milliseconds.
   * @param unitMs Unit duration in milliseconds.
   * @param unitLabel Singular display label.
   * @returns Human-readable countdown label.
   */
  private formatRemaining(remainingMs: number, unitMs: number, unitLabel: string): string {
    const value = Math.ceil(remainingMs / unitMs);
    const pluralSuffix = value === 1 ? '' : 's';
    return `Ends in ${value} ${unitLabel}${pluralSuffix}`;
  }
}
