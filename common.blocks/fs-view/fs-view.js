$(function(){
    $('[data-toggle="menu-left"]').each(function(){
        var self = $(this),
            $iconmenu = self.find('.icon__menu'),
            $main = $('.fs-view__main'),
            $left = $('.fs-view__left'),
            $middle = $('.fs-view__middle');
        if (!$left.hasClass('fs-view__left_hidden') && $main.find('.fs-view__backdrop').length == 0) {
            $('<div class="fs-view__backdrop"></div>').one('click', click).appendTo($main);
        }
        function show(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            $left.removeClass('fs-view__left_hidden');
            $middle.removeClass('fs-view__middle_full');
            if ($main.find('.fs-view__backdrop').length == 0) {
                $('<div class="fs-view__backdrop"></div>').one('click', click).appendTo($main);
            }
            $('.fs-view__main').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__main').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize.fs');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('menu_hidden', false);
            }
        }
        function hide(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            $left.addClass('fs-view__left_hidden');
            $middle.addClass('fs-view__middle_full');
            $main.find('.fs-view__backdrop').remove();
            $('.fs-view__main').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__main').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize.fs');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('menu_hidden', true);
            }
        }
        function click(){
            if ($left.hasClass('fs-view__left_hidden')) {
                show();
            } else {
                hide();
            }
        }
        if (typeof getCookie == 'function') {
            if (getCookie('menu_hidden') == 'true') {
                hide();
            } else {
                show();
            }
        }
        setTimeout(function(){
            $main.addClass('fs-view__main_transition');
        }, 100);
        self.on('click', click);
    });
    $('[data-toggle="menu-right"]').each(function(){
        var self = $(this),
            $iconmenu = self.find('.icon__menu'),
            $middle = $('.fs-view__middle'),
            $middle_right = $('.fs-view__middle-right');
        if (!$middle_right.hasClass('fs-view__middle-right_hidden') && $middle.find('.fs-view__middle-backdrop').length == 0) {
            $('<div class="fs-view__middle-backdrop"></div>').one('click', click).appendTo($middle);
        }
        function show(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            $middle_right.removeClass('fs-view__middle-right_hidden');
            if ($middle.find('.fs-view__middle-backdrop').length == 0) {
                $('<div class="fs-view__middle-backdrop"></div>').one('click', click).appendTo($middle);
            }
            $('.fs-view__middle-right').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__middle-right').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize.fs');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('menu_right_hidden', false);
            }
        }
        function hide(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            $middle_right.addClass('fs-view__middle-right_hidden');
            $middle.find('.fs-view__middle-backdrop').remove();
            $('.fs-view__middle-right').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__middle-right').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize.fs');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('menu_right_hidden', true);
            }
        }
        function click(){
            if ($middle_right.hasClass('fs-view__middle-right_hidden')) {
                show();
            } else {
                hide();
            }
        }
        if (typeof getCookie == 'function') {
            if (getCookie('menu_right_hidden') == 'true') {
                hide();
            } else {
                show();
            }
        }
        setTimeout(function(){
            $middle.addClass('fs-view__middle_transition');
        }, 100);
        self.on('click', click);
    });
    $('[data-toggle="header"]').each(function(){
        var self = $(this),
            $icon = self.find('.icon'),
            $header = $('.fs-view__header');
        function show(){
            $icon.removeClass('icon_rotate_180deg');
            $header.removeClass('fs-view__header_hidden');
            $header.css('margin-top', '');
            $('.fs-view__header').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__header').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize.fs');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('header_hidden', false);
            }
        }
        function hide(){
            $icon.addClass('icon_rotate_180deg');
            $header.addClass('fs-view__header_hidden');
            $header.css('margin-top', -$header.outerHeight());
            $('.fs-view__header').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__header').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize.fs');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('header_hidden', true);
            }
        }
        function click(){
            if ($header.hasClass('fs-view__header_hidden')) {
                show();
            } else {
                hide();
            }
        }
        if (typeof getCookie == 'function') {
            if (getCookie('header_hidden') == 'true') {
                hide();
            } else {
                show();
            }
        }
        setTimeout(function(){
            $('.fs-view').addClass('fs-view_transition');
            $icon.addClass('icon_animate');
        }, 100);
        self.on('click', click);
    });
});