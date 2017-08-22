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
                        BORDER_COLOR_BLUE: '#5a97f2',
                        BORDER_COLOR_DEFAULT: '#ccc',
                        BORDER_COLOR_PURPLE: '#8e6bf5',
                        BORDER_COLOR_RED: '#ff5940',
                        CONTENT_TYPE_TEXT: 'text',
                        CONTENT_TYPE_HTML: 'html',
                        CONTENT_TYPE_COUNT: 'count'
                    };
                    that.defaults = {
                        collapsed: false,
                        color: that.const.BORDER_COLOR_DEFAULT,
                        content: that.const.CONTENT_NODATA,
                        mode: 'view',
                        loader: null,
                        reloadable: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);
                    that.data._el = {
                        button_collapse: $([
                            '<button class="button button_collapse" type="button" data-tooltip="' + that.data.name + '">',
                            '<span class="button__text">' + that.data.name + '</span>',
                            '<span class="icon icon_svg_down"></span>',
                            '<span class="button__anim"></span>',
                            '</button>'
                        ].join('')).button(),
                        buttons: []
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
                    that.render_buttons = function(){
                        if (that.data.name) {
                            self.find('.widget__header-name').append(that.data._el.button_collapse);
                        }
                        if (that.data.buttons){
                            that.data.buttons.forEach(function(button){
                                var $button = $([
                                    '<button class="button" type="button" ' + (button.tooltip ? 'data-tooltip="' + button.tooltip + '"' : '') + '>',
                                    '<span class="icon ' + button.icon + '"></span>',
                                    '<span class="button__anim"></span>',
                                    '</button>'
                                ].join('')).button();
                                $button.on('click', function(){
                                    button.click(self, _.omitBy(that.data, function(val, key){
                                        return (key.substring(0,1) == '_');
                                    }));
                                });
                                self.find('.widget__header-actions').append($button);
                                that.data._el.buttons.push($button);
                            });
                        }
                    };

                    that.set_name = function(){
                        that.data._el.button_collapse.find('.button__text').text(that.data.name);
                        that.data._el.button_collapse.attr('data-tooltip', that.data.name);
                        that.data._el.button_collapse.data('tooltip', that.data.name);
                    };
                    that.set_color = function(){
                        var $border = self.find('.widget__border');
                        if (that.data.color === that.const.BORDER_COLOR_BLUE) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_blue');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_DEFAULT) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_default');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_PURPLE) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_purple');
                        }
                        else if (that.data.color === that.const.BORDER_COLOR_RED) {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.addClass('widget__border_color_red');
                        }
                        else {
                            $border.attr('class',$border.attr('class').replace(/\widget__border_color_.*?\b/g, ''));
                            $border.css({
                                'border-color': that.data.color,
                                //'color': that.data.color
                            });
                        }
                    };
                    that.set_content = function(){
                        var $body = self.find('.widget__body'),
                            $bodydata = self.find('.widget__body-data');
                        if (typeof that.data.loader == 'function') {
                            $body.addClass('widget__body_align_center');
                            $bodydata.attr('class', $bodydata.attr('class').replace(/\widget__body-data_type_.*?\b/g, ''));
                            $bodydata.html(that.const.CONTENT_LOADING);
                            that.data.content = new that.data.loader({
                                data: _.omitBy(that.data, function(val, key){
                                    return (key.substring(0,1) == '_');
                                }),
                                target: self,
                                success: function(content){
                                    $body.removeClass('widget__body_align_center');
                                    $bodydata.addClass('widget__body-data_type_html');
                                    $bodydata.html(content);
                                },
                                error: function(msg){
                                    $body.addClass('widget__body_align_center');
                                    $bodydata.addClass('widget__body-data_type_text');
                                    $bodydata.html(msg);
                                }
                            });
                            that.data.content.loadContent();
                        } else {
                            $body.addClass('widget__body_align_center');
                            $bodydata.addClass('widget__body-data_type_text');
                            $bodydata.html(that.const.CONTENT_NODATA);
                        }
                    };

                    that.collapse = function(){
                        self.addClass('widget_collapsed');
                        that.data.collapsed = true;
                    };
                    that.expand = function(){
                        self.removeClass('widget_collapsed');
                        that.data.collapsed = false;
                        if (that.data.content == that.const.CONTENT_NODATA && that.data.reloadable) {
                            setTimeout(function(){
                                that.set_content();
                            }, 501);
                        }
                    };
                    that.toggle = function(){
                        self.toggleClass('widget_collapsed');
                        that.data.collapsed = !that.data.collapsed;
                        if (that.data.collapsed) {
                            that.collapse();
                        } else {
                            that.expand();
                        }
                    };

                    that.edit_mode = function(){
                        if (that.data.name) {
                            that.data._el.button_collapse.button('disable');
                        }
                        that.data.mode = 'edit';
                    };
                    that.view_mode = function(){
                        if (that.data.name) {
                            that.data._el.button_collapse.button('enable');
                        }
                        that.data.mode = 'view';
                    };

                    that.bind = function(){
                        if (that.data.name) {
                            that.data._el.button_collapse.on('click.widget', that.toggle);
                        }
                    };

                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="checkbox"]').checkbox();
                        self.find('[data-tooltip]').tooltip();
                    };
                    that.init = function(){
                        if (self.children().length == 0) {
                            that.render();
                        }
                        that.render_buttons();
                        that.init_components();
                        that.bind();
                        if (that.data.mode == 'view') {
                            that.view_mode();
                        } else {
                            that.edit_mode();
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