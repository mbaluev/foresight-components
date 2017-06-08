$(function(){
    $('[data-fc="radio-group"]').each(function(){
        var that = $(this),
            $radio_list = that.find('.radio'),
            $input_list = that.find('.radio__input');
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
    });
});