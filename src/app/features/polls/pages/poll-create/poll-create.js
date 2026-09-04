import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, } from '@angular/forms';
import { POLL_CATEGORIES } from '../../models/poll.model';
import { PollService } from '../../services/poll';
import { trimmedRequired, uniqueOptions } from '../../validators/poll-form.validators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function PollCreate_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1, "Enter a name with no more than 120 characters.");
    i0.ɵɵelementEnd();
} }
function PollCreate_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1, "Use no more than 1000 characters.");
    i0.ɵɵelementEnd();
} }
function PollCreate_For_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const category_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", category_r1);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(category_r1);
} }
function PollCreate_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1, "Enter a question between 3 and 250 characters.");
    i0.ɵɵelementEnd();
} }
function PollCreate_For_44_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1, "Enter an answer with no more than 120 characters.");
    i0.ɵɵelementEnd();
} }
function PollCreate_For_44_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 22);
    i0.ɵɵelement(1, "input", 28);
    i0.ɵɵcontrolCreate();
    i0.ɵɵelementStart(2, "button", 29);
    i0.ɵɵlistener("click", function PollCreate_For_44_Template_button_click_2_listener() { const $index_r3 = i0.ɵɵrestoreView(_r2).$index; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.removeOption($index_r3)); });
    i0.ɵɵtext(3, " \u00D7 ");
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, PollCreate_For_44_Conditional_4_Template, 2, 0, "p", 9);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r5 = ctx.$implicit;
    const $index_r3 = ctx.$index;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("id", "option-" + $index_r3)("formControlName", $index_r3);
    i0.ɵɵattribute("aria-label", "Answer " + ($index_r3 + 1));
    i0.ɵɵcontrol();
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r3.options.length <= 2);
    i0.ɵɵattribute("aria-label", "Delete answer " + ($index_r3 + 1));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(option_r5.touched && option_r5.invalid ? 4 : -1);
} }
function PollCreate_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1, "Each answer must be unique.");
    i0.ɵɵelementEnd();
} }
function PollCreate_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r3.error());
} }
function PollCreate_Conditional_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Publishing... ");
} }
function PollCreate_Conditional_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Publish Survey ");
} }
export class PollCreate {
    formBuilder = inject(FormBuilder);
    pollService = inject(PollService);
    created = output();
    cancelled = output();
    saving = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "saving" }] : /* istanbul ignore next */ []));
    error = this.pollService.error;
    categories = POLL_CATEGORIES;
    form = this.formBuilder.nonNullable.group({
        category: this.formBuilder.nonNullable.control('Technology', [
            Validators.required,
        ]),
        title: ['', [trimmedRequired, Validators.minLength(1), Validators.maxLength(120)]],
        question: ['', [trimmedRequired, Validators.minLength(3), Validators.maxLength(250)]],
        description: ['', [Validators.maxLength(1000)]],
        deadline: [''],
        options: this.formBuilder.nonNullable.array([this.createOptionControl(), this.createOptionControl()], [Validators.minLength(2), uniqueOptions]),
    });
    /**
     * Returns the answer option form array.
     * @returns Mutable option controls.
     */
    get options() {
        return this.form.controls.options;
    }
    /** Adds one empty answer option to the form. */
    addOption() {
        this.options.push(this.createOptionControl());
        this.options.updateValueAndValidity();
    }
    /**
     * Removes one answer option while preserving the minimum of two.
     * @param index Index of the option control to remove.
     */
    removeOption(index) {
        if (this.options.length <= 2) {
            return;
        }
        this.options.removeAt(index);
        this.options.updateValueAndValidity();
    }
    /** Cancels survey creation when no save request is running. */
    cancel() {
        if (this.saving()) {
            return;
        }
        this.pollService.clearError();
        this.cancelled.emit();
    }
    /** Validates and persists the current survey form. */
    async submit() {
        if (!this.canSubmit()) {
            this.form.markAllAsTouched();
            return;
        }
        await this.saveSurvey(this.buildCreatePollInput());
    }
    /**
     * Checks whether the form can be submitted.
     * @returns Whether the form is valid and idle.
     */
    canSubmit() {
        return this.form.valid && !this.saving();
    }
    /**
     * Builds normalized survey input from the current form value.
     * @returns Normalized survey creation input.
     */
    buildCreatePollInput() {
        const value = this.form.getRawValue();
        return {
            category: value.category,
            title: value.title.trim(),
            question: value.question.trim(),
            description: value.description.trim() || null,
            deadline: value.deadline ? new Date(value.deadline) : null,
            options: value.options.map((option) => option.trim()),
        };
    }
    /**
     * Persists one survey and emits the result to the parent component.
     * @param input Normalized survey creation input.
     */
    async saveSurvey(input) {
        this.saving.set(true);
        this.pollService.clearError();
        try {
            const poll = await this.pollService.createPoll(input);
            if (poll)
                this.created.emit(poll);
        }
        finally {
            this.saving.set(false);
        }
    }
    /**
     * Creates one validated answer option control.
     * @returns Non-nullable option control.
     */
    createOptionControl() {
        return this.formBuilder.nonNullable.control('', [trimmedRequired, Validators.maxLength(120)]);
    }
    static ɵfac = function PollCreate_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PollCreate)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PollCreate, selectors: [["app-poll-create"]], outputs: { created: "created", cancelled: "cancelled" }, decls: 55, vars: 9, consts: [[1, "create"], [1, "create__header"], [1, "draft-pill"], ["type", "button", 1, "button", "button--secondary", 3, "click", "disabled"], [3, "ngSubmit", "formGroup"], ["aria-label", "Survey information", 1, "survey-fields"], [1, "field"], ["for", "title"], ["id", "title", "type", "text", "formControlName", "title", "placeholder", "Name your survey"], [1, "field-error"], [1, "field", "field--description"], ["for", "description"], ["id", "description", "formControlName", "description", "placeholder", "Describe your survey"], ["for", "deadline"], ["id", "deadline", "type", "datetime-local", "formControlName", "deadline"], ["for", "category"], ["id", "category", "formControlName", "category"], [3, "value"], ["aria-labelledby", "question-label", 1, "question-block"], ["id", "question-label", "for", "question"], ["id", "question", "type", "text", "formControlName", "question", "placeholder", "Type your question"], ["formArrayName", "options"], [1, "answer-field"], ["type", "button", 1, "add-answer", 3, "click"], ["aria-hidden", "true"], ["role", "alert", 1, "form-error"], [1, "create__footer"], ["type", "submit", 1, "button", "button--primary", 3, "disabled"], ["type", "text", "placeholder", "Type your answer", 3, "id", "formControlName"], ["type", "button", 1, "delete-button", 3, "click", "disabled"]], template: function PollCreate_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "article", 0)(1, "header", 1)(2, "div")(3, "span", 2);
            i0.ɵɵtext(4, "Draft");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h1");
            i0.ɵɵtext(6, "Create Survey");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "button", 3);
            i0.ɵɵlistener("click", function PollCreate_Template_button_click_7_listener() { return ctx.cancel(); });
            i0.ɵɵtext(8, " Cancel ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "form", 4);
            i0.ɵɵlistener("ngSubmit", function PollCreate_Template_form_ngSubmit_9_listener() { return ctx.submit(); });
            i0.ɵɵelementStart(10, "section", 5)(11, "div", 6)(12, "label", 7);
            i0.ɵɵtext(13, "Survey Name*");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(14, "input", 8);
            i0.ɵɵcontrolCreate();
            i0.ɵɵconditionalCreate(15, PollCreate_Conditional_15_Template, 2, 0, "p", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "div", 10)(17, "label", 11);
            i0.ɵɵtext(18, "Description");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(19, "textarea", 12);
            i0.ɵɵcontrolCreate();
            i0.ɵɵconditionalCreate(20, PollCreate_Conditional_20_Template, 2, 0, "p", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "div", 6)(22, "label", 13);
            i0.ɵɵtext(23, "End date");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(24, "input", 14);
            i0.ɵɵcontrolCreate();
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "div", 6)(26, "label", 15);
            i0.ɵɵtext(27, "Category*");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "select", 16);
            i0.ɵɵrepeaterCreate(29, PollCreate_For_30_Template, 2, 2, "option", 17, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd();
            i0.ɵɵcontrolCreate();
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "section", 18)(32, "header")(33, "span");
            i0.ɵɵtext(34, "Question 1");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(35, "div", 6)(36, "label", 19);
            i0.ɵɵtext(37, "Question*");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(38, "input", 20);
            i0.ɵɵcontrolCreate();
            i0.ɵɵconditionalCreate(39, PollCreate_Conditional_39_Template, 2, 0, "p", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "fieldset", 21)(41, "legend");
            i0.ɵɵtext(42, "Answers*");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(43, PollCreate_For_44_Template, 5, 6, "div", 22, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵconditionalCreate(45, PollCreate_Conditional_45_Template, 2, 0, "p", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "button", 23);
            i0.ɵɵlistener("click", function PollCreate_Template_button_click_46_listener() { return ctx.addOption(); });
            i0.ɵɵelementStart(47, "span", 24);
            i0.ɵɵtext(48, "\uFF0B");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(49, " Add answer ");
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(50, PollCreate_Conditional_50_Template, 2, 1, "p", 25);
            i0.ɵɵelementStart(51, "footer", 26)(52, "button", 27);
            i0.ɵɵconditionalCreate(53, PollCreate_Conditional_53_Template, 1, 0)(54, PollCreate_Conditional_54_Template, 1, 0);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("disabled", ctx.saving());
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(5);
            i0.ɵɵcontrol();
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.form.controls.title.touched && ctx.form.controls.title.invalid ? 15 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵcontrol();
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.form.controls.description.touched && ctx.form.controls.description.invalid ? 20 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(4);
            i0.ɵɵcontrol();
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.categories);
            i0.ɵɵadvance(9);
            i0.ɵɵcontrol();
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.form.controls.question.touched && ctx.form.controls.question.invalid ? 39 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵrepeater(ctx.options.controls);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.options.touched && ctx.options.hasError("duplicateOptions") ? 45 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.error() ? 50 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.saving());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.saving() ? 53 : 54);
        } }, dependencies: [ReactiveFormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i1.FormArrayName], styles: ["[_nghost-%COMP%] {\n  display: block;\n  color: var(--%NS%color-surface);\n}\n.create[_ngcontent-%COMP%] {\n  padding: 3rem 3.5rem;\n}\n.create__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  gap: 2rem;\n  margin-bottom: 2rem;\n}\n.draft-pill[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.125rem 0.625rem;\n  border-radius: 1.25rem;\n  color: var(--%NS%color-purple);\n  background: var(--%NS%color-orange-soft);\n  font: 0.75rem var(--%NS%font-button);\n}\nh1[_ngcontent-%COMP%] {\n  margin: 0.5rem 0 0;\n  color: var(--%NS%color-orange);\n  font: 400 3.5rem/1 var(--%NS%font-heading);\n}\nform[_ngcontent-%COMP%] {\n  padding: 2.5rem;\n  border-radius: 0 5rem 0 0;\n  background: rgb(254 253 255 / 9%);\n}\n.survey-fields[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1.5rem 3.5rem;\n}\n.field[_ngcontent-%COMP%] {\n  display: grid;\n  align-content: start;\n  gap: 0.45rem;\n}\n.field--description[_ngcontent-%COMP%] {\n  grid-row: span 2;\n}\nlabel[_ngcontent-%COMP%], \nlegend[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 700;\n}\ninput[_ngcontent-%COMP%], \nselect[_ngcontent-%COMP%], \ntextarea[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 2.3125rem;\n  padding: 0.55rem 0.75rem;\n  border: 1px solid transparent;\n  border-radius: 0.35rem;\n  color: var(--%NS%color-text);\n  background: var(--%NS%color-surface);\n}\ntextarea[_ngcontent-%COMP%] {\n  min-height: 6.75rem;\n  resize: vertical;\n}\n.question-block[_ngcontent-%COMP%] {\n  width: min(100%, 26.8125rem);\n  margin-top: 2.5rem;\n  padding: 1.5rem;\n  color: var(--%NS%color-text);\n  background: var(--%NS%color-card);\n}\n.question-block[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 1rem;\n  font: 400 1.5rem var(--%NS%font-heading);\n}\nfieldset[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.75rem;\n  margin: 1.25rem 0 0;\n  padding: 0;\n  border: 0;\n}\nlegend[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.answer-field[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1.625rem;\n  gap: 0.5rem;\n}\n.answer-field[_ngcontent-%COMP%]   .field-error[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n}\n.delete-button[_ngcontent-%COMP%] {\n  width: 1.625rem;\n  height: 1.625rem;\n  align-self: center;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  color: var(--%NS%color-surface);\n  background: var(--%NS%color-purple);\n  cursor: pointer;\n}\n.delete-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n.add-answer[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  margin-top: 1rem;\n  padding: 0;\n  border: 0;\n  color: var(--%NS%color-purple);\n  background: transparent;\n  font: 700 0.875rem var(--%NS%font-button);\n  cursor: pointer;\n}\n.add-answer[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.field-error[_ngcontent-%COMP%], \n.form-error[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--%NS%color-orange);\n  font-size: 0.75rem;\n}\n.question-block[_ngcontent-%COMP%]   .field-error[_ngcontent-%COMP%] {\n  color: #8c2f25;\n}\n.create__footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 2rem;\n}\n@media (max-width: 48rem) {\n  .create[_ngcontent-%COMP%] {\n    min-height: 100vh;\n    padding: 2.5rem 1rem 3rem;\n  }\n  .create__header[_ngcontent-%COMP%] {\n    padding: 0 0.5rem;\n  }\n  h1[_ngcontent-%COMP%] {\n    font-size: 3rem;\n  }\n  form[_ngcontent-%COMP%] {\n    padding: 1.5rem 0.5rem;\n    border-radius: 0 3rem 0 0;\n  }\n  .survey-fields[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n  }\n  .field--description[_ngcontent-%COMP%] {\n    grid-row: auto;\n  }\n  .question-block[_ngcontent-%COMP%] {\n    width: 100%;\n    margin-top: 2rem;\n    padding: 1rem;\n  }\n  .create__footer[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PollCreate, [{
        type: Component,
        args: [{ imports: [ReactiveFormsModule], selector: 'app-poll-create', template: "<article class=\"create\">\n  <header class=\"create__header\">\n    <div>\n      <span class=\"draft-pill\">Draft</span>\n      <h1>Create Survey</h1>\n    </div>\n    <button class=\"button button--secondary\" type=\"button\" [disabled]=\"saving()\" (click)=\"cancel()\">\n      Cancel\n    </button>\n  </header>\n\n  <form [formGroup]=\"form\" (ngSubmit)=\"submit()\">\n    <section class=\"survey-fields\" aria-label=\"Survey information\">\n      <div class=\"field\">\n        <label for=\"title\">Survey Name*</label\n        ><input id=\"title\" type=\"text\" formControlName=\"title\" placeholder=\"Name your survey\" />\n        @if (form.controls.title.touched && form.controls.title.invalid) {\n          <p class=\"field-error\">Enter a name with no more than 120 characters.</p>\n        }\n      </div>\n      <div class=\"field field--description\">\n        <label for=\"description\">Description</label\n        ><textarea\n          id=\"description\"\n          formControlName=\"description\"\n          placeholder=\"Describe your survey\"\n        ></textarea>\n        @if (form.controls.description.touched && form.controls.description.invalid) {\n          <p class=\"field-error\">Use no more than 1000 characters.</p>\n        }\n      </div>\n      <div class=\"field\">\n        <label for=\"deadline\">End date</label\n        ><input id=\"deadline\" type=\"datetime-local\" formControlName=\"deadline\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"category\">Category*</label\n        ><select id=\"category\" formControlName=\"category\">\n          @for (category of categories; track category) {\n            <option [value]=\"category\">{{ category }}</option>\n          }\n        </select>\n      </div>\n    </section>\n\n    <section class=\"question-block\" aria-labelledby=\"question-label\">\n      <header><span>Question 1</span></header>\n      <div class=\"field\">\n        <label id=\"question-label\" for=\"question\">Question*</label\n        ><input\n          id=\"question\"\n          type=\"text\"\n          formControlName=\"question\"\n          placeholder=\"Type your question\"\n        />\n        @if (form.controls.question.touched && form.controls.question.invalid) {\n          <p class=\"field-error\">Enter a question between 3 and 250 characters.</p>\n        }\n      </div>\n\n      <fieldset formArrayName=\"options\">\n        <legend>Answers*</legend>\n        @for (option of options.controls; track option) {\n          <div class=\"answer-field\">\n            <input\n              [id]=\"'option-' + $index\"\n              type=\"text\"\n              [formControlName]=\"$index\"\n              [attr.aria-label]=\"'Answer ' + ($index + 1)\"\n              placeholder=\"Type your answer\"\n            />\n            <button\n              class=\"delete-button\"\n              type=\"button\"\n              [disabled]=\"options.length <= 2\"\n              [attr.aria-label]=\"'Delete answer ' + ($index + 1)\"\n              (click)=\"removeOption($index)\"\n            >\n              \u00D7\n            </button>\n            @if (option.touched && option.invalid) {\n              <p class=\"field-error\">Enter an answer with no more than 120 characters.</p>\n            }\n          </div>\n        }\n        @if (options.touched && options.hasError('duplicateOptions')) {\n          <p class=\"field-error\">Each answer must be unique.</p>\n        }\n      </fieldset>\n      <button class=\"add-answer\" type=\"button\" (click)=\"addOption()\">\n        <span aria-hidden=\"true\">\uFF0B</span> Add answer\n      </button>\n    </section>\n\n    @if (error()) {\n      <p class=\"form-error\" role=\"alert\">{{ error() }}</p>\n    }\n    <footer class=\"create__footer\">\n      <button class=\"button button--primary\" type=\"submit\" [disabled]=\"saving()\">\n        @if (saving()) {\n          Publishing...\n        } @else {\n          Publish Survey\n        }\n      </button>\n    </footer>\n  </form>\n</article>\n", styles: [":host {\n  display: block;\n  color: var(--color-surface);\n}\n.create {\n  padding: 3rem 3.5rem;\n}\n.create__header {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  gap: 2rem;\n  margin-bottom: 2rem;\n}\n.draft-pill {\n  display: inline-block;\n  padding: 0.125rem 0.625rem;\n  border-radius: 1.25rem;\n  color: var(--color-purple);\n  background: var(--color-orange-soft);\n  font: 0.75rem var(--font-button);\n}\nh1 {\n  margin: 0.5rem 0 0;\n  color: var(--color-orange);\n  font: 400 3.5rem/1 var(--font-heading);\n}\nform {\n  padding: 2.5rem;\n  border-radius: 0 5rem 0 0;\n  background: rgb(254 253 255 / 9%);\n}\n.survey-fields {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1.5rem 3.5rem;\n}\n.field {\n  display: grid;\n  align-content: start;\n  gap: 0.45rem;\n}\n.field--description {\n  grid-row: span 2;\n}\nlabel,\nlegend {\n  font-size: 0.875rem;\n  font-weight: 700;\n}\ninput,\nselect,\ntextarea {\n  width: 100%;\n  min-height: 2.3125rem;\n  padding: 0.55rem 0.75rem;\n  border: 1px solid transparent;\n  border-radius: 0.35rem;\n  color: var(--color-text);\n  background: var(--color-surface);\n}\ntextarea {\n  min-height: 6.75rem;\n  resize: vertical;\n}\n.question-block {\n  width: min(100%, 26.8125rem);\n  margin-top: 2.5rem;\n  padding: 1.5rem;\n  color: var(--color-text);\n  background: var(--color-card);\n}\n.question-block > header {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 1rem;\n  font: 400 1.5rem var(--font-heading);\n}\nfieldset {\n  display: grid;\n  gap: 0.75rem;\n  margin: 1.25rem 0 0;\n  padding: 0;\n  border: 0;\n}\nlegend {\n  margin-bottom: 0.5rem;\n}\n.answer-field {\n  display: grid;\n  grid-template-columns: 1fr 1.625rem;\n  gap: 0.5rem;\n}\n.answer-field .field-error {\n  grid-column: 1 / -1;\n}\n.delete-button {\n  width: 1.625rem;\n  height: 1.625rem;\n  align-self: center;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  color: var(--color-surface);\n  background: var(--color-purple);\n  cursor: pointer;\n}\n.delete-button:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n.add-answer {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  margin-top: 1rem;\n  padding: 0;\n  border: 0;\n  color: var(--color-purple);\n  background: transparent;\n  font: 700 0.875rem var(--font-button);\n  cursor: pointer;\n}\n.add-answer span {\n  font-size: 1.25rem;\n}\n.field-error,\n.form-error {\n  margin: 0;\n  color: var(--color-orange);\n  font-size: 0.75rem;\n}\n.question-block .field-error {\n  color: #8c2f25;\n}\n.create__footer {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 2rem;\n}\n@media (max-width: 48rem) {\n  .create {\n    min-height: 100vh;\n    padding: 2.5rem 1rem 3rem;\n  }\n  .create__header {\n    padding: 0 0.5rem;\n  }\n  h1 {\n    font-size: 3rem;\n  }\n  form {\n    padding: 1.5rem 0.5rem;\n    border-radius: 0 3rem 0 0;\n  }\n  .survey-fields {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n  }\n  .field--description {\n    grid-row: auto;\n  }\n  .question-block {\n    width: 100%;\n    margin-top: 2rem;\n    padding: 1rem;\n  }\n  .create__footer .button {\n    width: 100%;\n  }\n}\n"] }]
    }], null, { created: [{ type: i0.Output, args: ["created"] }], cancelled: [{ type: i0.Output, args: ["cancelled"] }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PollCreate, { className: "PollCreate", filePath: "src/app/features/polls/pages/poll-create/poll-create.ts", lineNumber: 20 }); })();
