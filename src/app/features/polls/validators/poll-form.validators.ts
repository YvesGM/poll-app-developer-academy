import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export const MINIMUM_DEADLINE_LEAD_MS = 5 * 60 * 1000;

/**
 * Validates that a text control contains non-whitespace content.
 * @param control Form control to validate.
 * @returns Validation error for blank content, otherwise `null`.
 */
export function trimmedRequired(control: AbstractControl): ValidationErrors | null {
  return normalizeValue(control.value).length > 0 ? null : { trimmedRequired: true };
}

/**
 * Validates that an optional deadline is at least five minutes ahead.
 * @param control Date-time form control.
 * @returns Validation error for too-soon or invalid dates, otherwise `null`.
 */
export function minimumFutureDate(control: AbstractControl): ValidationErrors | null {
  const value = normalizeValue(control.value);
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  const currentMinute = Math.floor(Date.now() / 60_000) * 60_000;
  const minimum = currentMinute + MINIMUM_DEADLINE_LEAD_MS;
  return Number.isFinite(timestamp) && timestamp >= minimum ? null : { minimumFutureDate: true };
}

/**
 * Validates that non-empty answer options are unique.
 * @param control Form array to validate.
 * @returns Validation error for duplicates, otherwise `null`.
 */
export function uniqueOptions(control: AbstractControl): ValidationErrors | null {
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
function readNormalizedOptions(control: FormArray): string[] {
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
function hasDuplicateOptions(options: string[]): boolean {
  return new Set(options).size !== options.length;
}

/**
 * Converts a form value to trimmed text.
 *
 * @param value Unknown form value.
 * @returns Trimmed string representation.
 */
function normalizeValue(value: unknown): string {
  return String(value ?? '').trim();
}
