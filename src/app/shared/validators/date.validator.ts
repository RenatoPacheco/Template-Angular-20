import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export type DateFormat =
  | 'dd/MM/yyyy'
  | 'MM/dd/yyyy'
  | 'yyyy-MM-dd';

export function dateValidator(
  format: DateFormat = 'dd/MM/yyyy'
): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const value = String(control.value ?? '').trim();

    if (!value) {
      return null;
    }

    let day: number;
    let month: number;
    let year: number;

    switch (format) {

      case 'dd/MM/yyyy': {

        const match = value.match(
          /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/
        );

        if (!match) {
          return { date: true };
        }

        day = Number(match[1]);
        month = Number(match[2]);
        year = Number(match[3]);

        break;
      }

      case 'MM/dd/yyyy': {

        const match = value.match(
          /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/
        );

        if (!match) {
          return { date: true };
        }

        month = Number(match[1]);
        day = Number(match[2]);
        year = Number(match[3]);

        break;
      }

      case 'yyyy-MM-dd': {

        const match = value.match(
          /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
        );

        if (!match) {
          return { date: true };
        }

        year = Number(match[1]);
        month = Number(match[2]);
        day = Number(match[3]);

        break;
      }

      default:
        return { date: true };
    }

    const date = new Date(year, month - 1, day);

    const valid =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    return valid
      ? null
      : { date: true };
  };
}