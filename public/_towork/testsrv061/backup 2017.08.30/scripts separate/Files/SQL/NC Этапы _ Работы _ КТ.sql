/****************************************************************
*      START MenuList Этапы / Работы / КТ
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***START Меню Этапы / Работы / КТ***/
SET IDENTITY_INSERT MenuList ON
IF NOT EXISTS (SELECT 1 FROM [dbo].[MenuList] WHERE [MenuListId]=4)
INSERT INTO [MenuList] ([MenuListId], [Name], [CreationDate], [CreationAuthorId], [ChangeDate], [ChangeAuthorId], [URL], [ParentId], [Order], [IsVisible])
VALUES (4, '{%en%}Phases / Works / Points{%ru%}Этапы / Работы / КТ', '2015-11-10T13:45:34', 100060, '2017-08-22T21:21:18', 100060, '/asyst/page/point', 1, 7, 1)
ELSE
UPDATE [dbo].[MenuList] SET [Name] = '{%en%}Phases / Works / Points{%ru%}Этапы / Работы / КТ', [CreationDate] = '2015-11-10T13:45:34', [CreationAuthorId] = 100060, [ChangeDate] = '2017-08-22T21:21:18', [ChangeAuthorId] = 100060, [URL] = '/asyst/page/point', [ParentId] = 1, [Order] = 7, [IsVisible] = 1
WHERE [MenuListId]=4

SET IDENTITY_INSERT MenuList OFF
Delete RoleAssignment WHERE EntityId = dbo.GetEntityId('MenuList') AND DataId = 4
INSERT INTO [dbo].[RoleAssignment] ([DataId], [EntityId], [RoleId], [AccountId])
VALUES
 (4, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120062)
,(4, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120064)
,(4, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120113)
,(4, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120163)
,(4, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120164)

/***END Меню Этапы / Работы / КТ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '5aa443fa ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Этапы / Работы / КТ***/
