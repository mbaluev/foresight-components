var GridView = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        header: {
            views: [],
            reload: null,
            settings: [],
            search: null
        },
        render: function(){}
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        select_view: $('<select class="select" data-fc="select"></select>'),
        button_reload: $([
            '<button class="button" data-fc="button" style="width: auto;">',
            '<span class="icon icon_svg_refresh"></span>',
            '</button>'
        ].join('')),
        button_settings: $([
            '<button class="button" data-fc="button" data-toggle="popup" style="width: auto;">',
            '<span class="icon icon_svg_settings"></span>',
            '<span class="icon icon_svg_down icon_animate"></span>',
            '</button>'
        ].join('')),
        popup_settings: $([
            '<div class="popup popup_animation" data-position="bottom left" data-width="auto" style="width: auto; left: 524px; top: 50px;">',
            '<ul class="popup__list"></ul>',
            '</div>'
        ].join('')),
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
                '<div class="card__header">',
                    '<div class="card__header-row">',
                        '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
                        '<div class="card__header-column" id="grid__actions"></div>',
                    '</div>',
                '</div>',
                '<div class="card__main">',
                    '<div class="card__middle">',
                        '<div class="card__middle-scroll" id="grid__container"></div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.content
        );
        that.render_container();
        that.render_title();
        that.render_views();
        that.render_reload();
        that.render_settings();
        that.render_settings_popup();
        that.render_search();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.select_view.append(
                    $('<option value="' + view.value + '" ' + (view.selected ? 'selected' : '') + '>' + view.name + '</option>')
                );
            });
            that.data._el.content.find('#grid__view').append(
                that.data._el.select_view
            );
            that.data._el.select_view.on('change', function(){
                var value = $(this).val();
                var view = that.data.header.views.filter(function(v){ return v.value == value; });
                if (view.length > 0) {
                    view = view[0];
                    if (typeof(view.onclick) == 'function') {
                        view.onclick();
                    }
                }
            })
        }
    };
    that.render_reload = function(){
        if (that.data.header.reload) {
            if (typeof that.data.header.reload.onclick == 'function') {
                that.data._el.button_reload.on('click',
                    that.data.header.reload.onclick);
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.button_reload
                );
            }
        }
    };
    that.render_settings = function(){
        if (that.data.header.settings.length > 0) {
            that.data._el.content.find('#grid__actions').append(
                that.data._el.button_settings,
                that.data._el.popup_settings
            );
        }
    };
    that.render_settings_popup = function(){
        that.data._el.popup_settings.find('.popup__list').empty();
        that.data.header.settings.forEach(function(item){
            var $popup__list_item = $([
                '<li class="popup__list-item">',
                '<span class="popup__link">',
                (item.icon ? '<span class="icon ' + item.icon + '"></span>' : ''),
                '<span class="popup__text">' + item.name + '</span>',
                '</span>',
                '</li>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $popup__list_item.on('click', item.onclick);
            }
            that.data._el.popup_settings.find('.popup__list').append($popup__list_item);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.init_components = function(){
        that.data._el.select_view.select({
            width: '200',
            popup_width: 'auto',
            mode: 'radio',
            autoclose: true,
            placeholder: 'Представление'
        });
        that.data._el.button_reload.button();
        that.data._el.button_settings.button();
        that.data._el.popup_settings.popup({
            source: that.data._el.button_settings,
            width: 'auto'
        });
        that.data._el.input_search.input();
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
var GridView2 = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        header: {
            views: [],
            reload: null,
            settings: [],
            search: null
        },
        render: function(){}
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        radio_group: $('<span class="radio-group radio-group_type_buttons"></span>'),
        buttons: [],
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
            '<div class="card__header-column" id="grid__actions"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="grid__container"></div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.content
        );
        that.render_container();
        that.render_title();
        that.render_views();
        that.render_search();
        that.render_buttons();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.radio_group.append(
                    $([
                        '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + view.name + '" ' + (view.selected ? 'data-checked="true"' : '') + '>',
                            '<button class="button button_toggable_radio" type="button" data-fc="button">',
                                '<span class="button__text">' + view.name + '</span>',
                            '</button>',
                            '<input class="radio__input" type="radio" name="radio-group-button" value="' + view.value + '" hidden="">',
                        '</label>'
                    ].join(''))
                );
            });
            that.data._el.content.find('#grid__view').append(
                that.data._el.radio_group
            );
        }
    };
    that.render_buttons = function(){
        that.data.header.settings.forEach(function(item){
            var $button = $([
                '<button class="button" type="button" data-fc="button">',
                '<span class="icon ' + item.icon + '"></span>',
                '</button>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $button.on('click', item.onclick);
            }
            that.data._el.content.find('#grid__actions').append($button);
            that.data._el.buttons.push($button);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.radio_group.find('[data-fc="radio"]').on('click', function(){
            var value = $(this).radio_group('value');
            console.log(value);
            var view = that.data.header.views.filter(function(v){ return v.value == value; });
            if (view.length > 0) {
                view = view[0];
                if (typeof(view.onclick) == 'function') {
                    view.onclick();
                }
            }
        });
    };

    that.init_components = function(){
        that.data._el.radio_group.radio_group();
        that.data._el.input_search.input();
        that.data._el.buttons.map(function($button){
            $button.button();
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            that.bind();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
var GridView3 = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        header: {
            views: [],
            reload: null,
            settings: [],
            search: null
        },
        render: function(){},
        loading: false
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        button_toggle_left: $([
            '<button class="button" type="button" data-fc="button" data-toggle="left">',
            '<span class="icon icon_svg_double_right"></span>',
            '</button>',
        ].join('')),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        menu__list: $('<ul class="menu__list"></ul>'),
        buttons: [],
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
            '<div class="card__header-column" id="grid__actions"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
                '<div class="card__left">',
                '<div class="menu menu_color_light" data-fc="menu"> ',
                '</div>',
                '</div>',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="grid__container"></div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.content
        );
        that.render_container();
        that.render_title();
        that.render_views();
        that.render_search();
        that.render_buttons();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.button_toggle_left,
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.menu__list.append(
                    $([
                        '<li class="menu__item">',
                        '<a class="menu__item-link ' + (view.selected ? 'menu__item-link_selected' : '') + ' link" data-value="' + view.value + '">',
                        '<span class="menu__item-link-content">',
                        '<span class="menu__icon icon icon_svg_list"></span>',
                        '<span class="menu__item-text">' + view.name + '</span>',
                        (view.count ? '<span class="menu__item-text">' + view.count + '</span>' : ''),
                        '</span>',
                        '</a>',
                        '</li>'
                    ].join(''))
                );
            });
            that.data._el.content.find('[data-fc="menu"]').append(
                that.data._el.menu__list
            );
        }
    };
    that.render_buttons = function(){
        that.data.header.settings.forEach(function(item){
            var $button = $([
                '<button class="button" type="button" data-fc="button" data-tooltip="' + item.name + '">',
                '<span class="icon ' + item.icon + '"></span>',
                '</button>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $button.on('click', item.onclick);
            }
            that.data._el.content.find('#grid__actions').append($button);
            that.data._el.buttons.push($button);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false;
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.menu__list.find('.menu__item-link').on('click', function(){
            if (!that.data.loading) {
                that.data._el.menu__list.find('.menu__item-link').removeClass('menu__item-link_disabled');
                that.data._el.menu__list.find('.menu__item-link').removeClass('menu__item-link_selected');
                $(this).addClass('menu__item-link_selected');
                var value = $(this).data('value');
                console.log(value);
                var view = that.data.header.views.filter(function(v){ return v.value == value; });
                if (view.length > 0) {
                    view = view[0];
                    if (typeof(view.onclick) == 'function') {
                        view.onclick();
                    }
                }
            } else {
                that.data._el.menu__list.find('.menu__item-link').addClass('menu__item-link_disabled');
                $(this).removeClass('menu__item-link_selected');
            }
        });
    };

    that.init_components = function(){
        that.data._el.button_toggle_left.button();
        that.data._el.content.card();
        //that.data._el.menu__list.menu();
        that.data._el.input_search.input();
        that.data._el.buttons.map(function($button){
            $button.button();
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            that.bind();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
var GridView4 = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: '',
        title: null,
        header: {
            views: [],
            reload: null,
            settings: [],
            search: null
        },
        render: function(){}
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        name: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        radio_group: $('<span class="radio-group radio-group_type_buttons"></span>'),
        buttons: [],
        input_search: $([
            '<span class="input input__has-clear" data-width="150">',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
            '<div class="card__header">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="grid__view"></div>',
            '<div class="card__header-column" id="grid__actions"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="grid__container"></div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.content
        );
        that.render_container();
        //that.render_title();
        that.render_views();
        that.render_search();
        //that.render_buttons();
    };

    that.render_container = function(){
        that.data._el.content.find('#grid__container').append(
            that.data._el.container
        );
    };
    that.render_title = function(){
        if (that.data.title) {
            that.data._el.name.find('.card__name-text').text(that.data.title);
            that.data._el.content.find('#grid__view').append(
                that.data._el.name
            );
        }
    };
    that.render_views = function(){
        if (that.data.header.views.length > 0){
            that.data.header.views.forEach(function(view){
                that.data._el.radio_group.append(
                    $([
                        '<label class="radio radio_type_button" data-fc="radio" data-tooltip="' + view.name + '" ' + (view.selected ? 'data-checked="true"' : '') + '>',
                        '<button class="button button_toggable_radio" type="button" data-fc="button">',
                        '<span class="button__text">' + view.name + '</span>',
                        '</button>',
                        '<input class="radio__input" type="radio" name="radio-group-button" value="' + view.value + '" hidden="">',
                        '</label>'
                    ].join(''))
                );
            });
            that.data._el.content.find('#grid__view').append(
                that.data._el.radio_group
            );
        }
    };
    that.render_buttons = function(){
        that.data.header.settings.forEach(function(item){
            var $button = $([
                '<button class="button" type="button" data-fc="button">',
                '<span class="icon ' + item.icon + '"></span>',
                '</button>'
            ].join(''));
            if (typeof item.onclick == 'function') {
                $button.on('click', item.onclick);
            }
            that.data._el.content.find('#grid__actions').append($button);
            that.data._el.buttons.push($button);
        });
    };
    that.render_search = function(){
        if (that.data.header.search) {
            var ok = false
            if (typeof that.data.header.search.onkeyup == 'function') {
                ok = true;
                that.data._el.input_search.find('.input__control').on('keyup', that.data.header.search.onkeyup);
            }
            if (typeof that.data.header.search.onclear == 'function') {
                ok = true;
                that.data._el.input_search.find('.button').on('click', that.data.header.search.onclear);
            }
            if (ok) {
                that.data._el.content.find('#grid__actions').append(
                    that.data._el.input_search
                );
            }
        }
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.radio_group.find('[data-fc="radio"]').on('click', function(){
            var value = $(this).radio_group('value');
            console.log(value);
            var view = that.data.header.views.filter(function(v){ return v.value == value; });
            if (view.length > 0) {
                view = view[0];
                if (typeof(view.onclick) == 'function') {
                    view.onclick();
                }
            }
        });
    };

    that.init_components = function(){
        that.data._el.radio_group.radio_group();
        that.data._el.input_search.input();
        that.data._el.buttons.map(function($button){
            $button.button();
        });
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.init_components();
            that.bind();
            if (typeof that.data.render == 'function') { that.data.render(); }
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
}; //short
