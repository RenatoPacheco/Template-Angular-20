import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function aliasValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const alias = String(value).trim();

    const regex = /^[a-zA-Z0-9._-]+$/;

    return regex.test(alias)
      ? null
      : { alias: true };
  };
}