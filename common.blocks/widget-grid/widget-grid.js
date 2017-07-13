(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget_grid', target : self });
                    var defaults = {
                        items: [],
                        account: '',
                        pagename: '',
                        guid: '',
                        buttons: {},
                        events: {
                            onAdd: function(){},
                            onSave: function(){}
                        }
                    };
                    var that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.options_grid = {
                        cellHeight: 20,
                        disableDrag: true,
                        disableResize: true,
                        resizable: { handles: 'e, se, s, sw, w' }
                    };
                    that.data = self.data();
                    that.items = that.options.items;
                    that.widgets = [];
                    that.const = {
                        NO_DATA: 'Нет данных',
                        ERROR_DATA: 'Ошибка загрузки',
                        BORDER_COLOR_BLUE: '#5a97f2',
                        BORDER_COLOR_DEFAULT: '#ccc',
                        BORDER_COLOR_PURPLE: '#8e6bf5',
                        BORDER_COLOR_RED: '#ff5940',
                        CONTENT_TYPE_TEXT: 'text',
                        CONTENT_TYPE_HTML: 'html',
                        CONTENT_TYPE_AJAX: 'ajax',
                        CONTENT_TYPE_COUNT: 'count'
                    };

                    that.template = function(node){
                        var $template = $(
                            '<div>'+
                                '<div class="grid-stack-item-content">' +
                                    '<div class="widget" data-fc="widget">' +
                                        '<div class="widget__header">' +
                                            '<div class="widget__header-name">' +
                                                '<button class="button button_collapse" type="button" data-fc="button">' +
                                                    '<span class="button__text">' + node.settings.name + '</span>' +
                                                    '<span class="icon icon_svg_down"></span>' +
                                                    '<span class="button__anim"></span>' +
                                                '</button>' +
                                            '</div>' +
                                            '<div class="widget__header-actions">' +
                                                '<button class="button button_settings" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_settings"></span>' +
                                                    '<span class="button__anim"></span>' +
                                                '</button>' +
                                                '<button class="button button_remove" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_trash"></span>' +
                                                    '<span class="button__anim"></span>' +
                                                '</button>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="widget__border">' +
                                            '<div class="widget__body widget__body_align_center">' +
                                                '<div class="widget__body_data"></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'),
                            $border = $template.find('.widget__border'),
                            $body = $template.find('.widget__body'),
                            $bodydata = $template.find('.widget__body_data');

                        if (node.settings.content_type === that.const.CONTENT_TYPE_TEXT) {
                            $bodydata.addClass('widget__body_data_text');
                        }
                        if (node.settings.content_type === that.const.CONTENT_TYPE_AJAX) {
                            $bodydata.addClass('widget__body_data_ajax');
                        }
                        if (node.settings.content_type === that.const.CONTENT_TYPE_HTML) {
                            $bodydata.addClass('widget__body_data_html');
                        }
                        if (node.settings.content_type === that.const.CONTENT_TYPE_COUNT) {
                            $bodydata.addClass('widget__body_data_count');
                        }

                        if (node.settings.content === that.const.NO_DATA) {
                            $border.addClass('widget__border_default');
                            $bodydata.addClass('widget__body_data_color_nodata');
                            $bodydata.text(that.const.NO_DATA);
                        } else {
                            if (node.settings.color === that.const.BORDER_COLOR_BLUE) {
                                $border.addClass('widget__border_blue');
                                $bodydata.addClass('widget__body_data_color_blue');
                            }
                            if (node.settings.color === that.const.BORDER_COLOR_DEFAULT) {
                                $border.addClass('widget__border_default');
                                $bodydata.addClass('widget__body_data_color_default');
                            }
                            if (node.settings.color === that.const.BORDER_COLOR_PURPLE) {
                                $border.addClass('widget__border_purple');
                                $bodydata.addClass('widget__body_data_color_purple');
                            }
                            if (node.settings.color === that.const.BORDER_COLOR_RED) {
                                $border.addClass('widget__border_red');
                                $bodydata.addClass('widget__body_data_color_red');
                            }
                            if (node.settings.content_type === that.const.CONTENT_TYPE_TEXT) {
                                $bodydata.text(node.settings.content);
                            }
                            if (node.settings.content_type === that.const.CONTENT_TYPE_AJAX) {
                                $.ajax({
                                    url: node.settings.content,
                                    type: node.settings.ajax.ajax_type,
                                    dataType: node.settings.ajax.ajax_dataType,
                                    cache: node.settings.ajax.ajax_cache,
                                    data: node.settings.ajax.ajax_data,
                                    success: function(data, textStatus, jqXHR) {
                                        $bodydata.addClass('widget__body_data_html');
                                        $bodydata.html(data);
                                    },
                                    error: function(){
                                        $border.addClass('widget__border_red');
                                        $bodydata.addClass('widget__body_data_text');
                                        $bodydata.addClass('widget__body_data_color_red');
                                        $bodydata.text(that.const.ERROR_DATA);
                                    }
                                });
                            }
                            if (node.settings.content_type === that.const.CONTENT_TYPE_COUNT) {
                                $bodydata.text(node.settings.content);
                            }
                            if (node.settings.content_type === that.const.CONTENT_TYPE_HTML) {
                                $bodydata.html(node.settings.content);
                            }
                        }

                        return $template;
                    };
                    that.createWidget = function(node){
                        var default_settings = {
                            name: 'Виджет',
                            collapsed: false,
                            color: that.const.BORDER_COLOR_DEFAULT,
                            content_type: that.const.CONTENT_TYPE_TEXT,
                            content: that.const.NO_DATA
                        };
                        var default_settings_ajax = {
                            type: 'post',
                            dataType: 'json',
                            cache: false,
                            data: {}
                        };
                        node.settings = $.extend(true, {}, default_settings, node.settings);
                        if (node.settings.content_type === that.const.CONTENT_TYPE_AJAX) {
                            node.settings.ajax = $.extend(true, {}, default_settings_ajax, node.settings.ajax);
                        }
                        var el = that.template(node);
                        var item = {
                            _height: node.height,
                            settings: node.settings,
                            widget: null,
                            el: el
                        };

                        item.widget = el.find('[data-fc="widget"]');
                        item.widget.widget();
                        item.widget.data().buttons.button_settings.on('click.widget-grid', function(){
                            var modal_options = {
                                name: 'Настройки',
                                caption: item.settings.name,
                                buttons: {
                                    save: {
                                        onSave: function(item){ console.log(item); }
                                    },
                                    close: {
                                        onClose: function(item){ console.log(item); }
                                    }
                                },
                                tabs: [
                                    {
                                        name: 'Основные настройки',
                                        content: {
                                            field: {
                                                caption: 'Название',
                                                control: 'input',
                                                datafield: 'settings.name',
                                                isrequired: true
                                            }
                                        }
                                    }
                                ],
                                data: item
                            };
                            $('<div class="modal"></div>').appendTo('body').modal(modal_options).modal('show');
                        });
                        item.widget.data().buttons.button_remove.on('click.widget-grid', function(){
                            that.removeWidget(item);
                        });
                        item.widget.data().buttons.button_collapse.off('.widget');
                        item.widget.data().buttons.button_collapse.on('click.widget-grid', function(){
                            if (item.settings.collapsed) {
                                that.expandWidget(item, true);
                            } else {
                                that.collapseWidget(item, true);
                            }
                        });
                        item.widget.widget('editMode');

                        that.grid.addWidget(el, node.x, node.y, node.width, node.height);
                        that.widgets.push(item);
                        that.setItemData(item.el, {item: item});
                    };
                    that.loadGrid = function(){
                        that.grid.removeAll();
                        var items = GridStackUI.Utils.sort(that.items);
                        _.each(items, function (node) {
                            that.createWidget(node);
                        });
                    };
                    that.collapseWidget = function(item, saveState){
                        if (saveState) {
                            item.settings.collapsed = true;
                            that.setItemData(item.el, {item: item});
                        }
                        that.updateWidget(item.el, 1);
                        item.widget.widget('collapse');
                    };
                    that.expandWidget = function(item, saveState){
                        if (saveState) {
                            item.settings.collapsed = false;
                            that.setItemData(item.el, {item: item});
                        }
                        that.updateWidget(item.el, item._height);
                        item.widget.widget('expand');
                    };
                    that.addNewWidget = function () {
                        var node = {
                            x: 0,
                            y: 0,
                            width: 2,
                            height: 4,
                            settings: {
                                name: "Новый виджет",
                                collapsed: false
                            }
                        };
                        that.createWidget(node);
                    };
                    that.saveGrid = function () {
                        that.items = _.map(self.children('.grid-stack-item:visible'), function (el) {
                            el = $(el);
                            var node = that.getItemData(el);
                            return {
                                x: node.x,
                                y: node.y,
                                width: node.width,
                                height: node.height,
                                settings: node.item.settings
                            };
                        }, this);
                    };
                    that.clearGrid = function () {
                        that.grid.removeAll();
                    };
                    that.removeWidget = function(item) {
                        that.grid.removeWidget(item.el);
                        that.widgets = that.widgets.filter(function(d){ return d.el !== item.el; });
                    };
                    that.updateWidget = function(el, height){
                        that.grid.update(el, null, null, null, height);
                    };
                    that.editMode = function(){
                        _.each(that.widgets, function (item) {
                            item.widget.widget('editMode');
                            that.expandWidget(item, false);
                        });
                        that.enableGrid();
                    };
                    that.viewMode = function(){
                        _.each(that.widgets, function (item) {
                            item._height = that.getItemData(item.el).height;
                            item.widget.widget('viewMode');
                            if (item.settings.collapsed) {
                                that.collapseWidget(item, false);
                            } else {
                                that.expandWidget(item, false);
                            }
                        });
                        that.disableGrid();
                    };
                    that.createGrid = function(){
                        if (self.hasClass('grid-stack')) {
                            self.gridstack(that.options_grid);
                            that.grid = self.data('gridstack');
                            return true;
                        } else {
                            $.error( 'Container does not have class .grid-stack' );
                            return false;
                        }
                    };
                    that.enableGrid = function(){
                        that.grid.enableMove(true, true);
                        that.grid.enableResize(true, true);
                    };
                    that.disableGrid = function(){
                        that.grid.enableMove(false, true);
                        that.grid.enableResize(false, true);
                    };
                    that.bindButtons = function(){
                        if (that.options.buttons.add) {
                            $(that.options.buttons.add).on('click', function(){
                                that.addNewWidget();
                                that.options.events.onAdd();
                            });
                        }
                        if (that.options.buttons.save) {
                            $(that.options.buttons.save).on('click', function(){
                                that.saveGrid();
                                that.options.events.onSave(that.items);
                            });
                        }
                    };
                    that.setItemData = function(el, data){
                        $.extend(el.data('_gridstack_node'), data);
                    };
                    that.getItemData = function(el){
                        return el.data('_gridstack_node');
                    };
                    that.init = function(){
                        if (that.createGrid()) {
                            that.loadGrid();
                            that.viewMode();
                            that.bindButtons();
                        }
                    };
                    that.init();
                }
                return this;
            });
        },
        viewMode : function() {
            return this.each(function() {
                this.obj.viewMode();
            });
        },
        editMode : function() {
            return this.each(function() {
                this.obj.editMode();
            });
        },
        save : function() {
            return this.each(function() {
                this.obj.saveGrid();
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

$(function(){
    var grid = $('#widget-grid').widget_grid({
        items: [
            {
                x: 0,
                y: 0,
                width: 3,
                height: 8,
                settings: {
                    name: "Текст",
                    collapsed: false,
                    content: 'Диаграмма'
                }
            },
            {
                x: 9,
                y: 0,
                width: 3,
                height: 8,
                settings: {
                    name: "Html (см. консоль)",
                    collapsed: false,
                    content_type: 'html',
                    content: '<div style="background-color: #eee; height: 100px; width: 100%;"></div><div style="background-color: #ddd; height: 100px; width: 100%;"></div><div style="background-color: #ccc; height: 100px; width: 100%;"></div><script>console.log("скрипт: " + 123);</script>'
                }
            },
            {
                x: 3,
                y: 0,
                width: 3,
                height: 8,
                settings: {
                    name: "AJAX",
                    collapsed: false,
                    content_type: 'ajax',
                    content: 'http://ya.ru',
                    ajax: {
                        type: 'get',
                        dataType: 'json',
                        cache: false,
                        data: {}
                    }
                }
            },
            {
                x: 6,
                y: 0,
                width: 3,
                height: 11,
                settings: {
                    name: "Количество",
                    collapsed: false,
                    content_type: 'count',
                    content: 5,
                    color: '#5a97f2'
                }
            },
            {
                x: 9,
                y: 8,
                width: 3,
                height: 3,
                settings: {
                    name: "Пустой виджет",
                    collapsed: false
                }
            }
        ],
        account: 'fa',
        pagename: 'index',
        guid: '',
        buttons: {
            add: '#button_add-widget',
            save: '#button_save-grid'
        },
        events: {
            onAdd: function(){
                console.log('add new widget');
            },
            onSave: function(items){
                console.log('save grid');
                console.log(items);
            }
        }
    });
    $('#tumbler_edit-page').tumbler('bind',{
        on: function(){
            $("#button_add-widget").button('show');
            $("#button_save-grid").button('show');
            grid.widget_grid('editMode');
        },
        off: function(){
            $("#button_add-widget").button('hide');
            $("#button_save-grid").button('hide');
            grid.widget_grid('viewMode');
        }
    });
});