(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'modal', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        header: {
                            icon: 'icon_svg_settings',
                            caption: 'Модальное окно',
                            name: 'Название',
                            buttons: [
                                {
                                    name: 'close',
                                    action: 'destroy',
                                    icon: 'icon_svg_close'
                                }
                            ]
                        },
                        content: {
                            tabs: [
                                { id: "main", name: 'Основные' }
                            ]
                        },
                        data: null
                    };
                    that.options = $.extend({}, that.defaults, options);
                    that.data = self.data();

                    that.el = {
                        modal__view: $('<div class="modal__view"></div>'),
                        modal__backdrop: $('<div class="modal__backdrop"></div>'),
                        modal__dialog: $('<div class="modal__dialog modal__dialog_hidden"></div>'),
                        card: $('<div class="card" data-fc="card"></div>'),
                        card__header: $('<div class="card__header"></div>'),
                        card__header_row_caption: $('<div class="card__header-row"></div>'),
                        card__header_row_name: $('<div class="card__header-row"></div>'),
                        card__header_row_tabs: $('<div class="card__header-row tabs"></div>'),
                        tabs__list: $('<ul class="tabs__list"></ul>'),
                        card__main: $('<div class="card__main"></div>'),
                        card__middle: $('<div class="card__middle card__middle_full"></div>'),
                        card__middle_scroll: $('<div class="card__middle-scroll"></div>'),
                        card__middle_inner: $('<div class="card__middle-inner"></div>'),
                        card__backdrop: $('<div class="card__backdrop"></div>'),
                        card__right: $('<div class="card__right"></div>'),
                        tabs_pane: $('<div class="tabs__pane"></div>')
                    };

                    that.destroy = function(){
                        that.hide();
                        self.find('.modal__backdrop').remove();
                        setTimeout(function(){
                            self.data = null;
                            self.remove();
                        }, 500);
                    };
                    that.save = function(){
                        that.el.card__middle_inner.find('[data-field]').each(function(){
                            var t = $(this);
                            _.set(that.options.data, t.data('field'), t[t.data('fc')]('value'));
                        });
                    };
                    that.hide = function(){
                        self.find('.modal__dialog').addClass('modal__dialog_hidden');
                    };
                    that.show = function(){
                        self.find('.modal__dialog').removeClass('modal__dialog_hidden');
                    };
                    that.render_view = function(){
                        self.append(that.el.modal__view
                            .append(that.el.modal__backdrop, that.el.modal__dialog
                                .append(that.el.card
                                    .append(that.el.card__header
                                        .append(that.el.card__header_row_caption, that.el.card__header_row_name, that.el.card__header_row_tabs
                                            .append(that.el.tabs__list)),
                                    that.el.card__main
                                        .append(that.el.card__middle
                                            .append(that.el.card__middle_scroll
                                                .append(that.el.card__middle_inner)))))));
                    };
                    that.render_header = function(){
                        that.render_header_caption();
                        that.render_header_name();
                    };
                    that.render_header_caption = function(){
                        that.render_header_caption_name();
                        that.render_header_caption_buttons();
                    };
                    that.render_header_caption_name = function(){
                        that.el.card__header_row_caption.append($(
                            '<div class="card__header-column">' +
                                '<label class="card__caption">' +
                                    '<span class="card__caption-text">' + that.options.header.caption + '</span>' +
                                '</label>' +
                            '</div>'
                        ));
                    };
                    that.render_header_caption_buttons = function(){
                        var $buttons_column = $('<div class="card__header-column"></div>');
                        that.el.card__header_row_caption.append($buttons_column);
                        that.options.header.buttons.forEach(function(button){
                            var $button = $(
                                '<button class="button button__' + button.name + '" data-fc="button">' +
                                    (button.icon ? '<span class="icon ' + button.icon + '"></span>' : '') +
                                    (button.caption ? '<span class="button__text"> ' + button.caption + '</span>' : '') +
                                    '<span class="button__anim"></span>' +
                                '</button>'
                            );
                            if (button.action) {
                                $button.on('click', that[button.action]);
                            }
                            if (typeof(button.event) === "function") {
                                $button.on('click', function(){
                                    button.event(that.options.data);
                                    that.destroy();
                                });
                            }
                            $buttons_column.append($button);
                        });
                    };
                    that.render_header_name = function(){
                        that.el.card__header_row_name.append($(
                            '<div class="card__header-column">' +
                                '<label class="card__name">' +
                                    '<span class="card__name-text">' + that.options.header.name + '</span>' +
                                '</label>' +
                            '</div>'
                        ));
                    };
                    that.render_tabs = function(){
                        if (that.options.content.tabs.length == 1) {
                            that.options.content.tabs[0].active = true;
                        } else {
                            var has_active_tab = false;
                            that.options.content.tabs.forEach(function(tab) {
                                if (tab.active) {
                                    has_active_tab = true;
                                }
                            });
                            if (!has_active_tab) {
                                that.options.content.tabs[0].active = true;
                            }
                        }
                        that.options.content.tabs.forEach(function(tab){
                            that.el.tabs__list.append($(
                                (tab.active ? '<li class="tabs__tab tabs__tab_active">' : '<li class="tabs__tab">' ) +
                                    '<a class="tabs__link link" href="#' + tab.id + '">' +
                                        '<button class="button" data-fc="button">' +
                                            '<span class="button__text">' + tab.name + '</span>' +
                                            '<span class="button__anim"></span>' +
                                        '</button>' +
                                    '</a>' +
                                '</li>'
                            ));
                            that.el.card__middle_inner.append(
                                that.el.tabs_pane.clone()
                                    .attr('id', tab.id)
                                    .addClass((tab.active ? 'tabs__pane_active' : ''))
                                    .append($(tab.content)));
                        });
                    };
                    that.init_components = function(){
                        self.find('[data-fc="alertbox"]').alertbox();
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="checkbox"]').checkbox();
                        self.find('[data-fc="radio"]').radio();
                        self.find('[data-fc="radio-group"]').radio_group();
                        //self.find('[data-fc="tabs"]').tabs();
                        self.find('[data-fc="tumbler"]').tumbler();
                        self.find('[data-fc="widget"]').widget();
                    };
                    that.bind = function(){
                        self.find('.button_close').on('click', that.destroy);
                        self.find('.modal__backdrop').on('click', that.destroy);
                    };
                    that.init = function(){
                        if (self.children().length == 0) {
                            that.render_view();
                            that.render_header();
                            that.render_tabs();
                        }
                        that.init_components();
                        that.bind();
                        setTimeout(that.show, 0);
                    };
                    that.init();
                }
                return this;
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
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        }
    };
    $.fn.modal = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.modal' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="modal"]').modal();
});
