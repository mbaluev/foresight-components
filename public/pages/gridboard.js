var GridBoard = function(options){
    var that = this._gridboard = {};
    that.data = {
        title: null,
        items: [],
        loader: null,
        defaults: {
            itemWidth: 3,
            itemHeight: 3,
            x: 0,
            y: 0,
            favorite: false,
            reportingCategoryId: 0
        },
        search: {
            text: '',
            timer: null
        },
        grid: null,
        data: []
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        input: $([
            '<span class="input input__has-clear" data-width="200">',
            '<span class="input__box">',
            '<span class="alertbox" data-fc="alertbox">',
            '<span class="icon icon_svg_search"></span>',
            '</span>',
            '<input type="text" class="input__control">',
            '<button class="button" type="button" data-fc="button">',
            '<span class="icon icon_svg_close"></span>',
            '</button>',
            '</span>',
            '</span>'
        ].join('')),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
                '<div class="card__header-column" id="name">',
                    '<label class="card__name"><span class="card__name-text"></span></label>',
                '</div>',
                '<div class="card__header-column" id="search"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll">',
            '<div id="widget-grid" class="widget-grid grid-stack" data-gs-animate="true"></div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.content.find('#name .card__name-text').html(that.data.title);
        }
    };
    that.render_filters = function(){
        that.data._el.content.find('#search').append(
            that.data._el.input
        );
    };

    that.render_grid = function(){
        var widget_grid_options = {
            items: that.data.data,
            loader: that.data.loader
        };
        that.data.grid = $('#widget-grid').widget_grid(widget_grid_options);
    };
    that.render_items = function(){
        that.data.items.forEach(function(item, i){
            item.visible = true;
            item.collapsed = false;
            that.add_item(item);
            that.data.defaults.x += that.data.defaults.itemWidth;
            if (that.data.defaults.x >= 12) {
                that.data.defaults.x = 0;
                that.data.defaults.y += that.data.defaults.itemHeight;
            }
        });
        that.data.grid.widget_grid('view_mode');
    };

    that.remove_items = function(){
        that.data.data = [];
        that.data.defaults.x = 0;
        that.data.defaults.y = 0;
        that.data.grid.widget_grid('clear');
    };
    that.remove_item = function(item){
        item.visible = false;
        item.collapsed = $('#' + item.id).data().collapsed;
        that.data.grid.widget_grid('remove_widget', item.id);
        that.data.data = that.data.data.filter(function(d){ return d._id != item.id; });
    };
    that.add_item = function(item){
        item.visible = true;
        var dataitem = {
            x: that.data.defaults.x,
            y: that.data.defaults.y,
            width: that.data.defaults.itemWidth,
            height: that.data.defaults.itemHeight,
            settings: {}
        };
        dataitem.settings = $.extend(true, {}, item, {
            contentFormatter: that.data.contentFormatter
            /*
            buttons: [
            {
            icon: 'icon_svg_list',
            tooltip: 'Тултип',
            mode: 'view',
            click: function(widget, data){}
            }
            ]
            */
        });
        that.data.data.push(dataitem);
        that.data.grid.widget_grid('add_widget', dataitem);
    };
    that.update_item = function(item){
        that.data.grid.widget_grid(
            'update_widget',
            item.id,
            that.data.defaults.x,
            that.data.defaults.y,
            that.data.defaults.itemWidth,
            that.data.defaults.itemHeight
        );
    };
    that.filter_items = function(){
        that.loader_add();
        setTimeout(function(){
            that.data.defaults.x = 0;
            that.data.defaults.y = 0;
            that.data.items.forEach(function(item){
                if ((item.title.toLowerCase().includes(that.data.search.text.toLowerCase()))) {
                    if (!item.visible) {
                        that.add_item(item);
                    } else {
                        that.update_item(item);
                    }
                    that.data.defaults.x += that.data.defaults.itemWidth;
                    if (that.data.defaults.x >= 12) {
                        that.data.defaults.x = 0;
                        that.data.defaults.y += that.data.defaults.itemHeight;
                    }
                } else {
                    if (item.visible) {
                        that.remove_item(item);
                    }
                }
            });
            that.data.grid.widget_grid('view_mode');
            that.loader_remove();
        }, 100);
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.input.on('keyup', function(){
            clearTimeout(that.data.search.timer);
            that.data.search.text = $(this).input('value');
            that.data.search.timer = setTimeout(function(){
                that.filter_items();
            }, 300);
        });
    };

    that.init_components = function(){
        that.data._el.input.input();
        that.data._el.input.css({
            flex: '0 0 auto'
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.render_title();
            that.render_filters();
            that.render_grid();
            that.render_items();
            that.init_components();
            that.bind();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};