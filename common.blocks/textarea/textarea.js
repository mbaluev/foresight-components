(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'textarea', target : self });
                    var that = this.obj = {};
                    that.const = {
                        REQUIRED: 'Необходимо заполнить'
                    };
                    that.defaults = {
                        disabled: false,
                        hidden: false,
                        width: '100%',
                        rows: 5
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.addClass('textarea_disabled');
                        self.attr('data-disabled','true');
                        self.attr('disabled', 'disabled');
                        self.prop('disabled', true);
                        that.data.disabled = true;
                        //save handlers and unbind events
                        if ($._data(self[0], "events")) {
                            that.data._handlers = {};
                            for (var type in $._data(self[0], "events")) {
                                that.data._handlers[type] = $._data(self[0], "events")[type].slice(0);
                            }
                            self.off();
                        }
                    };
                    that.enable = function(){
                        self.removeClass('textarea_disabled');
                        self.removeAttr('data-disabled');
                        self.removeAttr('disabled');
                        self.prop('disabled', false);
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        self.addClass('textarea_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('textarea_hidden');
                        that.data.hidden = false;
                    };

                    that.focus = function(){
                        self.trigger('focus');
                        self.trigger('mousedown');
                    };
                    that.clear = function(){
                        self.val('');
                        self.trigger('keyup');
                        that.focus();
                    };

                    that.focusin = function(){
                        self.addClass('textarea_focused');
                        that.data.focused = true;
                    };
                    that.focusout = function(){
                        self.removeClass('textarea_focused');
                        that.data.focused = false;
                    };

                    that.set_width = function(value){
                        self.css('width', value);
                    };
                    that.set_rows = function(value){
                        if (value) {
                            self.attr('rows', value);
                        }
                    };

                    that.validate = function(){
                        that.data.validate = true;
                        if (that.data.required) {
                            if (self.val() == '') {
                                that.data.validate = false;
                                self.addClass('textarea__has-error');
                                if (self.parent().find('.control__error').length == 0) {
                                    self.after($('<div class="control__error">' + that.const.REQUIRED + '</div>'));
                                }
                            } else {
                                that.data.validate = true;
                                self.removeClass('textarea__has-error');
                                if (self.parent().find('.control__error').length != 0) {
                                    self.parent().find('.control__error').remove();
                                }
                            }
                        }
                        return that.data.validate;
                    };

                    that.bind = function(){
                        self.bindFirst('focusin.textarea mousedown.textarea touchstart.textarea', null, null, that.focusin);
                        self.bindFirst('focusout.textarea', null, null, that.focusout);
                    };

                    that.init_components = function(){};
                    that.init = function(){
                        that.init_components();
                        that.bind();
                        if (that.data.disabled) {
                            that.disable();
                        } else {
                            that.enable();
                        }
                        if (that.data.hidden) {
                            that.hide();
                        } else {
                            that.show();
                        }
                        that.set_width(that.data.width);
                        that.set_rows(that.data.rows);
                    };
                    that.init();
                }
                return this;
            });
        },
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
        disable : function() {
            return this.each(function() {
                this.obj.disable();
            });
        },
        enable : function() {
            return this.each(function() {
                this.obj.enable();
            });
        },
        hide : function() {
            return this.each(function() {
                this.obj.hide();
            });
        },
        show : function() {
            return this.each(function() {
                this.obj.show();
            });
        },
        focus: function() {
            return this.each(function() {
                this.obj.focus();
            });
        },
        clear : function() {
            return this.each(function() {
                this.obj.clear();
            });
        },
        set_width : function(value) {
            return this.each(function() {
                this.obj.set_width(value);
            });
        },
        set_rows : function(value) {
            return this.each(function() {
                this.obj.set_rows(value);
            });
        },
        validate : function() {
            if (this.length == 1) {
                var _val = true;
                this.each(function() {
                    _val = this.obj.validate();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push(this.obj.validate());
                });
                return _arr;
            }
        },
        value : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = $(this).val();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push($(this).val());
                });
                return _arr;
            }
        }
    };
    $.fn.textarea = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.textarea' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="textarea"]').textarea();
});