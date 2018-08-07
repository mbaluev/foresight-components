<%@ Page Title="" Language="C#" MasterPageFile="~/Fluid.Master" AutoEventWireup="true" CodeBehind="View.aspx.cs" Inherits="PRIZ.BrowseView" EnableSessionState="false" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">   
    <style>
        #BrowseSearch
        {
            margin-top: 3px;
            padding-right: 24px;
        }    
        
        .search-clear { 
           text-indent: -99999px; 
           width: 16px; 
           height: 16px; 
           display: block;
           background: transparent url(/asyst/img/search-clear.png) 0 0 no-repeat;
           position: absolute;
           top:9px;
           right: 14px;
        }
    </style>
    <script type="text/javascript">
        function updateSearchInput() {
            var el = $('#BrowseSearch');
            if (el.val())
                $('.search-clear').show();
            else
                $('.search-clear').hide();
        }
    </script> 
  
    <% Response.Write(ViewJS); %> 
    <% Response.Write(ViewCSS); %> 
    <% Response.Write(PMPractice.Db.Web.WebUtils.InitUser(User)); %>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <% Response.Write(Body); %>
</asp:Content>

