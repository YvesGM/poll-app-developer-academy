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
  readonly questionId = input.required<string>();
  readonly selectedOptionIds = input<ReadonlySet<string>>(new Set());

  /**
   * Calculates the total number of votes across all options.
   * @returns Sum of all option votes.
   */
  protected totalVotes(): number {
    return this.options().reduce((total, option) => total + this.effectiveVotes(option), 0);
  }

  /**
   * Calculates a rounded option share including the pending local selection.
   * @param option Option whose share is requested.
   * @returns Rounded percentage of all effective votes.
   */
  protected percentage(option: PollOption): number {
    const totalVotes = this.totalVotes();
    if (totalVotes === 0) return 0;
    return Math.round((this.effectiveVotes(option) / totalVotes) * 100);
  }

  /** Returns the persisted votes plus one pending local selection. @param option Poll option. @returns Effective vote count. */
  private effectiveVotes(option: PollOption): number {
    const selectionKey = `${this.questionId()}:${option.id}`;
    return option.votes + (this.selectedOptionIds().has(selectionKey) ? 1 : 0);
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
