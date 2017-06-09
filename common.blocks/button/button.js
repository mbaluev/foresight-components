$(function(){
    $('[data-fc="button"]').each(function() {
        var that = $(this);
        if (!that.prop('disabled')) {
            that.on('mouseover', function(){ that.addClass('button_hovered'); });
            that.on('mouseout', function(){ that.removeClass('button_hovered'); });
            that.on('focusin', function(){ that.addClass('button_focused'); });
            that.on('focusout', function(){ that.removeClass('button_focused'); });
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