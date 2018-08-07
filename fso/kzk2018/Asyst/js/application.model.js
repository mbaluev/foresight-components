/* 
    Привязка данных к полям формы 
*/

//поверхнстное копирование
function clone(obj) {

    if (obj == null || typeof (obj) != 'object')
        return obj;
    if (obj.constructor == Array)
        return [].concat(obj);
    var temp = {};
    for (var key in obj)
        temp[key] = obj[key];
    return temp;
}

//кривой вариант indexOf'a для поиска с несовпадением типов
function findPos(array, value) {
    for (var c in array) {
        if (!array.hasOwnProperty(c)) continue;
        if (array[c] == value)
            return c;
    }
    return -1;
}

function find(array, value) {
    return findPos(array, value) !== -1;
}

var filesuccess = function (file) {
    $('#uploadFileButton').data('fileid', file.id);
    $('#fileplace').html('<a href="' + file.url + '" target="_blank">' + file.name + '</a>');
};

Binding = function () {
    var form = arguments[0];
    var initer = arguments[1];

    this.Form = form;
    this.ElementName = initer.elementName;
    this.Type = initer.type;
    this.Kind = initer.kind;
    this.Name = initer.name;
    this.Path = initer.path;
    this.Block = initer.block;
    this.PropertyName = initer.propertyName;
    this.Content = initer.content;
    this.IsRequired = initer.isRequired;
    this.Title = initer.title;
    this.IsShowHyperlink = initer.isShowHyperlink;
    this.DisplayMask = initer.displayMask;
    this.IsNeedData = initer.isNeedData;
    this.IsSyncDataLoad = initer.isSyncDataLoad;
    this.Precision = initer.precision;
    this.Scale = initer.scale;
    this.DataLength = initer.dataLength;


    form.Bindings[initer.elementName] = this;
};

/*Binding = function (form, elementName, type, kind, name, path, block, propertyName, content, isRequired, title, isShowHyperlink, isNeedData, isSyncDataLoad, displayMask, precision, scale) {
    this.Form = form;
    this.ElementName = elementName;
    this.Type = type;
    this.Kind = kind;
    this.Name = name;
    this.Path = path;
    this.Block = block;
    this.PropertyName = propertyName;
    this.Content = content;
    this.IsRequired = isRequired;
    this.Title = title;
    this.IsShowHyperlink = isShowHyperlink;
    this.DisplayMask = displayMask;
    this.IsNeedData = isNeedData;
    this.IsSyncDataLoad = isSyncDataLoad;
    this.Precision = precision;
    this.Scale = scale;


    form.Bindings[elementName] = this;
};*/

Binding.prototype.equals = function (a, b) {
    var v1 = a;
    var v2 = b;
    if (this.Type === "date") {
        v1 = Asyst.date.format(v1, Asyst.date.defaultDateFormat);
        v2 = Asyst.date.format(v2, Asyst.date.defaultDateFormat);
    }
    else if (this.Type === "datetime") {
        v1 = Asyst.date.format(v1, Asyst.date.defaultDateTimeFormat);
        v2 = Asyst.date.format(v2, Asyst.date.defaultDateTimeFormat);
    }
    else if (this.Type === "time") {
        v1 = Asyst.date.format(v1, Asyst.date.defaultTimeFormat);
        v2 = Asyst.date.format(v2, Asyst.date.defaultTimeFormat);
    }
    return equals(v1, v2);
};

Binding.prototype.changed = function () {
    return !this.equals(this.OldValue, this.NewValue);
};

Binding.prototype.value = function () {

    var get = function () {

        var $el = $("#" + this.Form.FormName + " #" + this.ElementName);

        if ($el.length === 0) {
            return GetPropertyValue(this.Form.Data, this.Path);
        }

        var nf = new NumberFormat();
        var value = $el.val();

        if (this.Kind == "date") {
            if (typeof this.DisplayMask !== "undefined")
                value = Asyst.date.parse(value, this.DisplayMask);
            else
                value = Asyst.date.parse(value, Asyst.date.defaultDateFormat);
        } else if (this.Kind == "datetime") {
            if (typeof this.DisplayMask !== "undefined")
                value = Asyst.date.parse(value, this.DisplayMask);
            else
                value = Asyst.date.parse(value, Asyst.date.defaultDateTimeFormat);
        } else if (this.Kind == "time") {
            if (typeof this.DisplayMask !== "undefined")
                value = Asyst.date.parse(value, this.DisplayMask);
            else
                value = Asyst.date.parse(value, Asyst.date.defaultTimeFormat);
        } else if (this.Type == "label") {
            value = $el.text();
        } else if (this.Type == "date") {
            if (typeof this.DisplayMask !== "undefined")
                value = Asyst.date.parse(value, this.DisplayMask);
            else
                value = Asyst.date.parse(value, Asyst.date.defaultDateFormat);
        } else if (this.Type == "datetime") {
            if (typeof this.DisplayMask !== "undefined")
                value = Asyst.date.parse(value, this.DisplayMask);
            else
                value = Asyst.date.parse(value, Asyst.date.defaultDateTimeFormat);
        } else if (this.Type == "time") {
            if (typeof this.DisplayMask !== "undefined")
                value = Asyst.date.parse(value, this.DisplayMask);
            else
                value = Asyst.date.parse(value, Asyst.date.defaultTimeFormat);
        } else if (this.Type == "checkbox") {
            value = $el[0].checked;
        } else if (this.Type == "number") {
            if (value || value === 0) {
                value = Asyst.number.parse(value);
                //nf.setNumber(value);
                //value = nf.toUnformatted();
            }
        }

        return value;

    };

    var set = function (value) {

        var $el = $("#" + this.Form.FormName + " #" + this.ElementName);
        var nf = new NumberFormat();

        if (value instanceof Date) {
            if (this.Type == "date") {
                if (typeof this.DisplayMask !== "undefined")
                    value = Asyst.date.format(value, this.DisplayMask, true);
                else
                    value = Asyst.date.format(value, Asyst.date.defaultDateFormat, true);
            }
            else if (this.Type == "time") {
                if (typeof this.DisplayMask !== "undefined")
                    value = Asyst.date.format(value, this.DisplayMask, true);
                else
                    value = Asyst.date.format(value, Asyst.date.defaultTimeFormat, true);
            }
            else if (this.Type == "datetime") {
                if (typeof this.DisplayMask !== "undefined")
                    value = Asyst.date.format(value, this.DisplayMask, true);
                else
                    value = Asyst.date.format(value, Asyst.date.defaultDateTimeFormat, true);
            }
            else
                if (typeof this.DisplayMask !== "undefined")
                    value = Asyst.date.format(value, this.DisplayMask, true);
                else
                    value = Asyst.date.format(value, Asyst.date.defaultFormat, true);
        }

        if (this.Type == "label") {
            var content = this.Content;//$("<div/>").html(this.Content).text();
            var text = "";
            if (content)
                text = templateProcessNames(content, this.Form.Data);
            else {
                if (typeof value == 'number') {
                    if (this.Kind == "decimal" && !this.DisplayMask && this.Scale > 0) {
                        var displayMask = "0,0";
                        displayMask += ".[";
                        for (var i = 0; i < this.Scale; i++)
                            displayMask += "0";
                        displayMask += "]";

                        this.DisplayMask = displayMask;
                    }
                    text = Asyst.number.format(value, this.DisplayMask);
                }
                else
                    text = StringToHtml(GetPropertyText(value, this, true));
            }

            $el.html(text);
        } else if (this.Type == "select" || this.Type == "account") {
            this.Form.LoadSelect(this.ElementName, value);
        } else if (this.Type == "checkbox") {
            $el[0].checked = (value == true);
        } else if (this.Type == "number") {
            if (value || value === 0) {
                if (this.Kind == "decimal" && !this.DisplayMask && this.Scale > 0) {
                    var displayMask = "0,0";
                    displayMask += ".[";
                    for (var i = 0; i < this.Scale; i++)
                        displayMask += "0";
                    displayMask += "]";

                    this.DisplayMask = displayMask;
                }
                var fmtValue = Asyst.number.format(value, this.DisplayMask);
                $el.val(fmtValue);
            }
            else
                $el.val("");
        } else {
            $el.val(value);
        }

        return value;
    };

    if (arguments.length > 0)
        return set.apply(this, arguments);
    else
        return get.apply(this);
};

Binding.prototype.displayValue = function () {

    var value = this.value();

    if (this.Type == "datetime") {
        value = Asyst.date.format(value, Asyst.date.defaultDateTimeFormat);
    } else if (this.Type == "date") {
        value = Asyst.date.format(value, Asyst.date.defaultDateFormat);
    } else if (this.Type == "time") {
        value = Asyst.date.format(value, Asyst.date.defaultTimeFormat);
    } else if (this.Type == "checkbox") {
        if (value)
            value = "Да";
        else
            value = "Нет";
    } else if (this.Type == "number") {
        value = Asyst.number.format(value, this.DisplayMask);
    }
    else if (this.Kind == "decimal" && !this.DisplayMask && this.Scale > 0) {
        var displayMask = "0,0";
        displayMask += ".[";
        for (var i = 0; i < this.Scale; i++)
            displayMask += "0";
        displayMask += "]";

        this.DisplayMask = displayMask;

        value = Asyst.number.format(value, this.DisplayMask);
    }
    else if (this.Type == "select" || this.Type == "account") {
        if (value) {
            var $el = $("#" + this.Form.FormName + " #" + this.ElementName);
            if ($el.length > 0) {
                if (jQuery.isArray(value)) {
                    value = "";
                    for (var i = 0; i < $el[0].options.length; i++)
                        if ($el[0].options[i].selected) {
                            if (value)
                                value += ", ";
                            value += $el[0].options[i].text;
                        }
                }
                else if ($el[0].selectedIndex >= 0)
                    value = $el[0].options[$el[0].selectedIndex].text;
            }
        }
    }

    return value;
};

/*
Правило
*/

Rule = function (form, name, script) {
    this.Form = form;
    this.Name = name;
    this.Script = script;

    form.Rules[name] = this;
};

/*
    Обработчик формы
*/

FormHandler = function (form, name, ruleName, actions, position) {
    this.Form = form;
    this.Name = name;
    this.RuleName = ruleName;
    this.Actions = actions;
    if (position === null || position === undefined)
        position = 0;
    this.Position = position;

    form.Handlers[name] = this;
};

/*
    Действие формы
*/

FormAction = function (id, elementName, trueAction, trueMessage, falseAction, falseMessage, trueScript, falseScript) {
    this.id = id;
    this.ElementName = elementName;
    this.TrueAction = trueAction;
    this.TrueMessage = trueMessage;
    this.FalseAction = falseAction;
    this.FalseMessage = falseMessage;
    this.TrueScript = trueScript;
    this.FalseScript = falseScript;
};

/*
    Привязка обработчиков к событиям
*/

EventHandler = function (form, elementName, eventName, handlerName) {
    this.Form = form;
    this.ElementName = elementName;
    this.EventName = eventName;
    this.HandlerName = handlerName;
    this.Handler = form.Handlers[handlerName];

    form.EventHandlers[elementName + eventName + handlerName] = this;
};

/*

Моделька, пичалька
    
*/

if (!Model) {
    var Model = {
        onFormLoad: []
    };
}

function AsystFormData(formName, isAutoForm) {
    Asyst.debugger('global');
    this.FormName = formName;
    this.IsAutoForm = isAutoForm;
    this.Data = {};

    Asyst.Workspace.addCurrentForm(this);

    var currentForm = Asyst.Workspace.currentForm;
    $(document).triggerHandler("AsystFormLoaded", currentForm);

    this.IsEditCard = function () {
        return this.hasOwnProperty('FormName') && this.FormName.indexOf('EditForm') != -1;
    };

    this.ApplyData = function (data) {
        var form = arguments.callee.context;
        form.Data = data;
        form.InitialData = clone(data);//даты ломаются!! JSON.parse(JSON.stringify(data));

        Asyst.API.AdminTools.saveStats({ page: location.href, pageTitle: form.GetTitle(), type: form.IsEditCard() ? 'editCard' : 'viewCard', action: 'open', entityId: form.Data.classid, dataId: form.Data.id }, true);

        if (data["__access__"]) {
            form.Access = data["__access__"];
        }

        form.userId = Asyst.Workspace.currentUser.Id;

        if (form.defaults) {
            for (var d in form.defaults) {
                form.Data[d] = form.defaults[d];

                if (form.Bindings.hasOwnProperty(d)) {
                    var binding = form.Bindings[d];
                    if ((binding.Kind == "date" || binding.Kind == "datetime") && form.Data[d] && !(form.Data[d] instanceof Date)) {
                        form.Data[d] = new Date(form.Data[d]);
                    }
                }
            }
        }
    };

    this.GetTitle = function () {
        if (this.Data) {
            if (this.Data.Title) {
                return this.Data.Title;
            } else if (this.Data.Name) {
                return this.Data.classtitle + ' ' + (this.Data.hasOwnProperty('Code') ? (this.Data.Code + '.') : '') + this.Data.Name;
            } else if (this.Data.hasOwnProperty("Number")) {
                return this.Data.classtitle + ' ' + this.Data.Number;
            } else if (this.defaults && this.defaults.Title) {
                return this.defaults.Title;
            } else if (this.defaults && this.defaults.Name) {
                return this.Data.classtitle + ' ' + (this.defaults.hasOwnProperty('Code') ? (this.defaults.Code + '.') : '') + this.defaults.Name;
            } else if (this.defaults && this.defaults.hasOwnProperty("Number")) {
                return this.Data.classtitle + ' ' + this.Data.Number;
            }
        }
    };


    this.ApplyData.context = this;

    this.LoadData = function () {

        this.EntityName = $("#" + this.FormName + "EntityName").val();
        this.EntityId = $("#" + this.FormName + "EntityId").val();

        if (this.IsAutoForm) {
            Asyst.APIv2.Entity.load({
                entityName: this.EntityName,
                dataId: this.EntityId,
                success: this.ApplyData,
                error: function (error, text) { ErrorHandler(Globa.ErrorLoad.locale(), error + "<br>" + text); },
                isAccessNeed: true,
                async: false
            });
        } else {
            Asyst.APIv2.Form.load({
                formName: this.FormName,
                dataId: this.EntityId,
                success: this.ApplyData,
                error: function (error, text) { ErrorHandler(Globa.ErrorLoad.locale(), error + "<br>" + text); },
                async: false
            });
        }
    };

    this.Load = function () {
        this.LoadData();
        $(document).triggerHandler("AsystFormDataLoaded", currentForm);
        this.Reset();
    };

    this.Validate = function (highlight) {

        var errors = [];
        this.RequestsNeeded = {};
        for (var elementName in this.Bindings) {
            var binding = this.Bindings[elementName];

            if (binding.Type != "label" && binding.Type != "template") {
                var value = binding.value();
                var selector = "#" + this.FormName + " #" + binding.ElementName;

                if (binding.Type == "number") {
                    var $el = $(selector);
                    var val = $el.val();
                    if (!Asyst.number.validate(val, binding)) {
                        setInputWarning(selector, true, Globa.IncorrectNumberFormat.locale());
                        errors.push({ 'binding': binding, 'message': Globa.WrongNumberFieldFormat.locale() + ' "' + binding.Title + '"' });
                    }
                }
                if (binding.Type == "date" || binding.Type == "datetime") {
                    if (!Asyst.date.validate(value) && value !== null) {
                        setInputWarning(selector, true, Globa.IncorrectDateFormat.locale());
                        errors.push({ 'binding': binding, 'message': Globa.WrongDateFieldFormat.locale() + ' "' + binding.Title + '"' });
                    }
                }

                binding.NewValue = value;
                binding.NewDisplayValue = binding.displayValue();
                if (this.Access && binding.changed()) {
                    var access = this.Access[binding.PropertyName ? binding.PropertyName : binding.ElementName];

                    if (access && access.ReviewCycleId > 0) {
                        if (!(access.IsSeparate)) {
                            this.RequestsNeeded[binding.ElementName] = {
                                ElementName: binding.ElementName,
                                PropertyName: binding.PropertyName,
                                ReviewCycleId: access.ReviewCycleId,
                                ReviewCycleName: access.ReviewCycleName,
                                ReviewCycleIsGrouping: access.ReviewCycleIsGrouping,
                                Title: binding.Title,
                                NewValue: binding.NewValue,
                                OldValue: binding.OldValue,
                                OldDisplayValue: binding.OldDisplayValue,
                                NewDisplayValue: binding.NewDisplayValue,
                                Reviewers: access.Reviewers,
                                Description: "",
                                ChangeRequestType: 0,
                                DocumentId: access.DocumentId
                            };
                        }
                        else {
                            var iter = 0;

                            Loader.show();

                            var errorHandler = function (error, text) {
                                Loader.hide();
                                ErrorHandler(Globa.ErrorLoadComboItems.locale(), error + "<br>" + text);
                            };
                            var picklist;
                            var success = function (data) {
                                Loader.hide();
                                picklist = data;
                            };
                            var findInPicklist = function (picklist, key) {
                                for (var c in picklist) {
                                    if (!picklist.hasOwnProperty(c)) continue;
                                    if (picklist[c]['Key'] !== null && picklist[c]['Key'] == key)
                                        return picklist[c]['Value'];
                                }
                            };

                            var callArg = {
                                data: this.Data,
                                success: success,
                                error: errorHandler,
                                async: false,
                                isPicklist: true
                            };
                            if (this.IsAutoForm) {
                                $.extend(callArg, { sourceType: 'entity', sourceName: this.EntityName, elementName: binding.PropertyName });
                            } else {
                                $.extend(callArg, { sourceType: 'form', sourceName: this.FormName, elementName: binding.ElementName });
                            }
                            Asyst.APIv2.DataSource.load(callArg);


                            //определяем, какие элементы удалены
                            for (var subValue in binding.OldValue) {
                                if (!binding.OldValue.hasOwnProperty(subValue)) continue;


                                if (!find(binding.NewValue, binding.OldValue[subValue])) {
                                    var value = Array();
                                    value.push(binding.OldValue[subValue]);

                                    this.RequestsNeeded[binding.ElementName + iter] = {
                                        ElementName: binding.ElementName,
                                        PropertyName: binding.PropertyName,
                                        ReviewCycleId: access.ReviewCycleId,
                                        ReviewCycleName: access.ReviewCycleName,
                                        ReviewCycleIsGrouping: access.ReviewCycleIsGrouping,
                                        Title: binding.Title,
                                        NewValue: Array(""),
                                        OldValue: value,
                                        OldDisplayValue: findInPicklist(picklist, binding.OldValue[subValue]),
                                        NewDisplayValue: "",
                                        Reviewers: access.Reviewers,
                                        Description: "",
                                        ChangeRequestType: 2,
                                        DocumentId: access.DocumentId
                                    };
                                    iter = iter + 1;
                                }
                            }
                            //а теперь проверяем, какие были добавлены
                            for (var subValue in binding.NewValue) {
                                if (!binding.NewValue.hasOwnProperty(subValue)) continue;

                                if (!find(binding.OldValue, binding.NewValue[subValue]) && binding.NewValue[subValue] != "") {
                                    var value = Array();
                                    value.push(binding.NewValue[subValue]);

                                    this.RequestsNeeded[binding.ElementName + iter] = {
                                        ElementName: binding.ElementName,
                                        PropertyName: binding.PropertyName,
                                        ReviewCycleId: access.ReviewCycleId,
                                        ReviewCycleName: access.ReviewCycleName,
                                        ReviewCycleIsGrouping: access.ReviewCycleIsGrouping,
                                        Title: binding.Title,
                                        NewValue: value,
                                        OldValue: Array(""),
                                        OldDisplayValue: "",
                                        NewDisplayValue: findInPicklist(picklist, binding.NewValue[subValue]),
                                        Reviewers: access.Reviewers,
                                        Description: "",
                                        ChangeRequestType: 1,
                                        DocumentId: access.DocumentId
                                    };
                                    iter = iter + 1;
                                }
                                iter = iter + 1;
                            }

                        }
                    }
                }

                if (binding.IsRequired) {
                    if ((!value && (value + '') != "false" && value !== 0) || (value && value.constructor == Array && value.join() == "")) {
                        errors.push({ 'binding': binding, 'message': Globa.FillField.locale() + ' "' + binding.Title + '"' });
                        if (highlight) $('#' + this.FormName + ' ' + binding.Block).addClass('error');
                    } else if (highlight)
                        $('#' + this.FormName + ' ' + binding.Block).removeClass('error');
                }
            }
        };

        $(document).trigger("AsystFormBeforeValidate", this);
        errors = this.ProcessEventHandlers('validate', errors);
        $(document).trigger("AsystFormAfterValidate", this);

        return errors;
    };

    this.ShowErrors = function (errors, clickFunc) {
        var msg = '<ul>';
        for (var i in errors) {
            if (!errors.hasOwnProperty(i)) continue;
            var convertedError = $('<div />').html(errors[i].message).text();
            if (errors[i].binding)
                msg += '<li><a href="#" errorid="' + i + '">' + convertedError + '</a></li>';
            else
                msg += '<li>' + convertedError + '</li>';
        }
        msg += '</ul>';


        Dialog(Globa.Saving.locale(), msg, undefined, "validate-modal");


        var click = function (event) {
            if (clickFunc)
                clickFunc(event.data);
            event.preventDefault();
        };
        for (var i in errors) {
            if (!errors.hasOwnProperty(i)) continue;
            $('#validate-modal [errorid=' + i + ']').on('click', errors[i], click);
        }
    };

    this.CheckCanSave = function () {
        this.Update();

        var errors = this.Validate(true);

        if (errors.length > 0) {
            this.ShowErrors(errors, function (error) {
                Dialogs.Dock('validate-modal');
                //$("#validate-modal").parent().css('z-index', 1100);
                Asyst.Workspace.currentForm.selectElement(error.binding.Name);
            });
            /*var msg = '<ul>';
            for (var i in errors) {
                var convertedError = $('<div />').html(errors[i].message).text();
                if (errors[i].binding)
                    msg += '<li><a href="#" onclick="Dialogs.Dock(\'validate-modal\'); Asyst.Workspace.currentForm.selectElement(\'' + errors[i].binding.Name + '\');void(0)">' + convertedError + '</a></li>';
                else
                    msg += '<li>' + convertedError + '</li>';
            }
            msg += '</ul>';

            Dialog(Globa.Saving.locale(), msg, undefined, "validate-modal");
            */
            return false;
        }

        return true;
    };

    this.Save = function (success, reload, async) {
        Asyst.debugger('global');

        if (async === null || async === undefined) async = false;

        if (!this.CheckCanSave())
            return false;

        try {
            $(document).trigger("AsystFormBeforeSave", this);
            this.ProcessEventHandlers('save', this);
        }
        catch (e) {
            ErrorHandler(Globa.Saving.locale(), e);
            return;
        }

        var form = this;
        var postData = {};
        for (var prop in this.Data)
            postData[prop] = this.Data[prop];

        var doSave = function (locSuccess) {

            var successF = function (data) {
                var stats = { page: location.href, pageTitle: form.GetTitle(), type: 'editCard', action: 'save', entityId: form.Data.classid, dataId: form.Data.id };
                if (form.isNew) {
                    form.EntityId = data.id;
                    form.isNew = false;
                    $("#" + form.FormName + "EntityId").val(data.id);
                    $.extend(stats, { action: 'create', dataId: data.id });
                }

                Asyst.API.AdminTools.saveStats(stats, true);


                form.LoadData();
                form.ProcessEventHandlers('saved', this);
                $(document).trigger("AsystFormAfterSave", this);

                if (reload + '' != 'false')
                    form.Reset();

                if (locSuccess)
                    locSuccess();
            };

            var errorF = function (error, text) {
                if (error == Globa.LicenseError) {
                    return;
                }
                else if (error == Globa.ErrorTooLongText.locale()) {
                    ErrorHandler(error, Globa.SavingError.locale());
                }
                else if (error == Globa.ErrorOnCheckSave.locale()) {
                    NotifyError(error, text);
                }
                else {
                    ErrorHandler(Globa.SavingError.locale(), Globa.SavingError.locale());
                }
            };

            if (form.IsAutoForm) {
                Asyst.APIv2.Entity.save({ entityName: form.EntityName, dataId: form.EntityId, data: postData, success: successF, error: errorF, async: async });
            } else {
                Asyst.APIv2.Form.save({ formName: form.FormName, dataId: form.EntityId, data: postData, success: successF, error: errorF, async: async });
            }
        };

        if (!$.isEmptyObject(this.RequestsNeeded)) {
            this.ShowChangeRequestDialog(this.RequestsNeeded, postData, doSave, success);
        }
        else
            doSave(success);
    };

    //создание элемента ЗИ по элементу form.Document
    this.MakeFileChangeRequest = function (document, filename, operation) {
        if (document && document.access && document.access.ReviewCycleId > 0) {
            return {
                ElementName: document.identifier,
                PropertyName: document.identifier,
                ReviewCycleId: document.access.ReviewCycleId,
                ReviewCycleName: document.access.ReviewCycleName,
                ReviewCycleIsGrouping: access.ReviewCycleIsGrouping,
                Title: document.name,
                NewValue: filename,
                OldValue: filename,
                OldDisplayValue: filename,
                NewDisplayValue: filename,
                Reviewers: document.access.Reviewers,
                Description: "",
                ChangeRequestType: 0,
                DocumentId: document.access.DocumentId
            };
        }
    };

    this.MakeActivityPhaseChangeRequest = function (access, binding, nextPhaseId, nextPhaseName) {
        return {
            ElementName: binding.ElementName,
            PropertyName: binding.PropertyName,
            ReviewCycleId: access.ReviewCycleId,
            ReviewCycleName: access.ReviewCycleName,
            ReviewCycleIsGrouping: access.ReviewCycleIsGrouping,
            Title: binding.Title,
            NewValue: nextPhaseId,
            OldValue: binding.Form.Data[binding.ElementName],//binding.OldValue,
            OldDisplayValue: binding.OldDisplayValue,
            NewDisplayValue: nextPhaseName,
            Reviewers: access.Reviewers,
            Description: "",
            ChangeRequestType: 0,
            DocumentId: access.DocumentId
        };
    };

    //создание ЗИ
    //список запросов и набор данных, из которого нужно удалять данные попавшие под ЗИ(опционально)
    //doSave - функция с одни аргументом success, которая будет вызвана по OK в диалоге.
    this.ShowChangeRequestDialog = function (requestsNeeded, postData, doSave, success) {



        //чистим отправляемые на сохранение данные от идущих через ЗИ
        var processPostData = function (postData, requestsNeeded) {
            for (var r in requestsNeeded) {
                var request = requestsNeeded[r];

                if (postData && postData.hasOwnProperty(request.ElementName)) {
                    delete postData[request.ElementName];
                    delete postData[request.ElementName + "Id"];
                    delete postData[request.ElementName + "Items"];
                }
            }
        };
        processPostData(postData, requestsNeeded);

        if (Asyst.ChangeRequest.showCard) {
            Asyst.debugger('imw');
            var form = Asyst.Workspace.currentForm;
            var allRequests = clone(requestsNeeded);

            var hasGrouping = false, needGrouping = false;
            var grouper = {};
            for (var ctx in requestsNeeded) {
                if (requestsNeeded[ctx].ReviewCycleIsGrouping && grouper.hasOwnProperty(requestsNeeded[ctx].ReviewCycleId)) {
                    hasGrouping = true;
                }
                else {
                    grouper[requestsNeeded[ctx].ReviewCycleId] = [];
                }
                grouper[requestsNeeded[ctx].ReviewCycleId].push(clone(requestsNeeded[ctx]));
            }

            function showCRCard(ctx) {
                var request = requestsNeeded[ctx];
                var fields = clone(request);
                $.extend(fields, {
                    State: 1,
                    EntityId: form.Data.classid,
                    DataId: form.Data.id
                });

                var changeRequestformName = 'ChangeRequestEditForm';
                Asyst.APIv2.Entity.load({
                    entityName: 'reviewCycle',
                    dataId: request.ReviewCycleId,
                    isAccessNeed: false,
                    async: false,
                    success: function (reviewCycle) {
                        if (reviewCycle.ReviewCycleCard && reviewCycle.ReviewCycleCard.EditForm) {
                            changeRequestformName = reviewCycle.ReviewCycleCard.EditForm;
                        }
                    }
                });


                Asyst.ChangeRequest.Storage = {
                    form: form,
                    request: fields,
                    requestsNeeded: allRequests,
                    groupedCR: needGrouping ? grouper[requestsNeeded[ctx].ReviewCycleId] : undefined,
                    needGrouping: needGrouping

                };
                Asyst.Workspace.openEntityDialog(changeRequestformName, 'Запрос на изменение', 'new', function () { }, fields);

                //если включена группировка, то вычищаем из основного массива полей для ЗИ уже попавшие в группу
                var rcId = request.ReviewCycleId;
                for (var c in requestsNeeded) {
                    if (c == ctx || (needGrouping && requestsNeeded[c].ReviewCycleId == rcId)) {
                        delete requestsNeeded[c];
                    }
                }

                var nextCard = function (event, form) {
                    if (form.FormName == changeRequestformName) {
                        $(document).off('AsystFormClosed', nextCard);
                        var next = null;
                        for (var c in requestsNeeded) {
                            next = c;
                            break;
                        }
                        if (next) {
                            showCRCard(next);
                        } else {/* все пукнты ЗИ обработаны - теперь принятие ЗИ, если нужно */

                            Loader.show(null, 'Обработка запроса на изменение');
                            setTimeout(function () {
                                doSave(success);

                                Asyst.APIv2.DataSet.load({
                                    name: 'loadCRAutoAgree',
                                    data: { DataId: Asyst.ChangeRequest.Storage.form.Data.id, UserId: Asyst.Workspace.currentUser.Id },
                                    async: true,
                                    success: function (d) {
                                        for (var i = 0; i < d[0].length; i++) {
                                            var item = d[0][i];
                                            Asyst.APIv2.ChangeRequest.agree({ entityName: 'empty', formName: 'empty', dataId: item.DataId, requestId: item.ChangeRequestId, comment: '##Автосогласование##'.locale(), async: false });
                                        }
                                        if (d[0].length > 0) {
                                            Asyst.Workspace.currentForm.Load();
                                        }
                                        Loader.hide();
                                    }
                                });
                            }, 50);
                        }
                    }
                };

                $(document).on('AsystFormClosed', nextCard);
            }

            var groupContinue = function () {
                needGrouping = true;
                $('#CRNeedGroupingDialog').modal('hide');
                showCRCard(Object.keys(requestsNeeded)[0]);
            }

            var noGroupContinue = function () {
                needGrouping = false;
                $('#CRNeedGroupingDialog').modal('hide');
                showCRCard(Object.keys(requestsNeeded)[0]);
            }

            if (hasGrouping) {
                //needGrouping = confirm('Группировать ЗИ по цепочкам согласования?');
                needGrouping = Dialogs.Confirm('Групповые ЗИ', 'Группировать запросы на изменение по согласующим?', groupContinue, noGroupContinue, 'CRNeedGroupingDialog');
            }
            else {
                noGroupContinue();
            }



        } else { //устаревшая ветка - по сути не используется, т.к. всегда Asyst.ChangeRequest.showCard == true
            var requestsHtml = '';
            var requestDialogId = '';
            if (!$.isEmptyObject(requestsNeeded)) {
                for (var r in requestsNeeded) {
                    var request = requestsNeeded[r];

                    var valueStyle = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 4px;';

                    var reviewersHtml = '';
                    if (jQuery.isArray(request.Reviewers)) {
                        var ri;
                        for (ri = 0; ri < request.Reviewers.length; ri++) {
                            if (reviewersHtml)
                                reviewersHtml += ', ';
                            reviewersHtml += request.Reviewers[ri].Name;
                        }
                    }
                    Asyst.APIv2.Document.getFiles({
                        data: this.Data,
                        async: true,
                        success: function (data) {
                            if (data) {
                                form.Documents = data.documents;
                                form.Documents.fileCount = function () {
                                    var cnt = 0;
                                    for (var d in form.Documents)
                                        if (jQuery.isArray(form.Documents[d].files))
                                            cnt += form.Documents[d].files.length;
                                    return cnt;
                                };
                            }
                        }
                    });

                    //                var filesuccess = function(file) {
                    //$('#uploadFileButton').data('fileid',file.id); 
                    //$('#fileplace').html('<a href="'+file.url+'">' + file.filename+'</a>');
                    //};

                    if (reviewersHtml)
                        reviewersHtml = '<div> ' + Globa.Reviewers.locale() + ': ' + reviewersHtml + '</div>';

                    requestsHtml += '<div class="alert alert-block alert-normal fade in" id="request-' + request.PropertyName + '" style="padding: 4px 35px 4px 4px;"><button class="close" data-dismiss="alert" type="button">×</button>';
                    //requestsHtml += '<span class="alert-heading" rel="tooltip" data-html="true" title data-original-title="' + '<span class=\'control-label\'>' + Globa.Agreement.locale() + ': </span><span class=\'controls\'>' + request.ReviewCycleName + reviewersHtml + '</span>' + '">' + Globa.ChangeRequestField.locale() + ' &quot;' + request.Title + '&quot;</span>';
                    requestsHtml += '<span class="alert-heading">' + Globa.ChangeRequestField.locale() + ' &quot;' + request.Title.locale() + '&quot;</span>';
                    requestsHtml += '<div class="form form-horizontal" style="border-top: 1px solid #EEEEEE; margin-top:4px; padding-top:4px">';
                    requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.OldValue.locale() + ':</label><div class="controls" style="' + valueStyle + '" rel="tooltip" title="' + toHtml(request.OldDisplayValue) + '">' + toHtml(request.OldDisplayValue) + '</div></div>';
                    requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.NewValue.locale() + ':</label><div class="controls" style="' + valueStyle + '" rel="tooltip" title="' + toHtml(request.NewDisplayValue) + '">' + toHtml(request.NewDisplayValue) + '</div></div>';
                    requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.Agreement.locale() + ':</label><div class="controls" rel="tooltip" data-html title data-original-title="' + reviewersHtml + '">' + request.ReviewCycleName + '</div></div>';
                    if (request.hasOwnProperty("DocumentId") && request.DocumentId != 0)
                        //requestsHtml += ' <div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.AttachedFile.locale() + ':</label><div class="controls"><button class="btn" id="uploadFileButton" onclick="uploadDocument(this, null, ' + request.DocumentId + ', ' + this.Data.ActivityId + ', null, function (file) {$(\'#uploadFileButton\').data(\'fileid\',file.id); $(\'#fileplace\').html(\'<a href=""\'+file.url+\'"">\' + file.filename+\'</a>\');})"><i class="icon-upload"></i>&nbsp;' + Globa.Attach.locale() + '</button><span id="fileplace"></span></div></div>';
                        requestsHtml += ' <div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.AttachedFile.locale() + ':</label><div class="controls"><button class="btn" id="uploadFileButton" onclick="uploadDocument(this, null, ' + request.DocumentId + ', ' + this.Data.ActivityId + ', {IsChangeRequest: true, ReviewCycleId: ' + request.ReviewCycleId + '}, filesuccess)"><i class="icon-upload"></i>&nbsp;' + Globa.Attach.locale() + '</button><span id="fileplace"></span></div></div>';
                    var reportLink = $('#changetLog').attr('href');
                    if (typeof reportLink == 'undefined')
                        reportLink = '/ReportServer/Pages/ReportViewer.aspx?%2fReports%2fCardLog&rs:Command=Render&DataId=' + this.Data.ActivityId + '&EntityName=' + this.Data.entityname;
                    requestsHtml += '<div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.ChangeHistory.locale() + ':</label><div class="controls"><a href="' + reportLink + '" style="width:100%" target="_blank">' + Globa.ChangeHistory.locale() + '</a></div></div>';
                    requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.Comment.locale() + ':</label><div class="controls"><textarea id="requestField' + request.PropertyName + '" style="width:95%;" rows="2" rel="tooltip" title="Причины и обоснование необходимости изменения. Опишите, почему возникла необходимость в данном изменении: какой из рисков реализовался, какие предположения оказались неверными и проч. Обоснуйте, почему необходимо принять изменение"></textarea><span class="required-input" rel="tooltip" title="' + Globa.Required.locale() + '"></span></div></div>';
                    requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.Comment1.locale() + ':</label><div class="controls"><textarea id="comment1' + request.PropertyName + '" style="width:100%;" rows="2" rel="tooltip" title="Статус по выполнению на текущий момент. Опишите, что уже было сделано для выполнения первоначальной задачи, в том числе какие материальные и нематериальные ресурсы потрачены"></textarea></div></div>';
                    requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.Comment2.locale() + ':</label><div class="controls"><textarea id="comment2' + request.PropertyName + '" style="width:100%;" rows="2" rel="tooltip" title="Альтернативные варианты. Их плюсы и минусы. Укажите, какие есть варианты кроме утверждения данного запроса, в чем их плюсы и минусы по сравнению с данным решением"></textarea></div></div>';
                    requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><label class="control-label">' + Globa.Comment3.locale() + ':</label><div class="controls"><textarea id="comment3' + request.PropertyName + '" style="width:100%;" rows="2" rel="tooltip" title="Ресурсы и наработки, не востребованные в случае принятия изменения. Какие материальные и не материальные результаты (наработки, заделы, результаты закупок и т.д.), полученные на текущий момент, не будут востребованы в случае принятия изменения. Напишите, какие уже были понесены затраты, что делать с имеющимися заделами и неликвидами"></textarea></div></div>';
                    requestsHtml += '  <div class="control-group" style="margin-bottom:5px"><label class="control-label"></label><div class="controls"><input type="checkbox" id="missprint' + request.PropertyName + '" />' + Globa.Missprint.locale() + '</div></div>';
                    requestsHtml += '</div>';

                    requestsHtml += '</div>';
                }
            }

            if (requestsHtml) {
                var crSuccess = function () {
                    Loader.show(undefined, Globa.Saving.locale());
                    try {
                        var form = Asyst.Workspace.currentForm;
                        var requests = [];
                        for (var r in requestsNeeded) {
                            var request = requestsNeeded[r];
                            var $request = $('#request-' + request.PropertyName);
                            if ($request.length > 0) {
                                var $description = $('#requestField' + request.PropertyName);
                                request.Description = $description.val();

                                var comment1 = $('#comment1' + request.PropertyName);
                                request.Comment1 = comment1.val();

                                var comment2 = $('#comment2' + request.PropertyName);
                                request.Comment2 = comment2.val();

                                var comment3 = $('#comment3' + request.PropertyName);
                                request.Comment3 = comment3.val();

                                var fileUpload = $('#uploadFileButton');
                                if (fileUpload.length > 0 && typeof fileUpload.data('fileid') !== "undefined")
                                    request.FileId = fileUpload.data('fileid');
                                else request.FileId = null;

                                var checkMissprint = $('#missprint' + request.PropertyName);
                                if (checkMissprint.length > 0 && typeof checkMissprint[0].checked !== "undefined")
                                    request.Missprint = checkMissprint[0].checked;
                                else
                                    request.Missprint = false;

                                if (!request.Description) {
                                    alert(Globa.EnterCommentForField.locale() + ' "' + request.Title + '"');
                                    return;
                                }
                                requests.push(request);
                            }
                        }


                        if (requests.length > 0) {
                            Asyst.APIv2.ChangeRequest.save({ entityName: form.EntityName, formName: form.FormName, dataId: form.Data.id, data: { Requests: requests }, async: false });
                        }
                        if (success)
                            success();
                    } finally {
                        Loader.hide();
                    }

                    $('#' + requestDialogId).modal('hide');
                };

                requestsHtml = requestsHtml;
                var locDoSave = function () {
                    doSave(crSuccess);
                };
                requestDialogId = Dialog(Globa.Saving.locale(), requestsHtml, [{ text: Globa.Continue.locale(), cls: 'btn-warning', click: locDoSave, close: false }, { text: Globa.Cancel.locale() }]);

                $('#' + requestDialogId).css({ 'top': '10px', 'width': '850px', 'left': '40%' });
                $('#' + requestDialogId).attr('data-backdrop', 'static');
                //добавляем data-html для нового тултипа bootstrapа
                $('[rel="tooltip"]').attr('data-html', 'true');

                $('[rel="tooltip"]').tooltip();
                $('[rel="tooltip"]').on('hidden', function () { return false; });
            }
        }
    };

    // Загружает данные в форму
    this.Reset = function () {
        var self = this;

        if (self.TitleFormula) {
            with (self.Data)
            self.Title = eval(self.TitleFormula);
        }

        var access;
        var $cr;

        var sortedEventHandlers = Enumerable.From(Object.values(self.EventHandlers)).OrderBy('$.Handler.Position').ThenBy('$.HandlerName').ToArray();

        for (var i = 0; i < sortedEventHandlers.length; i++) {
            var event = sortedEventHandlers[i];
            if (event.ElementName) {
                var $el = $('#' + this.FormName + ' #' + event.ElementName);
                (function () {
                    var handler = event.Handler;

                    if (handler.func) {
                        $el.on(event.EventName, handler.func);
                    }

                    handler.func = function () {
                        self.ProcessHandler(handler, self);
                    };

                    $el.on(event.EventName, handler.func);
                })();
            }
        }


        $('#' + Asyst.Workspace.currentForm.FormName + ' .required-change-request').remove();
        $('#' + Asyst.Workspace.currentForm.FormName + ' .required-phase-input').remove();
        $('#' + Asyst.Workspace.currentForm.FormName + ' .on-change-request').remove();
        if (this.Access) {
            for (var a in this.Access) {
                if (a && this.Access.hasOwnProperty(a)) {
                    access = this.Access[a];

                    if (access.ItemType == "formElement" || access.ItemType == "field" || access.ItemType == "role") {
                        var $a = $('#' + Asyst.Workspace.currentForm.FormName + ' #' + a);
                        if ($a.length === 0)
                            $a = $('#' + Asyst.Workspace.currentForm.FormName + ' #' + a + 'Id');

                        //для скрытых элементов скипаем дальнейшую обработку - матрица для них неприменима
                        if ($a.attr('type') === 'hidden') continue;

                        if (!access.IsVisible) {
                            $a.hide();
                        } else {
                            //$a.show();
                        }
                        if (access.IsReadonly) {
                            $a.addClass("disabled");
                            $a.attr("disabled", "");
                        } else {
                            //$a.removeClass("disabled");
                            //$a.removeAttr("disabled");
                        }
                        var b = $a.parent().find('.required-input');
                        //если есть спан с признаком обязательности, то остальные значки цепляем к нему.
                        if (b.length !== 0)
                            $a = b;
                        if (access.ReviewCycleId > 0 && this.IsEditCard() && access.ChangeRequestId == 0) {
                            $a = $a.after('<span class="required-change-request" rel="tooltip" title="' + Globa.JSRequiredChangeRequest.locale() + '"></span>');
                        }
                        if (access.IsRequired) {
                            if ($a.parent().find('.required-phase-input').length === 0)
                                $a = $a.after('<span class="required-phase-input" rel="tooltip" title="' + Globa.JSRequiredPhase.locale() + '"></span>');
                        }

                        if (access.ChangeRequestId && access.ChangeRequestId > 0) {
                            $cr = $('#' + Asyst.Workspace.currentForm.FormName + ' #' + a + 'ChangeRequest');
                            if ($cr.length === 0) {
                                $cr = $a.after('<a href="#" class="on-change-request" rel="tooltip" title="' + Globa.ChangeRequest.locale() + '" onclick="ChangeRequestDialogById(Asyst.Workspace.getForm(Asyst.Workspace.getFormCount() - 2), ' + access.ChangeRequestId + ', true); void(0)">' + '</a>');
                            }
                        }
                    }
                }
            }
        }
        for (var elementName in this.Bindings) {

            var binding = this.Bindings[elementName];
            var selector = "#" + this.FormName + " #" + elementName;
            var value = GetPropertyValue(this.Data, binding.Path);
            binding.OldValue = value;

            var $input;

            if (this.Access) {
                access = this.Access[binding.PropertyName];
                if (!access)
                    access = this.Access[binding.ElementName];

                if (access) {
                    if (!access.IsVisible) {
                        $("#" + this.FormName + " " + binding.Block).hide();
                    } else {
                        //$("#" + this.FormName + " " + binding.Block).show();
                        if (access.IsReadonly && binding.Type != "template" && binding.Type != "label") {
                            $input = $(selector);
                            $input.addClass("disabled");
                            $input.attr("disabled", "");
                        } /*else if (access.ChangeRequestId && access.ChangeRequestId > 0) {
                            $cr = $(selector + 'ChangeRequest');
                            if ($cr.length === 0) {
                                $input = $(selector);
                                $cr = $input.after('<a href="#" rel="tooltip" title="' + Globa.ChangeRequest.locale() + '" onclick="ChangeRequestDialogById(Asyst.Workspace.getForm(Asyst.Workspace.getFormCount() - 2), ' + access.ChangeRequestId + '); void(0)"><img id="' + a + 'ChangeRequest' + '" src="/asyst/img/lock.png"></a>');
                            }
                        }*/
                    }
                }
            }

            if (binding.Type == "template") {
                try {
                    this.LoadTemplate(elementName, binding.Content);
                } catch (error) {
                    console.error({ template: elementName, error: error });
                }
            }
            else {
                binding.value(value);
                binding.OldDisplayValue = binding.displayValue();
            }

            if (binding.Type === "date") {
                $input = $(selector);
                $input.datepicker({ DateTimeFormat: Asyst.date.defaultDateFormat });
            }
            else if (binding.Type === "datetime") {
                $input = $(selector);
                $input.datepicker({ DateTimeFormat: Asyst.date.defaultDateTimeFormat });
            }

            if (binding.Type == "number") {
                $(selector).blur(function (e) {
                    var src = $(this).val();

                    if (src) {
                        if (!Asyst.number.validate(src, binding))
                            setInputWarning(this, true, Globa.IncorrectNumberFormat.locale());
                        else {
                            setInputWarning(this, false);

                            var nf = new NumberFormat();
                            nf.setNumber(src);
                            $(this).val(nf.toFormatted());
                        }
                    }
                });
            }
        }

        for (var elName in this.Views) {
            var view = this.Views[elName];
            Asyst.APIv2.View.load({
                viewName: view.ViewName,
                data: this.Data,
                success: function (data) {
                    for (var colIdx in data.columns) {
                        var column = data.columns[colIdx];
                        if (column.formatter)
                            column.formatter = eval(column.formatter);
                        else
                            column.formatter = Grid.DefaultFormatter;
                    }
                    view.Data = data.data;
                    view.Columns = data.columns;
                    view.Grid = Grid.Create(view.Name, view.Data, view.Columns);
                },
                async: false
            });
        }

        $(document).trigger("AsystFormBeforeOpen", this);
        this.ProcessEventHandlers('open', this);
        $(document).trigger("AsystFormAfterOpen", this);

        for (var idx in Model.onFormLoad)
            if (Model.onFormLoad.hasOwnProperty(idx))
                Model.onFormLoad[idx](this);

        try {
            if (this.Data.Title)
                document.title = this.Data.Title;
            else if (this.Data.Name)
                document.title = this.Data.Name;
        }
        catch (error) {

        }

        //добавляем data-html для нового тултипа bootstrapа
        $('[rel="tooltip"]').attr('data-html', 'true');
        $('[rel="tooltip"]').attr('data-container', 'body');

        $('[rel="tooltip"]').tooltip();
        $('[rel="tooltip"]').on('hidden', function () { return false; });
        $('[rel="popover"]').on('hidden', function () { return false; });
    };

    this.ProcessEventHandlers = function (eventName, context) {

        var sortedHandlers = Enumerable.From(Object.values(this.EventHandlers))
            .Where(function (a) { return !a.ElementName && a.EventName == eventName; })
            .OrderBy('$.Handler.Position').ThenBy('$.HandlerName')
            .Select("$.Handler").ToArray();

        for (var i = 0; i < sortedHandlers.length; i++) {

            var handler = sortedHandlers[i];
            try {
                context = this.ProcessHandler(handler, context);
            } catch (e) {
                console.error('error at handler "' + handler.Name + '"');
                console.error(e);
                throw e;
            }
        }
        return context;
    };

    this.ProcessHandler = function (handler, context) {
        var binding;
        var $element;
        var rule;
        var checked = true;

        if (handler.RuleName) {
            rule = this.Rules[handler.RuleName];
            if (rule) {
                if (rule.Script) {
                    with (this) {
                        checked = eval(rule.Script);
                    }
                }
                else {
                    //Переведено на API.Form
                    //checked = Asyst.protocol.get("/asyst/rule/FormsRules/" + handler.RuleName, "POST", this.Data, this);
                    checked = Asyst.APIv2.Form.handlerCheckRule({ ruleName: handler.RuleName, data: this.Data, async: false });
                }
            }
        }

        for (var actionName in handler.Actions) {
            var action = handler.Actions[actionName];
            context = this.ProcessAction(handler, action, checked, context);
        }

        return context;
    };

    this.ProcessAction = function (handler, action, checked, context) {
        var binding;
        var selector;
        var $element;
        var access;

        if (action.ElementName) {
            binding = this.Bindings[action.ElementName];
            if (binding) {
                selector = "#" + this.FormName + " " + binding.Name;
            }
            else
                selector = "#" + this.FormName + " #" + action.ElementName;
        }
        else {
            selector = "#" + this.FormName;
        }

        $element = $(selector);

        var act = "";
        var msg = "";
        var script = "";
        if (checked) {
            act = action.TrueAction;
            msg = action.TrueMessage;
            script = action.TrueScript;
        }
        else {
            act = action.FalseAction;
            msg = action.FalseMessage;
            script = action.FalseScript;
        }

        if (binding) {
            if (msg)
                setInputWarning(selector, true, msg);
            else
                setInputWarning(selector, false);
        }

        if (act == "validationerror") {
            if (msg) {
                if (context.constructor === Array) {
                    context.push({ 'binding': binding, 'message': msg });
                }
                if (binding)
                    $('#' + this.FormName + ' ' + binding.Block).addClass('error');
            }
            else if (binding)
                $('#' + this.FormName + ' ' + binding.Block).removeClass('error');
        }
        else if (act == "enable") {
            enableInput(selector, true);
        }
        else if (act == "disable") {
            enableInput(selector, false);
        }
        else if (act == "show") {
            if (binding)
                $("#" + this.FormName + " " + binding.Block).show();
            else
                $element.show();
        }
        else if (act == "hide") {
            if (binding)
                $("#" + this.FormName + " " + binding.Block).hide();
            else
                $element.hide();
        }
        else if (act == "required") {
            if (binding) {
                binding.IsRequired = true;

                //добавляем звездочку                
                if ($element.parent().find('.required-input').length == 0) {
                    $element.after('<span class="required-input" rel="tooltip" title="Обязательно"></span>')
                }
            }
        }
        else if (act == "nonrequired") {
            if (binding) {
                binding.IsRequired = false;
                //убираем звездочку                
                $element.parent().find('.required-input').remove();
            }
        }
        else if (act == "script") {
            if (script) {
                with (this) {
                    eval(script);
                }
            } else {
                //перенесено на вызов API.Form
                //Asyst.protocol.send("/asyst/form/" + this.FormName + "/" + handler.Name + "/" + action.id + "/" + checked, "POST", this.Data, this);
                Asyst.APIv2.Form.handlerAction({ formName: this.FormName, handlerName: handler.Name, actionId: action.id, checked: checked, data: this.Data, async: false });
            }
        }

        return context;
    };

    // Обновляет данные из формы
    this.Update = function (updateNewOnly) {
        for (var elementName in this.Bindings) {
            var binding = this.Bindings[elementName];

            if (binding.Type != "label" && binding.Type != "template") {
                if (!updateNewOnly || !this.Data[binding.Path]) {

                    this.Data[binding.Path] = binding.value();
                }
            }
        }
    };

    this.SelectCount = 0;
    this.SelectData = {};
    this.LoadSelect = function (elementName, value, reloadList) {
        
        var binding, formData, hasHierarchy, select, renderTreeCombobox, renderChosen, currentFormElement;

        binding = this.Bindings[elementName];
        formData = this;
        formName = Asyst.Workspace.currentForm.FormName;
        currentFormElement = document.getElementById(formName);
        select = currentFormElement.querySelector("select#" + elementName);
        hasHierarchy = select && select.getAttribute("data-has-hierarchy") === "true";

       

        function isSelectedNode(val) {
            var selectedOptions = value;
            return selectedOptions && ((selectedOptions instanceof Array && selectedOptions.indexOf(val) !== -1) || selectedOptions === val);
        }

        function toBoolean(val) {
            return ("" + val).toLowerCase() === "true";
        }

        var success = function (data) {

            var dataCount, item, i, option, handler;

            formData.SelectData[elementName] = data;

            if (select) { //Элемент есть физически на форме, т.е. это не пустой биндинг из раздела Биндинг.
                select.options.length = 0;
                //select.options.add(new Option("", ""));
                var options = ['<option value=""></option>'];

                if (data) {
                    dataCount = data.length;
                    for (i = 0; i < dataCount; i++) {
                        item = data[i];
                        option = new Option(item.Value, item.Key);
                        (item.ParentKey && option.setAttribute("data-parent-id", item.ParentKey));
                        option.disabled = Boolean(item.Disabled);
                        (isSelectedNode(item.Key) && option.setAttribute("selected", "selected"));
                        options.push(option.outerHTML);
                    }
                }
                //Да, так быстрее, чем добавлять в select.options
                $(select).html(options.join('\n'));

                handler = hasHierarchy ? renderTreeCombobox : renderChosen;
                handler.call(null, data, function () {
                    Loader.hide(true);
                });

            }
            else { //Если это элемент без видимого элемента из раздела Биндинг - просто убрем крутилку
                Loader.hide(true);
            }


            formData.SelectCount--;

            $(document).triggerHandler("AsystFormSelectLoaded", [currentForm, elementName, data]);

            if (formData.SelectCount === 0) {
                $(document).triggerHandler("AsystFormSelectsLoaded", currentForm);
            }

           


        };

        renderTreeCombobox = function (data, callback) {
            var treeNodes = [];
            var treeIdName = "TreeComboBox" + elementName;

            if (select.nodeName === "SELECT") {
                select.style.display = "none";
                select.insertAdjacentHTML("afterend", "<div class='" + select.classList + "' id='" + treeIdName + "'></div>");
            }

            treeNodes = data && data.map(function (item) {
                return {
                    id: item.Key,
                    pId: item.ParentKey,
                    name: item.Value.replace(/(&nbsp;|&#0183;)/g, ""),
                    checked: isSelectedNode(item.Key)
                };
            });

            var $tree = $("#" + formName + " #" + treeIdName);

            $tree.treeComboBox({
                expandRoots: toBoolean(select.getAttribute("data-expand-roots")), //настройка 1
                selectableRoots: toBoolean(select.getAttribute("data-selectable-roots")), // настройка 2
                multipleSelect: toBoolean(select.getAttribute("data-multiple-select")),  // настройка 4,
                nodes: treeNodes,
                modalDataRowsView: select.getAttribute("data-modal-data-rows-view"),
                maxHeight: select.getAttribute("data-max-height"),
                attachedSelect: select,
                linkedElements: select.getAttribute("data-linked-elements"),
                readonly: select.disabled
            });

            (callback && callback.call());
        };
        renderChosen = function (data, callback) {
            var el;

            el = $("#" + formName + " select#" + elementName);
            el.val(value);
            el.trigger('linkedcmbx:updatestate');


            if (el.hasClass("loaded") && el.attr('disabled') !== 'disabled') {
                el.trigger("chosen:updated");
            }
            else if (el.hasClass("loaded")) {
            }
            else {
                var opts = {
                    no_results_text: Globa.ChosenNoResult.locale(),
                    placeholder_text_multiple: Globa.ChosenPlaceholderSingle.locale(),
                    placeholder_text_single: Globa.ChosenPlaceholderMultiple.locale()
                };
                if (el.hasClass('chosen-select-deselect'))
                    opts.allow_single_deselect = true;

                if (el.attr('search_contains') && (el.attr('search_contains') === "true" || el.attr('search_contains') === true))
                    opts.search_contains = true;

                el.chosen(opts);
                //el.trigger("chosen:updated");
                el.addClass("loaded");

                var cb = $("#" + formData.FormName + " #" + elementName + "_chosen .chosen-single");

                if (!cb || cb.length == 0) {
                    cb = $("#" + formData.FormName + " #" + elementName + "_chosen .chosen-choices");
                }

                //cb.bind("chosen:showing_dropdown",
                el.on("chosen:showing_dropdown",
                    function (e) {
                        if (el[0].options.length === 0 || el.hasClass("reloadable") || (el[0].options.length === 1 && (el[0].options.value == '' || el[0].options.value === undefined))) {
                            var value = el.val();
                            formData.Update();
                            formData.LoadSelect(elementName, value, true);
                            e.stopPropagation();
                            return false;
                        }
                        else return false;
                    });

                binding.OldDisplayValue = binding.displayValue();
            }

            (callback && callback.call());
        };

        Loader.show();

        //if (!reloadList && ((typeof value == "null" || typeof value == "undefined") || (jQuery.isArray(value) && value.length == 0))) {
        //	success();
        //	return;
        //}

        //this.Update(true);
        var thinData = Asyst.protocol.thiningData(this.Data);
        formData.SelectCount++;
        delete formData.SelectData[elementName];
        var calArgs = {
            data: thinData,
            success: success,
            error: function (error, text) {
                formData.SelectCount--;
                Loader.hide();
                ErrorHandler(Globa.ErrorLoadComboItems.locale(), error + "<br>" + text);
            },
            async: true,
            isPicklist: true
        };
        if (this.IsAutoForm) {
            $.extend(calArgs, { sourceType: 'entity', sourceName: this.EntityName, elementName: binding.PropertyName });
        } else {
            $.extend(calArgs, { sourceType: 'form', sourceName: this.FormName, elementName: binding.ElementName });
        }
        Asyst.APIv2.DataSource.load(calArgs);


    };

    this.TemplateCount = 0;
    this.TemplateData = {};
    this.LoadTemplate = function (elementName, content) {
        try {
            var binding = this.Bindings[elementName];
            var that = this;
            that.TemplateCount += 1;

            var success = function (data) {
                var c = arguments.callee;
                var formData = c.AsystFormData;
                if (c.Binding.IsNeedData)
                    formData.TemplateData[c.ElementName] = data;
                var el = $("#" + formData.FormName + " #" + c.ElementName);
                try {
                    var s = ProcessTemplate(content, data, formData);
                    el.html(s);
                }
                catch (err) {
                    console.error("Error in Template " + elementName, err);
                }
                finally {
                    that.TemplateCount -= 1;

                    if (that.TemplateCount === 0) {
                        $(document).triggerHandler("AsystFormTemplatesLoaded", currentForm);
                    }
                }




            };
            success.ElementName = elementName;
            success.Binding = binding;
            success.AsystFormData = this;
            if (binding.IsNeedData) {
                var thinData = Asyst.protocol.thiningData(this.Data);
                Asyst.APIv2.DataSource.load({
                    sourceType: 'form',
                    sourceName: this.FormName,
                    elementName: elementName,
                    data: thinData,
                    success: success,
                    error: function (error, text) { ErrorHandler(Globa.ErrorDataListLoad.locale(), error + "<br>" + text); },
                    async: !binding.IsSyncDataLoad,
                    isPicklist: false
                });
            }
            else {
                success(this.Data);
            }
        }
        catch (err) {
            console.error("Error in Template " + elementName, err);
        }


    };

    this.getActiveTab = function () {
        var el = $('#' + this.FormName + ' #tabs li.active a[data-toggle="tab"]');
        var el2 = $(el.attr('href')).find('.nav-tabs li.active a[data-toggle="tab"]');
        return (el2.length > 0) ? el2 : el;
        //return $('#' + this.FormName + ' #tabs .active a');
        //var res = $('#' + this.FormName + ' #tabs-tabs li.active a[data-toggle="tab"]');
        //if (res.length == 0)
        //    return $('#' + this.FormName + ' #tabs li.active a[data-toggle="tab"]');
        //else
        //    return res;
    };

    this.getTabByText = function (text) {
        return $('#' + this.FormName + ' #tabs a:contains("' + text + '")');
    };

    this.getTabByName = function (name) {
        return $('#' + this.FormName + ' #tabs a[href*="' + this.FormName + name + '"]');
    };

    this.getNestedTabByName = function (name) {
        return $('#' + this.FormName + ' .nav-tabs a[href*="' + this.FormName + name + '"]');
    };

    this.getNestedTabByText = function (text) {
        return $('#' + this.FormName + ' .nav-tabs a:contains("' + text + '")');
    };

    this.getRolesEmail = function () {
        var items, item;
        var emails = {};
        var result = [];
        var i;
        for (var binding in this.Bindings) {
            items = this.Data[this.Bindings[binding].ElementName];
            if (jQuery.isArray(items)) {
                for (i = 0; i < items.length; i++) {
                    item = items[i];
                    if (item && (item.entityname === "Account" || item.entityname === "User") && item.EMail && !emails[item.EMail]) {
                        emails[item.EMail] = item.EMail;
                        result[result.length] = item.EMail;
                    }
                }
            }
        }
        if (result.length > 0) {
            return result.join(';');
        }
        else
            return "";
    };

    this.selectElement = function (elementName) {

        var selector = elementName;
        if (selector[0] != '#') selector = '#' + selector;

        var $tab;
        var $el = $('#' + this.FormName + ' ' + selector);
        var $parent = $el.parent();
        while ($parent.length > 0) {
            if ($parent.hasClass('tab-pane')) {
                var tabName = $parent[0].id;
                $tab = $('#' + this.FormName + ' #tabs a[href="#' + tabName + '"]');
                $tab.tab('show');
                $el[0].focus();
                break;
            }
            $parent = $parent.parent();
        }
        return $tab;
    };

    //механизм для клиентских обработчиков.
    //использование: form.ClientHandlers.addHandler(form.ClientHandlers.onDocumentChange,function(){alert('документы изменились!'});
    //альтернатива: form.ClientHandlers.addHandler('MyEvent',myfunc); - добавление обработчика
    //              form.ClientHandlers.raiseEvent('MyEvent') -вызов обработчика
    this.ClientHandlers = {
        handlers: {},
        onDocumentChange: 'onDocumentChange',
        onBeforeDocumentUpload: 'onBeforeDocumentUpload', //при возникновении исключения в обработке - происходит отказ от загрузки

        addHandler: function (eventName, func) {
            if (!this.handlers.hasOwnProperty(eventName))
                this.handlers[eventName] = [];
            this.handlers[eventName].push(func);
        },
        addUniqueHandler: function (eventName, func) {
            if (!this.handlers.hasOwnProperty(eventName))
                this.handlers[eventName] = [];
            var flag = 0;
            for (var i = 0; i < this.handlers[eventName].length; i++) {
                if (this.handlers[eventName][i] == func) flag = 1;
            }
            if (!flag)
                this.handlers[eventName].push(func);
        },
        raiseEvent: function (eventName, args) {
            var handlersArray = this.handlers[eventName];
            if (!handlersArray || !Array.isArray(handlersArray)) return;
            for (var i = 0; i < handlersArray.length; i++) {
                handlersArray[i](args);
            }
        }
    };
    var form = this;
    this.beforeDocumentUploadHandler = function (args) {
        var CR = [];
        if (args.document) {
            var cr = form.MakeFileChangeRequest(args.document, args.filename, 'add');
            if (!$.isEmptyObject(cr))
                CR.push(cr);
        }
        if (CR.length > 0) {
            var doSave = function (success) {
                if (success)
                    success();
            };
            form.ShowChangeRequestDialog(CR, null, doSave);
        }
    };
    this.ClientHandlers.addUniqueHandler(this.ClientHandlers.onBeforeDocumentUpload, this.beforeDocumentUploadHandler);
}


//по alt+ctrl+b показываем последнюю ошибку
$(document).bind('keydown', 'ctrl+b', function (event) {
    if (event.ctrlKey && event.altKey && event.keyCode == 66 && localStorage) {
        var d = Dialog('Last error', localStorage.getItem('/asyst/LastError'));
        $('#' + d).css({ 'width': '900px', 'margin-left': '-450px' });

    }
});

function ErrorHandler(message, text) {
    if (window['localStorage']) {
        localStorage.setItem('/asyst/LastError', new Date().toString() + '\n' + message + '\n' + text);
    }
    NotifyError(message, Asyst.date.format(new Date(), 'yyyy.MM.dd HH:mm:ss') + '\n' + Globa.ErrorDescription.locale());
}

function LicenseErrorHandler(error, text) {
    NotifyError(Globa.LicenseError.locale(), Globa.JSLicenseExpired.locale());
}


function ProcessTemplate(content, data, context) {
    //content = $("<div/>").html(content).text();
    var us = content.toUpperCase();
    var start = us.indexOf("<HTMLROW>");
    var finish = us.indexOf("</HTMLROW>");
    var left;
    var right;
    var rowTemplate;
    var rowsStr;

    //Проход по таблицам
    while (start >= 0 && finish >= 0) {
        left = content.substr(0, start);
        right = content.substr(finish + 10);
        rowTemplate = content.substring(start + 9, finish);
        rowsStr = "";

        /*Для хранения выражений*/
        var functionsArray = {};

        //Проход по данным
        for (var idx in data) {
            var item = data[idx];

            if (item) {
                var rowStr = rowTemplate;


                /*
                PMF-430 В поле Встроенный HTML с галкой Шаблон добавить возможность простых программных выражений
                можно писать простые выражения {(IsSuccess == 1 ? 'Успешно' : 'Неуспешно')}
                */
                rowStr = rowStr.replace(/{(\(.*\))}/g, function (str, exp, offset) {
                    if (!functionsArray[offset]) {
                        functionsArray[offset] = new Function(Object.keys(item).toString(), 'return ' + exp);
                    }
                    return functionsArray[offset].apply(null, Object.values(item));
                });

                //#10306 Каров 16.10.2015 Поддержка форматирования в htmlrow
                /*
                При обработке htmlrow можно задавать маску отображения и замену, в случае пустого (null) значение
                Общий вид выражения {propName:mask?Default value}
                Пример: {StartDate:dd.MM.yyyy?(Не начато)}
                Параметры mask и Default необязательные

                Отдельно добавлен формат B для булевых данных, преобразует в Да/Нет
                {boolValProp:B}
                */

                for (var prop in item) {
                    rowStr = rowStr.replace(new RegExp('{' + prop + '(?:\\:(.+?))?(?:\\?(.+?))?}', 'g'), function (match, mask, def) {
                        var value = item[prop];

                        //console.log('%s %s %s %s', match, prop, value, value === undefined);

                        if (value === undefined) return match;

                        if (mask) {
                            if (value instanceof Date) {
                                value = Asyst.date.format(value, mask, true);
                            }
                            else if (typeof (value) == 'number') {
                                value = Asyst.number.format(value, mask);
                            }
                            else if (typeof (value) == "boolean" && mask == "B") {
                                value = (value ? Globa.Yes.locale() : Globa.No.locale());
                            }
                        }

                        if (!value && value != 0 && def)
                            value = def;

                        return value;
                    });
                }
            }
            rowsStr += rowStr;
        }

        content = left + rowsStr + right;

        us = content.toUpperCase();
        start = us.indexOf("<HTMLROW>");
        finish = us.indexOf("</HTMLROW>");
    }

    start = us.indexOf("<IFEMPTY>");
    finish = us.indexOf("</IFEMPTY>");
    while (start >= 0 && finish >= 0) {
        left = content.substr(0, start);
        right = content.substr(finish + 10);
        rowTemplate = content.substring(start + 9, finish);
        rowsStr = "";

        if (data.length === 0)
            rowsStr = rowTemplate;

        content = left + rowsStr + right;

        us = content.toUpperCase();
        start = us.indexOf("<HTMLROW>");
        finish = us.indexOf("</HTMLROW>");
    }

    start = us.indexOf("<IFNOTEMPTY>");
    finish = us.indexOf("</IFNOTEMPTY>");
    while (start >= 0 && finish >= 0) {
        left = content.substr(0, start);
        right = content.substr(finish + 13);
        rowTemplate = content.substring(start + 12, finish);
        rowsStr = "";

        if (data.length > 0)
            rowsStr = rowTemplate;

        content = left + rowsStr + right;

        us = content.toUpperCase();
        start = us.indexOf("<HTMLROW>");
        finish = us.indexOf("</HTMLROW>");
    }

    content = templateProcessNames(content, context.Data);

    return content;
}

function GetPropertyValue(data, propPath) {
    var result;

    if (propPath.indexOf('(') !== -1) {
        with (data)
        result = eval(propPath);
    }
    else if (propPath.indexOf('.') != -1) {

        var pathArray = propPath.split('.');
        result = data;
        for (var idx in pathArray) {
            if (!result) break;

            var propName = pathArray[idx];

            if (result instanceof Array) {
                var tmp = [];

                for (var i = 0; i < result.length; i++) {
                    var v = result[i];

                    if (v) {
                        v = v[propName];
                        if (v) tmp.push(v);
                    }
                }

                result = tmp;
            }
            else
                result = result[propName];
        }
    }
    else
        result = data[propPath];

    return result;
}

function GetPropertyText(value, binding, escapeHtml) {
    if (escapeHtml === undefined) escapeHtml = false;
    var result = value;

    if (result instanceof Array) {
        if (binding === null || binding === undefined || !binding.IsShowHyperlink || !binding.Form.Data.hasOwnProperty(binding.ElementName + 'Items')) {
            for (var idx in result) {
                result[idx] = GetValueText(result[idx], escapeHtml);
            }
            result.sort();

            result = result.join(', ');
        } else {
            //обрамление мультиполей в ссылки
            for (var idx in result) {
                var entityName = binding.Form.Data[binding.ElementName + 'Items'][idx].entityname;
                if (entityName !== null)
                    result[idx] = "<li><a href=\"javascript:saveTabAndGo('/asyst/" + entityName + "/form/auto/" + binding.Form.Data[binding.ElementName + 'Items'][idx][entityName + 'Id'] + "?mode=view')\">" + GetValueText(result[idx], escapeHtml) + "</a></li>";
                else result[idx] = GetValueText(result[idx], escapeHtml);
            }
            result = '<ul>' + result.join(' ') + '</ul>';
        }
    }
    else
        result = GetValueText(result, escapeHtml);

    return result;
}

function GetValueText(value, escapeHtml) {
    if (escapeHtml === undefined) escapeHtml = false;

    if (value instanceof Date) {
        value = Asyst.date.format(value);
        return value;
    } else if (typeof (value) == "boolean") {
        if (value)
            value = Globa.Yes.locale();
        else
            value = Globa.No.locale();
        return value;
    }
    else if (typeof value == "number") //#10307 Каров 15.10.2015 Ошибка в обработке подстановочных значений в Подписе - не выводилось значение 0
        return value;
    else if (value && value.constructor === String) {
        return escapeHtml ? ($('<div/>').text(value).html()) : value;
    }
    else if (value)
        return value;
    else
        return "";
}

/*
-------------------------------------------------------------------------------
Оставлено для совместимости
не используется в коде проекта (возможно есть где-то в динамическом js метаданных)


Model.FormatJsonObject = Asyst.protocol.format;

Model.LoadForm = Asyst.API.Form.load;
Model.SaveForm = Asyst.API.Form.save;
Model.LoadEntity = Asyst.API.Entity.load;
Model.SaveEntity = Asyst.API.Entity.save;
Model.LoadPicklist = Asyst.API.Picklist.load;
Model.LoadDataSource = Asyst.API.DataSource.load;
Model.LoadViewData = Asyst.API.View.load;
Model.SaveChangeRequest = Asyst.API.ChangeRequest.save;
Model.AgreeChangeRequest = Asyst.API.ChangeRequest.agree;
Model.DeclineChangeRequest = Asyst.API.ChangeRequest.decline;
Model.ExternalReviewStartChangeRequest = Asyst.API.ChangeRequest.externalReviewStart;
Model.ExternalReviewAgreeChangeRequest = Asyst.API.ChangeRequest.externalReviewAgree;
Model.ExternalReviewAgreeChangeRequestWithIssues = Asyst.API.ChangeRequest.externalReviewAgreeWithIssues;
Model.ExternalReviewDeclineChangeRequest = Asyst.API.ChangeRequest.externalReviewDecline;

Model.CurrentForm = Asyst.Workspace.getCurrentForm;
Model.ShowTab = Asyst.Workspace.showTab;
Model.EntityDialog = Asyst.Workspace.OpenEntityDialog;
Model.CurrentFormEdit = Asyst.Workspace.currentFormEdit;
Model.CurrentFormClose = Asyst.Workspace.currentFormClose;
*/