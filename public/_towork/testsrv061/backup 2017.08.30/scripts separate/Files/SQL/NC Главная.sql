/****************************************************************
*      START MenuList Главная
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***START Меню Главная***/
SET IDENTITY_INSERT MenuList ON
IF NOT EXISTS (SELECT 1 FROM [dbo].[MenuList] WHERE [MenuListId]=10040)
INSERT INTO [MenuList] ([MenuListId], [Name], [CreationDate], [CreationAuthorId], [ChangeDate], [ChangeAuthorId], [URL], [ParentId], [Order], [IsVisible])
VALUES (10040, '{%en%}Главная{%ru%}Главная', '2017-08-22T21:18:24', 100060, '2017-08-22T21:18:24', 100060, '/', NULL, 0, 1)
ELSE
UPDATE [dbo].[MenuList] SET [Name] = '{%en%}Главная{%ru%}Главная', [CreationDate] = '2017-08-22T21:18:24', [CreationAuthorId] = 100060, [ChangeDate] = '2017-08-22T21:18:24', [ChangeAuthorId] = 100060, [URL] = '/', [ParentId] = NULL, [Order] = 0, [IsVisible] = 1
WHERE [MenuListId]=10040

SET IDENTITY_INSERT MenuList OFF
Delete RoleAssignment WHERE EntityId = dbo.GetEntityId('MenuList') AND DataId = 10040
INSERT INTO [dbo].[RoleAssignment] ([DataId], [EntityId], [RoleId], [AccountId])
VALUES
 (10040, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120062)
,(10040, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120064)
,(10040, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120113)
,(10040, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120163)
,(10040, 'a320616d-e9cc-44de-9883-5db288da3bba', 40066, 120164)

/***END Меню Главная***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '1c8abaa2 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Главная***/
