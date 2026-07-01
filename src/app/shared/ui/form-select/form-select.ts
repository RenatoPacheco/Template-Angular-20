import { Component, computed, input, Input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FormBase } from "@app/shared/directives";

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
  imports: [ Label, FormsModule, Button ],
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormSelect<T> extends FormBase<T>  {

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


  protected readonly _placeholder = signal('');
  @Input() public set placeholder(value: string) {
    if (value !== this.placeholder) {
      this._placeholder.set(value);
    }
  }
  public get placeholder(): string {
    return this._placeholder();
  }

  public readonly itens = computed(() => {
    const optionsVal = this.options();
    const placeholderVal = this.placeholder;
    
    return [
        { value: null, text: placeholderVal || 'Selecione um item', disabled: true },
        ...optionsVal
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