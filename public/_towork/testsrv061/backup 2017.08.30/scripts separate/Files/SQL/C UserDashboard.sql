/****************************************************************
*      START Сущность Настройки дашборда пользователя (UserDashboard)
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
ALTER TABLE MetaEntity NOCHECK CONSTRAINT ALL
ALTER TABLE MetaField NOCHECK CONSTRAINT ALL
ALTER TABLE ChangeRequest NOCHECK CONSTRAINT ALL
ALTER TABLE ChangeRequestValue NOCHECK CONSTRAINT ALL
ALTER TABLE MetaFormElement NOCHECK CONSTRAINT ALL
ALTER TABLE MetaFormElementAttribute NOCHECK CONSTRAINT ALL
ALTER TABLE MetaRule NOCHECK CONSTRAINT ALL
ALTER TABLE MetaFormHandler NOCHECK CONSTRAINT ALL

IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaEntity] WHERE [EntityId]='43cfcc71-3cef-4ec4-86a4-90d51288a7a3')
INSERT INTO [MetaEntity] ([EntityId], [BaseId], [IsAbstract], [IsSystem], [ParentRefFieldId], [ParentRefName], [EntityKindId], [Name], [Title], [ListTitle], [Description], [OwnerName], [TableName], [IdFieldName], [DisplayFieldName], [EditFormId], [ViewFormId], [DefaultViewId], [IsEntityElement], [DeletionRuleId], [DeletionQuery], [SearchWeight], [IsViewHomeVisible], [IsViewSocialVisible], [IsViewProcessLink], [IsAccessMatrixVisible], [IsViewSampled])
VALUES ('43cfcc71-3cef-4ec4-86a4-90d51288a7a3', NULL, 0, 0, NULL, NULL, 1, 'UserDashboard', 'Настройки дашборда пользователя', NULL, NULL, 'dbo', 'UserDashboard', 'UserDashboardId', 'Name', NULL, NULL, NULL, 0, NULL, NULL, 0, 0, 0, 1, 0, 0)
ELSE
UPDATE [dbo].[MetaEntity] SET [BaseId] = NULL, [IsAbstract] = 0, [IsSystem] = 0, [ParentRefFieldId] = NULL, [ParentRefName] = NULL, [EntityKindId] = 1, [Name] = 'UserDashboard', [Title] = 'Настройки дашборда пользователя', [ListTitle] = NULL, [Description] = NULL, [OwnerName] = 'dbo', [TableName] = 'UserDashboard', [IdFieldName] = 'UserDashboardId', [DisplayFieldName] = 'Name', [EditFormId] = NULL, [ViewFormId] = NULL, [DefaultViewId] = NULL, [IsEntityElement] = 0, [DeletionRuleId] = NULL, [DeletionQuery] = NULL, [SearchWeight] = 0, [IsViewHomeVisible] = 0, [IsViewSocialVisible] = 0, [IsViewProcessLink] = 1, [IsAccessMatrixVisible] = 0, [IsViewSampled] = 0
WHERE [EntityId]='43cfcc71-3cef-4ec4-86a4-90d51288a7a3'

IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaField] WHERE [FieldId]='56430a16-2cd6-497c-a3f5-939ae58e4804')
INSERT INTO [MetaField] ([FieldId], [EntityId], [Name], [Title], [Description], [Position], [PropertyName], [IsPrimaryKey], [FieldKindId], [IsComputed], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [DataDefault], [IsEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [SearchWeight], [IsInheritanceLink])
VALUES ('56430a16-2cd6-497c-a3f5-939ae58e4804', '43cfcc71-3cef-4ec4-86a4-90d51288a7a3', 'UserDashboardId', 'Ключ', NULL, 0, NULL, 1, 1, 0, 'bigint', 0, 0, 0, NULL, NULL, 0, 1, 0, 0, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0)
ELSE
UPDATE [dbo].[MetaField] SET [EntityId] = '43cfcc71-3cef-4ec4-86a4-90d51288a7a3', [Name] = 'UserDashboardId', [Title] = 'Ключ', [Description] = NULL, [Position] = 0, [PropertyName] = NULL, [IsPrimaryKey] = 1, [FieldKindId] = 1, [IsComputed] = 0, [DataTypeName] = 'bigint', [DataLength] = 0, [DataPrecision] = 0, [DataScale] = 0, [DataRefEntityId] = NULL, [DataDefault] = NULL, [IsEntityId] = 0, [IsEditable] = 1, [IsNullable] = 0, [IsVisible] = 0, [DisplayWidth] = 0, [DisplayGroup] = NULL, [DisplayMask] = NULL, [PicklistSource] = 0, [PicklistQuery] = NULL, [PicklistViewId] = NULL, [PicklistValueField] = NULL, [PicklistNameField] = NULL, [SearchWeight] = 0, [IsInheritanceLink] = 0
WHERE [FieldId]='56430a16-2cd6-497c-a3f5-939ae58e4804'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaField] WHERE [FieldId]='00876085-91c2-4098-8532-aa4d5c8945b5')
INSERT INTO [MetaField] ([FieldId], [EntityId], [Name], [Title], [Description], [Position], [PropertyName], [IsPrimaryKey], [FieldKindId], [IsComputed], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [DataDefault], [IsEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [SearchWeight], [IsInheritanceLink])
VALUES ('00876085-91c2-4098-8532-aa4d5c8945b5', '43cfcc71-3cef-4ec4-86a4-90d51288a7a3', 'Items', 'Виджеты', NULL, 3, NULL, 0, 0, 0, 'nvarchar', 4000, 0, 0, NULL, NULL, 0, 1, 0, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0)
ELSE
UPDATE [dbo].[MetaField] SET [EntityId] = '43cfcc71-3cef-4ec4-86a4-90d51288a7a3', [Name] = 'Items', [Title] = 'Виджеты', [Description] = NULL, [Position] = 3, [PropertyName] = NULL, [IsPrimaryKey] = 0, [FieldKindId] = 0, [IsComputed] = 0, [DataTypeName] = 'nvarchar', [DataLength] = 4000, [DataPrecision] = 0, [DataScale] = 0, [DataRefEntityId] = NULL, [DataDefault] = NULL, [IsEntityId] = 0, [IsEditable] = 1, [IsNullable] = 0, [IsVisible] = 1, [DisplayWidth] = 0, [DisplayGroup] = NULL, [DisplayMask] = NULL, [PicklistSource] = 0, [PicklistQuery] = NULL, [PicklistViewId] = NULL, [PicklistValueField] = NULL, [PicklistNameField] = NULL, [SearchWeight] = 0, [IsInheritanceLink] = 0
WHERE [FieldId]='00876085-91c2-4098-8532-aa4d5c8945b5'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaField] WHERE [FieldId]='ad50f565-a13a-4ba2-9bd9-adb6d7e4c7dd')
INSERT INTO [MetaField] ([FieldId], [EntityId], [Name], [Title], [Description], [Position], [PropertyName], [IsPrimaryKey], [FieldKindId], [IsComputed], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [DataDefault], [IsEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [SearchWeight], [IsInheritanceLink])
VALUES ('ad50f565-a13a-4ba2-9bd9-adb6d7e4c7dd', '43cfcc71-3cef-4ec4-86a4-90d51288a7a3', 'AccountId', 'Учетная запись', NULL, 1, NULL, 0, 2, 0, 'bigint', 4, 10, 0, '7c28bbbd-53f0-4f60-9a72-692b7dc363c2', NULL, 0, 1, 0, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0)
ELSE
UPDATE [dbo].[MetaField] SET [EntityId] = '43cfcc71-3cef-4ec4-86a4-90d51288a7a3', [Name] = 'AccountId', [Title] = 'Учетная запись', [Description] = NULL, [Position] = 1, [PropertyName] = NULL, [IsPrimaryKey] = 0, [FieldKindId] = 2, [IsComputed] = 0, [DataTypeName] = 'bigint', [DataLength] = 4, [DataPrecision] = 10, [DataScale] = 0, [DataRefEntityId] = '7c28bbbd-53f0-4f60-9a72-692b7dc363c2', [DataDefault] = NULL, [IsEntityId] = 0, [IsEditable] = 1, [IsNullable] = 0, [IsVisible] = 1, [DisplayWidth] = 0, [DisplayGroup] = NULL, [DisplayMask] = NULL, [PicklistSource] = 0, [PicklistQuery] = NULL, [PicklistViewId] = NULL, [PicklistValueField] = NULL, [PicklistNameField] = NULL, [SearchWeight] = 0, [IsInheritanceLink] = 0
WHERE [FieldId]='ad50f565-a13a-4ba2-9bd9-adb6d7e4c7dd'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaField] WHERE [FieldId]='2162c81a-e8b8-4e08-82c3-d0b3a087b2bf')
INSERT INTO [MetaField] ([FieldId], [EntityId], [Name], [Title], [Description], [Position], [PropertyName], [IsPrimaryKey], [FieldKindId], [IsComputed], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [DataDefault], [IsEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [SearchWeight], [IsInheritanceLink])
VALUES ('2162c81a-e8b8-4e08-82c3-d0b3a087b2bf', '43cfcc71-3cef-4ec4-86a4-90d51288a7a3', 'PageName', 'Название страницы', NULL, 2, NULL, 0, 0, 0, 'nvarchar', 500, 0, 0, NULL, NULL, 0, 1, 0, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0)
ELSE
UPDATE [dbo].[MetaField] SET [EntityId] = '43cfcc71-3cef-4ec4-86a4-90d51288a7a3', [Name] = 'PageName', [Title] = 'Название страницы', [Description] = NULL, [Position] = 2, [PropertyName] = NULL, [IsPrimaryKey] = 0, [FieldKindId] = 0, [IsComputed] = 0, [DataTypeName] = 'nvarchar', [DataLength] = 500, [DataPrecision] = 0, [DataScale] = 0, [DataRefEntityId] = NULL, [DataDefault] = NULL, [IsEntityId] = 0, [IsEditable] = 1, [IsNullable] = 0, [IsVisible] = 1, [DisplayWidth] = 0, [DisplayGroup] = NULL, [DisplayMask] = NULL, [PicklistSource] = 0, [PicklistQuery] = NULL, [PicklistViewId] = NULL, [PicklistValueField] = NULL, [PicklistNameField] = NULL, [SearchWeight] = 0, [IsInheritanceLink] = 0
WHERE [FieldId]='2162c81a-e8b8-4e08-82c3-d0b3a087b2bf'

DELETE FROM MetaCustomProperty WHERE ItemId = '43cfcc71-3cef-4ec4-86a4-90d51288a7a3'


/*###Роли###*/
SET IDENTITY_INSERT [role] ON

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'd9505f38 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
ALTER TABLE MetaEntity CHECK CONSTRAINT ALL
                    ALTER TABLE MetaField CHECK CONSTRAINT ALL
ALTER TABLE ChangeRequest CHECK CONSTRAINT ALL
ALTER TABLE ChangeRequestValue CHECK CONSTRAINT ALL
ALTER TABLE MetaFormElement CHECK CONSTRAINT ALL
ALTER TABLE MetaFormElementAttribute CHECK CONSTRAINT ALL
ALTER TABLE MetaRule CHECK CONSTRAINT ALL
ALTER TABLE MetaFormHandler CHECK CONSTRAINT ALL

SET IDENTITY_INSERT [role] OFF
/***END Сущность Настройки дашборда пользователя (UserDashboard)***/
