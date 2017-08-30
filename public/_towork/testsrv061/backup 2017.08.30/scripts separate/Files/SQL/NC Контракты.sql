/****************************************************************
*      START MenuList Контракты
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***START Меню Контракты***/
SET IDENTITY_INSERT MenuList ON
IF NOT EXISTS (SELECT 1 FROM [dbo].[MenuList] WHERE [MenuListId]=10034)
INSERT INTO [MenuList] ([MenuListId], [Name], [CreationDate], [CreationAuthorId], [ChangeDate], [ChangeAuthorId], [URL], [ParentId], [Order], [IsVisible])
VALUES (10034, '{%en%}Контракт{%ru%}Контракты', '2016-03-09T11:32:21', 100060, '2017-08-22T21:21:31', 100060, '/asyst/page/contract', 1, 5, 1)
ELSE
UPDATE [dbo].[MenuList] SET [Name] = '{%en%}Контракт{%ru%}Контракты', [CreationDate] = '2016-03-09T11:32:21', [CreationAuthorId] = 100060, [ChangeDate] = '2017-08-22T21:21:31', [ChangeAuthorId] = 100060, [URL] = '/asyst/page/contract', [ParentId] = 1, [Order] = 5, [IsVisible] = 1
WHERE [MenuListId]=10034

SET IDENTITY_INSERT MenuList OFF
Delete RoleAssignment WHERE EntityId = dbo.GetEntityId('MenuList') AND DataId = 10034
INSERT INTO [dbo].[RoleAssignment] ([DataId], [EntityId], [RoleId], [AccountId])
VALUES
 (10034, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120062)
,(10034, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120064)
,(10034, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120113)
,(10034, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120163)
,(10034, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120164)

/***END Меню Контракты***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '6eb5ad75 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Контракты***/
