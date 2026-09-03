import { Component, computed, ElementRef, inject, Input, Renderer2, signal, untracked } from '@angular/core';

import { InputVariant, transformBoolean } from '@app/shared/utils';

type ButtonSize = 'sm'|'md'|'lg';

type ButtonType = 'button'|'submit'|'reset';

type ButtonAction = 
| 'edit'|'delete'|'view'|'save'|'cancel' 
| 'submit'|'reset'|'download'|'upload' 
| 'search'|'filter'|'sort'|'refresh'|'add' 
| 'remove'|'approve'|'reject'|'archive'
| 'unarchive'|'enable'|'disable'|'lock'|'unlock'
| 'notify'|'next'|'previous'|'copy';

type ButtonTheme = InputVariant|'link'|'transparent';

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
  @Input() public set type(value: ButtonType) {
    if (value !== this.type) {
      this._type.set(value);
    }
  }
  public get type(): ButtonType {
    return this._type();
  }

  protected _text = signal('');
  @Input() public set text(value: string) {
    if (value !== this.text) {
      this._text.set(value);
    }
  }
  public get text(): string {
    return this._text();
  }

  protected _title = signal('');
  @Input() public set title(value: string) {
    if (value !== this.title) {
      this._title.set(value);
    }
  }
  public get title(): string {
    return this._title();
  }

  protected _disabled = signal(false);
  @Input({ transform: transformBoolean })
  public set disabled(value: boolean) {
    if (value !== this.disabled) {
      this._disabled.set(value);
    }
  }
  public get disabled(): boolean {
    return this._disabled();
  }

  protected _loading = signal(false);
  @Input({ transform: transformBoolean })
  public set loading(value: boolean) {
    if (value !== this.loading) {
      this._loading.set(value);
    }
  }
  public get loading(): boolean {
    return this._loading();
  }

  protected _class = signal('');
  @Input() public set class(value: string) {
    if (value !== this.class) {
      this._class.set(value);
    }
  }
  public get class(): string {
    return this._class();
  }

  protected _theme = signal<ButtonTheme>('');
  @Input() public set theme(value: ButtonTheme) {
    if (value !== this._theme()) {
      this._theme.set(value);
    }
  }
  public get theme(): ButtonTheme {
    return this._theme();
  }

  protected _action = signal<ButtonAction|null>(null);
  @Input() public set action(value: ButtonAction|null) {
    if (value !== this._action()) {
      this._action.set(value || null);
    }
  }
  public get action(): ButtonAction|null {
    return this._action();
  }

  protected _size = signal<ButtonSize>('md');
  @Input() public set size(value: ButtonSize) {
    if (value !== this._size()) {
      this._size.set(value);
    }
  }
  public get size(): ButtonSize {
    return this._size();
  }

  protected typeComputed = computed(() => {
    return this._type();
  });

  protected disabledComputed = computed(() => {
    return this._disabled();
  });

  protected hostClass = computed(() => {
    const _class = this._class();
    const _theme = this._theme();
    const _action = this._action();
    const _size = this._size();

    let _classFinal = _class || '';
    let _sizeFinal = this.sizes[_size] || '';
    let _themeFinal = this.themes[_theme] || this.themes[''];
    if (!_theme && _action) {
      _themeFinal = this.actions[_action] || _themeFinal;
    }

    return `${_themeFinal} ${_sizeFinal} ${_classFinal}`;
  });

  protected iconComputed = computed(() => {
    const _action = this._action();
    const _loading = this._loading();

    let _result = this.icons[_action as ButtonAction] || '';
    if (_loading) {
      _result = 'fa fa-spinner fa-spin';
    }

    return _result;
  });

  protected textComputed = computed(() => {
    const _action = this._action();
    const _text = this._text();

    let _result = _text || '';
    if (!_result && _action) {
      _result = this.texts[_action as ButtonAction] || '';
    }

    return _result;
  });

  protected hostTitle = computed(() => {
    const _title = this._title();
    const _action = this._action();

    let result = _title || '';
    if (!result && _action) {
      result = this.titles[_action as ButtonAction] || '';
    }

    return result;
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
    'unlock': 'Desbloquear',
    'notify': 'Notificar',
    'next': 'Próximo',
    'previous': 'Anterior',
    'copy': 'Copiar'
  };

  private titles: Record<ButtonAction, string> = {
    'edit': 'clique aqui para editar',
    'delete': 'clique aqui para excluir',
    'view': 'clique aqui para visualizar',
    'save': 'clique aqui para salvar',
    'cancel': 'clique aqui para cancelar',
    'submit': 'clique aqui para enviar',
    'reset': 'clique aqui para redefinir',
    'download': 'clique aqui para baixar',
    'upload': 'clique aqui para enviar',
    'search': 'clique aqui para pesquisar',
    'filter': 'clique aqui para filtrar',
    'sort': 'clique aqui para ordenar',
    'refresh': 'clique aqui para atualizar',
    'add': 'clique aqui para adicionar',
    'remove': 'clique aqui para remover',
    'approve': 'clique aqui para aprovar',
    'reject': 'clique aqui para rejeitar',
    'archive': 'clique aqui para arquivar',
    'unarchive': 'clique aqui para desarquivar',
    'enable': 'clique aqui para habilitar',
    'disable': 'clique aqui para desabilitar',
    'lock': 'clique aqui para bloquear',
    'unlock': 'clique aqui para desbloquear',
    'notify': 'clique aqui para notificar',
    'next': 'clique aqui para ir para o próximo',
    'previous': 'clique aqui para ir para o anterior',
    'copy': 'clique aqui para copiar'

  }

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
    unlock: 'fa fa-unlock',
    copy: 'fa fa-copy',
    notify: 'fa fa-bell',
    next: 'fa fa-arrow-right',
    previous: 'fa fa-arrow-left'
  };

  private actions: Record<ButtonAction, string> = {
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
    copy: 'btn btn-outline-secondary',
    notify: 'btn btn-outline-secondary',
    next: 'btn btn-outline-primary',
    previous: 'btn btn-outline-primary'
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
    link: 'btn btn-link',
    transparent: 'btn btn-transparent'
  };
}
