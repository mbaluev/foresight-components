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