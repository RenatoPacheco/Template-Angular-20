import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value = control.value;

    if (value === null || value === undefined) {
      return { required: true };
    }

    if (typeof value === 'string' && value.trim() === '') {
      return { required: true };
    }

    if (Array.isArray(value) && value.length === 0) {
      return { required: true };
    }

    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
      return { required: true };
    }

    if (typeof value === 'number' && isNaN(value)) {
      return { required: true };
    }

    return null;
  };
}