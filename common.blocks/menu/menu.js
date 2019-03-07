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
                        autoclose: false,
                        duration: 500
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
                                $submenu = item.children('.menu__submenu-container'),
                                $submenutarget = $submenu.clone();
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
                                if (that.data.target) {
                                    $submenu.addClass('menu__submenu-container_source');
                                    $submenutarget.addClass('menu__submenu-container_target').appendTo($(that.data.target));
                                }
                                item.data('submenu', $submenu);
                                item.data('submenutarget', $submenutarget);
                                if (that.data.toggle == 'click') {
                                    $itemlink.on('click', function(){
                                        var collapsed = item.data('collapsed');
                                        $submenu.slideToggle(that.data.duration);
                                        $submenutarget.slideToggle(that.data.duration);
                                        item.data('collapsed', !collapsed);
                                        if (collapsed) {
                                            $icon.addClass('icon_rotate_0deg');
                                            $(this).addClass('menu__item-link_selected');
                                            $(that.data.target).addClass('_has_target');
                                        } else {
                                            $icon.removeClass('icon_rotate_0deg');
                                            $(this).removeClass('menu__item-link_selected');
                                            $(that.data.target).removeClass('_has_target');
                                        }
                                        item.siblings().each(function(){
                                            var sibling = $(this),
                                                ssubmenu = sibling.data('submenu'),
                                                ssubmenutarget = sibling.data('submenutarget'),
                                                sitemlink = sibling.children('.menu__item-link'),
                                                sicon = sibling.children('.menu__item-link').children('.menu__item-link-content').children('.menu__icon');
                                            sitemlink.removeClass('menu__item-link_selected');
                                            if (that.data.autoclose && ssubmenu) {
                                                var scollapsed = sibling.data('collapsed');
                                                if (!scollapsed) {
                                                    ssubmenu.slideUp(that.data.duration);
                                                    ssubmenutarget.slideUp(that.data.duration);
                                                    sibling.data('collapsed', true);
                                                    sicon.toggleClass('icon_rotate_0deg');
                                                }
                                            }
                                        });
                                    });
                                    if (that.data.expanded) {
                                        $submenu.show();
                                        $submenutarget.show();
                                        item.data('collapsed', false);
                                        $icon.toggleClass('icon_rotate_0deg');
                                    } else {
                                        if (item.data('collapsed') == false ||
                                            item.data('collapsed') == 'false') {
                                            $submenu.show();
                                            $submenutarget.show();
                                            $icon.toggleClass('icon_rotate_0deg');
                                            $itemlink.addClass('menu__item-link_selected');
                                        } else {
                                            item.data('collapsed', true);
                                        }
                                    }
                                }
                                if (that.data.toggle == 'hover') {
                                    item.on('mouseover', function(){
                                        $submenu.show();
                                        $submenutarget.show();
                                        $itemlink.addClass('menu__item-link_hovered');
                                        $icon.toggleClass('icon_rotate_0deg');
                                    });
                                    item.on('mouseout', function(){
                                        $submenu.hide();
                                        $submenutarget.hide();
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
