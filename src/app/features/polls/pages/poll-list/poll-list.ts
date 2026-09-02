import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PollCard } from '../../components/poll-card/poll-card';
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

  protected readonly openPolls = computed(() =>
    this.sortNewestFirst(this.pollService.polls().filter((poll) => !poll.closed)),
  );

  protected readonly closedPolls = computed(() =>
    this.sortNewestFirst(this.pollService.polls().filter((poll) => poll.closed)),
  );

  protected reload(): void {
    void this.pollService.loadPolls();
  }

  private sortNewestFirst<T extends { createdAt: Date }>(polls: T[]): T[] {
    return [...polls].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
}
