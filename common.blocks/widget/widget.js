(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget', target : self });
                    var that = this.obj = {};
                    that.const = {
                        CONTENT_LOADING: '<span class="spinner"></span>',
                        CONTENT_NODATA: 'Нет данных',
                        CONTENT_ERROR: 'Ошибка загрузки',
                        BORDER_COLOR_BLUE: '#5a97f2',
                        BORDER_COLOR_DEFAULT: '#ccc',
                        BORDER_COLOR_PURPLE: '#8e6bf5',
                        BORDER_COLOR_RED: '#ff5940',
                        CONTENT_TYPE_TEXT: 'text',
                        CONTENT_TYPE_HTML: 'html',
                        CONTENT_TYPE_COUNT: 'count'
                    };
                    that.defaults = {
                        name: 'Виджет',
                        collapsed: false,
                        color: that.const.BORDER_COLOR_DEFAULT,
                        content: that.const.CONTENT_NODATA,
                        mode: 'view',
                        pagename: '',
                        elementname: '',
                        loader: null,
                        library: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        buttons: {
                            button_collapse: null,
                            button_settings: null,
                            button_remove: null
                        }
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.buttons.button_collapse[0] != "undefined") {
                            that.data._el.buttons.button_collapse.button('destroy');
                        }
                        if (typeof that.data._el.buttons.button_settings[0] != "undefined") {
                            that.data._el.buttons.button_settings.button('destroy');
                        }
                        if (typeof that.data._el.buttons.button_remove[0] != "undefined") {
                            that.data._el.buttons.button_remove.button('destroy');
                        }
                        self.data = null;
                        self.remove();
                    };

                    that.render = function(){
                        var $template = $(
                                '<div class="widget__header">' +
                                    '<div class="widget__header-name">' +
                                        '<button class="button button_collapse" type="button" data-fc="button">' +
                                            '<span class="button__text">' + that.data.name + '</span>' +
                                            '<span class="icon icon_svg_down"></span>' +
                                            '<span class="button__anim"></span>' +
                                        '</button>' +
                                    '</div>' +
                                    '<div class="widget__header-actions">' +
                                        '<button class="button button_settings" type="button" data-fc="button">' +
                                            '<span class="icon icon_svg_settings"></span>' +
                                            '<span class="button__anim"></span>' +
                                        '</button>' +
                                        '<button class="button button_remove" type="button" data-fc="button">' +
                                            '<span class="icon icon_svg_trash"></span>' +
                                            '<span class="button__anim"></span>' +
                                        '</button>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="widget__border">' +
                                    '<div class="widget__body">' +
                                        '<div class="widget__body-data"></div>' +
                                    '</div>' +
                                '</div>');

                        self.append($template);
                        that.set_color();
                        that.set_content();
                    };

                    that.get_buttons = function(){
                        that.data._el.buttons = {
                            button_collapse: self.find('.button_collapse'),
                            button_settings: self.find('.button_settings'),
                            button_remove: self.find('.button_remove')
                        };
                    };
                    that.get_name = function(){
                        that.data.name = that.data._el.buttons.button_collapse.find('.button__text').text();
                    };

                    that.set_name = function(){
                        that.data._el.buttons.button_collapse.find('.button__text').text(that.data.name);
                    };
                    that.set_color = function(){
                        var $border = self.find('.widget__border'),
                            $bodydata = self.find('.widget__body-data');
                        if (that.data.color === that.const.BORDER_COLOR_BLUE) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_blue');
                            $bodydata.attr('class',$bodydata.attr('class').replace(/\widget__body-data_color_.*?\b/g, ''));
                            $bodydata.addClass('widget__body-data_color_blue');
                        }
                        if (that.data.color === that.const.BORDER_COLOR_DEFAULT) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_default');
                            $bodydata.attr('class',$bodydata.attr('class').replace(/\widget__body-data_color_.*?\b/g, ''));
                            $bodydata.addClass('widget__body-data_color_default');
                        }
                        if (that.data.color === that.const.BORDER_COLOR_PURPLE) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_purple');
                            $bodydata.attr('class',$bodydata.attr('class').replace(/\widget__body-data_color_.*?\b/g, ''));
                            $bodydata.addClass('widget__body-data_color_purple');
                        }
                        if (that.data.color === that.const.BORDER_COLOR_RED) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_red');
                            $bodydata.attr('class',$bodydata.attr('class').replace(/\widget__body-data_color_.*?\b/g, ''));
                            $bodydata.addClass('widget__body-data_color_red');
                        }
                    };
                    that.set_content = function(){
                        var $body = self.find('.widget__body'),
                            $bodydata = self.find('.widget__body-data');
                        if (typeof that.data.loader == 'function') {
                            $body.addClass('widget__body_align_center');
                            $bodydata.attr('class', $bodydata.attr('class').replace(/\widget__body-data_type_.*?\b/g, ''));
                            $bodydata.html(that.const.CONTENT_LOADING);
                            that.data.content = new that.data.loader({
                                pagename: that.data.pagename,
                                elementname: that.data.elementname,
                                success: function(content){
                                    $body.removeClass('widget__body_align_center');
                                    $bodydata.addClass('widget__body-data_type_html');
                                    $bodydata.html(content);
                                },
                                error: function(msg){
                                    $bodydata.addClass('widget__body-data_type_text');
                                    $bodydata.html(msg);
                                }
                            });
                            that.data.content.loadContent();
                        } else {
                            $body.addClass('widget__body_align_center');
                            $bodydata.html(that.const.CONTENT_NODATA);
                        }
                        /*
                        setTimeout(function(){
                            $body.removeClass('widget__body_align_center');
                            $bodydata.html('');
                            if (that.data.content_type === that.const.CONTENT_TYPE_COUNT) {
                                $body.addClass('widget__body_align_center');
                                $bodydata.addClass('widget__body-data_type_count');
                                $bodydata.text(that.data.content);
                            }
                            if (that.data.content_type === that.const.CONTENT_TYPE_TEXT) {
                                $body.addClass('widget__body_align_center');
                                $bodydata.addClass('widget__body-data_type_text');
                                $bodydata.text(that.data.content);
                            }
                            if (that.data.content_type === that.const.CONTENT_TYPE_HTML) {
                                $bodydata.addClass('widget__body-data_type_html');
                                $bodydata.html(that.data.content);
                            }
                            if (that.data.content === that.const.CONTENT_NODATA) {
                                $body.addClass('widget__body_align_center');
                                $bodydata.addClass('widget__body-data_type_text');
                                $bodydata.text(that.data.content);
                            }
                        }, 1000);
                        */
                    };

                    that.collapse = function(){
                        self.addClass('widget_collapsed');
                        that.data.collapsed = true;
                    };
                    that.expand = function(){
                        self.removeClass('widget_collapsed');
                        that.data.collapsed = false;
                    };
                    that.toggle = function(){
                        self.toggleClass('widget_collapsed');
                        that.data.collapsed = !that.data.collapsed;
                    };
                    that.trigger_toggle = function(){
                        self.trigger('toggle.widget');
                    };
                    that.check_toggle = function(){
                        if (that.data.collapsed) {
                            that.collapse();
                        } else {
                            that.expand();
                        }
                    };

                    that.edit_mode = function(){
                        that.data._el.buttons.button_collapse.button('disable');
                        that.data._el.buttons.button_settings.button('show').button('enable');
                        that.data._el.buttons.button_remove.button('show').button('enable');
                        that.data.mode = 'edit';
                    };
                    that.view_mode = function(){
                        that.data._el.buttons.button_collapse.button('enable');
                        that.data._el.buttons.button_settings.button('hide').button('disable');
                        that.data._el.buttons.button_remove.button('hide').button('disable');
                        that.data.mode = 'view';
                    };

                    that.settings = function(){
                        var modal_options = {
                            buttons: [
                                {
                                    name: 'save',
                                    action: 'save',
                                    icon: 'icon_svg_ok'
                                },
                                {
                                    name: 'destroy',
                                    action: 'destroy',
                                    icon: 'icon_svg_close'
                                }
                            ],
                            header: {
                                caption: 'Настройки виджета',
                                name: that.data.name
                            },
                            content: { tabs: [] },
                            data: that.data
                        };
                        that.render_general_tab(modal_options.content.tabs);
                        that.render_source_tab(modal_options.content.tabs);

                        $('<span class="modal"></span>').appendTo('body')
                            .modal(modal_options)
                            .on('save.fc.modal', function(){
                                var reload = false;
                                $(this).find('[data-field]').each(function(){
                                    var t = $(this), val = t[t.data('fc').replace('-','_')]('value');
                                    if ((t.data('field') == 'pagename' ||
                                         t.data('field') == 'elementname') &&
                                        that.data[t.data('field')] != val) {
                                        reload = true;
                                    }
                                    _.set(that.data, t.data('field'), val);
                                });
                                that.trigger_toggle();
                                that.set_name();
                                that.set_color();
                                if (reload) {
                                    that.set_content();
                                }
                                $(this).modal('destroy');
                            });
                    };
                    that.render_general_tab = function(tabs){
                        tabs.push({
                            id: 'general',
                            name: 'Основные',
                            active: true,
                            content:

                            '<div class="control">' +
                            '<div class="control__caption">' +
                            '<div class="control__text">Скрывать по умолчанию</div>' +
                            '</div>' +
                            '<div class="control__container">' +
                            '<label class="checkbox" data-fc="checkbox" data-field="collapsed"' +
                            (that.data.collapsed ? 'data-checked="true"' : '') + '>' +
                            '<input class="checkbox__input" type="checkbox" name="collapsed"/>' +
                            '<label class="checkbox__label"></label>' +
                            '</label>' +
                            '</div>' +
                            '</div>' +

                            '<div class="control">' +
                            '<div class="control__caption">' +
                            '<div class="control__text">Заголовок</div>' +
                            '<div class="control__icons">' +
                            '<span class="icon icon_svg_star_red"></span>' +
                            '<span class="icon icon_svg_star_green"></span>' +
                            '<span class="icon icon_svg_info"></span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="control__container">' +
                            '<span class="input input__has-clear" data-fc="input" data-field="name">' +
                            '<span class="input__box">' +
                            '<input type="text" class="input__control" value="' + that.data.name + '">' +
                            '<button class="button" type="button" data-fc="button">' +
                            '<span class="icon icon_svg_close"></span>' +
                            '</button>' +
                            '</span>' +
                            '</span>' +
                            '</div>' +
                            '</div>' +

                            '<div class="control">' +
                            '<div class="control__caption">' +
                            '<div class="control__text">Цвет</div>' +
                            '</div>' +
                            '<div class="control__container">' +
                            '<select class="select" name="color" data-fc="select" data-field="color">' +
                            '<option value="' + that.const.BORDER_COLOR_DEFAULT + '" ' + (that.data.color == that.const.BORDER_COLOR_DEFAULT ? 'selected' : '' ) + '>Серый</option>' +
                            '<option value="' + that.const.BORDER_COLOR_BLUE + '" ' + (that.data.color == that.const.BORDER_COLOR_BLUE ? 'selected' : '' ) + '>Синий</option>' +
                            '<option value="' + that.const.BORDER_COLOR_PURPLE + '" ' + (that.data.color == that.const.BORDER_COLOR_PURPLE ? 'selected' : '' ) + '>Фиолетовый</option>' +
                            '<option value="' + that.const.BORDER_COLOR_RED + '" ' + (that.data.color == that.const.BORDER_COLOR_RED ? 'selected' : '' ) + '>Красный</option>' +
                            '</select>' +
                            '</div>' +
                            '</div>'
                        });
                    };
                    that.render_source_tab = function(tabs){
                        if (that.data.library) {
                            var $control__library = $([
                                    '<div class="control">',
                                    '<div class="control__caption">',
                                    '<div class="control__text">Библиотека виджетов</div>',
                                    '</div>',
                                    '<div class="control__container">',
                                    '<select class="select" name="pagename" data-fc="select" data-field="pagename" data-mode="radio-check"></select>',
                                    '</div>',
                                    '</div>'
                                ].join('')),
                                $control__widgets = $([
                                    '<div class="control">',
                                    '<div class="control__caption">',
                                    '<div class="control__text">Виджет</div>',
                                    '</div>',
                                    '<div class="control__container">',
                                    '<select class="select" name="elementname" data-fc="select" data-field="elementname" data-mode="radio-check"></select>',
                                    '</div>',
                                    '</div>'
                                ].join(''));
                            that.data.library.forEach(function(item, i, arr){
                                $control__library.find('.select').append($(
                                    '<option value="' + item.value + '" ' + (item.value == that.data.pagename ? 'selected="selected"' : '') + '>' + item.text + '</option>'
                                ));
                                item.items.forEach(function(item, i, arr){
                                    $control__widgets.find('.select').append($(
                                        '<option value="' + item.value + '" ' + (item.value == that.data.elementname ? 'selected="selected"' : '') + '>' + item.text + '</option>'
                                    ));
                                });
                            });
                            tabs.push({
                                id: 'source',
                                name: 'Источник данных',
                                content:
                                    $control__library[0].outerHTML +
                                    $control__widgets[0].outerHTML
                            });
                        }
                    };

                    that.bind = function(){
                        self.on('toggle.widget', that.check_toggle);
                        that.data._el.buttons.button_collapse.on('click.widget', that.toggle);
                        that.data._el.buttons.button_settings.on('click.widget', that.settings);
                        that.data._el.buttons.button_remove.on('click.widget', that.destroy);
                    };

                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="checkbox"]').checkbox();
                    };
                    that.init = function(){
                        if (self.children().length == 0) {
                            that.render();
                            that.get_buttons();
                        } else {
                            that.get_buttons();
                            that.get_name();
                        }
                        that.init_components();
                        that.bind();
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
        collapse : function() {
            return this.each(function() {
                this.obj.collapse();
            });
        },
        expand : function() {
            return this.each(function() {
                this.obj.expand();
            });
        },
        toggle : function() {
            return this.each(function() {
                this.obj.toggle();
            });
        },
        edit_mode : function() {
            return this.each(function() {
                this.obj.edit_mode();
            });
        },
        view_mode : function() {
            return this.each(function() {
                this.obj.view_mode();
            });
        },
    };
    $.fn.widget = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.widget' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="widget"]').widget();
});