function ChangeRequestsView(selector, form) {
    if (!form)
        form = Asyst.Workspace.currentForm;

    var $el = $('#' + form.FormName + ' ' + selector);
    $el.empty();

    form.ChangeRequests = [];

    Asyst.API.View.load('ChangeRequestsView', form.Data,
    function (view) {
        if (view.data.length > 0) {
            form.ChangeRequests = view.data;

            var html = '';
            html += '    <div class="accordion-group" style="margin-left:8px; margin-right:8px;">';
            html += '      <div class="accordion-heading">';
            html += '        <a href="#changerequests-body" data-toggle="collapse" class="accordion-toggle">';
            html += '          ' + Globa.ChangeRequests.locale();
            html += '        </a>';
            html += '      </div>';
            html += '      <div class="accordion-body in collapse" id="changerequests-body" style="height: auto;">';
            html += '        <div class="accordion-inner" style="padding: 0px 4px;">';
            html += '<table class="table table-condensed" style="font-size:11px;margin-bottom:0px;">';
            html += '<thead>';
            html += '<tr><th></th><th>' + Globa.State.locale() + '</th><th>' + Globa.Description.locale() + '</th><th>' + Globa.Field.locale() + '</th><th>' + Globa.OldValue.locale() + '</th><th>' + Globa.NewValue.locale() + '</th></tr>';
            html += '</thead>';
            html += '<tbody>';
            for (var r in view.data) {
                var request = view.data[r];
                var img = '';
                if (request.ExternalReviewState == 1)
                    img = 'hourglass.png';
                else if (request.ExternalReviewState == 3)
                    img = 'fail-small.png';
                else if (request.State == 1)
                    img = 'hourglass.png';
                else if (request.State == 2)
                    img = 'tick-small.png';
                else if (request.State == 3)
                    img = 'fail-small.png';
                html += '<tr data-index="' + r + '" class="changerequest-row" style="cursor:pointer;">' +
                    '<td><img src="/asyst/img/' + img + '"></td>' +
                    '<td>' + request.StateName.locale() + '</td>' +
                    '<td>' + request.Description + '</td>' +
//                    '<td>' + request.ElementTitle.locale() + '</td>' +
                    '<td>' + Globa.localString2(request.ElementTitle) + '</td>' +
                    '<td><div style="max-width:150px; white-space: nowrap; text-overflow:ellipsis;overflow:hidden;" >' + request.OldDisplayValue + '</div></td><td><div style="max-width:150px; white-space: nowrap; text-overflow:ellipsis;overflow:hidden;">' + request.NewDisplayValue + '</div></td>' +
                    //'<td>' + '<a href="' + location.origin+location.pathname + '?mode=view&ChangeRequestId=' + request.ChangeRequestId + '">Ссылка на ЗИ</a> </td>' +
                    '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
            html += '        </div>';
            html += '      </div>';
            html += '    </div>';

            $el.html(html);
            $('.changerequest-row').click(function () {
                var index = $(this).data('index');
                var request = view.data[index];

                ChangeRequestDialog(form, request);
            });

            if (!form.changeRequestsInitialized) {
                form.changeRequestsInitialized = true;

                var id = getParameterByName("ChangeRequestId");
                if (id) {
                    for (r in form.ChangeRequests) {
                        if (form.ChangeRequests[r].ChangeRequestId == id) {
                            ChangeRequestDialog(form, form.ChangeRequests[r]);
                            break;
                        }
                    }
                }
            }
        }
    },
    function () { });
}

function ChangeRequestDialogById(form, requestId) {
    for (r in form.ChangeRequests) {
        if (form.ChangeRequests[r].ChangeRequestId == requestId) {
            ChangeRequestDialog(form, form.ChangeRequests[r]);
            break;
        }
    }
}

function ChangeRequestDialog(form, request) {
    
    var agree = function () {
        var $comment = $('#change-request-dialog #changerequest-review-comment');
        var comment = $comment.val();
        Asyst.API.ChangeRequest.agree(form.EntityName, form.FormName, form.Data.id, request.ChangeRequestId, comment,
        function () {
            form.Load();
        },
        function () { });
    };
    
    var faAgree = function () {
        var $comment = $('#ChangeRequestFADialog #comment');
        var comment = $comment.val();
        if (!comment) {
            setInputWarning('#comment', true, 'Введите комментарий');
            return;
        }
        setInputWarning('#comment', false, 'Введите комментарий');
	comment = "Выполнено ФА - "+ user.FullName + "\r\n\r\n" + comment;
        //comment += " \r\Действие произведено " + user.FullName;
        return Asyst.protocol.send("/asyst/api/changerequest/" + form.EntityName + "/" + form.FormName + "/" + form.Data.id, "POST", { ActionType: "agree", ChangeRequestId: request.ChangeRequestId, Comment: comment, UserId: $comment.data('userid') }, false,
            function () { $('.modal').modal('hide'); form.Load(); }, function () { }, this);
    };

    var decline = function () {
        var $comment = $('#change-request-dialog #changerequest-review-comment');
        var comment = $comment.val();

        if (!comment) {
            Dialog('Ошибка', 'Введите комментарий!');
            return;
        }
        

        $comment.parents('.control-group').removeClass('error');
        Asyst.API.ChangeRequest.decline(form.EntityName, form.FormName, form.Data.id, request.ChangeRequestId, comment,
                function () { $('#change-request-dialog').modal('hide'); form.Load(); },
                function () { }
        );
    };
    
    var faDecline = function () {
        var $comment = $('#ChangeRequestFADialog #comment');
        var comment = $comment.val();
        if (!comment) {
            setInputWarning('#comment', true, 'Введите комментарий');
            return;
        }
        setInputWarning('#comment', false, 'Введите комментарий');
        comment = "Выполнено ФА - "+ user.FullName + "\r\n\r\n" + comment;
        //comment += " \r\Действие произведено " + user.FullName;
        return Asyst.protocol.send("/asyst/api/changerequest/" + form.EntityName + "/" + form.FormName + "/" + form.Data.id, "POST", { ActionType: "decline", ChangeRequestId: request.ChangeRequestId, Comment: comment, UserId: $comment.data('userid') }, false,
            function () { $('.modal').modal('hide'); form.Load(); }, function () { }, this);
    };

    var externalReviewStart = function () {

        Asyst.API.ChangeRequest.externalReviewStart(form.EntityName, form.FormName, form.Data.id, request.ChangeRequestId,
        function () {
            form.Load();
        },
        function () { });
    };

    var externalReviewAgree = function () {

        Asyst.API.ChangeRequest.externalReviewAgree(form.EntityName, form.FormName, form.Data.id, request.ChangeRequestId,
        function () {
            form.Load();
        },
        function () { });
    };

    var externalReviewAgreeWithIssues = function () {

        Asyst.API.ChangeRequest.externalReviewAgreeWithIssues(form.EntityName, form.FormName, form.Data.id, request.ChangeRequestId,
        function () {
            form.Load();
        },
        function () { });
    };

    var externalReviewDecline = function () {

        Asyst.API.ChangeRequest.externalReviewDecline(form.EntityName, form.FormName, form.Data.id, request.ChangeRequestId,
        function () {
            form.Load();
        },
        function () { });
    };

    var buttons = [{ text: Globa.Close.locale()}]; ;
    var body = '<div class="well form-horizontal">';
    
    body += '<div class="control-group"><label class="control-label">' + Globa.Field.locale() + '</label><div class="controls"><span>' + Globa.localString2(request.ElementTitle) + '</span></div></div>';
    body += '<div class="control-group"><label class="control-label">' + Globa.OldValue.locale() + '</label><div class="controls"><span>' + request.OldDisplayValue + '</span></div></div>';
    body += '<div class="control-group"><label class="control-label">' + Globa.NewValue.locale() + '</label><div class="controls"><span>' + request.NewDisplayValue + '</span></div></div>';
    body += '<div class="control-group"><label class="control-label">' + Globa.ChangeHistory.locale() + '</label><div class="controls"><a href="/ReportServer/Pages/ReportViewer.aspx?%2fReports%2fxrayChangeRequest&rs:Command=Render&ActivityId=' + (form.Data.ActivityId ^ 78645433) + '" style="width:100%" target="_blank">' + Globa.ChangeHistory.locale() + '</a></div></div>';
    body += '<div class="control-group"><label class="control-label">' + Globa.Description.locale() + '</label><div class="controls"><span>' + request.Description + '</span></div></div>';
    body += '<div class="control-group"><label class="control-label">' + Globa.Comment1.locale() + '</label><div class="controls"><span>' + request.Comment1 + '</span></div></div>';
    body += '<div class="control-group"><label class="control-label">' + Globa.Comment2.locale() + '</label><div class="controls"><span>' + request.Comment2 + '</span></div></div>';
    body += '<div class="control-group"><label class="control-label">' + Globa.Comment3.locale() + '</label><div class="controls"><span>' + request.Comment3 + '</span></div></div>';
    debugger;
    if (request.hasOwnProperty("FileUrl") && request.FileUrl != null && request.FileUrl != '')
        body += '<div class="control-group"><label class="control-label">' + Globa.AttachedFile.locale() + '</label><div class="controls"><a href="/' + form.DocumentsPath + '/' + request.FileUrl + '" target="_blank"><img src="/asyst/img/document.png"/>' + request.FileName + '</a></div></div>';

    body += '<div id="changerequest-reviews"></div>';
    body += '</div>';
    if (request.ExternalReviewState === 1) {
        if (request.UserAllowExternal) {
            buttons.unshift({ text: Globa.PCDecline.locale(), cls: 'btn-danger', click: externalReviewDecline });
            buttons.unshift({ text: Globa.PCAgree.locale(), cls: 'btn-success', click: externalReviewAgree });
            buttons.unshift({ text: Globa.PCNotice.locale(), cls: 'btn-warning', click: externalReviewAgreeWithIssues });
        }
    }
    else if (request.State === 1 && request.UserRequestState === 1) {

        body += '<div class="form-horizontal"><div class="control-group"><label class="control-label">' + Globa.Comment.locale() + '</label><div class="controls"><textarea id="changerequest-review-comment" type="text" rows="4" style="width:95%"></textarea><span class="help-inline"></span></div></div></div>';
        buttons.unshift({ text: Globa.Decline.locale(), cls: 'btn-danger', click: decline, close: false });
        buttons.unshift({ text: Globa.Agree.locale(), cls: 'btn-success', click: agree });
        //скрываем отправку запроса на изменение на проектный комитет
        //if (request.State === 1)
        //    buttons.unshift({ text: Globa.SendToPC.locale(), cls: 'pull-left', click: externalReviewStart });
    }
    
    Dialog(Globa.ChangeRequestFrom.locale() +' ' + Asyst.date.format(request.CreationDate) + ' - ' + request.AuthorName, body, buttons, 'change-request-dialog');
    $('#change-request-dialog').css({ "top": "10px" });
    $('#change-request-dialog').attr("data-backdrop","static");

    var rowClick = function(event) {
        debugger;
        var el = $(event.target).parents('tr');
        
        var requestsHtml = "Комментарий";
        requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><div class="controls"><textarea id="comment" data-userid="' + el.data('userid') + '" style="width:100%;" rows="5" rel="tooltip" title=""></textarea><span class="help-inline"></span></div></div>';
        requestsHtml += '  Выполнено ФА - ' + user.FullName;
        var requestDialogId = Dialog("Запрос на изменение", requestsHtml, [{ text: Globa.Agree.locale(), cls: 'btn-success', click: faAgree, close:false },{ text: Globa.Decline.locale(), cls: 'btn-danger', click: faDecline, close:false },{ text: Globa.Cancel.locale(), cls: 'btn', close:true }], 'ChangeRequestFADialog');   	 
    };
    
    Asyst.API.getCurrentUser();
    var user = Asyst.API.Entity.load('User', userId);

    Asyst.API.View.load('ChangeRequestReviews', { ChangeRequestId: request.ChangeRequestId }, function (view) {
        var table = '<table class="table table-condensed" style="font-size:11px;margin-bottom:0px; white-space:pre-wrap;"><thead></thead><tbody>';
        for (var r in view.data) {
            var review = view.data[r];

            var img = '';
            if (review.State == 1)
                img = 'hourglass.png';
            else if (review.State == 2)
                img = 'tick-small.png';
            else if (review.State == 3)
                img = 'fail-small.png';
			var style = (review.State == 1)? " style='cursor:pointer;' ": "";
            table += '<tr id="crtr' + review.ChangeRequestReviewId + '" data-userid="' + review.UserId + '" data-state="' + review.State + '"' + style + '><td><img src="/asyst/img/' + img + '"></td><td>' + review.StateName.locale() + '</td><td>' + review.UserName + '</td><td>' + review.Comment + '</td></tr>';
        }
        table += '</tbody></table>';
        var $dlg = $('#change-request-dialog #changerequest-reviews');
        $dlg.html(table);
        $('[rel="tooltip"]').tooltip();
        $('[rel="tooltip"]').on('hidden', function () { return false; });
        
        if (user.IsFunctionalAdministrator) {
            
            $('#change-request-dialog #changerequest-reviews tbody tr[data-state=1]').on('click', rowClick);
        }
    }, function () { });
}

function changeRequestDialogFileUploaded(file) {
    var $label = $("#change-request-dialog #changerequest-file");
    $label.text(file.name);
}