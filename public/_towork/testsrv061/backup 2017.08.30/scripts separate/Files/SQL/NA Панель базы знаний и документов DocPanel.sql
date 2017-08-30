/****************************************************************
*      START MetaPage Панель базы знаний и документов DocPanel
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Панель базы знаний и документов ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'eb1d0c35-29e1-47f3-812c-24e36211d8f9'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='eb1d0c35-29e1-47f3-812c-24e36211d8f9')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('eb1d0c35-29e1-47f3-812c-24e36211d8f9', 'DocPanel', 'Панель базы знаний и документов', 'Панель базы знаний и документов', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'DocPanel', [Title] = 'Панель базы знаний и документов', [Description] = 'Панель базы знаний и документов', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='eb1d0c35-29e1-47f3-812c-24e36211d8f9'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('f841ef35-6a8b-412e-af6d-ff2b8fcea324', 'eb1d0c35-29e1-47f3-812c-24e36211d8f9', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      libraries: [''_LibraryDocPanel'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Панель базы знаний и документов ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '474cd669 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Панель базы знаний и документов DocPanel***/
