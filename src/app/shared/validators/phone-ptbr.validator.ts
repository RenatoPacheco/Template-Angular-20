import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phonePtBrValidator(param: {
  format?: 'formatted' | 'numbers' | 'both',
  type?: 'cellphone' | 'landline' | 'both'
} = {
  format: 'both',
  type: 'both'
}): ValidatorFn {
  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const phone = String(value).trim();
    let result = {};
    let isValid = true;

    if (param.format === 'formatted') {
      if (param.type === 'cellphone') {
        isValid = /^\(\d{2}\) 9\d{4}-\d{4}$/.test(phone);
        result = { ...result, format: ['(DD) 9NNNN-NNNN'] };
      } else if (param.type === 'landline') {
        isValid = /^\(\d{2}\) \d{4}-\d{4}$/.test(phone);
        result = { ...result, format: ['(DD) NNNN-NNNN'] };
      } else {
        isValid = /^(\(\d{2}\) 9\d{4}-\d{4})|(\(\d{2}\) \d{4}-\d{4})$/.test(phone);
        result = { ...result, format: ['(DD) NNNN-NNNN', '(DD) 9NNNN-NNNN'] };
      }
    } else if (param.format === 'numbers') {
      if (param.type === 'cellphone') {
        isValid = /^\d{2}9\d{8}$/.test(phone);
        result = { ...result, format: ['DD9NNNNNNN'] };
      } else if (param.type === 'landline') {
        isValid = /^\d{10}$/.test(phone);
        result = { ...result, format: ['DDNNNNNNNN'] };
      } else {
        isValid = /^\d{2}9?\d{8}$/.test(phone);
        result = { ...result, format: ['DDNNNNNNNN', 'DD9NNNNNNN'] };
      }
    } else {
      if (param.type === 'cellphone') {
        isValid = /^(\(\d{2}\) 9\d{4}-\d{4}|\d{2}9\d{8})$/.test(phone);
        result = { ...result, format: ['(DD) 9NNNN-NNNN', 'DD9NNNNNNN'] };
      } else if (param.type === 'landline') {
        isValid = /^(\(\d{2}\) \d{4}-\d{4}|\d{2}\d{8})$/.test(phone);
        result = { ...result, format: ['(DD) NNNN-NNNN', 'DDNNNNNNNN'] };
      } else {
        isValid = /^(\d{2}9?\d{8})|(\(\d{2}\) 9?\d{4}-\d{4})$$/.test(phone);
        result = { ...result, format: ['(DD) NNNN-NNNN', '(DD) 9NNNN-NNNN', 'DDNNNNNNNN', 'DD9NNNNNNN'] };
      }
    }

    return isValid ? null : result;
  };
}