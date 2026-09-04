import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrentTimeService } from '../../../../core/time/current-time';
import { AppLogo } from '../../../../shared/components/app-logo/app-logo';
import { PollOption } from '../../components/poll-option/poll-option';
import { PollResults } from '../../components/poll-results/poll-results';
import { PollService } from '../../services/poll';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
function PollDetail_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Loading survey...");
    i0.ɵɵelementEnd();
} }
function PollDetail_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 5);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error());
} }
function PollDetail_Conditional_8_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentPoll_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(currentPoll_r2.description);
} }
function PollDetail_Conditional_8_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
    i0.ɵɵpipe(1, "date");
} if (rf & 2) {
    i0.ɵɵtextInterpolate1(" Ends ", i0.ɵɵpipeBind2(1, 1, ctx, "MMM d, y"), " ");
} }
function PollDetail_Conditional_8_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " No deadline ");
} }
function PollDetail_Conditional_8_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 15);
    i0.ɵɵtext(1, "This survey has ended. Voting is no longer possible.");
    i0.ɵɵelementEnd();
} }
function PollDetail_Conditional_8_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 15);
    i0.ɵɵtext(1, "You have already voted in this survey.");
    i0.ɵɵelementEnd();
} }
function PollDetail_Conditional_8_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 15);
    i0.ɵɵtext(1, "Choose one answer.");
    i0.ɵɵelementEnd();
} }
function PollDetail_Conditional_8_For_20_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-poll-option", 21);
    i0.ɵɵlistener("voted", function PollDetail_Conditional_8_For_20_Template_app_poll_option_voted_0_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.vote($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r4 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("option", option_r4)("disabled", ctx_r0.isPast() || ctx_r0.hasVoted() || ctx_r0.busy());
} }
function PollDetail_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 7)(1, "span", 8);
    i0.ɵɵtext(2, "Published");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 9);
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "h1", 10);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(8, PollDetail_Conditional_8_Conditional_8_Template, 2, 1, "p", 11);
    i0.ɵɵelementStart(9, "p", 12);
    i0.ɵɵconditionalCreate(10, PollDetail_Conditional_8_Conditional_10_Template, 2, 4)(11, PollDetail_Conditional_8_Conditional_11_Template, 1, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "section", 13)(13, "h2", 14);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(15, PollDetail_Conditional_8_Conditional_15_Template, 2, 0, "p", 15)(16, PollDetail_Conditional_8_Conditional_16_Template, 2, 0, "p", 15)(17, PollDetail_Conditional_8_Conditional_17_Template, 2, 0, "p", 15);
    i0.ɵɵelementStart(18, "div", 16);
    i0.ɵɵrepeaterCreate(19, PollDetail_Conditional_8_For_20_Template, 1, 2, "app-poll-option", 17, _forTrack0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "aside", 18)(22, "h2", 19);
    i0.ɵɵtext(23, "Results ");
    i0.ɵɵelementStart(24, "span");
    i0.ɵɵtext(25, "LIVE");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(26, "app-poll-results", 20);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_5_0;
    const currentPoll_r2 = ctx;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind2(5, 8, currentPoll_r2.createdAt, "MMM d, y"), " \u00B7 ", currentPoll_r2.category, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(currentPoll_r2.title);
    i0.ɵɵadvance();
    i0.ɵɵconditional(currentPoll_r2.description ? 8 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((tmp_5_0 = currentPoll_r2.deadline) ? 10 : 11, tmp_5_0);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(currentPoll_r2.question);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isPast() ? 15 : ctx_r0.hasVoted() ? 16 : 17);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(currentPoll_r2.options);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("options", currentPoll_r2.options);
} }
function PollDetail_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 6)(1, "h1");
    i0.ɵɵtext(2, "Survey not found");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "The requested survey does not exist.");
    i0.ɵɵelementEnd()();
} }
export class PollDetail {
    route = inject(ActivatedRoute);
    pollService = inject(PollService);
    currentTimeService = inject(CurrentTimeService);
    pollId = this.route.snapshot.paramMap.get('id') ?? '';
    loading = this.pollService.loading;
    error = this.pollService.error;
    busy = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "busy" }] : /* istanbul ignore next */ []));
    poll = computed(() => this.pollService.getPollById(this.pollId), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "poll" }] : /* istanbul ignore next */ []));
    isPast = computed(() => {
        const poll = this.poll();
        const referenceDate = this.currentTimeService.currentTime();
        return poll ? this.pollService.isPast(poll, referenceDate) : false;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "isPast" }] : /* istanbul ignore next */ []));
    hasVoted = computed(() => this.pollService.hasVoted(this.pollId), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "hasVoted" }] : /* istanbul ignore next */ []));
    /**
     * Submits one option while preventing concurrent or invalid votes.
     * @param optionId Selected option identifier.
     */
    async vote(optionId) {
        if (this.busy() || this.hasVoted() || this.isPast()) {
            return;
        }
        this.busy.set(true);
        try {
            await this.pollService.vote(this.pollId, optionId);
        }
        finally {
            this.busy.set(false);
        }
    }
    static ɵfac = function PollDetail_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PollDetail)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PollDetail, selectors: [["app-poll-detail"]], decls: 10, vars: 1, consts: [[1, "detail-header"], ["routerLink", "/", "aria-label", "Back to surveys"], ["tone", "dark"], ["routerLink", "/", 1, "button", "button--primary"], [1, "detail-page"], ["role", "alert"], [1, "not-found"], ["aria-labelledby", "survey-title", 1, "survey-panel"], [1, "status-pill"], [1, "survey-meta"], ["id", "survey-title"], [1, "survey-description"], [1, "survey-deadline"], ["aria-labelledby", "question-heading", 1, "question"], ["id", "question-heading"], [1, "voting-note"], [1, "answers"], [3, "option", "disabled"], ["aria-labelledby", "results-heading", 1, "survey-results"], ["id", "results-heading"], [3, "options"], [3, "voted", "option", "disabled"]], template: function PollDetail_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "header", 0)(1, "a", 1);
            i0.ɵɵelement(2, "app-logo", 2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "a", 3);
            i0.ɵɵtext(4, "Create Survey");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(5, "main", 4);
            i0.ɵɵconditionalCreate(6, PollDetail_Conditional_6_Template, 2, 0, "p")(7, PollDetail_Conditional_7_Template, 2, 1, "p", 5)(8, PollDetail_Conditional_8_Template, 27, 11)(9, PollDetail_Conditional_9_Template, 5, 0, "section", 6);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            let tmp_0_0;
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.loading() ? 6 : ctx.error() ? 7 : (tmp_0_0 = ctx.poll()) ? 8 : 9, tmp_0_0);
        } }, dependencies: [AppLogo, RouterLink, PollOption, PollResults, DatePipe], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background: var(--%NS%color-surface);\n}\n.detail-header[_ngcontent-%COMP%] {\n  display: flex;\n  width: min(100% - 3rem, 76.25rem);\n  height: 7.5rem;\n  align-items: center;\n  justify-content: space-between;\n  margin: 0 auto;\n}\n.detail-header[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%]:first-child {\n  text-decoration: none;\n}\n.detail-page[_ngcontent-%COMP%] {\n  display: grid;\n  width: min(100% - 3rem, 66.1875rem);\n  grid-template-columns: minmax(0, 43.875rem) 19.6875rem;\n  align-items: start;\n  gap: 2.625rem;\n  margin: 0 auto;\n  padding-bottom: 5rem;\n}\n.survey-panel[_ngcontent-%COMP%] {\n  min-height: 44rem;\n  padding: 2.5rem;\n  border-radius: 0 10rem 0 0;\n  background: rgb(53 39 58 / 8%);\n}\n.status-pill[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.125rem 0.625rem;\n  border-radius: 1.25rem;\n  color: var(--%NS%color-surface);\n  background: var(--%NS%color-purple);\n  font: 0.75rem var(--%NS%font-button);\n}\n.survey-meta[_ngcontent-%COMP%] {\n  margin: 1.5rem 0 0.75rem;\n  font-size: 0.875rem;\n}\nh1[_ngcontent-%COMP%] {\n  max-width: 34rem;\n  margin: 0;\n  color: var(--%NS%color-orange);\n  font: 400 3.5rem/0.9 var(--%NS%font-heading);\n}\n.survey-description[_ngcontent-%COMP%] {\n  max-width: 34rem;\n  line-height: 1.5;\n}\n.survey-deadline[_ngcontent-%COMP%] {\n  margin: 1rem 0 2.5rem;\n  font-size: 0.875rem;\n  font-weight: 700;\n}\n.question[_ngcontent-%COMP%] {\n  max-width: 35rem;\n}\n.question[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem;\n  font: 400 1.75rem/1.1 var(--%NS%font-heading);\n}\n.voting-note[_ngcontent-%COMP%] {\n  margin: 0 0 1rem;\n  font-size: 0.875rem;\n}\n.answers[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 1rem;\n}\n.survey-results[_ngcontent-%COMP%] {\n  padding-top: 3rem;\n}\n.survey-results[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%] {\n  margin: 0 0 2rem;\n  font: 400 2rem/1 var(--%NS%font-heading);\n}\n.survey-results[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-left: 0.5rem;\n  color: var(--%NS%color-orange);\n  font: 700 0.75rem var(--%NS%font-button);\n}\n.not-found[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n}\n@media (max-width: 48rem) {\n  .detail-header[_ngcontent-%COMP%] {\n    width: calc(100% - 2rem);\n    height: 7rem;\n  }\n  .detail-header[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n    padding: 0.65rem 0.8rem;\n  }\n  .detail-page[_ngcontent-%COMP%] {\n    display: flex;\n    width: 100%;\n    flex-direction: column;\n    gap: 0;\n    padding-bottom: 4rem;\n  }\n  .survey-panel[_ngcontent-%COMP%] {\n    width: calc(100% - 1rem);\n    min-height: auto;\n    padding: 2rem 1.5rem 3rem;\n    border-radius: 0 5rem 0 0;\n  }\n  h1[_ngcontent-%COMP%] {\n    font-size: 3rem;\n  }\n  .answers[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .survey-results[_ngcontent-%COMP%] {\n    width: calc(100% - 3rem);\n    margin: 0 auto;\n    padding-top: 3.5rem;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PollDetail, [{
        type: Component,
        args: [{ imports: [AppLogo, DatePipe, RouterLink, PollOption, PollResults], selector: 'app-poll-detail', template: "<header class=\"detail-header\">\n  <a routerLink=\"/\" aria-label=\"Back to surveys\"><app-logo tone=\"dark\" /></a>\n  <a class=\"button button--primary\" routerLink=\"/\">Create Survey</a>\n</header>\n\n<main class=\"detail-page\">\n  @if (loading()) {\n    <p>Loading survey...</p>\n  } @else if (error()) {\n    <p role=\"alert\">{{ error() }}</p>\n  } @else if (poll(); as currentPoll) {\n    <section class=\"survey-panel\" aria-labelledby=\"survey-title\">\n      <span class=\"status-pill\">Published</span>\n      <p class=\"survey-meta\">\n        {{ currentPoll.createdAt | date: 'MMM d, y' }} \u00B7 {{ currentPoll.category }}\n      </p>\n      <h1 id=\"survey-title\">{{ currentPoll.title }}</h1>\n      @if (currentPoll.description) {\n        <p class=\"survey-description\">{{ currentPoll.description }}</p>\n      }\n      <p class=\"survey-deadline\">\n        @if (currentPoll.deadline; as deadline) {\n          Ends {{ deadline | date: 'MMM d, y' }}\n        } @else {\n          No deadline\n        }\n      </p>\n\n      <section class=\"question\" aria-labelledby=\"question-heading\">\n        <h2 id=\"question-heading\">{{ currentPoll.question }}</h2>\n        @if (isPast()) {\n          <p class=\"voting-note\">This survey has ended. Voting is no longer possible.</p>\n        } @else if (hasVoted()) {\n          <p class=\"voting-note\">You have already voted in this survey.</p>\n        } @else {\n          <p class=\"voting-note\">Choose one answer.</p>\n        }\n        <div class=\"answers\">\n          @for (option of currentPoll.options; track option.id) {\n            <app-poll-option\n              [option]=\"option\"\n              [disabled]=\"isPast() || hasVoted() || busy()\"\n              (voted)=\"vote($event)\"\n            />\n          }\n        </div>\n      </section>\n    </section>\n\n    <aside class=\"survey-results\" aria-labelledby=\"results-heading\">\n      <h2 id=\"results-heading\">Results <span>LIVE</span></h2>\n      <app-poll-results [options]=\"currentPoll.options\" />\n    </aside>\n  } @else {\n    <section class=\"not-found\">\n      <h1>Survey not found</h1>\n      <p>The requested survey does not exist.</p>\n    </section>\n  }\n</main>\n", styles: [":host {\n  display: block;\n  min-height: 100vh;\n  background: var(--color-surface);\n}\n.detail-header {\n  display: flex;\n  width: min(100% - 3rem, 76.25rem);\n  height: 7.5rem;\n  align-items: center;\n  justify-content: space-between;\n  margin: 0 auto;\n}\n.detail-header > a:first-child {\n  text-decoration: none;\n}\n.detail-page {\n  display: grid;\n  width: min(100% - 3rem, 66.1875rem);\n  grid-template-columns: minmax(0, 43.875rem) 19.6875rem;\n  align-items: start;\n  gap: 2.625rem;\n  margin: 0 auto;\n  padding-bottom: 5rem;\n}\n.survey-panel {\n  min-height: 44rem;\n  padding: 2.5rem;\n  border-radius: 0 10rem 0 0;\n  background: rgb(53 39 58 / 8%);\n}\n.status-pill {\n  display: inline-block;\n  padding: 0.125rem 0.625rem;\n  border-radius: 1.25rem;\n  color: var(--color-surface);\n  background: var(--color-purple);\n  font: 0.75rem var(--font-button);\n}\n.survey-meta {\n  margin: 1.5rem 0 0.75rem;\n  font-size: 0.875rem;\n}\nh1 {\n  max-width: 34rem;\n  margin: 0;\n  color: var(--color-orange);\n  font: 400 3.5rem/0.9 var(--font-heading);\n}\n.survey-description {\n  max-width: 34rem;\n  line-height: 1.5;\n}\n.survey-deadline {\n  margin: 1rem 0 2.5rem;\n  font-size: 0.875rem;\n  font-weight: 700;\n}\n.question {\n  max-width: 35rem;\n}\n.question h2 {\n  margin: 0 0 0.5rem;\n  font: 400 1.75rem/1.1 var(--font-heading);\n}\n.voting-note {\n  margin: 0 0 1rem;\n  font-size: 0.875rem;\n}\n.answers {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 1rem;\n}\n.survey-results {\n  padding-top: 3rem;\n}\n.survey-results > h2 {\n  margin: 0 0 2rem;\n  font: 400 2rem/1 var(--font-heading);\n}\n.survey-results > h2 span {\n  margin-left: 0.5rem;\n  color: var(--color-orange);\n  font: 700 0.75rem var(--font-button);\n}\n.not-found {\n  grid-column: 1 / -1;\n}\n@media (max-width: 48rem) {\n  .detail-header {\n    width: calc(100% - 2rem);\n    height: 7rem;\n  }\n  .detail-header .button {\n    padding: 0.65rem 0.8rem;\n  }\n  .detail-page {\n    display: flex;\n    width: 100%;\n    flex-direction: column;\n    gap: 0;\n    padding-bottom: 4rem;\n  }\n  .survey-panel {\n    width: calc(100% - 1rem);\n    min-height: auto;\n    padding: 2rem 1.5rem 3rem;\n    border-radius: 0 5rem 0 0;\n  }\n  h1 {\n    font-size: 3rem;\n  }\n  .answers {\n    grid-template-columns: 1fr;\n  }\n  .survey-results {\n    width: calc(100% - 3rem);\n    margin: 0 auto;\n    padding-top: 3.5rem;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PollDetail, { className: "PollDetail", filePath: "src/app/features/polls/pages/poll-detail/poll-detail.ts", lineNumber: 17 }); })();
