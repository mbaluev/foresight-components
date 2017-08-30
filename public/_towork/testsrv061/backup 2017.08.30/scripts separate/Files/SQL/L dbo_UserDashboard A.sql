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
                                    DECLARE @errmes nvarchar(max) = '4448ec7f ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END UserDashboard dbo.UserDashboard A***/
