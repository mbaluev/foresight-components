(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_tooltip');
                if (!data) {
                    var that = this.tooltip = {};
                    that.defaults = {};
                    that.data = self.data();
                    that.options = $.extend(that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._tooltip = {
                        tooltip: $('<div class="tooltip"></div>'),
                        tooltip__text: $('<div class="tooltip__text"></div>'),
                        tooltip__arrow: $('<div class="tooltip__arrow"></div>')
                    };

                    that.destroy = function () {
                        that.data._tooltip.tooltip.remove();
                    };
                    that.hide = function () {
                        that.destroy();
                    };
                    that.show = function (e) {
                        that.render();
                        that.update(e);
                    };
                    that.update = function (e) {
                        that.data._tooltip.tooltip.addClass('tooltip_visible');
                        that.data._tooltip.tooltip__arrow.removeClass('tooltip__arrow_bottom');
                        that.data._tooltip.tooltip__arrow.addClass('tooltip__arrow_top');
                        var yOffset = 25;
                        var padding = 10;
                        var ttw = Math.ceil(that.data._tooltip.tooltip.outerWidth());
                        var tth = Math.ceil(that.data._tooltip.tooltip.outerHeight());
                        var wscrY = $(window).scrollTop();
                        var wscrX = $(window).scrollLeft();
                        var curX = (document.all) ? e.clientX + wscrX : e.pageX;
                        var curY = (document.all) ? e.clientY + wscrY : e.pageY;
                        var ttleft = curX - ttw / 2;
                        var tttop = curY - tth - yOffset;
                        if (ttleft - padding < 0) {
                            ttleft = padding;
                            if (ttleft + ttw + padding > $(window).width()) {
                                newttw = $(window).width() - padding * 2;
                            }
                        } else if (ttleft + ttw + padding > $(window).width()) {
                            ttleft = $(window).width() - padding - ttw;
                            if (ttleft - padding < 0) {
                                newttw = $(window).width() - padding * 2;
                            }
                        }
                        if (tttop < 0) {
                            tttop = curY + yOffset;
                            that.data._tooltip.tooltip__arrow.removeClass('tooltip__arrow_top');
                            that.data._tooltip.tooltip__arrow.addClass('tooltip__arrow_bottom');
                        }
                        var taleft = curX - ttleft - 5;
                        if (taleft < padding) {
                            taleft = padding;
                        }
                        if (taleft > ttw - padding * 2) {
                            taleft = ttw - padding * 2;
                        }
                        that.data._tooltip.tooltip.css({
                            top: tttop,
                            left: ttleft,
                            width: ttw
                        });
                        that.data._tooltip.tooltip__arrow.css({
                            left: taleft + 'px'
                        });
                    };
                    that.render = function () {
                        $('body').append(
                            that.data._tooltip.tooltip.append(
                                that.data._tooltip.tooltip__text.html(that.data.tooltip),
                                that.data._tooltip.tooltip__arrow
                            )
                        );
                    };
                    that.bind = function () {
                        self.on('mouseover', that.show);
                        self.on('mousemove', that.update);
                        self.on('mouseout', that.hide);
                    };
                    that.init = function () {
                        that.bind();
                    };
                    that.init();
                }
                return this;
            });
        }
    };
    $.fn.tooltip = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.tooltip' );
        }
    };
})( jQuery );

$(function(){
    $('[data-tooltip]').tooltip();
});