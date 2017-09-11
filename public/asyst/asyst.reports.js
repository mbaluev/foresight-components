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
    that.setFavorite = function(data, success, error){
        Asyst.API.Entity.save('ReportingFavorite', null, {
            Name: 'Избранный отчет',
            ReportingId: data.id,
            AccountId: that.data.user.Id
        }, function(successData){
            if (success) { success(successData); }
        }, function(errorData){
            if (error) { error(errorData); }
        });
    };
    that.removeFavorite = function(data, success, error){
        Asyst.API.Entity.remove('ReportingFavorite', data.repFavoriteId, function(successData){
            if (success) { success(successData); }
        }, function(errorData){
            if (error) { error(errorData); }
        });
    };
    that.init = function(){
        that.data.reportcenter = new Reports({
            containerid: that.data.containerid,
            filters: that.data.filters,
            reports: that.data.reports,
            loader: Asyst.ImageLoader,
            defaults: { favorite: that.data.favorite },
            setFavorite: function(data, success, error){
                that.setFavorite(data, success, error);
            },
            removeFavorite: function(data, success, error){
                that.removeFavorite(data, success, error);
            }
        });
    };
    that.init();
    return that;
};