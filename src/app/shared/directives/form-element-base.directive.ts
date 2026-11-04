import { AfterContentInit, computed, DestroyRef, Directive, inject, Input, output, signal } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Guid } from "guid-typescript";

import { transformBoolean } from "@app/shared/utils";
import { ValidatorService } from "@app/shared/services";
import { ToastService } from "@app/core";

@Directive()
export abstract class FormElementBase<T> 
  implements ControlValueAccessor, AfterContentInit {
  
  constructor() {
    this.ngControl.valueAccessor = this;
  }

  public ngAfterContentInit(): void {
    this.statusUpdate();

    this.control?.events
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.statusUpdate();
      }
    });
  }
  
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly ngControl = inject(NgControl, { self: true });

  protected readonly validator = inject(ValidatorService);
  protected readonly toast = inject(ToastService);
  protected errorId: string|null = null;

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
    this._value.set(this.normalizeValue(value));
  }

  public registerOnChange(fn: (value: T|null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
  
  //endregion

  protected readonly _status = signal<'VALID'|'INVALID'|'PENDING'|'DISABLED'>('VALID');
  public get status(): 'VALID'|'INVALID'|'PENDING'|'DISABLED' {
    return this._status();
  }

  protected readonly _pristine = signal(true);
  public get pristine(): boolean {
    return this._pristine();
  }
  public get dirty(): boolean {
    return !this._pristine();
  }

  protected readonly _touched = signal(false);
  public get touched(): boolean {
    return this._touched();
  }
  public get untouched(): boolean {
    return !this._touched();
  }

  protected readonly _value = signal<T|null>(null);
  public get value(): T|null {
    return this._value();
  }

  protected readonly _disabled = signal(false);
  public get disabled(): boolean { 
    return this._disabled();
  }

  protected readonly _id = signal(Guid.create().toString());
  @Input() public set id(value: string) {
    if (value !== this.id) {
      this._id.set(value);
    }
  }
  public get id(): string {
    return this._id();
  }

  protected readonly _class = signal('');
  @Input() public set class(value: string) {
    if (value !== this.class) {
      this._class.set(value);
    }
  }
  public get class(): string {
    return this._class();
  }

  protected readonly _readonly = signal(false);
  @Input({ transform: transformBoolean })
  public set readonly(value: boolean) {
    if (value !== this.readonly) {
      this._readonly.set(value);
    }
  }
  public get readonly(): boolean {
    return this._readonly();
  }

  protected readonly _label = signal('');
  @Input() public set label(value: string) {
    if (value !== this.label) {
      this._label.set(value);
    }
  }
  public get label(): string {
    return this._label();
  }

  protected _loading = signal(false);
  @Input({ transform: transformBoolean })
  public set loading(value: boolean) {
    if (value !== this._loading()) {  
    this._loading.set(value);
    }
  }
  public get loading(): boolean {
    return this._loading();
  }

  protected readonly _size = signal<'sm'|'md'|'lg'>('md');
  @Input() public set size(value: 'sm'|'md'|'lg') {
    if (value !== this.size) {
      this._size.set(value);
    }
  }
  public get size(): 'sm'|'md'|'lg' {
    return this._size();
  }

  protected readonly _enabledError = signal(true);
  @Input({ transform: transformBoolean, alias: 'enabled-error' })
  public set enabledError(value: boolean) {
    if (value !== this.enabledError) {
      this._enabledError.set(value);
    }
  }
  public get enabledError(): boolean {
    return this._enabledError();
  }

  protected readonly _enabledHelper = signal(false);
  @Input({ transform: transformBoolean, alias: 'enabled-helper' })
  public set enabledHelper(value: boolean) {
    if (value !== this.enabledHelper) {
      this._enabledHelper.set(value);
    }
  }
  public get enabledHelper(): boolean {
    return this._enabledHelper();
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

  public isActive = computed(() => {
    const realOnly = this._readonly();
    const disabled = this._disabled();
    return !realOnly && !disabled;
  });

  public hasValue = computed(() => {
    return !this.isEmpty(this._value());
  });

  public notHasValue = computed(() => {
    return !this.hasValue();
  });

  protected showError = computed(() => {
    const _invalid = this._status() === 'INVALID';
    const _touched = this._touched();
    const _dirty = !this._pristine();
    const _enabled = this._enabledError();
    return _enabled && _invalid && _touched && _dirty;
  });

  public clear(value: T|null = null): void {
    const control = this.control;

    control?.setValue(value);
    control?.markAsPristine();
    control?.markAsUntouched();

    this.focusTarget()?.focus();
  };

  protected focusTarget(): HTMLElement | null {
    return null;
  }

  protected normalizeValue(value: T|null): T|null {
    return value;
  }

  protected isEmpty(value: T|null): boolean {
    if (typeof value === 'boolean' || typeof value === 'number') {
      return false;
    }

    if (!value) {
      return true;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }

    return false;
  }

  protected commitValue(value: T|null): void {
    const normalized = this.normalizeValue(value);
    if (normalized !== this._value()) {
      this._value.set(normalized);
      this.onChange(normalized);
    }
  }

  protected emitError(): void {
    const errors = this.control?.errors;
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

  protected emitHelper(): void {
    this.helper.emit(); 
  }

  protected emitBlur(): void { 
    this.onTouched(); 
  }

  protected get control(): AbstractControl | null {
    return this.ngControl.control;
  }

  protected statusUpdate():void {
    if (this.control) {
      if (this.status !== this.control.status) {
        this._status.set(this.control.status);
      }
      if (this.pristine !== this.control.pristine) {
        this._pristine.set(this.control.pristine);
      }
      if (this.touched !== this.control.touched) {
        this._touched.set(this.control.touched);
      }
      if (this.disabled !== this.control.disabled) {
        this._disabled.set(this.control.disabled);
      }
    }
  }
}
