<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Error.aspx.cs" Inherits="PRIZ.Error" %>
<%@ Import Namespace="PMPractice.Db" %>

<!DOCTYPE html>
<html lang="ru">
<head runat="server">
    <title>Произошла ошибка</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <link href="/asyst/anon/systemPages.css" rel="stylesheet">
    <style>
        .tile-content {
            padding: 15px;
            color: #333;
        }

        .tile-content div {
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <%--<form id="form1" runat="server">--%>
    <div class="container">
        <div class="row">
            <div class="col-400">
                <div class="panel error gradient">
                    <div class="img-404"></div>
                    <div class="tile-content">
                        <div>
                            <%=MultiLanguageUtils.Resources.ErrorInputStringFormat%>
                        </div>
                        <div>
                            <b><%=MultiLanguageUtils.ThreadCultureString("##Описание##") %>:</b> 
                            <%=Request.QueryString["err"]%>
                        </div>
                        <div>
                            <b> <%=MultiLanguageUtils.Resources.RequestedUrl%>:</b> <%=Request.QueryString["path"] %>
                        </div>
                    </div>
                    <div class="tile-content-bottom color red">
                        <div class="info-right"><a href="/"><i class="icon-home"></i></a></div>
                        <div class="info-left"><%=MultiLanguageUtils.Resources.ServerErrorInApp %> "<%=Request.QueryString["appName"] %>"</div>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%--</form>--%>
</body>
</html>
