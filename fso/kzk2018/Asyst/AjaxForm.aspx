<%@ Page Title="" Language="C#" MasterPageFile="~/Clear.Master" AutoEventWireup="true" CodeBehind="AjaxForm.aspx.cs" Inherits="PRIZ.AjaxForm" EnableSessionState="false" ValidateRequest="false"%>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <% Response.Write(CardJS); %> 
    <% Response.Write(CardCSS); %> 
    <% Response.Write(PMPractice.Db.Web.WebUtils.InitUser(User)); %>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <% Response.Write(Body); %>
</asp:Content>

