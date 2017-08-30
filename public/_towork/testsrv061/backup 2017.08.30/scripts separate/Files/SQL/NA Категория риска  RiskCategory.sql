/****************************************************************
*      START MetaPage Категория риска  RiskCategory
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Категория риска  ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'bb32771b-5a63-495f-8c6f-7734acb83663'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='bb32771b-5a63-495f-8c6f-7734acb83663')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('bb32771b-5a63-495f-8c6f-7734acb83663', 'RiskCategory', 'Категория риска ', 'Категория риска ', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'RiskCategory', [Title] = 'Категория риска ', [Description] = 'Категория риска ', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='bb32771b-5a63-495f-8c6f-7734acb83663'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('f406c0b4-d82f-4bd0-8b38-1683bbae1aee', 'bb32771b-5a63-495f-8c6f-7734acb83663', NULL, 0, 'RiskCategoryRegister', 'Категория риска ', 'Категория риска ', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("RiskCategory", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Категория риска  ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'b2ba6f21 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Категория риска  RiskCategory***/
