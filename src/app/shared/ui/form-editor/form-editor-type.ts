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