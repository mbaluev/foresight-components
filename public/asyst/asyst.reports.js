if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.Reports = function(options){
    var that = this._reports = {};
    that.data = {
        containerid: 'container',
        //user: Asyst.Workspace.currentUser,
        //page: Asyst.Workspace.currentPage,
        filters: [],
        reports: [],
        itemWidth: 3,
        itemHeight: 5,
        grid: null,
        items: [],
        x: 0,
        y: 0,
        reportingCategoryId: 0,
        favorite: false
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid),
        tumbler: $([
            '<span class="header__column-item tumbler">',
                '<span class="tumbler__box">',
                    '<div class="tumbler__sticker tumbler__sticker_position_left">',
                        '<div class="tumbler__sticker-label">Вкл</div>',
                    '</div>',
                    '<div class="tumbler__sticker tumbler__sticker_position_right">',
                        '<div class="tumbler__sticker-label">Выкл</div>',
                    '</div>',
                    '<button class="button" type="button" data-fc="button">',
                        '<span class="icon icon_svg_favorite"></span>',
                    '</button>',
                '</span>',
                '<input class="tumbler__input" type="checkbox" name="_tumbler" hidden/>',
            '</span>'
        ].join('')),
        input: $([
            '<span class="header__column-item input input__has-clear" data-width="200">',
                '<span class="input__box">',
                    '<span class="alertbox" data-fc="alertbox">',
                        '<span class="icon icon_svg_search"></span>',
                    '</span>',
                    '<input type="text" class="input__control">',
                    '<button class="button" type="button" data-fc="button">',
                        '<span class="icon icon_svg_close"></span>',
                    '</button>',
                '</span>',
            '</span>'
        ].join('')),
        radiogroup: $('<span class="header__column-item radio-group radio-group_type_buttons"></span>'),
        content: $([
            '<div class="fs-view">',
                '<div class="fs-view__header">',
                    '<div class="header header_second">',
                        '<div class="header__column" id="filter"></div>',
                        '<div class="header__column" id="tumbler"></div>',
                    '</div>',
                '</div>',
                '<div class="fs-view__main">',
                    '<div class="fs-view__middle fs-view__middle_full">',
                        '<div class="fs-view__middle-scroll">',
                            '<div class="fs-view__middle-inner">',
                                '<div id="widget-grid" class="widget-grid grid-stack" data-gs-animate="true"></div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('')),
        grid: null
    };
    that.render = function(){
        that.data._el.content.find('#filter').append(
            that.data._el.radiogroup,
            that.data._el.input
        );
        that.data._el.content.find('#tumbler').append(
            that.data._el.tumbler
        );
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.render_filters = function(){
        that.data._el.radiogroup.append($([
            '<label class="radio radio_type_button" data-fc="radio" data-checked="true">',
                '<button class="button button_toggable_radio" type="button" data-fc="button" data-checked="true">',
                    '<span class="button__text">Все</span>',
                '</button>',
                '<input class="radio__input" type="radio" name="radio-group-button" value="0" hidden/>',
            '</label>'
        ].join('')));
        that.data.filters.forEach(function(filter){
            that.data._el.radiogroup.append($([
                '<label class="radio radio_type_button" data-fc="radio">',
                    '<button class="button button_toggable_radio" type="button" data-fc="button">',
                        '<span class="button__text">' + filter.reportingCategoryName + '</span>',
                        '<span class="icon">',
                            '<span class="icon icon__circle" style="background-color: ' + filter.color + '"></span>',
                        '</span>',
                    '</button>',
                    '<input class="radio__input" type="radio" name="radio-group-button" value="' + filter.reportingCategoryId + '" hidden/>',
                '</label>'
            ].join('')));
        });
    };
    that.render_grid = function(){
        var widget_grid_options = {
            items: that.data.items,
            loader: null,
            library: null
        };
        that.data.grid = $('#widget-grid').widget_grid(widget_grid_options);
    };
    that.render_reports = function(){
        that.data.reports.forEach(function(report, i){
            report.visible = true;
            that.add_report(report);
            that.data.x += that.data.itemWidth;
            if (that.data.x >= 12) {
                that.data.x = 0;
                that.data.y += that.data.itemHeight;
            }
        });
        that.data.grid.widget_grid('view_mode');
    };
    that.remove_reports = function(){
        that.data.items = [];
        that.data.x = 0;
        that.data.y = 0;
        that.data.grid.widget_grid('destroy');
    };
    that.remove_report = function(report){
        report.visible = false;
        that.data.grid.widget_grid('removeWidget', report.reportingId);
        that.data.items = that.data.items.filter(function(d){ return d._id != report.reportingId; });
    };
    that.add_report = function(report){
        report.visible = true;
        var item = {
            x: that.data.x,
            y: that.data.y,
            width: that.data.itemWidth,
            height: that.data.itemHeight,
            settings: {
                id: report.reportingId,
                name: report.title,
                collapsed: false,
                color: report.color
            }
        };
        that.data.items.push(item);
        that.data.grid.widget_grid('addWidget', item);
    };
    that.update_report = function(report){
        that.data.grid.widget_grid('updateWidget',
            report.reportingId, that.data.x, that.data.y, that.data.itemWidth, that.data.itemHeight);
    };
    that.filter_reports = function(){
        that.data.x = 0;
        that.data.y = 0;
        that.data.reports.forEach(function(report){
            if ((+report.reportingCategoryId == +that.data.reportingCategoryId || +that.data.reportingCategoryId == 0) &&
                (that.data.favorite && report.repFavoriteId || !that.data.favorite)) {
                if (!report.visible) {
                    that.add_report(report);
                } else {
                    that.update_report(report);
                }
                that.data.x += that.data.itemWidth;
                if (that.data.x >= 12) {
                    that.data.x = 0;
                    that.data.y += that.data.itemHeight;
                }
            } else {
                if (report.visible) {
                    that.remove_report(report);
                }
            }
        });
        that.data.grid.widget_grid('view_mode');
    };
    that.bind = function(){
        that.data._el.radiogroup.find('[data-fc="radio"]').on('click', function(){
            that.data.reportingCategoryId = $(this).radio_group('value');
            that.filter_reports();
        });
        that.data._el.tumbler.on('on.fc.tumbler', function(){
            that.data.favorite = true;
            that.filter_reports();
        }).on('off.fc.tumbler', function(){
            that.data.favorite = false;
            that.filter_reports();
        });
    };
    that.init_components = function(){
        that.data._el.radiogroup.radio_group();
        that.data._el.input.input();
        that.data._el.tumbler.tumbler();
        that.data._el.content.find('#filter').css({
            'flex-wrap': 'wrap'
        });
        that.data._el.input.css({
            flex: '0 0 auto'
        });
    };
    that.init = function(){
        $(function(){
            that.render();
            that.render_filters();
            that.render_grid();
            that.render_reports();
            that.init_components();
            that.bind();
        })
    };
    that.init();
    return that;
};
Asyst.ReportLoader = function(options){
    var that = this._loader = {};
    that.data = {
        pagename: null,
        elementname: null,
        template: {},
        templateData: {},
        content: null,
        success: null,
        error: null
    };
    that.data = $.extend(that.data, options);
    that.loadTemplate = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'DashboardWidgetContent',
            data: {
                PageName: that.data.pagename,
                ElementName: that.data.elementname
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
    that.proccessTemplate = function(){
        return ProcessTemplate(that.data.template.Content, that.data.templateData, {});
    };
    that.buildContent = function(){
        var success = function(data) {
            that.data.templateData = data;
            that.data.content = that.proccessTemplate();
            if (typeof that.data.success == 'function') {
                that.data.success(that.data.content);
            }
        };
        Asyst.APIv2.DataSource.load({
            sourceType: 'page',
            sourceName: that.data.pagename,
            elementName: that.data.elementname,
            data: null,
            success: success,
            error: function(error, text) { ErrorHandler(Globa.ErrorDataListLoad.locale(), error + "<br>" + text); },
            async: true,
            isPicklist: false
        });
    };
    that.loadContent = function(){
        that.loadTemplate(
            that.buildContent
        );
    };
    return that;
};