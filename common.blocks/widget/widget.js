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