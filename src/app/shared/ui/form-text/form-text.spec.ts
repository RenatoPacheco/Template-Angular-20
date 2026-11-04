import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormText } from './form-text';

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="Nome" [formControl]="control" />`
})
class HostText {
  control = new FormControl<string | null>(null);
}

@Component({
  imports: [ FormText ],
  template: `<app-form-text label="Nome" />`
})
class HostWithoutControl {}

@Component({
  imports: [ ReactiveFormsModule, FormText ],
  template: `<app-form-text label="CPF" id="cpf" [formControl]="control" />`
})
class HostWithId {
  control = new FormControl<string | null>(null);
}

function setup(prepare?: (host: HostText) => void) {
  TestBed.configureTestingModule({ imports: [ HostText ], providers: [ provideZonelessChangeDetection() ] });
  const fixture = TestBed.createComponent(HostText);
  prepare?.(fixture.componentInstance);
  fixture.detectChanges();

  const text = fixture.debugElement.query(By.directive(FormText));
  return {
    fixture,
    host: fixture.componentInstance,
    component: text.componentInstance as FormText,
    input: text.query(By.css('input')).nativeElement as HTMLInputElement,
  };
}

describe('FormText com FormControl (form-element-contract)', () => {

  it('falha ao criar sem FormControl', () => {
    TestBed.configureTestingModule({ imports: [ HostWithoutControl ], providers: [ provideZonelessChangeDetection() ] });
    expect(() => {
      TestBed.createComponent(HostWithoutControl).detectChanges();
    }).toThrow();
  });

  it('escrita programática exibe o valor e mantém o control pristine', () => {
    const { fixture, input, host } = setup();

    host.control.setValue('abc');
    fixture.detectChanges();

    expect(input.value).toBe('abc');
    expect(host.control.pristine).toBeTrue();
  });

  it('reset restaura estado limpo após alteração do usuário', () => {
    const { fixture, input, host } = setup();

    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.control.dirty).toBeTrue();

    host.control.reset();
    fixture.detectChanges();

    expect(host.control.pristine).toBeTrue();
    expect(host.control.untouched).toBeTrue();
  });

  it('digitação atualiza o modelo uma única vez', () => {
    const { input, host } = setup();
    const emitted: unknown[] = [];
    host.control.valueChanges.subscribe(v => emitted.push(v));

    input.value = 'abc';
    input.dispatchEvent(new Event('input'));

    expect(host.control.value).toBe('abc');
    expect(host.control.dirty).toBeTrue();
    expect(emitted).toEqual(['abc']);
  });

  it('sair do campo marca touched sem alterar pristine', () => {
    const { input, host } = setup();

    input.dispatchEvent(new Event('blur'));

    expect(host.control.touched).toBeTrue();
    expect(host.control.pristine).toBeTrue();
  });

  it('exibe estado inválido na primeira renderização', () => {
    const { component } = setup(host => {
      host.control.setValidators(Validators.required);
      host.control.updateValueAndValidity();
    });

    expect(component.isInvalid()).toBeTrue();
  });

  it('reflete disable() feito pelo control', () => {
    const { fixture, input, component, host } = setup();

    host.control.disable();
    fixture.detectChanges();

    expect(component.disabled).toBeTrue();
    expect(input.disabled).toBeTrue();
  });

  it('gera ids únicos quando o consumidor não informa um', () => {
    TestBed.configureTestingModule({ imports: [ HostText ], providers: [ provideZonelessChangeDetection() ] });
    const first = TestBed.createComponent(HostText);
    const second = TestBed.createComponent(HostText);
    first.detectChanges();
    second.detectChanges();

    const idOf = (f: typeof first) =>
      (f.debugElement.query(By.directive(FormText)).componentInstance as FormText).id;

    expect(idOf(first)).toBeTruthy();
    expect(idOf(first)).not.toBe(idOf(second));
  });

  it('usa o id informado pelo consumidor', () => {
    TestBed.configureTestingModule({ imports: [ HostWithId ], providers: [ provideZonelessChangeDetection() ] });
    const fixture = TestBed.createComponent(HostWithId);
    fixture.detectChanges();

    const text = fixture.debugElement.query(By.directive(FormText)).componentInstance as FormText;
    expect(text.id).toBe('cpf');
  });

  it('limpar redefine o valor e devolve o foco ao campo', () => {
    const { fixture, component, input, host } = setup();
    host.control.setValue('abc');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    component.clear();
    fixture.detectChanges();

    expect(host.control.value).toBeNull();
    expect(host.control.pristine).toBeTrue();
    expect(host.control.untouched).toBeTrue();
    expect(document.activeElement).toBe(input);
  });
});
