if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.Settings = function(options){
    var that = this._settings = {};
    that.data = {
        containerid: 'container',
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage,
        settings: [],
        settingscenter: null
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        loader: $('<span class="spinner"></span>')
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
        that.data.settingscenter = new Settings({
            containerid: that.data.containerid,
            settings: that.data.settings,
            loader: Asyst.HtmlLoader,
            editable: false
        });
    };
    that.init();
    return that;
};