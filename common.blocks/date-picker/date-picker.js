(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'date_picker', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        position: 'bottom left'
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._datepicker = null;

                    that.destroy = function(){
                        that.data._datepicker.destroy();
                        self.data = null;
                        self.remove();
                    };
                    that.hide = function(){
                        if (that.data._datepicker.visible)
                            that.data._datepicker.hide();
                    };
                    that.show = function(){
                        if (!that.data._datepicker.visible)
                            that.data._datepicker.show();
                    };

                    that.init = function(){
                        self.datepicker(that.data);
                        that.data._datepicker = that.data.datepicker;
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
        hide: function() {
            return this.each(function() {
                this.obj.hide();
            });
        },
        show: function() {
            return this.each(function() {
                this.obj.show();
            });
        }
    };
    $.fn.date_picker = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.date_picker' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="date-picker"]').date_picker();
});