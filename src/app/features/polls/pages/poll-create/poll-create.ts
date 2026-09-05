import { AfterViewInit, Component, ElementRef, inject, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CreatePollInput,
  CreatePollQuestionInput,
  POLL_CATEGORIES,
  POLL_CATEGORY_LABELS,
  Poll,
  PollCategory,
} from '../../models/poll.model';
import { PollService } from '../../services/poll';
import {
  MINIMUM_DEADLINE_LEAD_MS,
  minimumFutureDate,
  trimmedRequired,
  uniqueOptions,
} from '../../validators/poll-form.validators';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-poll-create',
  styleUrl: './poll-create.scss',
  templateUrl: './poll-create.html',
})
export class PollCreate implements AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly pollService = inject(PollService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly created = output<Poll>();
  readonly cancelled = output<void>();

  protected readonly saving = signal(false);
  protected readonly validationNotice = signal(false);
  protected readonly error = this.pollService.error;
  protected readonly categories = POLL_CATEGORIES;
  protected readonly minimumDeadline = this.toLocalDateTimeValue(
    new Date(
      Math.floor(Date.now() / 60_000) * 60_000 + MINIMUM_DEADLINE_LEAD_MS,
    ),
  );
  protected readonly categoryMenuOpen = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    category: this.formBuilder.control<PollCategory | null>(null, [Validators.required]),
    title: ['', [trimmedRequired, Validators.minLength(1), Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(1000)]],
    deadline: ['', [minimumFutureDate]],
    questions: this.formBuilder.nonNullable.array([this.createQuestionGroup()]),
  });

  /** Moves keyboard focus into the dialog when the editor is rendered. */
  ngAfterViewInit(): void {
    setTimeout(() => this.focusFirstField());
  }

  /** Handles Escape and traps Tab focus inside the editor dialog. @param event Keyboard event. */
  protected handleEditorKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cancel();
      return;
    }
    if (event.key === 'Tab') this.trapDialogFocus(event);
  }

  /** Returns the question form array. */
  protected get questions() {
    return this.form.controls.questions;
  }

  /** Adds one complete question with two empty answers. */
  protected addQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }

  /** Removes one question or clears the final remaining question. @param questionIndex Question index. */
  protected removeQuestion(questionIndex: number): void {
    if (this.questions.length <= 1) {
      this.questions.setControl(0, this.createQuestionGroup());
      return;
    }
    this.questions.removeAt(questionIndex);
  }

  /** Returns whether a question contains user-entered data. @param questionIndex Question index. @returns Content state. */
  protected questionHasContent(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    if (question.controls.question.value.trim()) return true;
    if (question.controls.allowMultiple.value) return true;
    return question.controls.options.controls.some((option) => Boolean(option.value.trim()));
  }

  /** Returns the alphabetical answer label. @param optionIndex Answer index. @returns Answer label. */
  protected answerLabel(optionIndex: number): string {
    return `${String.fromCharCode(65 + optionIndex)}.`;
  }

  /** Clears the survey name field. */
  protected clearTitle(): void {
    this.form.controls.title.setValue('');
  }

  /** Clears the optional deadline field. */
  protected clearDeadline(): void {
    this.form.controls.deadline.setValue('');
  }

  /** Clears the optional description field. */
  protected clearDescription(): void {
    this.form.controls.description.setValue('');
  }

  /** Opens or closes the category selector. */
  protected toggleCategoryMenu(): void {
    this.categoryMenuOpen.update((open) => !open);
  }

  /** Selects one category and closes the selector. @param category Category value. */
  protected chooseCategory(category: PollCategory): void {
    this.form.controls.category.setValue(category);
    this.form.controls.category.markAsTouched();
    this.categoryMenuOpen.set(false);
  }

  /** Returns the shared display label for a category. @param category Category value. @returns Display label. */
  protected categoryLabel(category: PollCategory): string {
    return POLL_CATEGORY_LABELS[category];
  }

  /** Moves focus through category options with arrow keys. @param event Keyboard event. */
  protected handleCategoryKeydown(event: KeyboardEvent): void {
    if (!this.categoryMenuOpen()) return;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    this.moveCategoryFocus(event);
  }

  /** Adds one empty answer to a question. @param questionIndex Question index. */
  protected addOption(questionIndex: number): void {
    const options = this.questionOptions(questionIndex);
    if (options.length >= 6) return;
    options.push(this.createOptionControl());
    options.updateValueAndValidity();
  }

  /** Removes or clears one answer while preserving two fields. @param questionIndex Question index. @param optionIndex Answer index. */
  protected removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.questionOptions(questionIndex);
    if (options.length <= 2) {
      options.at(optionIndex).reset('');
      return;
    }
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
      this.showValidationNotice();
      this.scheduleFirstInvalidScroll();
      return;
    }
    this.validationNotice.set(false);
    await this.saveSurvey(this.buildCreatePollInput());
  }

  /** Keeps the required-field notice visible until a valid submission. */
  private showValidationNotice(): void {
    this.validationNotice.set(true);
  }

  /** Schedules scrolling after Angular has rendered validation classes. */
  private scheduleFirstInvalidScroll(): void {
    setTimeout(() => this.scrollToFirstInvalidField());
  }

  /** Scrolls the first invalid editor control into view. */
  private scrollToFirstInvalidField(): void {
    const selector =
      'input.ng-invalid, textarea.ng-invalid, .category-select__trigger.is-invalid, fieldset.ng-invalid';
    this.host.nativeElement.querySelector<HTMLElement>(selector)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
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

  /** Focuses the survey-name field when the dialog opens. */
  private focusFirstField(): void {
    this.host.nativeElement.querySelector<HTMLElement>('#title')?.focus();
  }

  /** Keeps Tab navigation inside the editor. @param event Keyboard event. */
  private trapDialogFocus(event: KeyboardEvent): void {
    const elements = this.focusableElements();
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = this.host.nativeElement.ownerDocument.activeElement;
    if (event.shiftKey && active === first) this.wrapFocus(event, last);
    if (!event.shiftKey && active === last) this.wrapFocus(event, first);
  }

  /** Returns currently focusable editor controls. @returns Focusable controls. */
  private focusableElements(): HTMLElement[] {
    const selector = 'button:not([disabled]), input:not([disabled]), textarea:not([disabled])';
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>(selector));
  }

  /** Wraps focus at one edge of the dialog. @param event Keyboard event. @param target Focus target. */
  private wrapFocus(event: KeyboardEvent, target: HTMLElement): void {
    event.preventDefault();
    target.focus();
  }

  /** Focuses the next category option for an arrow-key event. @param event Keyboard event. */
  private moveCategoryFocus(event: KeyboardEvent): void {
    const options = this.categoryOptionButtons(event);
    if (!options.length) return;
    const current = options.indexOf(this.host.nativeElement.ownerDocument.activeElement as HTMLButtonElement);
    options[this.categoryTargetIndex(event.key, current, options.length)]?.focus();
  }

  /** Returns category option buttons from the current selector. @param event Keyboard event. */
  private categoryOptionButtons(event: KeyboardEvent): HTMLButtonElement[] {
    const container = event.currentTarget as HTMLElement;
    return Array.from(container.querySelectorAll<HTMLButtonElement>('.category-select__options button'));
  }

  /** Resolves the requested category option index. @param key Key name. @param current Current index. @param length Option count. */
  private categoryTargetIndex(key: string, current: number, length: number): number {
    if (key === 'Home') return 0;
    if (key === 'End') return length - 1;
    if (key === 'ArrowUp') return current <= 0 ? length - 1 : current - 1;
    return current < 0 || current >= length - 1 ? 0 : current + 1;
  }

  /** Formats a date for a local datetime input. @param date Date to format. @returns Local datetime value. */
  private toLocalDateTimeValue(date: Date): string {
    const offsetMs = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
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
