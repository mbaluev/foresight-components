/****************************************************************
*      START MetaPage Группы Group
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Группы ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '3533d41f-e70d-4ea8-87e1-65c6c772742b'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='3533d41f-e70d-4ea8-87e1-65c6c772742b')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('3533d41f-e70d-4ea8-87e1-65c6c772742b', 'Group', 'Группы', 'Группы', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Group', [Title] = 'Группы', [Description] = 'Группы', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='3533d41f-e70d-4ea8-87e1-65c6c772742b'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('31104dae-eec7-4536-88c4-18e00d791b6d', '3533d41f-e70d-4ea8-87e1-65c6c772742b', NULL, 0, 'GroupRegister', 'Реестр групп', 'Реестр групп', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Group", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Группы ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'dbe5b69d ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Группы Group***/
