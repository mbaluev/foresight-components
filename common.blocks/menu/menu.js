(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'menu', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        expanded: false,
                        scrollToSelectedItem: false,
                        maxItemLines: null,
                        maxItemSymbols: null,
                        toggle: 'click',
                        autoclose: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.destroy = function(){
                        self.removeData();
                    };
                    that.select = function(id){
                        var $itemlink = self.find('.menu__item-link[data-id="' + id + '"]'),
                            $item = $itemlink.parent();
                        self.find('.menu__item-link').removeClass('menu__item-link_selected');
                        $itemlink.addClass('menu__item-link_selected');
                        self.animate({
                            scrollTop: $item.position().top + $item.outerHeight()/2 - self.outerHeight()/2
                        }, 200);
                    };
                    that.init = function(){
                        var $menu_item_list = self.find('.menu__item');
                        $menu_item_list.each(function(){
                            var item = $(this),
                                $itemlink = item.children('.menu__item-link'),
                                $itemlinkcontent = $itemlink.children('.menu__item-link-content'),
                                $itemtext = $itemlinkcontent.children('.menu__item-text'),
                                $icon = $itemlinkcontent.children('.menu__icon'),
                                $submenu = item.children('.menu__submenu-container');
                            if (that.data.scrollToSelectedItem) {
                                $itemlink.on('click', function(){
                                    self.animate({
                                        scrollTop: item.position().top + item.outerHeight()/2 - self.outerHeight()/2
                                    }, 200);
                                });
                            }
                            if (that.data.maxItemLines) {
                                var maxHeight = that.data.maxItemLines * parseInt($itemtext.css('line-height').replace('px',''));
                                $itemtext.css({
                                    'max-height': maxHeight
                                }).dotdotdot({
                                    watch: true,
                                    callback: function(isTruncated, orgContent){
                                        if (isTruncated) {
                                            $itemtext.data('isTrancated', isTruncated);
                                            $itemtext.attr('data-tooltip', orgContent.text());
                                        } else {
                                            if ($itemtext.data('isTrancated') == 'true') {
                                                $itemtext.removeAttr('data-tooltip');
                                            }
                                        }
                                    }
                                });
                            }
                            if (that.data.maxItemSymbols) {
                                var text = $itemtext.html();
                                if (text.length > that.data.maxItemSymbols) {
                                    $itemtext.attr('data-tooltip', text);
                                    $itemtext.html(text.substr(0, that.data.maxItemSymbols) + '...');
                                }
                            }
                            if ($submenu.length > 0) {
                                $itemlink.removeAttr('href');
                                $icon.addClass('icon_animate');
                                if (that.data.toggle == 'click') {
                                    $itemlink.on('click', function(){
                                        var collapsed = $submenu.data('collapsed');
                                        $submenu.slideToggle(500);
                                        $submenu.data('collapsed', !collapsed);
                                        $icon.toggleClass('icon_rotate_0deg');
                                        if (that.data.autoclose) {
                                            item.siblings().each(function(){
                                                var sibling = $(this),
                                                    ssubmenu = sibling.children('.menu__submenu-container'),
                                                    sicon = sibling.children('.menu__item-link').children('.menu__item-link-content').children('.menu__icon');
                                                var scollapsed = ssubmenu.data('collapsed');
                                                if (!scollapsed) {
                                                    ssubmenu.slideUp(500);
                                                    ssubmenu.data('collapsed', true);
                                                    sicon.toggleClass('icon_rotate_0deg');
                                                }
                                            });
                                        }
                                    });
                                    if (that.data.expanded) {
                                        $submenu.show();
                                        $submenu.data('collapsed', false);
                                        $icon.toggleClass('icon_rotate_0deg');
                                    } else {
                                        $submenu.data('collapsed', true);
                                    }
                                }
                                if (that.data.toggle == 'hover') {
                                    item.on('mouseover', function(){
                                        $submenu.show();
                                        $itemlink.addClass('menu__item-link_hovered');
                                        $icon.toggleClass('icon_rotate_0deg');
                                    });
                                    item.on('mouseout', function(){
                                        $submenu.hide();
                                        $itemlink.removeClass('menu__item-link_hovered');
                                        $icon.toggleClass('icon_rotate_0deg');
                                    });
                                }
                            } else {
                                $itemlink.on('click', function(){
                                    self.find('.menu__item-link').removeClass('menu__item-link_selected');
                                    $(this).addClass('menu__item-link_selected');
                                });
                            }
                        });
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
        select : function(id) {
            return this.each(function() {
                this.obj.select(id);
            });
        }
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