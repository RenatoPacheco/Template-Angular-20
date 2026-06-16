import { Component, computed, inject, Input, signal, untracked } from "@angular/core";
import { ControlContainer, FormControl } from "@angular/forms";
import { transformBoolean } from "@app/shared/utils";

@Component({
    standalone: true,
    selector: 'app-form-radio',
    templateUrl: './form-radio.html',
    host: {
        '[class]': 'hostClass()'
    }
})
export class FormRadio {
    private controlContainer = inject(ControlContainer);

    public get status(): 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED' {
        return this.control?.status;
    }

    public get pristine(): boolean {
        return this.control?.pristine ?? false;
    }

    public get dirty(): boolean {
        return this.control?.dirty ?? false;
    }

    public get touched(): boolean {
        return this.control?.touched ?? false;
    }

    public get untouched(): boolean {
        return this.control?.untouched ?? false;
    }

    protected readonly _controlName = signal<string>('');
    @Input() public get controlName(): string {
        return untracked(() => this._controlName());
    }
    public set controlName(controlName: string) {      
        if (this.controlName !== controlName) {
            this._controlName.set(controlName);
        }
    }

    protected readonly _value = signal<unknown|null>(null);
    @Input() public get value(): unknown|null {
        return untracked(() => this._value());
    }
    public set value(value: unknown|null) {      
        if (this.value !== value) {
            this._value.set(value);
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
    @Input() public set id(value: string) {
        if (value !== this.id) {
            this._id.set(value);
        }
    }
    public get id(): string {
        return untracked(() => this._id());
    }

    protected readonly _class = signal('');
    @Input() public set class(value: string) {
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
  @Input()
  public set label(value: string) {
    if (value !== this.label) {
      this._label.set(value);
    }
  }
  public get label(): string {
    return untracked(() => this._label());
  }

  protected readonly _theme = signal<'switch'|''>('');
  @Input()
  public set theme(value: 'switch') {
    if (value !== this.theme) {
      this._theme.set(value);
    }
  }
  public get theme(): 'switch'|'' {
    return untracked(() => this._theme());
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

  public get control(): FormControl {
      return this.controlContainer.control?.get(this.controlName) as FormControl;
  }

  public get checked(): boolean {
      return this.control.value === this.value;
  }

  protected onToggle(event: Event): void {
      this.control.setValue(this.value);
      this.control.markAsTouched();
  }

  protected hostClass = computed(() => {
    const classVal = this._class();
    const themeVal = this._theme();
    const inlineVal = this._inline();
    const parts = ['form-check'];

    if (themeVal === 'switch') {
      parts.push(' form-switch');
    }

    if (inlineVal) {
      parts.push(' form-check-inline');
    }

    if (classVal) {
      parts.push(` ${classVal}`);
    }

    return parts.join('');
  });
}