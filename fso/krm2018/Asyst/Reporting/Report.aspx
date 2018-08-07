<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Report.aspx.cs" Inherits="PRIZ.Reporting.ReportView" %>

<%@ Register TagPrefix="rsweb" Namespace="Microsoft.Reporting.WebForms" Assembly="Microsoft.ReportViewer.WebForms, Version=12.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" %>

<%@ Import Namespace="PRIZ.Reporting" %>

<!DOCTYPE html>
<html lang="en">

<head runat="server">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />
    <meta name="GENERATOR" content="Asyst.Report">


    <link href="/asyst/css/datepicker.css" rel="stylesheet" />
    <link href="/asyst/css/reporting.bootstrap.css" rel="stylesheet">
    <link href="/asyst/css/reporting.css" rel="stylesheet">
    <link href="/asyst/jsControls/multiple-select/multiple-select.css" rel="stylesheet" />
    <link href="/asyst/css/zimbargation.css" rel="stylesheet">

    <script src="/asyst/js/jquery-1.11.1.js" type="text/javascript"></script>
    <script src="/asyst/js/reporting.parameters.js"></script>
    <script src="/asyst/js/numeral.min.js"></script>
    <script src="/asyst/jsControls/multiple-select/multiple-select.js"></script>
    <script src="/asyst/js/bootstrap-datepicker.js"></script>
    <script src="/asyst/jsControls/DBCalendar/moment.min.js"></script>

    <script src="/asyst/js/bootstrap.js"></script>
    <script src="/asyst/js/bootstrap-modal.js"></script>
    <script src="/asyst/js/bootstrap-modalmanager.js"></script>

    <script src="/asyst/jsControls/MSAjax/MicrosoftAjax.js"></script>
    <script src="/asyst/jsControls/MSAjax/MicrosoftAjaxTimer.js"></script>
    <script src="/asyst/jsControls/MSAjax/MicrosoftAjaxWebForms.js"></script>

    <title></title>
    <script src="/asyst/js/asyst.globalization.js"></script>
    <script src="/asyst/js/asyst.js"></script>
    <script src="/asyst/js/asyst.utils.js"></script>
    <script src="/asyst/js/application.js"></script>

    <script>
        Asyst.API.AdminTools.saveStats({ page: location.href, pageTitle: document.title, type: 'asystReport', action: 'open' }, true);

        <%if (parameterValidationResult != null && parameterValidationResult.HasErrors)
        { %>

        $(function () {
            Dialogs.Message("<% =parameterValidationResult.ToString() %>", "Недопустимое значение параметров фильтров");
        })
        <%}%>


</script>


</head>
<!--Должен занимать полный экран, прокрутки не должно быть-->
<body>
    <%foreach (string item in CssFiles)
        {
            Response.Write("<link href=\"" + item + "\" rel=\"stylesheet\">");
        } %>
    <form runat="server">
        <asp:ScriptManager runat="server" AsyncPostBackTimeout="120000">
            <Scripts>
            </Scripts>
        </asp:ScriptManager>

        <!--Должен занимать полный экран, прокрутки не должно быть-->
        <div class="main-container">

            <!--Должен занимать всю ширину экрана, его высота может менятся, всегда должен быть наерху экрана. Также к этому диву нужно прикрутить экспандер, чтобы параметры можно было скрывать-->
            <div class="parameters">
                <% if (Parameters.Any() || HardApply)
                    {%>
                <div class="parameters-form">
                    <div class="container hidden">
                        <div class="row">
                            <div class="col-lg-11 col-md-10 col-sm-12 col-xs-12">

                                <%for (int i = 0; i < Parameters.Count; i = i + 2)
                                    {%>
                                <div class="row">
                                    <% if (!HiddenFields.Contains(Parameters[i].Name.ToLower()))
    { %>
                                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div class="control-group <% if (parameterValidationResult.HasError(Parameters[i].Name)) { %> error <% } %>" >
                                            <label class="control-label" for="<%= Parameters[i].Name %>">
                                                <%= PMPractice.Db.MultiLanguageUtils.ReplaceSubstring(Parameters[i].Prompt) %>
                                            </label>
                                            <div class="controls">
                                                <%= RenderParameterControl(Parameters[i]) %>
                                                <span class="help-inline"><%=  parameterValidationResult.GetErrorMessage(Parameters[i].Name) %></span>
                                            </div>
                                        </div>
                                    </div>
                                    <% }
                                        if (i < Parameters.Count - 1)
                                        {
                                            if (!HiddenFields.Contains(Parameters[i + 1].Name.ToLower()))
                                            { %>
                                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div class="control-group <% if (parameterValidationResult.HasError(Parameters[i+1].Name)) { %> error <% } %>">
                                            <label class="control-label" for="<%= Parameters[i + 1].Name %>"><%= PMPractice.Db.MultiLanguageUtils.ReplaceSubstring(Parameters[i + 1].Prompt) %></label>
                                            <div class="controls">
                                                <%= RenderParameterControl(Parameters[i + 1]) %>
                                                  <span class="help-inline"><%= parameterValidationResult.GetErrorMessage(Parameters[i+1].Name) %></span>
                                            </div>
                                        </div>
                                    </div>
                                    <% }
                                        }%>
                                </div>
                                <%}%>
                            </div>
                            <div class="col-lg-1 col-md-2 col-sm-12 col-xs-12">
                                <% if (HardApply)
                                    { %>
                                <asp:Button runat="server" OnClick="update_OnClick" Text="Применить" ID="update1" name="update1" value="update1" class="btn btn-primary pull-right"></asp:Button>
                                <% }
                                    else
                                    { %>
                                <button type="submit" id="update" name="update" value="update" class="btn btn-primary pull-right"><%= Update %></button>
                                <% } %>
                            </div>
                        </div>

                        <!-- Вставим прямо тут, чтобы преобразование выпадалок произошло как можно быстрее и не было видно голых селектов -->
                        <script type="text/javascript">
                            function setDefaultSelects(instance) {
                                var selectedArr = instance.getSelects();
                                if (!(selectedArr && selectedArr.length)) {
                                    instance.setSelects([-1]);
                                }
                            }

                            $('select[empty]').prop('value', false);

                            $('select.parameter[multiple]').multipleSelect({
                                width: '95%',
                                filter: true,
                                addTitle: true,
                                noMatchesFound: "<%=NothingFound%>",
                                selectAllText: "<%=SelectedAll%>",
                                allSelected: "<%=SelectedAll%>",
                                countSelected: "<%=SelectCount%>",
                                placeholder: "Выберите значение",
                                onClose: function (atClose) {
                                    var closeValues = atClose.that.getSelects().sort().join();
                                    var openValues = atClose.that.openValues;
                                    if (openValues !== undefined && closeValues !== openValues && atClose.that.$el.attr('handupdate') !== undefined) {
                                        Loader.show(null, "Идет загрузка данных");
                                        document.forms[0].submit();
                                    }
                                    delete atClose.that.openValues;

                                },
                                onOpen: function (atOpen) {
                                    $('select').not(atOpen.that.$el).multipleSelect('close');
                                    atOpen.that.openValues = atOpen.that.getSelects().sort().join();
                                }

                            });
                            $('select.parameter:not([multiple])').multipleSelect({
                                width: '95%',
                                single: true,
                                filter: true,
                                addTitle: true,
                                noMatchesFound: "<%=NothingFound%>",

                                placeholder: "Выберите значение",

                            });



                            $('[data-type=DateTime]').datepicker({
                                autoclose: true,
                                todayHighlight: true,
                                DateTimeFormat: Asyst.date.defaultDateFormat
                            });
                            $("#update").on("click", function () {
                                $('select.parameter[multiple]').each(function () {
                                    var $select = $(this);
                                    var selectedArr = $select.multipleSelect("getSelects");
                                    if (!(selectedArr && selectedArr.length)) {
                                        if ($select.find("option[value=-1]").length === 0) {
                                            $select.multipleSelect("checkAll");
                                        } else {
                                            $select.multipleSelect("setSelects", [-1]);
                                        }
                                    }
                                });
                                Loader.show(null, "##Идет загрузка отчета. Пожалуйста, подождите##".locale());
                                $('#update').attr('value', 'handupdate');
                            });
                            setTimeout(function () {
                                $(".parameters-form>.container").removeClass("hidden");
                            }, 100);
                        </script>

                    </div>
                </div>
                <div class="parameters-toggle">
                    <div class="parameters-toggle-in">&#9650</div>
                </div>
                <%}%>
            </div>

            <% if (IsCollapsed)
                { %>
            <script>
                            $(function () {
                                if ($(".parameters-form").is(":visible")) {
                                    $(".parameters-toggle").trigger("click");
                                }
                            })
            </script>
            <% } %>

            <!--Этот контейнер должен занимать все доступное оставшееся пространство от параметру-->
            <div class="report-container">
                <rsweb:ReportViewer
                    ID="ReportViewer1"
                    runat="server"
                    Font-Names="Verdana"
                    AsyncRendering="False"
                    KeepSessionAlive="False"
                    WaitMessageFont-Names="Verdana"
                    WaitMessageFont-Size="14pt"
                    Width="100%"
                    Height="100%"
                    OnReportRefresh="ReportViewer1_ReportRefresh"
                    EnableExternalImages="True"
                    SizeToReportContent="false">
                    <LocalReport OnSubreportProcessing="OnSubreportProcessing">
                    </LocalReport>
                </rsweb:ReportViewer>
            </div>

        </div>

        <%foreach (var item in JsFiles)
            {
                Response.Write("<script src=\"" + item + "\" type=\"text/javascript\"></script>");
            } %>
    </form>
</body>

</html>
