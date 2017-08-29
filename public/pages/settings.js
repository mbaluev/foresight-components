var Settings = function(options){
    var that = this._settings = {};
    that.data = {
        settings: [],
        loader: null,
        defaults: {
            itemWidth: 2,
            itemHeight: 7,
            x: 0,
            y: 0
        },
        grid: null,
        widgets: [],
        items: [],
        editable: true
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).addClass('widget-grid grid-stack').attr('data-gs-animate', 'true'),
        tumbler: $([
            '<span class="header__column-item tumbler" id="tumbler_edit-page">',
            '<span class="tumbler__box">',
            '<div class="tumbler__sticker tumbler__sticker_position_left">',
            '<div class="tumbler__sticker-label">Вкл</div>',
            '</div>',
            '<div class="tumbler__sticker tumbler__sticker_position_right">',
            '<div class="tumbler__sticker-label">Выкл</div>',
            '</div>',
            '<button class="button" type="button" data-fc="button">',
            '<span class="icon icon_svg_edit"></span>',
            '<span class="button__anim"></span>',
            '</button>',
            '</span>',
            '<input class="tumbler__input" type="checkbox" name="_tumbler" hidden/>',
            '</span>'
        ].join('')).tumbler(),
        button_group: $('<span class="button-group header__column-item"></span>'),
        button_save: $([
            '<button class="button button_hidden" type="button" data-hidden="true" id="button_save-grid">',
            '<span class="icon icon_svg_save"></span>',
            '<span class="button__text mobile mobile_hide">Сохранить</span>',
            '<span class="button__anim"></span>',
            '</button>',
        ].join('')).button(),
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
            that.data.widgets.map(function(w){
                var rows = '';
                w.items.map(function(a){
                    rows += '<tr><td><a class="link" href="' + a.url + '" target="' + a.urltype + '">' + a.name + '</a></td></tr>';
                });
                w.html = [
                    '<div class="widget__content widget__content_scroll">',
                    '<table class="table">',
                    '<tbody>' + rows + '</tbody>',
                    '</table>',
                    '</div>'
                ].join('');
            });
        }
    };

    that.render_tumbler = function(){
        that.data._el.tumbler
            .on('on.fc.tumbler', function(){
                that.loader_add();
                setTimeout(function(){
                    that.data._el.button_save.button('show');
                    that.data.grid.widget_grid('edit_mode');
                    that.loader_remove();
                }, 100);
            })
            .on('off.fc.tumbler', function(){
                that.loader_add();
                setTimeout(function(){
                    that.data._el.button_save.button('hide');
                    that.data.grid.widget_grid('view_mode');
                    that.loader_remove();
                }, 100);
            });
        $('.header__column-right').prepend(that.data._el.tumbler);
    };
    that.render_buttons = function(){
        that.render_button_save();
        $('.header__column-right').prepend(that.data._el.button_group);
    };
    that.render_button_save = function(){
        that.data._el.button_save.on('click', function(){
            that.data.grid.widget_grid('save', function(data){
                if (typeof that.data.save == 'function') {
                    that.data.save(data);
                };
                that.data._el.tumbler.tumbler('uncheck');
            });
        });
        that.data._el.button_group.append(
            that.data._el.button_save
        );
    };
    that.render_grid = function(){
        var widget_grid_options = {
            items: that.data.items,
            loader: that.data.loader
        };
        that.data.grid = that.data._el.target.widget_grid(widget_grid_options);
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
                collapsed: false,
                html: widget.html,
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
            if (that.data.editable) {
                that.render_tumbler();
                that.render_buttons();
            }
            that.render_grid();
            that.render_widgets();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};