$(function(){
    $('[data-fc="button"]').each(function() {
        var that = $(this),
            data = that.data();

        if (that.hasClass('button_toggable_check')) {
            if (data.checked) {
                that.addClass('button_checked');
            }
        }

        if (data.disabled) {
            that.addClass('button_disabled');
        } else {
            that.on('mouseover', function(){ that.addClass('button_hovered'); });
            that.on('mouseout', function(){ that.removeClass('button_hovered'); });
            that.on('mousedown touchstart', function(){ that.addClass('button_clicked'); });
            $('body').on('mouseup touchend', function(){ that.removeClass('button_clicked'); });
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
        }

        if (data.disabled) {
            that.addClass('checkbox_disabled');
            $button.addClass('button_disabled');
            $button.attr('data-disabled','true');
            $input.attr('disabled', 'disabled');
            $input.prop('disabled', true);
        } else {
            that.on('mouseover', function () { that.addClass('checkbox_hovered'); });
            that.on('mouseout', function () { that.removeClass('checkbox_hovered'); });
            that.on('mousedown touchstart', function () { that.addClass('checkbox_clicked'); });
            $('body').on('mouseup touchend', function () { that.removeClass('checkbox_clicked'); });
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
            name = $input.attr("name");
        if (!$input.prop('disabled')) {
            $label.on('click', function(e){
                e.preventDefault();
                if (!$input.prop('checked')) {
                    $input.prop('checked', true);
                    $input.attr('checked', 'checked')
                }
            })
        }
    });
});
$(function(){
    $('[data-fc="radio-group"]').each(function(){
        var that = $(this),
            $radio_list = that.find('.radio'),
            $input_list = that.find('.radio__input');
        if (that.attr("disabled")) {
            $input_list.each(function(){
                $(this).attr('disabled', 'disabled');
            })
        } else {
            $radio_list.each(function(){
                var radio = $(this),
                    $input = radio.find(".radio__input"),
                    $label = radio.find(".radio__label"),
                    name = $input.attr("name");
                if (!$input.prop('disabled')) {
                    $label.on('click', function(e){
                        e.preventDefault();
                        $input_list.each(function(){
                            if ($(this) != $input) {
                                $(this).prop('checked', false);
                                $(this).removeAttr('checked');
                            }
                        })
                        if (!$input.prop('checked')) {
                            $input.prop('checked', true);
                            $input.attr('checked', 'checked')
                        }
                    })
                }
            });
        }
    });
});