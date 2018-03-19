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
        BORDER_COLOR_NONE: 'transparent',
        CONTENT_TYPE_TEXT: 'text',
        CONTENT_TYPE_HTML: 'html',
        CONTENT_TYPE_COUNT: 'count'
    };
    that.data = {
        id: Date.now(),
        title: null,
        name: null,
        single: false,
        margin: true,
        editable: true,
        tumblerContainerSelector: null,
        pagename: '',
        items: [],
        library: [],
        loader: null,
        grid: null,
        add: function(data){},
        save: function(data){},
        headerExtraControlsRenderer: null,
        params: null,
        type: 'page'
    };
    that.data = $.extend(that.data, options);

    that.data._el = {
        target: $('#' + that.data.containerid),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };

    that.render_card = function(){
        // remove for reloading success - begin
        $('body').tooltip('clear');
        if (that.data._el.tumbler) {
            that.data._el.tumbler.remove();
        }
        // remove for reloading success - end
        $.extend(that.data._el, {
            grid: $('<div class="widget-grid grid-stack" data-gs-animate="true"></div>'),
            card__caption: $([
                '<label class="card__caption">',
                '<span class="card__caption-text"></span>',
                '</label>'
            ].join('')),
            card__name: $([
                '<label class="card__name">',
                '<span class="card__name-text"></span>',
                '</label>'
            ].join('')),
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
            card: $('<div class="card"></div>'),
            card__header: $([
                '<div class="card__header">',
                '<div class="card__header-row card__header-row_wrap">',
                '<div class="card__header-column" id="title"></div>',
                '<div class="card__header-column card__header-column_start" id="actions"></div>',
                '</div>',
                '</div>'
            ].join('')),
            card__header_row_name: $([
                '<div class="card__header-row">',
                '<div class="card__header-column" id="name"></div>',
                '</div>'
            ].join('')),
            card__main: $([
                '<div class="card__main">',
                '<div class="card__middle">',
                '<div class="card__middle-scroll" id="card__middle-scroll">',
                '</div>',
                '</div>',
                '</div>'
            ].join(''))
        });
        that.data._el.target.empty();
        that.data._el.target.append(
            that.data._el.card
        );
        that.render_card_header();
        that.render_card_main();
    };
    that.render_card_header = function(){
        var render = false;
        if (that.data.type == 'page') {
            if (that.data.title) {
                that.render_page_title();
                render = true;
            } else {
                that.remove_page_title();
            }
        }
        if (that.data.type == 'card') {
            if (that.data.title) {
                that.render_card_title();
                render = true;
                if (that.data.name) {
                    that.render_card_header_row();
                    that.render_card_name();
                } else {
                    that.remove_card_name();
                }
            } else {
                if (that.data.name) {
                    that.rename_card_title();
                    that.render_card_name();
                    render = true;
                } else {
                    that.remove_card_title();
                    that.remove_card_name();
                }
            }
        }
        if (that.data.editable) {
            that.render_tumbler();
            that.render_buttons();
            if (!that.data.tumblerContainerSelector) {
                render = true;
            }
        }
        if (typeof(that.data.headerExtraControlsRenderer) == 'function') {
            that.data._el.card__header.find('#actions').append(
                that.data.headerExtraControlsRenderer()
            );
            render = true;
        }
        if (render) {
            that.data._el.card.append(
                that.data._el.card__header
            );
        }
    };
    that.render_card_main = function(){
        that.data._el.card__main.find('#card__middle-scroll').append(
            that.data._el.grid
        );
        that.data._el.card.append(
            that.data._el.card__main
        );
    };
    that.render_page_title = function(){
        that.set_title(that.data.title);
        that.data._el.card__header.find('#title').append(
            that.data._el.card__name
        );
    };
    that.remove_page_title = function(){
        that.data._el.card__header.find('#title').remove();
    };
    that.render_card_header_row = function() {
        that.data._el.card__header.append(
            that.data._el.card__header_row_name
        );
    };
    that.render_card_title = function(){
        that.set_title(that.data.title);
        that.data._el.card__header.find('#title').append(
            that.data._el.card__caption
        );
    };
    that.rename_card_title = function(){
        that.data._el.card__header.find('#title').attr('id', 'name');
    };
    that.remove_card_title = function(){
        that.data._el.card__header.find('#title').remove();
    };
    that.render_card_name = function(){
        that.set_name(that.data.name);
        that.data._el.card__header.find('#name').append(
            that.data._el.card__name
        );
    };
    that.remove_card_name = function(){
        that.data._el.card__header.find('#name').remove();
    };
    that.render_tumbler = function(){
        that.data._el.tumbler
            .on('on.fc.tumbler', function(){
                that.loader_add();
                setTimeout(function(){
                    that.data._el.button_group.show();
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
                    that.data._el.button_group.hide();
                    that.data._el.button_add.button('hide');
                    that.data._el.button_save.button('hide');
                    that.data.grid.widget_grid('view_mode');
                    that.loader_remove();
                }, 100);
            });
        if (that.data.tumblerContainerSelector) {
            $(that.data.tumblerContainerSelector).prepend(
                that.data._el.tumbler
            );
        } else {
            that.data._el.card__header.find('#actions').prepend(
                that.data._el.tumbler
            );
        }
    };
    that.render_buttons = function(){
        that.data._el.button_group.hide();
        that.render_button_save();
        that.render_button_add();
        if (that.data.tumblerContainerSelector) {
            $(that.data.tumblerContainerSelector).prepend(
                that.data._el.button_group
            );
        } else {
            that.data._el.card__header.find('#actions').prepend(
                that.data._el.button_group
            );
        }
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
        that.data.grid = that.data._el.grid
            .widget_grid({
                single: that.data.single,
                margin: that.data.margin,
                pagename: that.data.pagename,
                items: that.data.items,
                loader: that.data.loader,
                library: that.data.library,
                params: that.data.params,
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

    that.store_to_window = function(){
        if (typeof window.dashboards == typeof undefined) { window.dashboards = []; }
        window.dashboards[that.data.id] = that;
    };

    that.set_title = function(title){
        that.data.title = title;
        if (that.data.type == 'page') {
            that.data._el.card__name.find('.card__name-text').html(that.data.title);
        }
        if (that.data.type == 'card') {
            that.data._el.card__caption.find('.card__caption-text').html(that.data.title);
        }
    };
    that.set_name = function(name){
        that.data.name = name;
        if (that.data.type == 'card') {
            that.data._el.card__name.find('.card__name-text').html(that.data.name);
        }
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
                '<option value="' + that.const.BORDER_COLOR_NONE + '" ' + (data.color == that.const.BORDER_COLOR_NONE ? 'selected' : '' ) + '>Безцветный</option>' +
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
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.reload = {
        dashboard: function(options, params){
            that.data = $.extend(that.data, options, { params: params });
            that.init();
        },
        widgets: function(options, params){
            that.data.grid[0].obj.options.items.map(function(item){
                $.extend(item.widget.data(), options, { params: params });
                item.widget.widget('set_name');
                item.widget.widget('set_color');
                item.widget.widget('set_content');
            });
        },
        widget: function(id, options, params){
            var item = that.data.grid[0].obj.options.items.filter(function(d){
                return d._id == id;
            });
            if (item.length > 0) {
                item = item[0];
                $.extend(item.widget.data(), options, { params: params });
                item.widget.widget('set_name');
                item.widget.widget('set_color');
                item.widget.widget('set_content');
            }
        },
        element: function(elementname, options, params){
            var item = that.data.grid[0].obj.options.items.filter(function(d){
                return d.widget[0].obj.data.elementname == elementname;
            });
            if (item.length > 0) {
                item = item[0];
                $.extend(item.widget.data(), options, { params: params });
                item.widget.widget('set_name');
                item.widget.widget('set_color');
                item.widget.widget('set_content');
            }
        },
        title: function(title){
            that.set_title(title);
        },
        name: function(name){
            that.set_name(name);
        }
    };

    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render_card();
            that.render_single();
            that.render_grid();
            that.store_to_window();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};