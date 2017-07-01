$(function(){
    $('.scrollbar').each(function() {
        if (typeof($(this).scrollbar) == "function"){
            $(this).addClass('scrollbar-macosx').scrollbar();
        }
    });
});