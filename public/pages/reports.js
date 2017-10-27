var Reports = function(options){
    var that = this._reports = {};
    that.data = {
        items: [],
        filters: [],
        reports: [],
        loader: null,
        defaults: {
            itemWidth: 2,
            itemHeight: 5,
            x: 0,
            y: 0,
            favorite: false,
            reportingCategoryId: 0
        },
        setFavorite: null,
        removeFavorite: null,
        search: {
            text: '',
            timer: null
        },
        grid: null
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        tumbler: $([
            '<span class="tumbler">',
            '<span class="tumbler__box">',
            '<div class="tumbler__sticker tumbler__sticker_position_left">',
            '<div class="tumbler__sticker-label">Вкл</div>',
            '</div>',
            '<div class="tumbler__sticker tumbler__sticker_position_right">',
            '<div class="tumbler__sticker-label">Выкл</div>',
            '</div>',
            '<button class="button" type="button" data-fc="button">',
            '<span class="icon icon_svg_favorite_red"></span>',
            '</button>',
            '</span>',
            '<input class="tumbler__input" type="checkbox" name="_tumbler" hidden/>',
            '</span>'
        ].join('')),
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
        radiogroup: $('<span class="radio-group radio-group_type_buttons"></span>'),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column" id="filter"></div>',
            '<div class="card__header-column" id="tumbler"></div>',
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
        that.data._el.content.find('#filter').append(
            that.data._el.radiogroup
        );
        that.data._el.content.find('#tumbler').append(
            that.data._el.tumbler
        );
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.render_filters = function(){
        that.data._el.radiogroup.append($([
            '<label class="radio radio_type_button" data-fc="radio" data-checked="true">',
            '<button class="button button_toggable_radio" type="button" data-fc="button" data-checked="true">',
            '<span class="button__text">Все</span>',
            '</button>',
            '<input class="radio__input" type="radio" name="radio-group-button" value="0" hidden/>',
            '</label>'
        ].join('')));
        that.data.filters.forEach(function(filter){
            that.data._el.radiogroup.append($([
                '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + filter.ReportingCategoryName + '">',
                '<button class="button button_toggable_radio" type="button" data-fc="button">',
                '<span class="button__text">' + filter.ReportingCategoryName + '</span>',
                '<span class="icon">',
                '<span class="icon icon__circle" style="background-color: ' + filter.Color + '"></span>',
                '</span>',
                '</button>',
                '<input class="radio__input" type="radio" name="radio-group-button" value="' + filter.ReportingCategoryId + '" hidden/>',
                '</label>'
            ].join('')));
        });
        that.data._el.radiogroup.append(
            that.data._el.input
        );
    };
    that.render_grid = function(){
        var widget_grid_options = {
            items: that.data.items,
            loader: that.data.loader
        };
        that.data.grid = $('#widget-grid').widget_grid(widget_grid_options);
    };
    that.render_reports = function(){
        that.data.reports.forEach(function(report, i){
            report.visible = true;
            report.collapsed = false;
            that.add_report(report);
            that.data.defaults.x += that.data.defaults.itemWidth;
            if (that.data.defaults.x >= 12) {
                that.data.defaults.x = 0;
                that.data.defaults.y += that.data.defaults.itemHeight;
            }
        });
        that.data.grid.widget_grid('view_mode');
    };

    that.remove_reports = function(){
        that.data.items = [];
        that.data.defaults.x = 0;
        that.data.defaults.y = 0;
        that.data.grid.widget_grid('clear');
    };
    that.remove_report = function(report){
        report.visible = false;
        report.collapsed = $('#' + report.ReportingId).data().collapsed;
        that.data.grid.widget_grid('remove_widget', report.ReportingId);
        that.data.items = that.data.items.filter(function(d){ return d._id != report.ReportingId; });
    };
    that.add_report = function(report){
        report.visible = true;
        var item = {
            x: that.data.defaults.x,
            y: that.data.defaults.y,
            width: that.data.defaults.itemWidth,
            height: that.data.defaults.itemHeight,
            settings: {
                id: report.ReportingId,
                name: report.Title,
                collapsed: report.collapsed,
                color: report.Color,
                url: report.URL,
                previewUrl: report.PreviewURL,
                repFavoriteId: report.RepFavoriteId,
                buttons: [
                    {
                        icon: (report.RepFavoriteId ? 'icon_svg_favorite_red': 'icon_svg_favorite'),
                        tooltip: (report.RepFavoriteId ? 'Убрать из избранного': 'Добавить в избранное'),
                        mode: 'view',
                        click: function(widget, data){
                            that.toggle_favorite(widget, data);
                            if (data.repFavoriteId) {
                                if (that.data.removeFavorite && typeof that.data.removeFavorite == 'function') {
                                    that.data.removeFavorite(
                                        data,
                                        function(successData){
                                            that.data.reports.filter(function(d){ return d.ReportingId == data.id; })[0].RepFavoriteId = null;
                                        },
                                        function(errorData){
                                            that.toggle_favorite(widget, data);
                                        }
                                    );
                                }
                            } else {
                                if (that.data.setFavorite && typeof that.data.setFavorite == 'function') {
                                    that.data.setFavorite(
                                        data,
                                        function(successData){
                                            widget.data().repFavoriteId = successData.id;
                                            that.data.reports.filter(function(d){ return d.ReportingId == data.id; })[0].RepFavoriteId = successData.id;
                                        },
                                        function(errorData){
                                            that.toggle_favorite(widget, data);
                                        }
                                    );
                                }
                            }
                        }
                    }
                ]
            }
        };
        that.data.items.push(item);
        that.data.grid.widget_grid('add_widget', item);
    };
    that.update_report = function(report){
        that.data.grid.widget_grid(
            'update_widget',
            report.ReportingId,
            that.data.defaults.x,
            that.data.defaults.y,
            that.data.defaults.itemWidth,
            that.data.defaults.itemHeight
        );
    };
    that.filter_reports = function(){
        that.loader_add();
        setTimeout(function(){
            that.data.defaults.x = 0;
            that.data.defaults.y = 0;
            that.data.reports.forEach(function(report){
                if ((+report.ReportingCategoryId == +that.data.defaults.reportingCategoryId || +that.data.defaults.reportingCategoryId == 0) &&
                    (that.data.defaults.favorite && report.RepFavoriteId || !that.data.defaults.favorite) &&
                    (report.Title.toLowerCase().includes(that.data.search.text.toLowerCase()))) {
                    if (!report.visible) {
                        that.add_report(report);
                    } else {
                        that.update_report(report);
                    }
                    that.data.defaults.x += that.data.defaults.itemWidth;
                    if (that.data.defaults.x >= 12) {
                        that.data.defaults.x = 0;
                        that.data.defaults.y += that.data.defaults.itemHeight;
                    }
                } else {
                    if (report.visible) {
                        that.remove_report(report);
                    }
                }
            });
            that.data.grid.widget_grid('view_mode');
            that.loader_remove();
        }, 100);
    };

    that.toggle_favorite = function(widget, data){
        var $icon = widget.data()._el.buttons[0].find('.icon'),
            $button = widget.data()._el.buttons[0];
        $icon.attr('class', $icon.attr('class').replace(/\icon_svg_favorite.*?\b/g, ''));
        if (data.repFavoriteId) {
            $icon.addClass('icon_svg_favorite');
            $button.tooltip('update', 'Добавить в избранное');
            widget.data().repFavoriteId = null;
        } else {
            $icon.addClass('icon_svg_favorite_red');
            $button.tooltip('update', 'Убрать из избранного');
            widget.data().repFavoriteId = true;
        }
        $button.tooltip('hide');
        that.data.reports.filter(function(d){ return d.ReportingId == data.id; })[0].RepFavoriteId = widget.data().repFavoriteId;
        that.filter_reports();
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.radiogroup.find('[data-fc="radio"]').on('click', function(){
            that.data.defaults.reportingCategoryId = $(this).radio_group('value');
            that.filter_reports();
        });
        that.data._el.tumbler.on('on.fc.tumbler', function(){
            that.data.defaults.favorite = true;
            that.filter_reports();
        }).on('off.fc.tumbler', function(){
            that.data.defaults.favorite = false;
            that.filter_reports();
        });
        if (that.data.defaults.favorite) {
            that.data._el.tumbler.tumbler('check');
        }
        that.data._el.input.on('keyup', function(){
            clearTimeout(that.data.search.timer);
            that.data.search.text = $(this).input('value');
            that.data.search.timer = setTimeout(function(){
                that.filter_reports();
            }, 300);
        });
    };

    that.init_components = function(){
        that.data._el.radiogroup.radio_group();
        that.data._el.input.input();
        that.data._el.tumbler.tumbler();
        that.data._el.input.css({
            flex: '0 0 auto'
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.render_filters();
            that.render_grid();
            that.render_reports();
            that.init_components();
            that.bind();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};