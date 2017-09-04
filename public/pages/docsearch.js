var DocSearch = function(options){
    var that = this._docsearch = {};
    that.data = {
        data: [],
        filter: {
            text: '',
            pagenum: 1,
            doctypes: [],
            author: -1,
            entitytype: ''
        }
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
        input: $([
            '<span class="input input__has-clear" data-width="100%">',
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
        filters: {
            doctype: $('<select class="select" data-fc="select"></select>'),
            author: $('<select class="select" data-fc="select"></select>'),
            entity: $('<select class="select" data-fc="select"></select>'),
        },
        count: $([
            '<label class="card__name">',
                '<span class="card__name-text card__name-text_no-margin"></span>',
            '</label>'
        ].join('')),
        content: $([
            '<div class="card">',
                '<div class="card__header">',
                    '<div class="card__header-row card__header-row_wrap">',
                        '<div class="card__header-column card__header-column_stretch" id="input"></div>',
                    '</div>',
                    '<div class="card__header-row">',
                        '<div class="card__header-column" id="filter"></div>',
                        '<div class="card__header-column" id="count"></div>',
                    '</div>',
                '</div>',
                '<div class="card__main">',
                    '<div class="card__middle">',
                        '<div class="card__middle-scroll" id="container"></div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner"></span>')
    };

    that.render = function(){
        that.set_count(that.data.data);
        that.data._el.content.find('#input').append(
            that.data._el.input
        );
        that.data._el.content.find('#filter').append(
            that.data._el.filters.doctype,
            that.data._el.filters.author,
            that.data._el.filters.entity
        );
        that.data._el.content.find('#count').append(
            that.data._el.count
        );
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.render_filters = function(){

    };

    that.set_count = function(arr){
        that.data._el.count.find('.card__name-text').text(arr.length);
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
        /*
        that.data._el.radiogroup.find('[data-fc="radio"]').on('click', function(){
            that.data.defaults.reportingCategoryId = $(this).radio_group('value');
            that.filter_reports();
        });
        that.data._el.tumbler.on('on.fc.tumbler', function(){
            that.data.defaults.favorite = true;
            that.filter_reports();
        }).on('off.fc.tumbler', function(){
            that.data.defaults.favorite = false;
            that.filter_reports();
        });
        if (that.data.defaults.favorite) {
            that.data._el.tumbler.tumbler('check');
        }
        that.data._el.input.on('keyup', function(){
            clearTimeout(that.data.search.timer);
            that.data.search.text = $(this).input('value');
            that.data.search.timer = setTimeout(function(){
                that.filter_reports();
            }, 300);
        });
        */
    };

    that.init_components = function(){
        that.data._el.filters.doctype.select({
            width: 200,
            mode: 'radio-check',
            autoclose: true,
            placeholder: 'Тип документа'
        });
        that.data._el.filters.author.select({
            width: 200,
            mode: 'radio-check',
            autoclose: true,
            placeholder: 'Автор'
        });
        that.data._el.filters.entity.select({
            width: 200,
            mode: 'radio-check',
            autoclose: true,
            placeholder: 'Тип карточки'
        });
        that.data._el.input.input();
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.render_filters();
            that.init_components();
            that.bind();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};