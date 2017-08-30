/****************************************************************
*      START MetaDataSet WidgetLibrary
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
DELETE FROM [MetaDataSet]  WHERE [DataSetId]='7698abd5-e1c8-4427-b1c1-7cc2b8422dea'
INSERT INTO [dbo].[MetaDataSet] ([DataSetId], [Name], [Title], [Description], [Query])
VALUES
 ('7698abd5-e1c8-4427-b1c1-7cc2b8422dea', 'WidgetLibrary', 'Дашборд. Библиотека виджетов', NULL, 'SELECT 
	mp.pageId, 
	mp.name AS metaPageName, 
	mp.title AS metaPageTitle, 
	mpe.name AS metaPageElementName, 
	mpe.title as metaPageElementTitle
from dbo.MetaPageElement mpe
inner join dbo.MetaPage mp on mp.PageId = mpe.PageId
where mp.Name in (SELECT * FROM dbo.Split(@PageName, '',''))
order BY mp.title, mpe.position')

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '7844fb01 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaDataSet WidgetLibrary***/
