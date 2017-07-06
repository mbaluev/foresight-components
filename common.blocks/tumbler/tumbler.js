$.fn.bindFirst = function(name, fn) {
    this.on(name, fn);
    this.each(function() {
        var handlers = $._data(this, 'events')[name.split('.')[0]];
        var handler = handlers.pop();
        handlers.splice(0, 0, handler);
    });
};

$(function() {
    $('[data-fc="tumbler"]').each(function(){
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
        self.bindFirst('click.__private__', function(){
            self.toggleClass('tumbler_checked');
            $input.prop('checked') ? $input.prop('checked', false) : $input.prop('checked', true);
            $input.attr('checked') ? $input.removeAttr('checked') : $input.attr('checked', 'checked');
            data.checked = $input.prop('checked');
        })
    });
    $('#tumbler_edit-page').on('click', function(){
        var self = $(this), data = self.data();
        if (data.checked) {
            $('#button_add-widget').button('enable');
        } else {
            $('#button_add-widget').button('disable');
        }
    });
});