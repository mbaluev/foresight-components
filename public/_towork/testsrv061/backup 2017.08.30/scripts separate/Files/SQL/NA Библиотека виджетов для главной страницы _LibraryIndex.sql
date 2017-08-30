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
                                    DECLARE @errmes nvarchar(max) = '87dd4a9e ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Библиотека виджетов для главной страницы _LibraryIndex***/
