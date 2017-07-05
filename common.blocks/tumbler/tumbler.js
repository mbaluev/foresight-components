$(function() {
    $('[data-fc="tumbler"]').each(function () {
        var self = $(this),
            $button = self.find('button'),
            $input = self.find('input'),
            data = self.data();
        if (data.checked) {
            self.addClass('tumbler_checked');
            $input.attr('checked', 'checked');
            $input.prop('checked', true);
        } else {
            self.removeClass('tumbler_checked');
            $input.removeAttr('checked');
            $input.prop('checked', false);
        }
        $button.on('click', function(){
            self.toggleClass('tumbler_checked');
            $input.prop('checked') ? $input.prop('checked', false) : $input.prop('checked', true);
            $input.attr('checked') ? $input.removeAttr('checked') : $input.attr('checked', 'checked');
        })
    });
});