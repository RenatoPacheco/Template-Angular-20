import { Component, computed, EventEmitter, Input, Output, signal, untracked } from '@angular/core';
import { transformBoolean } from '@app/shared/utils';

@Component({
  standalone: true,
  selector: 'label[app-label]',
  templateUrl: './label.html',
  styleUrl: './label.scss',
  host: {
    '[class]': 'classComputed()',
    '[for]': 'forComputed()',
    '[title]': 'titleComputed()'
  }
})
export class Label {

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

  private _text = signal('&nbsp;');
  @Input()
  public set text(value: string) {
    if (value !== this.text) {
      this._text.set(value);
    }
  }
  public get text(): string {
    return untracked(() => this._text());
  }

  private _class = signal('');
  @Input()
  public set class(value: string) {
    if (value !== this._class()) {
      this._class.set(value);
    }
  }
  public get class(): string {
    return untracked(() => this._class());
  }

  private _for = signal('');
  @Input()
  public set for(value: string) {
    if (value !== this._for()) {
      this._for.set(value);
    }
  }
  public get for(): string {
    return untracked(() => this._for());
  }

  private _title = signal('');
  @Input()
  public set title(value: string) {
    if (value !== this._title()) {
      this._title.set(value);
    }
  }
  public get title(): string {
    return untracked(() => this._title());
  }

  public _isValid = signal(false);
  @Input({ 
    alias: 'is-valid',
    transform: transformBoolean 
  })
  public set isValid(value: boolean) {
    if (value !== this.isValid) {
      this._isValid.set(value);
    }
  }
  public get isValid(): boolean {
    return untracked(() => this._isValid());
  }

  public _isInvalid = signal(false);
  @Input({ 
    alias: 'is-invalid',
    transform: transformBoolean 
  })
  public set isInvalid(value: boolean) {
    if (value !== this.isInvalid) {
      this._isInvalid.set(value);
    }
  }
  public get isInvalid(): boolean {
    return untracked(() => this._isInvalid());
  }

  protected textComputed = computed(() => {
    return this._text();
  });

  protected classComputed = computed(() => {
    const classVal = this._class();
    const isInvalidVal = this._isInvalid();
    const isValidVal = this._isValid();

    let result = classVal;
    if (isInvalidVal) {
      result += ' is-invalid';
    } else if (isValidVal) {
      result += ' is-valid';
    }

    return `form-label ${result}`;
  });

  protected forComputed = computed(() => {
    return this._for();
  });

  protected titleComputed = computed(() => {
    return this._title();
  });

  protected haHelperComputed = computed(() => {
    return this._helper() !== null;
  });

  protected hasErrorComputed = computed(() => {
    const isInvalidVal = this._isInvalid();
    const errorVal = this._error();
    return errorVal !== null && isInvalidVal;
   });

  protected onHelper(): void {
    const helperVal = this._helper();
    if (helperVal) {
      helperVal();
    }
  }

  protected onError(): void {
    const errorVal = this._error();
    if (errorVal) {
      errorVal();
    }
  }
}
