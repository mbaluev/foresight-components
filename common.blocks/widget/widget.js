(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget', target : self });
                    var that = this.obj = {};
                    that.const = {
                        NO_DATA: 'Нет данных',
                        ERROR_DATA: 'Ошибка загрузки',
                        BORDER_COLOR_BLUE: '#5a97f2',
                        BORDER_COLOR_DEFAULT: '#ccc',
                        BORDER_COLOR_NODATA: '#aaa',
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
                        content_type: that.const.CONTENT_TYPE_TEXT,
                        content: that.const.NO_DATA,
                        onSave: null
                    };
                    that.options = $.extend(true, {}, that.defaults, options);
                    that.data = self.data();

                    /* public */
                    that.data.options = that.options;
                    that.data.buttons = {};

                    that.render = function(){
                        var $template = $(
                                '<div class="widget__header">' +
                                    '<div class="widget__header-name">' +
                                        '<button class="button button_collapse" type="button" data-fc="button">' +
                                            '<span class="button__text">' + that.data.options.name + '</span>' +
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
                                    '<div class="widget__body widget__body_align_center">' +
                                        '<div class="widget__body-data"></div>' +
                                    '</div>' +
                                '</div>');
                        var $border = $($template[1]);
                        var $bodydata = $border.find('.widget__body-data');

                        /* const.no_data */
                        if (that.data.options.content === that.const.NO_DATA) {
                            that.data.options.content_type = that.const.CONTENT_TYPE_TEXT;
                            that.data.options.color = that.const.BORDER_COLOR_NODATA;
                        }

                        /* options.content_type */
                        if (that.data.options.content_type === that.const.CONTENT_TYPE_COUNT) {
                            $bodydata.addClass('widget__body-data_type_count');
                            $bodydata.text(that.data.options.content);
                        }
                        if (that.data.options.content_type === that.const.CONTENT_TYPE_TEXT) {
                            $bodydata.addClass('widget__body-data_type_text');
                            $bodydata.text(that.data.options.content);
                        }
                        if (that.data.options.content_type === that.const.CONTENT_TYPE_HTML) {
                            $bodydata.addClass('widget__body-data_type_html');
                            $bodydata.html(that.data.options.content);
                        }

                        /* options.color */
                        if (that.data.options.color === that.const.BORDER_COLOR_BLUE) {
                            $border.addClass('widget__border_color_blue');
                            $bodydata.addClass('widget__body-data_color_blue');
                        }
                        if (that.data.options.color === that.const.BORDER_COLOR_DEFAULT) {
                            $border.addClass('widget__border_color_default');
                            $bodydata.addClass('widget__body-data_color_default');
                        }
                        if (that.data.options.color === that.const.BORDER_COLOR_NODATA) {
                            $border.addClass('widget__border_color_nodata');
                            $bodydata.addClass('widget__body-data_color_nodata');
                        }
                        if (that.data.options.color === that.const.BORDER_COLOR_PURPLE) {
                            $border.addClass('widget__border_color_purple');
                            $bodydata.addClass('widget__body-data_color_purple');
                        }
                        if (that.data.options.color === that.const.BORDER_COLOR_RED) {
                            $border.addClass('widget__border_color_red');
                            $bodydata.addClass('widget__body-data_color_red');
                        }

                        self.append($template);
                    };
                    that.get_buttons = function(){
                        that.data.buttons = {
                            button_collapse: self.find('.button_collapse'),
                            button_settings: self.find('.button_settings'),
                            button_remove: self.find('.button_remove')
                        };
                    };
                    that.get_name = function(){
                        that.data.options.name = that.data.buttons.button_collapse.find('.button__text').text();
                    };

                    that.destroy = function(){
                        if (typeof that.data.buttons.button_collapse[0] != "undefined") {
                            that.data.buttons.button_collapse.button('destroy');
                        }
                        if (typeof that.data.buttons.button_settings[0] != "undefined") {
                            that.data.buttons.button_settings.button('destroy');
                        }
                        if (typeof that.data.buttons.button_remove[0] != "undefined") {
                            that.data.buttons.button_remove.button('destroy');
                        }
                        self.data = null;
                        self.remove();
                    };
                    that.collapse = function(){
                        self.addClass('widget_collapsed');
                    };
                    that.expand = function(){
                        self.removeClass('widget_collapsed');
                    };
                    that.toggle = function(){
                        self.toggleClass('widget_collapsed');
                        that.data.options.collapsed = !that.data.options.collapsed;
                    };
                    that.check_toggle = function(){
                        if (that.data.options.collapsed) {
                            that.collapse();
                        } else {
                            that.expand();
                        }
                    };
                    that.settings = function(){
                        var modal_options = {
                            header: {
                                caption: 'Настройки виджета',
                                name: that.data.options.name,
                                buttons: [
                                    {
                                        name: 'save',
                                        action: 'save',
                                        icon: 'icon_svg_ok',
                                        event: function(data){
                                            console.log(data);
                                            that.data.options = data;
                                            self.trigger('self.check_toggle');
                                            if (typeof(that.options.onSave) == "function") {
                                                that.options.onSave(data);
                                            }
                                        }
                                    },
                                    {
                                        name: 'close',
                                        action: 'destroy',
                                        icon: 'icon_svg_close'
                                    }
                                ]
                            },
                            content: {
                                tabs: [
                                    {
                                        id: 'general', name: 'Основные', active: true,
                                        content:
                                        '<label class="checkbox" data-fc="checkbox" data-field="collapsed"' +
                                        (that.data.options.collapsed ? 'data-checked="true"' : '') + '>' +
                                        '<input class="checkbox__input" type="checkbox" name="collapsed"/>' +
                                        '<label class="checkbox__label">Скрывать по умолчанию</label>' +
                                        '</label>'
                                    },
                                    {
                                        id: 'datasource', name: 'Источник данных',
                                        content: 'Источник данных'
                                    },
                                    {
                                        id: 'advanced', name: 'Расширенные',
                                        content:
                                            '<span class="button-group" data-fc="button-group">' +
                                                '<button class="button" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_info"></span>' +
                                                '</button>' +
                                                '<button class="button" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_star_red"></span>' +
                                                '</button>' +
                                                '<button class="button" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_star_green"></span>' +
                                                '</button>' +
                                            '</button>'
                                    }
                                ]
                            },
                            data: that.data.options
                        };
                        $('<span class="modal"></span>').appendTo('body').modal(modal_options);
                    };
                    that.bind = function(){
                        self.on('self.check_toggle', that.check_toggle);
                        that.data.buttons.button_collapse.on('click.widget', that.toggle);
                        that.data.buttons.button_settings.on('click.widget', that.settings);
                        that.data.buttons.button_remove.on('click.widget', that.destroy);
                    };
                    that.editMode = function(){
                        that.data.buttons.button_collapse.button('disable');
                        that.data.buttons.button_settings.button('show').button('enable');
                        that.data.buttons.button_remove.button('show').button('enable');
                    };
                    that.viewMode = function(){
                        that.data.buttons.button_collapse.button('enable');
                        that.data.buttons.button_settings.button('hide').button('disable');
                        that.data.buttons.button_remove.button('hide').button('disable');
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
        editMode : function() {
            return this.each(function() {
                this.obj.editMode();
            });
        },
        viewMode : function() {
            return this.each(function() {
                this.obj.viewMode();
            });
        },
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
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