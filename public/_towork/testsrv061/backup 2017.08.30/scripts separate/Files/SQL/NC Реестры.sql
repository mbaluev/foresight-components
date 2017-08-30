/****************************************************************
*      START MenuList Реестры
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***START Меню Реестры***/
SET IDENTITY_INSERT MenuList ON
IF NOT EXISTS (SELECT 1 FROM [dbo].[MenuList] WHERE [MenuListId]=1)
INSERT INTO [MenuList] ([MenuListId], [Name], [CreationDate], [CreationAuthorId], [ChangeDate], [ChangeAuthorId], [URL], [ParentId], [Order], [IsVisible])
VALUES (1, '{%en%}Registers{%ru%}Реестры', '2015-11-10T13:35:14', 100060, '2017-08-22T21:22:04', 100060, NULL, NULL, 1, 1)
ELSE
UPDATE [dbo].[MenuList] SET [Name] = '{%en%}Registers{%ru%}Реестры', [CreationDate] = '2015-11-10T13:35:14', [CreationAuthorId] = 100060, [ChangeDate] = '2017-08-22T21:22:04', [ChangeAuthorId] = 100060, [URL] = NULL, [ParentId] = NULL, [Order] = 1, [IsVisible] = 1
WHERE [MenuListId]=1

SET IDENTITY_INSERT MenuList OFF
Delete RoleAssignment WHERE EntityId = dbo.GetEntityId('MenuList') AND DataId = 1
INSERT INTO [dbo].[RoleAssignment] ([DataId], [EntityId], [RoleId], [AccountId])
VALUES
 (1, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120062)
,(1, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120064)
,(1, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120113)
,(1, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120163)
,(1, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120164)

/***END Меню Реестры***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '1fe3befc ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Реестры***/
