/*
config: [{
    reportName:"",
    filters : [{
        isDefault:true,
        name:"",
        parameters:[{
            name:value
        }]
    }],
}]
*/

(function ($) {
    $.fn.ReportCenterFiltering = function (options) {
        var settings = $.extend({
            configurationService: new ReportStorageService()
        }, options);

    };
})(jQuery);

(function ($) {
    $.fn.ReportFiltering = function (options) {

        var self = this;

        var settings = $.extend({
            configurationService: new ReportStorageService(),
            getReportName: function () {
                return location.pathname.substring(location.pathname.lastIndexOf("/") + 1, location.pathname.length);
            }
        }, options);

        var refreshFilterList = function (container) {
            settings.configurationService.loadConfiguration(function (config) {
                console.log(config);
                var selector = $("#filters", self);

                $("#filters option", container).remove();
                var reportName = settings.getReportName();
                var reportConfig = config.getReportConfig(reportName);

                $("#filters", container).append("<option value='' title='не выбрано'>не выбрано</option>");

                reportConfig.filters.forEach(function (filter) {
                    var title = (filter.isDefault != null ? "*" : "") + filter.name;
                    $("#filters", container).append("<option value='" + filter.name + "' title='" + title + "'>" + title + "</option>");
                });

                debugger;
                $("#filters", container).multipleSelect({
                    filter: true,
                    addTitle: true,
                    single: true,
                    width: "95%"
                });

                $("#filters", container).multipleSelect("refresh");
            });
        }

        var template = '<div class="container">' +
            '<div class="row">' +
            '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
            '<div class="row">' +
            '<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">' +
            '<div class="control-group"><label class="control-label">Выбор настроек</label>' +
            '<div class="controls">' +
            '<select id="filters" class="parameter single" style="display: none;">' +
            '<option value="" title="не выбрано">не выбрано</option>' +
            '<option value="фильтр1" title="*фильтр1">*фильтр1</option>' +
            '<option value="фильтр2" title="фильтр2">фильтр2</option>' +
            '</select>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">' +
            '<div class="btn-group pull-right">' +
            '<button style="margin-left:10px;" type="button" id="filterconfig" name="execute" value="filterconfig" class="btn btn-primary">Тонкая настройка</button>' +
            '<button style="margin-left:10px;" type="button" id="saveparameters" value="save" class="btn btn-primary">Сохранить</button>' +
            '<button style="margin-left:10px;" type="button" id="execute" name="execute" value="execute" class="btn btn-primary">Открыть фильтр</button>' +
            '<button style="margin-left:10px;" type="button" id="setDefault" name="setDefault" value="setDefault" class="btn btn-primary">Сделать по-умолчанию</button>' +
            '<button style="margin-left:10px;" type="button" id="removeFilter" name="removeFilter" value="removeFilter" class="btn btn-primary">Удалить</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        //init UI controls
        // var row = $("<div class='row'></div>")
        // var filtersContainer = $("<div class='col-lg-11 col-md-10 col-sm-12 col-xs-12'></div>")
        // var rowInner = $("<div class='row'></div>");
        // var rowInnerContainer = $("<div class='col-lg-6 col-md-6 col-sm-12 col-xs-12'></div>");
        // var controlGroup = $("<div class='control-group'></div>");

        // filtersContainer.append(rowInner);
        // rowInner.append(rowInnerContainer);
        // rowInnerContainer.append(controlGroup);

        // controlGroup.append("<label class='control-label'>Выбор настроек</label>");
        // var controls = $("<div class='controls'></div>");
        // controlGroup.append(controls);
        // controls.append("<select id='filters' class='parameter single'></select>");
        // controls.append("<button type='button' id='filterconfig' name='execute' value='filterconfig' class='btn btn-primary pull-right'>Тонкая настройка</button>");
        // controls.append("<button type='button' id='saveparameters' value='save' class='btn btn-primary pull-right'>Сохранить</button>");
        // controls.append("<button type='button' id='execute' name='execute' value='execute' class='btn btn-primary pull-right'>Открыть фильтр</button>");
        // controls.append("<button type='button' id='setDefault' name='setDefault' value='setDefault' class='btn btn-primary pull-right'>Сделать по-умолчанию</button>");
        var row = $(template);
        //row.append(filtersContainer);
        this.append(row);

        refreshFilterList(this);
        //end of init UI controls

        // settings.configurationService.loadConfiguration(function (config) {
        //     $("#filters option", this).remove();
        //     var reportName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1, location.pathname.length);
        //     var reportConfig = config.getReportConfig(reportName);
        //     reportConfig.filters.forEach(function (filter) {
        //         var title = (filter.isDefault != null ? "*" : "") + filter.name;
        //         $("#filters", this).append("<option value='" + filter.name + "' title='" + title + "'>" + title + "</option>");
        //     });

        //     $("#filters", this).multipleSelect({
        //         filter: true,
        //         addTitle: true,
        //         single: true,
        //         width: "95%"
        //     });

        //     $("#filters", this).multipleSelect("refresh");
        // });

        $("#saveparameters", self).click(function () {
            var allParameters = [];
            var parameters = $(".controls select.parameter")
                .not("#filters", self)
                .add(".controls>input")
                .not(".filterCheckbox")
                .each(function (index, item) {
                    var selectedOptions = $(item, "option:selected");

                    var filterCheckbox = $("input[data-name='" + $(item).attr("name") + "']:checked");

                    if (selectedOptions.length > 0) {
                        var filterCheckbox = $("input[data-name='" + $(item).attr("name") + "']");

                        //если тонкая настройка включена, то мы учитываем её, если нет, то по-умолчанию сохраняем
                        if (filterCheckbox.length == 0 || filterCheckbox.is(":checked")) {
                            selectedOptions.each(function (index2, option) {
                                allParameters.push({
                                    name: $(item).attr("name"),
                                    value: $(option).val()
                                })
                            });
                        }
                    }
                });

            var filterName = prompt("Введите название фильтра:");
            if (filterName != null) {
                settings.configurationService.loadConfiguration(function (config) {
                    var reportName = settings.getReportName();
                    config.setFilter(filterName, reportName, allParameters);
                    settings.configurationService.saveConfiguration(config, function () {
                        $(document).trigger("ReportParametersSave", config);
                        refreshFilterList();
                    });
                });
            }
        });

        //включаем чекбоксы для тонкой настройки фильтров
        $("#filterconfig", self).click(function () {
            if ($(".filterCheckbox").length == 0) {
                $("select.parameter").not("#filters", self).add(".controls>input").each(function (index, item) {
                    $(item).after("<input type='checkbox' class='filterCheckbox' data-name='" + $(item).attr("name") + "'/>");
                });
            } else {
                $(".filterCheckbox").remove();
            }
        })

        $("#setDefault", self).click(function () {
            settings.configurationService.loadConfiguration(function (config) {
                var reportName = settings.getReportName();
                var reportConfig = config.getReportConfig(reportName);
                var filterName = $("#filters option:selected").val();
                config.setDefault(filterName, reportName);
                settings.configurationService.saveConfiguration(config, function () {
                    $(document).trigger("ReportParametersSave", config);
                    refreshFilterList(self);
                });
            });
        });

        $("#removeFilter", self).click(function () {
            settings.configurationService.loadConfiguration(function (config) {
                var reportName = settings.getReportName();
                var reportConfig = config.getReportConfig(reportName);
                var filterName = $("#filters option:selected").val();
                config.removeFilter(filterName, reportName);
                settings.configurationService.saveConfiguration(config, function () {
                    $(document).trigger("ReportParametersSave", config);
                    refreshFilterList(self);
                });
            });
        });

        $("#execute", self).click(function () {
            var filterName = $("#filters option:selected", self).val();

            if (filterName != '') {
                settings.configurationService.loadConfiguration(function (config) {
                    var reportName = settings.getReportName();
                    var reportConfig = config.getReportConfig(reportName);
                    var reportFilter = config.getFilterConfig(reportName, filterName);
                    openReportByFilter10(reportName, reportFilter, false);
                });
            }
        });

        // $("#filters", self).change(function () {
        //     settings.configurationService.loadConfiguration(function (config) {
        //         var filterName = $("#filters option:selected").val();
        //         if (filterName != '') {
        //             var reportName = settings.getReportName();
        //             var reportConfig = config.getReportConfig(reportName);
        //             var reportFilter = config.getFilterConfig(reportName, filterName);
        //             openReportByFilter(reportName, reportFilter, false);
        //         }
        //     });
        // });
    };
})(jQuery);

var initReportCenterPage = function (configService) {
    $(document).on("AsystPageLoaded", function () {
        configService.loadConfiguration(function (config) {
            $("#ReportCenter .panel[onclick*='/asyst/report']").each(function (index, item) {
                var reportName = /\/asyst\/report\/([\w_\/]*)/g.exec($(item).attr("onclick"))[1];
                var reportConfig = config.getReportConfig(reportName);
                if (reportConfig.filters.length > 0) {
                    var filterConfig = reportConfig.filters.sort(function (a, b) {
                        return a.isDefault != null ? 0 : 1;
                    })[0];
                    if(filterConfig.isDefault != null && filterConfig.isDefault)
                    {
                        $(item).attr("onclick", '');
                        $(item).click(function () {
                            openReportByFilterGet(reportName, filterConfig, true);
                        });
                    }
                }
            });
        });
    });
}

//not working in iis 10 (win2016)
var openReportByFilter = function (reportName, filter, isNewWindow) {
    var form = $('<form action="/asyst/report/' + reportName + '" method="POST" target="' + (isNewWindow ? "_blank" : "") + '"></form>');
    filter.parameters.forEach(function (item, index) {

        form.append(jQuery('<input>', {
            //$("form").append(jQuery('<input>', {
            'name': item.name,
            'value': typeof (item.value) == typeof (array) ? item.value.join(",") : item.value,
            'type': 'hidden'
        }));
    });
    $(form).submit();
}

//iis 10, 2016 version, we remove parameters and add ours. because of ajax panel
var openReportByFilter10 = function (reportName, filter) {
    var form = $("form");

    filter.parameters.forEach(function (item, index) {
        $("#" + item.name, form).val(item.value);
    });

    $("#update").click();
}

var openReportByFilterGet = function(reportName, filter, isNewWindow){
    var form = $('<form action="/asyst/report/' + reportName + '" method="GET" target="' + (isNewWindow ? "_blank" : "") + '"></form>');
    filter.parameters.forEach(function (item, index) {
        form.append(jQuery('<input>', {
            //$("form").append(jQuery('<input>', {
            'name': item.name,
            'value': typeof (item.value) == typeof (array) ? item.value.join(",") : item.value,
            'type': 'hidden'
        }));
    });
    var parameters = $(form).serialize();
    //$(form).submit();
    document.location.href = '/asyst/report/'+reportName +'?' + parameters;
}

//loads config from window.reportConfig , if not exists then from server
var ReportStorageService = function () {

    ReportStorageService.prototype.loadConfiguration = function (success) {

        if (typeof (window.reportConfig) != 'undefined') {
            success(window.reportConfig);
            return;
        }

        Asyst.API.DataSet.load("UserSettings", { SettingsName: 'ReportFilterSettings' }, false, function (ds, dsConfig) {
            var config = new Configuration();
            //var jsonConfig = dsConfig[0].Value; //localStorage.getItem("reportParametersConfiguration");
            if (dsConfig != null && dsConfig[0] != null) {
                var jsonConfig = dsConfig[0].Value;
                if (jsonConfig != null && jsonConfig != '') {
                    config.fromJSON(jsonConfig);
                }
            }

            window.reportConfig = config;

            success(config);
        });
    };

    ReportStorageService.prototype.saveConfiguration = function (config, success) {
        var jsonString = config.toJSON();
        Asyst.API.DataSet.load("UserSettings", { SettingsName: 'ReportFilterSettings' }, false, function (ds, dsConfig) {
            var settingsId = dsConfig != null && dsConfig[0] != null ? dsConfig[0].UserSettingsId : null;
            if (dsConfig != null) {
                var userId = Asyst.API.AdminTools.getCurrentUser().Id;
                Asyst.API.Entity.save("UserSettings", settingsId, { UserId: userId, Name: "ReportFilterSettings", Value: jsonString }, function () {
                    success();
                });
            }
        });
        //localStorage.setItem("reportParametersConfiguration", jsonString);
    }
}

var Configuration = function () {

    this.reportConfigurations = [];

    Configuration.prototype.fromJSON = function (json) {
        this.reportConfigurations = JSON.parse(json);
        return this;
    }

    Configuration.prototype.toJSON = function (json) {
        return JSON.stringify(this.reportConfigurations);
    }

    Configuration.prototype.getReportConfig = function (reportName) {
        var result = {
            reportName: reportName,
            filters: []
        };
        var exists = false;
        this.reportConfigurations.forEach(function (reportConfig) {
            if (reportConfig.reportName.toLowerCase() == reportName.toLowerCase()) {
                exists = true;
                result = reportConfig;
            }
        });
        if (!exists) {
            this.reportConfigurations.push(result);
        }
        return result;
    }

    Configuration.prototype.getFilterConfig = function (reportName, filterName) {
        var reportConfig = this.getReportConfig(reportName);
        var result = {
            name: filterName,
            parameters: []
        }
        var exists = false;

        reportConfig.filters.forEach(function (filterConfig) {
            if (filterConfig.name.toLowerCase() == filterName.toLowerCase()) {
                exists = true;
                result = filterConfig;
            }
        });
        if (!exists)
            reportConfig.filters.push(result);
        return result;
    };

    Configuration.prototype.setFilter = function (filterName, reportName, parameters) {
        var filterConfig = this.getFilterConfig(reportName, filterName);
        filterConfig.parameters = parameters;
    }

    Configuration.prototype.setDefault = function (filterName, reportName) {
        var reportConfig = this.getReportConfig(reportName);
        reportConfig.filters.forEach(function (filterConfig) {
            if (filterConfig.name.toLowerCase() == filterName.toLowerCase()) {
                filterConfig.isDefault = true;
            }
            else {
                delete filterConfig.isDefault;
            }
        });
    }

    Configuration.prototype.removeFilter = function (filterName, reportName) {
        var reportConfig = this.getReportConfig(reportName);
        var index = 0;
        reportConfig.filters.forEach(function (filterConfig) {
            if (filterConfig.name.toLowerCase() == filterName.toLowerCase()) {
                reportConfig.filters.splice(index, 1)
                return;
            }
            index++;
        });
    }
}

$(document).ready(function () {
    //here we apply default filter to report in report center
    if (location.pathname.startsWith("/asyst/page/ReportCenter")) {
        initReportCenterPage(new ReportStorageService());
    }//here we add filter confiuration UI into report page
    else {
        // initReportPage();
        $(".parameters").prepend("<div id='filterConfigurationContainer' class='parameters-form' style='border-bottom: solid 1px #ddd;'></div>");
        $("#filterConfigurationContainer").ReportFiltering({
            configurationService: new ReportStorageService()
        });
    }
});