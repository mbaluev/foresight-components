/****************************************************************
*      START MetaPage Визуализация иерархии КТ KtChart
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Визуализация иерархии КТ ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '5b67ca3d-d10f-4939-8d9e-815a51ae275c'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='5b67ca3d-d10f-4939-8d9e-815a51ae275c')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('5b67ca3d-d10f-4939-8d9e-815a51ae275c', 'KtChart', 'Визуализация иерархии КТ', 'Визуализация иерархии контрольных точек', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'KtChart', [Title] = 'Визуализация иерархии КТ', [Description] = 'Визуализация иерархии контрольных точек', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='5b67ca3d-d10f-4939-8d9e-815a51ae275c'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('532bb706-f7cb-44d7-8bea-668321039626', '5b67ca3d-d10f-4939-8d9e-815a51ae275c', NULL, 0, 'ktChartView', 'Визуализация', 'Визуализация контейнер', 1, 0, 0, NULL, NULL, '<link href="/asyst/components/charts/ktChart/css/ktChart.css" rel="stylesheet"/>
<script>
  $(''.fs-view__middle-scroll'').css({ overflow: ''hidden'' });
  $(''#container'').attr(''id'', ''wrapper'');  
</script>
<script type="text/javascript" src="/asyst/components/charts/ktChart/js/jquery.dcjqaccordion.2.7.js"></script>
<script type="text/javascript" src="/asyst/components/charts/ktChart/js/sortable.js"></script>
<script type="text/javascript" src="/asyst/components/charts/ktChart/js/ktChart.js"></script>
<script type="text/javascript" src="/asyst/components/charts/ktChart/js/ktChart.model.js"></script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Визуализация иерархии КТ ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '84bd01c7 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Визуализация иерархии КТ KtChart***/
