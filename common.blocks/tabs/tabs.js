(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'tab', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();

                    /* private */
                    that.neighbors = [];
                    that.el = {
                        button: self.find('[data-fc="button"]'),
                        tabs__tab: self.parent('.tabs__tab'),
                        tabs__link: self,
                        tabs__pane: $('.tabs__pane[id="' + self.attr('href').replace('#','') + '"]')
                    };

                    that.destroy = function(){
                        that.neighbors.forEach(function(el){
                            el.button.button('destroy');
                        });
                        self.data = null;
                        self.remove();
                    };
                    that.enable = function(){
                        that.el.button.button('enable');
                    };
                    that.disable = function(){
                        that.el.button.button('disable');
                    };
                    that.show = function(){
                        that.neighbors.forEach(function(el){
                            el.button.button('enable');
                            el.tabs__tab.removeClass('tabs__tab_active');
                            el.tabs__pane.removeClass('tabs__pane_active');
                            el.tabs__pane.find('[data-fc="button"]').button('disable');
                        });
                        that.el.button.button('disable');
                        that.el.tabs__tab.addClass('tabs__tab_active');
                        that.el.tabs__pane.addClass('tabs__pane_active');
                        that.el.tabs__pane.find('[data-fc="button"]').button('enable');
                    };
                    that.bind = function(){
                        that.el.tabs__link.on('click', function(e){
                            e.preventDefault();
                            if (!that.el.tabs__tab.hasClass('tabs__tab_active')) {
                                that.show();
                            }
                        });
                    };
                    that.check_active = function(){
                        if (that.el.tabs__tab.hasClass('tabs__tab_active')) {
                            that.show();
                        }
                    };
                    that.get_neighbors = function(){
                        self.closest('.tabs').find('.tabs__tab').each(function(){
                            var t = $(this);
                            var el = {
                                button: t.find('[data-fc="button"]'),
                                tabs__tab: t,
                                tabs__link: t.find('.tabs__link'),
                                tabs__pane: t.closest('.card').find('.tabs__pane[id="' + t.find('.tabs__link').attr('href').replace('#','') + '"]')
                            };
                            el.button.button();
                            that.neighbors.push(el);
                        });
                    };
                    that.init = function(){
                        that.get_neighbors();
                        that.bind();
                        that.check_active();
                    };
                    that.init();
                }
                return this;
            });
        },
        show : function() {
            return this.each(function() {
                this.obj.show();
            });
        },
        enable : function() {
            return this.each(function() {
                this.obj.enable();
            });
        },
        disable : function() {
            return this.each(function() {
                this.obj.disable();
            });
        },
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
    };
    $.fn.tabs = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.tabs' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="tab"]').tabs();
});