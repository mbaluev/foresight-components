(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'input', target : self });
                    var that = this.obj = {};
                    that.const = {
                        REQUIRED: 'Необходимо заполнить'
                    };
                    that.defaults = {
                        disabled: false,
                        hidden: false,
                        width: '100%',
                        autoclose: true,
                        popup_animation: true,
                        format: 'dd.MM.yyyy',
                        placeholder: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._handlers_input = null;
                    that.data._datepicker = null;
                    that.data._el = {
                        button: self.find('button'),
                        input: self.find('.input__control').attr('placeholder', that.data.placeholder),
                        popup: $('<div class="popup"></div>')
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('destroy');
                        }
                        if (that.data._el.popup.data('_widget')) {
                            that.data._el.popup.popup('destroy');
                        }
                        self.removeData();
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
                        that.data._handlers = null;
                        that.data.disabled = false;
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
                        that.data._el.input.trigger('mousedown');
                    };
                    that.clear = function(){
                        that.data._el.input.val('');
                        that.data._el.input.trigger('keyup');
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
                        that.data.focused = true;
                    };
                    that.focusout = function(){
                        self.removeClass('input_focused');
                        that.data.focused = false;
                    };

                    that.set_width = function(value){
                        self.css('width', value);
                    };

                    that.validate = function(){
                        that.data.validate = true;
                        if (that.data.required) {
                            if (that.data._el.input.val() == '') {
                                that.data.validate = false;
                                self.addClass('input__has-error');
                                if (self.parent().find('.control__error').length == 0) {
                                    self.after($('<div class="control__error">' + that.const.REQUIRED + '</div>'));
                                }
                            } else {
                                that.data.validate = true;
                                self.removeClass('input__has-error');
                                if (self.parent().find('.control__error').length != 0) {
                                    self.parent().find('.control__error').remove();
                                }
                            }
                        }
                        return that.data.validate;
                    };

                    that.bind = function(){
                        that.data._el.input.bindFirst('focusin.input__control mousedown.input__control touchstart.input__control', null, null, that.focusin);
                        that.data._el.input.bindFirst('focusout.input__control', null, null, that.focusout);
                        that.data._el.button.on('click.input__clear', null, null, function(e){
                            e.preventDefault();
                            that.clear();
                        });
                        that.data._el.input.bindFirst('mousedown.input__control', null, null, that.show_datepicker);
                        $('body').on('mouseup.input__control touchend.input__control', that.hide_datepicker);
                    };

                    that.init_components = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button();
                        }
                        if (that.data.toggle == 'datepicker') {
                            that.init_datepicker();
                        }
                    };
                    that.init_datepicker = function(){
                        // init popup
                        self.after(that.data._el.popup);
                        that.data._el.popup.popup({
                            source: self,
                            animation: that.data.popup_animation,
                            width: 'auto'
                        });
                        // set date
                        if (that.data.value) {
                            var date_parts = that.data.value.split(".");
                            var date = new Date(Date.parse(date_parts[2] + '-' + date_parts[1] + '-' + date_parts[0]));
                            if (isNaN(date)) {
                                that.data.value = '';
                                self.removeAttr('data-value');
                            } else {
                                that.data.date = date;
                                that.data.formattedDate = that.data.value;
                            }
                        }
                        that.data._el.input.datepicker({
                            inline: true,
                            format: 'dd.mm.yyyy',
                            startDate: (that.data.date ? that.data.date : null),
                            autoClose: that.data.autoclose,
                            onSelect: function(formattedDate, date, inst){
                                that.data.date = date;
                                that.data.formattedDate = formattedDate;
                                if (that.data.autoclose) {
                                    that.data._el.popup.popup('hide');
                                }
                            }
                        });
                        // put datepicker to popup
                        that.data._datepicker = that.data._el.input.data().datepicker;
                        that.data._datepicker.$datepicker.parent().appendTo(that.data._el.popup);
                        // set date continue
                        if (that.data.date) {
                            that.data._datepicker.selectDate(that.data.date);
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
                        that.set_width(that.data.width);
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
        value : function(value) {
            if (value) {
                if (this.length == 1) {
                    var _val = false;
                    this.each(function() {
                        _val = this.obj.data._el.input.val(value);
                    });
                    return _val;
                } else {
                    var _arr = [];
                    this.each(function() {
                        _arr.push(this.obj.data._el.input.val(value));
                    });
                    return _arr;
                }
            } else {
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