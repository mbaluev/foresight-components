<%@ Page Title="" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="PRIZ._default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="/asyst/js/asyst.globalsearch.js" type="text/javascript"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">

    <% Response.Write(Body); %>
    
</asp:Content>

