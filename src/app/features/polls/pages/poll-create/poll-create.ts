import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { POLL_CATEGORIES, PollCategory } from '../../models/poll.model';
import { PollService } from '../../services/poll';

const trimmedRequired: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  return value.length > 0 ? null : { trimmedRequired: true };
};

const uniqueOptions: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!(control instanceof FormArray)) {
    return null;
  }

  const normalizedOptions = control.controls
    .map((option) => String(option.value ?? '').trim().toLocaleLowerCase())
    .filter((option) => option.length > 0);

  return new Set(normalizedOptions).size === normalizedOptions.length
    ? null
    : { duplicateOptions: true };
};

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-poll-create',
  styleUrl: './poll-create.scss',
  templateUrl: './poll-create.html',
})
export class PollCreate {
  private readonly formBuilder = inject(FormBuilder);
  private readonly pollService = inject(PollService);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);
  protected readonly error = this.pollService.error;
  protected readonly categories = POLL_CATEGORIES;

  protected readonly form = this.formBuilder.nonNullable.group({
    category: this.formBuilder.nonNullable.control<PollCategory>('Technology', [
      Validators.required,
    ]),
    title: [
      '',
      [trimmedRequired, Validators.minLength(1), Validators.maxLength(120)],
    ],
    question: [
      '',
      [trimmedRequired, Validators.minLength(3), Validators.maxLength(250)],
    ],
    description: ['', [Validators.maxLength(1000)]],
    deadline: [''],
    options: this.formBuilder.nonNullable.array(
      [this.createOptionControl(), this.createOptionControl()],
      [Validators.minLength(2), uniqueOptions],
    ),
  });

  protected get options(): FormArray {
    return this.form.controls.options;
  }

  protected addOption(): void {
    this.options.push(this.createOptionControl());
    this.options.updateValueAndValidity();
  }

  protected removeOption(index: number): void {
    if (this.options.length <= 2) {
      return;
    }

    this.options.removeAt(index);
    this.options.updateValueAndValidity();
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.pollService.clearError();

    try {
      const { category, title, question, description, deadline, options } =
        this.form.getRawValue();

      const poll = await this.pollService.createPoll({
        category,
        title: title.trim(),
        question: question.trim(),
        description: description.trim() || null,
        deadline: deadline ? new Date(deadline) : null,
        options: options.map((option) => option.trim()),
      });

      if (poll) {
        await this.router.navigate(['/polls', poll.id]);
      }
    } finally {
      this.saving.set(false);
    }
  }

  private createOptionControl() {
    return this.formBuilder.nonNullable.control('', [
      trimmedRequired,
      Validators.maxLength(120),
    ]);
  }
}
