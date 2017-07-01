$(function(){
    $('[data-fc="menu"]').each(function () {
        var that = $(this),
            $menu_item_list = that.find('.menu__item');
        $menu_item_list.each(function(){
            var self = $(this),
                $itemlink = self.children('.menu__item-link'),
                $itemlinkcontent = $itemlink.children('.menu__item-link-content'),
                $icon = $itemlinkcontent.children('.menu__icon'),
                $submenu = self.children('.menu__submenu-container');

            if ($submenu.length > 0) {
                $itemlink.removeAttr('href');
                $icon.addClass('icon_animate');
                $itemlink.on("click", function(){
                    $submenu.slideToggle(500);
                    $icon.toggleClass('icon_rotate_0deg');
                });
            }
        });
    });
});