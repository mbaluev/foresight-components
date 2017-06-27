$(function(){
    $('[data-fc="checkbox"]').each(function(){
        var that = $(this),
            $input = that.find(".checkbox__input"),
            $label = that.find(".checkbox__label"),
            $button = that.find(".button");

        if (!$input.prop('disabled')) {

            // --> all checkboxes
            that.on('mouseover', function(){ that.addClass('checkbox_hovered'); });
            that.on('mouseout', function(){ that.removeClass('checkbox_hovered'); });
            that.on('mousedown touchstart', function(){ that.addClass('checkbox_clicked'); });
            that.on('mouseup touchend', function(){ that.removeClass('checkbox_clicked'); });

            if ($label) {
                $label.on('click', function(e){
                    e.preventDefault();
                    $input.prop('checked') ? $input.prop('checked', false) : $input.prop('checked', true);
                    $input.attr('checked') ? $input.removeAttr('checked') : $input.attr('checked', 'checked');
                })
            }
            if ($button) {
                $button.on('click', function(e){
                    e.preventDefault();
                    $input.prop('checked') ? $input.prop('checked', false) : $input.prop('checked', true);
                    $input.attr('checked') ? $input.removeAttr('checked') : $input.attr('checked', 'checked');
                })
            }

        }
    });
});