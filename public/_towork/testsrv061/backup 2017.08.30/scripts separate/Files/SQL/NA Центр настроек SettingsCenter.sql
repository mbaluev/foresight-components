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
                                    DECLARE @errmes nvarchar(max) = '2d9e3b72 ' + ERROR_MESSAGE() + ' Строка ' + cast(ERROR_LINE() AS nvarchar)
	                               RAISERROR (@errmes,18,1)
	                               ROLLBACK TRANSACTION
                                    END CATCH
/***END MetaPage Центр настроек SettingsCenter***/
