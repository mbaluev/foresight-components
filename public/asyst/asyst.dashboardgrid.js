if (typeof Asyst == typeof undefined) { Asyst = {}; }
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
        page: Asyst.Workspace.currentPage,
        tumblerContainerSelector: null
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
                    pageid: library[0].value,
                    elementid: li.value,
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
                lib: {
                    settings: {
                        library: that.data.library,
                        loader: $.extend(Asyst.ContentLoader, { contents: that.data.contents })
                    }
                },
                page: that.data.page,
                tumblerContainerSelector: that.data.tumblerContainerSelector
            });
        });
    };
    that.init();
    return that;
};
Asyst.DashboardGrid = function(options){
    var that = this._dashboard_grid = {};
    that.data = {
        containerid: 'container',
        editableDashboards: [],
        editableText: 'Редактируемые',
        editableColor: '#aaa',
        allowedDashboards: [],
        allowedText: 'Только просмотр',
        allowedColor: null,
        add: null,
        open: null,
        edit: null,
        remove: null,
        dashboardgrid: null,
        user: Asyst.Workspace.currentUser
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
    that.loadData = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'dbGetMyDashboardList',
            data: {
                AccountId: that.data.user.Id
            },
            success: function(data){
                that.data.allowedDashboards = data[0];
                that.data.editableDashboards = data[1];
                if (typeof callback == 'function') { callback(); }
            },
            error: function(data){ console.log(data); }
        });
    };

    that.init = function(){
        that.loader_add();
        that.loadData(function() {
            that.loader_remove();
            that.data.dashboardgrid = new DashboardGrid({
                containerid: that.data.containerid,
                editableDashboards: that.data.editableDashboards,
                editableText: that.data.editableText,
                editableColor: that.data.editableColor,
                allowedDashboards: that.data.allowedDashboards,
                allowedText: that.data.allowedText,
                allowedColor: that.data.allowedColor,
                loader: Asyst.TitleLoader,
                add: that.data.add,
                open: that.data.open,
                edit: that.data.edit,
                remove: that.data.remove
            });
        });
    };
    that.init();
    return that;
};