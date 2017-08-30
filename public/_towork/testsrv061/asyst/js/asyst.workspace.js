(function () {
    'use strict';

    if (!Asyst.Workspace) {
        Asyst.Workspace = {};
    }

    var _forms = [];

    Asyst.Workspace.getCurrentForm = function() {
        if (_forms.length === 0)
            return undefined;
        else
            return _forms[_forms.length - 1];
    };

    Asyst.Workspace.getFormCount = function() {
        return _forms.length;
    };

    Asyst.Workspace.getForm = function(index) {
        return _forms[index];
    };

    Asyst.Workspace.addCurrentForm = function (form) {
        _forms.push(form);
        Asyst.Workspace.currentForm = form;
    };

    Asyst.Workspace.removeCurrentForm = function () {
        $(document).triggerHandler("AsystFormBeforeClosed", Asyst.Workspace.getCurrentForm());

        if (_forms.length > 0)
            _forms.length = _forms.length - 1;

        Asyst.Workspace.currentForm = Asyst.Workspace.getCurrentForm();
    };

    Asyst.Workspace.removeForm = function(form) {
        var i = jQuery.inArray(form, _forms);
        //var i = _forms.indexOf(form);
        if (i >= 0)
            _forms.splice(i, 1);

        Asyst.Workspace.currentForm = Asyst.Workspace.getCurrentForm();
    };

    Asyst.Workspace.showTab = function(tabName) {
        if (!tabName)
            return false;

        var $tab = $('#' + Asyst.Workspace.currentForm.FormName + ' #tabs a[href="' + tabName + '"]');

        if ($tab.length === 0)
            $tab = $('#' + Asyst.Workspace.currentForm.FormName + ' #tabs a[href="#' + tabName + '"]');
        if ($tab.length === 0)
            $tab = Asyst.Workspace.currentForm.getTabByText(tabName);

        if ($tab.length === 0)
            $tab = Asyst.Workspace.currentForm.getTabByName(tabName);

        if ($tab.length === 0)
            $tab = Asyst.Workspace.currentForm.getNestedTabByName(tabName);
        
        if ($tab.length === 0)
            $tab = Asyst.Workspace.currentForm.getNestedTabByText(tabName);
        
        //try nested open
        var prnts = $tab.parents('.tab-pane');
        if (prnts.length > 0)
            Asyst.Workspace.showTab(prnts[0].id.substr(Asyst.Workspace.currentForm.FormName.length));

        if ($tab.length > 0) {
            $tab.tab('show');

            return true;
        } else
            return false;
    };

    Asyst.Workspace.openEntityDialog = function(entityName, title, id, success, fields, notsave) {
        if (!id)
            id = 'new';
        
        var $tab;
        var form = Asyst.Workspace.currentForm;
        var currentFormName;
        if (form) {
            $tab = form.getActiveTab();
            currentFormName = form.FormName;
        }

        var modalName = entityName + 'Modal' + id;

        if (!title)
            title = '';

        title = $('<div/>').text(title).html();

		var randFormClass = 'rand' + (Math.floor(Math.random() * (9999 - 1000) + 1000));
        var html = '' +
            '<div class="' + randFormClass + ' modal form hide fade" id="' + entityName + id + '">' +
            '<div id="header"><h2 id="entityName" class="span10">' + title + '</h2></div>' +
            '    <div class="modal-body">' +
            '    </div>' +
            '    <div class="modal-footer" id="modalFooter">' +
            '       <a id="saveButton" class="btn btn-primary" href="javascript:void(0)">' + Globa.Save.locale() + '</a>' +
            '       <a id="closeButton" href="javascript:void(0)" class="btn">' + Globa.Cancel.locale() + '</a>' +
            '    </div>' +
            '</div>';
        var outer = $('#' + modalName).html();
        if (!outer) {
            $('body').append('<div id="' + modalName + '"></div>');
            $('body').addClass("scrollable-form");
        }
        $('#' + modalName).html(html);

        var dialog = $('#' + entityName + id);

        var url = '/asyst/' + entityName + '/form/ajax/' + id + '?refreshrandom='+Math.round(Math.random())+'&noaction=true';
        //var url = '/asyst/' + entityName + '/form/ajax/' + id + '?noaction=true';
        //if (fields)
        //    url += '&fields=' + encodeURIComponent(JSON.stringify(fields));
        if ($tab && $tab.length > 0 && Asyst.Workspace.currentForm.Data.entityname == entityName)
            url += '&tab=' + encodeURIComponent($tab.text());

        $('#' + modalName + ' .modal-body').css({ 'max-height': window.innerHeight - 86 });

        if (fields){
            $('#' + modalName + ' .modal-body').load(url, {fields:JSON.stringify(fields)},function() {
                if (Asyst.Workspace.currentForm.Title)
                    $('#' + modalName + ' #entityName').text(Asyst.Workspace.currentForm.Title);
            });
        }
        else{
            $('#' + modalName + ' .modal-body').load(url,  function () {
                if (Asyst.Workspace.currentForm.Title)
                    $('#' + modalName + ' #entityName').text(Asyst.Workspace.currentForm.Title);
            });
        }
        var editForm= {};
        $('#' + modalName + ' #saveButton').bind('click', function() {
            var form = Asyst.Workspace.currentForm;
            editForm = form;
            if (notsave) {
                if (!form.CheckCanSave())
                    return false;

                Asyst.Workspace.removeForm(form);
                dialog.modal('hide');
                if (success)
                    success(form);
            } else {
                form.Save(function() {
                    Asyst.Workspace.removeForm(form);
                    dialog.modal('hide');
                    if (success)
                        success(form);
                }, false);
            }
            
        });

        $('#' + modalName + ' #closeButton').bind('click', function() {
            var form = Asyst.Workspace.currentForm;
            editForm = form;
            Asyst.Workspace.removeForm(form);
            dialog.modal('hide');
        });

        
        dialog.modal({ backdrop: 'static', show: true, keyboard: false }).css({
            'width': '960px',
            'margin-left': '-480px'
        });
        

        //dialog.on('hidden') заменен на следующий блок из-за особенностей поведения бутстрапа и его модальных окон.
        dialog.on('hidden', function () {
            $(this).data('modal', null);
            while ($('#' + entityName + id + '.' + randFormClass).length !== 0) $('#' + entityName + id).remove();
            setTimeout(function () {
                $(this).data('modal', null);
                while ($('#' + entityName + id + '.' + randFormClass).length !== 0) $('#' + entityName + id).remove();
                $(document).trigger("AsystFormClosed", editForm);
            }, 500);
        });
        //dialog.on('hidden', function () {
        //    $(this).data('modal', null);
        //    dialog.remove();
        //});

        dialog.on('shown', function(e) {
            var modal = $(this);
            return this;
        });

        //переход на вкладку
        if ($tab && $tab.length > 0 && Asyst.Workspace.currentForm.Data.entityname == entityName) {
            var intervalCount = 0;
            var intervalId = setInterval(function() {
                try {
                    intervalCount++;
                    form = Asyst.Workspace.currentForm;
                    if (form && form.FormName != currentFormName) {
                        Asyst.Workspace.showTab($tab.text().trim());
                        //$tab = form.getTabByText($tab.text());
                        //$tab.tab('show');
                        clearInterval(intervalId);
                    } else if (intervalCount > 70)
                        clearInterval(intervalId);
                } catch(error) {
                    clearInterval(intervalId);
                }
            }, 100);
        }
        return dialog;
    };

    Asyst.Workspace.currentFormEdit = function () {
        var form = Asyst.Workspace.currentForm;
        Asyst.Workspace.openEntityDialog(form.EntityName, form.Data.Name, form.EntityId, function (dialog) {
            form.Load();
        });
    };

    Asyst.Workspace.currentFormClose = function (back) {
        var historySuperBack = function() {
            if (history.length > 1)
                history.back();
            else {
                window.open('', '_self', '');
                window.close();
            }
        };

        var form = Asyst.Workspace.currentForm;

        if (!back)
            back = getParameterByName('back');
        if (back) {
            if (back == 'back') {
                historySuperBack();
                //history.back();
            } else if (back == 'view') {
                window.location.href = "/asyst/browse/" + form.EntityName;
            } else if (back == 'home') {
                window.location.href = "/";
            } else if (back == 'close') {
                window.close();
            } else
                location.href = back;
        } else historySuperBack();

    };

    //Asyst-Workspace-Views
    Asyst.Workspace.views = {};
    Asyst.Workspace.currentView = '';
    Asyst.Workspace.addViews = function(views) {
        if (views.constructor !== Array)
            return;
        for (var i = 0; i < views.length; i++) {
            var ind = views[i].hasOwnProperty('name') ? views[i][name] : i;
            Asyst.Workspace.addView(views[i], ind);
        }
    };
    var _pages = [];
    
    Asyst.Workspace.addCurrentPage = function (page) {
        _pages.push(page);
        Asyst.Workspace.currentPage = page;
    };
    
    Asyst.Workspace.addView = function (view, name) {
        if (view.hasOwnProperty('preprocessFunctionText') && view.preprocessFunctionText.constructor == String && view.preprocessFunctionText !== "")
            view.preprocessFunction = new Function('viewEl', 'data', 'columns', 'options', 'groups', view.preprocessFunctionText);
        Asyst.Workspace.views[name] = view;
    };
    
    Asyst.Workspace._currentUser = null;
    Asyst.Workspace.initUser = function(user) {
        Asyst.Workspace._currentUser = user;
    };
    Object.defineProperty(Asyst.Workspace, "currentUser", {
        get: function () {
            if (this._currentUser === null) {
                this._currentUser = Asyst.API.AdminTools.getCurrentUser();
            }
            return this._currentUser;
        }
    });
} ());
