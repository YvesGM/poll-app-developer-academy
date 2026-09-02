import { Component, input } from '@angular/core';

import { PollOption } from '../../models/poll.model';

@Component({
  imports: [],
  selector: 'app-poll-results',
  styleUrl: './poll-results.scss',
  templateUrl: './poll-results.html',
})
export class PollResults {
  readonly options = input.required<PollOption[]>();

  protected totalVotes(): number {
    return this.options().reduce(
      (total, option) => total + option.votes,
      0,
    );
  }

  protected percentage(votes: number): number {
    const totalVotes = this.totalVotes();

    if (totalVotes === 0) {
      return 0;
    }

    return Math.round((votes / totalVotes) * 100);
  }
}
