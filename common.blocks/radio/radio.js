(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'radio', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        checked: false,
                        hidden: false,
                        value: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        input: self.find('.radio__input'),
                        label: self.find('.radio__label'),
                        button: self.find('button')
                    };
                    that.data._triggers = {
                        check: 'check.fc.radio',
                        uncheck: 'uncheck.fc.radio'
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.addClass('radio_disabled');
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
                    };
                    that.enable = function(){
                        self.removeClass('radio_disabled');
                        self.removeAttr('data-disabled');
                        that.data._el.input.removeAttr('disabled');
                        that.data._el.input.prop('disabled', false);
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + (ev.namespace? '.' + ev.namespace : ''), ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('enable');
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        self.addClass('radio_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('radio_hidden');
                        that.data.hidden = false;
                    };

                    that.check = function(){
                        self.addClass('radio_checked');
                        self.attr('data-checked','true');
                        that.data._el.input.attr('checked', 'checked');
                        that.data._el.input.prop('checked', true);
                        that.data.checked = true;
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('check');
                        }
                        self.trigger(that.data._triggers.check);
                    };
                    that.uncheck = function(){
                        self.removeClass('radio_checked');
                        self.removeAttr('data-checked');
                        that.data._el.input.removeAttr('checked');
                        that.data._el.input.prop('checked', false);
                        that.data.checked = false;
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('uncheck');
                        }
                        self.trigger(that.data._triggers.uncheck);
                    };

                    that.hover = function(){
                        self.addClass('radio_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('radio_hovered');
                    };
                    that.click = function(){
                        self.addClass('radio_clicked');
                        $('body').one('mouseup.radio touchend.radio', that.unclick);
                    };
                    that.unclick = function(){
                        self.removeClass('radio_clicked');
                    };

                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.radio', that.hover);
                        self.on('mouseout.radio', that.unhover);
                        self.on('mousedown.radio touchstart.radio', that.click);
                        if (typeof that.data._el.label[0] != "undefined") {
                            that.data['_widget']['type'] = 'radio.label';
                            self.bindFirst('click.radio', '.radio__label', null, function (e) {
                                e.preventDefault();
                                if (!that.data.checked) that.check();
                            })
                        }
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data['_widget']['type'] = 'radio.button';
                            self.bindFirst('click.radio', 'button', null, function (e) {
                                e.preventDefault();
                                if (!that.data.checked) that.check();
                            })
                        }
                    };

                    that.init_components = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button();
                        }
                    };
                    that.init = function(){
                        that.data.name = that.data._el.input.attr('name');
                        that.data.value = that.data._el.input.attr('value');
                        that.init_components();
                        that.bind();
                        if (that.data.checked) {
                            that.check();
                        } else {
                            that.uncheck();
                        }
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
        check : function() {
            return this.each(function() {
                this.obj.check();
            });
        },
        uncheck : function() {
            return this.each(function() {
                this.obj.uncheck();
            });
        },
        checked : function() {
            if (this.length == 1) {
                var _checked = false;
                this.each(function() {
                    _checked = this.obj.data.checked;
                });
                return _checked;
            } else {
                var checked_arr = [];
                this.each(function() {
                    checked_arr.push(this.obj.data.checked);
                });
                return checked_arr;
            }
        },
        value : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = this.obj.data.value;
                });
                return _val;
            } else {
                var value_arr = [];
                this.each(function() {
                    value_arr.push(this.obj.data.value);
                });
                return value_arr;
            }
        }
    };
    $.fn.radio = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.radio' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="radio"]').radio();
});