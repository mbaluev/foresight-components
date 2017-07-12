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
                    that.data.buttons = {
                        button_collapse: self.find('.button_collapse'),
                        button_settings: self.find('.button_settings'),
                        button_remove: self.find('.button_remove')
                    };

                    that.destroy = function(){
                        if (typeof that.data.buttons.button_collapse[0] != "undefined") {
                            that.data.buttons.button_collapse.button('destroy');
                        }
                        if (typeof that.data.buttons.button_settings[0] != "undefined") {
                            that.data.buttons.button_settings.button('destroy');
                        }
                        if (typeof that.data.buttons.button_remove[0] != "undefined") {
                            that.data.buttons.button_remove.button('destroy');
                        }
                        that.disable();
                        self.data = null;
                        self.remove();
                    };
                    that.collapse = function(){
                        self.addClass('widget_collapsed');
                    };
                    that.expand = function(){
                        self.removeClass('widget_collapsed');
                    };
                    that.toggle = function(){
                        self.toggleClass('widget_collapsed');
                    };
                    that.bind = function(){
                        that.data.buttons.button_collapse.on('click.widget', function(){
                            that.toggle();
                        });
                    };
                    that.editMode = function(){
                        that.data.buttons.button_collapse.button('disable');
                        that.data.buttons.button_settings.button('show').button('enable');
                        that.data.buttons.button_remove.button('show').button('enable');
                    };
                    that.viewMode = function(){
                        that.data.buttons.button_collapse.button('enable');
                        that.data.buttons.button_settings.button('hide').button('disable');
                        that.data.buttons.button_remove.button('hide').button('disable');
                    };
                    that.init = function(){
                        that.bind();
                        that.data.buttons.button_collapse.button();
                        that.data.buttons.button_settings.button();
                        that.data.buttons.button_remove.button();
                    };
                    that.init();
                }
                return this;
            });
        },
        collapse : function() {
            return this.each(function() {
                this.obj.collapse();
            });
        },
        expand : function() {
            return this.each(function() {
                this.obj.expand();
            });
        },
        toggle : function() {
            return this.each(function() {
                this.obj.toggle();
            });
        },
        editMode : function() {
            return this.each(function() {
                this.obj.editMode();
            });
        },
        viewMode : function() {
            return this.each(function() {
                this.obj.viewMode();
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