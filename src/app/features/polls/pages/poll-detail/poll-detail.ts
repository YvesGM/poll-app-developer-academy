import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PollOption } from '../../components/poll-option/poll-option';
import { PollResults } from '../../components/poll-results/poll-results';
import { PollService } from '../../services/poll';

@Component({
  imports: [RouterLink, PollOption, PollResults],
  selector: 'app-poll-detail',
  styleUrl: './poll-detail.scss',
  templateUrl: './poll-detail.html',
})
export class PollDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pollService = inject(PollService);

  protected readonly pollId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly loading = this.pollService.loading;
  protected readonly error = this.pollService.error;
  protected readonly busy = signal(false);

  protected readonly poll = computed(() =>
    this.pollService.getPollById(this.pollId),
  );

  protected readonly isPast = computed(() => {
    const poll = this.poll();
    return poll ? this.pollService.isPast(poll) : false;
  });

  protected readonly hasVoted = computed(() =>
    this.pollService.hasVoted(this.pollId),
  );

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

  protected async deletePoll(): Promise<void> {
    const currentPoll = this.poll();

    if (!currentPoll || this.busy()) {
      return;
    }

    const confirmed = window.confirm(
      `Delete survey "${currentPoll.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    this.busy.set(true);
    try {
      if (await this.pollService.deletePoll(this.pollId)) {
        await this.router.navigate(['/']);
      }
    } finally {
      this.busy.set(false);
    }
  }
}
