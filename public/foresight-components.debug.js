$(function(){
    $('[data-fc="button"]').each(function() {
        var that = $(this);
        if (!that.prop('disabled')) {
            // --> all buttons
            that.on('mouseover', function(){ that.addClass('button_hovered'); });
            that.on('mouseout', function(){ that.removeClass('button_hovered'); });
            that.on('mousedown', function(){ that.addClass('button_clicked'); });
            that.on('mouseup', function(){ that.removeClass('button_clicked'); });
            //that.on('focusin', function(){ that.addClass('button_focused'); });
            //that.on('focusout', function(){ that.removeClass('button_focused'); });

            // --> button_toggable_check
            if (that.hasClass('button_toggable_check')) {
                if (that.attr('aria-checked', 'true') || that.hasClass('button_checked')) {
                    that.attr('aria-checked', 'true');
                    that.addClass('button_checked');
                }
                that.on('click', function(e){
                    e.preventDefault();
                    if (that.hasClass('button_checked')) {
                        $(this).removeClass('button_checked')
                        that.attr('aria-checked', 'false');
                    } else {
                        $(this).addClass('button_checked');
                        that.attr('aria-checked', 'true');
                    }
                });
            }
        } else {
            that.addClass('button_disabled');
        }
    });
});
$(function(){
    $('[data-fc="checkbox"]').each(function(){
        var that = $(this),
            $input = that.find(".checkbox__input"),
            $label = that.find(".checkbox__label");
        if (!$input.prop('disabled')) {
            $label.on('click', function(e){
                e.preventDefault();
                $input.prop('checked') ? $input.prop('checked', false) : $input.prop('checked', true);
                $input.attr('checked') ? $input.removeAttr('checked') : $input.attr('checked', 'checked');
            })
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