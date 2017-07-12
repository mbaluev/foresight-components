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
                    }, that = this.obj = {};
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

                    that.template = function(node){
                        return $(
                            '<div>'+
                                '<div class="grid-stack-item-content">' +
                                    '<div class="widget" data-fc="widget">' +
                                        '<div class="widget__header">' +
                                            '<div class="widget__header-name">' +
                                                '<button class="button button_collapse" type="button" data-fc="button">' +
                                                    '<span class="button__text">' + node.name + '</span>' +
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
                                            '<div class="widget__body">' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>');
                    };
                    that.createWidget = function(node){
                        var el = that.template(node);
                        var item = {
                            el: el,
                            node: node,
                            name: node.name,
                            height: node.height,
                            collapsed: node.collapsed,
                            widget: null
                        };

                        item.widget = el.find('[data-fc="widget"]');
                        item.widget.widget();
                        item.widget.data().buttons.button_remove.on('click.widget-grid', function(){
                            that.removeWidget(item);
                        });
                        item.widget.data().buttons.button_collapse.off('.widget');
                        item.widget.data().buttons.button_collapse.on('click.widget-grid', function(){
                            if (item.collapsed) {
                                that.expandWidget(item, true);
                                that.saveGrid();
                            } else {
                                that.collapseWidget(item, true);
                                that.saveGrid();
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
                            item.collapsed = true;
                            that.setItemData(item.el, {item: item});
                        }
                        that.updateWidget(item.el, 1);
                        item.widget.widget('collapse');
                    };
                    that.expandWidget = function(item, saveState){
                        if (saveState) {
                            item.collapsed = false;
                            that.setItemData(item.el, {item: item});
                        }
                        that.updateWidget(item.el, item.height);
                        item.widget.widget('expand');
                    };
                    that.addNewWidget = function () {
                        var node = {
                            x: 0,
                            y: 0,
                            width: 6,
                            height: 3,
                            name: "Новый виджет",
                            collapsed: false
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
                                name: node.item.name,
                                collapsed: node.item.collapsed
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
                            item.height = that.getItemData(item.el).height;
                            item.widget.widget('viewMode');
                            if (item.collapsed) {
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
                            //$(that.options.buttons.add).button('enable');
                            $(that.options.buttons.add).on('click', function(){
                                that.addNewWidget();
                                that.options.events.onAdd();
                            });
                            //$(that.options.buttons.add).button('disable');
                        }
                        if (that.options.buttons.save) {
                            //$(that.options.buttons.save).button('enable');
                            $(that.options.buttons.save).on('click', function(){
                                that.saveGrid();
                                that.options.events.onSave(that.items);
                            });
                            //$(that.options.buttons.save).button('disable');
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
                x: 4,
                y: 0,
                width: 4,
                height: 4,
                name: "Виджет 1",
                collapsed: false
            },
            {
                x: 8,
                y: 0,
                width: 4,
                height: 3,
                name: "Виджет 3",
                collapsed: false
            },
            {
                x: 4,
                y: 7,
                width: 4,
                height: 3,
                name: "Виджет 2",
                collapsed: false
            },
            {
                x: 0,
                y: 0,
                width: 2,
                height: 10,
                name: "Новый виджет",
                collapsed: false
            },
            {
                x: 2,
                y: 4,
                width: 6,
                height: 3,
                name: "Новый виджет",
                collapsed: false
            },
            {
                x: 2,
                y: 0,
                width: 2,
                height: 4,
                name: "Новый виджет",
                collapsed: false
            },
            {
                x: 8,
                y: 3,
                width: 4,
                height: 7,
                name: "Новый виджет",
                collapsed: false
            },
            {
                x: 2,
                y: 7,
                width: 2,
                height: 3,
                name: "Новый виджет",
                collapsed: false
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
            onAdd: function(){ console.log('add new widget') },
            onSave: function(items){ console.log('saveGrid'); console.log(items); }
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