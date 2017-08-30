/****************************************************************
*      START MetaPage Библиотека виджетов прочих страниц _LibraryMisc
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Библиотека виджетов прочих страниц ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '7f91e837-1682-4b2f-a922-a474f9c557ea'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='7f91e837-1682-4b2f-a922-a474f9c557ea')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('7f91e837-1682-4b2f-a922-a474f9c557ea', '_LibraryMisc', 'Библиотека виджетов прочих страниц', NULL, NULL, NULL, 0, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '_LibraryMisc', [Title] = 'Библиотека виджетов прочих страниц', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='7f91e837-1682-4b2f-a922-a474f9c557ea'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('c8cbf1d6-8dce-4129-9039-6c2cd313eae1', '7f91e837-1682-4b2f-a922-a474f9c557ea', NULL, 0, 'UserProfileInfo', 'Фотография', 'Фотография', 3, 0, 0, NULL, NULL, '<div class="widget__image" id="image"></div>
<script>
  $(function(){
    var id = ''image'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    var user_info = {
      <htmlrow>
        url: ''{Url}'',
        name: ''{Name}'',
        orgunitname: ''{OrgUnitName}'',
        title: ''{Title}'',
        phone: ''{Phone}'',
        email: ''{EMail}''
      </htmlrow>
    };
    if (user_info.url == null) {
  		user_info.url = ''/asyst/api/file/get/6a277897-d11f-4bd2-be98-036f7e50cfb0/img_profile_big.png'';
  	}
    $(''#'' + newid).css({
    	''background-image'': "url(''" + user_info.url + "'')"
    });
  })
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec page_MyProfile @UserAccountId, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('fa218e31-d226-48d8-a50b-af7b15ae079f', '7f91e837-1682-4b2f-a922-a474f9c557ea', NULL, 0, 'OrgStructure', ' Организационная структура', ' Организационная структура', 2, 0, 0, NULL, NULL, '<link href="/asyst/api/file/get/fe7b2baa-d243-423b-a9e0-a7e32c67b208/css_panels.css" rel="stylesheet"/>
<script type="text/javascript" src="/asyst/api/file/get/9210d71f-667a-4a8b-9f1c-3258577d27ed/primitives.min.js"></script>
<script type="text/javascript" src="/asyst/api/file/get/1f178420-b5ab-429d-a3fd-983389e8c530/jquery.orgchart.js"></script>
<style>.orgdiagram { outline: none !important; }</style>
<div id="OrgStructure" style="height:100%;"></div>
<script>
  $(function(){
    var id = ''OrgStructure'', newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    $(''#''+newid).orgchart({
      items: [
        <htmlrow>
        new primitives.orgdiagram.ItemConfig({
          id: {UserId},
          parent: {ParentUserId},
          title: "{FullName}",
          description: ''{Title}'',				  
          image: "{Photo}",
          templateName: "contactTemplate",
          itemTitleColor: "{Color}",
          termoverdue: {TermOverdue},
          termout: {TermOut},
          terminwork: {TermInWork},
          termdone: {TermDone},
          budgetoverdue: {BudgetOverdue},
          budgetinwork: {BudgetInWork},
          budgetdone: {BudgetDone},
          risklow: {RiskLow},
          riskmiddle: {RiskMiddle},
          riskhigh: {RiskHigh},
          score: {Score},
          maxscore: {MaxScore},
        }),    
  		</htmlrow>
      ]
    });
  });
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_UserTree @UserLang, 1, 0', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('8f67cf35-c17e-4c3c-8d5e-c2335b31aa31', '7f91e837-1682-4b2f-a922-a474f9c557ea', NULL, 0, 'GoalTree', 'Дерево целей и показателей', 'Дерево целей и показателей', 1, 0, 0, NULL, NULL, '<link href="/asyst/api/file/get/98c7f1e0-1579-41a9-ba8b-854746c694b1/kpi.css" rel="stylesheet" type="text/css">
<script src="/asyst/api/file/get/f0436571-46ee-4099-b5fb-5567bae4891e/detect-element-resize.js" type="text/javascript"></script>
<div class="widget__content widget__content_scroll">
  <div id="p-kpi" class="p-kpi"></div>
</div>
<script src="/asyst/api/file/get/d6592714-e9fc-478a-b6c7-00587ef5e7a4/kpichart.js" type="text/javascript"></script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Библиотека виджетов прочих страниц ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'ffc25f98 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Библиотека виджетов прочих страниц _LibraryMisc***/
