$(function() {
    $('[data-fc="button"]').each(function () {
        write_width();
        $(window).resize(write_width);
        function get_width(){
            return $('.safari__content').width();
        };
        function write_width(){
            $('.safari__width-counter').text(get_width() + ' px');
        };
    });
});
