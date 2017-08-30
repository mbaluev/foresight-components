/****************************************************************
*      START MetaDataSet DashboardWidgetContent
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
DELETE FROM [MetaDataSet]  WHERE [DataSetId]='5b85db5c-4a76-42ac-ba9d-bbfa7ff43b0d'
INSERT INTO [dbo].[MetaDataSet] ([DataSetId], [Name], [Title], [Description], [Query])
VALUES
 ('5b85db5c-4a76-42ac-ba9d-bbfa7ff43b0d', 'DashboardWidgetContent', 'Дашборд. Контент виджета', NULL, 'select mpe.Content
from dbo.MetaPageElement mpe
inner join dbo.MetaPage mp on mp.PageId = mpe.PageId
where mp.Name = @PageName AND mpe.Name = @ElementName')

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '2548033b ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaDataSet DashboardWidgetContent***/
