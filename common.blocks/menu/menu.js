(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'menu', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);

                    that.init = function() {
                        var $menu_item_list = self.find('.menu__item');
                        $menu_item_list.each(function(){
                            var item = $(this),
                                $itemlink = item.children('.menu__item-link'),
                                $itemlinkcontent = $itemlink.children('.menu__item-link-content'),
                                $icon = $itemlinkcontent.children('.menu__icon'),
                                $submenu = item.children('.menu__submenu-container');
                            if ($submenu.length > 0) {
                                $itemlink.removeAttr('href');
                                $icon.addClass('icon_animate');
                                $itemlink.on("click", function(){
                                    $submenu.slideToggle(500);
                                    $icon.toggleClass('icon_rotate_0deg');
                                });
                            }
                        });
                    };
                    that.init();
                }
                return this;
            });
        },
    };
    $.fn.menu = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.menu' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="menu"]').menu();
});