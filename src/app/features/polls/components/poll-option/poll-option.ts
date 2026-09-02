import { Component, input, output } from '@angular/core';

import { PollOption as PollOptionModel } from '../../models/poll.model';

@Component({
  imports: [],
  selector: 'app-poll-option',
  styleUrl: './poll-option.scss',
  templateUrl: './poll-option.html',
})
export class PollOption {
  readonly option = input.required<PollOptionModel>();
  readonly disabled = input(false);

  readonly voted = output<string>();

  protected vote(): void {
    this.voted.emit(this.option().id);
  }
}