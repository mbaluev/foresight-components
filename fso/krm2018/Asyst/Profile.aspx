<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true" CodeBehind="Profile.aspx.cs" Inherits="PRIZ.ProfilePage" EnableSessionState="false"%>
<%@ Import Namespace="PMPractice.Db" %>
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
            line-height: 16px;
        }
        
        .chzn-container {
            font-size: 11px;
            float: none;
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
         
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="pageHeaderPlaceHolder" runat="server">
    <div class="navbar fixed-top profile">
        <div class="navbar-inner">
            <div class="container ">
                <a class="brand" href="#">
                   <%Response.Write(MultiLanguageUtils.Resources.ASPXLocalProfileSettings); %>
                </a>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    
    <table class="table table-striped table-bordered table-condensed">
        <% Response.Write(ttTable); %>
    </table>

    <script type="text/javascript">
        <% Response.Write(JSString);%>
        $(".chzn-select").chosen();
        var processItem = function (itemType, itemId) {
            var chk = $("#chk" + itemType + itemId);
            var cmb = $("#cb" + itemType + itemId);
            var cg = $("#cg" + itemType + itemId);
            if (chk.prop("checked")) {
                cg.show();
                setLocalProfile(entityId, dataId, itemType, itemId, cmb.val());
            } else {
                cg.hide();
                deleteLocalProfile(entityId, dataId, itemType, itemId);
            }
        };

        var setLocalProfile = function(entityId, dataId, itemType, itemId, value) {
            $.ajax({
                url: "/asyst/localprofile",
                data: JSON.stringify({EntityId: entityId, DataId: dataId, ItemType: itemType, ItemId: itemId, Value: value}),
                dataType: "json",
                type: "POST",
                async: false,
                cache: false,
                success: function (retData) {
                    $('#' + itemType + itemId + ' .access-rights').html("");
                    $('#' + itemType + itemId + ' .access-rights').addClass('custom');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(Globa.SavingError.locale());
                }
            });
        };

        var deleteLocalProfile = function (entityId, dataId, itemType, itemId) {
            $.ajax({
                url: "/asyst/localprofile",
                data: JSON.stringify({ EntityId: entityId, DataId: dataId, ItemType: itemType, ItemId: itemId }),
                dataType: "json",
                type: "DELETE",
                async: false,
                cache: false,
                success: function (retData) {
                    var str = $('#chk' + itemType + itemId).attr("data-original-title");
                    if (typeof str == "undefined" || !str)
                        str = $('#chk' + itemType + itemId).attr("title");
                    $('#' + itemType + itemId + ' .access-rights').html(str);
                    $('#' + itemType + itemId + ' .access-rights').removeClass('custom');
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(Globa.SavingError.locale());
                }
            });
            $('[rel="tooltip"]').tooltip();
            $('[rel="tooltip"]').on('hidden', function () { return false; });
        };
    </script>
</asp:Content>

