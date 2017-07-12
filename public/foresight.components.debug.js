$(function(){
    $('#button_toggle-menu').each(function(){
        var self = $(this),
            $iconmenu = self.find('.icon__menu');
            $main = $('.fs-view__main'),
            $left = $('.fs-view__left'),
            $middle = $('.fs-view__middle'),
            $backdrop = $('<div class="fs-view__backdrop"></div>'),
            onlyloaded = true;
        function show_menu(){
            $iconmenu.icon__menu('toggle');
            if (!onlyloaded && !$main.hasClass('fs-view__main_transition')) {
                $main.addClass('fs-view__main_transition');
            }
            $left.removeClass('fs-view__left_hidden');
            $middle.removeClass('fs-view__middle_full');
            $left.after($backdrop);
            $backdrop.on('click', hide_menu_backdrop);
            self.one('click', hide_menu);
        }
        function hide_menu(){
            $iconmenu.icon__menu('toggle');
            if (!onlyloaded && !$main.hasClass('fs-view__main_transition')) {
                $main.addClass('fs-view__main_transition');
            }
            $left.addClass('fs-view__left_hidden');
            $middle.addClass('fs-view__middle_full');
            $backdrop.remove();
            self.one('click', show_menu);
        }
        function hide_menu_backdrop(){
            self.trigger('click');
        }
        if ($(window).outerWidth() > 768) {
            self.one('click', show_menu);
            onlyloaded = false;
        } else {
            self.one('click', show_menu);
            onlyloaded = false;
        }
    });
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'button', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();

                    that.destroy = function(){
                        self.data = null;
                        self.remove();
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
                    };
                    that.unclick = function(){
                        self.addClass('button_clicked_out');
                        self.removeClass('button_clicked');
                    };
                    that.check = function(){
                        self.addClass('button_checked');
                        self.attr('data-checked', 'true');
                        that.data.checked = true;
                    };
                    that.uncheck = function(){
                        self.removeClass('button_checked');
                        self.attr('data-checked', 'false');
                        that.data.checked = false;
                    };
                    that.enable = function(){
                        self.removeClass('button_clicked_out');
                        self.removeClass('button_disabled');
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        that.data.disabled = false;
                    };
                    that.disable = function(){
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
                    that.hide = function(){
                        self.addClass('button_hidden');
                    };
                    that.show = function(){
                        self.removeClass('button_hidden');
                    };
                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.button.private', that.hover);
                        self.on('mouseout.button.private', that.unhover);
                        self.on('mousedown.button.private touchstart.button.private', function(){
                            that.click();
                            $('body').one('mouseup.button.private touchend.button.private', that.unclick);
                        });
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
                    that.init = function() {
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
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
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
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.el = {
                        ham: self,
                        menu_top: self.find('.icon__menu-top'),
                        menu_middle: self.find('.icon__menu-middle'),
                        menu_bottom: self.find('.icon__menu-bottom')
                    };

                    that.init = function() {
                        that.bind();
                    };
                    that.bind = function() {
                        that.el.ham.on('toggle.icon__menu', function(e){
                            that.toggle(e);
                            e.preventDefault();
                        });
                    };
                    that.toggle = function() {
                        that.el.ham.toggleClass('icon__menu_click');
                        that.el.menu_top.toggleClass('icon__menu-top_click');
                        that.el.menu_middle.toggleClass('icon__menu-middle_click');
                        that.el.menu_bottom.toggleClass('icon__menu-bottom_click');
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
                    self.data('_widget', { type: 'tumbler', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.button = self.find('button');
                    that.input = self.find('input');

                    that.destroy = function(){
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('destroy');
                        }
                        self.data = null;
                        self.remove();
                    };
                    that.hover = function(){
                        self.addClass('checkbox_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('checkbox_hovered');
                    };
                    that.click = function(){
                        self.addClass('checkbox_clicked');
                    };
                    that.unclick = function(){
                        self.removeClass('checkbox_clicked');
                    };
                    that.check = function(){
                        self.addClass('tumbler_checked');
                        that.input.attr('checked', 'checked');
                        that.input.prop('checked', true);
                        that.data.checked = true;
                    };
                    that.uncheck = function(){
                        self.removeClass('tumbler_checked');
                        that.input.removeAttr('checked');
                        that.input.prop('checked', false);
                        that.data.checked = false;
                    };
                    that.enable = function(){
                        self.removeClass('tumbler_disabled');
                        self.removeAttr('data-disabled');
                        that.input.removeAttr('disabled');
                        that.input.prop('disabled', false);
                        that.data.disabled = false;
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('enable');
                        }
                    };
                    that.disable = function(){
                        self.addClass('tumbler_disabled');
                        self.attr('data-disabled','true');
                        that.input.attr('disabled', 'disabled');
                        that.input.prop('disabled', true);
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
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('disable');
                        }
                    };
                    that.hide = function(){
                        self.addClass('tumbler_hidden');
                    };
                    that.show = function(){
                        self.removeClass('tumbler_hidden');
                    };
                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.checkbox', that.hover);
                        self.on('mouseout.checkbox', that.unhover);
                        self.on('mousedown.checkbox touchstart.checkbox', function(){
                            that.click();
                            $('body').one('mouseup.checkbox touchend.checkbox', that.unclick);
                        });
                        self.bindFirst('click.tumbler', null, null, function(){
                            that.data.checked ? that.uncheck() : that.check();
                        })
                    };
                    that.bind_custom = function(opt){
                        self.on('click.tumbler.custom', null, null, function(){
                            that.data.checked ? opt.on() : opt.off();
                        })
                    };
                    that.init = function(){
                        that.data.name = that.input.attr('name');
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
        checked : function() {
            if (this.length == 1) {
                return this[0].obj.data.checked;
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
        },
        bind : function(opt) {
            return this.each(function() {
                this.obj.bind_custom(opt);
            });
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

(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'menu', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);

                    that.init = function() {
                        var $menu_item_list = self.find('.menu__item');
                        $menu_item_list.each(function(){
                            var item = $(this),
                                $itemlink = item.children('.menu__item-link'),
                                $itemlinkcontent = $itemlink.children('.menu__item-link-content'),
                                $icon = $itemlinkcontent.children('.menu__icon'),
                                $submenu = item.children('.menu__submenu-container');
                            if ($submenu.length > 0) {
                                $itemlink.removeAttr('href');
                                $icon.addClass('icon_animate');
                                $itemlink.on("click", function(){
                                    $submenu.slideToggle(500);
                                    $icon.toggleClass('icon_rotate_0deg');
                                });
                            }
                        });
                    };
                    that.init();
                }
                return this;
            });
        },
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
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'widget', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.data.buttons = {
                        button_collapse: self.find('.button_collapse'),
                        button_settings: self.find('.button_settings'),
                        button_remove: self.find('.button_remove')
                    };

                    that.destroy = function(){
                        if (typeof that.data.buttons.button_collapse[0] != "undefined") {
                            that.data.buttons.button_collapse.button('destroy');
                        }
                        if (typeof that.data.buttons.button_settings[0] != "undefined") {
                            that.data.buttons.button_settings.button('destroy');
                        }
                        if (typeof that.data.buttons.button_remove[0] != "undefined") {
                            that.data.buttons.button_remove.button('destroy');
                        }
                        that.disable();
                        self.data = null;
                        self.remove();
                    };
                    that.collapse = function(){
                        self.addClass('widget_collapsed');
                    };
                    that.expand = function(){
                        self.removeClass('widget_collapsed');
                    };
                    that.toggle = function(){
                        self.toggleClass('widget_collapsed');
                    };
                    that.bind = function(){
                        that.data.buttons.button_collapse.on('click.widget', function(){
                            that.toggle();
                        });
                    };
                    that.editMode = function(){
                        that.data.buttons.button_collapse.button('disable');
                        that.data.buttons.button_settings.button('show').button('enable');
                        that.data.buttons.button_remove.button('show').button('enable');
                    };
                    that.viewMode = function(){
                        that.data.buttons.button_collapse.button('enable');
                        that.data.buttons.button_settings.button('hide').button('disable');
                        that.data.buttons.button_remove.button('hide').button('disable');
                    };
                    that.init = function(){
                        that.bind();
                        that.data.buttons.button_collapse.button();
                        that.data.buttons.button_settings.button();
                        that.data.buttons.button_remove.button();
                    };
                    that.init();
                }
                return this;
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
        editMode : function() {
            return this.each(function() {
                this.obj.editMode();
            });
        },
        viewMode : function() {
            return this.each(function() {
                this.obj.viewMode();
            });
        },
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
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
                    self.data('_widget', { type: 'checkbox', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.input = self.find('.checkbox__input');
                    that.label = self.find('.checkbox__label');
                    that.button = self.find('button');

                    that.destroy = function(){
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('destroy');
                        }
                        self.data = null;
                        self.remove();
                    };
                    that.hover = function(){
                        self.addClass('checkbox_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('checkbox_hovered');
                    };
                    that.click = function(){
                        self.addClass('checkbox_clicked');
                    };
                    that.unclick = function(){
                        self.removeClass('checkbox_clicked');
                    };
                    that.check = function(){
                        self.addClass('checkbox_checked');
                        self.attr('data-checked','true');
                        that.input.attr('checked', 'checked');
                        that.input.prop('checked', true);
                        that.data.checked = true;
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('check');
                        }
                    };
                    that.uncheck = function(){
                        self.removeClass('checkbox_checked');
                        self.removeAttr('data-checked');
                        that.input.removeAttr('checked');
                        that.input.prop('checked', false);
                        that.data.checked = false;
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('uncheck');
                        }
                    };
                    that.enable = function(){
                        self.removeClass('checkbox_disabled');
                        self.removeAttr('data-disabled');
                        that.input.removeAttr('disabled');
                        that.input.prop('disabled', false);
                        that.data.disabled = false;
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('enable');
                        }
                    };
                    that.disable = function(){
                        self.addClass('checkbox_disabled');
                        self.attr('data-disabled','true');
                        that.input.attr('disabled', 'disabled');
                        that.input.prop('disabled', true);
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
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('disable');
                        }
                    };
                    that.hide = function(){
                        self.addClass('checkbox_hidden');
                    };
                    that.show = function(){
                        self.removeClass('checkbox_hidden');
                    };
                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.checkbox', that.hover);
                        self.on('mouseout.checkbox', that.unhover);
                        self.on('mousedown.checkbox touchstart.checkbox', function(){
                            that.click();
                            $('body').one('mouseup.checkbox touchend.checkbox', that.unclick);
                        });
                        if (typeof that.label[0] != "undefined") {
                            that.data['_widget']['type'] = 'checkbox.label';
                            self.bindFirst('click.checkbox', '.checkbox__label', null, function (e) {
                                e.preventDefault();
                                that.data.checked ? that.uncheck() : that.check();
                            })
                        }
                        if (typeof that.button[0] != "undefined") {
                            that.data['_widget']['type'] = 'checkbox.button';
                            self.bindFirst('click.checkbox', 'button', null, function (e) {
                                e.preventDefault();
                                that.data.checked ? that.uncheck() : that.check();
                            })
                        }
                    };
                    that.init = function(){
                        that.data.name = that.input.attr('name');
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
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
        checked : function() {
            if (this.length == 1) {
                return this[0].obj.data.checked;
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
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.input = self.find('.radio__input');
                    that.label = self.find('.radio__label');
                    that.button = self.find('button');

                    that.destroy = function(){
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('destroy');
                        }
                        self.data = null;
                        self.remove();
                    };
                    that.hover = function(){
                        self.addClass('radio_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('radio_hovered');
                    };
                    that.click = function(){
                        self.addClass('radio_clicked');
                    };
                    that.unclick = function(){
                        self.removeClass('radio_clicked');
                    };
                    that.check = function(){
                        self.addClass('radio_checked');
                        self.attr('data-checked','true');
                        that.input.attr('checked', 'checked');
                        that.input.prop('checked', true);
                        that.data.checked = true;
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('check');
                        }
                    };
                    that.uncheck = function(){
                        self.removeClass('radio_checked');
                        self.removeAttr('data-checked');
                        that.input.removeAttr('checked');
                        that.input.prop('checked', false);
                        that.data.checked = false;
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('uncheck');
                        }
                    };
                    that.enable = function(){
                        self.removeClass('radio_disabled');
                        self.removeAttr('data-disabled');
                        that.input.removeAttr('disabled');
                        that.input.prop('disabled', false);
                        that.data.disabled = false;
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('enable');
                        }
                    };
                    that.disable = function(){
                        self.addClass('radio_disabled');
                        self.attr('data-disabled','true');
                        that.input.attr('disabled', 'disabled');
                        that.input.prop('disabled', true);
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
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('disable');
                        }
                    };
                    that.hide = function(){
                        self.addClass('radio_hidden');
                    };
                    that.show = function(){
                        self.removeClass('radio_hidden');
                    };
                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.radio', that.hover);
                        self.on('mouseout.radio', that.unhover);
                        self.on('mousedown.radio touchstart.radio', function(){
                            that.click();
                            $('body').one('mouseup.radio touchend.radio', that.unclick);
                        });
                        if (typeof that.label[0] != "undefined") {
                            that.data['_widget']['type'] = 'radio.label';
                            self.bindFirst('click.radio', '.radio__label', null, function (e) {
                                e.preventDefault();
                                if (!that.data.checked) that.check();
                            })
                        }
                        if (typeof that.button[0] != "undefined") {
                            that.data['_widget']['type'] = 'radio.button';
                            self.bindFirst('click.radio', 'button', null, function (e) {
                                e.preventDefault();
                                if (!that.data.checked) that.check();
                            })
                        }
                    };
                    that.init = function(){
                        that.data.name = that.input.attr('name');
                        that.data.value = that.input.attr('value');
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
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
        checked : function() {
            if (this.length == 1) {
                return this[0].obj.data.checked;
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
                return this[0].obj.data.value;
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
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.radio_list = self.find('.radio');
                    that.has_checked = false;

                    that.destroy = function(){
                        that.radio_list.each(function(){
                            $(this).radio('destroy');
                        });
                        self.data = null;
                        self.remove();
                    };
                    that.init = function(){
                        that.radio_list.each(function(){
                            var radio = {};
                            radio.self = $(this);
                            radio.data = radio.self.data();
                            radio.self.radio();
                            if (radio.data.checked && that.has_checked) { radio.self.radio('uncheck'); }
                            if (radio.data.checked) { that.has_checked = true; }
                            radio.self.on('click.radio_group', null, null, function(e){
                                that.radio_list.each(function(){
                                    $(this).radio('uncheck');
                                });
                                radio.self.radio('check');
                            });
                        });
                    };
                    that.enable = function(){
                        that.radio_list.each(function(){
                            $(this).radio('enable');
                        });
                    };
                    that.disable = function(){
                        that.radio_list.each(function(){
                            $(this).radio('disable');
                        });
                    };
                    that.hide = function(){
                        that.radio_list.each(function(){
                            $(this).radio('hide');
                        });
                    };
                    that.show = function(){
                        that.radio_list.each(function(){
                            $(this).radio('show');
                        });
                    };
                    that.value = function(){
                        var value;
                        that.radio_list.each(function(){
                            if ($(this).radio('checked')) {
                                value = $(this).radio('value');
                            }
                        });
                        return value;
                    };
                    that.init();
                }
                return this;
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
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
        value : function() {
            if (this.length == 1) {
                return this[0].obj.value();
            } else {
                var value_arr = [];
                this.each(function() {
                    value_arr.push(this.obj.value());
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
$.fn.bindFirst = function(name, selector, data, handler) {
    this.on(name, selector, data, handler);
    this.each(function() {
        var handlers = $._data(this, 'events')[name.split('.')[0]];
        var handler = handlers.pop();
        handlers.splice(0, 0, handler);
    });
};

(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'alertbox', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();
                    that.button = self.find('button');

                    that.destroy = function(){
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('destroy');
                        }
                        self.data = null;
                        self.remove();
                    };
                    that.enable = function(){
                        that.data.disabled = false;
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        //button enable
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('enable');
                        }
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
                        if (typeof that.button[0] != "undefined") {
                            that.button.button('disable');
                        }
                    };
                    that.hide = function(){
                        self.addClass('alertbox_hidden');
                    };
                    that.show = function(){
                        self.removeClass('alertbox_hidden');
                    };
                    that.bind = function(){
                        self.bindFirst('click.alertbox', 'button', null, function (e) {
                            e.preventDefault();
                            that.destroy();
                        })
                    };
                    that.init = function(){
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
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        },
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