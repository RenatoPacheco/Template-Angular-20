import { Component, computed, Input, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FormBase } from "@app/shared/directives";
import { transformBoolean } from "@app/shared/utils";
import { CKEditorModule } from "ckeditor4-angular";

export type CkeditorConfig = {
    readonly versionCheck?: boolean;

    readonly entities?: boolean;
    readonly basicEntities?: boolean;
    readonly entities_latin?: boolean;
    readonly entities_greek?: boolean;

    readonly language?: string;
    readonly contentsLanguage?: string;

    readonly height?: number | string;
    readonly width?: number | string;

    readonly readOnly?: boolean;

    readonly toolbar?: string | readonly string[];

    readonly removeButtons?: string;
    readonly removePlugins?: string;
    readonly extraPlugins?: string;

    readonly allowedContent?: boolean;
    readonly autoParagraph?: boolean;
};

@Component({
  standalone: true,
  selector: 'app-form-editor',
  imports: [ FormsModule, CKEditorModule ],
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

  protected _config = signal<CkeditorConfig>({});
  @Input() set config(value: CkeditorConfig) {
    if (value !== this.config) {
      this._config.set(value || {});
    }
  }
  public get config(): CkeditorConfig {
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
    let result = {
      ...configVal, ...{
        versionCheck: false,
        entities: false,
        basicEntities: false,
        entities_latin: false,
        entities_greek: false
      }
    };

    if (paragraphVal == false) {
      result = {...result, ...{
        enterMode: 2,      // ENTER_BR
        shiftEnterMode: 2, // ENTER_BR
        autoParagraph: false
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

}