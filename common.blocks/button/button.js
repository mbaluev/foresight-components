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
            that.on('mouseup touchend', function(){ that.removeClass('button_clicked'); });
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