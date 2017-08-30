/****************************************************************
*      START MenuList Проектные инициативы
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***START Меню Проектные инициативы***/
SET IDENTITY_INSERT MenuList ON
IF NOT EXISTS (SELECT 1 FROM [dbo].[MenuList] WHERE [MenuListId]=10024)
INSERT INTO [MenuList] ([MenuListId], [Name], [CreationDate], [CreationAuthorId], [ChangeDate], [ChangeAuthorId], [URL], [ParentId], [Order], [IsVisible])
VALUES (10024, '{%en%}Проектные инициативы{%ru%}Проектные инициативы', '2016-02-01T17:04:50', 100060, '2017-08-22T21:21:38', 100060, '/asyst/page/initiative', 1, 4, 1)
ELSE
UPDATE [dbo].[MenuList] SET [Name] = '{%en%}Проектные инициативы{%ru%}Проектные инициативы', [CreationDate] = '2016-02-01T17:04:50', [CreationAuthorId] = 100060, [ChangeDate] = '2017-08-22T21:21:38', [ChangeAuthorId] = 100060, [URL] = '/asyst/page/initiative', [ParentId] = 1, [Order] = 4, [IsVisible] = 1
WHERE [MenuListId]=10024

SET IDENTITY_INSERT MenuList OFF
Delete RoleAssignment WHERE EntityId = dbo.GetEntityId('MenuList') AND DataId = 10024
INSERT INTO [dbo].[RoleAssignment] ([DataId], [EntityId], [RoleId], [AccountId])
VALUES
 (10024, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120062)
,(10024, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120064)
,(10024, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120113)
,(10024, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120163)
,(10024, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120164)

/***END Меню Проектные инициативы***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'caf80469 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Проектные инициативы***/
