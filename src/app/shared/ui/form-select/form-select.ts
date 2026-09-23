import { Component, computed, Input, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgSelectComponent, NgSelectModule } from "@ng-select/ng-select";

import { FormElementBase } from "@app/shared/directives";
import { transformBoolean } from "@app/shared/utils";

import { Label } from '../label/label';
import { Button } from "../button/button";

export interface SelectItem<T> {
  value: T;
  text: string;
  disabled?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-form-select',
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
  imports: [ Label, FormsModule, Button, NgSelectModule ],
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormSelect<T> extends FormElementBase<T> {

  constructor() {
    super();
  }

  /**
   * O `#element` de `FormElementBase` espera um elemento nativo de formulário,
   * por isso o ng-select é referenciado separadamente apenas para o `focus()`.
   */
  @ViewChild('ngSelect') protected ngSelect?: NgSelectComponent;

  public readonly _options = signal<SelectItem<T>[]>([]);
  @Input() public set options(value: SelectItem<T>[]) {
    this._options.set(value || []);
  }
  public get options(): SelectItem<T>[] {
    return this._options();
  }

  protected readonly _cleanable = signal(false);
  @Input({ transform: transformBoolean })
  public set cleanable(value: boolean) {
    if (value !== this._cleanable()) {
      this._cleanable.set(value);
    }
  }
  public get cleanable(): boolean {
    return this._cleanable();
  }

  protected readonly _searchable = signal(true);
  @Input({ transform: transformBoolean })
  public set searchable(value: boolean) {
    if (value !== this._searchable()) {
      this._searchable.set(value);
    }
  }
  public get searchable(): boolean {
    return this._searchable();
  }

  protected readonly _closeOnSelect = signal(true);
  @Input({ transform: transformBoolean, alias: 'close-on-select' })
  public set closeOnSelect(value: boolean) {
    if (value !== this._closeOnSelect()) {
      this._closeOnSelect.set(value);
    }
  }
  public get closeOnSelect(): boolean {
    return this._closeOnSelect();
  }

  protected readonly _placeholder = signal('');
  @Input() public set placeholder(value: string) {
    if (value !== this._placeholder()) {
      this._placeholder.set(value);
    }
  }
  public get placeholder(): string {
    return this._placeholder();
  }

  protected readonly _placeholderIfEmpty = signal('');
  @Input() public set placeholderIfEmpty(value: string) {
    if (value !== this._placeholderIfEmpty()) {
      this._placeholderIfEmpty.set(value);
    }
  }
  public get placeholderIfEmpty(): string {
    return this._placeholderIfEmpty();
  }

  public readonly hasItems = computed(() => {
    return (this._options()?.length || 0) > 0;
  });

  protected readonly placeholderText = computed(() => {
    const _hasItems = this.hasItems();
    const _placeholderIfEmpty = this._placeholderIfEmpty();
    const _placeholder = this._placeholder();

    if (!_hasItems) {
      return _placeholderIfEmpty || 'Nenhum item disponível';
    }

    return _placeholder || 'Selecione um item';
  });

  /**
   * Valor projetado para o ng-select. A filtragem contra `options` NÃO é feita
   * no setter de propósito: quando as opções são carregadas de forma
   * assíncrona, o valor chega antes da lista e seria descartado em silêncio.
   */
  public readonly selectedValue = computed(() => {
    const _value = this._value();
    const _options = this._options();
    const exists = _options.some((item) => item.value === _value);
    return exists ? _value : null;
  });

  public readonly selectedItem = computed(() => {
    const _value = this.selectedValue();
    const _options = this._options();
    return _options.find((item) => item.value === _value) || null;
  });

  public readonly selectedText = computed(() => {
    return this.selectedItem()?.text || '';
  });

  /**
   * Controla tanto a exibição do botão quanto a reserva de espaço no campo,
   * para que o `padding` só seja aplicado quando o botão realmente aparece.
   */
  protected readonly showClear = computed(() => {
    const _cleanable = this._cleanable();
    const _isActive = this.isActive();
    const _hasValue = this.hasValue();
    return _cleanable && _isActive && _hasValue;
  });

  protected readonly hostClass = computed(() => {
    const _class = this._class();
    return `form-group mb-3 ${_class}`;
  });

  protected readonly elementClass = computed(() => {
    const _size = this._size();
    return _size ? `ng-select-${_size}` : '';
  });

  protected selectionChange(value: T|null): void {
    this.value = value ?? null;
  }

  public override clear(value: T|null = null): void {
    super.clear(value);
    this.ngSelect?.focus();
  }
}
