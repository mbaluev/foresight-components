<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="logon.aspx.cs" Inherits="PRIZ.login" %>
<!DOCTYPE html>
<html lang="ru">
  <head id="Head1" runat="server">
	<title>Вход в систему</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <link href="anon/systemPages.css" rel="stylesheet">
</head>
<body class="logon">
	<div class="img-login"></div>
	<div class="container">
		<div class="row">
			<div class="col-400">
				<div class="panel gradient opacity auto">
					<div class="tile-content">
						<div class="tile-content-name color blue">
						    <div class="info-right"><a href="/"><i class="icon-home"></i></a></div>
							<div class="info-left">Вход</div>
							<div class="clear"></div>
						</div>
						<div class="tile-content-text">
							<form id="loginForm" method="post" class="form-horizontal" role="form" runat="server">
							    <fieldset>
								    <div class="form-group" style="padding:0;">
								        <asp:Label ID="InvalidPassword" runat="server" class="col-xs-12 control-label error"></asp:Label>
								    </div>
								    <div class="form-group">
									    <label for="UserName" class="col-xs-12 control-label">Логин</label>
									    <div class="col-xs-12">
									        <input class="form-control" id="UserName" type="text" runat="server" autofocus/>
									    </div>
									    <label for="UserPassword" class="col-xs-12 control-label">Пароль</label>
									    <div class="col-xs-12">
									        <input class="form-control" name="password" type="password" id="UserPassword" value="" runat="server"/>
									    </div>
								    </div>
                                    <div class="form-group">
									    <div class="col-xs-12">
										    <ASP:CheckBox id="PersistCookie" runat="server" autopostback="false" Checked="true" /> 
                                            <label for="PersistCookie" class="control-label">Запомнить меня на этом компьютере</label>
									    </div>
								    </div>
                                    
								    <div class="form-group">
									    <div class="col-xs-12 text-right">
									        <asp:Button class="btn btn-info" ID="Button1" runat="server" onclick="LoginSubmitButton_Click" Text="Войти" />
									    </div>
								    </div>
                                </fieldset>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
    
</html>
