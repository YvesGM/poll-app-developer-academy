import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CurrentTimeService } from '../../../../core/time/current-time';
import { AppLogo } from '../../../../shared/components/app-logo/app-logo';
import { PollOption } from '../../components/poll-option/poll-option';
import { PollResults } from '../../components/poll-results/poll-results';
import { PollService } from '../../services/poll';

@Component({
  imports: [AppLogo, DatePipe, RouterLink, PollOption, PollResults],
  selector: 'app-poll-detail',
  styleUrl: './poll-detail.scss',
  templateUrl: './poll-detail.html',
})
export class PollDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly pollService = inject(PollService);
  private readonly currentTimeService = inject(CurrentTimeService);

  protected readonly pollId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly loading = this.pollService.loading;
  protected readonly error = this.pollService.error;
  protected readonly busy = signal(false);

  protected readonly poll = computed(() => this.pollService.getPollById(this.pollId));

  protected readonly isPast = computed(() => {
    const poll = this.poll();
    const referenceDate = this.currentTimeService.currentTime();
    return poll ? this.pollService.isPast(poll, referenceDate) : false;
  });

  protected readonly hasVoted = computed(() => this.pollService.hasVoted(this.pollId));

  /**
   * Submits one option while preventing concurrent or invalid votes.
   * @param optionId Selected option identifier.
   */
  protected async vote(optionId: string): Promise<void> {
    if (this.busy() || this.hasVoted() || this.isPast()) {
      return;
    }

    this.busy.set(true);
    try {
      await this.pollService.vote(this.pollId, optionId);
    } finally {
      this.busy.set(false);
    }
  }
}
