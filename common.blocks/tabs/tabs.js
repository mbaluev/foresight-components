(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'tab', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        active: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    /* private */
                    that.data._neighbors = [];
                    that.data._el = {
                        button: self.find('[data-fc="button"]'),
                        tabs__tab: self.closest('.tabs__tab'),
                        tabs__link: self,
                        tabs__pane: self.closest('.card').find('.tabs__pane[id="' + self.attr('href').replace('#','') + '"]')
                    };

                    that.destroy = function(){
                        that.data._neighbors.forEach(function(el){
                            el.button.button('destroy');
                        });
                        self.data = null;
                        self.remove();
                    };
                    that.disable = function(){
                        that.data._el.button.button('disable');
                        that.data.disabled = true;
                    };
                    that.enable = function(){
                        that.el.button.button('enable');
                        that.data.disabled = false;
                    };
                    that.show = function(){
                        that.data._neighbors.forEach(function(tab){
                            tab.data()._el.button.button('enable');
                            tab.data()._el.tabs__tab.removeClass('tabs__tab_active');
                            tab.data()._el.tabs__pane.removeClass('tabs__pane_active');
                            tab.data().active = false;
                            tab.data().disabled = false;
                        });
                        that.data._el.button.button('disable');
                        that.data._el.tabs__tab.addClass('tabs__tab_active');
                        that.data._el.tabs__pane.addClass('tabs__pane_active');
                        that.data.active = true;
                        that.data.disabled = true;
                    };

                    that.check_active = function(){
                        if (that.data._el.tabs__tab.hasClass('tabs__tab_active')) {
                            that.show();
                        }
                    };
                    that.get_neighbors = function(){
                        self.closest('.tabs').find('[data-fc="tab"]').each(function(){
                            var tab = $(this).tabs();
                            that.data._neighbors.push(tab);
                        });
                    };

                    that.set_text = function(value){
                        that.data._el.button.button('set_text', value);
                    };

                    that.bind = function(){
                        that.data._el.tabs__link.on('click', function(e){
                            e.preventDefault();
                            if (!that.data._el.tabs__tab.hasClass('tabs__tab_active')) {
                                that.show();
                            }
                        });
                    };

                    that.init_components = function(){
                        that.data._el.button.button();
                    };
                    that.init = function(){
                        that.init_components();
                        that.get_neighbors();
                        that.bind();
                        that.check_active();
                    };
                    that.init();
                }
                return this;
            });
        },
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
        disable : function() {
            return this.each(function() {
                this.obj.disable();
            });
        },
        enable : function() {
            return this.each(function() {
                this.obj.enable();
            });
        },
        show : function() {
            return this.each(function() {
                this.obj.show();
            });
        },
        set_text : function(value) {
            return this.each(function() {
                this.obj.set_text(value);
            });
        }
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