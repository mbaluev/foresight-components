(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this),
                    data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'tumbler', target : self });
                    var defaults = {};
                    var that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.button = self.find('button');
                    that.input = self.find('input');
                    that.check = function(){
                        self.addClass('tumbler_checked');
                        that.input.attr('checked', 'checked');
                        that.input.prop('checked', true);
                        that.data.checked = true;
                    };
                    that.uncheck = function(){
                        self.removeClass('tumbler_checked');
                        that.input.removeAttr('checked');
                        that.input.prop('checked', false);
                        that.data.checked = false;
                    };
                    that.enable = function(){
                        self.removeClass('tumbler_disabled');
                        self.bindFirst('click.tumbler', null, null, function(){
                            self.toggleClass('tumbler_checked');
                            that.input.prop('checked') ? that.input.prop('checked', false) : that.input.prop('checked', true);
                            that.input.attr('checked') ? that.input.removeAttr('checked') : that.input.attr('checked', 'checked');
                            that.data.checked = that.input.prop('checked');
                        })
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //enable button
                        that.button.button('enable');
                    };
                    that.disable = function(){
                        self.addClass('tumbler_disabled');
                        self.off('.tumbler');
                        //save and unbind handlers
                        if ($._data(self[0], "events")) {
                            that.data._handlers = {};
                            for (var type in $._data(self[0], "events")) {
                                that.data._handlers[type] = $._data(self[0], "events")[type].slice(0);
                            }
                            self.off();
                        }
                        //enable button
                        that.button.button('disable');
                    };
                    that.hide = function(){
                        that.disable();
                        self.addClass('tumbler_hidden');
                    };
                    that.show = function(){
                        that.enable();
                        self.removeClass('tumbler_hidden');
                    };
                    that.init = function(){
                        if (that.data.checked) {
                            that.check();
                        } else {
                            that.uncheck();
                        }
                        if (that.data.hidden) {
                            that.hide();
                        } else if (that.data.disabled) {
                            that.disable();
                        } else {
                            that.show();
                        }
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
    $.fn.tumbler = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.tumbler' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="tumbler"]').tumbler();
    $('#tumbler_edit-page').on('click', function(){
        var self = $(this), data = self.data();
        if (data.checked) {
            $('#button_add-widget').button('enable');
        } else {
            $('#button_add-widget').button('disable');
        }
    });
});
