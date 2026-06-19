import { Directive, Input, signal, untracked } from "@angular/core";

import { FormBase } from "@app/shared/directives";
import { transformBoolean } from "@app/shared/utils";

@Directive()
export abstract class FormCheckBase extends FormBase<any>  {

  constructor()  {
    super();
  }

  //region ControlValueAccessor

  public override writeValue(value: any|null): void {
    this.checked = value === this.value;
  }

  //endregion

  public override set value(value: any|null) {
    if (value !== this.value) {
      this._value.set(value);
    }
  }
  // Como sobrescreve o set, é necessário sobrescrever 
  // o get para manter o efeito do signal
  public override get value(): string|null {
    return super.value;
  }

  protected _checked = signal(false);
  @Input({ transform: transformBoolean })
  public set checked(value: boolean) {
    if (value !== this.checked) {
      this._checked.set(value);
    }
  }
  public get checked(): boolean {
    return this._checked();
  }

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

  protected onToggle(event: Event): void {
      const checked = (event.target as HTMLInputElement).checked;
      this.checked = checked;
      this.onChange(checked ? this.value : null);
      this.onTouched();
  }
}