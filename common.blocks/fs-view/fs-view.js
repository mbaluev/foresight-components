$(function(){
    $('#button_toggle-menu').each(function(){
        var self = $(this),
            $iconmenu = self.find('.icon__menu');
            $main = $('.fs-view__main'),
            $left = $('.fs-view__left'),
            $middle = $('.fs-view__middle'),
            $backdrop = $main.find('.fs-view__backdrop'),
            onlyloaded = true;
        if ($backdrop.length == 0) {
            $backdrop = $('<div class="fs-view__backdrop"></div>');
        }
        function show_menu(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            if (!onlyloaded && !$main.hasClass('fs-view__main_transition')) {
                $main.addClass('fs-view__main_transition');
            }
            $left.removeClass('fs-view__left_hidden');
            $middle.removeClass('fs-view__middle_full');
            $left.after($backdrop);
            $backdrop.one('click', function(){
                self.trigger('click');
            });
            self.one('click', hide_menu);
            $('.fs-view__middle').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__middle').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
        }
        function hide_menu(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            if (!onlyloaded && !$main.hasClass('fs-view__main_transition')) {
                $main.addClass('fs-view__main_transition');
            }
            $left.addClass('fs-view__left_hidden');
            $middle.addClass('fs-view__middle_full');
            $backdrop.remove();
            self.one('click', show_menu);
            $('.fs-view__middle').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__middle').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
        }
        if ($left.hasClass('fs-view__left_hidden')) {
            self.one('click', show_menu);
            onlyloaded = false;
        } else {
            $left.after($backdrop);
            $backdrop.one('click', function(){
                self.trigger('click');
            });
            self.one('click', hide_menu);
            onlyloaded = false;
        }
    });
});