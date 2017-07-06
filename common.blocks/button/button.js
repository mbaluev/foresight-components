(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this),
                    data = self.data('fc-button');
                if (!data) {
                    self.data('fc-button', { target : self });
                    var defaults = {};
                    var that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.check = function(){
                        self.addClass('button_checked');
                    };
                    that.uncheck = function(){
                        self.removeClass('button_checked');
                    };
                    that.click = function(){
                        self.addClass('button_clicked');
                        self.removeClass('button_clicked_out');
                    };
                    that.unclick = function(){
                        self.addClass('button_clicked_out');
                        self.removeClass('button_clicked');
                    };
                    that.hover = function(){
                        self.addClass('button_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('button_hovered');
                    };
                    that.enable = function(){
                        self.removeClass('button_disabled');
                        self.on('mouseover.button', that.hover);
                        self.on('mouseout.button', that.unhover);
                        self.on('mousedown.button touchstart.button', function(){
                            that.click();
                            $('body').one('mouseup.button touchend.button', that.unclick);
                        });
                        if (self.hasClass('button_toggable_check')) {
                            self.on('click.button', function(e){
                                e.preventDefault();
                                if (self.attr("data-checked") == "true") {
                                    $(this).removeClass('button_checked');
                                    self.attr('data-checked', 'false');
                                } else {
                                    $(this).addClass('button_checked');
                                    self.attr('data-checked', 'true');
                                }
                            });
                        }
                        if (self.hasClass('button_toggable_radio')) {
                            self.on('click.button', function(e){
                                e.preventDefault();
                                if (self.attr("data-checked") != "true") {
                                    $(this).addClass('button_checked');
                                    self.attr('data-checked', 'true');
                                }
                            });
                        }
                        //bind trigger items
                        if (that.data.toggle == "trigger" && that.data.trigger) {
                            self.on('click.button', function(e){
                                e.preventDefault();
                                self.find('.' + that.data.container).trigger(that.data.trigger);
                            });
                        }
                        //bind disabled handlers
                        if (that.data.handlers) {
                            for (var type in that.data.handlers) {
                                that.data.handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                    };
                    that.disable = function(){
                        self.addClass('button_disabled');
                        self.off('.button');
                        if ($._data(self[0], "events")) {
                            that.data.handlers = {};
                            for (var type in $._data(self[0], "events")) {
                                that.data.handlers[type] = $._data(self[0], "events")[type].slice(0);
                            }
                            self.off();
                        }
                    };
                    that.init = function(){
                        if (self.hasClass('button_toggable_check') || self.hasClass('button_toggable_radio')) {
                            if (that.data.checked) {
                                that.check();
                            } else {
                                that.uncheck();
                            }
                        }
                        if (that.data.disabled) {
                            that.disable();
                        } else {
                            that.enable();
                        }
                    };
                    that.init();
                }
                return this;
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
        }
    };
    $.fn.button = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.button' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="button"]').button();
    /*
    $('[data-fc="button_"]').each(function() {
        var that = $(this),
            data = that.data();
        if (that.hasClass('button_toggable_check') || that.hasClass('button_toggable_radio')) {
            if (data.checked) {
                that.addClass('button_checked');
            } else {
                that.removeClass('button_checked');
            }
        }
        if (data.disabled) {
            that.addClass('button_disabled');
        } else {
            that.removeClass('button_disabled');

            that.on('mouseover', function(){ that.addClass('button_hovered'); });
            that.on('mouseout', function(){ that.removeClass('button_hovered'); });
            that.on('mousedown touchstart', function(){
                that.addClass('button_clicked');
                that.removeClass('button_clicked_out');
                $('body').one('mouseup touchend', function(){
                    that.addClass('button_clicked_out');
                    that.removeClass('button_clicked');
                });
            });
            //that.on('focusin', function(){ that.addClass('button_focused'); });
            //that.on('focusout', function(){ that.removeClass('button_focused'); });
            if (that.hasClass('button_toggable_check')) {
                that.on('click', function(e){
                    e.preventDefault();
                    if (that.attr("data-checked") == "true") {
                        $(this).removeClass('button_checked');
                        that.attr('data-checked', 'false');
                    } else {
                        $(this).addClass('button_checked');
                        that.attr('data-checked', 'true');
                    }
                });
            }
            if (that.hasClass('button_toggable_radio')) {
                that.on('click', function(e){
                    e.preventDefault();
                    if (that.attr("data-checked") != "true") {
                        $(this).addClass('button_checked');
                        that.attr('data-checked', 'true');
                    }
                });
            }
            //bind trigger items
            if (data.toggle == "trigger" && data.trigger) {
                that.on('click', function(e){
                    e.preventDefault();
                    that.find('.'+data.container).trigger(data.trigger);
                });
            }
        }
    });
    */
});