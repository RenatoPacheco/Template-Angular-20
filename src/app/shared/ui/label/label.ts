import { Component, computed, DestroyRef, EventEmitter, inject, Input, output, Output, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '@app/core';
import { ValidatorService } from '@app/shared/services';
import { isErrorVisible, transformBoolean } from '@app/shared/utils';

@Component({
  standalone: true,
  selector: 'label[app-label], legend[app-label]',
  templateUrl: './label.html',
  styleUrl: './label.scss',
  imports: [],
  host: {
    '[class]': 'hostClass()',
    '[attr.for]': 'hostFor()',
    '[title]': 'hostTitle()',
    '[class.is-valid]': "effectiveState() === 'valid'",
    '[class.is-invalid]': "effectiveState() === 'invalid'"
  }
})
export class Label {

  public helper = output<void>();
  public error = output<{
    id: string|null,
    messages: string[],
    label: string,
    errors: ValidationErrors|null
  }>();

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

  protected _state = signal<'valid' | 'invalid' | null>(null);
  @Input()
  public set state(value: 'valid' | 'invalid' | null) {
    if (value !== this._state()) {
      this._state.set(value);
    }
  }
  public get state(): 'valid' | 'invalid' | null {
    return this._state();
  }

  protected _control = signal<AbstractControl | null>(null);
  protected readonly _controlVersion = signal(0);
  protected readonly controlChanged = new Subject<void>();
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly validator = inject(ValidatorService);
  protected readonly toast = inject(ToastService);
  protected errorId: string|null = null;

  @Input()
  public set control(value: AbstractControl | null) {
    if (value !== this._control()) {
      this._control.set(value);
      this.controlChanged.next();
      value?.events
        .pipe(takeUntil(this.controlChanged), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this._controlVersion.update(version => version + 1));
      this._controlVersion.update(version => version + 1);
    }
  }
  public get control(): AbstractControl | null {
    return this._control();
  }

  protected readonly errorVisible = computed(() => {
    this._controlVersion();
    return isErrorVisible(this._control(), this._enabledError());
  });

  protected readonly effectiveState = computed(() => {
    return this._state() ?? (this.errorVisible() ? 'invalid' : null);
  });

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

  protected textComputed = computed(() => {
    return this._text();
  });

  protected hostClass = computed(() => {
    const _class = this._class();
    let result = _class;
    return `form-label ${result}`;
  });

  protected hostFor = computed(() => {
    return this._for();
  });

  protected hostTitle = computed(() => {
    return this._title();
  });

  protected showHelperIcon = computed(() => {
    return this._enabledHelper();
  });

  protected showErrorIcon = computed(() => {
    return this._control() ? this.errorVisible() : this._enabledError();
  });
  
  protected emitHelper(): void {
    this.helper.emit();
  }

  protected emitError(): void {
    const errors = this._control()?.errors ?? null;
    const messages = this.validator.getMessages(errors);
    if (messages.length) {
      this.toast.remove(this.errorId);
      this.errorId = this.toast.error({ message: messages });
    }
    this.error.emit({
      id: messages.length ? this.errorId : null,
      messages: messages,
      label: this.text,
      errors: errors
    });
  }
}
