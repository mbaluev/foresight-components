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