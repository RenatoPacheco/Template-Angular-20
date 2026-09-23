import { Component, computed, Input, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgSelectComponent, NgSelectModule } from "@ng-select/ng-select";

import { FormElementBase } from "@app/shared/directives";
import { transformBoolean, transformNumber } from "@app/shared/utils";

import { Label } from '../label/label';
import { Button } from "../button/button";
import { SelectItem } from "../form-select/form-select";

@Component({
  standalone: true,
  selector: 'app-form-select-multiple',
  templateUrl: './form-select-multiple.html',
  styleUrl: './form-select-multiple.scss',
  imports: [ Label, FormsModule, Button, NgSelectModule ],
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormSelectMultiple<T> 
  extends FormElementBase<T[]> {

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

  /**
   * O valor é sempre um array. `null`/`undefined` são normalizados para `[]`.
   * A filtragem contra `options` NÃO é feita aqui de propósito: quando as
   * opções são carregadas de forma assíncrona, o valor chega antes da lista e
   * a seleção seria descartada silenciosamente. A projeção filtrada fica em
   * `selectedValues()`.
   */
  public override set value(value: T[]|null) {
    const next = Array.isArray(value) ? value : [];
    const current = this._value() || [];
    const equal = current.length === next.length
      && current.every((item, index) => item === next[index]);

    if (!equal) {
      super.value = next;
    }
  }
  public override get value(): T[]|null {
    return super.value;
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

  protected readonly _closeOnSelect = signal(false);
  @Input({ transform: transformBoolean, alias: 'close-on-select' })
  public set closeOnSelect(value: boolean) {
    if (value !== this._closeOnSelect()) {
      this._closeOnSelect.set(value);
    }
  }
  public get closeOnSelect(): boolean {
    return this._closeOnSelect();
  }

  protected readonly _hideSelected = signal(false);
  @Input({ transform: transformBoolean, alias: 'hide-selected' })
  public set hideSelected(value: boolean) {
    if (value !== this._hideSelected()) {
      this._hideSelected.set(value);
    }
  }
  public get hideSelected(): boolean {
    return this._hideSelected();
  }

  protected readonly _maxSelectedItems = signal<number|undefined>(undefined);
  @Input({ transform: transformNumber, alias: 'max-selected-items' })
  public set maxSelectedItems(value: number) {
    if (value !== this._maxSelectedItems()) {
      this._maxSelectedItems.set(value || undefined);
    }
  }
  public get maxSelectedItems(): number|undefined {
    return this._maxSelectedItems();
  }

  /**
   * Quantidade máxima de chips exibidos. Acima disso o campo mostra apenas um
   * resumo (`N itens selecionados`). Opcional: por padrão (`0`) todos os itens
   * selecionados são listados.
   */
  protected readonly _maxVisibleItems = signal(0);
  @Input({ transform: transformNumber, alias: 'max-visible-items' })
  public set maxVisibleItems(value: number) {
    if (value !== this._maxVisibleItems()) {
      this._maxVisibleItems.set(value);
    }
  }
  public get maxVisibleItems(): number {
    return this._maxVisibleItems();
  }

  protected summaryText(count: number): string {
    return count === 1 ? '1 item selecionado' : `${count} itens selecionados`;
  }

  protected showSummary(count: number): boolean {
    const _max = this._maxVisibleItems();
    return _max > 0 && count > _max;
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
    
    return _placeholder || 'Selecione um ou mais itens';
  });

  /** Valor projetado para o ng-select, já sem itens inexistentes em `options`. */
  public readonly selectedValues = computed(() => {
    const _value = this._value() || [];
    const _options = this._options();
    return _value.filter((value) => _options.some((item) => item.value === value));
  });

  public readonly selectedItems = computed(() => {
    const _selected = this.selectedValues();
    const _options = this._options();
    return _options.filter((item) => _selected.includes(item.value));
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

  protected selectionChange(value: T[]|null): void {
    this.value = value;
  }

  public override clear(value: T[]|null = []): void {
    super.clear(Array.isArray(value) ? value : []);
    this.ngSelect?.focus();
  }
}
