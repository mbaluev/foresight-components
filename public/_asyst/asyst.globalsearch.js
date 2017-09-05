var Asyst;

if (!Asyst) {
    Asyst = {};
}

if (!Asyst.browser) {
    userAgent = navigator.userAgent;


    rwebkit = /(webkit)[ \/]([\w.]+)/;
    ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
    rmsie = /(msie) ([\w.]+)/;
    rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

    uaMatch = function(ua) {
        ua = ua.toLowerCase();

        var match = rwebkit.exec(ua) ||
            ropera.exec(ua) ||
            rmsie.exec(ua) ||
            ua.indexOf("compatible") < 0 && rmozilla.exec(ua) ||
            [];

        return { browser: match[1] || "", version: match[2] || "0" };
    };

    Asyst.browser = {};
    browserMatch = uaMatch(userAgent);
    if (browserMatch.browser) {
        Asyst.browser[browserMatch.browser] = true;
        Asyst.browser.version = browserMatch.version;
    }

    // Deprecated, use jQuery.browser.webkit instead
    if (Asyst.browser.webkit) {
        Asyst.browser.safari = true;
    }
}

(function () {
    'use strict';
    
    if (!Asyst.globalSearch) {
        Asyst.globalSearch = {};
    }

    var timeoutId;
    var xhr;
    var currentSearchText;
    var $searchResults;
    var $element;
    var $input;
    
    if (typeof Asyst.globalSearch.find !== 'function') {

        Asyst.globalSearch.find = function (text, callback, error, context, action, useSP) {
            var result;
            var xhr = $.ajax({
                url: '/asyst/api/globalsearch',
                type: 'GET',
                async: true,
                cache: false,
                data: /*JSON.stringify({ action: action, text: text }),  //*/'{"action":"' + action + '","text" : "' + encodeURIComponent(text) + '", "useSearchProc": "' + useSP+ '"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processData: false,
                success: function (response) {
                    if (response) {
                        result = response;
                        if (result && result.thisIsError == true) {
                            if (error)
                                error(result.message, result.info, context);
                            else if (!async)
                                throw { error: result.message, info: result.info, toString: function () { return result.message; }, context: context };

                            return;
                        }
                    }
                    if (callback)
                        callback(result, context);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var text = "";
                    if (jqXHR)
                        text = jqXHR.responseText;

                    if (error)
                        error(errorThrown, text, context);
                    else if (!async)
                        throw { error: errorThrown, info: text, toString: function () { return errorThrown; }, context: context };
                }
            });

            return xhr;
        };
    }

    if (typeof Asyst.globalSearch.input !== 'function') {

        Asyst.globalSearch.input = function (selector, areas, buildFunc, useStoredProcedure) {
            if (typeof areas == 'undefined')
                areas = 'entitysearch, filesearch, documentnamesearch';
            if (useStoredProcedure === undefined || useStoredProcedure === null)
                useStoredProcedure = false;
            $input = $(selector);

            $input.before("<div class='search-icon'></div>");
            var keyup = function (e) {
                switch (e.keyCode) {
                    case 27: // escape
                        Asyst.globalSearch.clear(selector);
                        break;

                    default:
                        Asyst.globalSearch.search(selector, $input.val());
                }

                e.stopPropagation();
                e.preventDefault();
            };

            var keypress = function (e) {
                switch (e.keyCode) {
                    case 27: // escape
                        e.preventDefault();
                        break;
                    case 13:// enter. stop processing to prevent submit form
                        e.preventDefault();
                        break;
                }

                e.stopPropagation();
            };

            var blur = function (e) {
                if ($searchResults && $searchResults.active) {
                    $searchResults.active = false;
                    $searchResults.blur(blur);
                }
                else
                    setTimeout(function () { Asyst.globalSearch.clear(selector); }, 200);
            };

            $input.blur(blur);
            $input.keypress(keypress);
            $input.keyup(keyup);

            if (Asyst.browser.webkit || Asyst.browser.msie) {
                $input.keydown(keypress);
            }
            $input.data('search-areas', areas);
            $input.data('search-builder', buildFunc);
            $input.data('search-useSP', useStoredProcedure);
        };
    }

    if (typeof Asyst.globalSearch.search !== 'function') {

        Asyst.globalSearch.search = function (selector, text) {
            if(!text)
            {
                this.clear();
                return;
            }

            if(timeoutId)
            {
                clearTimeout(timeoutId);
                timeoutId = null;
            }

            var self = this;
            
            var doSearch = function() {
                text = $input.val();
                if (currentSearchText != text) {
                    if (xhr) {
                        xhr.abort();
                        xhr = null;
                    }

                    currentSearchText = $input.val();
                    $element = $(selector);
                    $element.addClass("globalsearch-processing");

                    timeoutId = null;
                    var areas = $input.data('search-areas');
                    var useSP = $input.data('search-useSP');
                    if (typeof areas == 'undefined')
                        areas = 'entitysearch';
                    xhr = self.find(currentSearchText, function(results) {
                        $element.removeClass("globalsearch-processing");
                        xhr = null;
                        render(results);
                    },
                        function() {
                            $element.removeClass("globalsearch-processing");
                            xhr = null;
                        },
                        self, areas, useSP);
                }
            };
            timeoutId = setTimeout(doSearch, 200);
        };
    }

    if (typeof Asyst.globalSearch.clear !== 'function') {

        Asyst.globalSearch.clear = function (selector) {

            $(selector).removeClass("globalsearch-processing");

            currentSearchText = "";
            timeoutId = null;
            if($searchResults)
            {
                $searchResults.hide('slow', function(){
                    $searchResults.remove();
                    $searchResults = null;
                });
            }
        };
    }

    function render(results) {
        if(!$searchResults)
        {
            $('body').append('<div id="globalsearch-results" style="display:none;"></div>');
            $searchResults = $('#globalsearch-results');
            $searchResults.css(
                { 
                    "position": "absolute", 
                    "max-width": "290px", 
                    "max-height": "400px", 
                    "overflow": "auto", 
                    "z-index": "9999", 
                    "background": "#fff", 
                    "-khtml-border-radius": "4px", 
                    "-ms-border-radius": "4px", 
                    "-o-border-radius": "4px", 
                    "-moz-border-radius": "4px", 
                    "-webkit-border-radius": "4px", 
                    "border-radius": "4px",
                    "-khtml-box-shadow": "rgba(0,0,0,0.5) 0 0 10px", 
                    "-ms-box-shadow": "rgba(0,0,0,0.5) 0 0 10px", 
                    "-o-box-shadow": "rgba(0,0,0,0.5) 0 0 10px", 
                    "-moz-box-shadow": "rgba(0,0,0,0.5) 0 0 10px", 
                    "-webkit-box-shadow": "rgba(0,0,0,0.5) 0 0 10px", 
                    "box-shadow": "rgba(0,0,0,0.5) 0 0 10px"
                }
            );

            if (Asyst.browser.msie) {
                $searchResults.css(
                    { 
                        "border": "#888 1px solid"
                    }
                );
            }

            $searchResults.mousedown(function(){ 
                $searchResults.active = true;
                $searchResults.focus(); 
            });
        }

        var pos = $.extend({}, $element.offset(), {height: $element[0].offsetHeight});
        $searchResults.css({ top: pos.top + pos.height, left: pos.left });

        var builder = $input.data('search-builder');
        if (builder == null)
            builder = buildList;
        $searchResults.html(builder(results));

        $searchResults.show();
    }

    function buildList(results) {
        if(!jQuery.isArray(results))
            return null;
        if (results.length > 0) {
            var i;
            var item;
            var s = '<ul>';
            for (i = 0; i < results.length; i++) {
                item = results[i];
                if (item.hasOwnProperty("__type__") && (item.__type__ == 'filesearch' || item.__type__ == 'documentnamesearch'))
                    s += '<li><a href="' + item.Url +'"><h4> Файл </h4><p>' + item.Name + '</p></a></li>';
                else 
                    s += '<li><a href="/asyst/' + item.EntityName + '/form/auto/' + item.Id + '?mode=view&back=' + encodeURIComponent(location.href) + '"><h4>' + item.EntityTitle + '</h4><p>' + item.Name + '</p></a></li>';
            }
            s += '</ul>';

            return s;
        }
        else {
            return '<div style="margin: 16px">' + Globa.RecordNotFound.locale() + '</div>';
        }
        
    }

    
} ());