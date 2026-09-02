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

  protected totalVotes(): number {
    return this.poll().options.reduce((total, option) => total + option.votes, 0);
  }
}
