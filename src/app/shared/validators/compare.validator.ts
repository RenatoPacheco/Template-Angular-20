import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function compareValidator(
  compareRef: string,
  compareLabel: string
): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;
    const compareToValue = control.parent?.get(compareRef)?.value;

    if (!value) {
      return null;
    }

    if (value !== compareToValue) {
      return { 
        compare: true,
        compareRef: compareRef,
        compareLabel: compareLabel
      };
    }

    return null;
  };
}