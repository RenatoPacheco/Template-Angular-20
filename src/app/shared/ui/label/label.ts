import { Component, computed, EventEmitter, Input, output, Output, signal, untracked } from '@angular/core';
import { transformBoolean } from '@app/shared/utils';

@Component({
  standalone: true,
  selector: 'label[app-label]',
  templateUrl: './label.html',
  styleUrl: './label.scss',
  imports: [],
  host: {
    '[class]': 'hostClass()',
    '[for]': 'hostFor()',
    '[title]': 'hostTitle()'
  }
})
export class Label {

  public helper = output<void>();
  public error = output<void>();

  protected _text = signal('&nbsp;');
  @Input()
  public set text(value: string) {
    if (value !== this.text) {
      this._text.set(value);
    }
  }
  public get text(): string {
    return this._text();
  }

  protected _class = signal('');
  @Input()
  public set class(value: string) {
    if (value !== this._class()) {
      this._class.set(value);
    }
  }
  public get class(): string {
    return this._class();
  }

  protected _for = signal('');
  @Input()
  public set for(value: string) {
    if (value !== this._for()) {
      this._for.set(value);
    }
  }
  public get for(): string {
    return this._for();
  }

  protected _title = signal('');
  @Input()
  public set title(value: string) {
    if (value !== this._title()) {
      this._title.set(value);
    }
  }
  public get title(): string {
    return this._title();
  }

  protected _enabledError = signal(false);
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
    return this._enabledError();
  }

  protected _enabledHelper = signal(false);
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
    return this._enabledHelper();
  }

  protected textComputed = computed(() => {
    return this._text();
  });

  protected hostClass = computed(() => {
    const classVal = this._class();
    let result = classVal;
    return `form-label ${result}`;
  });

  protected hostFor = computed(() => {
    return this._for();
  });

  protected hostTitle = computed(() => {
    return this._title();
  });

  protected enabledHelperComputed = computed(() => {
    return this._enabledHelper();
  });

  protected enabledErrorComputed = computed(() => {
    return this._enabledError();
  });
  
  protected emitHelper(): void {
    this.helper.emit();
  }

  protected onError(): void {
    this.error.emit();
  }
}
