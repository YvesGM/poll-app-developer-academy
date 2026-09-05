import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CurrentTimeService } from '../../../../core/time/current-time';
import { AppLogo } from '../../../../shared/components/app-logo/app-logo';
import { PollOption } from '../../components/poll-option/poll-option';
import { POLL_CATEGORY_LABELS, VoteSelection } from '../../models/poll.model';
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
  protected readonly sessionCompleted = computed(() => this.pollService.hasCompletedPoll(this.pollId));
  protected readonly canComplete = computed(() => this.hasAllRequiredSelections());

  protected readonly isPast = computed(() => {
    const poll = this.poll();
    const referenceDate = this.currentTimeService.currentTime();
    return poll ? this.pollService.isPast(poll, referenceDate) : false;
  });

  /** Submits selected answers and completes the survey for this browser session. */
  protected async completeSurvey(): Promise<void> {
    if (!this.canComplete() || this.busy()) return;
    this.busy.set(true);
    const completed = await this.pollService.submitVotes(this.pollId, this.selectedVoteRows());
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

  /** Returns whether one answer is selected locally or was submitted in this session. */
  protected isOptionSelected(questionId: string, optionId: string): boolean {
    return this.selectedOptions().has(this.selectionKey(questionId, optionId))
      || this.pollService.hasVotedOption(this.pollId, questionId, optionId);
  }

  /** Returns whether an answer control must be disabled. */
  protected isOptionDisabled(): boolean {
    return this.isPast() || this.sessionCompleted() || this.busy();
  }

  /** Updates one local answer selection without persisting it yet. @param questionId Question id. @param optionId Option id. @param allowMultiple Multiple-answer mode. */
  protected vote(questionId: string, optionId: string, allowMultiple: boolean): void {
    if (this.isOptionDisabled()) return;
    if (allowMultiple) this.toggleMultipleSelection(questionId, optionId);
    else this.replaceSingleSelection(questionId, optionId);
  }

  /** Toggles one option in a multiple-answer question. @param questionId Question id. @param optionId Option id. */
  private toggleMultipleSelection(questionId: string, optionId: string): void {
    const next = new Set(this.selectedOptions());
    const key = this.selectionKey(questionId, optionId);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.selectedOptions.set(next);
  }

  /** Replaces the local selection for one single-answer question. @param questionId Question id. @param optionId Option id. */
  private replaceSingleSelection(questionId: string, optionId: string): void {
    const prefix = `${questionId}:`;
    const next = new Set([...this.selectedOptions()].filter((key) => !key.startsWith(prefix)));
    next.add(this.selectionKey(questionId, optionId));
    this.selectedOptions.set(next);
  }

  /** Returns whether every survey question has at least one local answer. */
  private hasAllRequiredSelections(): boolean {
    const currentPoll = this.poll();
    if (!currentPoll || this.isPast() || this.sessionCompleted()) return false;
    return currentPoll.questions.every((question) => this.hasQuestionSelection(question.id));
  }

  /** Checks whether one question has a local selection. @param questionId Question id. @returns Selection state. */
  private hasQuestionSelection(questionId: string): boolean {
    const prefix = `${questionId}:`;
    return [...this.selectedOptions()].some((key) => key.startsWith(prefix));
  }

  /** Builds final vote rows from local selections. @returns Vote rows ready for persistence. */
  private selectedVoteRows(): VoteSelection[] {
    const currentPoll = this.poll();
    if (!currentPoll) return [];
    return currentPoll.questions.flatMap((question) => this.questionVoteRows(question.id, question.allowMultiple));
  }

  /** Builds vote rows for one question. @param questionId Question id. @param allowMultiple Multiple-answer mode. @returns Question votes. */
  private questionVoteRows(questionId: string, allowMultiple: boolean): VoteSelection[] {
    const prefix = `${questionId}:`;
    return [...this.selectedOptions()]
      .filter((key) => key.startsWith(prefix))
      .map((key) => ({ questionId, optionId: key.slice(prefix.length), allowMultiple }));
  }

  /** Builds one local selection key. @param questionId Question id. @param optionId Option id. @returns Selection key. */
  private selectionKey(questionId: string, optionId: string): string {
    return `${questionId}:${optionId}`;
  }
}
