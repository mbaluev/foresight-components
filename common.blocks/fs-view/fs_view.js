$(function(){
    $('[data-action="toggleLeft"]').each(function () {
        var self = $(this),
            data = self.data(),
            $main = $('.' + data.main),
            $left = $('.' + data.left),
            $middle = $('.' + data.middle),
            $backdrop = $('<div class="fs-view__backdrop"></div>'),
            onlyloaded = true;
        function show_menu(){
            if (!onlyloaded && !$main.hasClass('fs-view__main_transition'))
                $main.addClass('fs-view__main_transition');

            $left.removeClass('fs-view__left_hidden');
            $middle.removeClass('fs-view__middle_full');

            $left.after($backdrop);
            $backdrop.one('click', hide_menu_backdrop);
            self.one('click', hide_menu);
        }
        function hide_menu(){
            if (!onlyloaded && !$main.hasClass('fs-view__main_transition'))
                $main.addClass('fs-view__main_transition');

            $left.addClass('fs-view__left_hidden');
            $middle.addClass('fs-view__middle_full');

            $backdrop.remove();
            self.one('click', show_menu);
        }
        function hide_menu_backdrop(){
            self.trigger('click');
        }
        if ($(window).outerWidth() > 768) {
            show_menu();
            self.one('click', hide_menu);
            onlyloaded = false;
        } else {
            self.one('click', show_menu);
            onlyloaded = false;
        }
    });
});