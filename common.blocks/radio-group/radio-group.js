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