(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'radio_group', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        checked: false,
                        hidden: false,
                        value: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        radio_list: self.find('.radio')
                    };

                    that.destroy = function(){
                        that.data._el.radio_list.each(function(){
                            $(this).radio('destroy');
                        });
                        self.data = null;
                        self.remove();
                    };
                    that.disable = function(){
                        that.data._el.radio_list.each(function(){
                            $(this).radio('disable');
                        });
                        that.data.disabled = true;
                    };
                    that.enable = function(){
                        that.data._el.radio_list.each(function(){
                            $(this).radio('enable');
                        });
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        that.data._el.radio_list.each(function(){
                            $(this).radio('hide');
                        });
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        that.data._el.radio_list.each(function(){
                            $(this).radio('show');
                        });
                        that.data.hidden = false;
                    };

                    that.init = function(){
                        that.data.disabled = true;
                        that.data._el.radio_list.each(function(){
                            var radio = {};
                            radio.self = $(this);
                            radio.data = radio.self.data();
                            radio.self.radio();
                            if (radio.data.checked && that.data.checked) { radio.self.radio('uncheck'); }
                            if (radio.data.checked) {
                                that.data.checked = true;
                                that.data.value = radio.self.radio('value');
                            }
                            if (!radio.data.disabled) { that.data.disabled = false; }
                            radio.self.on('click.radio_group', null, null, function(e){
                                that.data._el.radio_list.each(function(){
                                    $(this).radio('uncheck');
                                });
                                radio.self.radio('check');
                                that.data.checked = true;
                                that.data.value = radio.self.radio('value');
                            });
                            if (radio.data.disabled) { radio.self.radio('disable'); }
                        });
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
        checked : function() {
            if (this.length == 1) {
                var _checked = false;
                this.each(function() {
                    _checked = this.obj.data.checked;
                });
                return _checked;
            } else {
                var checked_arr = [];
                this.each(function() {
                    checked_arr.push(this.obj.data.checked);
                });
                return checked_arr;
            }
        },
        value : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = this.obj.data.value;
                });
                return _val;
            } else {
                var value_arr = [];
                this.each(function() {
                    value_arr.push(this.obj.data.value);
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