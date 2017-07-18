(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'checkbox', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.input = self.find('.checkbox__input');
                    that.label = self.find('.checkbox__label');
                    that.button = self.find('button');

                    that.destroy = function(){
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('destroy');
                        }
                        self.data = null;
                        self.remove();
                    };
                    that.hover = function(){
                        self.addClass('checkbox_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('checkbox_hovered');
                    };
                    that.click = function(){
                        self.addClass('checkbox_clicked');
                    };
                    that.unclick = function(){
                        self.removeClass('checkbox_clicked');
                    };
                    that.check = function(){
                        self.addClass('checkbox_checked');
                        self.attr('data-checked','true');
                        that.input.attr('checked', 'checked');
                        that.input.prop('checked', true);
                        that.data.checked = true;
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('check');
                        }
                    };
                    that.uncheck = function(){
                        self.removeClass('checkbox_checked');
                        self.removeAttr('data-checked');
                        that.input.removeAttr('checked');
                        that.input.prop('checked', false);
                        that.data.checked = false;
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('uncheck');
                        }
                    };
                    that.enable = function(){
                        self.removeClass('checkbox_disabled');
                        self.removeAttr('data-disabled');
                        that.input.removeAttr('disabled');
                        that.input.prop('disabled', false);
                        that.data.disabled = false;
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('enable');
                        }
                    };
                    that.disable = function(){
                        self.addClass('checkbox_disabled');
                        self.attr('data-disabled','true');
                        that.input.attr('disabled', 'disabled');
                        that.input.prop('disabled', true);
                        that.data.disabled = true;
                        //save handlers and unbind events
                        if ($._data(self[0], "events")) {
                            that.data._handlers = {};
                            for (var type in $._data(self[0], "events")) {
                                that.data._handlers[type] = $._data(self[0], "events")[type].slice(0);
                            }
                            self.off();
                        }
                        //button enable
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('disable');
                        }
                    };
                    that.hide = function(){
                        self.addClass('checkbox_hidden');
                    };
                    that.show = function(){
                        self.removeClass('checkbox_hidden');
                    };
                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.checkbox', that.hover);
                        self.on('mouseout.checkbox', that.unhover);
                        self.on('mousedown.checkbox touchstart.checkbox', function(){
                            that.click();
                            $('body').one('mouseup.checkbox touchend.checkbox', that.unclick);
                        });
                        if (typeof that.label[0] != "undefined") {
                            that.data['_widget']['type'] = 'checkbox.label';
                            self.bindFirst('click.checkbox', '.checkbox__label', null, function (e) {
                                e.preventDefault();
                                that.data.checked ? that.uncheck() : that.check();
                            })
                        }
                        if (typeof that.button[0] != "undefined") {
                            that.data['_widget']['type'] = 'checkbox.button';
                            self.bindFirst('click.checkbox', 'button', null, function (e) {
                                e.preventDefault();
                                that.data.checked ? that.uncheck() : that.check();
                            })
                        }
                    };
                    that.init_components = function(){
                        if (typeof that.button[0] != "undefined") {
                            that.button.button();
                        }
                    };
                    that.init = function(){
                        that.data.name = that.input.attr('name');
                        that.init_components();
                        that.bind();
                        if (that.data.checked) {
                            that.check();
                        } else {
                            that.uncheck();
                        }
                        if (that.data.disabled) {
                            that.disable();
                        } else {
                            that.enable();
                        }
                        if (that.data.hidden) {
                            that.hide();
                        } else {
                            that.show();
                        }
                    };
                    that.init();
                }
                return this;
            });
        },
        check : function() {
            return this.each(function() {
                this.obj.check();
            });
        },
        uncheck : function() {
            return this.each(function() {
                this.obj.uncheck();
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
        checked : function() {
            if (this.length == 1) {
                return this[0].obj.data.checked;
            } else {
                var checked_arr = [];
                this.each(function() {
                    checked_arr.push(this.obj.data.checked);
                });
                return checked_arr;
            }
        },
        value : function() {
            return this.checkbox('checked');
        }
    };
    $.fn.checkbox = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.checkbox' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="checkbox"]').checkbox();
});