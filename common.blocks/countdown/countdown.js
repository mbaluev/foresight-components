(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'countdown', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        date: null,
                        render: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.init_components = function(){};
                    that.init = function(){
                        console.log(that.data.date);
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
        }
    };
    $.fn.countdown = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.countdown' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="countdown"]').countdown();
});