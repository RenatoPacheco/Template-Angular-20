import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function timeSpanValidator(): ValidatorFn {

  const regex =
    /^(?:(\d+)\.)?([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?(?:\.(\d+))?$/;

  return (control: AbstractControl): ValidationErrors | null => {

    const value = String(control.value ?? '').trim();

    if (!value) {
      return null;
    }

    const match = regex.exec(value);

    if (!match) {
      return {
        invalidTimeSpan: true
      };
    }

    return null;
  };
}