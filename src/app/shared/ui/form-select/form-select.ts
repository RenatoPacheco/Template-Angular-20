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

  public readonly _options = signal<SelectItem<T>[]>([]);
  @Input() public set options(value: SelectItem<T>[]) {   
      this._options.set(value || []);
  }
  public get options(): SelectItem<T>[] {
    return this._options();
  }

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
    const _options = this.options;
    return (_options?.length || 0) > 0;
  });

  public readonly itens = computed(() => {
    const _options = this.options;
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
    const _value = this._value();
    const _options = this.itens();
    return _options.find((item) => item.value === _value) || null;
  });

  public readonly selectedText = computed(() => {
    const _selectedItem = this.selectedItem();
    return _selectedItem ? _selectedItem.text : '';
  });

  public readonly selectedValue = computed(() => {
    const _selectedItem = this.selectedItem();
    return _selectedItem ? _selectedItem.value : null;
  });

  public readonly selectedIndex = computed(() => {
    const _selectedItem = this.selectedItem();
    const _options = this.itens();
    return _selectedItem ? _options.indexOf(_selectedItem) : -1;
  });
  
  protected hostClass = computed(() => {
    const _class = this._class();
    return `form-group mb-3 ${_class}`;
  });

  protected elementClass = computed(() => {
    const _size = this._size();
    const _selectedIndex = this.selectedIndex();
    
    let resul = `form-select form-select-${_size}`;

    if (_size) {
      resul += ` form-select-${_size}`;
    }

    if (_selectedIndex === 0) {
      resul += ' text-muted';
    }

    return resul;
  });

  protected override emitChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = Number(target.value);
    const _options = this.itens();
    const selectedItem = _options[value];
    const selectedValue = selectedItem ? selectedItem.value : null;
    this.value = selectedValue;
  }
}