/****************************************************************
*      START MetaPage ForesightMaster.page !ForesightMaster
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage ForesightMaster.page ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('21977fe6-51a4-4ed3-9bf4-9cb22478b77f', '!ForesightMaster', 'ForesightMaster.page', NULL, NULL, NULL, 1, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '!ForesightMaster', [Title] = 'ForesightMaster.page', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 1, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='21977fe6-51a4-4ed3-9bf4-9cb22478b77f'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('d4ecd4f1-2240-43e4-9a89-468178a78b7d', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'fs-view', NULL, NULL, 101, 0, 0, NULL, NULL, '<div class="fs-view">
  <div class="fs-view__header">
    <div class="header">
      <div class="header__column header__column-left">
        <button class="header__column-item button" type="button" data-fc="button" id="button_toggle-menu">
          <span class="icon icon_css_animate">
            <span class="icon__menu" data-fc="icon__menu">
              <span class="icon__menu-global icon__menu-top"></span>
              <span class="icon__menu-global icon__menu-middle"></span>
              <span class="icon__menu-global icon__menu-bottom"></span>
            </span>
          </span>
          <span class="button__anim"></span>
        </button>
        <a class="header__column-item button" href="/" data-fc="button">
          <span class="icon icon_svg_home"></span>
          <span class="button__anim"></span>
        </a>
        <button class="header__column-item button" type="button" data-fc="button">
          <span class="icon icon_svg_search"></span>
          <span class="button__anim"></span>
        </button>
      </div>
      <div class="header__column header__column-right">
        <button class="header__column-item button" data-fc="button" data-toggle="popup" data-target="#account">
          <span class="icon icon_photo" id="user__photo"></span>
          <span class="button__text mobile mobile_hide" id="user__name">Функциональный администратор</span>
          <span class="icon icon_svg_down"></span>
        </button>
        <div class="popup" id="account" data-position="bottom left" data-width="auto">
          <ul class="popup__list">
            <li class="popup__list-item">
              <a class="popup__link" href="/asyst/page/profile">
                <span class="popup__text">Профиль</span>
              </a>
            </li>
            <li class="popup__list-item">
              <a class="popup__link" href="/asyst/page/settingscenter">
                <span class="popup__text">Центр настроек</span>
              </a>
            </li>
            <li class="popup__list-item">
              <a class="popup__link" href="/asyst/default.aspx?showadmin=true" target="_blank">
                <span class="popup__text">Администрирование</span>
              </a>
            </li>             
            <li class="popup__list-item">
              <a class="popup__link" href="#" onclick="Asyst.API.AdminTools.logout();">
                <span class="popup__text">Выход</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="fs-view__main">
    <div class="fs-view__left fs-view__left_hidden">
      <div class="menu"></div>
    </div>
    <div class="fs-view__middle fs-view__middle_full">
      <div class="fs-view__middle-scroll">
        <div id="container"></div>
      </div>
    </div>
  </div>
</div>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('40242335-1d49-428c-85b7-612ba2e721d4', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'body_open', NULL, NULL, 90, 0, 0, NULL, NULL, '<body class="page proximanova">', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('2bd8bc21-e02a-4d7b-b5ab-68d6a965970b', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'user__name_data', 'загрузка имени и фотки пользователя', NULL, 8002, 0, 0, NULL, NULL, '<script>
  $(function(){
    $("#user__name").text(Asyst.Workspace.currentUser.Name);
    $("#user__photo-info").attr("alt", Asyst.Workspace.currentUser.Account);
    $("#user__photo-info").attr("title", Asyst.Workspace.currentUser.Account);
    Asyst.API.Document.getFiles(
      {classname:''User'', id: Asyst.Workspace.currentUser.Id}, 
      true, 
      function(data){
        if (data.documents[0].files[0]) {
          $(''#user__photo'').css(''background-image'', "url(''" + data.documents[0].files[0].url + "'')");
        }
      },
      null
    );
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('5cf25b11-60e0-48cf-b492-6b37aa63a32c', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'html_open', NULL, NULL, 0, 0, 0, NULL, NULL, '<!DOCTYPE html>
<html>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('7adadcad-fd53-4a53-86bc-6e1a0d12a2bf', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'asyst_js', 'asyst и application скрипты', NULL, 8000, 0, 0, NULL, NULL, '<script type="text/javascript" src="/asyst/js/asyst.globalization.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.third.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.workspace.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.number.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.globalsearch.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.board.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.utils.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.changerequest.js"></script>
<script type="text/javascript" src="/asyst/js/application.js"></script>
<script type="text/javascript" src="/asyst/js/application.model.js"></script>
<script type="text/javascript" src="/asyst/js/application.documents.js"></script>
<script type="text/javascript" src="/asyst/js/application.points.js"></script>
<script type="text/javascript" src="/asyst/js/application.page.js"></script>
<script type="text/javascript" src="/asyst/spd.js"></script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('a1457083-4977-4230-a0a8-77a1f4303ce2', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'components_js', 'components скрипты', NULL, 8001, 0, 0, NULL, NULL, '<script type="text/javascript" src="/asyst/components/foresight.third.debug.js"></script>
<script type="text/javascript" src="/asyst/components/foresight.components.debug.js"></script>
<script type="text/javascript" src="/asyst/components/foresight.pages.debug.js"></script>
<script type="text/javascript" src="/asyst/components/asyst/asyst.dashboard.js"></script>
<script type="text/javascript" src="/asyst/components/asyst/asyst.reports.js"></script>
<script type="text/javascript" src="/asyst/components/asyst.loaders/asyst.metaelementloader.js"></script>
<script type="text/javascript" src="/asyst/components/asyst.loaders/asyst.imageloader.js"></script>
<script type="text/javascript" src="/asyst/components/asyst.loaders/asyst.contentloader.js"></script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('b5f1b666-b178-42ed-8a17-bd353a2f096c', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'body_close', NULL, NULL, 9000, 0, 0, NULL, NULL, '</body>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('039df61b-7615-447f-a823-c18a19ccfa37', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'html_close', NULL, NULL, 9999, 0, 0, NULL, NULL, '</html>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('726b215b-0a06-4bc5-a70d-c4d3321c8059', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'placeholder', 'загрузка данных страницы', NULL, 8100, 0, 0, NULL, NULL, '<asyst:Content ContentPlaceHolderId="content"></asyst:Content>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('468bd58c-a0c0-4ef0-999b-e8a584334cd8', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'head', NULL, NULL, 10, 0, 0, NULL, NULL, '<head>
  <script>
    (function(_){if (typeof(_._errs)==="undefined"){
      _._errs=[];var c=_.onerror;_.onerror=function(){
        var a=arguments;_errs.push(a);c&&c.apply(this,a)
      };}})(window);  
  </script>
  <title>foresight</title>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <!-- необходимые для реестров стили закомментируем -->
  <!--
  <link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
  <link rel="stylesheet" href="/asyst/css/asyst.global.css">
  <link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
  -->
  
  <link rel="stylesheet" href="/asyst/components/foresight.third.min.css" type="text/css" media="all">
  <link rel="stylesheet" href="/asyst/components/foresight.components.min.css" type="text/css" media="all">
</head>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('8030d12b-270c-4702-944d-f03d91092f3e', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'menu_data', 'Загрузка меню', NULL, 8003, 0, 0, NULL, NULL, '<script>
  $(function(){
    var $menu__list = $(''<ul class="menu__list"></ul>'');
    var data = [
      <htmlrow>
      {
        menulistid: "{MenuListId}",
        parentid: "{ParentId}",
        name: "{Name}",
        url: "{URL}",
        order: "{Order}",
      },
  </htmlrow>
    ];
    data.forEach(function(item) {
      if (item.parentid == ''null'') {
        var haschild = false;
        data.forEach(function(e) { if (e.parentid == item.menulistid) { haschild = true; } });
        if (haschild) {
          var $menu__item = $([
            ''<li class="menu__item" menulistid='' + item.menulistid + ''>'',
            ''<a class="menu__item-link link">'',
            ''<span class="menu__item-link-content">'',
            ''<span class="menu__item-text">'' + item.name + ''</span>'',
            ''<span class="icon menu__icon icon_svg_right_white"></span>'',
            ''</span>'',
            ''</a>'',
            ''<div class="menu menu__submenu-container">'',
            ''<ul class="menu__list menu__submenu">'',
            ''</ul>'',
            ''</div>'',
            ''</li>''
          ].join(''''));
        } else {
          var $menu__item = $([
            ''<li class="menu__item" menulistid='' + item.menulistid + ''>'',
            ''<a class="menu__item-link link" href="'' + item.url + ''">'',
            ''<span class="menu__item-link-content">'',
            ''<span class="menu__item-text">'' + item.name + ''</span>'',
            ''</span>'',
            ''</a>'',
            ''</li>''
          ].join(''''));
        }
        $menu__list.append($menu__item);
      } else {
        var $menu__item = $([
          ''<li class="menu__item" menulistid='' + item.menulistid + ''>'',
          ''<a class="menu__item-link link" href="'' + item.url + ''">'',
          ''<span class="menu__item-link-content">'',
          ''<span class="menu__item-text">'' + item.name + ''</span>'',
          ''</span>'',
          ''</a>'',
          ''</li>''
        ].join(''''));
        $menu__list.find(''li[menulistid="'' + item.parentid + ''"] ul.menu__submenu'').append($menu__item);
      }
    });
    $(''.menu'').append($menu__list);
    $(''.menu'').menu();
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec page_MyMenuList @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage ForesightMaster.page ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '47aeff92 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage ForesightMaster.page !ForesightMaster***/
