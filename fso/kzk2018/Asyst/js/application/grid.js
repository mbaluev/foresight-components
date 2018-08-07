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
    gridView.QuickFilterVals = [];

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
        grid.measureHeights();
        grid.invalidate();
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
            success: function (loadData) {
                gridView.QuickFilterVals = [];
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
            return;

        var g = this;
        var items = g.GetSelectedItems();


        if (!items || items.length === 0) {
            alert(Globa.CheckDocumentsDeleting.locale());
            return;
        }

        if (!confirm(Globa.ConfirmDocumentsDeleting.locale()))
            return;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item[g.Grid.KeyName]) {

                var success = function (item) {
                    return function() {
                        g.DataView.deleteItem(item.id);
                    }
                }(item);

                var fail = function (item) {
                    return function (errorThrown, text, context) {
                        if (errorThrown === 'ReferenceErorr')
                            ErrorHandler(Globa.DeleteReferenceError.locale(), text);
                        else if (errorThrown === 'DeletionRuleError')
                            NotifyWarning("Ошибка правила проверки при удалении сущности '" + item.Name + "'", text);
                        else
                            ErrorHandler(Globa.DeletingError.locale(), text);
                    }
                }(item);

                Asyst.APIv2.Entity.delete({
                    entityName: g.Grid.EntityName,
                    dataId: item[g.Grid.KeyName],
                    success: success,
                    error: fail,
                    async: true
                });
            }
        }

        this.ClearSelected();
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
        sample.name = '';
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

            var existedItem;
            var result = $.grep(args.gridView.QuickFilterVals, function (e) { return e["id"] === item.id });
            if (result.length === 0) {
                existedItem = null;
            } else if (result.length === 1) {
                existedItem = result[0];
            } else {
                console.error("Коллекция QuickFilterVals содержит более одного элемента с id = " + item.id);
                return false;
            }

            if (existedItem && existedItem.hasOwnProperty(column.id)) {
                val = existedItem[column.id];
            }
            else {
                if (column.format)
                    val = column.formatter(0, 0, item[column.field], column, item);
                else if (column.expression) {
                    var formed = column.formatter(0, 0, item[column.field], column, item);
                    if (formed[0] === '<' && formed[formed.length - 1] === '>') {
                        val = $(formed).text();
                    } else {
                        val = $("<span>" + formed + "</span>").text();
                    }
                }

                else
                    val = (item[column.field] + '');

                if (!existedItem) {
                    var newItem = [];
                    newItem["id"] = item.id;
                    args.gridView.QuickFilterVals.push(newItem);
                } else {
                    existedItem[column.id] = val;
                }
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

        if (!filterItem) continue;
        
        var left = item[filterItem.column];
        var right = filterItem.value;

        var itemType = filterItem.columnOptions && filterItem.columnOptions.kind || left.constructor.name || null;
        var itemFormat = filterItem.columnOptions && filterItem.columnOptions.format || null;
        var columnOptions = filterItem.columnOptions || {};

        //Костыль. Возможность фильтровать даты (без этого сравнивается по строке)
        if (filterItem.oper === "=" || filterItem.oper === "<>" || filterItem.oper === ">" || filterItem.oper === ">=" || filterItem.oper === "<" || filterItem.oper === "<=") {
            left = parseValue(left, itemType, itemFormat) || left;
            right = parseValue(right, itemType, itemFormat) || right;

            //Для фильтрации обе даты должны быть датами или строками
            if (!Grid._isDateType(itemType) || !isValidJSDate(left) || !isValidJSDate(right)
            ) {
                //Конвертация в строку по заданной маске
                left = Grid.DefaultFormatter(null, null, left, columnOptions, item);
                right = Grid.DefaultFormatter(null, null, right, columnOptions, item);
            }
        } else {
            left = Grid.DefaultFormatter(null, null, left, columnOptions, item);
            right = Grid.DefaultFormatter(null, null, right, columnOptions, item);
        }

		left = left.valueOf();
		right = right.valueOf();

        if (Grid.ExtFilterOper.hasOwnProperty(filterItem.oper))
            result = Grid.ExtFilterOper[filterItem.oper].func(left, right);
        else result = false;// если операцию не нашли - шлём лесом

        if (result === false && args.oper === 'and') return result;
        if (result === true && args.oper === 'or') return result;
    }
    //если совместность AND и дошли до конца, значит false нигде не было по ходу выполнения и возвращаем true
    if (args.oper == 'and') return true && Grid.QuickFilter(item, args);

    //если совместность OR и дошли до конца, значит true нигде не было по ходу выполнения и возвращаем false
    if (args.oper == 'or') return false;
    return false;

    function isValidJSDate(date) {
        return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
    }

    function parseValue(value, type, format) {
        var parser = getParser(type, value);
        if (!parser) return value;

        var parsedValue = parser(value, format);
        return parsedValue;
    }

    function getParser(type, value) {
        if (!type) {
            if (!value) return null;
            type = value.constructor.name;
        }

        if (Grid._isDateType(type))
            return Asyst.date.parse;
        else if (Grid._isNumberType(type))
            return Asyst.number.pasrse;
        else
            return null
    }
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

    var url = new LinkService.Url(templateProcessObj(column.url, data));

    return "<a href='" + url.getLink()+"' data-save-tab-and-go='" + url.getLink() + "'>" + s + "</a>";
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

    var result = {
        data: data,
        columns: columns,
        groups: groups
    };

    ViewExport(viewName, result);
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


   
    function getFilterRow(filterInput) {
        if (!filterInput)
            filterInput = getFilterInputWithTextBox();//Default filter input
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
                '+ filterInput+'  \
            </td>\
        </tr>';
        return filterRow;
    }

    function getFilterInputWithCalendar() {
        return'<input type="text" class="value date-picker" style="margin-bottom:-1px;width: 300px;height: 15px;" data-datepicker="datepicker" >';
    }

    function getFilterInputWithTextBox() {
        return '<input type="text" class="value" style="margin-bottom:-1px;width: 300px;height: 15px;">';
    }

    var filterRow = getFilterRow(getHtmlInput(filters[0] && filters[0].kind));

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

    var extendedFilterId = Dialog(Globa.ExtFilter.locale(),
        message,[{
                text: '&nbsp;' + Globa.Accept.locale() + '&nbsp;',
                cls: 'btn-primary',
                click: acceptFilter,
                close: true
            },
            {
                text: '&nbsp;' + Globa.Cancel.locale() + '&nbsp;',
                click: false,
                close: true
            }],
        id);

    $('.chosen-select').chosen();
    $('#' + id).css({top: '30%', left: '40%', width: '720px'});
    $('#addRowButton').on('click', addFilterRow);
    $('.delete-filter-row').on('click', deleteRow);

    //First filter row
    var extendedFilterElement = $('#' + extendedFilterId);
    extendedFilterElement && extendedFilterElement.find('.date-picker').datepicker();
    extendedFilterElement && extendedFilterElement.find('.selectName.chosen-select').change(onFilterSelectChange);
    
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
            var inputType = filterArgs.filterItems[i].columnOptions && filterArgs.filterItems[i].columnOptions.kind;
            var inputElement = $(values[i]);
            if (inputType) {
                //var inputHtml = getHtmlInput(inputType);
                var currentRow = inputElement.parents('tr');

                inputElement = replaceInput(currentRow, inputType);

                //inputElement.replaceWith(inputHtml);
                //inputElement = currentRow.find('input.value');
                //inputElement.datepicker();
            }

            var val = filterArgs.filterItems[i].value;
            if (val && val.constructor == Date)
                val = Asyst.date.format(val, Asyst.date.defaultDateFormat);
            inputElement.val(val);
        }
        $('.selectName').trigger('chosen:updated');
        $('.selectComparison').trigger('chosen:updated');
    }

    function acceptFilter() {
        var filterItems = [];
        var items = $('#filtersTable tbody tr');
        for (var i = 0; i < items.length - 1; i++) {
            var filterItem = {};
            filterItem.column = $(items[i]).find('.selectName').val();
            filterItem.oper = $(items[i]).find('.selectComparison').val();

            var col = Enumerable.From(grid.Columns).Where('$.field =="' + filterItem.column + '"').FirstOrDefault();
            var val = $(items[i]).find('input.value').val();

            if (Grid._isDateType(col.kind))
                val = Asyst.date.parse(val, col.format) || val; // In case if Asyst.date.parse return '0'

            filterItem.columnOptions = col;
            filterItem.value = val;

            filterItems.push(filterItem);
        }

        var filterArgs = grid.DataView.getFilterArgs();
        filterArgs = $.extend(filterArgs, { oper: $('[name=filterType]:checked').val(), filterItems: filterItems });
        $('#' + id).modal('hide');
        grid.DataView.setFilter(Grid.ExtFilter);
        grid.DataView.setFilterArgs(filterArgs);
        grid.DataView.refresh();
        MakeFilterLine(filterArgs);
    };

    function deleteRow(event) {
        jQuery(event.target).parents('tr').remove();
    }

    function addFilterRow(event) {
        var filter = findFilter(grid.Filters, filters[0] && filters[0].fieldName);
        if (!filter) return;

        var inputHtml = getHtmlInput(filter.kind);

        var lastRow = jQuery(event.target).parents('tr').before(getFilterRow(inputHtml));
        var currentRow = lastRow.prev();
        currentRow.find('a.delete-filter-row').on('click', deleteRow);

        if (currentRow) {
            var selectedElements = currentRow.find('.chosen-select').chosen();
            selectedElements.filter('.selectName').change(onFilterSelectChange);
            currentRow.find('.date-picker').datepicker();
        }
    }

    function onFilterSelectChange(event, element) {
        var filter = findFilter(grid.Filters, element.selected);
        if (!filter) return;

        //var inputHtml = getHtmlInput(filter.kind);

        var currentRow = $(event.target).parents('tr');

        replaceInput(currentRow, filter.kind);
        //currentRow.find('input.value').replaceWith(inputHtml);
        //currentRow.find('.date-picker').datepicker();
    }

    function findFilter(filters, fieldName) {
        if (!filters) return null;

        for (var i = 0; i < filters.length; ++i) {
            var filter = filters[i];
            if (!filter || !filter.fieldName) return null;
            if (filter.fieldName === fieldName) return filter;
        }
        return null;
    }

    function getHtmlInput(type) {
        return Grid._isDateType(type) ? getFilterInputWithCalendar() : getFilterInputWithTextBox();
    }

    function replaceInput(filterRow, inputType) {
        if (!filterRow) return null;
        var inputHtml = getHtmlInput(inputType);
        filterRow.find('input.value').replaceWith(inputHtml);
        filterRow.find('.date-picker').datepicker();

        var inputElement = filterRow.find('input.value');
        return inputElement;
    }
};

Grid._isDateType = function(format) {
    if (!format) return false;
    return !!~["datetime", "date"].indexOf(format.toLowerCase());
}

Grid._isNumberType = function(format) {
    if (!format) return false;
    return !!~["number", "int"].indexOf(format.toLowerCase());
}

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

