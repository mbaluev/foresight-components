Asyst.Dashboard = function(options){
    var that = this._dashboard = {};
    that.data = {
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage,
        userdashboardid: null,
        items: [],
        library: [],
        grid_options: {
            buttons: [{ selector: '#button_add-widget', action: 'add' }, { selector: '#button_save-grid', action: 'save' }],
            tumbler: { selector: '#tumbler_edit-page' }
        },
        grid: null,
        grid_selector: '#widget-grid'
    };
    that.data = $.extend(that.data, options);
    that.getItems = function(){
        return that.data.items;
    };
    that.setItems = function(items){
        that.data.items = items;
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
    that.saveItems = function(){
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
    that.loadLibrary = function(item, success){
        Asyst.APIv2.DataSet.load({
            name: 'WidgetLibrary',
            data: {
                PageName: item.pagename
            },
            success: function(data){
                var items = [];
                if (data[0]) {
                    items = data[0];
                }
                that.data.library.push({
                    value: item.pagename,
                    text: item.title,
                    items: items
                });
                if (typeof success == 'function') { success(); }
            },
            error: function(data){ console.log(data); }
        });
    };
    that.loadGrid = function(){
        that.loadLibrary({ pagename: 'WidgetLibrary', title: 'Библиотека виджетов' }, that.renderGrid);
    };
    that.renderGrid = function(){
        that.data.grid = $(that.data.grid_selector)
            .widget_grid(
                $.extend({}, that.data.grid_options,
                    {
                        items: that.data.items,
                        loader: Asyst.MetaElementLoader,
                        library: that.data.library
                    }
                )
            )
            .on('add.fc.widget-grid', function(e, data){})
            .on('save.fc.widget-grid', function(e, data){
                that.setItems(data);
                that.saveItems();
            });
    };
    that.init = function(){
        $(function(){
            that.loadItems(function(){
                that.loadGrid();
            });
        })
    };
    that.init();
    return that;
};

Asyst.MetaElementLoader = function(options){
    var that = this._loader = {};
    that.data = {
        pagename: null,
        elementname: null,
        template: {},
        templateData: {},
        content: null,
        success: null,
        error: null
    };
    that.data = $.extend(that.data, options);
    that.loadTemplate = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'DashboardWidgetContent',
            data: {
                PageName: that.data.pagename,
                ElementName: that.data.elementname
            },
            success: function(data){
                if (data[0][0]) {
                    that.data.template = data[0][0];
                    if (typeof callback == 'function') { callback(); }
                } else {
                    if (typeof that.data.error == 'function') { that.data.error('Нет данных'); }
                }
            },
            error: function(data){
                if (typeof that.data.error == 'function') { that.data.error('Ошибка загрузки'); }
            }
        });
    };
    that.proccessTemplate = function(){
        return ProcessTemplate(that.data.template.Content, that.data.templateData, {});
    };
    that.buildContent = function(){
        var success = function(data) {
            that.data.templateData = data;
            that.data.content = that.proccessTemplate();
            if (typeof that.data.success == 'function') {
                that.data.success(that.data.content);
            }
        };
        Asyst.APIv2.DataSource.load({
            sourceType: 'page',
            sourceName: that.data.pagename,
            elementName: that.data.elementname,
            data: null,
            success: success,
            error: function(error, text) { ErrorHandler(Globa.ErrorDataListLoad.locale(), error + "<br>" + text); },
            async: true,
            isPicklist: false
        });
    };
    that.loadContent = function(){
        that.loadTemplate(
            that.buildContent
        );
    };
    return that;
};