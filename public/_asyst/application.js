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
        $el.find('*').attr("disabled", "");
        $el.find('*').addClass("disabled");
        $el.find('*').prop('disabled', true);
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
//http://slawutich.pp.ua/javascript/47-dynjs.html динамическая подгрузка css/js
dynjs =
{
    type: { js: "js", css: "css", csstxt: "csstxt" },
    load: function (url_, type_) {
        if (typeof (type_) == "undefined") {
            type_ = dynjs.type.js;
        }
        var is_exist = false;
        var tag = type_ == dynjs.type.js ? "script" : type_ == dynjs.type.css ? "link" : "style";
        var objects = document.getElementsByTagName(tag);
        var src = type_ == dynjs.type.js ? "src" : "href";
        for (var i = 0; i < objects.length; i++) {
            var elem = objects[i];
            if (elem.getAttribute(src) == url_) {
                is_exist = true;
            }
        }
        if (is_exist) {
            return;
        }
        var _elem = document.createElement(tag);
        var type = type_ == dynjs.type.js ? "text/javascript" : "text/css";

        _elem.setAttribute("type", type);
        _elem.setAttribute(src, url_);

        if (type_ == dynjs.type.css) {
            _elem.setAttribute("rel", "Stylesheet");
        }
        if (type_ == dynjs.type.csstxt) {
            if (typeof (_elem.styleSheet) != "undefined") {
                _elem.styleSheet.cssText = url_;
            }
            else if (typeof (_elem.innerText) != "undefined") {
                _elem.innerText = url_;
            }
            else {
                _elem.innerHTML = url_;
            }
        }
        document.getElementsByTagName("head")[0].appendChild(_elem);
    }
};
/* moved to asyst.utils.js
function getPageCookie(name) {
    return getCookie(window.location.pathname + name);
}

function getCookie(name) {
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset);
            if (end == -1) {
                end = cookie.length;
            }
            setStr = unescape(cookie.substring(offset, end));
        }
    }
    return (setStr);
}

function setPageCookie(name, value, expires) {
    setCookie(window.location.pathname + name, value, expires);
}

function setCookie(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}
*/

function Dialog(title, body, buttons, id) {
    if (!id)
        id = 'alert-modal' + guid();

    var html = '' +
        '<div class="modal" id="' + id + '">' +
        (IsBootstrap3()?
            '  <div class="modal-dialog">' +
            '   <div class="modal-content">': ''
        ) +
        '    <div class="modal-header">' +
        '        <button class="close" data-dismiss="modal">×</button>' +
        '        <h3>' + title + '</h3>' +
        '    </div>' +
        '    <div class="modal-body">' +
        '        ' + body +
        '    </div>' +
        '    <div class="modal-footer">';
    if(buttons) {
        for (var i in buttons) {
            if (!buttons.hasOwnProperty(i)) continue;

            var btn = buttons[i];

            var cls = 'btn';
            if (btn.cls)
                cls += ' ' + btn.cls;

            var href = '#';
            if (btn.href)
                href = btn.href;

            var text = '';
            if (btn.text)
                text = btn.text;

            var dismiss = ' data-dismiss="modal"';
            if (btn.close == false)
                dismiss = '';

            var click = '';
            if (jQuery.isFunction(btn.click)) {
                var funcId = '__' + guid();
                Dialogs[funcId] = btn.click;
                click = ' onclick="Dialogs[\'' + funcId + '\']();"';
            }
            else if (btn.click)
                click = ' onclick="' + btn.click + '"';

            html += '        <a href="' + href + '" class="' + cls + '"' + dismiss + click + '>' + text + '</a>';
        }
    }
    else {
        html += '        <a href="#" class="btn btn-primary" data-dismiss="modal">' + Globa.Close.locale() + '</a>';
    }

    html += (IsBootstrap3() ?
            '  </div>' +
            '   </div>' : ''
        ) + '    </div>' +
        '</div>';

    $('body').append(html);


    //раньше было
    //$('#' + id).modal({ backdrop: false, show: true });
    //$('#' + id).modal('show');
    // но в новом бутстрапе modal стал настоящим модальным окном и как-то прерывает текущий поток выполнения,
    //так что приходится имитировать асинхронный вызов.
    //UPD. там не асинхронный вызов, там Stask overflow. В новом BS при открытии одного модального внутри другого _может_ происходить
    //зацикливание обработчиков событий.
    // подробности https://github.com/twitter/bootstrap/issues/5431 https://github.com/twitter/bootstrap/pull/5022
    //разработчики говорят, что они многомодальность поддерживать не собираются и коммит не включают в релизы
    // есть форк с изменениями, позволяющими делать стакающиеся модалы, но его надо будет еще как-то тестить :(
    //вариант с асинхронным вызовом, слехка исправляет ситуацию, позволяя не ронять основной поток, однако ошибка никуда не делась, и её нужно будет исправлять.
    //UPD2. Форк добавляет новых проблем. Пока не удалось нормально очистить окно после него. При повторном показе окна с именем, которое использовалось ранее появляются оба.

    setTimeout(function () { $('#' + id).modal({ keyboard: false, backdrop: 'static', show: true }); }, 100);

    $('#' + id).on('hidden', function (e) {
        $(this).data('modal', null); while ($('#' + id).length !== 0) $('#' + id).remove();
        setTimeout(function () { $(this).data('modal', null); while ($('#' + id).length !== 0) $('#' + id).remove(); }, 500);
        e.stopPropagation();
    });


    return id;
}

var Dialogs;

if (!Dialogs) {
    Dialogs = {};
}

Dialogs.Message = function (message) {
    return Dialog(Globa.Message.locale(), message, [{ text: '&nbsp Ok &nbsp;', cls: 'btn-primary', click: null, close: null }]);
};

Dialogs.Confirm = function (title, message, yes, no, id) {

    var sYes;
    if (jQuery.isFunction(yes)) {
        Dialogs.confirmYes = yes;
        sYes = 'Dialogs.confirmYes()';
    }
    else
        sYes = yes;

    var sNo;
    if (jQuery.isFunction(no)) {
        Dialogs.confirmNo = no;
        sNo = 'Dialogs.confirmNo()';
    }
    else
        sNo = no;

    return Dialog(title, message, [{ text: '&nbsp;' + Globa.Yes.locale() + '&nbsp;', cls: 'btn-primary', click: sYes, close: !sYes }, { text: '&nbsp;' + Globa.No.locale() + '&nbsp;', click: sNo, close: !sNo }], id);
};

Dialogs.Dock = function (id, width) {
    if (!width)
        width = '300px';

    $('#' + id + ' .modal-header').hide();
    $('#' + id).css({ "left": "0", "top": "0", "margin": "0", "width": width });
    $('.modal-scrollable').has('#' + id).width($('#' + id).width()+10);
    $('.modal-scrollable').has('#' + id).css({'overflow':'hidden'});
    $('.modal-scrollable').has('#' + id).next('.modal-backdrop.in').remove();
    $('.modal-scrollable #' + id + ' #dock').remove();
};

Dialogs.Support = function (title, message, showUserContacts, addSystemInfo) {
    var body =
        '<div class="modal-message">' + message + '</div>' +
        '<hr>' +
        '<form class="form-support" id="form-support" name="form-support">' +
        '<div class="control-group" id="control-group-email">' +
        '<label class="control-label" for="email">Ваш email</label>' +
        '<span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span>' +
        '<div class="controls">' +
        '<div class="control-input">' +
        '<input type="text" id="email" name="email" value="' + (showUserContacts ? Asyst.Workspace.currentUser.EMail : '') + '">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="control-group" id="control-group-phone">' +
        '<label class="control-label" for="phone">Телефон</label>' +
        '<span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span>' +
        '<div class="controls">' +
        '<div class="control-input">' +
        '<input type="text" id="phone" name="phone">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="control-group" id="control-group-message">' +
        '<label class="control-label" for="name">Текст сообщения</label>' +
        '<span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span>' +
        '<div class="controls">' +
        '<div class="control-input">' +
        '<textarea id="name" name="name" rows="10"></textarea>' +
        '<span class="help-inline"></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</form>';
    var id = Dialog(
        title,
        body,
        [
            {
                text: 'Отправить', cls: 'btn-primary',
                click: function () {
                    var isvalid = true;
                    var selectorEmail = '#' + id + ' #email';
                    var selectorPhone = '#' + id + ' #phone';
                    var selectorName = '#' + id + ' #name';
                    if ($(selectorEmail).val() == '') {
                        isvalid = false;
                        setInputWarning(selectorEmail, true, Globa.Required.locale());
                    } else {
                        setInputWarning(selectorEmail, false, Globa.Required.locale());
                    }
                    if ($(selectorPhone).val() == '') {
                        isvalid = false;
                        setInputWarning(selectorPhone, true, Globa.Required.locale());
                    } else {
                        setInputWarning(selectorPhone, false, Globa.Required.locale());
                    }
                    if ($(selectorName).val() == '') {
                        isvalid = false;
                        setInputWarning(selectorName, true, Globa.Required.locale());
                    } else {
                        setInputWarning(selectorName, false, Globa.Required.locale());
                    }
                    if (isvalid) {
                        var browserString = '';
                        $.each($.browser, function (i, val) {
                            browserString += i + ': ' + val + ', ';
                        });
                        browserString = browserString.substring(0, browserString.length - 2);
                        var systemInfo = null;
                        if (addSystemInfo) {
                            systemInfo = JSON.stringify(window._errs);
                        }
                        var data = {
                            'Name': $(selectorName).val(),
                            'AuthorId': Asyst.Workspace.currentUser.Id,
                            'Phone': $(selectorPhone).val(),
                            'Email': $(selectorEmail).val(),
                            'Browser': browserString,
                            'URL': window.location.href,
                            'SystemInfo': systemInfo,
                        };
                        
                        Asyst.APIv2.Entity.save({
                            entityName: 'Support',
                            dataId: undefined,
                            data: data,
                            success: function() {
                                Dialogs.Message('Ваш вопрос принят и будет обработан в скором времени.');
                                $('#' + id).modal('hide');
                            }
                        });
                    } else {
                        Dialogs.Message('Заполните обязательные поля');
                    }
                },
                close: false
            },
            { text: 'Отмена', cls: 'btn-default', click: null, close: null }
        ]);
    return id;
};

function setPasswordDialog() {
    var setPassword = function() {
        var pass1 = $('#pass1').val();
        var pass2 = $('#pass2').val();
        if (pass1 && (pass1 === pass2)) {
            setInputWarning('#pass2', false, 'Пароли не совпадают');
            Asyst.API.AdminTools.setNewPassword(Asyst.Workspace.currentForm.Data.AccountId, pass2);
            $('#' + requestDialogId).modal('hide');
            Dialog('Смена пароля', "Пароль успешно изменен", [{ text: Globa.Close.locale() }]);

        } else {
            setInputWarning('#pass2', true, 'Пароли не совпадают');
        }

    };
    var requestsHtml = 'Введите пароль<div class="control-group" style="margin-bottom:5px"><div class="controls"><div id="passHidden" style="height:1px"><input type="password" style="border: none; box-shadow: none; outline: none;" /></div><input type="password" id="pass1" class="span6" style="width:450px;" rel="tooltip" title="" />\
<span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span>\
<span class="help-inline"></span>\
<div/>Повторно введите пароль\
<input type="password" id="pass2" class="span6" style="width:450px;" rel="tooltip" title="" />\
<span class="required-input" rel="tooltip" title="" data-html="true" data-original-title="Обязательно"></span>\
<span class="help-inline"></span>\
</div></div>';
    var requestDialogId = Dialog('Смена пароля', requestsHtml, [{ text: Globa.Continue.locale(), cls: 'btn-warning', click: setPassword, close: false }, { text: Globa.Cancel.locale() }]);
};
function Notify(title, text, image, time, sticky) {

    $.gritter.add({
        title: title,
        text: text,
        image: image,
        sticky: sticky,
        time: time
    });

    return false;

}

function NotifyError(title, text, time, sticky) {
    if (sticky == undefined)
        sticky = true;
    Notify(title, text, '/asyst/img/notify-icon-error.png', time, sticky);
}

function NotifyInfo(title, text, time, sticky) {
    if (sticky == undefined)
        sticky = true;
    $.extend($.gritter.options, { position: 'bottom-right' });
    Notify(title, text, '/asyst/img/chat-mail.png', time, sticky);
    $.extend($.gritter.options, { position: 'top-right' });
}
Loader = {};

Loader.show = function (container, text) {

    if (!Loader.count)
        Loader.count = 1;
    else {
        Loader.count++;
    }

    if (!text)
        text = Globa.Loading.locale();

    if (!Loader.indicator)
        Loader.indicator = $("<span class='loader-indicator'><label>" + text + "</label></span>").appendTo(document.body);
    else
        Loader.indicator.children('label').text(text);

    var c;
    if (container)
        c = $(container);
    else
        c = $('body');

    var w = 940; var h = 600; var x = 0; var y = 0;
    if (c) {
        try {

            var pos = c.position();
            if (pos) {
                x = pos.left;
                y = pos.top;
            }
            w = c.width();
            if (w === 0) w = $(window).width();

            h = c.height();
            if (h === 0) h = $(window).height();
        } catch (error) {
            void (0);
        }
    }

    Loader.indicator
        .css("position", "absolute")
        .css("top", y + h / 2 - Loader.indicator.height() / 2)
        .css("left", x + w / 2 - Loader.indicator.width() / 2);

    Loader.indicator.show();
};

Loader.hide = function(force) {
    if (Loader.indicator) {
        if (Loader.count && Loader.count > 0)
            Loader.count--;

        if (force || !Loader.count || Loader.count === 0) {
            Loader.indicator.fadeOut();
            Loader.count = 0;
        }
    }
};

//зависимые комбобоксы
var DependentCombobox = (function (elementName, dependsElemOnName) {
     var //access = Asyst.Workspace.currentForm.Access,
        $dependsOnSelect = $("select#" + dependsElemOnName),
        $elementSelect = $("select#" + elementName),
        selectValueLocale = "##SelectValue##".locale(),
        idIndex = elementName.indexOf("Id"),
        accessName = idIndex === (elementName.length - 2) ? elementName.substring(0, idIndex) : elementName;
        //accessReadonly = (typeof access != 'undefined' && access.hasOwnProperty(accessName) && access[accessName].IsReadonly);

    function changeHandler() {
        var $elementChosen = $("#" + elementName + "_chosen"),
            access = Asyst.Workspace.currentForm.Access,
            accessReadonly = (typeof access != 'undefined' && access.hasOwnProperty(accessName) && access[accessName].IsReadonly);

        $elementSelect.val("");
        var cb = $elementChosen.find("a span");
        if (!cb || cb.length === 0) {
            return;
        }
        cb[0].innerText = selectValueLocale;

        $elementSelect.change();
        $elementSelect.prop("disabled", $dependsOnSelect.val() === "" || accessReadonly).trigger("chosen:updated");
        if ($dependsOnSelect.val() === '') {
            //выключем комбобокс, приводим в соответствие классы, убираем кнопку очистки
            $elementChosen.addClass("chosen-disabled")
                .removeClass("chosen-container-active");
            $elementChosen.find("a").addClass("chosen-default");
            $elementChosen.find("a abbr").remove();
        } else {
            $elementChosen.removeClass("chosen-disabled");
            $("#" + elementName).trigger("chosen:showing_dropdown");
        }
    }
    function initHandler() {
        var $elementChosen = $("#" + elementName + "_chosen"),
            access = Asyst.Workspace.currentForm.Access,
            accessReadonly = (typeof access != 'undefined' && access.hasOwnProperty(accessName) && access[accessName].IsReadonly);

        $elementSelect.prop("disabled", $dependsOnSelect.val() === "" || accessReadonly).trigger("chosen:updated");
        if ($dependsOnSelect.val() === '') {
            //выключем комбобокс, приводим в соответствие классы, убираем кнопку очистки
            $elementChosen.addClass("chosen-disabled")
                .removeClass("chosen-container-active");
            $elementChosen.find("a").addClass("chosen-default");
            $elementChosen.find("a abbr").remove();
        }
        $dependsOnSelect.unbind("linkedcmbx:updatestate");
    }

    $dependsOnSelect.on("linkedcmbx:updatestate", initHandler);
    $dependsOnSelect.on("change", changeHandler);
});

function ChatWindow() {
    var form = Asyst.Workspace.currentForm;

    var body = '';
    body += '<div class="btn-toolbar">';
    body += '<div class="btn-group" data-toggle="buttons-radio">';
    body += '<button id="chatPriority1" class="btn danger">' + Globa.UrgentMessage.locale() + '</button>';
    body += '<button id="chatPriority2" class="btn warning active">' + Globa.ImportantMessage.locale() + '</button>';
    body += '<button id="chatPriority3" class="btn success">' + Globa.NormalMessage.locale() + '</button>';
    body += '</div>';
    body += '</div>';
    body += '<span>' + Globa.Addressee.locale() + ':</span><select id="chatRole" multiple style="width:100%">';
    for (var prop in form.Data) {
        var value = form.Data[prop];
        if (jQuery.isArray(value) && value.length > 0 && (value[0].classname == "Account" || value[0].classname == "User") && !(value.length == 1 && value[0].AccountId == form.userId)) {
            var binding = form.Bindings[prop];
            if (binding)
                body += '<option value="' + binding.ElementName + '">' + binding.Title + '<small> - (' + binding.displayValue() + ')<small></option>';
        }
    }
    body += '</select>';
    body += '<div class="clear" style="margin-bottom:10px"></div>';
    body += '<span>' + Globa.TemplateMessage.locale() + ':</span><span><select id="chatTemplate" style="width: 100%;" data-placeholder="' + Globa.QuickMessage.locale() + '"><option></option></select>';
    body += '<button id="chatAddTemplateButton" class="btn btn-small" style="float: left; padding: 4px 12px; margin: 10px 10px 0 0;" rel="tooltip" title="' + Globa.AddCurrentText.locale() + '"><i class="icon-plus"></i></button>';
    body += '<button id="chatEditTemplatesButton" class="btn btn-small" style="float: left; padding: 4px 12px; margin: 10px 10px 0 0;" rel="tooltip" title="' + Globa.EditTypicalMessageList.locale() + '"><i class="icon-pencil"></i></button>';
    body += '</span>';
    body += '<span>' + Globa.MessageText.locale() + ':</span>';
    body += '<textarea id="chatBody" rows=10 style="width: 100%; box-sizing: border-box;"></textarea>';
    body += '<script>';
    body += '$("#chatRole").chosen({placeholder_text_multiple:"' + Globa.SelectRecipient.locale() + '"});$("#chatTemplate").chosen();';
    body += '</script>';

    var templates;

    var send = function () {
        var msg = {};
        msg.Body = $('#chatBody').val();
        msg.Role = form.Bindings[$('#chatRole').val()].ElementName;
        msg.Priority = 3;
        if ($('#chatPriority1').hasClass('active'))
            msg.Priority = 1;
        else if ($('#chatPriority2').hasClass('active'))
            msg.Priority = 2;
        msg.DataId = form.EntityId;
        msg.EntityName = form.EntityName;
        
        Asyst.APIv2.Chat.sendMessage({msg: msg});
    };

    function chatAddTemplate() {
        var msg = $('#chatBody').val();
        if (msg) {
            Asyst.APIv2.Chat.addTemplate({
                msg: msg,
                success: function() {
                    if (!templates)
                        templates = [];
                    templates.push(msg);

                    $('#chatTemplate')[0].options.add(new Option(msg, msg));
                    $('#chatTemplate').trigger('chosen:updated');
                },
                async: true
            });
            
            
        }
    }

    function chatEditTemplates() {
        var body = '<div id="chatTemplateList">';
        for (var i in templates) {
            body += '<div id="chatTemplateRow' + i + '"><textarea rows="2" id="chatTemplate' + i + '" style="width: 450px">' + templates[i] + '</textarea>&nbsp;<button class="btn" onclick="var $el = $(\'#chatTemplateRow' + i + '\'); $el.fadeOut(\'fast\', function() { $el.remove(); })"><i class="icon-trash"></i></button></div>';
        }
        body += '</div>';

        function saveTemplateList() {
            templates = [];
            var $t = $('#chatTemplateList textarea');
            for (var i = 0; i < $t.length; i++)
                templates.push($t[i].value);

            Asyst.APIv2.Chat.saveTemplates({
                templates: templates, success: function () {
                    $('#chatTemplate')[0].options.length = 1;
                    for (var t in templates) {
                        $('#chatTemplate')[0].options.add(new Option(templates[t], templates[t]));
                        $('#chatTemplate').trigger('chosen:updated');
                    }
                }, async: true
            });
        }

        Dialog(Globa.TypicalMessageList.locale(), body, [{ text: Globa.Save.locale(), cls: 'btn-primary', click: saveTemplateList }, { text: Globa.Cancel.locale() }], 'chat-templates-modal');
    }

    function setFromTemplate() {
        var msg = $('#chatTemplate').val();
        if (msg) {
            $('#chatBody').val(msg);
            $('#chatTemplate').val("");
            $('#chatTemplate').trigger('chosen:updated');
        }
    }

    Dialog(Globa.SendingMessage.locale(), body, [{ text: Globa.Send.locale(), cls: 'btn-primary', click: send }, { text: Globa.Close.locale() }], 'chat-modal');

    Asyst.APIv2.Chat.getTemplates({
        success: function (data) {
            if (data) {
                templates = data;

                var select = $('#chatTemplate')[0];
                select.options.length = 1;
                for (var i in data) {
                    select.options.add(new Option(data[i], data[i]));
                }
                $('#chatTemplate').trigger('chosen:updated');
            }
        } });

    $('#chatAddTemplateButton').click(chatAddTemplate);
    $('#chatAddTemplateButton').tooltip();
    $('#chatAddTemplateButton').on('hidden', function () { return false; });
    $('#chatEditTemplatesButton').click(chatEditTemplates);
    $('#chatEditTemplatesButton').tooltip();
    $('#chatEditTemplatesButton').on('hidden', function () { return false; });
    $('#chatTemplate').change(setFromTemplate);
}

function MakeChat(params) {
    params = jQuery.extend({
        element: $('#header'),
    }, params);

    params = jQuery.extend({
        offset: params.element.width()
    }, params);

    params.element.append("<div class='note' style='width: 150px; position: fixed; background: url(\"/asyst/img/chat-bubble.png\") no-repeat scroll 0px 0px transparent; height: 50px; top: 0px; margin-left: " + params.offset + "px; padding-top: 9px; padding-left: 15px;'><a href='javascript:ChatWindow(); void(0);'><img src='/asyst/img/chat-mail.png' style='float:left'><div style='margin-left: 48px; font-size: 11px; line-height: 11px;'>" + "##SendMessage##".locale() + "</div></a></div>");
}

function TGRChat() {
    Asyst.APIv2.Form.handlerCheckRule({
        ruleName: 'ruleIsGroupMember',
        data: { GroupAccountName: 'PO' },
        async: true,
        success: function (isCheck) {
            if (isCheck || Asyst.Workspace.currentUser.IsFunctionalAdministrator) {
                //MakeChat({ element: $('#SendPrivateMessage') });
            }
            else {
                $("#SendPrivateMessage").addClass("hidden");
            }
        } });
}


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
    if (!options.disableCheckbox) {
        cols.unshift(checkboxSelector.getColumnDefinition());
    }
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
var Timeline = {};

Timeline.Create = function (selector, width, isAdaptiveContainer) {

    if (typeof width === "undefined")
        width = 590;
    var form = Asyst.Workspace.currentForm;
    var context = form.Data;
    isAdaptiveContainer = isAdaptiveContainer || false;

    $.ajax({
        url: "/asyst/phase/" + form.EntityName + "/" + form.Data.ActivityId,
        type: "GET",
        async: true,
        cache: false,
        dataType: "json",
        success: function (result) {
            form.CurrentPhaseName = "";
            form.NextPhaseName = "";

            if (jQuery.isArray(result) && result.length > 0) {

                var start = Asyst.date.parse(result[0].finish.substr(0, 10));
                if (start) {
                    if (start.getMonth() < 2) {
                        start.setFullYear(start.getFullYear() - 1);
                        start.setMonth(11 + start.getMonth() - 1);
                    }
                    else
                        start.setMonth(start.getMonth() - 2);

                    start = Asyst.date.format(start);
                }

                for (var i = 0; i < result.length; i++) {
                    var phase = result[i];
                    if (phase.status == 2 || phase.status == -1) {
                        form.CurrentPhaseName = phase.name;
                        if (result[i + 1])
                            form.NextPhaseName = result[i + 1].name;
                    }
                }

                //пока комментируем добавление липовой строчки "за два месяца до"
                //result.unshift({ name: "", tooltip: "", finish: start, status: 0 });
                try {
                    var options = { width: width, array: result, isAdaptiveContainer: isAdaptiveContainer };
                    $(selector).timeline(options);
                } catch (error) {
                    void (0);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (Asyst.GlobalPageStateStopped) {
                //пробуем скипать ошибки после выгрузки страницы
                return;
            }
            ErrorHandler(Globa.ErrorLoad.locale(), textStatus);
        }
    });
};

var ExportToWord = {};
ExportToWord.Create = function (id, settings) {

    settings = jQuery.extend({
        service: "",
        method: "",
        paramName: "",
        paramValue: ""
    }, settings);
    var element = $(id);
    if (!element) return;

    element.data("ExportToWord", settings);
    element.click(function () {
            CallService.FormInvoke(settings);
        }
    );
};

ExportToWord.Invoke = function (sender) {

    Loader.show(undefined, Globa.ExportDocument.locale());
    var settings = sender.data("ExportToWord");
    var ajdata = "{}";

    if (settings.paramName != "")
        ajdata = "{" + settings.paramName + ": " + settings.paramValue + "}";

    var ajurl = settings.service + "/" + settings.method;


    jQuery.ajax({
        type: "POST",
        url: ajurl,
        data: ajdata,
        async: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        error: function (XMLHttpRequest, text, error) {

            Loader.hide();
            NotifyError(Globa.SystemError.locale(), Globa.SentErrorDescription.locale() + ":<br/>" + XMLHttpRequest.status + "<br> " + XMLHttpRequest.statusText + "<br>" + XMLHttpRequest.responseText, 10000, false);
        },
        success: function (result, text, v) {

            Loader.hide();
            var _result = result.d;
            if (_result.indexOf("Error") === 0)
                NotifyError(Globa.SystemError.locale, Globa.SentErrorDescription.locale() + ":<br/>" + v.status + "<br> " + v.statusText + "<br>" + v.responseText, 10000, false);
            else {
                if (_result.indexOf("\\") !== 0)
                    _result = "\\" + _result;
                window.open(_result);
            }
        }
    });
};
var CallService = {};
CallService.Create = function(id, settings) {
    settings = jQuery.extend({
        service: "",
        method: "",
        tooltip: Globa.CallService.locale(),
        params: {}
    }, settings);

    var element = $(id);
    if (!element) return;

    element.data("CallService", settings);
    element.click(function () {
            CallService.FormInvoke(element.data("CallService"));
        }
    );
};

CallService.FormInvoke = function(settings) {
    var ajurl = settings.service + "/" + settings.method;
    var formHtml = '<form target="_blank" action="' + ajurl + '" method="POST">';
    for (var ctx in settings.params) {
        formHtml += '<input class="postFormHtml" type="text" size="50" id="' + ctx + '" name="' + ctx + '" value="">';
    }
    formHtml += '</form>';
    var form = $(formHtml);
    for (var ctx in settings.params) {
        $(form).find('#' + ctx).attr('value', settings.params[ctx]);
    }

    $('body').append(form);
    form.submit();
    setTimeout(function() { form.remove(); }, 100); // cleanup
};

CallService.Invoke = function (settings) {
    Loader.show(undefined, settings.tooltip);

    var ajurl = settings.service + "/" + settings.method;

    jQuery.ajax({
        type: "POST",
        url: ajurl,
        data: JSON.stringify(settings.params),
        async: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        error: function (XMLHttpRequest, text, error) {
            Loader.hide();
            NotifyError(Globa.SystemError.locale(), Globa.SentErrorDescription.locale() + ":<br/>" + XMLHttpRequest.status + "<br> " + XMLHttpRequest.statusText + "<br>" + XMLHttpRequest.responseText, 10000, false);
        },
        success: function (result, text, v) {
            Loader.hide();
            var _result = result.d;
            if (_result.indexOf("Error") === 0)
                NotifyError(Globa.SystemError.locale(), Globa.SentErrorDescription.locale() + ":<br/>" + v.status + "<br> " + v.statusText + "<br>" + v.responseText, 10000, false);
            else {
                if (_result.indexOf("/") !== 0)
                    _result = "/" + _result;
                window.open(_result);
            }
        }
    });
};
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