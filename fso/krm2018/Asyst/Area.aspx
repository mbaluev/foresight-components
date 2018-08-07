<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Area.aspx.cs" Inherits="PRIZ.Area" MasterPageFile="~/Fluid.Master"%>
<asp:Content ID="ContentPlaceHolder" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <form id="Form1" runat="server">
		<% if (CanShow) { %>

			<style>
				.container-fluid { padding: 10px 10px 0 10px !important; box-sizing: border-box; }
				.container-fluid .btn { margin-bottom: 10px; }
				.filter-control { margin-bottom: 10px; margin-right: 20px; float: left; }
				.filter-label { display: inline-block; line-height: 15px; padding-right: 10px; color: #999; }
				.filter-input { margin-right: 0; margin-bottom: 0 !important; }
				.table { font-size: 11px; border: none; border-top: solid 1px #ddd; }
				.table input { margin: 0; width: 100%; box-sizing: border-box; line-height: 28px; height: 28px; }
				.table .iedit, .table .ishow { margin-right: 5px; }
				.table .iedit:hover, .table .ishow:hover { text-decoration: none; }
				.table .iedit > [class*=" icon-"], .table .iedit > [class^=icon-] { margin-top: 5px; }
				.table .ishow > [class*=" icon-"], .table .ishow > [class^=icon-] { margin-top: 1px; }
				.message { padding-top: 0px !important; }
				.message .alert { padding: 8px 8px 8px 14px; margin-bottom: 0px; margin-top: 10px; }
				.message .alert .close { top: 0px; right: 0px; }
				.btn-refresh { float: right; padding: 15px 22px; }
			</style>

			<asp:Panel class="container-fluid message" Visible="False" id="divError" runat="server">
				<div class="alert alert-error">
					<button type="button" class="close" data-dismiss="alert"><i class="icon-remove"></i></button>
					<asp:Label ID="ErrorLabel" runat="server"></asp:Label>
				</div>
			</asp:Panel>

            <asp:LinkButton runat="server" OnClick="OnClick" Text="Refresh" ToolTip="Обновить" cssClass="btn-refresh">
                <i class="icon-refresh"></i>
            </asp:LinkButton>

			<div class="container-fluid">
				<div class="filter-control">
					<span class="filter-label">Имя площадки</span>
					<asp:TextBox ID="DBName" runat="server" CssClass="filter-input"></asp:TextBox>
				</div>
				<div class="filter-control">
					<span class="filter-label">Адрес площадки</span>
					<asp:TextBox ID="HostName" runat="server" CssClass="filter-input"></asp:TextBox>
				</div>
                <asp:DropDownList ID="TemplateList" runat="server" Width="450px" ></asp:DropDownList>
				<asp:Button ID="AddArea" OnClick="AddAreaClick" runat="server" Text="добавить площадку" CssClass="btn"></asp:Button>
                
			</div>
            
			<asp:SqlDataSource ID="areaSDS" runat="server"
				 ConnectionString="<%$ ConnectionStrings:AsystAreaConnectionString %>"
				 SelectCommand="
declare @sql nvarchar(max) = N'select top(1) account.account + ''/''  + [user].password from account inner join [user] on userid = accountid where [user].isfunctionaladministrator =1'
if object_id(N'tempdb..#A') is not null drop table #A;
create table #A (info nvarchar(200));
exec [dbo].[GetDataFromAllDb] @sql, '#A', 'SourceSystem', 0;
select * from #A inner join area a on #A.SourceSystem=a.name order by a.name;
drop table #A;"
				 UpdateCommand="Update Area set ConnectionString=@ConnectionString, Host = @Host, Description = @Description where AreaId = @AreaId" 
                 DeleteCommand="Delete from Area where AreaId =@AreaId"
                 />

			<asp:GridView ID="GridView1" runat="server" cssclass="table"
				DataSourceID="areaSDS" AutoGenerateColumns="False" DataKeyNames="areaid" AutoGenerateEditButton="False" 
                OnRowDeleting="GridView1_OnRowDeleting" OnRowDeleted="GridView1_OnRowDeleted" OnRowEditing="GridView1_OnRowEditing" OnRowUpdated="GridView1_OnRowUpdated">
               <Columns>
					<asp:BoundField DataField="AreaID" HeaderText="GUID" ReadOnly="True" ItemStyle-Width="100px" ItemStyle-Wrap="false" />
                    <asp:BoundField DataField="Name" HeaderText="Имя" ReadOnly="True"/>
                    <asp:BoundField DataField="Description" HeaderText="Описание"/>
                    <asp:BoundField DataField="Host" HeaderText="Хост" Visible="False"/>
                    <asp:HyperLinkField DataTextField="Host" HeaderText="Хост"  DataNavigateUrlFields="Host" DataNavigateUrlFormatString="http://{0}" Target="_blank"/>
                    <asp:BoundField DataField="ConnectionString" HeaderText="Строка подключения"/>
                    <asp:BoundField DataField="Info" HeaderText="FA" ReadOnly="True"/>
					<asp:TemplateField>
						<HeaderStyle width="50" />
						<ItemStyle width="50" />
						<EditItemTemplate>
							<asp:LinkButton ID="ButtonUpdate" runat="server" CommandName="Update" cssClass="iedit" ToolTip="Сохранить">
								<i class="icon-ok"></i>
							</asp:LinkButton>
							<asp:LinkButton ID="ButtonCancel" runat="server" CommandName="Cancel" cssClass="iedit" ToolTip="Отменить">
								<i class="icon-remove"></i>
							</asp:LinkButton>							
						</EditItemTemplate>
						<ItemTemplate>
							<asp:LinkButton ID="ButtonEdit" runat="server" CommandName="Edit" cssClass="ishow" ToolTip="Редактировать"> 
								<i class="icon-pencil"></i>
							</asp:LinkButton>
							<asp:LinkButton ID="ButtonDelete" runat="server" CommandName="Delete" cssClass="ishow" ToolTip="Удалить">
								<i class="icon-trash"></i>
							</asp:LinkButton>
						</ItemTemplate>
					</asp:TemplateField>
                </Columns>
			</asp:GridView>
		<% 
			} else {
				Response.Write("<div>вам тут не рады</div>"); 
			} 
		%>
    </form>
</asp:Content>