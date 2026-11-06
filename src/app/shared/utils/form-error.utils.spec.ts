import { FormControl, Validators } from '@angular/forms';

import { isErrorVisible } from './form-error.utils';

describe('isErrorVisible', () => {

  function invalidTouchedDirty(): FormControl<string | null> {
    const control = new FormControl<string | null>('', Validators.required);
    control.markAsTouched();
    control.markAsDirty();
    return control;
  }

  it('retorna verdadeiro quando o controle é inválido, tocado e alterado, com enabledError verdadeiro', () => {
    expect(isErrorVisible(invalidTouchedDirty(), true)).toBeTrue();
  });

  it('retorna falso quando enabledError é falso', () => {
    expect(isErrorVisible(invalidTouchedDirty(), false)).toBeFalse();
  });

  it('retorna falso quando o controle não foi tocado', () => {
    const control = invalidTouchedDirty();
    control.markAsUntouched();
    expect(isErrorVisible(control, true)).toBeFalse();
  });

  it('retorna falso quando o controle está pristine', () => {
    const control = invalidTouchedDirty();
    control.markAsPristine();
    expect(isErrorVisible(control, true)).toBeFalse();
  });

  it('retorna falso quando o controle é válido', () => {
    const control = new FormControl<string | null>('ok', Validators.required);
    control.markAsTouched();
    control.markAsDirty();
    expect(isErrorVisible(control, true)).toBeFalse();
  });

  it('retorna falso quando não há controle', () => {
    expect(isErrorVisible(null, true)).toBeFalse();
  });
});
