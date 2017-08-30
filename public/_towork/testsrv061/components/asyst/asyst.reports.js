if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.Reports = function(options){
    var that = this._reports = {};
    that.data = {
        containerid: 'container',
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage,
        filters: [],
        reports: [],
        favorite: true,
        reportcenter: null
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
        that.data.reportcenter = new Reports({
            containerid: that.data.containerid,
            filters: that.data.filters,
            reports: that.data.reports,
            loader: Asyst.ImageLoader,
            defaults: {
                favorite: that.data.favorite
            }
        });
        /*
        that.loadFilters(function(){
            that.loadReports(function(){
                that.loader_remove();
                that.data.reportcenter = new Reports({
                    containerid: that.data.containerid,
                    filters: that.data.filters,
                    reports: that.data.reports,
                    loader: Asyst.ImageLoader,
                    defaults: {
                        favorite: that.data.favorite
                    }
                });
            });
        });
        */
    };
    that.init();
    return that;
};