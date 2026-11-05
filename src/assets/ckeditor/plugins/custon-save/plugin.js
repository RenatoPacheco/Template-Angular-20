CKEDITOR.plugins.add('custon-save', {
    icons: 'custon-save',

    init: function (editor) {
        editor.addCommand('custonSave', {
            exec : function(editor) {
                editor.fire('change', 'custon-save', editor);
            }
        });

        editor.ui.addButton('custon-save', {
            label: 'Salvar',
            command: 'custonSave',
            toolbar: 'clipboard,0'
        });
    }
});