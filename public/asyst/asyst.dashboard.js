if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.Dashboard = function(options){
    var that = this._dashboard = {};
    that.data = {
        containerid: null,
        libraries: null,
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage,
        items: [],
        library: [],
        userdashboardid: null,
        dashboard: null
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        loader: $('<span class="spinner"></span>')
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
            success: function(data){ console.log(data); },
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
                    that.data.userdashboardid = data[0][0].UserDashboardId;
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
                }
                if (typeof callback == 'function') { callback(); }
            },
            error: function(data){ console.log(data); }
        });
    };
    that.loadLibrary = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'WidgetLibrary',
            data: {
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
        that.loadItems(function(){
            that.loadLibrary(function(){
                that.loader_remove();
                that.data.dashboard = new Dashboard({
                    containerid: that.data.containerid,
                    items: that.data.items,
                    library: that.data.library,
                    loader: Asyst.MetaElementLoader,
                    save: function(items){
                        that.saveItems(items);
                    }
                });
            });
        });
    };
    that.init();
    return that;
};