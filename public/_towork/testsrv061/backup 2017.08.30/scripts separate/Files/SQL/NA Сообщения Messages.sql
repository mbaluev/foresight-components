/****************************************************************
*      START MetaPage Сообщения Messages
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Сообщения ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '9c01ce98-8776-48e9-8733-802e1632aa06'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='9c01ce98-8776-48e9-8733-802e1632aa06')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('9c01ce98-8776-48e9-8733-802e1632aa06', 'Messages', 'Сообщения', 'Сообщения', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Messages', [Title] = 'Сообщения', [Description] = 'Сообщения', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='9c01ce98-8776-48e9-8733-802e1632aa06'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('f4aaecbf-5793-4e04-ae31-9526a034e7b2', '9c01ce98-8776-48e9-8733-802e1632aa06', NULL, 0, 'MessagesRegister', 'Реестр сообщений', 'Реестр сообщений', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("MyCommentList", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Сообщения ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'd90c437f ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Сообщения Messages***/
