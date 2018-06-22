(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'calendar', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        validate: true
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);
                    that.data._el = {
                        button_submit: null,
                        inputs: [],
                        select: []
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.get = function(){
                        that.data._el.button_submit = self.find('button[type="submit"]');
                        that.data._el.inputs = self.find('[data-fc="input"]');
                        that.data._el.selects = self.find('[data-fc="select"]');
                    };
                    that.validate = function(){
                        that.data.validate = true;
                        that.data._el.inputs.each(function(){
                            if (!$(this).input('validate')) {
                                that.data.validate = false;
                            }
                        });
                        return that.data.validate;
                    };
                    that.bind = function(){
                        that.data._el.inputs.each(function(){
                            var $input = $(this);
                            if ($input.data().required) {
                                $input.data()._el.input.on('blur', function(){
                                    $input.input('validate');
                                })
                            }
                        });
                        that.data._el.button_submit.on('click', function(e){
                            if (!that.validate()) {
                                e.preventDefault();
                            }
                        });
                    };

                    that.init_components = function(){
                        self.find('[data-fc="input"]').input();
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="tooltip"]').tooltip();
                        self.find('[data-fc="textarea"]').textarea();
                        self.find('[data-fc="checkbox"]').checkbox();
                        self.find('[data-fc="tumbler"]').tumbler();
                    };
                    that.init = function(){
                        that.get();
                        that.init_components();
                        that.bind();
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
        validate : function() {
            if (this.length == 1) {
                var _val = true;
                this.each(function() {
                    _val = this.obj.validate();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push(this.obj.validate());
                });
                return _arr;
            }
        }
    };
    $.fn.form = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.form' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="form"]').form();
});