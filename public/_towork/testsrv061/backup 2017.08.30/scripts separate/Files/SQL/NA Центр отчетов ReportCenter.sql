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
                                    DECLARE @errmes nvarchar(max) = '4119cee8 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Центр отчетов ReportCenter***/
