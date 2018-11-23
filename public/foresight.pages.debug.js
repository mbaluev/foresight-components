var Dashboard = function(options){
    var that = this._dashboard = {};
    that.const = {
        CONTENT_LOADING: '<span class="spinner"></span>',
        CONTENT_NODATA: 'Нет данных',
        CONTENT_ERROR: 'Ошибка загрузки',
        BORDER_COLOR_DARK_BLUE: '#0070ba',
        BORDER_COLOR_BLUE: '#5a97f2',
        BORDER_COLOR_LIGHT_BLUE: '#2fb4e9',
        BORDER_COLOR_DEFAULT: '#ccc',
        BORDER_COLOR_DARK_GREY: '#777',
        BORDER_COLOR_PURPLE: '#8e6bf5',
        BORDER_COLOR_RED: '#ff5940',
        BORDER_COLOR_GREEN: '#13a89e',
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
        admin: true,
        tumblerContainerSelector: null,
        pageid: '',
        items: [],
        lib: {
            foresight: {
                library: [],
                loader: null
            },
            dbm: {
                library: [],
                loader: null
            }
        },
        grid: null,
        add: function(data){},
        save: function(data, accountid, option){},
        load: function(accountid){},
        account: {
            id: -1,
            list: [],
            saved: []
        },
        headerExtraControlsRenderer: null,
        params: null,
        type: 'page',
        modal: null,
        modal_dbm: null,
        collapsed_widget_height: 1,
        headerClass: null
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid),
        targetTumbler: null,
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
            card: $('<div class="card"></div>'),
            card__header: $([
                '<div class="card__header' + (that.data.headerClass ? ' ' + that.data.headerClass : '' ) + '">',
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
            ].join('')),
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
            select_load: $('<select data-fc="select" data-width="200" data-autoclose="true" data-mode="radio" data-hidden="true" style="display:none;"></select>'),
            button_add: $([
                '<button class="button button_hidden" type="button" data-hidden="true" id="button_add-widget">',
                '<span class="icon icon_svg_plus"></span>',
                '</button>'
            ].join('')).button(),
            button_group_save: $('<span class="button-group header__column-item"></span>'),
            button_save: $([
                '<button class="button button_hidden" type="button" data-hidden="true" id="button_save-grid">',
                '<span class="icon icon_svg_save"></span>',
                (!that.data.admin ? '<span class="button__text mobile mobile_hide">Сохранить</span>' : ''),
                '</button>'
            ].join('')).button(),
            button_more: $([
                '<button class="button button_hidden" type="button" data-hidden="true" id="button_save-arrow">',
                '<span class="icon icon_animate icon_svg_down"></span>',
                '</button>'
            ].join('')).button(),

            input: $([
                '<span class="input input__has-clear">',
                '<span class="input__box">',
                '<span class="alertbox">',
                '<span class="icon icon_svg_search"></span>',
                '</span>',
                '<input type="text" class="input__control">',
                '<button class="button" type="button">',
                '<span class="icon icon_svg_close"></span>',
                '</button>',
                '</span>',
                '</span>'
            ].join('')),
            popup_save: $('<div class="popup" data-fc="popup"></div>'),
            popup__input: $('<div class="popup__input"></div>'),
            popup__scroll: $('<div class="popup__scroll"></div>'),
            popup__list: $('<ul class="popup__list"></ul>'),
            popup__list_items: []
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
            if (that.data.admin || !that.data.admin && !that.data.single) {
                that.render_tumbler();
                that.render_buttons();
                if (!that.data.tumblerContainerSelector) {
                    render = true;
                }
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
                    that.data._el.button_group_save.show();
                    if (!that.data._el.select_load.data('_widget')) {
                        that.data._el.select_load.select();
                    }
                    that.data._el.select_load.select('show');
                    that.data._el.button_save.button('show');
                    that.data._el.button_more.button('show');
                    that.data._el.button_add.button('show');
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
                    that.data._el.button_group_save.hide();
                    if (that.data._el.select_load.data('_widget')) {
                        that.data._el.select_load.select('hide');
                    }
                    that.data._el.button_save.button('hide');
                    that.data._el.button_more.button('hide');
                    that.data._el.button_add.button('hide');
                    that.data.grid.widget_grid('view_mode');
                    that.loader_remove();
                }, 100);
            });
        if (that.data.tumblerContainerSelector) {
            that.data._el.targetTumbler = $(that.data.tumblerContainerSelector);
        } else {
            that.data._el.targetTumbler = that.data._el.card__header.find('#actions');
        }
        that.data._el.targetTumbler.prepend(
            that.data._el.tumbler
        );
    };
    that.render_buttons = function(){
        that.data._el.button_group_save.hide();
        that.render_button_group_save();
        if (that.data.admin) {
            that.render_button_add();
            that.render_select_load();
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
                    name: (that.data.single ? that.data.pageid : 'Новый виджет'),
                    collapsed: false
                }
            };
            that.data.grid.widget_grid('add_widget', item, function(data){
                if (typeof that.data.add == 'function') {
                    that.data.add(data);
                }
            });
            if (that.data.single) {
                that.data._el.button_add.button('unhover').remove();
            }
        });
        if (that.data.single && isnew) {
            that.data._el.button_add.button({ hidden: false });
        }
        that.data._el.targetTumbler.prepend(
            that.data._el.button_add
        );
    };
    that.render_button_group_save = function(){
        that.data._el.button_save.on('click', function(){
            that.data.grid.widget_grid('save', function(data){
                if (typeof that.data.save == 'function') {
                    that.data.save(data, that.data.account.id);
                }
                that.data._el.tumbler.tumbler('uncheck');
            });
        });
        that.data._el.button_group_save.append(
            that.data._el.button_save
        );
        if (that.data.admin) {
            that.render_popup_save();
            that.data._el.button_group_save.append(
                that.data._el.button_more,
                that.data._el.popup_save
            );
        }
        that.data._el.targetTumbler.prepend(
            that.data._el.button_group_save
        );
    };
    that.render_popup_save = function(){
        that.data.account.list.unshift({
            value: -1,
            text: 'Общий'
        });
        that.data.account.list.map(function(a){
            //a.selected = that.data.account.id == a.value;
            // render popup__list_item
            var $popup__list_item = $([
                '<li class="popup__list-item',
                (a.selected ? ' popup__list-item_checked' : ''),
                (a.disabled ? ' popup__list-item_disabled' : '') + '">',
                '<button class="popup__link">',
                (a.icon ? '<span class="icon ' + a.icon + '"></span>' : ''),
                '<span class="popup__text">' + a.text + '</span>',
                '</button>',
                '</li>'
            ].join(''));
            that.data._el.popup__list_items.push($popup__list_item);
            // store data to element
            $popup__list_item.data(a);
        });
        that.data._el.popup_save.append(
            that.data._el.popup__input.append(
                that.data._el.input.input()
            ),
            that.data._el.popup__scroll.append(
                that.data._el.popup__list.append(
                    that.data._el.popup__list_items
                )
            )
        );
        that.bind_popup_save();
        that.bind_popup_save_input();
    };
    that.render_select_load = function(){
        var default_account = that.data.account.saved.filter(function(a){ return a.value == -1; });
        if (default_account.length == 0) {
            that.data.account.saved.unshift({
                value: -1,
                text: 'Общий'
            });
        }
        if (that.data.account.saved) {
            that.data.account.saved.map(function(a){
                a.selected = that.data.account.id == a.value;
                that.data._el.select_load.append(
                    $('<option value="' + a.value + '" ' + (a.selected ? 'selected="selected"' : '') + '>' + a.text + '</option>')
                );
            });
        }
        that.data._el.select_load.on('change', function(){
            var value = $(this).select('value');
            if (value) {
                that.data.account.id = value;
                if (typeof that.data.load == 'function') {
                    that.data.load(that.data.account.id);
                }
            }
        });
        that.data._el.targetTumbler.prepend(
            that.data._el.select_load
        );
    };
    that.update_select_load = function(item){
        if (that.data.admin) {
            var saved = that.data.account.saved.filter(function(a){ return that.data.account.id == a.value; });
            if (saved.length == 0) { that.data.account.saved.push(item); }
            that.data.account.saved.map(function(a){ a.selected = that.data.account.id == a.value; });
            if (that.data._el.select_load.data('_widget')) {
                that.data._el.select_load.select('update', that.data.account.saved);
            }
        }
    };

    /*
    that.check_popup_item = function(item){
        that.data._el.popup__list_items.forEach(function(item){
            item.removeClass('popup__list-item_checked');
            item.data().selected = false;
        });
        item.data().selected = true;
        item.addClass('popup__list-item_checked');
    };
    */

    that.bind_popup_save = function(){
        that.data._el.popup__list_items.forEach(function(item){
            item.on('click', function(){
                //that.check_popup_item(item);
                that.data.grid.widget_grid('save', function(data){
                    var option = item.data();
                    if (typeof that.data.save == 'function') {
                        that.data.account.id = option.value;
                        that.data.save(data, that.data.account.id, option);
                    }
                    that.data._el.tumbler.tumbler('uncheck');
                });
                that.data._el.popup_save.popup('hide');
            });
        });
    };
    that.bind_popup_save_input = function(){
        that.data._el.input.find('.input__control').on('keyup', function(){
            var value = that.data._el.input.input('value');
            that.data._el.popup__list_items.forEach(function(item) {
                if (item.data().text.toLowerCase().includes(value.toLowerCase())) {
                    item.removeClass('popup__list-item_hidden');
                } else {
                    item.addClass('popup__list-item_hidden');
                }
            });
        });
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
        var buttons = [{
            id: 'button_settings',
            icon: 'icon_svg_settings',
            mode: 'edit',
            click: function(widget, data){
                that.settings(widget, data);
            }
        }];
        if (that.data.admin) {
            buttons.push({
                id: 'button_remove',
                icon: 'icon_svg_trash',
                mode: 'edit',
                click: function(widget, data){
                    that.data.grid.widget_grid('remove_widget', data.id);
                    if (that.data.single) {
                        that.render_button_add(true);
                    }
                }
            });
        }
        that.data.grid = that.data._el.grid
            .widget_grid({
                single: that.data.single,
                margin: that.data.margin,
                pageid: that.data.pageid,
                items: that.data.items,
                lib: that.data.lib,

                //loader: that.data.loader,
                //library: that.data.library,

                params: that.data.params,
                widget_buttons: buttons,
                collapsed_widget_height: that.data.collapsed_widget_height
            });
    };
    that.update_grid = function(items){
        that.data.grid.widget_grid('load_items', items);
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
                    name: 'reload',
                    action: 'reload',
                    icon: 'icon_svg_refresh'
                },
                {
                    name: 'save',
                    action: 'save',
                    icon: 'icon_svg_save_red'
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
            data: data,
            size: 'sm',
            position: 'top center',
            draggable: true
        };
        if (that.data.admin) {
            if (that.data.single) {
                that.settings_render_source_tab(data, modal_options.content.tabs, true, widget);
            } else {
                that.settings_render_general_tab(data, modal_options.content.tabs, true, widget);
                that.settings_render_source_tab(data, modal_options.content.tabs, false, widget);
            }
        } else {
            if (!that.data.single) {
                that.settings_render_general_tab(data, modal_options.content.tabs, true, widget);
            }
        }
        that.data.modal = $('<span class="modal__"></span>').appendTo('body')
            .modal__(modal_options)
            .on('reload.fc.modal', function(){
                that.settings_apply(widget, data, true);
            })
            .on('save.fc.modal', function(){
                that.settings_apply(widget, data, false);
                $(this).modal__('destroy');
            });
    };
    that.settings_render_general_tab = function(data, tabs, active, widget){
        tabs.push({
            id: 'general',
            name: 'Основные',
            active: active,
            content: $([

                '<div class="control">' +
                '<div class="control__caption control__caption_size_s">' +
                '<div class="control__text">Скрывать</div>' +
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
                '<div class="control__caption control__caption_size_s">' +
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
                '<div class="control__caption control__caption_size_s">' +
                '<div class="control__text">Цвет</div>' +
                '</div>' +
                '<div class="control__container">' +
                '<select class="select" name="color" data-fc="select" data-field="color">' +
                '<option value="' + that.const.BORDER_COLOR_DEFAULT + '" ' + (data.color == that.const.BORDER_COLOR_DEFAULT ? 'selected' : '' ) + '>Серый</option>' +
                '<option value="' + that.const.BORDER_COLOR_DARK_GREY + '" ' + (data.color == that.const.BORDER_COLOR_DARK_GREY ? 'selected' : '' ) + '>Темно-серый</option>' +
                '<option value="' + that.const.BORDER_COLOR_DARK_BLUE + '" ' + (data.color == that.const.BORDER_COLOR_DARK_BLUE ? 'selected' : '' ) + '>Темно-синий</option>' +
                '<option value="' + that.const.BORDER_COLOR_BLUE + '" ' + (data.color == that.const.BORDER_COLOR_BLUE ? 'selected' : '' ) + '>Синий</option>' +
                '<option value="' + that.const.BORDER_COLOR_LIGHT_BLUE + '" ' + (data.color == that.const.BORDER_COLOR_LIGHT_BLUE ? 'selected' : '' ) + '>Светло-синий</option>' +
                '<option value="' + that.const.BORDER_COLOR_PURPLE + '" ' + (data.color == that.const.BORDER_COLOR_PURPLE ? 'selected' : '' ) + '>Фиолетовый</option>' +
                '<option value="' + that.const.BORDER_COLOR_RED + '" ' + (data.color == that.const.BORDER_COLOR_RED ? 'selected' : '' ) + '>Красный</option>' +
                '<option value="' + that.const.BORDER_COLOR_GREEN + '" ' + (data.color == that.const.BORDER_COLOR_GREEN ? 'selected' : '' ) + '>Зеленый</option>' +
                '<option value="' + that.const.BORDER_COLOR_NONE + '" ' + (data.color == that.const.BORDER_COLOR_NONE ? 'selected' : '' ) + '>Безцветный</option>' +
                '</select>' +
                '</div>' +
                '</div>'

            ].join(''))
        });
    };
    that.settings_render_source_tab = function(data, tabs, active, widget){
        var $control__library = $([
                '<div class="control" style="flex: 0 0 auto;">',
                '<div class="control__caption control__caption_size_s">',
                '<div class="control__text">Страница</div>',
                '</div>',
                '<div class="control__container">',
                '<select class="select" name="pageid" data-fc="select" data-field="pageid" data-mode="radio-check" data-height="350"></select>',
                '</div>',
                '</div>'
            ].join('')),
            $control__widgets = $([
                '<div class="control" style="flex: 0 0 auto;">',
                '<div class="control__caption control__caption_size_s">',
                '<div class="control__text">Виджет</div>',
                '</div>',
                '<div class="control__container control__container_horizontal">',
                '<select class="select" name="elementid" data-fc="select" data-field="elementid" data-mode="radio-check" data-height="350"></select>',
                '</div>',
                '</div>'
            ].join('')),
            /*
            $control__dbm = $([
                '<div class="control" style="flex: 1 1 auto; display:none;">',
                '<div class="control__caption control__caption_size_s">',
                '<div class="control__text">ДБМ</div>',
                '</div>',
                '<div class="control__container control__container_horizontal asyst_editform" id="dbm__container"></div>',
                '</div>'
            ].join('')),
            */
            $button_add = $([
                '<button class="button" data-fc="button" style="margin-right: 10px;">',
                '<span class="icon icon_svg_plus"></span>',
                '</button>'
            ].join('')).on('click', function(){
                selects.widget.select('uncheck_all');
                selected.widget = null;
                update_widgets_buttons();
                that.dbm(widget, data, selected, selects);
                /*
                if (typeof that.data.dbm.addWidget == 'function') {
                    $control__widgets.find('[data-fc="select"]').select('uncheck_all');
                    selected.widget = null;
                    update_widgets_buttons();
                    resize_dbm_modal();
                    render_dbm_control();
                    that.data.dbm.addWidget(that.data.modal, widget, selected);
                    $button_save.button('show');
                }
                */
            }),
            $button_edit = $([
                '<button class="button" data-fc="button" style="margin-left: 10px;">',
                '<span class="icon icon_svg_edit"></span>',
                '</button>'
            ].join('')).on('click', function(){
                that.dbm(widget, data, selected, selects);
                /*
                if (typeof that.data.dbm.editWidget == 'function') {
                    resize_dbm_modal();
                    render_dbm_control();
                    that.data.dbm.editWidget(that.data.modal, widget, selected);
                    $button_save.button('show');
                }
                */
            }),
            $button_save = $([
                '<button class="button" data-fc="button" style="margin-left: 10px;">',
                '<span class="icon icon_svg_ok"></span>',
                '</button>'
            ].join('')).on('click', function(){
                /*
                if (typeof that.data.dbm.editWidget == 'function') {
                    that.data.dbm.saveWidget(that.data.modal, widget, selected);
                }
                */
            }),
            render = false, opened = false,
            selected = { lib: null, library: null, widget: null },
            selects = {
                library: $control__library.find('.select'),
                widget: $control__widgets.find('.select')
            },
            dbmKey = 'dbm';
        if (typeof data.lib == 'object') {
            $control__widgets.find('.control__container').prepend($button_add);
            $control__widgets.find('.control__container').append($button_edit);
            $control__widgets.find('.control__container').append($button_save);
            for (key in data.lib) {
                if (data.lib[key]) {
                    if (data.lib[key].library) {
                        data.lib[key].library.forEach(function(item){
                            var $option = $('<option value="' + item.value + '" ' + (item.value == data.pageid ? 'selected="selected"' : '') + '>' + item.text + '</option>');
                            if (item.value == data.pageid) {
                                selected.lib = key;
                                selected.library = item;
                                item.items.forEach(function(item){
                                    var $option = $('<option value="' + item.value + '" ' + (item.value == data.elementid ? 'selected="selected"' : '') + '>' + item.text + '</option>');
                                    selects.widget.append($option);
                                    if (item.value == data.elementid) {
                                        selected.widget = item;
                                    }
                                });
                            }
                            selects.library.append($option);
                            render = true;
                            prepare_widgets_buttons();
                        });
                        selects.library.on('change', function(e){
                            var value = $(this).select('value'), items = [];
                            for (lib in data.lib) {
                                if (data.lib[lib]) {
                                    if (data.lib[lib].library) {
                                        var library = data.lib[lib].library.filter(function(d){ return d.value == value; });
                                        if (library.length > 0) {
                                            library = library[0];
                                            selected.lib = lib;
                                            selected.library = library;
                                            selected.widget = null;
                                            if (library.items) {
                                                items.push.apply(items, library.items)
                                            }
                                        }
                                    }
                                }
                            }
                            $control__widgets.find('.select').select('update', items);
                            update_widgets_buttons();
                        });
                        selects.widget.on('change', function(e){
                            var value = $(this).select('value'), items = [];
                            if (value) {
                                var widget = selected.library.items.filter(function(d){ return d.value == value; });
                                if (widget.length > 0) {
                                    widget = widget[0];
                                    selected.widget = widget;
                                }
                            } else {
                                selected.widget = null;
                            }
                            update_widgets_buttons();
                        });
                        opened = true;
                    }
                }
            }
            if (!render) {
                $button_add.remove();
                $button_edit.remove();
                $button_save.remove();
            }
            tabs.push({
                id: 'source',
                name: 'Источник данных',
                active: active,
                content:
                    $('<div style="display: flex; flex-direction: column; height: 100%;"></div>').append($control__library, $control__widgets)
            });
        }
        function prepare_widgets_buttons(){
            $button_add.attr('data-hidden', true);
            $button_edit.attr('data-hidden', true);
            $button_save.attr('data-hidden', true);
            if (selected.lib == dbmKey) {
                if (selected.widget) {
                    $button_add.removeAttr('data-hidden');
                    $button_edit.removeAttr('data-hidden');
                } else {
                    $button_add.removeAttr('data-hidden');
                }
            }
        }
        function update_widgets_buttons(){
            $button_add.button('hide');
            $button_edit.button('hide');
            $button_save.button('hide');
            if (selected.lib == dbmKey) {
                if (selected.widget) {
                    $button_add.button('show');
                    $button_edit.button('show');
                } else {
                    $button_add.button('show');
                }
            }
        }
    };
    that.settings_apply = function(widget, data, reload){
        that.data.modal.find('[data-field]').each(function(){
            var t = $(this), val = t[t.data('fc').replace('-','_')]('value');
            if ((t.data('field') == 'pageid' ||
                t.data('field') == 'elementid') &&
                data[t.data('field')] != val) {
                reload = true;
            }
            _.set(data, t.data('field'), val);
            _.set(widget.data(), t.data('field'), val);
        });
        widget.widget('set_name');
        widget.widget('set_color');
        if (reload) { widget.widget('set_content'); }
    };
    /* modal for settings - end */

    /* modal for dbm */
    that.dbm = function(widget, data, selected, selects){
        var widget_dimm = {
            left: widget.offset().left,
            top: widget.offset().top,
            width: widget.outerWidth(),
            height: widget.outerHeight()
        };
        var window_dimm = {
            width: $(window).outerWidth(),
            height: $(window).outerHeight()
        };
        var modal_options = {
            buttons: [
                {
                    name: 'reload',
                    action: 'reload',
                    icon: 'icon_svg_refresh'
                },
                {
                    name: 'save',
                    action: 'save',
                    icon: 'icon_svg_save_red'
                },
                {
                    name: 'destroy',
                    action: 'destroy',
                    icon: 'icon_svg_close'
                },
                {
                    name: 'fullscreen',
                    action: 'fullscreen',
                    icon: 'icon_svg_fullscreen'
                }
            ],
            header: {
                caption: 'ДБМ',
                name: (selected.widget ? selected.widget.text : 'Новый виджет')
            },
            content: { tabs: [{
                id: 'general',
                name: 'general',
                active: true,
                content: ''
            }] },
            size: 'lg_max',
            position: (widget_dimm.left + widget_dimm.width/2) > window_dimm.width/2 ? 'top left' : 'top right',
            draggable: true,
            render_tabs_row: false
        };
        that.data.modal_dbm = $('<span class="modal__"></span>').appendTo('body')
            .modal__(modal_options)
            .on('reload.fc.modal', function(e){
                if (typeof that.data.lib.dbm.saveForm == 'function') {
                    var $container = that.data.modal_dbm.data()._el.card__middle_scroll.find('.asyst_editform');
                    that.loader_add($container);
                    setTimeout(function(){
                        that.data.lib.dbm.saveForm(widget, data, that.data.modal, selected, selects, function(){
                            that.loader_remove();
                        });
                    }, 100);
                }
            })
            .on('save.fc.modal', function(e){
                if (typeof that.data.lib.dbm.saveForm == 'function') {
                    var $this = $(this);
                    var $container = that.data.modal_dbm.data()._el.card__middle_scroll.find('.asyst_editform');
                    that.loader_add($container);
                    setTimeout(function(){
                        that.data.lib.dbm.saveForm(widget, data, that.data.modal, selected, selects, function(){
                            that.loader_remove();
                            $this.modal__('destroy');
                            if (typeof that.data.lib.dbm.closeForm == 'function') {
                                that.data.lib.dbm.closeForm(widget, data, that.data.modal, selected, selects);
                            }
                        });
                    }, 100);
                }
            })
            .on('showed.fc.modal', function(e){
                if (typeof that.data.lib.dbm.loadForm == 'function') {
                    var $container = that.data.modal_dbm.data()._el.card__middle_scroll.find('#general').addClass('asyst_editform');
                    that.loader_add($container);
                    setTimeout(function(){
                        that.data.lib.dbm.loadForm($container, widget, data, that.data.modal, selected, selects, function(){
                            that.loader_remove();
                        });
                    }, 100);
                }
            })
            .on('hidden.fc.modal', function(e){
                if (typeof that.data.lib.dbm.closeForm == 'function') {
                    that.data.lib.dbm.closeForm(widget, data, that.data.modal, selected, selects);
                }
            });
    };
    /* modal for dbm */

    that.loader_add = function(target){
        if (target) {
            target.before(that.data._el.loader)
        } else {
            that.data._el.target.before(that.data._el.loader)
        }
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.reload = {
        dashboard: function(options, params){
            that.data = $.extend(that.data, options, { params: params });
            that.init();
        },
        widgets: function(options, params, reload){
            if (typeof reload == 'undefined') { reload = true; }
            that.data.grid[0].obj.options.items.map(function(item){
                $.extend(item.widget.data(), options, { params: params });
                item.widget.widget('set_name');
                item.widget.widget('set_color');
                if (reload) {
                    item.widget.widget('set_content');
                }
            });
        },
        widget: function(id, options, params, reload){
            if (typeof reload == 'undefined') { reload = true; }
            var item = that.data.grid[0].obj.options.items.filter(function(d){
                return d._id == id;
            });
            if (item.length > 0) {
                item = item[0];
                $.extend(item.widget.data(), options, { params: params });
                item.widget.widget('set_name');
                item.widget.widget('set_color');
                if (reload) {
                    item.widget.widget('set_content');
                }
            }
        },
        widget_: function(widget, options, params, reload){
            if (typeof reload == 'undefined') { reload = true; }
            $.extend(widget.data(), options, { params: params });
            widget.widget('set_name');
            widget.widget('set_color');
            if (reload) {
                widget.widget('set_content');
            }
        },
        element: function(elementid, options, params, reload){
            if (typeof reload == 'undefined') { reload = true; }
            var item = that.data.grid[0].obj.options.items.filter(function(d){
                return d.widget[0].obj.data.elementid == elementid;
            });
            if (item.length > 0) {
                item = item[0];
                $.extend(item.widget.data(), options, { params: params });
                item.widget.widget('set_name');
                item.widget.widget('set_color');
                if (reload) {
                    item.widget.widget('set_content');
                }
            }
        },
        elementByName: function(elementname, options, params, reload){
            if (typeof reload == 'undefined') { reload = true; }
            var item = that.data.grid[0].obj.options.items.filter(function(d){
                return d.widget[0].obj.data.elementname == elementname;
            });
            if (item.length > 0) {
                item = item[0];
                $.extend(item.widget.data(), options, { params: params });
                item.widget.widget('set_name');
                item.widget.widget('set_color');
                if (reload) {
                    item.widget.widget('set_content');
                }
            }
        },
        title: function(title){
            that.set_title(title);
        },
        name: function(name){
            that.set_name(name);
        }
    };

    that.init_components = function(){
        that.data._el.popup_save.popup({
            source: that.data._el.button_more,
            height: 300,
            width: 250,
            animation: true,
            select: false,
            position: 'bottom right'
        })
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render_card();
            that.init_components();
            that.render_single();
            that.render_grid();
            that.store_to_window();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};

var DashboardGrid = function(options){
    var that = this._dashboard_grid = {};
    that.data = {
        allowedDashboards: [],
        allowedText: 'Только просмотр',
        allowedColor: null,
        editableDashboards: [],
        editableText: 'Редактируемые',
        editableColor: '#aaa',
        items: [],
        loader: null,
        defaults: {
            itemWidth: 2,
            itemHeight: 5,
            x: 0,
            y: 0,
            editable: -1
        },
        add: null,
        open: null,
        edit: null,
        remove: null,
        search: {
            text: '',
            timer: null
        },
        grid: null
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
        radiogroup: $('<span class="radio-group radio-group_type_buttons"></span>'),
        button_add: $([
            '<button class="button button_color_blue" type="button">',
            '<span class="icon icon_svg_plus_white"></span>',
            '<span class="button__text mobile mobile_hide">Создать дэшборд</span>',
            '</button>'
        ].join('')),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column" id="filter"></div>',
            //'<div class="card__header-column" id="actions"></div>',
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
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.render_filters = function(){
        that.data._el.radiogroup.append(
            that.data._el.button_add,
            $([
                '<label class="radio radio_type_button" data-fc="radio" data-checked="true">',
                '<button class="button button_toggable_radio" type="button" data-fc="button" data-checked="true">',
                '<span class="button__text">Все</span>',
                '</button>',
                '<input class="radio__input" type="radio" name="radio-group-button" value="-1" hidden/>',
                '</label>'
            ].join('')),
            $([
                '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + that.data.allowedText + '">',
                '<button class="button button_toggable_radio" type="button" data-fc="button">',
                '<span class="button__text">' + that.data.allowedText + '</span>',
                '<span class="icon">',
                '<span class="icon icon__circle" ' + (that.data.allowedColor ? 'style="background-color: ' + that.data.allowedColor + '"' : '') + '></span>',
                '</span>',
                '</button>',
                '<input class="radio__input" type="radio" name="radio-group-button" value="0" hidden/>',
                '</label>'
            ].join('')),
            $([
                '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + that.data.editableText + '">',
                '<button class="button button_toggable_radio" type="button" data-fc="button">',
                '<span class="button__text">' + that.data.editableText + '</span>',
                '<span class="icon">',
                '<span class="icon icon__circle" ' + (that.data.editableColor ? 'style="background-color: ' + that.data.editableColor + '"' : '') + '></span>',
                '</span>',
                '</button>',
                '<input class="radio__input" type="radio" name="radio-group-button" value="1" hidden/>',
                '</label>'
            ].join(''))
        );
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
    that.render_dbs = function(){
        that.data.allowedDashboards.forEach(function(db, i){
            db.visible = true;
            db.collapsed = false;
            db.editable = 0;
            db.color = that.data.allowedColor;
            that.add_db(db);
            that.data.defaults.x += that.data.defaults.itemWidth;
            if (that.data.defaults.x >= 12) {
                that.data.defaults.x = 0;
                that.data.defaults.y += that.data.defaults.itemHeight;
            }
        });
        that.data.editableDashboards.forEach(function(db, i){
            db.visible = true;
            db.collapsed = false;
            db.editable = 1;
            db.color = that.data.editableColor;
            that.add_db(db);
            that.data.defaults.x += that.data.defaults.itemWidth;
            if (that.data.defaults.x >= 12) {
                that.data.defaults.x = 0;
                that.data.defaults.y += that.data.defaults.itemHeight;
            }
        });
        that.data.grid.widget_grid('view_mode');
    };

    that.remove_dbs = function(){
        that.data.items = [];
        that.data.defaults.x = 0;
        that.data.defaults.y = 0;
        that.data.grid.widget_grid('clear');
    };
    that.remove_db = function(db){
        db.visible = false;
        db.collapsed = $('#' + db.PageId).data().collapsed;
        that.data.grid.widget_grid('remove_widget', db.PageId);
        that.data.items = that.data.items.filter(function(d){ return d._id != db.PageId; });
    };
    that.add_db = function(db){
        db.visible = true;
        var buttons = [{
            icon: 'icon_svg_dashboard',
            mode: 'view',
            click: function(widget, data){
                if (that.data.open && typeof that.data.open == 'function') {
                    that.data.open(
                        data,
                        function(successData){},
                        function(errorData){}
                    );
                }
            }
        }];
        if (db.editable == 1) {
            buttons.push({
                icon: 'icon_svg_edit',
                mode: 'view',
                click: function(widget, data){
                    if (that.data.edit && typeof that.data.edit == 'function') {
                        that.data.edit(
                            data,
                            function(successData){},
                            function(errorData){}
                        );
                    }
                }
            });
            buttons.push({
                icon: 'icon_svg_trash',
                mode: 'view',
                click: function(widget, data){
                    if (that.data.remove && typeof that.data.edit == 'function') {
                        that.data.remove(
                            data,
                            function(successData){
                                that.data.editableDashboards = that.data.editableDashboards.filter(function(d){
                                    return d.PageId != data.id;
                                });
                                that.remove_db(db);
                                that.filter_dbs();
                            },
                            function(errorData){}
                        );
                    }
                }
            });
        }
        var item = {
            x: that.data.defaults.x,
            y: that.data.defaults.y,
            width: that.data.defaults.itemWidth,
            height: that.data.defaults.itemHeight,
            settings: {
                id: db.PageId,
                pagename: db.Name,
                collapsed: db.collapsed,
                description: db.Description,
                title: db.Title,
                editable: db.editable,
                color: db.color,
                buttons: buttons
            }
        };
        that.data.items.push(item);
        that.data.grid.widget_grid('add_widget', item);
    };
    that.update_db = function(db){
        that.data.grid.widget_grid(
            'update_widget',
            db.PageId,
            that.data.defaults.x,
            that.data.defaults.y,
            that.data.defaults.itemWidth,
            that.data.defaults.itemHeight
        );
    };
    that.filter_dbs = function(){
        that.loader_add();
        setTimeout(function(){
            that.data.defaults.x = 0;
            that.data.defaults.y = 0;
            that.data.allowedDashboards.forEach(function(db){
                db.editable = 0;
                db.color = that.data.allowedColor;
                if ((+db.editable == +that.data.defaults.editable || +that.data.defaults.editable == -1) &&
                    (db.Title.toLowerCase().includes(that.data.search.text.toLowerCase()))) {
                    if (!db.visible) {
                        that.add_db(db);
                    } else {
                        that.update_db(db);
                    }
                    that.data.defaults.x += that.data.defaults.itemWidth;
                    if (that.data.defaults.x >= 12) {
                        that.data.defaults.x = 0;
                        that.data.defaults.y += that.data.defaults.itemHeight;
                    }
                } else {
                    if (db.visible) {
                        that.remove_db(db);
                    }
                }
            });
            that.data.editableDashboards.forEach(function(db){
                db.editable = 1;
                db.color = that.data.editableColor;
                if ((+db.editable == +that.data.defaults.editable || +that.data.defaults.editable == -1) &&
                    (db.Title.toLowerCase().includes(that.data.search.text.toLowerCase()))) {
                    if (!db.visible) {
                        that.add_db(db);
                    } else {
                        that.update_db(db);
                    }
                    that.data.defaults.x += that.data.defaults.itemWidth;
                    if (that.data.defaults.x >= 12) {
                        that.data.defaults.x = 0;
                        that.data.defaults.y += that.data.defaults.itemHeight;
                    }
                } else {
                    if (db.visible) {
                        that.remove_db(db);
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
        that.data._el.radiogroup.find('[data-fc="radio"]').on('click', function(){
            that.data.defaults.editable = $(this).radio_group('value');
            that.filter_dbs();
        });
        that.data._el.input.on('keyup', function(){
            clearTimeout(that.data.search.timer);
            that.data.search.text = $(this).input('value');
            that.data.search.timer = setTimeout(function(){
                that.filter_dbs();
            }, 300);
        });
        that.data._el.button_add.on('click', function(){
            if (that.data.add && typeof that.data.add == 'function') {
                that.data.add(
                    function(successData){
                        if (successData.editable == 1) {
                            successData.color = that.data.editableColor;
                            that.data.editableDashboards.push(successData);
                        } else if (successData.editable == 0) {
                            successData.color = that.data.allowedColor;
                            that.data.allowedDashboards.push(successData);
                        }
                        that.add_db(successData);
                        that.data.defaults.x += that.data.defaults.itemWidth;
                        if (that.data.defaults.x >= 12) {
                            that.data.defaults.x = 0;
                            that.data.defaults.y += that.data.defaults.itemHeight;
                        }
                    },
                    function(errorData){}
                );
            }
        });
    };

    that.init_components = function(){
        that.data._el.radiogroup.radio_group();
        that.data._el.button_add.button();
        that.data._el.input.input();
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
            that.render_dbs();
            that.init_components();
            that.bind();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
var DocSearch = function(options){
    var that = this._docsearch = {};
    that.data = {
        data: [],
        filter: {
            text: '',
            pagenum: 1,
            doctypes: [],
            author: -1,
            entitytype: ''
        },
        text: ''
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        input: $([
            '<span class="input input__has-clear" data-width="100%">',
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
        filters: {
            doctype: $('<select class="select" data-fc="select"></select>'),
            author: $('<select class="select" data-fc="select"></select>'),
            entity: $('<select class="select" data-fc="select"></select>'),
        },
        count: $([
            '<label class="card__name">',
            '<span class="card__name-text card__name-text_no-margin"></span>',
            '</label>'
        ].join('')),
        row_search: $([
            '<div class="card__header-row card__header-row_wrap">',
            '<div class="card__header-column card__header-column_stretch" id="doc__input"></div>',
            '</div>'
        ].join('')),
        row_filter: $([
            '<div class="card__header-row">',
            '<div class="card__header-column" id="doc__filter"></div>',
            '<div class="card__header-column" id="doc__count"></div>',
            '</div>'
        ].join('')),
        table: $([
            '<table class="table">',
            '<thead>',
            '<tr>',
                '<td class="table__td_no_border">Тип</td>',
                '<td class="table__td_no_border">Название файла</td>',
                '<td class="table__td_no_border">Автор</td>',
                '<td class="table__td_no_border">Тип карточки</td>',
                '<td class="table__td_no_border">Наименование</td>',
                '<td class="table__td_no_border">Дата изменения</td>',
                '<td class="table__td_no_border">Размер</td>',
                '<td class="table__td_no_border">Версия</td>',
            '</tr>',
            '</thead>',
            '<tbody></tbody>',
            '</table>'
        ].join('')),
        content: $([
            '<div class="card">',
            '<div class="card__header" id="doc__header"></div>',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="doc__table"></div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };
    that.data._private = {
        rdata: Enumerable.From(that.data.data),
        fdata: Enumerable.From(that.data.data), // фильтрованный
        tdata: Enumerable.Empty(), // по типам документов
        adata: Enumerable.Empty(), // по авторам
        edata: Enumerable.Empty(), // по типам карточек
        uniqueExtensions: Enumerable.From(that.data.data).Distinct("$.ext.toLowerCase()").OrderBy("$.ext").Select("{ext:$.ext, icon:$.icon}"),
        uniqueAuthors:    Enumerable.From(that.data.data).Distinct("$.creationAuthorId").OrderBy("$.userName").Select("{creationAuthorId:$.creationAuthorId, userName:$.userName}").Where("$.creationAuthorId!=0"),
        uniqueEntities:   Enumerable.From(that.data.data).Distinct("$.entityName").OrderBy("$.entityTitle").Select("{entityName:$.entityName, entityTitle:$.entityTitle}"),
        filters: {
            doctype: [],
            author: [],
            entity: []
        }
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.render_search_line = function(){
        that.data.text = that.get_url_parameter('text');
        that.data._el.row_search.find('#doc__input').append(
            that.data._el.input
        );
        that.data._el.content.find('#doc__header').append(
            that.data._el.row_search
        );
        that.data._el.input.find('.input__control').val(that.data.text);
        that.data._el.input.find('.input__control').keypress(function(e){
            if (e.which == 13) {
                window.location.href = that.set_url_parameter(window.location.href, 'text', $(this).val());
            }
        })
    };
    that.render_filters = function(){
        if (that.data._private.uniqueExtensions.Count() > 0){
            that.data._private.uniqueExtensions.ForEach(function(item){
                var $option = $('<option value="' + item.ext + '">' + item.ext + '</option>');
                that.data._el.filters.doctype.append($option);
            });
            that.data._el.filters.doctype.change(function(){
                that.data._private.filters.doctype = $(this).select('value');
                that.set_filter();
                that.render_count();
                that.render_table();
            });
        }
        if (that.data._private.uniqueAuthors.Count() > 0){
            that.data._private.uniqueAuthors.ForEach(function(item){
                var $option = $('<option value="' + item.creationAuthorId + '">' + item.userName + '</option>');
                that.data._el.filters.author.append($option);
            });
            that.data._el.filters.author.change(function(){
                that.data._private.filters.author = $(this).select('value');
                that.set_filter();
                that.render_count();
                that.render_table();
            });
        }
        if (that.data._private.uniqueEntities.Count() > 0){
            that.data._private.uniqueEntities.ForEach(function(item){
                var $option = $('<option value="' + item.entityName + '">' + item.entityTitle + '</option>');
                that.data._el.filters.entity.append($option);
            });
            that.data._el.filters.entity.change(function(){
                that.data._private.filters.entity = $(this).select('value');
                that.set_filter();
                that.render_count();
                that.render_table();
            });
        }
        that.data._el.row_filter.find('#doc__filter').append(
            that.data._el.filters.doctype,
            that.data._el.filters.author,
            that.data._el.filters.entity
        );
        that.data._el.row_filter.find('#doc__count').append(
            that.data._el.count
        );
        that.data._el.content.find('#doc__header').append(
            that.data._el.row_filter
        );
    };
    that.render_count = function(){
        that.data._el.count.find('.card__name-text').text(that.data._private.fdata.Count());
    };
    that.render_table = function(){
        that.data._el.table.find('tbody').empty();
        that.data._private.fdata.ForEach(function(item){
            that.data._el.table.find('tbody').append($([
                '<tr>',
                '<td><img class="doctype" src="' + item.icon + '"></td>',
                '<td><a class="link" href="' + item.url + '" target="_blank">' + item.name + item.ext + '</a></td>',
                '<td>' + item.userName + '</td>',
                '<td>' + item.entityTitle + '</td>',
                '<td>' + item.dataName + '</td>',
                '<td>' + item.creationDate + '</td>',
                '<td>' + filesize(item.fileLength, {base: 2}) + '</td>',
                '<td>' + item.vers + '</td>',
                '</tr>'
            ].join('')));
        });
        if (typeof(that.data._el.content.find('#doc__table .table')[0]) == typeof(undefined)) {
            that.data._el.content.find('#doc__table').append(
                that.data._el.table
            );
        }
    };
    that.render_nodata = function(){
        that.data._el.table.find('tbody').empty();
        that.data._el.table.find('tbody').append($([
            '<tr>',
            '<td colspan="8">Не найдено ни одного документа</td>',
            '</tr>'
        ].join('')));
        if (typeof(that.data._el.content.find('#doc__table .table')[0]) == typeof(undefined)) {
            that.data._el.content.find('#doc__table').append(
                that.data._el.table
            );
        }
    };

    that.set_filter = function(){
        that.data._private.fdata = Enumerable.From(that.data.data);
        var data1 = Enumerable.Empty();
        if (that.data._private.filters.doctype) {
            that.data._private.filters.doctype.forEach(function(val){
                var data = that.data._private.fdata.Where('$.ext=="' + val + '"');
                data1 = data1.Concat(data);
            });
        }
        var data2 = Enumerable.Empty();
        if (that.data._private.filters.author) {
            that.data._private.filters.author.forEach(function(val){
                var data = that.data._private.fdata.Where('$.creationAuthorId=="' + val + '"');
                data2 = data2.Concat(data);
            });
        }
        var data3 = Enumerable.Empty();
        if (that.data._private.filters.entity) {
            that.data._private.filters.entity.forEach(function(val){
                var data = that.data._private.fdata.Where('$.entityName=="' + val + '"');
                data3 = data3.Concat(data);
            });
        }
        if (data1.Count() == 0) { data1 = Enumerable.From(that.data.data); }
        if (data2.Count() == 0) { data2 = Enumerable.From(that.data.data); }
        if (data3.Count() == 0) { data3 = Enumerable.From(that.data.data); }
        that.data._private.fdata = data1.Intersect(data2).Intersect(data3).OrderBy("$.fileId");
    };

    that.set_url_parameter = function(url, param, paramVal){
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (i=0; i<tempArray.length; i++){
                if(tempArray[i].split('=')[0] != param){
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }
        var rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    };
    that.get_url_parameter = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.init_components = function(){
        that.data._el.filters.doctype.select({
            width: 200,
            mode: 'check',
            autoclose: false,
            placeholder: 'Тип документа'
        });
        that.data._el.filters.author.select({
            width: 200,
            mode: 'check',
            autoclose: false,
            placeholder: 'Автор'
        });
        that.data._el.filters.entity.select({
            width: 200,
            mode: 'check',
            autoclose: false,
            placeholder: 'Тип карточки'
        });
        that.data._el.input.input();
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.render_search_line();
            if (that.data._private.rdata.Count() > 0) {
                that.render_filters();
                that.render_count();
                that.render_table();
            } else {
                if (that.data.text != '') {
                    that.render_nodata();
                }
            }
            that.init_components();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
var GridView = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        header: {
            views: [],
            reload: null,
            settings: [],
            search: null
        },
        render: function(){}
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({
            width: '100%',
            height: '100%',
            display: 'flex'
        }),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        select_view: $('<select class="select" data-fc="select"></select>'),
        button_reload: $([
            '<button class="button" data-fc="button" style="width: auto;">',
            '<span class="icon icon_svg_refresh"></span>',
            '</button>'
        ].join('')),
        button_settings: $([
            '<button class="button" data-fc="button" data-toggle="popup" style="width: auto;">',
            '<span class="icon icon_svg_settings"></span>',
            '<span class="icon icon_svg_down icon_animate"></span>',
            '</button>'
        ].join('')),
        popup_settings: $([
            '<div class="popup popup_animation" data-position="bottom left" data-width="auto" style="width: auto; left: 524px; top: 50px;">',
            '<ul class="popup__list"></ul>',
            '</div>'
        ].join('')),
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        button_extFilter: null,
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
                '<div class="card__header">',
                    '<div class="card__header-row">',
                        '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
                        '<div class="card__header-column" id="grid__actions"></div>',
                    '</div>',
                '</div>',
                '<div class="card__main">',
                    '<div class="card__middle">',
                        '<div class="card__middle-scroll" id="grid__container"></div>',
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
        that.render_container();
        that.render_title();
        that.render_views();
        that.render_reload();
        that.render_settings();
        that.render_settings_popup();
        that.render_search();
        that.render_extFilter();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.select_view.append(
                    $('<option value="' + view.value + '" ' + (view.selected ? 'selected' : '') + '>' + view.name + '</option>')
                );
            });
            that.data._el.content.find('#grid__view').append(
                that.data._el.select_view
            );
            that.data._el.select_view.on('change', function(){
                var value = $(this).val();
                var view = that.data.header.views.filter(function(v){ return v.value == value; });
                if (view.length > 0) {
                    view = view[0];
                    if (typeof(view.onclick) == 'function') {
                        view.onclick();
                    }
                }
            })
        }
    };
    that.render_reload = function(){
        if (that.data.header.reload) {
            if (typeof that.data.header.reload.onclick == 'function') {
                that.data._el.button_reload.on('click',
                    that.data.header.reload.onclick);
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.button_reload
                );
            }
        }
    };
    that.render_settings = function(){
        if (that.data.header.settings.length > 0) {
            that.data._el.content.find('#grid__actions').append(
                that.data._el.button_settings,
                that.data._el.popup_settings
            );
        }
    };
    that.render_settings_popup = function(){
        that.data._el.popup_settings.find('.popup__list').empty();
        that.data.header.settings.forEach(function(item){
            var $popup__list_item = $([
                '<li class="popup__list-item">',
                '<span class="popup__link">',
                (item.icon ? '<span class="icon ' + item.icon + '"></span>' : ''),
                '<span class="popup__text">' + item.name + '</span>',
                '</span>',
                '</li>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $popup__list_item.on('click', item.onclick);
            }
            that.data._el.popup_settings.find('.popup__list').append($popup__list_item);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };
    that.render_extFilter = function(){
        if (that.data.header.extFilter) {
            var item = that.data.header.extFilter;
            var $button = $([
                '<button class="button" type="button" data-fc="button"' + (item.id ? ' id="' + item.id + '"' : ''),
                ' data-tooltip="' + item.name + '">',
                '<span class="icon ' + item.icon + '"></span>',
                '</button>'
            ].join('')).button();
            if (typeof item.onclick == 'function') {
                $button.on('click', item.onclick);
            }
            that.data._el.content.find('#grid__actions').append($button);
            that.data._el.button_extFilter = $button;
        }
    };

    that.menu__item_lock = function(){
        that.data._el.select_view.select('disable');
        that.data._el.button_reload.button('disable');
        that.data._el.button_settings.button('disable');
        that.data._el.input_search.input('disable');
        if (that.data._el.button_extFilter) {
            that.data._el.button_extFilter.button('disable');
        }
    };
    that.menu__item_unlock = function(){
        that.data._el.select_view.select('enable');
        that.data._el.button_reload.button('enable');
        that.data._el.button_settings.button('enable');
        that.data._el.input_search.input('enable');
        if (that.data._el.button_extFilter) {
            that.data._el.button_extFilter.button('enable');
        }
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.init_components = function(){
        that.data._el.select_view.select({
            width: '200',
            popup_width: 'auto',
            mode: 'radio',
            autoclose: true,
            placeholder: 'Представление'
        });
        that.data._el.button_reload.button();
        that.data._el.button_settings.button();
        that.data._el.popup_settings.popup({
            source: that.data._el.button_settings,
            width: 'auto'
        });
        that.data._el.input_search.input();
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
var GridView2 = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        header: {
            views: [],
            reload: null,
            settings: [],
            search: null
        },
        render: function(){}
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({
            width: '100%',
            height: '100%',
            display: 'flex'
        }),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        radio_group: $('<span class="radio-group radio-group_type_buttons"></span>'),
        buttons: [],
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
            '<div class="card__header-column" id="grid__actions"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="grid__container"></div>',
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
        that.render_container();
        that.render_title();
        that.render_views();
        that.render_search();
        that.render_buttons();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.radio_group.append(
                    $([
                        '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + view.name + '" ' + (view.selected ? 'data-checked="true"' : '') + '>',
                            '<button class="button button_toggable_radio" type="button" data-fc="button">',
                                '<span class="button__text">' + view.name + '</span>',
                            '</button>',
                            '<input class="radio__input" type="radio" name="radio-group-button" value="' + view.value + '" hidden="">',
                        '</label>'
                    ].join(''))
                );
            });
            that.data._el.content.find('#grid__view').append(
                that.data._el.radio_group
            );
        }
    };
    that.render_buttons = function(){
        if (that.data.header.extFilter) {
            that.data.header.settings.push(that.data.header.extFilter);
        }
        that.data.header.settings.forEach(function(item){
            var $button = $([
                '<button class="button" type="button" data-fc="button"' + (item.id ? ' id="' + item.id + '"' : ''),
                ' data-tooltip="' + item.name + '">',
                '<span class="icon ' + item.icon + '"></span>',
                '</button>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $button.on('click', item.onclick);
            }
            that.data._el.content.find('#grid__actions').append($button);
            that.data._el.buttons.push($button);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false;
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };

    that.menu__item_lock = function(){
        that.data._el.radio_group.radio_group('disable');
        that.data._el.input_search.input('disable');
        that.data._el.buttons.map(function(b){
            b.button('disable');
        });
    };
    that.menu__item_unlock = function(){
        that.data._el.radio_group.radio_group('enable');
        that.data._el.input_search.input('enable');
        that.data._el.buttons.map(function(b){
            b.button('enable');
        });
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.radio_group.find('[data-fc="radio"]').on('click', function(){
            var value = $(this).radio_group('value');
            var view = that.data.header.views.filter(function(v){ return v.value == value; });
            if (view.length > 0) {
                view = view[0];
                if (typeof(view.onclick) == 'function') {
                    view.onclick();
                }
            }
        });
    };

    that.init_components = function(){
        that.data._el.radio_group.radio_group();
        that.data._el.input_search.input();
        that.data._el.buttons.map(function($button){
            $button.button();
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            that.bind();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
var GridView3 = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        header: {
            views: [],
            reload: null,
            settings: [],
            search: null
        },
        render: function(){},
        loading: false
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({
            width: '100%',
            height: '100%',
            display: 'flex'
        }),
        button_toggle_left: $([
            '<button class="button" type="button" data-fc="button" data-toggle="left">',
            '<span class="icon icon_svg_double_right"></span>',
            '</button>'
        ].join('')),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        menu__list: $('<ul class="menu__list"></ul>'),
        buttons: [],
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
                '<div class="card__header">',
                    '<div class="card__header-row">',
                        '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
                        '<div class="card__header-column" id="grid__actions"></div>',
                    '</div>',
                '</div>',
                '<div class="card__main">',
                    '<div class="card__left">',
                        '<div class="menu menu_color_light" data-fc="menu"></div>',
                    '</div>',
                    '<div class="card__middle">',
                        '<div class="card__middle-scroll" id="grid__container"></div>',
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
        that.render_container();
        that.render_title();
        that.render_views();
        that.render_search();
        that.render_buttons();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.button_toggle_left,
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.menu__list.append(
                    $([
                        '<li class="menu__item">',
                        '<a class="menu__item-link ' + (view.selected ? 'menu__item-link_selected' : '') + ' link" data-value="' + view.value + '">',
                        '<span class="menu__item-link-content">',
                        '<span class="menu__icon icon icon_svg_list"></span>',
                        '<span class="menu__item-text">' + view.name + '</span>',
                        (view.count ? '<span class="menu__item-text">' + view.count + '</span>' : ''),
                        '</span>',
                        '</a>',
                        '</li>'
                    ].join(''))
                );
            });
            that.data._el.content.find('[data-fc="menu"]').append(
                that.data._el.menu__list
            );
        }
    };
    that.render_buttons = function(){
        if (that.data.header.extFilter) {
            that.data.header.settings.push(that.data.header.extFilter);
        }
        that.data.header.settings.forEach(function(item){
            var $button = $([
                '<button class="button" type="button" data-fc="button"' + (item.id ? ' id="' + item.id + '"' : ''),
                ' data-tooltip="' + item.name + '">',
                '<span class="icon ' + item.icon + '"></span>',
                '</button>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $button.on('click', item.onclick);
            }
            that.data._el.content.find('#grid__actions').append($button);
            that.data._el.buttons.push($button);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false;
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };

    that.menu__item_lock = function(){
        that.data._el.input_search.input('disable');
        that.data._el.buttons.map(function(b){
            b.button('disable');
        });
        that.data._el.menu__list.find('.menu__item-link').addClass('menu__item-link_disabled');
        that.data._el.menu__list.find('.menu__item-link_selected').removeClass('menu__item-link_disabled');
    };
    that.menu__item_unlock = function(){
        that.data._el.input_search.input('enable');
        that.data._el.buttons.map(function(b){
            b.button('enable');
        });
        that.data._el.menu__list.find('.menu__item-link').removeClass('menu__item-link_disabled');
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.menu__list.find('.menu__item-link').on('click', function(){
            if (!that.data.loading) {
                that.data._el.menu__list.find('.menu__item-link').removeClass('menu__item-link_selected');
                $(this).addClass('menu__item-link_selected');
                var value = $(this).data('value');
                that.data.header.views.map(function(v){ v.selected = false; });
                var view = that.data.header.views.filter(function(v){ return v.value == value; });
                if (view.length > 0) {
                    view = view[0];
                    view.selected = true;
                    if (typeof(view.onclick) == 'function') {
                        view.onclick();
                    }
                }
            }
        });
    };

    that.init_components = function(){
        that.data._el.button_toggle_left.button();
        that.data._el.content.card();
        //that.data._el.menu__list.menu();
        that.data._el.input_search.input();
        that.data._el.buttons.map(function($button){
            $button.button();
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            that.bind();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
var GridView4 = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        header: {
            views: [],
            reload: null,
            settings: [],
            search: null
        },
        render: function(){}
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({
            width: '100%',
            height: '100%',
            display: 'flex'
        }),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        radio_group: $('<span class="radio-group radio-group_type_buttons"></span>'),
        buttons: [],
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
            '<div class="card__header-column" id="grid__actions"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="grid__container"></div>',
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
        that.render_container();
        //that.render_title();
        that.render_views();
        that.render_search();
        //that.render_buttons();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.radio_group.append(
                    $([
                        '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + view.name + '" ' + (view.selected ? 'data-checked="true"' : '') + '>',
                        '<button class="button button_toggable_radio" type="button" data-fc="button" data-checked="false">',
                        '<span class="button__text">' + view.name + '</span>',
                        '</button>',
                        '<input class="radio__input" type="radio" name="radio-group-button" value="' + view.value + '" hidden="">',
                        '</label>'
                    ].join(''))
                );
            });
            that.data._el.content.find('#grid__view').append(
                that.data._el.radio_group
            );
        }
    };
    that.render_buttons = function(){
        if (that.data.header.extFilter) {
            that.data.header.settings.push(that.data.header.extFilter);
        }
        that.data.header.settings.forEach(function(item){
            var $button = $([
                '<button class="button" type="button" data-fc="button"' + (item.id ? ' id="' + item.id + '"' : ''),
                ' data-tooltip="' + item.name + '">',
                '<span class="icon ' + item.icon + '"></span>',
                '</button>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $button.on('click', item.onclick);
            }
            that.data._el.content.find('#grid__actions').append($button);
            that.data._el.buttons.push($button);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };

    that.menu__item_lock = function(){
        that.data._el.radio_group.radio_group('disable');
        that.data._el.input_search.input('disable');
        that.data._el.buttons.map(function(b){
            b.button('disable');
        });
    };
    that.menu__item_unlock = function(){
        that.data._el.radio_group.radio_group('enable');
        that.data._el.input_search.input('enable');
        that.data._el.buttons.map(function(b){
            b.button('enable');
        });
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.radio_group.find('[data-fc="radio"]').on('click', function(){
            var value = $(this).radio_group('value');
            var view = that.data.header.views.filter(function(v){ return v.value == value; });
            if (view.length > 0) {
                view = view[0];
                if (typeof(view.onclick) == 'function') {
                    view.onclick();
                }
            }
        });
    };

    that.init_components = function(){
        that.data._el.radio_group.radio_group();
        that.data._el.input_search.input();
        that.data._el.buttons.map(function($button){
            $button.button();
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            that.bind();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
}; //short
var GridView5 = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        render: function(){}
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({
            width: '100%',
            height: '100%',
            display: 'flex'
        }),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        radio_group: $('<span class="radio-group radio-group_type_buttons"></span>'),
        buttons: [],
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="grid__container"></div>',
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
        that.render_container();
        //that.render_title();
        //that.render_views();
        //that.render_search();
        //that.render_buttons();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.radio_group.append(
                    $([
                        '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + view.name + '" ' + (view.selected ? 'data-checked="true"' : '') + '>',
                        '<button class="button button_toggable_radio" type="button" data-fc="button" data-checked="false">',
                        '<span class="button__text">' + view.name + '</span>',
                        '</button>',
                        '<input class="radio__input" type="radio" name="radio-group-button" value="' + view.value + '" hidden="">',
                        '</label>'
                    ].join(''))
                );
            });
            that.data._el.content.find('#grid__view').append(
                that.data._el.radio_group
            );
        }
    };
    that.render_buttons = function(){
        if (that.data.header.extFilter) {
            that.data.header.settings.push(that.data.header.extFilter);
        }
        that.data.header.settings.forEach(function(item){
            var $button = $([
                '<button class="button" type="button" data-fc="button"' + (item.id ? ' id="' + item.id + '"' : ''),
                ' data-tooltip="' + item.name + '">',
                '<span class="icon ' + item.icon + '"></span>',
                '</button>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $button.on('click', item.onclick);
            }
            that.data._el.content.find('#grid__actions').append($button);
            that.data._el.buttons.push($button);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };

    that.menu__item_lock = function(){
        that.data._el.radio_group.radio_group('disable');
        that.data._el.input_search.input('disable');
        that.data._el.buttons.map(function(b){
            b.button('disable');
        });
    };
    that.menu__item_unlock = function(){
        that.data._el.radio_group.radio_group('enable');
        that.data._el.input_search.input('enable');
        that.data._el.buttons.map(function(b){
            b.button('enable');
        });
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.radio_group.find('[data-fc="radio"]').on('click', function(){
            var value = $(this).radio_group('value');
            var view = that.data.header.views.filter(function(v){ return v.value == value; });
            if (view.length > 0) {
                view = view[0];
                if (typeof(view.onclick) == 'function') {
                    view.onclick();
                }
            }
        });
    };

    that.init_components = function(){
        that.data._el.radio_group.radio_group();
        that.data._el.input_search.input();
        that.data._el.buttons.map(function($button){
            $button.button();
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            that.bind();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
}; //no header
var GridView6 = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        header: {
            views: [],
            reload: null,
            settings: [],
            search: null
        },
        render: function(){},
        loading: false
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({
            width: '100%',
            height: '100%',
            display: 'flex'
        }),
        button_toggle_left: $([
            '<button class="button" type="button" data-fc="button" data-toggle="left">',
            '<span class="icon icon_svg_double_right"></span>',
            '</button>'
        ].join('')),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        menu__list: $('<ul class="menu__list"></ul>'),
        buttons: [],
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
            '<div class="card__header-column" id="grid__actions"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__left">',
            '<div class="menu menu_color_light" data-fc="menu"></div>',
            '</div>',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="grid__container"></div>',
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
        that.render_container();
        that.render_title();
        that.render_views();
        that.render_search();
        that.render_buttons();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.button_toggle_left,
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.menu__list.append(
                    $([
                        '<li class="menu__item">',
                        '<a class="menu__item-link ' + (view.selected ? 'menu__item-link_selected' : '') + ' link" data-value="' + view.value + '">',
                        '<span class="menu__item-link-content">',
                        '<span class="menu__icon icon icon_svg_list"></span>',
                        '<span class="menu__item-text">' + view.name + '</span>',
                        (view.count ? '<span class="menu__item-text">' + view.count + '</span>' : ''),
                        '</span>',
                        '</a>',
                        '</li>'
                    ].join(''))
                );
            });
            that.data._el.content.find('[data-fc="menu"]').append(
                that.data._el.menu__list
            );
        }
    };
    that.render_buttons = function(){
        if (that.data.header.extFilter) {
            that.data.header.settings.push(that.data.header.extFilter);
        }
        if (that.data.header.extraButtons) {
            that.data.header.extraButtons.forEach(function(extraButton){
                that.data.header.settings.push(extraButton);
            });
        }
        that.data.header.settings.forEach(function(item){
            var $button = $([
                '<button class="button" type="button" data-fc="button"' + (item.id ? ' id="' + item.id + '"' : ''),
                ' data-tooltip="' + item.name + '">',
                '<span class="icon ' + item.icon + '"></span>',
                '</button>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $button.on('click', item.onclick);
            }
            that.data._el.content.find('#grid__actions').append($button);
            that.data._el.buttons.push($button);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false;
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };

    that.menu__item_lock = function(){
        that.data._el.input_search.input('disable');
        that.data._el.buttons.map(function(b){
            b.button('disable');
        });
        that.data._el.menu__list.find('.menu__item-link').addClass('menu__item-link_disabled');
        that.data._el.menu__list.find('.menu__item-link_selected').removeClass('menu__item-link_disabled');
    };
    that.menu__item_unlock = function(){
        that.data._el.input_search.input('enable');
        that.data._el.buttons.map(function(b){
            b.button('enable');
        });
        that.data._el.menu__list.find('.menu__item-link').removeClass('menu__item-link_disabled');
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.menu__list.find('.menu__item-link').on('click', function(){
            if (!that.data.loading) {
                that.data._el.menu__list.find('.menu__item-link').removeClass('menu__item-link_selected');
                $(this).addClass('menu__item-link_selected');
                var value = $(this).data('value');
                that.data.header.views.map(function(v){ v.selected = false; });
                var view = that.data.header.views.filter(function(v){ return v.value == value; });
                if (view.length > 0) {
                    view = view[0];
                    view.selected = true;
                    if (typeof(view.onclick) == 'function') {
                        view.onclick();
                    }
                }
            }
        });
    };

    that.init_components = function(){
        that.data._el.button_toggle_left.button();
        that.data._el.content.card();
        //that.data._el.menu__list.menu();
        that.data._el.input_search.input();
        that.data._el.buttons.map(function($button){
            $button.button();
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            that.bind();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
}; //GridView3 with extra buttons
var GridViewEmpty = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        render: null
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({
            width: '100%',
            height: '100%',
            display: 'flex'
        }),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text card__name-text_color_red"></span>',
            '</label>'
        ].join('')),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="grid__container"></div>',
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
        that.render_title();
    };

    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.name
            );
        }
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            if (typeof that.data.render == 'function') { that.data.render(); }
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
                repFavoriteId: report.repFavoriteId,
                buttons: [
                    {
                        icon: (report.repFavoriteId ? 'icon_svg_favorite_red': 'icon_svg_favorite'),
                        tooltip: (report.repFavoriteId ? 'Убрать из избранного': 'Добавить в избранное'),
                        mode: 'view',
                        click: function(widget, data){
                            that.toggle_favorite(widget, data);
                            if (data.repFavoriteId) {
                                if (that.data.removeFavorite && typeof that.data.removeFavorite == 'function') {
                                    that.data.removeFavorite(
                                        data,
                                        function(successData){
                                            that.data.reports.filter(function(d){ return d.ReportingId == data.id; })[0].repFavoriteId = null;
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
                                            that.data.reports.filter(function(d){ return d.ReportingId == data.id; })[0].repFavoriteId = successData.id;
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
                    (that.data.defaults.favorite && report.repFavoriteId || !that.data.defaults.favorite) &&
                    (report.Title.toLowerCase().indexOf(that.data.search.text.toLowerCase()) >= 0)) {
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
        that.data.reports.filter(function(d){ return d.ReportingId == data.id; })[0].repFavoriteId = widget.data().repFavoriteId;
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
var GridBoard = function(options){
    var that = this._gridboard = {};
    that.data = {
        title: null,
        margin: true,
        allowSearch: true,
        items: [],
        loader: null,
        defaults: {
            itemWidth: 3,
            itemHeight: 3,
            x: 0,
            y: 0
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
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        widget_grid: $('<div class="widget-grid grid-stack" data-gs-animate="true"></div>'),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };

    that.render = function(){
        if (!that.data.title && !that.data.allowSearch) {
            that.data._el.content.closestChild('.card__header').remove();
        }
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.content.closestChild('#name .card__name-text').html(that.data.title);
        }
    };
    that.render_filters = function(){
        if (that.data.allowSearch) {
            that.data._el.content.closestChild('#search').append(
                that.data._el.input
            );
        }
    };

    that.render_grid = function(){
        var widget_grid_options = {
            items: that.data.data,
            margin: that.data.margin,
            loader: that.data.loader
        };
        that.data._el.content.closestChild('.card__middle-scroll').append(that.data._el.widget_grid);
        that.data.grid = that.data._el.widget_grid.widget_grid(widget_grid_options);
    };
    that.render_items = function(){
        that.data.items.forEach(function(item, i){
            item.visible = true;
            item.collapsed = (item.collapsed ? true : false);
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
                    icon: 'icon icon_svg_download',
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
        $('body').tooltip('clear');
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
var CalendarEvent = function(options){
    var that = this._calendar_event = {};
    that.data = {
        containerid: '',
        events: [],
        title: 'Календарь',
        api: {
            new: function(){},
            click: function(){},
            update: function(){},
            delete: function(){}
        }
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({
            width: '100%',
            height: '100%',
            display: 'flex'
        }),
        card: $([
            '<div class="card">',
            '<div class="card__header" style="border:none;">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="ce__name"></div>',
            '<div class="card__header-column" id="ce__actions"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__left" style="border-top: solid 1px #474c63;">',
            '<div class="menu menu_color_light">',
            '<div class="menu__calendar"></div>',
            '</div>',
            '</div>',
            '<div class="card__middle">',
            '<div class="calendar_dark" id="ce__view">',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        card__name: $([
            '<label class="card__name">',
            '<span class="card__name-text">' + that.data.title + '</span>',
            '</label>'
        ].join('')),
        card__date: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        button_toggle_left: $([
            '<button class="button" type="button" data-fc="button" data-toggle="left">',
            '<span class="icon icon_svg_double_right"></span>',
            '</button>'
        ].join('')),
        button_nav: $('<span class="button-group" data-fc="button-group"></span>'),
        button_today: $([
            '<button class="button" type="button" data-fc="button">',
            '<span class="button__text">Сегодня</span>',
            '</button>'
        ].join('')),
        button_prev: $([
            '<button class="button" type="button" data-fc="button">',
            '<span class="icon icon_svg_left"></span>',
            '</button>'
        ].join('')),
        button_next: $([
            '<button class="button" type="button" data-fc="button">',
            '<span class="icon icon_svg_right"></span>',
            '</button>'
        ].join('')),
        select_view: $([
            '<select class="select" data-fc="select">',
            '<option value="month" selected>Месяц</option>',
            '<option value="agendaWeek">Неделя</option>',
            '<option value="agendaDay">День</option>',
            '<option value="listWeek">Повестка дня</option>',
            '</select>'
        ].join('')),
        radio_group: $([
            '<span class="radio-group radio-group_type_button" data-fc="radio-group">',
            '<label class="radio radio_type_button" data-fc="radio">',
            '<button class="button button_toggable_radio" type="button" data-fc="button">',
            '<span class="button__text">Месяц</span>',
            '</button>',
            '<input class="radio__input" type="radio" name="radio-group-button" value="month" hidden="">',
            '</label>',
            '<label class="radio radio_type_button" data-fc="radio">',
            '<button class="button button_toggable_radio" type="button" data-fc="button">',
            '<span class="button__text">Неделя</span>',
            '</button>',
            '<input class="radio__input" type="radio" name="radio-group-button" value="agendaWeek" hidden="">',
            '</label>',
            '<label class="radio radio_type_button" data-fc="radio">',
            '<button class="button button_toggable_radio" type="button" data-fc="button">',
            '<span class="button__text">День</span>',
            '</button>',
            '<input class="radio__input" type="radio" name="radio-group-button" value="agendaDay" hidden="">',
            '</label>',
            '<label class="radio radio_type_button" data-fc="radio">',
            '<button class="button button_toggable_radio" type="button" data-fc="button">',
            '<span class="button__text">Повестка недели</span>',
            '</button>',
            '<input class="radio__input" type="radio" name="radio-group-button" value="listWeek" hidden="">',
            '</label>',
            '</span>'
        ].join('')),
        menu_calendar: $('<div id="ce__menu_calendar"></div>'),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };
    that.data._today = new Date();
    that.data._menu_calendar = null;
    that.data._full_calendar = null;
    that.data._current = {
        view: null,
        date: null,
        day: null,
        month: null,
        year: null
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.card
        );
        that.render_header();
    };
    that.render_header = function(){
        that.data._el.card__name.find('.card__name-text').text(that.data.title);
        that.data._el.card.find('#ce__name').append(
            that.data._el.button_toggle_left,
            that.data._el.card__name
        );
        that.data._el.card.find('#ce__actions').append(
            that.data._el.card__date,
            that.data._el.button_nav.append(
                that.data._el.button_prev,
                that.data._el.button_today,
                that.data._el.button_next
            ),
            that.data._el.radio_group
        );
    };
    that.render_card_date = function(date){
        var formattedDate = '';
        if (typeof Asyst != 'undefined') {
            if (Asyst.date) {
                if (typeof Asyst.date.convertToGenitive == 'function') {
                    formattedDate = Asyst.date.convertToGenitive(Asyst.date.format(date, 'dd MMMM yyyy').toLowerCase());
                }
            }
        } else {
            formattedDate = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
        }
        that.data._el.card__date.find('.card__name-text').text(formattedDate);
    };

    that.mc_render = function(){
        that.data._el.card.find('.menu__calendar').append(that.data._el.menu_calendar);
        that.data._el.menu_calendar.css({
            'overflow-x': 'auto',
            'border-bottom': 'solid 1px #eee;'
        });
        that.data._menu_calendar = that.data._el.menu_calendar.calendar({
            initDate: that.data._today,
            items: that.data.events,
            header: { render: false },
            onSelect: function(formattedDate, date){
                that.fc_set_date(date);
            }
        });
    };
    that.mc_select = function(date){
        that.data._menu_calendar.data('_datepicker').selectDate(date._d);
    };
    that.mc_update = function(items){
        that.data._menu_calendar.data('initDate', that.data._current.date);
        that.data._menu_calendar.calendar('update', items);
    };

    that.fc_render = function(){
        that.data._full_calendar = that.data._el.card.find('#ce__view').fullCalendar({
            locale: 'ru',
            header: false,
            defaultDate: null,
            editable: true,
            navLinks: true, // can click day/week names to navigate views
            eventLimit: true, // allow "more" link when too many events
            events: that.data.events,
            viewRender: function(view, element) {
                that.fc_set_title(view.title);
                that.data._current.view = view;
            },
            navLinkDayClick: function(date, jsEvent){
                that.mc_select(date._d);
                that.data._el.radio_group.radio_group('check', 'agendaDay');
                that.data._full_calendar.fullCalendar('changeView', 'agendaDay')
            },
            navLinkWeekClick: function(weekStart, jsEvent){
                that.data._el.radio_group.radio_group('check', 'agendaWeek');
                that.data._full_calendar.fullCalendar('changeView', 'agendaWeek')
            },
            eventRender: function(event, element) {
                if (event.background) {
                    element.css({
                        'background': event.background,
                        'border-color': event.background
                    });
                }
            },
            eventClick: function(event, jsEvent, view) {
                that.data.api.click(event, jsEvent, view);
                //console.log('Event: ' + calEvent.title);
                //console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                //console.log('View: ' + view.name);
            },
            eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
                that.data.api.update(event, delta, revertFunc, jsEvent, ui, view);
                //console.log(event.title + " end is now " + event.end.format());
                //revertFunc();
            },
            eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
                that.data.api.update(event, delta, revertFunc, jsEvent, ui, view);
                //console.log(event.title + " was dropped on " + event.start.format());
                //revertFunc();
            },
            dayClick: function(date, jsEvent, view) {
                //console.log('Clicked on: ' + date.format());
                //console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                //console.log('Current view: ' + view.name);
                that.data.api.new(date, function(event){
                    that.data.events.push(event);
                    that.data._full_calendar.fullCalendar('renderEvent', event, true);
                    that.mc_update(that.data.events);
                });
            }
        });
    };
    that.fc_set_date = function(date){
        that.data._current.date = date;
        that.data._current.day = date.getDate();
        that.data._current.month = date.getMonth();
        that.data._current.year = date.getFullYear();
        if (that.data._full_calendar) {
            that.data._full_calendar.fullCalendar('gotoDate', date);
        }
    };
    that.fc_set_size = function(){
        var fc = that.data._el.card.find('#ce__view');
        that.data._full_calendar.fullCalendar('option', 'height', fc.height());
    };
    that.fc_set_title = function(title){
        that.data._el.card__date.find('.card__name-text').text(title);
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.prepare = function(){
        that.data.events.map(function(d){
            d.name = d.title;
            d.date = moment(d.start, "YYYY-MM-DD");
            d.date = d.date._d;
        })
    };
    that.bind = function(){
        that.data._el.button_today.on('click', function(){
            that.mc_select(that.data._today);
        });
        that.data._el.button_prev.on('click', function(){
            that.data._full_calendar.fullCalendar('prev');
            that.mc_select(that.data._current.view.dateProfile.date._d);
        });
        that.data._el.button_next.on('click', function(){
            that.data._full_calendar.fullCalendar('next');
            that.mc_select(that.data._current.view.dateProfile.date._d);
        });
        that.data._el.select_view.on('change', function(){
            var view = $(this).val();
            that.data._full_calendar.fullCalendar('changeView', view)
        });
        that.data._el.radio_group.on('click', function(){
            var view = $(this).radio_group('value');
            that.data._full_calendar.fullCalendar('changeView', view)
        });
        $(window).resize(function(){
            that.fc_set_size();
        });
    };
    that.init_components = function(){
        that.data._el.card.card();
        that.data._el.button_toggle_left.button();
        that.data._el.button_today.button();
        that.data._el.button_prev.button();
        that.data._el.button_next.button();
        that.data._el.select_view.select({
            width: '200',
            popup_width: 'auto',
            mode: 'radio',
            autoclose: true
        });
        that.data._el.radio_group.radio_group();
        that.data._el.radio_group.radio_group('check', 'month');
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.prepare();
            that.render();
            that.mc_render();
            that.fc_render();
            that.fc_set_size();
            that.init_components();
            that.bind();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
