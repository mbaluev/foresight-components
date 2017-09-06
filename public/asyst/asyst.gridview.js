if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.GridView = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: 'container',
        entityname: null,
        viewname: null,
        viewtitle: null,
        params: { ExpandGroup: false },
        views: {},
        gridview: null,
        data: null,
        header: {
            views: [
                {
                    name: 'Мои проекты',
                    value: 'MyProjects',
                    selected: true,
                    onclick: function(){}
                },
                {
                    name: 'Все проекты',
                    value: 'AllProjects',
                    onclick: function(){}
                },
                {
                    name: 'Активные',
                    value: 'Active',
                    onclick: function(){}
                },
                {
                    name: 'Архивные',
                    value: 'Archive',
                    onclick: function(){}
                },
                {
                    name: 'Бюджеты проектов',
                    value: 'Budgets',
                    onclick: function(){}
                },
                {
                    name: 'Проекты без целей',
                    value: 'NoGoals',
                    onclick: function(){}
                }
            ],
            reload: {
                onclick: function(){ console.log('reload'); }
            },
            settings: [
                {
                    icon: 'icon_svg_plus',
                    name: 'Добавить',
                    onclick: function(){ console.log('add'); }
                },
                {
                    icon: 'icon_svg_trash',
                    name: 'Удалить',
                    onclick: function(){}
                },
                {
                    icon: 'icon_svg_expand',
                    name: 'Развернуть все группы',
                    onclick: function(){}
                },
                {
                    icon: 'icon_svg_collapse',
                    name: 'Свернуть все группы',
                    onclick: function(){}
                },
                {
                    icon: 'icon_svg_export',
                    name: 'Экспорт',
                    onclick: function(){}
                },
                {
                    icon: 'icon_svg_search',
                    name: 'Расширенный фильтр',
                    onclick: function(){}
                }
            ],
            search: {
                onkeyup: function(){ console.log('searching'); },
                onclear: function(){ console.log('clear'); }
            }
        }
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        loader: $('<span class="spinner"></span>')
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

    that.load_metaview = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'MetaView',
            data: {
                EntityName: that.data.entityname
            },
            success: function(data){
                var items = [];
                if (data[0]) {
                    var metaview = data[0];
                    if (that.data.viewname) {
                        metaview = metaview.filter(function(view){ return view.viewName = that.data.viewname; });
                    }
                    metaview.map(function(view, i){
                        if (i == 0) {
                            that.data.viewname = view.viewName;
                            that.data.viewtitle = view.viewTitle;
                        }
                        if (!Asyst.Workspace.views[view.viewName]) {
                            Asyst.Workspace.addView({
                                entity: {
                                    idName: view.idName,
                                    isViewProcessLink: view.IsViewProcessLink,
                                    name: view.entityName,
                                    title: view.entityTitle
                                },
                                title: view.viewTitle,
                                isExtFilterVisible: view.isExtFilterVisible,
                                isInitiallyCollapsed: view.isInitiallyCollapsed,
                                isWideString: view.isWideString,
                                isEditable: false,
                                isViewSampled: false,
                                preprocessFunctionText: '',
                                viewSamples: {}
                            }, view.viewName);
                        }
                        that.data.views[view.viewName] = {
                            title: view.viewTitle,
                            isEditable: false,
                            isWideString: view.isWideString,
                            isInitiallyCollapsed: view.isInitiallyCollapsed,
                            isExtFilterVisible: view.isExtFilterVisible
                        };
                    });
                    if (typeof callback == 'function') {
                        callback();
                    }
                } else {
                    console.log(data);
                }
            },
            error: function(data){ console.log(data); }
        });
    };
    that.load_view = function(callback){
        Asyst.APIv2.View.load({
            viewName: that.data.viewname,
            data: that.data.params,
            success: function(data){
                if (typeof callback == 'function') { callback(data); }
            }
        });
    };
    that.render_data = function(container, data){

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
            enableCellNavigation: true,
            editable: false,
            autoHeight: false,
            doClick: true,
            wideString: that.data.view.isWideString,
            initiallyCollapsed: that.data.view.isInitiallyCollapsed,
            rowSelectionModel: new Asyst.RowSelectionModel()
        };

        if (data.EditFormName) {
            viewEl.css("overflow", "hidden");
            var EditableGrid = Asyst.Models.EditableView.EditableGrid;
            view = EditableGrid.create(viewEl, data.data, data.columns, data.EditFormName, data.KeyName, data.EntityName);
        } else {
            view = Grid.Create(viewEl, data.data, data.columns, options, data.groups, that.data.params, data.filters, data.viewSample);
            var grid = view.Grid;
            var dataView = view.DataView;
            if (data.EntityId)
                grid.EntityId = data.EntityId;
            if (data.EntityName)
                grid.EntityName = data.EntityName;
            if (data.KeyName)
                grid.KeyName = data.KeyName;
            if (options.doClick) {
                grid.onClick.subscribe(function (e, args) {
                    var cell = grid.getCellFromEvent(e);
                    var item = grid.getDataItem(cell.row);
                    if (item.__nonDataRow) return;
                    var column = grid.getColumns()[cell.cell];
                    ViewClick(dataView, item, column, e);
                });
            }
        }
        view.viewName = that.data.viewname;

        /*
        if (that.data.view.isEditable) {
        } else {
        }

        if (that.data.view.isExtFilterVisible) {
        } else {
        }

        $('#BrowseSearch').keyup(window[viewName].QuickFilterKeyup);
        $('.search-clear').click(window[viewName].QuickFilterClear);

        if (that.data.view.isInitiallyCollapsed) {
            window[viewName].CollapseAllGroups();
        }

        if (params.hasOwnProperty("ExpandGroup")) {
            if (params.ExpandGroup == "true") {
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
            if (!params.hideFilterPanel) {
                MakeFilterLine(filterArgs);
            }
            ToggleClearFilterButton(true);
        } else {
            view.QuickFilterClear();
            ToggleClearFilterButton(false);
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

        //восстанавливаем меню.
        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName])
            $('#viewSelectBtn').text(Asyst.Workspace.views[viewName].title);
        if (data.viewSample && data.viewSample.name != "")
            $('#viewSampleSelectBtn').text(data.viewSample.name);
        else
            $('#viewSampleSelectBtn').text(Globa.ViewSample.locale());
        view.viewSampleMenuRebuild();

        if (needInvalidate) {
            view.Grid.invalidate();
        }
        */
    };

    that.init = function(){
        that.loader_add();
        that.load_metaview(function(){
            that.load_view(function(data){
                that.loader_remove();
                that.data.gridview = new GridView({
                    containerid: that.data.containerid,
                    title: that.data.title,
                    data: data,
                    header: that.data.header,
                    render: that.render_data
                });
            });
        });
    };
    that.init();
    return that;
};