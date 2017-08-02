(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget_grid', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        mode: 'view',
                        disabled: true,
                        items: [],
                        buttons: [],
                        tumbler: {
                            selector: ''
                        },
                        grid: {
                            cellHeight: 20,
                            disableDrag: true,
                            disableResize: true,
                            resizable: { handles: 'e, se, s, sw, w' }
                        }
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        grid: null,
                        nodes: [],
                        nodesCount: 0,
                        tumbler: $(that.data.tumbler.selector)
                    };
                    that.data._triggers = {
                        add: 'add.fc.widget-grid',
                        save: 'save.fc.widget-grid'
                    };

                    that.destroy = function(){
                        that.clearGrid();
                        _.each(that.data._nodes, function(node) {
                            node.widget.widget('destroy');
                        });
                        self.data = null;
                        self.remove();
                    };
                    that.add = function() {
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
                        that.create_widget(item);
                        self.trigger(that.data._triggers.add, [item]);
                    };
                    that.save = function() {
                        that.data.items = _.map(self.children('.grid-stack-item:visible'), function(el) {
                            el = $(el);
                            var node = that.get(el);
                            return {
                                x: node.x,
                                y: node.y,
                                width: node.width,
                                height: node.height,
                                settings: _.omitBy(node.widget.data(), function(val, key){
                                    return (key.substring(0,1) == '_') || (key == 'mode');
                                })
                            };
                        }, this);
                        self.trigger(that.data._triggers.save, [that.data.items]);
                    };
                    that.clear = function() {
                        that.data._el.grid.removeAll();
                    };
                    that.load = function(){
                        that.data._el.grid.removeAll();
                        var items = GridStackUI.Utils.sort(that.data.items);
                        _.each(items, function(item) {
                            that.create_widget(item);
                        });
                    };

                    that.create_widget = function(node){
                        that.data._el.nodesCount++;

                        node._id = that.data._el.nodesCount;
                        node._height = node.height;
                        node.widget = $('<div class="widget" id="widget' + that.data._el.nodesCount + '"></div>').widget(node.settings);
                        node.el = $('<div><div class="grid-stack-item-content"></div></div>');
                        _.unset(node, 'settings');

                        node.el.find('.grid-stack-item-content').append(node.widget);

                        node.widget.off('toggle.widget');
                        node.widget.data()._el.buttons.button_collapse.off('click.widget');
                        node.widget.data()._el.buttons.button_collapse.on('click.widget-grid', function(){
                            if (node.widget.data().collapsed) {
                                that.expand_widget(node, true);
                            } else {
                                that.collapse_widget(node, true);
                            }
                        });
                        node.widget.data()._el.buttons.button_remove.on('click.widget-grid', function(){
                            that.remove_widget(node);
                        });
                        node.widget.widget('edit_mode');

                        that.data._el.grid.addWidget(node.el, node.x, node.y, node.width, node.height);
                        that.data._el.nodes.push(node);
                        that.set(node.el, node);
                    };
                    that.collapse_widget = function(node, saveState){
                        var _collapsed = node.widget.data().collapsed;
                        that.update_widget(node.el, 1);
                        node.widget.widget('collapse');
                        if (!saveState) {
                            node.widget.data().collapsed = _collapsed;
                        }
                    };
                    that.expand_widget = function(node, saveState){
                        var _collapsed = node.widget.data().collapsed;
                        that.update_widget(node.el, node._height);
                        node.widget.widget('expand');
                        if (!saveState) {
                            node.widget.data().collapsed = _collapsed;
                        }
                    };

                    that.remove_widget = function(node) {
                        that.data._el.grid.removeWidget(node.el);
                        that.data._el.nodes = that.data._el.nodes.filter(function(d){ return d._id !== node._id; });
                    };
                    that.update_widget = function(el, height){
                        that.data._el.grid.update(el, null, null, null, height);
                    };

                    that.edit_mode = function(){
                        that.data.mode = 'edit';
                        _.each(that.data._el.nodes, function(node) {
                            node.widget.widget('edit_mode');
                            that.expand_widget(node, false);
                        });
                        that.enable();
                    };
                    that.view_mode = function(){
                        that.data.mode = 'view';
                        _.each(that.data._el.nodes, function(node) {
                            node._height = that.get(node.el).height;
                            node.widget.widget('view_mode');
                            if (node.widget.data().collapsed) {
                                that.collapse_widget(node, false);
                            } else {
                                that.expand_widget(node, false);
                            }
                        });
                        that.disable();
                    };

                    that.create = function(){
                        if (self.hasClass('grid-stack')) {
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

                    that.bind_buttons = function(){
                        that.data.buttons.forEach(function(button){
                            var $button = $(button.selector);
                            if (button.action) {
                                if (typeof that[button.action] === "function") {
                                    $button.on('click', function(){
                                        that[button.action]();
                                    });
                                }
                            }
                        });
                    };

                    that.init_tumbler = function(){
                        if (typeof that.data._el.tumbler[0] != "undefined") {
                            that.data._el.tumbler
                                .on('on.fc.tumbler', function(){
                                    that.data.buttons.forEach(function(button){
                                        $(button.selector).button('show');
                                    });
                                    that.edit_mode();
                                })
                                .on('off.fc.tumbler', function(){
                                    that.data.buttons.forEach(function(button){
                                        $(button.selector).button('hide');
                                    });
                                    that.view_mode();
                                });
                        }
                    };
                    that.init = function(){
                        if (that.create()) {
                            that.load();
                            that.view_mode();
                            that.bind_buttons();
                            that.init_tumbler();
                        }
                    };
                    that.init();
                }
                return this;
            });
        },
        view_mode : function() {
            return this.each(function() {
                this.obj.view_mode();
            });
        },
        edit_mode : function() {
            return this.each(function() {
                this.obj.edit_mode();
            });
        },
        save : function() {
            return this.each(function() {
                this.obj.save();
            });
        },
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
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

//$(function(){
    /*
    var items = [
        {
            x: 0,
            y: 0,
            width: 3,
            height: 6,
            settings: {
                name: "Текст",
                collapsed: false,
                content: 'Диаграмма'
            }
        },
        {
            x: 3,
            y: 0,
            width: 3,
            height: 6,
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
            height: 6,
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
            y: 0,
            width: 3,
            height: 3,
            settings: {
                name: "Html",
                collapsed: false,
                content_type: 'html'
            }
        },
        {
            x: 9,
            y: 3,
            width: 3,
            height: 3,
            settings: {
                name: "Пустой виджет",
                collapsed: false
            }
        }
    ];
    var widget_grid_options = {
        items: items,
        buttons: [
            {
                selector: '#button_add-widget',
                action: 'add'
            },
            {
                selector: '#button_save-grid',
                action: 'save'
            }
        ],
        tumbler: {
            selector: '#tumbler_edit-page'
        }
    };
    var grid = $('#widget-grid')
        .widget_grid(widget_grid_options)
        .on('add.fc.widget-grid', function(e, data){
            console.log(data);
        })
        .on('save.fc.widget-grid', function(e, data){
            console.log(data);
        });
    */
    /*
    $('#tumbler_edit-page')
        .on('on.fc.tumbler', function(){
            $("#button_add-widget").button('show');
            $("#button_save-grid").button('show');
            grid.widget_grid('edit_mode');
        })
        .on('off.fc.tumbler', function(){
            $("#button_add-widget").button('hide');
            $("#button_save-grid").button('hide');
            grid.widget_grid('view_mode');
        });
    */
//});