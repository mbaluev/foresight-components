/****************************************************************
*      START MenuList Открытые вопросы
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***START Меню Открытые вопросы***/
SET IDENTITY_INSERT MenuList ON
IF NOT EXISTS (SELECT 1 FROM [dbo].[MenuList] WHERE [MenuListId]=10023)
INSERT INTO [MenuList] ([MenuListId], [Name], [CreationDate], [CreationAuthorId], [ChangeDate], [ChangeAuthorId], [URL], [ParentId], [Order], [IsVisible])
VALUES (10023, '{%en%}Открытые вопросы{%ru%}Открытые вопросы', '2015-12-12T15:07:49', 100060, '2017-08-22T21:21:11', 100060, '/asyst/page/lov', 1, 8, 1)
ELSE
UPDATE [dbo].[MenuList] SET [Name] = '{%en%}Открытые вопросы{%ru%}Открытые вопросы', [CreationDate] = '2015-12-12T15:07:49', [CreationAuthorId] = 100060, [ChangeDate] = '2017-08-22T21:21:11', [ChangeAuthorId] = 100060, [URL] = '/asyst/page/lov', [ParentId] = 1, [Order] = 8, [IsVisible] = 1
WHERE [MenuListId]=10023

SET IDENTITY_INSERT MenuList OFF
Delete RoleAssignment WHERE EntityId = dbo.GetEntityId('MenuList') AND DataId = 10023
INSERT INTO [dbo].[RoleAssignment] ([DataId], [EntityId], [RoleId], [AccountId])
VALUES
 (10023, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120062)
,(10023, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120064)
,(10023, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120113)
,(10023, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120163)
,(10023, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120164)

/***END Меню Открытые вопросы***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '70cd81fe ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Открытые вопросы***/
