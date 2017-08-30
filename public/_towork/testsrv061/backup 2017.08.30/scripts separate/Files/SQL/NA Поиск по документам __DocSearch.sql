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
                                    DECLARE @errmes nvarchar(max) = '1440caac ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Поиск по документам __DocSearch***/
