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
                    that.data.template.id = 'Widget__' + (new Date()).valueOf();
                    if (that.data.template.Content) {
                        that.data.template.Content = that.data.template.Content.split(that.data.template.ElementName).join(that.data.template.id);
                        that.data.template.Content = that.data.template.Content.split('{WidgetName}').join(that.data.template.id);
                        that.data.template.Content = that.data.template.Content.split('{WidgetNameDiv}').join(that.data.template.id + 'Div');
                        that.data.template.Content = that.data.template.Content.split('{WidgetNameChart}').join(that.data.template.id + 'Chart');
                    }
                    Asyst.Workspace.currentPage.templates[that.data.template.id] = that.data.template.Content;
                    Asyst.Workspace.currentPage.TemplateData[that.data.template.id] = data;
                    if (typeof Asyst.Workspace.currentPage.Widgets == typeof undefined) {
                        Asyst.Workspace.currentPage.Widgets = {};
                    }
                    if (!Asyst.Workspace.currentPage.Widgets[that.data.template.id]){
                        Asyst.Workspace.currentPage.Widgets[that.data.template.id] = {};
                    }
                    Asyst.Workspace.currentPage.Widgets[that.data.template.id].IsDataAllowed = that.data.template.IsDataAllowed;
                    if(that.data.template.IsDataAllowed == 1) {
                        Asyst.Workspace.currentPage.Widgets[that.data.template.id].data = data;
                    } else {
                        Asyst.Workspace.currentPage.Widgets[that.data.template.id].data = [];
                    }

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