import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CurrentTimeService } from '../../../../core/time/current-time';
import { AppLogo } from '../../../../shared/components/app-logo/app-logo';
import { PollOption } from '../../components/poll-option/poll-option';
import { POLL_CATEGORY_LABELS } from '../../models/poll.model';
import { PollResults } from '../../components/poll-results/poll-results';
import { PollCreate } from '../poll-create/poll-create';
import { PollService } from '../../services/poll';

@Component({
  imports: [AppLogo, DatePipe, RouterLink, PollOption, PollResults, PollCreate],
  selector: 'app-poll-detail',
  styleUrl: './poll-detail.scss',
  templateUrl: './poll-detail.html',
})
export class PollDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pollService = inject(PollService);
  private readonly currentTimeService = inject(CurrentTimeService);

  protected readonly pollId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly loading = this.pollService.loading;
  protected readonly error = this.pollService.error;
  protected readonly busy = signal(false);
  protected readonly createModalOpen = signal(false);
  protected readonly resultsOpen = signal(true);
  protected readonly selectedOptions = signal<ReadonlySet<string>>(new Set());
  protected readonly poll = computed(() => this.pollService.getPollById(this.pollId));
  protected readonly categoryLabels = POLL_CATEGORY_LABELS;

  protected readonly isPast = computed(() => {
    const poll = this.poll();
    const referenceDate = this.currentTimeService.currentTime();
    return poll ? this.pollService.isPast(poll, referenceDate) : false;
  });

  /** Completes the current survey and returns to the overview. */
  protected async completeSurvey(): Promise<void> {
    if (this.isPast() || this.busy()) return;
    this.busy.set(true);
    const completed = await this.pollService.completePoll(this.pollId);
    this.busy.set(false);
    if (completed) void this.router.navigate(['/']);
  }

  /** Toggles the mobile results section. */
  protected toggleResults(): void {
    this.resultsOpen.update((open) => !open);
  }

  /** Opens the existing create-survey editor over the detail view. */
  protected openCreateModal(): void {
    this.pollService.clearError();
    this.createModalOpen.set(true);
  }

  /** Closes the editor and returns to the survey overview. */
  protected closeCreateModal(): void {
    this.createModalOpen.set(false);
    void this.router.navigate(['/']);
  }

  /** Returns to the overview after a survey was created. */
  protected surveyCreated(): void {
    this.createModalOpen.set(false);
    void this.router.navigate(['/']);
  }

  /** Returns whether this browser already voted on a question. @param questionId Question id. @returns Vote state. */
  protected hasVoted(questionId: string): boolean {
    return this.pollService.hasVoted(this.pollId, questionId);
  }

  /** Returns whether one answer is selected locally or persisted for this browser. */
  protected isOptionSelected(questionId: string, optionId: string): boolean {
    return this.selectedOptions().has(this.selectionKey(questionId, optionId))
      || this.pollService.hasVotedOption(this.pollId, questionId, optionId);
  }

  /** Returns whether an answer control must be disabled. */
  protected isOptionDisabled(questionId: string, optionId: string, allowMultiple: boolean): boolean {
    if (this.isPast() || this.busy()) return true;
    if (allowMultiple) return this.isOptionSelected(questionId, optionId);
    return this.hasVoted(questionId);
  }

  /** Submits one answer. @param questionId Question id. @param optionId Option id. @param allowMultiple Multiple-answer mode. */
  protected async vote(questionId: string, optionId: string, allowMultiple: boolean): Promise<void> {
    if (this.isOptionDisabled(questionId, optionId, allowMultiple)) return;
    this.busy.set(true);
    try {
      const saved = await this.pollService.vote(this.pollId, questionId, optionId, allowMultiple);
      if (saved) this.storeSelection(questionId, optionId);
    } finally {
      this.busy.set(false);
    }
  }

  /** Stores one local selection. @param questionId Question id. @param optionId Option id. */
  private storeSelection(questionId: string, optionId: string): void {
    const next = new Set(this.selectedOptions());
    next.add(this.selectionKey(questionId, optionId));
    this.selectedOptions.set(next);
  }

  /** Builds one local selection key. @param questionId Question id. @param optionId Option id. @returns Selection key. */
  private selectionKey(questionId: string, optionId: string): string {
    return `${questionId}:${optionId}`;
  }
}
