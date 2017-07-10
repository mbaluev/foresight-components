(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'radio_group', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.radio_list = self.find('.radio');
                    that.has_checked = false;

                    that.destroy = function(){
                        that.radio_list.each(function(){
                            $(this).radio('destroy');
                        });
                        self.data = null;
                        self.remove();
                    };
                    that.init = function(){
                        that.radio_list.each(function(){
                            var radio = {};
                            radio.self = $(this);
                            radio.data = radio.self.data();
                            radio.self.radio();
                            if (radio.data.checked && that.has_checked) { radio.self.radio('uncheck'); }
                            if (radio.data.checked) { that.has_checked = true; }
                            radio.self.on('click.radio_group', null, null, function(e){
                                that.radio_list.each(function(){
                                    $(this).radio('uncheck');
                                });
                                radio.self.radio('check');
                            });
                        });
                    };
                    that.enable = function(){
                        that.radio_list.each(function(){
                            $(this).radio('enable');
                        });
                    };
                    that.disable = function(){
                        that.radio_list.each(function(){
                            $(this).radio('disable');
                        });
                    };
                    that.hide = function(){
                        that.radio_list.each(function(){
                            $(this).radio('hide');
                        });
                    };
                    that.show = function(){
                        that.radio_list.each(function(){
                            $(this).radio('show');
                        });
                    };
                    that.value = function(){
                        var value;
                        that.radio_list.each(function(){
                            if ($(this).radio('checked')) {
                                value = $(this).radio('value');
                            }
                        });
                        return value;
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
        },
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
        value : function() {
            if (this.length == 1) {
                return this[0].obj.value();
            } else {
                var value_arr = [];
                this.each(function() {
                    value_arr.push(this.obj.value());
                });
                return value_arr;
            }
        }
    };
    $.fn.radio_group = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.radio_group' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="radio-group"]').radio_group();
});