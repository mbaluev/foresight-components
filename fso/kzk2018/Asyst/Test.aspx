<%@ Page Title="" Language="C#" MasterPageFile="~/Clear.Master" AutoEventWireup="true" CodeBehind="Test.aspx.cs" Inherits="PRIZ.Test" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style> 
        .error {
            color: red;
            font-weight: bold;
        }
        .ok {
            color: green;
            font-weight: bold;
        }
        .warning {
            color: #daa520;
            font-weight: bold;
        }
        .cust {
            color: #696969;
            font-weight: bold;
        }
        [id="abc.def"] {
            color: red;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <script type='text/javascript'>
        function loadViewPage(name) {
            $.ajax({
                url: 'http://map:84/asyst/browse/' + name,
                type: 'GET',
                async: false,
                cache: false,
                data: {},
                dataType: "html",
                processData: false,
                headers: null,
                success: function (response, statusText, jqXHR) { console.log(name + ': ' + statusText); },
                error: function (a, b, c) { console.log(name + ': ' + b); }
            });
        }
    </script>

    <%Response.Write(HTMLString);%>
   
</asp:Content>

