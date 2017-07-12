(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget_grid', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.options_grid = {
                        cellHeight: 20,
                        disableDrag: true,
                        disableResize: true,
                        resizable: { handles: 'e, se, s, sw, w' }
                    };
                    that.data = self.data();
                    that.items = [
                        { x: 0, y: 0, width: 8, height: 4, name: "КТ", collapsed: false },
                        { x: 4, y: 4, width: 4, height: 4, name: "Виджет", collapsed: false },
                        { x: 8, y: 0, width: 4, height: 3, name: "Виджет", collapsed: true }
                    ];
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
                            name: node.name,
                            collapsed: node.collapsed,
                            el: el,
                            node: node,
                            height: node.height,
                            widget: null
                        };

                        item.widget = el.find('[data-fc="widget"]');
                        item.widget.widget();
                        item.widget.data().buttons.button_remove.on('click.widget-grid', function(){
                            that.removeWidget(el);
                        });
                        item.widget.data().buttons.button_collapse.off('.widget');
                        item.widget.data().buttons.button_collapse.on('click.widget-grid', function(){
                            if (item.collapsed) {
                                that.expandWidget(item, true);
                            } else {
                                that.collapseWidget(item, true);
                            }
                        });

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
                        //console.log(that.items);
                        //console.log(JSON.stringify(that.items, null, '    '));
                    };
                    that.clearGrid = function () {
                        that.grid.removeAll();
                    };
                    that.removeWidget = function(el) {
                        that.grid.removeWidget(el);
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
                        $(that.options.add_widget_button_selector).button('enable').click(that.addNewWidget).button('disable');
                        /*
                        $('#button_clear-grid').button('enable').click(that.clearGrid).button('disable');
                        $('#button_save-grid').button('enable').click(that.saveGrid).button('disable');
                        $('#button_load-grid').button('enable').click(that.loadGrid).button('disable');
                        */
                    }
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
                this.obj.loadGrid();
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
    var add_widget_button_selector = "#button_add-widget";
    var grid = $('[data-fc="widget-grid"]').widget_grid({
        account: 'fa',
        page_name: 'index',
        data_guid: '',
        add_widget_button_selector: add_widget_button_selector
    });
    $('#tumbler_edit-page').on('click', function(){
        var data = $(this).data();
        if (data.checked) {
            $(add_widget_button_selector).button('enable');
            grid.widget_grid('editMode');

            /*
            $('#button_clear-grid').button('enable');
            $('#button_save-grid').button('enable');
            $('#button_load-grid').button('enable');
            */
        } else {
            $(add_widget_button_selector).button('disable');
            grid.widget_grid('save');
            grid.widget_grid('viewMode');

            /*
            $('#button_clear-grid').button('disable');
            $('#button_save-grid').button('disable');
            $('#button_load-grid').button('disable');
            */
        }
    });
});