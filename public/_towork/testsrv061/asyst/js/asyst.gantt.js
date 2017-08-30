Asyst.Gantt = function ($Container, ActivityId, Options) {
    'use strict';

    // Настройки ганта
    Options = $.extend({
        Custom_LoadViewName: "NewGantt", // Имя представления, через которое будут получаться данные
        Custom_SavePointFormName: "PointEditForm", // Имя формы редактирования точки

        // Дополнительные поля для отслеживания изменений. В виде массива строк.
        TrackCustomFields: null,

        // Кастомные имена для доп. полей в элементах данных.
        // В виде объекта { ModelFieldName: "DataFieldName", ... }
        CustomFieldsNames: null,

        // Функция создания объекта из элемента данных (при заполнении гриды и после добавления нового элемента).
        // Параметры функции: createItemOriginal, task, predecessorArr.
        // createItemOriginal - оригинальный вариант функции создания объекта из элемента данных. Ее удобно использовать в случае, когда все старые поля остаются, но нужно добавить несколько новых.
        // task - элемент данных.
        // predecessorArr - предшественники данного элемента.
        Custom_CreateItem: null,

        // Дополнение для функции перекладывания изменившихся полей из объекта модели в объект данных
        // Параметры функции: items, item, updated, changeInfo, gantt, bits.
        // bits - это объект следующей структуры: { isChanged: isChanged, isClearCritical: isClearCritical, isClearIndicator: isClearIndicator }
        // Данные поля в этом объекте можно изменить - и это повлияет на результаты работы метода ActivityUpdated.
        Custom_ActivityUpdated: null
    }, Options);

    /**
     * Получает объект описание связи точки из строки описания
     * @param {string} linkString строка описание связи и лага, 98754SS+33
     * @returns {object}
     */
    function getLinkInfoFromString(linkString) {
        if (!linkString) {
            return null;
        }
        
        var pattern = /^(\d+)(\w{2})?([+-]\d+)?/;
        var matchArr = linkString.match(pattern);
		if (!matchArr || !matchArr.length) { return null; }
		
        return {
            pointId: matchArr[1],
            type: matchArr[2] || "FS",
            lag: matchArr[3] || ""
        }
    }

    /**
     * Получает объект описание связи точки из строки описания
     * @param {string} linkString строка описание связи и лага, 98754SS+33
     * @returns {object}
     */
    function getLinkInfoFromStringCode(linkString) {
        if (!linkString) {
            return null;
        }
        
        var pattern = /^(\d+\-\d+|^\d+)(\w{2})?([+-]\d+)?/;
        var matchArr = linkString.match(pattern);
        if (!matchArr || !matchArr.length) { return null; }

        return {
            pointId: matchArr[1],
            type: matchArr[2] || "FS",
            lag: matchArr[3] || ""
        }
    }

    /**
     * Преобразовывает описание связи точки в строку описания
     * @param {string} code код точки
     * @param {object} link объект описание связи точки
     * @returns {string} строка описание связи и лага, 98754SS+33
     */
    function formatLinkInfoToString(code, link, divider) {
        var lag = (link.lag && divider ? link.lag / divider : link.lag);
        return code + link.type + (lag?(lag>0?('+'+lag):lag):'');
    }



    var self = this
        , updateCount = 0
        , saveTimeout
        , redrawTimeout
        , loading;

    var ChangeInfoItem = function (Id, oldValues) {
        this.id = Id;
        this.oldValues = oldValues || {};
    };

    ChangeInfoItem.prototype.change = function (propName, value) {
        if (this.hasOwnProperty(propName) && this[propName] === value) {
            return false;
        } else {
            this[propName] = value;
            return true;
        }
    };

    ChangeInfoItem.prototype.merge = function (obj) {
        for (var propName in obj) {
            if (obj.hasOwnProperty(propName) && propName !== "oldValues") {
                this[propName] = obj[propName];
            }
        }
        if (obj.oldValues) {
            for (var propName in obj.oldValues) {
                if (obj.hasOwnProperty(propName)) {
                    this.oldValues[propName] = obj.oldValues[propName];
                }
            }
        }
    };

    ChangeInfoItem.prototype.isEmpty = function () {
        for (var propName in this) {
            if (propName !== "id" && propName !== "oldValues" && this.hasOwnProperty(propName)) {
                return false;
            }
        }
        return true;
    };

    self.ActivityUpdated = function (items, item, updated) {

        self.BeginUpdate(item.ID);
        try {
            var isChanged = false;
            var isClearCritical = false;
            var isClearIndicator = false;
            var changeInfo = self.ChangeInfo(item.ID, null, updated);

            if (updated.hasOwnProperty('PredecessorIndexString')) {
                var newValue = item.PredecessorIndexString;
                changeInfo.PointPoint = (newValue && newValue.length) ? newValue.split(',') : [];
                isChanged = true;
                isClearCritical = true;
            }

            if (updated.hasOwnProperty('ActivityName')) {
                isChanged = isChanged || updated.ActivityName.OldValue != item.ActivityName;
                changeInfo.Name = item.ActivityName;
            }

            if (updated.hasOwnProperty('Parent')) {
                isChanged = isChanged || updated.Parent != item.Parent;
                isClearCritical = isClearCritical || updated.Parent != item.Parent;
                isClearIndicator = isClearIndicator || updated.Parent != item.Parent;
                changeInfo.ParentId = item.Parent ? item.Parent.ID : ActivityId;
                /* чото про обновление родителей */
                setTimeout(function() {
                    if (updated.Parent.OldValue) {
                        if (updated.Parent.OldValue.ChildActivities.length === 0) {
                            restoreSummaryDates(updated.Parent.OldValue);
                        } else {
                            recalcDate(updated.Parent.OldValue, 'PlanDate', false);
                            recalcDate(updated.Parent.OldValue, 'StartPlanDate', true);
                            recalcDate(updated.Parent.OldValue, 'FactEndTime', false);;
                            recalcDate(updated.Parent.OldValue, 'FactStartTime', true);
                        }
                    }
                    if (item.Parent) {
                        recalcDate(item.Parent, 'PlanDate', false);
                        recalcDate(item.Parent, 'StartPlanDate', true);
                        recalcDate(item.Parent, 'FactEndTime', false);
                        recalcDate(item.Parent, 'FactStartTime', true);
                    }
                });
            }

            if (updated.hasOwnProperty('SortOrder')) {
                isChanged = isChanged || updated.SortOrder.OldValue != item.SortOrder;
                changeInfo.OrderIndex = item.SortOrder;
            }

            if (item.DataSource.IsMilestone) {
                if (updated.hasOwnProperty('EndTime')) {
                    isChanged = isChanged || updated.EndTime.OldValue != item.EndTime || (item.ChildActivities && item.ChildActivities.length > 0);
                    isClearCritical = isClearCritical || updated.EndTime.OldValue != item.EndTime || (item.ChildActivities && item.ChildActivities.length > 0);
                    isClearIndicator = true;isClearIndicator || updated.EndTime.OldValue != item.EndTime;
                    if (item.ChildActivities.length == 0) {//суммарной задаче даты не пишем в базу
                        changeInfo.ForecastDate = Asyst.date.ajustToDay(item.EndTime);
                    }
                    item.StartTime = item.EndTime;
                    item.Effort = new RQTimeSpan(0, 0, 0, 0, 0, 0);

                    if (item.DataSource.FactEndTime) {
                        item.DataSource.FactEndTime = item.EndTime;
                        if (item.ChildActivities.length == 0) { //суммарной задаче даты не пишем в базу
                            changeInfo.FactDate = Asyst.date.ajustToDay(item.DataSource.FactEndTime);
                        }
                    }
                }
            } else {
                if (updated.hasOwnProperty('EndTime')) {
                    isChanged = isChanged || updated.EndTime.OldValue != item.EndTime || (item.ChildActivities && item.ChildActivities.length > 0);
                    isClearCritical = isClearCritical || updated.EndTime.OldValue != item.EndTime || (item.ChildActivities && item.ChildActivities.length > 0);
                    isClearIndicator = true;//isClearIndicator || updated.EndTime.OldValue != item.EndTime;
                    if (item.ChildActivities.length == 0) { //суммарной задаче даты не пишем в базу
                        changeInfo.ForecastDate = Asyst.date.ajustToDay(new Date(item.EndTime - 86400000));
                    }
                }
                if (updated.hasOwnProperty('StartTime')) {
                    isChanged = isChanged || updated.StartTime.OldValue != item.StartTime;
                    isClearCritical = isClearCritical || updated.StartTime.OldValue != item.StartTime;
                    isClearIndicator = true;isClearIndicator || updated.StartTime.OldValue != item.StartTime;
                    if (item.ChildActivities.length == 0) { //суммарной задаче даты не пишем в базу
                        changeInfo.StartForecastDate = Asyst.date.ajustToDay(item.StartTime);
                    }
                    if (item.DataSource.FactEndTime) {
                        item.DataSource.FactEndTime.setTime(item.StartTime.getTime() + item.DataSource.FactEndTime.getTime() - item.DataSource.FactStartTime.getTime());
                        if (item.ChildActivities.length == 0) { //суммарной задаче даты не пишем в базу
                            changeInfo.FactDate = Asyst.date.ajustToDay(item.DataSource.FactEndTime);
                        }
                    }
                    if (item.DataSource.FactStartTime) {
                        item.DataSource.FactStartTime = item.StartTime;
                        if (item.ChildActivities.length == 0) { //суммарной задаче даты не пишем в базу
                            changeInfo.StartFactDate = Asyst.date.ajustToDay(item.DataSource.FactStartTime);
                        }
                    }
                }
            }

            if (updated.hasOwnProperty('ProgressPercent')) {
                isChanged = isChanged || updated.ProgressPercent.OldValue != item.ProgressPercent;
                isClearIndicator = isClearIndicator || updated.ProgressPercent.OldValue != item.ProgressPercent;
                changeInfo.PctComplete = item.ProgressPercent;

                self.Control.RedrawChartRow(item);

            }

            // Дополнительная логика для кастомных полей
            if (Options.Custom_ActivityUpdated && typeof Options.Custom_ActivityUpdated === "function") {
                var bits = {
                    isChanged: isChanged,
                    isClearCritical: isClearCritical,
                    isClearIndicator: isClearIndicator
                };
                Options.Custom_ActivityUpdated(items, item, updated, changeInfo, self, bits);

                isChanged = isChanged || bits.isChanged;
                isClearCritical = isClearCritical || bits.isClearCritical;
                isClearIndicator = isClearIndicator || bits.isClearIndicator;
            }
        
            self.adjustTask(item.DataSource, changeInfo);

            if (isChanged) {
                item.IsGanttChanged = !item.IsGanttChanged;
                changeInfo.change('IsGanttChanged', item.IsGanttChanged);
                self.ChangeInfo(item.ID, changeInfo, null);
            }

            if (isClearCritical) {
                self.CriticalPathActivities = [];
            }

            if (isClearIndicator) {
                item.DataSource.HasIndicator = false;
            }
        } finally {
            self.EndUpdate(item.ID);
        }
    };

    self.WBSIDHandler = function (sender, args) {
        var parent = args.Activity.Parent;
        var childIndex = (args.GetActivityChildIndex() + 1).toString();
        if (!parent) {
            if (args.Activity.DataSource.WBSID != childIndex)
                args.NewWBSID_M(childIndex);
        } else if (args.Activity.DataSource.WBSID != parent.DataSource.WBSID + "." + childIndex)
            args.NewWBSID_M(parent.DataSource.WBSID + "." + childIndex);
    };

    self.Redraw = function () {
        if (!RadiantQ.Gantt.RowDragDropTracker.IsDragStarted_M()) {
            self.Control.RedrawChartRows();
            var left = self.Control.grid.uiGridBody.scrollLeft();
            self.Control.grid.Refresh();
            self.Control.grid.uiGridBody.scrollLeft(left);
        }
    };

    self.BeginUpdate = function (taskId) {
        updateCount++;

        if (saveTimeout) {
            clearTimeout(saveTimeout);
            saveTimeout = undefined;
        }
    };

    self.EndUpdate = function (taskId) {
        updateCount--;

        if (updateCount === 0 && self.HasChanges()) {

            var doRedraw = function () {
                redrawTimeout = undefined;
                self.Redraw();
            };

            if (redrawTimeout) {
                clearTimeout(redrawTimeout);
            }
            redrawTimeout = setTimeout(doRedraw, 600);

            if (self.AutoSave) {
                self.save(true, true);
            }
        }
    };

    self.HasChanges = function () {
        return Object.keys(self.Changes).length > 0;
    };

    self.ChangeInfo = function (taskId, changeInfo, oldValues) {
        if (changeInfo) {
            if (self.Changes[taskId] && self.Changes[taskId] !== changeInfo) {
                self.Changes[taskId].merge(changeInfo);
            } else {
                self.Changes[taskId] = changeInfo;
            }
        } else {
            changeInfo = self.Changes[taskId];
            if (!changeInfo) {
                changeInfo = new ChangeInfoItem(taskId, oldValues);
            }
        }
        return changeInfo;
    };

    self.adjustTask = function (task, changeInfo) {
        var isChanged = false;

        return isChanged;
    };

    var restoreSummaryDates = function (parent) {
        if (!parent) return;
        var ds = Asyst.APIv2.DataSet.load({
            name: 'SummaryDatesRestore',
            data: { PointId: parent.ID.toString() },
            async: false,
            success:
            function (tables, table1) {
                Asyst.debugger('imw');
                var effort;
                var data = {};

                for (var i = 0; i < table1.length; i++) {
                    var item = table1[i];
                    parent.DataSource[item.Name] = item.Value ? Asyst.date.ajustToUtc(item.Value) : item.Value;
                    if (parent[item.Name] !== undefined) { //нет, .hasOwnProperty/keys... к сожалению не прокатывают
                        parent[item.Name] = item.Value ? Asyst.date.ajustToUtc(item.Value) : item.Value;
                    }
                    data[item.Name] = item.Value;
                }
                effort = (data.EndTime - data.StartTime + 86400000) / 86400000 + '.00:00:00';
                parent.DataSource.Effort = effort;
                parent.Effort = effort;
            }
        });
    }

    function recalcDate(parent, propName, isStart) {
        //var parent = activity.Parent;
        var pairs = { 'StartPlanDate': 'PlanDate', 'FactStartTime': 'FactEndTime'};
        
        if (!parent || !parent.ChildActivities || parent.ChildActivities.length === 0) {
            return;
        }

        var date = null;
        var notAll = false;
        if (parent.ChildActivities.length > 0) {
            for (var i = 0; i < parent.ChildActivities.length; i++) {

                var child = parent.ChildActivities[i].DataSource;
                var value = child[child.IsMilestone && isStart ? pairs[propName] : propName];

                if (!value) {
                    notAll = true;
                    continue;
                }

                if (!date) {
                    date = value;
                } else if (isStart && date > value) {
                    date = value;
                } else if (!isStart && date < value) {
                    date = value;
                }
            }
        } 

        parent.DataSource[propName] = (propName == 'FactEndTime' && notAll) ? null : date;

        recalcDate(parent.Parent, propName, isStart);
    }

    

    var onPropertyChanged = function (item, args) {
        if (loading)
            return;

        if (args.PropertyName == 'IndentLevel')
            return;

        var data = item;
        var activity = self.Control.Model.ActivityById[item.ID];
        if (activity)
            data = activity.DataSource;

        self.BeginUpdate(item.ID);
        try {
            if (args.PropertyName == 'FactEndTime') {
                if (!item.FactStartTime && item.FactEndTime && !item.IsMilestone) {
                    item.FactStartTime = item.StartTime;
                }
                if (item.FactEndTime) {
                    data.ProgressPercent = 100;
                }

                if (activity.StartTime != item.FactStartTime || activity.EndTime != item.FactEndTime) {
                    if (item.IsMilestone) {
                        //item.FactStartTime = item.FactEndTime;
                        activity.PreferredStartTime = item.FactEndTime;
                        activity.StartTime = item.FactEndTime;
                        activity.Effort = new RQTimeSpan(0, 0, 0, 0, 0, 0);
                        //item.FactStartTime = item.FactEndTime; //????
                    } else {
                        if (item.FactStartTime && item.FactEndTime && item.ChildActivities.length == 0) {
                            activity.PreferredStartTime = item.FactStartTime;
                            activity.StartTime = item.FactStartTime;
                            activity.Effort = (Asyst.date.ajustToDay(item.FactEndTime) -Asyst.date.ajustToDay(item.FactStartTime) + 86400000) / 86400000 + '.00:00:00';
                            //activity.EndTime = Asyst.date.ajustToDay(item.FactEndTime);
                        }
                    }
                }

                data.HasIndicator = false;
                recalcDate(activity.Parent, 'FactEndTime', false);
            } else if (args.PropertyName == 'FactStartTime') {
                
                if (activity.StartTime != item.FactStartTime) {
                    var truEndTime = activity.EndTime;
                    if (item.FactStartTime && item.ChildActivities.length == 0 ) {
                        activity.PreferredStartTime = item.FactStartTime;
                        activity.StartTime = item.FactStartTime;
                        activity.Effort = (Asyst.date.ajustToDay(truEndTime) - Asyst.date.ajustToDay(item.FactStartTime)/* + 86400000*/) / 86400000 + '.00:00:00';
                    }
                    //activity.EndTime = item.FactEndTime;
                }
                recalcDate(activity.Parent, 'FactStartTime', true);
            }

            var isChanged = false;
            var changeInfo = self.ChangeInfo(item.ID, null);

            if (args.PropertyName == 'WBSID') {
                if (item.WBS != item.WBSID) {
                    item.WBS = item.WBSID;
                    isChanged = isChanged || changeInfo.change('WBS', item.WBSID);
                }
            } else {
                for (var i in self.TrackCustomFields) {
                    var fieldName = self.TrackCustomFields[i];
                    if ((args.PropertyName == fieldName) && (args.OldValue != item[fieldName]) &&
                        (fieldName.indexOf('Fact') == -1 || activity.ChildActivities.length == 0)) //странное условие, чтобы не перезатирать факт у суммарных задач.
                    {
                        if (self.CustomFieldsNames.hasOwnProperty(fieldName)) {
                            isChanged = isChanged || changeInfo.change(self.CustomFieldsNames[fieldName], item[fieldName]);
                        } else {
                            isChanged = isChanged || changeInfo.change(fieldName, item[fieldName]);
                        }
                        if (fieldName == 'FactEndTime' && data.ActivityPhaseId != self.ActivityPhaseDone) {
                            changeInfo.change('ActivityPhaseId', self.ActivityPhaseDone);
                            data.ActivtyPhaseId = self.ActivityPhaseDone;
                        }
                        break;
                    }
                }
            }

            if (isChanged) {
                item.IsGanttChanged = !item.IsGanttChanged;
                changeInfo.change('IsGanttChanged', item.IsGanttChanged);
                self.adjustTask(item, changeInfo);
                self.ChangeInfo(item.ID, changeInfo);

                if (activity)
                    data.HasIndicator = false;
            }

        } finally {
            self.EndUpdate(item.ID);
        }
    };

    self.CreateItem = function (data, isForm, predecessorArr) {
        var sourceTask;
        if (isForm) {
            Asyst.APIv2.View.load({
                viewName: Options.Custom_LoadViewName,
                data: {ActivityId: self.ActivityId},
                success: function (tasks) {
                    tasks = Asyst.protocol.format(tasks);

                    for (var i in tasks.data) {
                        if (tasks.data.hasOwnProperty(i)) {
                            var task = tasks.data[i];
                            if (task.Id == data.id) {
                                sourceTask = task;
                                break;
                            }
                        }
                    }
                },
                async: false
            });
        } else {
            sourceTask = data;
        }

        var item = {};
        if (sourceTask) {
            if (predecessorArr) {
                predecessorArr = predecessorArr.filter(function (i) {
                    return i.pointId === sourceTask.Id;
                });
            }

            item = createItemInternal(sourceTask, predecessorArr);
        }

        return item;
    };

    // Внутренняя функция создания элемента из блока данных.
    // Содержит в себе логику переключения на кастомную функцию, если она задана.
    function createItemInternal(task, predecessorArr) {
        var item;
        if (Options.Custom_CreateItem && typeof Options.Custom_CreateItem === "function") {
            item = Options.Custom_CreateItem(createItemOriginal, task, predecessorArr);
        } else {
            item = createItemOriginal(task, predecessorArr);
        }

        RadiantQ.Gantt.Utils.InsertPropertyChangedTriggeringProperty(item, self.TrackCustomFields, true);
        item.PropertyChanged.subscribe(onPropertyChanged);

        return item;
    };

    // Исходная версия функции создания элемента из блока данных.
    function createItemOriginal(task, predecessorArr) {
        var item = {
            Name: task.Name
            , ID: task.Id
            , StartTime: Asyst.date.ajustToUtc(task.StartForecastDate)
            , Effort: (task.ForecastDate - task.StartForecastDate + 86400000) / 86400000 + '.00:00:00'
            , EndTime: Asyst.date.ajustToUtc(task.ForecastDate)
            , IndentLevel: (task.level > 1) ? task.level - 1 : 0
            , PredecessorIndices: task.Depend
            , ProgressPercent: task.PctComplete
            , /*custom fields*/
            FactStartTime: task.StartFactDate
            , FactEndTime: task.FactDate
            , ForecastStartTime: task.StartForecastDate
            , ForecastEndTime: task.ForecastDate
            , StartPlanDate: Asyst.date.ajustToUtc(task.StartPlanDate)
            , PlanDate: Asyst.date.ajustToUtc(task.PlanDate)
            , Duration: task.Duration
            , Responsible: task.Responsible
            , Indicator: task.Indicator
            , IndicatorTitle: task.IndicatorTitle
            , IsMilestone: task.IsMilestone
            , IsReadOnly: task.IsReadOnly
            , CodeName: task.CodeName
            , Code: task.Code
            , EntityName: task.EntityName
            , ProjectStageTypeId: task.ProjectStageTypeId
            , ProjectStageTypeName: task.ProjectStageTypeName
            , PointTypeId: task.PointTypeId
            , PointTypeName: task.PointTypeName
            , ParentId: task.ParentId
            , Owner: task.Owner
            , Acceptor: task.Acceptor
            , Leader: task.Leader
            , WBSID: task.WBS
            , WBS: task.WBS
            , IsGanttChanged: task.IsGanttChanged
            , Predecessors: predecessorArr
            , ActivityPhaseId: task.ActivityPhaseId
            , GetIndicator: function () {
                var activity = self.Control.Model.ActivityById[this.ID];
                if (activity && activity.DataSource)
                    return self.GetActivityIndicator(activity);
            }
            , GetAsystEndTime: function () {
                
                var activity = self.Control.Model.ActivityById[this.ID];
                if (activity.ChildActivities && activity.ChildActivities.length > 0) {
                    var max = activity.ChildActivities[0];
                    activity.ChildActivities.map(function (el, index) { if (max.EndTime < el.EndTime) max = el });
                    if (max.IsMilestone) {
                        return max.EndTime;
                    }
                    else if (activity.ChildActivities.length == 0) {
                        return new Date(max.EndTime - 86400000);
                    } else {
                        return max.DataSource.GetAsystEndTime();
                    }


                } else {
                    return activity.IsMilestone ? activity.EndTime : new Date(activity.EndTime - 86400000);
                }
            }, GetPredecessorCodes: function () {
                if (this.PredecessorIndices) {
                    return this.PredecessorIndices.split(",").map(function (predecessor) {
                        var linkInfo = getLinkInfoFromString(predecessor);
                        var activity = self.Control.Model.ActivityById[linkInfo.pointId];
                        if (activity) {

                            //return activity.DataSource.Code + linkInfo.type + linkInfo.lag;
                            return formatLinkInfoToString(activity.DataSource.Code, linkInfo, 24);
                        } else {
                            return "?";
                        }
                    }).join(",");

                } else {
                    return "";
                }
            }
            , SetPredecessorCodes: function (values) {
                debugger;
                if (values) {
                    this.PredecessorIndices = values.split(",").map(function (predecessor) {
                        var linkInfo = getLinkInfoFromStringCode(predecessor);
                        if (linkInfo.lag)
                            linkInfo.lag *= 24;
                        var item = self.TaskByCode(linkInfo.pointId);
                        //return item && (item.ID + linkInfo.type + linkInfo.lag) || "";
                        return item && (formatLinkInfoToString(item.ID, linkInfo)) || "";
                    }).join(",");
                } else {
                    this.PredecessorIndices = null;
                }
            }
        };

        //item.PredecessorIndices = item.GetPredecessorCodes();

        if (task.IsMilestone) {
            item.StartTime = Asyst.date.ajustToUtc(task.ForecastDate);
            item.Effort = '0.00:00:00';
        }
        return item;
    };

    self.load = function (async, onsuccess, onerror) {
        var success = function (data) {
            Asyst.APIv2.DataSet.load({
                name: "ProjectPointLinks",
                data: {
                    ActivityId: self.ActivityId
                },
                success: function (all, predecessorArr) {
                    loading = true;
                    try {
                        self.Tasks = [];
                        self.Changes = {};
                        var startTime;
                        var endTime;

                        data = Asyst.protocol.format(data);

                        for (var i in data.data) {
                            if (data.data.hasOwnProperty(i)) {
                                var task = data.data[i];
                                var item = self.CreateItem(task, null, predecessorArr);
                                self.Tasks.push(item);


                                if (item.StartTime && (!startTime || startTime > item.StartTime))
                                    startTime = item.StartTime;
                                if (item.EndTime && (!endTime || endTime < item.EndTime))
                                    endTime = item.EndTime;
                            }
                        }
                        $.holdReady(false);

                        self.$Container.GanttControl("option", "DataSource", null);
                        if (self.Tasks.length > 0) {
                            self.FitToWindow(startTime, endTime);
                            self.$Container.GanttControl({
                                WorkTimeSchedule: null
                                , DataSource: self.Tasks
                            });

                            self.Control.Model.ActivityUpdated.subscribe(self.ActivityUpdated);
                        }

					} finally {
                        loading = false;
                    }

                    if (typeof onsuccess === "function")
                        onsuccess(self);
                }
            })
        };

        $.holdReady(true);
        Asyst.APIv2.View.load({
            viewName: Options.Custom_LoadViewName,
            data: {ActivityId: self.ActivityId},
            success: success,
            async: async
        });
        return self;
    };

    self.save = function (async, delayed, onsuccess, onerror) {

        var success = function () {
            self.Changes = {};

            if (typeof onsuccess === "function")
                onsuccess(self);
        };

        var error = function (a, b) {
            console.log(a);
            console.log(b);

            if (typeof onerror === "function")
                onerror(self, a, b);
            else if (a == Globa.ErrorOnCheckSave) {
                NotifyError(a, b);
            }
        };

        var dosave = function () {
            saveTimeout = undefined;

            if (self.HasChanges()) {
                var batch = new Asyst.API.Form.Batch(Options.Custom_SavePointFormName);
                var changeCount = 0;
                var needToReload = false;
                var ppArray = [];
                for (var key in self.Changes) {
                    if (self.Changes.hasOwnProperty(key)) {
                        var change = self.Changes[key];
                        if (!change.isEmpty()) {

                            var isChangeValid = true;
							
							if (change.hasOwnProperty('Name') && change.Name == '') {
								isChangeValid = false;
								alert('Невозможно сохранить задачу без названия');
                            }
                            if (change.oldValues && change.oldValues.hasOwnProperty('Effort')) {
                                var task = self.TaskById(change.id);
                                var dbmTask = self.Control.Model.ActivityById[task.ID];
                                if ((task.IsMilestone && task.Effort > 0) || (!task.IsMilestone && task.Effort == 0 && dbmTask.ChildActivities.length ==0)) {
                                    isChangeValid = false;
                                    alert('Невозможно преобразовать задачу в точку и наоборот');
                                }
                            }
                            
                            if (change.PointPoint) {
                                isChangeValid = (function (changeInfo) {
                                    // Список суммарных задач (для валидации)
                                    var summaryTasks = [];
                                    var pointId = changeInfo.id;
									
                                    // Валидация суммарных задач
                                    changeInfo.PointPoint.forEach(function (item, index) {
                                        if (item) {
                                            var link = getLinkInfoFromString(item);
											
                                            var taskSource = self.TaskById(link.pointId);
                                            var taskDestination = self.TaskById(pointId);
                                            if (self.ActivityIsParent(taskSource)) {
                                                summaryTasks.push(taskSource);
                                            }
                                            if (self.ActivityIsParent(taskDestination)) {
                                                summaryTasks.push(taskDestination);
                                            }
                                        }
                                    });

                                    if (summaryTasks.length > 0) {
                                        var summaryTasksCodes = summaryTasks.map(function(el) { return el.Code }).join(', ');
                                        if (summaryTasks.length == 1) {
                                            alert('Невозможно создать связь с участием суммарной задачи: ' + summaryTasksCodes);
                                        } else {
                                            alert('Невозможно создать связь с участием суммарных задач: ' + summaryTasksCodes);
                                        }
                                        return false;
                                    }
									
                                    // Валидация циклических связей
                                    // Создаем граф
                                    var graph = self.Tasks.map(function (el) {
                                        return { 
                                            ID: el.ID,
                                            predecessors: !el.PredecessorIndices ? null : el.PredecessorIndices
												.split(",")
												.map(function (el) {
												    var linkInfo = getLinkInfoFromString(el);
												    if (linkInfo) {
												        var activity = self.Control.Model.ActivityById[linkInfo.pointId];
												        if (activity) {
												            return linkInfo.pointId;
												        } else {
												            return null;
												        }
												    } else {
												        console.log('linkInfo is null: el = ' + el);
												    }
												})
                                        };
                                    });
                                    // Применяем к графу сделанные изменения
                                    changeInfo.PointPoint.forEach(function (item, index) {
                                        var link = getLinkInfoFromString(item);
                                        if (link) {
                                            var graphElement = graph.filter(function (el) { return el.ID == pointId; });
                                            if (graphElement && graphElement.length) {
                                                graphElement = graphElement[0];
                                                if (graphElement.predecessors.indexOf(link.pointId) == -1) {
                                                    graphElement.predecessors.push(link.pointId);
                                                }
                                            }
                                        }
                                    });
                                    // Проверяем граф на цикличность
                                    var hasCycle = self.GraphHasCycles(graph);
                                    if (hasCycle) {
                                        alert('Попытка создания циклической связи!');
                                        return false;
                                    }
									
                                    // Непосредственное сохранение связей.
                                    // Если мы дошли до этого места - значит вся валидация пройдена.
                                    changeInfo.PointPoint.forEach(function (item, index) {
                                        if (item) {
                                            var link = getLinkInfoFromString(item);
                                            ppArray.push(function() {
                                                Asyst.APIv2.DataSet.load({
                                                    name: "AppendPointLink",
                                                    data: {
                                                        pointId: pointId,
                                                        previousPointId: link.pointId,
                                                        linkType: link.type,
                                                        lag: link.lag ? link.lag / 24 : link.lag
                                                    }
                                                });
                                            });
                                            //changeInfo.PointPoint[index] = link.pointId;
                                            delete changeInfo.PointPoint;
                                        }
                                    });
                                    return true;
                                })(change);
                            }
                            if (isChangeValid) {
                                batch.add(change.id, change);
                                changeCount++;
                            } else {
                                needToReload = true;
                            }
                        }
                    }
                }
                if (changeCount > 0) {
                    $.when(batch.save(success, error, async)).then(function() {
                        ppArray.forEach(function(updFunc) {updFunc();});
                    });
                } else {
                    self.Changes = {};
                }

                if (needToReload) {
                    self.reload();
                }
            }
        };

        if (delayed) {
            // Сохраняем с задержкой, чтобы накопить изменения
            saveTimeout = setTimeout(dosave, 500);
        } else {
            dosave();
        }

        return self;
    };

    self.TaskByCode = function (code) {
        var i;
        for (i = 0; i < self.Tasks.length; i++) {
            if (self.Tasks[i].Code == code)
                return self.Tasks[i];
        }
        return null;
    }
    self.TaskById = function (id) {
        var i;
        for (i = 0; i < self.Tasks.length; i++) {
            if (self.Tasks[i].ID == id)
                return self.Tasks[i];
        }
        return null;
    }

    /// Индикаторы

    self.GetActivityIndicator = function (activity) {
        if (!activity.DataSource.HasIndicator || activity.DataSource.Indicator === undefined || activity.DataSource.Indicator === null) {
            var stat = {};

            stat.IsDone = self.ActivityIsDone(activity);
            stat.IsOverdue = self.ActivityIsOverdue(activity);
            stat.IsOut = self.ActivityIsOut(activity);

            stat.Total = 1;
            stat.Done = stat.IsDone ? 1 : 0;
            stat.Overdue = stat.IsOverdue ? 1 : 0;
            stat.Out = stat.IsOut ? 1 : 0;

            if (activity.ChildActivities && activity.ChildActivities.length > 0) {
                for (var i = 0; i < activity.ChildActivities.length; i++) {
                    var child = activity.ChildActivities[i];

                    if (child && child.DataSource) {
                        self.GetActivityIndicator(child);

                        stat.Total += child.DataSource.Statistics.Total;
                        stat.Done += child.DataSource.Statistics.Done;
                        stat.Overdue += child.DataSource.Statistics.Overdue;
                        stat.Out += child.DataSource.Statistics.Out;

                        stat.Total++;
                        if (child.DataSource.Statistics.IsDone) stat.Done++;
                        if (child.DataSource.Statistics.IsOverdue) stat.Overdue++;
                        if (child.DataSource.Statistics.IsOut) stat.Out++;
                    }
                }
            }

            activity.DataSource.Statistics = stat;
            activity.DataSource.Indicator = self.RecalcActivityIndicator(activity);
            activity.DataSource.IndicatorTitle = self.IndicatorTitles[activity.DataSource.Indicator];
            activity.DataSource.HasIndicator = true;
        }
        return activity.DataSource.Indicator;
    };

    self.RecalcActivityIndicator = function (activity) {
        if (activity.DataSource.Statistics.Total == activity.DataSource.Statistics.Done) {
            return 4;
        } else if (activity.DataSource.Statistics.Overdue > 0) {
            return 3;
        } else if (activity.DataSource.Statistics.Out > 0) {
            return 2;
        } else {
            return 0;
        }
    };

    self.TruncDay =function(date) {
        if (date.constructor !== Date) return date;
        date.setHours(0, 0, 0, 0);
        return date;
    }

    self.ActivityIsDone = function (activity) {
        return activity.DataSource.FactEndTime ? true : false;
    };

    self.ActivityIsOverdue = function (activity) {
        var day = new Date();
        day.setDate(day.getDate() - 1);
        return !activity.DataSource.FactEndTime && activity.DataSource.PlanDate < day; //сравниваем с предыдущим днем, чтобы минуты-часы не мешались.
    };

    self.ActivityIsOut = function (activity) {
        var day = new Date();
        day.setDate(day.getDate() - 1);
        if (activity.IsMilestone){
            return !activity.DataSource.FactEndTime && self.TruncDay(activity.DataSource.PlanDate) >= self.TruncDay(new Date()) && self.TruncDay(activity.EndTime) > self.TruncDay(activity.DataSource.PlanDate);
        }
        else {
            var realEndTime = new Date(activity.EndTime - 86400000);
            return !activity.DataSource.FactEndTime && self.TruncDay(activity.DataSource.PlanDate) >= self.TruncDay(new Date()) && self.TruncDay(realEndTime) > self.TruncDay(activity.DataSource.PlanDate);
        }
    };

	// Является ли активность групповой задачей
    self.ActivityIsParent = function (activity) {
		var tasks = self.Tasks;
		for (var i= 0; i < tasks.length; i++) {
			if (tasks[i].ParentId == activity.ID) {
				return true;
			}
		}

		return false;
    };

	// Содержит ли граф циклы.
	// Функция принимает в себя массив объектов следующей структуры: { ID, predecessors[] }, где predecessors - массив идентификаторов предшествующих элементов.
	// http://cybern.ru/proverka-orgrafa-na-aciklichnost-realizaciya-na-java.html
	self.GraphHasCycles = function(graph) {
		if (!graph || !graph.length) { return false; }
		
		//массив для хранения цветов вершин
		var color = [];
		//флаг, показывающий содержит орграф цикл или нет
		var hasCycle = false;
	
		//процедура обхода в глубину
		function dfsCycle(graphElementId) { 
			//если вершина является черной, то не производим из нее вызов процедуры
			if (color[graphElementId] == 2) { 
				return;
			}
			//выходим из процедуры, если уже нашли один из циклов
			if (hasCycle) { 
				return;
			}
			//если вершина является серой, то орграф содержит цикл
			if (color[graphElementId] == 1) { 
				hasCycle = true;
				return;
			}
			//помечаем вершину как серую
			color[graphElementId] = 1;

			// Проходим по связанным записям
			var graphElement = graph.filter(function (el) { return el.ID == graphElementId; });
			if (graphElement && graphElement.length) {
				graphElement = graphElement[0];
				if (graphElement.predecessors && graphElement.predecessors.length) {
					//запускаем обход из всех вершин, смежных с вершиной graphElement
					for (var i = 0; i < graphElement.predecessors.length; i++) { 
						var predecessor = graphElement.predecessors[i];
						//вызов обхода от вершины predecessor, смежной с вершиной graphElement
						dfsCycle(predecessor); 
						if (hasCycle) {
							return;
						}
					}
				}
			}
			
			//помечаем вершину как черную
			color[graphElementId] = 2;
		}
		
		for (var v = 0; v < graph.length; v++) {
            dfsCycle(graph[v].ID);
        }		
		
		return hasCycle;
	};
	
    self.TimeScale = function (timeUnitWidth, scroll) {
        var $chart = self.$Container.GanttControl('GetGanttChart');
        var chart = $chart.data("GanttChart");
        var visualStartTime = chart.VisualStartTime;
        var startTime = self.Control.Model.Activities_M().StartTime_M();

        chart.BeginUpdate();
        try {
            var viewWidth = chart.options.ViewWidth;

            // The current visible area width of the chart.
            var width = chart.element.find(".rq-gc-topDiv").width();
            if (width < 20) {
                //дефолтная отрисовка на невидимой панели - искусственно завышаем ширину.
                width = 400;
            }

            self.$Container.data("GanttControl")._setOption('BaseTimeUnitWidth', timeUnitWidth);

            // We now want to center this timespan within the chart's scrollable viewWidth. So, we determine the width of the scrolled out portion on each side:
            var hiddenWidthPerSide = (viewWidth - width) / 2;
            // We convert the hiddenWidthPerSide to a timespan
            var hiddenTimePerSide = new RQTimeSpan(chart.options.ComputedStartTime - chart.ConvertXToTime(hiddenWidthPerSide));

            // We now know what our start time should be for this new view.
            chart.SetStartTime(startTime.clone().addTimeSpan(hiddenTimePerSide));
        } finally {
            chart.EndUpdate();
        }

        var $chartArea = chart.HScrollBar;
        var newXpos = chart.ConvertTimeToX(scroll ? startTime : visualStartTime);
        $chartArea.scrollLeft(newXpos);

        self.Control.RedrawChartRows();
    };

    self.ZoomIn = function () {
        var $chart = self.$Container.GanttControl('GetGanttChart');
        var chart = $chart.data("GanttChart");
        var unitWidth = chart.options.BaseTimeUnitWidth;
        self.TimeScale(unitWidth + unitWidth / 2);
    };

    self.ZoomOut = function () {
        var $chart = self.$Container.GanttControl('GetGanttChart');
        var chart = $chart.data("GanttChart");
        var unitWidth = chart.options.BaseTimeUnitWidth;
        self.TimeScale(unitWidth - unitWidth / 3);
    };

    self.FitToWindow = function (startTime, endTime) {
        var $chart = self.$Container.GanttControl('GetGanttChart');
        var chart = $chart.data("GanttChart");
        // To Prevent Chart from updating until we are done with everything.
        chart.BeginUpdate();
        var i = 0
            , item;
        if (!startTime) {
            for (i = 0; i < self.Tasks.length; i++) {
                item = self.Tasks[i];
                if (item.StartTime && (!startTime || startTime > item.StartTime))
                    startTime = item.StartTime;
            }
        }
        if (!endTime) {
            for (i = 0; i < self.Tasks.length; i++) {
                item = self.Tasks[i];
                if (item.EndTime && (!endTime || endTime < item.EndTime))
                    endTime = item.EndTime;
            }
        }

        var rqUtiles = RadiantQ.Gantt.Utils.TimeComputingUtils;
        var viewWidth = chart.options.ViewWidth;
        var baseTimeunitWidth = chart.options.BaseTimeUnitWidth;
        var baseTimeScaleType = chart.options.BaseTimeScaleType;

        // To get the no of timeunites required to render this timespan.

        var newTimeUnits = 0;
        if (startTime && endTime) {
            newTimeUnits = rqTCUtils.ConvertTimeSpanToTimeUnits(baseTimeScaleType, rqTCUtils.GetTimeSpan(startTime, endTime));
        }
        if (newTimeUnits === 0) {
            return;
        }
        // The current visible area width of the chart.
        var width = chart.element.find(".rq-gc-topDiv").width();
        if (width < 20) {
            //дефолтная отрисовка на невидимой панели - искусственно завышаем ширину.
            width = 400;
        }
        // Computes the width of each time unit, if it has to fill the "width".
        // This will be our current zoom level (BaseTimeUnitWidth).
        var newBaseUnitwidth = width / newTimeUnits;
        self.$Container.data("GanttControl")._setOption('BaseTimeUnitWidth', newBaseUnitwidth);

        // We now want to center this timespan within the chart's scrollable viewWidth. So, we determine the width of the scrolled out portion on each side:
        var hiddenWidthPerSide = (viewWidth - width) / 2;
        // We convert the hiddenWidthPerSide to a timespan
        var hiddenTimePerSide = new RQTimeSpan(chart.options.ComputedStartTime - chart.ConvertXToTime(hiddenWidthPerSide));

        // We now know what our start time should be for this new view.
        chart.SetStartTime(startTime.clone().addTimeSpan(hiddenTimePerSide));

        //to refresh the chart.
        chart.EndUpdate();

        // Scroll to align the startTime to the left border.
        var newXpos = chart.ConvertTimeToX(startTime);
        var $chartArea = chart.HScrollBar;
        $chartArea.scrollLeft(newXpos);

        self.Control.RedrawChartRows();
    };

    self.reload = function () {
        self.load(false);
        self.$Container.GanttControl("option", "DataSource", null);
        self.$Container.GanttControl({
            WorkTimeSchedule: null
            , DataSource: self.Tasks
        });
        //ganttControl.Model.ActivityUpdated.unsubscribe(saveData);	
        self.Control.Model.ActivityUpdated.subscribe(self.ActivityUpdated);
        //makeTooltips();
        self.FitToWindow();
        self.Control.RedrawChartRows();
    };

    self.$Container = $Container;
    self.ActivityId = ActivityId;
    self.Tasks = [];
    self.CriticalPathActivities = [];
    //Вынесено в настройки вызова (см. в начале файла)
    //self.ViewName = "NewGantt";
    //self.FormName = "PointEditForm";
    self.Changes = {};
    self.TrackCustomFields = ["FactStartTime", "FactEndTime", "ProjectStageTypeId", "PointTypeId", "ParentId"];
    if (Options.TrackCustomFields && Options.TrackCustomFields.length) {
        self.TrackCustomFields = self.TrackCustomFields.concat(Options.TrackCustomFields);
    }
    self.CustomFieldsNames = {
        FactStartTime: "StartFactDate"
        , FactEndTime: "FactDate"
        , ForecastStartTime: "StartForecastDate"
        , ForecastEndTime: "ForecastDate"
    };
    if (Options.CustomFieldsNames) {
        self.CustomFieldsNames = $.extend(self.CustomFieldsNames, Options.CustomFieldsNames);
    }
    self.IndicatorTitles = {};
    self.IndicatorTitles[4] = "Выполнено";
    self.IndicatorTitles[3] = "Просрочено (дата планового окончания уже прошла)";
    self.IndicatorTitles[2] = "Прогноз срыва сроков (прогноз окончания позже плана)";
    self.IndicatorTitles[0] = "В работе по плану";
    self.ActivityPhaseDone = 10018;

    self.AutoSave = false;

    Options.UseVirtualization = true;
    Options.DataSource = self.Tasks;
    Options.CanInsertPropertyChangeTriggeringPropertiesInData = true;

    if (!Options.hasOwnProperty("WBSIDBinding"))
        Options.WBSIDBinding = new RadiantQ.BindingOptions("WBSID");
    if (!Options.hasOwnProperty("ProvideWBSID"))
        Options.ProvideWBSID = self.WBSIDHandler;
    if (!Options.hasOwnProperty("ProjectStartDate"))
        Options.ProjectStartDate = new Date();
    if (!Options.hasOwnProperty("ZoomOptions"))
        Options.ZoomOptions = RadiantQ.Gantt.ChartZoomOptions.None;
    if (!Options.hasOwnProperty("TimeRangeHighlightBehavior"))
        Options.TimeRangeHighlightBehavior = RadiantQ.Gantt.TimeRangeHighlightBehavior.HighlightInChartOnHeaderMouseHover;
    if (!Options.hasOwnProperty("CanUserReorderRows"))
        Options.CanUserReorderRows = true;
    if (!Options.hasOwnProperty("WorkTimeSchedule"))
        Options.WorkTimeSchedule = null;
    if (!Options.hasOwnProperty("TaskBarBrowseToCueLeftTemplate"))
        Options.TaskBarBrowseToCueLeftTemplate = "<button></button>";
    if (!Options.hasOwnProperty("TaskBarBrowseToCueRightTemplate"))
        Options.TaskBarBrowseToCueRightTemplate = "<button></button>";
    if (!Options.hasOwnProperty("TablePanelWidth"))
        Options.TablePanelWidth = 600;

    if (!Options.hasOwnProperty("TaskItemTemplate"))
        Options.TaskItemTemplate = Asyst.Gantt.TaskItemTemplate;
    if (!Options.hasOwnProperty("MileStoneTemplate"))
        Options.MileStoneTemplate = Asyst.Gantt.MileStoneTemplate;
    if (!Options.hasOwnProperty("TaskBarBackgroundTemplate"))
        Options.TaskBarBackgroundTemplate = Asyst.Gantt.TaskBarBackgroundTemplate;
    if (!Options.hasOwnProperty("ParentTaskItemTemplate"))
        Options.ParentTaskItemTemplate = Asyst.Gantt.ParentTaskItemTemplate;
    if (!Options.hasOwnProperty("TaskTooltipTemplate"))
        Options.TaskTooltipTemplate = Asyst.Gantt.TaskTooltipTemplate;
    if (!Options.hasOwnProperty("DependencyTooltipTemplate"))
        Options.DependencyTooltipTemplate = Asyst.Gantt.DependencyTooltipTemplate;
    if (!Options.hasOwnProperty("IsTaskReadOnlyBinding")) {
        Options.IsTaskReadOnlyBinding = {
            Property: "activity.DataSource"
            , Converter: function (value, src, target) {
                return (value.IsReadOnly == 1);
            }
        };
    }
    if (!Options.hasOwnProperty("GanttChartTemplateApplied")) {
        Options.GanttChartTemplateApplied = function (sender, args) {
            var $GanttChart = args.element;
            $GanttChart.GanttChart({
                AnchorTime: new Date()
                , ViewWidth: 2000
                , ResizeToFit: false
            });
        };
    }
    if (!Options.hasOwnProperty("TimeScaleHeaders")) {

        var tmshs = new RadiantQ.Gantt.TimeScaleHeaderDefinitions();
        var yearHeader = new RadiantQ.Gantt.TimeScaleHeaderDefinition();
        yearHeader.Type = ns_gantt.TimeScaleType.Years;
        tmshs.add(yearHeader);
        var monthHeader = new RadiantQ.Gantt.TimeScaleHeaderDefinition();
        monthHeader.TextFormat = "MMM yyyy";
        monthHeader.Type = ns_gantt.TimeScaleType.Months;
        tmshs.add(monthHeader);
        var daysHeader = new RadiantQ.Gantt.TimeScaleHeaderDefinition();
        daysHeader.Type = ns_gantt.TimeScaleType.Days;
        tmshs.add(daysHeader);

        Options.TimeScaleHeaders = tmshs;
    }
    if (!Options.hasOwnProperty("SpecialLineInfos")) {
        var SpecialLineInfos = new ObservableCollection();
        var todayLine = new RadiantQ.Gantt.SpecialLineInfo();
        todayLine.LineDateTime = new Date();
        todayLine.ToolTipText = 'Сегодня';
        todayLine.LineColor = 'green';
        SpecialLineInfos.add(todayLine);

        Options.SpecialLineInfos = SpecialLineInfos;
    }

    $Container.GanttControl(Options);
    self.Control = $Container.data("GanttControl");
    self.Control.Model.ActivityUpdated.subscribe(self.ActivityUpdated);

    var table = self.Control.GetGanttTable();
    // BEGIN*****[Posmitniy, 2016-12-26] Отрефакторил table.isEditable
    table.isEditableOriginal = table.isEditable;
    table.isEditable = function (a, b) {
        var isGlobalReadOnly = self.Control.options.IsReadOnly;
        return !isGlobalReadOnly
            && table.isEditableOriginal(a, b)
            && (!b.isEditabled || b.isEditabled(a));
    };
    // END*****[Posmitniy, 2016-12-26] Отрефакторил table.isEditable

    var chart = self.Control.GetGanttChartInstance();
    chart.options.ShowVerticalScrollBar = true;

    var $chart = $(self.Control.GetGanttChart());
    var $table = self.Control.GetGanttTable().uiGridBody;
    $chart.mousewheel(function (event, delta) {
        $table.scrollTop($table.scrollTop() - delta * 25);
    })

    return self;
};

/// Editors

Asyst.Gantt.registerDateEditor = function () {

    RadiantQ.Binder.dateEditor = function () {
        this.init = function ($elem, role, value, data) {

            var setDate = function ($input) {
                var newDate = Asyst.date.parse($input.val(), "dd.MM.y");
                var ajustedDate = Asyst.date.ajustToUtc(newDate);
                var field = $input.data("field");
                var act = data.Activity;

                if (newDate){
                    if (field === 'EndTime') {
                        if (act.DataSource.IsMilestone) {
                            act.EndTime = ajustedDate;
                            act.StartTime = ajustedDate;
                            act.Effort = new RQTimeSpan(0, 0, 0, 0, 0, 0);
                        } else {
                            ajustedDate.setDate(ajustedDate.getDate() + 1); // накидываем день, чтобы смирить ганта и однодневные задачи 
                            act[field] = ajustedDate; 
                        }
                    } else if (field === 'StartTime') {
                        act[field] = ajustedDate;
                    } else {
                        act.DataSource[field] = newDate;
                    }

                    if (field === 'FactEndTime' && newDate) {
                        act.ProgressPercent = 100;
                    }
                }
            }

            $elem.change(function () {
                setDate($(this));
            });

            $elem.datepicker({
                showButtonPanel: true
                , changeMonth: true
                , changeYear: true
                , dateFormat: "dd.mm.yy"
            });

            $elem.datepicker("setDate", Asyst.date.format(value.getter(data)));
        };
    };
};

Asyst.Gantt.registerBootstrapDateEditor = function () {

    RadiantQ.Binder.dateEditor = function () {
        this.init = function ($elem, role, value, data) {
            $elem.val(Asyst.date.format(value.getter(data)));

            $elem.datepicker();

            $elem.change(function () {
                var newDate = Asyst.date.parse($(this).val(), "dd.MM.y");
                var field = $(this).data("field");
                var act = data.Activity;
                if (field == 'EndTime') {
                    if (act.DataSource.IsMilestone) {
                        act.EndTime = newDate;
                        ///data.Activity.Effort = new RQTimeSpan(0,0,0,0,0,0);

                        act.StartTime = newDate;
                        act.Effort = new RQTimeSpan(0, 0, 0, 0, 0, 0);
                    } else {
                        act[field] = newDate;
                    }
                } else if (field == 'StartTime') {
                    act[field] = newDate;
                } else
                    act.DataSource[field] = newDate;
                if (field == 'FactEndTime' && newDate)
                    act.ProgressPercent = 100;
            });
        };
    };
};

Asyst.Gantt.registerPointTypeEditor = function () {
    var pointTypeList = [];
    Asyst.APIv2.DataSource.load({
        sourceType: 'form',
        sourceName: 'PointEditForm',
        elementName: 'PointTypeId',
        data: {ActivityId: Gantt.ActivityId},
        success: function (data) {
            for (var i = 0; i < data.length; i++)
                pointTypeList.push({
                    id: data[i].Key,
                    title: data[i].Value
                });
        },
        async: false,
        isPicklist: true
    });

    RadiantQ.Binder.pointTypeEditor = function () {
        this.init = function ($elem, role, value, data) {
            for (var i = 0; i < pointTypeList.length; i++) {
                $elem.append("<option value=" + pointTypeList[i].id + ">" + pointTypeList[i].title + "</option>");
            }
            $elem.val(value.getter(data));
            $elem.change(function () {
                data.Activity.DataSource.PointTypeId = $(this).val();
                data.Activity.DataSource.PointTypeName = $(this).find('option:selected').text();
            });
        };
    };
};

Asyst.Gantt.registerProjectStageEditor = function (ActivityId) {

    var projectStageList = [];
    var reload = function (currentValue) {
        Asyst.APIv2.DataSource.load({
            sourceType: 'form',
            sourceName: 'PointEditForm',
            elementName: 'ProjectStageTypeId',
            data: {ProjectId: ActivityId, ProjectStageTypeId: currentValue},
            success: function (data) {
                projectStageList.length = 0;
                for (var i = 0; i < data.length; i++)
                    projectStageList.push({
                        id: data[i].Key
                        , title: data[i].Value
                    });

            },
            async: false,
            isPicklist: true
        });
    };
    reload(null);

    RadiantQ.Binder.projectStageEditor = function () {
        this.init = function ($elem, role, value, data) {
            reload(data.Activity.DataSource.ProjectStageTypeId);

            $elem.append("<option value='null'>" + "" + "</option>");
            for (var i = 0; i < projectStageList.length; i++) {
                $elem.append("<option value=" + projectStageList[i].id + ">" + projectStageList[i].title + "</option>");
            }
            $elem.val(value.getter(data));
            $elem.change(function () {
                var $element = $(this);
                if ($element.val() == 'null')
                    data.Activity.DataSource.ProjectStageTypeId = null;
                else
                    data.Activity.DataSource.ProjectStageTypeId = $element.val();
                data.Activity.DataSource.ProjectStageTypeName = $element.find('option:selected').text();
            });
        };
    };
};

Asyst.Gantt.registerPredecessorsEditor = function () {

    RadiantQ.Binder.predecessorsEditor = function () {
        this.init = function ($elem, role, value, data) {
            //var activities = data.Activity.Model.AllActivities.asArray;
            //var id = value.getter(data);
            //$elem.append("<option value='null'>" + "" + "</option>");

            //for (var i = 0; i < activities.length; i++) {
            //    $elem.append("<option value='" + activities[i].ID + "'>" + activities[i].DataSource.CodeName + "</option>");
            //}

            $elem.val(data.Activity.DataSource.GetPredecessorCodes());
            $elem.change(function () {
                var $element = $(this);
                var codes = $element.val();
                if (codes)
                    data.Activity.DataSource.SetPredecessorCodes(codes);
                else
                    data.Activity.DataSource.PredecessorIndices = null;
            });
        };
    };
};

/// Templates


//Asyst.Gantt.TaskItemTemplate = "<div class='taskbar-style ${Asyst.Gantt.UpdateCritical(data)}'><div id='GanttTaskBarLabel' class='rq-gc-taskbar-label'></div></div>";
Asyst.Gantt.TaskItemTemplate = "<div class='taskbar-style ${Asyst.Gantt.UpdateCritical(data)}'/>";
Asyst.Gantt.MileStoneTemplate = "<div class='rq-gc-milestoneBar ${Asyst.Gantt.UpdateCritical(data)} ${Asyst.Gantt.UpdateCompleted(data)}'/>";
Asyst.Gantt.TaskBarBackgroundTemplate = "${Asyst.Gantt.BaselineUniversal(data)}";

/*Asyst.Gantt.ParentTaskItemTemplate = "<div class='rq-gc-parentBar''>\
 <div class='rq-gc-parentBar-leftCue'></div>\
 <div class='rq-gc-parentBar-middle'></div>\
 <div class='rq-gc-parentBar-rightCue'>\
 <div id='GanttTaskBarLabel' class='rq-gc-taskbar-label'></div>\
 </div>\
 <div class='rq-gc-start-verticalLine' style='width:0px;'></div>\
 <div class='rq-gc-end-verticalLine' style='width:0px;'>\
 </div>\
 ${ Asyst.Gantt.ParentBaselineTemplate(data) }";*/
Asyst.Gantt.ParentTaskItemTemplate =
    "<div class='rq-gc-parentBar''>" +
    "    <div class='rq-gc-parentBar-leftCue'/>" +
    "    <div class='rq-gc-parentBar-middle'><div class='parentbar-progress' style='width:${data.ProgressPercent}%'></div></div>" +
    "    <div class='rq-gc-parentBar-rightCue'/>" +
    "${ Asyst.Gantt.ParentBaselineTemplate(data) }";

Asyst.Gantt.TaskTooltipTemplate =
    "<div align='left'>" +
    "    <table class='TaskTooltip' style='white-space:nowrap;border:none;'>" +
    "        <tr>" +
    "            <td colspan='2'><b>${ data.DataSource.Code } ${ data.ActivityName_M() }</b></td>" +
    "        </tr>" +
    "        <tr>" +
    "            <td style='color: gray'>Прогноз:</td>" +
    //"            <td>#if (data.DataSource.ForecastStartTime){# c #= data.DataSource.ForecastStartTime.toString('dd.MM.yyyy') # #}# #if (data.DataSource.ForecastEndTime){# по #= data.DataSource.ForecastEndTime.toString('dd.MM.yyyy') # #}#</td>" +
    "            <td>#if (data.StartTime){# c #= data.StartTime.toString('dd.MM.yyyy') # #}# #if (data.EndTime){# по #= data.DataSource.GetAsystEndTime().toString('dd.MM.yyyy') # #}#</td>" +
    "        </tr>" +
    "        <tr>" +
    "            <td style='color: gray'>Факт:</td>" +
    "            <td>#if (data.DataSource.FactStartTime){# c #= data.DataSource.FactStartTime.toString('dd.MM.yyyy') # #}# #if (data.DataSource.FactEndTime){# по #= data.DataSource.FactEndTime.toString('dd.MM.yyyy') # #}#</td>" +
    "        </tr>" +
    "        <tr>" +
    "            <td style='color: gray'>План:</td>" +
    "            <td>#if (data.DataSource.StartPlanDate){# с #= data.DataSource.StartPlanDate.toString('dd.MM.yyyy') # #}# #if (data.DataSource.PlanDate){# по #= data.DataSource.PlanDate.toString('dd.MM.yyyy') # #}#</td>" +
    "        </tr>" +
    "        <tr>" +
    "            <td style='color: gray'>Длительность:</td>" +
    "            <td>${ data.Duration_M().days_M()} дн &nbsp;</td>" +
    "        </tr>" +
    "        <tr>" +
    "            <td style='color: gray'>% выполнения:</td>" +
    "            <td>${ data.ProgressPercent_M() }%</td>" +
    "        </tr>" +
    "    </table>" +
    "</div>";

Asyst.Gantt.ConnectingTooltipTemplate = function (data) {
    return "<div align='left'>" +
        "    <table class='rq-gc-taskbar-popup  ui-widget-content'' style='white-space:nowrap;border:none;'>" +
        "        <tr>" +
        "            <td colspan='2' align='center'><b>${ RadiantQ_FinishToStartLinkString }</b></td>" +
        "        </tr>" +
        "        <tr align='left'>" +
        "            <td><b>${ RadiantQ_FromFinishOfString }  :</b></td>" +
        "            <td>&nbsp;${ data.ConnectingInfoFromTaskText }</td>" +
        "        </tr>" +
        "        <tr align='left'>" +
        "            <td style='color: gray'>Последователь:</td>" +
        "            <td>&nbsp;${ data.DataSource.WBSID }</td>" +
        "            <td>&nbsp;${ data.DataSource.Code }</td>" +
        "            <td>&nbsp;${ data.DataSource.ActivityName }</td>" +
        "        </tr>" +
        "    </table>" +
        "</div>";
};

Asyst.Gantt.DependencyTooltipTemplate = function (line) {
    return "<div>" +
        "    <table>" +
        "        <tr>" +
        "            <td style='color: gray'>" + window.RadiantQ_TaskLinkString + ":</td>" +
        "            <td colspan='3'>" + window["RadiantQ_" + line.options.DependencyView.DependencyType_M()] + "</td>" +
        "        </tr>" +
        "        <tr>" +
        "            <td style='color: gray'>Пред:</td>" +
        "            <td style='min-width: 30px'>" + line.options.DependencyView.StartActivity.WBSID_M() + "</td>" +
        "            <td style='min-width: 50px'>" + line.options.DependencyView.StartActivity.DataSource.Code + "</td>" +
        "            <td>" + line.options.DependencyView.StartActivity.ActivityName_M() + "</td>" +
        "        </tr>" +
        "        <tr>" +
        "            <td style='color: gray'>Cлед:</td>" +
        "            <td>" + line.options.DependencyView.EndActivity.WBSID_M() + "</td>" +
        "            <td>" + line.options.DependencyView.EndActivity.DataSource.Code + "</td>" +
        "            <td>" + line.options.DependencyView.EndActivity.ActivityName_M() + "</td>" +
        "        </tr>" +
        "    </table>" +
        "</div>";
};

Asyst.Gantt.UpdateBackgroundColorBinding = function (data) {
    var isCritical = Gantt.CriticalPathActivities.indexOf(data) != -1;
    // for background-image
    if (isCritical)
        return 'url(jsControls/radiantQ/Images/redBar.png)';
    return 'url(jsControls/radiantQ/Src/Styles/Images/TaskBar.png)';
};

Asyst.Gantt.UpdateBorderColorBinding = function (data) {
    var isCritical = Gantt.CriticalPathActivities.indexOf(data) != -1;
    // for background-color
    if (isCritical)
        return 'red';
    return '#050DFA';
};

Asyst.Gantt.UpdateCritical = function (data) {
    var isCritical = Gantt.CriticalPathActivities.indexOf(data) != -1;
    if (isCritical)
        return 'critical';
    else
        return 'notcritical';
};

Asyst.Gantt.UpdateCompleted = function (data) {
    if (data.ProgressPercent == 100)
        return "completed";
    else
        return "notcompleted";
};

Asyst.Gantt.BaselineUniversal = function (data) {
    var $ganttChart = $('#ganttplace').GanttControl('GetGanttChart');
    var ganttChart = $ganttChart.data("GanttChart");
    var DataSource = data.DataSource;
    if (!DataSource)
        DataSource = data.ActivityView.Activity.DataSource;
    if (DataSource.IsMilestone) {
        var rightX = ganttChart.ConvertTimeToX(DataSource.PlanDate);
        //return '<div class="baselineMilestone" style="margin-left: ' + (rightX - 7) + 'px;" title="" data-original-title=""></div>';
        return '<div class="baselineMilestone" style="margin-left: ' + (rightX - 7) + 'px;"/>';
    } else {
        var plannedStart = DataSource.StartPlanDate;
        var plannedEnd = Asyst.date.addDay(DataSource.PlanDate,1); //нам нужно окончание дня а не начало
        var rightX = plannedEnd ? ganttChart.ConvertTimeToX(plannedEnd)-1 : 0;
        var leftX = plannedStart ? ganttChart.ConvertTimeToX(plannedStart) : 0;
        return "<div class='backgroundBaseline-style' style='width: " + (rightX - leftX) + "px; margin:1px 0px 1px " + leftX + "px'/>";
    }
};

Asyst.Gantt.ParentBaselineTemplate = function (data) {
    var $ganttChart = $('#ganttplace').GanttControl('GetGanttChart');
    var ganttChart = $ganttChart.data("GanttChart");
    var DataSource = data.DataSource;
    if (!DataSource) {
        data = data.ActivityView.Activity;
        DataSource = data.DataSource;
    }

    var startTime = DataSource.StartTime;
    var plannedStart = DataSource.StartPlanDate;
    var plannedEnd = Asyst.date.addDay(DataSource.PlanDate, 1);
    if (!plannedStart || !plannedEnd || plannedStart == plannedEnd)
        return null;

    var offsetX = startTime ? ganttChart.ConvertTimeToX(startTime) : 0;
    var rightX = plannedEnd ? ganttChart.ConvertTimeToX(plannedEnd)-1 - offsetX : 0;
    var leftX = plannedStart ? ganttChart.ConvertTimeToX(plannedStart) - offsetX : 0;
    return "<div class='parentBaseline' style='width: " + (rightX - leftX) + "px; margin-left:" + (leftX+7/*ПОЧЕМУ!??!*/) + "px'><div class='parentBaseline-middle'/></div>";
};

Asyst.Gantt.WidthConverter = function (data) {
    var ganttChart = data.GanttChart;
    var DataSource = data.ActivityView.Activity_M().DataSource_M();
    if (DataSource.IsMilestone)
        return "0px";
    var plannedStart = DataSource.StartPlanDate;
    var plannedEnd = Asyst.date.addDay(DataSource.PlanDate, 1);
    // Use this utility in GanttChart to determine the location of the past due bar.
    var rightX = plannedEnd ? ganttChart.ConvertTimeToX(plannedEnd)-1 : 0;
    var leftX = plannedStart ? ganttChart.ConvertTimeToX(plannedStart) : 0;
    return (rightX - leftX) + "px";
};

/* Не найдено использования
// Calculating the left margin for TaskBarBackgroundTemplate
Asyst.Gantt.LeftConverter = function (data) {
    var ganttChart = data.GanttChart;
    if (data.ActivityView.Activity.DataSource.IsMilestone)
        return "1px 0px 1px 0px";
    var plannedStart = data.ActivityView.Activity.DataSource.StartPlanDate;
    // Return the setting for the margin.
    return "1px 0px 1px " + (plannedStart ? ganttChart.ConvertTimeToX(plannedStart) : 0) + "px";
};
*/
 
 /* Не найдено использования
// Using the bound data in tooltip for TaskBarBackgroundTemplate
Asyst.Gantt.TaskBarBGTmplTooltip = function (data) {
    data.rendered = function () {
        $(this.nodes).tooltip({
            content: function (val) {
                var toolTipDateformat = 'dd-MMM-yyyy';
                var ds = data("tmplItem").data.ActivityView.Activity_M().DataSource_M();
                var PStartTime = ds.StartPlanDate.toString(toolTipDateformat);
                var PEndTime = ds.PlanDate.toString(toolTipDateformat);
                return "<div align='center'><span style='font-weight:bold'>BaseLine</span></div><div><span style='font-weight:bold'>Start:</span> " + PStartTime + "</div><div><span style='font-weight:bold'>End:</span> " + PEndTime + "</div>";
            }
        });
    };
    return "";
};
*/