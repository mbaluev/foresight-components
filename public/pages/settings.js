var Settings = function(options){
    var that = this._settings = {};
    that.data = {
        settings: [],
        loader: null,
        defaults: {
            itemWidth: 2,
            itemHeight: 5,
            x: 0,
            y: 0
        },
        grid: null,
        widgets: [],
        items: []
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid),
        loader: $('<span class="spinner"></span>')
    };

    that.process_settings = function(){
        if (that.data.settings.length > 0) {
            var data_settings_by_category = {}, i = 0, j = 0;
            that.data.settings.map(function(a){
                if (a.category in data_settings_by_category) {
                    j = data_settings_by_category[a.category];
                    that.data.widgets[j].items.push({
                        name: a.name,
                        url: a.url,
                        urltype: a.urltype
                    });
                } else {
                    data_settings_by_category[a.category] = i++;
                    that.data.widgets.push({
                        category: a.category,
                        color: a.color,
                        items: [{
                            name: a.name,
                            url: a.url,
                            urltype: a.urltype
                        }]
                    });
                }
            });
        }
    };
    that.render_grid = function(){
        var widget_grid_options = {
            items: that.data.items,
            loader: that.data.loader
        };
        that.data.grid = $('#widget-grid').widget_grid(widget_grid_options);
    };
    that.render_widgets = function(){
        that.data.widgets.forEach(function(widget, i){
            that.add_widget(widget);
            that.data.defaults.x += that.data.defaults.itemWidth;
            if (that.data.defaults.x >= 12) {
                that.data.defaults.x = 0;
                that.data.defaults.y += that.data.defaults.itemHeight;
            }
        });
        that.data.grid.widget_grid('view_mode');
    };

    that.add_widget = function(widget){
        var item = {
            x: that.data.defaults.x,
            y: that.data.defaults.y,
            width: that.data.defaults.itemWidth,
            height: that.data.defaults.itemHeight,
            settings: {
                name: widget.category,
                color: widget.color,
                content: widget.content,
                collapsed: false
            }
        };
        that.data.items.push(item);
        that.data.grid.widget_grid('add_widget', item);
    };

    that.loader_add = function(){
        $('.fs-view__main').each(function(i, item){
            if (('innerHTML' in item) && (i == $('.fs-view__main').length-1)){
                $(this).append(that.data._el.loader);
            }
        });
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.process_settings();
            that.render_grid();
            //that.render_widgets();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};