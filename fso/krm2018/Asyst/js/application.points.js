/*
    Компонент для создания обязательных контрольных точек
*/

jQuery.fn.requiredPoints = function (options) {

    var settings = jQuery.extend({
        title: Globa.PointTitle.locale(),
        id: 0,
        pointTemplates: []
    }, options);


    return this.each(function () {
        
        var el = $(this);
        var form = Asyst.Workspace.currentForm;

        var selector = el[0].nodeName;

        var id = el.attr("id");
        if (id) {
            selector += "#" + id;
        }

        var classNames = el.attr("class");
        if (classNames) {
            selector += "." + $.trim(classNames).replace(/\s/gi, ".");
        }

        var s = '';
        s += '<div class="well required-points">';
        s += '<table class="table table-condensed required-points-content">';
        s += '<thead>';
        s += '	<tr>';
        s += '		<th>' + settings.title + '</th>';
        s += '		<th></th>';
        s += '	</tr>';
        s += '</thead>';
        s += '<tbody>';

        var cnt = 0;
        
        if (settings.pointTemplates && settings.pointTemplates.length > 0) {
            var lastPhaseId = -1;
            for (var i = 0; i < settings.pointTemplates.length; i++) {
                var pointTemplate = settings.pointTemplates[i];

                if (!pointTemplate.PlanDate) {
                    var flag = true;
                    var isRequired = pointTemplate.IsRequired && form.Data.ActivityPhaseId == pointTemplate.ActivityPhaseId;
                    if (typeof form !== "undefined" && form.Access) {
                        if (form.Access.hasOwnProperty('point'+pointTemplate.PointTemplateId)) {
                            flag = form.Access['point' + pointTemplate.PointTemplateId].IsVisible;
                            isRequired = (form.Access['point' + pointTemplate.PointTemplateId].IsRequired) || isRequired;
                        }
                    }
                    if (flag) {
                        //если начались точки нового этапа - пишем его заголовок
                        if (lastPhaseId !== pointTemplate.ActivityPhaseId) {
                            s += '  <tr>';
                            s += '    <td><b style="padding-left:5px">' + pointTemplate.ActivityPhaseName + '</b></td>';
                            s += '  </tr>';
                            lastPhaseId = pointTemplate.ActivityPhaseId;
                        }
                        var isTooltip = pointTemplate.Tooltip != null && pointTemplate.Tooltip != "";
                        //пишем точку
                        s += '	<tr>';
                        s += '		<td><div class="point-line" rel="tooltip" data-html="true" title="' + pointTemplate.Tooltip + '">' + pointTemplate.Name + (isTooltip ? "<span class='info-icon'></span>" : "") + '</div></td>';
                        s += '		<td style="text-align:right;">';
                        s += '			' + Globa.Plan.locale() + ':&nbsp;<input id="requiredPointTemplate' + pointTemplate.PointTemplateId + 'PlanDate" name="requiredPointTemplate' + pointTemplate.PointTemplateId + 'PlanDate" type="text" class="date-picker input-small" data-datepicker="datepicker"/>';
                        s += '		</td>';
                        if (isRequired) {
                            s += '		<td style="padding-left:0px; padding-right:0px">';
                            s += '		    <span class="required-phase-input" rel="tooltip" title="' + Globa.JSRequiredPhase.locale() + '"></span>';
                            s += '		</td>';
                        }
                        
                        s += '	</tr>';
                        cnt++;
                    }
                }
            }
        }

        if (cnt > 0) {
            s += '  <tr>';
            s += '  <td>';
            s += '  </td>';
            s += '  <td style="text-align:right;">';
            s += '  	<a id="requiredPointsSave" class="btn btn-small input-mini" onclick="SaveRequiredPoints(\'' + selector + '\')">' + Globa.Save.locale() + '</a>';
            s += '  </td>';
            s += '  </tr>';
        }
        else {
            s += '  <tr>';
            s += '  <td>';
            s += '  ' + Globa.FinishPointsCreated.locale();
            s += '  </td>';
            s += '  <td>';
            s += '  </td>';
            s += '  </tr>';
        }
        s += '	</tbody>';
        s += '</table>';
        s += '</div>';

        el.html(s);
        el.find('.date-picker').datepicker();
        el.find('select').chosen();
        el.data('requiredPoints', settings);

        //добавляем data-html для нового тултипа bootstrapа
        el.find('[rel="tooltip"]').attr('data-html', 'true');
        el.find('[rel="tooltip"]').tooltip();
        el.find('[rel="tooltip"]').on('hidden', function () { return false; });

    });
};

var copyRoles = function (from, to) {
    for (var ind in from) {
        //проверяем, что свойство - массив с пользователями - скорее всего роль
        if (from[ind] !== null && from[ind].constructor == Array) {
            if (from[ind].length > 0 && from[ind][0].hasOwnProperty("classname")) {
                if ((from[ind][0]["classname"] == "Account" || from[ind][0]["classname"] == "User" || from[ind][0]["classname"] == "OrgUnit") && from.hasOwnProperty(ind + "Id")) {
                    var add = {};
                    add[ind + "Id"] = from[ind + "Id"];
                    to = jQuery.extend(to, add);
                }
            }
        }
    }
};
var mergeRoles = function (pointTemplate, formData, data) {
    var union_arrays = function(x, y) {
        if (typeof x === "undefined")
            x = [];
        if (typeof y === "undefined")
            y = [];
            
        var obj = {};
        for (var i = x.length - 1; i >= 0; --i)
            obj[x[i]] = x[i];
        for (var i = y.length - 1; i >= 0; --i)
            obj[y[i]] = y[i];
        var res = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k))  // <-- optional
                res.push(obj[k]);
        }
        return res;
    };
    
    for (var ind in pointTemplate) {
        //поле есть и непустое
        if (pointTemplate.hasOwnProperty(ind) && (pointTemplate[ind] != null)) {
            //поле - действительно роль
            if ((ind.indexOf('Role') == 0) && pointTemplate[ind].hasOwnProperty('entityname') && (pointTemplate[ind].entityname == 'Role'))
                //значение поля есть
                if (pointTemplate[ind].hasOwnProperty('Identifier') && (pointTemplate[ind].Identifier != null))
                    //данные формы содержат нужную роль
                    if (formData.hasOwnProperty(pointTemplate[ind].Identifier) && formData.hasOwnProperty(pointTemplate[ind].Identifier + "Id")) {
                        var add = {};
                        add[ind.substring(4) + "Id"] = formData[pointTemplate[ind].Identifier + "Id"];
                        data = jQuery.extend(data, add);
                    }
        }
        
        //множественные поля
        if (pointTemplate.hasOwnProperty(ind) && (pointTemplate[ind] != null)) {
            //поле - действительно роль
            if ((ind.indexOf('Role') == 0) && ind.indexOf('PointTemplateItems' != -1) &&
                pointTemplate[ind].constructor == Array && pointTemplate[ind].length > 0 &&
                pointTemplate[ind][0].hasOwnProperty('entityname') && (pointTemplate[ind][0].entityname == 'Role') &&
                pointTemplate.hasOwnProperty(ind.substring(0, ind.indexOf('Items')))) 
            {
                var fieldName = ind.substr(4, ind.indexOf('PointTemplateItems') - 4) + "Id";
                var addM = {};
                addM[fieldName] = data[fieldName];
                for (var i = 0; i < pointTemplate[ind].length; i++) {
                    var roleItem = pointTemplate[ind][i];
                    if (roleItem.hasOwnProperty('Identifier') && (roleItem.Identifier != null))
                        //данные формы содержат нужную роль
                        if (formData.hasOwnProperty(roleItem.Identifier) && formData.hasOwnProperty(roleItem.Identifier + "Id")) {
                            var unionArr = union_arrays(addM[fieldName], formData[roleItem.Identifier + "Id"]);
                            addM[fieldName] = unionArr;
                        }
                }
                data = jQuery.extend(data, addM);
            }
        }
    }
};


function RequiredPoints(selector,options) {

    Asyst.APIv2.View.load({
            viewName: 'PointTemplatesRequiredView',
            data: Asyst.Workspace.currentForm.Data,
            success: function(data) {
                $(selector).requiredPoints($().extend({ id: Asyst.Workspace.currentForm.EntityId, pointTemplates: data.data }, options));
            },
            async: true
        }
    );

}

function SaveRequiredPoints(selector) {
    var settings = $(selector).data("requiredPoints");
    var form = Asyst.Workspace.currentForm;
    var formData = form.Data;
    var data = [];
    var pointTemplate;
    var testDate;
    var i;

    Asyst.APIv2.View.load({
            viewName: 'PointTemplatesRequiredView',
            data: Asyst.Workspace.currentForm.Data,
            success: function(inData) {
                settings.pointTemplates = inData.data;
            },
            async: false
        }
    );

	for (i = 0; i < settings.pointTemplates.length; i++) {
	    pointTemplate = settings.pointTemplates[i];

	    if (pointTemplate.PlanDate) 
	        pointTemplate.TestDate = pointTemplate.PlanDate;
	    else
	        pointTemplate.TestDate = Asyst.date.parse($('#' + form.FormName + ' #requiredPointTemplate' + pointTemplate.PointTemplateId + 'PlanDate').val());
	}

	for (i = 0; i < settings.pointTemplates.length; i++) {
	    pointTemplate = settings.pointTemplates[i];

	    if (!pointTemplate.PlanDate) {
	        var planDate = Asyst.date.parse($('#' + form.FormName + ' #requiredPointTemplate' + pointTemplate.PointTemplateId + 'PlanDate').val());
	        if (planDate) {
	            var j;
	            for (j = i - 1; j >= 0; j--) {
	                testDate = settings.pointTemplates[j].TestDate;
	                //введенная дата меньше чем даты точек предыдущих этапов
	                if (testDate && planDate < testDate  && settings.pointTemplates[j].PhasePosition < pointTemplate.PhasePosition) {
                        Dialog(Globa.Error.locale(), Globa.ErrorDatePoint.locale() + ' "' + pointTemplate.Name + '" ' + Globa.ErrorLesserThen.locale() + ' "' + settings.pointTemplates[j].Name + '".');
                        return;
                    }
                }
                for (j = i + 1; j < settings.pointTemplates.length; j++) {
                    testDate = settings.pointTemplates[j].TestDate;
                    //введенная дата больше чем даты точек следующих этапов или завершающей этап точки
                    if (testDate && planDate > testDate  && (settings.pointTemplates[j].PhasePosition > pointTemplate.PhasePosition || settings.pointTemplates[j].IsPhaseFinish == 1)) {
                        Dialog(Globa.Error.locale(), Globa.ErrorDatePoint.locale() + ' "' + pointTemplate.Name + '" '+ Globa.ErrorGreaterThen.locale() + ' "' + settings.pointTemplates[j].Name + '".');
                        return;
                    }
                }

                pointTemplate.TestDate = planDate;
                
                pointTemplate = Asyst.APIv2.Form.load({ formName: "PointTemplateEditForm", dataId: pointTemplate.PointTemplateId, async:false });
	            
	            data[data.length] = {
	                ParentId: formData.ActivityId,
	                BlockId: formData.BlockId,
	                FunctionId: formData.FunctionId,
	                PointTemplateId: pointTemplate.PointTemplateId,
	                PlanDate: planDate,
	                ForecastDate: planDate,
	                Name: pointTemplate.Name,
	                PointTypeId: pointTemplate.PointTypeId,
	                LeaderId: formData.LeaderId,
	                OwnerId: formData.OwnerId
	            };
	            //copyRoles(formData, data[data.length-1]);
	            copyRoles(pointTemplate, data[data.length - 1]);
	            mergeRoles(pointTemplate, formData, data[data.length - 1]);
	        }
	    }
	}
    
	{
		var errorCount = 0;
		var savedCount = 0;

		var finish = function () {
		    if ((savedCount + errorCount) == data.length) {
		        if (errorCount > 0)
		            NotifyError(Globa.CreatingError.locale()," ");
		        form.Reset();
		    }
		};

	    if (data.length == 0) {
	        finish();
	    } else {
	        for (var d in data) {
	            Asyst.APIv2.Entity.save({
	                    entityName: "Point",
	                    dataId: "new",
	                    data: data[d],
	                    success: function() {
	                        savedCount++;
	                        finish();
	                    },
	                    error: function() {
	                        errorCount++;
	                        finish();
	                    },
	                    async: false
	                }
	            );
	        }
	    }

	}
}

/*
    Компонент для создания любых контрольных точек
*/

jQuery.fn.quickPointCreator = function(options) {
    var settings = jQuery.extend({
        title: Globa.OtherPointTitle.locale(),
        id: 0,
        pointTemplates: [],
        isPlanDateRequired: true,
        isPlanDateVisible: true,
        isPointTemplateRequired: false,
        isPointTemplateVisible: true,
        filter:[]
    }, options);


    return this.each(function() {

        var el = $(this);
        var form = Asyst.Workspace.currentForm;

        var selector = '#' + form.FormName + ' ' + el[0].nodeName;

        var id = el.attr("id");
        if (id) {
            selector += "#" + id;
        }

        var uid = 'qpc' + guid();

        var classNames = el.attr("class");
        if (classNames) {
            selector += "." + $.trim(classNames).replace(/\s/gi, ".");
        }

        var s = '';
        s += '<div class="well quick-point-creator">';
        s += '<table class="quick-point-creator-header table table-condensed">';
        s += '	<thead>';
        s += '		<tr>';
        //s += '			<th><a data-toggle="collapse" data-target="' + selector + ' .quick-point-creator-body" style="cursor:pointer;">' + settings.title + '</a></th>';
        s += '			<th>' + settings.title + '</th>';
        s += '		</tr>';
        s += '	</thead>';
        s += '</table>';
        s += '<div class="quick-point-creator-body collapse in">';
        s += '	<table class="table table-condensed quick-point-creator-content">';
        s += '		<tr>';
        if (settings.isPointTemplateVisible) {
            s += '			<td>';
            s += '			    <div class="control-group">';
            s += '				    <label for="' + uid + 'PointTemplateId">' + Globa.TemplatePoints.locale() + '</label>';
            s += '				    <select class="chosen-select-deselect" style="width: 370px;" id="' + uid + 'PointTemplateId">';
            s += '				        <option value=""></option>';
            //settings.pointTemplates = Enumerable.From(settings.pointTemplates).OrderBy('$.')
            for (var i = 0; i < settings.pointTemplates.length; i++) {
                var pointTemplate = settings.pointTemplates[i];
                var flag = true;
                var isRequired;
                if (form.Access) {
                    if (form.Access.hasOwnProperty('point' + pointTemplate.PointTemplateId)) {
                        flag = form.Access['point' + pointTemplate.PointTemplateId].IsVisible;
                        isRequired = form.Access['point' + pointTemplate.PointTemplateId].IsRequired;
                    }
                }
                var reqStr = isRequired?'<span class="required-phase-input" style="margin-right: -15px;"></span>': '';
                if (flag)
                    s += '				<option value=' + pointTemplate.PointTemplateId + '>' + pointTemplate.ActivityPhaseName + '. ' + pointTemplate.Name + reqStr+'</option>';
            }

            s += '				    </select>';
            s += '              </div>';
            s += '			</td>';
        }
        /*
        s += '			<td>';
        s += '			    <div class="control-group">';
        s += '				<label for="qpcPointName">Название</label>';
        s += '				<input type="text" placeholder="Название контрольной точки" id="qpcPointName">';
        s += '			</td>';
        */
        if (settings.isPlanDateVisible) {
            s += '			<td>';
            s += '			    <div class="control-group">';
            s += '				<label for="qpcPointPlanDate">' + Globa.Plan.locale() + '</label>';
            s += '				<input id="qpcPointPlanDate" type="text" class="date-picker input-small" data-datepicker="datepicker"/>';
            s += '			</td>';
        }
        s += '			<td>';
        s += '				<label>&nbsp;</label>';
        s += '				<a id="qpcPointSave" class="btn btn-small input-mini" onclick="QuickCreatePoint(\'' + selector + '\', \'' + uid + '\')">' + Globa.Create.locale() + '</a>';
        s += '			</td>';
        s += '		</tr>';
        s += '	</table>';
        s += '</div>';
        s += '</div>';

        el.html(s);
        el.find('.date-picker').datepicker();
        el.find('#' + uid + 'PointTemplateId').chosen();
        el.data("quickPointCreator", settings);

    });
};

function QuickPointCreator(selector, options) {

    Asyst.APIv2.View.load({
            viewName: 'PointTemplatesAllowedView',
            data: Asyst.Workspace.currentForm.Data,
            success: function(data) {
                var pointTemplates = data.data;
                if (options.filter && options.filter.length > 0) {
                    pointTemplates = Enumerable.From(data.data).Where(function(a) { return options.filter.indexOf(a.Identifier) >= 0; }).ToArray();
                }
                $(selector).quickPointCreator($().extend({ id: Asyst.Workspace.currentForm.EntityId, pointTemplates: pointTemplates }, options));
            },
            async: true
        }
    );

}

function QuickCreatePoint(selector, uid) {
    var settings = $(selector).data("quickPointCreator");
    var form = Asyst.Workspace.currentForm;
    var formData = form.Data;
    var input;
 

    input = $(selector).find('#' + uid + 'PointTemplateId');
    

    input_txt = $(selector).find('#' + uid + 'PointTemplateId :selected');
    var pointTemplateId = input.val();
    var pointTemplateName = input_txt.text();

    var pointTemplate;
    var pointTypeId;
    if (settings.isPointTemplateVisible) {
        pointTemplate = Asyst.APIv2.Form.load({ formName: "PointTemplateEditForm", dataId: pointTemplateId, async:false });
        if (typeof(pointTemplate) !== "undefined" && pointTemplateId != "")
            pointTypeId = pointTemplate.PointTypeId;
        else {
            if (settings.isPointTemplateRequired) {
                input.parents('.control-group').addClass('error');
                input.change(function(el) {
                    var nameDate = $(el.target).val();
                    if (nameDate)
                        $(el.target).parents('.control-group').removeClass('error');
                });
                return;
            }
        }
    }


    input = $(selector).find('#qpcPointPlanDate');
    var txtPlanDate = input.val();
    var planDate;
    if (settings.isPlanDateVisible) {
        if (!txtPlanDate && settings.isPlanDateRequired) {
            input.parents('.control-group').addClass('error');
            input.change(function(el) {
                var nameDate = $(el.target).val();
                if (nameDate)
                    $(el.target).parents('.control-group').removeClass('error');
            });
            return;
        } else {
            //переводим в американский стандарт для парса
            //txtPlanDate = txtPlanDate.replace(/(\d+)\.(\d+)\.(\d+)/, '$2-$1-$3');
            //var planDate = new Date(txtPlanDate);
            planDate = Asyst.date.parse(txtPlanDate);
            //и добавляем смещение таймзоны
            planDate.setMinutes(-planDate.getTimezoneOffset());

            input.parents('.control-group').removeClass('error');
        }
    }

/*
    input = $(selector).find('#qpcPointName');
    var name = input.val();
    if (!name) {
        input.parents('.control-group').addClass('error');
        input.change(function (el) {
            name = $(el.target).val();
            if (name)
                $(el.target).parents('.control-group').removeClass('error');
        });
        return;
    }
    else
        input.parents('.control-group').removeClass('error');
*/
    
    var fields = { 
        PlanDate: planDate,
        ForecastDate: planDate,
        Name: pointTemplate?pointTemplate.Name:pointTemplateName,
        BlockId: formData.BlockId, 
        FunctionId: formData.FunctionId, 
        PointTemplateId: pointTemplateId, 
        ParentId: formData.ActivityId,
        LeaderId: formData.LeaderId, 
        OwnerId: formData.OwnerId,
        PointTypeId: pointTypeId
    };
    //copyRoles(formData, fields);
    if (settings.isPointTemplateVisible) {
        copyRoles(pointTemplate, fields);
        mergeRoles(pointTemplate, formData, fields);
    }

    Asyst.Workspace.openEntityDialog("Point", Globa.NewPoint.locale(), null, function () { form.Reset(); }, fields);
}

/* Компонент для создания контрольных точек по шаблону */

jQuery.fn.planTemplatePoints = function (options) {
    var settings = jQuery.extend({
        id: 0,
        title: Globa.PointTitle.locale(),
        planTemplateName: 'Шаблон',
        itemName: 'Название',
        dateStartName: 'Начало',
        dateEndName: 'Окончание',
        datePointName: 'Плановая дата',
        width: 100,
        pointTemplates: [],
        callback: function () { },
    }, options);

    return this.each(function () {
        var el = $(this);
        var form = Asyst.Workspace.currentForm;
        var selector = el[0].nodeName;
        var id = el.attr("id");
        if (id) { selector += "#" + id; }
        var classNames = el.attr("class");
        if (classNames) { selector += "." + $.trim(classNames).replace(/\s/gi, "."); }
        var btnid = 'btnMakeTemplate';

        if (settings.pointTemplates && settings.pointTemplates.length > 0) {
            var $row = $('<div class="row"></div>');
            var $form = $('<form name="form-template-points"></form>');
            var $table = $('<table class="table table-condensed quick-point-creator-content"></table>');
            var $tbody = $('<tbody></tbody>');
            var $tr = $('<tr></tr>');
            var $td = $('<td width="40%"></td>');
            var $tdreset = $('<td class="cell-reset mobile-collapse" width="20%"></td>');

            var $controlGroup = $('<div class="control-group"></div>');
            var $label = $('<label>' + settings.planTemplateName + '</label>');
            var $select = $('<select id="templatePointsSelect" name="templatePoints" class="chosen-select-deselect" style="width:370px;"></select>');
            var $option = $('<option value=""></option>');

            $select.append($option);
            for (var i = 0; i < settings.pointTemplates.length; i++) {
                var pointTemplate = settings.pointTemplates[i];
                if ( pointTemplate.EntityName == Asyst.Workspace.currentForm.Data.entityname && pointTemplate.ItemCount > 0 ) {
					if ((pointTemplate.EntityName == "Project" && pointTemplate.ProjectTypeId == "") ||
						(pointTemplate.EntityName == "Project" && pointTemplate.ProjectTypeId != "" && pointTemplate.ProjectTypeId ==  Asyst.Workspace.currentForm.Data.ProjectTypeId) || 
						(pointTemplate.EntityName == "Contract" && pointTemplate.ContractTypeId != "" && pointTemplate.ContractTypeId ==  Asyst.Workspace.currentForm.Data.ContractTypeId && pointTemplate.ContractFLId != "" && pointTemplate.ContractFLId ==  Asyst.Workspace.currentForm.Data.ContractFLId) ||
						(pointTemplate.EntityName == "Contract" && pointTemplate.ContractTypeId != "" && pointTemplate.ContractTypeId ==  Asyst.Workspace.currentForm.Data.ContractTypeId && pointTemplate.ContractFLId == "") ||
						(pointTemplate.EntityName == "Contract" && pointTemplate.ContractTypeId == "" && pointTemplate.ContractFLId != "" && pointTemplate.ContractFLId ==  Asyst.Workspace.currentForm.Data.ContractFLId) ||
						(pointTemplate.EntityName == "Contract" && pointTemplate.ContractTypeId == "" && pointTemplate.ContractFLId == "") ||
						(pointTemplate.EntityName != "Project" && pointTemplate.EntityName != "Contract")) {

						var $option = $('<option value="' + pointTemplate.PlanTemplateId + '">' + pointTemplate.Name + '</option>');
						$select.append($option);
					}
                }
            }

            $select.change(function (event) {
                if ($(event.target).val() == "") {
                    el.find('#' + btnid).remove();
                    $tr.find('.cell-reset').remove();
                    $tr.append($td, $tdreset.clone(), $tdreset.clone(), $tdreset.clone());
                };
                $(this).find('option:selected').each(function () {
                    var plantemplateid = $(this).val();
                    var name = $(this).text();
                    $(settings.pointTemplates).each(function (ind, item) {
                        if (item.PlanTemplateId == plantemplateid) {
                            if (item.ItemCount > 1) {
                                $tr.find('.cell-reset').remove();
                                $tr.append($td, $tdreset.clone(), $tdreset.clone(), $tdreset.clone());
                                renderTree(item, el);
                            } else {
                                $tr.find('.cell-reset').remove();
                                var jarr = renderSingle(item);
                                $tr.append(jarr);
                                $tr.find('.date-picker').datepicker();
                                $tr.data(item);
                                $tr.attr('plantemplateid', item.PlanTemplateId);
                                el.append(renderButton('Создать', item, function (template) {
                                    var formname = "form-template-points";
                                    ValidatePlanTemplatePointsForm(formname, null, "single",
										function () {
											Loader.show('#PlanTemplatePoints');

										    /* get inputs data */
										    /* ------------------------------------------- */
										    var itemname = $('form[name="' + formname + '"]').find('#itemName').val();
										    var enddate = $('form[name="' + formname + '"]').find('#endDate').val();
										    var startdate = null;
										    if (!template.ItemIsMilestone) { startdate = $('form[name="' + formname + '"]').find('#startDate').val(); }

										    /* extend template */
										    /* ------------------------------------------- */
										    $.extend(template, {
										        itemname: itemname,
										        startdate: startdate,
										        enddate: enddate,
												parentpointid: Asyst.Workspace.currentForm.EntityId,
												projectid: Asyst.Workspace.currentForm.EntityId,
										    });

										    /* make save data and load */
										    /* ------------------------------------------- */
										    var savedata = {
										        'EntityId': '71DCB2F7-A542-4909-B4F4-3DCAF2B3B14C',
										        'ActivityPhaseId': 10012,
												'ProjectId': template.projectid,
										        'ParentId': template.parentpointid,
										        'Name': template.itemname,
										        'PointTypeId': template.ItemPointTypeId,
										        'IsMilestone': template.ItemIsMilestone,
										        'PlanDate': template.enddate,
										        'ForecastDate': template.enddate,
										        'StartPlanDate': template.startdate,
										        'StartForecastDate': template.startdate,
										    };
										    Asyst.API.Entity.save('Point', null, savedata,
												function (success) {
												    console.log(success);
												    ganttframe.Gantt.reload();
													Loader.hide();
												    if (template.ItemIsMilestone)
												        Dialogs.Message('Контрольная точка создана');
												    else
												        Dialogs.Message('Задача создана');
												},
												function (error) { console.log(error); }, null
											);

										}
									);
                                }));
                            }
                        }
                    });
                });
                $(window).resize();
            });
            $controlGroup.append($label, $select);
            $td.append($controlGroup);
            $tr.append($td, $tdreset.clone(), $tdreset.clone(), $tdreset.clone());
            $tbody.append($tr);
            $table.append($tbody);
            $row.append($table);
            $form.append($row);
        }

        if (settings.pointTemplates.length > 0) {
            el.append($form);
            el.find('.date-picker').datepicker();
            el.find('select').chosen({
                allow_single_deselect: true,
                placeholder_text_single: Globa.SelectValue.locale(),
            });
            el.data('templatePoints', settings);

            //добавляем data-html для нового тултипа bootstrapа
            el.find('[rel="tooltip"]').attr('data-html', 'true');
            el.find('[rel="tooltip"]').tooltip();
            el.find('[rel="tooltip"]').on('hidden', function () { return false; });
        } else {
            $('#PlanTemplatePoints').css('display', 'none');
        }

        function renderSingle(item) {
            var result = [];
            var $td = $('<td class="cell-reset" width="20%"></td>');
            var $controlGroup = $('<div class="control-group input-reset"></div>');
            var $label = $('<label><span>' + settings.itemName + '</span><span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span></label>');
            var $input = $('<input id="itemName" type="text" class="input-small" required value="' + item.ItemName + '">');
            $controlGroup.append($label, $input);
            $td.append($controlGroup);
            result.push($td);
            $td = $('<td class="cell-reset" width="20%"></td>');
            if (!item.ItemIsMilestone) {
                $controlGroup = $('<div class="control-group input-reset"></div>');
                $label = $('<label><span>' + settings.dateStartName + '</span><span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span></label>');
                $inputstart = $('<input id="startDate" type="text" class="date-picker input-small" data-datepicker="datepicker" required>');
                $controlGroup.append($label, $inputstart);
                $td.append($controlGroup);
                result.push($td);
                $td = $('<td class="cell-reset" width="20%"></td>');
                $controlGroup = $('<div class="control-group input-reset"></div>');
                $label = $('<label><span>' + settings.dateEndName + '</span><span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span></label>');
                $inputend = $('<input id="endDate" type="text" class="date-picker input-small" data-datepicker="datepicker" required>').attr('data-ismilestone', item.ItemIsMilestone);
                $controlGroup.append($label, $inputend);
                $td.append($controlGroup);
                result.push($td);
            } else {
                result.push($td);
                $td = $('<td class="cell-reset" width="20%"></td>');
                $controlGroup = $('<div class="control-group input-reset"></div>');
                $label = $('<label><span>' + settings.datePointName + '</span><span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span></label>');
                $inputend = $('<input id="endDate" type="text" class="date-picker input-small" data-datepicker="datepicker" required>').attr('data-ismilestone', item.ItemIsMilestone);
                $controlGroup.append($label, $inputend);
                $td.append($controlGroup);
                result.push($td);
            }

            /*input change events*/
            /*required name*/
            $input.change(function () {
                if ($input.val() == "")
                    setTooltipError($input, true, 'Не заполнено название')
                else
                    setTooltipError($input, false, null);
            });
            /*required start*/
            if (!item.ItemIsMilestone) {
                $inputstart.change(function () {
                    var dat = Asyst.date.parse($inputstart.val());
                    if (!dat)
                        setTooltipError($inputstart, true, 'Не заполнена дата начала')
                    else
                        setTooltipError($inputstart, false, null);
                });
            }
            /*required end*/
            $inputend.change(function () {
                var dat = Asyst.date.parse($inputend.val());
                if (!dat)
                    if (item.ItemIsMilestone)
                        setTooltipError($inputend, true, 'Не заполнена дата');
                    else
                        setTooltipError($inputend, true, 'Не заполнена дата окончания');
                else
                    setTooltipError($inputend, false, null);
            });
            /*duration*/
            if (!item.ItemIsMilestone) {
                if (item.ItemDuration == "")
                    item.ItemDuration = "1";
                var handler_duration = function () {
                    var dat = Asyst.date.parse($inputstart.val());
                    if (dat) {
                        setTooltipError($inputstart, false, null);
                        dat.setDate(dat.getDate() + parseInt(item.ItemDuration));
                        $inputend.val(dat.toLocaleDateString()).trigger('change');
                        $inputstart.unbind('change', handler_duration);
                    }
                };
                $inputstart.bind('change', handler_duration);
            }
            /*end date <= start date*/
            if (!item.ItemIsMilestone) {
                $inputend.change(function () {
                    var that = $(this);
                    var enddat = Asyst.date.parse($inputend.val());
                    if (enddat) {
                        var startdat = Asyst.date.parse($inputstart.val());
                        if (enddat <= startdat) {
                            setTooltipError($inputend, true, 'Дата окончания должна быть строго больше даты начала');
                        } else {
                            setTooltipError($inputstart, false, null);
                            setTooltipError($inputend, false, null);
                        }
                    }
                });
            }
            /*start date >= end date*/
            if (!item.ItemIsMilestone) {
                $inputstart.change(function () {
                    var that = $(this);
                    var startdat = Asyst.date.parse($inputstart.val());
                    if (startdat) {
                        var enddat = Asyst.date.parse($inputend.val());
                        if (startdat >= enddat) {
                            setTooltipError($inputstart, true, 'Дата начала должна быть строго меньше даты окончания');
                        } else {
                            setTooltipError($inputstart, false, null);
                            setTooltipError($inputend, false, null);
                        }
                    }
                });
            }

            return result;
        };
        function renderTree(item) {
            Asyst.API.View.load(
		        'PlanTemplateItemData', { PlanTemplateId: item.PlanTemplateId }, function (data) {
		            el.append(renderButton('Заполнить', item, function (template) {
		                Dialogs.PlanTemplate(data, template);
		            }));
		        }
		    );
        };
        function renderButton(btnname, item, onclick) {
            el.find('#' + btnid).remove();
            var $btndiv = $('<div id="' + btnid + '" class="tile-content-bottom static padding border-top"></div>');
            var $btn = $('<a class="btn btn-primary btn-small input-mini">' + btnname + '</a>');
            if (typeof (onclick) == "function") {
                $btn.click(function () {
                    onclick(item);
                });
            }
            $btndiv.append($btn);
            return $btndiv;
        };

    });
};

function setTooltipError(element, value, text) {
    if (element.parent('.control-group').data().tooltip)
        element.parent('.control-group').tooltip('destroy');
    if (value) {
        element.parent('.control-group').addClass("error");
        element.parent('.control-group').tooltip({ title: text, container: 'body', trigger: 'hover' });
        element.parent('.control-group').on('hidden', function () { return false; });
    } else {
        element.parent('.control-group').removeClass("error");
    }
    return element;
}

function PlanTemplatePoints(selector, options) {
    Asyst.API.View.load(
        'PlanTemplateData', null, function (data) {
            if (data != null) {
                $(selector).planTemplatePoints($().extend({
                    id: Asyst.Workspace.currentForm.EntityId,
                    pointTemplates: data.data
                }, options));
            }
        }
    );
}

function ValidatePlanTemplatePointsForm(formname, data, type, success) {
    var isvalid = true;
    var errors = "", selector = "", firstColumnName = "", errs = [];
    if (type == "single") {
        selector = ".control-group";
        firstColumnName = "Поле";
    } else if (type == "tree") {
        selector = ".content-node";
        firstColumnName = "Задача";
    }
    /*check required fields*/
    $('form[name="' + formname + '"]').find('input#itemName').each(function () {
        var that = $(this);
        if (that.is('[required]'))
            if (that.val() == '')
                setTooltipError(that, true, 'Не заполнено название');
    });
    $('form[name="' + formname + '"]').find('input#startDate').each(function () {
        var that = $(this);
        if (that.is('[required]'))
            if (that.val() == '')
                setTooltipError(that, true, 'Не заполнена дата начала');
    });
    $('form[name="' + formname + '"]').find('input#endDate').each(function () {
        var that = $(this);
        if (that.is('[required]'))
            if (that.val() == '')
                if (that.attr('data-ismilestone') == "true")
                    setTooltipError(that, true, 'Не заполнена дата');
                else
                    setTooltipError(that, true, 'Не заполнена дата окончания');
    });
    /*collect fields errors*/
    $('form[name="' + formname + '"]').find('input').each(function () {
        var that = $(this);
        var label = that.parents(selector).find('label').text().trim();
        if (that.parent('.control-group').data()) {
            var tooltip = that.parent('.control-group').data().tooltip;
            if (tooltip) {
                isvalid = false;
                var found = false;
                for (key in errs) {
                    for (name in errs[key]) {
                        if (name == 'name' && errs[key][name] == label) {
                            found = true;
                            errs[key]['errors'].push(tooltip.options.title);
                        }
                    }
                }
                if (!found)
                    errs.push({ name: label, errors: [tooltip.options.title] });
            }
        }
    });
    /*make message table*/
    var message = '<table class="table" style="margin:0;"><thead><tr><th>' + firstColumnName + '</th><th>Ошибка</th></tr></thead><tbody>';
    $(errs).each(function (i, err) {
        message += '<tr><td>' + (i + 1) + '. ' + err.name + '</td><td><table class="no-border no-padding"><tbody>';
        $(err.errors).each(function (j, error) {
            message += '<tr><td>' + (j + 1) + '. ' + error + ';</td></tr>';
        });
        message += '</tbody></table></td></tr>';
    });
    message += '</tbody></table>';
    if (isvalid) {
        if (success) { success(); }
    } else {
        var id = Dialogs.Message(message);
        $('#' + id).find('.modal-body').css('padding', '0');
    }
    return;
}

var getItemData = function (data, id) {
    var item = null;
    data.forEach(function (a, i, data) {
        if (parseInt(a.PlanTemplateItemId) == parseInt(id))
            item = a;
    });
    return item;
}

Dialogs.PlanTemplate = function (data, template) {
    console.log(data);
    var ddata = data.data;

    var $form = $('<form name="form-template-points-dialog"></form>').attr('data-plantemplateid', template.PlanTemplateId);
    var $treewrapper = $('<div class="tree-wrapper"></div>');
    var $container = $('<ul class="Container"></ul>');
    $treewrapper.append($container);
    $form.append($treewrapper);

    var $node = $('<li class="Node">');
    var $expand = $('<div class="Expand"></div>');
    var $content = $('<div class="Content"></div>');
    var $cont = $('<ul class="Container"></ul>');

    if (ddata && ddata.length > 0) {
        for (var i = 0; i < ddata.length; i++) {
            var item = ddata[i];

            var $contentnode = $('<div class="content-node"></div>');
            var $table = $('<table class="table table-condensed quick-point-creator-content"></table>');
            var $tbody = $('<tbody></tbody>');
            var $tr = $('<tr></tr>');
            var $td50 = $('<td class="p7"></td>');
            var $td25 = $('<td width="200"></td>');
            $label = $('<label></label>').text(item.Name);
            $controlgroup = $('<div class="control-group"></div>');
            $input = $('<input type="text" class="date-picker input-small" data-datepicker="datepicker" required>').attr('data-ismilestone', item.IsMilestone);
            if (!item.IsMilestone) {
                $tr.append(
					$td50.clone().append($label.clone()),
					$td25.clone().append($controlgroup.clone().append($input.clone().attr('id', 'startDate').attr('placeholder', 'Начало'))),
					$td25.clone().append($controlgroup.clone().append($input.clone().attr('id', 'endDate').attr('placeholder', 'Окончание'))));
            } else {
                $tr.append(
					$td50.clone().append($label.clone()),
					$td25.clone(),
					$td25.clone().append($controlgroup.clone().append($input.clone().attr('id', 'endDate').attr('placeholder', 'Плановая дата'))));
            }
            $tbody.append($tr);
            $table.append($tbody);
            $contentnode.append($table);
            $contentnode.attr('data-plantemplateitemid', item.PlanTemplateItemId);
            if (item.ParentId == "") {
                $container
					.append($node.clone().addClass('IsRoot ExpandLeaf').attr('plantemplateitemid', item.PlanTemplateItemId)
						.append($expand.clone(), $content.clone().append($contentnode)));
            } else {
                var parentid = parseInt(item.ParentId);
                if (parentid <= 0) { parentid = ""; }
                $treewrapper.find('[plantemplateitemid="' + parentid + '"]').each(function () {
                    $(this).removeClass('ExpandLeaf');
                    $(this).addClass('ExpandOpen');
                    if ($(this).find('.Container').length > 0) {
                        $(this).find('.Container')
							.append($node.clone().addClass('ExpandLeaf').attr('plantemplateitemid', item.PlanTemplateItemId)
								.append($expand.clone(), $content.clone().append($contentnode)));
                    } else {
                        $(this)
							.append($cont.clone()
								.append($node.clone().addClass('ExpandLeaf').attr('plantemplateitemid', item.PlanTemplateItemId)
									.append($expand.clone(), $content.clone().append($contentnode))));
                    }
                });
            }
        }
    }

    var body = $form.wrapAll('<div>').parent().html();

    var id = Dialog(
		template.Name,
		body,
		[
			{
			    text: 'Создать', cls: 'btn-primary',
			    click: function () {
			        debugger;
			        var formname = "form-template-points-dialog";
			        ValidatePlanTemplatePointsForm(formname, ddata, "tree", function () {
			            Loader.show('#PlanTemplatePoints');
			            Asyst.API.View.load(
                            'PlanTemplateItemData', { PlanTemplateId: template.PlanTemplateId }, function (data) {
                                SavePlanTemplatePointsForm(formname, template, data.data);
                            }
                        );
			            function SavePlanTemplatePointsForm(formname, template, data) {
			                var getItem = function (arr, id) {
			                    var item = null;
			                    arr.forEach(function (a, i, arr) {
			                        if (parseInt(a.PlanTemplateItemId) == parseInt(id))
			                            item = a;
			                    });
			                    return item;
			                }
			                var getItemLevel = function (arr, id) {
			                    var level = 0;
			                    var item = getItem(arr, id);
			                    if (item) { level = item.Level; }
			                    return level;
			                }
			                var getLevels = function (arr, l, batchList) {
			                    var cont = false;
			                    var batch = new Asyst.API.Form.Batch('PointEditForm');
			                    batchList.push(batch);
			                    arr.forEach(function (item, i, arr) {
			                        if (item.Level == l) {
			                            var parent_level = getItemLevel(arr, item.ParentId);
			                            if (parent_level >= item.Level) {
			                                item.Level++;
			                                cont = true;
			                            } else {
			                                batchList[l - 1].add(null, makeSaveData(item));
			                            }
			                        }
			                    });
			                    if (cont) getLevels(arr, ++l, batchList);
			                }
			                var getPoints = function (form, arr) {
			                    var points = [];
			                    $('[name="' + form + '"]').find('[data-plantemplateitemid]').each(function (i, item) {
			                        var that = $(this);
			                        var PlanTemplateItem = getItem(arr, that.attr('data-plantemplateitemid'));
			                        var EndDate = that.find('#endDate').val();
			                        var StartDate = null;
			                        if (!PlanTemplateItem.IsMilestone) { StartDate = that.find('#startDate').val(); }
			                        $.extend(PlanTemplateItem, {
			                            StartDate: StartDate,
			                            EndDate: EndDate,
			                            Level: 1,
										ParentPointId: Asyst.Workspace.currentForm.EntityId,
										ProjectId: Asyst.Workspace.currentForm.EntityId,
			                        });
			                        points.push( PlanTemplateItem );
			                    });
			                    return points;
			                }
			                var loadPoints = function (batchList, callback) {
			                    if (batchList.length > 0)
			                        loadBatchList(batchList, 0, callback);
			                }
			                var loadBatchList = function (list, index, callback) {
			                    list[index].save(
                                    function (success) {
                                        console.log(success);
                                        if (list[index + 1]) {
                                            success.forEach(function (object, i, success) {
                                                list[index].DataPacket.__packet__[i].data.__loadedid__ = object.id;
                                                list[index + 1].DataPacket.__packet__.forEach(function (packet, j, list__packet__) {
                                                    if (list[index].DataPacket.__packet__[i].data.__id__ == packet.data.__parentid__) {
                                                        list__packet__[j].data.ParentId = object.id;
                                                    }
                                                });
                                            });
                                            loadBatchList(list, ++index, callback);
                                        } else {
                                            if (callback) callback();
                                        }
                                    },
                                    function (error) { console.log(error); }, true
                                );
			                }
			                var makeSaveData = function (data) {
			                    var savedata = {
			                        'EntityId': '71DCB2F7-A542-4909-B4F4-3DCAF2B3B14C',
			                        'ActivityPhaseId': 10012,
									'ProjectId': data.ProjectId,
			                        'ParentId': data.ParentPointId,
			                        'Name': data.Name,
			                        'PointTypeId': data.PointTypeId,
			                        'IsMilestone': data.IsMilestone,
			                        'PlanDate': data.EndDate,
			                        'ForecastDate': data.EndDate,
			                        'StartPlanDate': data.StartDate,
			                        'StartForecastDate': data.StartDate,
			                        '__id__': data.PlanTemplateItemId,
			                        '__parentid__': data.ParentId,
			                        '__loadedid__': null,
			                    };
			                    for (name in data) {
			                        if ((name.indexOf("Account") >= 0) && (data[name] != "")) {
			                            var roleid = name.substr(7, name.length - 7);
			                            if (savedata[roleid])
			                                savedata[roleid].push(data[name]);
			                            else
			                                savedata[roleid] = [data[name]];
			                        }
			                        if ((name.indexOf("Role") >= 0) && (name.indexOf("Identifier") >= 0) && (data[name] != "")) {
			                            var roleidentifier = name.substr(4, name.length - 4);
			                            var rolename = roleidentifier.substr(0, roleidentifier.length - 10);
			                            var roleid = rolename + "Id";
			                            var role = data[name];
			                            if (role != "") {
			                                var parentroles = Asyst.Workspace.currentForm.Data[role + "Id"];
			                                parentroles.forEach(function (r, i, parentroles) {
			                                    if (savedata[roleid]) {
			                                        savedata[roleid].push(r);
			                                    } else {
			                                        savedata[roleid] = [r];
			                                    }
			                                });
			                            }
			                        }
			                    }
			                    return savedata;
			                }

			                var points = getPoints(formname, data);
			                var batch_list = [];
			                getLevels(points, 1, batch_list);
			                loadPoints(batch_list, function () {
			                    ganttframe.Gantt.reload();
			                    $('#' + id).modal('hide');
			                    Loader.hide();
			                });
			            }
			        });
			    },
			    close: false
			},
			{ text: 'Отмена', cls: 'btn-default', click: null, close: null }
		]
	);

    $('#' + id).find('.tree-wrapper').click(function (e) { tree_toggle(e); });
    $('#' + id).find('.tree-wrapper li.Node').last().find('tr td').css('border', 'none')
    $('#' + id).find('.date-picker').datepicker();
    $('#' + id).css('width', '960px').css('margin-left', '-480px').css('display', 'block');

    /*diable parent*/
    $('#' + id).find('[data-plantemplateitemid]').each(function (i, item) {
        var that = $(this);
        var plantemplateitemid = that.attr('data-plantemplateitemid');
        var item = get_data_item(plantemplateitemid);
        var $parentstart = $('[data-plantemplateitemid="' + item.ParentId + '"]').find('input#startDate');
        var $parentend = $('[data-plantemplateitemid="' + item.ParentId + '"]').find('input#endDate');
        $parentstart.prop('disabled', true);
        $parentend.prop('disabled', true);
    });

    /*input change events*/
    $('#' + id).find('[data-plantemplateitemid]').each(function (i, item) {
        debugger;
        var that = $(this);
        var plantemplateitemid = that.attr('data-plantemplateitemid');
        var item = get_data_item(plantemplateitemid);
        var $inputstart = that.find('input#startDate')
        var $inputend = that.find('input#endDate')
        /*required start*/
        if (!item.IsMilestone) {
            $inputstart.change(function () {
                var dat = Asyst.date.parse($inputstart.val());
                if (!dat)
                    setTooltipError($inputstart, true, 'Не заполнена дата начала')
                else
                    setTooltipError($inputstart, false, null);
            });
        }
        /*required end*/
        $inputend.change(function () {
            var dat = Asyst.date.parse($inputend.val());
            if (!dat)
                if (item.IsMilestone)
                    setTooltipError($inputend, true, 'Не заполнена дата');
                else
                    setTooltipError($inputend, true, 'Не заполнена дата окончания');
            else
                setTooltipError($inputend, false, null);
        });
        /*lag*/
        if (parseInt(item.PredecessorId) > 0) {
			if (item.Lag == "" || item.Lag == null || item.Lag == "null") { item.Lag = 0; }
            var preitem = get_data_item(item.PredecessorId);
            var $preinput = $('[data-plantemplateitemid="' + preitem.PlanTemplateItemId + '"]').find('input#endDate');
            var handler_lag = function () {
                var dat = Asyst.date.parse($preinput.val());
                if (dat) {
                    dat.setDate(dat.getDate() + parseInt(item.Lag));
                    if (item.IsMilestone) {
                        setTooltipError($inputend, false, null);
                        $inputend.val(dat.toLocaleDateString()).trigger('change');
                    } else {
                        setTooltipError($inputstart, false, null);
                        $inputstart.val(dat.toLocaleDateString()).trigger('change');
                    }
                    $preinput.unbind('change', handler_lag);
                }
            };
            $preinput.bind('change', handler_lag);
        }
        /*duration*/
        if (!item.IsMilestone) {
            if (item.Duration == "")
                item.Duration = "1";
            var handler_duration = function () {
                var dat = Asyst.date.parse($inputstart.val());
                if (dat) {
                    setTooltipError($inputstart, false, null);
                    dat.setDate(dat.getDate() + parseInt(item.Duration));
                    $inputend.val(dat.toLocaleDateString()).trigger('change');
                    $inputstart.unbind('change', handler_duration);
                }
            };
            $inputstart.bind('change', handler_duration);
        }
        /*end date <= start date*/
        if (!item.IsMilestone) {
            $inputend.change(function () {
                var that = $(this);
                var enddat = Asyst.date.parse($inputend.val());
                if (enddat) {
                    var startdat = Asyst.date.parse($inputstart.val());
                    if (enddat <= startdat) {
                        setTooltipError($inputend, true, 'Дата окончания должна быть строго больше даты начала');
                    } else {
                        setTooltipError($inputstart, false, null);
                        setTooltipError($inputend, false, null);
                    }
                }
            });
        }
        /*start date >= end date*/
        if (!item.IsMilestone) {
            $inputstart.change(function () {
                var that = $(this);
                var startdat = Asyst.date.parse($inputstart.val());
                if (startdat) {
                    var enddat = Asyst.date.parse($inputend.val());
                    if (startdat >= enddat) {
                        setTooltipError($inputstart, true, 'Дата начала должна быть строго меньше даты окончания');
                    } else {
                        setTooltipError($inputstart, false, null);
                        setTooltipError($inputend, false, null);
                    }
                }
            });
        }
        /*parent dates*/
        if (!item.IsMilestone) {
            $inputstart.change(function () {
                var item = get_data_item(plantemplateitemid);
                if (item.ParentId != "") {
                    var parent = get_data_item(item.ParentId);
                    debugger;
                    var parentstartdat = get_start_parent(item.ParentId);
                    var parentenddat = get_end_parent(item.ParentId);
                    var $parentstart = $('[data-plantemplateitemid="' + item.ParentId + '"]').find('input#startDate');
                    var $parentend = $('[data-plantemplateitemid="' + item.ParentId + '"]').find('input#endDate');
                    $parentstart.val(parentstartdat.toLocaleDateString()).trigger('change');
                    $parentend.val(parentenddat.toLocaleDateString()).trigger('change');
                }
            });
        }
        $inputend.change(function () {
            var item = get_data_item(plantemplateitemid);
            if (item.ParentId != "") {
                var parent = get_data_item(item.ParentId);
                debugger;
                var parentstartdat = get_start_parent(item.ParentId);
                var parentenddat = get_end_parent(item.ParentId);
                var $parentstart = $('[data-plantemplateitemid="' + item.ParentId + '"]').find('input#startDate');
                var $parentend = $('[data-plantemplateitemid="' + item.ParentId + '"]').find('input#endDate');
                $parentstart.val(parentstartdat.toLocaleDateString()).trigger('change');
                $parentend.val(parentenddat.toLocaleDateString()).trigger('change');
            }
        });
    });

    function get_data_item(plantemplateitemid) {
        var item = null;
        for (var i = 0; i < ddata.length; i++) {
            if (ddata[i].PlanTemplateItemId == plantemplateitemid)
                item = ddata[i];
        }
        return item;
    }

    function get_start_parent(parentid) {
        var result = null;
        for (var i = 0; i < ddata.length; i++) {
            if (ddata[i].ParentId == parentid) {
                var item = ddata[i];
                var dat;
                if (item.IsMilestone) {
                    var $inputend = $('[data-plantemplateitemid="' + item.PlanTemplateItemId + '"]').find('input#endDate');
                    dat = Asyst.date.parse($inputend.val());
                } else {
                    var $inputstart = $('[data-plantemplateitemid="' + item.PlanTemplateItemId + '"]').find('input#startDate');
                    dat = Asyst.date.parse($inputstart.val());
                }
                if (dat && result == null) {
                    result = dat;
                } else if (dat && dat < result) {
                    result = dat;
                }
            }
        }
        return result;
    }

    function get_end_parent(parentid) {
        var result = null;
        for (var i = 0; i < ddata.length; i++) {
            if (ddata[i].ParentId == parentid) {
                var item = ddata[i];
                var $inputend = $('[data-plantemplateitemid="' + item.PlanTemplateItemId + '"]').find('input#endDate');
                var dat = Asyst.date.parse($inputend.val());
                if (dat && result == null) {
                    result = dat;
                } else if (dat && dat > result) {
                    result = dat;
                }
            }
        }
        return result;
    }

    function tree_toggle(event) {
        event = event || window.event;
        var clickedElem = event.target || event.srcElement;
        if (!tree_hasClass(clickedElem, 'Expand')) { return; } // клик не там
        // Node, на который кликнули
        var node = clickedElem.parentNode;
        if (tree_hasClass(node, 'ExpandLeaf')) { return; } // клик на листе
        // определить новый класс для узла
        var newClass = tree_hasClass(node, 'ExpandOpen') ? 'ExpandClosed' : 'ExpandOpen';
        // заменить текущий класс на newClass
        // регексп находит отдельно стоящий open|close и меняет на newClass
        var re = /(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/;
        node.className = node.className.replace(re, '$1' + newClass + '$3');
    }

    function tree_hasClass(elem, className) {
        return new RegExp("(^|\\s)" + className + "(\\s|$)").test(elem.className);
    }

    return id;
};