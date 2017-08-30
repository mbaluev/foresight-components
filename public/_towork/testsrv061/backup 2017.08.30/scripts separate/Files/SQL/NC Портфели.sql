/****************************************************************
*      START MenuList Портфели
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***START Меню Портфели***/
SET IDENTITY_INSERT MenuList ON
IF NOT EXISTS (SELECT 1 FROM [dbo].[MenuList] WHERE [MenuListId]=2)
INSERT INTO [MenuList] ([MenuListId], [Name], [CreationDate], [CreationAuthorId], [ChangeDate], [ChangeAuthorId], [URL], [ParentId], [Order], [IsVisible])
VALUES (2, '{%en%}Portfolio{%ru%}Портфели', '2015-11-10T13:35:38', 100060, '2017-08-22T21:21:44', 100060, '/asyst/page/portfolio', 1, 3, 1)
ELSE
UPDATE [dbo].[MenuList] SET [Name] = '{%en%}Portfolio{%ru%}Портфели', [CreationDate] = '2015-11-10T13:35:38', [CreationAuthorId] = 100060, [ChangeDate] = '2017-08-22T21:21:44', [ChangeAuthorId] = 100060, [URL] = '/asyst/page/portfolio', [ParentId] = 1, [Order] = 3, [IsVisible] = 1
WHERE [MenuListId]=2

SET IDENTITY_INSERT MenuList OFF
Delete RoleAssignment WHERE EntityId = dbo.GetEntityId('MenuList') AND DataId = 2

/***END Меню Портфели***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'afefb50b ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Портфели***/
