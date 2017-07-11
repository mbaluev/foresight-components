(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.button_collapse = self.find('.button_collapse');

                    that.destroy = function(){
                        if (typeof that.button_collapse[0] != "undefined") {
                            that.button_collapse.button('destroy');
                        }
                        that.disable();
                        self.data = null;
                        self.remove();
                    };
                    that.hide = function(){
                        self.addClass('widget_collapsed');
                    };
                    that.show = function(){
                        self.removeClass('widget_collapsed');
                    };
                    that.toggle = function(){
                        self.toggleClass('widget_collapsed');
                    };
                    that.bind = function(){
                        that.button_collapse.on('click', function(){
                            that.toggle();
                        });
                    };
                    that.init = function(){
                        that.bind();
                        that.button_collapse.button();
                    };
                    that.init();
                }
                return this;
            });
        },
        hide : function() {
            return this.each(function() {
                this.obj.hide();
            });
        },
        show : function() {
            return this.each(function() {
                this.obj.show();
            });
        },
        toggle : function() {
            return this.each(function() {
                this.obj.toggle();
            });
        },
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
    };
    $.fn.widget = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.widget' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="widget"]').widget();
});