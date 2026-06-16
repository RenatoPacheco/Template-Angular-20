import { Component, forwardRef, Input, signal, untracked } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { transformBoolean } from '@app/shared/utils';

@Component({
  selector: 'app-form-radio',
  standalone: true,
  templateUrl: './form-radio.html',
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRadio),
      multi: true
  }],
  host: {
    'class' : 'form-check',
    '[class.form-check-inline]': '_inline()',
    '[class.form-switch]': '_switch()'
  }
})
export class FormRadio implements ControlValueAccessor {

  protected readonly _label = signal<string>('');
  @Input() public set label(value: string) {
    if (value !== this.label) {
      this._label.set(value);
    }
  }
  public get label(): string {
    return untracked(() => this._label());
  }

  protected readonly _value = signal(null);
  @Input() public set value(value: any) {
    if (value !== this.value) {
      this._value.set(value);
    }
  }
  public get value(): any {
    return untracked(() => this._value());
  }

  protected readonly _id = signal(`${crypto.randomUUID()}`);
  @Input() public set id(value: string) {
    if (value !== this.id) {
      this._id.set(value);
    }
  }
  public get id(): string {
    return untracked(() => this._id());
  }

  protected _checked = signal(false);
  @Input({ transform: transformBoolean })
  public set checked(value: boolean) {
    if (value !== this.checked) {
      this._checked.set(value);
      this.onChange(value ? this.value : null);
    }
  }
  public get checked(): boolean {
    return untracked(() => this._checked());
  }

  protected readonly _name = signal('');
  @Input() public set name(value: string) {
    if (value !== this.name) {
      this._name.set(value);
    }
  }
  public get name(): string {
    return untracked(() => this._name());
  }

  protected readonly _inline = signal(false);
  @Input({ transform: transformBoolean })
  public set inline(value: boolean) {
    if (value !== this.inline) {
      this._inline.set(value);
    }
  }
  public get inline(): boolean {
    return untracked(() => this._inline());
  }

  protected readonly _switch = signal(false);
  @Input({ transform: transformBoolean })
  public set switch(value: boolean) {
    if (value !== this.switch) {
      this._switch.set(value);
    }
  }
  public get switch(): boolean {
    return untracked(() => this._switch());
  }

  protected readonly _disabled = signal(false);
  @Input({ transform: transformBoolean })
  public set disabled(value: boolean) {
    if (value !== this.disabled) {
      this._disabled.set(value);
    }
  }
  public get disabled(): boolean {
    return untracked(() => this._disabled());
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  // Angular → componente
  writeValue(value: any): void {
    this.checked = value === this.value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // usuário clicou
  protected onToggle(event: Event): void {
    if (this.disabled) return;

    this.onChange(this.value);
    this.onTouched();
  }
}