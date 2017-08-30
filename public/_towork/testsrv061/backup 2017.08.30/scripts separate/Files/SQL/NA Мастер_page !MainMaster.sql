/****************************************************************
*      START MetaPage Мастер.page !MainMaster
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Мастер.page ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '84259629-bce6-4c26-a66f-e5e1f30aa8f2'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='84259629-bce6-4c26-a66f-e5e1f30aa8f2')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('84259629-bce6-4c26-a66f-e5e1f30aa8f2', '!MainMaster', 'Мастер.page', NULL, NULL, NULL, 1, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '!MainMaster', [Title] = 'Мастер.page', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 1, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='84259629-bce6-4c26-a66f-e5e1f30aa8f2'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('924448af-acdc-4850-9512-0f6197b61f11', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'head-window-onerror', NULL, NULL, 11, 0, 0, NULL, NULL, '<script>
(function(_){if (typeof(_._errs)==="undefined"){
_._errs=[];var c=_.onerror;_.onerror=function(){
var a=arguments;_errs.push(a);c&&c.apply(this,a)
};}})(window);  
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 0, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('1525f8ce-1b25-4f12-9ecf-1b73f7ec45c5', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 10, 'head-css', NULL, NULL, 20, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, '43f5d5e7-64ff-4673-a644-e8d12d53ceb0', NULL)
,('151051fc-7ad3-4e73-81c4-2342dfaa736d', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'body-open', NULL, NULL, 90, 0, 0, NULL, NULL, '<body>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('bf5c4791-139b-4b94-b878-26cb4c8f4f48', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 10, 'head-js', NULL, NULL, 25, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, '03429ac5-7494-49c2-8644-9ed45a01971b', NULL)
,('1f5beade-8e99-47f2-bb84-2f1a5ddd3ed6', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'body-close', NULL, NULL, 9000, 0, 0, NULL, NULL, '<style>
  /*глобальный поиск*/
  #globalsearch-results { top:73px !important; width:500px !important; max-width:500px !important; }	
  @media (max-width: 767px) {
    #globalsearch-results {
      left: 0px !important;
      top: 50px !important;
      width: 100% !important;
      max-width: 100% !important;
      box-shadow: none !important;
      border-radius: 0px !important;
      -webkit-border-radius: 0px !important;
      border-bottom: solid 1px #e1e1e8 !important;
    }
    #globalsearch-results ul li {
      padding: 11px 15px;
    }
    #globalsearch-results ul li a {
      padding: 0px;
    }
    #globalsearch-results ul li a:hover, 
    #globalsearch-results ul li a:focus, 
    #globalsearch-results ul li.focus a {
      background: transparent !important;
      color: #209ed5 !important;
    }
    #globalsearch-results ul li a:hover h4, 
    #globalsearch-results ul li a:focus h4, 
    #globalsearch-results ul li.focus a h4, 
    #globalsearch-results ul li a:hover p, 
    #globalsearch-results ul li a:focus p, 
    #globalsearch-results ul li.focus a p {
      color: #209ed5;
    }    
  }
</style>
</body>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('8df37208-b358-4793-b3d0-32b55d252dff', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'html-open', NULL, NULL, 0, 0, 0, NULL, NULL, '<html>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('8d97b134-7b05-470e-81bd-50d65a5d2105', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'HEAD', 'Шапка', 'Шапка', 101, NULL, NULL, NULL, NULL, '<header class="header fixed-top clearfix">
  <!--logo start-->
  <div class="brand">
    <a class="logo svg mobile-collapse" href="/asyst/page/index"></a>
    <div class="sidebar-toggle-box">
      <div class="c-btn menu"></div>
      <a class="c-btn home mobile-view" href="/"></a>
    </div>
  </div>
  <!--logo end-->
  <div class="top-nav clearfix">
    <!--search & user info start-->
    <ul class="nav pull-right top-menu">
      <li style="display:none;"><div class="c-btn intro"></div></li>
      <li><div class="c-btn support"></div></li>
      <li>
        <form>
          <input id="globalSearchQuery" type="text" class="c-btn srch form-control">
          <script type="text/javascript">
            Asyst.globalSearch.input(''#globalSearchQuery'', ''entitysearch'');
          </script>
        </form>
      </li>
      <li class="dropdown">
        <a data-toggle="dropdown" class="c-btn dropdown-toggle" aria-expanded="false">
          <div class="c-btn profile" id="userphoto"></div>
          <span class="username mobile-collapse" id="usernameinfo"></span>
          <b class="caret mobile-collapse"></b>
        </a>
        <ul class="dropdown-menu extended logout">
          <li><a href="/asyst/page/profile">Профиль</a></li>
          <li><a href="#" onclick="Asyst.API.AdminTools.logout();">Выход</a></li>
        </ul>
      </li>
      <li>
        <div class="toggle-right-box c-btn menu" id="chat-btn"></div>
      </li>
    </ul>
    <!--search & user info end-->
  </div>
</header>

', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('d5eae227-bf56-45ae-8bc9-57b1025dce3e', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'head-close', NULL, NULL, 50, 0, 0, NULL, NULL, '</head>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('2851836f-3e20-49fe-961d-6534af78e4ec', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'LEFTMENU_data', 'Левое меню. Данные', 'Левое меню. Данные', 120, 0, 0, NULL, NULL, '<script>
  $(function() {
    var $nav_accordion = $(''#nav-accordion'');
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
          var $menuitem = $(''<li class="sub-menu dcjq-parent-li" menulistid='' + item.menulistid + ''>'' +
                            ''  <a href="javascript:;" class="dcjq-parent">'' +
                            ''    <span>'' + item.name + ''</span>'' +
                            ''    <span class="dcjq-icon"></span>'' +
                            ''  </a>'' +
                            ''  <ul class="sub" style="display: none;">'' + 
                            ''  </ul>'' +
                            ''</li>'');
        } else {
          var $menuitem = $(''<li menulistid='' + item.menulistid + ''>'' +
                            ''  <a href="'' + item.url + ''">'' +
                            ''    <span>'' + item.name + ''</span>'' +
                            ''  </a>'' +
                            ''</li>'');
        }
        $nav_accordion.append($menuitem);
      } else {
        var $menuitem = $(''<li><a href="'' + item.url + ''">'' + item.name + ''</a></li>'');
        $nav_accordion.find(''li[menulistid="'' + item.parentid + ''"] ul.sub'').append($menuitem);
      }
    });
	/*--- left navigation accordion ---*/
	if ($.fn.dcAccordion) {
		$(''#nav-accordion'').dcAccordion({
		    eventType: ''click'',
		    autoClose: true,
		    saveState: true,
		    disableLink: true,
		    speed: ''300'',
		    showCount: false,
		    autoExpand: true,
		    classExpand: ''dcjq-current-parent''
		});
	}
	/*--- left navigation accordion ---*/
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec page_MyMenuList @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('90fd8161-1b0d-4b51-a3fe-95c2991659af', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'HEAD_enjoyhint', 'Шакпа. Инициализация тура', 'Шакпа. Подгрузка фотографии пользователя', 103, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/api/file/get/4aee4c03-35d6-4a93-994c-c919ecb2a0ad/foresighttour.css"/>
<script type="text/javascript" src="/asyst/api/file/get/dd275728-0a4c-4fde-972b-fc0f3132f080/foresighttour.js"></script>
<script>
  $(function(){
    createForesightTour(Asyst.Workspace.currentPage.pageName, 1);
  });
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('75c73294-0c75-4bb2-8afd-9c356f121595', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'HEAD_userphoto', 'Шакпа. Подгрузка фото', 'Шакпа. Подгрузка фотографии пользователя', 102, 0, 0, NULL, NULL, '<script>
  $(function() {
    $("#usernameinfo").text(Asyst.Workspace.currentUser.Name);
    $("#userphotoinfo").attr("alt", Asyst.Workspace.currentUser.Account);
    $("#userphotoinfo").attr("title", Asyst.Workspace.currentUser.Account);
    Asyst.API.Document.getFiles(
      {classname:''User'', id: Asyst.Workspace.currentUser.Id}, 
      true, 
      function(data){
        if (data.documents[0].files[0]) {
          $(''#userphoto'').css(''background-image'', "url(''" + data.documents[0].files[0].url + "'')");
          $(''#userphoto'').css(''background-size'', ''cover'');
          $(''#userphoto'').css(''background-color'', ''transparent'');
        }
      },
      null
    );
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('81514fc6-033f-4096-8cdb-a56255009c0b', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'html-close', NULL, NULL, 9999, 0, 0, NULL, NULL, '</html>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('178d4e4b-e0f7-4d9a-8f87-a5c77974e9fd', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'RIGHTBAR', 'Правое меню', NULL, 140, 0, 0, NULL, NULL, '<div id="chat" class="right-sidebar"></div>
<script type="text/javascript" src="/asyst/api/file/get/1404264f-ddc7-4ac5-956d-4732a469fc9a/js_jquery.splitter.js">
</script>
<script>
  $(function(){
    Asyst.board.make(''#chat'',''#chat-btn'');    
  });
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('08029da7-d73e-4a6e-a48a-ad3a0f08836d', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 10, 'head-meta', NULL, NULL, 15, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, 'a8c78445-2eaa-4934-ac70-6cfa778daa6b', NULL)
,('7fa355bd-8ffe-4cbd-9e6a-d5ba170a155a', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'HEAD_support', 'Шакпа. Техподдержка', 'Шакпа. Виджет техподдержки', 104, 0, 0, NULL, NULL, '<script>
  $(function(){
    $(''.c-btn.support'').click(function(){
      Dialogs.Support(
        ''Техподдержка'',
        ''Если у вас есть вопросы, позвоните нам по телефону <span class="link">+7 (959) 999 9999</span>,<br>напишите нам на электронную почту <a class="link" href="mailto:help@pmpractice.ru">help@pmpractice.ru</a>,<br><br>или воспользуйтесь формой ниже.'',
        true,
        true
      );
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('acb22dbb-5264-4008-af0d-e75bcebf1a91', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'LEFTMENU', 'Левое меню', 'Левое меню', 110, NULL, NULL, NULL, NULL, '<aside>
  <div id="sidebar" class="nav-collapse">
    <!-- sidebar menu start-->
    <div class="leftside-navigation" tabindex="5000" style="overflow: hidden; outline: none;">
      <ul class="sidebar-menu" id="nav-accordion">
      </ul>
    </div>
    <!-- sidebar menu end-->
  </div>
</aside>        ', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('6e4e02a0-e10e-440d-b9cb-e7e98c481074', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'head-open', NULL, NULL, 10, 0, 0, NULL, NULL, '<head>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('d68293c7-d923-4f0a-9162-f09e7f54e58b', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'body-placeholder', NULL, NULL, 150, 0, 0, NULL, NULL, '<asyst:Content ContentPlaceHolderId="MainBodyContent">
</asyst:Content>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Мастер.page ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'e0f9c5e3 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Мастер.page !MainMaster***/
