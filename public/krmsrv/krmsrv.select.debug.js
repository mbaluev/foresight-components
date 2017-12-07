$.fn.bindFirst = function(name, selector, data, handler) {
    this.on(name, selector, data, handler);
    this.each(function() {
        var handlers = $._data(this, 'events')[name.split('.')[0]];
        var handler = handlers.pop();
        handlers.splice(0, 0, handler);
    });
};
$.fn.closestChild = function(selector) {
    var $found = $(),
        $currentSet = this;
    while ($currentSet.length) {
        $found = $currentSet.filter(selector);
        if ($found.length) break;
        $currentSet = $currentSet.children();
    }
    return $found.first();
};
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'alertbox', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        hidden: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        button: self.find('button')
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
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
                    };
                    that.hide = function(){
                        self.addClass('alertbox_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('alertbox_hidden');
                        that.data.hidden = false;
                    };

                    that.bind = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.on('click', function(e){
                                e.preventDefault();
                                that.destroy();
                            });
                        }
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
        }
    };
    $.fn.alertbox = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.alertbox' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="alertbox"]').alertbox();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'select', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        name: self.attr('name'),
                        disabled: false,
                        hidden: false,
                        width: '100%',
                        height: 'auto',
                        mode: 'radio',
                        placeholder: 'Выберите значение',
                        popup_animation: true,
                        popup_width: '100%',
                        text: '',
                        count_selected: "Выбрано # из %",
                        placeholder_selected: false,
                        minimum_count_selected: 2,
                        autoclose: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._value = [];
                    that.data._handlers = null;
                    that.data._options = [];
                    that.data._el = {
                        select: $('<div class="select__container"></div>'),
                        button: $([
                            '<div class="button" data-fc="button">',
                                '<span class="button__text">' + that.data.placeholder + '</span>',
                                '<span class="icon icon_svg_down"></span>',
                            '</div>'
                        ].join('')),
                        spinner: $([
                            '<span class="icon">',
                                '<span class="spinner"></span>',
                            '</span>'
                        ].join('')),
                        input: $([
                            '<span class="input input__has-clear">',
                                '<span class="input__box">',
                                    '<span class="alertbox">',
                                        '<span class="icon icon_svg_search"></span>',
                                    '</span>',
                                    '<input type="text" class="input__control">',
                                    '<button class="button" type="button">',
                                        '<span class="icon icon_svg_close"></span>',
                                    '</button>',
                                '</span>',
                            '</span>'
                        ].join('')),
                        popup: $('<div class="popup" data-fc="popup"></div>'),
                        popup__input: $('<div class="popup__input"></div>'),
                        popup__scroll: $('<div class="popup__scroll"></div>'),
                        popup__list: $('<ul class="popup__list"></ul>'),
                        popup__list_items: [],
                        popup__list_item_checkall: $([
                            '<li class="popup__list-item">',
                            '<div class="popup__link">',
                            '<span class="popup__text popup__text_light">Выбрать все</span>',
                            '</div>',
                            '</li>'
                        ].join(''))
                    };

                    that.destroy = function(){
                        if (that.data._widget.type == 'select') {
                            that.data._el.button.button('destroy');
                            that.data._el.input.input('destroy');
                            that.data._el.popup.popup('destroy');
                            that.data._el.select.remove();
                            self.removeData();
                            self.remove();
                        }
                    };
                    that.disable = function(){
                        that.data._el.button.button('disable');
                        that.data._el.input.input('disable');
                        that.data._el.popup.popup('hide');
                        that.data.disabled = true;
                    };
                    that.enable = function(){
                        that.data._el.button.button('enable');
                        that.data._el.input.input('enable');
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        that.data._el.button.button('hide');
                        that.data._el.input.input('hide');
                        that.data._el.popup.popup('hide');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        that.data._el.button.button('show');
                        that.data._el.input.input('show');
                        that.data.hidden = false;
                    };

                    that.render = function(){
                        if (that.data.mode == 'check') {
                            that.data._el.popup__list_item_checkall.data({
                                text: 'Выбрать все',
                                selected: false,
                                disabled: false,
                                hidden: false
                            });
                        }
                        self.find('option').each(function(){
                            var $option = $(this);
                            var _option = {};
                            _option.defaults = {
                                text: $option.text(),
                                value: $option.attr('value'),
                                selected: $option[0].hasAttribute("selected"),
                                disabled: false,
                                hidden: false,
                                icon: ''
                            };

                            // render popup__list-item
                            _option.data = $.extend(true, {}, _option.defaults, $option.data());
                            _option.popup__list_item = $([
                                '<li class="popup__list-item',
                                    (_option.data.selected ? ' popup__list-item_checked' : ''),
                                    (_option.data.disabled ? ' popup__list-item_disabled' : '') + '">',
                                    '<div class="popup__link">',
                                        (_option.data.icon == '' ? '' : '<span class="icon ' + _option.data.icon + '"></span>'),
                                        '<span class="popup__text">' + _option.data.text + '</span>',
                                    '</div>',
                                '</li>'
                            ].join(''));

                            that.data._options.push($option);
                            that.data._el.popup__list_items.push(_option.popup__list_item);

                            // checked count of selected items
                            if (_option.data.selected) {
                                if (((that.data.mode == 'radio' || that.data.mode == 'radio-check') && (that.data._value.length == 0)) ||
                                    (that.data.mode == 'check')) {
                                    that.check_item(_option.popup__list_item, _option.data);
                                } else {
                                    _option.data.selected = false;
                                    that.uncheck_item(_option.popup__list_item, _option.data);
                                }
                            }

                            // store data to element
                            $option.data(_option.data);
                            _option.popup__list_item.data(_option.data);
                        });
                        that.data._el.select.append(
                            that.data._el.button,
                            that.data._el.popup.append(
                                that.data._el.popup__input.append(
                                    that.data._el.input
                                ),
                                that.data._el.popup__scroll.append(
                                    that.data._el.popup__list.append(
                                        (that.data.mode == 'check' ? that.data._el.popup__list_item_checkall : null),
                                        that.data._el.popup__list_items
                                    )
                                )
                            )
                        );
                        that.data._el.select.data(that.data);
                        that.data._el.select.data({'_widget': '_select'});
                        self.css('display', 'none');
                        self.after(that.data._el.select);
                    };
                    that.update = function(data){
                        that.data._el.button.find('.button__text').after(that.data._el.spinner);
                        self.html('');
                        that.data._options = [];
                        that.data._el.popup__list.html('');
                        that.data._el.popup__list_items = [];
                        that.data._el.button.button('destroy');
                        that.data._el.input.input('destroy');
                        that.data._el.popup.popup('destroy');
                        data.forEach(function(item, i, arr){
                            var $option = $('<option value="' + item.value + '">' + item.text + '</option>');
                            self.append($option);
                        });
                        that.clear();
                        that.init();
                        that.data._el.spinner.remove();
                    };

                    that.focus = function(){
                        that.data._el.popup.popup('show');
                    };
                    that.clear = function(){
                        that.data._value = [];
                        that.uncheck_all();
                        self.trigger('change');
                    };

                    that.focusin = function(){
                        that.data._el.popup.popup('show');
                    };
                    that.focusout = function(){
                        that.data._el.popup.popup('hide');
                    };

                    that.set_width = function(value){
                        that.data._el.select.css('width', value);
                    };
                    that.set_value = function(value){
                        if (that.data._value.indexOf(value) < 0) {
                            that.data._value.push(value);
                        }
                    };
                    that.del_value = function(value){
                        that.data._value = that.data._value.filter(function(d){
                            return d.value != value.value && d.text != value.text;
                        });
                    };
                    that.set_button_text = function(){
                        if (that.data._value.length == 0) {
                            that.data._el.button.find('.button__text').addClass('button__text_placeholder');
                            that.data._el.button.find('.button__text').text(
                                that.data.placeholder
                            );
                        } else if (that.data._value.length > that.data.minimum_count_selected) {
                            that.data._el.button.find('.button__text').removeClass('button__text_placeholder');
                            that.data._el.button.find('.button__text').html(
                                (that.data.placeholder_selected ?
                                '<span class="button__text_placeholder">' + that.data.placeholder + '&nbsp;&nbsp;</span>' : '') +
                                that.data.count_selected.replace('#', that.data._value.length).replace('%', that.data._options.length)
                            );
                        } else {
                            that.data._el.button.find('.button__text').removeClass('button__text_placeholder');
                            that.data._el.button.find('.button__text').html(
                                (that.data.placeholder_selected ?
                                '<span class="button__text_placeholder">' + that.data.placeholder + '&nbsp;&nbsp;</span>' : '') +
                                that.data._value.map(function(d){
                                    return d.text;
                                }).join(', ')
                            );
                        }
                    };
                    that.get_value = function(){
                        if (that.data._value.length == 0) {
                            return null;
                        } else {
                            if (that.data.mode == 'radio' || that.data.mode == 'radio-check') {
                                return that.data._value[0].value;
                            }
                            if (that.data.mode == 'check') {
                                return that.data._value.map(function(d){
                                    return d.value;
                                })
                            }
                        }
                    };

                    that.check_item = function(item, idata){
                        idata.selected = true;
                        item.addClass('popup__list-item_checked');
                        that.set_value({ 'value': idata.value, 'text': idata.text });
                        that.data._options.forEach(function(option){
                            if (option.data().value == idata.value) {
                                option.attr('selected', 'selected');
                                option.data().selected = idata.selected;
                            }
                        });
                        that.set_button_text();
                        if (that.data.mode == 'check') {
                            var checkall = true;
                            that.data._options.forEach(function(option){
                                if (!option.data().selected) {
                                    checkall = false;
                                }
                            });
                            checkall ? that.check_checkall() : that.uncheck_checkall();
                        }
                    };
                    that.uncheck_item = function(item, idata){
                        idata.selected = false;
                        item.removeClass('popup__list-item_checked');
                        that.del_value({ 'value': idata.value, 'text': idata.text });
                        that.data._options.forEach(function(option){
                            if (option.data().value == idata.value) {
                                option.removeAttr('selected');
                                option.data().selected = idata.selected;
                            }
                        });
                        that.set_button_text();
                        if (that.data.mode == 'check') {
                            that.uncheck_checkall();
                        }
                    };
                    that.check_all = function(){
                        that.data._value = [];
                        that.data._el.popup__list_items.forEach(function(item){
                            item.addClass('popup__list-item_checked');
                            item.data().selected = true;
                            that.set_value({ 'value': item.data().value, 'text': item.data().text });
                        });
                        that.data._options.forEach(function(option){
                            option.attr('selected', 'selected');
                            option.data().selected = true;
                        });
                        that.set_button_text();
                        if (that.data.mode == 'check') {
                            that.check_checkall();
                        }
                    };
                    that.uncheck_all = function(){
                        that.data._el.popup__list_items.forEach(function(item){
                            item.removeClass('popup__list-item_checked');
                            item.data().selected = false;
                            that.del_value({'value': item.data().value, 'text': item.data().text});
                        });
                        that.data._options.forEach(function(option){
                            option.removeAttr('selected');
                            option.data().selected = false;
                        });
                        that.set_button_text();
                        if (that.data.mode == 'check') {
                            that.uncheck_checkall();
                        }
                    };

                    that.check = function(value){
                        var _trigger = false;
                        that.data._el.popup__list_items.forEach(function(item) {
                            if (!item.data().selected) {
                                if (item.data().value == value || value == "all") {
                                    _trigger = true;
                                    if (that.data.mode == 'radio') {
                                        that.uncheck_all();
                                    }
                                    if (that.data.mode == 'radio-check') {
                                        that.uncheck_all();
                                    }
                                    that.check_item(item, item.data());
                                }
                            }
                        });
                        if (_trigger) {
                            self.trigger('change');
                        }
                    };
                    that.uncheck = function(value){
                        var _trigger = false;
                        that.data._el.popup__list_items.forEach(function(item) {
                            if (item.data().value == value || value == 'all') {
                                if (that.data.mode != 'radio') {
                                    _trigger = true;
                                    that.uncheck_item(item, item.data());
                                }
                            }
                        });
                        if (_trigger) {
                            self.trigger('change');
                        }
                    };

                    that.check_checkall = function(){
                        var item = that.data._el.popup__list_item_checkall,
                            idata = that.data._el.popup__list_item_checkall.data();
                        idata.selected = true;
                        item.addClass('popup__list-item_checked');
                    };
                    that.uncheck_checkall = function(){
                        var item = that.data._el.popup__list_item_checkall,
                            idata = that.data._el.popup__list_item_checkall.data();
                        idata.selected = false;
                        item.removeClass('popup__list-item_checked');
                    };

                    that.bind = function(){
                        that.data._el.popup__list_items.forEach(function(item){
                            var idata = item.data();
                            if (!idata.disabled) {
                                item.on('click', function(){
                                    if (that.data.mode == 'radio') {
                                        that.uncheck_all();
                                        idata.selected = true;
                                        that.check_item(item, idata);
                                    }
                                    if (that.data.mode == 'radio-check') {
                                        var selected = idata.selected;
                                        that.uncheck_all();
                                        idata.selected = !selected;
                                        if (idata.selected) {
                                            that.check_item(item, idata);
                                        } else {
                                            that.uncheck_item(item, idata);
                                        }
                                    }
                                    if (that.data.mode == 'check') {
                                        idata.selected = !idata.selected;
                                        if (idata.selected) {
                                            that.check_item(item, idata);
                                        } else {
                                            that.uncheck_item(item, idata);
                                        }
                                    }
                                    if (that.data.autoclose) {
                                        that.focusout();
                                    }
                                    self.trigger('change');
                                });
                            }
                        });
                    };
                    that.bind_input = function(){
                        that.data._el.input.find('.input__control').on('keyup', function(){
                            var value = that.data._el.input.input('value');
                            that.data._el.popup__list_items.forEach(function(item) {
                                if (item.data().text.toLowerCase().includes(value.toLowerCase())) {
                                    item.removeClass('popup__list-item_hidden');
                                } else {
                                    item.addClass('popup__list-item_hidden');
                                }
                            });
                        });
                    };
                    that.bind_checkall = function(){
                        var idata = that.data._el.popup__list_item_checkall.data();
                        if (!idata.disabled) {
                            that.data._el.popup__list_item_checkall.on('click', function(){
                                idata.selected = !idata.selected;
                                idata.selected ? that.check_all() : that.uncheck_all();
                                self.trigger('change');
                            });
                        }
                    };

                    that.init_components = function(){
                        that.data._el.button.button({
                            disabled: that.data.disabled,
                            hidden: that.data.hidden,
                            width: that.data.width
                        });
                        that.data._el.input.input({
                            width: '100%'
                        });
                        that.data._el.popup.popup({
                            source: that.data._el.button,
                            height: that.data.height,

                            animation: that.data.popup_animation,
                            select: true
                        });
                    };
                    that.init = function(){
                        that.render();
                        that.init_components();
                        that.bind();
                        that.bind_input();
                        if (that.data.mode == 'check') {
                            that.bind_checkall();
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
                        that.set_width(that.data.width);
                        that.set_button_text();
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
        update : function(data) {
            return this.each(function() {
                this.obj.update(data);
            });
        },
        focus : function() {
            return this.each(function() {
                this.obj.focus();
            });
        },
        check : function(value) {
            return this.each(function() {
                this.obj.check(value);
            });
        },
        uncheck : function(value) {
            return this.each(function() {
                this.obj.uncheck(value);
            });
        },
        check_all : function() {
            return this.each(function() {
                this.obj.check_all();
            });
        },
        uncheck_all : function() {
            return this.each(function() {
                this.obj.uncheck_all();
            });
        },
        clear : function() {
            return this.each(function() {
                this.obj.clear();
            });
        },
        value : function() {
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
    };
    $.fn.select = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.select' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="select"]').select();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'button', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        checked: false,
                        hidden: false,
                        width: 'auto',
                        popup_animation: true
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        popup: $('<div class="popup"></div>')
                    };

                    that.destroy = function(){
                        if (that.data._el.popup.data('_widget')) {
                            that.data._el.popup.popup('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.removeClass('button_hovered');
                        self.removeClass('button_clicked_out');
                        self.addClass('button_disabled');
                        //save handlers and unbind events
                        if ($._data(self[0], "events")) {
                            that.data._handlers = {};
                            for (var type in $._data(self[0], "events")) {
                                that.data._handlers[type] = $._data(self[0], "events")[type].slice(0);
                            }
                            self.off();
                        }
                        that.data.disabled = true;
                    };
                    that.enable = function(){
                        self.removeClass('button_clicked_out');
                        self.removeClass('button_disabled');
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
                        self.removeClass('button_clicked_out');
                        self.addClass('button_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('button_clicked_out');
                        self.removeClass('button_hidden');
                        that.data.hidden = false;
                    };

                    that.check = function(){
                        self.addClass('button_checked');
                        self.attr('data-checked', 'true');
                        that.data.checked = true;
                    };
                    that.uncheck = function(){
                        self.removeClass('button_checked');
                        self.attr('data-checked', 'false');
                        that.data.checked = false;
                    };

                    that.hover = function(){
                        self.addClass('button_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('button_hovered');
                    };
                    that.click = function(){
                        self.addClass('button_clicked');
                        self.removeClass('button_clicked_out');
                        $('body').one('mouseup.button.private touchend.button.private', that.unclick);
                    };
                    that.unclick = function(){
                        self.addClass('button_clicked_out');
                        self.removeClass('button_clicked');
                    };

                    that.set_width = function(value){
                        self.css('width', value);
                    };
                    that.set_text = function(value){
                        self.find('.button__text').text(value);
                    };

                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.button.private', that.hover);
                        self.on('mouseout.button.private', that.unhover);
                        self.on('mousedown.button.private touchstart.button.private', that.click);
                        //bind trigger events
                        if (that.data.trigger) {
                            self.on('click.button.trigger', function(e){
                                e.preventDefault();
                                self.find('.' + that.data.triggercontainer).trigger(that.data.trigger);
                            });
                        }
                    };
                    that.bind_checkbox = function(){
                        self.bindFirst('click.button.check', null, null, function(e){
                            e.preventDefault();
                            if (that.data.checked) {
                                that.uncheck();
                            } else {
                                that.check();
                            }
                        });
                    };
                    that.bind_radio = function(){
                        self.bindFirst('click.button.radio', null, null, function(e){
                            e.preventDefault();
                            if (!that.data.checked) {
                                that.check();
                            }
                        });
                    };

                    that.init_components = function(){
                        if (that.data.toggle == "popup") {
                            that.data._el.popup = $(that.data.target);
                            that.data._el.popup.popup({
                                source: self,
                                animation: that.data.popup_animation
                            });
                        }
                    };
                    that.init = function() {
                        that.set_width(that.data.width);
                        that.init_components();
                        that.bind();
                        if (self.hasClass('button_toggable_check')) {
                            that.data['_widget']['type'] = 'button.checkbox';
                            that.init_check();
                            that.bind_checkbox();
                        }
                        if (self.hasClass('button_toggable_radio')) {
                            that.data['_widget']['type'] = 'button.radio';
                            that.init_check();
                            that.bind_radio();
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
                        that.set_width(that.data.width);
                    };
                    that.init_check = function(){
                        if (that.data.checked) {
                            that.check();
                        } else {
                            that.uncheck();
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
        unhover : function() {
            return this.each(function() {
                this.obj.unhover();
            });
        },
        hover : function() {
            return this.each(function() {
                this.obj.hover();
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
        set_width : function(value) {
            return this.each(function() {
                this.obj.set_width(value);
            });
        },
        set_text : function(value) {
            return this.each(function() {
                this.obj.set_text(value);
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
        }
    };
    $.fn.button = function( method ) {
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
    $('[data-fc="button"]').button();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'icon__menu', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        clicked: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        ham: self,
                        menu_top: self.find('.icon__menu-top'),
                        menu_middle: self.find('.icon__menu-middle'),
                        menu_bottom: self.find('.icon__menu-bottom')
                    };

                    that.toggle = function() {
                        that.data._el.ham.toggleClass('icon__menu_click');
                        that.data._el.menu_top.toggleClass('icon__menu-top_click');
                        that.data._el.menu_middle.toggleClass('icon__menu-middle_click');
                        that.data._el.menu_bottom.toggleClass('icon__menu-bottom_click');
                    };
                    that.bind = function() {
                        that.data._el.ham.on('toggle.icon__menu', function(e){
                            that.toggle(e);
                            e.preventDefault();
                        });
                    };
                    that.init = function() {
                        that.bind();
                        if (that.data.clicked) {
                            that.toggle();
                        }
                    };
                    that.init();
                }
                return this;
            });
        },
        toggle : function() {
            return this.each(function() {
                this.obj.toggle();
            });
        },
    };
    $.fn.icon__menu = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.icon__menu' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="icon__menu"]').icon__menu();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'popup', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        source: null,
                        width: 'full',
                        height: 'auto',
                        position: 'bottom left',
                        animation: true,
                        visible: false,
                        offset: 10,
                        select: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._inFocus = false;
                    that.data._el = {
                        source: that.data.source,
                        source_arrow: that.data.source.find('.icon_svg_down')
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.hide = function(){
                        self.removeClass('popup_visible_bottom');
                        that.data.visible = false;
                        that.data._inFocus = false;
                        if (typeof that.data._el.source_arrow[0] != 'undefined') {
                            that.data._el.source_arrow.removeClass('icon_rotate_180deg');
                        }
                    };
                    that.show = function(){
                        if (that.data.animation) {
                            self.addClass('popup_animation');
                        }
                        that.set_width(that.data.width);
                        that.set_position(that.data.position);
                        that.data.visible = true;
                        that.data._inFocus = false;
                        self.addClass('popup_visible_bottom');
                        if (typeof that.data._el.source_arrow[0] != 'undefined') {
                            that.data._el.source_arrow.addClass('icon_rotate_180deg');
                        }
                    };
                    that.toggle = function(){
                        if (that.data.visible) {
                            that.hide();
                        } else {
                            that.show();
                        }
                    };
                    that.mouseup_self = function(e){
                        e.originalEvent.inFocus = true;
                    };
                    that.mouseup_source = function(e){
                        that.data._inFocus = true;
                    };
                    that.mouseup_body = function(e){
                        if (!that.data._inFocus && !e.originalEvent.inFocus) {
                            that.hide();
                        }
                    };

                    that.set_width = function(width){
                        if (width == 'full' || width == '100%') {
                            width = that.data._el.source.outerWidth();
                        };
                        self.css({ 'width': width, 'max-width': width });
                    };
                    that.set_height = function(height){
                        self.css('max-height', height);
                    };
                    that.set_position = function(position, i){
                        if (typeof i === 'undefined') { i = 0; }
                        if (i < 11) {
                            var dims = that.get_dimentions(that.data._el.source),
                                selfDims = that.get_dimentions(self),
                                pos = position.split(' '),
                                top, left,
                                offset = that.data.offset,
                                main = pos[0],
                                secondary = pos[1];
                            switch (main) {
                                case 'top':
                                    top = dims.top - selfDims.height - offset;
                                    break;
                                case 'right':
                                    left = dims.left + dims.width + offset;
                                    break;
                                case 'bottom':
                                    top = dims.top + dims.height + offset;
                                    break;
                                case 'left':
                                    left = dims.left - selfDims.width - offset;
                                    break;
                            }
                            switch(secondary) {
                                case 'top':
                                    top = dims.top;
                                    break;
                                case 'right':
                                    left = dims.left + dims.width - selfDims.width;
                                    break;
                                case 'bottom':
                                    top = dims.top + dims.height - selfDims.height;
                                    break;
                                case 'left':
                                    left = dims.left;
                                    break;
                                case 'center':
                                    if (/left|right/.test(main)) {
                                        top = dims.top + dims.height/2 - selfDims.height/2;
                                    } else {
                                        left = dims.left + dims.width/2 - selfDims.width/2;
                                    }
                            }
                            self.css({ left: left, top: top });

                            /* correct popup position relative to the window */
                            var el = that.get_offset(that.data._el.source);
                            switch (position) {
                                case 'bottom right':
                                    if (el.top + el.height + offset + selfDims.height > $(window).height() ||
                                        el.left + el.width - selfDims.width < 0) {
                                        that.set_position('left top', ++i);
                                    }
                                    break;
                                case 'left top':
                                    if (el.left - offset - selfDims.width < 0 ||
                                        el.top + selfDims.height > $(window).height()) {
                                        that.set_position('left center', ++i);
                                    }
                                    break;
                                case 'left center':
                                    if (el.left - offset - selfDims.width < 0 ||
                                        el.top + el.height/2 + selfDims.height/2 > $(window).height() ||
                                        el.top + el.height/2 - selfDims.height/2 < 0) {
                                        that.set_position('left bottom', ++i);
                                    }
                                    break;
                                case 'left bottom':
                                    if (el.left - offset - selfDims.width < 0 ||
                                        el.top + el.height - selfDims.height < 0) {
                                        that.set_position('top right', ++i);
                                    }
                                    break;
                                case 'top right':
                                    if (el.top - offset - selfDims.height < 0 ||
                                        el.left + el.width - selfDims.width < 0) {
                                        that.set_position('top left', ++i);
                                    }
                                    break;
                                case 'top left':
                                    if (el.top - offset - selfDims.height < 0 ||
                                        el.left + selfDims.width > $(window).width()) {
                                        that.set_position('right bottom', ++i);
                                    }
                                    break;
                                case 'right bottom':
                                    if (el.left + el.width + offset + selfDims.width > $(window).width() ||
                                        el.top + el.height - selfDims.height < 0) {
                                        that.set_position('right center', ++i);
                                    }
                                    break;
                                case 'right center':
                                    if (el.left + el.width + offset + selfDims.width > $(window).width() ||
                                        el.top + el.height/2 + selfDims.height/2 > $(window).height() ||
                                        el.top + el.height/2 - selfDims.height/2 < 0) {
                                        that.set_position('right top', ++i);
                                    }
                                    break;
                                case 'right top':
                                    if (el.left + el.width + offset + selfDims.width > $(window).width() ||
                                        el.top + selfDims.height > $(window).height()) {
                                        that.set_position('bottom left', ++i);
                                    }
                                    break;
                                case 'bottom left':
                                    if (el.top + el.height + offset + selfDims.height > $(window).height() ||
                                        el.left + selfDims.width > $(window).width()) {
                                        that.set_position('bottom right', ++i);
                                    }
                                    break;
                            }
                        }
                    };

                    that.get_dimentions = function($el) {
                        var position = $el.position();
                        return {
                            width: $el.outerWidth(),
                            height: $el.outerHeight(),
                            left: position.left,
                            top: position.top
                        }
                    };
                    that.get_offset = function($el) {
                        var offset = $el.offset();
                        return {
                            width: $el.outerWidth(),
                            height: $el.outerHeight(),
                            left: offset.left,
                            top: offset.top
                        }
                    };

                    that.bind = function(){
                        that.data._el.source.on('click.popup.toggle', function(e){
                            e.preventDefault();
                            that.toggle();
                        });
                        that.data._el.source.on('mouseup.popup.source touchend.popup.source', that.mouseup_source);
                        self.on('mouseup.popup.self touchend.popup.self', that.mouseup_self);
                        $('body').on('mouseup.popup.body touchend.popup.body', that.mouseup_body);
                    };

                    that.init_components = function(){
                        if (typeof that.data._el.source_arrow[0] != 'undefined') {
                            that.data._el.source_arrow.addClass('icon_animate');
                        }
                    };
                    that.init = function(){
                        that.init_components();
                        that.bind();
                        if (that.data.select) {
                            self.addClass('popup_select ');
                        }
                        if (that.data.visible) {
                            that.show();
                        } else {
                            that.hide();
                        }
                        that.set_width(that.data.width);
                        that.set_height(that.data.height);
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
        set_width : function(value) {
            return this.each(function() {
                this.obj.set_width(value);
            });
        },
        set_height : function(value) {
            return this.each(function() {
                this.obj.set_height(value);
            });
        }
    };
    $.fn.popup = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.popup' );
        }
    };
})( jQuery );
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
                        popup_animation: true
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
                        input: self.find('.input__control'),
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
                        // create detepicker
                        /* that.data._el.input.attr('readonly', 'readonly'); */
                        that.data._el.input.datepicker({
                            inline: true,
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