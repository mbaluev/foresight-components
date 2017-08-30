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