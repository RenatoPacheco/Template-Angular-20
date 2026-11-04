import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FormDatepicker } from './form-datepicker';

@Component({
  imports: [ ReactiveFormsModule, FormDatepicker ],
  template: `<app-form-datepicker label="Data" min-date="01/01/2026" [formControl]="control" />`
})
class HostDatepicker {
  control = new FormControl<string | null>(null);
}

@Component({
  imports: [ ReactiveFormsModule, FormDatepicker ],
  template: `<app-form-datepicker label="Período" mode="range" [formControl]="control" />`
})
class HostRange {
  control = new FormControl<{ start: string | null; end: string | null } | null>(null);
}

function setupSingle(prepare?: (host: HostDatepicker) => void) {
  TestBed.configureTestingModule({
    imports: [ HostDatepicker ],
    providers: [ provideZonelessChangeDetection() ],
  });
  const fixture = TestBed.createComponent(HostDatepicker);
  prepare?.(fixture.componentInstance);
  fixture.detectChanges();

  const datepicker = fixture.debugElement.query(By.directive(FormDatepicker));
  return {
    fixture,
    host: fixture.componentInstance,
    component: datepicker.componentInstance as FormDatepicker,
    input: datepicker.query(By.css('input')).nativeElement as HTMLInputElement,
    calendarButton: datepicker.query(By.css('button.action-calendar')).nativeElement as HTMLButtonElement,
  };
}

function setupRange() {
  TestBed.configureTestingModule({
    imports: [ HostRange ],
    providers: [ provideZonelessChangeDetection() ],
  });
  const fixture = TestBed.createComponent(HostRange);
  fixture.detectChanges();

  const datepicker = fixture.debugElement.query(By.directive(FormDatepicker));
  return {
    fixture,
    component: datepicker.componentInstance as FormDatepicker,
    inputs: datepicker.queryAll(By.css('input')).map(d => d.nativeElement as HTMLInputElement),
    startButton: datepicker.query(By.css('button[title="clique para abrir o calendário de início"]'))
      .nativeElement as HTMLButtonElement,
    endButton: datepicker.query(By.css('button[title="clique para abrir o calendário de fim"]'))
      .nativeElement as HTMLButtonElement,
  };
}

function typeText(fixture: { detectChanges: () => void }, input: HTMLInputElement, text: string) {
  input.value = text;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

function togglePopup(fixture: { detectChanges: () => void }, button: HTMLButtonElement) {
  button.click();
  fixture.detectChanges();
}

function clearButtonOf(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return fixture.debugElement.query(By.css('button.action-clear')).nativeElement as HTMLButtonElement;
}

function popup(): HTMLElement | null {
  return document.querySelector('ngb-datepicker');
}

function selectedDays(): string[] {
  return Array.from(document.querySelectorAll('ngb-datepicker .ngb-dp-day[aria-selected="true"]'))
    .map(el => el.textContent?.trim() ?? '');
}

function viewKey(): string {
  return document.querySelectorAll('ngb-datepicker .ngb-dp-day')[15]?.getAttribute('aria-label') ?? '';
}

function clickNextMonth(fixture: { detectChanges: () => void }) {
  (document.querySelector('ngb-datepicker button[aria-label="Next month"]') as HTMLButtonElement).click();
  fixture.detectChanges();
}

describe('FormDatepicker (form-datepicker)', () => {

  afterEach(() => {
    document.querySelectorAll('ngb-datepicker').forEach(el => el.remove());
  });

  it('escrita externa de texto vazio expõe null sem marcar o control', () => {
    const { fixture, component, host } = setupSingle();

    host.control.setValue('');
    fixture.detectChanges();

    expect(component.value).toBeNull();
    expect(host.control.pristine).toBeTrue();
  });

  it('escrita externa de undefined expõe null', () => {
    const { fixture, component, host } = setupSingle();

    host.control.setValue(undefined as unknown as string);
    fixture.detectChanges();

    expect(component.value).toBeNull();
  });

  it('escrita externa de null esvazia o campo', () => {
    const { fixture, input, host } = setupSingle();

    host.control.setValue('10/03/2026');
    fixture.detectChanges();
    host.control.setValue(null);
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('desabilitar pelo control bloqueia o campo', () => {
    const { fixture, component, input, host } = setupSingle();

    host.control.disable();
    fixture.detectChanges();

    expect(component.disabled).toBeTrue();
    expect(input.disabled).toBeTrue();
  });

  it('sincronizar o calendário não altera o valor nem o estado pristine', () => {
    const { fixture, host, calendarButton } = setupSingle();

    host.control.setValue('10/03/2026');
    fixture.detectChanges();
    togglePopup(fixture, calendarButton);
    togglePopup(fixture, calendarButton);

    expect(host.control.value).toBe('10/03/2026');
    expect(host.control.pristine).toBeTrue();

    clearButtonOf(fixture).click();
    fixture.detectChanges();

    expect(host.control.value).toBeNull();
    expect(host.control.pristine).toBeTrue();
  });

  it('seleciona a data digitada depois de uma limpeza anterior', () => {
    const { fixture, host, input, calendarButton } = setupSingle();

    host.control.setValue('10/03/2026');
    fixture.detectChanges();
    host.control.setValue(null);
    fixture.detectChanges();
    typeText(fixture, input, '10/03/2026');

    togglePopup(fixture, calendarButton);

    expect(selectedDays()).toEqual(['10']);
  });

  it('não mantém a data selecionada após limpar pelo botão de limpar', () => {
    const { fixture, input, calendarButton } = setupSingle();

    typeText(fixture, input, '10/03/2026');
    clearButtonOf(fixture).click();
    fixture.detectChanges();

    togglePopup(fixture, calendarButton);

    expect(selectedDays()).toEqual([]);
  });

  it('texto incompleto não seleciona nenhum dia', () => {
    const { fixture, input, host, calendarButton } = setupSingle();

    host.control.setValue('04/11/2026');
    fixture.detectChanges();
    typeText(fixture, input, '04/11/202');

    togglePopup(fixture, calendarButton);

    expect(selectedDays()).toEqual([]);
  });

  it('reset não deixa data selecionada', () => {
    const { fixture, host, calendarButton } = setupSingle();

    host.control.setValue('04/11/2026');
    fixture.detectChanges();
    host.control.reset();
    fixture.detectChanges();

    togglePopup(fixture, calendarButton);

    expect(selectedDays()).toEqual([]);
  });

  it('data fora do limite digitada não aparece selecionada', () => {
    const { fixture, input, host, calendarButton } = setupSingle();

    typeText(fixture, input, '31/12/2025');
    togglePopup(fixture, calendarButton);

    expect(selectedDays()).toEqual([]);
    expect(host.control.value).toBe('31/12/2025');
  });

  it('abrir com data válida mostra o mês da data', () => {
    const { fixture, input, calendarButton } = setupSingle();

    typeText(fixture, input, '10/03/2026');
    togglePopup(fixture, calendarButton);

    const shown = Array.from(document.querySelectorAll('ngb-datepicker select'))
      .map(select => (select as HTMLSelectElement).selectedOptions[0]?.textContent?.trim() ?? '');
    expect(shown).toContain('2026');
  });

  it('primeira abertura sem histórico abre no mês atual', () => {
    const { fixture, calendarButton } = setupSingle();

    togglePopup(fixture, calendarButton);

    expect(selectedDays()).toEqual([]);
    expect(viewKey()).toContain(String(new Date().getFullYear()));
  });

  it('reabre no último mês visto mesmo depois de editar o texto', () => {
    const { fixture, input, calendarButton } = setupSingle();

    togglePopup(fixture, calendarButton);
    clickNextMonth(fixture);
    const viewed = viewKey();
    togglePopup(fixture, calendarButton);

    typeText(fixture, input, '');
    togglePopup(fixture, calendarButton);

    expect(viewKey()).toBe(viewed);
    expect(selectedDays()).toEqual([]);
  });

  it('abrir pelo teclado (Alt+SetaParaBaixo) mostra o estado sincronizado após limpar', () => {
    const { fixture, input } = setupSingle();

    typeText(fixture, input, '10/03/2026');
    clearButtonOf(fixture).click();
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true }));
    fixture.detectChanges();

    expect(popup()).not.toBeNull();
    expect(selectedDays()).toEqual([]);
  });

  it('início e fim do intervalo reabrem em meses independentes', () => {
    const { fixture, startButton, endButton } = setupRange();

    togglePopup(fixture, startButton);
    clickNextMonth(fixture);
    const startView = viewKey();
    togglePopup(fixture, startButton);

    togglePopup(fixture, endButton);
    clickNextMonth(fixture);
    clickNextMonth(fixture);
    const endView = viewKey();
    togglePopup(fixture, endButton);

    togglePopup(fixture, startButton);
    expect(viewKey()).toBe(startView);
    togglePopup(fixture, startButton);

    togglePopup(fixture, endButton);
    expect(viewKey()).toBe(endView);
  });

  it('ponta de início inválida não impõe limite mínimo ao fim', () => {
    const { fixture, component, inputs } = setupRange();

    typeText(fixture, inputs[0], '04/1');

    expect(component['endMinLimit']()).toBeNull();
  });
});
