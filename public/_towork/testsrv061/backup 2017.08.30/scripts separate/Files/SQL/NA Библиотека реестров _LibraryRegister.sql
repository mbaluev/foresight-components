/****************************************************************
*      START MetaPage Библиотека реестров _LibraryRegister
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Библиотека реестров ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '7415c761-9336-4fd0-a7c0-699482bd38ae'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='7415c761-9336-4fd0-a7c0-699482bd38ae')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('7415c761-9336-4fd0-a7c0-699482bd38ae', '_LibraryRegister', 'Библиотека реестров', NULL, NULL, NULL, 0, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '_LibraryRegister', [Title] = 'Библиотека реестров', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='7415c761-9336-4fd0-a7c0-699482bd38ae'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('615d3dde-360e-4725-bdad-57c2a276f4fb', '7415c761-9336-4fd0-a7c0-699482bd38ae', NULL, 0, 'UserProfileRegister', 'Реестр всех моих карточек', 'Реестр всех моих карточек', 3, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<div id="Register" class="widget__register"></div>
<style>
  .widget__register { height: 100%; }
  .widget__register > div { height: 100%; }
  .widget__register > div > .container-fluid { height: 100%; display: flex; flex-direction: column; }
  .widget__register > div > .container-fluid > .row-fluid { flex: 1 1 auto; display: flex; }
</style>
<script>
  $(function(){
    var viewName = "UserProfileRegister",
        id = ''Register'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    showView(viewName, newid);
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('14157f10-4184-4dad-af20-b945548612db', '7415c761-9336-4fd0-a7c0-699482bd38ae', NULL, 0, 'ProjectRegister', 'Реестр проектов', 'Реестр проектов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<div id="Register" class="widget__register"></div>
<style>
  .widget__register { height: 100%; }
  .widget__register > div { height: 100%; }
  .widget__register > div > .container-fluid { height: 100%; display: flex; flex-direction: column; }
  .widget__register > div > .container-fluid > .row-fluid { flex: 1 1 auto; display: flex; }
</style>
<script>
  $(function(){
    var viewName = "Project",
        id = ''Register'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    showView(viewName, newid);
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Библиотека реестров ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '902c3f05 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Библиотека реестров _LibraryRegister***/
