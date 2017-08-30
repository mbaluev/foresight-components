/****************************************************************
*      START MetaPage Дерево целей и показателей GoalTree
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Дерево целей и показателей ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '78563a1e-9cae-484d-aa4d-729597186fee'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='78563a1e-9cae-484d-aa4d-729597186fee')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('78563a1e-9cae-484d-aa4d-729597186fee', 'GoalTree', 'Дерево целей и показателей', 'Дерево целей и показателей', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'GoalTree', [Title] = 'Дерево целей и показателей', [Description] = 'Дерево целей и показателей', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='78563a1e-9cae-484d-aa4d-729597186fee'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('4df1a313-2df4-447a-9865-aba58ae09738', '78563a1e-9cae-484d-aa4d-729597186fee', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      single: true,
      editable: false,
      libraries: [''_LibraryMisc'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Дерево целей и показателей ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'a4535976 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Дерево целей и показателей GoalTree***/
