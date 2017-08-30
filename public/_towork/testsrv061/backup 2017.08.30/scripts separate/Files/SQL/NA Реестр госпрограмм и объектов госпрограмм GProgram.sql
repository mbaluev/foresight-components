/****************************************************************
*      START MetaPage Реестр госпрограмм и объектов госпрограмм GProgram
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр госпрограмм и объектов госпрограмм ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'f8863ecb-8b0b-45f5-9c5a-d056f723cc11'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='f8863ecb-8b0b-45f5-9c5a-d056f723cc11')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('f8863ecb-8b0b-45f5-9c5a-d056f723cc11', 'GProgram', 'Реестр госпрограмм и объектов госпрограмм', 'Реестр госпрограмм и объектов госпрограмм', NULL, NULL, 0, 'Content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'GProgram', [Title] = 'Реестр госпрограмм и объектов госпрограмм', [Description] = 'Реестр госпрограмм и объектов госпрограмм', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'Content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='f8863ecb-8b0b-45f5-9c5a-d056f723cc11'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('bee6824d-66e4-417d-9444-28301d97d289', 'f8863ecb-8b0b-45f5-9c5a-d056f723cc11', NULL, 0, 'register', 'Реестр', 'Реестр проектов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("GProgram", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр госпрограмм и объектов госпрограмм ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '35e38e18 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр госпрограмм и объектов госпрограмм GProgram***/
