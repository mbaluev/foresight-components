/****************************************************************
*      START MetaPage Пользователи User
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Пользователи ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '3239518d-a84e-49bc-b5ed-f5e20e75e368'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='3239518d-a84e-49bc-b5ed-f5e20e75e368')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('3239518d-a84e-49bc-b5ed-f5e20e75e368', 'User', 'Пользователи', 'Пользователи', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'User', [Title] = 'Пользователи', [Description] = 'Пользователи', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='3239518d-a84e-49bc-b5ed-f5e20e75e368'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('36f1024a-f285-482f-82db-22b3c7766494', '3239518d-a84e-49bc-b5ed-f5e20e75e368', NULL, 0, 'UserRegister', 'Реестр пользователей', 'Реестр пользователей', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("User", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Пользователи ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '3d6018e2 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Пользователи User***/
