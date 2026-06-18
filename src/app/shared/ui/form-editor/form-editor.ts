import { Component, computed, inject, Input, OnDestroy, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CKEditor4, CKEditorModule } from "ckeditor4-angular";

import { FormBase } from "@app/shared/directives";
import { transformBoolean } from "@app/shared/utils";

import { Label } from "../label/label";
import { FormEditorBasic, FormEditorComplte, FormEditorConfig, FormEditorDisabled } from "./form-editor-model";
import { PlataformLocationService, ResizeService } from "@app/shared/services";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  standalone: true,
  selector: 'app-form-editor',
  imports: [FormsModule, CKEditorModule, Label],
  templateUrl: './form-editor.html',
  styleUrl: './form-editor.scss',
  host: {
    '[class]' : 'hostClass()'
  }
})
// https://ckeditor.com/docs/ckeditor4/4.22.1/api/CKEDITOR_config.html
export class FormEditor extends FormBase<string> implements OnDestroy {

  constructor() {
    super();
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.servResize.eventMobile
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((resp: boolean) => {
        this.mobile = resp;
    });
    this.servPlataformLocation.popState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.maximize(false);
        }
      });
  }
  
  public ngOnDestroy(): void {
    this.maximize(false);
  }

  private readonly servResize = inject(ResizeService);
  private readonly servPlataformLocation = inject(PlataformLocationService);
  
  public readonly save = output<string|null>();
  private readonly editors: any[] = [];

  protected configs = {
    complete: {...FormEditorComplte},
    basic: {...FormEditorBasic},
    disabled: {...FormEditorDisabled}
  }

  protected _template = signal<'complete' | 'basic'>('complete');
  protected set template(value: 'complete' | 'basic') {
    if (value !== this.template) {
      this._template.set(value);
    }
  }
  protected get template(): 'complete' | 'basic' {
    return untracked(() => this._template());
  }

  protected _mobile = signal<boolean>(false);
  protected set mobile(value: boolean) {
    if (value !== this.mobile) {
      this._mobile.set(value);
    }
  }
  protected get mobile(): boolean {
    return untracked(() => this._mobile());
  }

  public override set value(value: string|null) {
    if (this.paragraph === false && value) {
      value = value.replace(/<\s*p(\s*|\s+[^>]+)>/gi, '<br />');
      value = value.replace(/<\s*\/p\s*>/gi, '');
      value = value.replace(/^\s*<br\s*\/?\s*>\s*/gi, '');
    }
    super.value = value;
  }

  protected _config = signal<FormEditorConfig>({});
  @Input() set config(value: FormEditorConfig) {
    if (value !== this.config) {
      this._config.set(value || {});
    }
  }
  public get config(): FormEditorConfig {
    return untracked(() => this._config());
  }

  protected readonly _paragraph = signal(true);
  @Input({ transform: transformBoolean })
  public set paragraph(value: boolean) {
    if (value !== this.paragraph) {
      this._paragraph.set(value);
    }
  }
  public get paragraph(): boolean {
    return untracked(() => this._paragraph());
  }

  protected readonly _basic = signal(false);
  @Input({ transform: transformBoolean })
  public set basic(value: boolean) {
    if (value !== this.basic) {
      this._basic.set(value);
    }
  }
  public get basic(): boolean {
    return untracked(() => this._basic());
  }

  protected  __config = {
    versionCheck: false,
    entities: false,
    basicEntities: false,
    entities_latin: false,
    entities_greek: false
  };

  protected configComputed = computed(() => {
    const configVal = this._config();
    const paragraphVal = this._paragraph();
    const basicVal = this._basic();

    let result = {
      ...configVal, ...{
        // Plugins
        extraPlugins: ['custon-save', 'indent-paragraph'],
        // Aparência
        skin: "moono-lisa",
        versionCheck: false,
        removeButtons: ['About'],
        // Idioma
        language: 'pt-br',
        // Caracteres
        entities: false,
        basicEntities: false,
        entities_latin: false,
        entities_greek: false
      }
    };

    if (paragraphVal == false) {
      result = {...result, ...{
        // Quebras de linha
        enterMode: 2,      // ENTER_BR
        shiftEnterMode: 2, // ENTER_BR
        autoParagraph: false
      }};
    }

    if (basicVal == true) {
      result = {...result, ...{
        // Boões básicos
        toolbar: [
          ['Save'],
          ['Bold', 'Italic', 'Underline'],
          ['NumberedList', 'BulletedList'],
          ['Link', 'Unlink'],
          ['Undo', 'Redo']
        ]
      }};
    }

    return result;
  });

  protected isMobile = computed(() => {
  return this._mobile();
  });

  protected hostClass = computed(() => {
    const classVal = this._class();
    const itens = ['form-group mb-3'];

    if (classVal) {
      itens.push(classVal);
    }

    return itens.join(' ');
  });

  protected basicConfig = computed(() => {
    const configVal = this.configComputed();
    return {
      ...this.configs.basic,
      ...configVal
    };
  });

  protected completeConfig = computed(() => {
    const configVal = this.configComputed();
    return {
      ...this.configs.complete,
      ...configVal
    };
  });

  protected disabledConfig = computed(() => {
    const configVal = this.configComputed();
    return {
      ...this.configs.disabled,
      ...configVal
    };
  });

  protected set valueSync(value: string|null) {
    super.value = value;
  }
  protected get valueSync(): string|null {
    return this._value();
  }

  protected useBasicConfig = computed(() => {
    const templateVal = this._template() == 'basic';
    const mobileVal = this.isMobile();
    return templateVal || mobileVal;
  });

  protected useCompleteConfig = computed(() => {
    const templateVal = this._template() == 'complete';
    const mobileVal = this.isMobile();
    return templateVal && !mobileVal;
  });

  protected emitReady(event: CKEditor4.EventInfo): void {
    this.editors.push(event.editor);
  }

  protected emitChange(event: CKEditor4.EventInfo): void {
    const data = event.data?.toString();
    if (data === 'custon-save' || data === 'resize') {
      this.maximize(false);
    }
    if (data === 'custon-save') {
      this.save.emit(this.value);
    }
  }

  protected maximize(value: boolean): void {
    for (const editor of this.editors) {
      try {
        if (editor.getCommand('maximize').state  === 1 && !value) {
          editor.execCommand('maximize');
        } else if (editor.getCommand('maximize').state  === 2 && value) {
          editor.execCommand('maximize');
        }
      } catch (e) {
        window.location.reload();
        break;
      }
    }
  }
}