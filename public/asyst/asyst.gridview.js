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
        editable: false,
        closeButton: true,
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
                            that.data.metaviewnames.push(v.viewName);
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
    that.load_metaView = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'MetaView',
            data: {
                EntityName: that.data.entityname,
                ViewName: that.data.metaviewnames.join(','),
                AccountId: that.data.user.Id
            },
            success: function(data){
                if (data[0]) {
                    // get views parameters
                    var metaview = data[0];
                    if (!that.data.entityname && !(that.data.viewname instanceof Array) && that.data.viewname) {
                        metaview = metaview.filter(function(view){ return view.viewName == that.data.viewname; });
                    }
                    metaview.map(function(view){
                        //if no metaview rows
                        view.viewTitle = (view.viewTitle ? view.viewTitle : view.entityTitle);
                        view.viewName = (view.viewName ? view.viewName : view.entityName);

                        //view.IsWideString = false; //override
                        view.IsExtFilterVisible = false; //override
                        view.IsEditable = that.data.editable;
                        view.IsViewSampled = false;
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
                            Asyst.Workspace.addView({
                                entity: {
                                    idName: view.idName,
                                    isViewProcessLink: view.IsViewProcessLink,
                                    name: view.entityName,
                                    title: view.entityTitle
                                },
                                title: view.viewTitle,
                                isExtFilterVisible: (view.IsExtFilterVisible ? view.IsExtFilterVisible : false),
                                isInitiallyCollapsed: (view.IsInitiallyCollapsed ? view.IsInitiallyCollapsed : false),
                                isWideString: (view.IsWideString ? view.IsWideString : false),
                                isEditable: (view.IsEditable ? view.IsEditable : false),
                                isViewSampled: (view.IsViewSampled ? view.IsViewSampled : false),
                                preprocessFunctionText: (view.PreprocessFunction ? view.PreprocessFunction : 'console.log(666);'),
                                viewSamples: {}
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
                    if (!that.data.title) {
                        that.data.title = metaviewSelected.entityTitle;
                    }
                    // set document title
                    if (that.data.setDocumentTitle) {
                        document.title = that.data.title;
                    }
                    // do callback
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
        if (typeof that.data.gridview.menu__item_lock == 'function') { that.data.gridview.menu__item_lock(); }
        that.data.gridview.data.loading = true;
        Asyst.APIv2.View.load({
            viewName: that.data.viewname,
            data: that.data.params,
            success: function(data){
                that.data.data = data;
                that.init_settings();
                that.render_view();
                //that.render_settings();
                if (typeof that.data.gridview.menu__item_unlock == 'function') { that.data.gridview.menu__item_unlock(); }
                that.data.gridview.data.loading = false;
                that.loader_remove();
            },
            error: function(data){
                if (typeof that.data.gridview.menu__item_unlock == 'function') { that.data.gridview.menu__item_unlock(); }
                that.data.gridview.data.loading = false;
                that.loader_remove();
                console.log(data);
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
        if (Asyst.Workspace.views && Asyst.Workspace.views[that.data.viewname] && Asyst.Workspace.views[that.data.viewname].hasOwnProperty('preprocessFunction'))
            Asyst.Workspace.views[that.data.viewname].preprocessFunction(viewEl, data.data, data.columns, options, data.groups);

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

        if (!window['views'] || !views.hasOwnProperty(viewName) || !Asyst.Workspace.views[viewName].isEditable)
            $('#menuItemAdd').hide();
        else
            $('#menuItemAdd').show();

        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isExtFilterVisible)
            $('.ext-filter-menu').show();
        else
            $('.ext-filter-menu').hide();

        //$('#BrowseSearch').keyup(window[viewName].QuickFilterKeyup);
        //$('.search-clear').click(window[viewName].QuickFilterClear);
        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isInitiallyCollapsed) {
            window[viewName].CollapseAllGroups();
        }

        if (that.data.params.hasOwnProperty("ExpandGroup"))
            if (that.data.params.ExpandGroup == "true")
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
            if (!that.data.params.hideFilterPanel)
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
        // было закоментировано
        // --------------------
        //Loader.hide();
    };
    that.render_settings = function(){
        that.data.gridview.data.header.settings = that.data.header.settings;
        that.data.gridview.render_settings_popup();
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
                    setPageCookie('CurrentViewName' + (that.data.params.entity ? '_' + that.data.params.entity : ''), key);
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
                    Asyst.Workspace.openEntityDialog(that.data.entityname, that.data.title, null, function(){
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
            that.load_metaView(function(){
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
            });
        });
    };
    that.init();
    return that;
};