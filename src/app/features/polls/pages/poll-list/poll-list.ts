import { Component, computed, inject, signal } from '@angular/core';

import { CurrentTimeService } from '../../../../core/time/current-time';
import { AppLogo } from '../../../../shared/components/app-logo/app-logo';
import { HeroVisual } from '../../../../shared/components/hero-visual/hero-visual';
import { PollCard } from '../../components/poll-card/poll-card';
import { POLL_CATEGORIES, Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll';
import {
  CategoryFilter,
  filterEndingSoonPolls,
  filterPollsByCategory,
  sortPollsByDeadline,
} from '../../utils/poll-filter.utils';
import { PollCreate } from '../poll-create/poll-create';

type SurveyTab = 'active' | 'past';

const ENDING_SOON_WINDOW_MS = 24 * 60 * 60 * 1000;
const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  All: 'All Surveys',
  Education: 'Education & Learning',
  Entertainment: 'Gaming & Entertainment',
  Lifestyle: 'Lifestyle & Preferences',
  Other: 'Other',
  Technology: 'Technology & Innovation',
};

@Component({
  selector: 'app-poll-list',
  imports: [AppLogo, HeroVisual, PollCard, PollCreate],
  templateUrl: './poll-list.html',
  styleUrl: './poll-list.scss',
})
export class PollList {
  private readonly pollService = inject(PollService);
  private readonly currentTimeService = inject(CurrentTimeService);

  protected readonly loading = this.pollService.loading;
  protected readonly error = this.pollService.error;
  protected readonly categories: readonly CategoryFilter[] = ['All', ...POLL_CATEGORIES];
  protected readonly selectedTab = signal<SurveyTab>('active');
  protected readonly selectedCategory = signal<CategoryFilter>('All');
  protected readonly categoryMenuOpen = signal(false);
  protected readonly createModalOpen = signal(false);
  protected readonly publishConfirmationOpen = signal(false);
  private readonly currentTime = this.currentTimeService.currentTime;
  private publishConfirmationTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly activePolls = computed(() => {
    const referenceDate = this.currentTime();
    const polls = this.pollService
      .polls()
      .filter((poll) => this.pollService.isActive(poll, referenceDate));
    return sortPollsByDeadline(polls);
  });

  protected readonly pastPolls = computed(() => {
    const referenceDate = this.currentTime();
    const polls = this.pollService
      .polls()
      .filter((poll) => this.pollService.isPast(poll, referenceDate));
    return sortPollsByDeadline(polls);
  });

  protected readonly visiblePolls = computed(() => {
    const polls = this.getSelectedTabPolls();
    return filterPollsByCategory(polls, this.selectedCategory());
  });

  protected readonly endingSoonPolls = computed(() => {
    if (this.selectedTab() !== 'active') {
      return [];
    }
    const polls = filterPollsByCategory(this.activePolls(), this.selectedCategory());
    return filterEndingSoonPolls(polls, this.currentTime().getTime(), ENDING_SOON_WINDOW_MS);
  });

  /**
   * Selects the active or past survey tab.
   * @param tab Tab to display.
   */
  protected selectTab(tab: SurveyTab): void {
    this.selectedTab.set(tab);
  }

  /**
   * Applies one category filter to the currently selected tab.
   * @param category Category to display.
   */
  protected selectCategory(category: CategoryFilter): void {
    this.selectedCategory.set(category);
  }

  /** Opens or closes the category menu. */
  protected toggleCategoryMenu(): void {
    this.categoryMenuOpen.update((open) => !open);
  }

  /** Closes the category menu. */
  protected closeCategoryMenu(): void {
    this.categoryMenuOpen.set(false);
  }

  /**
   * Keeps the menu open while focus moves inside its controls.
   * @param event Focus event leaving one menu element.
   */
  protected handleCategoryFocusOut(event: FocusEvent): void {
    const menu = event.currentTarget as HTMLElement;
    if (!menu.contains(event.relatedTarget as Node | null)) this.closeCategoryMenu();
  }

  /**
   * Applies a category and closes the category menu.
   * @param category Category to display.
   */
  protected chooseCategory(category: CategoryFilter): void {
    this.selectCategory(category);
    this.closeCategoryMenu();
  }

  /**
   * Returns the visual label for a persisted category value.
   * @param category Current domain category.
   * @returns Figma-aligned display label.
   */
  protected categoryLabel(category: CategoryFilter): string {
    return CATEGORY_LABELS[category];
  }

  /** Opens the create-survey modal and clears stale service errors. */
  protected openCreateModal(): void {
    this.pollService.clearError();
    this.createModalOpen.set(true);
  }

  /** Closes the create-survey modal and clears stale service errors. */
  protected closeCreateModal(): void {
    this.pollService.clearError();
    this.createModalOpen.set(false);
  }

  /**
   * Handles a newly created survey and selects its matching list tab.
   * @param poll Newly created survey.
   */
  protected surveyCreated(poll: Poll): void {
    this.createModalOpen.set(false);
    this.showPublishConfirmation();
    this.selectCreatedPollTab(poll);
    this.selectedCategory.set('All');
  }

  /** Closes the published-survey confirmation. */
  protected closePublishConfirmation(): void {
    this.clearPublishConfirmationTimer();
    this.publishConfirmationOpen.set(false);
  }


  /** Shows the published confirmation for one timed lifecycle. */
  private showPublishConfirmation(): void {
    this.clearPublishConfirmationTimer();
    this.publishConfirmationOpen.set(true);
    this.publishConfirmationTimer = setTimeout(() => {
      this.publishConfirmationOpen.set(false);
      this.publishConfirmationTimer = null;
    }, 4600);
  }

  /** Clears a pending confirmation timer. */
  private clearPublishConfirmationTimer(): void {
    if (this.publishConfirmationTimer === null) return;
    clearTimeout(this.publishConfirmationTimer);
    this.publishConfirmationTimer = null;
  }

  /** Reloads all survey data from Supabase. */
  protected reload(): void {
    void this.pollService.loadPolls();
  }

  /**
   * Returns the surveys belonging to the currently selected tab.
   * @returns Surveys for the active tab selection.
   */
  private getSelectedTabPolls(): Poll[] {
    return this.selectedTab() === 'active' ? this.activePolls() : this.pastPolls();
  }

  /**
   * Selects the active or past tab according to a new survey deadline.
   * @param poll Newly created survey.
   */
  private selectCreatedPollTab(poll: Poll): void {
    const referenceDate = this.currentTime();
    const tab = this.pollService.isPast(poll, referenceDate) ? 'past' : 'active';
    this.selectedTab.set(tab);
  }
}
