if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.Reports = function(options){
    var that = this._reports = {};
    that.data = {
        containerid: 'container',
        filters: [],
        reports: [],
        favorite: true,
        reportcenter: null
    };
    that.data = $.extend(that.data, options);
    that.init = function(){
        that.data.reportcenter = new Reports({
            containerid: that.data.containerid,
            filters: that.data.filters,
            reports: that.data.reports,
            loader: Asyst.ImageLoader,
            defaults: { favorite: that.data.favorite }
        });
    };
    that.init();
    return that;
};