if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.Dashboard = function(options){
    var that = this._dashboard = {};
    that.data = {
        user: Asyst.Workspace.currentUser,
        page: Asyst.Workspace.currentPage,
        userdashboardid: null,
        items: [],
        library: [],
        grid_options: {
            buttons: [{ selector: '#button_add-widget', action: 'add' }, { selector: '#button_save-grid', action: 'save' }],
            tumbler: { selector: '#tumbler_edit-page' }
        },
        grid: null,
        grid_selector: '#widget-grid',
        library_pagename: null,
        library_title: null
    };
    that.data = $.extend(that.data, options);

    that.saveItems = function(items){
        that.data.items = items;
        Asyst.APIv2.Entity.save({
            dataId: that.data.userdashboardid,
            entityName: 'UserDashboard',
            data: {
                AccountId: that.data.user.Id,
                PageName: that.data.page.pageName,
                Items: JSON.stringify(that.data.items)
            },
            success: function(data){ console.log(data); },
            error: function(data){ console.log(data); }
        });
    };
    that.loadItems = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'UserDashboard',
            data: {
                AccountId: that.data.user.Id,
                PageName: that.data.page.pageName
            },
            success: function(data){
                if (data[0][0]) {
                    that.data.items = JSON.parse(data[0][0].Items);
                    that.data.userdashboardid = data[0][0].UserDashboardId;
                    if (typeof callback == 'function') { callback(); }
                } else {
                    that.loadDefaults(callback);
                }
            },
            error: function(data){ console.log(data); }
        });
    };
    that.loadDefaults = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'UserDashboard',
            data: {
                AccountId: -1,
                PageName: that.data.page.pageName
            },
            success: function(data){
                if (data[0][0]) {
                    that.data.items = JSON.parse(data[0][0].Items);
                }
                if (typeof callback == 'function') { callback(); }
            },
            error: function(data){ console.log(data); }
        });
    };
    that.loadLibrary = function(callback){
        Asyst.APIv2.DataSet.load({
            name: 'WidgetLibrary',
            data: {
                PageName: that.data.library_pagename
            },
            success: function(data){
                var items = [];
                if (data[0]) {
                    items = data[0];
                }
                that.data.library.push({
                    value: that.data.library_pagename,
                    text: that.data.library_title,
                    items: items
                });
                if (typeof callback == 'function') { callback(); }
            },
            error: function(data){ console.log(data); }
        });
    };

    that.renderButtons = function(){
        var $button_add = $([
            '<button class="button button_hidden" type="button" data-hidden="true" id="button_add-widget">',
                '<span class="icon icon_svg_plus"></span>',
                '<span class="button__text mobile mobile_hide">Добавить</span>',
                '<span class="button__anim"></span>',
            '</button>'
        ].join('')).button();
        var $button_save = $([
            '<button class="button button_hidden" type="button" data-hidden="true" id="button_save-grid">',
                '<span class="icon icon_svg_save"></span>',
                '<span class="button__text mobile mobile_hide">Сохранить</span>',
                '<span class="button__anim"></span>',
            '</button>',
        ].join('')).button();
        var $button_group = $('<span class="button-group header__column-item"></span>');
        $button_group.append(
            $button_add,
            $button_save
        );
    };
    that.renderTumbler = function(){
        var tumbler = $([
            '<span class="header__column-item tumbler" id="tumbler_edit-page">',
                '<span class="tumbler__box">',
                    '<div class="tumbler__sticker tumbler__sticker_position_left">',
                        '<div class="tumbler__sticker-label">Вкл</div>',
                    '</div>',
                    '<div class="tumbler__sticker tumbler__sticker_position_right">',
                        '<div class="tumbler__sticker-label">Выкл</div>',
                    '</div>',
                    '<button class="button" type="button" data-fc="button">',
                        '<span class="icon icon_svg_edit"></span>',
                        '<span class="button__anim"></span>',
                    '</button>',
                '</span>',
                '<input class="tumbler__input" type="checkbox" name="_tumbler" hidden/>',
            '</span>'
        ].join('')).tumbler();
    };
    that.renderGrid = function(){
        that.data.grid = $(that.data.grid_selector)
            .widget_grid($.extend({}, that.data.grid_options, {
                items: that.data.items,
                loader: Asyst.MetaElementLoader,
                library: that.data.library
            }))
            .on('add.fc.widget-grid', function(e, data){})
            .on('save.fc.widget-grid', function(e, data){
                that.saveItems(data);
            });
    };
    that.init = function(){
        $(function(){
            that.renderButtons();
            that.renderTumbler();
            that.loadItems(
                that.loadLibrary(
                    that.renderGrid
                )
            );
        })
    };
    that.init();
    return that;
};