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
                    that.hide = function(){
                        self.removeClass('button_clicked_out');
                        self.addClass('button_hidden');
                    };
                    that.show = function(){
                        self.removeClass('button_clicked_out');
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
                    var that = this.obj = {};
                    var defaults = {
                        items: [],
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
                    that._nodesCount = 0;

                    /* public */
                    that.data._nodes = [];

                    that.destroy = function(){
                        that.clearGrid();
                        _.each(that.data._nodes, function(node) {
                            node.widget.widget('destroy');
                        });
                        self.data = null;
                        self.remove();
                    };
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
                        that.data._nodes.push(node);
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
                        that.data._nodes = that.data._nodes.filter(function(d){ return d._id !== node._id; });
                    };
                    that.updateWidget = function(el, height){
                        that.grid.update(el, null, null, null, height);
                    };
                    that.editMode = function(){
                        _.each(that.data._nodes, function(node) {
                            node.widget.widget('editMode');
                            that.expandWidget(node, false);
                        });
                        that.enableGrid();
                    };
                    that.viewMode = function(){
                        _.each(that.data._nodes, function(node) {
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
                collapsed: true,
                content_type: 'html',
                content:
                '<div class="widget__body-data-inner">' +
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
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'modal', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        header: {
                            icon: 'icon_svg_settings',
                            caption: 'Модальное окно',
                            name: 'Название',
                            buttons: [
                                {
                                    name: 'close',
                                    action: 'destroy',
                                    icon: 'icon_svg_close'
                                }
                            ]
                        },
                        content: {
                            tabs: [
                                { id: "general", name: 'Главная' }
                            ]
                        },
                        data: null
                    };
                    that.options = $.extend({}, that.defaults, options);
                    that.data = self.data();

                    that.el = {
                        modal__view: $('<div class="modal__view"></div>'),
                        modal__backdrop: $('<div class="modal__backdrop"></div>'),
                        modal__dialog: $('<div class="modal__dialog modal__dialog_hidden"></div>'),
                        card: $('<div class="card" data-fc="card"></div>'),
                        card__header: $('<div class="card__header"></div>'),
                        card__header_row_caption: $('<div class="card__header-row"></div>'),
                        card__header_row_name: $('<div class="card__header-row"></div>'),
                        card__header_row_tabs: $('<div class="card__header-row tabs"></div>'),
                        tabs__list: $('<ul class="tabs__list"></ul>'),
                        card__main: $('<div class="card__main"></div>'),
                        card__middle: $('<div class="card__middle card__middle_full"></div>'),
                        card__middle_scroll: $('<div class="card__middle-scroll"></div>'),
                        card__middle_inner: $('<div class="card__middle-inner"></div>'),
                        card__backdrop: $('<div class="card__backdrop"></div>'),
                        card__right: $('<div class="card__right"></div>'),
                        tabs_pane: $('<div class="tabs__pane"></div>')
                    };

                    that.destroy = function(){
                        that.hide();
                        self.find('.modal__backdrop').remove();
                        setTimeout(function(){
                            self.data = null;
                            self.remove();
                        }, 500);
                    };
                    that.save = function(){
                        that.el.card__middle_inner.find('[data-field]').each(function(){
                            var t = $(this);
                            _.set(that.options.data, t.data('field'), t[t.data('fc')]('value'));
                        });
                    };
                    that.hide = function(){
                        self.find('.modal__dialog').addClass('modal__dialog_hidden');
                    };
                    that.show = function(){
                        self.find('.modal__dialog').removeClass('modal__dialog_hidden');
                    };
                    that.render_view = function(){
                        self.append(that.el.modal__view
                            .append(that.el.modal__backdrop, that.el.modal__dialog
                                .append(that.el.card
                                    .append(that.el.card__header
                                        .append(that.el.card__header_row_caption, that.el.card__header_row_name, that.el.card__header_row_tabs
                                            .append(that.el.tabs__list)),
                                    that.el.card__main
                                        .append(that.el.card__middle
                                            .append(that.el.card__middle_scroll
                                                .append(that.el.card__middle_inner)))))));
                    };
                    that.render_header = function(){
                        that.render_header_caption();
                        that.render_header_name();
                    };
                    that.render_header_caption = function(){
                        that.render_header_caption_name();
                        that.render_header_caption_buttons();
                    };
                    that.render_header_caption_name = function(){
                        that.el.card__header_row_caption.append($(
                            '<div class="card__header-column">' +
                                '<label class="card__caption">' +
                                    '<span class="card__caption-text">' + that.options.header.caption + '</span>' +
                                '</label>' +
                            '</div>'
                        ));
                    };
                    that.render_header_caption_buttons = function(){
                        var $buttons_column = $('<div class="card__header-column"></div>');
                        that.el.card__header_row_caption.append($buttons_column);
                        that.options.header.buttons.forEach(function(button){
                            var $button = $(
                                '<button class="button button__' + button.name + '" data-fc="button">' +
                                    (button.icon ? '<span class="icon ' + button.icon + '"></span>' : '') +
                                    (button.caption ? '<span class="button__text"> ' + button.caption + '</span>' : '') +
                                    '<span class="button__anim"></span>' +
                                '</button>'
                            );
                            if (button.action) {
                                $button.on('click', that[button.action]);
                            }
                            if (typeof(button.event) === "function") {
                                $button.on('click', function(){
                                    button.event(that.options.data);
                                    that.destroy();
                                });
                            }
                            $buttons_column.append($button);
                        });
                    };
                    that.render_header_name = function(){
                        that.el.card__header_row_name.append($(
                            '<div class="card__header-column">' +
                                '<label class="card__name">' +
                                    '<span class="card__name-text">' + that.options.header.name + '</span>' +
                                '</label>' +
                            '</div>'
                        ));
                    };
                    that.render_tabs = function(){
                        if (that.options.content.tabs.length == 1) {
                            that.options.content.tabs[0].active = true;
                        } else {
                            var has_active_tab = false;
                            that.options.content.tabs.forEach(function(tab) {
                                if (tab.active) {
                                    has_active_tab = true;
                                }
                            });
                            if (!has_active_tab) {
                                that.options.content.tabs[0].active = true;
                            }
                        }
                        that.options.content.tabs.forEach(function(tab){
                            that.el.tabs__list.append($(
                                (tab.active ? '<li class="tabs__tab tabs__tab_active">' : '<li class="tabs__tab">' ) +
                                    '<a class="tabs__link link" href="#' + tab.id + '" data-fc="tab">' +
                                        '<button class="button" data-fc="button">' +
                                            '<span class="button__text">' + tab.name + '</span>' +
                                            '<span class="button__anim"></span>' +
                                        '</button>' +
                                    '</a>' +
                                '</li>'
                            ));
                            that.el.card__middle_inner.append(
                                that.el.tabs_pane.clone()
                                    .attr('id', tab.id)
                                    .addClass((tab.active ? 'tabs__pane_active' : ''))
                                    .html(tab.content));
                        });
                    };
                    that.init_components = function(){
                        self.find('[data-fc="alertbox"]').alertbox();
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="checkbox"]').checkbox();
                        self.find('[data-fc="radio"]').radio();
                        self.find('[data-fc="radio-group"]').radio_group();
                        self.find('[data-fc="tab"]').tabs();
                        self.find('[data-fc="tumbler"]').tumbler();
                        self.find('[data-fc="widget"]').widget();
                    };
                    that.bind = function(){
                        self.find('.button_close').on('click', that.destroy);
                        self.find('.modal__backdrop').on('click', that.destroy);
                    };
                    that.init = function(){
                        self.remove().appendTo('body');
                        if (self.children().length == 0) {
                            that.render_view();
                            that.render_header();
                            that.render_tabs();
                        }
                        that.init_components();
                        that.bind();
                        setTimeout(that.show, 0);
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
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        }
    };
    $.fn.modal = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.modal' );
        }
    };
})( jQuery );

/*
$(function(){
    $('[data-fc="modal"]').modal();
});
*/
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'tab', target : self });
                    var defaults = {}, that = this.obj = {};
                    that.options = $.extend(defaults, options);
                    that.data = self.data();

                    /* private */
                    that.neighbors = [];
                    that.el = {
                        button: self.find('[data-fc="button"]'),
                        tabs__tab: self.parent('.tabs__tab'),
                        tabs__link: self,
                        tabs__pane: $('.tabs__pane[id="' + self.attr('href').replace('#','') + '"]')
                    };

                    that.destroy = function(){
                        that.neighbors.forEach(function(el){
                            el.button.button('destroy');
                        });
                        self.data = null;
                        self.remove();
                    };
                    that.enable = function(){
                        that.el.button.button('enable');
                    };
                    that.disable = function(){
                        that.el.button.button('disable');
                    };
                    that.show = function(){
                        that.neighbors.forEach(function(el){
                            el.button.button('enable');
                            el.tabs__tab.removeClass('tabs__tab_active');
                            el.tabs__pane.removeClass('tabs__pane_active');
                            el.tabs__pane.find('[data-fc="button"]').button('disable');
                        });
                        that.el.button.button('disable');
                        that.el.tabs__tab.addClass('tabs__tab_active');
                        that.el.tabs__pane.addClass('tabs__pane_active');
                        that.el.tabs__pane.find('[data-fc="button"]').button('enable');
                    };
                    that.bind = function(){
                        that.el.tabs__link.on('click', function(e){
                            e.preventDefault();
                            if (!that.el.tabs__tab.hasClass('tabs__tab_active')) {
                                that.show();
                            }
                        });
                    };
                    that.check_active = function(){
                        if (that.el.tabs__tab.hasClass('tabs__tab_active')) {
                            that.show();
                        }
                    };
                    that.get_neighbors = function(){
                        self.closest('.tabs').find('.tabs__tab').each(function(){
                            var t = $(this);
                            var el = {
                                button: t.find('[data-fc="button"]'),
                                tabs__tab: t,
                                tabs__link: t.find('.tabs__link'),
                                tabs__pane: t.closest('.card').find('.tabs__pane[id="' + t.find('.tabs__link').attr('href').replace('#','') + '"]')
                            };
                            el.button.button();
                            that.neighbors.push(el);
                        });
                    };
                    that.init = function(){
                        that.get_neighbors();
                        that.bind();
                        that.check_active();
                    };
                    that.init();
                }
                return this;
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
                    that.init_components = function(){
                        if (typeof that.button[0] != "undefined") {
                            that.button.button();
                        }
                    };
                    that.init = function(){
                        that.data.name = that.input.attr('name');
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
                    self.data('_widget', { type: 'widget', target : self });
                    var that = this.obj = {};
                    that.const = {
                        NO_DATA: 'Нет данных',
                        ERROR_DATA: 'Ошибка загрузки',
                        BORDER_COLOR_BLUE: '#5a97f2',
                        BORDER_COLOR_DEFAULT: '#ccc',
                        BORDER_COLOR_NODATA: '#aaa',
                        BORDER_COLOR_PURPLE: '#8e6bf5',
                        BORDER_COLOR_RED: '#ff5940',
                        CONTENT_TYPE_TEXT: 'text',
                        CONTENT_TYPE_HTML: 'html',
                        CONTENT_TYPE_COUNT: 'count'
                    };
                    that.defaults = {
                        name: 'Виджет',
                        collapsed: false,
                        color: that.const.BORDER_COLOR_DEFAULT,
                        content_type: that.const.CONTENT_TYPE_TEXT,
                        content: that.const.NO_DATA,
                        onSave: null
                    };
                    that.options = $.extend(true, {}, that.defaults, options);
                    that.data = self.data();

                    /* public */
                    that.data.options = that.options;
                    that.data.buttons = {};

                    that.render = function(){
                        var $template = $(
                                '<div class="widget__header">' +
                                    '<div class="widget__header-name">' +
                                        '<button class="button button_collapse" type="button" data-fc="button">' +
                                            '<span class="button__text">' + that.data.options.name + '</span>' +
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
                                        '<div class="widget__body-data"></div>' +
                                    '</div>' +
                                '</div>');
                        var $border = $($template[1]);
                        var $bodydata = $border.find('.widget__body-data');

                        /* const.no_data */
                        if (that.data.options.content === that.const.NO_DATA) {
                            that.data.options.content_type = that.const.CONTENT_TYPE_TEXT;
                            that.data.options.color = that.const.BORDER_COLOR_NODATA;
                        }

                        /* options.content_type */
                        if (that.data.options.content_type === that.const.CONTENT_TYPE_COUNT) {
                            $bodydata.addClass('widget__body-data_type_count');
                            $bodydata.text(that.data.options.content);
                        }
                        if (that.data.options.content_type === that.const.CONTENT_TYPE_TEXT) {
                            $bodydata.addClass('widget__body-data_type_text');
                            $bodydata.text(that.data.options.content);
                        }
                        if (that.data.options.content_type === that.const.CONTENT_TYPE_HTML) {
                            $bodydata.addClass('widget__body-data_type_html');
                            $bodydata.html(that.data.options.content);
                        }

                        /* options.color */
                        if (that.data.options.color === that.const.BORDER_COLOR_BLUE) {
                            $border.addClass('widget__border_color_blue');
                            $bodydata.addClass('widget__body-data_color_blue');
                        }
                        if (that.data.options.color === that.const.BORDER_COLOR_DEFAULT) {
                            $border.addClass('widget__border_color_default');
                            $bodydata.addClass('widget__body-data_color_default');
                        }
                        if (that.data.options.color === that.const.BORDER_COLOR_NODATA) {
                            $border.addClass('widget__border_color_nodata');
                            $bodydata.addClass('widget__body-data_color_nodata');
                        }
                        if (that.data.options.color === that.const.BORDER_COLOR_PURPLE) {
                            $border.addClass('widget__border_color_purple');
                            $bodydata.addClass('widget__body-data_color_purple');
                        }
                        if (that.data.options.color === that.const.BORDER_COLOR_RED) {
                            $border.addClass('widget__border_color_red');
                            $bodydata.addClass('widget__body-data_color_red');
                        }

                        self.append($template);
                    };
                    that.get_buttons = function(){
                        that.data.buttons = {
                            button_collapse: self.find('.button_collapse'),
                            button_settings: self.find('.button_settings'),
                            button_remove: self.find('.button_remove')
                        };
                    };
                    that.get_name = function(){
                        that.data.options.name = that.data.buttons.button_collapse.find('.button__text').text();
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
                        that.data.options.collapsed = !that.data.options.collapsed;
                    };
                    that.check_toggle = function(){
                        if (that.data.options.collapsed) {
                            that.collapse();
                        } else {
                            that.expand();
                        }
                    };
                    that.settings = function(){
                        var modal_options = {
                            header: {
                                caption: 'Настройки виджета',
                                name: that.data.options.name,
                                buttons: [
                                    {
                                        name: 'save',
                                        action: 'save',
                                        icon: 'icon_svg_ok',
                                        event: function(data){
                                            console.log(data);
                                            that.data.options = data;
                                            self.trigger('self.check_toggle');
                                            if (typeof(that.options.onSave) == "function") {
                                                that.options.onSave(data);
                                            }
                                        }
                                    },
                                    {
                                        name: 'close',
                                        action: 'destroy',
                                        icon: 'icon_svg_close'
                                    }
                                ]
                            },
                            content: {
                                tabs: [
                                    {
                                        id: 'general', name: 'Основные', active: true,
                                        content:
                                        '<label class="checkbox" data-fc="checkbox" data-field="collapsed"' +
                                        (that.data.options.collapsed ? 'data-checked="true"' : '') + '>' +
                                        '<input class="checkbox__input" type="checkbox" name="collapsed"/>' +
                                        '<label class="checkbox__label">Скрывать по умолчанию</label>' +
                                        '</label>'
                                    },
                                    {
                                        id: 'datasource', name: 'Источник данных',
                                        content: 'Источник данных'
                                    },
                                    {
                                        id: 'advanced', name: 'Расширенные',
                                        content:
                                            '<span class="button-group" data-fc="button-group">' +
                                                '<button class="button" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_info"></span>' +
                                                    '<span class="button__anim"></span>' +
                                                '</button>' +
                                                '<button class="button" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_star_red"></span>' +
                                                    '<span class="button__anim"></span>' +
                                                '</button>' +
                                                '<button class="button" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_star_green"></span>' +
                                                    '<span class="button__anim"></span>' +
                                                '</button>' +
                                                '<button class="button" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_save"></span>' +
                                                    '<span class="button__anim"></span>' +
                                                '</button>' +
                                                '<button class="button" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_save_red"></span>' +
                                                    '<span class="button__anim"></span>' +
                                                '</button>' +
                                                '<button class="button" type="button" data-fc="button">' +
                                                    '<span class="icon icon_svg_ok"></span>' +
                                                    '<span class="button__anim"></span>' +
                                                '</button>' +
                                            '</button>'
                                    }
                                ]
                            },
                            data: that.data.options
                        };
                        $('<span class="modal"></span>').appendTo('body').modal(modal_options);
                    };
                    that.bind = function(){
                        self.on('self.check_toggle', that.check_toggle);
                        that.data.buttons.button_collapse.on('click.widget', that.toggle);
                        that.data.buttons.button_settings.on('click.widget', that.settings);
                        that.data.buttons.button_remove.on('click.widget', that.destroy);
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
                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="checkbox"]').checkbox();
                    };
                    that.init = function(){
                        if (self.children().length == 0) {
                            that.render();
                            that.get_buttons();
                        } else {
                            that.get_buttons();
                            that.get_name();
                        }
                        that.init_components();
                        that.bind();
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
                    that.init_components = function(){
                        if (typeof that.button[0] != "undefined") {
                            that.button.button();
                        }
                    };
                    that.init = function(){
                        that.data.name = that.input.attr('name');
                        that.data.value = that.input.attr('value');
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
                    that.init_components = function(){
                        if (typeof that.button[0] != "undefined") {
                            that.button.button();
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