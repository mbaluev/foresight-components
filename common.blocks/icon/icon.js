(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'icon__menu', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.el = {
                        ham: self,
                        menu_top: self.find('.icon__menu-top'),
                        menu_middle: self.find('.icon__menu-middle'),
                        menu_bottom: self.find('.icon__menu-bottom')
                    };

                    that.init = function() {
                        that.bind();
                    };
                    that.bind = function() {
                        that.el.ham.on('toggle.icon__menu', function(e){
                            that.toggle(e);
                            e.preventDefault();
                        });
                    };
                    that.toggle = function() {
                        that.el.ham.toggleClass('icon__menu_click');
                        that.el.menu_top.toggleClass('icon__menu-top_click');
                        that.el.menu_middle.toggleClass('icon__menu-middle_click');
                        that.el.menu_bottom.toggleClass('icon__menu-bottom_click');
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