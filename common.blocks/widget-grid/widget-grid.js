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
                        loader: null,
                        library: null,
                        widget_buttons: [],
                        mode: 'view',
                        disabled: true,
                        grid: {
                            verticalMargin: 20,
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
                        nodes: []
                    };

                    that.destroy = function(){
                        that.clear();
                        self.removeData();
                        self.remove();
                    };
                    that.clear = function(){
                        that.data._el.grid.removeAll();
                        _.each(that.data._nodes, function(node) {
                            node.widget.widget('destroy');
                        });
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
                    that.load_widget = function(node){
                        if (that.data.single) {
                            node.settings.name = that.data.pagename;
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
                        node.settings.loader = that.data.loader;
                        node.settings.library = that.data.library;
                        node.settings.params = that.data.params;
                        node.widget = $('<div class="widget" id="' + node._id + '"></div>').widget(node.settings);
                        node.el = $('<div><div class="grid-stack-item-content"></div></div>');
                        _.unset(node, 'settings');

                        node.el.find('.grid-stack-item-content').append(node.widget);
                        node.widget.data()._el.button_collapse.off('click.widget');
                        node.widget.data()._el.button_collapse.on('click.widget-grid', function(){
                            if (node.widget.data().collapsed) {
                                that.expand_widget(node._id, true);
                            } else {
                                that.collapse_widget(node._id, true);
                            }
                        });
                        node.widget.widget('edit_mode');

                        that.data._el.grid.addWidget(node.el, node.x, node.y, node.width, node.height);
                        that.data._el.nodes.push(node);
                        that.set(node.el, node);
                    };

                    that.add_widget = function(item, callback){
                        that.load_widget(item);
                        if (typeof callback == "function") { callback(item); }
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
                            that.update_widget(node._id, null, null, null, 1);
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
                    };

                    that.create = function(){
                        if (self.hasClass('grid-stack')) {
                            if (that.data.single) {
                                self.addClass('widget-grid_single');
                            }
                            if (!that.data.margin) {
                                self.addClass('widget-grid_margin_none');
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

                    that.init = function(){
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
                    that.init_resize = function(){
                        $(window).resize(function(){
                            console.log('resize');
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