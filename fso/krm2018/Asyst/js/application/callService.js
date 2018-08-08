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


CallService.CreateByDataAttr = function () {
    var getValue = function (value, name) {
        if (value == undefined && name) value = '(' + name + ')'; //это для случая, когда все параметры указаны в хранимке, но не найдены в параметрах - тогда попробуем подставить из Data

        if (value && value.toString().indexOf('(') > -1) {
            with (Asyst.Workspace.currentForm.Data)
                value = eval(value);
        }

        return value;
    }
    $('a[data-callservice-sp]').off().each(function (_, e) {
        var a = $(e);
        a.on('click', function () {
            var element = $(this);
            var settings = { params: {} };
            settings['service'] = element.data('service') || '/asystSPUtil/SPUtil.asmx';
            settings['method'] = element.data('method') || 'ExportManyProcToWord';

            settings.params['filePrefix'] = element.data('fileprefix');
            settings.params['templateUrl'] = 'asyst/WindowsLogin.aspx?authSelect=true&ReturnUrl=%2fasyst%2fapi%2ffile%2fget%2f' + element.data('templateurl').replace('/', '%2f');
            settings.params['sp'] = element.data('callservice-sp');

            if (settings.params.filePrefix.indexOf('(') > -1) {
                with (Asyst.Workspace.currentForm.Data)
                    settings.params.filePrefix = eval(settings.params.filePrefix);
            }

            if (settings.params.sp.indexOf('@') > -1) {//это много хранимок и/или есть параметры, кторые надо подменить
                settings.params.sp = settings.params.sp.replace(new RegExp('@([a-zA-Z0-9_]*)', 'g'), function (match, param) {
                    var vlue = getValue(element.data('param-' + param.toLowerCase()), param);
                    return match + '=' + value + ';#';
                });

                settings.params.sp = settings.params.sp.trim()
                    //.replace(new RegExp('# @', 'g'), '#@')
                    .replace(new RegExp(';# ##', 'g'), '##')
                    .replace(new RegExp(';#$', 'g'), '');
            }
            else { //там только одна хранимка без параметров, тогда к ней надо приделать все параметры
                var params = [].filter.call(this.attributes, function (at) { return /^data-param-/.test(at.name); })
                    .map(function (at) { return '@' + at.name.replace('data-param-', '') + '=' + getValue(at.value) })
                    .join(';#')

                settings.params.sp = settings.params.sp + ' ' + params;
            }

            CallService.FormInvoke(settings);
        });
    });
};

document.addEventListener("DOMContentLoaded", CallService.CreateByDataAttr);

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