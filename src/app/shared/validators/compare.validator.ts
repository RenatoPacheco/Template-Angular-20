import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function compareValidator(
  compareTo: string
): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;
    const compareToValue = control.parent?.get(compareTo)?.value;

    if (!value) {
      return null;
    }

    if (value !== compareToValue) {
      return { 
        compare: true,
        compareTo: compareTo
      };
    }

    return null;
  };
}