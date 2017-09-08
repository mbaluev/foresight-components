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
        loader: $('<span class="spinner"></span>')
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
        that.data._private.filters.doctype.forEach(function(val){
            var data = that.data._private.fdata.Where('$.ext=="' + val + '"');
            data1 = data1.Concat(data);
        });
        var data2 = Enumerable.Empty();
        that.data._private.filters.author.forEach(function(val){
            var data = that.data._private.fdata.Where('$.creationAuthorId=="' + val + '"');
            data2 = data2.Concat(data);
        });
        var data3 = Enumerable.Empty();
        that.data._private.filters.entity.forEach(function(val){
            var data = that.data._private.fdata.Where('$.entityName=="' + val + '"');
            data3 = data3.Concat(data);
        });
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
    }
    that.get_url_parameter = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

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
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text card__name-text_no-margin"></span>',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
                '<div class="card__header">',
                    '<div class="card__header-row card__header-row_wrap">',
                        '<div class="card__header-column" id="grid__view"></div>',
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
        loader: $('<span class="spinner"></span>')
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
        that.render_search();
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

    that.loader_add = function(){
        that.data._el.loader.css({
            'position': 'absolute',
            'top': '50%',
            'left': '50%',
            'margin-left': '-15px',
            'margin-top': '-15px',
            'z-index': 9999
        });
        $('#' + that.data.containerid).append(that.data._el.loader);
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.init_components = function(){
        that.data._el.select_view.select({
            width: 'auto',
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