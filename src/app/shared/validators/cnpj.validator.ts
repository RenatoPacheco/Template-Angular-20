import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export function cnpjValidator(): ValidatorFn {

  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const cnpj = String(value).replace(/\D/g, '');

    if (cnpj.length !== 14) {
      return { cnpj: true };
    }

    // Rejeita sequências repetidas
    if (/^(\d)\1{13}$/.test(cnpj)) {
      return { cnpj: true };
    }

    const calculateDigit = (
      cnpj: string,
      weights: number[]
    ): number => {

      const sum = cnpj
        .split('')
        .reduce(
          (acc, digit, index) =>
            acc + Number(digit) * weights[index],
          0
        );

      const remainder = sum % 11;

      return remainder < 2
        ? 0
        : 11 - remainder;
    };

    const firstWeights = [
      5, 4, 3, 2, 9, 8,
      7, 6, 5, 4, 3, 2
    ];

    const secondWeights = [
      6, 5, 4, 3, 2, 9,
      8, 7, 6, 5, 4, 3, 2
    ];

    const digit1 = calculateDigit(
      cnpj.substring(0, 12),
      firstWeights
    );

    const digit2 = calculateDigit(
      cnpj.substring(0, 12) + digit1,
      secondWeights
    );

    if (
      digit1 !== Number(cnpj[12]) ||
      digit2 !== Number(cnpj[13])
    ) {
      return { cnpj: true };
    }

    return null;
  };
}