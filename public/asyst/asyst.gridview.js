if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.GridView = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: 'container',
        name: null,
        gridview: null,
        title: '',
        data: null
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        loader: $('<span class="spinner"></span>')
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

    that.load_data = function(callback){
        if (typeof callback == 'function') { callback(); }
    };

    that.init = function(){
        that.loader_add();
        that.load_data(function(){
            that.loader_remove();
            that.data.gridview = new GridView({
                containerid: that.data.containerid,
                title: that.data.title,
                data: that.data.data,
                header: {
                    views: [
                        {
                            name: 'Мои проекты',
                            value: 'MyProjects',
                            selected: true,
                            onclick: function(){}
                        },
                        {
                            name: 'Все проекты',
                            value: 'AllProjects',
                            onclick: function(){}
                        },
                        {
                            name: 'Активные',
                            value: 'Active',
                            onclick: function(){}
                        },
                        {
                            name: 'Архивные',
                            value: 'Archive',
                            onclick: function(){}
                        },
                        {
                            name: 'Бюджеты проектов',
                            value: 'Budgets',
                            onclick: function(){}
                        },
                        {
                            name: 'Проекты без целей',
                            value: 'NoGoals',
                            onclick: function(){}
                        }
                    ],
                    reload: {
                        onclick: function(){ console.log('reload'); }
                    },
                    settings: [
                        {
                            icon: 'icon_svg_plus',
                            name: 'Добавить',
                            onclick: function(){ console.log('add'); }
                        },
                        {
                            icon: 'icon_svg_trash',
                            name: 'Удалить',
                            onclick: function(){}
                        },
                        {
                            icon: 'icon_svg_expand',
                            name: 'Развернуть все группы',
                            onclick: function(){}
                        },
                        {
                            icon: 'icon_svg_collapse',
                            name: 'Свернуть все группы',
                            onclick: function(){}
                        },
                        {
                            icon: 'icon_svg_export',
                            name: 'Экспорт',
                            onclick: function(){}
                        },
                        {
                            icon: 'icon_svg_search',
                            name: 'Расширенный фильтр',
                            onclick: function(){}
                        }
                    ],
                    search: {
                        onkeyup: function(){ console.log('searching'); },
                        onclear: function(){ console.log('clear'); }
                    }
                },
                render: render_grid
            });
        });
    };
    that.init();
    return that;
};