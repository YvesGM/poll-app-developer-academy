import { FormArray } from '@angular/forms';
/**
 * Validates that a text control contains non-whitespace content.
 * @param control Form control to validate.
 * @returns Validation error for blank content, otherwise `null`.
 */
export function trimmedRequired(control) {
    return normalizeValue(control.value).length > 0 ? null : { trimmedRequired: true };
}
/**
 * Validates that non-empty answer options are unique.
 * @param control Form array to validate.
 * @returns Validation error for duplicates, otherwise `null`.
 */
export function uniqueOptions(control) {
    if (!(control instanceof FormArray)) {
        return null;
    }
    return hasDuplicateOptions(readNormalizedOptions(control)) ? { duplicateOptions: true } : null;
}
/**
 * Reads normalized values from an options form array.
 *
 * @param control Form array containing option controls.
 * @returns Normalized non-empty option values.
 */
function readNormalizedOptions(control) {
    return control.controls
        .map((option) => normalizeValue(option.value).toLocaleLowerCase())
        .filter((option) => option.length > 0);
}
/**
 * Checks whether a list contains duplicate values.
 *
 * @param options Normalized option values.
 * @returns Whether at least one duplicate exists.
 */
function hasDuplicateOptions(options) {
    return new Set(options).size !== options.length;
}
/**
 * Converts a form value to trimmed text.
 *
 * @param value Unknown form value.
 * @returns Trimmed string representation.
 */
function normalizeValue(value) {
    return String(value ?? '').trim();
}
