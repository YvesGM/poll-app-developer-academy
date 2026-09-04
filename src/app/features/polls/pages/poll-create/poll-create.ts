import { Component, inject, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CreatePollInput,
  CreatePollQuestionInput,
  POLL_CATEGORIES,
  Poll,
  PollCategory,
} from '../../models/poll.model';
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
    category: this.formBuilder.control<PollCategory | null>(null, [Validators.required]),
    title: ['', [trimmedRequired, Validators.minLength(1), Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(1000)]],
    deadline: [''],
    questions: this.formBuilder.nonNullable.array([this.createQuestionGroup()]),
  });

  /** Returns the question form array. */
  protected get questions() {
    return this.form.controls.questions;
  }

  /** Adds one complete question with two empty answers. */
  protected addQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }

  /** Clears the survey name field. */
  protected clearTitle(): void {
    this.form.controls.title.reset('');
  }

  /** Clears the optional deadline field. */
  protected clearDeadline(): void {
    this.form.controls.deadline.reset('');
  }

  /** Adds one empty answer to a question. @param questionIndex Question index. */
  protected addOption(questionIndex: number): void {
    const options = this.questionOptions(questionIndex);
    options.push(this.createOptionControl());
    options.updateValueAndValidity();
  }

  /** Removes one answer while preserving two. @param questionIndex Question index. @param optionIndex Answer index. */
  protected removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.questionOptions(questionIndex);
    if (options.length <= 2) return;
    options.removeAt(optionIndex);
    options.updateValueAndValidity();
  }

  /** Cancels survey creation when no save request is running. */
  protected cancel(): void {
    if (this.saving()) return;
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

  /** Returns answer controls for one question. @param questionIndex Question index. */
  protected questionOptions(questionIndex: number): FormArray<FormControl<string>> {
    return this.questions.at(questionIndex).controls.options;
  }

  /** Checks whether the form can be submitted. @returns Whether the form is valid and idle. */
  private canSubmit(): boolean {
    return this.form.valid && !this.saving();
  }

  /** Builds normalized survey input. @returns Normalized survey creation input. */
  private buildCreatePollInput(): CreatePollInput {
    const value = this.form.getRawValue();
    if (value.category === null) throw new Error('Category is required.');
    return {
      category: value.category,
      title: value.title.trim(),
      description: value.description.trim() || null,
      deadline: value.deadline ? new Date(value.deadline) : null,
      questions: value.questions.map((question) => this.normalizeQuestion(question)),
    };
  }

  /** Normalizes one question form value. @param value Raw question value. @returns Normalized question input. */
  private normalizeQuestion(value: CreatePollQuestionInput): CreatePollQuestionInput {
    return {
      question: value.question.trim(),
      allowMultiple: value.allowMultiple,
      options: value.options.map((option) => option.trim()),
    };
  }

  /** Persists one survey and emits it. @param input Normalized survey input. */
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

  /** Creates one validated question group. @returns New question form group. */
  private createQuestionGroup() {
    return this.formBuilder.nonNullable.group({
      question: ['', [trimmedRequired, Validators.minLength(3), Validators.maxLength(250)]],
      allowMultiple: false,
      options: this.formBuilder.nonNullable.array(
        [this.createOptionControl(), this.createOptionControl()],
        [Validators.minLength(2), uniqueOptions],
      ),
    });
  }

  /** Creates one validated answer control. @returns Non-nullable answer control. */
  private createOptionControl(): FormControl<string> {
    return this.formBuilder.nonNullable.control('', [trimmedRequired, Validators.maxLength(120)]);
  }
}
