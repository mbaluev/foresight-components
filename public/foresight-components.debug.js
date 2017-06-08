$(function(){
    $('[data-fc="checkbox"]').each(function(){
        var that = $(this),
            $input = that.find(".checkbox__input"),
            $label = that.find(".checkbox__label");
        if (!$input.prop('disabled')) {
            $label.on('click', function(e){
                e.preventDefault();
                $input.prop('checked') ? $input.prop('checked', false) : $input.prop('checked', true);
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
                    $('.radio_input[name="' + name + '"]').prop('cheched', false);
                    $input.prop('checked', true);
                }
            })
        }
    });
});