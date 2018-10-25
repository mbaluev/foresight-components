$(function(){
    $('[data-toggle="menu-left"]').each(function(){
        var self = $(this),
            $iconmenu = self.find('.icon__menu'),
            $main = $('.fs-view__main'),
            $left = $('.fs-view__left'),
            $middle = $('.fs-view__middle');
        if (!$left.hasClass('fs-view__left_hidden') && $main.find('.fs-view__backdrop').length == 0) {
            $('<div class="fs-view__backdrop"></div>').one('click', click).appendTo($main);
        }
        function show(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            $left.removeClass('fs-view__left_hidden');
            $middle.removeClass('fs-view__middle_full');
            if ($main.find('.fs-view__backdrop').length == 0) {
                $('<div class="fs-view__backdrop"></div>').one('click', click).appendTo($main);
            }
            $('.fs-view__main').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__main').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('menu_hidden', false);
            }
        }
        function hide(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            $left.addClass('fs-view__left_hidden');
            $middle.addClass('fs-view__middle_full');
            $main.find('.fs-view__backdrop').remove();
            $('.fs-view__main').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__main').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('menu_hidden', true);
            }
        }
        function click(){
            if ($left.hasClass('fs-view__left_hidden')) {
                show();
            } else {
                hide();
            }
        }
        if (typeof getCookie == 'function') {
            if (getCookie('menu_hidden') == 'true') {
                hide();
            } else {
                show();
            }
        }
        setTimeout(function(){
            $main.addClass('fs-view__main_transition');
        }, 100);
        self.on('click', click);
    });
    $('[data-toggle="menu-right"]').each(function(){
        var self = $(this),
            $iconmenu = self.find('.icon__menu'),
            $middle = $('.fs-view__middle'),
            $middle_right = $('.fs-view__middle-right');
        if (!$middle_right.hasClass('fs-view__middle-right_hidden') && $middle.find('.fs-view__middle-backdrop').length == 0) {
            $('<div class="fs-view__middle-backdrop"></div>').one('click', click).appendTo($middle);
        }
        function show(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            $middle_right.removeClass('fs-view__middle-right_hidden');
            if ($middle.find('.fs-view__middle-backdrop').length == 0) {
                $('<div class="fs-view__middle-backdrop"></div>').one('click', click).appendTo($middle);
            }
            $('.fs-view__middle-right').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__middle-right').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('menu_right_hidden', false);
            }
        }
        function hide(){
            if ($iconmenu.length > 0) {
                $iconmenu.icon__menu('toggle');
            }
            $middle_right.addClass('fs-view__middle-right_hidden');
            $middle.find('.fs-view__middle-backdrop').remove();
            $('.fs-view__middle-right').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__middle-right').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('menu_right_hidden', true);
            }
        }
        function click(){
            if ($middle_right.hasClass('fs-view__middle-right_hidden')) {
                show();
            } else {
                hide();
            }
        }
        if (typeof getCookie == 'function') {
            if (getCookie('menu_right_hidden') == 'true') {
                hide();
            } else {
                show();
            }
        }
        setTimeout(function(){
            $middle.addClass('fs-view__middle_transition');
        }, 100);
        self.on('click', click);
    });
    $('[data-toggle="header"]').each(function(){
        var self = $(this),
            $icon = self.find('.icon'),
            $header = $('.fs-view__header');
        function show(){
            $icon.removeClass('icon_rotate_180deg');
            $header.removeClass('fs-view__header_hidden');
            $header.css('margin-top', '');
            $('.fs-view__header').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__header').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('header_hidden', false);
            }
        }
        function hide(){
            $icon.addClass('icon_rotate_180deg');
            $header.addClass('fs-view__header_hidden');
            $header.css('margin-top', -$header.outerHeight());
            $('.fs-view__header').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                $('.fs-view__header').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                setTimeout(function(){
                    $(window).trigger('resize');
                }, 100);
            });
            if (typeof setCookie == 'function') {
                setCookie('header_hidden', true);
            }
        }
        function click(){
            if ($header.hasClass('fs-view__header_hidden')) {
                show();
            } else {
                hide();
            }
        }
        if (typeof getCookie == 'function') {
            if (getCookie('header_hidden') == 'true') {
                hide();
            } else {
                show();
            }
        }
        setTimeout(function(){
            $('.fs-view').addClass('fs-view_transition');
            $icon.addClass('icon_animate');
        }, 100);
        self.on('click', click);
    });
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'button', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        checked: false,
                        hidden: false,
                        width: 'auto',
                        popup_animation: true,
                        datePickerOptions: {
                            data: [],
                            autoClose: true,
                            onSelect: function(formattedDate, date, inst){},
                            position: 'bottom right',
                            instance: null
                        }
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        popup: $('<div class="popup"></div>')
                    };

                    that.destroy = function(){
                        if (that.data._el.popup.data('_widget')) {
                            that.data._el.popup.popup('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.removeClass('button_hovered');
                        self.removeClass('button_clicked_out');
                        self.addClass('button_disabled');
                        //save handlers and unbind events
                        if ($._data(self[0], "events")) {
                            that.data._handlers = {};
                            for (var type in $._data(self[0], "events")) {
                                that.data._handlers[type] = $._data(self[0], "events")[type].slice(0);
                            }
                            self.off();
                        }
                        that.data.disabled = true;
                    };
                    that.enable = function(){
                        self.removeClass('button_clicked_out');
                        self.removeClass('button_disabled');
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + (ev.namespace? '.' + ev.namespace : ''), ev.handler);
                                });
                            }
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        self.removeClass('button_clicked_out');
                        self.addClass('button_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('button_clicked_out');
                        self.removeClass('button_hidden');
                        that.data.hidden = false;
                    };

                    that.check = function(){
                        self.addClass('button_checked');
                        //self.attr('data-checked', 'true');
                        self[0].setAttribute('data-checked', 'true');
                        that.data.checked = true;
                    };
                    that.uncheck = function(){
                        self.removeClass('button_checked');
                        //self.attr('data-checked', 'false');
                        self[0].setAttribute('data-checked', 'false');
                        that.data.checked = false;
                    };

                    that.hover = function(){
                        self.addClass('button_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('button_hovered');
                    };
                    that.click = function(){
                        self.addClass('button_clicked');
                        self.removeClass('button_clicked_out');
                        $('body').one('mouseup.button.private touchend.button.private', that.unclick);
                    };
                    that.unclick = function(){
                        self.addClass('button_clicked_out');
                        self.removeClass('button_clicked');
                    };

                    that.set_width = function(value){
                        self.css('width', value);
                    };
                    that.set_text = function(value){
                        self.find('.button__text').text(value);
                    };

                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.button.private', that.hover);
                        self.on('mouseout.button.private', that.unhover);
                        self.on('mousedown.button.private touchstart.button.private', that.click);
                        //bind trigger events
                        if (that.data.trigger) {
                            self.on('click.button.trigger', function(e){
                                e.preventDefault();
                                self.find('.' + that.data.triggercontainer).trigger(that.data.trigger);
                            });
                        }
                    };
                    that.bind_checkbox = function(){
                        self.bindFirst('click.button.check', null, null, function(e){
                            e.preventDefault();
                            if (that.data.checked) {
                                that.uncheck();
                            } else {
                                that.check();
                            }
                        });
                    };
                    that.bind_radio = function(){
                        self.bindFirst('click.button.radio', null, null, function(e){
                            e.preventDefault();
                            if (!that.data.checked) {
                                that.check();
                            }
                        });
                    };

                    that.init_components = function(){
                        if (that.data.toggle == 'popup') {
                            that.data._el.popup = $(that.data.target);
                            that.data._el.popup.popup({
                                source: self,
                                animation: that.data.popup_animation
                            });
                        }

                        if (that.data.toggle == 'datepicker') {
                            self.after(that.data._el.popup);
                            that.data._el.popup.popup({
                                source: self,
                                position: that.data.datePickerOptions.position,
                                width: 'auto',
                                animation: that.data.popup_animation
                            });
                            self.datepicker({
                                inline: true,
                                autoClose: that.data.datePickerOptions.autoClose,
                                onRenderCell: function (date, cellType) {
                                    if (date) {
                                        var currentDate = date.getDate(),
                                            items = that.data.datePickerOptions.data.filter(function(it){
                                                return Asyst.date.format(date) == it.date;
                                            });
                                        if (cellType == 'day') {
                                            if (items.length > 0) {
                                                return {
                                                    html: [
                                                        '<div class="datepicker__day">' + currentDate,
                                                        '<div class="datepicker__note">' + items.length,
                                                        '</div>',
                                                        '</div>'
                                                    ].join('')
                                                }
                                            } else {
                                                return {
                                                    html: '<div class="datepicker__day">' + currentDate + '</div>'
                                                }
                                            }
                                        }
                                    }
                                },
                                onSelect: function(formattedDate, date, inst){
                                    that.data._el.popup.popup('hide');
                                    that.data.datePickerOptions.onSelect(formattedDate, date, inst);
                                }
                            });
                            that.data.datePickerOptions.instance = self.data().datepicker;
                            that.data.datePickerOptions.instance.$datepicker.parent().appendTo(that.data._el.popup);
                        }
                    };
                    that.init = function() {
                        that.set_width(that.data.width);
                        that.init_components();
                        that.bind();
                        if (self.hasClass('button_toggable_check')) {
                            that.data['_widget']['type'] = 'button.checkbox';
                            that.init_check();
                            that.bind_checkbox();
                        }
                        if (self.hasClass('button_toggable_radio')) {
                            that.data['_widget']['type'] = 'button.radio';
                            that.init_check();
                            that.bind_radio();
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
                        that.set_width(that.data.width);
                    };
                    that.init_check = function(){
                        if (that.data.checked) {
                            that.check();
                        } else {
                            that.uncheck();
                        }
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
        unhover : function() {
            return this.each(function() {
                this.obj.unhover();
            });
        },
        hover : function() {
            return this.each(function() {
                this.obj.hover();
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
        set_text : function(value) {
            return this.each(function() {
                this.obj.set_text(value);
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
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'icon__menu', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        clicked: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        ham: self,
                        menu_top: self.find('.icon__menu-top'),
                        menu_middle: self.find('.icon__menu-middle'),
                        menu_bottom: self.find('.icon__menu-bottom')
                    };

                    that.toggle = function() {
                        that.data._el.ham.toggleClass('icon__menu_click');
                        that.data._el.menu_top.toggleClass('icon__menu-top_click');
                        that.data._el.menu_middle.toggleClass('icon__menu-middle_click');
                        that.data._el.menu_bottom.toggleClass('icon__menu-bottom_click');
                    };
                    that.bind = function() {
                        that.data._el.ham.on('toggle.icon__menu', function(e){
                            that.toggle(e);
                            e.preventDefault();
                        });
                    };
                    that.init = function() {
                        that.bind();
                        if (that.data.clicked) {
                            that.toggle();
                        }
                    };
                    that.init();
                }
                return this;
            });
        },
        toggle : function() {
            return this.each(function() {
                this.obj.toggle();
            });
        },
    };
    $.fn.icon__menu = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.icon__menu' );
        }
    };
})( jQuery );

$(function(){
    $('[data-fc="icon__menu"]').icon__menu();
});
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
                        place: 'source', // [source, body]
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
                        var position;
                        if (that.data.place == 'source') {
                            position = $el.position();
                        }
                        if (that.data.place == 'body') {
                            position = $el.offset();
                        }
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
                    that.init_resize = function(){
                        if (that.data.place == 'body') {
                            $(window).on('resize', function(){
                                if (that.data.visible) {
                                    that.set_position(that.data.position);
                                }
                            });
                            $(document).on('mousewheel', function(){
                                if (that.data.visible) {
                                    that.set_position(that.data.position);
                                }
                            });
                        }
                    };
                    that.init = function(){
                        that.init_components();
                        that.init_resize();
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
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'menu', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        expanded: false,
                        scrollToSelectedItem: false,
                        maxItemLines: null,
                        maxItemSymbols: null,
                        toggle: 'click',
                        autoclose: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.destroy = function(){
                        self.removeData();
                    };
                    that.select = function(id){
                        var $itemlink = self.find('.menu__item-link[data-id="' + id + '"]'),
                            $item = $itemlink.parent();
                        self.find('.menu__item-link').removeClass('menu__item-link_selected');
                        $itemlink.addClass('menu__item-link_selected');
                        self.animate({
                            scrollTop: $item.position().top + $item.outerHeight()/2 - self.outerHeight()/2
                        }, 200);
                    };
                    that.init = function(){
                        var $menu_item_list = self.find('.menu__item');
                        $menu_item_list.each(function(){
                            var item = $(this),
                                $itemlink = item.children('.menu__item-link'),
                                $itemlinkcontent = $itemlink.children('.menu__item-link-content'),
                                $itemtext = $itemlinkcontent.children('.menu__item-text'),
                                $icon = $itemlinkcontent.children('.menu__icon'),
                                $submenu = item.children('.menu__submenu-container');
                            if (that.data.scrollToSelectedItem) {
                                $itemlink.on('click', function(){
                                    self.animate({
                                        scrollTop: item.position().top + item.outerHeight()/2 - self.outerHeight()/2
                                    }, 200);
                                });
                            }
                            if (that.data.maxItemLines) {
                                var maxHeight = that.data.maxItemLines * parseInt($itemtext.css('line-height').replace('px',''));
                                $itemtext.css({
                                    'max-height': maxHeight
                                }).dotdotdot({
                                    watch: true,
                                    callback: function(isTruncated, orgContent){
                                        if (isTruncated) {
                                            $itemtext.data('isTrancated', isTruncated);
                                            $itemtext.attr('data-tooltip', orgContent.text());
                                        } else {
                                            if ($itemtext.data('isTrancated') == 'true') {
                                                $itemtext.removeAttr('data-tooltip');
                                            }
                                        }
                                    }
                                });
                            }
                            if (that.data.maxItemSymbols) {
                                var text = $itemtext.html();
                                if (text.length > that.data.maxItemSymbols) {
                                    $itemtext.attr('data-tooltip', text);
                                    $itemtext.html(text.substr(0, that.data.maxItemSymbols) + '...');
                                }
                            }
                            if ($submenu.length > 0) {
                                $itemlink.removeAttr('href');
                                $icon.addClass('icon_animate');
                                if (that.data.toggle == 'click') {
                                    $itemlink.on('click', function(){
                                        var collapsed = $submenu.data('collapsed');
                                        $submenu.slideToggle(500);
                                        $submenu.data('collapsed', !collapsed);
                                        if (collapsed) {
                                            $icon.addClass('icon_rotate_0deg');
                                            $(this).addClass('menu__item-link_selected');
                                        } else {
                                            $icon.removeClass('icon_rotate_0deg');
                                            $(this).removeClass('menu__item-link_selected');
                                        }
                                        item.siblings().each(function(){
                                            var sibling = $(this),
                                                ssubmenu = sibling.children('.menu__submenu-container'),
                                                sitemlink = sibling.children('.menu__item-link'),
                                                sicon = sibling.children('.menu__item-link').children('.menu__item-link-content').children('.menu__icon');
                                            sitemlink.removeClass('menu__item-link_selected');
                                            if (that.data.autoclose) {
                                                var scollapsed = ssubmenu.data('collapsed');
                                                if (!scollapsed) {
                                                    ssubmenu.slideUp(500);
                                                    ssubmenu.data('collapsed', true);
                                                    sicon.toggleClass('icon_rotate_0deg');
                                                }
                                            }
                                        });
                                    });
                                    if (that.data.expanded) {
                                        $submenu.show();
                                        $submenu.data('collapsed', false);
                                        $icon.toggleClass('icon_rotate_0deg');
                                    } else {
                                        $submenu.data('collapsed', true);
                                    }
                                }
                                if (that.data.toggle == 'hover') {
                                    item.on('mouseover', function(){
                                        $submenu.show();
                                        $itemlink.addClass('menu__item-link_hovered');
                                        $icon.toggleClass('icon_rotate_0deg');
                                    });
                                    item.on('mouseout', function(){
                                        $submenu.hide();
                                        $itemlink.removeClass('menu__item-link_hovered');
                                        $icon.toggleClass('icon_rotate_0deg');
                                    });
                                }
                            } else {
                                $itemlink.on('click', function(){
                                    self.find('.menu__item-link').removeClass('menu__item-link_selected');
                                    $(this).addClass('menu__item-link_selected');
                                });
                            }
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
        select : function(id) {
            return this.each(function() {
                this.obj.select(id);
            });
        }
    };
    $.fn.menu = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.menu' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="menu"]').menu();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'codearea', target: self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        readonly: false,
                        mime: 'text/html',
                        editor: null,
                        value: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.enable = function(){
                        that.data.disabled = false;
                        that.render();
                    };
                    that.render = function(){
                        if (!that.data.disabled) {
                            if (that.data.value) {
                                self.val(that.data.value);
                            }
                            that.data.editor = CodeMirror.fromTextArea(self[0], {
                                readOnly: that.data.readonly,
                                mode: that.data.mime,
                                tabSize: 2,
                                lineNumbers: true,
                                matchBrackets: true,
                                autoCloseBrackets: true,
                                autoCloseTags: true,
                                foldGutter: true,
                                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
                            });
                        }
                    };
                    that.get_value = function(){
                        if (that.data.editor) {
                            that.data.value = that.data.editor.getValue();
                        }
                        return that.data.value;
                    };
                    that.set_value = function(value){
                        value = value.replace(new RegExp('%', 'g'), '%25');
                        that.data.value = decodeURI(value);
                        if (that.data.editor) {
                            that.data.editor.setValue(that.data.value);
                        }
                    };
                    that.init = function(){
                        that.render();
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
        render : function() {
            return this.each(function() {
                this.obj.render();
            });
        },
        set_value : function(value) {
            return this.each(function() {
                this.obj.set_value(value);
            });
        },
        get_value : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = this.obj.get_value();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push(this.obj.get_value());
                });
                return _arr;
            }
        },
        value : function(value) {
            if (value) {
                return this.each(function() {
                    this.obj.set_value(value);
                });
            } else {
                if (this.length == 1) {
                    var _val = false;
                    this.each(function() {
                        _val = this.obj.get_value();
                    });
                    return _val;
                } else {
                    var _arr = [];
                    this.each(function() {
                        _arr.push(this.obj.get_value());
                    });
                    return _arr;
                }
            }
        }
    };
    $.fn.codearea = function( method ) {
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
    $('[data-fc="codearea"]').codearea();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget', target : self });
                    var that = this.obj = {};
                    that.const = {
                        CONTENT_LOADING: '<span class="spinner"></span>',
                        CONTENT_NODATA: 'Нет данных',
                        CONTENT_ERROR: 'Ошибка загрузки',
                        BORDER_COLOR_DARK_BLUE: '#0070ba',
                        BORDER_COLOR_BLUE: '#5a97f2',
                        BORDER_COLOR_LIGHT_BLUE: '#2fb4e9',
                        BORDER_COLOR_DEFAULT: '#ccc',
                        BORDER_COLOR_DARK_GREY: '#777',
                        BORDER_COLOR_PURPLE: '#8e6bf5',
                        BORDER_COLOR_RED: '#ff5940',
                        BORDER_COLOR_GREEN: '#13a89e',
                        BORDER_COLOR_NONE: 'transparent',
                        CONTENT_TYPE_TEXT: 'text',
                        CONTENT_TYPE_HTML: 'html',
                        CONTENT_TYPE_COUNT: 'count'
                    };
                    that.defaults = {
                        collapsible: true,
                        collapsed: false,
                        color: that.const.BORDER_COLOR_DEFAULT,
                        calendar: false,
                        content: that.const.CONTENT_NODATA,
                        mode: 'view',

                        libraries: null,
                        loader: null,

                        reloadable: false,
                        onResize: null,
                        resizeOnExpand: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);
                    that.data._el = {
                        button_collapse: $([
                            '<button class="button button_collapse" type="button" data-tooltip="' + that.data.name + '">',
                            '<span class="button__text">' + that.data.name + '</span>',
                            '</button>'
                        ].join('')).button(),
                        button_collapse_icon: $('<span class="icon icon_svg_down"></span>'),
                        buttons: []
                    };
                    that.data._private = {
                        buttons_view_mode_count: 0,
                        buttons_edit_mode_count: 0
                    };

                    that.destroy = function(){
                        that.data._el.button_collapse.button('destroy');
                        that.data._el.buttons.forEach(function(button){
                            button.button('destroy');
                        });
                        self.removeData();
                        self.remove();
                    };

                    that.render = function(){
                        var $template = $(
                                '<div class="widget__header">' +
                                    '<div class="widget__header-name"></div>' +
                                    '<div class="widget__header-actions"></div>' +
                                '</div>' +
                                '<div class="widget__border">' +
                                    '<div class="widget__body">' +
                                        '<div class="widget__body-data"></div>' +
                                    '</div>' +
                                '</div>');
                        self.append($template);
                        that.set_color();
                        if (!that.data.collapsed) {
                            that.set_content();
                        }
                    };
                    that.render_button_collapse = function(){
                        if (that.data.name) {
                            if (that.data.collapsible) {
                                that.data._el.button_collapse.button('enable');
                                that.data._el.button_collapse.append(that.data._el.button_collapse_icon);
                            } else {
                                that.data._el.button_collapse.button('disable');
                                that.data._el.button_collapse_icon.remove();
                            }
                            self.closestChild('.widget__header-name').append(that.data._el.button_collapse);
                            that.data._el.button_collapse.button('show');
                        } else {
                            that.data._el.button_collapse.button('hide');
                        }
                        if (!that.data.name || that.data.name == "") {
                            self.removeClass('widget_has_name');
                            self.addClass('widget_has_no_name');
                        } else {
                            self.removeClass('widget_has_no_name');
                            self.addClass('widget_has_name');
                        }
                    };
                    that.render_buttons = function(){
                        self.addClass('widget_mode_view_has_no_buttons');
                        self.addClass('widget_mode_edit_has_no_buttons');
                        if (that.data.buttons){
                            that.data.buttons.forEach(function(button){
                                that.render_button(button, false);
                            });
                        }
                    };
                    that.render_button = function(button, isnew){
                        if (isnew) {
                            that.data.buttons.push(button);
                        }
                        if (button.mode == 'view') {
                            that.data._private.buttons_view_mode_count++;
                            self.addClass('widget_mode_view_has_buttons');
                            self.removeClass('widget_mode_view_has_no_buttons');
                        }
                        if (button.mode == 'edit') {
                            that.data._private.buttons_edit_mode_count++;
                            self.addClass('widget_mode_edit_has_buttons');
                            self.removeClass('widget_mode_edit_has_no_buttons');
                        }
                        var $button = $([
                            '<button class="button" type="button" ' + (button.id ? 'id="' + button.id + '" ' : ' ') + (button.tooltip ? 'data-tooltip="' + button.tooltip + '"' : '') + '>',
                            '<span class="icon ' + button.icon + '"></span>',
                            '</button>'
                        ].join('')).button();
                        $button.on('click', function(){
                            button.click(self, _.omitBy(that.data, function(val, key){
                                return (key.substring(0,1) == '_');
                            }));
                        });
                        self.closestChild('.widget__header-actions').append($button);
                        button._el = $button;
                        that.data._el.buttons.push($button);
                    };
                    that.render_button_calendar = function(){
                        var button = {
                            id: 'button_calendar',
                            icon: 'icon_svg_calendar',
                            mode: 'view',
                            click: function(widget, data){}
                        };
                        if (that.data.calendar) {
                            if (that.data.buttons.filter(function(b){ return b.id == 'button_calendar'; }).length == 0) {
                                that.render_button(button, true);
                                if (that.data.mode = 'view') { button._el.button('show'); }
                                if (that.data.mode = 'edit') { button._el.button('hide'); }
                            }
                        } else {
                            button = that.data.buttons.filter(function(b){ return b.id == 'button_calendar'; });
                            if (button.length > 0) {
                                button = button[0];
                                that.data.buttons = that.data.buttons.filter(function(b){ return b.id != 'button_calendar'; });
                                button._el.remove();
                            }
                        }
                    };
                    that.get_buttons = function(){
                        that.data.collapsed = self.hasClass('widget_collapsed');
                        that.data._el.button_collapse = self.closestChild('.button_collapse');
                        if (typeof that.data._el.button_collapse[0] != 'undefined') {
                            if (typeof that.data._el.button_collapse.find('.button__text')[0] != 'undefined') {
                                that.data.name = that.data._el.button_collapse.find('.button__text').text();
                            }
                        }
                    };

                    that.render_calendar = function(data, onSelect){
                        if (that.data.buttons.filter(function(b){ return b.id == 'button_calendar'; }).length == 0) {
                            var button = {
                                id: 'button_calendar',
                                icon: 'icon_svg_calendar',
                                mode: 'view',
                                click: function(){}
                            };
                            that.render_button(button, true);
                            var $popup = $('<div class="popup"></div>');
                            button._el.after($popup);
                            $popup.popup({
                                source: button._el,
                                position: 'bottom right',
                                width: 'auto'
                            });
                            button._el.datepicker({
                                inline: true,
                                autoClose: true,
                                onRenderCell: function (date, cellType) {
                                    if (date) {
                                        var currentDate = date.getDate(),
                                            items = data.filter(function(it){
                                                return Asyst.date.format(date) == it.date;
                                            });
                                        if (cellType == 'day') {
                                            if (items.length > 0) {
                                                return {
                                                    html: [
                                                        '<div class="datepicker__day">' + currentDate,
                                                        '<div class="datepicker__note">' + items.length,
                                                        '</div>',
                                                        '</div>'
                                                    ].join('')
                                                }
                                            } else {
                                                return {
                                                    html: '<div class="datepicker__day">' + currentDate + '</div>'
                                                }
                                            }
                                        }
                                    }
                                },
                                onSelect: function(formattedDate, date, inst){
                                    $popup.popup('hide');
                                    onSelect(formattedDate, date, inst);
                                }
                            });
                            var datepicker = button._el.data().datepicker;
                            datepicker.$datepicker.parent().appendTo($popup);
                        }
                    };

                    that.set_name = function(){
                        that.data._el.button_collapse.closestChild('.button__text').text(that.data.name);
                        that.data._el.button_collapse.attr('data-tooltip', that.data.name);
                        that.data._el.button_collapse.data('tooltip', that.data.name);
                        that.render_button_collapse();
                    };
                    that.set_color = function(){
                        if (that.data.color === that.const.BORDER_COLOR_DARK_BLUE) {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.addClass('widget_color_dark_blue');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_BLUE) {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.addClass('widget_color_blue');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_LIGHT_BLUE) {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.addClass('widget_color_light_blue');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_DEFAULT) {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.addClass('widget_color_default');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_DARK_GREY) {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.addClass('widget_color_dark_grey');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_PURPLE) {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.addClass('widget_color_purple');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_RED) {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.addClass('widget_color_red');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_GREEN) {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.addClass('widget_color_green');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_NONE) {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.addClass('widget_color_none');
                        }
                        else {
                            self.attr('class',self.attr('class').replace(/\widget_color_.*?\b/g, ''));
                            self.css({
                                'border-color': that.data.color
                            });
                        }
                    };
                    that.set_color_border = function(){
                        var $border = self.closestChild('.widget__border');
                        if (that.data.color === that.const.BORDER_COLOR_DARK_BLUE) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_dark_blue');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_BLUE) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_blue');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_LIGHT_BLUE) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_light_blue');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_DEFAULT) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_default');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_DARK_GREY) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_dark_grey');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_PURPLE) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_purple');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_RED) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_red');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_GREEN) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_green');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_NONE) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_none');
                        }
                        else {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.css({
                                'border-color': that.data.color
                            });
                        }
                    };
                    that.set_loader = function(){
                        if (typeof that.data.lib == 'object') {
                            for (key in that.data.lib) {
                                if (that.data.lib[key]) {
                                    if (that.data.lib[key].library) {
                                        var lib = that.data.lib[key].library.filter(function(d){
                                            return d.value == that.data.pageid;
                                        });
                                        if (lib.length > 0) {
                                            that.data.loader = that.data.lib[key].loader;
                                        }
                                    }
                                }
                            }
                        }
                    };
                    that.set_content = function(){
                        var $body = self.closestChild('.widget__body'),
                            $bodydata = self.closestChild('.widget__body-data');
                        that.set_loader();
                        if (that.data.loader && typeof that.data.loader == 'object') {
                            $body.addClass('widget__body_align_center');
                            $bodydata.attr('class', $bodydata.attr('class').replace(/\widget__body-data_type_.*?\b/g, ''));
                            $bodydata.html(that.const.CONTENT_LOADING);

                            that.data.content = new that.data.loader.obj();
                            if (that.data.loader.contents) {
                                that.data.content.extend({
                                    contents: that.data.loader.contents
                                });
                            }
                            that.data.content.extend({
                                target: self,
                                data: _.omitBy(that.data, function(val, key){
                                    return (key.substring(0,1) == '_');
                                }),
                                success: function(content){
                                    $body.removeClass('widget__body_align_center');
                                    $bodydata.addClass('widget__body-data_type_html');
                                    $bodydata.html(content);
                                    that.data.content = content;
                                },
                                error: function(msg){
                                    $body.addClass('widget__body_align_center');
                                    $bodydata.addClass('widget__body-data_type_text');
                                    $bodydata.html(msg);
                                    that.data.content = msg;
                                }
                            });
                            that.data.content.loadContent();
                        } else {
                            $body.addClass('widget__body_align_center');
                            $bodydata.addClass('widget__body-data_type_text');
                            $bodydata.html(that.const.CONTENT_NODATA);
                        }
                    };
                    that.set_width = function(){
                        if (that.data.width) {
                            self.css({
                                width: that.data.width
                            });
                        }
                    };
                    that.set_height = function(){
                        if (that.data.height) {
                            self.css({
                                height: that.data.height
                            });
                        }
                    };

                    that.collapse = function(){
                        self.addClass('widget_collapsed');
                        that.data.collapsed = true;
                    };
                    that.expand = function(){
                        self.removeClass('widget_collapsed');
                        that.data.collapsed = false;
                        if (that.data.resizeOnExpand) {
                            that.data.resizeOnExpand = false;
                            that.resize();
                        }
                        if (that.data.content == that.const.CONTENT_NODATA && that.data.reloadable) {
                            setTimeout(function(){
                                that.set_content();
                            }, 501);
                        }
                    };
                    that.toggle = function(){
                        that.data.collapsed = !that.data.collapsed;
                        if (that.data.collapsed) {
                            that.collapse();
                        } else {
                            that.expand();
                        }
                    };

                    that.edit_mode = function(){
                        if (that.data.collapsible) {
                            that.data._el.button_collapse.button('disable');
                        }
                        that.data.mode = 'edit';
                        self.removeClass('widget_mode_view');
                        self.addClass('widget_mode_edit');
                    };
                    that.view_mode = function(){
                        if (that.data.collapsible) {
                            that.data._el.button_collapse.button('enable');
                        }
                        that.data.mode = 'view';
                        self.addClass('widget_mode_view');
                        self.removeClass('widget_mode_edit');
                    };

                    that.bind = function(){
                        that.data._el.button_collapse.button().on('click.widget', that.toggle);
                        if (!that.data.collapsible) {
                            that.data._el.button_collapse.button('disable');
                        }
                    };
                    that.resize = function(func){
                        if (func) {
                            that.data.onResize = func;
                        } else {
                            if (that.get_collapsed(self)) {
                                that.data.resizeOnExpand = true;
                            } else {
                                if (typeof(that.data.onResize) == 'function') {
                                    setTimeout(function(){
                                        that.data.onResize();
                                    }, 501);
                                }
                                self.closestChild('.widget-grid').widget_grid('resize');
                            }
                        }
                    };
                    that.get_collapsed = function(elem){
                        var collapsed = elem.data().collapsed;
                        if (!collapsed) {
                            var parent = elem.parents('.widget');
                            if (parent.length > 0) {
                                collapsed = that.get_collapsed(parent);
                            }
                        }
                        return collapsed;
                    };

                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="checkbox"]').checkbox();
                        self.find('[data-tooltip]').tooltip();
                    };
                    that.init = function(){
                        if (self.children().length == 0) {
                            that.render();
                            that.render_buttons();
                        } else {
                            that.get_buttons();
                        }
                        that.render_button_collapse();
                        that.init_components();
                        that.bind();
                        if (that.data.mode == 'view') {
                            that.view_mode();
                        } else {
                            that.edit_mode();
                        }
                        that.set_width();
                        that.set_height();
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
        edit_mode : function() {
            return this.each(function() {
                this.obj.edit_mode();
            });
        },
        view_mode : function() {
            return this.each(function() {
                this.obj.view_mode();
            });
        },
        set_name : function() {
            return this.each(function() {
                this.obj.set_name();
            });
        },
        set_color : function() {
            return this.each(function() {
                this.obj.set_color();
            });
        },
        set_content : function() {
            return this.each(function() {
                this.obj.set_content();
            });
        },
        update : function() {
            return this.each(function() {
                this.obj.set_name();
                this.obj.set_color();
                this.obj.set_content();
            });
        },
        resize : function(func) {
            return this.each(function() {
                this.obj.resize(func);
            });
        },
        render_button : function(button) {
            return this.each(function() {
                this.obj.render_button(button, true);
            });
        },
        render_calendar : function(data, onSelect) {
            return this.each(function() {
                this.obj.render_calendar(data, onSelect);
            });
        }
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
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'video', target : self });
                    var that = this.obj = {};
                    that.defaults = {};
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._video = null;
                    that.data._video__controls_timer = null;
                    that.data._el = {
                        target: self,
                        parent: self.parent(),
                        video: $('<div class="video" id="' + (new Date()).valueOf() + '"></div>'),
                        video__container: $('<div class="video__container"></div>'),
                        video__controls: $('<div class="video__controls"></div>'),
                        video__controls_top: $('<div class="video__controls_top"></div>'),
                        video__controls_bottom: $('<div class="video__controls_bottom"></div>'),
                        video__controls_left: $('<div class="video__controls_left"></div>'),
                        video__controls_middle: $('<div class="video__controls_middle"></div>'),
                        video__controls_right: $('<div class="video__controls_right"></div>'),
                        progress: $('<div class="video__progress" data-tooltip="0"></div>'),
                        progress_value: $('<div class="video__progress_value"></div>'),
                        alertbox: $('<label class="alertbox"><span class="alertbox__text">0:00&nbsp;/&nbsp;0:00</span></label>'),
                        slider_volume: $('<div class="video__volume"></div>'),
                        slider_volume_progress: $('<div class="video__progress" data-tooltip="100"></div>'),
                        slider_volume_progress_value: $('<div class="video__progress_value"></div>'),
                        loader: $('<span class="spinner spinner_align_center spinner_white"></span>')
                    };
                    that.data._buttons = {
                        play: $('<button class="button" type="button" data-fc="button"><span class="icon icon_svg_player_fill_white"></span></button>'),
                        mute: $('<button class="button" type="button" data-fc="button" data-tooltip="Отключить звук"><span class="icon icon_svg_mute_white"></span></button>'),
                        fullscreen: $('<button class="button" type="button" data-fc="button" data-tooltip="Во весь экран"><span class="icon icon_svg_fullscreen_white"></span></button>')
                    };
                    that.data._fullscreen = {
                        status: undefined,
                        request: undefined,
                        exit: undefined
                    };
                    that.data._volume = 100;

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.error = function(){
                        that.data._el.target.attr('controls', 'true');
                        that.data.error = 'Browser doesn\'t support fullscreen mode';
                    };

                    that.render = function(){
                        that.render_controls();
                        var data = $.extend(true, {}, that.data);
                        that.data._el.target.removeClass('video').remove();
                        that.data._el.parent.append(
                            that.data._el.video.append(
                                that.data._el.video__container.append(
                                    that.data._el.target
                                ),
                                that.data._el.video__controls.append(
                                    that.data._el.video__controls_top,
                                    that.data._el.video__controls_bottom.append(
                                        that.data._el.video__controls_left,
                                        that.data._el.video__controls_middle,
                                        that.data._el.video__controls_right
                                    )
                                )
                            )
                        );
                        that.data._el.target.data(data);
                    };
                    that.render_controls = function(){
                        that.data._el.video__controls_top.append(
                            that.data._el.progress.append(
                                that.data._el.progress_value
                            )
                        );
                        that.data._el.video__controls_left.append(
                            that.data._buttons.play,
                            that.data._el.alertbox
                        );
                        that.data._el.video__controls_middle.append(
                            that.data._el.slider_volume.append(
                                that.data._el.slider_volume_progress.append(
                                    that.data._el.slider_volume_progress_value
                                )
                            ),
                            that.data._buttons.mute
                        );
                        that.data._el.video__controls_right.append(
                            that.data._buttons.fullscreen
                        );
                    };

                    that.controls_hide = function(){
                        if (!that.data._video.paused && !that.data._video.ended) {
                            that.data._el.video__controls.addClass('video__controls_hidden');
                        }
                    };
                    that.controls_show = function(){
                        that.data._el.video__controls.removeClass('video__controls_hidden');
                    };
                    that.controls_timer = function(){
                        clearTimeout(that.data._video__controls_timer);
                        that.controls_show();
                        that.data._video__controls_timer = setTimeout(that.controls_hide, 5000);
                    };

                    that.loader_add = function(){
                        that.data._el.parent.prepend(that.data._el.loader)
                    };
                    that.loader_remove = function(){
                        that.data._el.loader.remove();
                    };

                    that.bind = function(){
                        that.data._el.video.on('mouseout.video', that.controls_hide);
                        that.data._el.video.on('mousemove.video', that.controls_timer);
                        that.data._buttons.play.on('click.video', that.video_play_pause);
                        that.data._buttons.play.button('disable');
                        that.data._buttons.mute.on('click.video', that.video_mute);
                        that.data._buttons.fullscreen.on('click.video', that.video_fullscreen);
                        that.data._video.addEventListener('timeupdate', that.video_update_progress_bar);
                        that.data._el.progress.on('mousemove', that.video_progress_tooltip);
                        that.data._el.progress.on('click drag', that.video_seek);
                        that.data._el.slider_volume_progress.on('mousemove', that.video_volume_tooltip);
                        that.data._el.slider_volume_progress.on('click drag', that.video_volume);
                    };

                    that.video_init = function(){
                        if (!that.data._el.target.attr('id')) {
                            that.data._el.target.attr('id', (new Date()).valueOf());
                        }
                        that.data._video = document.getElementById(that.data._el.target.attr('id'));
                        that.data._video.controls = false;
                        that.data._fullscreen.request = function(){
                            var root = document.documentElement;
                            return root.requestFullscreen ||
                                root.webkitRequestFullscreen ||
                                root.mozRequestFullScreen ||
                                root.msRequestFullscreen;
                        }();
                        that.data._fullscreen.exit = function(){
                            return document.exitFullscreen ||
                                document.webkitExitFullscreen ||
                                document.mozCancelFullScreen ||
                                document.msExitFullscreen;
                        }();
                        that.data._fullscreen.status = function(){
                            return document.fullscreenElement ||
                                document.webkitFullscreenElement ||
                                document.mozFullScreenElement ||
                                document.msFullscreenElement;
                        };
                    };
                    that.video_loaded = function(){
                        that.data._video.onloadedmetadata = that.video_set_metadata;
                    };
                    that.video_canplay = function(){
                        that.data._video.oncanplay = that.video_play_pause_enale;
                    };
                    that.video_set_metadata = function(){
                        that.video_set_progress_text();
                        that.loader_remove();
                    };
                    that.video_play_pause_enale = function(){
                        that.data._buttons.play.button('enable');
                    };
                    that.video_play_pause = function(){
                        that.loader_remove();
                        if (that.data._video.paused || that.data._video.ended) {
                            that.data._video.play();
                            that.data._buttons.play.find('.icon').removeClass('icon_svg_player_fill_white').addClass('icon_svg_pause_white');
                        } else {
                            that.data._video.pause();
                            that.data._buttons.play.find('.icon').removeClass('icon_svg_pause_white').addClass('icon_svg_player_fill_white');
                        }
                    };
                    that.video_stop = function(){
                        that.data._video.pause();
                        that.data._video.currentTime = 0;
                    };
                    that.video_louder = function(){
                        that.data._video.volume += that.data._video.volume == 1 ? 0 : 0.1;
                        that.data._video.volume = parseFloat(that.data._video.volume).toFixed(1);
                    };
                    that.video_quieter = function(){
                        that.data._video.volume -= that.data._video.volume == 0 ? 0 : 0.1;
                        that.data._video.volume = parseFloat(that.data._video.volume).toFixed(1);
                    };
                    that.video_mute = function(){
                        that.data._volume = that.data._video.volume;
                        that.data._video.muted = !that.data._video.muted;
                        if (that.data._video.muted) {
                            that.video_set_volume(0);
                            that.data._buttons.mute.find('.icon').removeClass('icon_svg_mute_white').addClass('icon_svg_unmute_white');
                            that.data._buttons.mute.tooltip('clear');
                            that.data._buttons.mute.tooltip();
                            that.data._buttons.mute.tooltip('update', 'Включить звук');
                        } else {
                            that.video_set_volume(that.data._volume);
                            that.data._buttons.mute.find('.icon').removeClass('icon_svg_unmute_white').addClass('icon_svg_mute_white');
                            that.data._buttons.mute.tooltip('clear');
                            that.data._buttons.mute.tooltip();
                            that.data._buttons.mute.tooltip('update', 'Отключить звук');
                        }
                    };
                    that.video_fullscreen = function(){
                        if (that.data._fullscreen.request) {
                            if (that.data._fullscreen.status() == null) {
                                that.data._fullscreen.request.call(document.getElementById(that.data._el.video.attr('id')));
                            } else {
                                that.data._fullscreen.exit.call(document);
                            }
                        } else {
                            alert('browser doesn\'t allow fullscreen mode');
                        }
                    };
                    that.video_update_progress_bar = function(){
                        var value = (100 / that.data._video.duration) * that.data._video.currentTime;
                        that.data._el.progress_value.width(value + '%');
                        that.video_set_progress_text();
                    };
                    that.video_progress_tooltip = function(e){
                        var percent = 100 / that.data._el.progress.width() * e.offsetX;
                        var value = that.data._video.duration / 100 * percent;
                        that.data._el.progress.tooltip();
                        that.data._el.progress.tooltip('update', that.video_seconds_to_time(value));
                    };
                    that.video_seek = function(e){
                        if (e.offsetX < 0) { return; }
                        if (e.offsetX > that.data._el.progress.width()) { return; }
                        var percent = 100 / that.data._el.progress.width() * e.offsetX;
                        var value = that.data._video.duration / 100 * percent;
                        that.data._video.currentTime = value;
                    };
                    that.video_seconds_to_time = function(seconds) {
                        var hours   = Math.floor(seconds / 3600);
                        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
                        var seconds = Math.floor(seconds - (hours * 3600) - (minutes * 60));
                        var time = "";

                        if (hours != 0) {
                            time = hours+":";
                        }
                        if (minutes != 0 || time !== "") {
                            minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
                            time += minutes+":";
                        }
                        seconds = (seconds < 10) ? "0"+seconds : String(seconds);
                        if (time === "") {
                            time = "0:"+seconds;
                        }
                        else {
                            time += seconds;
                        }
                        return time;
                    };
                    that.video_set_progress_text = function(){
                        that.data._el.alertbox.find('.alertbox__text').html(
                            that.video_seconds_to_time(that.data._video.currentTime) + '&nbsp;/&nbsp;' +
                            that.video_seconds_to_time(that.data._video.duration)
                        );
                    };
                    that.video_volume_tooltip = function(e){
                        var volume = Math.floor(100 / that.data._el.slider_volume_progress.width() * e.offsetX);
                        that.data._el.slider_volume_progress.tooltip();
                        that.data._el.slider_volume_progress.tooltip('update', volume);
                    };
                    that.video_volume = function(e){
                        if (e.offsetX < 0) { return ; }
                        if (e.offsetX > that.data._el.slider_volume_progress.width()) { return; }
                        that.data._volume = e.offsetX / that.data._el.slider_volume_progress.width();
                        that.data._video.volume = that.data._volume;
                        that.video_set_volume(that.data._volume);
                        if (that.data._video.muted) {
                            that.video_mute();
                        }
                    };
                    that.video_set_volume = function(value){
                        that.data._el.slider_volume_progress_value.width(value * 100 + '%');
                    };

                    that.init_components = function(){
                        for (var button in that.data._buttons) {
                            that.data._buttons[button].button();
                        }
                    };
                    that.init = function(){
                        that.loader_add();
                        that.video_init();
                        that.video_loaded();
                        if (that.data._fullscreen.request) {
                            that.render();
                            that.init_components();
                            that.bind();
                            that.video_canplay();
                        } else {
                            that.error();
                        }
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
        }
    };
    $.fn.video = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.video' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="video"]').video();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'select', target : self });
                    var that = this.obj = {};
                    that.const = {
                        REQUIRED: 'Необходимо выбрать из списка'
                    };
                    that.defaults = {
                        name: self.attr('name'),
                        disabled: false,
                        hidden: false,
                        width: '100%',
                        height: 'auto',
                        mode: 'radio',
                        placeholder: 'Выберите значение',
                        popup_animation: true,
                        popup_width: '100%',
                        text: '',
                        count_selected: "Выбрано # из %",
                        placeholder_selected: false,
                        minimum_count_selected: 2,
                        autoclose: false,
                        highlight: false,
                        validate: false,
                        search: true
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._value = [];
                    that.data._handlers = null;
                    that.data._options = [];
                    that.data._el = {
                        select: $('<div class="select__container"></div>'),
                        button: $([
                            '<button class="button" data-fc="button">',
                                '<span class="button__text">' + that.data.placeholder + '</span>',
                                '<span class="icon icon_animate icon_svg_down"></span>',
                            '</button>'
                        ].join('')),
                        spinner: $([
                            '<span class="icon">',
                                '<span class="spinner"></span>',
                            '</span>'
                        ].join('')),
                        input: $([
                            '<span class="input input__has-clear">',
                                '<span class="input__box">',
                                    '<span class="alertbox">',
                                        '<span class="icon icon_svg_search"></span>',
                                    '</span>',
                                    '<input type="text" class="input__control">',
                                    '<button class="button" type="button">',
                                        '<span class="icon icon_svg_close"></span>',
                                    '</button>',
                                '</span>',
                            '</span>'
                        ].join('')),
                        popup: $('<div class="popup" data-fc="popup"></div>'),
                        popup__input: $('<div class="popup__input"></div>'),
                        popup__scroll: $('<div class="popup__scroll"></div>'),
                        popup__list: $('<ul class="popup__list"></ul>'),
                        popup__list_items: [],
                        popup__list_item_checkall: $([
                            '<li class="popup__list-item">',
                            '<button class="popup__link">',
                            '<span class="popup__text popup__text_light">Выбрать все</span>',
                            '</button>',
                            '</li>'
                        ].join(''))
                    };

                    that.destroy = function(){
                        if (that.data._widget.type == 'select') {
                            that.data._el.button.button('destroy');
                            that.data._el.input.input('destroy');
                            that.data._el.popup.popup('destroy');
                            that.data._el.select.remove();
                            self.removeData();
                            self.remove();
                        }
                    };
                    that.disable = function(){
                        that.data._el.button.button('disable');
                        that.data._el.input.input('disable');
                        that.data._el.popup.popup('hide');
                        that.data.disabled = true;
                    };
                    that.enable = function(){
                        that.data._el.button.button('enable');
                        that.data._el.input.input('enable');
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        that.data._el.select.addClass('select__container_hidden');
                        that.data._el.button.button('hide');
                        that.data._el.input.input('hide');
                        that.data._el.popup.popup('hide');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        that.data._el.select.removeClass('select__container_hidden');
                        that.data._el.button.button('show');
                        that.data._el.input.input('show');
                        that.data.hidden = false;
                    };

                    that.render = function(){
                        if (that.data.mode == 'check') {
                            that.data._el.popup__list_item_checkall.data({
                                text: 'Выбрать все',
                                selected: false,
                                disabled: false,
                                hidden: false
                            });
                        }
                        that.render_popup_list();
                        that.data._el.select.append(
                            that.data._el.button,
                            that.data._el.popup.append(
                                (that.data.search ?
                                    that.data._el.popup__input.append(
                                        that.data._el.input
                                    ) : null
                                ),
                                that.data._el.popup__scroll.append(
                                    that.data._el.popup__list
                                )
                            )
                        );
                        that.data._el.select.data(that.data);
                        that.data._el.select.data({'_widget': '_select'});
                        self.css('display', 'none');
                        self.after(that.data._el.select);
                    };
                    that.render_popup_list = function(){
                        self.find('option').each(function(){
                            var $option = $(this);
                            var _option = {};
                            _option.defaults = {
                                text: $option.text(),
                                value: $option.attr('value'),
                                selected: $option[0].hasAttribute("selected"),
                                disabled: false,
                                hidden: false,
                                icon: ''
                            };

                            // render popup__list-item
                            _option.data = $.extend(true, {}, _option.defaults, $option.data());
                            _option.popup__list_item = $([
                                '<li class="popup__list-item',
                                (_option.data.selected ? ' popup__list-item_checked' : ''),
                                (_option.data.disabled ? ' popup__list-item_disabled' : '') + '">',
                                '<button class="popup__link">',
                                (_option.data.icon == '' ? '' : '<span class="icon ' + _option.data.icon + '"></span>'),
                                '<span class="popup__text">' + _option.data.text + '</span>',
                                '</button>',
                                '</li>'
                            ].join(''));

                            that.data._options.push($option);
                            that.data._el.popup__list_items.push(_option.popup__list_item);

                            // checked count of selected items
                            if (_option.data.selected) {
                                if (((that.data.mode == 'radio' || that.data.mode == 'radio-check') && (that.data._value.length == 0)) ||
                                    (that.data.mode == 'check')) {
                                    that.check_item(_option.popup__list_item, _option.data);
                                } else {
                                    _option.data.selected = false;
                                    that.uncheck_item(_option.popup__list_item, _option.data);
                                }
                            }

                            // store data to element
                            $option.data(_option.data);
                            _option.popup__list_item.data(_option.data);
                        });
                        that.data._el.popup__list.append(
                            (that.data.mode == 'check' ? that.data._el.popup__list_item_checkall : null),
                            that.data._el.popup__list_items
                        )
                    };
                    that.update = function(data){
                        that.data._el.button.find('.button__text').after(that.data._el.spinner);
                        that.clear(true);
                        self.html('');
                        that.data._options = [];
                        that.data._el.popup__list.html('');
                        that.data._el.popup__list_items = [];
                        data.forEach(function(item, i, arr){
                            var $option = $('<option value="' + item.value + '" ' + (item.selected ? 'selected' : '') + '>' + item.text + '</option>');
                            self.append($option);
                        });
                        that.render_popup_list();
                        that.bind();
                        if (that.data.mode == 'check') {
                            that.bind_checkall();
                        }
                        that.data._el.spinner.remove();
                    };
                    that.get_items = function(){
                        var items = [];
                        that.data._options.map(function($option){
                            items.push({
                                value: $option.attr('value'),
                                text: $option.text(),
                                selected: ($option.attr('selected') ? true : false)
                            });
                        });
                        return items;
                    };

                    that.focus = function(){
                        that.data._el.popup.popup('show');
                    };
                    that.clear = function(disabled){
                        that.data._value = [];
                        that.uncheck_all();
                        if (!that.data.disabled && !disabled) {
                            self.trigger('change');
                        }
                    };

                    that.focusin = function(){
                        that.data._el.popup.popup('show');
                    };
                    that.focusout = function(){
                        that.data._el.popup.popup('hide');
                    };

                    that.set_width = function(value){
                        that.data._el.select.css('width', value);
                    };
                    that.set_value = function(value){
                        if (that.data._value.indexOf(value) < 0) {
                            that.data._value.push(value);
                        }
                    };
                    that.del_value = function(value){
                        that.data._value = that.data._value.filter(function(d){
                            return d.value != value.value && d.text != value.text;
                        });
                    };
                    that.set_button_text = function(){
                        if (that.data._value.length == 0) {
                            that.data._el.button.find('.button__text').addClass('button__text_placeholder');
                            that.data._el.button.find('.button__text').text(
                                that.data.placeholder
                            );
                        } else if (that.data._value.length > that.data.minimum_count_selected) {
                            that.data._el.button.find('.button__text').removeClass('button__text_placeholder');
                            that.data._el.button.find('.button__text').html(
                                (that.data.placeholder_selected ?
                                '<span class="button__text_placeholder">' + that.data.placeholder + '&nbsp;&nbsp;</span>' : '') +
                                that.data.count_selected.replace('#', that.data._value.length).replace('%', that.data._options.length)
                            );
                        } else {
                            that.data._el.button.find('.button__text').removeClass('button__text_placeholder');
                            that.data._el.button.find('.button__text').html(
                                (that.data.placeholder_selected ?
                                '<span class="button__text_placeholder">' + that.data.placeholder + '&nbsp;&nbsp;</span>' : '') +
                                that.data._value.map(function(d){
                                    return d.text;
                                }).join(', ')
                            );
                        }
                    };
                    that.get_value = function(){
                        if (that.data._value.length == 0) {
                            return null;
                        } else {
                            if (that.data.mode == 'radio' || that.data.mode == 'radio-check') {
                                return that.data._value[0].value;
                            }
                            if (that.data.mode == 'check') {
                                return that.data._value.map(function(d){
                                    return d.value;
                                })
                            }
                        }
                    };

                    that.check_item = function(item, idata){
                        idata.selected = true;
                        item.addClass('popup__list-item_checked');
                        that.set_value({ 'value': idata.value, 'text': idata.text });
                        that.data._options.forEach(function(option){
                            if (option.data().value == idata.value) {
                                option.attr('selected', 'selected');
                                option.data().selected = idata.selected;
                            }
                        });
                        that.set_button_text();
                        if (that.data.mode == 'check') {
                            var checkall = true;
                            that.data._options.forEach(function(option){
                                if (!option.data().selected) {
                                    checkall = false;
                                }
                            });
                            checkall ? that.check_checkall() : that.uncheck_checkall();
                        }
                    };
                    that.uncheck_item = function(item, idata){
                        idata.selected = false;
                        item.removeClass('popup__list-item_checked');
                        that.del_value({ 'value': idata.value, 'text': idata.text });
                        that.data._options.forEach(function(option){
                            if (option.data().value == idata.value) {
                                option.removeAttr('selected');
                                option.data().selected = idata.selected;
                            }
                        });
                        that.set_button_text();
                        if (that.data.mode == 'check') {
                            that.uncheck_checkall();
                        }
                    };
                    that.check_all = function(){
                        that.data._value = [];
                        that.data._el.popup__list_items.forEach(function(item){
                            item.addClass('popup__list-item_checked');
                            item.data().selected = true;
                            that.set_value({ 'value': item.data().value, 'text': item.data().text });
                        });
                        that.data._options.forEach(function(option){
                            option.attr('selected', 'selected');
                            option.data().selected = true;
                        });
                        that.set_button_text();
                        if (that.data.mode == 'check') {
                            that.check_checkall();
                        }
                        that.highlight();
                        that.validate();
                    };
                    that.uncheck_all = function(){
                        that.data._el.popup__list_items.forEach(function(item){
                            item.removeClass('popup__list-item_checked');
                            item.data().selected = false;
                            that.del_value({'value': item.data().value, 'text': item.data().text});
                        });
                        that.data._options.forEach(function(option){
                            option.removeAttr('selected');
                            option.data().selected = false;
                        });
                        that.set_button_text();
                        if (that.data.mode == 'check') {
                            that.uncheck_checkall();
                        }
                        that.highlight();
                        that.validate();
                    };

                    that.check = function(value){
                        var _trigger = false;
                        that.data._el.popup__list_items.forEach(function(item) {
                            if (!item.data().selected) {
                                if (item.data().value == value || value == "all") {
                                    _trigger = true;
                                    if (that.data.mode == 'radio') {
                                        that.uncheck_all();
                                    }
                                    if (that.data.mode == 'radio-check') {
                                        that.uncheck_all();
                                    }
                                    that.check_item(item, item.data());
                                }
                            }
                        });
                        if (_trigger) {
                            if (!that.data.disabled) {
                                self.trigger('change');
                            }
                        }
                        that.highlight();
                        that.validate();
                    };
                    that.uncheck = function(value){
                        var _trigger = false;
                        that.data._el.popup__list_items.forEach(function(item) {
                            if (item.data().value == value || value == 'all') {
                                if (that.data.mode != 'radio') {
                                    _trigger = true;
                                    that.uncheck_item(item, item.data());
                                }
                            }
                        });
                        if (_trigger) {
                            if (!that.data.disabled) {
                                self.trigger('change');
                            }
                        }
                        that.highlight();
                        that.validate();
                    };

                    that.check_checkall = function(){
                        var item = that.data._el.popup__list_item_checkall,
                            idata = that.data._el.popup__list_item_checkall.data();
                        idata.selected = true;
                        item.addClass('popup__list-item_checked');
                    };
                    that.uncheck_checkall = function(){
                        var item = that.data._el.popup__list_item_checkall,
                            idata = that.data._el.popup__list_item_checkall.data();
                        idata.selected = false;
                        item.removeClass('popup__list-item_checked');
                    };

                    that.validate = function(){
                        that.data.validate = true;
                        if (that.data.required) {
                            if (!that.get_value()) {
                                that.data.validate = false;
                                that.data._el.select.addClass('select__has-error');
                                if (that.data._el.select.parent().find('.control__error').length == 0) {
                                    that.data._el.select.after($('<div class="control__error">' + that.const.REQUIRED + '</div>'));
                                }
                            } else {
                                that.data.validate = true;
                                that.data._el.select.removeClass('select__has-error');
                                if (that.data._el.select.parent().find('.control__error').length != 0) {
                                    that.data._el.select.parent().find('.control__error').remove();
                                }
                            }
                        }
                        return that.data.validate;
                    };
                    that.highlight = function(){
                        if (that.data.highlight) {
                            if (that.get_value()) {
                                that.data._el.select.addClass('select_checked');
                            } else {
                                that.data._el.select.removeClass('select_checked');
                            }
                        }
                    };

                    that.bind = function(){
                        that.data._el.popup__list_items.forEach(function(item){
                            var idata = item.data();
                            if (!idata.disabled) {
                                item.on('click', function(){
                                    if (that.data.mode == 'radio') {
                                        that.uncheck_all();
                                        idata.selected = true;
                                        that.check_item(item, idata);
                                    }
                                    if (that.data.mode == 'radio-check') {
                                        var selected = idata.selected;
                                        that.uncheck_all();
                                        idata.selected = !selected;
                                        if (idata.selected) {
                                            that.check_item(item, idata);
                                        } else {
                                            that.uncheck_item(item, idata);
                                        }
                                    }
                                    if (that.data.mode == 'check') {
                                        idata.selected = !idata.selected;
                                        if (idata.selected) {
                                            that.check_item(item, idata);
                                        } else {
                                            that.uncheck_item(item, idata);
                                        }
                                    }
                                    if (that.data.autoclose) {
                                        that.focusout();
                                    }
                                    if (that.data.highlight) {
                                        that.highlight();
                                    }
                                    if (!that.data.disabled) {
                                        self.trigger('change');
                                    }
                                    that.validate();
                                });
                            }
                        });
                    };
                    that.bind_input = function(){
                        that.data._el.input.find('.input__control').on('keyup', function(){
                            var value = that.data._el.input.input('value');
                            that.data._el.popup__list_items.forEach(function(item) {
                                if (item.data().text.toLowerCase().includes(value.toLowerCase())) {
                                    item.removeClass('popup__list-item_hidden');
                                } else {
                                    item.addClass('popup__list-item_hidden');
                                }
                            });
                        });
                    };
                    that.bind_checkall = function(){
                        var idata = that.data._el.popup__list_item_checkall.data();
                        if (!idata.disabled) {
                            that.data._el.popup__list_item_checkall.on('click', function(){
                                idata.selected = !idata.selected;
                                idata.selected ? that.check_all() : that.uncheck_all();
                                if (that.data.highlight) {
                                    that.highlight();
                                }
                                if (!that.data.disabled) {
                                    self.trigger('change');
                                }
                                that.validate();
                            });
                        }
                    };

                    that.init_components = function(){
                        that.data._el.button.button({
                            disabled: that.data.disabled,
                            hidden: that.data.hidden,
                            width: that.data.width
                        });
                        that.data._el.input.input({
                            width: '100%'
                        });
                        that.data._el.popup.popup({
                            source: that.data._el.button,
                            height: that.data.height,

                            animation: that.data.popup_animation,
                            select: true
                        });
                    };
                    that.init = function(){
                        that.render();
                        that.init_components();
                        that.bind();
                        that.bind_input();
                        if (that.data.mode == 'check') {
                            that.bind_checkall();
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
                        that.set_width(that.data.width);
                        that.set_button_text();
                        that.highlight();
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
        update : function(data) {
            return this.each(function() {
                this.obj.update(data);
            });
        },
        focus : function() {
            return this.each(function() {
                this.obj.focus();
            });
        },
        check : function(value) {
            return this.each(function() {
                this.obj.check(value);
            });
        },
        uncheck : function(value) {
            return this.each(function() {
                this.obj.uncheck(value);
            });
        },
        check_all : function() {
            return this.each(function() {
                this.obj.check_all();
            });
        },
        uncheck_all : function() {
            return this.each(function() {
                this.obj.uncheck_all();
            });
        },
        clear : function() {
            return this.each(function() {
                this.obj.clear();
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
        },
        value : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = this.obj.get_value();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push(this.obj.get_value());
                });
                return _arr;
            }
        },
        get_items : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = this.obj.get_items();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push(this.obj.get_items());
                });
                return _arr;
            }
        }
    };
    $.fn.select = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.select' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="select"]').select();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'counter', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        date: null,
                        showyears: false,
                        counttime: false,
                        countdown: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.countdown = function(){
                        that.data.countdown = self.countdown({
                            date: that.data.date,
                            showYears: that.data.showyears,
                            render: function(date){
                                var thisObj = this, $years;
                                $(this.el).empty().append(
                                    (that.data.showyears ?
                                        [
                                            $('<span class="alertbox-group"></span>').append(
                                                that.split(date.years.toString(), 1).map(function(d){
                                                    return $([
                                                        '<span class="alertbox">',
                                                        '<span class="alertbox__text">' + d + '</span>',
                                                        '</span>'
                                                    ].join(''));
                                                })
                                            ),
                                            $([
                                                '<span class="alertbox alertbox_border_none">',
                                                '<span class="alertbox__text">:</span>',
                                                '</span>'
                                            ].join(''))
                                        ]
                                        : null
                                    ),
                                    $('<span class="alertbox-group"></span>').append(
                                        that.split(date.days.toString(), 1).map(function(d){
                                            return $([
                                                '<span class="alertbox">',
                                                '<span class="alertbox__text">' + d + '</span>',
                                                '</span>'
                                            ].join(''));
                                        })
                                    ),
                                    $([
                                        '<span class="alertbox alertbox_border_none">',
                                        '<span class="alertbox__text">:</span>',
                                        '</span>'
                                    ].join('')),
                                    $('<span class="alertbox-group"></span>').append(
                                        that.split(thisObj.leadingZeros(date.hours, 2), 1).map(function(d){
                                            return $([
                                                '<span class="alertbox">',
                                                '<span class="alertbox__text">' + d + '</span>',
                                                '</span>'
                                            ].join(''));
                                        })
                                    ),
                                    $([
                                        '<span class="alertbox alertbox_border_none">',
                                        '<span class="alertbox__text">:</span>',
                                        '</span>'
                                    ].join('')),
                                    $('<span class="alertbox-group"></span>').append(
                                        that.split(thisObj.leadingZeros(date.min, 2), 1).map(function(d){
                                            return $([
                                                '<span class="alertbox">',
                                                '<span class="alertbox__text">' + d + '</span>',
                                                '</span>'
                                            ].join(''));
                                        })
                                    ),
                                    $([
                                        '<span class="alertbox alertbox_border_none">',
                                        '<span class="alertbox__text">:</span>',
                                        '</span>'
                                    ].join('')),
                                    $('<span class="alertbox-group"></span>').append(
                                        that.split(thisObj.leadingZeros(date.sec, 2), 1).map(function(d){
                                            return $([
                                                '<span class="alertbox">',
                                                '<span class="alertbox__text">' + d + '</span>',
                                                '</span>'
                                            ].join(''));
                                        })
                                    )
                                );
                            }
                        });
                    };
                    that.counttime = function(){
                        render();
                        setInterval(function(){
                            render();
                        }, 1e3);
                        function pad(a,b){ return([1e15]+a).slice(-b); }
                        function render(){
                            $(self).empty().append(
                                $('<span class="alertbox-group"></span>').append(
                                    that.split(pad((new Date()).getHours(), 2), 1).map(function(d){
                                        return $([
                                            '<span class="alertbox">',
                                            '<span class="alertbox__text">' + d + '</span>',
                                            '</span>'
                                        ].join(''));
                                    })
                                ),
                                $([
                                    '<span class="alertbox alertbox_border_none">',
                                    '<span class="alertbox__text">:</span>',
                                    '</span>'
                                ].join('')),
                                $('<span class="alertbox-group"></span>').append(
                                    that.split(pad((new Date()).getMinutes(), 2), 1).map(function(d){
                                        return $([
                                            '<span class="alertbox">',
                                            '<span class="alertbox__text">' + d + '</span>',
                                            '</span>'
                                        ].join(''));
                                    })
                                ),
                                $([
                                    '<span class="alertbox alertbox_border_none">',
                                    '<span class="alertbox__text">:</span>',
                                    '</span>'
                                ].join('')),
                                $('<span class="alertbox-group"></span>').append(
                                    that.split(pad((new Date()).getSeconds(), 2), 1).map(function(d){
                                        return $([
                                            '<span class="alertbox">',
                                            '<span class="alertbox__text">' + d + '</span>',
                                            '</span>'
                                        ].join(''));
                                    })
                                )
                            );
                        }
                    };
                    that.split = function(str, length){
                        return str.match(new RegExp('.{1,' + length + '}', 'g'));
                    };

                    that.init_components = function(){};
                    that.init = function(){
                        if (that.data.counttime) {
                            that.counttime();
                        } else {
                            that.countdown();
                        }
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
        }
    };
    $.fn.counter = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.counter' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="counter"]').counter();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'gallery', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        title: 'Фотогалерея',
                        items: []
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        target: self,
                        card: $('<div class="card" data-fc="card"></div>'),
                        card__header: $('<div class="card__header"></div>'),
                        card__header_row: $('<div class="card__header-row"></div>'),
                        card__header_column: $([
                            '<div class="card__header-column">',
                                '<label class="card__name">',
                                '<span class="card__name-text">' + that.data.title + '</span>',
                                '</label>',
                            '</div>'
                        ].join('')),
                        card__header_column_search: $('<div class="card__header-column card__header-element_stretch"></div>'),
                        input: $([
                            '<span class="input input__has-clear card__header-element_stretch" data-fc="input">',
                                '<span class="input__box">',
                                    '<span class="alertbox" data-fc="alertbox">',
                                        '<span class="icon icon_svg_search"></span>',
                                    '</span>',
                                    '<input type="text" class="input__control">',
                                    '<button class="button" type="button" data-fc="button" tabindex="-1">',
                                        '<span class="icon icon_svg_close"></span>',
                                    '</button>',
                                '</span>',
                            '</span>',
                        ].join('')),
                        button_toggle_left: $([
                            '<button class="button" type="button" data-fc="button" data-toggle="left">',
                            '<span class="icon icon_svg_double_right"></span>',
                            '</button>'
                        ].join('')),
                        card__main: $('<div class="card__main"></div>'),
                        card__left: $('<div class="card__left"></div>'),
                        card__backdrop: $('<div class="card__backdrop"></div>'),
                        card__middle: $('<div class="card__middle"></div>'),
                        card__middle_scroll: $('<div class="card__middle-scroll"></div>'),
                        card__middle_inner: $('<div class="card__middle-inner"></div>'),
                        menu: $('<div class="menu menu_color_light" data-fc="menu"></div>'),
                        tabs: []
                    };
                    that.data.private = {
                        datatree: [],
                        datalevel: -1,
                        search: {
                            text: null,
                            timer: null
                        }
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.nulls = function(){
                        that.data.items.map(function(item){
                            for (var key in item){
                                if (item.hasOwnProperty(key)) {
                                    if (item[key] == 'null') {
                                        item[key] = '';
                                    }
                                }
                            }
                        });
                    };
                    that.prepare = function(){
                        that.data.items.map(function(d){ that.data.private.datatree.push({ item: d }) });
                        that.data.private.datatree = prepareData(that.data.private.datatree, that.data.private.datalevel, null);
                        function prepareData(data, datalevel, parentid){
                            var roots = data.filter(function(d){ return d.item.parentid == parentid; });
                            datalevel++;
                            roots.forEach(function(root){
                                root.item.level = datalevel;
                                if (!root.item.fileid)
                                    root.child = prepareData(data, datalevel, root.item.id);
                            });
                            datalevel--;
                            return roots;
                        }
                    };

                    that.render = function(){
                        that.data._el.target.append(
                            that.data._el.card.append(
                                that.data._el.card__header.append(
                                    that.data._el.card__header_row.append(
                                        that.data._el.card__header_column.prepend(
                                            that.data._el.button_toggle_left
                                        ),
                                        that.data._el.card__header_column_search.append(
                                            that.data._el.input
                                        )
                                    )
                                ),
                                that.data._el.card__main.append(
                                    that.data._el.card__left.append(
                                        that.data._el.menu
                                    ),
                                    that.data._el.card__middle.append(
                                        that.data._el.card__middle_scroll.append(
                                            that.data._el.card__middle_inner
                                        )
                                    ),
                                    that.data._el.card__backdrop
                                )
                            )
                        );
                    };
                    that.render_data = function(){
                        var $menu__list = $('<ul class="menu__list"></ul>');
                        renderMenu(that.data.private.datatree, $menu__list);
                        that.data._el.menu.append($menu__list);
                        that.data._el.menu.menu();
                        function renderMenu(data, container){
                            var result = false,
                                padding = 10;
                            data.forEach(function(d){
                                if (!d.item.fileid) {
                                    result = true;
                                    padding = 10;
                                    for (var i = 0; i < d.item.level; i++) { padding += 20; }
                                    //d.item.icon = 'icon_svg_folder';
                                    var $menu__item = $([
                                            '<li class="menu__item" id=' + d.item.id + '>',
                                            '<a class="menu__item-link link" style="padding-left: '+ padding +'px">',
                                            '<span class="menu__item-link-content">',
                                                '<span class="menu__icon icon icon_animate icon_svg_right"></span>',
                                                (d.item.icon && d.item.icon != 'null' ? '<span class="icon ' + d.item.icon + '"></span>' : ''),
                                                '<span class="menu__item-text">' + d.item.name + '</span>',
                                            '</span>',
                                            '</a>',
                                            '</li>'
                                        ].join(''));
                                    var $menu__submenu = $('<div class="menu menu__submenu-container"></div>');
                                    var $menu__list = $('<ul class="menu__list menu__submenu"></ul>');
                                    $menu__item.append(
                                        $menu__submenu.append(
                                            $menu__list
                                        )
                                    );
                                    if (d.child) {
                                        if (!renderMenu(d.child, $menu__list)) {
                                            d.item.icon = 'icon_svg_images';
                                            $menu__item = $([
                                                '<li class="menu__item" id=' + d.item.id + '>',
                                                '<a class="menu__item-link link" style="padding-left: '+ padding +'px">',
                                                '<span class="menu__item-link-content">',
                                                    (d.item.icon && d.item.icon != 'null' ? '<span class="icon ' + d.item.icon + '"></span>' : ''),
                                                    '<span class="menu__item-text">' + d.item.name + '</span>',
                                                '</span>',
                                                '</a>',
                                                '</li>'
                                            ].join(''));
                                            $menu__item.on('click', function(e){
                                                console.log(d.item.id);
                                                if (!d._loaded) {
                                                    renderPanel(d);
                                                }
                                                that.data._el.card__middle.find('.tabs__pane').hide();
                                                that.data._el.card__middle.find('.tabs__pane[data-id="' + d.item.id + '"]').show();
                                            });
                                        }
                                    }
                                    container.append($menu__item);
                                }
                            });
                            return result;
                        }
                        function renderPanel(d){
                            //set flag loaded
                            d._loaded = true;

                            //render panel
                            var $tab = $('<div class="tabs__pane tabs__pane_active" data-id="' + d.item.id + '"></div>').hide();
                            that.data._el.tabs.push($tab);
                            that.data._el.card__middle_inner.append($tab);

                            // render images
                            d.child.forEach(function(d) {
                                var item = d.item;
                                var _guid = item.url.replace('/asyst/api/file/get/','')
                                var _slash = _guid.indexOf('/');
                                _guid = _guid.substring(0,_slash);
                                item.guid = _guid;
                                renderImageBlock(item, $tab);
                            });
                        }
                        function renderImageBlock(item, cont){
                            var $imageblock = $([
                                '<div class="gallery__image-block" data-url="' + item.url + '">',
                                '<a class="gallery__image-link" href="' + item.url + '"',
                                'data-description="' + item.description + '"',
                                'data-lightbox="lightbox-' + item.parentid + '">',
                                '<div class="spinner spinner_align_center"></div>',
                                '<div class="gallery__image"></div>',
                                '<div class="gallery__error">',
                                '<div class="icon icon_svg_close"></div>',
                                '<div class="gallery__error-info">Ошибка</div>',
                                '</div>',
                                '<div class="gallery__filename"></div>',
                                '</a></div>'
                            ].join('')).appendTo(cont);
                            $imageblock.find('.spinner').show();
                            $imageblock.find('.gallery__image').css('opacity', 0);
                            $imageblock.find('.gallery__image').css('background-image', 'url(/converter/converter?file=' + item.guid + ')');
                            var tempImg = new Image();
                            tempImg.src = '/converter/converter?file=' + item.guid;
                            tempImg.onload = function() {
                                $imageblock.find('.spinner').hide();
                                $imageblock.find('.gallery__image').css('opacity', 1);
                            };
                            tempImg.onerror = function() {
                                $imageblock.find('.spinner').hide();
                                $imageblock.find('.gallery__image').hide();
                                $imageblock.find('.gallery__error').css('display', 'flex');
                                $imageblock.find('.gallery__image-link').on('click', function(e){
                                    e.preventDefault();
                                    return false;
                                }).removeAttr('data-lightbox');
                            };
                        }
                    };
                    that.filter = function(){
                        filter(that.data.private.datatree, that.data.private.search.text.toLowerCase().trim());
                        function filter(arr, text){
                            arr.map(function(d){
                                var fields = [], show = false;
                                if (typeof d.item.ownerName != 'undefined') {
                                    fields.push('ownerName');
                                }
                                if (typeof d.item.responsibleName != 'undefined') {
                                    fields.push('responsibleName');
                                }
                                if (typeof d.item.name != 'undefined') {
                                    fields.push('name');
                                }
                                fields.map(function(field){
                                    if (d.item[field].toLowerCase().indexOf(text) >= 0) {
                                        show = true;
                                    }
                                });
                                if (show) {
                                    self.find('.menu__item' + '#' + d.item.id).show();
                                } else {
                                    self.find('.menu__item' + '#' + d.item.id).hide();
                                }
                            });
                        }
                    };
                    that.bind = function(){
                        that.data._el.input.on('keyup', function(){
                            clearTimeout(that.data.private.search.timer);
                            that.data.private.search.text = $(this).input('value');
                            that.data.private.search.timer = setTimeout(that.filter, 300);
                        });
                    };

                    that.init_components = function(){
                        self.find('[data-fc="card"]').card();
                        self.find('[data-fc="button"]').button();
                        self.find('[data-tooltip]').tooltip();
                        self.find('[data-fc="input"]').input();
                    };
                    that.init = function(){
                        that.nulls();
                        that.prepare();
                        that.render();
                        that.render_data();
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
        }
    };
    $.fn.gallery = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.gallery' );
        }
    };
})( jQuery );
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'visit', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        title: 'Паспорта регионов',
                        items: [],
                        headerRenderer: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data.private = {
                        subjects: [],
                        sections: [],
                        items: []
                    };
                    that.data.current = {
                        subject: null,
                        section: null,
                        groupings: [],
                        item: null
                    };
                    that.data._el = {
                        target: self,
                        card: $('<div class="card" data-fc="card"></div>'),
                        card__header: $('<div class="card__header"></div>'),
                        card__header_row: $('<div class="card__header-row card__header-column_start"></div>'),
                        card__header_column: $([
                            '<div class="card__header-column">',
                            '<label class="card__name">',
                            '<span class="card__name-text">' + that.data.title + '</span>',
                            '</label>',
                            '</div>'
                        ].join('')),
                        card__header_column_subjects: $('<div class="card__header-column" id="subjects"></div>'),
                        button_toggle_left: $([
                            '<button class="button" type="button" data-fc="button" data-toggle="left">',
                            '<span class="icon icon_svg_double_right"></span>',
                            '</button>'
                        ].join('')),

                        card__header_row_tabs: $([
                            '<div class="card__header-row tabs">',
                            '<ul class="tabs__list"></ul>',
                            '</div>'
                        ].join('')),
                        card__main: $('<div class="card__main"></div>'),
                        card__left: $('<div class="card__left"></div>'),
                        card__middle: $('<div class="card__middle"></div>'),
                        visit__frame_container: $('<div class="visit__frame-container"></div>'),
                        menu: $('<div class="menu menu_color_light" data-fc="menu"></div>'),

                        select: $('<select class="select" data-fc="select" data-mode="radio" data-width="300" data-autoclose="true"></select>'),
                        tabs__list: $('<ul class="tabs__list"></ul>'),
                        tabs: [],
                        loader: $('<span class="spinner spinner_align_center"></span>')
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.nulls = function(){
                        that.data.items.map(function(item){
                            for (var key in item){
                                if (item.hasOwnProperty(key)) {
                                    if (item[key] == 'null') {
                                        item[key] = '';
                                    }
                                }
                            }
                        });
                    };

                    that.render = function(){
                        that.data._el.target.append(
                            that.data._el.card.append(
                                that.data._el.card__header.append(
                                    that.data._el.card__header_row.append(
                                        that.data._el.card__header_column.prepend(
                                            that.data._el.button_toggle_left
                                        ),
                                        that.data._el.card__header_column_subjects
                                    )
                                ),
                                that.data._el.card__main.append(
                                    that.data._el.card__left.append(
                                        that.data._el.menu
                                    ),
                                    that.data._el.card__middle.append(
                                        that.data._el.visit__frame_container
                                    )
                                )
                            )
                        );
                    };
                    that.render_select = function(){
                        that.loader_add();
                        var distinct = {};
                        that.data.private.subjects = [];
                        that.data.items.map(function(d){
                            if (d.subjectnameid in distinct) {
                                distinct[d.subjectnameid]++;
                            } else {
                                distinct[d.subjectnameid] = 1;
                                that.data.private.subjects.push({
                                    subjectname: d.subjectname,
                                    subjectnameid: d.subjectnameid
                                });
                            }
                        });
                        that.data.current.subject = that.data.private.subjects[0];
                        that.data.private.subjects.map(function(d){
                            that.data._el.select.append('<option value="' + d.subjectnameid + '">' + d.subjectname + '</option>');
                        });

                        that.data._el.card__header_column_subjects.append( that.data._el.select );
                        that.data._el.select.select();
                        that.data._el.select.on('change', function(){
                            var value = $(this).select('value');
                            that.data.current.subject = that.data.private.subjects.filter(function(d){ return d.subjectnameid == value; })[0];
                            that.data.current.subjectnameid = value;
                            that.render_tabs();
                        });
                        if (typeof that.data.current.subject != 'undefined') {
                            if (typeof that.data.current.subject.subjectnameid != 'undefined') {
                                that.data._el.select.select('check', that.data.current.subject.subjectnameid);
                            }
                        }
                        that.loader_remove();
                    };
                    that.render_tabs = function(){
                        //that.loader_add();
                        that.data.current.item = null;
                        that.render_item();
                        that.data._el.card__header_row_tabs.remove();
                        that.data._el.card__header_row_tabs.find('.tabs__list').empty();

                        var distinct = {};
                        that.data.private.sections = [];
                        that.data.items.map(function(d){
                            if (d.sectionnameid in distinct) {
                                distinct[d.sectionnameid]++;
                            } else {
                                distinct[d.sectionnameid] = 1;
                                that.data.private.sections.push({
                                    sectionname: d.sectionname,
                                    sectionnameid: d.sectionnameid
                                });
                            }
                        });
                        that.data.current.section = that.data.private.sections[0];
                        that.data.private.sections.map(function(d,i){
                            var $tab = $([
                                '<li class="tabs__tab'+ (i == 0 ? ' tabs__tab_active' : '') +'" data-id="'+ d.sectionnameid +'">',
                                '<a class="tabs__link link" href="#section_'+ d.sectionnameid +'" data-fc="tab">',
                                '<button class="button" data-fc="button" style="width: auto;">',
                                '<span class="button__text">'+ d.sectionname +'</span>',
                                '</button>',
                                '</a>',
                                '</li>'
                            ].join(''));
                            $tab.on('click', function(){
                                var value = $(this).attr('data-id');
                                that.data.current.section = that.data.private.sections.filter(function(d){ return d.sectionnameid == value; })[0];
                                that.data.current.sectionnameid = value;
                                that.render_menu();
                            });
                            that.data._el.card__header_row_tabs.find('.tabs__list').append($tab);
                        });

                        that.data._el.card__header.append(that.data._el.card__header_row_tabs);
                        that.data._el.card__header_row_tabs.find('[data-fc="tab"]').tabs();
                        that.data._el.card__header_row_tabs.find('.tabs__tab[data-id="'+ that.data.current.section.sectionnameid +'"]').trigger('click');
                        //that.loader_remove();
                    };
                    that.render_menu = function(){
                        that.loader_add();
                        that.data.current.item = null;
                        that.render_item();
                        that.data._el.menu.menu();
                        that.data._el.menu.menu('destroy');
                        that.data._el.menu.empty();

                        that.data.private.items = that.data.items.filter(function(d){
                            return (d.subjectnameid == that.data.current.subject.subjectnameid &&
                                    d.sectionnameid == that.data.current.section.sectionnameid);
                        });

                        var distinct = {};
                        that.data.current.groupings = [];
                        that.data.private.items.map(function(d){
                            if (d.groupingnameid in distinct) {
                                distinct[d.groupingnameid]++;
                            } else {
                                distinct[d.groupingnameid] = 1;
                                that.data.current.groupings.push({
                                    groupingname: d.groupingname,
                                    groupingnameid: d.groupingnameid
                                });
                            }
                        });

                        var $menu__list = $('<ul class="menu__list"></ul>');
                        that.data.current.groupings.map(function(d){
                            var $menu__item = $([
                                '<li class="menu__item" id=' + d.groupingnameid + '>',
                                    '<a class="menu__item-link link">',
                                    '<span class="menu__item-link-content">',
                                        '<span class="menu__icon icon icon_animate icon_svg_right"></span>',
                                        '<span class="menu__item-text">' + d.groupingname + '</span>',
                                    '</span>',
                                    '</a>',
                                    '<div class="menu menu__submenu-container">',
                                        '<ul class="menu__list menu__submenu"></ul>',
                                    '</div>',
                                '</li>'
                            ].join(''));
                            that.data.private.items.map(function(item){
                                if (item.groupingnameid == d.groupingnameid) {
                                    if (item.sectionnameid == 1) {
                                        item.icon = 'icon_svg_document';
                                    } else {
                                        item.icon = 'icon_svg_chart';
                                    }
                                    var $menu__subitem = $([
                                        '<li class="menu__item" id=' + item.nameid + '>',
                                        '<a class="menu__item-link link">',
                                        '<span class="menu__item-link-content">',
                                            (item.icon && item.icon != 'null' ? '<span class="icon ' + item.icon + '"></span>' : ''),
                                            '<span class="menu__item-text">' + item.name + '</span>',
                                        '</span>',
                                        '</a>',
                                        '</li>'
                                    ].join(''));
                                    $menu__item.find('.menu__list').append($menu__subitem);
                                    $menu__subitem.find('.menu__item-link').on('click', function(){
                                        that.data.current.item = item;
                                        that.render_item();
                                    });
                                }
                            });
                            $menu__list.append($menu__item);
                        });
                        that.data._el.menu.append($menu__list);
                        that.data._el.menu.menu();
                        that.loader_remove();
                    };
                    that.render_item = function(){
                        if (that.data.onItemClick) {
                            if (typeof(that.data.onItemClick) == 'function') {
                                that.data.onItemClick(
                                    that.data.current.item,
                                    that.data.current.sectionnameid,
                                    that.data._el.visit__frame_container
                                );
                            }
                        }
                    };

                    that.loader_add = function(container){
                        if (!container) {
                            that.data._el.target.before(that.data._el.loader);
                        } else {
                            container.before(that.data._el.loader);
                        }
                    };
                    that.loader_remove = function(){
                        that.data._el.loader.remove();
                    };

                    that.init_components = function(){
                        self.find('[data-fc="card"]').card();
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="select"]').select();
                        self.find('[data-tooltip]').tooltip();
                    };
                    that.init = function(){
                        that.nulls();
                        that.render();
                        that.render_select();
                        that.init_components();
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
        }
    };
    $.fn.visit = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.visit' );
        }
    };
})( jQuery );
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'calendar', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        items: [],
                        columns: [],
                        events: {
                            render: false,
                            TitleColumn: 'date',
                            TooltipColumn: 'date',
                            maxItems: 3
                        },
                        renderEvents: false,
                        eventTitleColumn: 'date',
                        eventTooltipColumn: 'date',
                        onSelect: null,
                        onSelectAllowed: true,
                        useItemsLength: true,
                        initDate: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._today = new Date();
                    that.data._datepicker = null;
                    that.data._selectedItems = [];
                    that.data._showModal = false;
                    that.data._el = {
                        target: self.addClass('calendar'),
                        calendar__container: $('<div class="calendar__container"></div>'),
                        card: $('<div class="card"></div>'),
                        card__header: $([
                            '<div class="card__header">',
                            '<div class="card__header-row">',
                            '<div class="card__header-column" id="name"></div>',
                            '<div class="card__header-column" id="actions"></div>',
                            '</div>',
                            '</div>'
                        ].join('')),
                        button_today: $([
                            '<button class="button" type="button" data-fc="button">',
                            '<span class="button__text">Сегодня</span>',
                            '</button>',
                        ].join('')),
                        card__name: $([
                            '<label class="card__name">',
                            '<span class="card__name-text card__name-text">' + that.data._today.getDate() + '</span>',
                            '</label>',
                        ].join('')),
                        card__count: $([
                            '<label class="card__name">',
                            '<span class="card__name-text">Событий: 3</span>',
                            '</label>',
                        ].join('')),
                        card__main: $('<div class="card__main card__main_flex-direction_column"></div>'),
                        calendar__row_top: $('<div class="calendar__row calendar__row_top"></div>'),
                        calendar__row_bottom: $('<div class="calendar__row calendar__row_bottom"></div>'),
                        calendar__datepicker: $('<div class="calendar__datepicker"></div>'),
                        calendar__table: $('<div class="calendar__table"></div>')
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.prepare_data = function(){
                        that.data.items.map(function(item){
                            for (var key in item){
                                if (item.hasOwnProperty(key)) {
                                    if (item[key] == 'null') {
                                        item[key] = '';
                                    }
                                }
                            }
                        });
                    };
                    that.render = function(){
                        that.data._el.card__header.find('#name').append(
                            that.data._el.card__name
                        );
                        that.data._el.card__header.find('#actions').append(
                            //that.data._el.card__count,
                            that.data._el.button_today
                        );
                        that.data._el.target.append(
                            that.data._el.calendar__container.append(
                                that.data._el.card.append(
                                    that.data._el.card__header,
                                    that.data._el.card__main.append(
                                        that.data._el.calendar__row_top.append(
                                            that.data._el.calendar__datepicker
                                        ),
                                        (that.data.columns.length > 0 ? that.data._el.calendar__row_bottom.append(
                                            that.data._el.calendar__table
                                        ) : null)
                                    )
                                )
                            )
                        );
                    };
                    that.render_datepicker = function(){
                        that.data._el.calendar__datepicker.datepicker({
                            onRenderCell: function (date, cellType) {
                                self.find('[data-tooltip]').tooltip();
                                self.find('[data-tooltip]').tooltip('hide');
                                if (date) {
                                    var currentDate = date.getDate(),
                                        items = that.data.items.filter(function(it){
                                            return it.date && typeof it.date == 'object';
                                        }).filter(function(it){
                                            return  it.date.getDate() == date.getDate() &&
                                                it.date.getMonth() == date.getMonth() &&
                                                it.date.getFullYear() == date.getFullYear();
                                        });
                                    if (cellType == 'day') {
                                        if (that.data.events.render) {
                                            return {
                                                html: [
                                                    '<div class="datepicker__day-container">',
                                                    '<div class="datepicker__day-border">',
                                                        '<div class="datepicker__day">' + currentDate + '</div>',
                                                        items.map(function(item, i){
                                                            return (i < that.data.events.maxItems ? [
                                                                '<div class="datepicker__event">',
                                                                    '<a class="datepicker__event-link link" href="' + item.url + '" target="_blank" onclick="event.cancelBubble = true; if(event.stopPropagation){ event.stopPropagation(); }" data-tooltip="' + item[that.data.events.TooltipColumn] + '">',
                                                                    '<div class="datepicker__indicator"><img src="/asyst/gantt/img/svg/' + item.indicator + '.svg"></div>',
                                                                    '<div class="datepicker__event-text" ',
                                                                    item.background ? 'style="background-color: ' + item.background + '; color: ' + item.color + '; border: none;"' : '',
                                                                    '>' + item[that.data.events.TitleColumn] + '</div>',
                                                                    '</a>',
                                                                '</div>'
                                                            ].join('') : '')
                                                        }).join(''),
                                                        '<div class="datepicker__more">',
                                                            (items.length - that.data.events.maxItems > 0 ? 'еще ' + (items.length - that.data.events.maxItems) : ''),
                                                        '</div>',
                                                    '</div>',
                                                    '</div>'
                                                ].join('')
                                            };
                                        } else {
                                            if (items.length > 0) {
                                                if (that.data.useItemsLength) {
                                                    return {
                                                        html: [
                                                            '<div class="datepicker__day">' + currentDate,
                                                            '<div class="datepicker__note">' + items.length,
                                                            '</div>',
                                                            '</div>'
                                                        ].join('')
                                                    }
                                                } else {
                                                    return {
                                                        html: [
                                                            '<a class="datepicker__day"',
                                                            (items[0]['url'] ? 'href="' + items[0]['url'] + '"' +
                                                            (items[0]['target'] ? 'target="' + items[0]['target'] + '"' : '') : ''),
                                                            '>' + currentDate,

                                                            '<div class="datepicker__note"',
                                                            (items[0]['background'] ?
                                                                ' style="background-color:' + items[0]['background'] + '"' : ''
                                                            ) + '>' + items[0]['count'],
                                                            '</div>',

                                                            '</a>'
                                                        ].join('')
                                                    }
                                                }
                                            }
                                            else {
                                                return {
                                                    html: '<div class="datepicker__day">' + currentDate + '</div>'
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            onSelect: function onSelect(formattedDate, date) {
                                self.find('[data-tooltip]').tooltip();
                                self.find('[data-tooltip]').tooltip('hide');
                                if (date) {
                                    that.data._selectedItems = that.data.items.filter(function(it){
                                        return it.date && typeof it.date == 'object';
                                    }).filter(function(it){
                                        return  it.date.getDate() == date.getDate() &&
                                            it.date.getMonth() == date.getMonth() &&
                                            it.date.getFullYear() == date.getFullYear();
                                    });
                                    that.data.date = date;
                                    that.data.formattedDate = formattedDate;
                                    that.data.displayDate = formattedDate;
                                    if (typeof Asyst != 'undefined') {
                                        if (Asyst.date) {
                                            if (typeof Asyst.date.convertToGenitive == 'function') {
                                                that.data.displayDate = Asyst.date.convertToGenitive(Asyst.date.format(date, 'dd MMMM yyyy').toLowerCase());
                                            }
                                        }
                                    }
                                    that.data._el.card__name.find('.card__name-text').text(that.data.displayDate);
                                    if (that.data.events.render) {
                                        if (that.data._selectedItems.length > 0) {
                                            if (that.data._showModal) {
                                                that.render_modal();
                                            }
                                        }
                                    } else {
                                        that.data._el.calendar__table.empty().append(that.render_table());
                                        that.data._el.calendar__table.find('[data-tooltip]').tooltip();
                                    }
                                    if (typeof that.data.onSelect == 'function' && that.data.onSelectAllowed) {
                                        that.data.onSelect(formattedDate, date);
                                    }
                                }
                            }
                        });
                        if (that.data.events.render) {
                            that.data._el.calendar__row_bottom.remove();
                            that.data._el.calendar__datepicker.find('.datepicker--cells-days').addClass('datepicker__cells-days-border');
                        }
                        that.data._datepicker = that.data._el.calendar__datepicker.data().datepicker;
                        if (that.data.initDate) {
                            that.data._datepicker.selectDate(that.data.initDate);
                        }
                        that.data._showModal = true;
                    };
                    that.render_table = function(){
                        var $table = $('<table class="table"></table>'),
                            $thead = $('<thead></thead>'),
                            $tbody = $('<tbody></tbody>'),
                            $tr = $('<tr></tr>'),
                            $td = $('<td></td>');
                        $table.append(
                            $thead.append(
                                $tr.clone().append(
                                    that.data.columns.map(function(column){
                                        return $td.clone().html(column.title);
                                    })
                                )
                            ),
                            $tbody.append(
                                that.data._selectedItems.map(function(item){
                                    return $tr.clone().append(
                                        that.data.columns.map(function(column){
                                            return $td.clone().html(item[column.fieldname]);
                                        })
                                    )
                                })
                            )
                        );
                        return $table;
                    };
                    that.render_modal = function(){
                        var modal_options = {
                            buttons: [
                                {
                                    name: 'destroy',
                                    action: 'destroy',
                                    icon: 'icon_svg_close'
                                }
                            ],
                            header: {
                                caption: 'События',
                                name: that.data.formattedDate
                            },
                            content: { tabs: [] }
                        };
                        render_general_tab(data, modal_options.content.tabs, true);
                        $('<span class="modal__"></span>').appendTo('body').modal__(modal_options);
                        function render_general_tab(data, tabs, active){
                            tabs.push({
                                id: 'general',
                                name: '',
                                active: active,
                                content: $('<div class="card__table"></div>').append(that.render_table())
                            });
                        };
                    };

                    that.update_datepicker = function(items){
                        that.data.items = items;
                        that.prepare_data();
                        that.data._datepicker.destroy();
                        that.render_datepicker();
                    };

                    that.bind = function(){
                        that.data._el.button_today.on('click', function(){
                            //that.data._showModal = false;
                            that.data._datepicker.selectDate(new Date(that.data._today.getFullYear(), that.data._today.getMonth(), that.data._today.getDate()));
                            //that.data._showModal = true;
                        });
                    };
                    that.select_date = function(date){
                        that.data._datepicker.selectDate(date);
                    };
                    that.set_date = function(date){
                        that.data.onSelectAllowed = false;
                        that.data._datepicker.selectDate(date);
                        that.data.onSelectAllowed = true;
                    };

                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                    };
                    that.init = function(){
                        that.prepare_data();
                        that.render();
                        that.render_datepicker();
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
        select_date : function(date) {
            return this.each(function() {
                this.obj.select_date(date);
            });
        },
        set_date : function(date) {
            return this.each(function() {
                this.obj.set_date(date);
            });
        },
        update : function(items) {
            return this.each(function() {
                this.obj.update_datepicker(items);
            });
        }
    };
    $.fn.calendar = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.calendar' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="calendar"]').calendar();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'carousel', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        autoPlay: true,
                        autoPlayDelay: 2500,
                        animationSpeed: 500,
                        allowPlayOnHover: false,
                        circleEnable: true,
                        circlePosition: 'bottom',
                        items: [],
                        type: 'text',
                        theme: null,
                        onItemClick: null,
                        onItemRender: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        carousel__container: null,
                        carousel__items: null,
                        button_prev: null,
                        button_next: null,
                        carousel__circles: null,
                        carousel__item_list: [],
                        button_circle_list: [],
                        widget__content_nodata: $([
                            '<div class="widget__content widget__content_align_center">',
                            '<div class="widget__text">Нет данных</div>',
                            '</div>'
                        ].join(''))
                    };
                    that.data._private = {
                        sliderTimer: null,
                        allowManipulations: true,
                        i: 0,
                        j: 0,
                        n: 0
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.set_width = function(value){
                        self.css({ width: value });
                    };
                    that.set_height = function(value){
                        self.css({ height: value });
                    };

                    that.render_carousel = function(){
                        if (that.data.theme) {
                            self.addClass('carousel_' + that.data.theme);
                        }
                        that.data._el.carousel__container = $('<div class="carousel__container"></div>');
                        that.data._el.carousel__items = $('<div class="carousel__items"></div>');
                        if (that.data.type == 'image') {
                            that.data._el.carousel__items.addClass('carousel__items_image');
                        }
                        if (that.data.type == 'custom') {
                            that.data._el.carousel__items.addClass('carousel__items_custom');
                        }
                        if (that.data.items) {
                            if (that.data.items.length > 1) {
                                that.data._el.carousel__items.addClass('carousel__items_several');
                            }
                        }
                        that.data._el.button_prev = $([
                            '<button class="button button_prev" type="button" data-fc="button">',
                            '<span class="icon icon_svg_left',
                            (that.data.theme == 'grey' || that.data.theme == 'black' ? '_white' : ''),
                            '"></span>',
                            '</button>'
                        ].join(''));
                        that.data._el.button_next = $([
                            '<button class="button button_next" type="button" data-fc="button">',
                            '<span class="icon icon_svg_right',
                            (that.data.theme == 'grey' || that.data.theme == 'black' ? '_white' : ''),
                            '"></span>',
                            '</button>'
                        ].join(''));
                        that.data._el.carousel__circles = $('<div class="carousel__circles"></div>');
                        that.data.items.forEach(function(item){
                            var $item;
                            if (that.data.type == 'text') {
                                $item = $([
                                    '<div class="carousel__item">',
                                    (item.url ? '<a href="' + item.url + '" class="carousel__item-text link">' + item.name + '</a>' : '<span class="carousel__item-text link">' + item.name + '</span>'),
                                    '</div>'
                                ].join(''));
                            }
                            if (that.data.type == 'image') {
                                $item = $([
                                    '<div class="carousel__item">',
                                    (item.url ?
                                    '<a href="' + item.url + '" class="carousel__item-image link" style="background-image: url(\'' + item.image + '\')"></a>' :
                                    '<span class="carousel__item-image link" style="background-image: url(\'' + item.image + '\')"></span>'),
                                    '<span class="carousel__item-image-text" data-tooltip="' + item.name + '">' + item.name + '</span>',
                                    '</div>'
                                ].join(''));
                            }
                            if (that.data.type == 'custom') {
                                $item = $('<div class="carousel__item"></div>');
                                if (typeof that.data.onItemRender == 'function') {
                                    $item.append(that.data.onItemRender(item));
                                }
                            }
                            if (typeof that.data.onItemClick == 'function') {
                                $item.on('click', function(){
                                    that.data.onItemClick(item);
                                });
                            }
                            that.data._el.carousel__items.append($item);
                            that.data._el.carousel__item_list.push($item);
                            var $button = $([
                                '<button class="button button_circle" type="button" data-fc="button">',
                                '<span class="icon">',
                                '<span class="icon icon__circle"></span>',
                                '</span>',
                                '</button>'
                            ].join('')).button();
                            that.data._el.carousel__circles.append($button);
                            that.data._el.button_circle_list.push($button);
                        });
                        self.append(
                            that.data._el.carousel__container.append(
                                that.data._el.carousel__items
                            )
                        );
                        if (that.data.items.length > 1) {
                            that.data._el.carousel__container.prepend(
                                that.data._el.button_prev
                            );
                            that.data._el.carousel__container.append(
                                that.data._el.button_next
                            );
                            self.append(
                                that.data._el.carousel__circles
                            );
                        }
                    };
                    that.render_nodata = function(){
                        if (that.data.items.length == 0) {
                            self.parent().append(that.data._el.widget__content_nodata);
                            self.remove();
                            self = that.data._el.widget__content_nodata;
                            self.data(that.data);
                        }
                    };
                    that.render_dotdotdot = function(){
                        that.data._el.carousel__item_list.map(function(item){
                            item.dotdotdot();
                        });
                        $(window).resize(function(){
                            setTimeout(function(){
                                that.data._el.carousel__item_list.map(function(item){
                                    item.trigger('update');
                                });
                            }, 100);
                        });
                    };

                    that.activate = function(){
                        that.data._private.i = that.data._el.carousel__item_list.length;
                        that.data._private.j = 0;
                        that.data._private.n = that.data._el.carousel__item_list.length;
                        initialize();
                        initSwipe();
                        function initialize(){
                            if (that.data._private.n > 1) {
                                that.data._el.carousel__item_list.forEach(function(item, i){
                                    $(item).css('display', 'none');
                                })
                                $(that.data._el.carousel__item_list[0]).removeAttr('style');
                                if (that.data.circleEnable) {
                                    bindCircles();
                                    bindArrows();
                                }
                                if (that.data.autoPlay) {
                                    that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                    if (!that.data.allowPlayOnHover) {
                                        self.hover(function() {
                                            clearInterval(that.data._private.sliderTimer);
                                        },function() {
                                            that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                        });
                                    }
                                }
                            }
                        }
                        function bindCircles(){
                            that.data._el.button_circle_list.forEach(function(button, i){
                                var $circle = $(button).find('.icon__circle');
                                $circle.attr('class',$circle.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                $circle.addClass('icon__circle_grey');
                                if (i == 0) {
                                    $circle.addClass('icon__circle_blue');
                                }
                                $(button).bind({
                                    'click': function(){
                                        if (that.data._private.allowManipulations) {
                                            if (that.data._private.j != i) {
                                                if (!that.data.allowPlayOnHover) {
                                                    that.data._private.i = that.data._private.j;
                                                    that.data._private.j = i;
                                                    goToSlide(that.data._private.i, that.data._private.j);
                                                } else {
                                                    clearInterval(that.data._private.sliderTimer);
                                                    that.data._private.i = that.data._private.j;
                                                    that.data._private.j = i;
                                                    goToSlide(that.data._private.i, that.data._private.j, function(){
                                                        that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                                    });
                                                }
                                            }
                                        }
                                    },
                                });
                            });
                        }
                        function bindArrows(){
                            that.data._el.button_prev.bind({
                                'click': function(){
                                    if (that.data._private.allowManipulations) {
                                        prev();
                                        if (!that.data.allowPlayOnHover) {
                                            goToSlide(that.data._private.i, that.data._private.j);
                                        } else {
                                            clearInterval(that.data._private.sliderTimer);
                                            goToSlide(that.data._private.i, that.data._private.j, function(){
                                                that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                            });
                                        }
                                    }
                                }
                            });
                            that.data._el.button_next.bind({
                                'click': function(){
                                    if (that.data._private.allowManipulations) {
                                        next();
                                        if (!that.data.allowPlayOnHover) {
                                            goToSlide(that.data._private.i, that.data._private.j);
                                        } else {
                                            clearInterval(that.data._private.sliderTimer);
                                            goToSlide(that.data._private.i, that.data._private.j, function(){
                                                that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                            });
                                        }
                                    }
                                }
                            });
                        }
                        function initSwipe(){
                            that.data._el.carousel__item_list.forEach(function(item){
                                $(item).touchwipe({
                                    wipeLeft: function() {
                                        if (that.data._private.allowManipulations) {
                                            if (that.data._private.i < that.data._private.n-1) {
                                                clearInterval(that.data._private.sliderTimer);
                                                goToSlide(that.data._private.i, that.data._private.i+1, function(){
                                                    that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                                });
                                            }
                                        }
                                    },
                                    wipeRight: function() {
                                        if (that.data._private.allowManipulations) {
                                            if (that.data._private.i > 0) {
                                                clearInterval(that.data._private.sliderTimer);
                                                goToSlide(that.data._private.i, that.data._private.i-1, function(){
                                                    that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                                });
                                            }
                                        }
                                    },
                                    preventDefaultEvents: false
                                });
                            })
                        }
                        function iterate(){
                            next();
                            goToSlide(that.data._private.i, that.data._private.j);
                        }
                        function next(){
                            var j = that.data._private.j;
                            that.data._private.i = j;
                            j++;
                            if (j == that.data._private.n) { j = 0; }
                            that.data._private.j = j;

                        };
                        function prev(){
                            var j = that.data._private.j;
                            that.data._private.i = j;
                            j--;
                            if (j < 0) { j = that.data._private.n - 1; }
                            that.data._private.j = j;
                        };
                        function goToSlide(gti, gtj, callback){
                            that.data._private.allowManipulations = false;
                            var $circlei = $(that.data._el.button_circle_list[gti]).find('.icon__circle');
                            var $circlej = $(that.data._el.button_circle_list[gtj]).find('.icon__circle');
                            if (gti < gtj) {
                                $(that.data._el.carousel__item_list[gti])
                                    .animate({left: '-100%'}, that.data.animationSpeed, function(){
                                        $(this).css('display','none').css('left','0');
                                        if (that.data.circleEnable) {
                                            $circlei.attr('class',$circlei.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                            $circlei.addClass('icon__circle_grey');
                                        }
                                    });
                                $(that.data._el.carousel__item_list[gtj]).removeAttr('style').css('left','100%')
                                    .animate({left: '0'}, that.data.animationSpeed, function(){
                                        if (that.data.circleEnable) {
                                            $circlej.attr('class',$circlej.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                            $circlej.addClass('icon__circle_blue');
                                        }
                                        if (callback) { callback(); }
                                        that.data._private.allowManipulations = true;
                                    });
                            } else {
                                $(that.data._el.carousel__item_list[gti])
                                    .animate({left: '100%'}, that.data.animationSpeed, function(){
                                        $(this).css('display','none').css('left','0');
                                        if (that.data.circleEnable) {
                                            $circlei.attr('class',$circlei.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                            $circlei.addClass('icon__circle_grey');
                                        }
                                    });
                                $(that.data._el.carousel__item_list[gtj]).removeAttr('style').css('left','-100%')
                                    .animate({left: '0'}, that.data.animationSpeed, function(){
                                        if (that.data.circleEnable) {
                                            $circlej.attr('class',$circlej.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                            $circlej.addClass('icon__circle_blue');
                                        }
                                        if (callback) { callback(); }
                                        that.data._private.allowManipulations = true;
                                    });
                            }
                        }
                    };

                    that.init_carousel = function(){
                        that.data._el.carousel__container = self.find('.carousel__container');
                        that.data._el.carousel__items = self.find('.carousel__items');
                        that.data._el.button_prev = self.find('.button_prev');
                        that.data._el.button_next = self.find('.button_next');
                        that.data._el.carousel__circles = self.find('.carousel__circles');
                        self.find('.carousel__item').each(function(i, item){
                            var it = {
                                text: $(this).find('.carousel__item-text').text(),
                                url: $(this).find('.carousel__item-text').attr('href')
                            };
                            that.data.items.push(it);
                            that.data._el.carousel__item_list.push($(item));
                        });
                        self.find('.button_circle').each(function(i, button){
                            that.data._el.button_circle_list.push($(button));
                        });
                        if (that.data._el.carousel__item_list.length != that.data._el.button_circle_list.length) {
                            that.data._el.carousel__item_list.forEach(function(item, i){
                                if (typeof that.data._el.button_circle_list[i] == typeof undefined) {
                                    var $button = $([
                                        '<button class="button button_circle" type="button" data-fc="button">',
                                        '<span class="icon">',
                                        '<span class="icon icon__circle"></span>',
                                        '</span>',
                                        '</button>'
                                    ].join('')).button();
                                    that.data._el.carousel__circles.append($button);
                                    that.data._el.button_circle_list.push($button);
                                }
                            });
                            that.data._el.button_circle_list.forEach(function(button, i){
                                if (typeof that.data._el.carousel__item_list[i] == typeof undefined) {
                                    $(button).remove();
                                }
                            });
                        }
                    };
                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                        self.find('[data-tooltip]').tooltip();
                    };
                    that.init = function() {
                        that.set_width(that.data.width);
                        that.set_height(that.data.height);
                        if (self.children().length == 0) {
                            that.render_carousel();
                        } else {
                            that.init_carousel();
                        }
                        that.render_nodata();
                        if (that.data.type == 'text') {
                            that.render_dotdotdot();
                        }
                        that.init_components();
                        that.activate();
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
        }
    };
    $.fn.carousel = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.carousel' );
        }
    };
})(jQuery);
(function($){
    $.fn.touchwipe = function(settings) {
        var config = {
            min_move_x: 20,
            min_move_y: 20,
            wipeLeft: function() { },
            wipeRight: function() { },
            wipeUp: function() { },
            wipeDown: function() { },
            preventDefaultEvents: true
        };
        if (settings) $.extend(config, settings);
        this.each(function() {
            var startX;
            var startY;
            var isMoving = false;
            function cancelTouch() {
                this.removeEventListener('touchmove', onTouchMove);
                startX = null;
                isMoving = false;
            }
            function onTouchMove(e) {
                if(config.preventDefaultEvents) {
                    e.preventDefault();
                }
                if(isMoving) {
                    var x = e.touches[0].pageX;
                    var y = e.touches[0].pageY;
                    var dx = startX - x;
                    var dy = startY - y;
                    if(Math.abs(dx) >= config.min_move_x) {
                        cancelTouch();
                        if(dx > 0) {
                            config.wipeLeft();
                        } else {
                            config.wipeRight();
                        }
                    }
                    else if(Math.abs(dy) >= config.min_move_y) {
                        cancelTouch();
                        if(dy > 0) {
                            config.wipeDown();
                        } else {
                            config.wipeUp();
                        }
                    }
                }
            }
            function onTouchStart(e) {
                if (e.touches.length == 1) {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                    isMoving = true;
                    this.addEventListener('touchmove', onTouchMove, false);
                }
            }
            if ('ontouchstart' in document.documentElement) {
                this.addEventListener('touchstart', onTouchStart, false);
            }
        });
        return this;
    };
})(jQuery);
$(function(){
    $('[data-fc="carousel"]').carousel();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'checkbox', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        checked: false,
                        hidden: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        input: self.find('.checkbox__input'),
                        label: self.find('.checkbox__label'),
                        button: self.find('button')
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.addClass('checkbox_disabled');
                        self.attr('data-disabled','true');
                        that.data._el.input.attr('disabled', 'disabled');
                        that.data._el.input.prop('disabled', true);
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
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('disable');
                        }
                    };
                    that.enable = function(){
                        self.removeClass('checkbox_disabled');
                        self.removeAttr('data-disabled');
                        that.data._el.input.removeAttr('disabled');
                        that.data._el.input.prop('disabled', false);
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('enable');
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        self.addClass('checkbox_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('checkbox_hidden');
                        that.data.hidden = false;
                    };

                    that.check = function(){
                        self.addClass('checkbox_checked');
                        self.attr('data-checked','true');
                        that.data._el.input.attr('checked', 'checked');
                        that.data._el.input.prop('checked', true);
                        that.data.checked = true;
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('check');
                        }
                    };
                    that.uncheck = function(){
                        self.removeClass('checkbox_checked');
                        self.removeAttr('data-checked');
                        that.data._el.input.removeAttr('checked');
                        that.data._el.input.prop('checked', false);
                        that.data.checked = false;
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('uncheck');
                        }
                    };

                    that.hover = function(){
                        self.addClass('checkbox_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('checkbox_hovered');
                    };
                    that.click = function(){
                        self.addClass('checkbox_clicked');
                        $('body').one('mouseup.checkbox touchend.checkbox', that.unclick);
                    };
                    that.unclick = function(){
                        self.removeClass('checkbox_clicked');
                    };

                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.checkbox', that.hover);
                        self.on('mouseout.checkbox', that.unhover);
                        self.on('mousedown.checkbox touchstart.checkbox', that.click);
                        if (typeof that.data._el.label[0] != "undefined") {
                            that.data['_widget']['type'] = 'checkbox.label';
                            self.bindFirst('click.checkbox', '.checkbox__label', null, function (e) {
                                e.preventDefault();
                                that.data.checked ? that.uncheck() : that.check();
                            })
                        }
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data['_widget']['type'] = 'checkbox.button';
                            self.bindFirst('click.checkbox', 'button', null, function (e) {
                                e.preventDefault();
                                that.data.checked ? that.uncheck() : that.check();
                            })
                        }
                    };

                    that.init_components = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button();
                        }
                    };
                    that.init = function(){
                        that.data.name = that.data._el.input.attr('name');
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
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'radio', target : self });
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
                        input: self.find('.radio__input'),
                        label: self.find('.radio__label'),
                        button: self.find('button')
                    };
                    that.data._triggers = {
                        check: 'check.fc.radio',
                        uncheck: 'uncheck.fc.radio'
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.addClass('radio_disabled');
                        self.attr('data-disabled','true');
                        that.data._el.input.attr('disabled', 'disabled');
                        that.data._el.input.prop('disabled', true);
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
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('disable');
                        }
                    };
                    that.enable = function(){
                        self.removeClass('radio_disabled');
                        self.removeAttr('data-disabled');
                        that.data._el.input.removeAttr('disabled');
                        that.data._el.input.prop('disabled', false);
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + (ev.namespace? '.' + ev.namespace : ''), ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('enable');
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        self.addClass('radio_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('radio_hidden');
                        that.data.hidden = false;
                    };

                    that.check = function(){
                        self.addClass('radio_checked');
                        self.attr('data-checked','true');
                        that.data._el.input.attr('checked', 'checked');
                        that.data._el.input.prop('checked', true);
                        that.data.checked = true;
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('check');
                        }
                        self.trigger(that.data._triggers.check);
                    };
                    that.uncheck = function(){
                        self.removeClass('radio_checked');
                        self.removeAttr('data-checked');
                        that.data._el.input.removeAttr('checked');
                        that.data._el.input.prop('checked', false);
                        that.data.checked = false;
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('uncheck');
                        }
                        self.trigger(that.data._triggers.uncheck);
                    };

                    that.hover = function(){
                        self.addClass('radio_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('radio_hovered');
                    };
                    that.click = function(){
                        self.addClass('radio_clicked');
                        $('body').one('mouseup.radio touchend.radio', that.unclick);
                    };
                    that.unclick = function(){
                        self.removeClass('radio_clicked');
                    };

                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.radio', that.hover);
                        self.on('mouseout.radio', that.unhover);
                        self.on('mousedown.radio touchstart.radio', that.click);
                        if (typeof that.data._el.label[0] != "undefined") {
                            that.data['_widget']['type'] = 'radio.label';
                            self.bindFirst('click.radio', '.radio__label', null, function (e) {
                                e.preventDefault();
                                if (!that.data.checked) that.check();
                            })
                        }
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data['_widget']['type'] = 'radio.button';
                            self.bindFirst('click.radio', 'button', null, function (e) {
                                e.preventDefault();
                                if (!that.data.checked) that.check();
                            })
                        }
                    };

                    that.init_components = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button();
                        }
                    };
                    that.init = function(){
                        that.data.name = that.data._el.input.attr('name');
                        that.data.value = that.data._el.input.attr('value');
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
    $.fn.radio = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.radio' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="radio"]').radio();
});
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
                        self.removeData();
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
                    that.check = function(value){
                        that.data._el.radio_list.each(function(){
                            var radio = $(this);
                            radio.radio('uncheck');
                            if (radio.radio('value') == value) {
                                radio.radio('check');
                                that.data.checked = true;
                                that.data.value = value;
                            }
                        });
                    };

                    that.init_components = function(){
                        self.find('[data-tooltip]').tooltip();
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
                        that.init_components();
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
        check : function(value) {
            return this.each(function() {
                this.obj.check(value);
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
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'tumbler', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        checked: false,
                        hidden: false,
                        type: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        input: self.find('.tumbler__input'),
                        button: self.find('button')
                    };
                    that.data._triggers = {
                        on: 'on.fc.tumbler',
                        off: 'off.fc.tumbler'
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.addClass('tumbler_disabled');
                        self.attr('data-disabled','true');
                        that.data._el.input.attr('disabled', 'disabled');
                        that.data._el.input.prop('disabled', true);
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
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('disable');
                        }
                    };
                    that.enable = function(){
                        self.removeClass('tumbler_disabled');
                        self.removeAttr('data-disabled');
                        that.data._el.input.removeAttr('disabled');
                        that.data._el.input.prop('disabled', false);
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('enable');
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        self.addClass('tumbler_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('tumbler_hidden');
                        that.data.hidden = false;
                    };

                    that.check = function(){
                        self.addClass('tumbler_checked');
                        that.data._el.input.attr('checked', 'checked');
                        that.data._el.input.prop('checked', true);
                        that.data.checked = true;
                        that.correct();
                        self.trigger(that.data._triggers.on);
                    };
                    that.uncheck = function(){
                        self.removeClass('tumbler_checked');
                        that.data._el.input.removeAttr('checked');
                        that.data._el.input.prop('checked', false);
                        that.data.checked = false;
                        that.correct();
                        self.trigger(that.data._triggers.off);
                    };
                    that.correct = function(){
                        if (that.data.type == 'int') {
                            that.data.checked = (that.data.checked ? 1 : 0);
                        }
                    };

                    that.hover = function(){
                        self.addClass('checkbox_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('checkbox_hovered');
                    };
                    that.click = function(){
                        self.addClass('checkbox_clicked');
                        $('body').one('mouseup.checkbox touchend.checkbox', that.unclick);
                    };
                    that.unclick = function(){
                        self.removeClass('checkbox_clicked');
                    };

                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.checkbox', that.hover);
                        self.on('mouseout.checkbox', that.unhover);
                        self.on('mousedown.checkbox touchstart.checkbox', that.click);
                        that.data._el.button.bindFirst('click.tumbler', null, null, function(){
                            that.data.checked ? that.uncheck() : that.check();
                        })
                    };

                    that.init_components = function(){
                        that.data._el.button.button();
                    };
                    that.init = function(){
                        that.data.name = that.data._el.input.attr('name');
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
        checked : function() {
            if (this.length == 1) {
                var _checked = false;
                this.each(function() {
                    _checked = this.obj.data.checked
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
            return this.tumbler('checked');
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
});

$.fn.bindFirst = function(name, selector, data, handler) {
    this.on(name, selector, data, handler);
    this.each(function() {
        var handlers = $._data(this, 'events')[name.split('.')[0]];
        var handler = handlers.pop();
        handlers.splice(0, 0, handler);
    });
};
$.fn.closestChild = function(selector) {
    var $found = $(),
        $currentSet = this;
    while ($currentSet.length) {
        $found = $currentSet.filter(selector);
        if ($found.length) break;
        $currentSet = $currentSet.children();
    }
    return $found.first();
};
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'alertbox', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        hidden: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        button: self.find('button')
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
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
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('disable');
                        }
                    };
                    that.enable = function(){
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('enable');
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        self.addClass('alertbox_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('alertbox_hidden');
                        that.data.hidden = false;
                    };

                    that.bind = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.on('click', function(e){
                                e.preventDefault();
                                that.destroy();
                            });
                        }
                    };

                    that.init_components = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button();
                        }
                    };
                    that.init = function(){
                        that.init_components();
                        that.bind();
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
        }
    };
    $.fn.alertbox = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.alertbox' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="alertbox"]').alertbox();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'input', target : self });
                    var that = this.obj = {};
                    that.const = {
                        REQUIRED: 'Необходимо заполнить'
                    };
                    that.defaults = {
                        disabled: false,
                        hidden: false,
                        width: '100%',
                        autoclose: true,
                        popup_animation: true,
                        popup_place: 'source', // [source, body]
                        format: 'dd.MM.yyyy',
                        placeholder: null,
                        highlight: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._handlers_input = null;
                    that.data._datepicker = null;
                    that.data._el = {
                        button: self.find('.button').attr('tabIndex', '-1'),
                        input: self.find('.input__control').attr('placeholder', that.data.placeholder),
                        popup: $('<div class="popup"></div>')
                    };

                    that.destroy = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('destroy');
                        }
                        if (that.data._el.popup.data('_widget')) {
                            that.data._el.popup.popup('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.addClass('input_disabled');
                        self.attr('data-disabled','true');
                        that.data._el.input.attr('disabled', 'disabled');
                        that.data._el.input.prop('disabled', true);
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
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('disable');
                        }
                        that.disable_input();
                    };
                    that.enable = function(){
                        self.removeClass('input_disabled');
                        self.removeAttr('data-disabled');
                        that.data._el.input.removeAttr('disabled');
                        that.data._el.input.prop('disabled', false);
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + (ev.namespace? '.' + ev.namespace : ''), ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button('enable');
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                        that.enable_input();
                    };
                    that.hide = function(){
                        self.addClass('input_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('input_hidden');
                        that.data.hidden = false;
                    };

                    that.focus = function(){
                        that.data._el.input.trigger('focus');
                        that.data._el.input.trigger('mousedown');
                    };
                    that.clear = function(isFocus){
                        that.data._el.input.val('');
                        that.data._el.input.trigger('keyup');
                        if (typeof isFocus != 'undefined' && isFocus) {
                            that.focus();
                        }
                    };

                    that.disable_input = function(){
                        if ($._data(that.data._el.input[0], "events")) {
                            that.data._handlers_input = {};
                            for (var type in $._data(that.data._el.input[0], "events")) {
                                that.data._handlers_input[type] = $._data(that.data._el.input[0], "events")[type].slice(0);
                            }
                            that.data._el.input.off();
                        }
                    };
                    that.enable_input = function(){
                        if (that.data._handlers_input) {
                            for (var type in that.data._handlers_input) {
                                that.data._handlers_input[type].forEach(function(ev){
                                    that.data._el.input.on(ev.type + (ev.namespace? '.' + ev.namespace : ''), ev.handler);
                                });
                            }
                        }
                    };

                    that.focusin = function(){
                        self.addClass('input_focused');
                        that.data.focused = true;
                    };
                    that.focusout = function(){
                        self.removeClass('input_focused');
                        that.data.focused = false;
                    };

                    that.set_width = function(value){
                        self.css('width', value);
                    };
                    that.set_value = function(value){
                        that.data.value = value;
                        that.data._el.input.val(value);
                        if (that.data.toggle == 'datepicker') {
                            var date_parts = that.data.value.split(".");
                            var date = new Date(Date.parse(date_parts[2] + '-' + date_parts[1] + '-' + date_parts[0]));
                            if (isNaN(date)) {
                                that.data.value = '';
                                self.removeAttr('data-value');
                            } else {
                                that.data.date = date;
                                that.data.formattedDate = that.data.value;
                                that.data._datepicker.selectDate(date);
                            }
                        }
                        that.highlight();
                    };
                    that.get_value = function(){
                        var val = that.data._el.input.val();
                        if (val == that.data.placeholder) { val = null; }
                        return val;
                    };

                    that.validate = function(){
                        that.data.validate = true;
                        if (that.data.required) {
                            if (that.data._el.input.val() == '') {
                                that.data.validate = false;
                                self.addClass('input__has-error');
                                if (self.parent().find('.control__error').length == 0) {
                                    self.after($('<div class="control__error">' + that.const.REQUIRED + '</div>'));
                                }
                            } else {
                                that.data.validate = true;
                                self.removeClass('input__has-error');
                                if (self.parent().find('.control__error').length != 0) {
                                    self.parent().find('.control__error').remove();
                                }
                            }
                        }
                        return that.data.validate;
                    };
                    that.highlight = function(){
                        if (that.data.highlight) {
                            if (that.data._el.input.val() != '') {
                                self.addClass('input_filled');
                            } else {
                                self.removeClass('input_filled');
                            }
                        }
                    };

                    that.bind = function(){
                        that.data._el.input.bindFirst('focusin.input__control mousedown.input__control touchstart.input__control', null, null, that.focusin);
                        that.data._el.input.bindFirst('focusout.input__control', null, null, that.focusout);
                        if (that.data.highlight) {
                            that.data._el.input.bindFirst('keyup.input__control', null, null, that.highlight);
                        }
                        that.data._el.button.on('click.input__clear', null, null, function(e){
                            e.preventDefault();
                            that.clear();
                        });
                        that.data._el.input.bindFirst('mousedown.input__control', null, null, that.show_datepicker);
                        $('body').on('mouseup.input__control touchend.input__control', that.hide_datepicker);
                    };

                    that.init_components = function(){
                        if (typeof that.data._el.button[0] != "undefined") {
                            that.data._el.button.button();
                        }
                        if (that.data.toggle == 'datepicker') {
                            that.init_datepicker();
                        }
                    };
                    that.init_datepicker = function(){
                        // init popup
                        if (that.data.popup_place == 'source') {
                            self.after(that.data._el.popup);
                        }
                        if (that.data.popup_place == 'body') {
                            $('body').append(that.data._el.popup);
                        }
                        that.data._el.popup.popup({
                            source: self,
                            place: that.data.popup_place,
                            animation: that.data.popup_animation,
                            width: 'auto'
                        });
                        // set date
                        if (that.data.value) {
                            var date_parts = that.data.value.split(".");
                            var date = new Date(Date.parse(date_parts[2] + '-' + date_parts[1] + '-' + date_parts[0]));
                            if (isNaN(date)) {
                                that.data.value = '';
                                self.removeAttr('data-value');
                            } else {
                                that.data.date = date;
                                that.data.formattedDate = that.data.value;
                            }
                        }
                        that.data._el.input.datepicker({
                            inline: true,
                            format: 'dd.mm.yyyy',
                            startDate: (that.data.date ? that.data.date : null),
                            autoClose: that.data.autoclose,
                            onSelect: function(formattedDate, date, inst){
                                that.data.date = date;
                                that.data.formattedDate = formattedDate;
                                if (that.data.autoclose) {
                                    that.data._el.popup.popup('hide');
                                }
                                that.highlight();
                            }
                        });
                        // put datepicker to popup
                        that.data._datepicker = that.data._el.input.data().datepicker;
                        that.data._datepicker.$datepicker.parent().appendTo(that.data._el.popup);
                        // set date continue
                        if (that.data.date) {
                            that.data._datepicker.selectDate(that.data.date);
                        }
                    };
                    that.init = function(){
                        that.init_components();
                        that.bind();
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
                        that.set_width(that.data.width);
                        that.highlight();
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
        focus: function() {
            return this.each(function() {
                this.obj.focus();
            });
        },
        clear : function(isFocus) {
            return this.each(function() {
                this.obj.clear(isFocus);
            });
        },
        set_width : function(value) {
            return this.each(function() {
                this.obj.set_width(value);
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
        },
        value : function(value) {
            if (value) {
                this.each(function() {
                    this.obj.set_value(value);
                });
            } else {
                if (this.length == 1) {
                    var _val = false;
                    this.each(function() {
                        _val = this.obj.get_value();
                    });
                    return _val;
                } else {
                    var _arr = [];
                    this.each(function() {
                        _arr.push(this.obj.get_value());
                    });
                    return _arr;
                }
            }
        }
    };
    $.fn.input = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.input' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="input"]').input();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'textarea', target : self });
                    var that = this.obj = {};
                    that.const = {
                        REQUIRED: 'Необходимо заполнить'
                    };
                    that.defaults = {
                        disabled: false,
                        hidden: false,
                        width: '100%',
                        rows: 5
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.addClass('textarea_disabled');
                        self.attr('data-disabled','true');
                        self.attr('disabled', 'disabled');
                        self.prop('disabled', true);
                        that.data.disabled = true;
                        //save handlers and unbind events
                        if ($._data(self[0], "events")) {
                            that.data._handlers = {};
                            for (var type in $._data(self[0], "events")) {
                                that.data._handlers[type] = $._data(self[0], "events")[type].slice(0);
                            }
                            self.off();
                        }
                    };
                    that.enable = function(){
                        self.removeClass('textarea_disabled');
                        self.removeAttr('data-disabled');
                        self.removeAttr('disabled');
                        self.prop('disabled', false);
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        self.addClass('textarea_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('textarea_hidden');
                        that.data.hidden = false;
                    };

                    that.focus = function(){
                        self.trigger('focus');
                        self.trigger('mousedown');
                    };
                    that.clear = function(){
                        self.val('');
                        self.trigger('keyup');
                        that.focus();
                    };

                    that.focusin = function(){
                        self.addClass('textarea_focused');
                        that.data.focused = true;
                    };
                    that.focusout = function(){
                        self.removeClass('textarea_focused');
                        that.data.focused = false;
                    };

                    that.set_width = function(value){
                        self.css('width', value);
                    };
                    that.set_rows = function(value){
                        if (value) {
                            self.attr('rows', value);
                        }
                    };

                    that.validate = function(){
                        that.data.validate = true;
                        if (that.data.required) {
                            if (self.val() == '') {
                                that.data.validate = false;
                                self.addClass('textarea__has-error');
                                if (self.parent().find('.control__error').length == 0) {
                                    self.after($('<div class="control__error">' + that.const.REQUIRED + '</div>'));
                                }
                            } else {
                                that.data.validate = true;
                                self.removeClass('textarea__has-error');
                                if (self.parent().find('.control__error').length != 0) {
                                    self.parent().find('.control__error').remove();
                                }
                            }
                        }
                        return that.data.validate;
                    };

                    that.bind = function(){
                        self.bindFirst('focusin.textarea mousedown.textarea touchstart.textarea', null, null, that.focusin);
                        self.bindFirst('focusout.textarea', null, null, that.focusout);
                    };

                    that.init_components = function(){};
                    that.init = function(){
                        that.init_components();
                        that.bind();
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
                        that.set_width(that.data.width);
                        that.set_rows(that.data.rows);
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
        focus: function() {
            return this.each(function() {
                this.obj.focus();
            });
        },
        clear : function() {
            return this.each(function() {
                this.obj.clear();
            });
        },
        set_width : function(value) {
            return this.each(function() {
                this.obj.set_width(value);
            });
        },
        set_rows : function(value) {
            return this.each(function() {
                this.obj.set_rows(value);
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
        },
        value : function() {
            if (this.length == 1) {
                var _val = false;
                this.each(function() {
                    _val = $(this).val();
                });
                return _val;
            } else {
                var _arr = [];
                this.each(function() {
                    _arr.push($(this).val());
                });
                return _arr;
            }
        }
    };
    $.fn.textarea = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.textarea' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="textarea"]').textarea();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'card', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        id: null,
                        hiddenLeft: false,
                        hiddenRight: false,
                        menuLeftId: 'id' + (new Date()).valueOf(),
                        menuRightId: 'id' + (new Date()).valueOf()
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);
                    that.data._el = {
                        button_toggle_left: self.closestChild('[data-toggle="left"]').attr('id', that.data.menuLeftId),
                        button_toggle_right: self.closestChild('[data-toggle="right"]').attr('id', that.data.menuRightId),
                        card__main: self.closestChild('.card__main'),
                        card__left: self.closestChild('.card__left'),
                        card__right: self.closestChild('.card__right'),
                        card__backdrop: self.closestChild('.card__backdrop')
                    };

                    that.destroy = function(){
                        self.removeData();
                    };

                    that.hide_left = function(){
                        that.data._el.button_toggle_left.find('.icon').removeClass('icon_rotate_180deg');
                        that.data._el.card__left.addClass('card__left_hidden');
                        that.data._el.card__backdrop.remove();
                        if (typeof setCookie == 'function') {
                            setCookie('card_menu_left_hidden' + (that.data.id ? '_' + that.data.id : ''), true);
                        }
                        $(window).trigger('resize');
                    };
                    that.hide_right = function(){
                        that.data._el.button_toggle_right.find('.icon').removeClass('icon_rotate_180deg');
                        that.data._el.card__right.addClass('card__right_hidden');
                        that.data._el.card__backdrop.remove();
                        if (typeof setCookie == 'function') {
                            setCookie('card_menu_right_hidden' + (that.data.id ? '_' + that.data.id : ''), true);
                        }
                        $(window).trigger('resize');
                    };

                    that.show_left = function(){
                        that.data._el.button_toggle_left.find('.icon').addClass('icon_rotate_180deg');
                        that.data._el.card__left.removeClass('card__left_hidden');
                        that.data._el.card__main.append(
                            that.data._el.card__backdrop.one('click', function(){
                                that.hide_left();
                                that.hide_right();
                            })
                        );
                        if (typeof setCookie == 'function') {
                            setCookie('card_menu_left_hidden' + (that.data.id ? '_' + that.data.id : ''), false);
                        }
                        $(window).trigger('resize');
                    };
                    that.show_right = function(){
                        that.data._el.button_toggle_right.find('.icon').addClass('icon_rotate_180deg');
                        that.data._el.card__right.removeClass('card__right_hidden');
                        that.data._el.card__main.append(
                            that.data._el.card__backdrop.one('click', function(){
                                that.hide_left();
                                that.hide_right();
                            })
                        );
                        if (typeof setCookie == 'function') {
                            setCookie('card_menu_right_hidden' + (that.data.id ? '_' + that.data.id : ''), false);
                        }
                        $(window).trigger('resize');
                    };

                    that.toggle_left = function(){
                        if (that.data._el.card__left.hasClass('card__left_hidden')) {
                            that.show_left();
                        } else {
                            that.hide_left();
                        }
                    };
                    that.toggle_right = function(){
                        if (that.data._el.card__right.hasClass('card__right_hidden')) {
                            that.show_right();
                        } else {
                            that.hide_right();
                        }
                    };

                    that.bind = function(){
                        if (that.data._el.button_toggle_left) {
                            if (that.data._el.button_toggle_left.length > 0) {
                                that.data._el.button_toggle_left.on('click', function(){
                                    that.toggle_left();
                                });
                            }
                        }
                        if (that.data._el.button_toggle_right) {
                            if (that.data._el.button_toggle_right.length > 0) {
                                that.data._el.button_toggle_right.on('click', function(){
                                    that.toggle_right();
                                });
                            }
                        }
                    };

                    that.init_components = function(){
                        if (that.data._el.card__backdrop.length == 0) {
                            that.data._el.card__backdrop = $('<div class="card__backdrop">');
                        }
                        if (that.data._el.button_toggle_left) {
                            if (that.data._el.button_toggle_left.length > 0) {
                                that.data._el.button_toggle_left.button();
                                if (typeof getCookie == 'function') {
                                    that.data.hiddenLeft = (getCookie('card_menu_left_hidden' + (that.data.id ? '_' + that.data.id : '')) == 'true' ? true : false);
                                }
                                if (that.data.hiddenLeft) {
                                    that.hide_left();
                                } else {
                                    that.show_left();
                                }
                                setTimeout(function(){
                                    that.data._el.button_toggle_left.find('.icon').addClass('icon_animate');
                                }, 500);
                            }
                        }
                        if (that.data._el.button_toggle_right) {
                            if (that.data._el.button_toggle_right.length > 0) {
                                that.data._el.button_toggle_right.button();
                                if (typeof getCookie == 'function') {
                                    that.data.hiddenRight = (getCookie('card_menu_right_hidden' + (that.data.id ? '_' + that.data.id : '')) == 'true' ? true : false);
                                }
                                if (that.data.hiddenRight) {
                                    that.hide_right();
                                } else {
                                    that.show_right();
                                }
                                setTimeout(function(){
                                    that.data._el.button_toggle_right.find('.icon').addClass('icon_animate');
                                }, 500);
                            }
                        }
                    };
                    that.init = function(){
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
        }
    };
    $.fn.card = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.card' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="card"]').card();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'tab', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        active: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    /* private */
                    that.data._neighbors = [];
                    that.data._el = {
                        button: self.find('[data-fc="button"]'),
                        tabs__tab: self.closest('.tabs__tab'),
                        tabs__link: self,
                        tabs__pane: self.closest('.card').find('.tabs__pane[id="' + self.attr('href').replace('#','') + '"]')
                    };
                    that.data._triggers = {
                        shown: 'shown.fc.tab',
                        hidden: 'hidden.fc.tab'
                    };

                    that.destroy = function(){
                        that.data._neighbors.forEach(function(el){
                            el.button.button('destroy');
                        });
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        that.data._el.button.button('disable');
                        that.data.disabled = true;
                    };
                    that.enable = function(){
                        that.el.button.button('enable');
                        that.data.disabled = false;
                    };
                    that.show = function(){
                        that.data._neighbors.forEach(function(tab){
                            if (tab.attr('href') != that.data._el.tabs__link.attr('href')) {
                                tab.data()._el.button.button('enable');
                                tab.data()._el.tabs__tab.removeClass('tabs__tab_active');
                                tab.data()._el.tabs__pane.removeClass('tabs__pane_active');
                                tab.data().active = false;
                                tab.data().disabled = false;
                                tab.trigger(that.data._triggers.hidden);
                            }
                        });
                        that.data._el.button.button('disable');
                        that.data._el.tabs__tab.addClass('tabs__tab_active');
                        that.data._el.tabs__pane.addClass('tabs__pane_active');
                        that.data.active = true;
                        that.data.disabled = true;
                        that.data._el.tabs__link.trigger(that.data._triggers.shown);
                    };

                    that.check_active = function(){
                        if (that.data._el.tabs__tab.hasClass('tabs__tab_active')) {
                            that.show();
                        }
                    };
                    that.get_neighbors = function(){
                        self.closest('.tabs').find('[data-fc="tab"]').each(function(){
                            var tab = $(this).tabs();
                            that.data._neighbors.push(tab);
                        });
                    };

                    that.set_text = function(value){
                        that.data._el.button.button('set_text', value);
                    };

                    that.bind = function(){
                        that.data._el.tabs__link.on('click', function(e){
                            e.preventDefault();
                            if (!that.data._el.tabs__tab.hasClass('tabs__tab_active')) {
                                that.show();
                                if (typeof that.data.onclick == 'function') {
                                    that.data.onclick(that.data.data);
                                }
                            }
                        });
                    };

                    that.init_components = function(){
                        that.data._el.button.button();
                    };
                    that.init = function(){
                        that.init_components();
                        that.get_neighbors();
                        that.bind();
                        that.check_active();
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
        show : function() {
            return this.each(function() {
                this.obj.show();
            });
        },
        set_text : function(value) {
            return this.each(function() {
                this.obj.set_text(value);
            });
        }
    };
    $.fn.tabs = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.tabs' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="tab"]').tabs();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_tooltip');
                if (!data) {
                    var that = this.tooltip = {};
                    that.defaults = {
                        follow: true,
                        tooltip: self.attr('data-tooltip')
                    };
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
                        that.data._tooltip.tooltip.css({
                            width: 'auto'
                        });
                    };
                    that.hide = function () {
                        that.destroy();
                        self.off('mousemove.tooltip');
                    };
                    that.show = function (e) {
                        that.render();
                        if (that.data.follow) {
                            that.follow(e);
                            self.on('mousemove.tooltip', that.follow);
                        } else {
                            that.put(e);
                        }
                    };

                    that.put = function(e) {
                        that.data._tooltip.tooltip.addClass('tooltip_visible');
                        that.data._tooltip.tooltip__arrow.removeClass('tooltip__arrow_bottom');
                        that.data._tooltip.tooltip__arrow.addClass('tooltip__arrow_top');
                        var yOffset = 10;
                        var padding = 10;
                        var ttw = Math.ceil(that.data._tooltip.tooltip.width());
                        var tth = Math.ceil(that.data._tooltip.tooltip.outerHeight());
                        var curX = self.offset().left + self[0].getBoundingClientRect().width/2;
                        var curY = self.offset().top;
                        var ttleft = curX - ttw / 2;
                        var tttop = curY - tth - yOffset;
                        if (ttleft - padding < 0) {
                            ttleft = padding;
                            if (ttleft + ttw + padding > $(window).width()) {
                                ttw = $(window).width() - padding * 2;
                            }
                        } else if (ttleft + ttw + padding > $(window).width()) {
                            ttleft = $(window).width() - padding - ttw;
                            if (ttleft - padding < 0) {
                                ttw = $(window).width() - padding * 2;
                            }
                        }
                        if (tttop < 0) {
                            tttop = curY + self[0].getBoundingClientRect().height + yOffset;
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
                            left: ttleft
                        });
                        that.data._tooltip.tooltip__arrow.css({
                            left: taleft
                        });
                    };
                    that.follow = function (e) {
                        that.data._tooltip.tooltip.addClass('tooltip_visible');
                        that.data._tooltip.tooltip__arrow.removeClass('tooltip__arrow_bottom');
                        that.data._tooltip.tooltip__arrow.addClass('tooltip__arrow_top');
                        var yOffset = 25;
                        var padding = 10;
                        var ttw = Math.ceil(that.data._tooltip.tooltip.width());
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
                                ttw = $(window).width() - padding * 2;
                            }
                        } else if (ttleft + ttw + padding > $(window).width()) {
                            ttleft = $(window).width() - padding - ttw;
                            if (ttleft - padding < 0) {
                                ttw = $(window).width() - padding * 2;
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
                            left: ttleft
                        });
                        that.data._tooltip.tooltip__arrow.css({
                            left: taleft
                        });
                    };

                    that.render = function () {
                        var tooltip = '';
                        if (self.attr('title')) {
                            self.data('tooltip', self.attr('title'));
                            self.removeAttr('title');
                        }
                        if (self.data('tooltip')) {
                            that.data.tooltip = self.data('tooltip');
                        }
                        if (that.data.tooltip) {
                            tooltip = that.data.tooltip;
                        }
                        if (tooltip != '') {
                            $('body').append(
                                that.data._tooltip.tooltip.append(
                                    that.data._tooltip.tooltip__text.html(tooltip),
                                    that.data._tooltip.tooltip__arrow
                                )
                            );
                        }
                    };
                    that.update = function(tooltip){
                        that.data.tooltip = tooltip;
                        that.data._tooltip.tooltip__text.html(that.data.tooltip);
                    };

                    that.bind = function () {
                        self.on('mouseover.tooltip', that.show);
                        self.on('mouseout.tooltip', that.hide);
                    };

                    that.init = function () {
                        that.bind();
                    };
                    that.init();
                }
                return this;
            });
        },
        hide : function(e) {
            return this.each(function() {
                this.tooltip.hide(e);
            });
        },
        show : function(e) {
            return this.each(function() {
                this.tooltip.show(e);
            });
        },
        update : function(tooltip) {
            return this.each(function() {
                this.tooltip.update(tooltip);
            });
        },
        clear : function(e) {
            return this.each(function() {
                $('.tooltip').remove();
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
    $('body').on('mouseover', '[data-tooltip]', function(event) {
        $(event.currentTarget).tooltip();
        $(event.currentTarget).trigger('mouseover.tooltip');
    });
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget_grid', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        items: [],
                        single: false,
                        margin: true,
                        closely: false,
                        lib: null,
                        widget_buttons: [],
                        widget_collapse_callback: null,
                        mode: 'view',
                        disabled: true,
                        grid: {
                            verticalMargin: 10,
                            cellHeight: 20,
                            disableDrag: true,
                            disableResize: true,
                            resizable: { handles: 'e, se, s, sw, w' }
                        },
                        collapsed_widget_height: 1
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        grid: null,
                        nodes: []
                    };

                    that.destroy = function(){
                        that.clear();
                        self.removeData();
                        self.remove();
                    };
                    that.clear = function(){
                        that.data._el.grid.removeAll();
                        _.each(that.data._el.nodes, function(node) {
                            node.widget.widget('destroy');
                        });
                        that.data._el.nodes = [];
                    };
                    that.save = function(callback){
                        that.data.items = _.map(self.children('.grid-stack-item:visible'), function(el) {
                            el = $(el);
                            var node = that.get(el);
                            return {
                                x: node.x,
                                y: node.y,
                                width: node.width,
                                height: node.height,
                                settings: _.omitBy(node.widget.data(), function(val, key){
                                    return (key.substring(0,1) == '_') ||
                                        (key == 'mode') ||
                                        (key == 'loader') ||
                                        (key == 'library') ||
                                        (key == 'libraries') ||
                                        (key == 'lib') ||
                                        (key == 'content') ||
                                        (key == 'buttons') ||
                                        (key == 'id') ||
                                        (key == 'reloadable');
                                })
                            };
                        }, this);
                        if (typeof callback == "function") { callback(that.data.items); }
                    };

                    that.load = function(){
                        that.data._el.grid.removeAll();
                        var items = GridStackUI.Utils.sort(that.data.items);
                        _.each(items, function(item) {
                            that.load_widget(item);
                        });
                    };
                    that.load_items = function(items){
                        that.clear();
                        that.data.items = $.extend(true, {}, items);
                        that.load();
                    };
                    that.load_widget = function(node){
                        if (that.data.single) {
                            node.settings.name = that.data.pageid;
                        }
                        if (node.settings.id) {
                            node._id = node.settings.id;
                        } else {
                            node._id = Date.now();
                            node.settings.id = node._id;
                        }
                        node._height = node.height;
                        node.settings.buttons = $.extend([], that.data.widget_buttons, node.settings.buttons);
                        node.settings.reloadable = true;
                        node.settings.lib = that.data.lib;
                        if (that.data.loader) {
                            node.settings.loader = that.data.loader;
                        }
                        //node.settings.library = that.data.library;
                        node.settings.params = that.data.params;
                        node.widget = $('<div class="widget" id="' + node._id + '"></div>').widget(node.settings);
                        node.el = $('<div><div class="grid-stack-item-content"></div></div>');
                        _.unset(node, 'settings');

                        node.el.find('.grid-stack-item-content').append(node.widget);
                        if (node.widget.data().collapsible) {
                            node.widget.data()._el.button_collapse.off('click.widget');
                            node.widget.data()._el.button_collapse.on('click.widget-grid', function(){
                                if (node.widget.data().collapsed) {
                                    that.expand_widget(node._id, true);
                                } else {
                                    that.collapse_widget(node._id, true);
                                }
                            });
                        }
                        node.widget.widget('edit_mode');

                        that.data._el.grid.addWidget(node.el, node.x, node.y, node.width, node.height);
                        that.data._el.nodes.push(node);
                        that.set(node.el, node);
                    };

                    that.add_widget = function(item, callback){
                        that.load_widget(item);
                        if (typeof callback == "function") {
                            var data = $.extend(true, {}, item);
                            _.unset(data, 'el');
                            _.unset(data, 'widget');
                            callback(data);
                        }
                    };
                    that.remove_widget = function(_id, callback) {
                        var node = that.data._el.nodes.filter(function(d){ return d._id == _id; });
                        if (node.length > 0) { node = node[0]; }
                        that.data._el.grid.removeWidget(node.el);
                        that.data._el.nodes = that.data._el.nodes.filter(function(d){ return d._id !== node._id; });
                        if (typeof callback == "function") { callback(item); }
                    };
                    that.update_widget = function(_id, x, y, width, height, callback){
                        var node = that.data._el.nodes.filter(function(d){ return d._id == _id; });
                        if (node.length > 0) { node = node[0]; }
                        that.data._el.grid.update(node.el, x, y, width, height);
                        if (typeof callback == "function") { callback(item); }
                    };

                    that.collapse_widget = function(_id, save_state){
                        var node = that.data._el.nodes.filter(function(d){ return d._id == _id; });
                        if (node.length > 0) {
                            node = node[0];
                            var _collapsed = node.widget.data().collapsed;
                            that.update_widget(node._id, null, null, null, that.data.collapsed_widget_height);
                            node.widget.widget('collapse');
                            if (!save_state) {
                                node.widget.data().collapsed = _collapsed;
                            }
                        }
                    };
                    that.expand_widget = function(_id, save_state){
                        var node = that.data._el.nodes.filter(function(d){ return d._id == _id; });
                        if (node.length > 0) {
                            node = node[0];
                            var _collapsed = node.widget.data().collapsed;
                            that.update_widget(node._id, null, null, null, node._height);
                            node.widget.widget('expand');
                            if (!save_state) {
                                node.widget.data().collapsed = _collapsed;
                            }
                        }
                    };

                    that.edit_mode = function(){
                        that.data.mode = 'edit';
                        _.each(that.data._el.nodes, function(node) {
                            node.widget.widget('edit_mode');
                            node.widget.data().buttons.forEach(function(button){
                                if (button.mode == 'edit') {
                                    button._el.button('show');
                                }
                                if (button.mode == 'view') {
                                    button._el.button('hide');
                                }
                            });
                            that.expand_widget(node._id, false);
                        });
                        that.enable();
                        that.resize();
                    };
                    that.view_mode = function(){
                        that.data.mode = 'view';
                        _.each(that.data._el.nodes, function(node) {
                            node._height = that.get(node.el).height;
                            node.widget.widget('view_mode');
                            node.widget.data().buttons.forEach(function(button){
                                if (button.mode == 'edit') {
                                    button._el.button('hide');
                                }
                                if (button.mode == 'view') {
                                    button._el.button('show');
                                }
                            });
                            if (node.widget.data().collapsed) {
                                that.collapse_widget(node._id, false);
                            } else {
                                that.expand_widget(node._id, false);
                            }
                        });
                        that.disable();
                        that.resize();
                    };

                    that.create = function(){
                        if (self.hasClass('grid-stack')) {
                            if (that.data.single) {
                                self.addClass('widget-grid_single');
                            } else {
                                self.addClass('widget-grid_multiple');
                            }
                            if (!that.data.margin) {
                                self.addClass('widget-grid_margin_none');
                            }
                            if (that.data.closely) {
                                self.addClass('widget-grid_closely');
                            }
                            self.gridstack(that.data.grid);
                            that.data._el.grid = self.data('gridstack');
                            return true;
                        } else {
                            $.error( 'Container does not have class .grid-stack' );
                            return false;
                        }
                    };
                    that.enable = function(){
                        that.data.disabled = false;
                        that.data._el.grid.enableMove(true, true);
                        that.data._el.grid.enableResize(true, true);
                    };
                    that.disable = function(){
                        that.data.disabled = true;
                        that.data._el.grid.enableMove(false, true);
                        that.data._el.grid.enableResize(false, true);
                    };

                    that.set = function(el, data){
                        $.extend(el.data('_gridstack_node'), data);
                    };
                    that.get = function(el){
                        return el.data('_gridstack_node');
                    };

                    that.resize = function(){
                        _.each(that.data._el.nodes, function(node) {
                            node.widget.widget('resize');
                        });
                    };

                    that.init_collapsed_widget_height = function(){
                        if (typeof getCookie == 'function') {
                            that.data.collapsed_widget_height = +getCookie('collapsed_widget_height');
                        }
                    };
                    that.init_resize = function(){
                        $(window).on('resize', function(){
                            that.resize();
                        });
                    };
                    that.init = function(){
                        that.init_collapsed_widget_height();
                        if (that.create()) {
                            that.load();
                            if (that.data.mode == 'view') {
                                that.view_mode();
                            } else {
                                that.edit_mode();
                            }
                            that.init_resize();
                        }
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
        clear : function() {
            return this.each(function() {
                this.obj.clear();
            });
        },
        edit_mode : function() {
            return this.each(function() {
                this.obj.edit_mode();
            });
        },
        view_mode : function() {
            return this.each(function() {
                this.obj.view_mode();
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
        save : function(callback) {
            return this.each(function() {
                this.obj.save(callback);
            });
        },
        add_widget : function(item, callback) {
            return this.each(function() {
                this.obj.add_widget(item, callback);
            });
        },
        remove_widget : function(_id, callback) {
            return this.each(function() {
                this.obj.remove_widget(_id, callback);
            });
        },
        update_widget : function(_id, x, y, width, height, callback) {
            return this.each(function() {
                this.obj.update_widget(_id, x, y, width, height, callback);
            });
        },
        resize : function() {
            return this.each(function() {
                this.obj.resize();
            });
        },
        load_items : function(items) {
            return this.each(function() {
                this.obj.load_items(items);
            });
        }
    };
    $.fn.widget_grid = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.widget_grid' );
        }
    };
})( jQuery );
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'particles', target : self });
                    var that = this.obj = {};
                    that.const = {
                        COLOR_BLUE: '#4983c4',
                        COLOR_DEFAULT: '#333',
                        COLOR_PURPLE: '#8e6bf5',
                        COLOR_RED: '#ff5940',
                        COLOR_WHITE: '#fff'
                    };
                    that.defaults = {
                        color_nodes: 'default',
                        color_nodes_value: that.const.COLOR_WHITE,
                        color_background: null,
                        color_background_value: that.const.COLOR_BLUE
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.init_color = function(){
                        if (that.data.color_nodes == 'blue'){
                            that.data.color_nodes_value = that.const.COLOR_BLUE;
                        }
                        if (that.data.color_nodes == 'default'){
                            that.data.color_nodes_value = that.const.COLOR_DEFAULT;
                        }
                        if (that.data.color_nodes == 'purple'){
                            that.data.color_nodes_value = that.const.COLOR_PURPLE;
                        }
                        if (that.data.color_nodes == 'red'){
                            that.data.color_nodes_value = that.const.COLOR_RED;
                        }
                        if (that.data.color_nodes == 'white'){
                            that.data.color_nodes_value = that.const.COLOR_WHITE;
                        }
                        if (that.data.color_background) {
                            if (that.data.color_background == 'blue'){
                                that.data.color_background_value = that.const.COLOR_BLUE;
                            }
                            if (that.data.color_background == 'default'){
                                that.data.color_background_value = that.const.COLOR_DEFAULT;
                            }
                            if (that.data.color_background == 'purple'){
                                that.data.color_background_value = that.const.COLOR_PURPLE;
                            }
                            if (that.data.color_background == 'red'){
                                that.data.color_background_value = that.const.COLOR_RED;
                            }
                            if (that.data.color_background == 'white'){
                                that.data.color_background_value = that.const.COLOR_WHITE;
                            }
                            self.css({ 'background-color': that.data.color_background_value });
                        }
                    };
                    that.init = function(){
                        that.init_color();
                        that.data.id = 'particles_' + Date.now();
                        self.attr('id', that.data.id);
                        particlesJS(that.data.id, {
                            "particles": {
                                "number": {
                                    "value": 80,
                                    "density": {
                                        "enable": true,
                                        "value_area": 800
                                    }
                                },
                                "color": {
                                    "value": that.data.color_nodes_value
                                },
                                "shape": {
                                    "type": "circle",
                                    "stroke": {
                                        "width": 0,
                                        "color": that.data.color_nodes_value
                                    },
                                    "polygon": {
                                        "nb_sides": 5
                                    },
                                    "image": {
                                        "src": "img/github.svg",
                                        "width": 100,
                                        "height": 100
                                    }
                                },
                                "opacity": {
                                    "value": 0.5,
                                    "random": false,
                                    "anim": {
                                        "enable": false,
                                        "speed": 1,
                                        "opacity_min": 0.1,
                                        "sync": false
                                    }
                                },
                                "size": {
                                    "value": 3,
                                    "random": true,
                                    "anim": {
                                        "enable": false,
                                        "speed": 40,
                                        "size_min": 0.1,
                                        "sync": false
                                    }
                                },
                                "line_linked": {
                                    "enable": true,
                                    "distance": 150,
                                    "color": that.data.color_nodes_value,
                                    "opacity": 0.25,
                                    "width": 1
                                },
                                "move": {
                                    "enable": true,
                                    "speed": 3,
                                    "direction": "none",
                                    "random": true,
                                    "straight": false,
                                    "out_mode": "out",
                                    "bounce": false,
                                    "attract": {
                                        "enable": false,
                                        "rotateX": 600,
                                        "rotateY": 1200
                                    }
                                }
                            },
                            "interactivity": {
                                "detect_on": "canvas",
                                "events": {
                                    "onhover": {
                                        "enable": true,
                                        "mode": "grab"
                                    },
                                    "onclick": {
                                        "enable": true,
                                        "mode": "repulse"
                                    },
                                    "resize": true
                                },
                                "modes": {
                                    "grab": {
                                        "distance": 200,
                                        "line_linked": {
                                            "opacity": 0.5
                                        }
                                    },
                                    "bubble": {
                                        "distance": 400,
                                        "size": 5,
                                        "duration": 2,
                                        "opacity": 1,
                                        "speed": 3
                                    },
                                    "repulse": {
                                        "distance": 200,
                                        "duration": 0.4
                                    },
                                    "push": {
                                        "particles_nb": 4
                                    },
                                    "remove": {
                                        "particles_nb": 2
                                    }
                                }
                            },
                            "retina_detect": true
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
    };
    $.fn.particles = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.particles' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="particles"]').particles();
});
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
                        selects: []
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.get = function(){
                        that.data._el.button_submit = self.find('button[type="submit"]');
                    };
                    that.get_controls = function(){
                        if (that.data._el.inputs.length == 0) {
                            that.data._el.inputs = self.find('[data-fc="input"]');
                            that.bind_validate_inputs();
                        }
                        if (that.data._el.selects.length == 0) {
                            that.data._el.selects = self.find('[data-fc="select"]');
                            that.bind_validate_selects();
                        }
                    };
                    that.validate = function(){
                        that.data.validate = true;
                        that.data._el.inputs.each(function(){
                            if (!$(this).input('validate')) {
                                that.data.validate = false;
                            }
                        });
                        that.data._el.selects.each(function(){
                            if (!$(this).select('validate')) {
                                that.data.validate = false;
                            }
                        });
                        return that.data.validate;
                    };
                    that.bind = function(){
                        that.data._el.button_submit.on('click', function(e){
                            if (!that.validate()) {
                                e.preventDefault();
                            }
                        });
                    };
                    that.bind_validate_inputs = function(){
                        that.data._el.inputs.each(function(){
                            var $input = $(this);
                            if ($input.data().required) {
                                $input.data()._el.input.on('blur', function(){
                                    $input.input('validate');
                                })
                            }
                        });
                    };
                    that.bind_validate_selects = function(){
                        that.data._el.selects.each(function(){
                            var $select = $(this);
                            if ($select.data().required) {
                                $select.on('change', function(){
                                    $select.select('validate');
                                })
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
                        self.find('[data-fc="select"]').select();
                    };
                    that.init = function(){
                        that.get();
                        that.init_components();
                        that.get_controls();
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
        get_controls : function() {
            return this.each(function() {
                this.obj.get_controls();
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
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'modal__', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        buttons: [
                            {
                                name: 'destroy',
                                action: 'destroy',
                                icon: 'icon_svg_close'
                            }
                        ],
                        header: {
                            icon: null,
                            caption: null,
                            name: null
                        },
                        footer: {
                            buttons: null
                        },
                        content: null,
                        /*
                        content: {
                            tabs: [
                                {
                                    id: "general",
                                    name: 'Главная',
                                    padding: null
                                }
                            ]
                        },
                        */
                        data: null,
                        show: true,
                        position: null,
                        size: null,
                        draggable: false,
                        resizable: false,
                        draggable_grid_size: 1,
                        render_tabs_row: true,
                        render_backdrop: true,
                        fullscreen: {
                            active: false,
                            dimentions: null
                        }
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        modal__view: $('<div class="modal__view"></div>'),
                        modal__backdrop: $('<div class="modal__backdrop"></div>'),
                        modal__dialog: $('<div class="modal__dialog modal__dialog_hidden"></div>'),
                        modal__dialog_handle_NE: $('<div class="modal__dialog_handle modal__dialog_handle_NE"></div>'),
                        modal__dialog_handle_NN: $('<div class="modal__dialog_handle modal__dialog_handle_NN"></div>'),
                        modal__dialog_handle_NW: $('<div class="modal__dialog_handle modal__dialog_handle_NW"></div>'),
                        modal__dialog_handle_WW: $('<div class="modal__dialog_handle modal__dialog_handle_WW"></div>'),
                        modal__dialog_handle_EE: $('<div class="modal__dialog_handle modal__dialog_handle_EE"></div>'),
                        modal__dialog_handle_SW: $('<div class="modal__dialog_handle modal__dialog_handle_SW"></div>'),
                        modal__dialog_handle_SS: $('<div class="modal__dialog_handle modal__dialog_handle_SS"></div>'),
                        modal__dialog_handle_SE: $('<div class="modal__dialog_handle modal__dialog_handle_SE"></div>'),
                        card: $('<div class="card" data-fc="card"></div>'),
                        card__header: $('<div class="card__header"></div>'),
                        card__header_row_caption: $('<div class="card__header-row"></div>'),
                        card__header_row_name: $('<div class="card__header-row"></div>'),
                        card__header_row_tabs: $('<div class="card__header-row tabs"></div>'),
                        card__footer: $('<div class="card__header"></div>'),
                        card__footer_row: $('<div class="card__header-row"></div>'),
                        card__main: $('<div class="card__main"></div>'),
                        card__middle: $('<div class="card__middle"></div>'),
                        card__middle_scroll: $('<div class="card__middle-scroll"></div>'),
                        card__backdrop: $('<div class="card__backdrop"></div>'),
                        card__right: $('<div class="card__right"></div>'),
                        tabs__list: $('<ul class="tabs__list"></ul>'),
                        tabs_pane: $('<div class="tabs__pane"></div>')
                    };
                    that.data._triggers = {
                        show: 'show.fc.modal',
                        shown: 'shown.fc.modal',
                        showed: 'showed.fc.modal',
                        hide: 'hide.fc.modal',
                        hidden: 'hidden.fc.modal',
                        loaded: 'loaded.fc.modal',
                        drag: 'drag.fc.modal'
                    };

                    that.destroy = function(){
                        that.hide();
                        setTimeout(function(){
                            self.removeData();
                            self.remove();
                        }, 500);
                    };
                    that.hide = function(){
                        that.data.transitioning = true;
                        that.data._el.modal__dialog.removeClass('modal__dialog_draggable');
                        self.trigger(that.data._triggers.hide);
                        that.data._el.modal__dialog.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e){
                            if (that.data.transitioning) {
                                that.data.transitioning = false;
                                $(this).off(e);
                                self.addClass('modal_hidden');
                                self.trigger(that.data._triggers.hidden);
                            }
                        }).addClass('modal__dialog_hidden');
                        that.data.show = false;
                    };
                    that.hidden = function(){
                        that.data._el.modal__dialog.addClass('modal__dialog_hidden');
                        self.addClass('modal_hidden');
                        that.data.show = false;
                    };
                    that.show = function(){
                        that.data.transitioning = true;
                        self.trigger(that.data._triggers.show);
                        that.set_forward();
                        self.removeClass('modal_hidden');
                        setTimeout(function(){
                            that.data._el.modal__dialog.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e){
                                if (that.data.transitioning) {
                                    that.data.transitioning = false;
                                    $(this).off(e);
                                    setTimeout(function(){
                                        that.data._el.card.css('max-height', '100%');
                                        that.data._el.card.css('height', '100%');
                                        if (that.data.draggable) {
                                            that.init_draggable();
                                        }
                                        if (that.data.resizable) {
                                            that.init_resizable();
                                        }
                                        if (!that.data.render_backdrop && (that.data.draggable || that.data.resizable)) {
                                            self.append(that.data._el.modal__dialog);
                                            that.data._el.modal__view.remove();
                                        }
                                        self.trigger(that.data._triggers.shown);
                                        self.trigger(that.data._triggers.showed);
                                    }, 250);
                                }
                            }).removeClass('modal__dialog_hidden');
                        }, 100);
                        that.data.show = true;
                    };
                    that.fullscreen = function(){
                        if (that.data.fullscreen.active) {
                            that.data.fullscreen.active = false;
                            that.data._el.modal__dialog.css(that.data.fullscreen.dimentions);
                        } else {
                            that.data.fullscreen.active = true;
                            that.data.fullscreen.dimentions = {
                                left: that.data._el.modal__dialog.offset().left,
                                top: that.data._el.modal__dialog.offset().top,
                                height: that.data._el.modal__dialog.outerHeight(),
                                width: that.data._el.modal__dialog.outerWidth()
                            };
                            that.data._el.modal__dialog.css({
                                top: 5,
                                left: 5,
                                width: that.data._el.modal__view.width(),
                                height: that.data._el.modal__view.height()
                            });
                        }
                    };

                    that.render = function(){
                        that.render_view();
                        that.render_header();
                        that.render_footer();
                        that.render_tabs_row();
                    };
                    that.render_view = function(){
                        self.append(that.data._el.modal__view
                            .append((that.data.render_backdrop ? that.data._el.modal__backdrop : null), that.data._el.modal__dialog
                                .append(that.data._el.card
                                    .append(that.data._el.card__header
                                        .append(
                                        (that.data.header.caption || that.data.buttons ? that.data._el.card__header_row_caption : null),
                                        (that.data.header.name ? that.data._el.card__header_row_name : null),
                                        (that.data.render_tabs_row ? that.data._el.card__header_row_tabs.append(that.data._el.tabs__list) : null)),
                                    (that.data.content ?
                                        that.data._el.card__main
                                            .append(that.data._el.card__middle
                                                .append(that.data._el.card__middle_scroll)) : null),
                                    (that.data.footer.buttons ? that.data._el.card__footer.append(that.data._el.card__footer_row) : null)
                                )
                            )));
                    };
                    that.render_header = function(){
                        if (!that.data.content) {
                            that.data._el.card__header.addClass('card__header-border_bottom_none');
                        }
                        that.render_header_caption();
                        that.render_header_name();
                    };
                    that.render_header_caption = function(){
                        that.render_header_caption_name();
                        if (that.data.buttons) {
                            that.render_header_caption_buttons();
                        }
                    };
                    that.render_header_caption_name = function(){
                        that.data._el.card__header_row_caption.append(
                            $('<div class="card__header-column"></div>').append(
                                (that.data.header.caption ?
                                    $([
                                        '<label class="card__caption">' +
                                        '<span class="card__caption-text bold">' + that.data.header.caption + '</span>' +
                                        '</label>'
                                    ].join('')) : null)
                            )
                        );
                    };
                    that.render_header_caption_buttons = function(){
                        var $buttons_column = $('<div class="card__header-column"></div>');
                        if (that.data.header.caption) {
                            that.data._el.card__header_row_caption.append($buttons_column);
                        } else {
                            that.data._el.card__header_row_name.append($buttons_column);
                        }
                        that.data.buttons.forEach(function(button){
                            var $button = $(
                                '<button class="button button__' + button.name + '" data-fc="button"' +
                                (button.id ? ' id="' + button.id + '"' : '') +
                                (button.tooltip ? ' data-tooltip="' + button.tooltip + '"' : '') + '>' +
                                (button.icon ? '<span class="icon ' + button.icon + '"></span>' : '') +
                                (button.caption ? '<span class="button__text"> ' + button.caption + '</span>' : '') +
                                '</button>'
                            );
                            if (button.action) {
                                if (typeof that[button.action] === "function") {
                                    $button.on('click', that[button.action]);
                                }
                                if (!that.data._triggers[button.action]) {
                                    $button.on('click', function(){
                                        self.trigger(button.action + '.fc.modal', [that.data.items]);
                                    });
                                }
                            }
                            $buttons_column.append($button);
                        });
                    };
                    that.render_header_name = function(){
                        that.data._el.card__header_row_name.prepend($(
                            '<div class="card__header-column card__header-column_start card__header-column_flex_1-1-auto">' +
                                '<label class="card__name">' +
                                    '<span class="card__name-text">' + that.data.header.name + '</span>' +
                                '</label>' +
                            '</div>'
                        ));
                    };
                    that.render_footer = function(){
                        if (that.data.footer.buttons) {
                            that.render_footer_buttons();
                        }
                    };
                    that.render_footer_buttons = function(){
                        var $buttons_column = $('<div class="card__header-column"></div>');
                        that.data._el.card__footer_row.append($buttons_column);
                        that.data.footer.buttons.forEach(function(button){
                            var $button = $(
                                '<button class="button button__' + button.name + '" data-fc="button"' +
                                (button.id ? ' id="' + button.id + '"' : '') +
                                (button.tooltip ? ' data-tooltip="' + button.tooltip + '"' : '') + '>' +
                                (button.icon ? '<span class="icon ' + button.icon + '"></span>' : '') +
                                (button.caption ? '<span class="button__text"> ' + button.caption + '</span>' : '') +
                                '</button>'
                            );
                            if (button.action) {
                                if (typeof that[button.action] === "function") {
                                    $button.on('click', that[button.action]);
                                }
                                if (!that.data._triggers[button.action]) {
                                    $button.on('click', function(){
                                        self.trigger(button.action + '.fc.modal', [that.data.items]);
                                    });
                                }
                            }
                            $buttons_column.append($button);
                        });
                    };
                    that.render_tabs_row = function(){
                        if (that.data.content) {
                            if (that.data.content.tabs) {
                                if (that.data.content.tabs.length > 0) {
                                    if (that.data.content.tabs.length == 1) {
                                        that.data.content.tabs[0].active = true;
                                    } else {
                                        var has_active_tab = false;
                                        that.data.content.tabs.forEach(function(tab) {
                                            if (tab.active) {
                                                has_active_tab = true;
                                            }
                                        });
                                        if (!has_active_tab) {
                                            that.data.content.tabs[0].active = true;
                                        }
                                    }
                                }
                                that.data.content.tabs.forEach(function(tab){
                                    var $tab__link = $([
                                        '<a class="tabs__link link" href="#' + tab.id + '" data-fc="tab">',
                                        '<button class="button" data-fc="button">',
                                        '<span class="button__text">' + tab.name + '</span>',
                                        '</button>',
                                        '</a>'
                                    ].join(''));
                                    $tab__link.data('data', tab.data);
                                    $tab__link.data('onclick', tab.onclick);
                                    that.data._el.tabs__list.append(
                                        $((tab.active ? '<li class="tabs__tab tabs__tab_active"></li>' : '<li class="tabs__tab"></li>' ))
                                            .append(
                                            $tab__link
                                        )
                                    );
                                    that.data._el.card__middle_scroll.append(
                                        that.data._el.tabs_pane.clone()
                                            .attr('id', tab.id)
                                            .css('padding', (tab.padding ? tab.padding : null))
                                            .addClass((tab.active ? 'tabs__pane_active' : ''))
                                            .append(tab.content));
                                });
                            }
                        }
                    };

                    that.bind = function(){
                        self.find('.modal__backdrop').on('click', that.destroy);
                    };
                    that.bind_buttons = function(){
                        that.data.buttons.forEach(function(button){
                            var $button = $(button.selector);
                            if (button.action) {
                                if (typeof that[button.action] === "function") {
                                    $button.on('click', that[button.action]);
                                }
                                if (!that.data._triggers[button.action]) {
                                    $button.on('click', function(){
                                        self.trigger(button.action + '.fc.modal', [that.data.items]);
                                    });
                                }
                            }
                        });
                        that.data.footer.buttons.forEach(function(button){
                            var $button = $(button.selector);
                            if (button.action) {
                                if (typeof that[button.action] === "function") {
                                    $button.on('click', that[button.action]);
                                }
                                if (!that.data._triggers[button.action]) {
                                    $button.on('click', function(){
                                        self.trigger(button.action + '.fc.modal', [that.data.items]);
                                    });
                                }
                            }
                        });
                    };

                    that.set_position = function(){
                        if (that.data.position) {
                            that.data._el.modal__view.addClass('modal__view_align_' + that.data.position.split(' ').join('_'));
                        }
                    };
                    that.set_size = function(){
                        if (that.data.size) {
                            that.data._el.modal__dialog.addClass('modal__dialog_size_' + that.data.size);
                        }
                    };
                    that.set_forward = function(){
                        $('.modal__dialog').css('z-index', 1038);
                        that.data._el.modal__dialog.css('z-index', 1039);
                    };

                    that.init_draggable = function(){
                        var dimm = that.data._el.modal__dialog.offset();
                        that.data._el.modal__dialog
                            .css(dimm)
                            .addClass('modal__dialog_absolute')
                            .addClass('modal__dialog_draggable')
                            .drag('start', function(ev, dd){
                                that.set_forward();
                                dd.attr = $(ev.target).prop('className');
                                dd.width = $(this).width();
                                dd.height = $(this).height();
                            })
                            .drag(function(ev, dd){
                                that.data.fullscreen.active = false;
                                var props = {};
                                if (dd.attr.indexOf('card__header') > -1 ||
                                    dd.attr.indexOf('card__caption') > -1 ||
                                    dd.attr.indexOf('card__name') > -1) {
                                    props.top = dd.offsetY;
                                    props.left = dd.offsetX;
                                }
                                $(this).css({
                                    top: Math.round(props.top / that.data.draggable_grid_size) * that.data.draggable_grid_size,
                                    left: Math.round(props.left / that.data.draggable_grid_size) * that.data.draggable_grid_size
                                });
                                self.trigger(that.data._triggers.drag);
                            });
                    };
                    that.init_resizable = function(){
                        var dimm = that.data._el.modal__dialog.offset();
                        dimm.width = that.data._el.modal__dialog.outerWidth();
                        if (that.data._el.modal__dialog.is('[class*="max"]')) {
                            dimm.height = that.data._el.modal__dialog.outerHeight();
                        }
                        that.data._el.modal__dialog
                            .css(dimm)
                            .append(
                                that.data._el.modal__dialog_handle_NE,
                                that.data._el.modal__dialog_handle_NN,
                                that.data._el.modal__dialog_handle_NW,
                                that.data._el.modal__dialog_handle_WW,
                                that.data._el.modal__dialog_handle_EE,
                                that.data._el.modal__dialog_handle_SW,
                                that.data._el.modal__dialog_handle_SS,
                                that.data._el.modal__dialog_handle_SE
                            )
                            .addClass('modal__dialog_absolute')
                            .addClass('modal__dialog_draggable')
                            .drag('start', function(ev, dd){
                                that.set_forward();
                                dd.attr = $(ev.target).prop('className');
                                dd.width = $(this).width();
                                dd.height = $(this).height();
                            })
                            .drag(function(ev, dd){
                                that.data.fullscreen.active = false;
                                var props = {};
                                if (dd.attr.indexOf('E') > -1) {
                                    props.width = Math.max(320, dd.width + dd.deltaX);
                                }
                                if (dd.attr.indexOf('S') > -1) {
                                    props.height = Math.max(200, dd.height + dd.deltaY);
                                }
                                if (dd.attr.indexOf('W') > -1) {
                                    props.width = Math.max(320, dd.width - dd.deltaX);
                                    props.left = dd.originalX + dd.width - props.width;
                                }
                                if (dd.attr.indexOf('N') > -1) {
                                    props.height = Math.max(200, dd.height - dd.deltaY);
                                    props.top = dd.originalY + dd.height - props.height;
                                }
                                $(this).css({
                                    top: Math.round(props.top / that.data.draggable_grid_size) * that.data.draggable_grid_size,
                                    left: Math.round(props.left / that.data.draggable_grid_size) * that.data.draggable_grid_size,
                                    width: Math.round(props.width / that.data.draggable_grid_size) * that.data.draggable_grid_size,
                                    height: Math.round(props.height / that.data.draggable_grid_size) * that.data.draggable_grid_size
                                });
                                self.trigger(that.data._triggers.drag);
                            });
                    };
                    that.init_components = function(){
                        self.find('[data-fc="alertbox"]').alertbox();
                        self.find('[data-fc="button"]').button({
                            popup_animation: false
                        });
                        self.find('[data-fc="checkbox"]').checkbox();
                        self.find('[data-fc="input"]').input({
                            popup_animation: false
                        });
                        self.find('[data-fc="radio"]').radio();
                        self.find('[data-fc="radio-group"]').radio_group();
                        self.find('[data-fc="select"]').select({
                            popup_animation: false,
                            autoclose: true
                        });
                        self.find('[data-fc="tab"]').tabs();
                        self.find('[data-fc="tumbler"]').tumbler();
                        self.find('[data-fc="widget"]').widget();
                    };
                    that.init = function(){
                        self.remove().appendTo('body');
                        self.data(that.data);
                        that.set_position();
                        that.set_size();
                        if (self.children().length == 0) {
                            that.render();
                            that.init_components();
                        } else {
                            that.init_components();
                            that.bind_buttons();
                        }
                        that.bind();
                        self.trigger(that.data._triggers.loaded);
                        if (that.data.show) {
                            that.show();
                        } else {
                            that.hidden();
                        }
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
    $.fn.modal__ = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.modal__' );
        }
    };
})( jQuery );