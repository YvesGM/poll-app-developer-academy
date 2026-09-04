import { Component, inject, output, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CreatePollInput, POLL_CATEGORIES, Poll, PollCategory } from '../../models/poll.model';
import { PollService } from '../../services/poll';
import { trimmedRequired, uniqueOptions } from '../../validators/poll-form.validators';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-poll-create',
  styleUrl: './poll-create.scss',
  templateUrl: './poll-create.html',
})
export class PollCreate {
  private readonly formBuilder = inject(FormBuilder);
  private readonly pollService = inject(PollService);

  readonly created = output<Poll>();
  readonly cancelled = output<void>();

  protected readonly saving = signal(false);
  protected readonly error = this.pollService.error;
  protected readonly categories = POLL_CATEGORIES;

  protected readonly form = this.formBuilder.nonNullable.group({
    category: this.formBuilder.nonNullable.control<PollCategory>('Technology', [
      Validators.required,
    ]),
    title: ['', [trimmedRequired, Validators.minLength(1), Validators.maxLength(120)]],
    question: ['', [trimmedRequired, Validators.minLength(3), Validators.maxLength(250)]],
    description: ['', [Validators.maxLength(1000)]],
    deadline: [''],
    options: this.formBuilder.nonNullable.array(
      [this.createOptionControl(), this.createOptionControl()],
      [Validators.minLength(2), uniqueOptions],
    ),
  });

  /**
   * Returns the answer option form array.
   * @returns Mutable option controls.
   */
  protected get options(): FormArray {
    return this.form.controls.options;
  }

  /** Adds one empty answer option to the form. */
  protected addOption(): void {
    this.options.push(this.createOptionControl());
    this.options.updateValueAndValidity();
  }

  /**
   * Removes one answer option while preserving the minimum of two.
   * @param index Index of the option control to remove.
   */
  protected removeOption(index: number): void {
    if (this.options.length <= 2) {
      return;
    }
    this.options.removeAt(index);
    this.options.updateValueAndValidity();
  }

  /** Cancels survey creation when no save request is running. */
  protected cancel(): void {
    if (this.saving()) {
      return;
    }
    this.pollService.clearError();
    this.cancelled.emit();
  }

  /** Validates and persists the current survey form. */
  protected async submit(): Promise<void> {
    if (!this.canSubmit()) {
      this.form.markAllAsTouched();
      return;
    }
    await this.saveSurvey(this.buildCreatePollInput());
  }

  /**
   * Checks whether the form can be submitted.
   * @returns Whether the form is valid and idle.
   */
  private canSubmit(): boolean {
    return this.form.valid && !this.saving();
  }

  /**
   * Builds normalized survey input from the current form value.
   * @returns Normalized survey creation input.
   */
  private buildCreatePollInput(): CreatePollInput {
    const value = this.form.getRawValue();
    return {
      category: value.category,
      title: value.title.trim(),
      question: value.question.trim(),
      description: value.description.trim() || null,
      deadline: value.deadline ? new Date(value.deadline) : null,
      options: value.options.map((option) => option.trim()),
    };
  }

  /**
   * Persists one survey and emits the result to the parent component.
   * @param input Normalized survey creation input.
   */
  private async saveSurvey(input: CreatePollInput): Promise<void> {
    this.saving.set(true);
    this.pollService.clearError();
    try {
      const poll = await this.pollService.createPoll(input);
      if (poll) this.created.emit(poll);
    } finally {
      this.saving.set(false);
    }
  }

  /**
   * Creates one validated answer option control.
   * @returns Non-nullable option control.
   */
  private createOptionControl(): FormControl<string> {
    return this.formBuilder.nonNullable.control('', [trimmedRequired, Validators.maxLength(120)]);
  }
}
