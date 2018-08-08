
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