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
                        readonly: false,
                        mime: 'text/html',
                        editor: null,
                        value: null
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
                            if (that.data.value) {
                                self.val(that.data.value);
                            }
                            that.data.editor = CodeMirror.fromTextArea(self[0], {
                                readOnly: that.data.readonly,
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
                            that.data.value = that.data.editor.getValue();
                        }
                        return that.data.value;
                    };
                    that.set_value = function(value){
                        value = value.replace(new RegExp('%', 'g'), '%25');
                        that.data.value = decodeURI(value);
                        if (that.data.editor) {
                            that.data.editor.setValue(that.data.value);
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