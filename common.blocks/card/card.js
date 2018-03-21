(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'card', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        hiddenLeft: false,
                        hiddenRight: false,
                        menuLeftId: 'id' + (new Date()).valueOf(),
                        menuRightId: 'id' + (new Date()).valueOf()
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);
                    that.data._el = {
                        button_toggle_left: self.closestChild('[data-toggle="left"]').attr('id', that.data.menuLeftId),
                        button_toggle_right: self.closestChild('[data-toggle="right"]').attr('id', that.data.menuRightId),
                        card__main: self.closestChild('.card__main'),
                        card__left: self.closestChild('.card__left'),
                        card__right: self.closestChild('.card__right'),
                        card__backdrop: self.closestChild('.card__backdrop')
                    };

                    that.destroy = function(){
                        self.removeData();
                    };

                    that.hide_left = function(){
                        that.data._el.button_toggle_left.find('.icon').removeClass('icon_rotate_180deg');
                        that.data._el.card__left.addClass('card__left_hidden');
                        that.data._el.card__backdrop.remove();
                        if (typeof setCookie == 'function') {
                            setCookie('card_menu_left_hidden', true);
                        }
                        $(window).trigger('resize');
                    };
                    that.hide_right = function(){
                        that.data._el.button_toggle_right.find('.icon').removeClass('icon_rotate_180deg');
                        that.data._el.card__right.addClass('card__right_hidden');
                        that.data._el.card__backdrop.remove();
                        if (typeof setCookie == 'function') {
                            setCookie('card_menu_right_hidden', true);
                        }
                        $(window).trigger('resize');
                    };

                    that.show_left = function(){
                        that.data._el.button_toggle_left.find('.icon').addClass('icon_rotate_180deg');
                        that.data._el.card__left.removeClass('card__left_hidden');
                        that.data._el.card__main.append(
                            that.data._el.card__backdrop.one('click', function(){
                                that.hide_left();
                                that.hide_right();
                            })
                        );
                        if (typeof setCookie == 'function') {
                            setCookie('card_menu_left_hidden', false);
                        }
                        $(window).trigger('resize');
                    };
                    that.show_right = function(){
                        that.data._el.button_toggle_right.find('.icon').addClass('icon_rotate_180deg');
                        that.data._el.card__right.removeClass('card__right_hidden');
                        that.data._el.card__main.append(
                            that.data._el.card__backdrop.one('click', function(){
                                that.hide_left();
                                that.hide_right();
                            })
                        );
                        if (typeof setCookie == 'function') {
                            setCookie('card_menu_right_hidden', false);
                        }
                        $(window).trigger('resize');
                    };

                    that.toggle_left = function(){
                        if (that.data._el.card__left.hasClass('card__left_hidden')) {
                            that.show_left();
                        } else {
                            that.hide_left();
                        }
                    };
                    that.toggle_right = function(){
                        if (that.data._el.card__right.hasClass('card__right_hidden')) {
                            that.show_right();
                        } else {
                            that.hide_right();
                        }
                    };

                    that.bind = function(){
                        if (that.data._el.button_toggle_left) {
                            if (that.data._el.button_toggle_left.length > 0) {
                                that.data._el.button_toggle_left.on('click', function(){
                                    that.toggle_left();
                                });
                            }
                        }
                        if (that.data._el.button_toggle_right) {
                            if (that.data._el.button_toggle_right.length > 0) {
                                that.data._el.button_toggle_right.on('click', function(){
                                    that.toggle_right();
                                });
                            }
                        }
                    };

                    that.init_components = function(){
                        if (that.data._el.card__backdrop.length == 0) {
                            that.data._el.card__backdrop = $('<div class="card__backdrop">');
                        }
                        if (that.data._el.button_toggle_left) {
                            if (that.data._el.button_toggle_left.length > 0) {
                                that.data._el.button_toggle_left.button();
                                if (typeof getCookie == 'function') {
                                    that.data.hiddenLeft = (getCookie('card_menu_left_hidden') == 'true' ? true : false);
                                }
                                if (that.data.hiddenLeft) {
                                    that.hide_left();
                                } else {
                                    that.show_left();
                                }
                                setTimeout(function(){
                                    that.data._el.button_toggle_left.find('.icon').addClass('icon_animate');
                                }, 500);
                            }
                        }
                        if (that.data._el.button_toggle_right) {
                            if (that.data._el.button_toggle_right.length > 0) {
                                that.data._el.button_toggle_right.button();
                                if (typeof getCookie == 'function') {
                                    that.data.hiddenRight = (getCookie('card_menu_right_hidden') == 'true' ? true : false);
                                }
                                if (that.data.hiddenRight) {
                                    that.hide_right();
                                } else {
                                    that.show_right();
                                }
                                setTimeout(function(){
                                    that.data._el.button_toggle_right.find('.icon').addClass('icon_animate');
                                }, 500);
                            }
                        }
                    };
                    that.init = function(){
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
        }
    };
    $.fn.card = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.card' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="card"]').card();
});