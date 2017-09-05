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
        row_search: $([
            '<div class="card__header-row card__header-row_wrap">',
            '<div class="card__header-column card__header-column_stretch" id="doc__input"></div>',
            '</div>'
        ].join('')),
        row_filter: $([
            '<div class="card__header-row">',
            '<div class="card__header-column" id="doc__filter"></div>',
            '<div class="card__header-column" id="doc__count"></div>',
            '</div>'
        ].join('')),
        table: $([
            '<table class="table">',
            '<thead>',
            '<tr>',
                '<td class="table__td_no_border">Тип</td>',
                '<td class="table__td_no_border">Название файла</td>',
                '<td class="table__td_no_border">Автор</td>',
                '<td class="table__td_no_border">Тип карточки</td>',
                '<td class="table__td_no_border">Наименование</td>',
                '<td class="table__td_no_border">Дата изменения</td>',
                '<td class="table__td_no_border">Размер</td>',
                '<td class="table__td_no_border">Версия</td>',
            '</tr>',
            '</thead>',
            '<tbody></tbody>',
            '</table>'
        ].join('')),
        content: $([
            '<div class="card">',
            '<div class="card__header" id="doc__header"></div>',
            '<div class="card__main">',
            '<div class="card__middle">',
            '<div class="card__middle-scroll" id="doc__table"></div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        loader: $('<span class="spinner"></span>')
    };
    that.data._private = {
        rdata: Enumerable.From(that.data.data),
        fdata: Enumerable.From(that.data.data), // фильтрованный
        tdata: Enumerable.Empty(), // по типам документов
        adata: Enumerable.Empty(), // по авторам
        edata: Enumerable.Empty(), // по типам карточек
        uniqueExtensions: Enumerable.From(that.data.data).Distinct("$.ext.toLowerCase()").OrderBy("$.ext").Select("{ext:$.ext, icon:$.icon}"),
        uniqueAuthors:    Enumerable.From(that.data.data).Distinct("$.creationAuthorId").OrderBy("$.userName").Select("{creationAuthorId:$.creationAuthorId, userName:$.userName}").Where("$.creationAuthorId!=0"),
        uniqueEntities:   Enumerable.From(that.data.data).Distinct("$.entityName").OrderBy("$.entityTitle").Select("{entityName:$.entityName, entityTitle:$.entityTitle}"),
        filters: {
            doctype: [],
            author: [],
            entity: []
        }
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.render_search_line = function(){
        that.data._el.row_search.find('#doc__input').append(
            that.data._el.input
        );
        that.data._el.content.find('#doc__header').append(
            that.data._el.row_search
        );
        that.data._el.input.find('.input__control').val(that.get_url_parameter('text'));
        that.data._el.input.find('.input__control').keypress(function(e){
            if (e.which == 13) {
                window.location.href = that.set_url_parameter(window.location.href, 'text', $(this).val());
            }
        })
    };
    that.render_filters = function(){
        if (that.data._private.uniqueExtensions.Count() > 0){
            that.data._private.uniqueExtensions.ForEach(function(item){
                var $option = $('<option value="' + item.ext + '">' + item.ext + '</option>');
                that.data._el.filters.doctype.append($option);
            });
            that.data._el.filters.doctype.change(function(){
                that.data._private.filters.doctype = $(this).select('value');
                that.set_filter();
                that.render_count();
                that.render_table();
            });
        }
        if (that.data._private.uniqueAuthors.Count() > 0){
            that.data._private.uniqueAuthors.ForEach(function(item){
                var $option = $('<option value="' + item.creationAuthorId + '">' + item.userName + '</option>');
                that.data._el.filters.author.append($option);
            });
            that.data._el.filters.author.change(function(){
                that.data._private.filters.author = $(this).select('value');
                that.set_filter();
                that.render_count();
                that.render_table();
            });
        }
        if (that.data._private.uniqueEntities.Count() > 0){
            that.data._private.uniqueEntities.ForEach(function(item){
                var $option = $('<option value="' + item.entityName + '">' + item.entityTitle + '</option>');
                that.data._el.filters.entity.append($option);
            });
            that.data._el.filters.entity.change(function(){
                that.data._private.filters.entity = $(this).select('value');
                that.set_filter();
                that.render_count();
                that.render_table();
            });
        }
        that.data._el.row_filter.find('#doc__filter').append(
            that.data._el.filters.doctype,
            that.data._el.filters.author,
            that.data._el.filters.entity
        );
        that.data._el.row_filter.find('#doc__count').append(
            that.data._el.count
        );
        that.data._el.content.find('#doc__header').append(
            that.data._el.row_filter
        );
    };
    that.render_count = function(){
        that.data._el.count.find('.card__name-text').text(that.data._private.fdata.Count());
    };
    that.render_table = function(){
        that.data._el.table.find('tbody').empty();
        that.data._private.fdata.ForEach(function(item){
            that.data._el.table.find('tbody').append($([
                '<tr>',
                '<td><img class="doctype" src="' + item.icon + '"></td>',
                '<td><a class="link" href="' + item.url + '" target="_blank">' + item.name + item.ext + '</a></td>',
                '<td>' + item.userName + '</td>',
                '<td>' + item.entityTitle + '</td>',
                '<td>' + item.dataName + '</td>',
                '<td>' + item.creationDate + '</td>',
                '<td>' + filesize(item.fileLength, {base: 2}) + '</td>',
                '<td>' + item.vers + '</td>',
                '</tr>'
            ].join('')));
        });
        if (typeof(that.data._el.content.find('#doc__table .table')[0]) == typeof(undefined)) {
            that.data._el.content.find('#doc__table').append(
                that.data._el.table
            );
        }
    };

    that.set_filter = function(){
        that.data._private.fdata = Enumerable.From(that.data.data);
        var data1 = Enumerable.Empty();
        that.data._private.filters.doctype.forEach(function(val){
            var data = that.data._private.fdata.Where('$.ext=="' + val + '"');
            data1 = data1.Concat(data);
        });
        var data2 = Enumerable.Empty();
        that.data._private.filters.author.forEach(function(val){
            var data = that.data._private.fdata.Where('$.creationAuthorId=="' + val + '"');
            data2 = data2.Concat(data);
        });
        var data3 = Enumerable.Empty();
        that.data._private.filters.entity.forEach(function(val){
            var data = that.data._private.fdata.Where('$.entityName=="' + val + '"');
            data3 = data3.Concat(data);
        });
        if (data1.Count() == 0) { data1 = Enumerable.From(that.data.data); }
        if (data2.Count() == 0) { data2 = Enumerable.From(that.data.data); }
        if (data3.Count() == 0) { data3 = Enumerable.From(that.data.data); }
        that.data._private.fdata = data1.Intersect(data2).Intersect(data3).OrderBy("$.fileId");
    };

    that.set_url_parameter = function(url, param, paramVal){
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (i=0; i<tempArray.length; i++){
                if(tempArray[i].split('=')[0] != param){
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }
        var rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    }
    that.get_url_parameter = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

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

    that.init_components = function(){
        that.data._el.filters.doctype.select({
            width: 200,
            mode: 'check',
            autoclose: false,
            placeholder: 'Тип документа'
        });
        that.data._el.filters.author.select({
            width: 200,
            mode: 'check',
            autoclose: false,
            placeholder: 'Автор'
        });
        that.data._el.filters.entity.select({
            width: 200,
            mode: 'check',
            autoclose: false,
            placeholder: 'Тип карточки'
        });
        that.data._el.input.input();
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.render_search_line();
            if (that.data._private.rdata.Count() > 0) {
                that.render_filters();
                that.render_count();
                that.render_table();
            }
            that.init_components();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};