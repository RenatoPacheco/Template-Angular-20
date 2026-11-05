import { Component, computed, inject, Input, OnDestroy, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CKEditor4, CKEditorModule } from "ckeditor4-angular";

import { FormElementBase } from "@app/shared/directives";
import { transformBoolean, transformNumber } from "@app/shared/utils";

import { Label } from "../label/label";
import { FormEditorBaseConfig, FormEditorBasic, FormEditorComplte, FormEditorConfig, FormEditorDisabled, FormEditorParagraphOff } from "./form-editor.model";
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
export class FormEditor extends FormElementBase<string> implements OnDestroy {

  constructor() {
    super();
  }

  public ngOnInit(): void {
    this.mobile = this.servResize.mobile;
    this.servResize.eventMobile
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((resp: boolean) => {
        this.mobile = resp;
    });
    this.servPlataformLocation.popState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.historyEntryPending = false;
          this.maximize(false);
        }
      });
  }
  
  public ngOnDestroy(): void {
    this.historyEntryPending = false;
    this.maximize(false);
  }

  private historyEntryPending = false;

  private readonly servResize = inject(ResizeService);
  private readonly servPlataformLocation = inject(PlataformLocationService);
  
  public readonly save = output<string|null>();
  private readonly editors: any[] = [];

  protected _template = signal<'complete' | 'basic'>('complete');
  protected set template(value: 'complete' | 'basic') {
    if (value !== this.template) {
      this._template.set(value);
    }
  }
  protected get template(): 'complete' | 'basic' {
    return this._template();
  }

  protected _mobile = signal<boolean>(false);
  protected set mobile(value: boolean) {
    if (value !== this.mobile) {
      this._mobile.set(value);
    }
  }
  protected get mobile(): boolean {
    return this._mobile();
  }

  protected override normalizeValue(value: string|null): string|null {
    if (this.paragraph === false && value) {
      value = value.replace(/<\s*p(\s*|\s+[^>]+)>/gi, '<br />');
      value = value.replace(/<\s*\/p\s*>/gi, '');
      value = value.replace(/^\s*<br\s*\/?\s*>\s*/gi, '');
    }
    return value;
  }

  protected readonly _paragraph = signal(true);
  @Input({ transform: transformBoolean })
  public set paragraph(value: boolean) {
    if (value !== this.paragraph) {
      this._paragraph.set(value);
    }
  }
  public get paragraph(): boolean {
    return this._paragraph();
  }

  protected readonly _height = signal(250);
  @Input({ transform: transformNumber })
  public set height(value: number) {
    if (value !== this.height) {
      this._height.set(value);
    }
  }
  public get height(): number {
    return this._height();
  }

  protected isMobile = computed(() => {
  return this._mobile();
  });

  protected hostClass = computed(() => {
    const _class = this._class();
    const itens = ['form-group mb-3'];

    if (_class) {
      itens.push(_class);
    }

    return itens.join(' ');
  });

  protected basicConfig = computed(() => {
    const _height = this._height();
    const _paragraph = this._paragraph();

    let result = {
      ...FormEditorBaseConfig,
      ...FormEditorBasic,
      height: _height,
    } as FormEditorConfig;

    if (_paragraph === false) {
      result = {
        ...result,
        ...FormEditorParagraphOff
      }
    }

    return result;
  });

  protected completeConfig = computed(() => {
    const _height = this._height();
    const _paragraph = this._paragraph();

    let result = {
      ...FormEditorBaseConfig,
      ...FormEditorComplte,
      height: _height,
    } as FormEditorConfig;

    if (_paragraph === false) {
      result = {
        ...result,
        ...FormEditorParagraphOff
      }
    }

    return result;
  });

  protected disabledConfig = computed(() => {
    const _height = this._height();
    const _paragraph = this._paragraph();

    let result = {
      ...FormEditorBaseConfig,
      ...FormEditorDisabled,
      height: _height,
    } as FormEditorConfig;

    if (_paragraph === false) {
      result = {
        ...result,
        ...FormEditorParagraphOff
      }
    }

    return result;
  });

  protected useBasicConfig = computed(() => {
    const _template = this._template() == 'basic';
    const _mobile = this.isMobile();
    return _template || _mobile;
  });

  protected useCompleteConfig = computed(() => {
    const _template = this._template() == 'complete';
    const _mobile = this.isMobile();
    return _template && !_mobile;
  });

  protected emitReady(event: CKEditor4.EventInfo): void {
    const editor = event.editor;
    this.editors.push(editor);
    editor.on('destroy', () => {
      const index = this.editors.indexOf(editor);
      if (index !== -1) {
        this.editors.splice(index, 1);
      }
    });
    editor.on('maximize', (evt: CKEditor4.EventInfo) => this.emitMaximizeChange(evt.data as unknown as number));
  }

  protected emitMaximizeChange(state: number): void {
    if (state === 1 && !this.historyEntryPending) {
      history.pushState(history.state, '', location.href);
      this.historyEntryPending = true;
    } else if (state === 2 && this.historyEntryPending) {
      this.historyEntryPending = false;
      history.back();
    }
  }

  protected emitEditorChange(event: CKEditor4.EventInfo): void {
    const data = event.data?.toString();
    if (data === 'custon-save' || data === 'resize') {
      this.maximize(false);
    }
    if (data === 'custon-save') {
      this.save.emit(this.value);
    }
  }

  protected maximize(value: boolean): void {
    for (const editor of [...this.editors]) {
      try {
        if (editor.getCommand('maximize').state  === 1 && !value) {
          editor.execCommand('maximize');
        } else if (editor.getCommand('maximize').state  === 2 && value) {
          editor.execCommand('maximize');
        }
      } catch (e) {
        console.error('Falha ao maximizar o editor', e);
        this.editors.splice(this.editors.indexOf(editor), 1);
      }
    }
  }
}