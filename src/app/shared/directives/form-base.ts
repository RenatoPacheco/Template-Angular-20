import { computed, DestroyRef, Directive, ElementRef, inject, Input, OnInit, output, signal, untracked, ViewChild } from "@angular/core";
import { ControlValueAccessor, NgControl, ValidationErrors } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { transformBoolean } from "@app/shared/utils";
import { ToastService, ValidatorService } from "@app/shared/services";

type FormElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

@Directive()
export abstract class FormBase<T> implements ControlValueAccessor, OnInit {
  
  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    this.statusUpdate();
    this.ngControl?.control?.events
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.statusUpdate();
    });
  }
  
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly ngControl = inject(NgControl, { self: true, optional: true });

  protected readonly validator = inject(ValidatorService);
  protected readonly toast = inject(ToastService);
  protected errorId: string|null = null;

  @ViewChild('element', {static: true})
  protected element!: ElementRef<FormElement>|null;

  public readonly helper = output<void>();
  public readonly error = output<{
    id: string,
    messages: string[],
    label: string,
    errors: ValidationErrors|null
  }>();

  //region ControlValueAccessor

  public onChange: (value: T|null) => void = () => {};
  public onTouched: () => void = () => {}

  public writeValue(value: T|null): void {
    this._value.set(value);
  }

  public registerOnChange(fn: (value: T|null) => void): void {
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

  protected readonly _status = signal<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>('VALID');
  public get status(): 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED' {
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

  protected readonly _value = signal<T|null>(null);
  @Input() public get value(): T|null {
    return untracked(() => this._value());
  }
  public set value(value: T|null) {      
    if (this.value !== value) {
      this.writeValue(value);
      this.onChange(value);
    }
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

  protected readonly _size = signal<'sm' | 'md' | 'lg'>('md');
  @Input()
  public set size(value: 'sm' | 'md' | 'lg') {
    if (value !== this.size) {
      this._size.set(value);
    }
  }
  public get size(): 'sm' | 'md' | 'lg' {
    return untracked(() => this._size());
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

  protected hasValueComputed = computed(() => {
    const valueVal = this._value();
    return valueVal || valueVal === false ? true : false;
  });

  protected notHasValueComputed = computed(() => {
    const valueVal = this._value();
    return valueVal || valueVal === false ? false : true;
  });

  protected showErrorComputed = computed(() => {
    const invalidVal = this._status() === 'INVALID';
    const touchedVal = this._touched();
    const dirtyVal = !this._pristine();
    const enabledVal = this._enabledError();
    return enabledVal && invalidVal && touchedVal && dirtyVal;
  });

  public clear(value: T|null = null): void {
     const control = this.ngControl?.control;

    if (control) {
      control.setValue(value);
      control.markAsPristine();
      control.markAsUntouched();
    } else {
      this.value = value;
    }

    this.element?.nativeElement.focus();
  };

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

  protected onInput(event: Event): void { 
    const value = (event.target as FormElement).value; 
    this.value = value as T|null; 
  } 

  protected onBlur(): void { 
    this.onTouched(); 
  }

  protected statusUpdate():void {
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
}