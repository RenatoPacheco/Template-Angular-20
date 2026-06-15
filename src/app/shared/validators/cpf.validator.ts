import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const cpf = String(value).replace(/\D/g, '');

    if (cpf.length !== 11) {
      return { cpf: true };
    }

    // Rejeita CPFs com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { cpf: true };
    }

    // Primeiro dígito verificador
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += Number(cpf[i]) * (10 - i);
    }

    let digit = (sum * 10) % 11;

    if (digit === 10) {
      digit = 0;
    }

    if (digit !== Number(cpf[9])) {
      return { cpf: true };
    }

    // Segundo dígito verificador
    sum = 0;

    for (let i = 0; i < 10; i++) {
      sum += Number(cpf[i]) * (11 - i);
    }

    digit = (sum * 10) % 11;

    if (digit === 10) {
      digit = 0;
    }

    if (digit !== Number(cpf[10])) {
      return { cpf: true };
    }

    return null;
  };
}