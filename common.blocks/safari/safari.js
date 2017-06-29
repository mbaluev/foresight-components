$(function(){
    $('[data-fc="safari"]').each(function () {
        var that = $(this);
        write_width();
        $(window).resize(write_width);
        function get_width(){
            return that.find('.safari__content').width();
        };
        function write_width(){
            that.find('.safari__width-counter').text(get_width() + ' px');
        };
    });
});