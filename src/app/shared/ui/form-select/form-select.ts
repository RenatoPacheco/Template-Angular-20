import { Component, computed, input, Input, signal } from "@angular/core";
import { FormBase } from "@app/shared/directives";

import { Label } from '../label/label';
import { FormsModule } from "@angular/forms";

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
  imports: [ Label, FormsModule ],
  host: {
    '[class]': 'hostClass()'
  }
})
export class FormSelect<T> extends FormBase<T>  {

  constructor() {
    super();
  }

  public readonly items = input<SelectItem<T>[]>([]);


  protected readonly _placeholder = signal('');
  @Input() public set placeholder(value: string) {
    if (value !== this.placeholder) {
      this._placeholder.set(value);
    }
  }
  public get placeholder(): string {
    return this._placeholder();
  }

  public readonly selectedItem = computed(() => {
    const valueVal = this._value();
    const itemsVal = this.items();
    return itemsVal.find((item) => item.value === valueVal) || null;
  });

  public readonly selectedText = computed(() => {
    const selectedItemVal = this.selectedItem();
    return selectedItemVal ? selectedItemVal.text : '';
  });

  public readonly selectedIndex = computed(() => {
    const selectedItemVal = this.selectedItem();
    const itemsVal = this.items();
    return selectedItemVal ? itemsVal.indexOf(selectedItemVal) : -1;
  });
  
  protected hostClass = computed(() => {
    const classVal = this._class();
    return `mb-3 ${classVal}`;
  });

}