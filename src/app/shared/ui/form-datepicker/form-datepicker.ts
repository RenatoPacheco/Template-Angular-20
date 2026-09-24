import { Component, computed, ElementRef, Input, signal, ViewChild } from '@angular/core';
import {
  NgbDatepickerI18n,
  NgbDatepickerModule,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';

import { FormElementBase } from '@app/shared/directives';

import { Label } from '../label/label';
import { Button } from '../button/button';

import { PtBrDatepickerI18n } from './form-datepicker-i18n';
import { DatepickerField } from './form-datepicker-field';
import {
  compareDateStructs,
  DateStringParserFormatter,
  formatDateStruct,
  parseDateString,
} from './form-datepicker-parser';

export type DatepickerMode = 'single' | 'range';

export interface DateRange {
  start: string | null;
  end: string | null;
}

export type FocusedField = 'single' | 'start' | 'end';

const EMPTY_RANGE: DateRange = { start: null, end: null };

@Component({
  standalone: true,
  selector: 'app-form-datepicker',
  templateUrl: './form-datepicker.html',
  styleUrl: './form-datepicker.scss',
  imports: [ Label, Button, NgbDatepickerModule ],
  providers: [
    { provide: NgbDatepickerI18n, useClass: PtBrDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: DateStringParserFormatter },
  ],
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormDatepicker extends FormElementBase<string | DateRange> {

  constructor() {
    super();
  }

  protected readonly _mode = signal<DatepickerMode>('single');
  @Input() public set mode(value: DatepickerMode) {
    const next: DatepickerMode = value === 'range' ? 'range' : 'single';
    if (next !== this._mode()) {
      this._mode.set(next);
      this.resetInternal();
    }
  }
  public get mode(): DatepickerMode {
    return this._mode();
  }

  protected readonly _placeholder = signal('dd/mm/yyyy');
  @Input() public set placeholder(value: string) {
    if (value !== this._placeholder()) {
      this._placeholder.set(value);
    }
  }
  public get placeholder(): string {
    return this._placeholder();
  }

  protected readonly _minDate = signal<string | null>(null);
  @Input({ alias: 'min-date' })
  public set minDate(value: string | null) {
    const next = value || null;
    if (next !== this._minDate()) {
      this._minDate.set(next);
    }
  }
  public get minDate(): string | null {
    return this._minDate();
  }

  protected readonly _maxDate = signal<string | null>(null);
  @Input({ alias: 'max-date' })
  public set maxDate(value: string | null) {
    const next = value || null;
    if (next !== this._maxDate()) {
      this._maxDate.set(next);
    }
  }
  public get maxDate(): string | null {
    return this._maxDate();
  }

  protected readonly singleField: DatepickerField = new DatepickerField({
    min: () => this.minLimit(),
    max: () => this.maxLimit(),
    enabled: () => this._mode() === 'single',
    onChange: () => this.emitSingleValue(),
    onTouch: () => this.onTouched(),
  });

  protected readonly startField: DatepickerField = new DatepickerField({
    min: () => this.minLimit(),
    max: () => this.startMaxLimit(),
    enabled: () => this._mode() === 'range',
    onChange: () => this.onRangeFieldChange(),
    onTouch: () => this.onTouched(),
  });

  protected readonly endField: DatepickerField = new DatepickerField({
    min: () => this.endMinLimit(),
    max: () => this.maxLimit(),
    enabled: () => this._mode() === 'range',
    onChange: () => this.onRangeFieldChange(),
    onTouch: () => this.onTouched(),
  });

  protected readonly minLimit = computed(() => parseDateString(this._minDate()));
  protected readonly maxLimit = computed(() => parseDateString(this._maxDate()));

  // Limites efetivos por campo: globais + restrição cruzada do intervalo.
  protected readonly startMaxLimit = computed<NgbDateStruct | null>(() => {
    const end = this.endField.struct;
    const max = this.maxLimit();
    if (end && max) {
      return compareDateStructs(end, max) < 0 ? end : max;
    }
    return end ?? max;
  });

  protected readonly endMinLimit = computed<NgbDateStruct | null>(() => {
    const start = this.startField.struct;
    const min = this.minLimit();
    if (start && min) {
      return compareDateStructs(start, min) > 0 ? start : min;
    }
    return start ?? min;
  });

  // O ng-bootstrap tipa `startDate`/`minDate`/`maxDate` como não-nuláveis,
  // mas em runtime `undefined` significa "sem restrição" (a diretiva só
  // repassa ao popup os inputs `!== undefined`). `asDateInput` isola esse
  // escape num ponto único e documentado.
  protected asDateInput(value: NgbDateStruct | null | undefined): NgbDateStruct {
    return value as NgbDateStruct;
  }

  protected readonly hostClass = computed(() => {
    const _class = this._class();
    return `form-group mb-3 ${_class}`;
  });

  protected readonly elementClass = computed(() => {
    const _size = this._size();
    return `form-control form-control-${_size}`;
  });

  protected readonly showCalendar = computed(() => {
    return this.isActive();
  });

  protected readonly showClear = computed(() => {
    if (!this.isActive()) {
      return false;
    }

    const value = this._value();

    if (value == null || value === '') {
      return false;
    }

    if (typeof value === 'string') {
      return true;
    }

    return !!value.start || !!value.end;
  });

  protected readonly showStartClear = computed(() => {
    return this.isActive() && this.startField.hasText;
  });

  protected readonly showEndClear = computed(() => {
    return this.isActive() && this.endField.hasText;
  });

  protected readonly endId = computed(() => {
    return `${this._id()}-end`;
  });

  public override writeValue(value: string | DateRange | null): void {
    if (this._mode() === 'range') {
      const range = value != null && typeof value === 'object' ? value : EMPTY_RANGE;
      this.startField.writeText(range.start ?? null);
      this.endField.writeText(range.end ?? null);
      this.normalizeRangeOrder();
      this.emitRangeValue();
      return;
    }

    const text = typeof value === 'string' ? value : null;
    this.singleField.writeText(text);
    this.value = text || null;
  }

  public override clear(): void {
    this.resetInternal();
    super.clear(this._mode() === 'range' ? { ...EMPTY_RANGE } : null);

    // O `#element` vive dentro de `@if/@else`, então a query estática
    // (`static: true`) de `FormElementBase` nunca o resolve aqui — o foco
    // é devolvido explicitamente pelo campo em uso (padrão: início).
    const target =
      this._mode() === 'range' && this._focusedField() === 'end' ? this.endElement : this.fieldElement;
    target?.nativeElement.focus();
  }

  // Limpeza independente por ponta: preserva a outra ponta e devolve o
  // foco ao mesmo campo. Não toca em `pristine`/`touched` (só o `clear()`
  // total, herdado, faz isso).
  protected clearStart(): void {
    this.startField.reset();
    this.emitRangeValue();
    this.markField('start');
    this.fieldElement?.nativeElement.focus();
  }

  protected clearEnd(): void {
    this.endField.reset();
    this.emitRangeValue();
    this.markField('end');
    this.endElement?.nativeElement.focus();
  }

  // Queries dinâmicas (`static: false`): os inputs vivem em ramos `@if/@else`
  // que só existem após o change detection — a query estática da base não
  // os enxerga (retorna `undefined` e o `focus()` do `clear()` é pulado).
  @ViewChild('element', { static: false })
  protected fieldElement?: ElementRef<HTMLInputElement>;

  @ViewChild('endElement', { static: false })
  protected endElement?: ElementRef<HTMLInputElement>;

  protected readonly _focusedField = signal<FocusedField>('single');

  protected markField(field: FocusedField): void {
    if (field !== this._focusedField()) {
      this._focusedField.set(field);
    }
  }

  protected togglePicker(picker: NgbInputDatepicker): void {
    if (!this.isActive()) {
      return;
    }

    picker.toggle();
  }

  private emitSingleValue(): void {
    this.value = this.singleField.text || null;
  }

  private onRangeFieldChange(): void {
    this.normalizeRangeOrder();
    this.emitRangeValue();
  }

  private normalizeRangeOrder(): void {
    const start = this.startField.struct;
    const end = this.endField.struct;

    if (!start || !end || compareDateStructs(start, end) <= 0) {
      return;
    }

    const startText = formatDateStruct(end) ?? '';
    const endText = formatDateStruct(start) ?? '';
    this.startField.setState(startText, end);
    this.endField.setState(endText, start);
  }

  private emitRangeValue(): void {
    const startText = this.startField.text;
    const endText = this.endField.text;
    this.value = { start: startText || null, end: endText || null };
  }

  private resetInternal(): void {
    this.singleField.reset();
    this.startField.reset();
    this.endField.reset();
    this.value = this._mode() === 'range' ? { ...EMPTY_RANGE } : null;
  }
}
