if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.Reports = function(options){
    var that = this._reports = {};
    that.data = {
        containerid: 'container',
        filters: [],
        reports: [],
        favorite: true,
        reportcenter: null,
        user: Asyst.Workspace.currentUser,
        userlang: 'RU',
        dataset: {
            name: 'ReportCenter'
        }
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

    that.load_data = function(callback){
        Asyst.APIv2.DataSet.load({
            name: that.data.dataset.name,
            data: {
                UserAccount: that.data.user.Id,
                UserLang: that.data.userlang
            },
            success: function(data){
                if (data) {
                    that.data.filters = data[0];
                    that.data.reports = data[1];
                    if (typeof callback == 'function') {
                        callback();
                    }
                }
            },
            error: function(data){
                console.log(data);
                that.loader_remove();
            }
        });
    };

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
        that.loader_add();
        that.load_data(function(){
            that.loader_remove();
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
        });
    };
    that.init();
    return that;
};