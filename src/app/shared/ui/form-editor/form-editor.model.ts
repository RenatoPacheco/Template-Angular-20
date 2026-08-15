export type FormEditorConfig = Partial<{

  // Geral
  language: string;
  defaultLanguage: string;
  contentsLanguage: string;
  versionCheck: boolean;
  readOnly: boolean;
  startupFocus: boolean;
  startupMode: 'wysiwyg' | 'source';

  // Conteúdo
  allowedContent: boolean | string | object;
  extraAllowedContent: string;
  disallowedContent: string;
  protectedSource: RegExp[];

  // HTML
  enterMode: number;
  shiftEnterMode: number;
  autoParagraph: boolean;
  fillEmptyBlocks: boolean;
  ignoreEmptyParagraph: boolean;

  // Entidades
  entities: boolean;
  basicEntities: boolean;
  entities_latin: boolean;
  entities_greek: boolean;
  entities_processNumerical: boolean;

  // Plugins
  extraPlugins: string|string[];
  removePlugins: string|string[];

  // Toolbar
  toolbar: unknown[];
  toolbarGroups: unknown[];
  removeButtons: string|string[];
  stylesSet: string | unknown[];

  // Fonte
  font_names: string;
  font_defaultLabel: string;
  fontSize_sizes: string;
  fontSize_defaultLabel: string;

  // Cor
  colorButton_colors: string;
  colorButton_enableMore: boolean;

  // Formatação
  format_tags: string;

  // Dimensões
  width: string | number;
  height: string | number;
  resize_enabled: boolean;
  resize_dir: 'vertical' | 'horizontal' | 'both';

  // Upload
  filebrowserBrowseUrl: string;
  filebrowserUploadUrl: string;
  filebrowserImageBrowseUrl: string;
  filebrowserImageUploadUrl: string;

  // Colar
  forcePasteAsPlainText: boolean;
  pasteFilter: string;
  pasteFromWordRemoveFontStyles: boolean;
  pasteFromWordRemoveStyles: boolean;

  // Tabelas
  table_defaultBorder: number;
  table_defaultWidth: string;

  // Conteúdo CSS
  contentsCss: string | string[];

  // Templates
  templates_files: string[];
  templates_replaceContent: boolean;

  // Links
  linkShowAdvancedTab: boolean;
  linkShowTargetTab: boolean;

  // Imagens
  image_previewText: string;
  image_removeLinkByEmptyURL: boolean;

  // Matemática / especiais
  mathJaxLib: string;

  // Seu plugin customizado
  indentation: string;
  indentationKey: string | number | false;

}> & Record<string, unknown>;

export const FormEditorBaseConfig: FormEditorConfig = {
    // Caractéres
    entities: false,
    basicEntities: false,
    entities_latin: false,
    entities_greek: false,
    // Dimensões
    width: '100%',
    height: 250,
    skin: "moono-lisa",
    // Avisos
    versionCheck: false,
    // Plugins
    removeButtons: ['About'],
    // Idioma
    language: 'pt-br',
    defaultLanguage: 'pt-br',
    contentsLanguage: 'pt-br',
    // Colar
    pasteFromWordPromptCleanup: true,
    pasteFromWordRemoveFontStyles: true,
    pasteFromWordNumberedHeadingToList: true,
    pasteFromWordRemoveStyles: true,
    ignoreEmptyParagraph: true,
    removeFormatAttributes: true,
    allowedContent: true    
}

export const FormEditorParagraphOff: FormEditorConfig = {
  // Quebras de linha
  enterMode: 2,      // ENTER_BR
  shiftEnterMode: 2, // ENTER_BR
  autoParagraph: false
}

export const FormEditorComplte: FormEditorConfig = {
    extraPlugins: ['custon-save', 'indent-paragraph']
};

export const FormEditorBasic: FormEditorConfig = {
    extraPlugins: ['custon-save', 'indent-paragraph'],
    toolbar: [
      { name: 'inline-zero', items: [
        'custon-save', 'Styles'
      ]},
      { name: 'inline-one', items: [
        'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', 'SpecialChar'
      ]},
      { name: 'inline-two', items: [
        'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', 'Undo', 'Redo',
        'Anchor', 'Source', 'CopyFormatting', 'RemoveFormat'
      ]}
    ]
};

export const FormEditorDisabled: FormEditorConfig = {
  ...FormEditorBaseConfig,
  toolbar: [
    { name: 'inline', items: [
      'Source', '-', 'Preview', 'Print', 'Find',
      'Maximize', 'ShowBlocks', 'About',
    ]}
  ]
};

