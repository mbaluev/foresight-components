(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'modal', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();

                    that.modal_options = {
                        header: {
                            icon: 'icon_svg_settings',
                            caption: 'Модальное окно',
                            name: 'Название',
                            buttons: [
                                {
                                    name: 'close',
                                    action: 'destroy',
                                    icon: 'icon_svg_close',
                                    event: function(data){ console.log(data); },
                                }
                            ]
                        },
                        content: {
                            tabs: [
                                { id: "main", name: 'Основные', active: true },
                                { id: "misc", name: 'Прочие' }
                            ]
                        },
                        data: null
                    };

                    that.el = {
                        modal__view: $('<div class="modal__view"></div>'),
                        modal__backdrop: $('<div class="modal__backdrop"></div>'),
                        modal__dialog: $('<div class="modal__dialog modal__dialog_hidden"></div>'),
                        card: $('<div class="card"></div>'),
                        card__header: $('<div class="card__header"></div>'),
                        card__header_row_top: $('<div class="card__header-row"></div>'),
                        card__header_row_name: $('<div class="card__header-row"></div>'),
                        card__header_row_tabs: $('<div class="card__header-row tabs"></div>'),
                        tabs__list: $('<ul class="tabs__list"></ul>')
                    };

                    that.destroy = function(){
                        that.hide();
                        self.find('.modal__backdrop').remove();
                        setTimeout(function(){
                            self.data = null;
                            self.remove();
                        }, 500);
                    };
                    that.hide = function(){
                        self.find('.modal__dialog').addClass('modal__dialog_hidden');
                    };
                    that.show = function(){
                        self.find('.modal__dialog').removeClass('modal__dialog_hidden');
                    };
                    that.init_view = function(){
                        self.append(that.el.modal__view
                            .append(that.el.modal__backdrop, that.el.modal__dialog
                                .append(that.el.card
                                    .append(that.el.card__header
                                        .append(that.el.card__header_row_top, that.el.card__header_row_name, that.el.card__header_row_tabs
                                            .append(that.el.tabs__list))))));
                    };
                    that.init_header = function(){
                        that.init_header_caption();
                        that.init_header_name();
                        that.init_header_buttons();
                        that.init_header_tabs();
                    };
                    that.init_header_caption = function(){};
                    that.init_header_name = function(){};
                    that.init_header_buttons = function(){};
                    that.init_header_tabs = function(){};
                    that.init_body = function(){};
                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                    };
                    that.bind = function(){
                        self.find('.button_close').on('click', that.destroy);
                        self.find('.modal__backdrop').on('click', that.destroy);
                    };
                    that.init = function(modal_options){
                        if (self.children().length == 0) {
                            that.modal_options = $.extend(true, {}, that.modal_options, modal_options);
                            that.init_view();
                            that.init_header();
                            that.init_body();
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
