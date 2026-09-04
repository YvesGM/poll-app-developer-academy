import { Component, input } from '@angular/core';
import * as i0 from "@angular/core";
export class AppLogo {
    tone = input('orange', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tone" }] : /* istanbul ignore next */ []));
    static ɵfac = function AppLogo_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppLogo)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppLogo, selectors: [["app-logo"]], inputs: { tone: [1, "tone"] }, decls: 5, vars: 2, consts: [["aria-label", "Poll App", 1, "logo"], [1, "logo__poll"], [1, "logo__app"]], template: function AppLogo_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "span", 0)(1, "span", 1);
            i0.ɵɵtext(2, "POLL");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(3, "span", 2);
            i0.ɵɵtext(4, "APP");
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵclassProp("logo--dark", ctx.tone() === "dark");
        } }, styles: ["[_nghost-%COMP%] {\n  display: inline-block;\n}\n\n.logo[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  color: var(--%NS%color-orange);\n  font-family: var(--%NS%font-heading);\n  font-size: 2rem;\n  line-height: 0.7;\n  letter-spacing: 0.04em;\n  transform: rotate(-3deg);\n}\n\n.logo__app[_ngcontent-%COMP%] {\n  align-self: flex-end;\n  font-size: 1.25rem;\n}\n\n.logo--dark[_ngcontent-%COMP%] {\n  color: var(--%NS%color-purple);\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppLogo, [{
        type: Component,
        args: [{ selector: 'app-logo', template: "<span class=\"logo\" [class.logo--dark]=\"tone() === 'dark'\" aria-label=\"Poll App\">\n  <span class=\"logo__poll\">POLL</span>\n  <span class=\"logo__app\">APP</span>\n</span>\n", styles: [":host {\n  display: inline-block;\n}\n\n.logo {\n  display: inline-flex;\n  flex-direction: column;\n  color: var(--color-orange);\n  font-family: var(--font-heading);\n  font-size: 2rem;\n  line-height: 0.7;\n  letter-spacing: 0.04em;\n  transform: rotate(-3deg);\n}\n\n.logo__app {\n  align-self: flex-end;\n  font-size: 1.25rem;\n}\n\n.logo--dark {\n  color: var(--color-purple);\n}\n"] }]
    }], null, { tone: [{ type: i0.Input, args: [{ isSignal: true, alias: "tone", required: false }] }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppLogo, { className: "AppLogo", filePath: "src/app/shared/components/app-logo/app-logo.ts", lineNumber: 10 }); })();
