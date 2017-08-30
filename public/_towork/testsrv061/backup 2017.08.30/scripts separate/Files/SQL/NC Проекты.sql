/****************************************************************
*      START MenuList Проекты
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***START Меню Проекты***/
SET IDENTITY_INSERT MenuList ON
IF NOT EXISTS (SELECT 1 FROM [dbo].[MenuList] WHERE [MenuListId]=3)
INSERT INTO [MenuList] ([MenuListId], [Name], [CreationDate], [CreationAuthorId], [ChangeDate], [ChangeAuthorId], [URL], [ParentId], [Order], [IsVisible])
VALUES (3, '{%en%}Projects{%ru%}Проекты', '2015-11-10T13:44:12', 100060, '2017-08-22T21:21:25', 100060, '/asyst/page/project', 1, 6, 1)
ELSE
UPDATE [dbo].[MenuList] SET [Name] = '{%en%}Projects{%ru%}Проекты', [CreationDate] = '2015-11-10T13:44:12', [CreationAuthorId] = 100060, [ChangeDate] = '2017-08-22T21:21:25', [ChangeAuthorId] = 100060, [URL] = '/asyst/page/project', [ParentId] = 1, [Order] = 6, [IsVisible] = 1
WHERE [MenuListId]=3

SET IDENTITY_INSERT MenuList OFF
Delete RoleAssignment WHERE EntityId = dbo.GetEntityId('MenuList') AND DataId = 3
INSERT INTO [dbo].[RoleAssignment] ([DataId], [EntityId], [RoleId], [AccountId])
VALUES
 (3, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120062)
,(3, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120064)
,(3, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120113)
,(3, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120163)
,(3, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120164)

/***END Меню Проекты***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '9ce10624 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Проекты***/
