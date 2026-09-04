import { Component, computed, inject, signal } from '@angular/core';
import { CurrentTimeService } from '../../../../core/time/current-time';
import { AppLogo } from '../../../../shared/components/app-logo/app-logo';
import { HeroVisual } from '../../../../shared/components/hero-visual/hero-visual';
import { PollCard } from '../../components/poll-card/poll-card';
import { POLL_CATEGORIES } from '../../models/poll.model';
import { PollService } from '../../services/poll';
import { filterEndingSoonPolls, filterPollsByCategory, sortPollsByDeadline, } from '../../utils/poll-filter.utils';
import { PollCreate } from '../poll-create/poll-create';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
function PollList_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 8);
    i0.ɵɵtext(1, "Loading surveys...");
    i0.ɵɵelementEnd();
} }
function PollList_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 9)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 12);
    i0.ɵɵlistener("click", function PollList_Conditional_16_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.reload()); });
    i0.ɵɵtext(4, "Try again");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.error());
} }
function PollList_Conditional_17_Conditional_0_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-poll-card", 25);
} if (rf & 2) {
    const poll_r4 = ctx.$implicit;
    i0.ɵɵproperty("poll", poll_r4)("highlight", true);
} }
function PollList_Conditional_17_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 13)(1, "h3", 23);
    i0.ɵɵtext(2, "Ending Soon");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 24);
    i0.ɵɵrepeaterCreate(4, PollList_Conditional_17_Conditional_0_For_5_Template, 1, 2, "app-poll-card", 25, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.endingSoonPolls());
} }
function PollList_Conditional_17_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 19);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const category_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", category_r5);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(category_r5);
} }
function PollList_Conditional_17_For_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-poll-card", 21);
} if (rf & 2) {
    const poll_r6 = ctx.$implicit;
    i0.ɵɵproperty("poll", poll_r6);
} }
function PollList_Conditional_17_ForEmpty_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 22);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("No ", ctx_r1.selectedTab(), " surveys available for this category.");
} }
function PollList_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵconditionalCreate(0, PollList_Conditional_17_Conditional_0_Template, 6, 0, "section", 13);
    i0.ɵɵelementStart(1, "div", 14)(2, "nav", 15)(3, "button", 16);
    i0.ɵɵlistener("click", function PollList_Conditional_17_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectTab("active")); });
    i0.ɵɵtext(4, " Active ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 16);
    i0.ɵɵlistener("click", function PollList_Conditional_17_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectTab("past")); });
    i0.ɵɵtext(6, " Past ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "label", 17);
    i0.ɵɵtext(8, "Sort by categories ");
    i0.ɵɵelementStart(9, "select", 18);
    i0.ɵɵlistener("change", function PollList_Conditional_17_Template_select_change_9_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.changeCategory($event)); });
    i0.ɵɵrepeaterCreate(10, PollList_Conditional_17_For_11_Template, 2, 2, "option", 19, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "section", 20);
    i0.ɵɵrepeaterCreate(13, PollList_Conditional_17_For_14_Template, 1, 1, "app-poll-card", 21, _forTrack0, false, PollList_Conditional_17_ForEmpty_15_Template, 2, 1, "p", 22);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.endingSoonPolls().length > 0 ? 0 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵattribute("aria-pressed", ctx_r1.selectedTab() === "active");
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("aria-pressed", ctx_r1.selectedTab() === "past");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r1.selectedCategory());
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.categories);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.visiblePolls());
} }
function PollList_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 26);
    i0.ɵɵlistener("click", function PollList_Conditional_18_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeCreateModal()); });
    i0.ɵɵelementStart(1, "section", 27);
    i0.ɵɵlistener("click", function PollList_Conditional_18_Template_section_click_1_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵelementStart(2, "app-poll-create", 28);
    i0.ɵɵlistener("created", function PollList_Conditional_18_Template_app_poll_create_created_2_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.surveyCreated($event)); })("cancelled", function PollList_Conditional_18_Template_app_poll_create_cancelled_2_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeCreateModal()); });
    i0.ɵɵelementEnd()()();
} }
function PollList_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "aside", 11)(1, "p");
    i0.ɵɵtext(2, "Your survey is now published");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 29);
    i0.ɵɵlistener("click", function PollList_Conditional_19_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closePublishConfirmation()); });
    i0.ɵɵtext(4, " \u00D7 ");
    i0.ɵɵelementEnd()();
} }
const ENDING_SOON_WINDOW_MS = 24 * 60 * 60 * 1000;
export class PollList {
    pollService = inject(PollService);
    currentTimeService = inject(CurrentTimeService);
    loading = this.pollService.loading;
    error = this.pollService.error;
    categories = ['All', ...POLL_CATEGORIES];
    selectedTab = signal('active', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selectedTab" }] : /* istanbul ignore next */ []));
    selectedCategory = signal('All', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selectedCategory" }] : /* istanbul ignore next */ []));
    createModalOpen = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "createModalOpen" }] : /* istanbul ignore next */ []));
    publishConfirmationOpen = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "publishConfirmationOpen" }] : /* istanbul ignore next */ []));
    currentTime = this.currentTimeService.currentTime;
    activePolls = computed(() => {
        const referenceDate = this.currentTime();
        const polls = this.pollService
            .polls()
            .filter((poll) => this.pollService.isActive(poll, referenceDate));
        return sortPollsByDeadline(polls);
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "activePolls" }] : /* istanbul ignore next */ []));
    pastPolls = computed(() => {
        const referenceDate = this.currentTime();
        const polls = this.pollService
            .polls()
            .filter((poll) => this.pollService.isPast(poll, referenceDate));
        return sortPollsByDeadline(polls);
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "pastPolls" }] : /* istanbul ignore next */ []));
    visiblePolls = computed(() => {
        const polls = this.getSelectedTabPolls();
        return filterPollsByCategory(polls, this.selectedCategory());
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "visiblePolls" }] : /* istanbul ignore next */ []));
    endingSoonPolls = computed(() => {
        if (this.selectedTab() !== 'active') {
            return [];
        }
        const polls = filterPollsByCategory(this.activePolls(), this.selectedCategory());
        return filterEndingSoonPolls(polls, this.currentTime().getTime(), ENDING_SOON_WINDOW_MS);
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "endingSoonPolls" }] : /* istanbul ignore next */ []));
    /**
     * Selects the active or past survey tab.
     * @param tab Tab to display.
     */
    selectTab(tab) {
        this.selectedTab.set(tab);
    }
    /**
     * Applies one category filter to the currently selected tab.
     * @param category Category to display.
     */
    selectCategory(category) {
        this.selectedCategory.set(category);
    }
    /** Applies the category selected in the native dropdown. */
    changeCategory(event) {
        const select = event.target;
        this.selectCategory(select.value);
    }
    /** Opens the create-survey modal and clears stale service errors. */
    openCreateModal() {
        this.pollService.clearError();
        this.createModalOpen.set(true);
    }
    /** Closes the create-survey modal and clears stale service errors. */
    closeCreateModal() {
        this.pollService.clearError();
        this.createModalOpen.set(false);
    }
    /**
     * Handles a newly created survey and selects its matching list tab.
     * @param poll Newly created survey.
     */
    surveyCreated(poll) {
        this.createModalOpen.set(false);
        this.publishConfirmationOpen.set(true);
        this.selectCreatedPollTab(poll);
        this.selectedCategory.set('All');
    }
    /** Closes the published-survey confirmation. */
    closePublishConfirmation() {
        this.publishConfirmationOpen.set(false);
    }
    /** Reloads all survey data from Supabase. */
    reload() {
        void this.pollService.loadPolls();
    }
    /**
     * Returns the surveys belonging to the currently selected tab.
     * @returns Surveys for the active tab selection.
     */
    getSelectedTabPolls() {
        return this.selectedTab() === 'active' ? this.activePolls() : this.pastPolls();
    }
    /**
     * Selects the active or past tab according to a new survey deadline.
     * @param poll Newly created survey.
     */
    selectCreatedPollTab(poll) {
        const referenceDate = this.currentTime();
        const tab = this.pollService.isPast(poll, referenceDate) ? 'past' : 'active';
        this.selectedTab.set(tab);
    }
    static ɵfac = function PollList_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PollList)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PollList, selectors: [["app-poll-list"]], decls: 20, vars: 3, consts: [[1, "home"], [1, "home__header"], ["aria-labelledby", "hero-heading", 1, "hero"], [1, "hero__copy"], ["id", "hero-heading"], ["type", "button", 1, "button", "button--primary", 3, "click"], ["aria-labelledby", "surveys-heading", 1, "surveys"], ["id", "surveys-heading"], [1, "state-message"], ["role", "alert", 1, "state-message"], [1, "modal-backdrop"], ["role", "status", 1, "publish-confirmation"], ["type", "button", 1, "button", "button--light", 3, "click"], ["aria-labelledby", "ending-heading", 1, "ending"], [1, "survey-toolbar"], ["aria-label", "Survey status", 1, "survey-tabs"], ["type", "button", 3, "click"], [1, "category-select"], [3, "change", "value"], [3, "value"], ["aria-label", "Survey list", 1, "survey-grid"], [3, "poll"], [1, "empty-list"], ["id", "ending-heading"], [1, "ending__grid"], [3, "poll", "highlight"], [1, "modal-backdrop", 3, "click"], ["role", "dialog", "aria-modal", "true", "aria-label", "Create Survey", 1, "modal-panel", 3, "click"], [3, "created", "cancelled"], ["type", "button", "aria-label", "Close confirmation", 3, "click"]], template: function PollList_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "main", 0)(1, "header", 1);
            i0.ɵɵelement(2, "app-logo");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "section", 2)(4, "div", 3)(5, "h1", 4);
            i0.ɵɵtext(6, "Collect Feedback, Unlock Ideas");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8, "Create surveys, share your questions and discover what people really think.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "button", 5);
            i0.ɵɵlistener("click", function PollList_Template_button_click_9_listener() { return ctx.openCreateModal(); });
            i0.ɵɵtext(10, " New Survey ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(11, "app-hero-visual");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "section", 6)(13, "h2", 7);
            i0.ɵɵtext(14, "Your surveys");
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(15, PollList_Conditional_15_Template, 2, 0, "p", 8)(16, PollList_Conditional_16_Template, 5, 1, "div", 9)(17, PollList_Conditional_17_Template, 16, 5);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(18, PollList_Conditional_18_Template, 3, 0, "div", 10);
            i0.ɵɵconditionalCreate(19, PollList_Conditional_19_Template, 5, 0, "aside", 11);
        } if (rf & 2) {
            i0.ɵɵadvance(15);
            i0.ɵɵconditional(ctx.loading() ? 15 : ctx.error() ? 16 : 17);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.createModalOpen() ? 18 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.publishConfirmationOpen() ? 19 : -1);
        } }, dependencies: [AppLogo, HeroVisual, PollCard, PollCreate], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background: var(--%NS%color-purple);\n  color: var(--%NS%color-surface);\n}\n.home[_ngcontent-%COMP%] {\n  width: min(100% - 3rem, 76.125rem);\n  margin: 0 auto;\n  padding: 2.5rem 0 7rem;\n}\n.home__header[_ngcontent-%COMP%] {\n  height: 5.4rem;\n}\n.hero[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 44.5rem) 26.625rem;\n  align-items: center;\n  gap: 2rem;\n  min-height: 31rem;\n}\n.hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  max-width: 44.5rem;\n  margin: 0;\n  color: var(--%NS%color-orange);\n  font: 400 6.25rem/0.89 var(--%NS%font-heading);\n}\n.hero[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 41.625rem;\n  margin: 2rem 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  line-height: 1.4;\n}\n.surveys[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%] {\n  margin: 5.5rem 0 3.5rem;\n  color: var(--%NS%color-orange);\n  font: 400 4.5rem/1 var(--%NS%font-heading);\n  text-align: center;\n}\n.ending[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 1.5rem;\n  font: 400 2rem/1 var(--%NS%font-heading);\n}\n.ending__grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 2rem;\n}\n.survey-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: end;\n  justify-content: space-between;\n  gap: 2rem;\n  margin: 5.5rem 0 2rem;\n}\n.survey-tabs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n}\n.survey-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  padding: 0.125rem 0.625rem;\n  border: 0;\n  border-radius: 1.25rem;\n  color: var(--%NS%color-surface);\n  background: transparent;\n  font-family: var(--%NS%font-button);\n  cursor: pointer;\n}\n.survey-tabs[_ngcontent-%COMP%]   button[aria-pressed='true'][_ngcontent-%COMP%] {\n  color: var(--%NS%color-purple);\n  background: var(--%NS%color-orange);\n}\n.category-select[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n  font-size: 0.875rem;\n}\n.category-select[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  min-width: 12rem;\n  height: 2.3125rem;\n  padding: 0 2.5rem 0 0.75rem;\n  border: 1px solid var(--%NS%color-surface);\n  border-radius: 0.4rem;\n  color: var(--%NS%color-surface);\n  background: var(--%NS%color-purple);\n}\n.survey-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 2rem 2.5rem;\n}\n.state-message[_ngcontent-%COMP%], \n.empty-list[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n  text-align: center;\n}\n.modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  display: grid;\n  place-items: center;\n  padding: 1rem;\n  overflow-y: auto;\n  background: rgb(34 18 39 / 78%);\n}\n.modal-panel[_ngcontent-%COMP%] {\n  width: min(100%, 72.875rem);\n  max-height: calc(100vh - 2rem);\n  overflow-y: auto;\n  border-radius: 0 6.25rem 0 0;\n  background: var(--%NS%color-purple);\n}\n.publish-confirmation[_ngcontent-%COMP%] {\n  position: fixed;\n  z-index: 1100;\n  right: 2rem;\n  bottom: 2rem;\n  display: flex;\n  width: 22.3125rem;\n  min-height: 5.375rem;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1.5rem;\n  color: var(--%NS%color-purple);\n  background: var(--%NS%color-orange);\n  box-shadow: 0 0.75rem 2rem rgb(0 0 0 / 24%);\n}\n.publish-confirmation[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n}\n.publish-confirmation[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  font-size: 1.75rem;\n  cursor: pointer;\n}\n@media (max-width: 60rem) {\n  .hero[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 20rem;\n  }\n  .hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: clamp(4.5rem, 9vw, 6.25rem);\n  }\n  .ending__grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 48rem) {\n  .home[_ngcontent-%COMP%] {\n    width: min(100% - 2rem, 23rem);\n    padding-top: 2rem;\n  }\n  .home__header[_ngcontent-%COMP%] {\n    height: 4.5rem;\n  }\n  .hero[_ngcontent-%COMP%] {\n    display: flex;\n    min-height: auto;\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 4rem;\n    line-height: 0.9;\n  }\n  .hero[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    margin: 1.5rem 0;\n    font-size: 1.125rem;\n  }\n  .hero[_ngcontent-%COMP%]   app-hero-visual[_ngcontent-%COMP%] {\n    align-self: center;\n  }\n  .surveys[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%] {\n    margin: 4.5rem 0 2.5rem;\n    font-size: 3.5rem;\n  }\n  .ending__grid[_ngcontent-%COMP%], \n   .survey-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n  }\n  .ending__grid[_ngcontent-%COMP%]   app-poll-card[_ngcontent-%COMP%]:nth-child(n + 2) {\n    display: none;\n  }\n  .survey-toolbar[_ngcontent-%COMP%] {\n    align-items: stretch;\n    margin-top: 4rem;\n  }\n  .category-select[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n    min-width: 10rem;\n  }\n  .modal-backdrop[_ngcontent-%COMP%] {\n    padding: 0;\n    background: var(--%NS%color-surface);\n  }\n  .modal-panel[_ngcontent-%COMP%] {\n    width: 100%;\n    max-height: 100vh;\n    border-radius: 0;\n  }\n  .publish-confirmation[_ngcontent-%COMP%] {\n    right: 1rem;\n    bottom: 1rem;\n    left: 1rem;\n    width: auto;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PollList, [{
        type: Component,
        args: [{ selector: 'app-poll-list', imports: [AppLogo, HeroVisual, PollCard, PollCreate], template: "<main class=\"home\">\n  <header class=\"home__header\"><app-logo /></header>\n\n  <section class=\"hero\" aria-labelledby=\"hero-heading\">\n    <div class=\"hero__copy\">\n      <h1 id=\"hero-heading\">Collect Feedback, Unlock Ideas</h1>\n      <p>Create surveys, share your questions and discover what people really think.</p>\n      <button class=\"button button--primary\" type=\"button\" (click)=\"openCreateModal()\">\n        New Survey\n      </button>\n    </div>\n    <app-hero-visual />\n  </section>\n\n  <section class=\"surveys\" aria-labelledby=\"surveys-heading\">\n    <h2 id=\"surveys-heading\">Your surveys</h2>\n    @if (loading()) {\n      <p class=\"state-message\">Loading surveys...</p>\n    } @else if (error()) {\n      <div class=\"state-message\" role=\"alert\">\n        <p>{{ error() }}</p>\n        <button class=\"button button--light\" type=\"button\" (click)=\"reload()\">Try again</button>\n      </div>\n    } @else {\n      @if (endingSoonPolls().length > 0) {\n        <section class=\"ending\" aria-labelledby=\"ending-heading\">\n          <h3 id=\"ending-heading\">Ending Soon</h3>\n          <div class=\"ending__grid\">\n            @for (poll of endingSoonPolls(); track poll.id) {\n              <app-poll-card [poll]=\"poll\" [highlight]=\"true\" />\n            }\n          </div>\n        </section>\n      }\n\n      <div class=\"survey-toolbar\">\n        <nav class=\"survey-tabs\" aria-label=\"Survey status\">\n          <button\n            type=\"button\"\n            [attr.aria-pressed]=\"selectedTab() === 'active'\"\n            (click)=\"selectTab('active')\"\n          >\n            Active\n          </button>\n          <button\n            type=\"button\"\n            [attr.aria-pressed]=\"selectedTab() === 'past'\"\n            (click)=\"selectTab('past')\"\n          >\n            Past\n          </button>\n        </nav>\n        <label class=\"category-select\"\n          >Sort by categories\n          <select [value]=\"selectedCategory()\" (change)=\"changeCategory($event)\">\n            @for (category of categories; track category) {\n              <option [value]=\"category\">{{ category }}</option>\n            }\n          </select>\n        </label>\n      </div>\n\n      <section class=\"survey-grid\" aria-label=\"Survey list\">\n        @for (poll of visiblePolls(); track poll.id) {\n          <app-poll-card [poll]=\"poll\" />\n        } @empty {\n          <p class=\"empty-list\">No {{ selectedTab() }} surveys available for this category.</p>\n        }\n      </section>\n    }\n  </section>\n</main>\n\n@if (createModalOpen()) {\n  <div class=\"modal-backdrop\" (click)=\"closeCreateModal()\">\n    <section\n      class=\"modal-panel\"\n      role=\"dialog\"\n      aria-modal=\"true\"\n      aria-label=\"Create Survey\"\n      (click)=\"$event.stopPropagation()\"\n    >\n      <app-poll-create (created)=\"surveyCreated($event)\" (cancelled)=\"closeCreateModal()\" />\n    </section>\n  </div>\n}\n\n@if (publishConfirmationOpen()) {\n  <aside class=\"publish-confirmation\" role=\"status\">\n    <p>Your survey is now published</p>\n    <button type=\"button\" aria-label=\"Close confirmation\" (click)=\"closePublishConfirmation()\">\n      \u00D7\n    </button>\n  </aside>\n}\n", styles: [":host {\n  display: block;\n  min-height: 100vh;\n  background: var(--color-purple);\n  color: var(--color-surface);\n}\n.home {\n  width: min(100% - 3rem, 76.125rem);\n  margin: 0 auto;\n  padding: 2.5rem 0 7rem;\n}\n.home__header {\n  height: 5.4rem;\n}\n.hero {\n  display: grid;\n  grid-template-columns: minmax(0, 44.5rem) 26.625rem;\n  align-items: center;\n  gap: 2rem;\n  min-height: 31rem;\n}\n.hero h1 {\n  max-width: 44.5rem;\n  margin: 0;\n  color: var(--color-orange);\n  font: 400 6.25rem/0.89 var(--font-heading);\n}\n.hero p {\n  max-width: 41.625rem;\n  margin: 2rem 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  line-height: 1.4;\n}\n.surveys > h2 {\n  margin: 5.5rem 0 3.5rem;\n  color: var(--color-orange);\n  font: 400 4.5rem/1 var(--font-heading);\n  text-align: center;\n}\n.ending h3 {\n  margin: 0 0 1.5rem;\n  font: 400 2rem/1 var(--font-heading);\n}\n.ending__grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 2rem;\n}\n.survey-toolbar {\n  display: flex;\n  align-items: end;\n  justify-content: space-between;\n  gap: 2rem;\n  margin: 5.5rem 0 2rem;\n}\n.survey-tabs {\n  display: flex;\n  gap: 0.5rem;\n}\n.survey-tabs button {\n  padding: 0.125rem 0.625rem;\n  border: 0;\n  border-radius: 1.25rem;\n  color: var(--color-surface);\n  background: transparent;\n  font-family: var(--font-button);\n  cursor: pointer;\n}\n.survey-tabs button[aria-pressed='true'] {\n  color: var(--color-purple);\n  background: var(--color-orange);\n}\n.category-select {\n  display: grid;\n  gap: 0.5rem;\n  font-size: 0.875rem;\n}\n.category-select select {\n  min-width: 12rem;\n  height: 2.3125rem;\n  padding: 0 2.5rem 0 0.75rem;\n  border: 1px solid var(--color-surface);\n  border-radius: 0.4rem;\n  color: var(--color-surface);\n  background: var(--color-purple);\n}\n.survey-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 2rem 2.5rem;\n}\n.state-message,\n.empty-list {\n  grid-column: 1 / -1;\n  text-align: center;\n}\n.modal-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  display: grid;\n  place-items: center;\n  padding: 1rem;\n  overflow-y: auto;\n  background: rgb(34 18 39 / 78%);\n}\n.modal-panel {\n  width: min(100%, 72.875rem);\n  max-height: calc(100vh - 2rem);\n  overflow-y: auto;\n  border-radius: 0 6.25rem 0 0;\n  background: var(--color-purple);\n}\n.publish-confirmation {\n  position: fixed;\n  z-index: 1100;\n  right: 2rem;\n  bottom: 2rem;\n  display: flex;\n  width: 22.3125rem;\n  min-height: 5.375rem;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1.5rem;\n  color: var(--color-purple);\n  background: var(--color-orange);\n  box-shadow: 0 0.75rem 2rem rgb(0 0 0 / 24%);\n}\n.publish-confirmation p {\n  margin: 0;\n  font-weight: 700;\n}\n.publish-confirmation button {\n  border: 0;\n  background: transparent;\n  font-size: 1.75rem;\n  cursor: pointer;\n}\n@media (max-width: 60rem) {\n  .hero {\n    grid-template-columns: 1fr 20rem;\n  }\n  .hero h1 {\n    font-size: clamp(4.5rem, 9vw, 6.25rem);\n  }\n  .ending__grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 48rem) {\n  .home {\n    width: min(100% - 2rem, 23rem);\n    padding-top: 2rem;\n  }\n  .home__header {\n    height: 4.5rem;\n  }\n  .hero {\n    display: flex;\n    min-height: auto;\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .hero h1 {\n    font-size: 4rem;\n    line-height: 0.9;\n  }\n  .hero p {\n    margin: 1.5rem 0;\n    font-size: 1.125rem;\n  }\n  .hero app-hero-visual {\n    align-self: center;\n  }\n  .surveys > h2 {\n    margin: 4.5rem 0 2.5rem;\n    font-size: 3.5rem;\n  }\n  .ending__grid,\n  .survey-grid {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n  }\n  .ending__grid app-poll-card:nth-child(n + 2) {\n    display: none;\n  }\n  .survey-toolbar {\n    align-items: stretch;\n    margin-top: 4rem;\n  }\n  .category-select select {\n    min-width: 10rem;\n  }\n  .modal-backdrop {\n    padding: 0;\n    background: var(--color-surface);\n  }\n  .modal-panel {\n    width: 100%;\n    max-height: 100vh;\n    border-radius: 0;\n  }\n  .publish-confirmation {\n    right: 1rem;\n    bottom: 1rem;\n    left: 1rem;\n    width: auto;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PollList, { className: "PollList", filePath: "src/app/features/polls/pages/poll-list/poll-list.ts", lineNumber: 27 }); })();
