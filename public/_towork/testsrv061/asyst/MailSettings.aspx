<%@ Page Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true" CodeBehind="MailSettings.aspx.cs" Inherits="PRIZ.MailSettings" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .navbar {
            margin-bottom: 4px;
        }
        
        body 
        {
            padding: 4px;
            background-color: #fff;
        }
        
        pre
        {
            display: inline-block;
            padding: 2px;
            margin: 0px;
            font-family: "Trebuchet MS", Helvetica, Arial, sans-serif !important;
        }
        
        .table
        {
            font-size: 11px;
        }
        
        input, label, select
        {
            font-size: 11px;
            line-height: 24px;
        }
        
        .chzn-container {
            font-size: 11px;
        }
        
        .tree-phase
        {
            color:#0088CC;
            font-weight:bold;
        }
        
        .tree-element
        {
            padding-left: 18px;
            font-weight:bold;
            font-size:12px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .tree-item
        {
            padding-left: 36px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        a.access-rights:hover
        {
            text-decoration: none;
        }
        
        .access-rights
        {
            color:#666 !important;
        }
        
        .access-rights.custom
        {
            color:#000 !important;
        }
        
         .table .tree-element-row td
         {
            color: #333;
            font-weight: bold;
            text-shadow: 1px 1px 1px white;
            box-shadow: 0 1px 0 #FFFFFF inset;
            background-color: #eeeeee; /* Old browsers */
            background-repeat: repeat-x; /* Repeat the gradient */
            background-image: -moz-linear-gradient(top, #f5f5f5 0%, #eeeeee 100%); /* FF3.6+ */
            background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f5f5f5), color-stop(100%,#eeeeee)); /* Chrome,Safari4+ */
            background-image: -webkit-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Chrome 10+,Safari 5.1+ */
            background-image: -ms-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* IE10+ */
            background-image: -o-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Opera 11.10+ */
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f5f5f5', endColorstr='#eeeeee',GradientType=0 ); /* IE6-9 */
            background-image: linear-gradient(to top, #f5f5f5 0%,#eeeeee 100%); /* W3C */
         }
         
         .table th
         {
            box-shadow: 0 1px 0 #FFFFFF inset;
            background-color: #eeeeee; /* Old browsers */
            background-repeat: repeat-x; /* Repeat the gradient */
            background-image: -moz-linear-gradient(top, #f5f5f5 0%, #eeeeee 100%); /* FF3.6+ */
            background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f5f5f5), color-stop(100%,#eeeeee)); /* Chrome,Safari4+ */
            background-image: -webkit-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Chrome 10+,Safari 5.1+ */
            background-image: -ms-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* IE10+ */
            background-image: -o-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Opera 11.10+ */
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f5f5f5', endColorstr='#eeeeee',GradientType=0 ); /* IE6-9 */
            background-image: linear-gradient(to top, #f5f5f5 0%,#eeeeee 100%); /* W3C */
         }
         
         legend
         {
             font-size: 12px;
             font-weight:bold;
             color:#a5a5a5;
             margin-bottom: 8px;
             line-height: 18px;
         }
         
         legend + .control-group {
            margin-top: 0px;
        }

        .control-group {
            margin-bottom: 9px;
        }
        .form-horizontal  .control-label {
            width: 60px;
        }
        .form-horizontal  .controls {
            margin-left: 80px;
        }
        .form-horizontal input, textarea { width: 408px; }
        .form-horizontal textarea { height: 408px; }
         
    </style>
</asp:Content>


<asp:Content ContentPlaceHolderID="pageHeaderPlaceHolder" runat="server">
    <div class="navbar fixed-top">
        <div class="navbar-inner">
            <div class="container ">
                <a class="brand" href="#">
                    Настройка писем
                    <a href="#" class="btn btn-primary" onclick="addLetter()">Добавить</a>
                </a>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    
    <table class="table table-striped table-bordered table-condensed">
        
    </table>

    <script>
        $(function () {
            $("#comboEntity").chosen();
            $("#comboField").chosen({ allow_single_deselect: true });
            $("#comboRoles").chosen({ allow_single_deselect: true });
            $("#comboRoleRecipients").chosen({ allow_single_deselect: true });
            $("#comboMailTypes").chosen();

            $("#comboMailTypes").change(function () {
                if ($("#comboMailTypes").val() == 1)
                    $('#fsetCalendar').css('display', '');
                else
                    $('#fsetCalendar').css('display', 'none');
            });
        });

        function addLetter() {
            $('#editLetterModal').modal({ backdrop: "static" });
            $('#editLetterModal').modal('show');
        }
    </script>

    <div class="modal fade" id="editLetterModal">
        <div class="modal-header">
            <button class="close" data-dismiss="modal">×</button>
            <h3>Письмо</h3>
        </div>

        <div class="modal-body form-horizontal">
        <legend>Посылать письмо при изменении в:</legend>
            <div class="control-group">
                <label class="control-label" for="comboEntity">сущности</label>
                <div class="controls">
                    <select class="chzn-select" id="comboEntity">
                        <option value="">Нет</option>
                    </select>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="comboField">поле</label>
                <div class="controls">
                    <select class="chzn-select" id="comboField">
                        <option value="">Нет</option>
                    </select>
                    <div style="float: right;">= <input type="text" style="width: 170px" id="txbFiled" /></div>
                </div>
                
            </div>
            <div class="control-group">
                <label class="control-label" for="comboRoles">от ролей</label>
                <div class="controls">
                    <select class="chzn-select" id="comboRoles" multiple="multiple" style="width: 418px;">
                        <option value="">Нет</option>
                    </select>
                </div>
            </div>


            <legend>Кому отправлять?</legend>
            <div class="control-group">
                <label class="control-label" for="comboRoleRecipients">Ролям</label>
                <div class="controls">
                    <select class="chzn-select" id="comboRoleRecipients" multiple="multiple"  style="width: 418px;">
                        <option value="">Нет</option>
                    </select>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="txbEMailRecipients">E-mails</label>
                <div class="controls">
                    <input type="text" id="txbEMailRecipients" />
                </div>
            </div>


            <legend>Что отправлять?</legend>
            <div class="control-group">
                <label class="control-label" for="comboMailTypes">Тип</label>
                <div class="controls">
                    <select class="chzn-select" id="comboMailTypes">
                        <option value="0">Письмо</option>
                        <option value="1">Встреча в календарь</option>
                        <option value="2">Задача</option>
                    </select>
                </div>
            </div>
            <fieldset id="fsetCalendar" style="display: none;">
                <div class="control-group">
                    <label class="control-label" for="txbMeetingPlace">Место</label>
                    <div class="controls">
                        <input type="text" id="txbMeetingPlace" />
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label" for="txbMeetingStart">Начало</label>
                    <div class="controls">
                        <input type="text" id="txbMeetingStart" />
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label" for="txbMeetingFinish">Окончание</label>
                    <div class="controls">
                        <input type="text" id="txbMeetingFinish" />
                    </div>
                </div>
            </fieldset>
            <div class="control-group">
                <label class="control-label" for="txbMailTheme">Тема</label>
                <div class="controls">
                    <input type="text" id="txbMailTheme" />
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="txbMailBody">Текст</label>
                <div class="controls">
                    <textarea id="txbMailBody"></textarea>
                </div>
            </div>


        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" onclick="addRole()">Добавить</a>
            <a href="#" class="btn" data-dismiss="modal">Отмена</a>
        </div>
    </div>

</asp:Content>

