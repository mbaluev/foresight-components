if (typeof Asyst == typeof undefined) { Asyst = {}; }

Asyst.Reports = function(options){
    var that = this._reports = {};
    that.data = {
        containerid: 'container',
        //user: Asyst.Workspace.currentUser,
        //page: Asyst.Workspace.currentPage,
        filters: [],
        reports: [],
        itemWidth: 2,
        itemHeight: 5,
        grid: null,
        items: [],
        x: 0,
        y: 0,
        reportingCategoryId: 0,
        favorite: false,
        searchText: '',
        searchTimer: null
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
        grid: null,
        loader: $('<span class="spinner"></span>')
    };
    that.render = function(){
        that.data._el.content.find('#filter').append(
            that.data._el.radiogroup
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
                '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + filter.reportingCategoryName + '">',
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
        that.data._el.radiogroup.append(
            that.data._el.input
        );
    };
    that.render_grid = function(){
        var widget_grid_options = {
            items: that.data.items,
            loader: Asyst.ImageLoader
        };
        that.data.grid = $('#widget-grid').widget_grid(widget_grid_options);
    };
    that.render_reports = function(){
        that.data.reports.forEach(function(report, i){
            report.visible = true;
            report.collapsed = false;
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
        report.collapsed = $('#' + report.reportingId).data().collapsed;
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
                collapsed: report.collapsed,
                color: report.color,
                url: report.url,
                previewUrl: report.previewUrl
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
        that.loader_add();
        that.data.x = 0;
        that.data.y = 0;
        that.data.reports.forEach(function(report){
            if ((+report.reportingCategoryId == +that.data.reportingCategoryId || +that.data.reportingCategoryId == 0) &&
                (that.data.favorite && report.repFavoriteId || !that.data.favorite) &&
                (report.title.toLowerCase().includes(that.data.searchText.toLowerCase()))) {
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
        that.loader_remove();
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
        if (that.data.favorite) {
            that.data._el.tumbler.tumbler('check');
        }
        that.data._el.input.on('keyup', function(){
            clearTimeout(that.data.searchTimer);
            that.data.searchText = $(this).input('value');
            that.data.searchTimer = setTimeout(function(){
                that.filter_reports();
            }, 300);
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
        that.loader_add();
        $(function(){
            that.render();
            that.render_filters();
            that.render_grid();
            that.render_reports();
            that.init_components();
            that.bind();
            that.loader_remove();
        })
    };
    that.init();
    return that;
};

Asyst.ImageLoader = function(options){
    var that = this._loader = {};
    that.data = {
        data: null,
        target: null,
        success: null,
        error: null,
        content: null
    };
    that.data = $.extend(that.data, options);
    that.loadImage = function(){
        var obj = {
            spinner: $('<span class="spinner"></span>'),
            widget__image: $('<div class="widget__image"></div>'),
            preloader: new Image()
        };
        obj.preloader.onload = function() {
            obj.spinner.remove();
            obj.widget__image.css('background-image', 'url('+ that.data.data.previewUrl + ')');
            obj.widget__image.on('click', function(){
                console.log(that.data.data.url);
            });
            obj.widget__image.on('mouseover', function(){
                that.data.target.css({ cursor: 'pointer' });
            });
            that.data.target.find('.widget__body').removeClass('widget__body_align_center');
            that.data.target.find('.widget__body-data').addClass('widget__body-data_type_html');
            that.data.target.find('.widget__body-data').css({ padding: '10px 10px 20px' });
            that.data.target.find('.widget__body-data').append(obj.widget__image);
        };
        obj.preloader.onerror = function(){
            if (typeof that.data.error == 'function') {
                that.data.error('Нет данных');
            }
        };
        obj.preloader.src = that.data.data.previewUrl;
        return obj.spinner;
    };
    that.loadContent = function(){
        if (typeof that.data.success == 'function') {
            that.data.success(that.loadImage());
            that.data.target.find('.widget__body').addClass('widget__body_align_center');
            that.data.target.find('.widget__body-data').removeClass('widget__body-data_type_html');
        }
    };
    return that;
};