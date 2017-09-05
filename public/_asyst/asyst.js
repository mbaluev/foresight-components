var Asyst;

if (!Asyst) {
    Asyst = {};
}

(function () {
    'use strict';

    (function (_) { if (typeof (_._errs) === "undefined") { _._errs = []; var c = _.onerror; _.onerror = function () { var a = arguments; _errs.push(a); c && c.apply(this, a) }; } })(window);

    if (!Asyst.debugger) {
        Asyst.debugger = function(tag) {
            if (!tag || Asyst.debugger.tags[tag])
                debugger;
        };
        var t = localStorage.getItem('Asyst.debugger');
        if (t) {
            Asyst.debugger.tags = {};
            var arr = t.split(',');
            for (var c in arr)
                Asyst.debugger.tags[arr[c]] = true;
        }
        else Asyst.debugger.tags = {};
    }

    if (!Asyst.protocol) {
        Asyst.protocol = {};
    }

    if (!Asyst.zimbar) {
        Asyst.zimbar = {};
        Asyst.zimbar.isAsyst = false;
        Asyst.zimbar.isAsystPage = false;
        Asyst.zimbar.isAsystForm = false;
        Asyst.zimbar.isAsystAdminka = false;
        Asyst.zimbar.isAsystView = false;
        Asyst.zimbar.isAsystReport = false;
        Asyst.zimbar.isSharePoint = false;
        Asyst.zimbar.init = function(callback){
            var callback_result;
            if (callback) { callback_result = callback(); }
            if (!callback_result) {
                Asyst.zimbar.initFlags();
                Asyst.API.AdminTools.getZimbarList(true, function() {
                    Asyst.zimbar.createMenuItems(arguments[0]);
                    Asyst.zimbar.createTopPanel(arguments[0]);
                });
            }
        };
        Asyst.zimbar.initFlags = function(){
            if (Asyst.Workspace) {
                if (Asyst.Workspace.currentForm || Asyst.Workspace.currentPage || !isEmpty(Asyst.Workspace.views))
                    Asyst.zimbar.isAsyst = true;
                if (Asyst.Workspace.currentPage)
                    Asyst.zimbar.isAsystPage = true;
                if (Asyst.Workspace.currentForm)
                    Asyst.zimbar.isAsystForm = true;
            }
            if ($("head meta[name='GENERATOR']").attr("content") == "Asyst.Adminka")
                Asyst.zimbar.isAsystAdminka = true;
            if ($("head meta[name='GENERATOR']").attr("content") == "Asyst.View")
                Asyst.zimbar.isAsystView = true;
            if ($("head meta[name='GENERATOR']").attr("content") == "Asyst.Report")
                Asyst.zimbar.isAsystReport = true;
            if ($("head meta[name='GENERATOR']").attr("content") == "Microsoft SharePoint")
                Asyst.zimbar.isSharePoint = true;
            function isEmpty(obj) {
                // null and undefined are "empty"
                if (obj == null) return true;

                // Assume if it has a length property with a non-zero value
                // that that property is correct.
                if (obj.length > 0)    return false;
                if (obj.length === 0)  return true;

                // If it isn't an object at this point
                // it is empty, but it can't be anything *but* empty
                // Is it empty?  Depends on your application.
                if (typeof obj !== "object") return true;

                // Otherwise, does it have any properties of its own?
                // Note that this doesn't handle
                // toString and valueOf enumeration bugs in IE < 9
                for (var key in obj) {
                    if (hasOwnProperty.call(obj, key)) return false;
                }
                return true;
            }
        };
        Asyst.zimbar.createMenuItems = function(ar){
            var appendHtml = "";
            if (ar && ar.length > 0){
                if (Asyst.zimbar.isAsystPage){
                    var appendHtml = "<li><br/></li>";
                    for(var i=0; i < ar.length; i++){
                        appendHtml += '<li> <a href="#" onclick="Asyst.protocol.zimbar.setZimbar(\'' + ar[i].Account.replace('\\','\\\\')+ '\'); location.reload();">Замещать ' + ar[i].FullName + '</a></li>';
                    }
                    $('header ul.extended.logout').append($(appendHtml));
                }
                if (Asyst.zimbar.isSharePoint){
                    for(var i=0; i < ar.length; i++){
                        var $ie_menuitem = $('<ie:menuitem id="zimbar' + i + '" type="option" ' +
                            'onmenuclick="javascript:Asyst.protocol.zimbar.setZimbar(\'' + ar[i].Account.replace('\\','\\\\')+ '\'); location.reload();" ' +
                            'onmenuclick_original="javascript:Asyst.protocol.zimbar.setZimbar(\'' + ar[i].Account.replace('\\','\\\\')+ '\'); location.reload();" ' +
                            'text="Замещать ' + ar[i].FullName + '" ' +
                            'text_original="Замещать ' + ar[i].FullName + '" ' +
                            'description="Замещать ' + ar[i].FullName + '" ' +
                            'description_original="Замещать ' + ar[i].FullName + '" ' +
                            'menugroupid="300" ' +
                            'enabled="true" ' +
                            'checked="false" ' +
                            'valorig=""></ie:menuitem>');
                        $('#welcomeMenuBox menu').append($ie_menuitem);
                    }
                }
            }
        };
        Asyst.zimbar.createTopPanel = function(ar){
            var curZimbar = Asyst.protocol.zimbar.getZimbar();
            if (curZimbar){
                var $zimbar_user_title = Asyst.zimbar.appendTopPanelHtml();
                for(var i=0; ar && i < ar.length;i++){
                    if (ar[i].Account == curZimbar){
                        $zimbar_user_title.text(ar[i].FullName);
                    }
                }
            }
        };
        Asyst.zimbar.appendTopPanelHtml = function(){
            var $zimbar =
                $('<div id="zimbargation" class="info">' +
                    '	<div class="z-btn z-close" id="clearZimbar" onclick="Asyst.protocol.zimbar.clearZimbar(); location.reload();" title="Прекратить замещение"></div>' +
                    '	<div class="z-btn z-text pull-right z-border" id="zimbarusertitle">Пользователь</div>' +
                    '	<div class="z-btn z-text pull-right z-transparent">Вы работаете в системе как</div>' +
                    '</div>');
            $('body').addClass('zimbargate');
            if (Asyst.zimbar.isAsystPage || Asyst.zimbar.isAsystForm) {
                $('body').addClass('fixed');
                $('body').prepend($zimbar);
            } else if (Asyst.zimbar.isAsystAdminka || Asyst.zimbar.isAsystView) {
                $('body').addClass('static');
                $('body').prepend($zimbar);
            } else if (Asyst.zimbar.isAsystReport) {
                $('body').addClass('fixed');
                $('.main-container').prepend($zimbar);
            } else if (Asyst.zimbar.isSharePoint) {
                $('body').addClass('static');
                $('body').addClass('sharepoint');
                $('#ms-designer-ribbon').before($zimbar);
            } else {
                $('body').addClass('static');
                $('body').prepend($zimbar);
            }
            $zimbar.find('#clearZimbar').on('click', function(){
                Asyst.protocol.zimbar.clearZimbar();
                location.reload();
            });
            if ($().tooltip) {
                $zimbar.find('#clearZimbar').tooltip({ container: "body", placement: "bottom" });
            }
            return $zimbar.find('#zimbarusertitle');
        };
        $(function(){
            Asyst.zimbar.init();
        });
    }

    if (!Asyst.protocol.zimbar) {
        Asyst.protocol.zimbar = {};
        Asyst.protocol.zimbar.NAME = "Asyst.zimbar";
        Asyst.protocol.zimbar.hasZimbar = function() {
            var zimbar = Asyst.Utils.getCookie(Asyst.protocol.zimbar.NAME);
            return (zimbar !== null);
        }
        Asyst.protocol.zimbar.getZimbar = function () {
            var zimbar = getCookie(Asyst.protocol.zimbar.NAME);
            return zimbar;
        }
        Asyst.protocol.zimbar.setZimbar = function (substitution) {
            Asyst.Utils.setCookie(Asyst.protocol.zimbar.NAME, substitution, {path:'/'});
        }
        Asyst.protocol.zimbar.clearZimbar = function () {
            Asyst.Utils.setCookie(Asyst.protocol.zimbar.NAME, "", { path: '/', expires: -1 });
        }
    }

    if (typeof Asyst.protocol.format !== 'function') {

        Asyst.protocol.format = function (obj) {
            var prop, value;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {

                    value = obj[prop];

                    if (value) {
                        if (typeof (value) === "string") {
                            var reg = value.match(/\/Date\((\d+)(?:([\-+])(\d+))?\)\//);
                            if (reg !== null && reg.constructor === Array && reg.length >0) {
                                //reg[0] = /Date(955238400000+0700)/   reg[1] = 955238400000   reg[2] = 0700
                                value = new Date(Number(reg[1]));
                            }
                        } else if (typeof (value) === "object") {
                            Asyst.protocol.format(value);
                        } else if (value.constructor  === Array) {
                            Asyst.protocol.format(value);
                        }
                        obj[prop] = value;
                    }
                }
            }
            return obj;
        };
    }
    
    if (typeof Asyst.protocol.thiningData !== 'function') {

        //упрощение объекта.
        //если aggressive = true, остаются только простые типы - числа, строки, даты, булевские.
        //если aggressive = false, остаются простые типы и массивы из простых типов.
        Asyst.protocol.thiningData = function (data, aggressive) {

            function isSimple(obj) {
                return obj === undefined || obj === null || obj.constructor === String || obj.constructor === Date || obj.constructor === Number || obj.constructor === Boolean;
            }

            if (data === null || data === undefined)
                return data;

            if (isSimple(data))
                return data;
            
            var result;
            if (data.constuctor === Array) {
                result = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    if (isSimple(data[i])) result.push(data[i]);
                }
                return result;
            }
            else if (true) {
                result = {};
                for (var c in data) {
                    if (data.hasOwnProperty(c)) {
                        if (isSimple(data[c])) {
                            result[c] = data[c];
                        }
                        else if (!aggressive) {
                            if (data[c].constructor === Array) {
                                var subresult = [];
                                var arr = data[c];
                                for (var i = 0, len = arr.length; i < len; i++) {
                                    if (isSimple(arr[i])) subresult.push(arr[i]);
                                }
                                if (subresult.length>0) //опционально - вырезает пустые массивы - может быть слишком агрресиве )
                                    result[c] = subresult;  
                            }
                        }
                    }
                    
                }
                return result;
            }
        };
    }

    if (typeof Asyst.protocol.send !== 'function') {

        Asyst.protocol.send = function (url, type, data, async, callback, error, context, headers) {
            var result;
            var sData;
            if (data)
                sData = encodeURIComponent(JSON.stringify(data));

            var params = {
                url: url,
                type: type,
                async: async,
                cache: false,
                data: sData,
                dataType: "json",
                processData: false,
                headers: headers,
                success: function(response, statusText, jqXHR) {
                    if (response !== null && response !== undefined) {
                        result = Asyst.protocol.format(response);
                        if (result && result.thisIsError == true) {
                            if (result.message == Globa.LicenseError) {
                                LicenseErrorHandler(result.message, result.info);
                            }

                            if (error)
                                error(result.message, result.info);
                            else if (!async)
                                throw {
                                    error: result.message,
                                    info: result.info,
                                    toString: function() { return result.message; }
                                };

                            return;
                        }
                    }
                    if (callback)
                        callback(result);
                    if (jqXHR.getResponseHeader('systemMessage') == 'true') {
                        Asyst.protocol.MessageCenter.GetMessages();
                    }
                    if (jqXHR.getResponseHeader('asyst-license-expire')) {
                        Asyst.protocol.LicenseCenter.ShowExpireLicenseMessage(
                            jqXHR.getResponseHeader('asyst-license-expire'));
                    }


                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (Asyst.GlobalPageStateStopped) {
                        //пробуем скипать ошибки после выгрузки страницы
                        return;
                    }

                    var text = "";
                    if (jqXHR)
                        text = jqXHR.responseText;

                    if (error)
                        error(errorThrown, text);
                    else if (!async)
                        throw { error: errorThrown, info: text, toString: function() { return errorThrown; } };
                }
            };

            if (!async) {
                $.ajax(params);
                return result;
            } else {
                return $.ajax(params);
            }
        };
    }

    if (typeof Asyst.protocol.get !== 'function') {
        Asyst.protocol.get = function(url, type, data) {
            return Asyst.protocol.send(url, type, data, false, null, null);
        };
    }

    if (typeof Asyst.protocol.LicenseCenter !== 'object') {
        Asyst.protocol.LicenseCenter = {};
        Asyst.protocol.LicenseCenter.ShowExpireLicenseMessage = function (days) {
            if (!Asyst.protocol.LicenseCenter.isShowed) {
                if ($(".asyst-license-expire-block").length === 0) {
                    $('body').append('  <div class="alert alert-warning asyst-license-expire-block">' +
                        '<a href="#" class="close" data-dismiss="alert"></a>' +
                        '<strong>' + Globa.ASPXLicenseExpired.locale().replace('{0}', days) + '</strong>' +
                        '</div>');
                    Asyst.protocol.LicenseCenter.isShowed = true;
                }
            }
        };
    }

    if (typeof Asyst.protocol.MessageCenter !== 'object') {
        Asyst.protocol.MessageCenter = {};
        Asyst.protocol.MessageCenter.flag = false;
        Asyst.protocol.MessageCenter.GetMessages = function() {
            if (!Asyst.protocol.MessageCenter.flag) {
                Asyst.protocol.MessageCenter.flag = true;
                setTimeout(Asyst.protocol.MessageCenter.ProcessMessages, 1000);
            }
        };
        
        Asyst.protocol.MessageCenter.ProcessMessages = function () {
            Asyst.protocol.MessageCenter.flag = false;
            
            //<получаем сообщения>
            var messages = Asyst.API.View.load('SystemMessageView');
            //<показываем сообщения>
            if (messages != null) {
                for (var i = 0; i < messages.data.length; i++)
                    NotifyInfo('системная информация', messages.data[i].message, true);
            }
        };

    }

    /* отсечка по ошибкам загрузки на выгрузке страницы */
    var prevOnunload = window.onunload;
    window.onunload = function (evt) {
        console.log('onunload');
        Asyst.GlobalPageStateStopped = true;
        if (prevOnunload)
            return prevOnunload(evt);
        return;
    };

    $(document).on('keydown', function (evt) {
        if (evt.keyCode == 27) {
            console.log('esc pressed');
            Asyst.GlobalPageStateStopped = true;
        }
        return;
    });

    //----------------------------------------------------------------------------
    //  API к серверным handler'ам
    //----------------------------------------------------------------------------
    
    {//region Asyst.API

        Asyst.APIv2 ? null : Asyst.APIv2 = {};
        

        Asyst.APIv2.Entity ? null : Asyst.APIv2.Entity = {};

        if (!Asyst.APIv2.Entity.load) {
            Asyst.APIv2.Entity.load = function (params) {
                var dataId = params.dataId;
                params = $.extend({ isAccessNeed: false, async: true}, params);
                if (!params.dataId) {
                    params.dataId = 'new';
                }
                var success = function (data, context) {
                    data.id = dataId;

                    if (params.success)
                        params.success(data, context);
                };
                var error = params.error;
                return Asyst.protocol.send("/asyst/entity/" + params.entityName + "/" + params.dataId, "GET", { isAccessNeed: params.isAccessNeed }, params.async, success, error, null, params.headers);
            };
        }
        if (!Asyst.APIv2.Entity.save) {
            Asyst.APIv2.Entity.save = function (params) {
                params = $.extend({ async: true }, params);
                if (!params.dataId) {
                    params.dataId = 'new';
                }
                return Asyst.protocol.send("/asyst/entity/" + params.entityName + "/" + params.dataId, "POST", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.Entity.delete) {
            Asyst.APIv2.Entity.delete = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/entity/" + params.entityName + "/" + params.dataId, "DELETE", null, params.async, params.success, params.error, null, params.headers);
            };
        }


        Asyst.APIv2.Form ? null : Asyst.APIv2.Form = {};
        
        if (!Asyst.APIv2.Form.load) {
            Asyst.APIv2.Form.load = function (params) {
                var dataId = params.dataId;
                params = $.extend({ async: true }, params);
                if (!params.dataId) {
                    params.dataId = 'new';
                }
                var success = function (data, context) {
                    data.id = dataId;

                    if (params.success)
                        params.success(data, context);
                };
                var error = params.error;
                return Asyst.protocol.send("/asyst/form/" + params.formName + "/" + params.dataId, "GET", null, params.async, success, error, null, params.headers);
            };
        }

        if (!Asyst.APIv2.Form.handlerAction) {
            Asyst.APIv2.Form.handlerAction = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/form/" + params.formName + "/" + params.handlerName + "/" + params.actionId + "/" + params.checked, "POST", params.data, params.async, params.success, params.error);
            };
        }
        
        if (!Asyst.APIv2.Form.handlerCheckRule) {
            Asyst.APIv2.Form.handlerCheckRule = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/rule/FormsRules/" + params.ruleName, "POST", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.Form.save) {
            Asyst.APIv2.Form.save = function (params) {
                params = $.extend({ async: true }, params);
                if (!params.dataId) {
                    params.dataId = 'new';
                }
                return Asyst.protocol.send("/asyst/form/" + params.formName + "/" + params.dataId, "POST", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }

        Asyst.APIv2.View ? null : Asyst.APIv2.View = {};

        if (!Asyst.APIv2.View.load) {
            Asyst.APIv2.View.load = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/view/" + params.viewName, "POST", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        Asyst.APIv2.ViewSample ? null : Asyst.APIv2.ViewSample = {};
        
        if (!Asyst.APIv2.ViewSample.save) {
            Asyst.APIv2.ViewSample.save = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/api/viewSample/" + params.viewName, "POST", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.ViewSample.load) {
            Asyst.APIv2.ViewSample.load = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/api/viewSample/" + params.viewName, "GET", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }

        if (!Asyst.APIv2.ViewSample.delete) {
            Asyst.APIv2.ViewSample.delete = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/api/viewSample/" + params.viewName, "DELETE", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        Asyst.APIv2.DataSource ? null : Asyst.APIv2.DataSource = {};

        if (!Asyst.APIv2.DataSource.load) {
            Asyst.APIv2.DataSource.load = function (params) {
                params = $.extend({ async: true, isPicklist: false }, params);
                params.headers = $.extend({ isPicklist: params.isPicklist }, params.headers);
                return Asyst.protocol.send("/asyst/datasource/" + params.sourceType + "/" + params.sourceName + "/" + params.elementName, "POST", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }


        Asyst.APIv2.Comments ? null : Asyst.APIv2.Comments = {};

        if (!Asyst.APIv2.Comments.load) {
            Asyst.APIv2.Comments.load = function (params) {
                return Asyst.protocol.send("/asyst/api/comments/" + params.entityName + "/" + params.dataId, "GET", {}, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.Comments.save) {
            Asyst.APIv2.Comments.save = function (params) {
                return Asyst.protocol.send("/asyst/api/comments/" + params.entityName + "/" + params.dataId, "POST", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }

        if (!Asyst.APIv2.Comments.delete) {
            Asyst.APIv2.Comments.delete = function (params) {
                return Asyst.protocol.send("/asyst/api/comments/" + params.entityName + "/" + params.dataId, "DELETE", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }
        if (!Asyst.APIv2.Comments.getCount) {
            Asyst.APIv2.Comments.getCount = function (params) {
                var data = {count:1, CommentId: params.commentId};
                return Asyst.protocol.send("/asyst/api/comments/" + params.entityName + "/" + params.dataId, "GET", data, params.async, params.success, params.error, null, params.headers);
            };
        }
        

        Asyst.APIv2.ChangeRequest ? null : Asyst.APIv2.ChangeRequest = {};

        if (!Asyst.APIv2.ChangeRequest.save) {
            Asyst.APIv2.ChangeRequest.save = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/api/changerequest/" + params.entityName + "/" + params.formName + "/" + params.dataId, "POST", params.data, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.ChangeRequest.agree) {
            Asyst.APIv2.ChangeRequest.agree = function (params) {
                params = $.extend({ async: true }, params);
                var data = { ActionType: "agree", ChangeRequestId: params.requestId, Comment: params.comment };
                return Asyst.protocol.send("/asyst/api/changerequest/" + params.entityName + "/" + params.formName + "/" + params.dataId, "POST", data, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.ChangeRequest.decline) {
            Asyst.APIv2.ChangeRequest.decline = function (params) {
                var data = { ActionType: "decline", ChangeRequestId: params.requestId, Comment: params.comment };
                return Asyst.protocol.send("/asyst/api/changerequest/" + params.entityName + "/" + params.formName + "/" + params.dataId, "POST", data, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.ChangeRequest.externalReviewStart) {
            Asyst.APIv2.ChangeRequest.externalReviewStart = function (params) {
                params = $.extend({ async: true }, params);
                var data = { ActionType: "externalReviewStart", ChangeRequestId: params.requestId };
                return Asyst.protocol.send("/asyst/api/changerequest/" + params.entityName + "/" + params.formName + "/" + params.dataId, "POST", data, params.async, params.success, params.error, null, params.headers);
            };
        }


        if (!Asyst.APIv2.ChangeRequest.externalReviewAgree) {
            Asyst.APIv2.ChangeRequest.externalReviewAgree = function (params) {
                params = $.extend({ async: true }, params);
                var data = { ActionType: "externalReviewAgree", ChangeRequestId: params.requestId, Issues: params.issues };
                return Asyst.protocol.send("/asyst/api/changerequest/" + params.entityName + "/" + params.formName + "/" + params.dataId, "POST", data, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.ChangeRequest.externalReviewDecline) {
            Asyst.APIv2.ChangeRequest.externalReviewDecline = function (params) {
                params = $.extend({ async: true }, params);
                var data = { ActionType: "externalReviewDecline", ChangeRequestId: params.requestId };
                return Asyst.protocol.send("/asyst/api/changerequest/" + params.entityName + "/" + params.formName + "/" + params.dataId, "POST", data, params.async, params.success, params.error, null, params.headers);
            };
        }


        Asyst.APIv2.Chat ? null : Asyst.APIv2.Chat = {};

        if (!Asyst.APIv2.Chat.addTemplate) {
            Asyst.APIv2.Chat.addTemplate = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/chat", "POST", { ActionType: 'AddTemplate', Template: params.msg }, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.Chat.sendMessage) {
            Asyst.APIv2.Chat.sendMessage = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/chat", "POST", params.msg, params.async, params.success, params.error, null, params.headers);
            };
        }

        if (!Asyst.APIv2.Chat.saveTemplates) {
            Asyst.APIv2.Chat.saveTemplates = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/chat", "POST", { ActionType: 'SaveTemplates', Templates: params.templates }, params.async, params.success, params.error, null , params.headers);
            };
        }
        
        if (!Asyst.APIv2.Chat.getTemplates) {
            Asyst.APIv2.Chat.getTemplates = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/chat", "GET", { ActionType: 'GetTemplates' }, params.async, params.success, params.error, null, params.headers);
            };
        }

        Asyst.APIv2.Phase ? null : Asyst.APIv2.Phase = {};


        if (!Asyst.APIv2.Phase.moveNext) {
            Asyst.APIv2.Phase.moveNext = function (params) {
                params = $.extend({ async: true }, params);
                var sendData = { SourcePointId: params.data.SourcePointId, ActionType: params.data.ActionType };
                return Asyst.protocol.send("/asyst/phase/" + params.entityName + "/" + params.activityId, "POST", sendData, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.Phase.movePrev) {
            Asyst.APIv2.Phase.movePrev = function (params) {
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/phase/" + params.entityName + "/" + params.activityId, "POST", { ActionType: 'prev' }, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.Phase.check) {
            Asyst.APIv2.Phase.check = function (params) {
                params = $.extend({ async: true }, params);
                var sendData = { SourcePointId: params.data.SourcePointId, ActionType: 'check' };
                return Asyst.protocol.send("/asyst/phase/" + params.entityName + "/" + params.activityId, "POST", sendData, params.async, params.success, params.error);
            };
        }
        

        Asyst.APIv2.DataSet ? null : Asyst.APIv2.DataSet = {};

        if (!Asyst.APIv2.DataSet.load) {
            Asyst.APIv2.DataSet.load = function (params) {
                params = $.extend({ async: true }, params);
                var success = function(datasets) {
                    if (datasets && params.success !== undefined && params.success !== null) {
                        var newArgs = [datasets];
                        for (var i = 0; i < datasets.length; i++) {
                            newArgs.push(datasets[i]);
                        }
                        params.success.apply(this, newArgs);
                    }
                };
                return Asyst.protocol.send('/asyst/api/dataset/' + params.name, "POST", params.data, params.async, success, params.error);
            };
        }
        

        Asyst.APIv2.Document ? null : Asyst.APIv2.Document = {};

        if (!Asyst.APIv2.Document.getFiles) {
            Asyst.APIv2.Document.getFiles = function (params) {
                //POST - чтобы передать нормальной длинный параметр data
                var thinData = Asyst.protocol.thiningData(params.data, true);
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/api/file/getFilesInfo/", "POST", thinData, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.Document.deleteFile) {
            Asyst.APIv2.Document.deleteFile = function (params) {
                var thinData = Asyst.protocol.thiningData(params.data, true);
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send("/asyst/api/file/delete/", "POST", thinData, params.async, params.success, params.error, null, params.headers);
            };
        }
        
        if (!Asyst.APIv2.Document.getInfo) {
            Asyst.APIv2.Document.getInfo = function (params) {
                var thinData = Asyst.protocol.thiningData(params.data, true);
                params = $.extend({ async: true }, params);
                return Asyst.protocol.send('/asyst/api/file/getFileInfo/', 'POST', thinData, params.async, params.success, params.error, null, params.headers);
            };
        }

        if (!Asyst.APIv2.Document.getTagsInfo) {
            Asyst.APIv2.Document.getTagsInfo = function (params) {
                return Asyst.protocol.send('/asyst/api/file/getTagsInfo/', 'POST', {}, params.async, params.success, params.error, null , params.headers);
            };
        }

        if (!Asyst.APIv2.Document.saveLink) {
            Asyst.APIv2.Document.saveLink = function (params) {
                var thinData = Asyst.protocol.thiningData(params.data, true);
                return Asyst.protocol.send('/asyst/api/file/saveLink/', 'POST', thinData, params.async, params.success, params.error, null, params.headers);
            };
        }

        /* ==============================================
        ============ С Т А Р О Е    A P I  ==============
        =================================================
        */


        if (!Asyst.API) {
            Asyst.API = {};
        }

        if (!Asyst.API.Entity)
            Asyst.API.Entity = {};

        if (typeof Asyst.API.Entity.load !== 'function') {
            Asyst.API.Entity.load = function (className, id, callback, error, isAccessNeed, headers) {
                return Asyst.APIv2.Entity.load({ entityName: className, dataId: id, success: callback, error: error, isAccessNeed: isAccessNeed, headers: headers, async: false });
                /*if (!isAccessNeed)
                    isAccessNeed = false;
                var callData = { isAccessNeed: isAccessNeed };
                var key = id;
                if (!key)
                    key = "new";

                var success = function (data, context) {
                    data.id = id;

                    if (callback)
                        callback(data, context);
                };

                var errorCallback = function (message, info, context) {
                    if (error) {
                        error(message, info, context);
                    }
                };

                return Asyst.protocol.send("/asyst/entity/" + className + "/" + key, "GET", callData, false, success, errorCallback, this, headers);*/
            };
        }

        if (typeof Asyst.API.getCurrentUser !== 'function') {
            Asyst.API.getCurrentUser = function () {
                if (!window.userId)
                    Asyst.protocol.send("/asyst/entity/User/0", "GET", undefined, false, function (data, context) {
                        window.userId = data["__userid__"];
                        window.userAccount = data["__useraccount__"];
                    }, null, this);
            };
        }

        if (typeof Asyst.API.Entity.save !== 'function') {
            Asyst.API.Entity.save = function (className, id, data, success, error, headers) {
                return Asyst.APIv2.Entity.save({ entityName: className, dataId: id, data: data, success: success, error: error, headers: headers, async: false });
                /*var key = id;
                if (!key)
                    key = "new";
                return Asyst.protocol.send("/asyst/entity/" + className + "/" + key, "POST", data, false, success, error, this, headers);*/
            };
        }

        if (typeof Asyst.API.Entity.remove !== 'function') {
            Asyst.API.Entity.remove = function (className, id, success, error) {
                return Asyst.APIv2.Entity.delete({ entityName: className, dataId: id, success: success, error: error, async: false });
                /*var key = id;
                if (!key)
                    key = "new";
                return Asyst.protocol.send("/asyst/entity/" + className + "/" + key, "DELETE", null, false, success, error, this);*/
            };
        }

        if (!Asyst.API.Form)
            Asyst.API.Form = {};

        if (typeof Asyst.API.Form.load !== 'function') {
            Asyst.API.Form.load = function (formName, id, callback, error) {
                return Asyst.APIv2.Form.load({ formName: formName, dataId: id, success: callback, error: error, async: false });
                /*
                var key = id;
                if (!key)
                    key = "new";

                var success = function (data, context) {
                    data.id = id;

                    if (callback)
                        callback(data, context);
                };

                var errorCallback = function (message, info, context) {
                    if (error) {
                        error(message, info, context);
                    }
                };

                return Asyst.protocol.send("/asyst/form/" + formName + "/" + key, "GET", undefined, false, success, errorCallback, this);*/
            };
        }

        if (typeof Asyst.API.Form.handlerAction !== 'function') {
            Asyst.API.Form.handlerAction = function (formName, handlerName, actionId, checked, data, async, success, error) {
                if (async === null || async === undefined) async = this; 
                return Asyst.APIv2.Form.handlerAction({ formName: formName, handlerName: handlerName, actionId: actionId, checked: checked, data: data, async: async, success: success, error: error });
                /*if (async === null || async === undefined) async = this; //wtf!?
                return Asyst.protocol.send("/asyst/form/" + formName + "/" + handlerName + "/" + actionId + "/" + checked, "POST", data, async, success, error);*/
            };
        }

        if (typeof Asyst.API.Form.handlerCheckRule !== 'function') {
            Asyst.API.Form.handlerCheckRule = function (ruleName, data) {
                return Asyst.APIv2.Form.handlerCheckRule({ ruleName: ruleName, data: data, async: false });
                //return Asyst.protocol.get("/asyst/rule/FormsRules/" + ruleName, "POST", data, this);
            };
        }

        if (typeof Asyst.API.Form.save !== 'function') {
            Asyst.API.Form.save = function (formName, id, data, success, error, async) {
                if (typeof async == 'undefined') async = false;
                return Asyst.APIv2.Form.save({ formName: formName, dataId: id, data: data, success: success, error: error, async: async });
                /*var key = id;
                if (!key)
                    key = "new";
                if (async === null || async === undefined) async = false;
                return Asyst.protocol.send("/asyst/form/" + formName + "/" + key, "POST", data, async, success, error, this);*/
            };
        }

        Asyst.API.Form.Batch = function (formName) {
            this.FormName = formName;
            this.DataPacket = { "__packet__": [] };
        };

        Asyst.API.Form.Batch.prototype.add = function (id, data) {
            var key = id;
            if (!key)
                key = "new";
            this.DataPacket.__packet__.push({ "id": key, "data": data });
        };

        Asyst.API.Form.Batch.prototype.save = function (success, error, async) {
            return Asyst.API.Form.save(this.FormName, "", this.DataPacket, success, error, async);
        };

        if (!Asyst.API.View)
            Asyst.API.View = {};

        if (typeof Asyst.API.View.load !== 'function') {
            Asyst.API.View.load = function (viewName, data, success, error, sync) {
                if (typeof sync == 'undefined') sync = true;
                return Asyst.APIv2.View.load({ viewName: viewName, data: data, success: success, error: error, async: !sync });
                /*if (typeof sync == 'undefined') sync = true;
                return Asyst.protocol.send("/asyst/view/" + viewName, "POST", data, !sync, success, error, this);*/
            };
        }

        if (typeof Asyst.API.View.loadSample !== 'function') {
            Asyst.API.View.loadSample = function (viewName, data, success, error, sync) {
                if (sync == undefined) sync = true;
                return Asyst.APIv2.ViewSample.load({ viewName: viewName, data: data, async: !sync, success: success, error: error });
                /*if (typeof sync == 'undefined') sync = true;
                return Asyst.protocol.send("/asyst/api/viewSample/" + viewName, "GET", data, !sync, success, error, this);*/
            };
        }
        if (typeof Asyst.API.View.saveSample !== 'function') {
            Asyst.API.View.saveSample = function (viewName, data, success, error, sync) {
                if (sync == undefined) sync = true;
                return Asyst.APIv2.ViewSample.save({ viewName: viewName, data: data, async: !sync, success: success, error: error });
                /*if (typeof sync == 'undefined') sync = true;
                return Asyst.protocol.send("/asyst/api/viewSample/" + viewName, "POST", data, !sync, success, error, this);*/
            };
        }
        
        if (typeof Asyst.API.View.deleteSample !== 'function') {
            Asyst.API.View.deleteSample = function (viewName, data, success, error, sync) {
                if (sync == undefined) sync = true;
                return Asyst.APIv2.ViewSample.delete({ viewName: viewName, data: data, success: success, error: error, async: !sync });
                /*if (typeof sync == 'undefined') sync = true;
                return Asyst.protocol.send("/asyst/api/viewSample/" + viewName, "DELETE", data, !sync, success, error, this);*/
            };
        }


        if (!Asyst.API.Picklist)
            Asyst.API.Picklist = {};

        if (typeof Asyst.API.Picklist.load !== 'function') {
            Asyst.API.Picklist.load = function (sourceType, sourceName, elementName, data, success, error, sync) {
                return Asyst.APIv2.DataSource.load({ sourceType: sourceType, sourceName: sourceName, elementName: elementName, data: data, success: success, error: error, async: !sync, isPicklist: true });
                
                /* вроде сейчас не нужен. отключена проверка на web.config
                {//todo мегакостыль!!! убираем content, т.к. там может быть неэкранированный html, на который сильно плачет ASP
                    data = JSON.parse(JSON.stringify(data));
                    if (data !== undefined && data !==null && data.hasOwnProperty("Content"))
                        delete data.Content;
                }*/
                
                //return Asyst.protocol.send("/asyst/picklist/" + sourceType + "/" + sourceName + "/" + elementName, "POST", data, !sync, success, error, this);
            };
        }

        if (!Asyst.API.DataSource)
            Asyst.API.DataSource = {};

        if (typeof Asyst.API.DataSource.load !== 'function') {
            Asyst.API.DataSource.load = function (sourceType, sourceName, elementName, data, success, error, sync) {
                return Asyst.APIv2.DataSource.load({ sourceType: sourceType, sourceName: sourceName, elementName: elementName, data: data, success: success, error: error, async: !sync, isPicklist:false });
                /*return Asyst.protocol.send("/asyst/datasource/" + sourceType + "/" + sourceName + "/" + elementName, "POST", data, !sync, success, error, this);*/
            };
        }


        if (!Asyst.API.Comments)
            Asyst.API.Comments = {};

        if (typeof Asyst.API.Comments.GetAll !== 'function') {
            Asyst.API.Comments.GetAll = function (entityName, dataId, success, error, sync) {
                return Asyst.APIv2.Comments.load({ entityName: entityName, dataId: dataId, success: success, error: error, async: !sync });
                /*var data = {};
                return Asyst.protocol.send("/asyst/api/comments/" + entityName + "/" + entityID, "GET", data, !sync, success, error, this);*/
            };
        }
        if (typeof Asyst.API.Comments.SaveComment !== 'function') {
            Asyst.API.Comments.SaveComment = function (entityName, dataId, data, success, error, sync) {
                return Asyst.APIv2.Comments.save({ entityName: entityName, dataId: dataId, data: data, success: success, error: error, async: !sync });
                //return Asyst.protocol.send("/asyst/api/comments/" + entityName + "/" + entityID, "POST", data, !sync, success, error, this);
                        
            };
        }

        if (typeof Asyst.API.Comments.DeleteComment !== 'function') {
            Asyst.API.Comments.DeleteComment = function (entityName, dataId, data, success, error, sync) {
                return Asyst.APIv2.Comments.delete({ entityName: entityName, dataId: dataId, data: data, success: success, error: error, async: !sync });
                //return Asyst.protocol.send("/asyst/api/comments/" + entityName + "/" + entityID, "DELETE", data, !sync, success, error, this);
                       
            };
        }
        if (typeof Asyst.API.Comments.GetCount !== 'function') {
            Asyst.API.Comments.GetCount = function (entityName, dataId, commentId, success, error, sync) {
                return Asyst.APIv2.Comments.getCount({ entityName: entityName, dataId: dataId, commentId: commentId, success: success, error: error, async: !sync });
                /*var data = {};
                data.count = 1;
                data.CommentId = commentId;
                return Asyst.protocol.send("/asyst/api/comments/" + entityName + "/" + entityID, "GET", data, !sync, success, error, this);*/
            };
        }

        if (!Asyst.ChangeRequest) {
            Asyst.ChangeRequest = { showCard: true, Storage: {} };
        }
        if (!Asyst.API.ChangeRequest)
            Asyst.API.ChangeRequest = {};

        if (typeof Asyst.API.ChangeRequest.save !== 'function') {
            Asyst.API.ChangeRequest.save = function (entityName, formName, id, data, success, error) {
                return Asyst.APIv2.ChangeRequest.save({ entityName: entityName, formName: formName, dataId: id, data: data, success: success, error: error, async: false });
            };
        }

        if (typeof Asyst.API.ChangeRequest.agree !== 'function') {
            Asyst.API.ChangeRequest.agree = function (entityName, formName, dataId, requestId, comment, success, error) {
                return Asyst.APIv2.ChangeRequest.agree({ entityName: entityName, formName: formName, dataId: dataId, requestId: requestId, comment: comment, success: success, error: error, async: false });
                //return Asyst.protocol.send("/asyst/api/changerequest/" + entityName + "/" + formName + "/" + id, "POST", { ActionType: "agree", ChangeRequestId: requestId, Comment: comment }, false, success, error, this);
            };
        }

        if (typeof Asyst.API.ChangeRequest.decline !== 'function') {
            Asyst.API.ChangeRequest.decline = function (entityName, formName, dataId, requestId, comment, success, error) {
                return Asyst.APIv2.ChangeRequest.decline({ entityName: entityName, formName: formName, dataId: dataId, requestId: requestId, comment: comment, success: success, error: error, async:false });
                //return Asyst.protocol.send("/asyst/api/changerequest/" + entityName + "/" + formName + "/" + id, "POST", { ActionType: "decline", ChangeRequestId: requestId, Comment: comment }, false, success, error, this);
            };
        }

        if (typeof Asyst.API.ChangeRequest.externalReviewStart !== 'function') {
            Asyst.API.ChangeRequest.externalReviewStart = function (entityName, formName, dataId, requestId, success, error) {
                return Asyst.APv2.ChangeRequest.externalReviewStart({ entityName: entityName, formName: formName, dataId: dataId, requestId: requestId, success: success, error: error, async: false });
                //return Asyst.protocol.send("/asyst/api/changerequest/" + entityName + "/" + formName + "/" + dataId, "POST", { ActionType: "externalReviewStart", ChangeRequestId: requestId }, false, success, error, this);
            };
        }

        if (typeof Asyst.API.ChangeRequest.externalReviewAgree !== 'function') {
            Asyst.API.ChangeRequest.externalReviewAgree = function (entityName, formName, dataId, requestId, success, error) {
                return Asyst.APIv2.ChangeRequest.externalReviewAgree({ entityName: entityName, formName: formName, dataId: dataId, requestId: requestId, success: success, error: error, async: false });
                //return Asyst.protocol.send("/asyst/api/changerequest/" + entityName + "/" + formName + "/" + dataId, "POST", { ActionType: "externalReviewAgree", ChangeRequestId: requestId }, false, success, error, this);
            };
        }

        if (typeof Asyst.API.ChangeRequest.externalReviewAgreeWithIssues !== 'function') {
            Asyst.API.ChangeRequest.externalReviewAgreeWithIssues = function (entityName, formName, dataId, requestId, success, error) {
                return Asyst.APIv2.ChangeRequest.externalReviewAgree({ entityName: entityName, formName: formName, dataId: dataId, requestId: requestId, issues: true, success: success, error: error, async: false });
                //return Asyst.protocol.send("/asyst/api/changerequest/" + entityName + "/" + formName + "/" + dataId, "POST", { ActionType: "externalReviewAgree", ChangeRequestId: requestId, Issues: true }, false, success, error, this);
            };
        }

        if (typeof Asyst.API.ChangeRequest.externalReviewDecline !== 'function') {
            Asyst.API.ChangeRequest.externalReviewDecline = function (entityName, formName, dataId, requestId, success, error) {
                return Asyst.APIv2.ChangeRequest.externalReviewAgree({ entityName: entityName, formName: formName, dataId: dataId, requestId: requestId, success: success, error: error, async: false });
                //return Asyst.protocol.send("/asyst/api/changerequest/" + entityName + "/" + formName + "/" + dataId, "POST", { ActionType: "externalReviewDecline", ChangeRequestId: requestId }, false, success, error, this);
            };
        }

        if (!Asyst.API.Chat)
            Asyst.API.Chat = {};

        if (typeof Asyst.API.Chat.addTemplate !== 'function') {
            Asyst.API.Chat.addTemplate = function (msg, success, error) {
                return Asyst.APIv2.Chat.addTemplate({ msg: msg, success: success, error: error, async: true });
                //return Asyst.protocol.send("/asyst/chat", "POST", { ActionType: 'AddTemplate', Template: msg }, true, success, error, this);
            };
        }

        if (typeof Asyst.API.Chat.sendMessage !== 'function') {
            Asyst.API.Chat.sendMessage = function (msg, success, error) {
                return Asyst.APIv2.Chat.sendMessage({ msg: msg, success: success, error: error, async: true });
                //return Asyst.protocol.send("/asyst/chat", "POST", msg, true, success, error, this);
            };
        }

        if (typeof Asyst.API.Chat.saveTemplates !== 'function') {
            Asyst.API.Chat.saveTemplates = function (templates, success, error) {
                return Asyst.APIv2.Chat.saveTemplates({ templates: templates, success: success, error: error, async: true });
                //return Asyst.protocol.send("/asyst/chat", "POST", { ActionType: 'SaveTemplates', Templates: templates }, true, success, error, this);
            };
        }

        if (typeof Asyst.API.Chat.getTemplates !== 'function') {
            Asyst.API.Chat.getTemplates = function (success, error) {
                return Asyst.APIv2.Chat.getTemplates({ success: success, error: error });
                //return Asyst.protocol.send("/asyst/chat", "GET", { ActionType: 'GetTemplates' }, true, success, error, this);
            };
        }


        if (!Asyst.API.Phase)
            Asyst.API.Phase = {};

        if (typeof Asyst.API.Phase.moveNext !== 'function') {
            Asyst.API.Phase.moveNext = function (entityName, activityId, data, async, success, error) {
                return Asyst.APIv2.Phase.moveNext({ entityName: entityName, activityId: activityId, data: data, async: async, success:success, error: error});
                /*
                var sendData = {};
                if (data.hasOwnProperty("SourcePointId")) {
                    sendData.SourcePointId = data.SourcePointId;
                }
                if (data.hasOwnProperty("ActionType")) {
                    sendData.ActionType = data.ActionType;
                }
                return Asyst.protocol.send("/asyst/phase/" + entityName + "/" + activityId, "POST", sendData, async, success, error, this);*/
            };
        }

        if (typeof Asyst.API.Phase.movePrev !== 'function') {
            Asyst.API.Phase.movePrev = function (entityName, activityId, success, error) {
                return Asyst.APIv2.Phase.movePrev({ entityName: entityName, activityId: activityId, success: success, error: error, async: false });
                //return Asyst.protocol.send("/asyst/phase/" + entityName + "/" + activityId, "POST", { ActionType: 'prev' }, false, success, error, this);
            };
        }

        //не найдено использования. К переработке
        //if (typeof Asyst.API.Phase.moveByPoint !== 'function') {
        //    Asyst.API.Phase.moveByPoint = function (id) {
        //        return Asyst.protocol.send("/asyst/phase/Point/" + id, "POST", { ActionType: 'point' });
        //    };
        //}

        //не найдено использования. К переработке
        //if (typeof Asyst.API.Phase.checkPoint !== 'function') {
        //    Asyst.API.Phase.checkPoint = function (entityName, id, pointId, success, error) {
        //        return Asyst.protocol.send("/asyst/phase/" + entityName + "/" + id, "POST", { ActionType: 'checkPoint', SourcePointId: pointId }, false, success, error);
        //    };
        //}

        if (typeof Asyst.API.Phase.check !== 'function') {
            Asyst.API.Phase.check = function (entityName, activityId, data, async, success, error) {
                return Asyst.APIv2.Phase.check({ entityName: entityName, activityId: activityId, data: data, async: async, success: success, error: error });
                /*
                var sendData = {};
                if (data.hasOwnProperty("SourcePointId")) {
                    sendData.SourcePointId = data.SourcePointId;
                }
                sendData.ActionType = 'check';
                return Asyst.protocol.send("/asyst/phase/" + entityName + "/" + id, "POST", sendData, async, success, error);*/
            };
        }

        if (!Asyst.API.Document)
            Asyst.API.Document = {};

        /*if (typeof Asyst.API.Document.getFiles !== 'function') {
            Asyst.API.Document.getFiles = function (data, async, success, error) {
                //POST - чтобы передать нормальной длинный параметр data
                return Asyst.protocol.send("/asyst/api/document/", "POST", data, async, success, error, this);
            };
        }*/
        if (typeof Asyst.API.Document.getFiles !== 'function') {
            Asyst.API.Document.getFiles = function (data, async, success, error) {
                return Asyst.APIv2.Document.getFiles({ data: data, async: async, success: success, error: error });
                /*//POST - чтобы передать нормальной длинный параметр data
                var thinData = Asyst.protocol.thiningData(data, true);
                return Asyst.protocol.send("/asyst/api/file/getFilesInfo/", "POST", thinData, async, success, error, this);*/
            };
        }

        if (typeof Asyst.API.Document.deleteFile !== 'function') {
            Asyst.API.Document.deleteFile = function (data, async, success, error) {
                return Asyst.APIv2.Document.deleteFile({data:data, async: async, success: success, error: error});
                /*
                var thinData = Asyst.protocol.thiningData(data, true);
                return Asyst.protocol.send("/asyst/api/file/delete/", "POST", thinData, async, success, error, this);*/
            };
        }

        if (typeof Asyst.API.Document.getInfo !== 'function') {
            Asyst.API.Document.getInfo = function (data, async, success, error) {
                return Asyst.APIv2.Document.getInfo({data:data, async: async, success:success, error:error});
                /*var thinData = Asyst.protocol.thiningData(data, true);
                return Asyst.protocol.send('/asyst/api/file/getFileInfo/', 'POST', thinData, async, success, error);*/
            };
        }
        
        if (typeof Asyst.API.Document.getTagsInfo !== 'function') {
            Asyst.API.Document.getTagsInfo = function (data, async, success, error) {
                return Asyst.APIv2.Document.getTagsInfo({ async: async, success: success, error: error });
                //return Asyst.protocol.send('/asyst/api/file/getTagsInfo/', 'POST', {}, async, success, error);
            };
        }
        
        if (typeof Asyst.API.Document.saveLink !== 'function') {
            Asyst.API.Document.saveLink = function (data, async, success, error) {
                return Asyst.APIv2.Document.saveLink({ data: data, async: async, success: success, error: error });
                /*var thinData = Asyst.protocol.thiningData(data, true);
                return Asyst.protocol.send('/asyst/api/file/saveLink/', 'POST', thinData, async, success, error);*/
            };
        }


        if (!Asyst.API.DataSet)
            Asyst.API.DataSet = {};

        if (typeof Asyst.API.DataSet.load !== 'function') {
            Asyst.API.DataSet.load = function (name, data, async, success, error) {
                return Asyst.APIv2.DataSet.load({ name: name, data: data, async: async, success: success, error: error });
                /*if (async === undefined) async = false;
                return Asyst.protocol.send('/asyst/api/dataset/' + name, "POST", data, async, function (dataset) {
                    if (dataset && success !== undefined && success !== null) {
                        var newArgs = [dataset];
                        for (var i = 0; i < dataset.length; i++) {
                            newArgs.push(dataset[i]);
                        }
                        success.apply(this, newArgs);
                    }
                }, error);*/
            };
        }

        // AdminTools
        if (!Asyst.API.AdminTools)
            Asyst.API.AdminTools = {};

        //if (typeof Asyst.API.AdminTools.update !== 'function') {
        //    Asyst.API.AdminTools.update = function (data, async, success, error) {
        //        return Asyst.protocol.send("/asyst/api/admin/update", "POST", data, async, success, error, this);
        //    };
        //}
        if (typeof Asyst.API.AdminTools.saveStats !== 'function') {
            Asyst.API.AdminTools.saveStats = function (data, async, success, error) {
                return Asyst.protocol.send("/asyst/api/admin/saveStats", "POST", data, async, success, error, this);
            };
        }
        if (typeof Asyst.API.AdminTools.reset !== 'function') {
            Asyst.API.AdminTools.reset = function () {
                Globa.getTranslationTable();
                return Asyst.protocol.send("/asyst/api/admin/reset", "POST", {}, true, null, null, this);
            };
        }

        if (typeof Asyst.API.AdminTools.getZimbarList !== 'function') {
            Asyst.API.AdminTools.getZimbarList = function (async, callback) {
                if (async === undefined || async === null) async = false;
                return Asyst.protocol.send("/asyst/api/admin/getZimbarList", "POST", {}, async, callback, null, this);
            };
        }
        
        if (typeof Asyst.API.AdminTools.logout !== 'function') {
            Asyst.API.AdminTools.logout = function (isUserLocked) {
                var success = function () {
                    var newLocation = isUserLocked ? "/asyst/anon/userLocked.html" : "/asyst/logout.html";
                    var redirFunc = function () {
                        location.href = newLocation;
                    };
                    document.execCommand("ClearAuthenticationCache");
                    location.href = newLocation;
                    $.ajax({
                        // This can be any path on your same domain which requires HTTPAuth
                        url: '/asyst/api/admin/logout2',
                        type: 'POST',
                        async: false,
                        username: 'reset',
                        password: 'reset',
                        success: redirFunc,
                        error: redirFunc,
                        // If the return is 401, refresh the page to request new details.
                        statusCode: {
                            401: redirFunc
                        }
                    });
                };
                Asyst.protocol.zimbar.clearZimbar();
                $.ajax({
                    url: '/asyst/api/admin/logout',
                    type: 'POST',
                    async: false,
                    success: success,
                    error: success,
                    username: 'reset',
                    password: 'reset',
                    statusCode: {
                        401: success
                    }
                });
            };
        }

        if (typeof Asyst.API.AdminTools.getCurrentUser !== 'function') {
            Asyst.API.AdminTools.getCurrentUser = function (async, success, error) {
                if (async == undefined) async = false;
                return Asyst.protocol.send("/asyst/api/admin/getCurrentUser", "POST", null, async, success, error, this);
            };
        }

        if (typeof Asyst.API.AdminTools.setNewPassword !== 'function') {
            Asyst.API.AdminTools.setNewPassword = function (userId, password) {
                return Asyst.protocol.send("/asyst/api/admin/setNewPassword", "POST", { userId: userId, password: password }, false, null, null, this);
            };
        }


        if (typeof Asyst.API.AdminTools.LogType !== "object") {
            Asyst.API.AdminTools.LogType = {
                Error: "Error",
                Information: "Information",
                Warning: "Warning",
                Debug: "Debug"
            }
        }
        if (typeof Asyst.API.AdminTools.appendLog !== 'function') {
            Asyst.API.AdminTools.appendLog = function (options, error) {
                return Asyst.protocol.send("/asyst/api/admin/appendLog", "POST", options, true, null, error, this);
            };
        }

    }
    // ----------------------------------------------------------------------------
    // Даты
    // ----------------------------------------------------------------------------
    
    if (!Asyst.date) {
        Asyst.date = {};
    }
    
    //Asyst.date.monthNames = new Array('Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь');
    //Asyst.date.shortMonthNames = new Array('Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек');
    //Asyst.date.dayNames = new Array('Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота');
    //Asyst.date.shortDayNames = new Array('Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб');
    
    Asyst.date.monthNames = new Array(Globa.January.locale(), Globa.February.locale(), Globa.March.locale(), Globa.April.locale(),
                                      Globa.May.locale(), Globa.June.locale(), Globa.Jule.locale(), Globa.August.locale(),
                                      Globa.September.locale(), Globa.October.locale(), Globa.November.locale(), Globa.December.locale());
    Asyst.date.shortMonthNames = new Array(Globa.January3.locale(), Globa.February3.locale(), Globa.March3.locale(), Globa.April3.locale(),
                                           Globa.May3.locale(), Globa.June3.locale(), Globa.Jule3.locale(), Globa.August3.locale(),
                                           Globa.September3.locale(), Globa.October3.locale(), Globa.November3.locale(), Globa.December3.locale());
    Asyst.date.dayNames = new Array(Globa.Sunday.locale(), Globa.Monday.locale(), Globa.Tuesday.locale(),Globa.Wednesday.locale(), 
                                    Globa.Thursday.locale(), Globa.Friday.locale(), Globa.Saturday.locale());
    Asyst.date.shortDayNames = new Array(Globa.Sunday2.locale(), Globa.Monday2.locale(), Globa.Tuesday2.locale(), Globa.Wednesday2.locale(),
                                    Globa.Thursday2.locale(), Globa.Friday2.locale(), Globa.Saturday2.locale());
    
    Asyst.date.startOfWeek = 1;
    Asyst.date.defaultFormat = 'dd.MM.yyyy';
    Asyst.date.defaultDateFormat = 'dd.MM.yyyy';
    Asyst.date.defaultTimeFormat = 'HH:mm';
    Asyst.date.defaultDateTimeFormat = Asyst.date.defaultDateFormat + ' ' + Asyst.date.defaultTimeFormat;
    

    function LZ(x) { return (x < 0 || x > 9 ? "" : "0") + x; }

    Asyst.date.isDate = function (val, format) {
        var date = Asyst.date.parse(val, format);
        if (date === 0) { return false; }
        return true;
    };

    Asyst.date.compare = function (date1, dateformat1, date2, dateformat2) {
        var d1 = Asyst.date.parse(date1, dateformat1);
        var d2 = Asyst.date.parse(date2, dateformat2);
        if (d1 === 0 || d2 === 0) {
            return -1;
        }
        else if (d1 > d2) {
            return 1;
        }
        return 0;
    };

    Asyst.date.ajustToDay = function(datetime) {
        if ((datetime.getHours() * 60 + datetime.getMinutes() + datetime.getTimezoneOffset()) % (60 * 24) !== 0) {
            return new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000);
        } else return new Date(datetime);
    };

    Asyst.date.ajustToUtc = function (datetime) {
        if (datetime === undefined || datetime.constructor !== Date) return datetime;

        var newDate = new Date(datetime.getTime() + datetime.getTimezoneOffset() * 60000);
        if (newDate.getFullYear() == datetime.getFullYear())
            return newDate;
        else {
            return new Date(date.getTime() + (date.getTimezoneOffset() + 60) * 60000);
        }
    };

    Asyst.date.addDay = function (datetime, count){
        if (datetime === undefined || datetime.constructor !== Date) return datetime;

        return new Date(datetime - 0 + 86400000 * count);
    }

    Asyst.date.format = function (date, format, adjustUtc) {
        if (!date)
            return "";

        if (adjustUtc) {
            var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            if (newDate.getFullYear()==date.getFullYear())
                date = newDate;
            else {
                date = new Date(date.getTime() + (date.getTimezoneOffset()+60) * 60000);
            }
        }

        if (!format)
            format = this.defaultFormat;

        var result = "";
        var i_format = 0;
        var c = "";
        var token = "";
        var y = date.getYear() + "";
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var E = date.getDay();
        var H = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, KK, K, kk, k;
        // Convert real date parts into formatted versions
        var value = {};
        if (y.length < 4) { y = "" + (y - 0 + 1900); }
        value["y"] = "" + y;
        value["yyyy"] = y;
        value["yy"] = y.substring(2, 4);
        value["M"] = M;
        value["MM"] = LZ(M);
        value["MMM"] = Asyst.date.shortMonthNames[M - 1];
        value["MMMM"] = Asyst.date.monthNames[M - 1];
        value["d"] = d;
        value["dd"] = LZ(d);
        value["W"] = Asyst.date.shortDayNames[E];
        value["WW"] = Asyst.date.dayNames[E];
        value["H"] = H;
        value["HH"] = LZ(H);
        if (H === 0) { value["h"] = 12; }
        else if (H > 12) { value["h"] = H - 12; }
        else { value["h"] = H; }
        value["hh"] = LZ(value["h"]);
        if (H > 11) { value["K"] = H - 12; } else { value["K"] = H; }
        value["k"] = H + 1;
        value["KK"] = LZ(value["K"]);
        value["kk"] = LZ(value["k"]);
        if (H > 11) { value["a"] = "PM"; }
        else { value["a"] = "AM"; }
        value["m"] = m;
        value["mm"] = LZ(m);
        value["s"] = s;
        value["ss"] = LZ(s);
        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (value[token] != null) { result = result + value[token]; }
            else { result = result + token; }
        }
        return result;
    };

    // ------------------------------------------------------------------
    // Utility functions for parsing in Asyst.date.parse()
    // ------------------------------------------------------------------
    function _isInteger(val) {
        var digits = "1234567890";
        for (var i = 0; i < val.length; i++) {
            if (digits.indexOf(val.charAt(i)) == -1) { return false; }
        }
        return true;
    }
    function _getInt(str, i, minlength, maxlength) {
        for (var x = maxlength; x >= minlength; x--) {
            var token = str.substring(i, i + x);
            if (token.length < minlength) { return null; }
            if (_isInteger(token)) { return token; }
        }
        return null;
    }

    Asyst.date.validate = function(val) {
        if (val === undefined) return false;
        if (val == 0) return false;
        return true;
    };

    Asyst.date.parse = function (val, format) {
        if (!val)
            return null;

        if (!format)
            format = this.defaultFormat;

        val = val + "";
        format = format + "";
        var i;
        var r;
        var i_val = 0;
        var i_format = 0;
        var c = "";
        var token = "";
        var token2 = "";
        var x, y;
        var now = new Date();
        var year = now.getYear();
        var month = now.getMonth() + 1;
        var date = 1;
        var hh = 0;
        var mm = 0;
        var ss = 0;
        var ampm = "";
        var day_name;
        var month_name;

        while (i_format < format.length) {
            // Get next token from format string
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token == "yyyy" || token == "yy" || token == "y") {
                if (token == "yyyy") { x = 4; y = 4; }
                if (token == "yy") { x = 2; y = 2; }
                if (token == "y") { x = 2; y = 4; }
                year = _getInt(val, i_val, x, y);
                if (year == null) { return 0; }
                i_val += year.length;
                if (year.length === 2) {
                    if (year > 70) { year = 1900 + (year - 0); }
                    else { year = 2000 + (year - 0); }
                }
            }
            else if (token == "MMM") {
                month = 0;
                for (i = 0; i < Asyst.date.shortMonthNames.length; i++) {
                    month_name = Asyst.date.shortMonthNames[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        month = i + 1;
                        if (month > 12) { month -= 12; }
                        i_val += month_name.length;
                        break;
                    }
                }
                if ((month < 1) || (month > 12)) { return 0; }
            }
            else if (token == "MMMM") {
                month = 0;
                for (i = 0; i < Asyst.date.monthNames.length; i++) {
                    month_name = Asyst.date.monthNames[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        month = i + 1;
                        if (month > 12) { month -= 12; }
                        i_val += month_name.length;
                        break;
                    }
                }
                if ((month < 1) || (month > 12)) { return 0; }
            }
            else if (token == "WW") {
                for (i = 0; i < Asyst.date.dayNames.length; i++) {
                    day_name = Asyst.date.dayNames[i];
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            }
            else if (token == "W") {
                for (i = 0; i < Asyst.date.shortDayNames.length; i++) {
                    day_name = Asyst.date.shortDayNames[i];
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            }
            else if (token == "MM" || token == "M") {
                month = _getInt(val, i_val, token.length, 2);
                if (month == null || (month < 1) || (month > 12)) { return 0; }
                i_val += month.length;
            }
            else if (token == "dd" || token == "d") {
                date = _getInt(val, i_val, token.length, 2);
                if (date == null || (date < 1) || (date > 31)) { return 0; }
                i_val += date.length;
            }
            else if (token == "hh" || token == "h") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 12)) { return 0; }
                i_val += hh.length;
            }
            else if (token == "HH" || token == "H") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 23)) { return 0; }
                i_val += hh.length;
            }
            else if (token == "KK" || token == "K") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 11)) { return 0; }
                i_val += hh.length;
            }
            else if (token == "kk" || token == "k") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 24)) { return 0; }
                i_val += hh.length; hh--;
            }
            else if (token == "mm" || token == "m") {
                mm = _getInt(val, i_val, token.length, 2);
                if (mm == null || (mm < 0) || (mm > 59)) { return 0; }
                i_val += mm.length;
            }
            else if (token == "ss" || token == "s") {
                ss = _getInt(val, i_val, token.length, 2);
                if (ss == null || (ss < 0) || (ss > 59)) { return 0; }
                i_val += ss.length;
            }
            else if (token == "a") {
                if (val.substring(i_val, i_val + 2).toLowerCase() == "am") { ampm = "AM"; }
                else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") { ampm = "PM"; }
                else { return 0; }
                i_val += 2;
            }
            else {
                if (val.substring(i_val, i_val + token.length) != token) {
                    return 0;
                }
                else {
                    i_val += token.length;
                }
            }
        }
        // If there are any trailing characters left in the value, it doesn't match
        if (i_val != val.length) { return 0; }
        // Is date valid for month?
        if (month === 2) {
            // Check for leap year
            if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) { // leap year
                if (date > 29) { return 0; }
            }
            else { if (date > 28) { return 0; } }
        }
        if ((month === 4) || (month === 6) || (month === 9) || (month === 11)) {
            if (date > 30) { return 0; }
        }
        // Correct hours value
        if (hh < 12 && ampm == "PM") { hh = hh - 0 + 12; }
        else if (hh > 11 && ampm == "AM") { hh -= 12; }
        var newdate;
        
        /*Chrome 46 до .хх.хх.хх.90 имеет проблему
        https://code.google.com/p/chromium/issues/detail?id=543320
        Если ошибка детектируется, делаем дельту.
        
        var testDate = new Date(2015, 1, 1);
        if (testDate.getTimezoneOffset != 0 && testDate.getUTCHours() != 0) {
            newdate.setHours(newdate.getHours() - newdate.getTimezoneOffset() / 60);
        }*/
        /*сделаем чуток по другому
        if (jQuery.browser.webkit && hh == 0 && mm == 0 && ss == 0)
            newdate = new Date(year + '-' + month + '-' + date);
        else*/ {
            newdate = new Date(year, month - 1, date, hh, mm, ss);
            newdate.setHours(newdate.getHours() - newdate.getTimezoneOffset() / 60);
        }
        
        
        


        return newdate;
    };

    /*function parseDate(val) {
        var preferEuro = (arguments.length == 2) ? arguments[1] : false;
        generalFormats = new Array('y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d', 'd-MMM-y', 'MMM d');
        monthFirst = new Array('M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d');
        dateFirst = new Array('d/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M');
        var checkList = new Array('generalFormats', preferEuro ? 'dateFirst' : 'monthFirst', preferEuro ? 'monthFirst' : 'dateFirst');
        var d = null;
        for (var i = 0; i < checkList.length; i++) {
            var l = window[checkList[i]];
            for (var j = 0; j < l.length; j++) {
                d = Asyst.date.parse(val, l[j]);
                if (d != 0) { return new Date(d); }
            }
        }
        return null;
    }*/

    // ----------------------------------------------------------------------------
    // Цифирки
    // ----------------------------------------------------------------------------
    
    if (!Asyst.number) {
        Asyst.number = {};
    }

    //Asyst.number.defaultFormat = 'dd.MM.yyyy';
    Asyst.number.validate = function (val, binding) {
        if (!val)
            return true;

        val = val.toString().replace(/\s+/g, "").replace(/,/, ".");
        var num = Number(val);
        if (!binding || isNaN(num)) {
            return !isNaN(num);
        } else {
            // precision[.scale] precision - вся длина, scale - дробная часть
            if (binding.Type == "number" && binding.Kind == 'decimal') {
                if (Math.ceil(Math.log(Math.abs(num)) / Math.LN10) > (binding.Precision - binding.Scale)) return false;
                else return true;
            }
            else return true;

        }
    };

    if (numeral) {
        numeral.language(Globa.defineCurrentLocal());
    }
    //numeral.language('ru-it');
    Asyst.number.format = function (val, format) {
        if (format === undefined || format === null)
            format = '0,0.[00]';
        return numeral(val).format(format);
    };

    Asyst.number.parse = function (val, format) {
        return numeral().unformat(val);
    };
} ());