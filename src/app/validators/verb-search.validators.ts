import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates typed search text: empty is allowed; non-empty strings must be 2–200 chars
 * and match letters/spaces/hyphens/apostrophes. Selected autocomplete values (objects) skip checks.
 */
export function verbSearchTermValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || v === '') {
      return null;
    }
    if (typeof v !== 'string') {
      return null;
    }
    const s = v.trim();
    if (s.length === 0) {
      return null;
    }
    if (s.length < 2) {
      return { minSearchLength: { requiredLength: 2, actualLength: s.length } };
    }
    if (s.length > 200) {
      return { maxlength: { requiredLength: 200, actualLength: s.length } };
    }
    if (!/^[\p{L}\s'-]+$/u.test(s)) {
      return { searchPattern: true };
    }
    return null;
  };
}
