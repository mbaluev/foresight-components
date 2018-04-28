(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'codearea', target: self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        mime: 'text/html',
                        editor: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.enable = function(){
                        that.data.disabled = false;
                        that.render();
                    };
                    that.render = function(){
                        if (!that.data.disabled) {
                            that.data.editor = CodeMirror.fromTextArea(self[0], {
                                mode: that.data.mime,
                                tabSize: 2,
                                lineNumbers: true,
                                matchBrackets: true,
                                autoCloseBrackets: true,
                                autoCloseTags: true,
                                foldGutter: true,
                                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
                            });
                        }
                    };
                    that.get_value = function(){
                        if (that.data.editor) {
                            return that.data.editor.getValue();
                        } else {
                            return null;
                        }
                    };
                    that.set_value = function(value){
                        if (that.data.editor) {
                            that.data.editor.setValue(value);
                        }
                    };
                    that.init = function(){
                        that.render();
                    };
                    that.init();
                }
                return this;
            });
        },
        enable : function() {
            return this.each(function() {
                this.obj.enable();
            });
        },
        render : function() {
            return this.each(function() {
                this.obj.render();
            });
        },
        set_value : function(value) {
            return this.each(function() {
                this.obj.set_value(value);
            });
        },
        get_value : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = this.obj.get_value();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push(this.obj.get_value());
                });
                return _arr;
            }
        },
        value : function(value) {
            if (value) {
                return this.each(function() {
                    this.obj.set_value(value);
                });
            } else {
                if (this.length == 1) {
                    var _val = false;
                    this.each(function() {
                        _val = this.obj.get_value();
                    });
                    return _val;
                } else {
                    var _arr = [];
                    this.each(function() {
                        _arr.push(this.obj.get_value());
                    });
                    return _arr;
                }
            }
        }
    };
    $.fn.codearea = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.button' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="codearea"]').codearea();
});