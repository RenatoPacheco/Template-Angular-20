import { Component, computed, inject, Input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CKEditor4, CKEditorModule } from "ckeditor4-angular";

import { FormBase } from "@app/shared/directives";
import { transformBoolean } from "@app/shared/utils";

import { Label } from "../label/label";
import { FormEditorConfig } from "./form-editor-model";
import { FormEditorService } from "./form-editor-service";

@Component({
  standalone: true,
  selector: 'app-form-editor',
  providers: [FormEditorService],
  imports: [FormsModule, CKEditorModule, Label],
  templateUrl: './form-editor.html',
  styleUrl: './form-editor.scss',
  host: {
    '[class]' : 'hostClass()'
  }
})
export class FormEditor extends FormBase<string>  {

  constructor() {
    super();
  }

  private readonly controller = inject(FormEditorService);
  public readonly save = output<string|null>();

  public override set value(value: string|null) {
    if (value !== this.value) {
      if (this.paragraph === false && value) {
        value = value.replace(/<\s*p(\s*|\s+[^>]+)>/gi, '<br />');
        value = value.replace(/<\s*\/p\s*>/gi, '');
        value = value.replace(/^\s*<br\s*\/?\s*>\s*/gi, '');
      }
      this._value.set(value || null);
      this.onChange(value);
    }
  }
  public override get value(): string|null {
    return untracked(() => this._value());
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

  protected readonly _paragraph = signal(false);
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
        // extraPlugins: ['custon-save', 'indent-paragraph'],
        // Aparência
        skin: "moono-lisa",
        versionCheck: false,
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

  protected hostClass = computed(() => {
    const classVal = this._class();
    const itens = ['form-group mb-3'];

    if (classVal) {
      itens.push(classVal);
    }

    return itens.join(' ');
  });

  protected emitReady(event: CKEditor4.EventInfo): void {
    // this.controller.editor = event.editor;
  }

  protected emitChange(event: CKEditor4.EventInfo): void {
    return;
    const data = event.data?.toString();
    if (data === 'custon-save' || data === 'resize') {
      // this.controller.maximize(false);
    }
    if (data === 'custon-save') {
      this.save.emit(this.value);
    }
  }
}