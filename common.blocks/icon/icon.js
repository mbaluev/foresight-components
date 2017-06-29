$(function() {
    $('[data-fc="icon__menu"]').each(function () {
        var that = $(this);

        var menu = {
            el : {
                ham: that,
                menu_top: that.find('.icon__menu-top'),
                menu_middle: that.find('.icon__menu-middle'),
                menu_bottom: that.find('.icon__menu-bottom')
            },
            init: function() {
                var self = this;
                self.bindUIactions();
            },
            bindUIactions: function() {
                var self = this;
                self.el.ham.on('toggle', function(e){
                    debugger;
                    self.activateMenu(e);
                    e.preventDefault();
                });
            },
            activateMenu: function() {
                debugger;
                var self = this;
                self.el.ham.toggleClass('icon__menu_click');
                self.el.menu_top.toggleClass('icon__menu-top_click');
                self.el.menu_middle.toggleClass('icon__menu-middle_click');
                self.el.menu_bottom.toggleClass('icon__menu-bottom_click');
            }
        };

        menu.init();
    });
});
