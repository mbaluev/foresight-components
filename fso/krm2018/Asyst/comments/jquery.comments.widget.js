var Comments = {};

Comments.Create = function (selector,settings) {
    Comments.form = Asyst.Workspace.currentForm;
    Comments.selector = selector;

    var el = $(selector);
    var access = Comments.form.Access[el.attr('id')];
    while (access === undefined && el.length != 0) {
        el = el.parent();
        access = Comments.form.Access[el.attr('id')];
    }
    if (access !== undefined) {
        settings = $.extend({ isReadOnly: access.IsReadonly }, settings);
    } else {
        settings = $.extend({ isReadOnly: false }, settings);
    }
    $(selector).comments(settings);

    Comments.Refresh();
};

Comments.RefreshCount = function () {
    var commentID = 0;
    if (Comments.Data.length == 0)
        commentID = null;
    else
        commentID = Comments.Data[0].commentID;
    
    Asyst.APIv2.Comments.getCount({
            entityName: Comments.form.EntityName,
            dataId: Comments.form.EntityId,
            commentId: commentID,
            success: function(result) {
                $('#commentNewCounter')[0].innerHTML = Comments.CountForm(result.count);
                if (result.count == 0)
                    $('#commentNewCounter').hide();
                else
                    $('#commentNewCounter').show();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert(jqXHR);
            }
        }
    );
};

Comments.Refresh = function () {
    
    Asyst.APIv2.Comments.load({
            entityName: Comments.form.EntityName,
            dataId: Comments.form.EntityId,
            success: function(result) {
                Comments.Data = result;
                if (typeof Comments.timer == "undefined")
                    Comments.timer = setInterval(function() {
                        Comments.RefreshCount();
                    }, 1000 * Comments.Settings.update);
                Comments.LoadPage(0);
                Comments.RefreshCount();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert(jqXHR);
            }
        }
    );    
};

Comments.LoadPage = function (pageNo) {
    
    $('.comList').empty();
    
    Comments.PageNo = pageNo;
    
    for (var i = pageNo * Comments.Settings.showBy; i < Math.min(Comments.Data.length, (pageNo + 1) * Comments.Settings.showBy) ; i++) {
        var row = "";
        row += "<li>";
        row += "   <span class='comListAuthor comListBold'> " + Comments.Data[i].author + " </span>";
        row += "   <span class='comListInto comListDate'>" + Comments.Data[i].creationDate + "</span>";

        row += "<span class='comListInto'>";
        if (Asyst.Workspace.currentUser.Id == Comments.Data[i].authorID && Comments.Settings.allowDelete && !Comments.Settings.isReadOnly)
            row += "<a href='#' onClick='Comments.Delete(" + Comments.Data[i].commentID + ")'>" + Globa.Delete.locale() + "</a>";
        if (Comments.Settings.allowReply)
            row += "<a href='#' onClick='Comments.Reply(" + Comments.Data[i].commentID + ", \"" + Comments.Data[i].author + "\")'>" + Globa.Reply.locale() + "</a>";
        if (Comments.Data[i].answerCount !=0)
            row += "<span>" + Comments.Data[i].answerCount + " " + Globa.Answer.locale() + "</span>";
        row += "</span>";

        row += "   <br/>";
        if (Comments.Data[i].isDeleted == "True") {
            row += "   " + Globa.CommetDeletedAt.locale() + Comments.Data[i].deletionDate;
        } else {
            if (Comments.Data[i].parentAuthor.trim() == "") {
                row += Comments.Data[i].content;
            } else {
                row += "<span class='comListAuthor'>" + Comments.Data[i].parentAuthor.trim() + ", </span> " + Comments.Data[i].content;
            }
        }

        row += "</li>";
        $('.comList').append(row);
    }

    // на первой странице не показываем кнопку Назад
    if (pageNo == 0)
        $('.comPaging.comPagingBack').hide();
    else
        $('.comPaging.comPagingBack').show();
    
    // на последней странице не показываем кнопку Вперед
    if (pageNo >= Math.floor((Comments.Data.length-1) / Comments.Settings.showBy))
        $('.comPaging.comPagingForward').hide();
    else 
        $('.comPaging.comPagingForward').show();
};

Comments.LoadPrev = function() {
    Comments.LoadPage(Comments.PageNo - 1);
};

Comments.LoadNext = function () {
    Comments.LoadPage(Comments.PageNo + 1);
};

Comments.Save = function () {
    
    var data = {};
    data.content = $("#commentText").val();
    if (Comments.ParentId !== undefined && Comments.ParentId != null)
        data.parentId = Comments.ParentId;

    Asyst.APIv2.Comments.save({
        entityName: Comments.form.EntityName,
        dataId: Comments.form.EntityId,
        data: data,
        success: function() {
            Comments.RefreshCount();
            $("#commentText").val("");
            $("#commentText").change();

            $('.comAnswerInfo').hide();
            if (Comments.ParentId !== undefined)
                Comments.ParentId = null;
        },
        error: function(message, info, context) {
            if (message == Globa.LicenseError) {
                return;
            }
        },
        async: true
    });
};

Comments.Delete = function (commentId) {
    
    var data = {};
    data.CommentId = commentId;

    Asyst.APIv2.Comments.delete({
        entityName: Comments.form.EntityName,
        dataId: Comments.form.EntityId,
        data: data,
        success: function() {
            Comments.Refresh();
        },
        error: function(message, info, context) {
            if (message == Globa.LicenseError) {
                return;
            }
        },
        async: false
    });
    
};

Comments.Reply = function(commentId, author) {
    Comments.ParentId = commentId;
    $("#commentText").focus();
    $('.comAnswerInfo')[0].innerHTML = Globa.AnswerToComment.locale() + author;
    $('.comAnswerInfo').show();
};

jQuery.fn.comments = function (settings) {

    Comments.Settings = jQuery.extend({
        width: 10000,
        css: "/asyst/comments/jquery.comments.widget.css",
        update: 60,
        allowReply: true,
        allowDelete: true,
        showBy: 2,
        symbolsLimit: 255,
        array: [{ author: "", parentAuthor: "", content: "", creationDate: "", deletionDate: "", isDeleted: "", commentID: "", authorID: "", answerCount: "" }],
        isReadOnly: true
    }, settings);


    return this.each(function () {
     
        //чистим текущее содержимое узла
        jQuery(Comments.selector).empty();
        
        var head = "";
        
        head += "<div style='width: 100%'>";

        //подгрузка стилей
        dynjs.load(Comments.Settings.css, dynjs.type.css);
        head += "<span class='comAnswerInfo' style='display: none'></span>";
        
        head += "<textarea id='commentText' rows='3' cols='100' class='comTextarea' onchange='Comments.SymbCounter(this);' oninput='Comments.SymbCounter(this);' onkeyup='Comments.SymbCounter(this);' oncut='Comments.SymbCounter(this);' onpropertychange='function() { if (event.propertyName == \"value\") Comments.SymbCounter(this);}'></textarea>";
        
        head += "<input id='commentSubmit' type='button' class='comSubmitButton' value='" + Globa.Send.locale() + "' onClick='Comments.Save();' disabled='true'/>";
        head += "<span id='commentCounter' class='comCounter'>" + Comments.Settings.symbolsLimit + "</span>";
        head += "<span id='commentCounterText' class='comCounterText'>Осталось символов:</span>";

        head += "<div id='commentNewCounter' class='comNew' onClick='Comments.Refresh();' style='display: none'>0 новых комментариев</div>";

        head += "<ul class='comList'>";

        jQuery(Comments.selector).append(head);

        var addbottom = "";
        addbottom += "</ul>";
        addbottom += "<a href='#' class='comPaging comPagingBack' style='display: none' onClick='Comments.LoadPrev()';>" + Globa.Back.locale() + "</a>";
        addbottom += "<a href='#' class='comPaging comPagingForward' style='display: none' onClick='Comments.LoadNext()';>" + Globa.Forward.locale() + "</a>";

        addbottom += "</div>";

        jQuery(Comments.selector).append(addbottom);
    });
};

Comments.SymbCounter = function (selector) {
    var symbCount = selector.value.length;
    $('#commentCounter')[0].innerText = Comments.Settings.symbolsLimit - symbCount;
    if (!Comments.Settings.isReadOnly)
        $('#commentSubmit').prop("disabled", Comments.Settings.symbolsLimit - symbCount < 0 || symbCount == 0);
    if (Comments.Settings.symbolsLimit - symbCount > 10) {
        $('#commentCounter').removeClass("comCounterLow");
    }
    else {
        $('#commentCounter').addClass("comCounterLow");
    }
};

Comments.CountForm = function (count) {
    var mod = count % 10;
    var cnt = Math.floor(count / 10);

    if (count == 1)
        return count + Globa.NewComment1.locale();
    if ((cnt == 0 || cnt > 1) && (mod == 1))
        return count + Globa.NewCommentx1.locale();
    else if ((cnt == 0 || cnt > 1) && (mod == 2 || mod == 3 || mod == 4))
        return count + Globa.NewComment234.locale();
    else //if ((count == 11 || count == 12) || (mod == 5 || mod == 6 || mod == 7 || mod == 8 || mod == 9  || mod == 0))
        return count + Globa.NewCommentx.locale();
};

