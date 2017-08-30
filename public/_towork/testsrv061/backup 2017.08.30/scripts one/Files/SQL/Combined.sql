/****************************************************************
2017-08-30T15:55:56
Версия ПО: 1.27.12.0
Пользователь: PC0014\mbaluev
Исходный сервер: TestSRV061.PPMPlus
Папка с пакетом: F:\проектная практика - work5 - 2017\2017.02.10 - mishgan.demo.pmpractice.ru\testsrv061\backup 2017.08.30\scripts one
Записать скрипт в один файл: ДА
Объекты для переноса:
• C Структура(1 шт.):
	Настройки дашборда пользователя [UserDashboard]
• LA Таблицы(1 шт.):
	!*! UserDashboard
• LB Данные таблиц(1 шт.):
	UserDashboard[ClearAndInsert]
• NA Страницы(57 шт.):
	ForesightMaster.page [!ForesightMaster]
	Библиотека виджетов для главной страницы [_LibraryIndex]
	Библиотека виджетов для панели документов [_LibraryDocPanel]
	Библиотека виджетов прочих страниц [_LibraryMisc]
	Библиотека документов [DocLib]
	Библиотека реестров [_LibraryRegister]
	Вероятность риска  [RiskProbability]
	Визуализация иерархии КТ [KtChart]
	Внешние организации [Organization]
	Воздействие риска  [RiskImpact]
	Вопросы [Question]
	Главная [Index]
	Группы [Group]
	Дерево целей и показателей [GoalTree]
	Запросы на изменение [ChangeRequest]
	Извлеченные уроки [Lesson]
	Итоговые выводы [Summary]
	Категория риска  [RiskCategory]
	Контракты [Contract]
	Курсы проектного управления [Course]
	Мастер.page [!MainMaster]
	Мероприятия ослабления [RiskMitigation]
	Мероприятия реагирования [RiskResponding]
	Организационная структура [OrgStruct]
	Открытые вопросы [LOV]
	Панель базы знаний и документов [DocPanel]
	Подразделения [OrgUnit]
	Подрядчики [Contractor]
	Поиск по документам [__DocSearch]
	Пользователи [User]
	Портфели [Portfolio]
	Приоритет проекта [Priority]
	Профиль [Profile]
	Распределения для риска [RiskDistribution]
	Реестр госпрограмм и объектов госпрограмм [GProgram]
	Реестр замещений [Substitution]
	Реестр КТ [Point]
	Реестр НМД [LegalDoc]
	Реестр обучения сотрудников [CourseWork]
	Реестр показателей [KPI]
	Реестр поручений [Order]
	Реестр проектных инициатив [Initiative]
	Реестр проектов [Project2]
	Реестр проектов [Project]
	Реестр пунктов чек-листов [Checklist]
	Реестр совещаний [Meeting]
	Реестр целей [Goal]
	Риски  [Risk]
	Сообщения [Messages]
	Состояние риска  [RiskState]
	Состояния поручений [OrderStatus]
	Состояния поручений [MeetingStatus]
	Статус-отчеты [StatusReport]
	Тип проекта [ProjectType]
	Типы КТ [PointType]
	Центр настроек [SettingsCenter]
	Центр отчетов [ReportCenter]
• NC Меню (9 шт.):
	Главная
	Госпрограммы и объекты госпрограмм
	Контракты
	Открытые вопросы
	Портфели
	Проектные инициативы
	Проекты
	Реестры
	Этапы / Работы / КТ
• O DataSet (3 шт.):
	WidgetLibrary
	DashboardWidgetContent
	UserDashboard
• Файлы Asyst(1 шт.):
	\\testsrv061\c$\inetpub\wwwroot\Asyst\asyst\components
• ZZ exec renewDinamicNames

****************************************************************/

GO
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
                                    DECLARE @errmes nvarchar(max) = 'b0c885d1 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
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

GO
/****************************************************************
*      START UserDashboard dbo.UserDashboard A
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
IF NOT  EXISTS (SELECT 1 FROM sys.objects o JOIN sys.schemas s WITH (NOWAIT) ON o.[schema_id] = s.[schema_id] WHERE o.object_id = OBJECT_ID(N'UserDashboard') AND o.type = 'U' AND s.Name = 'dbo')
BEGIN
CREATE TABLE [dbo].[UserDashboard](	  [UserDashboardId] BIGINT NOT NULL IDENTITY(1,1)	, [AccountId] BIGINT NOT NULL	, [PageName] NVARCHAR(500) COLLATE Cyrillic_General_CI_AS NOT NULL	, [Items] NVARCHAR(MAX) COLLATE Cyrillic_General_CI_AS NOT NULL	, CONSTRAINT [PK_UserDasboard] PRIMARY KEY ([UserDashboardId] ASC))ALTER TABLE [dbo].[UserDashboard] WITH CHECK ADD CONSTRAINT [FK__UserDashb__Accou__19A178F7] FOREIGN KEY([AccountId]) REFERENCES [dbo].[Account] ([AccountId])ALTER TABLE [dbo].[UserDashboard] CHECK CONSTRAINT [FK__UserDashb__Accou__19A178F7]
END
ELSE
BEGIN
IF EXISTS (SELECT 1 FROM sys.tables t JOIN sys.columns c ON c.object_id = t.object_id JOIN sys.objects o WITH (NOWAIT) ON o.object_id = c.object_id JOIN sys.schemas s WITH (NOWAIT) ON o.[schema_id] = s.[schema_id] WHERE s.Name = 'dbo' AND t.name = 'UserDashboard' AND c.name ='UserDashboardId')BEGINalter table [UserDashboard] alter column [UserDashboardId] BIGINT NOT NULLENDELSEBEGINalter table [UserDashboard] add [UserDashboardId] BIGINT NOT NULL IDENTITY(1,1)ENDIF EXISTS (SELECT 1 FROM sys.tables t JOIN sys.columns c ON c.object_id = t.object_id JOIN sys.objects o WITH (NOWAIT) ON o.object_id = c.object_id JOIN sys.schemas s WITH (NOWAIT) ON o.[schema_id] = s.[schema_id] WHERE s.Name = 'dbo' AND t.name = 'UserDashboard' AND c.name ='AccountId')BEGINalter table [UserDashboard] alter column [AccountId] BIGINT NOT NULLENDELSEBEGINalter table [UserDashboard] add [AccountId] BIGINT NOT NULLENDIF EXISTS (SELECT 1 FROM sys.tables t JOIN sys.columns c ON c.object_id = t.object_id JOIN sys.objects o WITH (NOWAIT) ON o.object_id = c.object_id JOIN sys.schemas s WITH (NOWAIT) ON o.[schema_id] = s.[schema_id] WHERE s.Name = 'dbo' AND t.name = 'UserDashboard' AND c.name ='PageName')BEGINalter table [UserDashboard] alter column [PageName] NVARCHAR(500) COLLATE Cyrillic_General_CI_AS NOT NULLENDELSEBEGINalter table [UserDashboard] add [PageName] NVARCHAR(500) COLLATE Cyrillic_General_CI_AS NOT NULLENDIF EXISTS (SELECT 1 FROM sys.tables t JOIN sys.columns c ON c.object_id = t.object_id JOIN sys.objects o WITH (NOWAIT) ON o.object_id = c.object_id JOIN sys.schemas s WITH (NOWAIT) ON o.[schema_id] = s.[schema_id] WHERE s.Name = 'dbo' AND t.name = 'UserDashboard' AND c.name ='Items')BEGINalter table [UserDashboard] alter column [Items] NVARCHAR(MAX) COLLATE Cyrillic_General_CI_AS NOT NULLENDELSEBEGINalter table [UserDashboard] add [Items] NVARCHAR(MAX) COLLATE Cyrillic_General_CI_AS NOT NULLENDIF EXISTS( SELECT 1 FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS.CONSTRAINT_NAME = 'FK__UserDashb__Accou__19A178F7')ALTER TABLE [dbo].[UserDashboard] drop CONSTRAINT [FK__UserDashb__Accou__19A178F7]ALTER TABLE [dbo].[UserDashboard] WITH CHECK ADD CONSTRAINT [FK__UserDashb__Accou__19A178F7] FOREIGN KEY([AccountId]) REFERENCES [dbo].[Account] ([AccountId])ALTER TABLE [dbo].[UserDashboard] CHECK CONSTRAINT [FK__UserDashb__Accou__19A178F7]
END

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '3090eba6 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END UserDashboard dbo.UserDashboard A***/

GO

/****************************************************************
*      START Данные таблицы UserDashboard
****************************************************************/

ALTER TABLE [dbo].[UserDashboard] NOCHECK CONSTRAINT ALL
BEGIN TRANSACTION
BEGIN TRY
DELETE FROM [dbo].[UserDashboard] 
INSERT INTO [dbo].[UserDashboard] ([AccountId], [PageName], [Items])
VALUES
 (100060, 'Index', '[{"x":0,"y":0,"width":1,"height":5,"settings":{"collapsed":false,"color":"#ccc","name":"Логотип","pagename":"_LibraryIndex","elementname":"Logo"}},{"x":1,"y":0,"width":2,"height":5,"settings":{"collapsed":false,"color":"#ff5940","name":"Последние сообщения для меня","pagename":"_LibraryIndex","elementname":"MessagesForMeRG"}},{"x":3,"y":0,"width":2,"height":5,"settings":{"collapsed":false,"color":"#ccc","name":"Мои КТ","pagename":"_LibraryIndex","elementname":"MyPoints"}},{"x":5,"y":0,"width":2,"height":5,"settings":{"collapsed":false,"color":"#ccc","name":"КТ от меня","pagename":"_LibraryIndex","elementname":"PointsFromMe"}},{"x":0,"y":5,"width":3,"height":5,"settings":{"collapsed":false,"color":"#5a97f2","name":"Панель руководителя","pagename":"_LibraryIndex","elementname":"MyDashboards"}},{"x":3,"y":5,"width":2,"height":5,"settings":{"collapsed":true,"color":"#ccc","name":"Мои совещания","pagename":"_LibraryIndex","elementname":"MyMeetings"}},{"x":5,"y":5,"width":2,"height":5,"settings":{"collapsed":true,"color":"#ccc","name":"Риски моих проектов","pagename":"_LibraryIndex","elementname":"MyRisksPie"}},{"x":7,"y":0,"width":5,"height":12,"settings":{"collapsed":false,"color":"#ccc","name":"Мои проекты","pagename":"_LibraryIndex","elementname":"MyProjects"}},{"x":0,"y":10,"width":3,"height":9,"settings":{"collapsed":true,"color":"#5a97f2","name":"Календарь","pagename":null,"elementname":null}},{"x":3,"y":10,"width":2,"height":5,"settings":{"collapsed":false,"color":"#ccc","name":"Мои инициативы","pagename":"_LibraryIndex","elementname":"MyInitiative"}},{"x":5,"y":10,"width":2,"height":5,"settings":{"collapsed":true,"color":"#ccc","name":"Мои поручения","pagename":"_LibraryIndex","elementname":"MyOrders"}},{"x":3,"y":15,"width":2,"height":5,"settings":{"collapsed":true,"color":"#ccc","name":"Инициативы для меня","pagename":"_LibraryIndex","elementname":"ForMeInitiative"}},{"x":5,"y":15,"width":2,"height":5,"settings":{"collapsed":false,"color":"#ccc","name":"Контракты моих проектов","pagename":"_LibraryIndex","elementname":"MyContractBubble"}},{"x":0,"y":19,"width":1,"height":3,"settings":{"collapsed":false,"color":"#5a97f2","name":"Мои статус-отчеты","pagename":"_LibraryIndex","elementname":"MyReports"}},{"x":1,"y":19,"width":1,"height":3,"settings":{"collapsed":false,"color":"#5a97f2","name":"Мои инициативы в ЦПО","pagename":"_LibraryIndex","elementname":"MyInitCPO"}},{"x":2,"y":19,"width":1,"height":3,"settings":{"collapsed":false,"color":"#ff5940","name":"Открытые вопросы от меня","pagename":"_LibraryIndex","elementname":"LovFromMe"}},{"x":3,"y":20,"width":4,"height":8,"settings":{"collapsed":false,"color":"#ccc","name":"Матрица моих рисков","pagename":"_LibraryIndex","elementname":"RiskMatrix"}},{"x":7,"y":12,"width":5,"height":8,"settings":{"collapsed":false,"color":"#ccc","name":"Мои контракты","pagename":"_LibraryIndex","elementname":"MyContracts"}},{"x":0,"y":22,"width":1,"height":3,"settings":{"collapsed":false,"color":"#5a97f2","name":"Открытые вопросы для меня","pagename":"_LibraryIndex","elementname":"MyLov"}},{"x":1,"y":22,"width":1,"height":3,"settings":{"collapsed":false,"color":"#5a97f2","name":"Последние документы","pagename":"_LibraryIndex","elementname":"MyDocs"}},{"x":2,"y":22,"width":1,"height":3,"settings":{"collapsed":false,"color":"#ff5940","name":"Согласовать ЗИ","pagename":"_LibraryIndex","elementname":"ChReqForMe"}},{"x":0,"y":25,"width":1,"height":3,"settings":{"collapsed":false,"color":"#5a97f2","name":"ЗИ от меня","pagename":"_LibraryIndex","elementname":"ChReqFromMe"}},{"x":1,"y":25,"width":1,"height":3,"settings":{"collapsed":false,"color":"#ff5940","name":"Перевести проекты на следующую стадию","pagename":"_LibraryIndex","elementname":"MyProjectMoveToNextPhase"}},{"x":2,"y":25,"width":1,"height":3,"settings":{"collapsed":false,"color":"#ff5940","name":"Принять пункты чек-листов","pagename":"_LibraryIndex","elementname":"ChListForMe"}}]')
,(100060, 'OrgStruct', '[{"x":0,"y":0,"width":2,"height":4,"settings":{"collapsed":false,"color":"#ccc","name":"OrgStruct","pagename":"_LibraryMisc","elementname":"OrgStructure"}}]')
,(100060, 'GoalTree', '[{"x":0,"y":0,"width":12,"height":20,"settings":{"collapsed":false,"color":"#ccc","name":"GoalTree","pagename":"_LibraryMisc","elementname":"GoalTree"}}]')
,(100060, 'DocPanel', '[{"x":0,"y":0,"width":2,"height":3,"settings":{"collapsed":false,"color":"#ff5940","name":"Подготовить итоговые выводы","pagename":"_LibraryDocPanel","elementname":"Finals"}},{"x":2,"y":0,"width":8,"height":6,"settings":{"collapsed":false,"color":"#ccc","name":"Файлы в моих карточках","pagename":"_LibraryDocPanel","elementname":"ChartFiles"}},{"x":10,"y":0,"width":2,"height":12,"settings":{"collapsed":false,"color":"#5a97f2","name":"Список тэгов файлов","pagename":"_LibraryDocPanel","elementname":"DocTags"}},{"x":0,"y":3,"width":2,"height":3,"settings":{"collapsed":false,"color":"#ff5940","name":"Внешние организации","pagename":"_LibraryDocPanel","elementname":"Organizations"}},{"x":0,"y":6,"width":2,"height":3,"settings":{"collapsed":false,"color":"#ff5940","name":"Подрядчики","pagename":"_LibraryDocPanel","elementname":"Contractors"}},{"x":2,"y":6,"width":2,"height":6,"settings":{"collapsed":false,"color":"#5a97f2","name":"Полезные ссылки","pagename":"_LibraryDocPanel","elementname":"DocLinks"}},{"x":4,"y":6,"width":6,"height":6,"settings":{"collapsed":false,"color":"#5a97f2","name":"Облако тэгов фалов","pagename":"_LibraryDocPanel","elementname":"DocTagsCloud"}},{"x":0,"y":9,"width":2,"height":3,"settings":{"collapsed":false,"color":"#ff5940","name":"Прочие извлеченные уроки","pagename":"_LibraryDocPanel","elementname":"ChartLessons"}},{"x":0,"y":12,"width":12,"height":9,"settings":{"collapsed":false,"color":"#ccc","name":"Подходящие мне извлеченные уроки","pagename":"_LibraryDocPanel","elementname":"GleaningForMe"}}]')
,(100060, 'Project2', '[{"x":0,"y":0,"width":2,"height":4,"settings":{"collapsed":false,"color":"#ccc","name":"Project2","pagename":"_LibraryRegister","elementname":"ProjectRegister"}}]')
,(100060, 'SettingsCenter', '[{"x":0,"y":0,"width":2,"height":10,"settings":{"collapsed":false,"color":"#5a97f2","name":"Бизнес настройки","pagename":"LibrarySettings","elementname":"Бизнес настройки"}},{"x":2,"y":0,"width":2,"height":11,"settings":{"collapsed":false,"color":"#5a97f2","name":"Справочники системы","pagename":"LibrarySettings","elementname":"Справочники системы"}},{"x":4,"y":0,"width":2,"height":15,"settings":{"collapsed":false,"color":"#5a97f2","name":"Сущности системы","pagename":"LibrarySettings","elementname":"Сущности системы"}},{"x":6,"y":0,"width":2,"height":6,"settings":{"collapsed":false,"color":"#ccc","name":"Настройки галерей","pagename":"LibrarySettings","elementname":"Настройки галерей"}},{"x":8,"y":0,"width":2,"height":6,"settings":{"collapsed":false,"color":"#ff5940","name":"Глобальные системные настройки","pagename":"LibrarySettings","elementname":"Глобальные системные настройки"}},{"x":10,"y":0,"width":2,"height":8,"settings":{"collapsed":false,"color":"#ff5940","name":"Системные настройки","pagename":"LibrarySettings","elementname":"Системные настройки"}},{"x":6,"y":6,"width":2,"height":5,"settings":{"collapsed":false,"color":"#ccc","name":"Пользователи и разрешения","pagename":"LibrarySettings","elementname":"Пользователи и разрешения"}},{"x":8,"y":6,"width":2,"height":4,"settings":{"collapsed":false,"color":"#ff5940","name":"Настройка интерфейсов","pagename":"LibrarySettings","elementname":"Настройка интерфейсов"}}]')
,(100060, 'Profile', '[{"x":0,"y":0,"width":2,"height":9,"settings":{"collapsed":false,"color":"#ccc","name":"Фото","pagename":"_LibraryMisc","elementname":"UserProfileInfo"}},{"x":2,"y":0,"width":10,"height":15,"settings":{"collapsed":false,"color":"#ccc","name":"Реестр всех моих карточек","pagename":"_LibraryRegister","elementname":"UserProfileRegister"}}]')
,(100060, 'Single', '[{"x":0,"y":0,"width":2,"height":4,"settings":{"collapsed":false,"color":"#ccc","name":"Single","pagename":"_LibraryIndex","elementname":"MyDashboards"}}]')

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'e842cfdd ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
ALTER TABLE [dbo].[UserDashboard] CHECK CONSTRAINT ALL
/***END Данные таблицы UserDashboard***/

GO
/****************************************************************
*      START MetaPage ForesightMaster.page !ForesightMaster
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage ForesightMaster.page ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('21977fe6-51a4-4ed3-9bf4-9cb22478b77f', '!ForesightMaster', 'ForesightMaster.page', NULL, NULL, NULL, 1, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '!ForesightMaster', [Title] = 'ForesightMaster.page', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 1, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='21977fe6-51a4-4ed3-9bf4-9cb22478b77f'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('d4ecd4f1-2240-43e4-9a89-468178a78b7d', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'fs-view', NULL, NULL, 101, 0, 0, NULL, NULL, '<div class="fs-view">
  <div class="fs-view__header">
    <div class="header">
      <div class="header__column header__column-left">
        <button class="header__column-item button" type="button" data-fc="button" id="button_toggle-menu">
          <span class="icon icon_css_animate">
            <span class="icon__menu" data-fc="icon__menu">
              <span class="icon__menu-global icon__menu-top"></span>
              <span class="icon__menu-global icon__menu-middle"></span>
              <span class="icon__menu-global icon__menu-bottom"></span>
            </span>
          </span>
          <span class="button__anim"></span>
        </button>
        <a class="header__column-item button" href="/" data-fc="button">
          <span class="icon icon_svg_home"></span>
          <span class="button__anim"></span>
        </a>
        <button class="header__column-item button" type="button" data-fc="button">
          <span class="icon icon_svg_search"></span>
          <span class="button__anim"></span>
        </button>
      </div>
      <div class="header__column header__column-right">
        <button class="header__column-item button" data-fc="button" data-toggle="popup" data-target="#account">
          <span class="icon icon_photo" id="user__photo"></span>
          <span class="button__text mobile mobile_hide" id="user__name">Функциональный администратор</span>
          <span class="icon icon_svg_down"></span>
        </button>
        <div class="popup" id="account" data-position="bottom left" data-width="auto">
          <ul class="popup__list">
            <li class="popup__list-item">
              <a class="popup__link" href="/asyst/page/profile">
                <span class="popup__text">Профиль</span>
              </a>
            </li>
            <li class="popup__list-item">
              <a class="popup__link" href="/asyst/page/settingscenter">
                <span class="popup__text">Центр настроек</span>
              </a>
            </li>
            <li class="popup__list-item">
              <a class="popup__link" href="/asyst/default.aspx?showadmin=true" target="_blank">
                <span class="popup__text">Администрирование</span>
              </a>
            </li>             
            <li class="popup__list-item">
              <a class="popup__link" href="#" onclick="Asyst.API.AdminTools.logout();">
                <span class="popup__text">Выход</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="fs-view__main">
    <div class="fs-view__left fs-view__left_hidden">
      <div class="menu"></div>
    </div>
    <div class="fs-view__middle fs-view__middle_full">
      <div class="fs-view__middle-scroll">
        <div id="container"></div>
      </div>
    </div>
  </div>
</div>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('40242335-1d49-428c-85b7-612ba2e721d4', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'body_open', NULL, NULL, 90, 0, 0, NULL, NULL, '<body class="page proximanova">', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('2bd8bc21-e02a-4d7b-b5ab-68d6a965970b', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'user__name_data', 'загрузка имени и фотки пользователя', NULL, 8002, 0, 0, NULL, NULL, '<script>
  $(function(){
    $("#user__name").text(Asyst.Workspace.currentUser.Name);
    $("#user__photo-info").attr("alt", Asyst.Workspace.currentUser.Account);
    $("#user__photo-info").attr("title", Asyst.Workspace.currentUser.Account);
    Asyst.API.Document.getFiles(
      {classname:''User'', id: Asyst.Workspace.currentUser.Id}, 
      true, 
      function(data){
        if (data.documents[0].files[0]) {
          $(''#user__photo'').css(''background-image'', "url(''" + data.documents[0].files[0].url + "'')");
        }
      },
      null
    );
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('5cf25b11-60e0-48cf-b492-6b37aa63a32c', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'html_open', NULL, NULL, 0, 0, 0, NULL, NULL, '<!DOCTYPE html>
<html>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('7adadcad-fd53-4a53-86bc-6e1a0d12a2bf', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'asyst_js', 'asyst и application скрипты', NULL, 8000, 0, 0, NULL, NULL, '<script type="text/javascript" src="/asyst/js/asyst.globalization.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.third.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.workspace.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.number.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.globalsearch.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.board.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.utils.js"></script>
<script type="text/javascript" src="/asyst/js/asyst.changerequest.js"></script>
<script type="text/javascript" src="/asyst/js/application.js"></script>
<script type="text/javascript" src="/asyst/js/application.model.js"></script>
<script type="text/javascript" src="/asyst/js/application.documents.js"></script>
<script type="text/javascript" src="/asyst/js/application.points.js"></script>
<script type="text/javascript" src="/asyst/js/application.page.js"></script>
<script type="text/javascript" src="/asyst/spd.js"></script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('a1457083-4977-4230-a0a8-77a1f4303ce2', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'components_js', 'components скрипты', NULL, 8001, 0, 0, NULL, NULL, '<script type="text/javascript" src="/asyst/components/foresight.third.debug.js"></script>
<script type="text/javascript" src="/asyst/components/foresight.components.debug.js"></script>
<script type="text/javascript" src="/asyst/components/foresight.pages.debug.js"></script>
<script type="text/javascript" src="/asyst/components/asyst/asyst.dashboard.js"></script>
<script type="text/javascript" src="/asyst/components/asyst/asyst.reports.js"></script>
<script type="text/javascript" src="/asyst/components/asyst.loaders/asyst.metaelementloader.js"></script>
<script type="text/javascript" src="/asyst/components/asyst.loaders/asyst.imageloader.js"></script>
<script type="text/javascript" src="/asyst/components/asyst.loaders/asyst.contentloader.js"></script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('b5f1b666-b178-42ed-8a17-bd353a2f096c', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'body_close', NULL, NULL, 9000, 0, 0, NULL, NULL, '</body>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('039df61b-7615-447f-a823-c18a19ccfa37', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'html_close', NULL, NULL, 9999, 0, 0, NULL, NULL, '</html>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('726b215b-0a06-4bc5-a70d-c4d3321c8059', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'placeholder', 'загрузка данных страницы', NULL, 8100, 0, 0, NULL, NULL, '<asyst:Content ContentPlaceHolderId="content"></asyst:Content>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('468bd58c-a0c0-4ef0-999b-e8a584334cd8', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'head', NULL, NULL, 10, 0, 0, NULL, NULL, '<head>
  <script>
    (function(_){if (typeof(_._errs)==="undefined"){
      _._errs=[];var c=_.onerror;_.onerror=function(){
        var a=arguments;_errs.push(a);c&&c.apply(this,a)
      };}})(window);  
  </script>
  <title>foresight</title>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <!-- необходимые для реестров стили закомментируем -->
  <!--
  <link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
  <link rel="stylesheet" href="/asyst/css/asyst.global.css">
  <link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
  -->
  
  <link rel="stylesheet" href="/asyst/components/foresight.third.min.css" type="text/css" media="all">
  <link rel="stylesheet" href="/asyst/components/foresight.components.min.css" type="text/css" media="all">
</head>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('8030d12b-270c-4702-944d-f03d91092f3e', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f', NULL, 0, 'menu_data', 'Загрузка меню', NULL, 8003, 0, 0, NULL, NULL, '<script>
  $(function(){
    var $menu__list = $(''<ul class="menu__list"></ul>'');
    var data = [
      <htmlrow>
      {
        menulistid: "{MenuListId}",
        parentid: "{ParentId}",
        name: "{Name}",
        url: "{URL}",
        order: "{Order}",
      },
  </htmlrow>
    ];
    data.forEach(function(item) {
      if (item.parentid == ''null'') {
        var haschild = false;
        data.forEach(function(e) { if (e.parentid == item.menulistid) { haschild = true; } });
        if (haschild) {
          var $menu__item = $([
            ''<li class="menu__item" menulistid='' + item.menulistid + ''>'',
            ''<a class="menu__item-link link">'',
            ''<span class="menu__item-link-content">'',
            ''<span class="menu__item-text">'' + item.name + ''</span>'',
            ''<span class="icon menu__icon icon_svg_right_white"></span>'',
            ''</span>'',
            ''</a>'',
            ''<div class="menu menu__submenu-container">'',
            ''<ul class="menu__list menu__submenu">'',
            ''</ul>'',
            ''</div>'',
            ''</li>''
          ].join(''''));
        } else {
          var $menu__item = $([
            ''<li class="menu__item" menulistid='' + item.menulistid + ''>'',
            ''<a class="menu__item-link link" href="'' + item.url + ''">'',
            ''<span class="menu__item-link-content">'',
            ''<span class="menu__item-text">'' + item.name + ''</span>'',
            ''</span>'',
            ''</a>'',
            ''</li>''
          ].join(''''));
        }
        $menu__list.append($menu__item);
      } else {
        var $menu__item = $([
          ''<li class="menu__item" menulistid='' + item.menulistid + ''>'',
          ''<a class="menu__item-link link" href="'' + item.url + ''">'',
          ''<span class="menu__item-link-content">'',
          ''<span class="menu__item-text">'' + item.name + ''</span>'',
          ''</span>'',
          ''</a>'',
          ''</li>''
        ].join(''''));
        $menu__list.find(''li[menulistid="'' + item.parentid + ''"] ul.menu__submenu'').append($menu__item);
      }
    });
    $(''.menu'').append($menu__list);
    $(''.menu'').menu();
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec page_MyMenuList @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage ForesightMaster.page ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '22e5192e ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage ForesightMaster.page !ForesightMaster***/

GO
/****************************************************************
*      START MetaPage Библиотека виджетов для главной страницы _LibraryIndex
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Библиотека виджетов для главной страницы ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '82cf27d0-781f-48ce-ab78-4ea103324f96'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='82cf27d0-781f-48ce-ab78-4ea103324f96')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('82cf27d0-781f-48ce-ab78-4ea103324f96', '_LibraryIndex', 'Библиотека виджетов для главной страницы', NULL, NULL, NULL, 0, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '_LibraryIndex', [Title] = 'Библиотека виджетов для главной страницы', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='82cf27d0-781f-48ce-ab78-4ea103324f96'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('98b72f60-b71f-4417-a1e7-04110dfa88e0', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'ChReqFromMe', 'Запросы на изменение от меня', 'Запросы на изменение от меня', 4, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="changerequest?View=ChangeRequestFromMe&ExpandGroup=true">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_ChReqFromMe @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('d6d80919-8235-4042-a24d-0eb17bda806d', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyContractBubble', 'Бабл чарт моих контрактов', 'Бабл чарт моих контрактов', 23, 0, 0, NULL, NULL, '<div id="MyContractBubble" style="height:100%;"></div>
<script>
  $(function(){
    var id = ''MyContractBubble'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    chart = new BubbleChart(''#'' + newid, [
      <htmlrow>
      {
        "id": {ProjectId},
        "projectid": {ProjectId},
        "projectcode": "{ProjectCode}",
        "projectname": "{ProjectName}",
        "contractscount": {ContractsCount},
        "total_amount": {PlanSum},
        "plansum": {PlanSum},
        "group": {IndicatorId},
        "indicatorid": {IndicatorId},
        "indicatorcolor": "{IndicatorColor}",
      },
 	  </htmlrow>
    ]);
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPages_MyContractsBubble @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('05f4c4d0-05f8-4560-a4e7-1bdc6bf4ba51', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyOrders', 'Мои поручения', 'Мои поручения', 18, 0, 0, NULL, NULL, '<div id=''MyOrders''></div>
<script>
  $(function () { 
    var id = ''MyOrders'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    var chart = new Highcharts.Chart({ 
      chart: { 
        renderTo: newid, 
        type: ''column'',
        margin: [25, 25, 25, 25],
        width: getsize().width,
        height: getsize().height
      },
      title: { text: '''' }, 
      legend: { enabled: false }, 
      credits: { enabled: false },
      exporting: { enabled: false },
      yAxis: {
        title: { text: '''' },
        labels: { enabled: false },
        gridLineColor: ''#eeeeee'',
        tickColor: ''#eeeeee''
      },
      xAxis: {
        title: { text: '''' },
        labels: { enabled: false },
        gridLineColor: ''#eeeeee'',
        tickColor: ''#eeeeee''
      },
      tooltip: { 
        backgroundColor: ''rgba(51,51,51,0.85)'',
        borderColor: ''transparent'',
        shadow: false,
        style: {
          fontFamily: ''Proximanova-Regular'',
          fontSize: ''12px'',
          color: ''#fff''
        },
        formatter: function() { 
          return this.point.name + '': <b>''+ this.y +''</b>''; 
        }
      },
      plotOptions: { 
        column: { 
          shadow: false, 
          dataLabels: { 
            enabled: true, 
            color: ''#333'',
            style: {
              fontFamily: ''Proximanova-Regular'',
              fontSize: ''12px'',
              textShadow: false 
            },
            formatter: function() { return this.y; } 
          } 
        },
        series: { 
          pointPadding: -0.15, 
          cursor: ''pointer'', 
          point: { 
            events: { 
              click: function() { location.href = this.options.url; }
            }
          }
        }
      }, 
      series: [{ data: [
        <htmlrow>
        {
          name: ''{IndicatorTitle}'', 
          y: {Cnt}, 
          color: ''{IndicatorColor}'', 
          url: ''order?view=MyOrder&Field1Name=IndicatorId&Field1Value={IndicatorId}&ExpandGroup=true''
        },
        </htmlrow>
      ] }] 
    });
    $(window).resize(function(){
      chart.setSize(getsize().width, getsize().height, true);
    });
    function getsize(){
      return {
		width: $(''#''+newid).closest(".widget__body-data").width(),
      	height: $(''#''+newid).closest(".widget__body-data").height()
      };
    };
  }); 
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyOrders @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('a2fbfe25-1316-4e25-b722-278ff93b4f0b', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'PointsFromMe', 'КТ от меня', 'КТ от меня', 16, 0, 0, NULL, NULL, '<div id=''PointsFromMe''></div>
<script>
  $(function(){
    var id = ''PointsFromMe'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    var chart = new Highcharts.Chart({
      chart: { 
        type: ''pie'',
        renderTo: newid,
        width: getsize().width,
        height: getsize().height
      },
      title: { text: '''' },
      legend: { enabled: false },
      exporting: { enabled: false },
      credits: { enabled: false },
      tooltip: { 
        backgroundColor: ''rgba(51,51,51,0.85)'',
        borderColor: ''transparent'',
        shadow: false,
        style: {
          fontFamily: ''Proximanova-Regular'',
          fontSize: ''12px'',
          color: ''#fff''
        },
        formatter: function() { 
          return this.point.name + '': <b>''+ this.y +''</b>''; 
        }
      },
      yAxis: { 
        title: { 
          text: '''' 
        } 
      },
      plotOptions: { 
        pie: { 
          allowPointSelect: true,
          cursor: ''pointer'',
          dataLabels: {
            enabled: true,
            distance: 5,
            style: {
              fontFamily: ''Proximanova-Regular'',
              fontSize: ''12px'',
              color: ''#666''
            },
            formatter: function() {
              return this.y; 
            }
          } 
        },
        series: { 
          cursor: ''pointer'', 
          point: { 
            events: { 
              click: function() { 
                location.href = this.options.url; 
              }
            } 
          } 
        } 
      },
      series: [{
        data: [
          <htmlrow>
            {
              name: ''{IndicatorTitle}'', 
              y: {Cnt}, 
              color: ''{IndicatorColor}'', 
              url: ''point?view=PointFromMe&Field1Name=IndicatorId&Field1Value={IndicatorId}&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null''
            },
          </htmlrow>
        ]
      }]
    });
    $(window).resize(function(){
      chart.setSize(getsize().width, getsize().height, true);
    });
    function getsize(){
      return {
		width: $(''#''+newid).closest(".widget__body-data").width(),
      	height: $(''#''+newid).closest(".widget__body-data").height()
      };
    };
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_PointsFromMe @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('31bc6672-8353-483d-9bff-2aeeb0229b9c', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'ChReqForMe', 'Запросы на изменение для меня', 'Запросы на изменение для меня', 3, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="changerequest?View=MyChangeRequest&ExpandGroup=true&Field1Name=IsReviewAvailable&Field1Value=Да">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyChReq @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('fdabdf5a-e7f9-4f51-a9ee-2fe916a63f31', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'Logo', 'Логотип', 'Логотип', 37, 0, 0, NULL, NULL, '<style>
  .box_full { width: 100%; height: 100%; padding: 10px 10px 20px; box-sizing: border-box; }
  .box_center { width: 100%; height: 100%; background-image: url(/asyst/anon/logo.png); background-repeat: no-repeat; background-position: center center; box-sizing: border-box; background-size: contain; }
  .foresight { background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i0KHQu9C+0LlfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyMzguMTA5cHgiIGhlaWdodD0iMjM4LjEwOXB4IiB2aWV3Qm94PSIwIDAgMjM4LjEwOSAyMzguMTA5IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMzguMTA5IDIzOC4xMDkiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIGZpbGw9IiNGRjY2NjYiIGQ9Ik0xNjMuOTM4LDEzNS41MjJsNzEuNDQzLDM0LjE1OGMxLjA2NC0xLjc0NywxLjY1OS0zLjc4MiwxLjY1OS01LjkwNlYzNi40NzFjMC00LjQ5NS0zLjE0Ni04LjM3NS03LjU0NS05LjMwNGwtMC4xNDYtMC4wMzFjLTQuMTg0LTAuODgzLTguNDQsMS4xMzQtMTAuNDA3LDQuOTI5TDE2My45MzgsMTM1LjUyMnoiLz48cGF0aCBmaWxsPSIjRkZFMTY1IiBkPSJNMTMwLjYzMSwyLjQ3bDAuMDAxLDkyLjY3OGwtNDcuMzQ0LTAuMDAxYy0yLjA3LDAtMy45NzYtMS4xMjgtNC45NzEtMi45NDFMNDAuMzE5LDIyLjk1OWMtMS40MDYtMi41NjQsMC4xMzYtNS43NSwzLjAxOS02LjIzOEwxMjUuMjg0LDIuODZDMTI3LjA1NSwyLjU2MiwxMjguODQ1LDIuNDMyLDEzMC42MzEsMi40NyIvPjxwYXRoIGZpbGw9IiNGRjY2NjYiIGQ9Ik0xMzAuNjMzLDk1LjE0OGgzLjExYzIuMDkyLDAsNC4wMTQtMS4xNTEsNC45OTktMi45OTZsMzkuNzkyLTc0LjQwNWMxLjMzNC0yLjQ5NC0wLjA5NS01LjU3Mi0yLjg2LTYuMTYzbC0zOS43MzctOC40OTRjLTEuNzQ5LTAuMzczLTMuNTIzLTAuNTgtNS4zMDUtMC42MTlMMTMwLjYzMyw5NS4xNDh6Ii8+PHBhdGggZmlsbD0iI0ZGRTE2NSIgZD0iTTEyMi42MzYsMTIyLjI3MWw0LjI1Mi03Ljk1MWMxLjUxNi0yLjgzMy0wLjUzNy02LjI1Ny0zLjc0OS02LjI1N0g5NC4yMDRjLTMuMjMzLDAtNS4yODMsMy40NjQtMy43MjksNi4yOTdsOC43NCwxNS45MjhMMTIyLjYzNiwxMjIuMjcxeiIvPjxwYXRoIGZpbGw9IiMyMDlFRDUiIGQ9Ik05OS4yMTYsMTMwLjI4N2wyMy40Mi04LjAxOGwtMTAuMDI5LDE4Ljc1M2MtMS41OTIsMi45NzktNS44NTMsMy03LjQ3NywwLjA0TDk5LjIxNiwxMzAuMjg3eiIvPjxwYXRoIGZpbGw9IiMyMDlFRDUiIGQ9Ik0xNjMuOTM4LDEzNS41MjJsNzEuNDQzLDM0LjE1OGMtMS4wNDUsMS43MTItMi41NDQsMy4xNDgtNC4zODUsNC4xMmwtMTE0LjYxMyw2MC41MzRjLTMuNjk1LDEuOTUtOC4xNjMsMS43MTItMTEuNjI5LTAuNjIyTDYuMDc1LDE2Ny4yNTVjLTEuNTgzLTEuMDY2LTIuODQ2LTIuNDk1LTMuNzA2LTQuMTM2bDc3Ljc3NS0yNi4zOTd2MC4wMDFsMjQuMzA5LDQ1LjU1MmMxLjcyNCwzLjIzMiw1LjA4OSw1LjI1LDguNzUzLDUuMjVoMTcuMTIzYzMuNjY5LDAsNy4wMzgtMi4wMjIsOC43NjEtNS4yNjRMMTYzLjkzOCwxMzUuNTIyeiIvPjxwYXRoIGZpbGw9IiNGRkUxNjUiIGQ9Ik04MC4xNDUsMTM2LjcyM0wyMS43MjcsMjcuMjQ4Yy0yLjAwOS0zLjc2NS02LjE5OS01LjgyMi0xMC40MDYtNS4xMTFsLTEuNjkyLDAuMjg3Yy01LjA2NSwwLjg1Ny04LjU1OSw0Ljk5MS04LjU1OSw5LjgzMVYxNTcuODVjMCwxLjg2NCwwLjQ1OCwzLjY2NywxLjMsNS4yNzFMODAuMTQ1LDEzNi43MjN6Ii8+PC9nPjwvc3ZnPg==); }
</style>
<div class="box_full">
  <div class="box_center foresight"></div>
</div>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('d09c617d-199a-49ca-93d6-330ed4d94245', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyProjectMoveToNextPhase', 'Проекты на стадию', 'Перевести проекты на следующую стадию', 8, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="/asyst/page/project?extFilters={%22oper%22:%22or%22,%22filterItems%22:[{Filter}]}">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MoveToNextPhase @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('486c11c9-c253-4fcc-8ceb-4242ea2a68c4', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyRisksPie', 'Риски моих проектов', 'Риски моих проектов', 21, 0, 0, NULL, NULL, '<div id=''MyRisksPie''></div>
<script>
  $(function(){
    var id = ''MyRisksPie'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    var chart = new Highcharts.Chart({
      chart: { 
        type: ''pie'',
        renderTo: newid,
        width: getsize().width,
        height: getsize().height
      },
      title: { text: '''' },
      legend: { enabled: false },
      exporting: { enabled: false },
      credits: { enabled: false },
      tooltip: { 
        backgroundColor: ''rgba(51,51,51,0.85)'',
        borderColor: ''transparent'',
        shadow: false,
        style: {
          fontFamily: ''Proximanova-Regular'',
          fontSize: ''12px'',
          color: ''#fff''
        },
        formatter: function() { 
          return this.point.name + '': <b>''+ this.y +''</b>''; 
        }
      },
      yAxis: { 
        title: { 
          text: '''' 
        } 
      },
      plotOptions: { 
        pie: { 
          allowPointSelect: true,
          cursor: ''pointer'',
          dataLabels: {
            enabled: true,
            distance: 5,
            style: {
              fontFamily: ''Proximanova-Regular'',
              fontSize: ''12px'',
              color: ''#666''
            },
            formatter: function() {
              return this.y; 
            }
          } 
        },
        series: { 
          cursor: ''pointer'', 
          point: { 
            events: { 
              click: function() { 
                location.href = this.options.url; 
              }
            } 
          } 
        } 
      },
      series: [{
        data: [
          <htmlrow>
            {
              name: ''{IndicatorTitle}'', 
              y: {Cnt}, 
              color: ''{IndicatorColor}'',
              url: ''risk?view=MyActivityRisk&Field1Name=IndicatorId&Field1Value={IndicatorId}&ExpandGroup=true'' 
            },
          </htmlrow>
        ]
      }]
    });
    $(window).resize(function(){
      chart.setSize(getsize().width, getsize().height, true);
    });
    function getsize(){
      return {
		width: $(''#''+newid).closest(".widget__body-data").width(),
      	height: $(''#''+newid).closest(".widget__body-data").height()
      };
    };
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyRisksPie @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('8792c2ea-3987-4af5-ad78-61f50db2a295', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MessagesForMe', 'Сообщения в карточках для меня', 'Сообщения в карточках для меня', 39, 0, 0, NULL, NULL, '<div class="carousel" id="MessagesForMe"></div>
<script>
  $(function() { 
    var id = ''MessagesForMe'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    $(''#''+newid).carousel({
      autoPlay: false,
      items: [
        <htmlrow>
        {
          text: ''{AuthorName} (от {CreationDateText})<br>{Content}'',
          url: ''/asyst/{EntityName}/form/auto/{DataId}?mode=view&back=/&tab=tab-twitter''
        },
        </htmlrow>
      ]
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 0, 0, NULL, NULL, 0, 'exec db_MainPage_CommentForMe_List @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('c203b737-8f5b-435e-bb4d-67dc034b30c3', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyDocs', 'Мои документы', 'Мои документы', 7, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="doclib?view=DocumentFileViewMy&Field1Name=LastModified&Field1Value={DateValue}&Field1Operation=GreaterThenOrEqual">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyDocumentsCnt @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('a9fb23cb-2136-463a-9cf4-724e9a099266', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyPoints', 'Мои КТ', 'Мои КТ', 15, 0, 0, NULL, NULL, '<div id=''MyPoints''></div>
<script>
  $(function(){
    var id = ''MyPoints'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    var chart = new Highcharts.Chart({
      chart: { 
        type: ''pie'',
        renderTo: newid,
        width: getsize().width,
        height: getsize().height
      },
      title: { text: '''' },
      legend: { enabled: false },
      exporting: { enabled: false },
      credits: { enabled: false },
      tooltip: { 
        backgroundColor: ''rgba(51,51,51,0.85)'',
        borderColor: ''transparent'',
        shadow: false,
        style: {
          fontFamily: ''Proximanova-Regular'',
          fontSize: ''12px'',
          color: ''#fff''
        },
        formatter: function() { 
          return this.point.name + '': <b>''+ this.y +''</b>''; 
        }
      },
      yAxis: { 
        title: { 
          text: '''' 
        } 
      },
      plotOptions: { 
        pie: { 
          allowPointSelect: true,
          cursor: ''pointer'',
          dataLabels: {
            enabled: true,
            distance: 5,
            style: {
              fontFamily: ''Proximanova-Regular'',
              fontSize: ''12px'',
              color: ''#666''
            },
            formatter: function() {
              return this.y; 
            }
          } 
        },
        series: { 
          cursor: ''pointer'', 
          point: { 
            events: { 
              click: function() { 
                location.href = this.options.url; 
              }
            } 
          } 
        } 
      },
      series: [{
        data: [
          <htmlrow>
            {
              name: ''{IndicatorTitle}'', 
              y: {Cnt}, 
              color: ''{IndicatorColor}'',
              url: ''point?view=MyPoint&Field1Name=IndicatorId&Field1Value={IndicatorId}&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null''
            },
          </htmlrow>
        ]
      }]
    });
    $(window).resize(function(){
      chart.setSize(getsize().width, getsize().height, true);
    });
    function getsize(){
      return {
		width: $(''#''+newid).closest(".widget__body-data").width(),
      	height: $(''#''+newid).closest(".widget__body-data").height()
      };
    };
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyPoints @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('913dac3b-54b0-4d1c-8f74-82db04e4367b', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyInitiative', 'Мои инициативы', 'Мои инициативы', 19, 0, 0, NULL, NULL, '<div id=''MyInitiative''></div>
<script>
  $(function () { 
    var id = ''MyInitiative'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    var chart = new Highcharts.Chart({ 
      chart: { 
        renderTo: newid, 
        type: ''column'',
        margin: [25, 25, 25, 25],
        width: getsize().width,
        height: getsize().height
      },
      title: { text: '''' }, 
      legend: { enabled: false }, 
      credits: { enabled: false },
      exporting: { enabled: false },
      yAxis: {
        title: { text: '''' },
        labels: { enabled: false },
        gridLineColor: ''#eeeeee'',
        tickColor: ''#eeeeee''
      },
      xAxis: {
        title: { text: '''' },
        labels: { enabled: false },
        gridLineColor: ''#eeeeee'',
        tickColor: ''#eeeeee''
      },
      tooltip: { 
        backgroundColor: ''rgba(51,51,51,0.85)'',
        borderColor: ''transparent'',
        shadow: false,
        style: {
          fontFamily: ''Proximanova-Regular'',
          fontSize: ''12px'',
          color: ''#fff''
        },
        formatter: function() { 
          return this.point.name + '': <b>''+ this.y +''</b>''; 
        }
      },
      plotOptions: { 
        column: { 
          shadow: false, 
          dataLabels: { 
            enabled: true, 
            color: ''#333'',
            style: {
              fontFamily: ''Proximanova-Regular'',
              fontSize: ''12px'',
              textShadow: false 
            },
            formatter: function() { return this.y; } 
          } 
        },
        series: { 
          pointPadding: -0.15, 
          cursor: ''pointer'', 
          point: { 
            events: { 
              click: function() { location.href = this.options.url; }
            }
          }
        }
      }, 
      series: [{ data: [
        <htmlrow>
        {
          name: ''{IndicatorTitle}'', 
          y: {Cnt}, 
          color: ''{IndicatorColor}'', 
          url: ''initiative?view=MyInitiativeView&Field1Name=IndicatorId&Field1Value={IndicatorId}&ExpandGroup=true'' 
        },
        </htmlrow>
      ] }] 
    });
    $(window).resize(function(){
      chart.setSize(getsize().width, getsize().height, true);
    });
    function getsize(){
      return {
		width: $(''#''+newid).closest(".widget__body-data").width(),
      	height: $(''#''+newid).closest(".widget__body-data").height()
      };
    };
  }); 
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyInitiative @UserLang, @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('f0d82e13-2c7f-46fe-b02d-8c15bcd3b742', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyInitCPO', 'Мои инициативы на рассмотрении ЦПО', 'Мои инициативы на рассмотрении ЦПО', 5, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="initiative?view=MyInitiativeView&Field1Name=InitStateId&Field1Value=2&ExpandGroup=true">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_CPOInitiative @UserLang, @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('3ef391f7-21d3-46b4-bd2c-9bcb9db16396', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyMeetings', 'Мои совещания', 'Мои совещания', 17, 0, 0, NULL, NULL, '<div id=''MyMeetings''></div>
<script>
  $(function(){
    var id = ''MyMeetings'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    var chart = new Highcharts.Chart({
      chart: { 
        type: ''pie'',
        renderTo: newid,
        width: getsize().width,
        height: getsize().height
      },
      title: { text: '''' },
      legend: { enabled: false },
      exporting: { enabled: false },
      credits: { enabled: false },
      tooltip: { 
        backgroundColor: ''rgba(51,51,51,0.85)'',
        borderColor: ''transparent'',
        shadow: false,
        style: {
          fontFamily: ''Proximanova-Regular'',
          fontSize: ''12px'',
          color: ''#fff''
        },
        formatter: function() { 
          return this.point.name + '': <b>''+ this.y +''</b>''; 
        }
      },
      yAxis: { 
        title: { 
          text: '''' 
        } 
      },
      plotOptions: { 
        pie: { 
          innerSize: ''75%'',
          allowPointSelect: true,
          cursor: ''pointer'',
          dataLabels: {
            enabled: true,
            distance: 5,
            style: {
              fontFamily: ''Proximanova-Regular'',
              fontSize: ''12px'',
              color: ''#666''
            },
            formatter: function() {
              return this.y; 
            }
          } 
        },
        series: { 
          cursor: ''pointer'', 
          point: { 
            events: { 
              click: function() { 
                location.href = this.options.url; 
              }
            } 
          } 
        } 
      },
      series: [{
        data: [
          <htmlrow>
            { 
              name: ''{IndicatorTitle}'', 
              y: {Cnt}, 
              color: ''{IndicatorColor}'', 
              url: ''meeting?view=MyMeeting&Field1Name=IndicatorId&Field1Value={IndicatorId}''
            },
          </htmlrow>
        ]
      }]
    });
    $(window).resize(function(){
      chart.setSize(getsize().width, getsize().height, true);
    });
    function getsize(){
      return {
		width: $(''#''+newid).closest(".widget__body-data").width(),
      	height: $(''#''+newid).closest(".widget__body-data").height()
      };
    };
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyMeetings @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('16c3b1d0-d2be-4405-b0a1-9cd034221dba', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'LovFromMe', 'ОВ от меня', 'Открытые вопросы от меня', 2, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="lov?view=LovViewFromMe">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_LovFromMe @UserLang, @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('da738b21-face-4f92-89b1-9e564933953f', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyReports', 'Мои статус-отчеты', 'Мои статус-отчеты', 42, 0, 0, NULL, NULL, '<div class="carousel" id="MyReports"></div>
<script>
  $(function() { 
    var id = ''MyReports'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    $(''#''+newid).carousel({
      autoPlay: false,
      items: [
        <htmlrow>
        {
          text: ''{Cnt}<br>{Name}'',
          url: ''statusreport?repCalId={repTypeCalendarId}''
        },
        </htmlrow>
      ]
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyReports @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('ceeb5aca-a26b-495a-bab0-b3a17b34c749', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyContracts', 'Мои контракты', 'Мои контракты', 36, 0, 0, NULL, NULL, '<div class="widget__content widget__content_scroll">
  <table class="table">
    <thead>
      <tr>
        <td></td>
        <td>Название</td>
        <td class="mobile mobile_hide">Ответственный</td>
        <td class="mobile mobile_hide align_right">План, м.р.</td>
        <td class="mobile mobile_hide align_right">Стоимость, м.р.</td>
      </tr>
    </thead>
    <tbody>              
      <htmlrow>
        <tr>
          <td><img src="/asyst/gantt/img/svg/{IndicatorId}.svg" title="{IndicatorTitle}" class="indicator"/></td>
          <td><a class="link" href="/asyst/Contract/form/auto/{ContractId}?mode=view&back=/">{Code}. {Name}</a></td>
          <td class="mobile mobile_hide">{Leader}</td>
          <td class="mobile mobile_hide align_right">{PlanSum:[0.0]? }</td>
          <td class="mobile mobile_hide align_right">{RealSum:[0.0]? }</td>
        </tr>        
      </htmlrow>
    </tbody>
  </table>
</div>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPages_MyContracts @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('84dfe8d4-aa48-421d-a3b3-c303823d6294', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MessagesForMeRG', '(для РГ и УК) Сообщения в карточках для меня', '(для РГ и УК) Сообщения в карточках для меня', 40, 0, 0, NULL, NULL, '<div class="carousel" id="MessagesForMeRG"></div>
<script>
  $(function() { 
    var id = ''MessagesForMeRG'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    $(''#''+newid).carousel({
      autoPlay: false,
      items: [
        <htmlrow>
        {
          text: ''{AuthorName} (от {CreationDateText})<br>{Content}'',
          url: ''/asyst/{EntityName}/form/auto/{DataId}?mode=view&back=/&tab=tab-twitter''
        },
        </htmlrow>
      ]
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 0, 0, NULL, NULL, 0, 'exec db_MainPage_CommentForMe_List @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('dceb9357-0120-4295-9876-c772bfa8ff4a', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyDashboards', 'Мои дэшборды по портфелям', 'Мои дэшборды по портфелям', 41, 0, 0, NULL, NULL, '<div class="carousel" id="MyDashboards"></div>
<script>
  $(function() { 
    var id = ''MyDashboards'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    $(''#''+newid).carousel({
      autoPlay: false,
      items: [
        <htmlrow>
        {
          text: ''{Code}. {Name}'',
          url: ''/asyst/PortfolioDashboarfdViewForm/form/auto/{PortfolioId}?mode=view&back=/''
        },
        </htmlrow>
      ]
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 0, 0, NULL, NULL, 0, 'exec db_MainPages_MyPortfolio @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('87aaa013-4330-4203-9ffc-d0d5f101bf88', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'ChListForMe', 'Чек-листы для меня', 'Чек-листы для меня', 6, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="checklist">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyCheckListCnt @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('2eab3fc3-8e96-4dd4-bd13-d7e99d7b0d9e', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyLov', 'ОВ для меня', 'Открытые для меня вопросы', 1, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="lov?View=LovViewForMe">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyLov @UserLang, @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('fa588810-ce6a-46d6-b579-db60c01ede31', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'MyProjects', 'Мои проекты', 'Мои проекты', 35, 0, 0, NULL, NULL, '<div class="widget__content widget__content_scroll">
  <table class="table">
    <thead>
      <tr>
        <td></td>
        <td>Название</td>
        <td class="mobile mobile_hide">Руководитель</td>
        <td class="mobile mobile_hide">Стадия</td>
        <td class="mobile mobile_hide">Моя роль</td>
      </tr>
    </thead>
    <tbody>              
      <htmlrow>
        <tr>
          <td><img src="/asyst/gantt/img/svg/{IndicatorId}.svg" title="{IndicatorTitle}" class="indicator"/></td>
          <td><a class="link" href="/asyst/Project/form/auto/{ProjectId}?mode=view&back=/">{Code}. {Name}</a></td>
          <td class="mobile mobile_hide">{ProjectLeader}</td>
          <td class="mobile mobile_hide">{ActivityPhaseName}</td>
          <td class="mobile mobile_hide">{MyRole}</td>
        </tr>        
      </htmlrow>
    </tbody>
  </table>
</div>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPages_MyProjects @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('05b5fa5a-f1fc-4a65-bac6-f303dad1ece1', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'ForMeInitiative', 'Инициативы для меня', 'Инициативы для меня', 20, 0, 0, NULL, NULL, '<div id=''ForMeInitiative''></div>
<script>
  $(function () { 
    var id = ''ForMeInitiative'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    var chart = new Highcharts.Chart({ 
      chart: { 
        renderTo: newid, 
        type: ''column'',
        margin: [25, 25, 25, 25],
        width: getsize().width,
        height: getsize().height
      },
      title: { text: '''' }, 
      legend: { enabled: false }, 
      credits: { enabled: false },
      exporting: { enabled: false },
      yAxis: {
        title: { text: '''' },
        labels: { enabled: false },
        gridLineColor: ''#eeeeee'',
        tickColor: ''#eeeeee''
      },
      xAxis: {
        title: { text: '''' },
        labels: { enabled: false },
        gridLineColor: ''#eeeeee'',
        tickColor: ''#eeeeee''
      },
      tooltip: { 
        backgroundColor: ''rgba(51,51,51,0.85)'',
        borderColor: ''transparent'',
        shadow: false,
        style: {
          fontFamily: ''Proximanova-Regular'',
          fontSize: ''12px'',
          color: ''#fff''
        },
        formatter: function() { 
          return this.point.name + '': <b>''+ this.y +''</b>''; 
        }
      },
      plotOptions: { 
        column: { 
          shadow: false, 
          dataLabels: { 
            enabled: true, 
            color: ''#333'',
            style: {
              fontFamily: ''Proximanova-Regular'',
              fontSize: ''12px'',
              textShadow: false 
            },
            formatter: function() { return this.y; } 
          } 
        },
        series: { 
          pointPadding: -0.15, 
          cursor: ''pointer'', 
          point: { 
            events: { 
              click: function() { location.href = this.options.url; }
            }
          }
        }
      }, 
      series: [{ data: [
        <htmlrow>
        {
          name: ''{IndicatorTitle}'', 
          y: {Cnt}, 
          color: ''{IndicatorColor}'', 
          url: ''initiative?view=ForMeInitiativeView&Field1Name=IndicatorId&Field1Value={IndicatorId}&ExpandGroup=true'' 
        },
        </htmlrow>
      ] }] 
    });
    $(window).resize(function(){
      chart.setSize(getsize().width, getsize().height, true);
    });
    function getsize(){
      return {
		width: $(''#''+newid).closest(".widget__body-data").width(),
      	height: $(''#''+newid).closest(".widget__body-data").height()
      };
    };
  }); 
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_InitiativeFromMe @UserLang, @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('50af7d87-d94c-4ad1-aec4-f9e5e7593f6c', '82cf27d0-781f-48ce-ab78-4ea103324f96', NULL, 0, 'RiskMatrix', 'Матрица рисков', 'Матрица рисков', 22, 0, 0, NULL, NULL, '<div id="RiskMatrix" style="height:100%;"></div>
<script>
  $(function() { 
    var id = ''RiskMatrix'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    $("#"+newid).createRiskMatrix({
      OXName: "Вероятность", 
      OYName: "Влияние", 
      Probability: ["Низкая", "Средняя", "Высокая"], 
      Impact: ["Низкое", "Среднее", "Высокое"], 
      Color: ["riskBGGreen", "riskBGGreen", "riskBGYellow", "riskBGRed","riskBGRed", "riskBGRed"], 
      Data: [
        <htmlrow>
        {
          Code: "{Code}", Name: "", Probability:"{RiskProbabilityName}", Impact: "{RiskImpactName}", 
          CSS: "{CSS}", URL: "/asyst/Risk/form/auto/{RiskId}?mode=view&back=/"
        },
        </htmlrow>
      ] 
    });
    $(''#''+newid+'' .riskCell'').each(function(){
      var count = $(this).find(''.riskBadge'').length
      if(count>3){
        $(this).find(''.riskBadge'').slice(3).addClass(''riskBadgeHide'')
        $(this).append(''<span class="riskBadgeCount">и еще ''+(count-3)+'' ...</span>'')
      }
    })
    var riskTotalLabel = $(''#''+newid+'' .riskTotalLabel'').html();
    $(''.riskTable'').on(''click'', ''.riskBadgeCount'', function(){
      var count = $(this).parent().find(''.riskBadge'').length
      $(''#''+newid+'' .riskTotalLabel'').html(count)
      var riskVert = $(this).parent().parent().find(''.riskRowLabel'').not(''[rowspan]'').find(''div'').text();
      $(''#''+newid+'' tr .riskRowLabel'').not(''[rowspan]'').find(''div'').not('':contains(''+riskVert+'')'').css(''fontSize'',''0'');
      var indexCell = $(this).parent().index()
      if(indexCell==4)  indexCell=3
      var riskCol = $(''#''+newid+'' .riskColLabel'').eq(indexCell-1).text();
      $(''#''+newid+'' .riskColLabel'').not(''[colspan]'').not('':contains(''+riskCol+'')'').css(''fontSize'',''0'');
      var classColor = $(this).parent().attr(''class'');
      classColor = classColor.split('' '');
      classColor = classColor[1];
      var contentBadges = $(this).parent().html()
      var riskTableWidth = $(''.riskTable'').width()
      var riskTotalWidth = $(''#''+newid+'' .riskTotalLabel'').width()
      $(''.riskTable'').append(''<div style="width:''+(riskTableWidth-riskTotalWidth)+''" class="riskBadges ''+classColor+''"><div>''+contentBadges+''<p>Назад</p></div></div>'')
    })
    $(''.riskTable'').on(''click'', ''.riskBadges'',function(){
      $(this).remove();
      $(''#''+newid+'' .riskTotalLabel'').html(riskTotalLabel)
      $(''#''+newid+'' tr .riskRowLabel'').not(''[rowspan]'').find(''div'').attr("style", "")
      $(''#''+newid+'' tr .riskColLabel'').not(''[rowspan]'').attr("style", "")
    })
    $(window).resize(function(){
      var riskTableWidth = $(''.riskTable'').width()
      var riskTotalWidth = $(''#''+newid+'' .riskTotalLabel'').width()
      $(''.riskTable .riskBadges'').width(riskTableWidth-riskTotalWidth)
    })
  }); 
</script>
<style>
  .riskBadges{height: 382px;height: 338px;position: absolute;top: 0;right: 0;width: 100%;cursor:pointer;text-align: center;overflow-y: auto;}
  .riskBadgeHide{ display:none !important; }
  .riskBadges .riskBadgeHide{ display:inline-block !important; }
  .riskBadgeCount{ display: inline-block;width: 100%;text-align: center;color: #fff;cursor:pointer;font-size: 14px;/*height: 100%;line-height: 112px;*/ }
  .riskBadges .riskBadgeCount{ display:none; }
  .riskBadges > div{padding:15px 0;}
  .riskBadges > div p{color:#fff;font-size: 18px;margin-top: 7px;}
  .riskBadges .riskBadge{float:none;display: inline-block;}

  .riskTable { border-collapse: collapse; }
  .riskTable > tbody> tr > td:first-child { border-left: none; }
  .riskTable > tbody> tr > td:last-child { border-right: none; }
  .riskBadge { font-size: 10px; margin: 3px; padding: 2px 5px; line-height:20px; cursor: pointer; }
  .riskBadgeGreen { color: #5faf61; border: solid 1px #5faf61; }
  .riskBadgeYellow { color: #fa8f42; border: solid 1px #fa8f42; }
  .riskBadgeRed { color: #ff5940; border: solid 1px #ff5940; }
  .riskBGGreen {}
  .riskBGYellow {}
  .riskBGRed {}
  .riskCell { border: 1px solid #ddd; width: 30%; text-align: center; }
  .riskTotalLabel { border: 1px solid #ddd; background-color: #fafafa; font-size: 40px; padding: 5px 0; text-align: center; color: #333; width: 25px !important; }
  .riskColLabel { border-left: 1px solid #ddd; background-color: #fafafa; border: 1px solid #ddd; font-size: 12px; text-align: center; height: 22px; }
  .riskRowLabel { border: 1px solid #ddd; background-color: #fafafa; font-size: 12px; text-align: center; }
  .riskVert { -ms-transform:rotate(270deg); -moz-transform:rotate(270deg);  -webkit-transform:rotate(270deg); -o-transform:rotate(270deg); }
</style>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_MyRisk @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Библиотека виджетов для главной страницы ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '9ea7adb8 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Библиотека виджетов для главной страницы _LibraryIndex***/

GO
/****************************************************************
*      START MetaPage Библиотека виджетов для панели документов _LibraryDocPanel
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Библиотека виджетов для панели документов ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '9b94c4da-6694-4f00-9c20-b62db64317ba'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='9b94c4da-6694-4f00-9c20-b62db64317ba')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('9b94c4da-6694-4f00-9c20-b62db64317ba', '_LibraryDocPanel', 'Библиотека виджетов для панели документов', NULL, NULL, NULL, 0, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '_LibraryDocPanel', [Title] = 'Библиотека виджетов для панели документов', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='9b94c4da-6694-4f00-9c20-b62db64317ba'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('5c326c7c-09d1-4a97-89bd-0453851cb0f0', '9b94c4da-6694-4f00-9c20-b62db64317ba', NULL, 0, 'Contractors', 'Подрядчики', 'Подрядчики', 1, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="contractor?View=ContractorView">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'db_kdb_Contractors', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('ba4620fa-8f6e-4ef9-ad90-057d67b3dd69', '9b94c4da-6694-4f00-9c20-b62db64317ba', NULL, 0, 'DocTags', 'Тэги файлов. Список', 'Тэги файлов. Список', 8, 0, 0, NULL, NULL, '<div class="widget__content widget__content_scroll">
  <table class="table">
    <tbody>
      <htmlrow>
        <tr>
          <td><a class="link" target="_blank" href="/asyst/page/doclib?view=DocumentFileViewAll&ExpandGroup=true&Field1Name=TagIds&Field1Value={HashtagId}%2C&Field1Operation=Like">{HashtagName}</a></td>
          <td>{Cnt}</td>
        </tr>
      </htmlrow>
    </tbody>
  </table>
</div>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'db_kdb_Tags null, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('b3855584-e291-40f5-9210-08b3296851f7', '9b94c4da-6694-4f00-9c20-b62db64317ba', NULL, 0, 'GleaningForMe', 'Подходящие крупицы', 'Подходящие крупицы', 7, 0, 0, NULL, NULL, '<div class="widget__content widget__content_scroll">
  <table class="table">
    <thead>
      <tr>
        <td>Название</td>
        <td class="mobile mobile_hide">Тип</td>
        <td class="mobile mobile_hide" colspan="2">Проект</td>
        <td class="mobile mobile_hide">Стадия</td>
        <td class="mobile mobile_hide">Руководитель</td>
      </tr>
    </thead>
    <tbody>              
      <htmlrow>
        <tr>
          <td><a class="link" href="/asyst/{GleaningEntityName}/form/auto/{GleaningId}?mode=view&back=">{GleaningName}</a></td>
          <td>{GleaningEntityTitle}</td>
          <td class="mobile mobile_hide"><a class="link" href="/asyst/project/form/auto/{ProjectId}?mode=view&back=">{Code}</a></td>
          <td class="mobile mobile_hide">{ProjectName}</td>
          <td class="mobile mobile_hide">{ActivityPhaseName}</td>
          <td class="mobile mobile_hide">{Leader}</td>
        </tr>        
      </htmlrow>
    </tbody>
  </table>
</div>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_kdb_GleaningForMe @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('8a8db5eb-1f05-4f0f-9284-0f57b44945ca', '9b94c4da-6694-4f00-9c20-b62db64317ba', NULL, 0, 'DocLinks', 'Ссылки', 'Ссылки', 6, 0, 0, NULL, NULL, '<div class="widget__content widget__content_scroll">
  <table class="table">
    <tbody>              
      <tr><td><a class="link" target="_blank" href="/asyst/page/Lesson?view=LessonViewMine">Мои извлеченные уроки</a></td></tr>
      <tr><td><a class="link" target="_blank" href="/asyst/page/Summary?view=SummaryViewMy">Мои итоговые выводы</a></td></tr>
      <tr><td><a class="link" target="_blank" href="/asyst/page/doclib?view=DocumentFileViewMy">Файлы моих карточек</a></td></tr>
      <tr><td><a class="link" target="_blank" href="/asyst/page/docsearch">Расширенные поиск по моим файлам</a></td></tr>
    </tbody>
  </table>
</div>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('b17b1116-042d-44c4-9c9b-8d9146543cc6', '9b94c4da-6694-4f00-9c20-b62db64317ba', NULL, 0, 'ChartFiles', 'Файлы в моих карточках', 'Файлы в моих карточках', 5, 0, 0, NULL, NULL, '<div id=''containerFiles''></div>
<script>
  $(function () { 
    var id = ''containerFiles'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    Highcharts.themeFiles = {
      colors: [''#ffb652'', ''#ff6666'', ''#718396'', ''#3cd79a'', ''#27bdbe'', ''#58c9f3'', ''#00a1f4'', ''#9a60c2'', ''#ef83c9''],
      chart: { style: { fontFamily: ''Proximanova-Regular'' } },
      xAxis: { labels: { rotation: 0, style: { fontSize: ''13px'' } } },
      yAxis: { labels: { style: { fontSize: ''13px'' } } },
    };
    Highcharts.setOptions(Highcharts.themeFiles);
    var chart = new Highcharts.Chart({ 
      chart: { 
        renderTo: newid, 
        type: ''column'',
        margin: [25, 25, 50, 25],
        width: getsize().width,
        height: getsize().height
      },
      title: { text: '''' }, 
      legend: { enabled: false }, 
      credits: { enabled: false },
      exporting: { enabled: false },
      yAxis: {
        title: { text: '''' },
        labels: { enabled: false },
        gridLineColor: ''#eeeeee'',
        tickColor: ''#eeeeee''
      },
      xAxis: {
        type: ''category'',
        title: { text: '''' },
        labels: { enabled: true },
        gridLineColor: ''#eeeeee'',
        tickColor: ''#eeeeee''
      },
      tooltip: { 
        backgroundColor: ''rgba(51,51,51,0.85)'',
        borderColor: ''transparent'',
        shadow: false,
        style: {
          fontFamily: ''Proximanova-Regular'',
          fontSize: ''12px'',
          color: ''#fff''
        },
        formatter: function() { 
          return this.point.name + '': <b>''+ this.y +''</b>''; 
        }
      },
      plotOptions: { 
        column: { 
          shadow: false, 
          dataLabels: { 
            enabled: true, 
            color: ''#333'',
            style: {
              fontFamily: ''Proximanova-Regular'',
              fontSize: ''12px'',
              textShadow: false 
            },
            formatter: function() { return this.y; } 
          } 
        },
        series: { 
          pointPadding: -0.15, 
          cursor: ''pointer'', 
          point: { 
            events: { 
              click: function() { location.href = this.options.url; }
            }
          }
        }
      }, 
      series: [{ 
        colorByPoint: true,
        data: [
        <htmlrow>
        {
          entity: ''{EntityName}'',
          name: ''{EntityTitle}'', 
          y: {Cnt}, 
          url: ''doclib?view=DocumentFileViewMy&Field1Name=EntityName&Field1Value={EntityName}''
        },
        </htmlrow>
      ] }] 
    });
    $(window).resize(function(){
      chart.setSize(getsize().width, getsize().height, true);
    });
    function getsize(){
      return {
		width: $(''#''+newid).closest(".widget__body-data").width(),
      	height: $(''#''+newid).closest(".widget__body-data").height()
      };
    };
  }); 
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'db_kdb_MyFiles @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('2357f1c0-1d22-4bdf-922e-c7a2cd7565d8', '9b94c4da-6694-4f00-9c20-b62db64317ba', NULL, 0, 'DocTagsCloud', 'Тэги файлов. Облако', 'Тэги файлов. Облако', 9, 0, 0, NULL, NULL, '<div id=''cloudview'' style="height:100%; padding-bottom:15px; box-sizing:border-box;"></div>
<script>
  $(function(){
    var cloud = null,
        id = ''cloudview'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    if (!cloud || typeof(cloud)=="undefined") {
      cloud = $(''#'' + newid).cloud({
        data:  [
          <htmlrow>
          { 
            "id" : {HashtagId}, 
            "text": "{HashtagName}", 
            "count": {Cnt}
          },
          </htmlrow>
        ],
        min_font_size : 15,
        max_font_size: 30,
        min_color: "#ccc",
        max_color: "#00a1f4",
        onclick: function(d){
          window.location.href = "/asyst/page/doclib?view=DocumentFileViewAll&ExpandGroup=true&Field1Name=TagIds&Field1Value=" + d.id + "%2C&Field1Operation=Like";
        }
      });
    }
  })
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'db_kdb_Tags null, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('65529071-affa-4f0e-96bf-d9ad7fe6b8c9', '9b94c4da-6694-4f00-9c20-b62db64317ba', NULL, 0, 'ChartLessons', 'Прочие извлеченные уроки', 'Прочие извлеченные уроки', 4, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="lesson?View=AllLessonView&Field1Name=MyRole&Field1Value=0">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'db_kdb_Lessons @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('9866a719-80ea-444c-bb9f-dcc750814397', '9b94c4da-6694-4f00-9c20-b62db64317ba', NULL, 0, 'Finals', 'Подготовить итоговые выводы', 'Подготовить итоговые выводы', 3, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="project?View=MyProject&Field1Name=ActivityPhaseId&Field1Value=40034&Field2Name=SummaryId&Field2Value=0">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'db_kdb_MySummaryCreate @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('6717f047-8a34-403a-a95d-fa86e5798d09', '9b94c4da-6694-4f00-9c20-b62db64317ba', NULL, 0, 'Organizations', 'Внешние организации', 'Внешние организации', 2, 0, 0, NULL, NULL, '<htmlrow>
  <div class="widget__content widget__content_align_center">
    <a class="widget__count link" href="organization?View=OrganizationView">
      {Cnt}
    </a>
  </div>
</htmlrow>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'db_kdb_Organizations', NULL, NULL, NULL, 1, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Библиотека виджетов для панели документов ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '2b313049 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Библиотека виджетов для панели документов _LibraryDocPanel***/

GO
/****************************************************************
*      START MetaPage Библиотека виджетов прочих страниц _LibraryMisc
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Библиотека виджетов прочих страниц ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '7f91e837-1682-4b2f-a922-a474f9c557ea'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='7f91e837-1682-4b2f-a922-a474f9c557ea')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('7f91e837-1682-4b2f-a922-a474f9c557ea', '_LibraryMisc', 'Библиотека виджетов прочих страниц', NULL, NULL, NULL, 0, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '_LibraryMisc', [Title] = 'Библиотека виджетов прочих страниц', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='7f91e837-1682-4b2f-a922-a474f9c557ea'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('c8cbf1d6-8dce-4129-9039-6c2cd313eae1', '7f91e837-1682-4b2f-a922-a474f9c557ea', NULL, 0, 'UserProfileInfo', 'Фотография', 'Фотография', 3, 0, 0, NULL, NULL, '<div class="widget__image" id="image"></div>
<script>
  $(function(){
    var id = ''image'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    var user_info = {
      <htmlrow>
        url: ''{Url}'',
        name: ''{Name}'',
        orgunitname: ''{OrgUnitName}'',
        title: ''{Title}'',
        phone: ''{Phone}'',
        email: ''{EMail}''
      </htmlrow>
    };
    if (user_info.url == null) {
  		user_info.url = ''/asyst/api/file/get/6a277897-d11f-4bd2-be98-036f7e50cfb0/img_profile_big.png'';
  	}
    $(''#'' + newid).css({
    	''background-image'': "url(''" + user_info.url + "'')"
    });
  })
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec page_MyProfile @UserAccountId, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('fa218e31-d226-48d8-a50b-af7b15ae079f', '7f91e837-1682-4b2f-a922-a474f9c557ea', NULL, 0, 'OrgStructure', ' Организационная структура', ' Организационная структура', 2, 0, 0, NULL, NULL, '<link href="/asyst/api/file/get/fe7b2baa-d243-423b-a9e0-a7e32c67b208/css_panels.css" rel="stylesheet"/>
<script type="text/javascript" src="/asyst/api/file/get/9210d71f-667a-4a8b-9f1c-3258577d27ed/primitives.min.js"></script>
<script type="text/javascript" src="/asyst/api/file/get/1f178420-b5ab-429d-a3fd-983389e8c530/jquery.orgchart.js"></script>
<style>.orgdiagram { outline: none !important; }</style>
<div id="OrgStructure" style="height:100%;"></div>
<script>
  $(function(){
    var id = ''OrgStructure'', newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    $(''#''+newid).orgchart({
      items: [
        <htmlrow>
        new primitives.orgdiagram.ItemConfig({
          id: {UserId},
          parent: {ParentUserId},
          title: "{FullName}",
          description: ''{Title}'',				  
          image: "{Photo}",
          templateName: "contactTemplate",
          itemTitleColor: "{Color}",
          termoverdue: {TermOverdue},
          termout: {TermOut},
          terminwork: {TermInWork},
          termdone: {TermDone},
          budgetoverdue: {BudgetOverdue},
          budgetinwork: {BudgetInWork},
          budgetdone: {BudgetDone},
          risklow: {RiskLow},
          riskmiddle: {RiskMiddle},
          riskhigh: {RiskHigh},
          score: {Score},
          maxscore: {MaxScore},
        }),    
  		</htmlrow>
      ]
    });
  });
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec db_MainPage_UserTree @UserLang, 1, 0', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('8f67cf35-c17e-4c3c-8d5e-c2335b31aa31', '7f91e837-1682-4b2f-a922-a474f9c557ea', NULL, 0, 'GoalTree', 'Дерево целей и показателей', 'Дерево целей и показателей', 1, 0, 0, NULL, NULL, '<link href="/asyst/api/file/get/98c7f1e0-1579-41a9-ba8b-854746c694b1/kpi.css" rel="stylesheet" type="text/css">
<script src="/asyst/api/file/get/f0436571-46ee-4099-b5fb-5567bae4891e/detect-element-resize.js" type="text/javascript"></script>
<div class="widget__content widget__content_scroll">
  <div id="p-kpi" class="p-kpi"></div>
</div>
<script src="/asyst/api/file/get/d6592714-e9fc-478a-b6c7-00587ef5e7a4/kpichart.js" type="text/javascript"></script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Библиотека виджетов прочих страниц ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '7be5a381 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Библиотека виджетов прочих страниц _LibraryMisc***/

GO
/****************************************************************
*      START MetaPage Библиотека документов DocLib
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Библиотека документов ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '327af50b-a6a4-408c-a914-3044931f23d2'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='327af50b-a6a4-408c-a914-3044931f23d2')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('327af50b-a6a4-408c-a914-3044931f23d2', 'DocLib', 'Библиотека документов', 'Библиотека документов', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'DocLib', [Title] = 'Библиотека документов', [Description] = 'Библиотека документов', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='327af50b-a6a4-408c-a914-3044931f23d2'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('a0c33703-35d3-41f4-8ed6-26e303f3b3a9', '327af50b-a6a4-408c-a914-3044931f23d2', NULL, 0, 'DocumentFileRegister', 'Реестр файлов', 'Реестр файлов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("DocumentFile", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Библиотека документов ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '7e6977a1 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Библиотека документов DocLib***/

GO
/****************************************************************
*      START MetaPage Библиотека реестров _LibraryRegister
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Библиотека реестров ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '7415c761-9336-4fd0-a7c0-699482bd38ae'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='7415c761-9336-4fd0-a7c0-699482bd38ae')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('7415c761-9336-4fd0-a7c0-699482bd38ae', '_LibraryRegister', 'Библиотека реестров', NULL, NULL, NULL, 0, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '_LibraryRegister', [Title] = 'Библиотека реестров', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='7415c761-9336-4fd0-a7c0-699482bd38ae'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('615d3dde-360e-4725-bdad-57c2a276f4fb', '7415c761-9336-4fd0-a7c0-699482bd38ae', NULL, 0, 'UserProfileRegister', 'Реестр всех моих карточек', 'Реестр всех моих карточек', 3, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<div id="Register" class="widget__register"></div>
<style>
  .widget__register { height: 100%; }
  .widget__register > div { height: 100%; }
  .widget__register > div > .container-fluid { height: 100%; display: flex; flex-direction: column; }
  .widget__register > div > .container-fluid > .row-fluid { flex: 1 1 auto; display: flex; }
</style>
<script>
  $(function(){
    var viewName = "UserProfileRegister",
        id = ''Register'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    showView(viewName, newid);
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('14157f10-4184-4dad-af20-b945548612db', '7415c761-9336-4fd0-a7c0-699482bd38ae', NULL, 0, 'ProjectRegister', 'Реестр проектов', 'Реестр проектов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<div id="Register" class="widget__register"></div>
<style>
  .widget__register { height: 100%; }
  .widget__register > div { height: 100%; }
  .widget__register > div > .container-fluid { height: 100%; display: flex; flex-direction: column; }
  .widget__register > div > .container-fluid > .row-fluid { flex: 1 1 auto; display: flex; }
</style>
<script>
  $(function(){
    var viewName = "Project",
        id = ''Register'', 
        newid = id + ''_'' + Date.now();
    $(''#''+id).attr(''id'', newid);
    showView(viewName, newid);
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Библиотека реестров ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'cb4f5b1b ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Библиотека реестров _LibraryRegister***/

GO
/****************************************************************
*      START MetaPage Вероятность риска  RiskProbability
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Вероятность риска  ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '8dca4206-4079-4ba9-b163-1bc7d015991e'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='8dca4206-4079-4ba9-b163-1bc7d015991e')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('8dca4206-4079-4ba9-b163-1bc7d015991e', 'RiskProbability', 'Вероятность риска ', 'Вероятность риска ', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'RiskProbability', [Title] = 'Вероятность риска ', [Description] = 'Вероятность риска ', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='8dca4206-4079-4ba9-b163-1bc7d015991e'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('5d9e0913-c1f0-468b-8ea0-e0b706dca930', '8dca4206-4079-4ba9-b163-1bc7d015991e', NULL, 0, 'RiskProbabilityRegister', 'Вероятность риска ', 'Вероятность риска ', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("RiskProbability", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Вероятность риска  ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'fd31d589 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Вероятность риска  RiskProbability***/

GO
/****************************************************************
*      START MetaPage Визуализация иерархии КТ KtChart
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Визуализация иерархии КТ ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '5b67ca3d-d10f-4939-8d9e-815a51ae275c'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='5b67ca3d-d10f-4939-8d9e-815a51ae275c')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('5b67ca3d-d10f-4939-8d9e-815a51ae275c', 'KtChart', 'Визуализация иерархии КТ', 'Визуализация иерархии контрольных точек', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'KtChart', [Title] = 'Визуализация иерархии КТ', [Description] = 'Визуализация иерархии контрольных точек', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='5b67ca3d-d10f-4939-8d9e-815a51ae275c'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('532bb706-f7cb-44d7-8bea-668321039626', '5b67ca3d-d10f-4939-8d9e-815a51ae275c', NULL, 0, 'ktChartView', 'Визуализация', 'Визуализация контейнер', 1, 0, 0, NULL, NULL, '<link href="/asyst/components/charts/ktChart/css/ktChart.css" rel="stylesheet"/>
<script>
  $(''.fs-view__middle-scroll'').css({ overflow: ''hidden'' });
  $(''#container'').attr(''id'', ''wrapper'');  
</script>
<script type="text/javascript" src="/asyst/components/charts/ktChart/js/jquery.dcjqaccordion.2.7.js"></script>
<script type="text/javascript" src="/asyst/components/charts/ktChart/js/sortable.js"></script>
<script type="text/javascript" src="/asyst/components/charts/ktChart/js/ktChart.js"></script>
<script type="text/javascript" src="/asyst/components/charts/ktChart/js/ktChart.model.js"></script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Визуализация иерархии КТ ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '5f7b284e ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Визуализация иерархии КТ KtChart***/

GO
/****************************************************************
*      START MetaPage Внешние организации Organization
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Внешние организации ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '36ca6205-2624-42d3-a6af-5b30988bc638'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='36ca6205-2624-42d3-a6af-5b30988bc638')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('36ca6205-2624-42d3-a6af-5b30988bc638', 'Organization', 'Внешние организации', 'Внешние организации', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Organization', [Title] = 'Внешние организации', [Description] = 'Внешние организации', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='36ca6205-2624-42d3-a6af-5b30988bc638'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('7b12e4a3-c093-4d44-b56c-d84d72597c63', '36ca6205-2624-42d3-a6af-5b30988bc638', NULL, 0, 'OrganizationRegister', 'Реестр внешних организаций', 'Реестр внешних организаций', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Organization", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Внешние организации ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'ff8c5ec4 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Внешние организации Organization***/

GO
/****************************************************************
*      START MetaPage Воздействие риска  RiskImpact
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Воздействие риска  ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '9e15bdc7-e987-47c5-8537-f60b99ba76d7'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='9e15bdc7-e987-47c5-8537-f60b99ba76d7')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('9e15bdc7-e987-47c5-8537-f60b99ba76d7', 'RiskImpact', 'Воздействие риска ', 'Воздействие риска ', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'RiskImpact', [Title] = 'Воздействие риска ', [Description] = 'Воздействие риска ', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='9e15bdc7-e987-47c5-8537-f60b99ba76d7'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('a2c7b91e-7ffc-475e-87f5-615cb538b8cc', '9e15bdc7-e987-47c5-8537-f60b99ba76d7', NULL, 0, 'RiskImpactRegister', 'Воздействие риска ', 'Воздействие риска ', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("RiskImpact", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Воздействие риска  ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'd789c82e ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Воздействие риска  RiskImpact***/

GO
/****************************************************************
*      START MetaPage Вопросы Question
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Вопросы ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '29c1a71b-43be-45f9-b03a-906f515aa3c6'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='29c1a71b-43be-45f9-b03a-906f515aa3c6')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('29c1a71b-43be-45f9-b03a-906f515aa3c6', 'Question', 'Вопросы', 'Вопросы', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Question', [Title] = 'Вопросы', [Description] = 'Вопросы', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='29c1a71b-43be-45f9-b03a-906f515aa3c6'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('1790ed16-2a33-4c0e-88ec-f11f39dd6c72', '29c1a71b-43be-45f9-b03a-906f515aa3c6', NULL, 0, 'QuestionRegister', 'Реестр вопросов', 'Реестр вопросов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Question", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Вопросы ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '8e7dd2d3 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Вопросы Question***/

GO
/****************************************************************
*      START MetaPage Главная Index
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Главная ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'e0ff710b-ec53-47f0-ab92-4d99bb4e85c1'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='e0ff710b-ec53-47f0-ab92-4d99bb4e85c1')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('e0ff710b-ec53-47f0-ab92-4d99bb4e85c1', 'Index', 'Главная', 'Главная страница', 1, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Index', [Title] = 'Главная', [Description] = 'Главная страница', [Position] = 1, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='e0ff710b-ec53-47f0-ab92-4d99bb4e85c1'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('29c708e4-8f36-45ce-85a2-1b9bcf90b6a8', 'e0ff710b-ec53-47f0-ab92-4d99bb4e85c1', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      libraries: [''_LibraryIndex'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Главная ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '604692e3 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Главная Index***/

GO
/****************************************************************
*      START MetaPage Группы Group
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Группы ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '3533d41f-e70d-4ea8-87e1-65c6c772742b'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='3533d41f-e70d-4ea8-87e1-65c6c772742b')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('3533d41f-e70d-4ea8-87e1-65c6c772742b', 'Group', 'Группы', 'Группы', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Group', [Title] = 'Группы', [Description] = 'Группы', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='3533d41f-e70d-4ea8-87e1-65c6c772742b'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('31104dae-eec7-4536-88c4-18e00d791b6d', '3533d41f-e70d-4ea8-87e1-65c6c772742b', NULL, 0, 'GroupRegister', 'Реестр групп', 'Реестр групп', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Group", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Группы ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'a25ccb80 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Группы Group***/

GO
/****************************************************************
*      START MetaPage Дерево целей и показателей GoalTree
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Дерево целей и показателей ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '78563a1e-9cae-484d-aa4d-729597186fee'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='78563a1e-9cae-484d-aa4d-729597186fee')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('78563a1e-9cae-484d-aa4d-729597186fee', 'GoalTree', 'Дерево целей и показателей', 'Дерево целей и показателей', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'GoalTree', [Title] = 'Дерево целей и показателей', [Description] = 'Дерево целей и показателей', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='78563a1e-9cae-484d-aa4d-729597186fee'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('4df1a313-2df4-447a-9865-aba58ae09738', '78563a1e-9cae-484d-aa4d-729597186fee', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      single: true,
      editable: false,
      libraries: [''_LibraryMisc'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Дерево целей и показателей ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '6259814 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Дерево целей и показателей GoalTree***/

GO
/****************************************************************
*      START MetaPage Запросы на изменение ChangeRequest
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Запросы на изменение ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '34d51725-0c71-4f59-b07f-029e46fe3d88'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='34d51725-0c71-4f59-b07f-029e46fe3d88')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('34d51725-0c71-4f59-b07f-029e46fe3d88', 'ChangeRequest', 'Запросы на изменение', 'Запросы на изменение', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'ChangeRequest', [Title] = 'Запросы на изменение', [Description] = 'Запросы на изменение', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='34d51725-0c71-4f59-b07f-029e46fe3d88'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('5e651787-68c1-459a-96ba-97d26b3c1b89', '34d51725-0c71-4f59-b07f-029e46fe3d88', NULL, 0, 'ChangeRequestRegister', 'Реестр запросов на изменение', 'Реестр запросов на изменение', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("ChangeRequest", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Запросы на изменение ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '612b0a52 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Запросы на изменение ChangeRequest***/

GO
/****************************************************************
*      START MetaPage Извлеченные уроки Lesson
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Извлеченные уроки ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'f70deb3b-45f8-4cbb-b91f-5ca225a77745'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='f70deb3b-45f8-4cbb-b91f-5ca225a77745')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('f70deb3b-45f8-4cbb-b91f-5ca225a77745', 'Lesson', 'Извлеченные уроки', 'Извлеченные уроки', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Lesson', [Title] = 'Извлеченные уроки', [Description] = 'Извлеченные уроки', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='f70deb3b-45f8-4cbb-b91f-5ca225a77745'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('7125f3cd-36a9-4cae-9d5e-280c137849cd', 'f70deb3b-45f8-4cbb-b91f-5ca225a77745', NULL, 0, 'LessonRegister', 'Реестр извлеченных уроков', 'Реестр курсов проектного управления', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Lesson", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Извлеченные уроки ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '4f5754b7 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Извлеченные уроки Lesson***/

GO
/****************************************************************
*      START MetaPage Итоговые выводы Summary
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Итоговые выводы ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'fd88112a-2e3b-4e05-a991-bd43e2c4e924'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='fd88112a-2e3b-4e05-a991-bd43e2c4e924')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('fd88112a-2e3b-4e05-a991-bd43e2c4e924', 'Summary', 'Итоговые выводы', 'Итоговые выводы', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Summary', [Title] = 'Итоговые выводы', [Description] = 'Итоговые выводы', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='fd88112a-2e3b-4e05-a991-bd43e2c4e924'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('ea7dcf0b-1b31-4441-b95a-97c960ce508b', 'fd88112a-2e3b-4e05-a991-bd43e2c4e924', NULL, 0, 'SummaryRegister', 'Реестр итоговых выводов', 'Реестр итоговых выводов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Summary", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Итоговые выводы ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '9960ec0f ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Итоговые выводы Summary***/

GO
/****************************************************************
*      START MetaPage Категория риска  RiskCategory
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Категория риска  ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'bb32771b-5a63-495f-8c6f-7734acb83663'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='bb32771b-5a63-495f-8c6f-7734acb83663')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('bb32771b-5a63-495f-8c6f-7734acb83663', 'RiskCategory', 'Категория риска ', 'Категория риска ', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'RiskCategory', [Title] = 'Категория риска ', [Description] = 'Категория риска ', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='bb32771b-5a63-495f-8c6f-7734acb83663'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('f406c0b4-d82f-4bd0-8b38-1683bbae1aee', 'bb32771b-5a63-495f-8c6f-7734acb83663', NULL, 0, 'RiskCategoryRegister', 'Категория риска ', 'Категория риска ', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("RiskCategory", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Категория риска  ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'fb09987f ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Категория риска  RiskCategory***/

GO
/****************************************************************
*      START MetaPage Контракты Contract
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Контракты ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '2412c9b9-8ec1-47e4-b4ad-8913882844c5'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='2412c9b9-8ec1-47e4-b4ad-8913882844c5')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('2412c9b9-8ec1-47e4-b4ad-8913882844c5', 'Contract', 'Контракты', NULL, NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Contract', [Title] = 'Контракты', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='2412c9b9-8ec1-47e4-b4ad-8913882844c5'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('43806564-fb0b-4945-84f0-5d4b530549d5', '2412c9b9-8ec1-47e4-b4ad-8913882844c5', NULL, 0, 'ContractRegister', 'Реестр контрактов', 'Реестр контрактов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Contract", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Контракты ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '1e47c2b4 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Контракты Contract***/

GO
/****************************************************************
*      START MetaPage Курсы проектного управления Course
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Курсы проектного управления ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'a1396284-3a9c-425c-a08e-41d198321672'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='a1396284-3a9c-425c-a08e-41d198321672')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('a1396284-3a9c-425c-a08e-41d198321672', 'Course', 'Курсы проектного управления', 'Курсы проектного управления', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Course', [Title] = 'Курсы проектного управления', [Description] = 'Курсы проектного управления', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='a1396284-3a9c-425c-a08e-41d198321672'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('d3300990-c00d-4317-ab6e-611c3562ae19', 'a1396284-3a9c-425c-a08e-41d198321672', NULL, 0, 'CourseRegister', 'Реестр курсов проектного управления', 'Реестр курсов проектного управления', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Course", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Курсы проектного управления ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'be1376d ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Курсы проектного управления Course***/

GO
/****************************************************************
*      START MetaPage Мастер.page !MainMaster
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Мастер.page ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '84259629-bce6-4c26-a66f-e5e1f30aa8f2'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='84259629-bce6-4c26-a66f-e5e1f30aa8f2')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('84259629-bce6-4c26-a66f-e5e1f30aa8f2', '!MainMaster', 'Мастер.page', NULL, NULL, NULL, 1, NULL, NULL)
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '!MainMaster', [Title] = 'Мастер.page', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 1, [PlaceholderName] = NULL, [MasterPageId] = NULL
WHERE [PageId]='84259629-bce6-4c26-a66f-e5e1f30aa8f2'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('924448af-acdc-4850-9512-0f6197b61f11', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'head-window-onerror', NULL, NULL, 11, 0, 0, NULL, NULL, '<script>
(function(_){if (typeof(_._errs)==="undefined"){
_._errs=[];var c=_.onerror;_.onerror=function(){
var a=arguments;_errs.push(a);c&&c.apply(this,a)
};}})(window);  
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 0, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('1525f8ce-1b25-4f12-9ecf-1b73f7ec45c5', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 10, 'head-css', NULL, NULL, 20, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, '43f5d5e7-64ff-4673-a644-e8d12d53ceb0', NULL)
,('151051fc-7ad3-4e73-81c4-2342dfaa736d', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'body-open', NULL, NULL, 90, 0, 0, NULL, NULL, '<body>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('bf5c4791-139b-4b94-b878-26cb4c8f4f48', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 10, 'head-js', NULL, NULL, 25, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, '03429ac5-7494-49c2-8644-9ed45a01971b', NULL)
,('1f5beade-8e99-47f2-bb84-2f1a5ddd3ed6', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'body-close', NULL, NULL, 9000, 0, 0, NULL, NULL, '<style>
  /*глобальный поиск*/
  #globalsearch-results { top:73px !important; width:500px !important; max-width:500px !important; }	
  @media (max-width: 767px) {
    #globalsearch-results {
      left: 0px !important;
      top: 50px !important;
      width: 100% !important;
      max-width: 100% !important;
      box-shadow: none !important;
      border-radius: 0px !important;
      -webkit-border-radius: 0px !important;
      border-bottom: solid 1px #e1e1e8 !important;
    }
    #globalsearch-results ul li {
      padding: 11px 15px;
    }
    #globalsearch-results ul li a {
      padding: 0px;
    }
    #globalsearch-results ul li a:hover, 
    #globalsearch-results ul li a:focus, 
    #globalsearch-results ul li.focus a {
      background: transparent !important;
      color: #209ed5 !important;
    }
    #globalsearch-results ul li a:hover h4, 
    #globalsearch-results ul li a:focus h4, 
    #globalsearch-results ul li.focus a h4, 
    #globalsearch-results ul li a:hover p, 
    #globalsearch-results ul li a:focus p, 
    #globalsearch-results ul li.focus a p {
      color: #209ed5;
    }    
  }
</style>
</body>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('8df37208-b358-4793-b3d0-32b55d252dff', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'html-open', NULL, NULL, 0, 0, 0, NULL, NULL, '<html>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('8d97b134-7b05-470e-81bd-50d65a5d2105', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'HEAD', 'Шапка', 'Шапка', 101, NULL, NULL, NULL, NULL, '<header class="header fixed-top clearfix">
  <!--logo start-->
  <div class="brand">
    <a class="logo svg mobile-collapse" href="/asyst/page/index"></a>
    <div class="sidebar-toggle-box">
      <div class="c-btn menu"></div>
      <a class="c-btn home mobile-view" href="/"></a>
    </div>
  </div>
  <!--logo end-->
  <div class="top-nav clearfix">
    <!--search & user info start-->
    <ul class="nav pull-right top-menu">
      <li style="display:none;"><div class="c-btn intro"></div></li>
      <li><div class="c-btn support"></div></li>
      <li>
        <form>
          <input id="globalSearchQuery" type="text" class="c-btn srch form-control">
          <script type="text/javascript">
            Asyst.globalSearch.input(''#globalSearchQuery'', ''entitysearch'');
          </script>
        </form>
      </li>
      <li class="dropdown">
        <a data-toggle="dropdown" class="c-btn dropdown-toggle" aria-expanded="false">
          <div class="c-btn profile" id="userphoto"></div>
          <span class="username mobile-collapse" id="usernameinfo"></span>
          <b class="caret mobile-collapse"></b>
        </a>
        <ul class="dropdown-menu extended logout">
          <li><a href="/asyst/page/profile">Профиль</a></li>
          <li><a href="#" onclick="Asyst.API.AdminTools.logout();">Выход</a></li>
        </ul>
      </li>
      <li>
        <div class="toggle-right-box c-btn menu" id="chat-btn"></div>
      </li>
    </ul>
    <!--search & user info end-->
  </div>
</header>

', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('d5eae227-bf56-45ae-8bc9-57b1025dce3e', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'head-close', NULL, NULL, 50, 0, 0, NULL, NULL, '</head>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('2851836f-3e20-49fe-961d-6534af78e4ec', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'LEFTMENU_data', 'Левое меню. Данные', 'Левое меню. Данные', 120, 0, 0, NULL, NULL, '<script>
  $(function() {
    var $nav_accordion = $(''#nav-accordion'');
    var data = [
      <htmlrow>
      {
        menulistid: "{MenuListId}",
        parentid: "{ParentId}",
        name: "{Name}",
        url: "{URL}",
        order: "{Order}",
      },
	  </htmlrow>
    ];
    data.forEach(function(item) {
      if (item.parentid == ''null'') {
        var haschild = false;
        data.forEach(function(e) { if (e.parentid == item.menulistid) { haschild = true; } });
		if (haschild) {
          var $menuitem = $(''<li class="sub-menu dcjq-parent-li" menulistid='' + item.menulistid + ''>'' +
                            ''  <a href="javascript:;" class="dcjq-parent">'' +
                            ''    <span>'' + item.name + ''</span>'' +
                            ''    <span class="dcjq-icon"></span>'' +
                            ''  </a>'' +
                            ''  <ul class="sub" style="display: none;">'' + 
                            ''  </ul>'' +
                            ''</li>'');
        } else {
          var $menuitem = $(''<li menulistid='' + item.menulistid + ''>'' +
                            ''  <a href="'' + item.url + ''">'' +
                            ''    <span>'' + item.name + ''</span>'' +
                            ''  </a>'' +
                            ''</li>'');
        }
        $nav_accordion.append($menuitem);
      } else {
        var $menuitem = $(''<li><a href="'' + item.url + ''">'' + item.name + ''</a></li>'');
        $nav_accordion.find(''li[menulistid="'' + item.parentid + ''"] ul.sub'').append($menuitem);
      }
    });
	/*--- left navigation accordion ---*/
	if ($.fn.dcAccordion) {
		$(''#nav-accordion'').dcAccordion({
		    eventType: ''click'',
		    autoClose: true,
		    saveState: true,
		    disableLink: true,
		    speed: ''300'',
		    showCount: false,
		    autoExpand: true,
		    classExpand: ''dcjq-current-parent''
		});
	}
	/*--- left navigation accordion ---*/
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec page_MyMenuList @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('90fd8161-1b0d-4b51-a3fe-95c2991659af', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'HEAD_enjoyhint', 'Шакпа. Инициализация тура', 'Шакпа. Подгрузка фотографии пользователя', 103, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/api/file/get/4aee4c03-35d6-4a93-994c-c919ecb2a0ad/foresighttour.css"/>
<script type="text/javascript" src="/asyst/api/file/get/dd275728-0a4c-4fde-972b-fc0f3132f080/foresighttour.js"></script>
<script>
  $(function(){
    createForesightTour(Asyst.Workspace.currentPage.pageName, 1);
  });
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('75c73294-0c75-4bb2-8afd-9c356f121595', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'HEAD_userphoto', 'Шакпа. Подгрузка фото', 'Шакпа. Подгрузка фотографии пользователя', 102, 0, 0, NULL, NULL, '<script>
  $(function() {
    $("#usernameinfo").text(Asyst.Workspace.currentUser.Name);
    $("#userphotoinfo").attr("alt", Asyst.Workspace.currentUser.Account);
    $("#userphotoinfo").attr("title", Asyst.Workspace.currentUser.Account);
    Asyst.API.Document.getFiles(
      {classname:''User'', id: Asyst.Workspace.currentUser.Id}, 
      true, 
      function(data){
        if (data.documents[0].files[0]) {
          $(''#userphoto'').css(''background-image'', "url(''" + data.documents[0].files[0].url + "'')");
          $(''#userphoto'').css(''background-size'', ''cover'');
          $(''#userphoto'').css(''background-color'', ''transparent'');
        }
      },
      null
    );
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('81514fc6-033f-4096-8cdb-a56255009c0b', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'html-close', NULL, NULL, 9999, 0, 0, NULL, NULL, '</html>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('178d4e4b-e0f7-4d9a-8f87-a5c77974e9fd', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'RIGHTBAR', 'Правое меню', NULL, 140, 0, 0, NULL, NULL, '<div id="chat" class="right-sidebar"></div>
<script type="text/javascript" src="/asyst/api/file/get/1404264f-ddc7-4ac5-956d-4732a469fc9a/js_jquery.splitter.js">
</script>
<script>
  $(function(){
    Asyst.board.make(''#chat'',''#chat-btn'');    
  });
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('08029da7-d73e-4a6e-a48a-ad3a0f08836d', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 10, 'head-meta', NULL, NULL, 15, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, 'a8c78445-2eaa-4934-ac70-6cfa778daa6b', NULL)
,('7fa355bd-8ffe-4cbd-9e6a-d5ba170a155a', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'HEAD_support', 'Шакпа. Техподдержка', 'Шакпа. Виджет техподдержки', 104, 0, 0, NULL, NULL, '<script>
  $(function(){
    $(''.c-btn.support'').click(function(){
      Dialogs.Support(
        ''Техподдержка'',
        ''Если у вас есть вопросы, позвоните нам по телефону <span class="link">+7 (959) 999 9999</span>,<br>напишите нам на электронную почту <a class="link" href="mailto:help@pmpractice.ru">help@pmpractice.ru</a>,<br><br>или воспользуйтесь формой ниже.'',
        true,
        true
      );
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('acb22dbb-5264-4008-af0d-e75bcebf1a91', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'LEFTMENU', 'Левое меню', 'Левое меню', 110, NULL, NULL, NULL, NULL, '<aside>
  <div id="sidebar" class="nav-collapse">
    <!-- sidebar menu start-->
    <div class="leftside-navigation" tabindex="5000" style="overflow: hidden; outline: none;">
      <ul class="sidebar-menu" id="nav-accordion">
      </ul>
    </div>
    <!-- sidebar menu end-->
  </div>
</aside>        ', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('6e4e02a0-e10e-440d-b9cb-e7e98c481074', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'head-open', NULL, NULL, 10, 0, 0, NULL, NULL, '<head>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('d68293c7-d923-4f0a-9162-f09e7f54e58b', '84259629-bce6-4c26-a66f-e5e1f30aa8f2', NULL, 0, 'body-placeholder', NULL, NULL, 150, 0, 0, NULL, NULL, '<asyst:Content ContentPlaceHolderId="MainBodyContent">
</asyst:Content>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Мастер.page ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'f6fce05a ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Мастер.page !MainMaster***/

GO
/****************************************************************
*      START MetaPage Мероприятия ослабления RiskMitigation
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Мероприятия ослабления ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '934384e3-cae8-4293-b9d0-8d8bc8e471c8'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='934384e3-cae8-4293-b9d0-8d8bc8e471c8')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('934384e3-cae8-4293-b9d0-8d8bc8e471c8', 'RiskMitigation', 'Мероприятия ослабления', 'Мероприятия ослабления', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'RiskMitigation', [Title] = 'Мероприятия ослабления', [Description] = 'Мероприятия ослабления', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='934384e3-cae8-4293-b9d0-8d8bc8e471c8'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('b98abbc1-4a77-46f4-b88d-89a1271803aa', '934384e3-cae8-4293-b9d0-8d8bc8e471c8', NULL, 0, 'RiskMitigationRegister', 'Мероприятия ослабления', 'Мероприятия ослабления', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("RiskMitigation", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Мероприятия ослабления ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'bb84ed9c ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Мероприятия ослабления RiskMitigation***/

GO
/****************************************************************
*      START MetaPage Мероприятия реагирования RiskResponding
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Мероприятия реагирования ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'ca875efa-1234-476f-a0f8-d6b1ccf792b4'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='ca875efa-1234-476f-a0f8-d6b1ccf792b4')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('ca875efa-1234-476f-a0f8-d6b1ccf792b4', 'RiskResponding', 'Мероприятия реагирования', 'Мероприятия реагирования', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'RiskResponding', [Title] = 'Мероприятия реагирования', [Description] = 'Мероприятия реагирования', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='ca875efa-1234-476f-a0f8-d6b1ccf792b4'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('019104c4-def3-443e-99b0-6a33cf021dc6', 'ca875efa-1234-476f-a0f8-d6b1ccf792b4', NULL, 0, 'RiskRespondingRegister', 'Мероприятия реагирования', 'Мероприятия реагирования', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("RiskResponding", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Мероприятия реагирования ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '640efbdc ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Мероприятия реагирования RiskResponding***/

GO
/****************************************************************
*      START MetaPage Организационная структура OrgStruct
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Организационная структура ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'e6ee0082-7e3e-497c-a7aa-c6ff9e8a4868'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='e6ee0082-7e3e-497c-a7aa-c6ff9e8a4868')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('e6ee0082-7e3e-497c-a7aa-c6ff9e8a4868', 'OrgStruct', 'Организационная структура', 'Организационная структура', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'OrgStruct', [Title] = 'Организационная структура', [Description] = 'Организационная структура', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='e6ee0082-7e3e-497c-a7aa-c6ff9e8a4868'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('e6fa7e22-8e69-4928-a0bf-93904663e77f', 'e6ee0082-7e3e-497c-a7aa-c6ff9e8a4868', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      single: true,
      editable: false,
      libraries: [''_LibraryMisc'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Организационная структура ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'ba48f810 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Организационная структура OrgStruct***/

GO
/****************************************************************
*      START MetaPage Открытые вопросы LOV
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Открытые вопросы ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'd10b7128-634b-46e5-bb28-988621a01b82'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='d10b7128-634b-46e5-bb28-988621a01b82')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('d10b7128-634b-46e5-bb28-988621a01b82', 'LOV', 'Открытые вопросы', NULL, NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'LOV', [Title] = 'Открытые вопросы', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='d10b7128-634b-46e5-bb28-988621a01b82'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('7e98bcc6-e210-46bd-84dc-5db667defb1c', 'd10b7128-634b-46e5-bb28-988621a01b82', NULL, 0, 'LovRegister', 'Реестр открытых вопросов', 'Реестр KPI', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("LOV", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Открытые вопросы ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '7a53ea7f ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Открытые вопросы LOV***/

GO
/****************************************************************
*      START MetaPage Панель базы знаний и документов DocPanel
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Панель базы знаний и документов ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'eb1d0c35-29e1-47f3-812c-24e36211d8f9'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='eb1d0c35-29e1-47f3-812c-24e36211d8f9')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('eb1d0c35-29e1-47f3-812c-24e36211d8f9', 'DocPanel', 'Панель базы знаний и документов', 'Панель базы знаний и документов', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'DocPanel', [Title] = 'Панель базы знаний и документов', [Description] = 'Панель базы знаний и документов', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='eb1d0c35-29e1-47f3-812c-24e36211d8f9'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('f841ef35-6a8b-412e-af6d-ff2b8fcea324', 'eb1d0c35-29e1-47f3-812c-24e36211d8f9', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      libraries: [''_LibraryDocPanel'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Панель базы знаний и документов ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'd99a9d31 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Панель базы знаний и документов DocPanel***/

GO
/****************************************************************
*      START MetaPage Подразделения OrgUnit
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Подразделения ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'afcdfec1-2f36-475d-b519-b2e4a51fee6b'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='afcdfec1-2f36-475d-b519-b2e4a51fee6b')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('afcdfec1-2f36-475d-b519-b2e4a51fee6b', 'OrgUnit', 'Подразделения', 'Подразделения', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'OrgUnit', [Title] = 'Подразделения', [Description] = 'Подразделения', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='afcdfec1-2f36-475d-b519-b2e4a51fee6b'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('1ba83d9c-9492-4135-97a6-8478d43d6f2d', 'afcdfec1-2f36-475d-b519-b2e4a51fee6b', NULL, 0, 'OrgUnitRegister', 'Реестр подразделений', 'Реестр подразделений', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("OrgUnit", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Подразделения ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '3a1e74eb ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Подразделения OrgUnit***/

GO
/****************************************************************
*      START MetaPage Подрядчики Contractor
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Подрядчики ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'b9ed2a94-3551-405e-8c97-312783f4953d'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='b9ed2a94-3551-405e-8c97-312783f4953d')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('b9ed2a94-3551-405e-8c97-312783f4953d', 'Contractor', 'Подрядчики', 'Подрядчики', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Contractor', [Title] = 'Подрядчики', [Description] = 'Подрядчики', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='b9ed2a94-3551-405e-8c97-312783f4953d'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('12473b4c-7c13-4095-bf7d-5ec1a113fbbb', 'b9ed2a94-3551-405e-8c97-312783f4953d', NULL, 0, 'ContractorRegister', 'Реестр подрядчиков', 'Реестр подрядчиков', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Contractor", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Подрядчики ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'c8a296a2 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Подрядчики Contractor***/

GO
/****************************************************************
*      START MetaPage Поиск по документам __DocSearch
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Поиск по документам ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'cda4aba2-da11-4441-849a-ed583c7f8202'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='cda4aba2-da11-4441-849a-ed583c7f8202')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('cda4aba2-da11-4441-849a-ed583c7f8202', '__DocSearch', 'Поиск по документам', 'Поиск по документам', NULL, NULL, 0, 'MainBodyContent', '84259629-bce6-4c26-a66f-e5e1f30aa8f2')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = '__DocSearch', [Title] = 'Поиск по документам', [Description] = 'Поиск по документам', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'MainBodyContent', [MasterPageId] = '84259629-bce6-4c26-a66f-e5e1f30aa8f2'
WHERE [PageId]='cda4aba2-da11-4441-849a-ed583c7f8202'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('05830a7d-10c3-4b39-a273-2e753a904d59', 'cda4aba2-da11-4441-849a-ed583c7f8202', NULL, 0, 'PageStart', 'Начало разметки', 'Начало разметки', 0, 0, 0, NULL, NULL, '<link href="/asyst/api/file/get/f80acff1-3c9b-449a-afb6-2bf9d1d74190/bootstrap.css" rel="stylesheet"/>
<link href="/asyst/api/file/get/f8c8d117-0c7f-4b81-8442-062bf6c6af0b/bootstrap-reset.css" rel="stylesheet"/>
<link href="/asyst/api/file/get/21a7fa3f-3d87-4a9d-87bc-f3ec2e53e557/css_style.css" rel="stylesheet"/>
<link href="/asyst/api/file/get/fe7b2baa-d243-423b-a9e0-a7e32c67b208/css_panels.css" rel="stylesheet">
<link href="/asyst/api/file/get/3a75b9d8-2a71-45b0-971a-5ddcf19009c0/search.css" rel="stylesheet"/>
<script type="text/javascript" src="/asyst/api/file/get/63bcae46-7ee0-4277-a109-a4c4f8e9c910/js_jquery.dcjqaccordion.2.7.js"></script>
<script type="text/javascript" src="/asyst/api/file/get/092596c4-e2c8-474c-8dde-974d7a655c15/js_jquery.nicescroll.js"></script>
<script type="text/javascript" src="/asyst/api/file/get/5066ad13-c224-42ed-98ce-21328512c0a5/js_jquery.cookie.js"></script>
<script type="text/javascript" src="/asyst/api/file/get/89f7a821-c107-4a8c-9d28-fc08c68390b3/js_scripts.js"></script>
<script type="text/javascript" src="/asyst/api/file/get/fe7074fa-f5a7-4a91-92fe-3afa06eac650/search.js"></script>
<script type="text/javascript" src="/asyst/api/file/get/7ae63b41-45c5-4453-9c23-3b661a80da35/filesize.js"></script>
<section id="container" class="">', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('06b0a61b-f6dc-4185-a186-60ff7c55a172', 'cda4aba2-da11-4441-849a-ed583c7f8202', NULL, 0, 'SearchCenter', 'Поиск документов', 'Поиск документов', 4, 0, 0, NULL, NULL, '<div id="search"></div>
<script>
  $(function() {
    var countPerPage = 7;
    if ($(document).width() < 768) { countPerPage = 10000; }
    $(''#search'').docs({
      countPerPage: countPerPage,
      data:[
        <htmlrow>
        { 
          "fileId":{FileId},
          "entityName":"{EntityName}",
          "dataId":"{DataId}",
          "name":"{Name}",
          "ext":"{Ext}",
          "creationDate":"{CreationDate}",
          "creationAuthorId":{CreationAuthorId},
          "userName":"{UserName}",
          "entityTitle":"{EntityTitle}",
          "fileLength":{FileLength},
          "dataName":''{dataName}'',
          "icon":"{Icon}",
          "url":"{Url}",
          "vers":"{Version}"
        },
        </htmlrow>
      ]});
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec dbo.MakeFileSearch @text, @UserLang, @UserAccount', NULL, NULL, NULL, 1, 0, 0, NULL, NULL)
,('2eba6fbf-3f6a-41fd-bc62-8ec61880074a', 'cda4aba2-da11-4441-849a-ed583c7f8202', NULL, 0, 'PageFinish', 'Конец разметки', 'Конец разметки', 9999, 0, 0, NULL, NULL, '</section>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('1dcdeff2-1f2a-4dd0-8beb-c074e2c33497', 'cda4aba2-da11-4441-849a-ed583c7f8202', NULL, 0, 'ContentStart', 'Контент начало', 'Контент начало', 3, 0, 0, NULL, NULL, '<section id="main-content" class="">
<section class="wrapper">', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)
,('9d50fc34-2e70-4afd-8b9f-f8ec91271a6d', 'cda4aba2-da11-4441-849a-ed583c7f8202', NULL, 0, 'ContentFinish', 'Контент конец', 'Контент конец', 9998, 0, 0, NULL, NULL, '</section>
</section>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Поиск по документам ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'b1b9d430 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Поиск по документам __DocSearch***/

GO
/****************************************************************
*      START MetaPage Пользователи User
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Пользователи ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '3239518d-a84e-49bc-b5ed-f5e20e75e368'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='3239518d-a84e-49bc-b5ed-f5e20e75e368')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('3239518d-a84e-49bc-b5ed-f5e20e75e368', 'User', 'Пользователи', 'Пользователи', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'User', [Title] = 'Пользователи', [Description] = 'Пользователи', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='3239518d-a84e-49bc-b5ed-f5e20e75e368'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('36f1024a-f285-482f-82db-22b3c7766494', '3239518d-a84e-49bc-b5ed-f5e20e75e368', NULL, 0, 'UserRegister', 'Реестр пользователей', 'Реестр пользователей', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("User", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Пользователи ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'f67168f6 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Пользователи User***/

GO
/****************************************************************
*      START MetaPage Портфели Portfolio
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Портфели ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '816c5eff-a63c-448d-9384-be5e905645a1'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='816c5eff-a63c-448d-9384-be5e905645a1')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('816c5eff-a63c-448d-9384-be5e905645a1', 'Portfolio', 'Портфели', 'Портфели', NULL, NULL, 0, 'Content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Portfolio', [Title] = 'Портфели', [Description] = 'Портфели', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'Content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='816c5eff-a63c-448d-9384-be5e905645a1'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('e9e8ba7a-8e5f-436f-b238-dd3f05048ffc', '816c5eff-a63c-448d-9384-be5e905645a1', NULL, 0, 'PortfolioRegister', 'Реестр портфелей', 'Реестр проектов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Portfolio", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Портфели ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '2a65e235 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Портфели Portfolio***/

GO
/****************************************************************
*      START MetaPage Приоритет проекта Priority
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Приоритет проекта ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '7cefea51-ddbc-4cc5-b8ba-0ff89323f7c1'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='7cefea51-ddbc-4cc5-b8ba-0ff89323f7c1')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('7cefea51-ddbc-4cc5-b8ba-0ff89323f7c1', 'Priority', 'Приоритет проекта', 'Приоритет проекта', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Priority', [Title] = 'Приоритет проекта', [Description] = 'Приоритет проекта', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='7cefea51-ddbc-4cc5-b8ba-0ff89323f7c1'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('4c3d0fe5-1ad9-4520-aacb-213a0d5bc179', '7cefea51-ddbc-4cc5-b8ba-0ff89323f7c1', NULL, 0, 'PriorityRegister', 'Приоритет проекта', 'Приоритет проекта', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Priority", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Приоритет проекта ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '807503df ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Приоритет проекта Priority***/

GO
/****************************************************************
*      START MetaPage Профиль Profile
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Профиль ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'dcc53678-43fd-42da-8ba8-466a564ed724'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='dcc53678-43fd-42da-8ba8-466a564ed724')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('dcc53678-43fd-42da-8ba8-466a564ed724', 'Profile', 'Профиль', 'Профиль', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Profile', [Title] = 'Профиль', [Description] = 'Профиль', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='dcc53678-43fd-42da-8ba8-466a564ed724'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('3ced74df-7ff9-4ffc-86b3-ea1d7ed5c657', 'dcc53678-43fd-42da-8ba8-466a564ed724', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      libraries: [''_LibraryMisc'', ''_LibraryRegister'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Профиль ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '5e7447c2 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Профиль Profile***/

GO
/****************************************************************
*      START MetaPage Распределения для риска RiskDistribution
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Распределения для риска ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '4ec5081a-7b65-4ea2-84ce-40a14250af9f'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='4ec5081a-7b65-4ea2-84ce-40a14250af9f')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('4ec5081a-7b65-4ea2-84ce-40a14250af9f', 'RiskDistribution', 'Распределения для риска', 'Распределения для риска', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'RiskDistribution', [Title] = 'Распределения для риска', [Description] = 'Распределения для риска', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='4ec5081a-7b65-4ea2-84ce-40a14250af9f'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('80f2ccd2-4527-495b-8496-edcf70e68696', '4ec5081a-7b65-4ea2-84ce-40a14250af9f', NULL, 0, 'RiskDistributionRegister', 'Распределения для риска', 'Распределения для риска', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("RiskDistribution", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Распределения для риска ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'd3e9475c ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Распределения для риска RiskDistribution***/

GO
/****************************************************************
*      START MetaPage Реестр госпрограмм и объектов госпрограмм GProgram
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр госпрограмм и объектов госпрограмм ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'f8863ecb-8b0b-45f5-9c5a-d056f723cc11'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='f8863ecb-8b0b-45f5-9c5a-d056f723cc11')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('f8863ecb-8b0b-45f5-9c5a-d056f723cc11', 'GProgram', 'Реестр госпрограмм и объектов госпрограмм', 'Реестр госпрограмм и объектов госпрограмм', NULL, NULL, 0, 'Content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'GProgram', [Title] = 'Реестр госпрограмм и объектов госпрограмм', [Description] = 'Реестр госпрограмм и объектов госпрограмм', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'Content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='f8863ecb-8b0b-45f5-9c5a-d056f723cc11'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('bee6824d-66e4-417d-9444-28301d97d289', 'f8863ecb-8b0b-45f5-9c5a-d056f723cc11', NULL, 0, 'register', 'Реестр', 'Реестр проектов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("GProgram", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр госпрограмм и объектов госпрограмм ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'b4f23cbe ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр госпрограмм и объектов госпрограмм GProgram***/

GO
/****************************************************************
*      START MetaPage Реестр замещений Substitution
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр замещений ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '472583f7-0f24-471e-a9b7-cc04c28e4810'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='472583f7-0f24-471e-a9b7-cc04c28e4810')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('472583f7-0f24-471e-a9b7-cc04c28e4810', 'Substitution', 'Реестр замещений', 'Реестр замещений', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Substitution', [Title] = 'Реестр замещений', [Description] = 'Реестр замещений', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='472583f7-0f24-471e-a9b7-cc04c28e4810'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('32145b96-d9ee-46d1-a342-99c4f6136d89', '472583f7-0f24-471e-a9b7-cc04c28e4810', NULL, 0, 'SubstitutionRegister', 'Реестр замещений', 'Реестр замещений', 1, NULL, NULL, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Substitution", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр замещений ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '43ea59fd ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр замещений Substitution***/

GO
/****************************************************************
*      START MetaPage Реестр КТ Point
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр КТ ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '92d3fd49-8ef1-4df7-a2fc-81d27207c22b'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='92d3fd49-8ef1-4df7-a2fc-81d27207c22b')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('92d3fd49-8ef1-4df7-a2fc-81d27207c22b', 'Point', 'Реестр КТ', 'Реестр КТ', 3, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Point', [Title] = 'Реестр КТ', [Description] = 'Реестр КТ', [Position] = 3, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='92d3fd49-8ef1-4df7-a2fc-81d27207c22b'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('efae3a32-f2ac-48ad-8a8c-fc586c1e3baf', '92d3fd49-8ef1-4df7-a2fc-81d27207c22b', NULL, 0, 'PointRegister', 'Реестр КТ', 'Реестр КТ', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Point", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр КТ ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'fdebf571 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр КТ Point***/

GO
/****************************************************************
*      START MetaPage Реестр НМД LegalDoc
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр НМД ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '85d23f77-67a8-42c3-b609-a94841c34f08'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='85d23f77-67a8-42c3-b609-a94841c34f08')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('85d23f77-67a8-42c3-b609-a94841c34f08', 'LegalDoc', 'Реестр НМД', 'Реестр НМД', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'LegalDoc', [Title] = 'Реестр НМД', [Description] = 'Реестр НМД', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='85d23f77-67a8-42c3-b609-a94841c34f08'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('b87b9582-aecc-41ae-aca7-d9090136fe5c', '85d23f77-67a8-42c3-b609-a94841c34f08', NULL, 0, 'LegalDocRegister', 'Реестр НМД', 'Реестр НМД', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("LegalDoc", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр НМД ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'c925be50 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр НМД LegalDoc***/

GO
/****************************************************************
*      START MetaPage Реестр обучения сотрудников CourseWork
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр обучения сотрудников ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '30fdd0bf-60d0-420b-9a54-a77c4947b154'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='30fdd0bf-60d0-420b-9a54-a77c4947b154')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('30fdd0bf-60d0-420b-9a54-a77c4947b154', 'CourseWork', 'Реестр обучения сотрудников', 'Реестр обучения сотрудников', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'CourseWork', [Title] = 'Реестр обучения сотрудников', [Description] = 'Реестр обучения сотрудников', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='30fdd0bf-60d0-420b-9a54-a77c4947b154'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('bd827a92-e1c2-4cea-9ff2-0d853418a74c', '30fdd0bf-60d0-420b-9a54-a77c4947b154', NULL, 0, 'CourseWorkRegister', 'Реестр обучения сотрудников', 'Реестр обучения сотрудников', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("CourseWork", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр обучения сотрудников ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '3ae57075 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр обучения сотрудников CourseWork***/

GO
/****************************************************************
*      START MetaPage Реестр показателей KPI
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр показателей ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '6c17553c-a19e-4107-8cee-8884624f1d99'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='6c17553c-a19e-4107-8cee-8884624f1d99')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('6c17553c-a19e-4107-8cee-8884624f1d99', 'KPI', 'Реестр показателей', 'Реестр показателей', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'KPI', [Title] = 'Реестр показателей', [Description] = 'Реестр показателей', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='6c17553c-a19e-4107-8cee-8884624f1d99'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('61fd6025-4400-49ed-a8d9-1966c9389c6a', '6c17553c-a19e-4107-8cee-8884624f1d99', NULL, 0, 'KPIRegister', 'Реестр показателей', 'Реестр KPI', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("KPI", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр показателей ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '70ea4706 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр показателей KPI***/

GO
/****************************************************************
*      START MetaPage Реестр поручений Order
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр поручений ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '4570c6cf-5992-45d2-830c-36d7cdf60eeb'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='4570c6cf-5992-45d2-830c-36d7cdf60eeb')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('4570c6cf-5992-45d2-830c-36d7cdf60eeb', 'Order', 'Реестр поручений', 'Реестр поручений', 5, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Order', [Title] = 'Реестр поручений', [Description] = 'Реестр поручений', [Position] = 5, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='4570c6cf-5992-45d2-830c-36d7cdf60eeb'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('1433eea5-4342-41b9-93cb-7b278aa13f3c', '4570c6cf-5992-45d2-830c-36d7cdf60eeb', NULL, 0, 'OrderRegister', 'Реестр поручений', 'Реестр поручений', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Order", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр поручений ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'f8f1fe45 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр поручений Order***/

GO
/****************************************************************
*      START MetaPage Реестр проектных инициатив Initiative
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр проектных инициатив ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'd349c71a-7418-4736-95b8-8df89793347b'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='d349c71a-7418-4736-95b8-8df89793347b')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('d349c71a-7418-4736-95b8-8df89793347b', 'Initiative', 'Реестр проектных инициатив', 'Реестр проектных инициатив', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Initiative', [Title] = 'Реестр проектных инициатив', [Description] = 'Реестр проектных инициатив', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='d349c71a-7418-4736-95b8-8df89793347b'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('077976af-fe20-478f-b818-9e923ad1ee68', 'd349c71a-7418-4736-95b8-8df89793347b', NULL, 0, 'InitiativeRegister', 'Реестр проектных инициатив', 'Реестр проектных инициатив', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Initiative", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр проектных инициатив ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '32e88790 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр проектных инициатив Initiative***/

GO
/****************************************************************
*      START MetaPage Реестр проектов Project2
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр проектов ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '85268722-aee7-4f04-aa19-6b4b7a987f2d'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='85268722-aee7-4f04-aa19-6b4b7a987f2d')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('85268722-aee7-4f04-aa19-6b4b7a987f2d', 'Project2', 'Реестр проектов', 'Реестр проектов', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Project2', [Title] = 'Реестр проектов', [Description] = 'Реестр проектов', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='85268722-aee7-4f04-aa19-6b4b7a987f2d'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('c87cbe41-ca22-4d95-884d-fc9277d57b3c', '85268722-aee7-4f04-aa19-6b4b7a987f2d', NULL, 0, 'dashboard_data', 'загрузка дашборда', NULL, 1, 0, 0, NULL, NULL, '<script>
  $(function(){
    var dashboard = Asyst.PageDashboard({ 
      containerid: ''container'',
      single: true,
      editable: false,
      libraries: [''_LibraryRegister'']
    });
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр проектов ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '712c0725 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр проектов Project2***/

GO
/****************************************************************
*      START MetaPage Реестр проектов Project
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр проектов ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '93a64ade-e24b-4fe8-91af-85bc98ed6a6d'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='93a64ade-e24b-4fe8-91af-85bc98ed6a6d')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('93a64ade-e24b-4fe8-91af-85bc98ed6a6d', 'Project', 'Реестр проектов', 'Реестр проектов', 2, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Project', [Title] = 'Реестр проектов', [Description] = 'Реестр проектов', [Position] = 2, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='93a64ade-e24b-4fe8-91af-85bc98ed6a6d'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('31ec99b3-12c2-48bc-a5a6-9bad1c188f98', '93a64ade-e24b-4fe8-91af-85bc98ed6a6d', NULL, 0, 'ProjectRegister', 'Реестр проектов', 'Реестр проектов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Project", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр проектов ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '5e27395c ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр проектов Project***/

GO
/****************************************************************
*      START MetaPage Реестр пунктов чек-листов Checklist
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр пунктов чек-листов ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '83ef2463-4984-46fe-a5c2-27e4cf4b228c'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='83ef2463-4984-46fe-a5c2-27e4cf4b228c')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('83ef2463-4984-46fe-a5c2-27e4cf4b228c', 'Checklist', 'Реестр пунктов чек-листов', 'Реестр пунктов чек-листов', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Checklist', [Title] = 'Реестр пунктов чек-листов', [Description] = 'Реестр пунктов чек-листов', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='83ef2463-4984-46fe-a5c2-27e4cf4b228c'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('3c4256cb-19ce-45e7-baed-d57a4070e997', '83ef2463-4984-46fe-a5c2-27e4cf4b228c', NULL, 0, 'ChecklistRegister', 'Реестр пунктов чек-листов', 'Реестр пунктов чек-листов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("MyPointCheckList", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр пунктов чек-листов ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '54d599f9 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр пунктов чек-листов Checklist***/

GO
/****************************************************************
*      START MetaPage Реестр совещаний Meeting
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр совещаний ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '004de3d5-5c3d-42de-b8af-aaec0da0bcc9'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='004de3d5-5c3d-42de-b8af-aaec0da0bcc9')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('004de3d5-5c3d-42de-b8af-aaec0da0bcc9', 'Meeting', 'Реестр совещаний', 'Реестр совещаний', 4, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Meeting', [Title] = 'Реестр совещаний', [Description] = 'Реестр совещаний', [Position] = 4, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='004de3d5-5c3d-42de-b8af-aaec0da0bcc9'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('06fcaedf-e312-489c-ae36-7ae3881d308f', '004de3d5-5c3d-42de-b8af-aaec0da0bcc9', NULL, 0, 'MeetingRegister', 'Реестр совещаний', 'Реестр совещаний', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Meeting", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр совещаний ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '972f1e23 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр совещаний Meeting***/

GO
/****************************************************************
*      START MetaPage Реестр целей Goal
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Реестр целей ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '11e94e27-80bc-412d-bdaa-ab2a5abf6344'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='11e94e27-80bc-412d-bdaa-ab2a5abf6344')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('11e94e27-80bc-412d-bdaa-ab2a5abf6344', 'Goal', 'Реестр целей', 'Реестр целей', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Goal', [Title] = 'Реестр целей', [Description] = 'Реестр целей', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='11e94e27-80bc-412d-bdaa-ab2a5abf6344'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('01c5766e-22ad-4f4d-a0aa-96e14247000b', '11e94e27-80bc-412d-bdaa-ab2a5abf6344', NULL, 0, 'GoalRegister', 'Реестр целей', 'Реестр целей', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Goal", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Реестр целей ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '2495151 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Реестр целей Goal***/

GO
/****************************************************************
*      START MetaPage Риски  Risk
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Риски  ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '2055cae0-030e-42fc-bcf1-5ccbd65fc0bf'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='2055cae0-030e-42fc-bcf1-5ccbd65fc0bf')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('2055cae0-030e-42fc-bcf1-5ccbd65fc0bf', 'Risk', 'Риски ', 'Риски ', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Risk', [Title] = 'Риски ', [Description] = 'Риски ', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='2055cae0-030e-42fc-bcf1-5ccbd65fc0bf'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('9bf3a926-72e9-4a32-92ed-516e25f6db62', '2055cae0-030e-42fc-bcf1-5ccbd65fc0bf', NULL, 0, 'RiskRegister', 'Реестр рисков', 'Реестр рисков', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("Risk", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Риски  ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'ee6aad1b ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Риски  Risk***/

GO
/****************************************************************
*      START MetaPage Сообщения Messages
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Сообщения ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '9c01ce98-8776-48e9-8733-802e1632aa06'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='9c01ce98-8776-48e9-8733-802e1632aa06')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('9c01ce98-8776-48e9-8733-802e1632aa06', 'Messages', 'Сообщения', 'Сообщения', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'Messages', [Title] = 'Сообщения', [Description] = 'Сообщения', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='9c01ce98-8776-48e9-8733-802e1632aa06'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('f4aaecbf-5793-4e04-ae31-9526a034e7b2', '9c01ce98-8776-48e9-8733-802e1632aa06', NULL, 0, 'MessagesRegister', 'Реестр сообщений', 'Реестр сообщений', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("MyCommentList", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Сообщения ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '4827a3f ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Сообщения Messages***/

GO
/****************************************************************
*      START MetaPage Состояние риска  RiskState
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Состояние риска  ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '8bcbdcd5-47bc-4a46-9f47-21839f24a297'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='8bcbdcd5-47bc-4a46-9f47-21839f24a297')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('8bcbdcd5-47bc-4a46-9f47-21839f24a297', 'RiskState', 'Состояние риска ', 'Состояние риска ', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'RiskState', [Title] = 'Состояние риска ', [Description] = 'Состояние риска ', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='8bcbdcd5-47bc-4a46-9f47-21839f24a297'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('1b3f8d25-7d70-4308-8799-aed10de6ab2c', '8bcbdcd5-47bc-4a46-9f47-21839f24a297', NULL, 0, 'RiskStateRegister', 'Состояние риска ', 'Состояние риска ', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("RiskState", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Состояние риска  ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '8744a802 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Состояние риска  RiskState***/

GO
/****************************************************************
*      START MetaPage Состояния поручений OrderStatus
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Состояния поручений ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '31ab6f88-1f1a-4e58-b561-fb2d4c60fc7f'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='31ab6f88-1f1a-4e58-b561-fb2d4c60fc7f')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('31ab6f88-1f1a-4e58-b561-fb2d4c60fc7f', 'OrderStatus', 'Состояния поручений', 'Состояния поручений', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'OrderStatus', [Title] = 'Состояния поручений', [Description] = 'Состояния поручений', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='31ab6f88-1f1a-4e58-b561-fb2d4c60fc7f'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('7e055c3e-dd2a-4cd6-8752-d8d68648b03f', '31ab6f88-1f1a-4e58-b561-fb2d4c60fc7f', NULL, 0, 'OrderStatusRegister', 'Реестр состояний поручения', 'Реестр состояний поручения', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("OrderStatus", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Состояния поручений ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'dc460a4a ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Состояния поручений OrderStatus***/

GO
/****************************************************************
*      START MetaPage Состояния поручений MeetingStatus
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Состояния поручений ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'a0e52a15-bbb0-40f3-9250-cbfc59048fb3'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='a0e52a15-bbb0-40f3-9250-cbfc59048fb3')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('a0e52a15-bbb0-40f3-9250-cbfc59048fb3', 'MeetingStatus', 'Состояния поручений', 'Состояния поручений', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'MeetingStatus', [Title] = 'Состояния поручений', [Description] = 'Состояния поручений', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='a0e52a15-bbb0-40f3-9250-cbfc59048fb3'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('e1648fb7-eaa2-4d03-b00c-6a32e94213ee', 'a0e52a15-bbb0-40f3-9250-cbfc59048fb3', NULL, 0, 'MeetingStatusRegister', 'Реестр состояний поручения', 'Реестр состояний поручения', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("MeetingStatus", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Состояния поручений ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '9dfe1c7e ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Состояния поручений MeetingStatus***/

GO
/****************************************************************
*      START MetaPage Статус-отчеты StatusReport
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Статус-отчеты ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '67f3cee3-f8af-44d8-9405-a916e582353c'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='67f3cee3-f8af-44d8-9405-a916e582353c')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('67f3cee3-f8af-44d8-9405-a916e582353c', 'StatusReport', 'Статус-отчеты', 'Статус-отчеты', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'StatusReport', [Title] = 'Статус-отчеты', [Description] = 'Статус-отчеты', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='67f3cee3-f8af-44d8-9405-a916e582353c'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('2d1d261e-c8a0-47e5-a7d0-12e837047327', '67f3cee3-f8af-44d8-9405-a916e582353c', NULL, 0, 'StatusReportRegister', 'Реестр статус-отчетов', 'Реестр статус-отчетов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("repReport", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Статус-отчеты ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'ffba2936 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Статус-отчеты StatusReport***/

GO
/****************************************************************
*      START MetaPage Тип проекта ProjectType
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Тип проекта ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'df1d05c0-f1f2-4660-965d-3fa5b1c292c8'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='df1d05c0-f1f2-4660-965d-3fa5b1c292c8')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('df1d05c0-f1f2-4660-965d-3fa5b1c292c8', 'ProjectType', 'Тип проекта', 'Тип проекта', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'ProjectType', [Title] = 'Тип проекта', [Description] = 'Тип проекта', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='df1d05c0-f1f2-4660-965d-3fa5b1c292c8'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('ab15f6c7-0659-4cb3-b148-a0b674b4fe57', 'df1d05c0-f1f2-4660-965d-3fa5b1c292c8', NULL, 0, 'ProjectTypeRegister', 'Реестр типов проектов', 'Реестр типов проектов', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("ProjectType", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Тип проекта ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '4e379a5b ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Тип проекта ProjectType***/

GO
/****************************************************************
*      START MetaPage Типы КТ PointType
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Типы КТ ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = 'e16e0e37-a4f8-462a-8831-564c3a659a4f'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='e16e0e37-a4f8-462a-8831-564c3a659a4f')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('e16e0e37-a4f8-462a-8831-564c3a659a4f', 'PointType', 'Типы КТ', 'Типы КТ', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'PointType', [Title] = 'Типы КТ', [Description] = 'Типы КТ', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='e16e0e37-a4f8-462a-8831-564c3a659a4f'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('79e0501f-7d10-4590-906f-92e18768bfa1', 'e16e0e37-a4f8-462a-8831-564c3a659a4f', NULL, 0, 'PointTypeRegister', 'Реестр типов КТ', 'Реестр типов КТ', 1, 0, 0, NULL, NULL, '<link rel="stylesheet" href="/asyst/css/asyst.third.min.css">
<link rel="stylesheet" href="/asyst/css/asyst.global.css">
<link rel="stylesheet" href="/asyst/components/charts/register/register.custom.css" type="text/css" media="all">
<script>
  $(function(){
    showView("PointType", "container");
  });
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Типы КТ ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'b031c7d1 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Типы КТ PointType***/

GO
/****************************************************************
*      START MetaPage Центр настроек SettingsCenter
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Центр настроек ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '38f22486-9ad3-4e16-ab6f-d23f9f771639'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='38f22486-9ad3-4e16-ab6f-d23f9f771639')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('38f22486-9ad3-4e16-ab6f-d23f9f771639', 'SettingsCenter', 'Центр настроек', 'Центр настроек', NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'SettingsCenter', [Title] = 'Центр настроек', [Description] = 'Центр настроек', [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='38f22486-9ad3-4e16-ab6f-d23f9f771639'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('59df07c0-faf1-418e-9c00-788238ff4f04', '38f22486-9ad3-4e16-ab6f-d23f9f771639', NULL, 0, 'Settings', 'Центр настроек', 'Центр настроек', 5, 0, 0, NULL, NULL, '<script>
  $(function(){
    var settings = [
      <htmlrow>
      { 
        name: "{Name}", 
        url: "{URL}", 
        category: "{EnumListCategoryName}",
        color: "{Color}"
      },
      </htmlrow>
    ];
    var settingsCenter = Asyst.SettingsDashboard({
      containerid: ''container'',
      settings: settings
    });  
  });
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec page_MySettingsList @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, NULL)
,('ce51e3b0-e028-412d-beb7-cbdbebf75949', '38f22486-9ad3-4e16-ab6f-d23f9f771639', NULL, 0, 'hemiIntro', 'Интро', NULL, 10000, 0, 0, NULL, NULL, '<!--
<link href="/asyst/api/file/get/65082824-e0c9-442c-bd20-c42b741db5bb/jquery.hemiIntro.css" rel="stylesheet"/>
<script src="/asyst/api/file/get/59eb268e-5885-49cb-8ca8-03d8891c50f9/jquery.hemiIntro.js" type="text/javascript"></script>
<script>
  var intro = $.hemiIntro({
    debug: false,
    steps: [
      {
        selector: ".step1",
        placement: "bottom",
        content: "Бизнес настройки",
        title: "Бизнес настройки",
        scrollToElement: true,
      }, 
      { 
        selector: ".step2",
        placement: "bottom",
        content: "Справочники системы",
        title: "Справочники системы",
        scrollToElement: true,
      }, 
      { 
        selector: ".step3",
        placement: "bottom",
        content: "Сущности системы",
        title: "Сущности системы",
        scrollToElement: true,
      },
      { 
        selector: ".step4",
        placement: "bottom",
        content: "Системные настройки",
        title: "Системные настройки",
        scrollToElement: true,
      },
      { 
        selector: ".step5",
        placement: "bottom",
        content: "Пользователи и разрешения",
        title: "Пользователи и разрешения",
        scrollToElement: true,
      },
      { 
        selector: ".step6",
        placement: "bottom",
        content: "Настройки галерей",
        title: "Настройки галерей",
        scrollToElement: true,
      },
      { 
        selector: ".step7",
        placement: "bottom",
        content: "Глобальные системные настройки",
        title: "Глобальные системные настройки",
        scrollToElement: true,
      },
      { 
        selector: ".step8",
        placement: "bottom",
        content: "Настройки интерфейсов",
        title: "Настройки интерфейсов",
        scrollToElement: true,
      },
    ],
    startFromStep: 0,
    backdrop: {
      element: $("<div>"),
      class: "hemi-intro-backdrop"
    },
    popover: {
      template: ''<div class="popover hemi-intro-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>''
    },
    buttons: {
      holder: {
        element: $("<div>"),
        class: "hemi-intro-buttons-holder"
      },
      next: {
        element: $("<button>Следующий шаг</button>"),
        class: "btn btn-primary"
      },
      finish: {
        element: $("<button>Конец</button>"),
        class: "btn btn-primary"
      }
    },
    welcomeDialog: {
      show: true,
      selector: "#myModal"
    },
    scroll: {
      anmationSpeed: 500
    },
    currentStep: {
      selectedClass: "hemi-intro-selected"
    },
    init: function (plugin) {
      console.log("init:");
    },
    onLoad: function (plugin) {
      console.log("onLoad:");
    },
    onStart: function (plugin) {
      console.log("onStart:");
    },
    onBeforeChangeStep: function () {
      console.log("onBeforeChangeStep:");
    },
    onAfterChangeStep: function () {
      console.log("onAfterChangeStep:");
    },
    onShowModalDialog: function (plugin, modal) {
      console.log("onShowModalDialog:");
    },
    onHideModalDialog: function (plugin, modal) {
      console.log("onHideModalDialog:");
    },
    onComplete: function (plugin) {
      console.log("onComplete:");
    }
  });
  //intro.start();
</script>
-->', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 0, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Центр настроек ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '9bd88e57 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Центр настроек SettingsCenter***/

GO
/****************************************************************
*      START MetaPage Центр отчетов ReportCenter
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
/***Update MetaPage Центр отчетов ***/
ALTER TABLE [MetaPageElementAccount] NOCHECK CONSTRAINT ALL
DELETE MetaPageElement WHERE PageId = '37b9f496-a867-40aa-b680-2fb73ccdd619'
IF NOT EXISTS (SELECT 1 FROM [dbo].[MetaPage] WHERE [PageId]='37b9f496-a867-40aa-b680-2fb73ccdd619')
INSERT INTO [MetaPage] ([PageId], [Name], [Title], [Description], [Position], [TitleFormula], [IsMaster], [PlaceholderName], [MasterPageId])
VALUES ('37b9f496-a867-40aa-b680-2fb73ccdd619', 'ReportCenter', 'Центр отчетов', NULL, NULL, NULL, 0, 'content', '21977fe6-51a4-4ed3-9bf4-9cb22478b77f')
ELSE
UPDATE [dbo].[MetaPage] SET [Name] = 'ReportCenter', [Title] = 'Центр отчетов', [Description] = NULL, [Position] = NULL, [TitleFormula] = NULL, [IsMaster] = 0, [PlaceholderName] = 'content', [MasterPageId] = '21977fe6-51a4-4ed3-9bf4-9cb22478b77f'
WHERE [PageId]='37b9f496-a867-40aa-b680-2fb73ccdd619'

INSERT INTO [dbo].[MetaPageElement] ([PageElementId], [PageId], [ParentId], [ElementType], [Name], [Title], [Description], [Position], [ContainerStyle], [InputType], [ViewId], [Tag], [Content], [IsAccessManaged], [Popover], [DataTypeName], [DataLength], [DataPrecision], [DataScale], [DataRefEntityId], [IsEditable], [IsNullable], [IsVisible], [DisplayWidth], [DisplayGroup], [DisplayMask], [PicklistSource], [PicklistQuery], [PicklistViewId], [PicklistValueField], [PicklistNameField], [IsTemplate], [IsShowHyperlink], [IsTypical], [TypicalElementId], [IsUserWidget])
VALUES
 ('c0b29f1c-aeeb-4cd8-bca8-6c0b60b166db', '37b9f496-a867-40aa-b680-2fb73ccdd619', NULL, 0, 'report_data', 'загрузка отчетов', NULL, 2, 0, 0, NULL, NULL, '<script>
  var reports = [
    <htmlrow>
    {
      reportingId: ''{ReportingId}'',
      name: ''{Name}'',
      title: ''{Title}'',
      tooltip: ''{Tooltip}'',
      url: ''{URL}'',
      previewUrl: ''{PreviewURL}'',
      order: {Order},
      reportingCategoryId: {ReportingCategoryId},
      reportingCategoryName: ''{ReportingCategoryName}'',
      color: ''{Color}'',
      repFavoriteId: {repFavoriteId}
    },
    </htmlrow>
  ];
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec page_MyReportList @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('ac9fd664-1756-4cb6-982d-a3c0034fc760', '37b9f496-a867-40aa-b680-2fb73ccdd619', NULL, 0, 'build_report_center', 'построение страницы', NULL, 3, 0, 0, NULL, NULL, '<script>
  var filter_data_loaded = false,
      report_data_loaded = false;
  $(function(){
    window.addEventListener(''filter_data.loaded'', filterLoaded);
    window.addEventListener(''report_data.loaded'', reportLoaded);
  });
  function filterLoaded(){
  	filter_data_loaded = true;
    if (filter_data_loaded && report_data_loaded) {
      buildReportCenter();
    }
  };
  function reportLoaded(){
  	report_data_loaded = true;
    if (filter_data_loaded && report_data_loaded) {
      buildReportCenter();
    }
  };
  function buildReportCenter(){
    $(''#container'').css({ height: ''100%'' });
    var reportCenter = Asyst.Reports({
      containerid: ''container'',
      filters: filters,
      reports: reports,
      favorite: true
    });
  };
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)
,('dcbe9672-666a-4847-bd76-d5ba1caff37d', '37b9f496-a867-40aa-b680-2fb73ccdd619', NULL, 0, 'filter_data', 'загрузка фильтров', NULL, 1, 0, 0, NULL, NULL, '<script>
  var filters = [
    <htmlrow>
    {
      reportingCategoryId: {ReportingCategoryId},
      reportingCategoryName: ''{ReportingCategoryName}'',
      color: ''{Color}''
    },
    </htmlrow>
  ];
</script>', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL, NULL, 0, 'exec page_MyReportListFilters @UserAccount, @UserLang', NULL, NULL, NULL, 1, 0, 0, NULL, 0)
,('f7da6c6b-7102-48bc-b7a3-f1ce811e714c', '37b9f496-a867-40aa-b680-2fb73ccdd619', NULL, 0, 'enjoyhint', 'Интро', NULL, 10000, 0, 0, NULL, NULL, '<script>
  $(function(){	
    $(''.intro'').parent().show();
	$(''.intro'').click(function(){ enjoyhint().run(); });
    enjoyhint().run();

    function enjoyhint(){
      var enjoyhint_instance = new EnjoyHint({});
      var enjoyhint_script_steps = [
        {
          ''next #ReportCenter .panel:eq(0)'' : ''<div class="caption">Отчет по всем проектам и контрольным точкам подразделения</div><div class="description">qwe</div>'',
          ''nextButton'' : {className: "myNext", text: "Дальше"},
          ''skipButton'' : {className: "mySkip", text: "Стоп"},
        },
        {
          ''next #ReportCenter .panel:eq(9) .info-right-img'' : ''Отчет по поручениям активностей'',
          ''nextButton'' : {className: "myNext", text: "Дальше"},
          ''skipButton'' : {className: "mySkip", text: "Стоп"},
          ''shape'': ''circle'',
        },
        {
          ''next #ReportCenter .panel:eq(2)'' : ''Исполнение проектов'',
          ''nextButton'' : {className: "myNext", text: "Дальше"},
          ''skipButton'' : {className: "mySkip", text: "Стоп"},
        },
        {
          ''skip #ReportCenter .panel:eq(3)'' : ''Исполнение контрольных точек и этапов'',
          ''skipButton'' : {className: "mySkip", text: "Конец"},
        },
      ];
      enjoyhint_instance.set(enjoyhint_script_steps);
      return enjoyhint_instance;
    }
  })
</script>
', 0, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 0, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0)

ALTER TABLE [MetaPageElementAccount] CHECK CONSTRAINT ALL
/***End MetaPage Центр отчетов ***/

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'ea2ed7fe ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Центр отчетов ReportCenter***/

GO
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
                                    DECLARE @errmes nvarchar(max) = 'f35fa921 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Главная***/

GO
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
                                    DECLARE @errmes nvarchar(max) = '458c999d ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Госпрограммы и объекты госпрограмм***/

GO
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
                                    DECLARE @errmes nvarchar(max) = '8c5789a8 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Контракты***/

GO
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
                                    DECLARE @errmes nvarchar(max) = '5f8735ba ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Открытые вопросы***/

GO
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
                                    DECLARE @errmes nvarchar(max) = '9ed36f2b ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Портфели***/

GO
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
                                    DECLARE @errmes nvarchar(max) = '97beff4 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Проектные инициативы***/

GO
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
                                    DECLARE @errmes nvarchar(max) = '2e7b65ab ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Проекты***/

GO
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
                                    DECLARE @errmes nvarchar(max) = '39e05a35 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Реестры***/

GO
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
                                    DECLARE @errmes nvarchar(max) = '5e19c93e ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MenuList Этапы / Работы / КТ***/

GO
/****************************************************************
*      START MetaDataSet DashboardWidgetContent
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
DELETE FROM [MetaDataSet]  WHERE [DataSetId]='5b85db5c-4a76-42ac-ba9d-bbfa7ff43b0d'
INSERT INTO [dbo].[MetaDataSet] ([DataSetId], [Name], [Title], [Description], [Query])
VALUES
 ('5b85db5c-4a76-42ac-ba9d-bbfa7ff43b0d', 'DashboardWidgetContent', 'Дашборд. Контент виджета', NULL, 'select mpe.Content
from dbo.MetaPageElement mpe
inner join dbo.MetaPage mp on mp.PageId = mpe.PageId
where mp.Name = @PageName AND mpe.Name = @ElementName')

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = 'a70d4d9f ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaDataSet DashboardWidgetContent***/

GO
/****************************************************************
*      START MetaDataSet UserDashboard
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
DELETE FROM [MetaDataSet]  WHERE [DataSetId]='704fd6a7-1127-4ec8-92f7-c5506a42ac4f'
INSERT INTO [dbo].[MetaDataSet] ([DataSetId], [Name], [Title], [Description], [Query])
VALUES
 ('704fd6a7-1127-4ec8-92f7-c5506a42ac4f', 'UserDashboard', 'Дашборд. Настройки', NULL, 'select UserDashboardId, AccountId, PageName, Items
from dbo.UserDashboard
where AccountId = @AccountId and PageName = @PageName')

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '6f69c8a5 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaDataSet UserDashboard***/

GO
/****************************************************************
*      START MetaDataSet WidgetLibrary
****************************************************************/
BEGIN TRANSACTION
BEGIN TRY
DELETE FROM [MetaDataSet]  WHERE [DataSetId]='7698abd5-e1c8-4427-b1c1-7cc2b8422dea'
INSERT INTO [dbo].[MetaDataSet] ([DataSetId], [Name], [Title], [Description], [Query])
VALUES
 ('7698abd5-e1c8-4427-b1c1-7cc2b8422dea', 'WidgetLibrary', 'Дашборд. Библиотека виджетов', NULL, 'SELECT 
	mp.pageId, 
	mp.name AS metaPageName, 
	mp.title AS metaPageTitle, 
	mpe.name AS metaPageElementName, 
	mpe.title as metaPageElementTitle
from dbo.MetaPageElement mpe
inner join dbo.MetaPage mp on mp.PageId = mpe.PageId
where mp.Name in (SELECT * FROM dbo.Split(@PageName, '',''))
order BY mp.title, mpe.position')

COMMIT
END TRY
BEGIN CATCH
                                    DECLARE @errmes nvarchar(max) = '171cdcc1 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaDataSet WidgetLibrary***/

GO
/****************************************************************
*      START renewDinamicNames
****************************************************************/
exec renewDinamicNames


GO
