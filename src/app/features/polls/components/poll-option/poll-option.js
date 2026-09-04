import { Component, input, output } from '@angular/core';
import * as i0 from "@angular/core";
export class PollOption {
    option = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "option" }] : /* istanbul ignore next */ []));
    disabled = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    voted = output();
    /** Emits the selected option identifier to the parent view. */
    vote() {
        this.voted.emit(this.option().id);
    }
    static ɵfac = function PollOption_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PollOption)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PollOption, selectors: [["app-poll-option"]], inputs: { option: [1, "option"], disabled: [1, "disabled"] }, outputs: { voted: "voted" }, decls: 4, vars: 2, consts: [["type", "button", 1, "answer", 3, "click", "disabled"], ["aria-hidden", "true", 1, "answer__box"]], template: function PollOption_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "button", 0);
            i0.ɵɵdomListener("click", function PollOption_Template_button_click_0_listener() { return ctx.vote(); });
            i0.ɵɵdomElement(1, "span", 1);
            i0.ɵɵdomElementStart(2, "span");
            i0.ɵɵtext(3);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵdomProperty("disabled", ctx.disabled());
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.option().text);
        } }, styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n.answer[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  min-height: 3rem;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.75rem 1rem;\n  border: 1px solid rgb(53 39 58 / 24%);\n  border-radius: 0.625rem;\n  color: var(--%NS%color-text);\n  background: var(--%NS%color-surface);\n  text-align: left;\n  cursor: pointer;\n}\n.answer[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--%NS%color-orange-soft);\n}\n.answer[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.72;\n}\n.answer__box[_ngcontent-%COMP%] {\n  width: 1.3125rem;\n  height: 1.3125rem;\n  flex: 0 0 auto;\n  border: 0.1875rem solid var(--%NS%color-purple);\n  border-radius: 0.2rem;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PollOption, [{
        type: Component,
        args: [{ imports: [], selector: 'app-poll-option', template: "<button class=\"answer\" type=\"button\" [disabled]=\"disabled()\" (click)=\"vote()\">\n  <span class=\"answer__box\" aria-hidden=\"true\"></span>\n  <span>{{ option().text }}</span>\n</button>\n", styles: [":host {\n  display: block;\n}\n.answer {\n  display: flex;\n  width: 100%;\n  min-height: 3rem;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.75rem 1rem;\n  border: 1px solid rgb(53 39 58 / 24%);\n  border-radius: 0.625rem;\n  color: var(--color-text);\n  background: var(--color-surface);\n  text-align: left;\n  cursor: pointer;\n}\n.answer:hover:not(:disabled) {\n  background: var(--color-orange-soft);\n}\n.answer:disabled {\n  cursor: not-allowed;\n  opacity: 0.72;\n}\n.answer__box {\n  width: 1.3125rem;\n  height: 1.3125rem;\n  flex: 0 0 auto;\n  border: 0.1875rem solid var(--color-purple);\n  border-radius: 0.2rem;\n}\n"] }]
    }], null, { option: [{ type: i0.Input, args: [{ isSignal: true, alias: "option", required: true }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], voted: [{ type: i0.Output, args: ["voted"] }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PollOption, { className: "PollOption", filePath: "src/app/features/polls/components/poll-option/poll-option.ts", lineNumber: 11 }); })();
