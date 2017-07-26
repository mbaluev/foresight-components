(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'input', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        hidden: false,
                        width: '100%'
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._handlers_input = null;
                    that.data._el = {
                        button: self.find('button'),
                        input: self.find('.input__control')
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('destroy');
                        }
                        self.data = null;
                        self.remove();
                    };
                    that.disable = function(){
                        self.addClass('input_disabled');
                        self.attr('data-disabled','true');
                        that.data._el.input.attr('disabled', 'disabled');
                        that.data._el.input.prop('disabled', true);
                        that.data.disabled = true;
                        //save handlers and unbind events
                        if ($._data(self[0], "events")) {
                            that.data._handlers = {};
                            for (var type in $._data(self[0], "events")) {
                                that.data._handlers[type] = $._data(self[0], "events")[type].slice(0);
                            }
                            self.off();
                        }
                        //button enable
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('disable');
                        }
                        that.disable_input();
                    };
                    that.enable = function(){
                        self.removeClass('input_disabled');
                        self.removeAttr('data-disabled');
                        that.data._el.input.removeAttr('disabled');
                        that.data._el.input.prop('disabled', false);
                        that.data.disabled = false;
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('enable');
                        }
                        that.enable_input();
                    };
                    that.hide = function(){
                        self.addClass('input_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('input_hidden');
                        that.data.hidden = false;
                    };

                    that.focus = function(){
                        that.data._el.input.trigger('focus');
                    };
                    that.clear = function(){
                        that.data._el.input.val('');
                        that.focus();
                    };

                    that.disable_input = function(){
                        if ($._data(that.data._el.input[0], "events")) {
                            that.data._handlers_input = {};
                            for (var type in $._data(that.data._el.input[0], "events")) {
                                that.data._handlers_input[type] = $._data(that.data._el.input[0], "events")[type].slice(0);
                            }
                            that.data._el.input.off();
                        }
                    };
                    that.enable_input = function(){
                        if (that.data._handlers_input) {
                            for (var type in that.data._handlers_input) {
                                that.data._handlers_input[type].forEach(function(ev){
                                    that.data._el.input.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                    };

                    that.focusin = function(){
                        self.addClass('input_focused');
                    };
                    that.focusout = function(){
                        self.removeClass('input_focused');
                    };

                    that.set_width = function(){
                        self.css('width', that.data.width);
                    };

                    that.bind = function(){
                        that.data._el.input.bindFirst('focusin.input__control', null, null, that.focusin);
                        that.data._el.input.bindFirst('focusout.input__control', null, null, that.focusout);
                        that.data._el.button.on('click.input__clear', null, null, function(e){
                            e.preventDefault();
                            that.clear();
                        })
                    };

                    that.init_components = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button();
                        }
                    };
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
                        that.set_width();
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
                this.obj.hide();
            });
        },
        value : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = this.obj.data._el.input.val();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push(this.obj.data._el.input.val());
                });
                return _arr;
            }
        }
    };
    $.fn.input = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.input' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="input"]').input();
});