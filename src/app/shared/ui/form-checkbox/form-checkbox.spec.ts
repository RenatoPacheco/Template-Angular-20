import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FormCheckBox } from './form-checkbox';

@Component({
  imports: [ ReactiveFormsModule, FormCheckBox ],
  template: `<app-form-checkbox [formControl]="control" [value]="optionValue">Opção</app-form-checkbox>`
})
class HostCheckbox {
  control = new FormControl<string | null>(null);
  optionValue: string | null = 'id1';
}

function setup(prepare?: (host: HostCheckbox) => void) {
  TestBed.configureTestingModule({ imports: [ HostCheckbox ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(HostCheckbox);
  prepare?.(fixture.componentInstance);
  fixture.detectChanges();

  const checkbox = fixture.debugElement.query(By.directive(FormCheckBox));
  return {
    fixture,
    host: fixture.componentInstance,
    component: checkbox.componentInstance as FormCheckBox,
    input: checkbox.query(By.css('input')).nativeElement as HTMLInputElement,
  };
}

describe('FormCheckBox (form-check-options)', () => {

  it('fica marcado quando o modelo é igual ao valor da opção', () => {
    const { fixture, input, host } = setup();

    host.control.setValue('id1');
    fixture.detectChanges();

    expect(input.checked).toBeTrue();
  });

  it('fica desmarcado quando o modelo é null', () => {
    const { input } = setup();

    expect(input.checked).toBeFalse();
  });

  it('fica desmarcado quando o modelo é outra opção', () => {
    const { fixture, input, host } = setup();

    host.control.setValue('id2');
    fixture.detectChanges();

    expect(input.checked).toBeFalse();
  });

  it('nunca fica marcado a partir de null quando não há valor de opção', () => {
    const { fixture, input, host } = setup(h => h.optionValue = null);

    host.control.setValue(null);
    fixture.detectChanges();

    expect(input.checked).toBeFalse();
  });

  it('escrita programática não marca o control como dirty', () => {
    const { fixture, host } = setup();

    host.control.setValue('id1');
    fixture.detectChanges();

    expect(host.control.pristine).toBeTrue();
  });

  it('marcar grava o valor da opção', () => {
    const { input, host } = setup();

    input.click();

    expect(host.control.value).toBe('id1');
    expect(host.control.dirty).toBeTrue();
  });

  it('desmarcar emite null', () => {
    const { fixture, input, host } = setup();

    input.click();
    fixture.detectChanges();
    input.click();
    fixture.detectChanges();

    expect(host.control.value).toBeNull();
    expect(input.checked).toBeFalse();
  });
});
