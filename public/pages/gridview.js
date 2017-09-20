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
            '<span class="card__name-text card__name-text_no-margin"></span>',
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
        container: $('<div class="grid"></div>'),
        content: $([
            '<div class="card">',
                '<div class="card__header">',
                    '<div class="card__header-row card__header-row_wrap">',
                        '<div class="card__header-column" id="grid__view"></div>',
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
            width: 'auto',
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