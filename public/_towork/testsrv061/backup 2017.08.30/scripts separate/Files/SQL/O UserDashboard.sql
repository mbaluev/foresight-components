/****************************************************************
*      START MetaDataSet UserDashboard
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
DELETE FROM [MetaDataSet]  WHERE [DataSetId]='704fd6a7-1127-4ec8-92f7-c5506a42ac4f'
INSERT INTO [dbo].[MetaDataSet] ([DataSetId], [Name], [Title], [Description], [Query])
VALUES
 ('704fd6a7-1127-4ec8-92f7-c5506a42ac4f', 'UserDashboard', 'Дашборд. Настройки', NULL, 'select UserDashboardId, AccountId, PageName, Items
from dbo.UserDashboard
where AccountId = @AccountId and PageName = @PageName')

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'fb3a65d7 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaDataSet UserDashboard***/
