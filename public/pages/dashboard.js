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
