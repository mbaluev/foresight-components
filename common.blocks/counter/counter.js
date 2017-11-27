(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'counter', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        date: null,
                        showyears: false,
                        countdown: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.countdown = function(){
                        that.data.countdown = self.countdown({
                            date: that.data.date,
                            showYears: that.data.showyears,
                            render: function(date){
                                var thisObj = this, $years;
                                $(this.el).empty().append(
                                    (that.data.showyears ?
                                        [
                                            $('<span class="alertbox-group"></span>').append(
                                                that.split(date.years.toString(), 1).map(function(d){
                                                    return $([
                                                        '<span class="alertbox">',
                                                        '<span class="alertbox__text">' + d + '</span>',
                                                        '</span>'
                                                    ].join(''));
                                                })
                                            ),
                                            $([
                                                '<span class="alertbox alertbox_border_none">',
                                                '<span class="alertbox__text">:</span>',
                                                '</span>'
                                            ].join(''))
                                        ]
                                        : null
                                    ),
                                    $('<span class="alertbox-group"></span>').append(
                                        that.split(date.days.toString(), 1).map(function(d){
                                            return $([
                                                '<span class="alertbox">',
                                                '<span class="alertbox__text">' + d + '</span>',
                                                '</span>'
                                            ].join(''));
                                        })
                                    ),
                                    $([
                                        '<span class="alertbox alertbox_border_none">',
                                        '<span class="alertbox__text">:</span>',
                                        '</span>'
                                    ].join('')),
                                    $('<span class="alertbox-group"></span>').append(
                                        that.split(thisObj.leadingZeros(date.hours, 2), 1).map(function(d){
                                            return $([
                                                '<span class="alertbox">',
                                                '<span class="alertbox__text">' + d + '</span>',
                                                '</span>'
                                            ].join(''));
                                        })
                                    ),
                                    $([
                                        '<span class="alertbox alertbox_border_none">',
                                        '<span class="alertbox__text">:</span>',
                                        '</span>'
                                    ].join('')),
                                    $('<span class="alertbox-group"></span>').append(
                                        that.split(thisObj.leadingZeros(date.min, 2), 1).map(function(d){
                                            return $([
                                                '<span class="alertbox">',
                                                '<span class="alertbox__text">' + d + '</span>',
                                                '</span>'
                                            ].join(''));
                                        })
                                    ),
                                    $([
                                        '<span class="alertbox alertbox_border_none">',
                                        '<span class="alertbox__text">:</span>',
                                        '</span>'
                                    ].join('')),
                                    $('<span class="alertbox-group"></span>').append(
                                        that.split(thisObj.leadingZeros(date.sec, 2), 1).map(function(d){
                                            return $([
                                                '<span class="alertbox">',
                                                '<span class="alertbox__text">' + d + '</span>',
                                                '</span>'
                                            ].join(''));
                                        })
                                    )
                                );
                            }
                        });
                    };
                    that.split = function(str, length){
                        return str.match(new RegExp('.{1,' + length + '}', 'g'));
                    };

                    that.init_components = function(){};
                    that.init = function(){
                        that.countdown();
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
    $.fn.counter = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.counter' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="counter"]').counter();
});