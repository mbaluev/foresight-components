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