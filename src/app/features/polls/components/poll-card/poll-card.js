import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as i0 from "@angular/core";
const _c0 = a0 => ["/polls", a0];
function PollCard_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Ends ", i0.ɵɵpipeBind2(2, 1, ctx, "MMM d"));
} }
function PollCard_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "No deadline");
    i0.ɵɵelementEnd();
} }
export class PollCard {
    poll = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "poll" }] : /* istanbul ignore next */ []));
    highlight = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "highlight" }] : /* istanbul ignore next */ []));
    /**
     * Calculates the total votes displayed on the survey card.
     * @returns Sum of all option votes.
     */
    totalVotes() {
        return this.poll().options.reduce((total, option) => total + option.votes, 0);
    }
    static ɵfac = function PollCard_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PollCard)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PollCard, selectors: [["app-poll-card"]], inputs: { poll: [1, "poll"], highlight: [1, "highlight"] }, decls: 13, vars: 9, consts: [[1, "survey-card-link", 3, "routerLink"], [1, "survey-card"], [1, "survey-card__category"], [1, "survey-card__footer"], ["aria-hidden", "true", 1, "survey-card__arrow"]], template: function PollCard_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "a", 0)(1, "article", 1)(2, "p", 2);
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "h3");
            i0.ɵɵtext(5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 3)(7, "p");
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(9, PollCard_Conditional_9_Template, 3, 4, "p")(10, PollCard_Conditional_10_Template, 2, 0, "p");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "span", 4);
            i0.ɵɵtext(12, "\u2192");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            let tmp_5_0;
            i0.ɵɵclassProp("survey-card-link--highlight", ctx.highlight());
            i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(7, _c0, ctx.poll().id));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.poll().category);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.poll().title);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1("", ctx.totalVotes(), " participants");
            i0.ɵɵadvance();
            i0.ɵɵconditional((tmp_5_0 = ctx.poll().deadline) ? 9 : 10, tmp_5_0);
        } }, dependencies: [RouterLink, DatePipe], styles: [".survey-card-link[_ngcontent-%COMP%] {\n  display: block;\n  color: inherit;\n  text-decoration: none;\n}\n.survey-card[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 8.125rem;\n  padding: 1.5rem 4.5rem 1.5rem 1.5rem;\n  overflow: hidden;\n  border-radius: 0 3.125rem 0 0;\n  background: var(--%NS%color-card);\n  transition:\n    transform 160ms ease,\n    background 160ms ease;\n}\n.survey-card-link[_ngcontent-%COMP%]:hover   .survey-card[_ngcontent-%COMP%] {\n  background: var(--%NS%color-orange-soft);\n  transform: translateY(-0.2rem);\n}\n.survey-card__category[_ngcontent-%COMP%], \n.survey-card__footer[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.875rem;\n}\nh3[_ngcontent-%COMP%] {\n  margin: 0.65rem 0 1.1rem;\n  font: 400 1.75rem/1 var(--%NS%font-heading);\n}\n.survey-card__footer[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1.5rem;\n}\n.survey-card__footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.survey-card__arrow[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 1.6rem;\n  bottom: 1.4rem;\n  font-size: 2rem;\n}\n.survey-card-link--highlight[_ngcontent-%COMP%]   .survey-card[_ngcontent-%COMP%] {\n  min-height: 19.375rem;\n  padding: 2rem;\n  border-radius: 0 5rem 0 0;\n  background: var(--%NS%color-orange);\n}\n.survey-card-link--highlight[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  max-width: 15rem;\n  margin-top: 3rem;\n  font-size: 2.75rem;\n}\n.survey-card-link--highlight[_ngcontent-%COMP%]   .survey-card__footer[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 2rem;\n  bottom: 2rem;\n  left: 2rem;\n  justify-content: space-between;\n}\n@media (max-width: 48rem) {\n  .survey-card[_ngcontent-%COMP%] {\n    min-height: 8rem;\n  }\n  .survey-card-link--highlight[_ngcontent-%COMP%]   .survey-card[_ngcontent-%COMP%] {\n    min-height: 17rem;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PollCard, [{
        type: Component,
        args: [{ imports: [DatePipe, RouterLink], selector: 'app-poll-card', template: "<a\n  class=\"survey-card-link\"\n  [class.survey-card-link--highlight]=\"highlight()\"\n  [routerLink]=\"['/polls', poll().id]\"\n>\n  <article class=\"survey-card\">\n    <p class=\"survey-card__category\">{{ poll().category }}</p>\n    <h3>{{ poll().title }}</h3>\n    <div class=\"survey-card__footer\">\n      <p>{{ totalVotes() }} participants</p>\n      @if (poll().deadline; as deadline) {\n        <p>Ends {{ deadline | date: 'MMM d' }}</p>\n      } @else {\n        <p>No deadline</p>\n      }\n    </div>\n    <span class=\"survey-card__arrow\" aria-hidden=\"true\">\u2192</span>\n  </article>\n</a>\n", styles: [".survey-card-link {\n  display: block;\n  color: inherit;\n  text-decoration: none;\n}\n.survey-card {\n  position: relative;\n  min-height: 8.125rem;\n  padding: 1.5rem 4.5rem 1.5rem 1.5rem;\n  overflow: hidden;\n  border-radius: 0 3.125rem 0 0;\n  background: var(--color-card);\n  transition:\n    transform 160ms ease,\n    background 160ms ease;\n}\n.survey-card-link:hover .survey-card {\n  background: var(--color-orange-soft);\n  transform: translateY(-0.2rem);\n}\n.survey-card__category,\n.survey-card__footer {\n  margin: 0;\n  font-size: 0.875rem;\n}\nh3 {\n  margin: 0.65rem 0 1.1rem;\n  font: 400 1.75rem/1 var(--font-heading);\n}\n.survey-card__footer {\n  display: flex;\n  gap: 1.5rem;\n}\n.survey-card__footer p {\n  margin: 0;\n}\n.survey-card__arrow {\n  position: absolute;\n  right: 1.6rem;\n  bottom: 1.4rem;\n  font-size: 2rem;\n}\n.survey-card-link--highlight .survey-card {\n  min-height: 19.375rem;\n  padding: 2rem;\n  border-radius: 0 5rem 0 0;\n  background: var(--color-orange);\n}\n.survey-card-link--highlight h3 {\n  max-width: 15rem;\n  margin-top: 3rem;\n  font-size: 2.75rem;\n}\n.survey-card-link--highlight .survey-card__footer {\n  position: absolute;\n  right: 2rem;\n  bottom: 2rem;\n  left: 2rem;\n  justify-content: space-between;\n}\n@media (max-width: 48rem) {\n  .survey-card {\n    min-height: 8rem;\n  }\n  .survey-card-link--highlight .survey-card {\n    min-height: 17rem;\n  }\n}\n"] }]
    }], null, { poll: [{ type: i0.Input, args: [{ isSignal: true, alias: "poll", required: true }] }], highlight: [{ type: i0.Input, args: [{ isSignal: true, alias: "highlight", required: false }] }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PollCard, { className: "PollCard", filePath: "src/app/features/polls/components/poll-card/poll-card.ts", lineNumber: 13 }); })();
