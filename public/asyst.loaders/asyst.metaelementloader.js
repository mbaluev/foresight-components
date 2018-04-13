if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.MetaElementLoader = {
    obj: function(options){
        var that = this._loader = {};
        that.data = {
            data: null,
            success: null,
            error: null,
            content: null,
            template: {},
            templateData: {}
        };
        that.data = $.extend(that.data, options);
        that.extend = function(options){
            that.data = $.extend(true, {}, that.data, options);
        };
        that.loadTemplate = function(callback){
            Asyst.APIv2.DataSet.load({
                name: 'DashboardWidgetContent',
                data: {
                    PageId: that.data.data.pageid,
                    PageElementId: that.data.data.elementid
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
        that.buildContent = function(){
            Asyst.APIv2.DataSource.load({
                sourceType: 'page',
                sourceName: that.data.template.PageName,
                elementName: that.data.template.ElementName,
                data: that.data.data.params,
                isPicklist: false,
                async: true,
                error: function(error, text) { ErrorHandler(Globa.ErrorDataListLoad.locale(), error + "<br>" + text); },
                success: function(data) {
                    that.data.templateData = data;
                    that.data.content = that.proccessTemplate();
                    if (typeof that.data.success == 'function') {
                        that.data.success(that.data.content);
                    }
                }
            });
        };
        that.proccessTemplate = function(){
            return ProcessTemplate(that.data.template.Content, that.data.templateData, {});
        };
        that.loadContent = function(){
            that.loadTemplate(
                that.buildContent
            );
        };
        return that;
    }
};