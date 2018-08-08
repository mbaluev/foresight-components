<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="logon.aspx.cs" Inherits="PRIZ.login" %>
<!DOCTYPE html>
<html lang="ru">
<head id="Head1" runat="server">
    <title>Вход в систему</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="anon/krm2018/foresight.components.min.css" type="text/css" media="all">
    <link rel="stylesheet" href="anon/krm2018/design.krmsrv.min.css" type="text/css" media="all">
</head>
<body class="page proximanova">
    <div class="fs-view">
        <div class="fs-view__main">
            <div class="fs-view__middle fs-view__middle_full fs-view__middle_login">
                <div class="widget" style="width:300px; height:auto; z-index:1;">
                    <div class="widget__header">
                        <div class="widget__header-name">
                            <button class="button button_collapse" type="button">
                                <span class="button__text">Вход</span>
                            </button>
                        </div>
                        <div class="widget__header-actions">
                            <a class="button" type="button" data-fc="button" href="/">
                                <span class="icon icon_svg_home"></span>
                            </a>
                        </div>
                    </div>
                    <div class="widget__border widget__border_color_default">
                        <div class="widget__body">
                            <div class="widget__body-data widget__body-data_type_form">
                                <div class="widget__content">
                                    <form id="loginForm" method="post" class="form-horizontal" role="form" runat="server" data-fc="form">
                                    <fieldset>
                                        <div class="control">
                                            <div class="control__container control__container_vertical">
                                            <asp:Label ID="InvalidPassword" runat="server" class="control__error"></asp:Label>
                                            <span class="input input__has-clear" data-fc="input" data-field="email">
                                                <span class="input__box">
                                                    <input id="UserName" type="text" runat="server" autofocus class="input__control" placeholder="Логин">
                                                    <div class="button" type="button" data-fc="button">
                                                        <span class="icon icon_svg_close"></span>
                                                    </div>
                                                </span>
                                            </span>
                                            </div>
                                        </div>
                                        <div class="control">
                                            <div class="control__container control__container_vertical">
                                            <span class="input input__has-clear" data-fc="input" data-field="password">
                                                <span class="input__box">
                                                    <input class="input__control" name="password" type="password" id="UserPassword" value="" runat="server" placeholder="Пароль">
                                                    <div class="button" type="button" data-fc="button">
                                                        <span class="icon icon_svg_close"></span>
                                                    </div>
                                                </span>
                                            </span>
                                            </div>
                                        </div>
                                        <div class="control">
                                            <div class="control__container control__container_vertical">
                                                <ASP:CheckBox id="PersistCookie" runat="server" autopostback="false" checked="true" class="hidden"/>
                                                <label class="checkbox" data-fc="checkbox" data-checked="true" id="stayLogin">
                                                    <input class="checkbox__input" type="checkbox" name="first" hidden="">
                                                    <label class="checkbox__label">Оставаться в системе</label>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="control">
                                            <div class="control__container control__container_horizontal">
                                                <asp:Button ID="Button1" runat="server" onclick="LoginSubmitButton_Click" Text="Войти"
                                                    class="button" style="background-color:#5a97f2; color:#fff; padding:0 10px; cursor:pointer;"/>
                                            </div>
                                        </div>
                                    </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fs-view__background-left"></div>
                <div class="fs-view__background-right"></div>
            </div>
        </div>
    </div>
    <script src="anon/krm2018/jquery-3.2.1.min.js"></script>
    <script src="anon/krm2018/foresight.components.min.js"></script>
    <script>
        $(function(){
            var $asp_checkbox = $('#PersistCookie'),
                $form_checkbox = $('#stayLogin');
            $form_checkbox.on('click', function(){
                var checked = $form_checkbox.data('checked');
                if (checked) {
                    $asp_checkbox.attr('checked', 'checked');
                    $asp_checkbox.prop('checked', true);
                } else {
                    $asp_checkbox.removeAttr('checked');
                    $asp_checkbox.prop('checked', false);
                }
            });
        })
    </script>
</body>
</html>
