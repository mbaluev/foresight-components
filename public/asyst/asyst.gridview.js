if (typeof viewName == typeof undefined) { var viewName = ''; }
if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.GridView = function(options){
    var that = this._gridview = {};
    that.data = {
        id: '' + Date.now(),
        containerid: 'container',
        user: Asyst.Workspace.currentUser,
        title: null,
        entityname: null,
        entitytitle: null,
        viewname: null,
        viewtitle: null,
        viewnameCookie: null,
        viewnameStartsWith: null,
        editable: false,
        closeButton: true,
        isSearch: true,
        isExport: true,
        setDocumentTitle: false,
        metaviewnames: [],
        params: splitGETString(),
        views: {},
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
            search: {}
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
        loader: $('<span class="spinner spinner_align_center"></span>')
    };
    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
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
                        console.log(data);
                    }
                },
                error: function(data){
                    console.log(data);
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

                        //view.IsWideString = false; //override
                        //view.IsExtFilterVisible = false; //override
                        //view.IsViewSampled = false;
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
                                isCreate: (view.IsCreate && view.entityName ? view.IsCreate : false),
                                isDelete: (view.IsDelete && view.entityName ? view.IsDelete : false),
                                preprocessFunctionText: (view.PreprocessFunction ? view.PreprocessFunction : 'console.log(666);'),
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
                console.log(data);
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
                                isCreate: (view.IsCreate && view.entityName ? view.IsCreate : false),
                                isDelete: (view.IsDelete && view.entityName ? view.IsDelete : false),
                                preprocessFunctionText: 'console.log(666);',
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
                console.log(data);
                that.loader_remove();
            }
        });
    };
    that.load_view = function(){
        that.loader_add();
        that.data.gridview.data.loading = true;
        if (typeof that.data.gridview.menu__item_lock == 'function') { that.data.gridview.menu__item_lock(); }
        that.disable_viewSample();
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
                that.render_extFilter();
                //that.render_settings();
                if (typeof that.data.gridview.menu__item_unlock == 'function') { that.data.gridview.menu__item_unlock(); }
                that.enable_viewSample();
                that.data.gridview.data.loading = false;
                that.loader_remove();
            },
            error: function(data){
                console.error('error. Asyst.APIv2.View.load');
                if (typeof that.data.gridview.menu__item_unlock == 'function') { that.data.gridview.menu__item_unlock(); }
                that.enable_viewSample();
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

        // --------------------
        // было закоментировано

        /*
        if (!window['views'] || !views.hasOwnProperty(viewName) || !Asyst.Workspace.views[viewName].isEditable) {
            $('#menuItemAdd').hide();
        } else {
            $('#menuItemAdd').show();
        }
        */

        // перенесено в that.render_extFilter
        /*
        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isExtFilterVisible) {
            $('.ext-filter-menu').show();
        } else {
            $('.ext-filter-menu').hide();
        }
        */

        //$('#BrowseSearch').keyup(window[viewName].QuickFilterKeyup);
        //$('.search-clear').click(window[viewName].QuickFilterClear);
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
            view.DataView.setFilterArgs(filterArgs);
            view.DataView.refresh();
            needInvalidate = true;
            /*
            if (!that.data.params.hideFilterPanel)
                MakeFilterLine(filterArgs);
            ToggleClearFilterButton(true);
            */
        } else {
            view.QuickFilterClear();
            //ToggleClearFilterButton(false);
            !(!!data.EditFormName) && Grid.ClearExtFilter(view);
        }
        if (filterArgs && filterArgs.hasOwnProperty('searchString') && filterArgs.searchString !== "") {
            $('#BrowseSearch').val(filterArgs.searchString);
            view.UpdateQuickFilter(filterArgs.searchString);
            ToggleClearFilterButton(true);
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

        // восстанавливаем меню.
        // перенесено в that.render_viewSample
        /*
        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName]) {
            $('#viewSelectBtn').text(Asyst.Workspace.views[viewName].title);
        }
        if (data.viewSample && data.viewSample.name != "") {
            $('#viewSampleSelectBtn').text(data.viewSample.name);
        } else {
            $('#viewSampleSelectBtn').text(Globa.ViewSample.locale());
        }
        view.viewSampleMenuRebuild();
        */

        if (needInvalidate) {
            view.Grid.invalidate();
        }

        //быстрокостыль для нового хрома и ширины реестра
        {
            $('#view').css({width: '1200px'});
            setTimeout(function () {
                $('#view').css({width: '100%'});
            }, 100);
        }
        // было закоментировано
        // --------------------
        //Loader.hide();
    };
    that.render_settings = function(){
        that.data.gridview.data.header.settings = that.data.header.settings;
        that.data.gridview.render_settings_popup();
    };
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
    that.render_extFilter = function(){
        var _el = {
            select: $('<select class="select" data-fc="select" id="select__viewSample"></select>'),
            card__header_filter: $([
                '<div class="card__header">',
                '<div class="card__header-row">',
                '<div class="card__header-column card__header-column_start" id="filter__applied"></div>',
                '<div class="card__header-column" id="filter__buttons"></div>',
                '</div>',
                '</div>'
            ].join('')),
            button_filter_edit: $([
                '<button class="button" type="button" data-fc="button" data-tooltip="Расширенный фильтр">',
                '<span class="icon icon_svg_controls"></span>',
                '</button>'
            ].join('')),
            alertbox: $([
                '<span class="alertbox-group alertbox-group_highlighted">',
                '<label class="alertbox" data-fc="alertbox">',
                '<span class="alertbox__text">IndicatorId</span>',
                '</label>',
                '<label class="alertbox" data-fc="alertbox">',
                '<span class="alertbox__text">равно</span>',
                '</label>',
                '<label class="alertbox" data-fc="alertbox">',
                '<span class="alertbox__text">0</span>',
                '</label>',
                '</span>'
            ].join('')).alertbox()
        };
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] &&
            Asyst.Workspace.views[that.data.viewname].isExtFilterVisible) {
            if (!that.data.params.hideFilterPanel) {

            }
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
                var form = $(this).closest('[data-fc="form"]'), valid = true;
                if (form.length > 0) { valid = form.form('validate') }
                if (valid) {
                    var name = form.find('[data-fc="input"]').input('value').replace('\n', ' ').substring(0, 250);
                    var sample = that.data.grid.getViewSample();
                    sample.name = name;
                    var asystViewSample = Asyst.Workspace.views[that.data.viewname].viewSamples.filter(function(v){ return v.Name == name; });
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
                        Asyst.Workspace.views[that.data.viewname].viewSamples.push({
                            ViewSampleId: sample.guid,
                            viewName: that.data.viewname,
                            Name: sample.name,
                            Sample: JSON.stringify(sample)
                        });
                    }
                    that.data.params.viewSampleId = sample.guid;
                    that.update_viewSampleSelect();
                    that.data.modal.modal__('hide');
                }
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
                    icon: 'icon_svg_save_red'
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
                        that.data._el.select__view_sample.clone().attr('data-required', true)[0].outerHTML,
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
                var form = $(this).closest('[data-fc="form"]'), valid = true;
                if (form.length > 0) { valid = form.form('validate') }
                if (valid) {
                    var value = form.find('[data-fc="select"]').select('value');
                    /*
                    var sample = that.data.grid.getViewSample();
                    sample.name = name;
                    var asystViewSample = Asyst.Workspace.views[that.data.viewname].viewSamples.filter(function(v){ return v.Name == name; });
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
                        Asyst.Workspace.views[that.data.viewname].viewSamples.push({
                            ViewSampleId: sample.guid,
                            viewName: that.data.viewname,
                            Name: sample.name,
                            Sample: JSON.stringify(sample)
                        });
                    }
                    that.data.params.viewSampleId = sample.guid;
                    that.update_viewSampleSelect();
                    */
                    that.data.modal.modal__('hide');
                }
            })
            .on('hidden.fc.modal', function(){
                that.data.form.remove();
            });
        that.data.form.append(that.data.modal).appendTo('body').form();
    };

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
    that.init = function(){
        that.loader_add();
        that.load_metaViewNames(function(){
            that.load_metaView(
                that.load_metaViewEntity,
                function(){
                    that.init_header();
                    that.init_settings();
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
    };
    that.init();
    return that;
};