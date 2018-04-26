if (typeof Asyst == typeof undefined) { Asyst = {}; }
if (typeof Asyst.Utils == typeof undefined) { Asyst.Utils = {}; }
Asyst.Utils.toGuid = function(str){
    function toHex(str) {
        var hex = '';
        for(var i=0;i<str.length;i++) {
            hex += ''+str.charCodeAt(i).toString(16);
        }
        return hex;
    }
    function pad(str, len) {
        return (Array(len).join("0") + str).slice(-len);
    }
    var rxGetGuidGroups = /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/;
    var res = toHex(str);
    res = pad(res, 32);
    res = res.replace(rxGetGuidGroups, '$1-$2-$3-$4-$5');
    return res;
};
Asyst.PageDashboard = function(options){
    var that = this._pageDashboard = {};
    that.data = {
        id: guid(),
        title: null,
        name: null,
        containerid: 'container',
        type: 'page',
        libraries: {
            foresight: [],
            dbm: []
        },
        lib: {
            foresight: {
                library: [],
                loader: Asyst.MetaElementLoader
            },
            dbm: {
                library: [],
                loader: Asyst.MetaElementLoader,
                loadForm: function(container, widget, data, modal_settings, selected, callback){
                    var fields = null;
                    if (!selected.widget) {
                        selected.widget = { value: 'new', text: 'Новый виджет' };
                        fields = { PageId: selected.library.value, IsUserWidget: 1, IsTemplate: 1, IsLib: 0, Name: setWidgetName('') };
                    }
                    container.load('/asyst/MetaPageElementWidgetEditForm/form/ajax/' + selected.widget.value +
                        '?refreshrandom=1&noaction=true', { fields: JSON.stringify(fields) }, function(){
                        Asyst.Workspace.currentForm.Data.IsSpecialWidget = true;
                        if (typeof callback == 'function') { callback(); }
                    });
                },
                saveForm: function(widget, data, modal_settings, selected, callback){
                    if (typeof safeSave == 'function') {
                        safeSave({
                            success: function(){
                                if (selected.widget.value == 'new'){
                                    that.loadLibrary(function(){
                                        selected.widget.value = Asyst.Workspace.currentForm.Data.PageElementId;
                                        selected.widget.text = Asyst.Workspace.currentForm.Data.Title;
                                        $.extend(widget.data(), {
                                            pageid: Asyst.Workspace.currentForm.Data.PageId,
                                            elementid: Asyst.Workspace.currentForm.Data.PageElementId
                                        });
                                        /*
                                        that.reload.element(data.elementid, {
                                            lib: that.data.lib,
                                            pageid: Asyst.Workspace.currentForm.Data.PageId,
                                            elementid: Asyst.Workspace.currentForm.Data.PageElementId
                                        }, null);
                                        */
                                        that.reload.widgets({ lib: that.data.lib }, null);
                                        if (typeof callback == 'function') { callback(); }
                                    });
                                    /*
                                    that.loadLibrary(function(){
                                        selected.widget.value = Asyst.Workspace.currentForm.Data.PageElementId;
                                        selected.widget.text = Asyst.Workspace.currentForm.Data.Title;
                                        that.data.asystDashboard.data.lib = that.data.lib;
                                        that.data.asystDashboard.data.dashboard.data.lib = that.data.lib;
                                        data.lib = that.data.lib;
                                        data.pageid = Asyst.Workspace.currentForm.Data.PageId;
                                        data.elementid = Asyst.Workspace.currentForm.Data.PageElementId;
                                        widget.widget('set_content');
                                        if (typeof callback == 'function') { callback(); }
                                    });
                                    */
                                } else {
                                    widget.widget('set_content');
                                    if (typeof callback == 'function') { callback(); }
                                }
                            }
                        });
                    }
                },
                closeForm: function(widget, data, modal_settings, selected, callback){
                    Asyst.Workspace.removeCurrentForm();
                    if (typeof callback == 'function') { callback(); }
                }
            }
        },
        single: false,
        margin: true,
        editable: true,
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
                PageName: [
                    that.data.libraries.foresight.join(','),
                    that.data.libraries.dbm.join(',')
                ].join(',')
            },
            success: function(data){
                var items = [];
                if (data[0]) {
                    var libs = {};
                    data[0].map(function(d){
                        if (d.metaPageName in libs) {
                            libs[d.metaPageName].items.push({
                                value: d.pageElementId,
                                text: d.metaPageElementTitle
                            });
                        } else {
                            libs[d.metaPageName] = {
                                value: d.pageId,
                                text: d.metaPageTitle,
                                items: [{
                                    value: d.pageElementId,
                                    text: d.metaPageElementTitle
                                }]
                            };
                        }
                    });
                    for (var metaPageName in libs) {
                        for (var libname in that.data.libraries) {
                            if (that.data.libraries[libname].indexOf(metaPageName) >= 0) {
                                if (typeof that.data.lib[libname] == 'undefined') {
                                    that.data.lib[libname] = {
                                        library: [],
                                        loader: Asyst.MetaElementLoader
                                    };
                                }
                                var library = that.data.lib[libname].library.filter(function(dd){
                                    return dd.value == libs[metaPageName].value;
                                });
                                if (library.length == 0) {
                                    that.data.lib[libname].library.push(libs[metaPageName]);
                                } else {
                                    library[0].items = libs[metaPageName].items;
                                }
                            }
                        }
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
            asystDashboard();
            function asystDashboard(){
                that.loader_remove();
                that.data.asystDashboard = new Asyst.Dashboard({
                    id: that.data.id,
                    title: that.data.title,
                    name: that.data.name,
                    containerid: that.data.containerid,
                    type: that.data.type,
                    single: that.data.single,
                    margin: that.data.margin,
                    editable: that.data.editable,
                    lib: that.data.lib,
                    page: that.data.page,
                    headerExtraControlsRenderer: that.data.headerExtraControlsRenderer,
                    tumblerContainerSelector: that.data.tumblerContainerSelector,
                    params: that.data.params
                });
            }
        });
    };
    that.init();
    return that;
};
Asyst.Dashboard = function(options){
    var that = this._dashboard = {};
    that.data = {
        id: guid(),
        title: null,
        name: null,
        containerid: 'container',
        type: 'page',
        single: false,
        margin: true,
        editable: true,
        lib: null,
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
                PageObjectId: that.data.page.pageId,
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
                PageObjectId: that.data.page.pageId
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
                PageObjectId: that.data.page.pageId
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
            if (typeof that.data.lib == 'object') {
                for (key in that.data.lib) {
                    if (that.data.lib[key]) {
                        if (that.data.lib[key].library) {
                            var lib = that.data.lib[key].library.filter(function(d){
                                return d.value == item.settings.pageid;
                            });
                            if (lib.length > 0) {
                                lib = lib[0];
                                var libitem = lib.items.filter(function(i){ return i.value == item.settings.elementid; });
                                if (libitem.length > 0) {
                                    items.push(item);
                                }
                            }
                        }
                    }
                }
            }
            /*
            var lib = that.data.lib.foresight.library.filter(function(l){ return l.value == item.settings.pageid; });
            if (lib.length > 0) {
                lib = lib[0];
                var libitem = lib.items.filter(function(i){ return i.value == item.settings.elementid; });
                if (libitem.length > 0) {
                    items.push(item);
                }
            }
            */
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
        element: function(elementid, options, params){
            that.data.dashboard.reload.element(elementid, options, params);
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
                margin: that.data.margin,
                editable: that.data.editable,
                pageid: that.data.page.pageId,
                items: that.data.items,
                lib: that.data.lib,
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