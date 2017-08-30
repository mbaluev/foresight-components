function ToggleClearFilterButton(show) {
    if (show) {
        $('#clearFilterButton').show();
    } else {
        $('#clearFilterButton').hide();
    }
}

function MakeFilterLine(filterArgs) {
    if (!filterArgs) {
        $('#filter-line').hide(); //??
        ToggleClearFilterButton(false);
        return;
    }
    var title = (filterArgs.oper == 'and') ? '' : Globa.AnyFrom.locale();
    for (var i = 0; i < filterArgs.filterItems.length; i++) {
        var item = filterArgs.filterItems[i];
        var filterItem = Enumerable.From(window[viewName].Filters).Where(function (a) {
            return a.fieldName == item.column;
        }).FirstOrDefault();
        if (!filterItem) continue;

        var fieldTitle = filterItem.title;
        var val = item.value;
        if (item.hasOwnProperty('valueTitle'))
            val = item.valueTitle;
        if (val && val.constructor == Date)
            val = Asyst.date.format(val, Asyst.date.defaultDateFormat);
        if (val == null) val = "' '";
        title += '<span class="label">' + fieldTitle + ' <span style="background-color:#7b7b7b; padding: 1px 5px">' + Grid.ExtFilterOper[item.oper].title + '</span> ' + val + '</span> &nbsp;&nbsp';
    }
    $('#filter-line #filter-title').html(title);
    ToggleClearFilterButton(true);
    //временное(?) решение - если флага нет, линию не показываем.
    if (Asyst.Workspace.views[viewName].isExtFilterVisible) {
        $('#filter-line').show();
    }
    if (!Asyst.Workspace.views[viewName].isExtFilterVisible) {
        $('#filter-line>.icon-pencil').hide();
        $('#filter-line>.icon-remove-circle').hide();
    }
    $('.wrapper').resize();
}

function getParamsToFilterArgs(filterParams, indices) {
    var filterArgs = {oper: 'and', filterItems: []};

    if (filterParams.hasOwnProperty('FilterConsistency') && filterParams.hasOwnProperty('FilterConsistency').toLowerCase() == 'or') {
        filterArgs.oper = 'or';
    }

    var fieldIName = "FieldXName";
    var fieldIValue = "FieldXName";
    var fieldIOperation = "FieldXOperation";

    //массив операций и соответствующих функций проверки
    var operations = {
        Equal: '=',
        GreaterThen: '>',
        LessThen: '<',
        GreaterThenOrEqual: '>=',
        LessThenOrEqual: '<=',
        Like: 'like',
        NotLike: 'notlike',
        Started: 'started',
        NotEqual: '<>'
    };
    var test = true;
    for (var i = 0; i < indices.length; i++) {
        var filterItem = {};
        fieldIName = "Field" + indices[i] + "Name";
        fieldIValue = "Field" + indices[i] + "Value";
        fieldIOperation = "Field" + indices[i] + "Operation";

        filterItem.column = filterParams[fieldIName];
        filterItem.value = filterParams[fieldIValue];

        filterItem.oper = operations.Equal;
        if (!filterParams.hasOwnProperty(fieldIOperation) || operations[filterParams[fieldIOperation]] == undefined)
            filterItem.oper = operations.Equal;
        else
        //если указано - используем из массива операций соответствующую
            filterItem.oper = operations[filterParams[fieldIOperation]];
        filterArgs.filterItems.push(filterItem);
    }
    return filterArgs;
}

function clearGETFilters() {
    var d = splitGETString();

    var indices = Array();
    for (var a in d) {
        var re = /Field(\d+)Name/g;
        var ind = re.exec(a);
        if (ind !== undefined && ind !== null && ind[1] !== undefined)
            indices.push(ind[1]);
    }

    if (indices.length === 0 && !d.hasOwnProperty("extFilters"))
        return location.href;

    for (var i = 0; i < indices.length; i++) {
        delete d["Field" + indices[i] + "Name"];
        delete d["Field" + indices[i] + "Value"];
        delete d["Field" + indices[i] + "Operation"];
    }
    delete d["extFilters"];
    delete d["view"];
    delete d["ExpandGroup"];
    delete d["hideFilterPanel"];
    delete d["ViewSampleId"];

    var newfilterstring = "?";
    var first = true;
    for (var c in d) {
        newfilterstring += (first ? "" : "&") + c + "=" + d[c];
        first = false;
    }

    return location.protocol + "//" + location.host + location.pathname + (first ? "" : newfilterstring) + location.hash;
}

function clearAllFilters() {
    Grid.ClearExtFilter(window[viewName]);
    ToggleClearFilterButton(false);
    var newhref = clearGETFilters();
    if (newhref != location.href) {
        location.href = newhref;
    }
}

function restoreDatesInFilterArgs(args, columns) {
    for (var ctx in args.filterItems) {
        var item = args.filterItems[ctx];
        for (var i in columns) {
            var subitem = columns[i];
            if ((subitem.kind == "date" || subitem.kind == "datetime") && subitem.field == item.column) {
                var newValue = new Date(item.value);
                if (!isNaN(newValue))
                    item.value = newValue;
            }
        }
    }
    return args;
}

function filterDataByGET(data, columns) {
    var filterParams = splitGETString();

    if (filterParams.hasOwnProperty('extFilters')) {
        var par = JSON.parse(decodeURIComponent(filterParams.extFilters));
        if (columns === null && columns === undefined)
            columns = Asyst.Workspace.currentView.Columns;
        return restoreDatesInFilterArgs(par, columns);
    }
    //определяем, какие индексы засунули в строку параметров
    var indices = Array();
    for (var a in filterParams) {
        var re = /Field(\d+)Name/g;
        var ind = re.exec(a);
        if (ind !== undefined && ind !== null && ind[1] !== undefined)
            indices.push(ind[1]);
    }
    if (indices.length === 0)
        return;

    //выполняем подмены в значениях шаблонов
    var user = Asyst.Workspace.currentUser;
    for (var d in filterParams) {
        filterParams[d] = decodeURIComponent(filterParams[d]);
        filterParams[d] = filterParams[d].replace(/\{UserAccount\}/g, user.Account);
        filterParams[d] = filterParams[d].replace(/\{UserId\}/g, user.Id);
        filterParams[d] = filterParams[d].replace(/\{CurrentDate\}/g, Asyst.date.format(new Date()));
    }

    return getParamsToFilterArgs(filterParams, indices);
}

//готовит строку как like-условие sql в regexp представление js
function likeStringToJS(value) {
    var result = value;
    result = result.replace(/%/gi, '.*');
    result = result.replace(/\?/gi, '\\?');
    return result.replace(/%/gi, '.');
}

//http://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
function removeURLParameter(url, parameter) {
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        for (var i = pars.length; i-- > 0;) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        url = urlparts[0] + '?' + pars.join('&');
        return url;
    } else {
        return url;
    }
}

//проверяет, подходит ли строка dataRow под условия filterParams с индексаторами indices
function filterDataRow(dataRow, filterParams, indices) {

    if (indices === undefined || indices === null || indices.length === 0 || filterParams === undefined || filterParams === null)
        return true;

    var fieldIName = "FieldXName";
    var fieldIValue = "FieldXName";
    var fieldIOperation = "FieldXOperation";

    //массив операций и соответствующих функций проверки
    var operations = {
        Equal: function (x, y) {
            if (x instanceof Date) return x.valueOf() == y.valueOf();
            else return x == y;
        },
        GreaterThen: function (x, y) {
            return x > y;
        },
        LessThen: function (x, y) {
            return x < y;
        },
        GreaterThenOrEqual: function (x, y) {
            return x >= y;
        },
        LessThenOrEqual: function (x, y) {
            return x <= y;
        },
        Like: function (x, y) {
            return RegExp(likeStringToJS(y), 'gi').test(x);
        },
        NotLike: function (x, y) {
            return !RegExp(likeStringToJS(y), 'gi').test(x);
        }
    };
    var test = true;
    for (var i = 0; i < indices.length; i++) {
        fieldIName = "Field" + indices[i] + "Name";
        fieldIValue = "Field" + indices[i] + "Value";
        fieldIOperation = "Field" + indices[i] + "Operation";

        // если массив содержит переменную с нужным именем, проверям её
        if (dataRow.hasOwnProperty(filterParams[fieldIName])) {
            var testvalue = dataRow[filterParams[fieldIName]];
            var paramvalue = filterParams[fieldIValue];//decodeURIComponent(filterParams[fieldIValue]);
            //если значение - дата, то приводим текст из запроса в объект типа дата
            if (testvalue instanceof Date) {
                paramvalue = Asyst.date.parse(paramvalue);
                paramvalue.setHours(testvalue.getHours(), testvalue.getMinutes(), testvalue.getSeconds(), testvalue.getMilliseconds());
            }
            //если имя операции не указано или мы такое не знаем, вызываем Equal
            if (!filterParams.hasOwnProperty(fieldIOperation) || operations[filterParams[fieldIOperation]] == undefined)
                test = operations.Equal(testvalue, paramvalue);
            //если указано - вызываем из массива операций соответствующую
            else
                test = operations[filterParams[fieldIOperation]](testvalue, paramvalue);

            //если строка не прошла проверку - возвращаем false, иначе - продолжаем
            if (!test)
                return false;
        }

    }
    return true;
}

function menuChangeView(newViewName, newViewTitle) {
    if (window[viewName])
        window[viewName].saveCurrent();
    viewName = newViewName;
    showBrowser('#view', newViewName);
    $('#viewSelectBtn').text(newViewTitle);
}

function ViewClick(view, item, column, event) {
    var entity = Asyst.Workspace.views[viewName].entity;
    if (column.id === '_like_selector') return;

    if (entity != null && entity.isViewProcessLink) {
        if (column && column.hasOwnProperty('url') && column.url)
            return;
        var loc = window.location.href;
        if (loc[loc.length - 1] == '#')
            loc = loc.substring(0, loc.length - 1);
        loc = removeURLParameter(loc, 'extFilters');
        var resPath = '/asyst/' + Asyst.Workspace.views[viewName].entity.name + '/form/auto/' + item[Asyst.Workspace.views[viewName].entity.idName] + '?mode=view&back=' + encodeURIComponent(loc);
        var fArgs = window[viewName].DataView.getFilterArgs();
        if (fArgs.hasOwnProperty('oper')) {
            //resPath += encodeURIComponent((loc.indexOf('?') >= 0) ? '&' : '?');
            //var saved = {};
            //saved.filterItems = fArgs.filterItems;
            //saved.oper = fArgs.oper;
            //resPath += encodeURIComponent('extFilters=' + encodeURIComponent(JSON.stringify(saved)));
        }
        if (event && event.hasOwnProperty('ctrlKey') && event.ctrlKey === true) {
            var c = window.open(resPath);
        } else {
            window.location.href = resPath;
        }
    }
}

function showBrowser(selector, viewName, viewSampleId) {
    Asyst.debugger('global');
    var saveTitle = '';
    if (window.hasOwnProperty('views') && views.hasOwnProperty(viewName) && views[viewName].hasOwnProperty('title'))
        saveTitle = views[viewName].title;
    Asyst.API.AdminTools.saveStats({page: location.href, pageTitle: saveTitle, type: 'view', action: 'open'}, true);
    Model.CurrentViewName = viewName;

    var view;
    var viewEl = $(selector);

    var expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    setPageCookie("CurrentViewName", viewName, expires);

    //Loader.show(selector);
    Loader.show();

    var params = $.extend(splitGETString(), null);
    if (!params.hasOwnProperty('viewSampleId'))
        params.viewSampleId = viewSampleId;
    else if (params.viewSampleId == 'null') params.viewSampleId = null;

    Asyst.APIv2.View.load({viewName: viewName, data:params, success:function (data) {

        var filterArgs = filterDataByGET(data, data.columns);
        if ((filterArgs === undefined || filterArgs === null) && data.viewSample && data.viewSample.hasOwnProperty('filterArgs')) {
            filterArgs = data.viewSample.filterArgs;
            restoreDatesInFilterArgs(filterArgs, data.columns);
        }

        for (var colIdx in data.columns) {
            var column = data.columns[colIdx];
            if (column.formatter)
                column.formatter = eval(column.formatter);
            else if (column.url)
                column.formatter = Grid.LinkFormatter;
            else
                column.formatter = Grid.DefaultFormatter;
        }


        viewEl[0].innerHtml = "";

        if (viewEl.height() === 0) {
            try {
                var cont = $('#s4-bodyContainer');
                var resizeContainer = function (event) {
                    var hasScroll = false;
                    var widthScroll = 0;

                    for (var el = viewEl; !hasScroll && el.length > 0; el = el.parent()) {
                        var sw = el[0].scrollWidth, ow = el[0].offsetWidth;

                        if (sw != ow) {
                            hasScroll = true;
                            widthScroll = el[0].offsetHeight - el[0].clientHeight;
                        }
                    }

                    //if (cont.length > 0)
                    //    viewEl.height(Math.max(cont[0].scrollHeight + cont.offset().top - 55, $(window).height()-3) - viewEl.offset().top);
                    //else
                    viewEl.height($(window).height() - viewEl.offset().top - 3 - widthScroll);
                    if (grid)
                        grid.resizeCanvas();
                };

                $(window).resize(resizeContainer);
                $(window).resize();

            } catch (error) {
            }
        }

        var options = {
            enableCellNavigation: true,
            editable: false,
            autoHeight: false,
            doClick: true,
            wideString: Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isWideString,
            initiallyCollapsed: Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isInitiallyCollapsed,
            rowSelectionModel: new Asyst.RowSelectionModel()

        };

        //todo replace
        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].hasOwnProperty('preprocessFunction'))
            Asyst.Workspace.views[viewName].preprocessFunction(viewEl, data.data, data.columns, options, data.groups);

        if (data.EditFormName) {
            viewEl.css("overflow", "hidden");
            var EditableGrid = Asyst.Models.EditableView.EditableGrid;
            view = EditableGrid.create(viewEl, data.data, data.columns, data.EditFormName, data.KeyName, data.EntityName);
        } else {
            view = Grid.Create(viewEl, data.data, data.columns, options, data.groups, params, data.filters, data.viewSample);

            var grid = view.Grid;
            var dataView = view.DataView;

            if (data.EntityId)
                grid.EntityId = data.EntityId;
            if (data.EntityName)
                grid.EntityName = data.EntityName;
            if (data.KeyName)
                grid.KeyName = data.KeyName;

            if (options.doClick) {
                grid.onClick.subscribe(function (e, args) {
                    var cell = grid.getCellFromEvent(e);
                    var item = grid.getDataItem(cell.row);
                    if (item.__nonDataRow) return;
                    var column = grid.getColumns()[cell.cell];
                    ViewClick(dataView, item, column, e);
                });
            }
        }
        view.viewName = viewName;
        window[viewName] = view;

        //отключено за непонятностью
        //if (dblClick) {
        //    grid.onDblClick.subscribe(function (e, args) {
        //        var cell = grid.getCellFromEvent(e);
        //        var item = grid.getDataItem(cell.row);
        //        if (item.__nonDataRow) return;
        //        var column = grid.getColumns()[cell.cell];
        //        dblClick(dataView, item, column);
        //    });
        //}

        if (!window['views'] || !views.hasOwnProperty(viewName) || !Asyst.Workspace.views[viewName].isEditable)
            $('#menuItemAdd').hide();
        else
            $('#menuItemAdd').show();

        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isExtFilterVisible)
            $('.ext-filter-menu').show();
        else
            $('.ext-filter-menu').hide();


        $('#BrowseSearch').keyup(window[viewName].QuickFilterKeyup);
        $('.search-clear').click(window[viewName].QuickFilterClear);
        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isInitiallyCollapsed) {
            window[viewName].CollapseAllGroups();
        }
        //if (success)
        //    success();


        if (params.hasOwnProperty("ExpandGroup"))
            if (params.ExpandGroup == "true")
                view.ExpandAllGroups();
            else
                view.CollapseAllGroups();

        var needInvalidate = false;

        if (filterArgs && filterArgs.hasOwnProperty('oper')) {
            view.DataView.setFilter(Grid.ExtFilter);
            filterArgs = $.extend(filterArgs, {gridView: view});
            view.DataView.setFilterArgs(filterArgs);
            view.DataView.refresh();
            needInvalidate = true;
            //$('#BrowseSearchGroup').hide();
            if (!params.hideFilterPanel)
                MakeFilterLine(filterArgs);
            ToggleClearFilterButton(true);
        } else {
            view.QuickFilterClear();
            ToggleClearFilterButton(false);

            !(!!data.EditFormName) && Grid.ClearExtFilter(view);
        }

        if (filterArgs && /*!filterArgs.hasOwnProperty('oper') && */filterArgs.hasOwnProperty('searchString') && filterArgs.searchString !== "") {
            $('#BrowseSearch').val(filterArgs.searchString);
            view.UpdateQuickFilter(filterArgs.searchString);
            ToggleClearFilterButton(true);
            view.DataView.refresh();
            needInvalidate = true;
        }

        if (data.viewSample && data.viewSample.hasOwnProperty('groups')) {
            view.SetGroupsCollapsed(data.viewSample.groups);
            needInvalidate = true;
        }
        if (data.viewSample && data.viewSample.hasOwnProperty('viewport') && data.viewSample.top != -1) {
            view.Grid.scrollToRow(data.viewSample.viewport.top);
            needInvalidate = true;
        }

        //восстанавливаем меню.
        if (Asyst.Workspace.views && Asyst.Workspace.views[viewName])
            $('#viewSelectBtn').text(Asyst.Workspace.views[viewName].title);
        if (data.viewSample && data.viewSample.name != "")
            $('#viewSampleSelectBtn').text(data.viewSample.name);
        else
            $('#viewSampleSelectBtn').text(Globa.ViewSample.locale());
        view.viewSampleMenuRebuild();

        if (needInvalidate) {
            view.Grid.invalidate();
        }

        //быстрокостыль для нового хрома и ширины реестра
        {
            $('#view').css({width: '1200px'});
            setTimeout(function () {
                $('#view').css({width: '100%'});
            }, 100);
        }
        Loader.hide();

    },
    error: function () {
        Loader.hide();
    },
    async: true
    });
}

function ViewExport(viewName, result) {
    function datenum(v, date1904) {
        if (date1904) v += 1462;
        var epoch = v.valueOf();
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }

    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    function colorNameToHexExcel(color) {

        //if (color && color.indexOf('#') == 0) return 'FF' + color.substring(1, 7).toUpperCase();

        var colors = {
            "aliceblue": "#f0f8ff",
            "antiquewhite": "#faebd7",
            "aqua": "#00ffff",
            "aquamarine": "#7fffd4",
            "azure": "#f0ffff",
            "beige": "#f5f5dc",
            "bisque": "#ffe4c4",
            "black": "#000000",
            "blanchedalmond": "#ffebcd",
            "blue": "#0000ff",
            "blueviolet": "#8a2be2",
            "brown": "#a52a2a",
            "burlywood": "#deb887",
            "cadetblue": "#5f9ea0",
            "chartreuse": "#7fff00",
            "chocolate": "#d2691e",
            "coral": "#ff7f50",
            "cornflowerblue": "#6495ed",
            "cornsilk": "#fff8dc",
            "crimson": "#dc143c",
            "cyan": "#00ffff",
            "darkblue": "#00008b",
            "darkcyan": "#008b8b",
            "darkgoldenrod": "#b8860b",
            "darkgray": "#a9a9a9",
            "darkgreen": "#006400",
            "darkkhaki": "#bdb76b",
            "darkmagenta": "#8b008b",
            "darkolivegreen": "#556b2f",
            "darkorange": "#ff8c00",
            "darkorchid": "#9932cc",
            "darkred": "#8b0000",
            "darksalmon": "#e9967a",
            "darkseagreen": "#8fbc8f",
            "darkslateblue": "#483d8b",
            "darkslategray": "#2f4f4f",
            "darkturquoise": "#00ced1",
            "darkviolet": "#9400d3",
            "deeppink": "#ff1493",
            "deepskyblue": "#00bfff",
            "dimgray": "#696969",
            "dodgerblue": "#1e90ff",
            "firebrick": "#b22222",
            "floralwhite": "#fffaf0",
            "forestgreen": "#228b22",
            "fuchsia": "#ff00ff",
            "gainsboro": "#dcdcdc",
            "ghostwhite": "#f8f8ff",
            "gold": "#ffd700",
            "goldenrod": "#daa520",
            "gray": "#808080",
            "green": "#008000",
            "greenyellow": "#adff2f",
            "honeydew": "#f0fff0",
            "hotpink": "#ff69b4",
            "indianred ": "#cd5c5c",
            "indigo": "#4b0082",
            "ivory": "#fffff0",
            "khaki": "#f0e68c",
            "lavender": "#e6e6fa",
            "lavenderblush": "#fff0f5",
            "lawngreen": "#7cfc00",
            "lemonchiffon": "#fffacd",
            "lightblue": "#add8e6",
            "lightcoral": "#f08080",
            "lightcyan": "#e0ffff",
            "lightgoldenrodyellow": "#fafad2",
            "lightgrey": "#d3d3d3",
            "lightgreen": "#90ee90",
            "lightpink": "#ffb6c1",
            "lightsalmon": "#ffa07a",
            "lightseagreen": "#20b2aa",
            "lightskyblue": "#87cefa",
            "lightslategray": "#778899",
            "lightsteelblue": "#b0c4de",
            "lightyellow": "#ffffe0",
            "lime": "#00ff00",
            "limegreen": "#32cd32",
            "linen": "#faf0e6",
            "magenta": "#ff00ff",
            "maroon": "#800000",
            "mediumaquamarine": "#66cdaa",
            "mediumblue": "#0000cd",
            "mediumorchid": "#ba55d3",
            "mediumpurple": "#9370d8",
            "mediumseagreen": "#3cb371",
            "mediumslateblue": "#7b68ee",
            "mediumspringgreen": "#00fa9a",
            "mediumturquoise": "#48d1cc",
            "mediumvioletred": "#c71585",
            "midnightblue": "#191970",
            "mintcream": "#f5fffa",
            "mistyrose": "#ffe4e1",
            "moccasin": "#ffe4b5",
            "navajowhite": "#ffdead",
            "navy": "#000080",
            "oldlace": "#fdf5e6",
            "olive": "#808000",
            "olivedrab": "#6b8e23",
            "orange": "#ffa500",
            "orangered": "#ff4500",
            "orchid": "#da70d6",
            "palegoldenrod": "#eee8aa",
            "palegreen": "#98fb98",
            "paleturquoise": "#afeeee",
            "palevioletred": "#d87093",
            "papayawhip": "#ffefd5",
            "peachpuff": "#ffdab9",
            "peru": "#cd853f",
            "pink": "#ffc0cb",
            "plum": "#dda0dd",
            "powderblue": "#b0e0e6",
            "purple": "#800080",
            "red": "#ff0000",
            "rosybrown": "#bc8f8f",
            "royalblue": "#4169e1",
            "saddlebrown": "#8b4513",
            "salmon": "#fa8072",
            "sandybrown": "#f4a460",
            "seagreen": "#2e8b57",
            "seashell": "#fff5ee",
            "sienna": "#a0522d",
            "silver": "#c0c0c0",
            "skyblue": "#87ceeb",
            "slateblue": "#6a5acd",
            "slategray": "#708090",
            "snow": "#fffafa",
            "springgreen": "#00ff7f",
            "steelblue": "#4682b4",
            "tan": "#d2b48c",
            "teal": "#008080",
            "thistle": "#d8bfd8",
            "tomato": "#ff6347",
            "turquoise": "#40e0d0",
            "violet": "#ee82ee",
            "wheat": "#f5deb3",
            "white": "#ffffff",
            "whitesmoke": "#f5f5f5",
            "yellow": "#ffff00",
            "yellowgreen": "#9acd32"
        };

        return 'FF' + (colors[color.toLowerCase()] || color).substring(1, 7).toUpperCase();

    }

    function sheetData(data, columns, groups) {
        var ws = {};
        var range = {s: {c: 0, r: 0}, e: {c: 0, r: 0}};

        ws['!cols'] = []; //массив для хранения свойств колонок, мы пишем туда ширину

        var bold = {font: {bold: true}};


        for (var c = 0; c < columns.length; c++) {
            var cell = {v: columns[c].name, t: 's', s: bold};
            var cell_ref = XLSX.utils.encode_cell({c: c, r: 0});
            ws[cell_ref] = cell;
            ws['!cols'].push({wch: columns[c].width / 8}); //8 - это магически подобранное число,
        }

        //для группировок заполлним название колонок, если такие колонки есть в основной выборке.
        //Не рабоатает, если колонки нет в ВИДИМЫХ колонках, она не передается в json ответе
        //for (var j = 0; j < groups.length; j++) {
        //    var item = groups[j].name;
        //    var col = allColumns.FirstOrDefault(null, function (gg) { return gg.field == item });
        //    if (col) {
        //        var cell = { v: col.name, t: 's', s: bold };
        //        var cell_ref = XLSX.utils.encode_cell({ c: c + j, r: 0 });
        //        ws[cell_ref] = cell;
        //    }
        //}

        //А теперь пройдемся по всем данным
        for (var i = 0; i < data.length; i++) {
            for (var c = 0; c < columns.length; c++) {
                var item = data[i][columns[c].field];

                if (item === null || item === undefined) continue;

                var cell = {v: item, t: 's'};
                var cell_ref = XLSX.utils.encode_cell({c: c, r: i + 1});

                /*Форматирование не применяем, потому что у экселя свои форматы*/
                //if (columns[c].format)
                //    cell.z = columns[c].format;

                if (columns[c].id.indexOf('Id') > -1 && data[i][columns[c].id.replace('Id', 'Title')]) { //Зашьём логику для индикаторов
                    var indicatorName = columns[c].id.replace('Id', ''); //если в представлении много индикаторов - обработаем их по отдельности.
                    var indicatorColor = data[i][indicatorName + 'Color'];
                    var indicatorTitle = data[i][indicatorName + 'Title'];

                    if (indicatorColor)
                        cell.s = {fill: {fgColor: {rgb: colorNameToHexExcel(indicatorColor)}, patternType: 'solid'}};
                    if (indicatorTitle)
                        cell.v = indicatorTitle;

                    cell.t = 's';
                }
                /*Толку от этого в экселе нет. Либо там картинка, которую нельзя вставить в ячейку, либо там форматированный текст,
                 который тоже сложно в таком формате вставить в ячейку, просто вытащим title, alt или чистый текст*/
                else if (columns[c].expression) {
                    try {
                        with (data[i]) {
                            var value = eval(columns[c].expression);

                            if (value !== null && value !== undefined) {
                                delete cell.z;
                                if (value.toString().indexOf('<') > -1) { //Это html - его надо преобразовать в простой текст
                                    var val = $(value);

                                    value = val.attr('title') || val.attr('alt') || val.text();
                                    if (value) {
                                        cell.v = value.toString();

                                        cell.t = 's';
                                    }
                                }
                                else {
                                    cell.v = value;
                                }
                            }
                        }
                    } catch (error) {

                    }
                }


                if (typeof cell.v === 'number') cell.t = 'n';
                else if (typeof cell.v === 'boolean') {
                    cell.v = cell.v ? Globa.Yes.locale() : Globa.No.locale();
                    cell.t = 's';
                }
                else if (cell.v instanceof Date) {
                    cell.t = 'n';
                    cell.z = XLSX.SSF._table[14];
                    cell.v = datenum(cell.v);
                }


                ws[cell_ref] = cell;
            }

            for (var j = 0; j < groups.length; j++) {
                var item = data[i][groups[j].name];

                if (item == null) continue;

                var cell = {v: item, t: 's'};
                var cell_ref = XLSX.utils.encode_cell({c: c + j, r: i + 1});

                ws[cell_ref] = cell;
            }
        }

        range.e.c = c + j - 1;
        range.e.r = i;

        if (isNaN(range.e.c))
            range.e.c = 0;
        ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
    }


    var columns = result.columns;
    var data = result.data;
    var groups = [];

    if (columns[0].id == "_checkbox_selector") //Пропустим первую колонку с галочками, если она есть.
        columns = columns.slice(1);

    if (columns[columns.length - 1].id == "_like_selector") //Пропустим последнюю колонку с лайками, если она есть.
        columns = columns.slice(0, columns.length - 1);

    var wb = {};
    wb.SheetNames = [];
    wb.Sheets = {};

    var ws = sheetData(data, columns, groups);

    wb.SheetNames.push(viewName);
    wb.Sheets[viewName] = ws;

    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true});
    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), viewName + ' ' + Asyst.date.format(new Date(), 'yyyyMMdd-HHmm') + ".xlsx");
    //saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), viewName + ' ' + Asyst.date.format(new Date(), 'yyyyMMdd-HHmm', true) + ".xlsx");

}