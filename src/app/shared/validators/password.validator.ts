import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export function passwordValidator(): ValidatorFn {

  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const password = String(value);

    const errors: ValidationErrors = {};

    if (password.length < 8) {
      errors['minLength'] = {
        actualLength: password.length,
        requiredLength: 8
      };
    }

    if (password.length > 30) {
      errors['maxlength'] = {
        actualLength: password.length,
        requiredLength: 30
      };
    }

    if (!/[A-Z]/.test(password)) {
      errors['uppercase'] = true;
    }

    if (!/[a-z]/.test(password)) {
      errors['lowercase'] = true;
    }

    if (!/\d/.test(password)) {
      errors['number'] = true;
    }

    if (!/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/.test(password)) {
      errors['specialChar'] = true;
    }

    return Object.keys(errors).length
      ? errors
      : null;
  };
}