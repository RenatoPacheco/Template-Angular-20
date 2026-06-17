import { DestroyRef, inject, Injectable, OnDestroy, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlataformLocationService, ResizeService } from '@app/shared/services';
import { FormEditorBasic, FormEditorComplte, FormEditorDisabled } from './form-editor-model';

// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html
@Injectable()
export class FormEditorService implements OnInit  {

  private readonly servResize = inject(ResizeService);
  private readonly servPlataformLocation = inject(PlataformLocationService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly complete = {...FormEditorComplte};
  private readonly basic = {...FormEditorBasic};
  private readonly ready = {...FormEditorDisabled};

  public ngOnInit(): void {
    this.servResize.eventMobile
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((resp: boolean) => {
        this.isMobile = resp;
    });
    this.servPlataformLocation.popState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
      // this.maximize(false);
    });    
  }

  public editor!: any;

  private _isMobile = signal(false);
  private set isMobile(value: boolean) {
    if (value !== this.isMobile) {
      this._isMobile.set(value);
    }
  }
  public get isMobile(): boolean {
    return untracked(() => this._isMobile());
  }

  private _template = signal<'basic' | 'complete'>('complete');
  private set template(value: 'basic' | 'complete') {
    if (value !== this.template) {
      this._template.set(value);
    }
  }
  public get template(): 'basic' | 'complete' {
    return untracked(() => this._template());
  }

  public set height(value: number) {
    this.complete.height = value;
    this.basic.height = value;
    this.ready.height = value;
  }

  public set bodyClass(value: string) {
    this.complete.bodyClass = value;
    this.basic.bodyClass = value;
    this.ready.bodyClass = value;
  }

  public maximize(value: boolean): void {
    if (this.editor) {
      try {
        if (this.editor.getCommand('maximize').state  === 1 && !value) {
          this.editor.execCommand('maximize');
        } else if (this.editor.getCommand('maximize').state  === 2 && value) {
          this.editor.execCommand('maximize');
        }
      } catch (e) {
        window.location.reload();
      }
    }
  }

}
