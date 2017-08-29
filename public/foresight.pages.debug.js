var Dashboard = function(options){
    var that = this._dashboard = {};
    that.const = {
        CONTENT_LOADING: '<span class="spinner"></span>',
        CONTENT_NODATA: 'Нет данных',
        CONTENT_ERROR: 'Ошибка загрузки',
        BORDER_COLOR_BLUE: '#5a97f2',
        BORDER_COLOR_DEFAULT: '#ccc',
        BORDER_COLOR_PURPLE: '#8e6bf5',
        BORDER_COLOR_RED: '#ff5940',
        CONTENT_TYPE_TEXT: 'text',
        CONTENT_TYPE_HTML: 'html',
        CONTENT_TYPE_COUNT: 'count'
    };
    that.data = {
        single: false,
        editable: true,
        pagename: '',
        items: [],
        library: [],
        loader: null,
        grid: null,
        add: function(data){},
        save: function(data){}
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid),
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
        button_add: $([
            '<button class="button button_hidden" type="button" data-hidden="true" id="button_add-widget">',
            '<span class="icon icon_svg_plus"></span>',
            '<span class="button__text mobile mobile_hide">Добавить</span>',
            '<span class="button__anim"></span>',
            '</button>'
        ].join('')).button(),
        button_save: $([
            '<button class="button button_hidden" type="button" data-hidden="true" id="button_save-grid">',
            '<span class="icon icon_svg_save"></span>',
            '<span class="button__text mobile mobile_hide">Сохранить</span>',
            '<span class="button__anim"></span>',
            '</button>',
        ].join('')).button(),
        loader: $('<span class="spinner"></span>')
    };

    that.render_tumbler = function(){
        that.data._el.tumbler
            .on('on.fc.tumbler', function(){
                that.loader_add();
                setTimeout(function(){
                    that.data._el.button_add.button('show');
                    that.data._el.button_save.button('show');
                    that.data.grid.widget_grid('edit_mode');
                    if (that.data.single) {
                        that.data.grid.widget_grid('disable');
                    }
                    that.loader_remove();
                }, 100);
            })
            .on('off.fc.tumbler', function(){
                that.loader_add();
                setTimeout(function(){
                    that.data._el.button_add.button('hide');
                    that.data._el.button_save.button('hide');
                    that.data.grid.widget_grid('view_mode');
                    that.loader_remove();
                }, 100);
            });
        $('.header__column-right').prepend(that.data._el.tumbler);
    };
    that.render_buttons = function(){
        that.render_button_save();
        that.render_button_add();
        $('.header__column-right').prepend(that.data._el.button_group);
    };
    that.render_button_add = function(isnew){
        that.data._el.button_add.on('click', function(){
            var item = {
                x: 0,
                y: 0,
                width: 2,
                height: 4,
                settings: {
                    name: (that.data.single ? that.data.pagename : 'Новый виджет'),
                    collapsed: false
                }
            };
            that.data.grid.widget_grid('add_widget', item, function(data){
                if (typeof that.data.add == 'function') {
                    that.data.add(data);
                };
            });
            if (that.data.single) {
                that.data._el.button_add.button('unhover').remove();
            }
        });
        if (that.data.single && isnew) {
            that.data._el.button_add.button({ hidden: false });
        }
        that.data._el.button_group.prepend(
            that.data._el.button_add
        );
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
    that.render_single = function(){
        if (that.data.single) {
            if (that.data.items.length > 0) {
                that.data.items.splice(1, that.data.items.length - 1);
                that.data._el.button_add.remove();
            }
        }
    };
    that.render_grid = function(){
        that.data.grid = that.data._el.target
            .widget_grid({
                single: that.data.single,
                pagename: that.data.pagename,
                items: that.data.items,
                loader: that.data.loader,
                library: that.data.library,
                widget_buttons: [
                    {
                        id: 'button_settings',
                        icon: 'icon_svg_settings',
                        mode: 'edit',
                        click: function(widget, data){
                            that.settings(widget, data);
                        }
                    },
                    {
                        id: 'button_remove',
                        icon: 'icon_svg_trash',
                        mode: 'edit',
                        click: function(widget, data){
                            that.data.grid.widget_grid('remove_widget', data.id);
                            if (that.data.single) {
                                that.render_button_add(true);
                            }
                        }
                    }
                ]
            });
    };

    /* modal for settings - begin */
    that.settings = function(widget, data){
        var modal_options = {
            buttons: [
                {
                    name: 'save',
                    action: 'save',
                    icon: 'icon_svg_ok'
                },
                {
                    name: 'destroy',
                    action: 'destroy',
                    icon: 'icon_svg_close'
                }
            ],
            header: {
                caption: (that.data.single ? 'Настройки страницы' : 'Настройки виджета'),
                name: data.name
            },
            content: { tabs: [] },
            data: data
        };
        if (that.data.single) {
            that.settings_render_source_tab(data, modal_options.content.tabs, true);
        } else {
            that.settings_render_general_tab(data, modal_options.content.tabs, true);
            that.settings_render_source_tab(data, modal_options.content.tabs, false);
        }
        $('<span class="modal__"></span>').appendTo('body')
            .modal__(modal_options)
            .on('save.fc.modal', function(){
                var reload = false;
                $(this).find('[data-field]').each(function(){
                    var t = $(this), val = t[t.data('fc').replace('-','_')]('value');
                    if ((t.data('field') == 'pagename' ||
                        t.data('field') == 'elementname') &&
                        data[t.data('field')] != val) {
                        reload = true;
                    }
                    _.set(widget.data(), t.data('field'), val);
                });
                widget.widget('set_name');
                widget.widget('set_color');
                if (reload) {
                    widget.widget('set_content');
                }
                $(this).modal__('destroy');
            });
    };
    that.settings_render_general_tab = function(data, tabs, active){
        tabs.push({
            id: 'general',
            name: 'Основные',
            active: active,
            content: $([

                '<div class="control">' +
                '<div class="control__caption">' +
                '<div class="control__text">Скрывать по умолчанию</div>' +
                '</div>' +
                '<div class="control__container">' +
                '<label class="checkbox" data-fc="checkbox" data-field="collapsed"' +
                (data.collapsed ? 'data-checked="true"' : '') + '>' +
                '<input class="checkbox__input" type="checkbox" name="collapsed"/>' +
                '<label class="checkbox__label"></label>' +
                '</label>' +
                '</div>' +
                '</div>' +

                '<div class="control">' +
                '<div class="control__caption">' +
                '<div class="control__text">Заголовок</div>' +
                    //'<div class="control__icons">' +
                    //'<span class="icon icon_svg_star_red"></span>' +
                    //'<span class="icon icon_svg_star_green"></span>' +
                    //'<span class="icon icon_svg_info"></span>' +
                    //'</div>' +
                '</div>' +
                '<div class="control__container">' +
                '<span class="input input__has-clear" data-fc="input" data-field="name">' +
                '<span class="input__box">' +
                '<input type="text" class="input__control" value="' + data.name + '">' +
                '<button class="button" type="button" data-fc="button">' +
                '<span class="icon icon_svg_close"></span>' +
                '</button>' +
                '</span>' +
                '</span>' +
                '</div>' +
                '</div>' +

                '<div class="control">' +
                '<div class="control__caption">' +
                '<div class="control__text">Цвет</div>' +
                '</div>' +
                '<div class="control__container">' +
                '<select class="select" name="color" data-fc="select" data-field="color">' +
                '<option value="' + that.const.BORDER_COLOR_DEFAULT + '" ' + (data.color == that.const.BORDER_COLOR_DEFAULT ? 'selected' : '' ) + '>Серый</option>' +
                '<option value="' + that.const.BORDER_COLOR_BLUE + '" ' + (data.color == that.const.BORDER_COLOR_BLUE ? 'selected' : '' ) + '>Синий</option>' +
                '<option value="' + that.const.BORDER_COLOR_PURPLE + '" ' + (data.color == that.const.BORDER_COLOR_PURPLE ? 'selected' : '' ) + '>Фиолетовый</option>' +
                '<option value="' + that.const.BORDER_COLOR_RED + '" ' + (data.color == that.const.BORDER_COLOR_RED ? 'selected' : '' ) + '>Красный</option>' +
                '</select>' +
                '</div>' +
                '</div>'

            ].join(''))
        });
    };
    that.settings_render_source_tab = function(data, tabs, active){
        if (data.library) {
            var $control__library = $([
                    '<div class="control">',
                    '<div class="control__caption">',
                    '<div class="control__text">Источник данных</div>',
                    '</div>',
                    '<div class="control__container">',
                    '<select class="select" name="pagename" data-fc="select" data-field="pagename" data-mode="radio-check" data-height="350"></select>',
                    '</div>',
                    '</div>'
                ].join('')),
                $control__widgets = $([
                    '<div class="control">',
                    '<div class="control__caption">',
                    '<div class="control__text">Виджет</div>',
                    '</div>',
                    '<div class="control__container">',
                    '<select class="select" name="elementname" data-fc="select" data-field="elementname" data-mode="radio-check" data-height="350"></select>',
                    '</div>',
                    '</div>'
                ].join(''));
            data.library.forEach(function(item){
                var $option = $('<option value="' + item.value + '" ' + (item.value == data.pagename ? 'selected="selected"' : '') + '>' + item.text + '</option>');
                if (item.value == data.pagename) {
                    item.items.forEach(function(item){
                        var $option = $('<option value="' + item.value + '" ' + (item.value == data.elementname ? 'selected="selected"' : '') + '>' + item.text + '</option>');
                        $control__widgets.find('.select').append($option);
                    });
                }
                $control__library.find('.select').append($option);
            });
            $control__library.find('.select').on('change', function(e){
                var values = $(this).data('_value'),
                    items = [];
                values.forEach(function(item){
                    var library = data.library.filter(function(d){ return d.value == item.value; });
                    if (library.length > 0) {
                        library = library[0];
                        if (library.items) {
                            items.push.apply(items, library.items)
                        }
                    }
                });
                $control__widgets.find('.select').select('update', items);
            });
            tabs.push({
                id: 'source',
                name: 'Источник данных',
                active: active,
                content:
                    $('<div></div>').append($control__library, $control__widgets)
            });
        }
    };
    /* modal for settings - end */

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
            if (that.data.editable) {
                that.render_tumbler();
                that.render_buttons();
            }
            that.render_single();
            that.render_grid();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
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
        search: {
            text: '',
            timer: null
        },
        grid: null
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid),
        tumbler: $([
            '<span class="header__column-item tumbler">',
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
            '<span class="header__column-item input input__has-clear" data-width="200">',
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
        radiogroup: $('<span class="header__column-item radio-group radio-group_type_buttons"></span>'),
        content: $([
            '<div class="fs-view">',
            '<div class="fs-view__header">',
            '<div class="header header_second">',
            '<div class="header__column" id="filter"></div>',
            '<div class="header__column" id="tumbler"></div>',
            '</div>',
            '</div>',
            '<div class="fs-view__main">',
            '<div class="fs-view__middle fs-view__middle_full">',
            '<div class="fs-view__middle-scroll">',
            '<div class="fs-view__middle-inner">',
            '<div id="widget-grid" class="widget-grid grid-stack" data-gs-animate="true"></div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner"></span>')
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
                '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + filter.reportingCategoryName + '">',
                '<button class="button button_toggable_radio" type="button" data-fc="button">',
                '<span class="button__text">' + filter.reportingCategoryName + '</span>',
                '<span class="icon">',
                '<span class="icon icon__circle" style="background-color: ' + filter.color + '"></span>',
                '</span>',
                '</button>',
                '<input class="radio__input" type="radio" name="radio-group-button" value="' + filter.reportingCategoryId + '" hidden/>',
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
        report.collapsed = $('#' + report.reportingId).data().collapsed;
        that.data.grid.widget_grid('remove_widget', report.reportingId);
        that.data.items = that.data.items.filter(function(d){ return d._id != report.reportingId; });
    };
    that.add_report = function(report){
        report.visible = true;
        var item = {
            x: that.data.defaults.x,
            y: that.data.defaults.y,
            width: that.data.defaults.itemWidth,
            height: that.data.defaults.itemHeight,
            settings: {
                id: report.reportingId,
                name: report.title,
                collapsed: report.collapsed,
                color: report.color,
                url: report.url,
                previewUrl: report.previewUrl,
                repFavoriteId: report.repFavoriteId,
                buttons: [
                    {
                        icon: (report.repFavoriteId ? 'icon_svg_favorite_red': 'icon_svg_favorite'),
                        tooltip: (report.repFavoriteId ? 'Убрать из избранного': 'Добавить в избранное'),
                        mode: 'view',
                        click: function(widget, data){
                            that.toggle_favorite(widget, data);
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
            report.reportingId,
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
                if ((+report.reportingCategoryId == +that.data.defaults.reportingCategoryId || +that.data.defaults.reportingCategoryId == 0) &&
                    (that.data.defaults.favorite && report.repFavoriteId || !that.data.defaults.favorite) &&
                    (report.title.toLowerCase().includes(that.data.search.text.toLowerCase()))) {
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
        that.data.reports.filter(function(d){ return d.reportingId == data.id; })[0].repFavoriteId = widget.data().repFavoriteId;
        that.filter_reports();
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
        that.data._el.content.find('#filter').css({
            'flex-wrap': 'wrap'
        });
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