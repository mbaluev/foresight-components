Asyst.Page = function(extPage) {
    page = this;
    page.pageName = extPage.Name;
    page.pageTitle = extPage.Title;

    page.templates = {};
    page.TemplateData = {};

    this.buildPageTemplate = function(elementName) {
        //var PageName = откуда-то взять.

        var success = function(data) {
            var c = arguments.callee;
            page.TemplateData[c.ElementName] = data;
            //var el = $("#" + formData.FormName + " #" + c.ElementName);
            var el = $(/*'#' + page.pageName + */" #" + c.ElementName);

            var s = ProcessTemplate(page.templates[c.ElementName].content, data, {});
            el.html(s);

        };
        success.ElementName = elementName;

        var gets = splitGETString();
        
        for (var c in gets) {
            if (gets.hasOwnProperty(c) && gets[c].constructor === String) {
                gets[c] = decodeURIComponent(gets[c]);
            }
        }

        Asyst.APIv2.DataSource.load({
            sourceType: 'page',
            sourceName: page.pageName,
            elementName: elementName,
            data: gets,
            success: success,
            error: function(error, text) { ErrorHandler(Globa.ErrorDataListLoad.locale(), error + "<br>" + text); },
            async: true,
            isPicklist: false
        });
    };

    this.Load = function() {
        Asyst.Workspace.addCurrentPage(this);
        Asyst.API.AdminTools.saveStats({ page: location.href, pageTitle: this.pageTitle, type: 'asystPage', action: 'open'},true);

        for (var c in this.templates) {
            this.buildPageTemplate(c);
        }

    };
    return this;
};

//надо как-нибудь неймспейс прикрутить чтоли..
var showView = function (viewName, elementName) {
    var el = $('#' + elementName);
    var success = function(html) {
        var s = html;

        var sel = document.createElement("div");
        $(sel).html(s);
        var selScript = $(sel).find('script[src]');
        for (var ind = 0; ind < selScript.length; ind++) {
            var path = $(selScript[ind]).attr("src");
            if ($("script[src='" + path + "']").length > 0)
                $(sel).find("script[src='" + path + "']").remove();
        }
        el.html(sel);
    };
    var ls = location.search;
    if (ls) {
        ls += "&nojscss=true";
    } else {
        ls = "?nojscss=true";
    }
    $.ajax({ url: '/asyst/browse/' + viewName + ls+'&rand='+Math.round(Math.random() * 10000000), type: 'GET', success: success });
};

/* получаем весь построенный контент страницы по имени */
function getDashboardHTML(pageName) {

    var result = "";
    var gets = splitGETString();

    /* считываем get-параметры */
    for (var c in gets) {
        if (gets.hasOwnProperty(c) && gets[c].constructor === String) {
            gets[c] = decodeURIComponent(gets[c]);
        }
    }

    /* считываем все элементы выбранной страницы (из специального представления)*/
    Asyst.APIv2.View.load({
        viewName: "MetaPageElementByPageView",
        data: { PageName: pageName },
        success: function (view) {
            /* если элементы страницы получены, то получаем для каждого источник */
            $.each(view.data, function (key, value) {
                var elData = Asyst.APIv2.DataSource.load({
                    sourceType: "page",
                    sourceName: pageName,
                    elementName: value.Name,
                    data: gets,
                    success: function (data) {
                        /* если источник получен, то применяем данные к шаблону; итоговую html запоминаем*/
                        result += ProcessTemplate(value.Content, data, {});
                    },
                    error: function (error, text) {
                        /* если данные не удалось применить, бросаем ошибку */
                        ErrorHandler(Globa.Error.locale(), error + "<br>" + text);
                    },
                    isPicklist: false,
                    async: false,
                });
            })
        },
        error: function (error, text) {
            /* если данные не удалось получить, бросаем ошибку */
            ErrorHandler(Globa.ErrorDataListLoad.locale(), error + "<br>" + text);
        },
        async: false
    });

    /* полученный html отдаем странице*/
    return result;
}