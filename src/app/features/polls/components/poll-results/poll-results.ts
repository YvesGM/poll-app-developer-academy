import { Component, input } from '@angular/core';

import { PollOption } from '../../models/poll.model';

const FIRST_ANSWER_CODE = 65;

@Component({
  imports: [],
  selector: 'app-poll-results',
  styleUrl: './poll-results.scss',
  templateUrl: './poll-results.html',
})
export class PollResults {
  readonly options = input.required<PollOption[]>();

  /**
   * Calculates the total number of votes across all options.
   * @returns Sum of all option votes.
   */
  protected totalVotes(): number {
    return this.options().reduce((total, option) => total + option.votes, 0);
  }

  /**
   * Calculates a rounded option share of the current vote total.
   * @param votes Vote count for one option.
   * @returns Rounded percentage of all votes.
   */
  protected percentage(votes: number): number {
    const totalVotes = this.totalVotes();

    if (totalVotes === 0) {
      return 0;
    }

    return Math.round((votes / totalVotes) * 100);
  }

  /**
   * Returns the alphabetical presentation label for one answer.
   * @param index Zero-based answer index.
   * @returns Uppercase alphabetical label.
   */
  protected labelFor(index: number): string {
    return String.fromCharCode(FIRST_ANSWER_CODE + index);
  }
}
