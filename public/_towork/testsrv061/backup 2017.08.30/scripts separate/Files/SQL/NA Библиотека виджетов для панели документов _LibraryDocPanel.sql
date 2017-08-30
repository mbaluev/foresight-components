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
                                    DECLARE @errmes nvarchar(max) = 'd1195376 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Библиотека виджетов для панели документов _LibraryDocPanel***/
