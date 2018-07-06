if (typeof viewName == typeof undefined) { var viewName = ''; }
if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.GridView = function(options) {
    var that = this._gridview = {};
    that.data = {
        id: '' + Date.now(),
        containerid: 'container',
        user: Asyst.Workspace.currentUser,
        view: null,
        views: {},

        title: null,
        entityname: null,
        entitytitle: null,
        viewname: null,
        viewtitle: null,
        viewnameCookie: null,
        viewnameStartsWith: null,

        isSearch: true,
        isExport: true,
        editable: false,
        closeButton: false,
        setDocumentTitle: true,
        params: splitGETString(),

        gridViewClassName: 'GridView',
        gridViewClass: null,
        gridview: null,
        grid: null,
        data: null,
        disableCheckbox: false,
        onClick: null,
        header: {
            views: [],
            reload: {},
            settings: [],
            search: {},
            extFilter: null
        },
        filter: {
            filterArgs: [],
            rendered: false,
            hidden: false,
            buttonId: 'filter__hide'
        }
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid),
        button_group__view_sample: $('<span class="button-group"></span>'),
        select__view_sample: $('<select class="select" data-fc="select" id="select__viewSample"></select>'),
        button__view_sample_save: $([
            '<button class="button" type="button">',
            '<span class="icon icon_svg_save"></span>',
            '</button>'
        ].join('')),
        button__view_sample_delete: $([
            '<button class="button" type="button">',
            '<span class="icon icon_svg_trash"></span>',
            '</button>'
        ].join('')),
        card__header_filter: $([
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="filter__applied"></div>',
            '<div class="card__header-column" id="filter__buttons"></div>',
            '</div>',
            '</div>'
        ].join('')),
        button_filter_edit: $([
            '<button class="button" type="button" data-fc="button" data-tooltip="Изменить фильтр">',
            '<span class="icon icon_svg_edit"></span>',
            '</button>'
        ].join('')),
        button_filter_clear: $([
            '<button class="button" type="button" data-fc="button" data-tooltip="Очистить фильтр">',
            '<span class="icon icon_svg_close"></span>',
            '</button>'
        ].join('')),
        alertbox_group: $('<span class="alertbox-group alertbox-group_highlighted"></span>'),
        alertbox: $('<label class="alertbox" data-fc="alertbox"></label>'),
        alertbox__text: $('<span class="alertbox__text"></span>'),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };
    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.load_metaViewAll = function(callbackSuccess, callbackError){
        if (that.data.view) {
            Asyst.APIv2.DataSet.load({
                name: 'MetaViewAll',
                data: {
                    View: that.data.view,
                    AccountId: that.data.user.Id
                },
                success: function(data){
                    var allowed = false;
                    data.map(function(d){
                        if (d.length > 0) {
                            allowed = true;
                        }
                    });
                    if (allowed) {
                        var metaView, metaViews, viewSamples = [];
                        if (data[0].length > 0 || data[1].length > 0) {
                            metaViews = [].concat(data[0], data[1]);
                        } else {
                            metaViews = data[2];
                        }
                        if (data[3] || data[4]) {
                            viewSamples = [].concat(data[3], data[4]);
                        }
                        metaViews.map(function(view){
                            view.selected = view.viewName == that.data.view;
                            if (view.viewName == that.data.view) {
                                metaView = view;
                            }
                            view.viewSamples = viewSamples.filter(function(f){ return f.viewName == view.viewName; });
                            view.viewTitle = (view.viewTitle ? view.viewTitle : view.entityTitle);
                            view.viewName = (view.viewName ? view.viewName : view.entityName);
                            if (!Asyst.Workspace.views[view.viewName]) {
                                if (typeof window.views == 'undefined') { window.views = {}; }
                                Asyst.Workspace.addView({
                                    entity: {
                                        idName: view.idName,
                                        isViewProcessLink: view.IsViewProcessLink,
                                        name: view.entityName,
                                        title: view.entityTitle
                                    },
                                    title: view.viewTitle,
                                    isEditable: (view.IsEditable ? view.IsEditable : false),
                                    isViewSampled: (view.IsViewSampled ? view.IsViewSampled : false),
                                    isExtFilterVisible: (view.IsExtFilterVisible ? view.IsExtFilterVisible : false),
                                    isInitiallyCollapsed: (view.IsInitiallyCollapsed ? view.IsInitiallyCollapsed : false),
                                    isWideString: (view.IsWideString ? view.IsWideString : false),
                                    isFullWidthScreen: (view.isFullWidthScreen ? view.isFullWidthScreen : true),
                                    isCreate: (view.IsCreate && view.entityName ? view.IsCreate : false),
                                    isDelete: (view.IsDelete && view.entityName ? view.IsDelete : false),
                                    preprocessFunctionText: (view.PreprocessFunction ? view.PreprocessFunction : ''),
                                    viewSamples: view.viewSamples
                                }, view.viewName);
                            }
                            that.data.views[view.viewName] = Asyst.Workspace.views[view.viewName];
                        });
                        if (!metaView) { metaView = metaViews[0]; }
                        that.data.viewname = metaView.viewName;
                        that.data.viewtitle = metaView.viewTitle;
                        that.data.entityname = metaView.entityName;
                        that.data.entitytitle = metaView.entityTitle;
                        that.data.viewSamples = [];
                        if (!that.data.title) { that.data.title = metaView.entityTitle; }
                        if (that.data.setDocumentTitle) { document.title = that.data.title; }
                        if (typeof callbackSuccess == 'function') { callbackSuccess(); }
                    } else {
                        if (typeof callbackError == 'function') { callbackError(); }
                    }
                },
                error: function(){
                    that.loader_remove();
                }
            });
        } else {
            that.loader_remove();
        }
    };
    that.load_metaViewNames = function(callback){
        if (that.data.entityname) {
            Asyst.APIv2.DataSet.load({
                name: 'MetaViewNames',
                data: {
                    EntityName: that.data.entityname,
                    AccountId: that.data.user.Id
                },
                success: function(data){
                    if (data[0]) {
                        data[0].map(function(v){
                            if (that.data.viewnameStartsWith) {
                                if (v.viewName.indexOf(that.data.viewnameStartsWith) == 0) {
                                    that.data.metaviewnames.push(v.viewName);
                                }
                            } else {
                                that.data.metaviewnames.push(v.viewName);
                            }
                        });
                        if (typeof callback == 'function') {
                            callback();
                        }
                    } else {
                        console.log('no data');
                    }
                },
                error: function(data){
                    that.loader_remove();
                }
            });
        } else {
            if (that.data.viewname instanceof Array) {
                that.data.metaviewnames = that.data.viewname;
            } else {
                that.data.metaviewnames.push(that.data.viewname);
            }
            if (typeof callback == 'function') {
                callback();
            }
        }
    };
    that.load_metaView = function(callbackEntity, callbackSuccess, callbackError){
        Asyst.APIv2.DataSet.load({
            name: 'MetaView',
            data: {
                EntityName: that.data.entityname,
                ViewName: that.data.metaviewnames.join(','),
                AccountId: that.data.user.Id
            },
            success: function(data){
                if (data[0].length > 0) {
                    // get views parameters
                    var metaview = data[0],
                        viewSamples = data[1];
                    if (!that.data.entityname && !(that.data.viewname instanceof Array) && that.data.viewname) {
                        metaview = metaview.filter(function(view){ return view.viewName == that.data.viewname; });
                        if (metaview.length > 0) {
                            that.data.entityname = metaview[0].entityName;
                            that.data.entitytitle = metaview[0].entityTitle;
                        }
                    }
                    metaview.map(function(view){
                        //if no metaview rows
                        view.viewTitle = (view.viewTitle ? view.viewTitle : view.entityTitle);
                        view.viewName = (view.viewName ? view.viewName : view.entityName);

                        view.IsEditable = false;
                        view.viewSamples = viewSamples.filter(function(d){
                            return d.viewName == view.viewName;
                        });

                        if (that.data.viewname && !(that.data.viewname instanceof Array)) {
                            if (view.viewName == that.data.viewname) {
                                view.selected = true;
                            }
                        } else {
                            if (view.viewName == that.data.viewnameCookie) {
                                view.selected = true;
                            }
                        }
                        if (!Asyst.Workspace.views[view.viewName]) {
                            if (typeof window.views == 'undefined') { window.views = {}; }
                            Asyst.Workspace.addView({
                                entity: {
                                    idName: view.idName,
                                    isViewProcessLink: view.IsViewProcessLink,
                                    name: view.entityName,
                                    title: view.entityTitle
                                },
                                title: view.viewTitle,
                                isEditable: (view.IsEditable ? view.IsEditable : false),
                                isViewSampled: (view.IsViewSampled ? view.IsViewSampled : false),
                                isExtFilterVisible: (view.IsExtFilterVisible ? view.IsExtFilterVisible : false),
                                isInitiallyCollapsed: (view.IsInitiallyCollapsed ? view.IsInitiallyCollapsed : false),
                                isWideString: (view.IsWideString ? view.IsWideString : false),
                                isFullWidthScreen: (view.isFullWidthScreen ? view.isFullWidthScreen : false),
                                isCreate: (view.IsCreate && view.entityName ? view.IsCreate : false),
                                isDelete: (view.IsDelete && view.entityName ? view.IsDelete : false),
                                preprocessFunctionText: (view.PreprocessFunction ? view.PreprocessFunction : ''),
                                viewSamples: view.viewSamples
                            }, view.viewName);
                        }
                        that.data.views[view.viewName] = Asyst.Workspace.views[view.viewName];
                    });
                    // get selected view parameters
                    var metaviewSelected = metaview.filter(function(view){ return view.selected; });
                    if (metaviewSelected.length > 0) {
                        metaviewSelected = metaviewSelected[0];
                    } else {
                        metaviewSelected = metaview[0];
                    }
                    that.data.viewname = metaviewSelected.viewName;
                    that.data.viewtitle = metaviewSelected.viewTitle;
                    that.data.viewSamples = metaviewSelected.viewSamples;
                    if (!that.data.title) {
                        that.data.title = metaviewSelected.entityTitle;
                    }
                    // set document title
                    if (that.data.setDocumentTitle) {
                        document.title = that.data.title;
                    }
                    // do callback
                    if (typeof callbackSuccess == 'function') {
                        callbackSuccess();
                    }
                } else {
                    if (typeof callbackEntity == 'function') {
                        callbackEntity(callbackSuccess, callbackError);
                    } else {
                        if (typeof callbackError == 'function') {
                            callbackError();
                        }
                    }
                }
            },
            error: function(data){
                that.loader_remove();
            }
        });
    };
    that.load_metaViewEntity = function(callbackSuccess, callbackError){
        Asyst.APIv2.DataSet.load({
            name: 'MetaViewEntity',
            data: {
                EntityName: that.data.entityname,
                AccountId: that.data.user.Id
            },
            success: function(data){
                if (data[0].length > 0) {
                    // get views parameters
                    var view = data[0];
                    if (view.length > 0) {
                        view = view[0];
                        view.viewTitle = view.entityTitle;
                        view.viewName = view.entityName;
                        view.IsEditable = false;
                        view.IsViewSampled = false;
                        view.selected = true;
                        if (!Asyst.Workspace.views[view.viewName]) {
                            if (typeof window.views == 'undefined') { window.views = {}; }
                            Asyst.Workspace.addView({
                                entity: {
                                    idName: view.idName,
                                    isViewProcessLink: view.IsViewProcessLink,
                                    name: view.entityName,
                                    title: view.entityTitle
                                },
                                title: view.viewTitle,
                                isEditable: false,
                                isViewSampled: false,
                                isExtFilterVisible: false,
                                isInitiallyCollapsed: false,
                                isWideString: false,
                                isFullWidthScreen: true,
                                isCreate: (view.IsCreate && view.entityName ? view.IsCreate : false),
                                isDelete: (view.IsDelete && view.entityName ? view.IsDelete : false),
                                preprocessFunctionText: '',
                                viewSamples: {}
                            }, view.viewName);
                        }
                        that.data.views[view.viewName] = Asyst.Workspace.views[view.viewName];
                    }
                    that.data.entityname = view.entityName;
                    that.data.entitytitle = view.entityTitle;
                    that.data.viewname = view.viewName;
                    that.data.viewtitle = view.viewTitle;
                    if (!that.data.title) {
                        that.data.title = view.entityTitle;
                    }
                    // set document title
                    if (that.data.setDocumentTitle) {
                        document.title = that.data.title;
                    }
                    // do callback
                    if (typeof callbackSuccess == 'function') {
                        callbackSuccess();
                    }
                } else {
                    if (typeof callbackError == 'function') {
                        callbackError();
                    }
                }
            },
            error: function(data){
                that.loader_remove();
            }
        });
    };

    that.load_view = function(){
        that.loader_add();
        that.data.gridview.data.loading = true;
        if (typeof that.data.gridview.menu__item_lock == 'function') { that.data.gridview.menu__item_lock(); }
        that.disable_viewSample();
        that.disable_line_extFilter();
        that.data.params.view = key;
        Asyst.APIv2.View.load({
            viewName: that.data.viewname,
            data: that.data.params,
            success: function(data){
                that.data.data = data;
                that.data.viewSamples = Asyst.Workspace.views[that.data.viewname].viewSamples;
                that.init_settings();
                that.render_view();
                that.render_viewSample();
                that.render_line_extFilter();
                //that.render_settings();
                if (typeof that.data.gridview.menu__item_unlock == 'function') { that.data.gridview.menu__item_unlock(); }
                that.enable_viewSample();
                that.enable_line_extFilter();
                that.data.gridview.data.loading = false;
                that.loader_remove();
            },
            error: function(data){
                console.error('error. Asyst.APIv2.View.load');
                if (typeof that.data.gridview.menu__item_unlock == 'function') { that.data.gridview.menu__item_unlock(); }
                that.enable_viewSample();
                that.enable_line_extFilter();
                that.data.gridview.data.loading = false;
                that.loader_remove();
            }
        });
    };
    that.render_view = function(){
        var data = that.data.data;
        var container = that.data.gridview.data._el.container;

        var filterArgs = filterDataByGET(data, data.columns);
        if ((filterArgs === undefined || filterArgs === null) && data.viewSample && data.viewSample.hasOwnProperty('filterArgs')) {
            filterArgs = data.viewSample.filterArgs;
            restoreDatesInFilterArgs(filterArgs, data.columns);
        }

        for (var colIdx in data.columns) {
            var column = data.columns[colIdx];
            if (column.formatter)
                column.formatter = eval(column.formatter);
            else if (column.url)
                column.formatter = Grid.LinkFormatter;
            else
                column.formatter = Grid.DefaultFormatter;
        }

        var viewEl = container;
        viewEl[0].innerHtml = "";

        var options = {
            forceFitColumns: Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isFullWidthScreen,
            disableCheckbox: that.data.disableCheckbox, // убираем чекбоксы
            enableCellNavigation: true,
            editable: false,
            autoHeight: false,
            doClick: true,
            wideString: Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isWideString,
            initiallyCollapsed: Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isInitiallyCollapsed,
            rowSelectionModel: new Asyst.RowSelectionModel({ selectActiveRow: false }) // убираем выделение строк по клику
        };

        //todo replace
        if (Asyst.Workspace.views &&
            Asyst.Workspace.views[that.data.viewname] &&
            Asyst.Workspace.views[that.data.viewname].hasOwnProperty('preprocessFunction')) {
            Asyst.Workspace.views[that.data.viewname].preprocessFunction(viewEl, data.data, data.columns, options, data.groups);
        }

        if (data.EditFormName) {
            viewEl.css("overflow", "hidden");
            var EditableGrid = Asyst.Models.EditableView.EditableGrid;
            view = EditableGrid.create(viewEl, data.data, data.columns, data.EditFormName, data.KeyName, data.EntityName);
        } else {
            view = Grid.Create(viewEl, data.data, data.columns, options, data.groups, that.data.params, data.filters, data.viewSample, that.data.viewname);
            var grid = view.Grid;
            var dataView = view.DataView;
            if (data.EntityId)
                grid.EntityId = data.EntityId;
            if (data.EntityName)
                grid.EntityName = data.EntityName;
            if (data.KeyName)
                grid.KeyName = data.KeyName;
            if (options.doClick) {
                grid.onClick.subscribe(function(e, args){
                    var cell = grid.getCellFromEvent(e);
                    var item = grid.getDataItem(cell.row);
                    if (item.__nonDataRow) return;
                    var column = grid.getColumns()[cell.cell];

                    viewName = that.data.viewname;
                    window[viewName] = view;

                    if (typeof that.data.onClick == 'function') {
                        that.data.onClick(dataView, item, column, e);
                    } else {
                        ViewClick(dataView, item, column, e);
                    }
                });
            }
            grid.onColumnsResized.subscribe(function(e, args){
                if (grid) grid.resizeCanvas();
            });
        }
        view.viewName = that.data.viewname;
        that.data.grid = view;

        if (!Model) { Model = {}; }
        Model.CurrentViewName = that.data.viewname;
        viewName = that.data.viewname;
        window[that.data.viewname] = that.data.grid;

        $(window).resize(function(){
            if (grid) grid.resizeCanvas();
        });

        /*
        if (!window['views'] || !views.hasOwnProperty(viewName) || !Asyst.Workspace.views[viewName].isEditable) {
            $('#menuItemAdd').hide();
        } else {
            $('#menuItemAdd').show();
        }
        */

        // перенесено в that.render_line_extFilter
        /*
        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isExtFilterVisible) {
            $('.ext-filter-menu').show();
        } else {
            $('.ext-filter-menu').hide();
        }
        */

        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isInitiallyCollapsed) {
            window[viewName].CollapseAllGroups();
        }
        if (that.data.params.hasOwnProperty("ExpandGroup")) {
            if (that.data.params.ExpandGroup == "true") {
                view.ExpandAllGroups();
            } else {
                view.CollapseAllGroups();
            }
        }
        var needInvalidate = false;
        if (filterArgs && filterArgs.hasOwnProperty('oper')) {
            view.DataView.setFilter(Grid.ExtFilter);
            filterArgs = $.extend(filterArgs, {gridView: view});
            that.data.filter.filterArgs = filterArgs;
            view.DataView.setFilterArgs(filterArgs);
            view.DataView.refresh();
            needInvalidate = true;

            // перенесено в that.render_line_extFilter
            /*
            if (!that.data.params.hideFilterPanel)
                MakeFilterLine(filterArgs);
            ToggleClearFilterButton(true);
            */
        } else {
            that.data.filter.filterArgs = null;
            view.QuickFilterClear();
            !(!!data.EditFormName) && Grid.ClearExtFilter(view);
        }
        if (filterArgs && filterArgs.hasOwnProperty('searchString') && filterArgs.searchString !== "") {
            $('#BrowseSearch').val(filterArgs.searchString);
            view.UpdateQuickFilter(filterArgs.searchString);
            view.DataView.refresh();
            needInvalidate = true;
        }
        if (data.viewSample && data.viewSample.hasOwnProperty('groups')) {
            view.SetGroupsCollapsed(data.viewSample.groups);
            needInvalidate = true;
        }
        if (data.viewSample && data.viewSample.hasOwnProperty('viewport') && data.viewSample.top != -1) {
            view.Grid.scrollToRow(data.viewSample.viewport.top);
            needInvalidate = true;
        }
        if (needInvalidate) {
            view.Grid.invalidate();
        }
    };
    that.render_settings = function(){
        that.data.gridview.data.header.settings = that.data.header.settings;
        that.data.gridview.render_settings_popup();
    };

    /* viewSample methods */
    that.render_viewSample = function(){
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] &&
            Asyst.Workspace.views[that.data.viewname].isViewSampled) {
            if (typeof that.data._el.select__view_sample.data('_widget') == 'undefined') {
                that.data.gridview.data._el.content.find('#grid__view').append(
                    that.data._el.button_group__view_sample.append(
                        that.data._el.select__view_sample,
                        that.data._el.button__view_sample_save.button({
                            disabled: true
                        }).on('click', that.save_named_viewSample),
                        that.data._el.button__view_sample_delete.button({
                            disabled: true
                        }).on('click', that.delete_named_viewSample)
                    )
                );
                that.data._el.select__view_sample.select({
                    mode: 'radio',
                    placeholder: Globa.ViewSample.locale(),
                    width: 200,
                    autoclose: true,
                    disabled: true
                });
                that.data._el.select__view_sample.on('change', function(){
                    that.data.params.viewSampleId = $(this).val();
                    that.load_view();
                });
            }
            that.update_viewSampleSelect();
        }
    };
    that.update_viewSampleSelect = function(){
        var options = [{
            text: Globa.ViewSampleDefault.locale(),
            value: null,
            selected: typeof that.data.params.viewSampleId == 'object' && that.data.params.viewSampleId == null
        }];
        that.data.viewSamples.map(function(sample){
            if (sample.Name) {
                options.push({
                    text: sample.Name,
                    value: sample.ViewSampleId,
                    selected: sample.ViewSampleId == that.data.params.viewSampleId
                });
            }
        });
        that.data._el.select__view_sample.select('update', options);
    };
    that.disable_viewSample = function(){
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] &&
            Asyst.Workspace.views[that.data.viewname].isViewSampled) {
            if (typeof that.data._el.select__view_sample.data('_widget') != 'undefined') {
                that.data._el.select__view_sample.select('disable');
                that.data._el.button__view_sample_save.button('disable');
                that.data._el.button__view_sample_delete.button('disable');
            }
            // set undefined for correct api working
            if (typeof that.data.params.viewSampleId == 'undefined') {
                that.data.params.viewSampleId = undefined;
            } else if (that.data.params.viewSampleId == 'null') {
                that.data.params.viewSampleId = null;
            }
        }
    };
    that.enable_viewSample = function(){
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] &&
            Asyst.Workspace.views[that.data.viewname].isViewSampled) {
            if (typeof that.data._el.select__view_sample.data('_widget') != 'undefined') {
                that.data._el.select__view_sample.select('enable');
                that.data._el.button__view_sample_save.button('enable');
                that.data._el.button__view_sample_delete.button('enable');
            }
        }
    };
    that.save_named_viewSample = function(){
        var modal_options = {
            size: 'md',
            buttons: [
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
                caption: 'Сохранение',
                name: 'Введите название выборки'
            },
            content: {
                tabs: [{
                    id: 'general',
                    name: 'Основное',
                    active: true,
                    content: $([
                        '<div>',
                        '<div class="control">',
                        '<div class="control__caption">',
                        '<div class="control__text">Название выборки</div>',
                        '<div class="control__icons">',
                        '<span class="icon icon_svg_star_red" data-tooltip="Обязательное поле"></span>',
                        '</div>',
                        '</div>',
                        '<div class="control__container">',
                            '<span class="input input__has-clear" data-fc="input" data-required="true" style="width: 100%;">',
                            '<span class="input__box">',
                            '<input type="text" name="sampleName" class="input__control">',
                            '<button class="button" type="button" data-fc="button" style="width: auto;" tabindex="-1">',
                            '<span class="icon icon_svg_close"></span>',
                            '</button>',
                            '</span>',
                            '</span>',
                        '</div>',
                        '</div>',
                        '</div>'
                    ].join(''))
                }]
            },
            data: null,
            draggable: true,
            render_tabs_row: false
        };
        that.data.form = $('<div data-fc="form"></div>');
        that.data.modal = $('<span class="modal__"></span>')
            .modal__(modal_options)
            .on('save.fc.modal', function(){
                that.loader_add();
                var form = $(this).closest('[data-fc="form"]'), valid = true;
                if (form.length > 0) { valid = form.form('validate') }
                if (valid) {
                    var name = form.find('[data-fc="input"]').input('value').replace('\n', ' ').substring(0, 250);
                    var sample = that.data.grid.getViewSample();
                    sample.name = name;
                    var asystViewSample = that.data.viewSamples.filter(function(v){ return v.Name == name; });
                    if (asystViewSample.length > 0) {
                        asystViewSample = asystViewSample[0];
                        sample.guid = asystViewSample.ViewSampleId;
                    } else {
                        asystViewSample = null;
                    }
                    Asyst.APIv2.ViewSample.save({
                        viewName: that.data.viewname,
                        data: { name: sample.name, guid: sample.guid, sample: JSON.stringify(sample) },
                        async: false
                    });
                    if (!asystViewSample) {
                        that.data.viewSamples.push({
                            ViewSampleId: sample.guid,
                            viewName: that.data.viewname,
                            Name: sample.name,
                            Sample: JSON.stringify(sample)
                        });
                    }
                    Asyst.Workspace.views[that.data.viewname].viewSamples = that.data.viewSamples;
                    that.data.params.viewSampleId = sample.guid;
                    that.update_viewSampleSelect();
                    that.data.modal.modal__('hide');
                    that.data.form.remove();
                }
                that.loader_remove();
            })
            .on('hidden.fc.modal', function(){
                that.data.form.remove();
            });
        that.data.form.append(that.data.modal).appendTo('body').form();
    };
    that.delete_named_viewSample = function(){
        var modal_options = {
            size: 'md',
            buttons: [
                {
                    name: 'save',
                    action: 'save',
                    icon: 'icon_svg_trash'
                },
                {
                    name: 'destroy',
                    action: 'destroy',
                    icon: 'icon_svg_close'
                }
            ],
            header: {
                caption: 'Удаление',
                name: 'Выберите выборку'
            },
            content: {
                tabs: [{
                    id: 'general',
                    name: 'Основное',
                    active: true,
                    content: $([
                        '<div>',
                        '<div class="control">',
                        '<div class="control__caption">',
                        '<div class="control__text">Выборка</div>',
                        '<div class="control__icons">',
                        '<span class="icon icon_svg_star_red" data-tooltip="Обязательное поле"></span>',
                        '</div>',
                        '</div>',
                        '<div class="control__container">',

                        '<select class="select" data-fc="select" data-mode="radio" data-autoclose="true" data-required="true"',
                        ' data-placeholder="' + Globa.ViewSample.locale() + '">',
                        that.data.viewSamples.map(function(sample){
                            if (sample.Name) {
                                return [
                                    '<option value="' + sample.ViewSampleId + '" ',
                                    (sample.ViewSampleId == that.data.params.viewSampleId ? 'selected="selected"' : '') + '>',
                                    sample.Name,
                                    '</option>'
                                ].join('');
                            }
                        }).join(''),
                        '</select>',

                        '</div>',
                        '</div>',
                        '</div>'
                    ].join(''))
                }]
            },
            data: null,
            draggable: true,
            render_tabs_row: false
        };
        that.data.form = $('<div data-fc="form"></div>');
        that.data.modal = $('<span class="modal__"></span>')
            .modal__(modal_options)
            .on('save.fc.modal', function(){
                that.loader_add();
                var form = $(this).closest('[data-fc="form"]'), valid = true;
                if (form.length > 0) { valid = form.form('validate') }
                if (valid) {
                    var viewSampleId = form.find('[data-fc="select"]').select('value');
                    if (viewSampleId != '') {
                        Asyst.APIv2.ViewSample.delete({
                            viewName: that.data.viewname,
                            data: { viewSampleId: viewSampleId },
                            async: false,
                            success: function () {
                                var viewSamples = [];
                                that.data.viewSamples.map(function(v){
                                    if (v.ViewSampleId != viewSampleId) {
                                        viewSamples.push(v);
                                    }
                                });
                                that.data.viewSamples = viewSamples;
                                Asyst.Workspace.views[that.data.viewname].viewSamples = viewSamples;
                                that.update_viewSampleSelect();
                                if (that.data.params.viewSampleId == viewSampleId) {
                                    that.data.params.viewSampleId = null;
                                    that.load_view();
                                }
                            }
                        });
                    }
                    that.data.modal.modal__('hide');
                    that.data.form.remove();
                }
                that.loader_remove();
            })
            .on('hidden.fc.modal', function(){
                that.data.form.remove();
            });
        that.data.form.append(that.data.modal).appendTo('body').form();
    };
    /* end of viewSample methods */

    /* extFilter methods */
    that.render_line_extFilter = function(){
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] &&
            Asyst.Workspace.views[that.data.viewname].isExtFilterVisible) {
            if (!that.data.filter.rendered) {
                that.data._el.card__header_filter.find('#filter__buttons').append(
                    that.data._el.button_filter_edit.button().on('click', that.edit_extFilter),
                    that.data._el.button_filter_clear.button().on('click', that.clear_extFilter)
                );
                that.data.gridview.data._el.content.children('.card__header').after(
                    that.data._el.card__header_filter
                );
                that.data.filter.rendered = true;
            }
            if (that.data.filter.filterArgs) {
                if (that.data.filter.filterArgs.filterItems) {
                    that.render_set_extFilter();
                    if (that.data.filter.hidden || that.data.params.hideFilterPanel) {
                        that.hide_extFilter(false);
                    } else {
                        that.show_extFilter(false);
                    }
                } else {
                    that.render_clear_extFilter();
                    that.hide_extFilter(false);
                }
            } else {
                that.render_clear_extFilter();
                that.hide_extFilter(false);
            }
        } else {
            if (that.data.filter.rendered) {
                that.render_remove_extFilter();
            }
            that.data.filter.rendered = false;
        }
    };
    that.render_set_extFilter = function(){
        that.data.gridview.data._el.content.children('.card__header').find('#' + that.data.filter.buttonId).addClass('button_highlighted');
        that.data._el.card__header_filter.find('#filter__applied').html('');
        that.data.filter.filterArgs.filterItems.map(function(d){
            that.data._el.card__header_filter.find('#filter__applied').append(
                that.data._el.alertbox_group.clone().append(
                    that.data._el.alertbox.clone().append(
                        that.data._el.alertbox__text.clone().text(
                            function(){
                                var text = '';
                                that.data.grid.Filters.map(function(f){
                                    if (f.fieldName == d.column) {
                                        if (f.title && f.title != '' && f.title != ' ') {
                                            text = f.title;
                                        }
                                    }
                                });
                                if (text == '') {
                                    text = d.column;
                                }
                                return text;
                            }
                        )
                    ).alertbox(),
                    that.data._el.alertbox.clone().append(
                        that.data._el.alertbox__text.clone().text(
                            Grid.ExtFilterOper[d.oper].title
                        )
                    ).alertbox(),
                    that.data._el.alertbox.clone().append(
                        that.data._el.alertbox__text.clone().text(
                            function(){
                                var text = '';
                                that.data.grid.Filters.map(function(f){
                                    if (f.fieldName == d.column) {
                                        if (f.kind == 'date') {
                                            text = Asyst.date.format(d.value);
                                        }
                                    }
                                });
                                if (text == '') {
                                    text = d.value;
                                }
                                return text;
                            }
                        )
                    ).alertbox()
                )
            );
        });
    };
    that.render_clear_extFilter = function(){
        that.data.gridview.data._el.content.children('.card__header').find('#' + that.data.filter.buttonId).removeClass('button_highlighted');
        that.data._el.card__header_filter.find('#filter__applied').html('');
    };
    that.render_remove_extFilter = function(){
        that.render_clear_extFilter();
        that.data._el.card__header_filter.find('#filter__buttons').html('');
        that.data._el.card__header_filter.remove();
        that.data._el.button_filter_edit.button('destroy');
        that.data._el.button_filter_clear.button('destroy');
    };
    that.render_modal_extFilter = function(callback){
        var modal_options = {
            size: 'md',
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
                },
                {
                    name: 'fullscreen',
                    action: 'fullscreen',
                    icon: 'icon_svg_fullscreen'
                }
            ],
            header: {
                caption: that.data.title,
                name: 'Расширенный фильтр'
            },
            content: {
                tabs: [{
                    id: 'general',
                    name: 'Основное',
                    active: true,
                    content: function(){
                        var _el = {
                            control: $('<div class="control"></div>'),
                            control__caption: $('<div class="control__caption"></div>'),
                            control__text: $('<div class="control__text"></div>'),
                            control__container: $('<div class="control__container"></div>'),
                            radio_group: $([
                                '<span class="radio-group radio-group_type_line radioFilterType" data-fc="radio-group">',
                                '<label class="radio radio_type_line" data-fc="radio" data-checked="true">',
                                '<input class="radio__input" type="radio" name="filterType" value="and" hidden />',
                                '<label class="radio__label">' + Globa.AndTitle.locale() + '</label>',
                                '</label>',
                                '<label class="radio radio_type_line" data-fc="radio">',
                                '<input class="radio__input" type="radio" name="filterType" value="or" hidden />',
                                '<label class="radio__label">' + Globa.OrTitle.locale() + '</label>',
                                '</label>',
                                '</span>'
                            ].join('')),
                            button_trash: $([
                                '<button class="button" data-fc="button" type="button">',
                                '<span class="icon icon_svg_trash"></span>',
                                '</button>'
                            ].join('')),
                            button_add: $([
                                '<button class="button" data-fc="button" type="button">',
                                '<span class="icon icon_svg_plus"></span>',
                                '</button>'
                            ].join('')),
                            select_field: $([
                                '<select class="select selectName" data-fc="select" data-mode="radio" data-autoclose="true" data-placeholder="' + Globa.FieldName.locale() + '">',
                                '</select>'
                            ].join('')),
                            select_oper: $([
                                '<select class="select selectComparison" data-fc="select" data-mode="radio" data-autoclose="true" data-placeholder="' + Globa.Comparison.locale() + '">',
                                '</select>'
                            ].join('')),
                            input: $([
                                '<span class="input input__has-clear inputValue" data-fc="input" data-placeholder="' + Globa.Value.locale() + '" style="margin-right:0;">',
                                '<span class="input__box">',
                                '<input type="text" class="input__control">',
                                '<button class="button" type="button" data-fc="button" tabindex="-1">',
                                '<span class="icon icon_svg_close"></span>',
                                '</button>',
                                '</span>',
                                '</span>'
                            ].join(''))
                        };
                        that.data.grid.Filters.map(function(d){
                            _el.select_field.append(
                                $('<option value="' + d.fieldName + '">' + (d.title && d.title != '' && d.title != ' ' ? d.title : d.fieldName) + '</option>')
                            );
                        });
                        for (var c in Grid.ExtFilterOper) {
                            _el.select_oper.append(
                                $('<option value="' + c + '">' + Grid.ExtFilterOper[c].title + '</option>')
                            );
                        }
                        var _control = {
                            caption: _el.control.clone().addClass('control__container_vertical').append(
                                _el.control__caption.clone().addClass('control__caption_size_xl').append(
                                    _el.control__text.text('Выводить строки для которых выполняются')
                                ),
                                _el.control__container.clone().append(
                                    _el.radio_group.clone().radio_group()
                                )
                            ),
                            rows: $('<div></div>'),
                            add: _el.control.clone().append(
                                _el.control__container.clone()
                                    .addClass('control__container_horizontal control__container_horizontal_margin').append(
                                    _el.button_add
                                )
                            )
                        };
                        _el.button_add.on('click', add_row);
                        function add_row(e, filterItem){
                            // render controls
                            var _button_trash = _el.button_trash.clone(),
                                _select_field = _el.select_field.clone(),
                                _select_oper = _el.select_oper.clone(),
                                _input = _el.input.clone();

                            if (filterItem) {
                                that.data.grid.Filters.map(function(d){
                                    if (d.fieldName == filterItem.column && d.kind == 'date') {
                                        _input.attr('data-toggle', 'datepicker');
                                    }
                                });
                            }
                            var _row = _el.control.clone().addClass('control__row').append(
                                _el.control__container.clone()
                                    .addClass('control__container_horizontal control__container_horizontal_margin').append(
                                    _button_trash.on('click', function(){ _row.remove(); }),
                                    _select_field.on('change', function(){
                                        var value = $(this).select('value');
                                        that.data.grid.Filters.map(function(d){
                                            if (d.fieldName == value) {
                                                if (d.kind == 'date') {
                                                    _input.input('destroy');
                                                    _input = _el.input.clone();
                                                    _input.attr('data-toggle', 'datepicker');
                                                    _row.find('.control__container').append(_input);
                                                    _input.input();
                                                } else {
                                                    _input.input('destroy');
                                                    _input = _el.input.clone();
                                                    _row.find('.control__container').append(_input);
                                                    _input.input();
                                                }
                                            }
                                        });
                                    }),
                                    _select_oper,
                                    _input
                                )
                            );
                            _control.rows.append(_row);

                            // init controls
                            _row.find('[data-fc="button"]').button();
                            _row.find('[data-fc="select"]').select({ height: 300 });
                            _row.find('[data-fc="input"]').input();

                            // set values for controls
                            if (filterItem) {
                                // set _select_field
                                var fieldOk = false;
                                _select_field.data('_options').map(function(o){
                                    if (o.val() == filterItem.column) {
                                        fieldOk = true;
                                    }
                                });
                                if (!fieldOk) {
                                    var _options = [];
                                    _options.push({
                                        value: filterItem.column,
                                        text: filterItem.column
                                    });
                                    _select_field.data('_options').map(function(o){
                                        _options.push({
                                            value: o.val(),
                                            text: o.text()
                                        });
                                    });
                                    _select_field.select('update', _options);
                                }
                                _select_field.select('check', filterItem.column);
                                // set _select_oper
                                _select_oper.select('check', filterItem.oper);
                                // set _input
                                var is_date = false;
                                that.data.grid.Filters.map(function(f){
                                    if (f.fieldName == filterItem.column) {
                                        if (f.kind == 'date') {
                                            is_date = true;
                                            _input.input('value', Asyst.date.format(filterItem.value));
                                        }
                                    }
                                });
                                if (!is_date) {
                                    _input.input('value', filterItem.value);
                                }
                            }
                        }
                        // восстанавливаем значения фильтров
                        if (that.data.filter.filterArgs) {
                            if (that.data.filter.filterArgs.oper) {
                                _control.caption.find('.radioFilterType').radio_group('check', that.data.filter.filterArgs.oper);
                            }
                            if (that.data.filter.filterArgs.filterItems) {
                                that.data.filter.filterArgs.filterItems.map(function(d){
                                    add_row(null, d);
                                });
                            }
                        }
                        return [_control.caption, _control.rows, _control.add];
                    }
                }]
            },
            data: null,
            draggable: true,
            render_tabs_row: false,
        };
        that.data.form = $('<div data-fc="form"></div>');
        that.data.modal = $('<span class="modal__"></span>')
            .modal__(modal_options)
            .on('save.fc.modal', function(){
                var ragio_group = $(this).find('.radioFilterType');
                that.data.filter.filterArgs = {
                    filterItems: [],
                    gridView: that.data.grid,
                    oper: ragio_group.radio_group('value')
                };
                that.data.modal.find('.control__row').each(function(){
                    var select_field = $(this).find('.selectName'),
                        select_oper = $(this).find('.selectComparison'),
                        input_value = $(this).find('.inputValue');
                    var filterItem = {
                        column: select_field.select('value'),
                        oper: select_oper.select('value'),
                        value: input_value.input('value')
                    };
                    // date parse
                    that.data.grid.Filters.map(function(f){
                        if (f.fieldName == filterItem.column) {
                            if (f.kind == 'date') {
                                filterItem.value = Asyst.date.parse(filterItem.value);
                            }
                        }
                    });
                    that.data.filter.filterArgs.filterItems.push(filterItem);
                });
                if (typeof callback == 'function') { callback(); }
                that.data.modal.modal__('hide');
                that.data.form.remove();
            })
            .on('hidden.fc.modal', function(){
                that.data.form.remove();
            });
        that.data.form.append(that.data.modal).appendTo('body').form();
    };
    that.disable_line_extFilter = function(){
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] &&
            Asyst.Workspace.views[that.data.viewname].isExtFilterVisible) {
            if (that.data.filter.rendered) {
                that.data._el.button_filter_edit.button('disable');
                that.data._el.button_filter_clear.button('disable');
            }
        }
    };
    that.enable_line_extFilter = function(){
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] &&
            Asyst.Workspace.views[that.data.viewname].isExtFilterVisible) {
            if (that.data.filter.rendered) {
                that.data._el.button_filter_edit.button('enable');
                that.data._el.button_filter_clear.button('enable');
            }
        }
    };

    that.hide_extFilter = function(saveState){
        that.data.gridview.data._el.content.children('.card__header')
            .find('#' + that.data.filter.buttonId + ' .icon').addClass('icon_rotate_180deg');
        that.data._el.card__header_filter.addClass('hidden');
        if (saveState) {
            that.data.filter.hidden = true;
            if (typeof setCookie == 'function') {
                setCookie('register_ext_filter_hidden', true);
            }
        }
        $(window).trigger('resize');
    };
    that.show_extFilter = function(saveState){
        that.data.gridview.data._el.content.children('.card__header')
            .find('#' + that.data.filter.buttonId + ' .icon').removeClass('icon_rotate_180deg');
        that.data._el.card__header_filter.removeClass('hidden');
        if (saveState) {
            that.data.filter.hidden = false;
            if (typeof setCookie == 'function') {
                setCookie('register_ext_filter_hidden', false);
            }
        }
        $(window).trigger('resize');
    };
    that.toggle_extFilter = function(){
        if (that.data._el.card__header_filter.hasClass('hidden')) {
            that.show_extFilter(true);
        } else {
            that.hide_extFilter(true);
        }
    };

    that.set_extFilter = function(){
        if (that.data.filter.filterArgs) {
            if (that.data.filter.filterArgs.filterItems) {
                if (that.data.filter.filterArgs.filterItems.length > 0) {
                    view.DataView.setFilter(Grid.ExtFilter);
                    view.DataView.setFilterArgs(that.data.filter.filterArgs);
                    view.DataView.refresh();
                    that.render_set_extFilter();
                } else {
                    that.clear_extFilter();
                }
            } else {
                that.clear_extFilter();
            }
        } else {
            that.clear_extFilter();
        }
    };
    that.edit_extFilter = function(){
        that.render_modal_extFilter(function(){
            that.set_extFilter();
        });
    };
    that.clear_extFilter = function(){
        that.data.filter.filterArgs = null;
        view.DataView.setFilter(Grid.ExtFilter);
        view.DataView.setFilterArgs(that.data.filter.filterArgs);
        view.DataView.refresh();
        that.render_clear_extFilter();
    };
    /* end of extFilter methods */

    that.store_to_window = function(){
        if (typeof window.gridviews == typeof undefined) { window.gridviews = []; }
        window.gridviews[that.data.id] = that;
    };
    that.reload = {
        view: function(){
            that.load_view();
        }
    };

    that.init_header = function(){
        $.each(that.data.views, function(key, view){
            var title = view.title.replace('##','').replace('##','');
            title = title.substring(title.indexOf('\\')+1);
            that.data.header.views.push({
                name: title,
                value: key,
                selected: that.data.viewname == key,
                onclick: function(){
                    // save current viewSample
                    if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] &&
                        Asyst.Workspace.views[that.data.viewname].isViewSampled) {
                        that.data.grid.saveCurrent();
                        that.data.params.viewSampleId = undefined;
                    }
                    setPageCookie('CurrentViewName' + (that.data.params.entity ? '_' + that.data.params.entity : ''), key);
                    that.data.viewname = key;
                    that.load_view();
                }
            });
        });
        that.data.header.reload.onclick = function(){
            that.load_view();
        };
        if (that.data.isSearch) {
            that.data.header.search = {
                onkeyup: function(e){
                    var value = $(this).val();
                    Slick.GlobalEditorLock.cancelCurrentEdit();
                    if (e.which == 27) { value = ''; }
                    that.data.grid.UpdateQuickFilter(value);
                },
                onclear: function(e){
                    Slick.GlobalEditorLock.cancelCurrentEdit();
                    that.data.grid.UpdateQuickFilter('');
                }
            };
        }
    };
    that.init_settings = function(){
        that.data.header.settings = [];
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isCreate) {
            that.data.header.settings.push({
                icon: 'icon_svg_plus',
                name: 'Добавить',
                onclick: function(){
                    Asyst.Workspace.openEntityDialog(that.data.entityname, that.data.title, null, function(){
                        that.load_view();
                    });
                }
            });
        }
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isDelete) {
            that.data.header.settings.push({
                icon: 'icon_svg_trash',
                name: 'Удалить',
                onclick: function(){
                    that.data.grid.DeleteSelected();
                }
            });
        }
        that.data.header.settings.push({
            icon: 'icon_svg_expand',
            name: 'Развернуть все группы',
            onclick: function(){
                that.data.grid.ExpandAllGroups();
            }
        });
        that.data.header.settings.push({
            icon: 'icon_svg_collapse',
            name: 'Свернуть все группы',
            onclick: function(){
                that.data.grid.CollapseAllGroups();
            }
        });
        if (that.data.isExport) {
            that.data.header.settings.push({
                icon: 'icon_svg_export',
                name: 'Выгрузка',
                onclick: function(){
                    Model.CurrentViewName = that.data.viewname;
                    viewName = that.data.viewname;
                    window[viewName] = that.data.grid;
                    Grid.ExportToXlsx();
                }
            });
        }
        if (that.data.closeButton) {
            that.data.header.settings.push({
                icon: 'icon_svg_close',
                name: 'Закрыть реестр',
                onclick: function(){
                    window.history.back();
                }
            });
        }
    };
    that.init_extFilter = function(){
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isExtFilterVisible) {
            that.data.header.extFilter = {
                id: that.data.filter.buttonId,
                icon: 'icon_svg_up_fill icon_animate',
                name: 'Скрыть / показать расширенный фильтр',
                onclick: function(){
                    that.toggle_extFilter();
                }
            };
        }
        if (typeof getCookie == 'function') {
            that.data.filter.hidden = getCookie('register_ext_filter_hidden') == 'true';
        }
    };
    that.init = function(){
        that.loader_add();
        that.load_metaViewAll(
            function(){
                that.init_header();
                that.init_settings();
                that.init_extFilter();
                that.store_to_window();
                that.loader_remove();
                that.data.gridViewClass = (window || this)[that.data.gridViewClassName];
                that.data.gridview = new that.data.gridViewClass({
                    containerid: that.data.containerid,
                    title: that.data.title,
                    header: that.data.header,
                    render: that.load_view
                });
            },
            function(){
                that.loader_remove();
                that.data.gridview = new GridViewEmpty({
                    containerid: that.data.containerid,
                    title: 'Нет доступных представлений'
                });
            }
        );
        /*
        that.load_metaViewNames(function(){
            that.load_metaView(
                that.load_metaViewEntity,
                function(){
                    that.init_header();
                    that.init_settings();
                    that.init_extFilter();
                    that.store_to_window();
                    that.loader_remove();
                    that.data.gridViewClass = (window || this)[that.data.gridViewClassName];
                    that.data.gridview = new that.data.gridViewClass({
                        containerid: that.data.containerid,
                        title: that.data.title,
                        header: that.data.header,
                        render: that.load_view
                    });
                },
                function(){
                    that.loader_remove();
                    that.data.gridview = new GridViewEmpty({
                        containerid: that.data.containerid,
                        title: 'Нет доступных представлений'
                    });
                }
            );
        });
        */
    };
    that.init();
    return that;
};