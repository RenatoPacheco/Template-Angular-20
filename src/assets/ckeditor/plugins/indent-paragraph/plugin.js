CKEDITOR.plugins.add('indent-paragraph', {
    icons: 'indent-paragraph',

    init: function (editor) {
        var indentation = editor.config.indentation || '50px';
        var indentationKey = editor.config.indentationKey;

        editor.addCommand('indent-paragraph', {

            allowedContent: '*{text-indent}',

            exec: function (editor) {

                var block = editor.elementPath().block;

                if (!block) {
                    return;
                }

                editor.fire('saveSnapshot');

                if (block.getStyle('text-indent') === indentation) {
                    block.removeStyle('text-indent');
                    this.setState(CKEDITOR.TRISTATE_OFF);
                } else {
                    block.setStyle('text-indent', indentation);
                    this.setState(CKEDITOR.TRISTATE_ON);
                }

                editor.fire('saveSnapshot');
            }
        });

        if (editor.ui.addButton) {
            editor.ui.addButton('indent-paragraph', {
                label: 'Parágrafo',
                command: 'indent-paragraph',
                toolbar: 'paragraph,0'
            });
        }

        editor.on('selectionChange', function () {

            var block = editor.elementPath().block;

            if (!block) {
                return;
            }

            editor.getCommand('indent-paragraph').setState(
                block.getStyle('text-indent') === indentation
                    ? CKEDITOR.TRISTATE_ON
                    : CKEDITOR.TRISTATE_OFF
            );
        });

        if (indentationKey !== false) {

            editor.on('key', function (ev) {

                if (
                    indentationKey === 'tab' &&
                    ev.data.keyCode === 9
                ) {
                    editor.execCommand('indent-paragraph');
                    ev.cancel();
                    return;
                }

                if (
                    typeof indentationKey === 'number' &&
                    ev.data.keyCode === indentationKey
                ) {
                    editor.execCommand('indent-paragraph');
                    ev.cancel();
                }
            });
        }
    }
});