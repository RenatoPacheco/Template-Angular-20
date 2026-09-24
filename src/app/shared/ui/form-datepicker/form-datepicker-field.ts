import { computed, signal } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { DateTransform } from '@app/shared/directives';

import { formatDateStruct, isStructWithinLimits, parseDateString } from './form-datepicker-parser';

export interface DatepickerFieldOptions {
  /** Limite inferior vigente para este campo (global + cruzado). */
  min: () => NgbDateStruct | null;
  /** Limite superior vigente para este campo (global + cruzado). */
  max: () => NgbDateStruct | null;
  /** Informa se este campo está no modo ativo (single/range). */
  enabled: () => boolean;
  /** Chamado após qualquer mudança vinda do campo (digitação ou seleção). */
  onChange: () => void;
  /** Chamado após seleção pelo calendário (marca `touched`). */
  onTouch: () => void;
}

/**
 * Estado e comportamento de um campo de data (`single`, `start` ou `end`).
 *
 * O texto digitado pertence ao campo (`text`); o struct interno SÓ avança
 * em datas válidas dentro dos limites, então texto inválido nunca apaga o
 * destaque do calendário nem é apagado por ele. O valor exposto ao
 * formulário é sempre o texto cru (vazio é `null`) — a conversão fica a
 * cargo de quem instancia (via `onChange`).
 */
export class DatepickerField {
  private readonly _text = signal('');
  private readonly _struct = signal<NgbDateStruct | null>(null);

  public readonly startDate = computed(() => this._struct());
  public readonly minDate = computed(() => this._options.min());
  public readonly maxDate = computed(() => this._options.max());

  constructor(private readonly _options: DatepickerFieldOptions) {}

  public get text(): string {
    return this._text();
  }

  public get struct(): NgbDateStruct | null {
    return this._struct();
  }

  public get hasText(): boolean {
    return this._text() !== '';
  }

  public handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    DateTransform.apply(input);
    const text = input.value;
    this._text.set(text);

    if (text === '') {
      this._struct.set(null);
    } else {
      const parsed = parseDateString(text);

      if (parsed && isStructWithinLimits(parsed, this._options.min(), this._options.max())) {
        this._struct.set(parsed);
      }
    }

    this._options.onChange();
  }

  public handleSelect(date: NgbDateStruct): void {
    if (!this._options.enabled()) {
      return;
    }

    const struct: NgbDateStruct = { year: date.year, month: date.month, day: date.day };
    this._struct.set(struct);
    this._text.set(formatDateStruct(struct) ?? '');
    this._options.onChange();
    this._options.onTouch();
  }

  /** Escrita externa: texto cru + struct derivado (pode ser `null`). */
  public writeText(text: string | null): void {
    this._text.set(text ?? '');
    this._struct.set(text ? parseDateString(text) : null);
  }

  public setState(text: string, struct: NgbDateStruct | null): void {
    this._text.set(text);
    this._struct.set(struct);
  }

  public reset(): void {
    this._text.set('');
    this._struct.set(null);
  }
}
