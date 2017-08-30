/****************************************************************
*      START MetaPage Профиль Profile
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Профиль ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'dcc53678-43fd-42da-8ba8-466a564ed724'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='dcc53678-43fd-42da-8ba8-466a564ed724')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('dcc53678-43fd-42da-8ba8-466a564ed724', 'Profile', 'Профиль', 'Профиль', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Profile', [Title] = 'Профиль', [Description] = 'Профиль', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='dcc53678-43fd-42da-8ba8-466a564ed724'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('3ced74df-7ff9-4ffc-86b3-ea1d7ed5c657', 'dcc53678-43fd-42da-8ba8-466a564ed724', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      libraries: [''_LibraryMisc'', ''_LibraryRegister'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Профиль ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'f7fbdc4 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Профиль Profile***/
