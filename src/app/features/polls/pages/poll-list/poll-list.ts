import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PollCard } from '../../components/poll-card/poll-card';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll';

@Component({
  selector: 'app-poll-list',
  imports: [RouterLink, PollCard],
  templateUrl: './poll-list.html',
  styleUrl: './poll-list.scss',
})
export class PollList {
  private readonly pollService = inject(PollService);

  protected readonly loading = this.pollService.loading;
  protected readonly error = this.pollService.error;

  protected readonly activePolls = computed(() =>
    this.sortByDeadline(
      this.pollService.polls().filter((poll) => this.pollService.isActive(poll)),
    ),
  );

  protected readonly pastPolls = computed(() =>
    this.sortByDeadline(
      this.pollService.polls().filter((poll) => this.pollService.isPast(poll)),
    ),
  );

  protected reload(): void {
    void this.pollService.loadPolls();
  }

  private sortByDeadline(polls: Poll[]): Poll[] {
    return [...polls].sort((a, b) => {
      if (a.deadline === null && b.deadline === null) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }

      if (a.deadline === null) {
        return 1;
      }

      if (b.deadline === null) {
        return -1;
      }

      return a.deadline.getTime() - b.deadline.getTime();
    });
  }
}
