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
                        autoclose: false,
                        highlight: false,
                        search: true
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
                            '<button class="button" data-fc="button">',
                                '<span class="button__text">' + that.data.placeholder + '</span>',
                                '<span class="icon icon_svg_down"></span>',
                            '</button>'
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
                            '<button class="popup__link">',
                            '<span class="popup__text popup__text_light">Выбрать все</span>',
                            '</button>',
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
                        that.data._el.select.addClass('select__container_hidden');
                        that.data._el.button.button('hide');
                        that.data._el.input.input('hide');
                        that.data._el.popup.popup('hide');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        that.data._el.select.removeClass('select__container_hidden');
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
                                    '<button class="popup__link">',
                                        (_option.data.icon == '' ? '' : '<span class="icon ' + _option.data.icon + '"></span>'),
                                        '<span class="popup__text">' + _option.data.text + '</span>',
                                    '</button>',
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
                                (that.data.search ?
                                    that.data._el.popup__input.append(
                                        that.data._el.input
                                    ) : null
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
                            var $option = $('<option value="' + item.value + '" ' + (item.selected ? 'selected' : '') + '>' + item.text + '</option>');
                            self.append($option);
                        });
                        that.clear();
                        that.init();
                        that.data._el.spinner.remove();
                    };
                    that.get_items = function(){
                        var items = [];
                        that.data._options.map(function($option){
                            items.push({
                                value: $option.attr('value'),
                                text: $option.text(),
                                selected: ($option.attr('selected') ? true : false)
                            });
                        });
                        return items;
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
                        that.highlight();
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
                        that.highlight();
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
                        that.highlight();
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
                        that.highlight();
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

                    that.highlight = function(){
                        if (that.data.highlight) {
                            if (that.get_value()) {
                                that.data._el.select.addClass('select_checked');
                            } else {
                                that.data._el.select.removeClass('select_checked');
                            }
                        }
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
                                    if (that.data.highlight) {
                                        that.highlight();
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
                                if (that.data.highlight) {
                                    that.highlight();
                                }
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
                        that.highlight();
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
        },
        get_items : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = this.obj.get_items();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push(this.obj.get_items());
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