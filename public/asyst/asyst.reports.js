if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.Reports = function(options){
    var that = this._reports = {};
    that.data = {
        containerid: 'container',
        filters: [],
        reports: [],
        favorite: true,
        reportcenter: null,
        user: Asyst.Workspace.currentUser
    };
    that.data = $.extend(that.data, options);
    that.setFavorite = function(data){
        debugger;
        Asyst.API.Entity.save('ReportingFavorite', null, {
            Name: 'Избранный отчет',
            ReportingId: data.id,
            AccountId: that.data.user.Id
        }, function(data){
            //repFavoriteId = data.id
        });
    };
    that.removeFavorite = function(data){
        debugger;
        Asyst.API.Entity.remove('ReportingFavorite', data.repFavoriteId, function(){
            //repFavoriteId = null
        });
    };
    that.init = function(){
        that.data.reportcenter = new Reports({
            containerid: that.data.containerid,
            filters: that.data.filters,
            reports: that.data.reports,
            loader: Asyst.ImageLoader,
            defaults: { favorite: that.data.favorite },
            setFavorite: function(data){
                that.setFavorite(data);
            },
            removeFavorite: function(data){
                that.removeFavorite(data);
            }
        });
    };
    that.init();
    return that;
};