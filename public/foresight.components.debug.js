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
            /*
            show_menu();
            self.one('click', hide_menu);
            */
            self.one('click', show_menu);
            onlyloaded = false;
        } else {
            self.one('click', show_menu);
            onlyloaded = false;
        }
    });
});
$(function(){
    $('[data-fc="button"]').each(function() {
        var that = $(this),
            data = that.data();
        if (that.hasClass('button_toggable_check') || that.hasClass('button_toggable_radio')) {
            if (data.checked) {
                that.addClass('button_checked');
            } else {
                that.removeClass('button_checked');
            }
        }
        if (data.disabled) {
            that.addClass('button_disabled');
        } else {
            that.removeClass('button_disabled');

            that.on('mouseover', function(){ that.addClass('button_hovered'); });
            that.on('mouseout', function(){ that.removeClass('button_hovered'); });
            that.on('mousedown touchstart', function(){
                that.addClass('button_clicked');
                that.removeClass('button_clicked_out');
                $('body').one('mouseup touchend', function(){
                    that.addClass('button_clicked_out');
                    that.removeClass('button_clicked');
                });
            });
            //that.on('focusin', function(){ that.addClass('button_focused'); });
            //that.on('focusout', function(){ that.removeClass('button_focused'); });
            if (that.hasClass('button_toggable_check')) {
                that.on('click', function(e){
                    e.preventDefault();
                    if (that.attr("data-checked") == "true") {
                        $(this).removeClass('button_checked');
                        that.attr('data-checked', 'false');
                    } else {
                        $(this).addClass('button_checked');
                        that.attr('data-checked', 'true');
                    }
                });
            }
            if (that.hasClass('button_toggable_radio')) {
                that.on('click', function(e){
                    e.preventDefault();
                    if (that.attr("data-checked") != "true") {
                        $(this).addClass('button_checked');
                        that.attr('data-checked', 'true');
                    }
                });
            }

            //bind trigger items
            if (data.toggle == "trigger" && data.trigger) {
                that.on('click', function(e){
                    e.preventDefault();
                    that.find('.'+data.container).trigger(data.trigger);
                });
            }
        }
    });
});
$(function(){
    $('[data-fc="icon__menu"]').each(function () {
        var that = $(this);

        var menu = {
            el : {
                ham: that,
                menu_top: that.find('.icon__menu-top'),
                menu_middle: that.find('.icon__menu-middle'),
                menu_bottom: that.find('.icon__menu-bottom')
            },
            init: function() {
                var self = this;
                self.bindUIactions();
            },
            bindUIactions: function() {
                var self = this;
                self.el.ham.on('toggle', function(e){
                    self.activateMenu(e);
                    e.preventDefault();
                });
            },
            activateMenu: function() {
                var self = this;
                self.el.ham.toggleClass('icon__menu_click');
                self.el.menu_top.toggleClass('icon__menu-top_click');
                self.el.menu_middle.toggleClass('icon__menu-middle_click');
                self.el.menu_bottom.toggleClass('icon__menu-bottom_click');
            }
        };

        menu.init();
    });
});
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
$(function(){
    $('.scrollbar').each(function() {
        if (typeof($(this).scrollbar) == "function"){
            $(this).addClass('scrollbar-macosx').scrollbar();
        }
    });
});
$(function(){
    $('[data-fc="checkbox"]').each(function(){
        var that = $(this),
            $input = that.find(".checkbox__input"),
            $label = that.find(".checkbox__label"),
            $button = that.find(".button"),
            data = that.data();

        if (data.checked) {
            that.addClass('checkbox_checked');
            $button.addClass('button_checked');
            $button.attr('data-checked','true');
            $input.attr('checked', 'checked');
            $input.prop('checked', true);
        } else {
            that.removeClass('checkbox_checked');
            that.removeAttr('data-checked');
            $button.removeClass('button_checked');
            $button.removeAttr('data-checked');
            $input.removeAttr('checked');
            $input.prop('checked', false);
        }

        if (data.disabled) {
            that.addClass('checkbox_disabled');
            $button.addClass('button_disabled');
            $button.attr('data-disabled','true');
            $input.attr('disabled', 'disabled');
            $input.prop('disabled', true);
        } else {
            that.removeClass('checkbox_disabled');
            that.removeAttr('data-disabled');
            $button.removeClass('button_disabled');
            $button.removeAttr('data-disabled');
            $input.removeAttr('disabled');
            $input.prop('disabled', false);

            that.on('mouseover', function () { that.addClass('checkbox_hovered'); });
            that.on('mouseout', function () { that.removeClass('checkbox_hovered'); });
            that.on('mousedown touchstart', function () {
                that.addClass('checkbox_clicked');
                $('body').one('mouseup touchend', function () {
                    that.removeClass('checkbox_clicked');
                });
            });
            if ($label) {
                $label.on('click', function (e) {
                    e.preventDefault();
                    $input.prop('checked') ? $input.prop('checked', false) : $input.prop('checked', true);
                    $input.attr('checked') ? $input.removeAttr('checked') : $input.attr('checked', 'checked');
                })
            }
            if ($button) {
                $button.on('click', function (e) {
                    e.preventDefault();
                    $input.prop('checked') ? $input.prop('checked', false) : $input.prop('checked', true);
                    $input.attr('checked') ? $input.removeAttr('checked') : $input.attr('checked', 'checked');
                })
            }
        }
    });
});
$(function(){
    $('[data-fc="radio"]').each(function(){
        var that = $(this),
            $input = that.find(".radio__input"),
            $label = that.find(".radio__label"),
            $button = that.find(".button"),
            data = that.data();

        if (data.checked) {
            that.addClass('radio_checked');
            $button.addClass('button_checked');
            $button.attr('data-checked','true');
            $input.attr('checked', 'checked');
            $input.prop('checked', true);
        } else {
            that.removeClass('radio_checked');
            that.removeAttr('data-checked');
            $button.removeClass('button_checked');
            $button.removeAttr('data-checked');
            $input.removeAttr('checked');
            $input.prop('checked', false);
        }

        if (data.disabled) {
            that.addClass('radio_disabled');
            $button.addClass('button_disabled');
            $button.attr('data-disabled','true');
            $input.attr('disabled', 'disabled');
            $input.prop('disabled', true);
        } else {
            that.removeClass('radio_disabled');
            that.removeAttr('data-disabled');
            $button.removeClass('button_disabled');
            $button.removeAttr('data-disabled');
            $input.removeAttr('disabled');
            $input.prop('disabled', false);

            that.on('mouseover', function () { that.addClass('radio_hovered'); });
            that.on('mouseout', function () { that.removeClass('radio_hovered'); });
            that.on('mousedown touchstart', function () {
                that.addClass('radio_clicked');
                $('body').one('mouseup touchend', function () {
                    that.removeClass('radio_clicked');
                });
            });
            if ($label) {
                $label.on('click', function (e) {
                    e.preventDefault();
                    if (!$input.prop('checked')) {
                        $input.prop('checked', true);
                        $input.attr('checked', 'checked')
                    }
                })
            }
            if ($button) {
                $button.on('click', function (e) {
                    e.preventDefault();
                    if (!$input.prop('checked')) {
                        $input.prop('checked', true);
                        $input.attr('checked', 'checked')
                    }
                })
            }
        }
    });
});
$(function(){
    $('[data-fc="radio-group"]').each(function(){
        var that = $(this),
            $radio_list = that.find('.radio'),
            $button_list = that.find('.button'),
            $input_list = that.find('.radio__input'),
            data_rg = that.data(),
            has_checked = false;

        $radio_list.each(function(){
            var $radio = $(this),
                $input = $radio.find(".radio__input"),
                $label = $radio.find(".radio__label"),
                $button = $radio.find(".button"),
                name = $input.attr("name"),
                data = $radio.data();

            if (data.checked && has_checked) {
                $input.prop('checked', false);
                $input.removeAttr('checked');
                $button.removeClass('button_checked');
                $button.removeAttr('data-checked');
                $radio.removeClass('radio_checked');
                $radio.removeAttr('data-checked');
            }
            if (data.checked) { has_checked = true; }

            if (!data.disabled) {
                if ($label) {
                    $label.on('click', function(e){
                        e.preventDefault();
                        $input_list.each(function(){
                            if ($(this) != $input) {
                                $(this).prop('checked', false);
                                $(this).removeAttr('checked');
                            }
                        })
                        $input.prop('checked', true);
                        $input.attr('checked', 'checked');
                    })
                }
                if ($button) {
                    $button.on('click', function(e){
                        e.preventDefault();
                        $input_list.each(function(){
                            if ($(this) != $input) {
                                $(this).prop('checked', false);
                                $(this).removeAttr('checked');
                            }
                        })
                        $input.prop('checked', true);
                        $input.attr('checked', 'checked');
                        $button_list.each(function(){
                            if ($(this) != $button) {
                                $(this).removeClass('button_checked');
                            }
                        })
                        $button.addClass('button_checked');
                        $radio_list.each(function(){
                            if ($(this) != $radio) {
                                $(this).removeClass('radio_checked');
                            }
                        })
                        $button.addClass('radio_checked');
                    })
                }
            }
        });
    });
});