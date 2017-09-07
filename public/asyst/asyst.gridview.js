if (typeof viewName == typeof undefined) { var viewName = ''; }
if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.GridView = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: 'container',
        entityname: null,
        entitytitle: null,
        viewname: null,
        viewtitle: null,
        params: { ExpandGroup: false },
        views: {},
        gridview: null,
        grid: null,
        data: null,
        header: {
            views: [],
            reload: {},
            settings: [],
            search: {}
        }
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        loader: $('<span class="spinner"></span>')
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
                        view.IsExtFilterVisible = false; //override
                        view.IsEditable = false;
                        view.IsViewSampled = false;
                        if (i == 0) {
                            that.data.viewname = view.viewName;
                            that.data.viewtitle = view.viewTitle;
                            that.data.entitytitle = view.entityTitle;
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
                                isExtFilterVisible: view.IsExtFilterVisible,
                                isInitiallyCollapsed: view.IsInitiallyCollapsed,
                                isWideString: view.IsWideString,
                                isEditable: view.IsEditable,
                                isViewSampled: view.IsViewSampled,
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
            error: function(data){
                console.log(data);
                that.loader_remove();
            }
        });
    };
    that.load_view = function(){
        that.loader_add();
        Asyst.APIv2.View.load({
            viewName: that.data.viewname,
            data: that.data.params,
            success: function(data){
                that.data.data = data;
                that.init_settings();
                that.render_view();
                that.render_settings();
                that.loader_remove();
            },
            error: function(data){
                console.log(data);
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
            enableCellNavigation: true,
            editable: false,
            autoHeight: false,
            doClick: true,
            wideString: Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isWideString,
            initiallyCollapsed: Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isInitiallyCollapsed,
            rowSelectionModel: new Asyst.RowSelectionModel()
        };

        //todo replace
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].hasOwnProperty('preprocessFunction'))
            Asyst.Workspace.views[that.data.viewname].preprocessFunction(viewEl, data.data, data.columns, options, data.groups);

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

                    viewName = that.data.viewname;
                    window[viewName] = view;
                    ViewClick(dataView, item, column, e);
                });
            }
        }
        view.viewName = that.data.viewname;
        that.data.grid = view;

        /*
        if (!window['views'] || !views.hasOwnProperty(viewName) || !Asyst.Workspace.views[viewName].isEditable)
            $('#menuItemAdd').hide();
        else
            $('#menuItemAdd').show();

        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isExtFilterVisible)
            $('.ext-filter-menu').show();
        else
            $('.ext-filter-menu').hide();

        $('#BrowseSearch').keyup(window[viewName].QuickFilterKeyup);
        $('.search-clear').click(window[viewName].QuickFilterClear);
        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isInitiallyCollapsed) {
            window[viewName].CollapseAllGroups();
        }

        if (params.hasOwnProperty("ExpandGroup"))
            if (params.ExpandGroup == "true")
                view.ExpandAllGroups();
            else
                view.CollapseAllGroups();

        var needInvalidate = false;

        if (filterArgs && filterArgs.hasOwnProperty('oper')) {
            view.DataView.setFilter(Grid.ExtFilter);
            filterArgs = $.extend(filterArgs, {gridView: view});
            view.DataView.setFilterArgs(filterArgs);
            view.DataView.refresh();
            needInvalidate = true;
            //$('#BrowseSearchGroup').hide();
            if (!params.hideFilterPanel)
                MakeFilterLine(filterArgs);
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

        //быстрокостыль для нового хрома и ширины реестра
        {
            $('#view').css({width: '1200px'});
            setTimeout(function () {
                $('#view').css({width: '100%'});
            }, 100);
        }
        Loader.hide();
        */
    };
    that.render_settings = function(){
        that.data.gridview.data.header.settings = that.data.header.settings;
        that.data.gridview.render_settings_popup();
    };

    that.init_header = function(){
        $.each(that.data.views, function(key, view){
            that.data.header.views.push({
                name: view.title,
                value: key,
                selected: that.data.viewname == key,
                onclick: function(){
                    that.data.viewname = key;
                    that.load_view();
                }
            });
        });
        that.data.header.reload.onclick = function(){
            that.load_view();
        };
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
    };
    that.init_settings = function(){
        that.data.header.settings = [];
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isEditable) {
            that.data.header.settings.push({
                icon: 'icon_svg_plus',
                name: 'Добавить',
                onclick: function(){
                    Asyst.Workspace.openEntityDialog(that.data.entityname, that.data.entitytitle, null, function(){
                        that.load_view();
                    });
                }
            });
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
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].isExtFilterVisible) {
            that.data.header.settings.push({
                icon: 'icon_svg_search',
                name: 'Расширенный фильтр',
                onclick: function(){
                    that.data.grid.ExtendFilter();
                }
            });
        }
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
    };
    that.init = function(){
        that.loader_add();
        that.load_metaview(function(){
            that.init_header();
            that.init_settings();
            that.loader_remove();
            that.data.gridview = new GridView({
                containerid: that.data.containerid,
                title: that.data.entitytitle,
                header: that.data.header,
                render: that.load_view
            });
        });
    };
    that.init();
    return that;
};