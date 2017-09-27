if (typeof Asyst == typeof undefined) { Asyst = {}; }
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

    that.add = function(data, success, error){
    };
    that.open = function(data, success, error){
    };
    that.edit = function(data, success, error){
    };
    that.remove = function(data, success, error){
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
                add: function (data, success, error) {
                    that.add(data, success, error);
                },
                open: function (data, success, error) {
                    that.open(data, success, error);
                },
                edit: function (data, success, error) {
                    that.edit(data, success, error);
                },
                remove: function (data, success, error) {
                    that.remove(data, success, error);
                }
            });
        });
    };
    that.init();
    return that;
};