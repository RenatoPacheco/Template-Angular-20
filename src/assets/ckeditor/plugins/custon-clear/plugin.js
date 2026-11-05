CKEDITOR.plugins.add('custon-clear', {
    icons: 'custon-clear',

    init: function (editor) {
        editor.addCommand('custonClear', {
            exec : function(editor) {
                editor.fire('change', 'custon-clear', editor);
            }
        });

        editor.ui.addButton('custon-clear', {
            label: 'Limpar',
            command: 'custonClear',
            toolbar: 'clipboard,1'
        });
    }
});
