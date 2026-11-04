import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FormDatepicker } from './form-datepicker';

@Component({
  imports: [ ReactiveFormsModule, FormDatepicker ],
  template: `<app-form-datepicker label="Data" [formControl]="control" />`
})
class HostDatepicker {
  control = new FormControl<string | null>(null);
}

function setup() {
  TestBed.configureTestingModule({ imports: [ HostDatepicker ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(HostDatepicker);
  fixture.detectChanges();

  const datepicker = fixture.debugElement.query(By.directive(FormDatepicker));
  return {
    fixture,
    host: fixture.componentInstance,
    component: datepicker.componentInstance as FormDatepicker,
    input: datepicker.query(By.css('input')).nativeElement as HTMLInputElement,
  };
}

describe('FormDatepicker (form-datepicker)', () => {

  it('escrita externa de texto vazio expõe null sem marcar o control', () => {
    const { fixture, component, host } = setup();

    host.control.setValue('');
    fixture.detectChanges();

    expect(component.value).toBeNull();
    expect(host.control.pristine).toBeTrue();
  });

  it('escrita externa de undefined expõe null', () => {
    const { fixture, component, host } = setup();

    host.control.setValue(undefined as unknown as string);
    fixture.detectChanges();

    expect(component.value).toBeNull();
  });

  it('escrita externa de null esvazia o campo', () => {
    const { fixture, input, host } = setup();

    host.control.setValue('10/03/2026');
    fixture.detectChanges();
    host.control.setValue(null);
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('desabilitar pelo control bloqueia o campo', () => {
    const { fixture, component, input, host } = setup();

    host.control.disable();
    fixture.detectChanges();

    expect(component.disabled).toBeTrue();
    expect(input.disabled).toBeTrue();
  });
});
