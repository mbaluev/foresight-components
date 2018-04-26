(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'modal__', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        buttons: [
                            {
                                name: 'destroy',
                                action: 'destroy',
                                icon: 'icon_svg_close'
                            }
                        ],
                        header: {
                            icon: 'icon_svg_settings',
                            caption: 'Модальное окно',
                            name: 'Название'
                        },
                        content: {
                            tabs: [
                                {
                                    id: "general",
                                    name: 'Главная',
                                    padding: null
                                }
                            ]
                        },
                        data: null,
                        show: true,
                        position: null,
                        size: null,
                        draggable: false,
                        draggable_grid_size: 1,
                        render_tabs_row: true,
                        fullscreen: {
                            active: false,
                            dimentions: null
                        }
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        modal__view: $('<div class="modal__view"></div>'),
                        modal__backdrop: $('<div class="modal__backdrop"></div>'),
                        modal__dialog: $('<div class="modal__dialog modal__dialog_hidden"></div>'),
                        modal__dialog_handle_NE: $('<div class="modal__dialog_handle modal__dialog_handle_NE"></div>'),
                        modal__dialog_handle_NN: $('<div class="modal__dialog_handle modal__dialog_handle_NN"></div>'),
                        modal__dialog_handle_NW: $('<div class="modal__dialog_handle modal__dialog_handle_NW"></div>'),
                        modal__dialog_handle_WW: $('<div class="modal__dialog_handle modal__dialog_handle_WW"></div>'),
                        modal__dialog_handle_EE: $('<div class="modal__dialog_handle modal__dialog_handle_EE"></div>'),
                        modal__dialog_handle_SW: $('<div class="modal__dialog_handle modal__dialog_handle_SW"></div>'),
                        modal__dialog_handle_SS: $('<div class="modal__dialog_handle modal__dialog_handle_SS"></div>'),
                        modal__dialog_handle_SE: $('<div class="modal__dialog_handle modal__dialog_handle_SE"></div>'),
                        card: $('<div class="card" data-fc="card"></div>'),
                        card__header: $('<div class="card__header"></div>'),
                        card__header_row_caption: $('<div class="card__header-row"></div>'),
                        card__header_row_name: $('<div class="card__header-row"></div>'),
                        card__header_row_tabs: $('<div class="card__header-row tabs"></div>'),
                        tabs__list: $('<ul class="tabs__list"></ul>'),
                        card__main: $('<div class="card__main"></div>'),
                        card__middle: $('<div class="card__middle"></div>'),
                        card__middle_scroll: $('<div class="card__middle-scroll"></div>'),
                        card__backdrop: $('<div class="card__backdrop"></div>'),
                        card__right: $('<div class="card__right"></div>'),
                        tabs_pane: $('<div class="tabs__pane"></div>')
                    };
                    that.data._triggers = {
                        show: 'show.fc.modal',
                        shown: 'shown.fc.modal',
                        showed: 'showed.fc.modal',
                        hide: 'hide.fc.modal',
                        hidden: 'hidden.fc.modal',
                        loaded: 'loaded.fc.modal'
                    };

                    that.destroy = function(){
                        that.hide();
                        setTimeout(function(){
                            self.removeData();
                            self.remove();
                        }, 500);
                    };
                    that.hide = function(){
                        that.data.transitioning = true;
                        that.data._el.modal__dialog.removeClass('modal__dialog_draggable');
                        self.trigger(that.data._triggers.hide);
                        self.find('.modal__dialog').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e){
                            if (that.data.transitioning) {
                                that.data.transitioning = false;
                                $(this).off(e);
                                self.addClass('modal_hidden');
                                self.trigger(that.data._triggers.hidden);
                            }
                        });
                        self.find('.modal__dialog').addClass('modal__dialog_hidden');
                        that.data.show = false;
                    };
                    that.hidden = function(){
                        self.find('.modal__dialog').addClass('modal__dialog_hidden');
                        self.addClass('modal_hidden');
                        that.data.show = false;
                    };
                    that.show = function(){
                        that.data.transitioning = true;
                        self.trigger(that.data._triggers.show);
                        that.data._el.modal__dialog.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e){
                            if (that.data.transitioning) {
                                that.data.transitioning = false;
                                $(this).off(e);
                                that.data._el.card.css('max-height', '100%');
                                if (that.data.draggable) {
                                    that.init_draggable();
                                }
                                self.trigger(that.data._triggers.shown);
                                self.trigger(that.data._triggers.showed);
                            }
                        });
                        self.removeClass('modal_hidden');
                        setTimeout(function(){
                            self.find('.modal__dialog').removeClass('modal__dialog_hidden');
                        }, 0);
                        that.data.show = true;
                    };
                    that.fullscreen = function(){
                        if (that.data.fullscreen.active) {
                            that.data.fullscreen.active = false;
                            that.data._el.modal__dialog.css(that.data.fullscreen.dimentions);
                        } else {
                            that.data.fullscreen.active = true;
                            that.data.fullscreen.dimentions = {
                                left: that.data._el.modal__dialog.offset().left,
                                top: that.data._el.modal__dialog.offset().top,
                                height: that.data._el.modal__dialog.outerHeight(),
                                width: that.data._el.modal__dialog.outerWidth()
                            };
                            that.data._el.modal__dialog.css({
                                top: 5,
                                left: 5,
                                width: that.data._el.modal__view.width(),
                                height: that.data._el.modal__view.height()
                            });
                        }
                    };

                    that.render_view = function(){
                        self.append(that.data._el.modal__view
                            .append(that.data._el.modal__backdrop, that.data._el.modal__dialog
                                .append(that.data._el.card
                                    .append(that.data._el.card__header
                                        .append(that.data._el.card__header_row_caption, that.data._el.card__header_row_name,
                                        (that.data.render_tabs_row ? that.data._el.card__header_row_tabs.append(that.data._el.tabs__list) : null)),
                                    that.data._el.card__main
                                        .append(that.data._el.card__middle
                                            .append(that.data._el.card__middle_scroll))))));
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
                        that.data._el.card__header_row_caption.append($(
                            '<div class="card__header-column">' +
                                '<label class="card__caption">' +
                                    '<span class="card__caption-text">' + that.data.header.caption + '</span>' +
                                '</label>' +
                            '</div>'
                        ));
                    };
                    that.render_header_caption_buttons = function(){
                        var $buttons_column = $('<div class="card__header-column"></div>');
                        that.data._el.card__header_row_caption.append($buttons_column);
                        that.data.buttons.forEach(function(button){
                            var $button = $(
                                '<button class="button button__' + button.name + '" data-fc="button" ' +
                                (button.tooltip ? 'data-tooltip="' + button.tooltip + '"' : '') + '>' +
                                (button.icon ? '<span class="icon ' + button.icon + '"></span>' : '') +
                                (button.caption ? '<span class="button__text"> ' + button.caption + '</span>' : '') +
                                '</button>'
                            );
                            if (button.action) {
                                if (typeof that[button.action] === "function") {
                                    $button.on('click', that[button.action]);
                                }
                                if (!that.data._triggers[button.action]) {
                                    $button.on('click', function(){
                                        self.trigger(button.action + '.fc.modal', [that.data.items]);
                                    });
                                }
                            }
                            $buttons_column.append($button);
                        });
                    };
                    that.render_header_name = function(){
                        that.data._el.card__header_row_name.append($(
                            '<div class="card__header-column card__header-column_start card__header-column_flex_1-1-auto">' +
                                '<label class="card__name">' +
                                    '<span class="card__name-text">' + that.data.header.name + '</span>' +
                                '</label>' +
                            '</div>'
                        ));
                    };
                    that.render_tabs = function(){
                        if (that.data.content.tabs.length == 1) {
                            that.data.content.tabs[0].active = true;
                        } else {
                            var has_active_tab = false;
                            that.data.content.tabs.forEach(function(tab) {
                                if (tab.active) {
                                    has_active_tab = true;
                                }
                            });
                            if (!has_active_tab) {
                                that.data.content.tabs[0].active = true;
                            }
                        }
                        that.data.content.tabs.forEach(function(tab){
                            var $tab__link = $([
                                '<a class="tabs__link link" href="#' + tab.id + '" data-fc="tab">',
                                '<button class="button" data-fc="button">',
                                '<span class="button__text">' + tab.name + '</span>',
                                '</button>',
                                '</a>'
                            ].join(''));
                            $tab__link.data('data', tab.data);
                            $tab__link.data('onclick', tab.onclick);
                            that.data._el.tabs__list.append(
                                $((tab.active ? '<li class="tabs__tab tabs__tab_active"></li>' : '<li class="tabs__tab"></li>' ))
                                    .append(
                                        $tab__link
                                    )
                            );
                            that.data._el.card__middle_scroll.append(
                                that.data._el.tabs_pane.clone()
                                    .attr('id', tab.id)
                                    .css('padding', (tab.padding ? tab.padding : null))
                                    .addClass((tab.active ? 'tabs__pane_active' : ''))
                                    .append(tab.content));
                        });
                    };

                    that.bind = function(){
                        self.find('.modal__backdrop').on('click', that.destroy);
                    };
                    that.bind_buttons = function(){
                        that.data.buttons.forEach(function(button){
                            var $button = $(button.selector);
                            if (button.action) {
                                if (typeof that[button.action] === "function") {
                                    $button.on('click', that[button.action]);
                                }
                                if (!that.data._triggers[button.action]) {
                                    $button.on('click', function(){
                                        self.trigger(button.action + '.fc.modal', [that.data.items]);
                                    });
                                }
                            }
                        });
                    };

                    that.set_position = function(){
                        if (that.data.position) {
                            that.data._el.modal__view.addClass('modal__view_align_' + that.data.position.split(' ').join('_'));
                        }
                    };
                    that.set_size = function(){
                        if (that.data.size) {
                            that.data._el.modal__dialog.addClass('modal__dialog_size_' + that.data.size);
                        }
                    };

                    that.init_draggable = function(){
                        var dimm = that.data._el.modal__dialog.offset();
                        dimm.width = that.data._el.modal__dialog.outerWidth();
                        if (that.data._el.modal__dialog.is('[class*="max"]')) {
                            dimm.height = that.data._el.modal__dialog.outerHeight();
                        }
                        that.data._el.modal__dialog
                            .css(dimm)
                            .append(
                                that.data._el.modal__dialog_handle_NE,
                                that.data._el.modal__dialog_handle_NN,
                                that.data._el.modal__dialog_handle_NW,
                                that.data._el.modal__dialog_handle_WW,
                                that.data._el.modal__dialog_handle_EE,
                                that.data._el.modal__dialog_handle_SW,
                                that.data._el.modal__dialog_handle_SS,
                                that.data._el.modal__dialog_handle_SE
                            )
                            .addClass('modal__dialog_absolute')
                            .addClass('modal__dialog_draggable')
                            .drag('start', function(ev, dd){
                                dd.attr = $(ev.target).prop('className');
                                dd.width = $(this).width();
                                dd.height = $(this).height();
                            })
                            .drag(function(ev, dd){
                                that.data.fullscreen.active = false;
                                var props = {};
                                if (dd.attr.indexOf('E') > -1) {
                                    props.width = Math.max(400, dd.width + dd.deltaX);
                                }
                                if (dd.attr.indexOf('S') > -1) {
                                    props.height = Math.max(200, dd.height + dd.deltaY);
                                }
                                if (dd.attr.indexOf('W') > -1) {
                                    props.width = Math.max(400, dd.width - dd.deltaX);
                                    props.left = dd.originalX + dd.width - props.width;
                                }
                                if (dd.attr.indexOf('N') > -1) {
                                    props.height = Math.max(200, dd.height - dd.deltaY);
                                    props.top = dd.originalY + dd.height - props.height;
                                }
                                if (dd.attr.indexOf('card__header') > -1 ||
                                    dd.attr.indexOf('card__caption') > -1 ||
                                    dd.attr.indexOf('card__name') > -1) {
                                    props.top = dd.offsetY;
                                    props.left = dd.offsetX;
                                }
                                $(this).css({
                                    top: Math.round(props.top / that.data.draggable_grid_size) * that.data.draggable_grid_size,
                                    left: Math.round(props.left / that.data.draggable_grid_size) * that.data.draggable_grid_size,
                                    width: Math.round(props.width / that.data.draggable_grid_size) * that.data.draggable_grid_size,
                                    height: Math.round(props.height / that.data.draggable_grid_size) * that.data.draggable_grid_size
                                });
                            });
                    };
                    that.init_components = function(){
                        self.find('[data-fc="alertbox"]').alertbox();
                        self.find('[data-fc="button"]').button({
                            popup_animation: false
                        });
                        self.find('[data-fc="checkbox"]').checkbox();
                        self.find('[data-fc="input"]').input({
                            popup_animation: false
                        });
                        self.find('[data-fc="radio"]').radio();
                        self.find('[data-fc="radio-group"]').radio_group();
                        self.find('[data-fc="select"]').select({
                            popup_animation: false,
                            autoclose: true
                        });
                        self.find('[data-fc="tab"]').tabs();
                        self.find('[data-fc="tumbler"]').tumbler();
                        self.find('[data-fc="widget"]').widget();
                    };
                    that.init = function(){
                        self.remove().appendTo('body');
                        self.data(that.data);
                        that.set_position();
                        that.set_size();
                        if (self.children().length == 0) {
                            that.render_view();
                            that.render_header();
                            that.render_tabs();
                            that.init_components();
                        } else {
                            that.init_components();
                            that.bind_buttons();
                        }
                        that.bind();
                        self.trigger(that.data._triggers.loaded);
                        if (that.data.show) {
                            that.show();
                        } else {
                            that.hidden();
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
    $.fn.modal__ = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.modal__' );
        }
    };
})( jQuery );