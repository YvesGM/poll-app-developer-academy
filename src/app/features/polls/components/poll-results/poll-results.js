import { Component, input } from '@angular/core';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
function PollResults_Conditional_0_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "li", 2)(1, "div", 3)(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(4, "strong");
    i0.ɵɵtext(5);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(6, "div", 4);
    i0.ɵɵdomElement(7, "span", 5);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const option_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(option_r1.text);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.percentage(option_r1.votes), "%");
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ctx_r1.percentage(option_r1.votes), "%");
} }
function PollResults_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "ul", 0);
    i0.ɵɵrepeaterCreate(1, PollResults_Conditional_0_For_2_Template, 8, 4, "li", 2, _forTrack0);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.options());
} }
function PollResults_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 1)(1, "p");
    i0.ɵɵtext(2, "Results will be shown here after participants complete the survey.");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "strong");
    i0.ɵɵtext(4, "There are no answers yet.");
    i0.ɵɵdomElementEnd()();
} }
export class PollResults {
    options = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    /**
     * Calculates the total number of votes across all options.
     * @returns Sum of all option votes.
     */
    totalVotes() {
        return this.options().reduce((total, option) => total + option.votes, 0);
    }
    /**
     * Calculates a rounded option share of the current vote total.
     * @param votes Vote count for one option.
     * @returns Rounded percentage of all votes.
     */
    percentage(votes) {
        const totalVotes = this.totalVotes();
        if (totalVotes === 0) {
            return 0;
        }
        return Math.round((votes / totalVotes) * 100);
    }
    static ɵfac = function PollResults_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PollResults)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PollResults, selectors: [["app-poll-results"]], inputs: { options: [1, "options"] }, decls: 2, vars: 1, consts: [[1, "results"], [1, "results-empty"], [1, "result"], [1, "result__label"], [1, "result__track"], [1, "result__bar"]], template: function PollResults_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵconditionalCreate(0, PollResults_Conditional_0_Template, 3, 0, "ul", 0)(1, PollResults_Conditional_1_Template, 5, 0, "div", 1);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.totalVotes() > 0 ? 0 : 1);
        } }, styles: [".results[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1.5rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.result__label[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-bottom: 0.5rem;\n  font-size: 0.875rem;\n}\n.result__label[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%color-result);\n}\n.result__track[_ngcontent-%COMP%] {\n  width: 15.9375rem;\n  max-width: 100%;\n  height: 0.875rem;\n  overflow: hidden;\n  border-radius: 1rem;\n  background: var(--%NS%color-track);\n}\n.result__bar[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background: var(--%NS%color-orange);\n  transition: width 220ms ease;\n}\n.results-empty[_ngcontent-%COMP%] {\n  max-width: 16rem;\n  color: rgb(34 18 39 / 70%);\n}\n.results-empty[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 2rem;\n  color: var(--%NS%color-text);\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PollResults, [{
        type: Component,
        args: [{ imports: [], selector: 'app-poll-results', template: "@if (totalVotes() > 0) {\n  <ul class=\"results\">\n    @for (option of options(); track option.id) {\n      <li class=\"result\">\n        <div class=\"result__label\">\n          <span>{{ option.text }}</span>\n          <strong>{{ percentage(option.votes) }}%</strong>\n        </div>\n        <div class=\"result__track\">\n          <span class=\"result__bar\" [style.width.%]=\"percentage(option.votes)\"></span>\n        </div>\n      </li>\n    }\n  </ul>\n} @else {\n  <div class=\"results-empty\">\n    <p>Results will be shown here after participants complete the survey.</p>\n    <strong>There are no answers yet.</strong>\n  </div>\n}\n", styles: [".results {\n  display: grid;\n  gap: 1.5rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.result__label {\n  display: flex;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-bottom: 0.5rem;\n  font-size: 0.875rem;\n}\n.result__label strong {\n  color: var(--color-result);\n}\n.result__track {\n  width: 15.9375rem;\n  max-width: 100%;\n  height: 0.875rem;\n  overflow: hidden;\n  border-radius: 1rem;\n  background: var(--color-track);\n}\n.result__bar {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background: var(--color-orange);\n  transition: width 220ms ease;\n}\n.results-empty {\n  max-width: 16rem;\n  color: rgb(34 18 39 / 70%);\n}\n.results-empty strong {\n  display: block;\n  margin-top: 2rem;\n  color: var(--color-text);\n}\n"] }]
    }], null, { options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: true }] }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PollResults, { className: "PollResults", filePath: "src/app/features/polls/components/poll-results/poll-results.ts", lineNumber: 11 }); })();
