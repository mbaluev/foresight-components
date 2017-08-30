(function ($) {
    var pluginName = "financeTable";
    var methods = {
        init: function (settings) {
            var settings = $.extend({
                startDate: "",
                finishDate: "",
                id: pluginName,
                type: "edit",
                showSum: true,
                array: [{ FinValueId: 0, FinItemActivityId: 0, FinItemId: 0, FinItemName: '', FinScenarioId: 0, DMonthId: 0, Value: '' }]
            }, settings);
            debugger;

            return this.each(function () {

                //var mon = ['##Я##', '##Ф##', '##М##', '##А##', '##М##', '##И##', '##И##', '##А##', '##С##', '##О##', '##Н##', '##Д##'];
                $(this).data(pluginName, settings);
                var fintable = this;

                var i = 0;
                if (settings.array.length == 0) return;

                var mindate = new Date(2100, 1, 1);
                var maxdate = new Date(1900, 1, 1);
                var data = new Date(1900, 1, 1);
                for (i = 0; i < settings.array.length; i++) {
                    data = monthIdtodate(settings.array[i].DMonthId.toString());
                    if (data < mindate) mindate = data;
                    if (data > maxdate) maxdate = data;
                }
                if (settings.startDate != '') mindate = strtodate(settings.startDate);
                if (settings.finishDate != '') maxdate = strtodate(settings.finishDate);

                var html = "";

                html += '<table id="' + settings.id + '" class="table"><thead><tr><th></th><th class="finItemName">##Статья##</th><th></th>';
                if (settings.showSum) {
                    html += '<th class="colHeadTotal">##Итоги##</th>';
                }

                var i = 0;
                for (i = 0; i < monthsDiff(maxdate, mindate) + 1; i++) {
                    html += "<th>" + rusMonthDateName(new Date(mindate.getFullYear(), mindate.getMonth() + i, 1)) + "</th>"
                }
                html += "</tr></thead>";


                html += "<tbody>";


                //var FinItemActivityId = 0;
                //var FinItemId = 0;
                //var FinItemName = "";
                var tmpdate;
                var DMonthId;

                var finItem = {};

                if (settings.showSum) {
                    html += '<tr>';
                    html += '<td rowspan="3" class="rowHeadTotal empty"></td>';
                    html += '<td rowspan="3" class="rowHeadTotal">##Итоги##</td>';
                    for (k = 1; k < 4; k++) {
                        if (k == 1) { html += '<td class="rowHeadTotal">##План##</td>'; }
                        if (k == 2) { html += '<td class="rowHeadTotal">##Факт##</td>'; }
                        if (k == 3) { html += '<td class="rowHeadTotal">##Прогноз##</td>'; }

                        html += '<td class="finsummain"><span id="sumsumid_' + k.toString() + '"> </span></td>';


                        for (j = 0; j < monthsDiff(maxdate, mindate) + 1; j++) {
                            tmpdate = new Date(mindate.getFullYear(), mindate.getMonth() + j + 1, 1);
                            DMonthId = (tmpdate.getMonth() == 0 ? (tmpdate.getFullYear() - 1).toString() : tmpdate.getFullYear().toString()) +
                                      (tmpdate.getMonth() == 0 ? "12" : ((tmpdate.getMonth() < 10 ? 0 : "") + tmpdate.getMonth().toString()));

                            html += '<td class="finsum">' + '<span id="sumid_' + k.toString() + '_' + DMonthId + '"></span>' + '</td>';
                        }
                        html += '</tr>';
                    }

                }

                var FinItems = [];

                for (i = 0; i < settings.array.length; i++) {


                    if (settings.array[i].FinItemActivityId != finItem.FinItemActivityId) {
                        //FinItemActivityId = settings.array[i].FinItemActivityId;
                        //FinItemId = settings.array[i].FinItemId;
                        //FinItemName = settings.array[i].FinItemName;

                        finItem = { FinItemActivityId: settings.array[i].FinItemActivityId, FinItemId: settings.array[i].FinItemId, FinItemName: settings.array[i].FinItemName };
                        FinItems.push(finItem);

                        html += "<tr data-finItemId='" + finItem.FinItemActivityId + "'>";
                        if (settings.type == "edit")
                            html += '<td rowspan="3"><i class="icon-trash" onclick="$(event.target).financeTable(\'askForDeleteFinItem\',' + finItem.FinItemActivityId + ',\'' + this.id + '\');" title="##Удалить статью##"></i></td>';

                        else
                            html += '<td rowspan="3"></td>';

                        html += '<td rowspan="3"><a href="#" onclick="Asyst.Workspace.openEntityDialog(\'FinItem\', \'##Финансовая статья##\', ' + finItem.FinItemId + ', function(){ window[viewName].Reload(viewName); }, null);">' + finItem.FinItemName + '</a></td>';

                        for (k = 1; k < 4; k++) {
                            if (k == 1) { html += '<td>##План##</td>'; }
                            if (k == 2) { html += '<tr data-finItemId="' + finItem.FinItemActivityId + '"> <td>##Факт##</td>'; }
                            if (k == 3) { html += '<tr data-finItemId="' + finItem.FinItemActivityId + '"> <td>##Прогноз##</td>'; }

                            if (settings.showSum) {
                                html += '<td class="finsum"><span  id="sumid_' + k.toString() + '_' + finItem.FinItemActivityId + '"> </span></td>';
                            }

                            for (j = 0; j < monthsDiff(maxdate, mindate) + 1; j++) {
                                tmpdate = new Date(mindate.getFullYear(), mindate.getMonth() + j + 1, 1);
                                DMonthId = (tmpdate.getMonth() == 0 ? (tmpdate.getFullYear() - 1).toString() : tmpdate.getFullYear().toString()) +
                                            (tmpdate.getMonth() == 0 ? "12" : ((tmpdate.getMonth() < 10 ? 0 : "") + tmpdate.getMonth().toString()));

                                if (settings.type == "edit")
                                    html += "<td>" + "<input type='text' id='id_" + k.toString() + "_" + finItem.FinItemActivityId + "_" + finItem.FinItemId + "_" + DMonthId + "' />" + "</td>";
                                else
                                    html += "<td>" + "<span id='id_" + k.toString() + "_" + finItem.FinItemActivityId + "_" + finItem.FinItemId + "_" + DMonthId + "'></span>" + "</td>";

                            }
                            html += "</tr>";
                        }
                    }

                }

                $(this).data(pluginName + '.FinItems', FinItems);

                $(this).append(html);

                var id = "";
                var b = 0;
                var sumByFinance = {};
                var sumByMonth = {};
                var nf = new NumberFormat();
                nf.setSeparators(true, ' ', '.');
                nf.setPlaces(2);

                function RecalcSums() {
                    for (i = 0; i < settings.array.length; i++) {
                        var item = settings.array[i];

                        // суммирование			
                        if (settings.showSum) {
                            //суммы по месяцам	
                            if (!sumByFinance.hasOwnProperty(item.FinScenarioId))
                                sumByFinance[item.FinScenarioId] = {};

                            if (!sumByFinance[item.FinScenarioId].hasOwnProperty(item.FinItemActivityId))
                                sumByFinance[item.FinScenarioId][item.FinItemActivityId] = {};

                            if (!sumByFinance[item.FinScenarioId][item.FinItemActivityId].hasOwnProperty(item.DMonthId))
                                sumByFinance[item.FinScenarioId][item.FinItemActivityId][item.DMonthId] = JSON.parse(JSON.stringify(item));

                            //суммы по статьям
                            if (!sumByMonth.hasOwnProperty(item.FinScenarioId))
                                sumByMonth[item.FinScenarioId] = {};

                            if (!sumByMonth[item.FinScenarioId].hasOwnProperty(item.DMonthId))
                                sumByMonth[item.FinScenarioId][item.DMonthId] = {};

                            if (!sumByMonth[item.FinScenarioId][item.DMonthId].hasOwnProperty(item.FinItemActivityId))
                                sumByMonth[item.FinScenarioId][item.DMonthId][item.FinItemActivityId] = JSON.parse(JSON.stringify(item));

                        }
                    }
                }

                RecalcSums();

                $(this).on('myDeleteAction', function () {
                    debugger;
                    for (var c in sumByMonth) delete sumByMonth[c];
                    for (var c in sumByFinance) delete sumByFinance[c];
                    RecalcSums();
                    finCalcSum();
                });

                for (i = 0; i < settings.array.length; i++) {
                    var item = settings.array[i];
                    id = "id_";

                    // заполнение грида данными
                    b = parseInt(settings.array[i].FinScenarioId);  // план = 1 факт = 2 прогноз = 3

                    id += b.toString() + "_" + settings.array[i].FinItemActivityId + "_" + settings.array[i].FinItemId + "_" + settings.array[i].DMonthId;

                    if (settings.type == "edit")
                        $(this).find("#" + id).val(settings.array[i].Value);
                    else
                        $(this).find("#" + id).text(settings.array[i].Value);

                }

                var editChange = function (event) {
                    var arr = $(this).attr("id").split('_');
                    var s = arr[1];
                    var f = arr[2];
                    var m = arr[4];

                    debugger;

                    if (!sumByMonth[s]) sumByMonth[s] = {};
                    if (!sumByMonth[s][m]) sumByMonth[s][m] = {};
                    if (!sumByMonth[s][m][f]) sumByMonth[s][m][f] = {};
                    sumByMonth[s][m][f].Value = this.value;

                    if (!sumByFinance[s]) sumByFinance[s] = {};
                    if (!sumByFinance[s][f]) sumByFinance[s][f] = {};
                    if (!sumByFinance[s][f][m]) sumByFinance[s][f][m] = {};
                    sumByFinance[s][f][m].Value = this.value;

                    finCalcSum();
                };

                if (settings.type == 'edit')
                    $(fintable).find(':input').each(function () {
                        $(this).on('change', editChange);
                    });




                var finCalcSum = function () {

                    var nf = new NumberFormat();
                    nf.setSeparators(true, ' ', '.');
                    nf.setPlaces(2);
                    debugger;

                    $(fintable).find('.finsummain span').text('');
                    $(fintable).find('.finsum span').text('');

                    for (FinScenarioId in sumByFinance) {
                        for (FinItemActivityId in sumByFinance[FinScenarioId]) {
                            var id = 'sumid_' + FinScenarioId + "_" + FinItemActivityId;
                            var dd = Enumerable.From(sumByFinance[FinScenarioId][FinItemActivityId]);
                            nf.setNumber(dd.Sum('Number($.Value.Value)'), '.');
                            $(fintable).find('#' + id).text(nf.toFormatted());
                        }
                    }


                    for (FinScenarioId in sumByMonth) {
                        for (j = 0; j < monthsDiff(maxdate, mindate) + 1; j++) {
                            tmpdate = new Date(mindate.getFullYear(), mindate.getMonth() + j + 1, 1);
                            DMonthId = (tmpdate.getMonth() == 0 ? (tmpdate.getFullYear() - 1).toString() : tmpdate.getFullYear().toString()) +
                                      (tmpdate.getMonth() == 0 ? '12' : ((tmpdate.getMonth() < 10 ? 0 : '') + tmpdate.getMonth().toString()));
                            var d = Enumerable.From(sumByMonth[FinScenarioId][DMonthId]);
                            nf.setNumber(d.Sum('Number($.Value.Value)'), '.');
                            $(fintable).find('#sumid_' + FinScenarioId + '_' + DMonthId).text(nf.toFormatted());
                        }

                        var d = Enumerable.From(sumByMonth[FinScenarioId]);

                        nf.setNumber(d.Sum('Enumerable.From($.Value).Sum("Number($.Value.Value)")'), '.');
                        $(fintable).find('#sumsumid_' + FinScenarioId).text(nf.toFormatted());

                    }
                }

                if (settings.showSum) {
                    finCalcSum();
                }

            });

        },
        getArray: function () {
            debugger;
            //обязательно нужен асист для clone!
            var settings = this.data(pluginName);
            var FinItems = this.data(pluginName + '.FinItems');
            var getItem = function (finItemActivityId) {
                for (var ind in FinItems) {
                    if (FinItems[ind].FinItemActivityId == finItemActivityId)
                        return FinItems[ind];
                }
                return null;
            }

            var newArray = clone(settings.array);
            for (var ind = 0; ind < newArray.length; ind++) {

                if (getItem(newArray[ind].FinItemActivityId) == null) {
                    newArray.splice(ind, 1);
                    ind--;
                }
            }

            $("#" + settings.id + " :input").each(function () {
                /* Находим ИД финансовой записи */
                id = -1;
                flag = false;
                arr = $(this).attr("id").split('_');
                s = parseInt(arr[1]);
                f = arr[2];
                m = arr[4];
                val = $(this).val();

                for (var i = 0; i < newArray.length; i++) {
                    if (newArray[i].FinItemActivityId == f && newArray[i].FinScenarioId == s && newArray[i].DMonthId == m) {
                        //если значение пустое, удаляем элемент из массива
                        if (val == "") {
                            newArray.splice(i, 1);
                            i--;
                        }
                            //если значение то же самое - сохраняем id, чтобы потом не добавить его
                        else if (val == newArray[i].Value) {
                            id = i;
                        }
                            //иначе - меняем в имеющейся ячейке
                        else if (!isNaN(parseFloat(val)) && val != "") {
                            newArray[i].Value = val;
                            id = i;
                        }
                        break;
                    }
                }

                /* Если ИД не найден, то элемент в массив */
                if (id == -1 && (!isNaN(parseFloat(val)) && val != "")) {
                    var finItem = getItem(f);
                    var newItem = {
                        DMonthId: m,
                        FinItemActivityId: f,
                        FinScenarioId: s,
                        Value: val,

                        FinValueId: null,
                        FinItemId: finItem.FinItemId,
                        FinItemName: finItem.FinItemName
                    };
                    newArray.push(newItem);
                }


            });
            return newArray;
        },
        askForDeleteFinItem: function (FinItemActivityId, id) { askForDeleteFinItem(FinItemActivityId, id) }
    };


    function days_between(date1, date2) {

        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime()
        var date2_ms = date2.getTime()

        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms)

        // Convert back to days and return
        return Math.round(difference_ms / ONE_DAY)

    }


    function months_between(date1, date2) {

        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime()
        var date2_ms = date2.getTime()

        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms)

        // Convert back to days and return
        return Math.round(difference_ms / ONE_DAY)

    }

    function strtodate(str) {
        var dateArray = str.split(".");
        return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    }

    function monthIdtodate(str) {
        return new Date(parseInt(str.substr(0, 4)), parseInt(str.substr(4, 2)), 0);
    }

    function monthsDiff(date1, date2) {
        return Math.abs(date1.getMonth() -
                 date2.getMonth() +
                 (12 * (date1.getFullYear() - date2.getFullYear())));
    }


    function rusMonthDateName(date) {
        var mon = ['##Янв##', '##Фев##', '##Мар##', '##Апр##', '##Май##', '##Июн##', '##Июл##', '##Авг##', '##Сен##', '##Окт##', '##Ноя##', '##Дек##'];
        return mon[date.getMonth()] + ", " + date.getFullYear().toString().substr(2, 2);
    }

    function askForDeleteFinItem(FinItemActivityId, id) {
        Dialogs.Confirm("##Удалить?##", "##Вы уверены, что хотите удалить эту статью и все её данные из карточки?##", function () { deleteFinItem(FinItemActivityId, id); }, null, 'finItemConfirm');
    }

    function deleteFinItem(FinItemActivityId, id) {
        debugger;

        //Asyst.Workspace.currentForm.Reset();
        //удаляем из dom
        $('#' + id + ' tbody tr[data-finItemId=' + FinItemActivityId + ']').remove();
        //удаляем данные из хранимых
        var settings = $('#' + id).data(pluginName);
        for (var ind = 0; ind < settings.array.length; ind++) {
            var item = settings.array[ind];
            if (item.FinItemActivityId == FinItemActivityId) {
                settings.array.splice(ind, 1);
                ind--
            }
        }
        var FinItems = $('#' + id).data(pluginName + '.FinItems');
        for (var ind = 0; ind < FinItems.length; ind++) {
            var item = FinItems[ind];
            if (item.FinItemActivityId == FinItemActivityId) {
                FinItems.splice(ind, 1);
                ind--;
            }
        }
        Asyst.API.Entity.remove("FinItemActivity", FinItemActivityId);
        $('#' + id).trigger('myDeleteAction');
        $('#finItemConfirm').modal('hide');
    }


    $.fn[pluginName] = function (method) {
        // немного магии
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(
		    arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            // если ничего не получилось
            $.error('Метод "' + method + '" в плагине не найден');
        }
    };

})(jQuery);





//$("#financeTableOPEXInput :input").each(function() {
debugger;
var array = $("#financeOPEXInput").financeTable("getArray");
var arrayEditOPEX = Asyst.Workspace.currentForm.TemplateData["FinanceDivOPEXInput"];
for (var ind in array) {

    /* Находим ИД финансовой записи */
    var id = "";
    var flag = false;
    //arr = $(this).attr("id").split('_');
    //s = parseInt(arr[1]);
    //f = arr[2];
    //m = arr[4];
    //val = $(this).val();
    var s = array[ind].FinScenarioId;
    var f = array[ind].FinItemActivityId;
    var m = array[ind].DMonthId;
    var val = array[ind].Value;

    for (i = 0; i < arrayEditOPEX.length; i++) {
        if (arrayEditOPEX[i].FinItemActivityId == f && arrayEditOPEX[i].FinScenarioId == s && arrayEditOPEX[i].DMonthId == m) {
            id = arrayEditOPEX[i].FinValueId;
            arrayEditOPEX[i].isObserved = 1;
            if (val == arrayEditOPEX[i].Value)
                flag = true;
            break;
        }
    }

    /* Если ИД не найден, то ставим ему null */
    if (id == "" || id == 0) id = null;

    /* Если ИД найден и значнеие пусто, то удаляем эту запись из БД */
    if (val == "" && id != null) { Asyst.API.Entity.remove("FinValue", id); }


    /*alert(' FinValId ' + id + 'Budget ' + b + ' Scenario ' + s + ' Finance ' + f + ' Month ' + m);*/

    /* Если финансы числовые, то пишем в БД */
    if (!isNaN(parseFloat(val)) && val != "") {
        var data = { FinValueId: id, FinItemActivityId: f, FinScenarioId: s, D_MonthId: m, Value: parseFloat(val) };
        if (flag == false)
            Asyst.API.Entity.save("FinValue", id, data);
    }
}

debugger;
var delArray = Enumerable.From(arrayEditOPEX).Where('!$.hasOwnProperty("isObserved")').ToArray();
var FinItems = $("#financeOPEXInput").data('financeTable.FinItems');
var getItem = function (finItemActivityId) {
    for (var ind in FinItems) {
        if (FinItems[ind].FinItemActivityId == finItemActivityId)
            return FinItems[ind];
    }
    return null;
};

for (var ind in delArray) {
    if (delArray[ind].FinValueId != 0 && getItem(delArray[ind].FinItemActivityId) != null)
        Asyst.API.Entity.remove("FinValue", delArray[ind].FinValueId);
}




