if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.PageDashboard = function(options){
    var that = this._pageDashboard = {};
    that.data = {
        id: 'dashboard_' + guid(),
        title: null,
        name: null,
        containerid: 'container',
        type: 'page',
        libraries: [],
        single: false,
        editable: true,
        library: [],
        asystDashboard: null,
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage,
        headerExtraControlsRenderer: null,
        tumblerContainerSelector: null,
        params: null
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
    that.loadLibrary = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'WidgetLibrary',
            data: {
                AccountId: that.data.user.Id,
                PageName: that.data.libraries.join(',')
            },
            success: function(data){
                var items = [];
                if (data[0]) {
                    var libs = {};
                    data[0].map(function(d){
                        if (d.pageId in libs) {
                            libs[d.pageId].items.push({
                                value: d.metaPageElementName,
                                text: d.metaPageElementTitle
                            });
                        } else {
                            libs[d.pageId] = {
                                value: d.metaPageName,
                                text: d.metaPageTitle,
                                items: [{
                                    value: d.metaPageElementName,
                                    text: d.metaPageElementTitle
                                }]
                            };
                        }
                    });
                    for (var pageId in libs) {
                        that.data.library.push(libs[pageId]);
                    }
                    if (typeof callback == 'function') { callback(); }
                } else {
                    console.log(data);
                }
            },
            error: function(data){ console.log(data); }
        });
    };
    that.reload = {
        dashboard: function(options, params){
            that.data.asystDashboard.reload.dashboard(options, params);
        },
        widgets: function(options, params){
            that.data.asystDashboard.reload.widgets(options, params);
        },
        widget: function(id, options, params){
            that.data.asystDashboard.reload.widget(id, options, params);
        },
        element: function(elementname, options, params){
            that.data.asystDashboard.reload.element(elementname, options, params);
        },
        title: function(title){
            that.data.asystDashboard.reload.title(title);
        },
        name: function(name){
            that.data.asystDashboard.reload.name(name);
        }
    };
    that.init = function(){
        that.loader_add();
        that.loadLibrary(function(){
            that.loader_remove();
            that.data.asystDashboard = new Asyst.Dashboard({
                id: that.data.id,
                title: that.data.title,
                name: that.data.name,
                containerid: that.data.containerid,
                type: that.data.type,
                single: that.data.single,
                editable: that.data.editable,
                library: that.data.library,
                loader: Asyst.MetaElementLoader,
                page: that.data.page,
                headerExtraControlsRenderer: that.data.headerExtraControlsRenderer,
                tumblerContainerSelector: that.data.tumblerContainerSelector,
                params: that.data.params
            });
        });
    };
    that.init();
    return that;
};
Asyst.Dashboard = function(options){
    var that = this._dashboard = {};
    that.data = {
        id: 'dashboard_' + guid(),
        title: null,
        name: null,
        containerid: 'container',
        type: 'page',
        single: false,
        editable: true,
        library: [],
        loader: null,
        user: { Id: -1 }, //Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage,
        items: [],
        userdashboardid: null,
        dashboard: null,
        headerExtraControlsRenderer: null,
        tumblerContainerSelector: null,
        params: null
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
    that.saveItems = function(items){
        that.data.items = items;
        Asyst.APIv2.Entity.save({
            dataId: that.data.userdashboardid,
            entityName: 'UserDashboard',
            data: {
                AccountId: that.data.user.Id,
                PageName: that.data.page.pageName,
                Items: JSON.stringify(that.data.items)
            },
            success: function(data){
                that.data.userdashboardid = data.id;
            },
            error: function(data){ console.log(data); }
        });
    };
    that.loadItems = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'UserDashboard',
            data: {
                AccountId: that.data.user.Id,
                PageName: that.data.page.pageName
            },
            success: function(data){
                if (data[0][0]) {
                    that.data.items = JSON.parse(data[0][0].Items);
                    that.check_items();
                    if (data[0][0].AccountId == that.data.user.Id) {
                        that.data.userdashboardid = data[0][0].UserDashboardId;
                    }
                    if (typeof callback == 'function') { callback(); }
                } else {
                    that.loadDefaults(callback);
                }
            },
            error: function(data){ console.log(data); }
        });
    };
    that.loadDefaults = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'UserDashboard',
            data: {
                AccountId: -1,
                PageName: that.data.page.pageName
            },
            success: function(data){
                if (data[0][0]) {
                    that.data.items = JSON.parse(data[0][0].Items);
                    that.check_items();
                }
                if (typeof callback == 'function') { callback(); }
            },
            error: function(data){ console.log(data); }
        });
    };
    that.check_items = function(){
        var items = [];
        that.data.items.map(function(item){
            var lib = that.data.library.filter(function(l){ return l.value == item.settings.pagename; });
            if (lib.length > 0) {
                lib = lib[0];
                var libitem = lib.items.filter(function(i){ return i.value == item.settings.elementname; });
                if (libitem.length > 0) {
                    items.push(item);
                }
            }
        });
        that.data.items = items;
    };
    that.reload = {
        dashboard: function(options, params){
            that.data.dashboard.reload.dashboard(options, params);
        },
        widgets: function(options, params){
            that.data.dashboard.reload.widgets(options, params);
        },
        widget: function(id, options, params){
            that.data.dashboard.reload.widget(id, options, params);
        },
        element: function(elementname, options, params){
            that.data.dashboard.reload.element(elementname, options, params);
        },
        title: function(title){
            that.data.dashboard.reload.title(title);
        },
        name: function(name){
            that.data.dashboard.reload.name(name);
        }
    };
    that.init = function(){
        that.loader_add();
        that.loadItems(function(){
            that.loader_remove();
            that.data.dashboard = new Dashboard({
                id: that.data.id,
                title: that.data.title,
                name: that.data.name,
                containerid: that.data.containerid,
                type: that.data.type,
                single: that.data.single,
                editable: that.data.editable,
                pagename: that.data.page.pageName,
                items: that.data.items,
                library: that.data.library,
                loader: that.data.loader,
                save: function(items){
                    that.saveItems(items);
                },
                headerExtraControlsRenderer: that.data.headerExtraControlsRenderer,
                tumblerContainerSelector: that.data.tumblerContainerSelector,
                params: that.data.params
            });
        });
    };
    that.init();
    return that;
};