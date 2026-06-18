import { Component, computed, ElementRef, inject, Input, Renderer2, signal, untracked } from '@angular/core';

import { InputVariant, transformBoolean } from '@app/shared/utils';

type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonType = 'button' | 'submit' | 'reset';

type ButtonAction = 
| 'edit' | 'delete' | 'view' | 'save' | 'cancel' 
| 'submit' | 'reset' | 'download' | 'upload' 
| 'search' | 'filter' | 'sort' | 'refresh' | 'add' 
| 'remove' | 'approve' | 'reject' | 'archive'
| 'unarchive' | 'enable' | 'disable' | 'lock' | 'unlock';

type ButtonTheme = InputVariant|ButtonAction|'link'|'transparent';

@Component({
  standalone: true,
  selector: 'button [app-button]',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[title]': 'hostTitle()',
    '[class]': 'hostClass()',
    '[type]': 'typeComputed()',
    '[disabled]': 'disabledComputed()'
  }
})
export class Button {

  private element = inject(ElementRef);
  private renderer = inject(Renderer2);

  protected _type = signal<ButtonType>('button');
  @Input()
  public set type(value: ButtonType) {
    if (value !== this.type) {
      this._type.set(value);
    }
  }
  public get type(): ButtonType {
    return untracked(() => this._type());
  }

  protected _text = signal('');
  @Input()
  public set text(value: string) {
    if (value !== this.text) {
      this._text.set(value);
    }
  }
  public get text(): string {
    return untracked(() => this._text());
  }

  protected _title = signal('');
  @Input()
  public set title(value: string) {
    if (value !== this.title) {
      this._title.set(value);
    }
  }
  public get title(): string {
    return untracked(() => this._title());
  }

  protected _disabled = signal(false);
  @Input({ transform: transformBoolean })
  public set disabled(value: boolean) {
    if (value !== this.disabled) {
      this._disabled.set(value);
    }
  }
  public get disabled(): boolean {
    return untracked(() => this._disabled());
  }

  protected _loading = signal(false);
  @Input({ transform: transformBoolean })
  public set loading(value: boolean) {
    if (value !== this.loading) {
      this._loading.set(value);
    }
  }
  public get loading(): boolean {
    return untracked(() => this._loading());
  }

  protected _class = signal('');
  @Input()
  public set class(value: string) {
    if (value !== this.class) {
      this._class.set(value);
    }
  }
  public get class(): string {
    return untracked(() => this._class());
  }

  protected _theme = signal<ButtonTheme>('');
  @Input() 
  public set theme(value: ButtonTheme) {
    if (value !== this._theme()) {
      this._theme.set(value);
    }
  }
  public get theme(): ButtonTheme {
    return untracked(() => this._theme());
  }

  protected _size = signal<ButtonSize>('md');
  @Input() 
  public set size(value: ButtonSize) {
    if (value !== this._size()) {
      this._size.set(value);
    }
  }
  public get size(): ButtonSize {
    return untracked(() => this._size());
  }

  protected typeComputed = computed(() => {
    return this._type();
  });

  protected disabledComputed = computed(() => {
    return this._disabled();
  });

  protected hostClass = computed(() => {
    const classVal = this._class();
    const themeVal = this.themes[this._theme()] || this.themes[''];
    const sizeVal = this.sizes[this._size()] || '';
    return `${themeVal} ${sizeVal} ${classVal}`;
  });

  protected iconComputed = computed(() => {
    const themeVal = this._theme();
    const loadingVal = this._loading();
    if (loadingVal) {
      return 'fa fa-spinner fa-spin';
    }
    return this.icons[themeVal as ButtonAction] || '';
  });

  protected textComputed = computed(() => {
    const themeVal = this._theme();
    const textVal = this._text();
    if (textVal) {
      return textVal;
    }
    return this.texts[themeVal as ButtonAction] || '';
  });

  protected hostTitle = computed(() => {
    const themeVal = this._theme();
    const titleVal = this._title();
    if (titleVal) {
      return titleVal;
    }
    let resultVal = this.texts[themeVal as ButtonAction];
    return resultVal ? `clique para ${resultVal.toLowerCase()}` : '';
  });

  private sizes: Record<ButtonSize, string> = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  private texts: Record<ButtonAction, string> = {
    'edit': 'Editar',
    'delete': 'Excluir',
    'view': 'Visualizar',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'submit': 'Enviar',
    'reset': 'Redefinir',
    'download': 'Baixar',
    'upload': 'Enviar',
    'search': 'Pesquisar',
    'filter': 'Filtrar',
    'sort': 'Ordenar',
    'refresh': 'Atualizar',
    'add': 'Adicionar',
    'remove': 'Remover',
    'approve': 'Aprovar',
    'reject': 'Rejeitar',
    'archive': 'Arquivar',
    'unarchive': 'Desarquivar',
    'enable': 'Habilitar',
    'disable': 'Desabilitar',
    'lock': 'Bloquear',
    'unlock': 'Desbloquear'
  };

  private icons: Record<ButtonAction, string> = {
    edit: 'fa fa-pencil',
    delete: 'fa fa-trash',
    view: 'fa fa-eye',
    save: 'fa fa-save',
    cancel: 'fa fa-times',
    submit: 'fa fa-check',
    reset: 'fa fa-refresh',
    download: 'fa fa-download',
    upload: 'fa fa-upload',
    search: 'fa fa-search',
    filter: 'fa fa-filter',
    sort: 'fa fa-sort',
    refresh: 'fa fa-refresh',
    add: 'fa fa-plus',
    remove: 'fa fa-minus',
    approve: 'fa fa-check-circle',
    reject: 'fa fa-times-circle',
    archive: 'fa fa-archive',
    unarchive: 'fa fa-folder-open',
    enable: 'fa fa-toggle-on',
    disable: 'fa fa-toggle-off',
    lock: 'fa fa-lock',
    unlock: 'fa fa-unlock'
  };

  private themes: Record<ButtonTheme, string> = {
    '' : 'btn btn-outline-primary',
    error: 'btn btn-outline-danger',
    primary: 'btn btn-outline-primary',
    secondary: 'btn btn-outline-secondary',
    success: 'btn btn-outline-success',
    warning: 'btn btn-outline-warning',
    info: 'btn btn-outline-info',
    danger: 'btn btn-outline-danger',
    light: 'btn btn-outline-light',
    dark: 'btn btn-outline-dark',
    edit: 'btn btn-outline-primary',
    delete: 'btn btn-outline-danger',
    view: 'btn btn-outline-secondary',
    save: 'btn btn-outline-success',
    cancel: 'btn btn-outline-warning',
    submit: 'btn btn-outline-info',
    reset: 'btn btn-outline-secondary',
    download: 'btn btn-outline-primary',
    upload: 'btn btn-outline-secondary',
    search: 'btn btn-outline-info',
    filter: 'btn btn-outline-secondary',
    sort: 'btn btn-outline-secondary',
    refresh: 'btn btn-outline-secondary',
    add: 'btn btn-outline-success',
    remove: 'btn btn-outline-danger',
    approve: 'btn btn-outline-success',
    reject: 'btn btn-outline-danger',
    archive: 'btn btn-outline-secondary',
    unarchive: 'btn btn-outline-secondary',
    enable: 'btn btn-outline-success',
    disable: 'btn btn-outline-danger',
    lock: 'btn btn-outline-secondary',
    unlock: 'btn btn-outline-secondary',
    link: 'btn btn-link',
    transparent: 'btn btn-transparent'
  };
}
