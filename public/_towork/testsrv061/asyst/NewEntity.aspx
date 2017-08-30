<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true" CodeBehind="NewEntity.aspx.cs" Inherits="PRIZ.NewEntity" EnableSessionState="false" %>

<asp:Content ID="Content3" ContentPlaceHolderID="head" runat="server">
    <% Response.Write(CardJS); %> 
    <% Response.Write(CardCSS); %> 
    <% Response.Write(PMPractice.Db.Web.WebUtils.InitUser(User)); %>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <% Response.Write(resultText);%>
    
</asp:Content>

