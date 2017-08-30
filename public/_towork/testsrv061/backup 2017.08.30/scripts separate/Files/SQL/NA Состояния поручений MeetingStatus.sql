/****************************************************************
*      START MetaPage Состояния поручений MeetingStatus
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Состояния поручений ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'a0e52a15-bbb0-40f3-9250-cbfc59048fb3'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='a0e52a15-bbb0-40f3-9250-cbfc59048fb3')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('a0e52a15-bbb0-40f3-9250-cbfc59048fb3', 'MeetingStatus', 'Состояния поручений', 'Состояния поручений', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'MeetingStatus', [Title] = 'Состояния поручений', [Description] = 'Состояния поручений', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='a0e52a15-bbb0-40f3-9250-cbfc59048fb3'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('e1648fb7-eaa2-4d03-b00c-6a32e94213ee', 'a0e52a15-bbb0-40f3-9250-cbfc59048fb3', NULL, 0, 'MeetingStatusRegister', 'Реестр состояний поручения', 'Реестр состояний поручения', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("MeetingStatus", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Состояния поручений ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '5882b425 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Состояния поручений MeetingStatus***/
