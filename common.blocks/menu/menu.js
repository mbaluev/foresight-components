$(function() {
    $('[data-fc="menu"]').each(function () {
        var that = $(this),
            $menu_item_list = that.find('.menu__item');
        $menu_item_list.each(function(){
            var self = $(this),
                $itemlink = self.children('.menu__item-link'),
                $icon = $itemlink.children('.menu__icon'),
                $submenu = self.children('.menu__submenu');
            if ($submenu.length > 0) {
                var height = $submenu.outerHeight();
                $itemlink.removeAttr('href');
                $icon.addClass('icon_animate');
                $submenu.css('height', 0);
                $itemlink.one("click", open);
                function open() {
                    $submenu.css('height', height);
                    $icon.toggleClass('icon_rotate_0deg');
                    $itemlink.one("click", close);
                }
                function close() {
                    $submenu.css('height', 0);
                    $icon.toggleClass('icon_rotate_0deg');
                    $itemlink.one("click", open);
                }
            }
        });
    });
});