import { Directive, Input, signal, untracked } from "@angular/core";
import { FormBase } from "./form-base";

import { transformBoolean } from "@app/shared/utils";

@Directive()
export abstract class FormCheckBase extends FormBase<unknown> {

  constructor() {
    super();
  }

  //region ControlValueAccessor

  public override writeValue(value: unknown|null): void {
    console.log('writeValue:', this.value);
    this.checked = value === this.value;
  }

  //endregion

  public override set value(value: unknown|null) {
    if (value !== this.value) {
      this._value.set(value);
      this.onChange(this.checked ? this.value : null);
    }
  }
  public override get value(): unknown|null {
    return untracked(() => this._value());
  }

  protected _checked = signal(false);
  @Input({ transform: transformBoolean })
  public set checked(value: boolean) {
    console.log(this.value, ':', value)
    if (value !== this.checked) {
      this._checked.set(value);
      this.onChange(value ? this.value : null);
    }
  }
  public get checked(): boolean {
    return untracked(() => this._checked());
  }

  protected _type = signal<'checkbox'|'radio'>('checkbox');
  @Input({ required: true })
  public set type(value: 'checkbox'|'radio') {
    if (value !== this.type) {
      this._type.set(value);
      this.onChange(value ? this.value : null);
    }
  }
  public get type(): 'checkbox'|'radio' {
    return untracked(() => this._type());
  }

  protected readonly _name = signal('');
  @Input()
  public set name(value: string) {
    if (value !== this.name) {
      this._name.set(value);
    }
  }
  public get name(): string {
    return untracked(() => this._name());
  }

  protected onToggle(event: Event): void {
      console.log('onToggle:', this.value)
      const checked = (event.target as HTMLInputElement).checked;
      this.checked = checked;
      this.onTouched();
  }
}