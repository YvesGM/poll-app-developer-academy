import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
export class SupabaseService {
    client = createClient(environment.supabaseUrl, environment.supabasePublishableKey);
    static ɵfac = function SupabaseService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SupabaseService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: SupabaseService, factory: SupabaseService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SupabaseService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], null, null); })();
