$(function(){
    $('#button_toggle-menu').each(function(){
        var self = $(this),
            $iconmenu = self.find('.icon__menu'),
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
    $('#button_toggle-menu-right').each(function(){
        var self = $(this),
            $iconmenu = self.find('.icon__menu'),
            $middle = $('.fs-view__middle'),
            $middle_right = $('.fs-view__middle-right'),
            $middle_backdrop = $middle.find('.fs-view__middle-backdrop'),
            onlyloaded = true;
        if ($middle_backdrop.length == 0) {
            $middle_backdrop = $('<div class="fs-view__middle-backdrop"></div>');
        }
        function show_menu(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            if (!onlyloaded && !$middle.hasClass('fs-view__middle_transition')) {
                $middle.addClass('fs-view__middle_transition');
            }
            $middle_right.removeClass('fs-view__middle-right_hidden');
            $middle_right.after($middle_backdrop);
            $middle_backdrop.one('click', function(){
                self.trigger('click');
            });
            self.one('click', hide_menu);
            $('.fs-view__middle-right').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__middle-right').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
        }
        function hide_menu(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            if (!onlyloaded && !$middle.hasClass('fs-view__middle_transition')) {
                $middle.addClass('fs-view__middle_transition');
            }
            $middle_right.addClass('fs-view__middle-right_hidden');
            $middle_backdrop.remove();
            self.one('click', show_menu);
            $('.fs-view__middle-right').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__middle-right').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
        }
        if ($middle_right.hasClass('fs-view__middle-right_hidden')) {
            self.one('click', show_menu);
            onlyloaded = false;
        } else {
            $middle_right.after($middle_backdrop);
            $middle_backdrop.one('click', function(){
                self.trigger('click');
            });
            self.one('click', hide_menu);
            onlyloaded = false;
        }
    });
});