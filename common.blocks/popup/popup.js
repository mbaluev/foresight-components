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
                        height: 'auto',
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

                    that.data._inFocus = false;
                    that.data._el = {
                        source: that.data.source,
                        source_arrow: that.data.source.find('.icon_animate')
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.hide = function(){
                        self.removeClass('popup_visible_bottom');
                        that.data.visible = false;
                        that.data._inFocus = false;
                        if (typeof that.data._el.source_arrow[0] != 'undefined') {
                            that.data._el.source_arrow.removeClass('icon_rotate_180deg');
                        }
                    };
                    that.show = function(){
                        if (that.data.animation) {
                            self.addClass('popup_animation');
                        }
                        that.set_width(that.data.width);
                        that.set_position(that.data.position);
                        that.data.visible = true;
                        that.data._inFocus = false;
                        self.addClass('popup_visible_bottom');
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
                        that.data._inFocus = true;
                    };
                    that.mouseup_body = function(e){
                        if (!that.data._inFocus && !e.originalEvent.inFocus) {
                            that.hide();
                        }
                    };

                    that.set_width = function(width){
                        if (width == 'full' || width == '100%') {
                            width = that.data._el.source.outerWidth();
                        }
                        self.css({ 'width': width, 'max-width': width });
                    };
                    that.set_height = function(height){
                        self.css({ 'height': height, 'max-height': height });
                    };
                    that.set_position = function(position, i){
                        if (typeof i === 'undefined') { i = 0; }
                        if (i < 11) {
                            var dims = that.get_dimentions(that.data._el.source),
                                selfDims = that.get_dimentions(self),
                                pos = position.split(' '),
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

                            /* correct popup position relative to the window */
                            var el = that.get_offset(that.data._el.source);
                            switch (position) {
                                case 'bottom right':
                                    if (el.top + el.height + offset + selfDims.height > $(window).height() ||
                                        el.left + el.width - selfDims.width < 0) {
                                        that.set_position('left top', ++i);
                                    }
                                    break;
                                case 'left top':
                                    if (el.left - offset - selfDims.width < 0 ||
                                        el.top + selfDims.height > $(window).height()) {
                                        that.set_position('left center', ++i);
                                    }
                                    break;
                                case 'left center':
                                    if (el.left - offset - selfDims.width < 0 ||
                                        el.top + el.height/2 + selfDims.height/2 > $(window).height() ||
                                        el.top + el.height/2 - selfDims.height/2 < 0) {
                                        that.set_position('left bottom', ++i);
                                    }
                                    break;
                                case 'left bottom':
                                    if (el.left - offset - selfDims.width < 0 ||
                                        el.top + el.height - selfDims.height < 0) {
                                        that.set_position('top right', ++i);
                                    }
                                    break;
                                case 'top right':
                                    if (el.top - offset - selfDims.height < 0 ||
                                        el.left + el.width - selfDims.width < 0) {
                                        that.set_position('top left', ++i);
                                    }
                                    break;
                                case 'top left':
                                    if (el.top - offset - selfDims.height < 0 ||
                                        el.left + selfDims.width > $(window).width()) {
                                        that.set_position('right bottom', ++i);
                                    }
                                    break;
                                case 'right bottom':
                                    if (el.left + el.width + offset + selfDims.width > $(window).width() ||
                                        el.top + el.height - selfDims.height < 0) {
                                        that.set_position('right center', ++i);
                                    }
                                    break;
                                case 'right center':
                                    if (el.left + el.width + offset + selfDims.width > $(window).width() ||
                                        el.top + el.height/2 + selfDims.height/2 > $(window).height() ||
                                        el.top + el.height/2 - selfDims.height/2 < 0) {
                                        that.set_position('right top', ++i);
                                    }
                                    break;
                                case 'right top':
                                    if (el.left + el.width + offset + selfDims.width > $(window).width() ||
                                        el.top + selfDims.height > $(window).height()) {
                                        that.set_position('bottom left', ++i);
                                    }
                                    break;
                                case 'bottom left':
                                    if (el.top + el.height + offset + selfDims.height > $(window).height() ||
                                        el.left + selfDims.width > $(window).width()) {
                                        that.set_position('bottom right', ++i);
                                    }
                                    break;
                            }
                        }
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
                    that.get_offset = function($el) {
                        var offset = $el.offset();
                        return {
                            width: $el.outerWidth(),
                            height: $el.outerHeight(),
                            left: offset.left,
                            top: offset.top
                        }
                    };

                    that.bind = function(){
                        that.data._el.source.on('click.popup.toggle', function(e){
                            e.preventDefault();
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
                        if (that.data.select) {
                            self.addClass('popup_select ');
                        }
                        if (that.data.visible) {
                            that.show();
                        } else {
                            that.hide();
                        }
                        that.set_width(that.data.width);
                        that.set_height(that.data.height);
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
        },
        set_width : function(value) {
            return this.each(function() {
                this.obj.set_width(value);
            });
        },
        set_height : function(value) {
            return this.each(function() {
                this.obj.set_height(value);
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