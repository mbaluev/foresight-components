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