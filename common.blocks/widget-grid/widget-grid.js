(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget_grid', target : self });
                    var that = this.obj = {};
                    var defaults = {
                        items: [],
                        account: '',
                        pagename: '',
                        guid: '',
                        buttons: {},
                        events: {
                            onAdd: function(){},
                            onSave: function(){}
                        },
                        grid: {
                            cellHeight: 20,
                            disableDrag: true,
                            disableResize: true,
                            resizable: { handles: 'e, se, s, sw, w' }
                        }
                    };
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that._nodes = [];
                    that._nodesCount = 0;

                    that.createWidget = function(node){
                        that._nodesCount++;

                        node._id = that._nodesCount;
                        node._height = node.height;
                        node.widget = $('<div class="widget" id="widget' + that._nodesCount + '"></div>').widget(node.settings);
                        node.el = $('<div><div class="grid-stack-item-content"></div></div>');
                        _.unset(node, 'settings');

                        node.el.find('.grid-stack-item-content').append(node.widget);

                        node.widget.off('self.check_toggle');
                        node.widget.data().buttons.button_collapse.off('click.widget');
                        node.widget.data().buttons.button_collapse.on('click.widget-grid', function(){
                            if (node.widget.data().options.collapsed) {
                                that.expandWidget(node, true);
                            } else {
                                that.collapseWidget(node, true);
                            }
                        });
                        node.widget.data().buttons.button_remove.on('click.widget-grid', function(){
                            that.removeWidget(node);
                        });
                        node.widget.widget('editMode');

                        that.grid.addWidget(node.el, node.x, node.y, node.width, node.height);
                        that._nodes.push(node);
                        that.setItemData(node.el, node);
                    };
                    that.loadGrid = function(){
                        that.grid.removeAll();
                        var items = GridStackUI.Utils.sort(that.options.items);
                        _.each(items, function(item) {
                            that.createWidget(item);
                        });
                    };
                    that.collapseWidget = function(node, saveState){
                        if (saveState) {
                            node.widget.data().options.collapsed = true;
                        }
                        that.updateWidget(node.el, 1);
                        node.widget.widget('collapse');
                    };
                    that.expandWidget = function(node, saveState){
                        if (saveState) {
                            node.widget.data().options.collapsed = false;
                        }
                        that.updateWidget(node.el, node._height);
                        node.widget.widget('expand');
                    };
                    that.addNewWidget = function() {
                        var item = {
                            x: 0,
                            y: 0,
                            width: 2,
                            height: 4,
                            settings: {
                                name: "Новый виджет",
                                collapsed: false
                            }
                        };
                        that.createWidget(item);
                    };
                    that.saveGrid = function() {
                        that.options.items = _.map(self.children('.grid-stack-item:visible'), function(el) {
                            el = $(el);
                            var node = that.getItemData(el);
                            return {
                                x: node.x,
                                y: node.y,
                                width: node.width,
                                height: node.height,
                                settings: node.widget.data().options
                            };
                        }, this);
                    };
                    that.clearGrid = function() {
                        that.grid.removeAll();
                    };
                    that.removeWidget = function(node) {
                        that.grid.removeWidget(node.el);
                        that._nodes = that._nodes.filter(function(d){ return d._id !== node._id; });
                    };
                    that.updateWidget = function(el, height){
                        that.grid.update(el, null, null, null, height);
                    };
                    that.editMode = function(){
                        _.each(that._nodes, function(node) {
                            node.widget.widget('editMode');
                            that.expandWidget(node, false);
                        });
                        that.enableGrid();
                    };
                    that.viewMode = function(){
                        _.each(that._nodes, function(node) {
                            node._height = that.getItemData(node.el).height;
                            node.widget.widget('viewMode');
                            if (node.widget.data().options.collapsed) {
                                that.collapseWidget(node, false);
                            } else {
                                that.expandWidget(node, false);
                            }
                        });
                        that.disableGrid();
                    };
                    that.createGrid = function(){
                        if (self.hasClass('grid-stack')) {
                            self.gridstack(that.options.grid);
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
                                that.options.events.onSave(that.options.items);
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
    var items = [
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
                name: "Html",
                collapsed: false,
                content_type: 'html',
                content:
                '<div class="widget__body-data_paddings">' +
                '<label class="checkbox checkbox_type_button" data-fc="checkbox" data-checked="true">' +
                '<button class="button button_toggable_check" type="button" data-fc="button" data-checked="true">' +
                '<span class="button__text">Включить</span>' +
                '</button>' +
                '<input class="checkbox__input" type="checkbox" name="first" hidden/>' +
                '</label>' +
                '</div>'
            }
        },
        {
            x: 3,
            y: 0,
            width: 3,
            height: 8,
            settings: {
                name: "Фиолетовый",
                collapsed: false,
                content_type: 'count',
                content: 666,
                color: '#8e6bf5'
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
    ];
    var grid = $('#widget-grid').widget_grid({
        items: items,
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