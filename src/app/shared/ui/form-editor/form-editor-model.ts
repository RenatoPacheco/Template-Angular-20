export type FormEditorConfig = {
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

    readonly toolbar?: string | readonly string[] | any;

    readonly removeButtons?: string;
    readonly removePlugins?: string;
    readonly extraPlugins?: string;

    readonly allowedContent?: boolean;
    readonly autoParagraph?: boolean;
};

export const FormEditorStyles = [
    { name: 'Computer Code', element: 'code' },
    { name: 'Keyboard Phrase', element: 'kbd' },
    { name: 'Sample Text', element: 'samp' },
    { name: 'Variable', element: 'var' },
    { name: 'Deleted Text', element: 'del' },
    { name: 'Inserted Text', element: 'ins' },
    { name: 'Cited Work', element: 'cite' },
    { name: 'Inline Quotation', element: 'q' },
    { name: 'Glossário', element: 'span', attributes: { class: 'glossario' } },
    { name: 'Cor tema', element: 'span', attributes: { class: 'cor-tema' } }
];

export const FormEditorComplte = {
    height: 250,
    bodyClass: 'conteudo',
    extraPlugins: ['custon-save', 'indent-paragraph'],
    removePlugins: 'exportpdf',
    pasteFromWordPromptCleanup: true,
    pasteFromWordRemoveFontStyles: true,
    pasteFromWordNumberedHeadingToList: true,
    pasteFromWordRemoveStyles: true,
    ignoreEmptyParagraph: true,
    removeFormatAttributes: true,
    allowedContent: true,
    stylesSet: FormEditorStyles,
    toolbar: [
      { name: 'inline-zero', items: [
        'custon-save', 'Source', '-', 'Preview', 'Print', '-',
        'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo',
        'Find', 'Replace', '-', 'SelectAll', 'ShowBlocks'
      ]},
      '/',
      { name: 'inline-one', items: [
        'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-',
        'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'indent-paragraph', 'Blockquote', '-', 'CreateDiv', '-', 'JustifyLeft',
        'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl',
        'Link', 'Unlink', 'Anchor'
      ]},
      '/',
      { name: 'inline-two', items: [
        'Styles', 'Format', 'Maximize', '-',
        'Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak', 'Iframe',
        'CopyFormatting', 'RemoveFormat'
      ]}
    ]
};

export const FormEditorBasic = {
    height: 250,
    bodyClass: 'conteudo',
    extraPlugins: ['custon-save', 'indent-paragraph'],
    removePlugins: ['exportpdf'],
    pasteFromWordPromptCleanup: true,
    pasteFromWordRemoveFontStyles: true,
    pasteFromWordNumberedHeadingToList: true,
    pasteFromWordRemoveStyles: true,
    ignoreEmptyParagraph: true,
    removeFormatAttributes: true,
    allowedContent: true,
    stylesSet: FormEditorStyles,
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

export const FormEditorDisabled = {
    height: 250,
    bodyClass: 'conteudo',
    extraPlugins: ['custon-save', 'indent-paragraph'],
    removePlugins: ['exportpdf'],
    pasteFromWordPromptCleanup: true,
    pasteFromWordRemoveFontStyles: true,
    pasteFromWordNumberedHeadingToList: true,
    pasteFromWordRemoveStyles: true,
    ignoreEmptyParagraph: true,
    removeFormatAttributes: true,
    allowedContent: true,
    toolbar: [
      { name: 'inline', items: [
        'Source', '-', 'Preview', 'Print', 'Find',
        'Maximize', 'ShowBlocks', 'About',
      ]}
    ]
};

