if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.PageDashboard = function(options){
    var that = this._pageDashboard = {};
    that.data = {
        title: null,
        containerid: 'container',
        libraries: [],
        single: false,
        editable: true,
        library: [],
        asystDashboard: null,
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage
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
    that.init = function(){
        that.loader_add();
        that.loadLibrary(function(){
            that.loader_remove();
            that.data.asystDashboard = new Asyst.Dashboard({
                title: that.data.title,
                containerid: that.data.containerid,
                single: that.data.single,
                editable: that.data.editable,
                library: that.data.library,
                loader: Asyst.MetaElementLoader,
                page: that.data.page
            });
        });
    };
    that.init();
    return that;
};
Asyst.SettingsDashboard = function(options){
    var that = this._settingsDashboard = {};
    that.data = {
        title: null,
        containerid: 'container',
        settings: [],
        editable: true,
        library: [],
        contents: [],
        asystDashboard: null,
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage
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
        function loadLibrary(library, settings){
            var settings_by_category = {};
            settings.map(function(a){
                if (a.category in settings_by_category) {
                    settings_by_category[a.category] ++;
                } else {
                    settings_by_category[a.category] = 0;
                    library[0].items.push({
                        text: a.category,
                        value: a.category
                    });
                }
            });
            return library;
        }
        function loadContents(library, settings){
            var contents = [];
            library[0].items.map(function(li){
                var rows = '';
                settings.map(function(s){
                    if (s.category == li.value) {
                        rows += '<tr><td><a class="link" href="' + s.url + '" target="_blank">' + s.name + '</a></td></tr>';
                    }
                });
                contents.push({
                    pagename: library[0].value,
                    elementname: li.value,
                    content: [
                        '<div class="widget__content widget__content_scroll">',
                        '<table class="table">',
                        '<tbody>' + rows + '</tbody>',
                        '</table>',
                        '</div>'
                    ].join('')
                });
            });
            return contents;
        }
        that.data.library = loadLibrary([{ text: 'Настройки', value: 'LibrarySettings', items: [] }], that.data.settings);
        that.data.contents = loadContents(that.data.library, that.data.settings);
        if (typeof callback == 'function') { callback(); }
    };
    that.init = function(){
        that.loader_add();
        that.loadLibrary(function(){
            that.loader_remove();
            that.data.asystDashboard = new Asyst.Dashboard({
                title: that.data.title,
                containerid: that.data.containerid,
                editable: that.data.editable,
                library: that.data.library,
                loader: $.extend(Asyst.ContentLoader, { contents: that.data.contents }),
                page: that.data.page
            });
        });
    };
    that.init();
    return that;
};
Asyst.Dashboard = function(options){
    var that = this._dashboard = {};
    that.data = {
        title: null,
        containerid: 'container',
        single: false,
        editable: true,
        library: [],
        loader: null,
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage,
        items: [],
        userdashboardid: null,
        dashboard: null
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
    that.init = function(){
        that.loader_add();
        that.loadItems(function(){
            that.loader_remove();
            that.data.dashboard = new Dashboard({
                title: that.data.title,
                containerid: that.data.containerid,
                single: that.data.single,
                editable: that.data.editable,
                pagename: that.data.page.pageName,
                items: that.data.items,
                library: that.data.library,
                loader: that.data.loader,
                save: function(items){
                    that.saveItems(items);
                }
            });
        });
    };
    that.init();
    return that;
};