var DashboardGrid = function(options){
    var that = this._dashboard_grid = {};
    that.data = {
        allowedDashboards: [],
        allowedText: 'Только просмотр',
        allowedColor: null,
        editableDashboards: [],
        editableText: 'Редактируемые',
        editableColor: '#aaa',
        items: [],
        loader: null,
        defaults: {
            itemWidth: 2,
            itemHeight: 5,
            x: 0,
            y: 0,
            editable: -1
        },
        add: null,
        open: null,
        edit: null,
        remove: null,
        search: {
            text: '',
            timer: null
        },
        grid: null
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        input: $([
            '<span class="input input__has-clear" data-width="200">',
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
        radiogroup: $('<span class="radio-group radio-group_type_buttons"></span>'),
        button_add: $([
            '<button class="button button_hidden" type="button">',
            '<span class="icon icon_svg_plus"></span>',
            '<span class="button__text mobile mobile_hide">Создать дашборд</span>',
            '</button>'
        ].join('')),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column" id="filter"></div>',
            '<div class="card__header-column" id="actions"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll">',
            '<div id="widget-grid" class="widget-grid grid-stack" data-gs-animate="true"></div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };

    that.render = function(){
        that.data._el.content.find('#filter').append(
            that.data._el.radiogroup
        );
        that.data._el.content.find('#actions').append(
            that.data._el.button_add
        );
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.render_filters = function(){
        that.data._el.radiogroup.append(
            $([
                '<label class="radio radio_type_button" data-fc="radio" data-checked="true">',
                '<button class="button button_toggable_radio" type="button" data-fc="button" data-checked="true">',
                '<span class="button__text">Все</span>',
                '</button>',
                '<input class="radio__input" type="radio" name="radio-group-button" value="-1" hidden/>',
                '</label>'
            ].join('')),
            $([
                '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + that.data.allowedText + '">',
                '<button class="button button_toggable_radio" type="button" data-fc="button">',
                '<span class="button__text">' + that.data.allowedText + '</span>',
                '<span class="icon">',
                '<span class="icon icon__circle" ' + (that.data.allowedColor ? 'style="background-color: ' + that.data.allowedColor + '"' : '') + '></span>',
                '</span>',
                '</button>',
                '<input class="radio__input" type="radio" name="radio-group-button" value="0" hidden/>',
                '</label>'
            ].join('')),
            $([
                '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + that.data.editableText + '">',
                '<button class="button button_toggable_radio" type="button" data-fc="button">',
                '<span class="button__text">' + that.data.editableText + '</span>',
                '<span class="icon">',
                '<span class="icon icon__circle" ' + (that.data.editableColor ? 'style="background-color: ' + that.data.editableColor + '"' : '') + '></span>',
                '</span>',
                '</button>',
                '<input class="radio__input" type="radio" name="radio-group-button" value="1" hidden/>',
                '</label>'
            ].join(''))
        );
        that.data._el.radiogroup.append(
            that.data._el.input
        );
    };
    that.render_grid = function(){
        var widget_grid_options = {
            items: that.data.items,
            loader: that.data.loader
        };
        that.data.grid = $('#widget-grid').widget_grid(widget_grid_options);
    };
    that.render_dbs = function(){
        that.data.allowedDashboards.forEach(function(db, i){
            db.visible = true;
            db.collapsed = false;
            db.editable = 0;
            db.color = that.data.allowedColor;
            that.add_db(db);
            that.data.defaults.x += that.data.defaults.itemWidth;
            if (that.data.defaults.x >= 12) {
                that.data.defaults.x = 0;
                that.data.defaults.y += that.data.defaults.itemHeight;
            }
        });
        that.data.editableDashboards.forEach(function(db, i){
            db.visible = true;
            db.collapsed = false;
            db.editable = 1;
            db.color = that.data.editableColor;
            that.add_db(db);
            that.data.defaults.x += that.data.defaults.itemWidth;
            if (that.data.defaults.x >= 12) {
                that.data.defaults.x = 0;
                that.data.defaults.y += that.data.defaults.itemHeight;
            }
        });
        that.data.grid.widget_grid('view_mode');
    };

    that.remove_dbs = function(){
        that.data.items = [];
        that.data.defaults.x = 0;
        that.data.defaults.y = 0;
        that.data.grid.widget_grid('clear');
    };
    that.remove_db = function(db){
        db.visible = false;
        db.collapsed = $('#' + db.PageId).data().collapsed;
        that.data.grid.widget_grid('remove_widget', db.PageId);
        that.data.items = that.data.items.filter(function(d){ return d._id != db.PageId; });
    };
    that.add_db = function(db){
        db.visible = true;
        var buttons = [{
            icon: 'icon_svg_dashboard',
            mode: 'view',
            click: function(widget, data){
                if (that.data.open && typeof that.data.open == 'function') {
                    that.data.open(
                        data,
                        function(successData){},
                        function(errorData){}
                    );
                }
            }
        }];
        if (db.editable == 1) {
            buttons.push({
                icon: 'icon_svg_edit',
                mode: 'view',
                click: function(widget, data){
                    if (that.data.edit && typeof that.data.edit == 'function') {
                        that.data.edit(
                            data,
                            function(successData){},
                            function(errorData){}
                        );
                    }
                }
            });
            buttons.push({
                icon: 'icon_svg_trash',
                mode: 'view',
                click: function(widget, data){
                    if (that.data.remove && typeof that.data.edit == 'function') {
                        that.data.remove(
                            data,
                            function(successData){
                                that.data.editableDashboards = that.data.editableDashboards.filter(function(d){
                                    return d.PageId != data.id;
                                });
                                that.remove_db(db);
                                that.filter_dbs();
                            },
                            function(errorData){}
                        );
                    }
                }
            });
        }
        var item = {
            x: that.data.defaults.x,
            y: that.data.defaults.y,
            width: that.data.defaults.itemWidth,
            height: that.data.defaults.itemHeight,
            settings: {
                id: db.PageId,
                pagename: db.name,
                collapsed: db.collapsed,
                color: db.color,
                descriptions: db.Description,
                title: db.Title,
                editable: db.editable,
                buttons: buttons
            }
        };
        that.data.items.push(item);
        that.data.grid.widget_grid('add_widget', item);
    };
    that.update_db = function(db){
        that.data.grid.widget_grid(
            'update_widget',
            db.PageId,
            that.data.defaults.x,
            that.data.defaults.y,
            that.data.defaults.itemWidth,
            that.data.defaults.itemHeight
        );
    };
    that.filter_dbs = function(){
        that.loader_add();
        setTimeout(function(){
            that.data.defaults.x = 0;
            that.data.defaults.y = 0;
            that.data.allowedDashboards.forEach(function(db){
                db.editable = 0;
                db.color = that.data.allowedColor;
                if ((+db.editable == +that.data.defaults.editable || +that.data.defaults.editable == -1) &&
                    (db.Title.toLowerCase().includes(that.data.search.text.toLowerCase()))) {
                    if (!db.visible) {
                        that.add_db(db);
                    } else {
                        that.update_db(db);
                    }
                    that.data.defaults.x += that.data.defaults.itemWidth;
                    if (that.data.defaults.x >= 12) {
                        that.data.defaults.x = 0;
                        that.data.defaults.y += that.data.defaults.itemHeight;
                    }
                } else {
                    if (db.visible) {
                        that.remove_db(db);
                    }
                }
            });
            that.data.editableDashboards.forEach(function(db){
                db.editable = 1;
                db.color = that.data.editableColor;
                if ((+db.editable == +that.data.defaults.editable || +that.data.defaults.editable == -1) &&
                    (db.Title.toLowerCase().includes(that.data.search.text.toLowerCase()))) {
                    if (!db.visible) {
                        that.add_db(db);
                    } else {
                        that.update_db(db);
                    }
                    that.data.defaults.x += that.data.defaults.itemWidth;
                    if (that.data.defaults.x >= 12) {
                        that.data.defaults.x = 0;
                        that.data.defaults.y += that.data.defaults.itemHeight;
                    }
                } else {
                    if (db.visible) {
                        that.remove_db(db);
                    }
                }
            });
            that.data.grid.widget_grid('view_mode');
            that.loader_remove();
        }, 100);
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.radiogroup.find('[data-fc="radio"]').on('click', function(){
            that.data.defaults.editable = $(this).radio_group('value');
            that.filter_dbs();
        });
        that.data._el.input.on('keyup', function(){
            clearTimeout(that.data.search.timer);
            that.data.search.text = $(this).input('value');
            that.data.search.timer = setTimeout(function(){
                that.filter_dbs();
            }, 300);
        });
        that.data._el.button_add.on('click', function(){
            if (that.data.add && typeof that.data.add == 'function') {
                that.data.add(
                    function(successData){
                        if (successData.editable == 1) {
                            successData.color = that.data.editableColor;
                            that.data.editableDashboards.push(successData);
                        } else if (successData.editable == 0) {
                            successData.color = that.data.allowedColor;
                            that.data.allowedDashboards.push(successData);
                        }
                        that.add_db(successData);
                    },
                    function(errorData){}
                );
            }
        });
    };

    that.init_components = function(){
        that.data._el.radiogroup.radio_group();
        that.data._el.button_add.button();
        that.data._el.input.input();
        that.data._el.input.css({
            flex: '0 0 auto'
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.render_filters();
            that.render_grid();
            that.render_dbs();
            that.init_components();
            that.bind();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};