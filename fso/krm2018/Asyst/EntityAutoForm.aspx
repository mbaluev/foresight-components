<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true" CodeBehind="EntityAutoForm.aspx.cs" Inherits="PRIZ.EntityAutoForm" EnableSessionState="false"%>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <% Response.Write(CardJS); %> 
    <% Response.Write(CardCSS); %> 
    <% Response.Write(PMPractice.Db.Web.WebUtils.InitUser(User)); %>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <% Response.Write(Body); %>
</asp:Content>

