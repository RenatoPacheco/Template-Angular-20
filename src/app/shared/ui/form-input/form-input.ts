import { Component, computed, DestroyRef, inject, Input, OnInit, output, signal, untracked } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, ValidationErrors } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { transformBoolean } from '@app/shared/utils';
import { ToastService, ValidatorService } from '@app/shared/services';

import { Label } from '../label/label';
import { Button } from '../button/button';

type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
type InputSize = 'sm' | 'md' | 'lg';
type InputAutocomplete =
    | 'on'
    | 'off'
    | 'name'
    | 'given-name'
    | 'additional-name'
    | 'family-name'
    | 'nickname'
    | 'username'
    | 'new-password'
    | 'current-password'
    | 'email'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'tel-area-code'
    | 'tel-local'
    | 'tel-extension'
    | 'street-address'
    | 'address-line1'
    | 'address-line2'
    | 'address-line3'
    | 'address-level1'
    | 'address-level2'
    | 'address-level3'
    | 'address-level4'
    | 'country'
    | 'country-name'
    | 'postal-code'
    | 'organization'
    | 'organization-title'
    | 'bday'
    | 'bday-day'
    | 'bday-month'
    | 'bday-year'
    | 'cc-name'
    | 'cc-number'
    | 'cc-exp'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-csc'
    | 'cc-type'
    | 'url'
    | 'photo'
    | 'sex'
    | 'language';

    type InputStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

@Component({
  standalone: true,
  selector: 'app-form-input',
  imports: [ Label, FormsModule, Button ],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  host: {
    '[class]': 'classComputed()'
  }
})
export class FormInput implements ControlValueAccessor, OnInit  {
  
  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.statusUpdate();
    this.ngControl?.control?.events
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.statusUpdate();
    });
  }

  private readonly validator = inject(ValidatorService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private errorId: string|null = null;
    
  public helper = output<void>();
  public error = output<{
    id: string,
    messages: string[],
    label: string,
    errors: ValidationErrors | null
  }>();

  //region ControlValueAccessor

  public onChange: (value: string) => void = () => {};
  public onTouched: () => void = () => {}

  public writeValue(value: string): void {
    this._value.set(value);
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled !== this.disabled) {
      this._disabled.set(isDisabled);
    }
  }
  
  //endregion

  private statusUpdate():void {
    const control = this.ngControl?.control;
    if (control) {
      if (this.status !== control.status) {
        this._status.set(control.status);
      }
      if (this.pristine !== control.pristine) {
        this._pristine.set(control.pristine);
      }
      if (this.touched !== control.touched) {
        this._touched.set(control.touched);
      }
      if (this.disabled !== control.disabled) {
        this._disabled.set(control.disabled);
      }
    }
  }

  private readonly _status = signal<InputStatus>('VALID');
  public get status(): InputStatus {
    return untracked(() => this._status());
  }

  protected readonly _pristine = signal(true);
  public get pristine(): boolean {
    return untracked(() => this._pristine());
  }
  public get dirty(): boolean {
    return untracked(() => !this._pristine());
  }

  protected readonly _touched = signal(false);
  public get touched(): boolean {
    return untracked(() => this._touched());
  }
  public get untouched(): boolean {
    return untracked(() => !this._touched());
  }

  protected readonly _value = signal<string>('');
  @Input() public get value(): string {
    return untracked(() => this._value());
  }
  public set value(value: string) {      
    if (this.value !== value) {
      this.writeValue(value);
      this.onChange(value);
    }
  }

  protected readonly _type = signal<InputType>('text');
  @Input()
  public set type(value: InputType) {
    if (value !== this.type) {
      this._type.set(value);
    }
  }
  public get type(): InputType {
    return untracked(() => this._type());
  }

  protected readonly _id = signal(`${crypto.randomUUID()}`);
  @Input()
  public set id(value: string) {
    if (value !== this.id) {
      this._id.set(value);
    }
  }
  public get id(): string {
    return untracked(() => this._id());
  }

  protected readonly _class = signal('');
  @Input()
  public set class(value: string) {
    if (value !== this.class) {
      this._class.set(value);
    }
  }
  public get class(): string {
    return untracked(() => this._class());
  }

  protected readonly _placeholder = signal('');
  @Input()
  public set placeholder(value: string) {
    if (value !== this.placeholder) {
      this._placeholder.set(value);
    }
  }
  public get placeholder(): string {
    return untracked(() => this._placeholder());
  }

  protected readonly _readonly = signal(false);
  @Input({ transform: transformBoolean })
  public set readonly(value: boolean) {
    if (value !== this.readonly) {
      this._readonly.set(value);
    }
  }
  public get readonly(): boolean {
    return untracked(() => this._readonly());
  }

  protected readonly _autocomplete = signal<InputAutocomplete>('off');
  @Input()
  public set autocomplete(value: InputAutocomplete) {
    if (value !== this.autocomplete) {
      this._autocomplete.set(value);
    }
  }
  public get autocomplete(): InputAutocomplete {
    return untracked(() => this._autocomplete());
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

  protected readonly _controlSecret = signal(false);
  @Input({ 
    alias: 'control-secret', 
    transform: transformBoolean 
  })
  public set controlSecret(value: boolean) {
    if (value !== this.controlSecret) {
      this._controlSecret.set(value);
    }
  }
  public get controlSecret(): boolean {
    return untracked(() => this._controlSecret());
  }

  protected readonly _size = signal<InputSize>('md');
  @Input()
  public set size(value: InputSize) {
    if (value !== this.size) {
      this._size.set(value);
    }
  }
  public get size(): InputSize {
    return untracked(() => this._size());
  }

  protected readonly _label = signal('');
  @Input({ required: true })
  public set label(value: string) {
    if (value !== this.label) {
      this._label.set(value);
    }
  }
  public get label(): string {
    return untracked(() => this._label());
  }

  protected readonly _enabledError = signal(true);
  @Input({ 
    transform: transformBoolean,
    alias: 'enabled-error'
  })
  public set enabledError(value: boolean) {
    if (value !== this._enabledError()) {
      this._enabledError.set(value);
    }
  }
  public get enabledError(): boolean {
    return untracked(() => this._enabledError());
  }

  protected readonly _enabledHelper = signal(false);
  @Input({ 
    transform: transformBoolean,
    alias: 'enabled-helper' 
  })
  public set enabledHelper(value: boolean) {
    if (value !== this._enabledHelper()) {
      this._enabledHelper.set(value);
    }
  }
  public get enabledHelper(): boolean {
    return untracked(() => this._enabledHelper());
  }

  protected readonly _secretHasBeenReversed = signal(false);
  protected onToggleSecret(): void {
    var currentValue = this._secretHasBeenReversed();
    this._secretHasBeenReversed.set(!currentValue);
  }  
    
  public isValid = computed(() => {
    return this._status() === 'VALID';
  });

  public isInvalid = computed(() => {
    return this._status() === 'INVALID';
  });

  public isPending = computed(() => {
    return this._status() === 'PENDING';
  });

  public isDisabled = computed(() => {
    return this._status() === 'DISABLED';
  });

  protected showErrorComputed = computed(() => {
    const invalidVal = this._status() === 'INVALID';
    const touchedVal = this._touched();
    const dirtyVal = !this._pristine();
    const enabledVal = this._enabledError();
    return enabledVal && invalidVal && touchedVal && dirtyVal;
  });

  protected showSecretComputed = computed(() => {
    const typeVal = this._type();
    const controlSecretVal = this._controlSecret();
    const secretHasBeenReversedVal = this._secretHasBeenReversed();
    
    let result = controlSecretVal && typeVal === 'password' 
    ? true : false;

    return secretHasBeenReversedVal ? !result : result;
  });

  protected hideSecretComputed = computed(() => {
    const typeVal = this._type();
    const controlSecretVal = this._controlSecret();
    const secretHasBeenReversedVal = this._secretHasBeenReversed();
    
    let result = controlSecretVal && typeVal !== 'password' 
    ? true : false;

    return secretHasBeenReversedVal ? !result : result;
  });

  protected typeComputed = computed(() => {
    let typeVal = this._type();
    const isPasswordType = typeVal === 'password';
    const controlSecretVal = this._controlSecret();
    const reverseSecretVal = this._secretHasBeenReversed();

    if (controlSecretVal && reverseSecretVal) {
      typeVal = isPasswordType ? 'text' : 'password';
    } else {
      switch (typeVal) {
        case 'search':
          typeVal = 'text';
          break;
      }
    }

    return typeVal;
  });

  protected classComputed = computed(() => {
    const classVal = this._class();
    return `form-group mb-3 ${classVal}`;
  });

  protected inputClassComputed = computed(() => {
    const sizeVal = this._size();
    return `form-control form-control-${sizeVal}`;
  });

  protected hasValueComputed = computed(() => {
    const valueVal = this._value();
    return valueVal ? true : false;
  });

  protected notHasValueComputed = computed(() => {
    const valueVal = this._value();
    return valueVal ? false : true;
  });

  public clear(): void {
     const control = this.ngControl?.control;

    if (control) {
      control.setValue('');
      control.markAsPristine();
      control.markAsUntouched();
    } else {
      this.value = '';
    }
  };

  protected onInput(event: Event): void { 
    const value = (event.target as HTMLInputElement).value; 
    this.value = value; 
  } 
  
  protected onBlur(): void { 
    this.onTouched(); 
  }

  protected onError(): void {
    const errors = this.ngControl?.control?.errors;
    if (errors) {
      var messages = this.validator.getMessages(errors);
      this.toast.remove(this.errorId);
      this.errorId = this.toast.error({
        message: messages
      });
      this.error.emit({
        id: this.errorId,
        messages: messages,
        label: this.label,
        errors: errors
      });
    }
  }

  protected onHelper(): void {
    this.helper.emit(); 
  }
}
