/****************************************************************
*      START MetaPage Реестр проектов Project2
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр проектов ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '85268722-aee7-4f04-aa19-6b4b7a987f2d'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='85268722-aee7-4f04-aa19-6b4b7a987f2d')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('85268722-aee7-4f04-aa19-6b4b7a987f2d', 'Project2', 'Реестр проектов', 'Реестр проектов', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Project2', [Title] = 'Реестр проектов', [Description] = 'Реестр проектов', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='85268722-aee7-4f04-aa19-6b4b7a987f2d'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('c87cbe41-ca22-4d95-884d-fc9277d57b3c', '85268722-aee7-4f04-aa19-6b4b7a987f2d', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      single: true,
      editable: false,
      libraries: [''_LibraryRegister'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр проектов ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'ef91a243 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр проектов Project2***/
