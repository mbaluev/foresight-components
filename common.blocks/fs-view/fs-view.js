$(function(){
    $('.fs-view__middle-scroll').on('scroll', function(){
        $('[data-fc="date-picker"]').date_picker('hide');
    })
    $('#button_toggle-menu').each(function(){
        var self = $(this),
            $iconmenu = self.find('.icon__menu');
            $main = $('.fs-view__main'),
            $left = $('.fs-view__left'),
            $middle = $('.fs-view__middle'),
            $backdrop = $('<div class="fs-view__backdrop"></div>'),
            onlyloaded = true;
        function show_menu(){
            $iconmenu.icon__menu('toggle');
            if (!onlyloaded && !$main.hasClass('fs-view__main_transition')) {
                $main.addClass('fs-view__main_transition');
            }
            $left.removeClass('fs-view__left_hidden');
            $middle.removeClass('fs-view__middle_full');
            $left.after($backdrop);
            $backdrop.on('click', hide_menu_backdrop);
            self.one('click', hide_menu);
        }
        function hide_menu(){
            $iconmenu.icon__menu('toggle');
            if (!onlyloaded && !$main.hasClass('fs-view__main_transition')) {
                $main.addClass('fs-view__main_transition');
            }
            $left.addClass('fs-view__left_hidden');
            $middle.addClass('fs-view__middle_full');
            $backdrop.remove();
            self.one('click', show_menu);
        }
        function hide_menu_backdrop(){
            self.trigger('click');
        }
        if ($(window).outerWidth() > 768) {
            self.one('click', show_menu);
            onlyloaded = false;
        } else {
            self.one('click', show_menu);
            onlyloaded = false;
        }
    });
});