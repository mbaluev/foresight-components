function templateProcessObj(template, obj) {
    var s = template;
    for (var prop in obj) {
        if (prop) {
            while (s.indexOf("{" + prop + "}") >= 0)
                s = s.replace("{" + prop + "}", obj[prop]);
        }
    }
    return s;
}

var Grid = {};

Grid.Create = function (element, data, columns, options, groups, dataParams, filters, viewSample) {
    var gridView = {};
    element.empty();
    gridView.CollapseAllGroups = function () {
        gridView.DataView.beginUpdate();
        for (var i = 0; i < gridView.DataView.getGroups().length; i++) {
            gridView.DataView.collapseGroup(gridView.DataView.getGroups()[i], true);
        }
        gridView.DataView.endUpdate();
    };

    gridView.ExpandAllGroups = function () {
        gridView.DataView.beginUpdate();
        for (var i = 0; i < gridView.DataView.getGroups().length; i++) {
            gridView.DataView.expandGroup(gridView.DataView.getGroups()[i], true);
        }
        gridView.DataView.endUpdate();
    };

    gridView.SetGroupsCollapsed = function (collapsedGroups) {
        //получаем группы. ходим по группам, если текущая группа в числе свернутых - пихаем её в список и всех её последователей (тупо, но придётся)
        gridView.DataView.beginUpdate();
        var originalGroups = gridView.DataView.getGroups();
        //объект со свернутыми группами, которые нужно будет поставить в датавью
        var collapsedForDataView = {};


        var processGroup = function (group) {
            if (group && group.hasOwnProperty('value')) {
                if (collapsedGroups.hasOwnProperty(crc32(gridView.DataView.getGroupPath(group)))) {
                    processCollapsedGroup(group);
                }
                else {
                    for (var j = 0; j < group.groups.length; j++) {
                        processGroup(group.groups[j]);
                    }
                }
            }
        };
        var processCollapsedGroup = function (group) {
            collapsedForDataView[gridView.DataView.getGroupPath(group)] = true;
            for (var j = 0; j < group.groups.length; j++) {
                processCollapsedGroup(group.groups[j]);
            }
        };

        for (var i = 0; i < originalGroups.length; i++) {
            processGroup(originalGroups[i]);
        }

        gridView.DataView.setCollapsedGroups(collapsedForDataView);
        gridView.DataView.endUpdate();
    };

    if (!options) {
        options = {
            enableCellNavigation: true,
            editable: false,
            autoHeight: false
        };
    }

    var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
    var dataView = new Slick.Data.DataView({
        groupItemMetadataProvider: groupItemMetadataProvider
        //inlineFilters: true
    });

    var groupings = [];
    for (var g in groups) {
        groupings.push({
            Getter: groups[g].name,
            Formatter: function (group) {
                return group.value + '&nbsp;&nbsp;<span style="color:gray">(' + group.totalCount + ')</span>';
            }
        });
    }

    dataView.groupBy(groupings);

    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });

    var cols = columns;
    cols.unshift(checkboxSelector.getColumnDefinition());
    var visibleCols = cols;

    if (viewSample) {
        //ширина
        for (var c in cols) {
            if (viewSample.columns.hasOwnProperty(cols[c].id)) {
                cols[c].width = viewSample.columns[cols[c].id].width;
                cols[c].visible = viewSample.columns[cols[c].id].visible;
            }
        }

        //порядок
        var oneCols = Enumerable.From(cols);
        var twoCols = Enumerable.From(viewSample.columns);
        cols = oneCols.OrderBy(function (a) {
            var d = twoCols.Where(function (b) {
                return b.Key == a.id;
            }).SingleOrDefault();
            if (d === undefined || d === null)
                return -1;
            else return Number(d.Value.order);

        }).ToArray();

        visibleCols = Enumerable.From(cols).Where('$.visible==true').ToArray();
    }

    if (window["IsEntitySocialView"] == 1)
        if (Slick.LikeColumn) {
            var like = new Slick.LikeColumn({
                cssClass: "slick-cell-likecolumn"
            });

            cols.push(like.getColumnDefinition());
        }

    var grid = new Slick.Grid(element, dataView, visibleCols, options);
    $(element).data('slickgrid', grid);

    //var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));
    grid.registerPlugin(groupItemMetadataProvider);

    var columnpicker = new Slick.Controls.ColumnPicker(cols, grid, options);
    if (options.rowSelectionModel)
        grid.setSelectionModel(options.rowSelectionModel);
    grid.registerPlugin(checkboxSelector);

    gridView.DataView = dataView;
    gridView.Grid = grid;
    gridView.Data = data;
    gridView.Columns = cols;
    gridView.Options = options;
    gridView.DataParams = dataParams;
    gridView.Filters = filters;
    gridView.Groups = groups;
    gridView.QuickFilterVals = {};

    var sortcol = "";
    var sortdir = 1;

    function comparer(a, b) {
        var x = a[sortcol], y = b[sortcol];
        return (x == y ? 0 : (x > y ? 1 : -1));
    }

    function setCompare(sortAsc, fieldName) {
        sortdir = sortAsc ? 1 : -1;
        sortcol = fieldName;

        dataView.sort(comparer, sortAsc);
    }

    grid.onSort.subscribe(function (e, args) {
        setCompare(args.sortAsc, args.sortCol.field);
    });

    //gridView.DataView.onRowCountChanged.subscribe(function (e, args) {
    //    grid.measureHeights();
    //    grid.updateRowCount();
    //    grid.render();
    //});

    //gridView.DataView.onRowsChanged.subscribe(function (e, args) {
    //    grid.invalidateRows(args.rows);
    //    grid.render();
    //});

    gridView.DataView.beginUpdate();
    gridView.DataView.setItems(data);
    gridView.DataView.setFilterArgs({
        searchString: ""
    });

    gridView.DataView.setFilter(Grid.QuickFilter);


    if (viewSample && viewSample.hasOwnProperty("sortColumns") && viewSample.sortColumns.length > 0) {
        gridView.Grid.setSortColumns(viewSample.sortColumns);
        setCompare(viewSample.sortColumns[0].sortAsc, viewSample.sortColumns[0].columnId);
    }

    gridView.DataView.endUpdate();

    gridView.DataView.setFilterArgs({
        searchString: ""
    });

    gridView.DataView.onRowCountChanged.subscribe(function (e, args) {
        grid.measureHeights();
        grid.updateRowCount();
        grid.render();
    });

    gridView.DataView.onRowsChanged.subscribe(function (e, args) {
        grid.invalidateRows(args.rows);
        grid.render();
    });

    if (options.initiallyCollapsed && dataView.getGroups().length > 0) {
        gridView.CollapseAllGroups();
    } else {
        grid.measureHeights();
        grid.updateRowCount();
        grid.render();
    }

    gridView.Reload = function (viewName) {
        Loader.show();
        var params = splitGETString();

        Asyst.APIv2.View.load({
            viewName: viewName,
            data: gridView.DataParams,
            success: function(loadData) {
                gridView.Data = loadData.data;
                gridView.DataView.setItems(loadData.data);
                gridView.Grid.invalidateAllRows();
                gridView.Grid.render();
                Loader.hide();
            },
            error: function() {
                Loader.hide();
            },
            async: false
        });
    };

    gridView.UpdateQuickFilter = function (searchString) {
        var args = gridView.DataView.getFilterArgs();
        args = $.extend(args, {searchString: searchString, gridView: gridView});
        gridView.DataView.setFilterArgs(args);
        gridView.DataView.refresh();
        gridView.DataView.syncGridSelection(grid, true, true);
        grid.invalidate();
    };

    gridView.QuickFilterKeyup = function (e) {
        Slick.GlobalEditorLock.cancelCurrentEdit();

        if (e.which == 27) {
            this.value = "";
        }

        gridView.UpdateQuickFilter(this.value);
    };

    gridView.QuickFilterClear = function () {
        Slick.GlobalEditorLock.cancelCurrentEdit();

        gridView.UpdateQuickFilter("");
        $('#BrowseSearch').val("");
    };


    gridView.ClearGrouping = function () {
        gridView.DataView.groupBy(null);
    };

    gridView.GetSelectedItems = function () {
        var result = [];

        var rows = this.Grid.getSelectedRows();
        if (jQuery.isArray(rows)) {
            for (var i = 0; i < rows.length; i++)
                result.push(this.Grid.getDataItem(rows[i]));
        }

        return result;
    };

    gridView.DeleteSelected = function () {
        if (!this.Grid.EntityName || !this.Grid.KeyName)
            return false;

        var g = this;
        var items = g.GetSelectedItems();


        if (!items || items.length === 0) {
            alert(Globa.CheckDocumentsDeleting.locale());
            return false;
        }

        if (!confirm(Globa.ConfirmDocumentsDeleting.locale()))
            return false;

        var fail = function (errorThrown, text, context) {
            if (errorThrown == 'ReferenceErorr')
                ErrorHandler(Globa.DeleteReferenceError.locale(), text);
            else
                ErrorHandler(Globa.DeletingError.locale(), text);
        };

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item[g.Grid.KeyName]) {

                var success = function () {
                    g.DataView.deleteItem(item.id);
                };

                if (Asyst.APIv2.Entity.delete({ entityName: g.Grid.EntityName, dataId: item[g.Grid.KeyName], success: success, error: fail, async: false })) {
                }
                else
                    return false;
            }
        }

        this.ClearSelected();
        return true;
    };

    gridView.ClearSelected = function () {
        if (!this.Grid.EntityName || !this.Grid.KeyName)
            return false;

        this.Grid.setSelectedRows([]);
        return true;
    };


    gridView.ExtendFilter = function () {
        Grid.ShowFilterWindow(this);
    };

    gridView.getViewSample = function () {
        var viewSample = {};
        var view = this;
        viewSample.version = '0.2';
        viewSample.viewName = view.viewName;
        viewSample.filterArgs = clone(view.DataView.getFilterArgs());
        delete viewSample.filterArgs.gridView;//в аргументах есть ссылка на вьюху - убираем её.
        viewSample.sortColumns = view.Grid.getSortColumns();
        viewSample.viewport = view.Grid.getViewport();
        var gridColumns = view.Grid.getColumns();
        var viewColumns = view.Columns;

        viewSample.columns = {};
        //сначала по колонкам которые на экране
        for (var c in gridColumns) {
            var columnSettings = {};
            columnSettings.visible = true;
            columnSettings.width = gridColumns[c].width;
            columnSettings.order = c;
            viewSample.columns[gridColumns[c].id] = columnSettings;
        }
        //теперь по колонкам пришедшим с сервера, чтобы найти "выключенные"
        for (var c in viewColumns) {
            if (viewSample.columns.hasOwnProperty(viewColumns[c].id)) continue;

            var columnSettings = {};
            columnSettings.visible = false;
            columnSettings.width = viewColumns[c].width;
            columnSettings.order = -1;
            viewSample.columns[viewColumns[c].id] = columnSettings;
        }
        //теперь сохраняем свернутые группировки
        var collapsedGroups = {};
        var saveGroup2 = function (groups) {
            for (var c = 0; c < groups.length; c++) {
                if (groups[c].collapsed === true) {
                    collapsedGroups[crc32(view.DataView.getGroupPath(groups[c]))] = true;
                } else if (groups[c].collapsed === false) {
                    saveGroup2(groups[c].groups);
                }
            }
            return collapsedGroups;
        };
        viewSample.groups = saveGroup2(view.DataView.getGroups());
        viewSample.guid = guid();

        //может быть длительной операцией!
        //по тестам на моей машине - 220мс на крымские поручения в 5мб json
        viewSample.datastamp = crc32(JSON.stringify(view.Data));

        return viewSample;
    };

    gridView.viewSampleMenuRebuild = function () {
        $("#right-menu").find(".dropdown-menu").find("li:not([id],.ext-filter-menu)").show();
        $('#viewSampleMenu .divider').first().nextUntil($('#viewSampleMenu .divider').last()).remove();
        var i = 0;
        if (Asyst.Workspace.views && Asyst.Workspace.views[this.viewName]) {
            for (var sampleName in Asyst.Workspace.views[this.viewName].viewSamples) {
                i++;
                var sample = Asyst.Workspace.views[this.viewName].viewSamples[sampleName];
                var s =
                    '<li><a href="javascript: viewName = \'' + viewName + '\'; showBrowser(\'#view\', \'' + viewName + '\', \'' + sample + '\');void(0);" data-viewsampleid="' + sample + '">' + sampleName + '</a></li>';
                $('#viewSampleMenu .divider').first().after(s);
            }
        }
        if (i === 0) {
            $('#sampleMenuDividerSecond').hide();
        } else {
            $('#sampleMenuDividerSecond').show();
        }
    };

    gridView.viewSampleSetCurrentName = function (value) {
        $('#viewSampleSelectBtn').text(value);
    };

    gridView.saveNamedViewSample = function () {
        var that = this;
        var sendData = function () {
            var name = $('input[type="text"]#sampleName').val();
            if (name == '') {
                setInputWarning('#sampleName', true, Globa.FillField.locale());
                return;
            } else {
                setInputWarning('#sampleName', false);
            }
            name = name.replace('\n', ' ').substring(0, 250);

            var sample = that.getViewSample();
            sample.name = name;
            if (Asyst.Workspace.views[viewName].viewSamples[name])
                sample.guid = Asyst.Workspace.views[viewName].viewSamples[name];

            Asyst.APIv2.ViewSample.save({ viewName: viewName, data: { name: sample.name, guid: sample.guid, sample: JSON.stringify(sample) }, async: false});
            Asyst.Workspace.views[viewName].viewSamples[name] = sample.guid;
            that.viewSampleMenuRebuild();
            that.viewSampleSetCurrentName(name);
            $('#' + requestDialogId).modal('hide');
        };
        var requestsHtml = Globa.ViewSampleTypeNameBelow.locale();
        requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><div class="controls"><input type="text" id="sampleName" class="span6" style="width:450px;" rel="tooltip" title=""></textarea>' +
            '<span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span>' +
            '<span class="help-inline"></span></div></div>';
        var requestDialogId = Dialog(Globa.ViewSampleTypeName.locale(), requestsHtml, [{
            text: Globa.Continue.locale(),
            cls: 'btn-warning',
            click: sendData,
            close: false
        }, {text: Globa.Cancel.locale()}]);
    };

    gridView.deleteNamedViewSample = function () {
        var that = this;
        var requestHtml = " ";//убираем текст про удаляемую выборку= Globa.ViewSampleSelectForDelete.locale();

        var els = $('#viewSampleMenu li a[data-viewSampleId]');
        requestHtml += '<div class="row-fluid"><select class="selectName span12 chosen-select" id="deletedViewSample">';
        els.each(function () {
            requestHtml += '<option value="' + $(this).data('viewsampleid') + '">' + $(this).text() + '</option>';
        });
        requestHtml += "</select></div>";
        var deleteViewSample = function () {

            var viewSampleId = $('#deletedViewSample').val();
            if (viewSampleId != '') {
                Asyst.APIv2.ViewSample.delete({
                    viewName: viewName, data: { viewSampleId: viewSampleId }, success: function () {
                        var deletedName = $('#deletedViewSample option:selected').text();
                        delete Asyst.Workspace.views[viewName].viewSamples[deletedName];
                        that.viewSampleMenuRebuild();
                        if ($('#viewSampleSelectBtn').text() == deletedName) {
                            that.viewSampleSetCurrentName(Globa.ViewSampleDefault.locale());
                            showBrowser('#view', viewName, null);
                        }
                    }, async: false
                });
            }
        };
        var requestDialogId = Dialog(Globa.ViewSampleDelete.locale(), requestHtml, [{
            text: Globa.Continue.locale(),
            cls: 'btn-warning',
            click: deleteViewSample
        }, {text: Globa.Cancel.locale()}]);
        $('#deletedViewSample').chosen();
    };


    gridView.saveCurrent = function () {
        var sample = this.getViewSample();
        sample.name = name;
        Asyst.APIv2.ViewSample.save({ viewName: viewName, data: { sample: JSON.stringify(sample) }, async: true});
    };

    window.onbeforeunload = function () {
        //todo что-нибудь, чтобы два вьювера работали сразу
        gridView.saveCurrent();

        return undefined;
    };

    return gridView;
};

Grid.QuickFilter = function (item, args) {
    if (!args.searchString)
        return true;

    for (var i in args.gridView.Columns) {

        var column = args.gridView.Columns[i];
        var val;

        if (item[column.field]) {
            if (args.gridView.QuickFilterVals.hasOwnProperty(item.id) && args.gridView.QuickFilterVals[item.id].hasOwnProperty(column.id)) {
                val = args.gridView.QuickFilterVals[item.id][column.id];
            }
            else {
                if (column.format)
                    val = column.formatter(0, 0, item[column.field], column, item);
                else if (column.expression) {
                    var formed = column.formatter(0, 0, item[column.field], column, item);
                    if (formed[0] == '<' && formed[formed.length - 1] == '>') {
                        val = $(formed).text();
                    } else {
                        val = $("<span>" + formed + "</span>").text();
                    }
                }

                else
                    val = (item[column.field] + '');
                if (!args.gridView.QuickFilterVals.hasOwnProperty(item.id))
                    args.gridView.QuickFilterVals[item.id] = {};
                args.gridView.QuickFilterVals[item.id][column.id] = val;
            }
            if (val.toUpperCase().indexOf(args.searchString.toUpperCase()) >= 0)
                return true;
        }
    }
    return false;
};

Grid.ExtFilterOper = {
    '=': {
        func: function (left, right) {
            return left == right;
        },
        title: Globa.Equal.locale()
    },
    '>': {
        func: function (left, right) {
            return left > right;
        },
        title: Globa.Great.locale()
    },
    '>=': {
        func: function (left, right) {
            return left >= right;
        },
        title: Globa.GreatOrEqual.locale()
    },
    '<': {
        func: function (left, right) {
            return left < right;
        },
        title: Globa.Less.locale()
    },
    '<=': {
        func: function (left, right) {
            return left <= right;
        },
        title: Globa.LesssOrEqual.locale()
    },
    '<>': {
        func: function (left, right) {
            return left != right;
        },
        title: Globa.NotEqual.locale()
    },
    'like': {
        func: function (left, right) {
            var re = new RegExp('.*' + right + '.*', 'gi');
            return re.test(left);
        },
        title: Globa.Contain.locale()
    },
    'notlike': {
        func: function (left, right) {
            var re = new RegExp('.*' + right + '.*', 'gi');
            return !re.test(left);
        },
        title: Globa.NotContain.locale()
    },
    'started': {
        func: function (left, right) {
            var re = new RegExp(right + '.*', 'gi');
            return re.test(left);
        },
        title: Globa.Started.locale()
    },
    /*case 'in':
     {
     var arr;
     var sep = ',';
     if (filterItem.value.constructor == Array)
     arr = filterItem.value;
     else {
     if (filterItem.separator) sep = separator;
     arr = filterItem.value.toString().split(sep);
     }
     result = false;
     for (var i = 0; i < arr.length; i++)
     if (arr[i] == item[filterItem.column]) result = true;
     }*/
};

Grid.ExtFilter = function (item, args) {
    if (!args || !args.filterItems || !args.oper || !args.constructor == Array)
        return true;

    var result;

    for (var ind = 0; ind < args.filterItems.length; ind++) {
        var filterItem = args.filterItems[ind];
        var left = item[filterItem.column];
        var right = filterItem.value;
        if (left && left.constructor == Date) {
            left = left.valueOf();
            if (right && right.constructor == Date) right = right.valueOf();
            else if (right && right.constructor == String) right = Asyst.date.parse(right).valueOf();
        }
        //if (right && right.constructor == Date) 


        if (Grid.ExtFilterOper.hasOwnProperty(filterItem.oper))
            result = Grid.ExtFilterOper[filterItem.oper].func(left, right);
        else result = false;// если операцию не нашли - шлём лесом

        if (result === false && args.oper === 'and') return result;
        if (result === true && args.oper === 'or') return result;
    }
    //если совместность AND и дошли до конца, значит false нигде не было по ходу выполнения и возвращаем true
    if (args.oper == 'and') return true && Grid.QuickFilter(item, args);

    //если совместность OR и дошли до конца, значит true нигде не было по ходу выполнения и возвращаем false
    if (args.oper == 'or') return false && Grid.QuickFilter(item, args);
    return false;
};

Grid.DefaultFormatter = function (row, cell, cellValue, columnDef, dataContext) {

    var value = cellValue;

    if (columnDef.expression) {
        try {
            with (dataContext) {
                value = eval(columnDef.expression);
            }
        } catch (error) {
            value = error;
        }
    }

    if (value == null || value === "") {
        return "";
    } else if (value instanceof Date) {
        if (columnDef.format)
            value = Asyst.date.format(value, columnDef.format, true);
        else if (columnDef.kind == "datetime")
            value = Asyst.date.format(value, Asyst.date.defaultDateTimeFormat, true);
        else if (columnDef.kind == "date")
            value = Asyst.date.format(value, Asyst.date.defaultDateFormat, true);
        else if (columnDef.kind == "time")
            value = Asyst.date.format(value, Asyst.date.defaultTimeFormat, true);
        else
            value = Asyst.date.format(value, Asyst.date.defaultFormat, true);
    } else if (typeof (value) == "boolean") {
        if (value)
            value = Globa.Yes.locale();
        else
            value = Globa.No.locale();
    } else if (typeof (value) == "number") {
        if (columnDef.format) {
            value = Asyst.number.format(value, columnDef.format);
        }
    }

    return value;
};

Grid.LinkFormatter = function (row, cell, value, column, data) {
    var s = '';
    if (column.formatter && column.formatter != Grid.LinkFormatter)
        s = column.formatter(row, cell, value, column, data);
    else
        s = Grid.DefaultFormatter(row, cell, value, column, data);

    var url = templateProcessObj(column.url, data);
    return "<a href='" + url + "'>" + s + "</a>";
};

Grid.ComboFormatter = function (row, cell, value, columnDef, dataContext) {
    if (value !== undefined && value !== null && value != "") return Grid.DefaultFormatter(row, cell, value, columnDef, dataContext);
    else return '<i>' + Globa.SelectValue.locale() + '</i>';
};

Grid.ExportToHTML = function () {

    var grid = window[Model.CurrentViewName];
    var data = grid.DataView.getItems();
    var columns = grid.Columns;
    var html = "\uFEFF";
    html += "<table>";

    //пишем заголовки
    html += " <tr>";
    for (var i = 0; i < columns.length; i++) {
        if ((columns[i].kind === "text" || columns[i].kind === "datetime" || columns[i].kind === "date" || columns[i].kind === "object" || columns[i].kind === "integer") && !columns[i].expression)
            html += "<th>" + columns[i].name + "</th>";
    }
    html += "</tr>";

    //пишем данные
    for (var i = 0; i < data.length; i++) {
        html += " <tr>";
        for (var j = 0; j < columns.length; j++) {
            if ((columns[j].kind == "text" || columns[j].kind == "datetime" || columns[j].kind === "date" || columns[j].kind === "object" || columns[j].kind === "integer") && !columns[j].expression) {
                //получаем текст из форматтера колонки
                var formattext = (columns[j].formatter(null, null, data[i][columns[j].field], columns[j], data[i])).toString();
                //пытаемся преобразовать относительные ссылки в абсолютные. два прохода для двух видов кавычек
                if (formattext.indexOf('<a href="/asyst/') != -1)
                    formattext = formattext.replace('<a href="/', '$`<a href="' + location.protocol + '//' + location.host + "/");
                if (formattext.indexOf("<a href='/asyst") != -1)
                    formattext = formattext.replace("<a href='/", "$`<a href='" + location.protocol + "//" + location.host + "/");
                //добавляем получившийся текст в таблицу
                html += "<td>" + formattext + "</td>";
            }
        }
        html += "</tr>";
    }

    html += "</table>";

    var form = $('<form target="_blank" action="/asystSPUtil/SPUtil.asmx/SaveExcelExport" method="POST">\
<input class="postFormHtml" type="text" size="50" name="html" value="">\
</form>');
    $(form).find('input.postFormHtml').attr('value', html);
    $('body').append(form);
    form.submit();
    setTimeout(function () {
        form.remove();
    }, 100); // cleanup


    //var invokeSettings = { service: "/asystSPUtil/SPUtil.asmx", method: "SaveExcelExport", tooltip: "Выгрузка в Excel", params: { html: html } };
    //CallService.Invoke(invokeSettings);
    //window.open('data:application/vnd.ms-excel,' + html);
};

Grid.ExportToXlsx = function () {

    function datenum(v, date1904) {
        if (date1904) v += 1462;
        var epoch = Date.parse(v);
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

    var viewName = Model.CurrentViewName;
    var grid = window[viewName];
    //var data = grid.Grid.getData().getFilteredAndPagedItems(grid.DataView.getItems()).rows;
    var columns = grid.Grid.getColumns();
    var dataGroups = window[viewName].DataView.getGroups();

    var data = []; //массив с данными мы заполним по содержимому групп, в том порядке, в котором они расположены в представлении.
    var addGroupsRow = function (gr) {
        if (gr.rows)
            data = data.concat(gr.rows);

        for (var g in gr.groups) {
            addGroupsRow(gr.groups[g]);

        }

    };
    for (var g in dataGroups) {
        addGroupsRow(dataGroups[g]);
    }

    if (data.length === 0)
        data = grid.Grid.getData().getFilteredAndPagedItems(grid.DataView.getItems()).rows;

    var groups = grid.Groups;

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

};

Grid.ExportToCSV = function () {
    var ququotes = function (str) {
        return '"' + str.replace('"', '""') + '"';
    };
    var delimiter = ",";
    var lineEnd = "\n";
    var grid = window[Model.CurrentViewName];
    var data = grid.DataView.getItems();
    var itemCount = grid.Grid.getDataLength();
    var columns = grid.Columns;
    var csv = "\uFEFF";

    //пишем заголовки

    for (var i = 0; i < columns.length; i++) {
        if ((columns[i].kind === "text" || columns[i].kind === "datetime" || columns[i].kind === "date" || columns[i].kind === "object" || columns[i].kind === "integer") && !columns[i].expression)
            csv += ququotes(columns[i].name) + delimiter;
    }
    csv += lineEnd;

    //пишем данные
    for (var i = 0; i < itemCount; i++) {
        var dataI = grid.Grid.getDataItem(i);
        if (dataI.hasOwnProperty('__group') && dataI.hasOwnProperty('__group') == true) continue;
        else {

            for (var j = 0; j < columns.length; j++) {
                if ((columns[j].kind == "text" || columns[j].kind == "datetime" || columns[j].kind === "date" || columns[j].kind === "object" || columns[j].kind === "integer") && !columns[j].expression) {
                    //получаем текст из форматтера колонки
                    var formattext = (columns[j].formatter(null, null, dataI[columns[j].field], columns[j], dataI)).toString();
                    //пытаемся преобразовать относительные ссылки в абсолютные. два прохода для двух видов кавычек
                    if (formattext.indexOf('<a href="/asyst/') != -1)
                        formattext = formattext.replace('<a href="/', '$`<a href="' + location.protocol + '//' + location.host + "/");
                    if (formattext.indexOf("<a href='/asyst") != -1)
                        formattext = formattext.replace("<a href='/", "$`<a href='" + location.protocol + "//" + location.host + "/");
                    //добавляем получившийся текст в таблицу
                    csv += ququotes(formattext) + delimiter;
                }
            }
            csv += lineEnd;
        }
    }

    $('<a></a>')
        .attr('id', 'downloadFile')
        .attr('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(csv))
        .attr('download', 'export.csv')
        .appendTo('body');

    $('#downloadFile').ready(function () {
        $('#downloadFile').get(0).click();
    });
    //window.open('data:application/csv;charset=utf-8,' + encodeURIComponent(csv));

    //var invokeSettings = { service: "/asystSPUtil/SPUtil.asmx", method: "SaveExcelExport", tooltip: "Выгрузка в Excel", params: { html: html } };
    //CallService.Invoke(invokeSettings);
    //window.open('data:application/vnd.ms-excel,' + html);
};

Grid.SelectCellEditor = function (args) {
    var $select;
    var defaultValue;
    var scope = this;
    var onApply = null;
    var values = {};

    this.init = function () {
        var optValues;
        var opts;
        if (args.column.options) {
            optValues = args.column.optionValues.split(',');
            opts = args.column.options.split(',');
        } else {
            optValues = "yes,no".split(',');
            opts = "yes,no".split(',');
        }
        if (args.column.onApply)
            onApply = args.column.onApply;

        var optionStr = "";
        for (var i in optValues) {
            values[optValues[i]] = opts[i];
            optionStr += "<OPTION value='" + optValues[i] + "'>" + opts[i] + "</OPTION>";
        }
        $select = $("<SELECT tabIndex='0' style='margin-top:-4px; margin-left:-4px'  class='chosen-select'>" + optionStr + "</SELECT>");
        $select.appendTo(args.container);
        $select.focus();
        $select.on('change', function () {
            var el = args.grid.getOptions().editorLock;
            if (el.isActive) el.commitCurrentEdit();
        });
        //$select.chosen();
    };

    this.destroy = function () {
        $select.remove();
    };

    this.focus = function () {
        $select.focus();
    };

    this.loadValue = function (item) {
        defaultValue = item[args.column.field];
        $select.val(defaultValue);
    };

    this.serializeValue = function () {
        if (args.column.options) {
            return $select.val();
        } else {
            return ($select.val() == "yes");
        }
    };

    this.applyValue = function (item, state) {
        item["__oldValue"] = item[args.column.field + "Id"];
        item[args.column.field] = values[state];
        item[args.column.field + "Id"] = state;
        if (onApply)
            onApply(item, args.column);
    };

    this.isValueChanged = function () {
        return ($select.val() != defaultValue);
    };

    this.validate = function (data) {
        if (!args.column.validator)
            return {valid: true, msg: null};
        else return args.column.validator(data);
    };

    this.init();
};

Grid.LongTextEditor = function (args) {
    var $input, $wrapper;
    var defaultValue;
    var scope = this;
    var onApply = null;

    this.init = function () {
        var $container = $("body");

        $wrapper = $("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
            .appendTo($container);

        $input = $("<TEXTAREA hidefocus rows=5 style='background:white;width:250px;height:80px;border:0;outline:0'>")
            .appendTo($wrapper);

        $("<DIV style='text-align:right'><BUTTON>Ok</BUTTON><BUTTON>Отмена</BUTTON></DIV>")
            .appendTo($wrapper);

        $wrapper.find("button:first").bind("click", this.save);
        $wrapper.find("button:last").bind("click", this.cancel);
        $input.bind("keydown", this.handleKeyDown);

        if (args.column.onApply)
            onApply = args.column.onApply;
        scope.position(args.position);
        $input.focus().select();
    };

    this.handleKeyDown = function (e) {
        if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
            scope.save();
        } else if (e.which == $.ui.keyCode.ESCAPE) {
            e.preventDefault();
            scope.cancel();
        } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
            e.preventDefault();
            grid.navigatePrev();
        } else if (e.which == $.ui.keyCode.TAB) {
            e.preventDefault();
            grid.navigateNext();
        }
    };

    this.save = function () {
        args.commitChanges();
    };

    this.cancel = function () {
        $input.val(defaultValue);
        args.cancelChanges();
    };

    this.hide = function () {
        $wrapper.hide();
    };

    this.show = function () {
        $wrapper.show();
    };

    this.position = function (position) {
        $wrapper
            .css("top", position.top - 5)
            .css("left", position.left - 5);
    };

    this.destroy = function () {
        $wrapper.remove();
    };

    this.focus = function () {
        $input.focus();
    };

    this.loadValue = function (item) {
        $input.val(defaultValue = item[args.column.field]);
        $input.select();
    };

    this.serializeValue = function () {
        return $input.val();
    };

    this.applyValue = function (item, state) {
        item[args.column.field] = state;
        if (onApply)
            onApply(item, args.column);
        item[args.column.field] = state;
    };

    this.isValueChanged = function () {
        return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
        return {
            valid: true,
            msg: null
        };
    };

    this.init();
};

Grid.ShowFilterWindow = function (grid) {
    var filters = grid.Filters;
    //fitlers - array of {order:0, fieldName:'ProjectId', title:'Проект', kind:'text'\'date'\'bool'\'reference',reference:'project'}    
    var id = 'Filter' + Math.random().toString().substring(2);

    var fieldSelect = '<select class="selectName chosen-select" data-placeholder="' + Globa.SelectValue.locale() + '">';
    Enumerable.From(filters).OrderBy('$.order').ForEach(function (a) {
            fieldSelect += '<option value="' + a.fieldName + '">' + a.title + '</option>';
        }
    );
    fieldSelect += '</select>';

    var comparisonSelect = '<select class="selectComparison chosen-select" style="width:150px" data-placeholder="' + Globa.SelectValue.locale() + '">';
    for (var c in Grid.ExtFilterOper) {
        comparisonSelect += '<option value="' + c + '">' + Grid.ExtFilterOper[c].title + '</option>';
    }
    comparisonSelect += '</select>';

    var filterRow =
        '<tr>\
            <td>\
            <a class="icon-trash delete-filter-row"></a>\
            </td>\
            <td>\
              ' + fieldSelect + ' \
    </td>\
    <td>\
        ' + comparisonSelect + ' \
    </td>\
    <td>\
      <input type="text" class="value" style="margin-bottom:-1px;width: 300px;height: 15px;">  \
    </td>\
</tr>';

    var message = Globa.ShowLineFrom.locale();
    message += '<br><input type="radio" name="filterType" value="and" checked="true">' + Globa.AndTitle.locale() + '</input>';
    message += '<input type="radio" name="filterType" value="or" style="margin-left:20px">' + Globa.OrTitle.locale() + '</input>';
    message += '<table id="filtersTable">\
  <thead><tr><td></td><td>' + Globa.FieldName.locale() + '</td><td>' + Globa.Comparison.locale() + '</td><td>' + Globa.Value.locale() + '</td></tr></thead>\
  <tbody>';
    var filterArgs = grid.DataView.getFilterArgs();
    var hasFilters = filterArgs != null && filterArgs.hasOwnProperty('filterItems') && filterArgs.filterItems.length > 0;
    if (hasFilters) {
        for (var i = 0; i < filterArgs.filterItems.length; i++) {
            message += filterRow;
        }
    } else {
        message += filterRow;
    }

    message += '<tr><td colspan="4"><a id="addRowButton" class="icon-plus"></a> <br/><td></tr>';
    message +=
        ' </tbody>\
        </table>';


    var AcceptFilter = function () {
        var filterItems = [];
        var items = $('#filtersTable tbody tr');
        for (var i = 0; i < items.length - 1; i++) {
            var filterItem = {};
            filterItem.column = $(items[i]).find('.selectName').val();
            filterItem.oper = $(items[i]).find('.selectComparison').val();

            //filterItem.value = $(items[i]).find('input.value').val();
            var col = Enumerable.From(grid.Columns).Where('$.field =="' + filterItem.column + '"').FirstOrDefault();
            var val = $(items[i]).find('input.value').val();
            if (col && col.format) {
                filterItem.value = Asyst.date.parse(val);
                if (filterItem.value == 0)
                    filterItem.value = val;
            }
            else filterItem.value = val;

            filterItems.push(filterItem);
        }

        var filterArgs = grid.DataView.getFilterArgs();
        filterArgs = $.extend(filterArgs, {oper: $('[name=filterType]:checked').val(), filterItems: filterItems});
        $('#' + id).modal('hide');
        grid.DataView.setFilter(Grid.ExtFilter);
        grid.DataView.setFilterArgs(filterArgs);
        grid.DataView.refresh();
        //$('#BrowseSearchGroup').hide();
        MakeFilterLine(filterArgs);
    };
    var DeleteRow = function (event) {
        jQuery(event.target).parents('tr').remove();
    };
    var AddFilterRow = function (event) {
        //$('#' + id + ' #filtersTable tbody').append(filterRow);
        jQuery(event.target).parents('tr').before(filterRow);
        $('.chosen-select').chosen();
        jQuery(event.target).parents('tr').prev().find('a.delete-filter-row').on('click', DeleteRow);
    };

    Dialog(Globa.ExtFilter.locale(), message, [{
        text: '&nbsp;' + Globa.Accept.locale() + '&nbsp;',
        cls: 'btn-primary',
        click: AcceptFilter,
        close: true
    }, {text: '&nbsp;' + Globa.Cancel.locale() + '&nbsp;', click: false, close: true}], id);
    $('.chosen-select').chosen();
    $('#' + id).css({top: '30%', left: '40%', width: '720px'});
    $('#addRowButton').on('click', AddFilterRow);
    $('.delete-filter-row').on('click', DeleteRow);
    //если были фильтры - восстанавливаем их значения
    if (hasFilters) {
        if (filterArgs.oper == 'or') {
            $('input[name=filterType][value=or]').attr('checked', 'true');
        }
        var names = $('.selectName');
        var opers = $('.selectComparison');
        var values = $('input.value');
        for (var i = 0; i < filterArgs.filterItems.length; i++) {
            $(names[i]).val(filterArgs.filterItems[i].column);
            $(opers[i]).val(filterArgs.filterItems[i].oper);
            var val = filterArgs.filterItems[i].value;
            if (val && val.constructor == Date)
                val = Asyst.date.format(val, Asyst.date.defaultDateFormat);
            $(values[i]).val(val);
        }
        $('.selectName').trigger('chosen:updated');
        $('.selectComparison').trigger('chosen:updated');
    }
};

Grid.ClearExtFilter = function (grid) {
    var args = grid.DataView.getFilterArgs();
    delete args.oper;
    delete args.filterItems;
    grid.DataView.setFilter(Grid.QuickFilter);

    grid.DataView.setFilterArgs(args);
    grid.DataView.refresh();
    $('#filter-line').hide();
    $('.wrapper').resize();
    //$('#BrowseSearchGroup').show();
};

