import { Component, computed, effect, ElementRef, inject, Input, Renderer2, signal, untracked, ViewChild } from '@angular/core';

import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { transformBoolean, transformNumber } from '@app/shared/utils';

import { Button } from '../button/button';
import { Label } from '../label/label';

type InputSize = 'sm' | 'md' | 'lg';

@Component({
  standalone: true,
  selector: 'app-form-text-area',
  imports: [ Label, FormsModule, Button ],
  templateUrl: './form-text-area.html',
  styleUrl: './form-text-area.scss',
  host: {
    '[class]': 'classComputed()'
  }
})
export class FormTextArea implements ControlValueAccessor {
  
  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      const value = this._value();
      this.element.nativeElement.value = value;
      if (this.onChange) this.onChange(value);
    });
  }

  private readonly renderer = inject(Renderer2);
  private readonly host = inject(ElementRef<HTMLDivElement>);
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  @ViewChild('textarea', {static: true})
  private element!: ElementRef<HTMLTextAreaElement>;

  //region ControlValueAccessor

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {}

  public writeValue(value: string): void {
    if (value !== this.value) {
    this._value.set(value);
    }
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  //endregion

  private readonly _value = signal<string>('');
  @Input() public get value(): string {
    return untracked(() => this._value());
  }
  public set value(value: string) {
      this.writeValue(value);
  }

  private _id = signal(`${crypto.randomUUID()}`);
  @Input()
  public set id(value: string) {
    if (value !== this.id) {
      this._id.set(value);
    }
  }
  public get id(): string {
    return untracked(() => this._id());
  }

  private _class = signal('');
  @Input()
  public set class(value: string) {
    if (value !== this.class) {
      this._class.set(value);
    }
  }
  public get class(): string {
    return untracked(() => this._class());
  }

  private _placeholder = signal('');
  @Input()
  public set placeholder(value: string) {
    if (value !== this.placeholder) {
      this._placeholder.set(value);
    }
  }
  public get placeholder(): string {
    return untracked(() => this._placeholder());
  }

  private _size = signal<InputSize>('md');
  @Input()
  public set size(value: InputSize) {
    if (value !== this.size) {
      this._size.set(value);
    }
  }
  public get size(): InputSize {
    return untracked(() => this._size());
  }

  public _rows = signal(5);
  @Input({ transform: transformNumber })
  public set rows(value: number) {
    if (value !== this.rows) {
      this._rows.set(value);
    }
  }
  public get rows(): number {
    return untracked(() => this._rows());
  }

  private _helper = signal<(() => void) | null>(null);
  @Input()
  public set helper(value: (() => void) | null) {
    if (value !== this.helper) {
      this._helper.set(value || null);
    }
  }
  public get helper(): (() => void) | null {
    return untracked(() => this._helper());
  }

  private _error = signal<(() => void) | null>(null);
  @Input()
  public set error(value: (() => void) | null) {
    if (value !== this.error) {
      this._error.set(value || null);
    }
  }
  public get error(): (() => void) | null {
    return untracked(() => this._error());
  }

  private _label = signal('');
  @Input({ required: true })
  public set label(value: string) {
    if (value !== this.label) {
      this._label.set(value);
    }
  }
  public get label(): string {
    return untracked(() => this._label());
  }

  protected labelComputed = computed(() => {
    const labelVal = this._label();
    return labelVal ? labelVal : 'Label';
  });

  protected errorComputed = computed(() => {
    const errorVal = this._error();
    return errorVal ? errorVal : null;
  });

  protected helperComputed = computed(() => {
    const helperVal = this._helper();
    return helperVal ? helperVal : null;
  });

  protected idComputed = computed(() => {
    return this._id();
  });

  protected classComputed = computed(() => {
    const classVal = this._class();
    return `${classVal}`;
  });

  protected textAreaClassComputed = computed(() => {
    const sizeVal = this._size();
    return `form-control form-control-${sizeVal}`;
  });

  protected placeholderComputed = computed(() => {
    return this._placeholder();
  });

  protected rowsComputed = computed(() => {
    return this._rows();
  });

  protected hasValueComputed = computed(() => {
    const valueVal = this._value();
    return valueVal ? true : false;
  });

  protected notHasValueComputed = computed(() => {
    const valueVal = this._value();
    return !valueVal;
  });

  public clear(): void {
    this.value = '';
    this.element.nativeElement.focus();
  };

}
