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

