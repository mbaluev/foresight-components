/****************************************************************
*      START MenuList Госпрограммы и объекты госпрограмм
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***START Меню Госпрограммы и объекты госпрограмм***/
SET IDENTITY_INSERT MenuList ON
IF NOT EXISTS (SELECT 1 FROM [dbo].[MenuList] WHERE [MenuListId]=22)
INSERT INTO [MenuList] ([MenuListId], [Name], [CreationDate], [CreationAuthorId], [ChangeDate], [ChangeAuthorId], [URL], [ParentId], [Order], [IsVisible])
VALUES (22, '{%en%}State programs and objects{%ru%}Госпрограммы и объекты госпрограмм', '2015-12-01T19:13:16', 100060, '2017-08-22T21:21:54', 100060, '/asyst/page/gprogram', 1, 2, 1)
ELSE
UPDATE [dbo].[MenuList] SET [Name] = '{%en%}State programs and objects{%ru%}Госпрограммы и объекты госпрограмм', [CreationDate] = '2015-12-01T19:13:16', [CreationAuthorId] = 100060, [ChangeDate] = '2017-08-22T21:21:54', [ChangeAuthorId] = 100060, [URL] = '/asyst/page/gprogram', [ParentId] = 1, [Order] = 2, [IsVisible] = 1
WHERE [MenuListId]=22

SET IDENTITY_INSERT MenuList OFF
Delete RoleAssignment WHERE EntityId = dbo.GetEntityId('MenuList') AND DataId = 22

/***END Меню Госпрограммы и объекты госпрограмм***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '7375f9f0 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Госпрограммы и объекты госпрограмм***/
