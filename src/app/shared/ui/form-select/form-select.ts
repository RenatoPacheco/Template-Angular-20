import { Component, computed, input, Input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FormElementBase } from "@app/shared/directives";

import { Label } from '../label/label';
import { Button } from "../button/button";
import { transformBoolean } from "@app/shared/utils";

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
  imports: [ Label, FormsModule, Button ],
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormSelect<T> extends FormElementBase<T>  {

  constructor() {
    super();
  }

  public readonly options = input<SelectItem<T>[]>([]);

  public override set value(value: T|null) {
    const exist = this.itens().some((item) => item.value == value);
    if (exist) {
      super.value = value;
    }
  }
  public override get value(): T|null {
    return super.value;
  }

  protected _cleanable = signal(false);
  @Input({ transform: transformBoolean }) 
  public set cleanable(value: boolean) {
    if (value !== this._cleanable()) {
      this._cleanable.set(value);
    }
  }
  public get cleanable(): boolean {
    return this._cleanable();
  }


  protected readonly _placeholder = signal('');
  @Input() public set placeholder(value: string) {
    if (value !== this.placeholder) {
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
    const _options = this.options();
    return (_options?.length || 0) > 0;
  });

  public readonly itens = computed(() => {
    const _options = this.options();
    const _placeholder = this.placeholder;
    const _placeholderIfEmpty = this.placeholderIfEmpty;

    let _placeholderFinal = _placeholder || 'Selecione um item';
    if (!this.hasItems()) {
      _placeholderFinal = _placeholderIfEmpty || 'Nenhum item disponível';
    }

    let _optionsFinal = this.hasItems() ? _options : [];
    
    return [
        { value: null, text: _placeholderFinal, disabled: true },
        ..._optionsFinal
      ];
  });

  public readonly selectedItem = computed(() => {
    const valueVal = this._value();
    const optionsVal = this.itens();
    return optionsVal.find((item) => item.value === valueVal) || null;
  });

  public readonly selectedText = computed(() => {
    const selectedItemVal = this.selectedItem();
    return selectedItemVal ? selectedItemVal.text : '';
  });

  public readonly selectedValue = computed(() => {
    const selectedItemVal = this.selectedItem();
    return selectedItemVal ? selectedItemVal.value : null;
  });

  public readonly selectedIndex = computed(() => {
    const selectedItemVal = this.selectedItem();
    const optionsVal = this.itens();
    return selectedItemVal ? optionsVal.indexOf(selectedItemVal) : -1;
  });
  
  protected hostClass = computed(() => {
    const classVal = this._class();
    return `form-group mb-3 ${classVal}`;
  });

  protected elementClass = computed(() => {
    const sizeVal = this._size();
    const selectedIndexVal = this.selectedIndex();
    
    let resul = `form-select form-select-${sizeVal}`;

    if (sizeVal) {
      resul += ` form-select-${sizeVal}`;
    }

    if (selectedIndexVal === 0) {
      resul += ' text-muted';
    }

    return resul;
  });

  protected override emitChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = Number(target.value);
    const optionsVal = this.itens();
    const selectedItem = optionsVal[value];
    const selectedValue = selectedItem ? selectedItem.value : null;
    this.value = selectedValue;
  }
}