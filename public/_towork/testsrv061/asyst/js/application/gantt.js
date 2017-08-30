var Gantt = {};

Gantt.Create = function (elementId, viewName, collapsed, width, showInd, filter, useAltInterval) {
    if (arguments.length > 0) {
        var options = {};
        if (arguments[0].constructor == String) {
            options.elementId = arguments[0]; //elementId;
            options.viewName = arguments[1]; //viewName;
            options.collapsed = arguments[2]; //collapsed;
            options.width = arguments[3]; //width;
            options.showInd = arguments[4]; //showInd;//тут тоже надо бы разбить на каждый
            options.filter = arguments[5]; //filter;
            options.useAltInterval = arguments[6]; //useAltInterval;
        }
        else
            options = arguments[0];


        Gantt.CreateInner(options);
    }
};
Gantt.CreateInner = function (options) {
    options = $.extend({
        /*elementId: ""обязательный. переопределять не нужно */
        viewName: "Gantt",
        collapsed: false,
        /*width:581, //не нужен, в ганте сам считается*/
        /*chartDisplayWidth: //ширина правой части диаграммы, по-умолчанию 500*/
        showInd: 3,
        /*filter тоже не нужно доопределять*/
        useAltInterval: false,
        /*текущее отображение: по месяцам*/
        format: 'month'
    }, options);

    var context = Asyst.Workspace.currentForm.Data;
    context.filter = options.filter;

    var g = new JSGantt.GanttChart(options);
    JSGantt.Charts[options.elementId] = g;

    g.setShowInd(options.showInd);
    g.setShowRes(0);
    g.setShowStartDate(0);
    g.setShowEndDate(0);
    g.setShowDur(0);
    g.setShowComp(0);

    g.setCaptionType('None');

    g.setDateInputFormat('dd/mm/yyyy');
    g.setDateDisplayFormat('dd.mm.yyyy');

    g.setFormat(options.format);

    var success = function (data) {
        var replaced = [];

        //Asyst.Workspace.getActiveTab()

        var tabname = $('#' + options.elementId).parents('.tab-pane').attr('id');
        var lochref = location.href;
        if (lochref[lochref.length - 1] == '#')
            lochref = lochref.substring(0, lochref.length - 1);
        var back;
        if (tabname !== undefined && tabname != '')
            back = setParameter(lochref, 'tab', ((tabname.indexOf(Asyst.Workspace.currentForm.FormName) != -1) ? tabname.substring(Asyst.Workspace.currentForm.FormName.length) :tabname));
        else back = 'back';
        //var retLink = setParameter(href, 'back', back);

        var indicators = {};
        for (var idx in data.data) {
            var dataRow = data.data[idx];
            var depend = "";
            if (dataRow.Depend)
                depend = dataRow.Depend;

            var isNewPoint = 0;
            if (dataRow.IsNewPoint)
                isNewPoint = dataRow.IsNewPoint;

            {//Выполняем подмену идентификаторов, если один узел встречается в разных подузлах. Костыль. 
                var depends = depend.split(',');
                for (var j = 0; j < depends.length; j++) {
                    var flag = false;
                    for (var idx2 in data.data) {
                        if (data.data[idx2].Id == depends[j]) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                        depends.splice(j, 1);
                }

                for (var ind = 0; ind < idx; ind++) {
                    //если этот ид уже встречался раньше, будем его менять
                    if (data.data[ind].Id == dataRow.Id) {
                        var obj = {};
                        obj.oldId = dataRow.Id;
                        //мб, тут надо сделать поприличнее новое назначение id'а
                        obj.newId = dataRow.Id * Math.round(Math.random() * 10000) + dataRow.Id;
                        dataRow.Id = obj.newId;
                        replaced.push(obj);
                    }
                }
                //теперь ищем, не входит ли родительский ид в список подмененных.
                for (var i = 0; i < replaced.length; i++) {
                    if (replaced[i].oldId == dataRow.ParentId) {
                        var obj = {};
                        obj.oldId = dataRow.Id;
                        //мб, тут надо сделать поприличнее новое назначение id'а
                        obj.newId = dataRow.Id * Math.round(Math.random() * 10000) + dataRow.Id;
                        dataRow.Id = obj.newId;
                        replaced.push(obj);
                        dataRow.ParentId = replaced[i].newId;
                    }

                    var pos = findPos(depends, replaced[i].oldId);
                    if (pos != -1) {
                        depends[pos] = replaced[i].newId;
                    }
                }
                //теперь еще надо dependsы надо поправить.

                depend = depends.join();
            }

            var baseStart = null;
            var baseFinish = null;
            if (dataRow.BasePlanDate)
                baseStart = dataRow.BasePlanDate;

            var Ind2 = 0;
            if (dataRow.StatusId)
                Ind2 = dataRow.StatusId;

            var Ind2Text = '';
            if (dataRow.StatusTitle)
                Ind2Text = dataRow.StatusTitle;

            var Ind1Text = '';
            if (dataRow.IndicatorTitle)
                Ind1Text = dataRow.IndicatorTitle;
            var indColor = '#12a461';
            if (dataRow.IndicatorColor)
                indColor = dataRow.IndicatorColor;//.substring(1, 7);
            indicators[dataRow.Indicator] = 1;

            var start = dataRow.PlanDate;
            var finish = dataRow.FactDate;
            var isMile = dataRow.IsParent ? 0 : 1;
            if (dataRow.hasOwnProperty('IsTask') && dataRow.IsTask == 1) {
                isMile = false;
                if (!(dataRow.BaseLineStart) && !(dataRow.BaseLineFinish) )
                {
                    baseStart = null;
                    baseFinish = null;
                }
                else {
                    if (!(dataRow.BaseLineStart)) {
                        baseStart = null;
                        isMile = true;
                    }
                    else { baseStart = dataRow.BaseLineStart; }

                    if (!(dataRow.BaseLineFinish)) {
                        baseFinish = null;
                        isMile = true;
                    }
                    else { baseFinish = dataRow.BaseLineFinish; }
                }

                if (!(dataRow.Start) && !(dataRow.Finish)) {
                    start = null;
                    finish = null;
                }
                else {
                    if (!(dataRow.Start)) {
                        start = null;
                        isMile = true;
                    }
                    else { start = dataRow.Start; }

                    if (!(dataRow.Finish)) {
                        finish = null;
                        isMile = true;
                    } else { finish = dataRow.Finish; }
                }
            }
            var link = '/asyst/' + dataRow.EntityName + '/form/auto/' + dataRow.Id + '?mode=view&back=' + encodeURIComponent(back); //'javascript:Gantt.openTask("/asyst/' + dataRow.EntityName + '/form/auto/' + dataRow.Id + '?mode=view")';
            var item = new JSGantt.TaskItem(g, dataRow.Id, dataRow.Indicator, dataRow.Name, start, finish, indColor, link, isMile,
                dataRow.Resource, 100, dataRow.IsParent, dataRow.ParentId, options.collapsed ? 0 : 1, depend, null, baseStart, baseFinish, isNewPoint, Ind2, Ind1Text, Ind2Text);
            item.data = dataRow;

            item.tooltip = JSGantt.formatName(Globa.localString3(dataRow.Tooltip));

            g.AddTaskItem(item);
        }

        var strStyle = '<style>';
        for (var c in indicators)
            strStyle += '.milestone.indicator' + c + ' {  background-image: url("/asyst/gantt/img/m' + c + '.png"); }';
        strStyle += '</style>';
        $('head').append(strStyle);

        g.Draw();
        g.DrawDependencies();
        //При переключении вкладок - перерисовываем связи, т.к. для скрытого ганта связи рисуются неправильно
        $('a[data-toggle="tab"]').on('shown', function (e) {
            g.DrawDependencies();
        });
    };

    Asyst.APIv2.View.load({viewName: options.viewName, data: context, success: success });
};

Gantt.openTask = function (href) {
    saveTabAndGo(href);
};

Gantt.getCheckedItems = function(gantName) {
    return Enumerable.
    From(JSGantt.Charts[gantName].getList()).
    Where('jQuery("#jsGantCheckbox"+$.getID()).prop("checked") == true').
    Select('$.getID()').
    ToArray();
};