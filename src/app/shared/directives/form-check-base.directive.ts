import { computed, Directive, Input, signal } from "@angular/core";

import { transformBoolean } from "@app/shared/utils";

import { FormElementBase } from "./form-element-base.directive";

@Directive()
export abstract class FormCheckBase<T = string> extends FormElementBase<T> {

  constructor()  {
    super();
  }

  protected readonly _optionValue = signal<T|null>(null);
  @Input({ alias: 'value' })
  public set optionValue(value: T|null) {
    if (value !== this.optionValue) {
      this._optionValue.set(value);
    }
  }
  public get optionValue(): T|null {
    return this._optionValue();
  }

  public readonly checked = computed(() => {
    const value = this._value();
    return value != null && value === this._optionValue();
  });

  protected readonly _switch = signal(false);
  @Input({ transform: transformBoolean })
  public set switch(value: boolean) {
    if (value !== this.switch) {
      this._switch.set(value);
    }
  }
  public get switch(): boolean {
    return this._switch();
  }
  
  protected readonly _inline = signal(false);
  @Input({ transform: transformBoolean })
  public set inline(value: boolean) {
    if (value !== this.inline) {
      this._inline.set(value);
    }
  }
  public get inline(): boolean {
    return this._inline();
  }

  protected emitToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.commitValue(input.checked ? this._optionValue() : null);
    input.checked = this.checked();
    this.onTouched();
  }
}
