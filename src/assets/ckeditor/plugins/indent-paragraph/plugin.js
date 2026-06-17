CKEDITOR.plugins.add( 'indent-paragraph', {
    icons: 'indent-paragraph',
	init: function( editor ) {

        var indentation = editor.config.indentation;
        var indentationKey = editor.config.indentationKey;

        if(typeof(indentation) == 'undefined')
            indentation = '50px';
        if(typeof(indentationKey) == 'undefined')
            indentationKey = 'tab';

        if(editor.ui.addButton){

            editor.ui.addButton( 'indent-paragraph', {
                label: 'Parágrafo',
                command: 'indent-paragraph',
                toolbar: 'indent',
            });
        }

        if( indentationKey !== false){

            editor.on('key', function(ev) {
                if(ev.data.domEvent.$.key.toLowerCase() === indentationKey.toLowerCase().trim() || ev.data.keyCode === indentationKey){
                    editor.execCommand('indent-paragraph');
                    ev.cancel();
                }
            });
        }

        editor.on( 'selectionChange', function()
            {
                var style_textindente = new CKEDITOR.style({
                        element: 'p',
                        styles: { 'text-indent': indentation },
                        overrides: [{
                            element: 'text-indent', attributes: { 'size': '0'}
                        }]
                    });

                if( style_textindente.checkActive(editor.elementPath(), editor) )
                   editor.getCommand('indent-paragraph').setState(CKEDITOR.TRISTATE_ON);
                else
                   editor.getCommand('indent-paragraph').setState(CKEDITOR.TRISTATE_OFF);

        });

        editor.addCommand("indent-paragraph", {
            allowedContent: 'p{text-indent}',
            requiredContent: 'p',
            exec: function(evt) {

                var range = editor.getSelection().getRanges()[0];

                var walker = new CKEDITOR.dom.walker( range ),
                node;

                var state = editor.getCommand('indent-paragraph').state;

                while ( ( node = walker.next() ) ) {
                    if ( node.type == CKEDITOR.NODE_ELEMENT ) {
                        if(node.getName() === "p"){
                                editor.fire('saveSnapshot');
                                if( state == CKEDITOR.TRISTATE_ON){
                                    node.removeStyle("text-indent");
                                    editor.getCommand('indent-paragraph').setState(CKEDITOR.TRISTATE_OFF);
                                }
                                else{
                                    node.setStyle( "text-indent", indentation );
                                    editor.getCommand('indent-paragraph').setState(CKEDITOR.TRISTATE_ON);
                                }
                        }
                    }
                }

                if(node === null){

                    node = editor.getSelection().getStartElement().getAscendant('p', true);

                    editor.fire('saveSnapshot');

                    if( state == CKEDITOR.TRISTATE_ON){
                        node.removeStyle("text-indent");
                        editor.getCommand('indent-paragraph').setState(CKEDITOR.TRISTATE_OFF);
                    }
                    else{
                        node.setStyle( "text-indent", indentation );
                        editor.getCommand('indent-paragraph').setState(CKEDITOR.TRISTATE_ON);
                    }
                }
            }
        });
	}
});
