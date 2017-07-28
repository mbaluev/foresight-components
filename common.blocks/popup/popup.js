(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'popup', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        source: null,
                        width: 'full',
                        position: 'bottom left',
                        animation: true,
                        visible: false,
                        offset: 10,
                        select: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        source: that.data.source,
                        source_arrow: that.data.source.find('.icon_svg_down')
                    };

                    that.destroy = function(){
                        self.data = null;
                        self.remove();
                    };

                    that.hide = function(){
                        self.removeClass('popup_visible_bottom');
                        that.data.visible = false;
                        if (typeof that.data._el.source_arrow[0] != 'undefined') {
                            that.data._el.source_arrow.removeClass('icon_rotate_180deg');
                        }
                    };
                    that.show = function(){
                        self.addClass('popup_visible_bottom');
                        that.data.visible = true;
                        if (typeof that.data._el.source_arrow[0] != 'undefined') {
                            that.data._el.source_arrow.addClass('icon_rotate_180deg');
                        }
                    };
                    that.toggle = function(){
                        if (that.data.visible) {
                            that.hide();
                        } else {
                            that.show();
                        }
                    };
                    that.mouseup_self = function(e){
                        e.originalEvent.inFocus = true;
                    };
                    that.mouseup_source = function(e){
                        e.originalEvent.inFocus = true;
                    };
                    that.mouseup_body = function(e){
                        if (!e.originalEvent.inFocus) {
                            that.hide();
                        };
                    };

                    that.set_width = function(){
                        if (that.data.width == 'full') {
                            that.data.width = that.data._el.source.outerWidth();
                        };
                        self.css('width', that.data.width);
                    };
                    that.set_position = function(){
                        var dims = that.get_dimentions(that.data._el.source),
                            selfDims = that.get_dimentions(self),
                            pos = that.data.position.split(' '),
                            top, left,
                            offset = that.data.offset,
                            main = pos[0],
                            secondary = pos[1];
                        switch (main) {
                            case 'top':
                                top = dims.top - selfDims.height - offset;
                                break;
                            case 'right':
                                left = dims.left + dims.width + offset;
                                break;
                            case 'bottom':
                                top = dims.top + dims.height + offset;
                                break;
                            case 'left':
                                left = dims.left - selfDims.width - offset;
                                break;
                        }
                        switch(secondary) {
                            case 'top':
                                top = dims.top;
                                break;
                            case 'right':
                                left = dims.left + dims.width - selfDims.width;
                                break;
                            case 'bottom':
                                top = dims.top + dims.height - selfDims.height;
                                break;
                            case 'left':
                                left = dims.left;
                                break;
                            case 'center':
                                if (/left|right/.test(main)) {
                                    top = dims.top + dims.height/2 - selfDims.height/2;
                                } else {
                                    left = dims.left + dims.width/2 - selfDims.width/2;
                                }
                        }
                        self.css({ left: left, top: top });
                    };

                    that.get_dimentions = function($el) {
                        var position = $el.position();
                        return {
                            width: $el.outerWidth(),
                            height: $el.outerHeight(),
                            left: position.left,
                            top: position.top
                        }
                    };

                    that.bind = function(){
                        that.data._el.source.on('click.popup.toggle', function(e){
                            e.preventDefault();
                            that.set_position();
                            that.toggle();
                        });
                        that.data._el.source.on('mouseup.popup.source touchend.popup.source', that.mouseup_source);
                        self.on('mouseup.popup.self touchend.popup.self', that.mouseup_self);
                        $('body').on('mouseup.popup.body touchend.popup.body', that.mouseup_body);
                    };

                    that.init_components = function(){
                        if (typeof that.data._el.source_arrow[0] != 'undefined') {
                            that.data._el.source_arrow.addClass('icon_animate');
                        }
                    };

                    that.init = function(){
                        that.init_components();
                        that.bind();
                        if (that.data.animation) {
                            self.addClass('popup_animation');
                        }
                        if (that.data.select) {
                            self.addClass('popup_select ');
                        }
                        if (that.data.visible) {
                            that.set_position();
                            that.show();
                        } else {
                            that.hide();
                        }
                        that.set_width();
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
        hide : function() {
            return this.each(function() {
                this.obj.hide();
            });
        },
        show : function() {
            return this.each(function() {
                this.obj.show();
            });
        }
    };
    $.fn.popup = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.popup' );
        }
    };
})( jQuery );