import { Injectable, signal } from '@angular/core';
import * as i0 from "@angular/core";
const CLOCK_UPDATE_INTERVAL_MS = 60_000;
export class CurrentTimeService {
    currentTimeState = signal(new Date(), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "currentTimeState" }] : /* istanbul ignore next */ []));
    intervalId = setInterval(() => this.currentTimeState.set(new Date()), CLOCK_UPDATE_INTERVAL_MS);
    currentTime = this.currentTimeState.asReadonly();
    /** Stops periodic time updates when the service is destroyed. */
    ngOnDestroy() {
        clearInterval(this.intervalId);
    }
    static ɵfac = function CurrentTimeService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CurrentTimeService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: CurrentTimeService, factory: CurrentTimeService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CurrentTimeService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], null, null); })();
