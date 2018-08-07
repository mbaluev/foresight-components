function saveTabAndLink(href, tab) {
    
    var link;
    var $tab;
    if (tab)
        $tab = tab;
    else
        $tab = Asyst.Workspace.currentForm.getActiveTab();

    //обрезаем последний '#' если он есть, чтобы он не портил строку возврата.
    var lochref = location.href;
    if (lochref[lochref.length - 1] == '#')
        lochref = lochref.substring(0, lochref.length - 1);

    var back;
    if ($tab && $tab.length > 0)
        back = setParameter(lochref, 'tab', $tab.text());
    else
        back = 'back';

    link = setParameter(href, 'back', back);
    return link;
}

function saveTabAndGo(href, tab) {
    location.href = saveTabAndLink(href, tab);
}

function templateProcessNames(template, data) {
    var value;
    var text;

    var start = template.indexOf("{%");
    var finish = template.indexOf("%}");
    while (start >= 0 && finish >= 0) {
        var left = template.substr(0, start);
        var right = template.substr(finish + 2);
        var name = template.substring(start + 2, finish);

        if (name == 'origin')
            text = location.protocol + '//' + location.host;
        else {
            value = GetPropertyValue(data, name);
            text = GetPropertyText(value);
        }

        template = left + text + right;

        start = template.indexOf("{%");
        finish = template.indexOf("%}");
    }
    return template;
}

function MoveToNextPhase() {
    var form = Asyst.Workspace.currentForm;

    if (form.CurrentPhaseName && !form.NextPhaseName) {
        Dialogs.Message(Globa.LastPhase.locale());
        return;
    }

    if (form.Access.ActivityPhase.ChangeRequestId > 0) {
        Dialogs.Message(Globa.DeniedDoubleMove.locale());
        return;
    }

    var msg = Globa.ConfirmEndPhase.locale();

    if (form.CurrentPhaseName) {
        msg = Globa.ConfirmMove.locale() + ' "' + form.CurrentPhaseName + '" ' + Globa.ConfirmMove2.locale() + ' "' + form.NextPhaseName + '"?';
    }

    if ($('#phase-modal').length > 0)
        $('#phase-modal').remove();
    Dialogs.Confirm(
        Globa.MoveToNextPhase.locale(),
        msg,
        function () {
            var success = function (result) {
                console.log('переводим...');
                var access = form.Access;
                var nextPhaseId = result.nextPhaseId;
                if (access.hasOwnProperty('ActivityPhase') && access.ActivityPhase.ReviewCycleId != 0) {

                    var doSave = function (locSuccess) {

                        var successF = function (data) {
                            if (form.isNew) {
                                form.EntityId = data.id;
                                form.isNew = false;
                                $("#" + form.FormName + "EntityId").val(data.id);
                                Asyst.API.AdminTools.saveStats({
                                    page: location.href,
                                    pageTitle: form.GetTitle(),
                                    type: 'editCard',
                                    action: 'create',
                                    entityId: form.Data.classid,
                                    dataId: data.id
                                },true);
                            }
                            else
                                Asyst.API.AdminTools.saveStats({
                                    page: location.href,
                                    pageTitle: form.GetTitle(),
                                    type: 'editCard',
                                    action: 'save',
                                    entityId: form.Data.classid,
                                    dataId: form.Data.id
                                },true);

                            if (locSuccess)
                                locSuccess();
                            form.Load();
                        };

                        var errorF = function (error, text) {
                            if (error == Globa.LicenseError) {
                                return;
                            }
                            ErrorHandler(Globa.SavingError.locale(), Globa.SavingError.locale());
                        };

                        Asyst.APIv2.Entity.save({ entityName: form.EntityName, dataId: form.EntityId, data: postData, success: successF, error: errorF, async: false });
                    };
                    var postData = {ActivityPhaseId: nextPhaseId};
                    var crElement = form.MakeActivityPhaseChangeRequest(access.ActivityPhase, form.Bindings["ActivityPhaseId"], nextPhaseId, form.NextPhaseName);
                    Loader.hide();
                    $('.modal').modal('hide');
                    form.ShowChangeRequestDialog([crElement], postData, doSave, null);

                } else {
                    var moveSuccess = function (result) {
                        Loader.hide();
                        $('.modal').modal('hide');
                        form.Load();
                    };
                    Asyst.APIv2.Phase.moveNext({ entityName: form.EntityName, activityId: form.Data.ActivityId, data: form.Data, async: true, success: moveSuccess, error: error });
                }

            };

            var error = function (message, info, context) {

                Loader.hide();
                if (message == Globa.LicenseError) {
                    return;
                }

                message = $("<div/>").html(message).text();
                info = $("<div/>").html(info).text();
                var msg = '<strong>' + message + '</strong><br>' + info;
                $('#phase-modal .modal-body').html(msg);

                if ($('#phase-modal #dock').length === 0)
                    $('#phase-modal .modal-footer').append('<a id="dock" class="btn pull-left" href="#" onclick="Dialogs.Dock(\'phase-modal\');void(0);"><img src="/asyst/img/pin.png"></a>');
                $('#phase-modal .btn-primary').hide();
                $('#phase-modal .btn[data-dismiss]').html(Globa.Close.locale());
            };

            Loader.show(undefined, Globa.MoveToNextPhase.locale());
            
            Asyst.APIv2.Phase.check({ entityName: form.EntityName, activityId: form.Data.ActivityId, data: form.Data, async: true, success: success, error: error });
        }, undefined, "phase-modal");
}

function MoveToPrevPhase() {
    var form = Asyst.Workspace.currentForm;

    if (form.Access.ActivityPhase.ChangeRequestId > 0) {
        Dialogs.Message(Globa.DeniedDoubleMove.locale());
        return;
    }
    var msg = Globa.ConfirmReturn.locale();


    if ($('#phase-modal').length > 0)
        $('#phase-modal').remove();
    Dialogs.Confirm(
        Globa.ReturnPrev.locale(),
        msg,
        function () {
            var success = function (result) {
                Loader.hide();
                $('.modal').modal('hide');
                form.Load();
            };

            var error = function (message, info, context) {
                Loader.hide();
                if (message == Globa.LicenseError) {
                    return;
                }
                message = $("<div/>").html(message).text();
                info = $("<div/>").html(info).text();
                var msg = '<strong>' + message + '</strong><br>' + info;
                $('#phase-modal .modal-body').html(msg);

                if ($('#phase-modal #dock').length === 0)
                    $('#phase-modal .modal-footer').append('<a id="dock" class="btn pull-left" href="#" onclick="Dialogs.Dock(\'phase-modal\');void(0);"><img src="/asyst/img/pin.png"></a>');
                $('#phase-modal .btn-primary').hide();
                $('#phase-modal .btn[data-dismiss]').html(Globa.Close.locale());
            };

            Loader.show(undefined, Globa.ReturnPrev.locale());

            Asyst.APIv2.Phase.movePrev({ entityName: form.EntityName, activityId: form.Data.ActivityId, success: success, error: error, async: false });
        }, undefined, "phase-modal");
}

function setInputWarning(selector, value, text) {
    var $el = $(selector);

    if (value)
        $el.parents('.control-group').addClass("warning");
    else
        $el.parents('.control-group').removeClass("warning");

    if (value && text)
        $el.siblings('.help-inline').html(text);
    else
        $el.siblings('.help-inline').html("");

    return $el;
}

function enableInput(selector, value) {
    var $el = $(selector);
    if (value) {
        $el.removeAttr("disabled");
        $el.removeClass("disabled");
        $el.prop('disabled', false);
        $el.trigger("chosen:updated.chosen");
        $el.find('*').removeAttr("disabled");
        $el.find('*').removeClass("disabled");
        $el.find('*').prop('disabled', false);
        $el.find('.chosen-select').trigger("chosen:updated.chosen");
    }
    else {
        $el.attr("disabled", "");
        $el.addClass("disabled");
        $el.prop('disabled', true);
        $el.trigger("chosen:updated.chosen");
        $el.find('*').not('option').attr("disabled", "");
        $el.find('*').not('option').addClass("disabled");
        $el.find('*').not('option').prop('disabled', true);
        $el.find('.chosen-select').trigger("chosen:updated.chosen");
    }
    return $el;
}

function showInput(selector, value) {
    var $el = $(selector);
    if (value) {
        $el.show();
    }
    else {
        $el.hide();
    }
    return $el;
}

function OpenBoard() {
    var params = "menubar=no,location=no,toolbar=no,resizable=yes,scrollbars=yes,status=no,width=400,height=600,left=" + ($(window).width() - 410);
    var win = window.open("/asyst/Board.aspx", "_blank", params);
    win.focus();
    return win;
}

function CreateNewWikiItem(listName, title, content) {
    if (!content)
        content = "&lt;h1&gt;" + title + "&lt;/h1&gt;";
    if (!listName)
        listName = "Wiki";
    var soapEnv =
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>  \
<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\
  <soap:Body>\
    <AddWikiPage xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">\
      <strListName>" + listName + "</strListName>\
      <listRelPageUrl>" + title + ".aspx</listRelPageUrl>\
      <wikiContent>​" + content + "</wikiContent>\
    </AddWikiPage>\
  </soap:Body>\
</soap:Envelope>";
    var processResult = function (xData, status) {

    };

    $.ajax({
        url: "/_vti_bin/lists.asmx",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/sharepoint/soap/AddWikiPage");
        },
        type: "POST",
        dataType: "xml",
        data: soapEnv,
        complete: processResult,
        contentType: "text/xml; charset=utf-8"
    });
}

function CreateGetListPermissions(listName, title, content) {
    if (!content)
        content = "&lt;h1&gt;" + title + "&lt;/h1&gt;";
    if (!listName)
        listName = "Wiki";
    var soapEnv =
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>\
<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\
  <soap:Body>\
    <GetPermissionCollection xmlns=\"http://schemas.microsoft.com/sharepoint/soap/directory/\">\
      <objectName>Wiki</objectName>\
      <objectType>List</objectType>\
    </GetPermissionCollection>\
  </soap:Body>\
</soap:Envelope>";
    var processResult = function (xData, status) {
    };

    $.ajax({
        url: "/_vti_bin/Permissions.asmx",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/sharepoint/soap/directory/GetPermissionCollection");
        },
        type: "POST",
        dataType: "xml",
        data: soapEnv,
        complete: processResult,
        contentType: "text/xml; charset=utf-8"
    });
}

function setRequired(binding, value) {
    var access = Asyst.Workspace.currentForm.Access;
    if (access && access.hasOwnProperty(binding.PropertyName)) {
        access[binding.PropertyName].IsRequired = value;
    }
    binding.IsRequired = value;
    var el = $('#' + binding.Form.FormName + ' #' + binding.PropertyName);
    var elRequired = $('#' + binding.Form.FormName + ' #' + binding.PropertyName + '+.required-input');
    if (value) {
        if (elRequired.length === 0) {
            el.after('<span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span>');
        }
    }
    else {
        elRequired.remove();
    }
}