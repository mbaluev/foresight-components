var Globa;

if (!Globa) {
    Globa = {};

    Globa.getCookie = function(name) {
        var cookie = " " + document.cookie;
        var search = " " + name + "=";
        var setStr = null;
        var offset = 0;
        var end = 0;
        if (cookie.length > 0) {
            offset = cookie.indexOf(search);
            if (offset != -1) {
                offset += search.length;
                end = cookie.indexOf(";", offset);
                if (end == -1) {
                    end = cookie.length;
                }
                setStr = unescape(cookie.substring(offset, end));
            }
        }
        return (setStr);
    };
    
    

    Globa.defaultString = function(str) {
        var pos = str.indexOf("|");
        if (pos == -1)
            return str;
        else return str.substr(0, pos);
    };

    Globa.localString = function(str, isoCode) {
        if (isoCode === null || typeof isoCode === "undefined")
            isoCode = Globa.defineCurrentLocal();

        var re = new RegExp("\\|" + isoCode + ":([^|]*)");
        var subres = re.exec(str);
        if (subres !== null && subres.length > 1 && typeof subres[1] !== "undefined") {
            return subres[1];
        } else return Globa.defaultString(str);
    };

    Globa.defineCurrentLocal = function() {
        var matches = document.cookie.match(new RegExp("(?:^|; )MAPLang=([^;]*)"));

        var lang = matches ? decodeURIComponent(matches[1]) : null;
        if (lang == null || lang == "")
            return "ru";
        return lang.substring(0, 2).toLowerCase();
    };

    Globa.setLanguageCookie = function(lang) {
        var date = new Date();
        date.setDate(date.getDate() + 365);
        document.cookie = name + "MAPLang=" + escape(lang) + "; expires=" + date.toUTCString;
    };

    Globa.getTranslationTable = function() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/asyst/view/MetaTranslation', false);
        xhr.send(null);
        
        Globa.translationTable = JSON.parse(xhr.responseText).data;
        Globa.translationTable.expired = (new Date().valueOf())  + 1000 * 60 * 10;
        try {
            localStorage.setItem('asyst.TranslationTable', JSON.stringify(Globa.translationTable));
            localStorage.setItem('asyst.TranslationTable.expired', Globa.translationTable.expired);
        } catch (e) {
            //если получили отлуп по объему - ничего не делаем
            console.log('Globa.pingTranslationTable. ' + e);
        }
    };

    Globa.magicString = '##';
    Globa.tableStoragePath = 'asyst.TranslationTable';
    //get or refresh(by timer) translation table 
    Globa.pingTranslationTable = function () {
        if (!Globa.translationTable) {
            Globa.translationTable = JSON.parse(localStorage.getItem('asyst.TranslationTable'));
            if (Globa.translationTable == null) {
                Globa.getTranslationTable();
            }
            Globa.translationTable.expired = JSON.parse(localStorage.getItem('asyst.TranslationTable.expired'));
        }

        if ((new Date().valueOf()) > Globa.translationTable.expired) {
            Globa.getTranslationTable();
        }
    };

    Globa.localString2 = function (str, isoCode) {
        if (str.indexOf(Globa.magicString) != 0) return str;

        Globa.pingTranslationTable();

        if (isoCode === null || typeof isoCode === "undefined")
            isoCode = Globa.defineCurrentLocal();

        for (var i = 0; i < Globa.translationTable.length; i++) {
            if (Globa.translationTable[i].Name == str)
                if (Globa.translationTable[i].hasOwnProperty([isoCode + "Name"]))
                    return Globa.translationTable[i][isoCode + "Name"];
                else return Globa.translationTable[i][Globa.getCookie("MAPDefLang") + "Name"];
        }
        return str;
    };

    Globa.localString3 = function(str, isoCode) {
        Globa.pingTranslationTable();
        if (isoCode === null || typeof isoCode === "undefined")
            isoCode = Globa.defineCurrentLocal();

        var replacer = function(str, p1, offset, s) {
            for (var i = 0; i < Globa.translationTable.length; i++) {
                if (Globa.translationTable[i].Name == str)
                    return Globa.translationTable[i][isoCode + "Name"];
            }
            return s;
        };

        return str.replace(new RegExp("##([^#])*##", 'g'), replacer);
    };

    //var func = function() {
    //    if (!Globa)
    //        return;
    //    var menuItems = $('.menu-item .menu-item-text');
    //    for (var i = 0; i < menuItems.length; i++) {
    //        menuItems[i].innerText = Globa.localString2(menuItems[i].innerText);
    //    }
    //};

    if (!String.prototype.locale || typeof String.prototype.locale !== "function")
        String.prototype.locale = function() {
            return Globa.localString2(this);
        };

    Globa.Name = "##JSName##";
    Globa.Close = "##JSClose##";
    Globa.Save = "##JSSave##";
    Globa.Saving = "##JSSaving##";
    Globa.Cancel = "##JSCancel##";
    Globa.Send = "##JSSend##";
    Globa.Continue = "##JSContinue##";
    Globa.Error = "##JSError##";
    Globa.Create = "##JSCreate##";
    Globa.Delete = "##JSDelete##";
    Globa.Reply = "##JSReply##";
    Globa.Naming = "##JSNaming##";
    Globa.ErrorDescription = "##JSErrorDescription##";
    
    Globa.Day = "##JSDay##";
    Globa.Week = "##JSWeek##";
    Globa.Month = "##JSMonth##";
    Globa.Quarter = "##JSQuarter##";
    Globa.Year = "##JSYear##";
    Globa.Qu = "##JSQu##";

    //application.documents.js
    Globa.Link = "##JSLink##";
    Globa.Links = "##JSLinks##";
    Globa.Files = "##JSFiles##";
    Globa.ErrorLoad = "##JSErrorLoad##";
    Globa.ErrorDelete = "##JSErrorDelete##";
    Globa.Loading = "##JSLoading##";
    Globa.ErrorSameFile = "##JSErrorSameFile##";
    Globa.NoPhase = "##JSNoPhase##";
    Globa.DeleteDocument = "##JSDeleteDocument##";
    Globa.DeleteLink = "##JSDeleteLink##";
    Globa.FileLoading = "##JSFileLoading##";
    Globa.LinkName = '##LinkName##';
    Globa.JSEnterLinkName = '##JSEnterLinkName##';
    Globa.JSInvalidLinkFormat = '##JSInvalidLinkFormat##';
    Globa.JSLinkToolip = '##JSLinkToolip##';
    Globa.JSRestrictContains = '##JSRestrictContains##';
    Globa.JSRestrictDotAround = '##JSRestrictDotAround##';
    Globa.JSRestrictEnding = '##JSRestrictEnding##';

    //application.js
    Globa.Message = "##JSMessage##";
    Globa.CheckDocumentsDeleting = "##JSCheckDocumentsDeleting##";
    Globa.ConfirmDocumentsDeleting = "##JSConfirmDocumentsDeleting##";
    Globa.DeletingError = "##JSDeletingError##";
    Globa.DeleteReferenceError = "##JSDeleteReferenceError##";
    Globa.Yes = "##JSYes##";
    Globa.No = "##JSNo##";
    Globa.SelectValue = "##JSSelectValue##";
    Globa.Accept = "##JSAccept##";
     
    Globa.ViewSample = "##ViewSample##";
    Globa.ViewSampleDefault = "##ViewSampleDefault##";
    Globa.ViewSampleTypeName = '##ViewSampleTypeName##';
    Globa.ViewSampleTypeNameBelow = '##ViewSampleTypeNameBelow##';
    Globa.ViewSampleSelectForDelete = '##ViewSampleSelectForDelete##';
    Globa.ViewSampleDelete = "##ViewSampleDelete##";
    Globa.Equal = "##JSEqual##";
    Globa.NotEqual = "##JSNotEqual##";
    Globa.Contain = "##JSContain##";
    Globa.NotContain = "##JSNotContain##";
    Globa.Started = "##JSStarted##";
    Globa.Great = "##JSGreat##";
    Globa.GreatOrEqual = "##JSGreatOrEqual##";
    Globa.Less = "##JSLess##";
    Globa.LesssOrEqual = "##JSLesssOrEqual##";
    
    Globa.AND = "##JSAND##";
    Globa.OR = "##JSOR##";
    
    Globa.AnyFrom = "##JSAnyFrom##";
    Globa.ShowLineFrom = "##JSShowLineFrom##";
    Globa.AndTitle = "##JSAndTitle##";
    Globa.OrTitle = "##JSOrTitle##";
    Globa.FieldName = "##JSFieldName##";
    Globa.Comparison = "##JSComparison##";
    Globa.Value = "##JSValue##";
    Globa.ExtFilter = "##JSExtFilter##";

    //GanttTooltip - GT
    Globa.GTType = "##JSGTType##";
    Globa.GTResponsible = "##JSGTResponsible##";
    Globa.GTExecutors = "##JSGTExecutors##";
    Globa.GTForecast = "##JSGTForecast##";
    Globa.GTFact = "##JSGTFact##";
    Globa.GTPlan = "##JSGTPlan##";
    
    Globa.LastPhase = "##JSLastPhase##";
    Globa.ConfirmEndPhase = "##JSConfirmEndPhase##";
    Globa.MoveToNextPhase = "##JSMoveToNextPhase##";
    Globa.ConfirmReturn = "##JSConfirmReturn##";
    Globa.ReturnPrev = "##JSReturnPrev##";
    Globa.ConfirmMove = "##JSConfirmMove##";
    Globa.ConfirmMove2 = "##JSConfirmMove2##";
    Globa.DeniedDoubleMove = "##JSDeniedDoubleMove##";
    
    Globa.Addressee = "##JSAddressee##";
    Globa.MessageText = "##JSMessageText##";
    Globa.SelectRecipient = "##JSSelectRecipient##";
    Globa.TemplateMessage = "##JSTemplateMessage##";
    Globa.QuickMessage = "##JSQuickMessage##";
    Globa.AddCurrentText = "##JSAddCurrentText##";
    Globa.EditTypicalMessageList = "##JSEditTypicalMessageList##";
    Globa.UrgentMessage = "##JSUrgentMessage##";
    Globa.ImportantMessage = "##JSImportantMessage##";
    Globa.NormalMessage = "##JSNormalMessage##";
    Globa.TypicalMessageList = "##JSTypicalMessageList##";
    Globa.SendingMessage = "##JSSendingMessage##";
    Globa.ExportDocument = "##JSExportDocument##";
    Globa.SystemError = "##JSSystemError##";
    Globa.SentErrorDescription = "##JSSentErrorDescription##";
    Globa.CallService = "##JSCallService##";

    //application.model.js
    Globa.IncorrectNumberFormat = "##JSIncorrectNumberFormat##";
    Globa.IncorrectDateFormat = "##JSIncorrectDateFormat##";
    Globa.WrongNumberFieldFormat = "##JSWrongNumberFieldFormat##";
    Globa.WrongDateFieldFormat = "##JSWrongDateFieldFormat##";
    Globa.FillField = "##JSFillField##";
    Globa.SavingError = "##JSSavingError##";
    Globa.EnterCommentForField = "##JSEnterCommentForField##";
    Globa.ChangeRequest = "##JSChangeRequest##";
    Globa.ChangeRequestTitle = "##JSChangeRequestTitle##";
    Globa.ErrorLoadComboItems = "##JSErrorLoadComboItems##";
    Globa.ErrorDataListLoad = "##JSErrorDataListLoad##";
    Globa.Agreement = "##JSAgreement##";
    Globa.ChangeRequestField = "##JSChangeRequestField##";
    Globa.Reviewers = "##JSReviewers##";
    Globa.JSRequiredChangeRequest = "##JSRequiredChangeRequest##";
    Globa.JSRequiredPhase = "##JSRequiredPhase##";
    Globa.Required = "##Required##";
    Globa.LicenseError = "##LicenseError##";
    Globa.ErrorOnCheckSave = "##ErrorOnCheckSave##";
    Globa.JSLicenseExpired = '##JSLicenseExpired##';
    Globa.ASPXLicenseExpired = '##ASPXLicenseExpire##';
    Globa.ErrorTooLongText = '##ErrorTooLongText##';
    Globa.ChosenNoResult = '##ChosenNoResult##';
    Globa.ChosenPlaceholderSingle = '##ChosenPlaceholderSingle##';
    Globa.ChosenPlaceholderMultiple = '##ChosenPlaceholderMultiple##';

    //application.points.js
    Globa.PointTitle = "##JSPointTitle##";
    Globa.Plan = "##JSPlan##";
    Globa.FinishPointsCreated = "##JSFinishPointsCreated##";
    Globa.CreatingError = "##JSCreatingError##";
    Globa.OtherPointTitle = "##JSOtherPointTitle##";
    Globa.TemplatePoints = "##JSTemplatePoints##";
    Globa.NewPoint = "##JSNewPoint##";
    Globa.ErrorDatePoint = "##JSErrorDatePoint##";
    Globa.ErrorLesserThen = "##JSErrorLesserThen##";
    Globa.ErrorGreaterThen = "##JSErrorGreaterThen##";

    //application.changerequest.js
    Globa.ChangeRequests = "##JSChangeRequests##";
    Globa.State = "##JSState##";
    Globa.Description = "##JSDescription##";
    Globa.OldValue = "##JSOldValue##";
    Globa.NewValue = "##JSNewValue##";
    Globa.Field = "##JSField##";
    Globa.Decision = "##JSDecision##";
    Globa.Attach = "##JSAttach##";
    Globa.PCDecline = "##JSPCDecline##";
    Globa.PCAgree = "##JSPCAgree##";
    Globa.PCNotice = "##JSPCNotice##";
    Globa.Comment = "##JSComment##";
    Globa.Alternative = "##JSAlternative##";
    Globa.ChangeHistory = "##JSChangeHistory##";
    Globa.Comment1 = "##JSComment1##";
    Globa.Comment2 = "##JSComment2##";
    Globa.Comment3 = "##JSComment3##";
    Globa.AttachedFile = "##JSAttachedFile##";
    Globa.Decline = "##JSDecline##";
    Globa.Agree = "##JSAgree##";
    Globa.SendToPC = "##JSSendToPC##";
    Globa.ChangeRequestFrom = "##JSChangeRequestFrom##";
    Globa.Missprint = "##JSMissprint##";
    Globa.EnterComment = '##JSEnterComment##';

    //application.globalsearch.js
    Globa.RecordNotFound = "##JSRecordNotFound##";
    
    //jquery.comments.widget.js
    Globa.CommetDeletedAt = "##JSCommetDeletedAt##";
    Globa.AnswerToComment = "##JSAnswerToComment##";
    Globa.Add = "##JSAdd##";
    Globa.Back = "##JSBack##";
    Globa.Forward = "##JSForward##";
    Globa.Answer = "##JSAnswer##";

    //jsgantt.js
    Globa.Executor = "##JSExecutor##";
    Globa.Dur = "##JSDur##";
    Globa.FinishPercent = "##JSFinishPercent##";
    Globa.Begin = "##JSBegin##";
    Globa.End = "##JSEnd##";
    
    Globa.January = "##JSJanuary##";
    Globa.February = "##JSFebruary##";
    Globa.March = "##JSMarch##";
    Globa.April = "##JSApril##";
    Globa.May = "##JSMay##";
    Globa.June = "##JSJune##";
    Globa.Jule = "##JSJule##";
    Globa.August = "##JSAugust##";
    Globa.September = "##JSSeptember##";
    Globa.October = "##JSOctober##";
    Globa.November = "##JSNovember##";
    Globa.December = "##JSDecember##";
    Globa.Months = [Globa.January, Globa.February, Globa.March, Globa.April, Globa.May, Globa.June, Globa.Jule, Globa.August, Globa.September, Globa.October, Globa.November, Globa.December];
    
    Globa.January3 = "##JSJanuary3##";
    Globa.February3 = "##JSFebruary3##";
    Globa.March3 = "##JSMarch3##";
    Globa.April3 = "##JSApril3##";
    Globa.May3 = "##JSMay3##";
    Globa.June3 = "##JSJune3##";
    Globa.Jule3 = "##JSJule3##";
    Globa.August3 = "##JSAugust3##";
    Globa.September3 = "##JSSeptember3##";
    Globa.October3 = "##JSOctober3##";
    Globa.November3 = "##JSNovember3##";
    Globa.December3 = "##JSDecember3##";
    Globa.Months3 = [Globa.January3, Globa.February3, Globa.March3, Globa.April3, Globa.May3, Globa.June3, Globa.Jule3, Globa.August3, Globa.September3, Globa.October3, Globa.November3, Globa.December3];
    
    Globa.Monday = "##JSMonday##";
    Globa.Tuesday = "##JSTuesday##";
    Globa.Wednesday = "##JSWednesday##";
    Globa.Thursday = "##JSThursday##";
    Globa.Friday = "##JSFriday##";
    Globa.Saturday = "##JSSaturday##";
    Globa.Sunday = "##JSSunday##";
    Globa.Weekdays = [Globa.Monday, Globa.Tuesday, Globa.Wednesday, Globa.Thursday, Globa.Friday, Globa.Saturday, Globa.Sunday];
    
    Globa.Monday2 = "##JSMonday2##";
    Globa.Tuesday2 = "##JSTuesday2##";
    Globa.Wednesday2 = "##JSWednesday2##";
    Globa.Thursday2 = "##JSThursday2##";
    Globa.Friday2 = "##JSFriday2##";
    Globa.Saturday2 = "##JSSaturday2##";
    Globa.Sunday2 = "##JSSunday2##";
    Globa.Weekdays = [Globa.Monday2, Globa.Tuesday2, Globa.Wednesday2, Globa.Thursday2, Globa.Friday2, Globa.Saturday2, Globa.Sunday2];

    //FileUploader.js
    Globa.DragFile = "##JSDragFile##";
    Globa.LoadFile = "##JSLoadFile##";
    Globa.Fail = "##JSFail##";
    Globa.SelectRows = "##JSSelectRows##";
    Globa.FileEmpty = "##JSFileIsEmpty##";
    Globa.FileInvalidExtenstion = "##JSFileInvalidExtenstion##";
    Globa.FileTooSmall = "##JSFileTooSmall##";
    Globa.FileTooLarge = "##JSFileTooLarge##";
    Globa.FileLeaveWarning = "##JSFileLeaveWarning##";

    //comments
    Globa.NewComment1 = "##JSNewComment1##";
    Globa.NewCommentx1 = "##JSNewCommentx1##";
    Globa.NewComment234 = "##JSNewComment234##";
    Globa.NewCommentx = "##JSNewCommentx##";
    Globa.AllignColumnsInWindow = "##JSAllignColumnsInWindow##";

}