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