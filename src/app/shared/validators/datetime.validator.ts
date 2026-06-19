import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { DateFormat, dateValidator } from "./date.validator";
import { timeSpanValidator } from "./timespan.validator";

export function dateTimeValidator(
  dateFormat: DateFormat = 'dd/MM/yyyy'
): ValidatorFn {

  const validateDate = dateValidator(dateFormat);
  const validateTime = timeSpanValidator();

  return (control: AbstractControl): ValidationErrors | null => {

    const value = String(control.value ?? '').trim();

    if (!value) {
      return null;
    }

    const separatorIndex = value.indexOf(' ');

    if (separatorIndex < 0) {
      return {
        invalidDateTime: true
      };
    }

    const datePart = value.substring(0, separatorIndex);
    const timePart = value.substring(separatorIndex + 1);

    const dateResult = validateDate({
      value: datePart
    } as AbstractControl);

    const timeResult = validateTime({
      value: timePart
    } as AbstractControl);

    if (!dateResult && !timeResult) {
      return null;
    }

    return {
      invalidDateTime: true,
      ...(dateResult ?? {}),
      ...(timeResult ?? {})
    };
  };
}