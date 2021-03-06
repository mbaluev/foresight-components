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
                loadForm: function(container, widget, data, modal_settings, selected, selects, callback){
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
                saveForm: function(widget, data, modal_settings, selected, selects, callback){
                    if (typeof safeSave == 'function') {
                        safeSave({
                            success: function(){
                                if (selected.widget.value == 'new'){
                                    that.loadLibrary(function(){
                                        // update widget lib
                                        data.lib = that.data.lib;

                                        // update select
                                        var items = [];
                                        for (key in data.lib) {
                                            if (data.lib[key]) {
                                                if (data.lib[key].library) {
                                                    data.lib[key].library.forEach(function(item){
                                                        if (item.value == Asyst.Workspace.currentForm.Data.PageId) {
                                                            items = item.items;
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                        selected.library.items = items;
                                        selects.widget.select('update', items);
                                        selects.widget.select('check', Asyst.Workspace.currentForm.Data.PageElementId);

                                        /*
                                        $.extend(widget.data(), {
                                            lib: data.lib,
                                            pageid: Asyst.Workspace.currentForm.Data.PageId,
                                            elementid: Asyst.Workspace.currentForm.Data.PageElementId
                                        });
                                        */
                                        widget.widget('set_content');
                                        // update widget
                                        that.reload.widget_(widget, {
                                            lib: data.lib,
                                            pageid: Asyst.Workspace.currentForm.Data.PageId,
                                            elementid: Asyst.Workspace.currentForm.Data.PageElementId
                                        }, null, true);
                                        that.reload.widgets({ lib: that.data.lib }, null, false);

                                        if (typeof callback == 'function') { callback(); }
                                    });
                                } else {
                                    widget.widget('set_content');
                                    if (typeof callback == 'function') { callback(); }
                                }
                            }
                        });
                    }
                },
                closeForm: function(widget, data, modal_settings, selected, selects, callback){
                    Asyst.Workspace.removeCurrentForm();
                    if (typeof callback == 'function') { callback(); }
                }
            }
        },
        single: false,
        margin: true,
        editable: true,
        asystDashboard: null,
        accountSettings: {
            id: -1,
            list: [],
            saved: []
        },
        user: Asyst.Workspace.currentUser,
        pageId: Asyst.Workspace.currentPage.pageId,
        headerExtraControlsRenderer: null,
        tumblerContainerSelector: null,
        params: null,
        collapsed_widget_height: 1,
        headerClass: null
    };
    that.data = $.extend(true, that.data, options);
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
                    console.log('no data');
                }
            },
            error: function(data){}
        });
    };
    that.loadAccountList = function(callback){
        Asyst.APIv2.View.load({
            viewName: 'group',
            success: function(data){
                if (data.data) {
                    var list = [{
                        value: -1,
                        text: 'Общий',
                        EntityId: null,
                        EntityName: null
                    }];
                    data.data.map(function(d){
                        list.push({
                            value: d.GroupId,
                            text: d.Name,
                            EntityId: data.EntityId,
                            EntityName: data.EntityName
                        });
                    });
                    if (typeof callback == 'function') {
                        callback(list);
                    }
                }
            }
        });
    };
    that.loadAccountSaved = function(callback){
        var list = [{
            value: -1,
            text: 'Общий',
            EntityId: null,
            EntityName: null
        }];
        if (typeof callback == 'function') {
            callback(list);
        }
    };
    that.reload = {
        dashboard: function(options, params){
            that.data.asystDashboard.reload.dashboard(options, params);
        },
        widgets: function(options, params, reload){
            that.data.asystDashboard.reload.widgets(options, params, reload);
        },
        widget: function(id, options, params, reload){
            that.data.asystDashboard.reload.widget(id, options, params, reload);
        },
        widget_: function(widget, options, params, reload){
            that.data.asystDashboard.reload.widget_(widget, options, params, reload);
        },
        element: function(elementid, options, params, reload){
            that.data.asystDashboard.reload.element(elementid, options, params, reload);
        },
        elementByName: function(elementname, options, params, reload){
            that.data.asystDashboard.reload.elementByName(elementname, options, params, reload);
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
                    user: that.data.user,
                    pageId: that.data.pageId,
                    accountSettings: that.data.accountSettings,
                    headerExtraControlsRenderer: that.data.headerExtraControlsRenderer,
                    tumblerContainerSelector: that.data.tumblerContainerSelector,
                    params: that.data.params,
                    collapsed_widget_height: that.data.collapsed_widget_height,
                    headerClass: that.data.headerClass
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
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage,
        items: [],
        userDashboardId: null,
        dashboard: null,
        headerExtraControlsRenderer: null,
        tumblerContainerSelector: null,
        params: null,
        accountSettings: {
            id: -1,
            list: [],
            saved: []
        },
        collapsed_widget_height: 1,
        headerClass: null
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
    that.saveItems = function(items, accountid, callback){
        that.data.items = items;
        Asyst.APIv2.Entity.save({
            dataId: that.data.userDashboardId,
            entityName: 'UserDashboard',
            data: {
                AccountId: accountid,
                PageObjectId: that.data.pageId,
                Items: JSON.stringify(that.data.items)
            },
            success: function(data){
                that.data.userDashboardId = data.id;
                if (typeof callback == 'function') { callback(); }
            },
            error: function(data){}
        });
    };
    that.loadItems = function(accountid, callback){
        Asyst.APIv2.DataSet.load({
            name: 'UserDashboard',
            data: {
                AccountId: accountid,
                PageObjectId: that.data.pageId
            },
            success: function(data){
                if (data[0][0]) {
                    that.data.items = JSON.parse(data[0][0].Items);
                    that.check_items();
                    that.data.userDashboardId = data[0][0].UserDashboardId;
                    if (typeof callback == 'function') { callback(); }
                } else {
                    that.loadDefaults(callback);
                }
            },
            error: function(data){}
        });
    };
    that.loadDefaults = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'UserDashboard',
            data: {
                AccountId: -1,
                PageObjectId: that.data.pageId
            },
            success: function(data){
                if (data[0][0]) {
                    that.data.items = JSON.parse(data[0][0].Items);
                    that.check_items();
                    if (that.data.admin) {
                        that.data.userDashboardId = data[0][0].UserDashboardId;
                    }
                }
                if (typeof callback == 'function') { callback(); }
            },
            error: function(data){}
        });
    };
    that.loadUserDashboardId = function(accountid, callback){
        Asyst.APIv2.DataSet.load({
            name: 'UserDashboard',
            data: {
                AccountId: accountid,
                PageObjectId: that.data.pageId
            },
            success: function(data){
                if (data[0][0]) {
                    if (data[0][0].AccountId == accountid) {
                        that.data.userDashboardId = data[0][0].UserDashboardId;
                    } else {
                        that.data.userDashboardId = null;
                    }
                } else {
                    that.data.userDashboardId = null;
                }
                if (typeof callback == 'function') { callback(); }
            },
            error: function(data){}
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
        widgets: function(options, params, reload){
            that.data.dashboard.reload.widgets(options, params, reload);
        },
        widget: function(id, options, params, reload){
            that.data.dashboard.reload.widget(id, options, params, reload);
        },
        widget_: function(widget, options, params, reload){
            that.data.dashboard.reload.widget_(widget, options, params, reload);
        },
        element: function(elementid, options, params, reload){
            that.data.dashboard.reload.element(elementid, options, params, reload);
        },
        elementByName: function(elementname, options, params, reload){
            that.data.dashboard.reload.elementByName(elementname, options, params, reload);
        },
        title: function(title){
            that.data.dashboard.reload.title(title);
        },
        name: function(name){
            that.data.dashboard.reload.name(name);
        }
    };
    that.initAccountSettings = function(){
        if (!that.data.user.IsFunctionalAdministrator) {
            that.data.accountSettings.id = that.data.user.Id;
        } else {
            /*
            // временно закоментим
            that.data.accountSettings.list.push({
                value: that.data.user.Id,
                text: that.data.user.Name
            });
            */
        }
        // load accountSettins.saved
        // надо делать

        // load accountSettins.list
        // надо делать
    };
    that.init = function(){
        that.loader_add();
        that.initAccountSettings();
        that.loadItems(that.data.accountSettings.id, function(){
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
                admin: that.data.user.IsFunctionalAdministrator,
                pageid: that.data.pageId,
                items: that.data.items,
                lib: that.data.lib,
                save: function(items, accountid, option){
                    that.loadUserDashboardId(accountid, function(){
                        that.saveItems(items, accountid, function(){
                            that.data.dashboard.update_select_load(option);
                        });
                    });
                },
                load: function(accountid){
                    that.loadItems(accountid, function(){
                        that.data.dashboard.update_grid(that.data.items);
                    });
                },
                account: that.data.accountSettings,
                headerExtraControlsRenderer: that.data.headerExtraControlsRenderer,
                tumblerContainerSelector: that.data.tumblerContainerSelector,
                params: that.data.params,
                collapsed_widget_height: that.data.collapsed_widget_height,
                headerClass: that.data.headerClass
            });
        });
    };
    that.init();
    return that;
};
