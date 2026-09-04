import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Poll } from '../../models/poll.model';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-poll-card',
  styleUrl: './poll-card.scss',
  templateUrl: './poll-card.html',
})
export class PollCard {
  readonly poll = input.required<Poll>();
  readonly highlight = input(false);

  /**
   * Calculates the total votes displayed on the survey card.
   * @returns Sum of all option votes.
   */
  protected totalVotes(): number {
    return this.poll().options.reduce((total, option) => total + option.votes, 0);
  }
}
