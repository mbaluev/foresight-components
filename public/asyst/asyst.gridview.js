if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.GridView = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: 'container',
        viewname: null,
        gridview: null,
        title: null,
        data: null,
        header: {
            views: [
                {
                    name: 'Мои проекты',
                    value: 'MyProjects',
                    selected: true,
                    onclick: function(){}
                },
                {
                    name: 'Все проекты',
                    value: 'AllProjects',
                    onclick: function(){}
                },
                {
                    name: 'Активные',
                    value: 'Active',
                    onclick: function(){}
                },
                {
                    name: 'Архивные',
                    value: 'Archive',
                    onclick: function(){}
                },
                {
                    name: 'Бюджеты проектов',
                    value: 'Budgets',
                    onclick: function(){}
                },
                {
                    name: 'Проекты без целей',
                    value: 'NoGoals',
                    onclick: function(){}
                }
            ],
            reload: {
                onclick: function(){ console.log('reload'); }
            },
            settings: [
                {
                    icon: 'icon_svg_plus',
                    name: 'Добавить',
                    onclick: function(){ console.log('add'); }
                },
                {
                    icon: 'icon_svg_trash',
                    name: 'Удалить',
                    onclick: function(){}
                },
                {
                    icon: 'icon_svg_expand',
                    name: 'Развернуть все группы',
                    onclick: function(){}
                },
                {
                    icon: 'icon_svg_collapse',
                    name: 'Свернуть все группы',
                    onclick: function(){}
                },
                {
                    icon: 'icon_svg_export',
                    name: 'Экспорт',
                    onclick: function(){}
                },
                {
                    icon: 'icon_svg_search',
                    name: 'Расширенный фильтр',
                    onclick: function(){}
                }
            ],
            search: {
                onkeyup: function(){ console.log('searching'); },
                onclear: function(){ console.log('clear'); }
            }
        }
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        loader: $('<span class="spinner"></span>')
    };
    that.loader_add = function(){
        $('.fs-view__main').each(function(i, item){
            if (('innerHTML' in item) && (i == $('.fs-view__main').length-1)){
                $(this).append(that.data._el.loader);
            }
        });
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.init_data = function(){};
    that.load_data = function(callback){
        var params = {
            ExpandGroup: false
        };
        Asyst.APIv2.View.load({
            viewName: that.data.viewname,
            data: params,
            success: function(data){
                if (typeof callback == 'function') { callback(data); }
            }
        });
    };
    that.render_data = function(){
        var container = that.data.gridview.data._el.container;
        var data = {
            "EntityId":"46caa4ad-02b8-4d70-a1db-196bab860742",
            "EntityName":"Project",
            "KeyName":"ProjectId",
            "EditFormName":null,
            "columns":[
                {
                    "id":"IndicatorId",
                    "name":" ",
                    "field":"IndicatorId",
                    "width":30,
                    "sortable":true,
                    "kind":"text",
                    "format":"",
                    "expression":"'<img class=\"s18 p2\" src=\"/asyst/gantt/img/svg/' + IndicatorId + '.svg\" alt=\"'+ IndicatorTitle + '\" title=\"' + IndicatorTitle +'\">'",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                },
                {
                    "id":"Code",
                    "name":"Код",
                    "field":"Code",
                    "width":80,
                    "sortable":true,
                    "kind":"text",
                    "format":"",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                },
                {
                    "id":"IndexParent",
                    "name":"Пункт комплексного плана",
                    "field":"IndexParent",
                    "width":50,
                    "sortable":true,
                    "kind":"text",
                    "format":"",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                },
                {
                    "id":"Name",
                    "name":"Название",
                    "field":"Name",
                    "width":250,
                    "sortable":true,
                    "kind":"text",
                    "format":"",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                },
                {
                    "id":"StartPlan",
                    "name":"Начало",
                    "field":"StartPlan",
                    "width":80,
                    "sortable":true,
                    "kind":"text",
                    "format":"dd.MM.yyyy",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                },
                {
                    "id":"FinishPlan",
                    "name":"Окончание",
                    "field":"FinishPlan",
                    "width":80,
                    "sortable":true,
                    "kind":"text",
                    "format":"dd.MM.yyyy",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                },
                {
                    "id":"ActivityPhaseName",
                    "name":"Стадия",
                    "field":"ActivityPhaseName",
                    "width":100,
                    "sortable":true,
                    "kind":"text",
                    "format":"",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                },
                {
                    "id":"ProjectLeader",
                    "name":"Руководитель",
                    "field":"ProjectLeader",
                    "width":150,
                    "sortable":true,
                    "kind":"text",
                    "format":"",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                },
                {
                    "id":"ProjectAdministrator",
                    "name":"Администратор",
                    "field":"ProjectAdministrator",
                    "width":150,
                    "sortable":true,
                    "kind":"text",
                    "format":"",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                },
                {
                    "id":"MyRole",
                    "name":"Моя роль",
                    "field":"MyRole",
                    "width":150,
                    "sortable":true,
                    "kind":"text",
                    "format":"",
                    "cssClass":"",
                    "editField":"",
                    "isNullable":true
                }
            ],
            "filters":[
                {
                    "order":1,
                    "title":" ",
                    "fieldName":"IndicatorId",
                    "width":30,
                    "kind":"text"
                },
                {
                    "order":3,
                    "title":"Код",
                    "fieldName":"Code",
                    "width":80,
                    "kind":"text"
                },
                {
                    "order":4,
                    "title":"Пункт комплексного плана",
                    "fieldName":"IndexParent",
                    "width":50,
                    "kind":"text"
                },
                {
                    "order":5,
                    "title":"Название",
                    "fieldName":"Name",
                    "width":250,
                    "kind":"text"
                },
                {
                    "order":6,
                    "title":"Начало",
                    "fieldName":"StartPlan",
                    "width":80,
                    "kind":"text"
                },
                {
                    "order":7,
                    "title":"Окончание",
                    "fieldName":"FinishPlan",
                    "width":80,
                    "kind":"text"
                },
                {
                    "order":8,
                    "title":"Стадия",
                    "fieldName":"ActivityPhaseName",
                    "width":100,
                    "kind":"text"
                },
                {
                    "order":9,
                    "title":"Руководитель",
                    "fieldName":"ProjectLeader",
                    "width":150,
                    "kind":"text"
                },
                {
                    "order":10,
                    "title":"Администратор",
                    "fieldName":"ProjectAdministrator",
                    "width":150,
                    "kind":"text"
                },
                {
                    "order":11,
                    "title":"Моя роль",
                    "fieldName":"MyRole",
                    "width":150,
                    "kind":"text"
                }
            ],
            "groups":[
                {
                    "name":"ParentActivity",
                    "expression":""
                }
            ],
            "data":[
                {
                    "id":1,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":156658,
                    "IndexParent":"3",
                    "Code":"500-215",
                    "Name":"Working Program of \"West Qurna II\" Project",
                    "ActivityPhaseId":4,
                    "ActivityPhaseName":"Реализация",
                    "ActivityPosition":3,
                    "StartPlan":"\/Date(1257033600000)\/",
                    "StartFact":"",
                    "StartForecast":"\/Date(1257033600000)\/",
                    "FinishPlan":"\/Date(1433116800000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1433116800000)\/",
                    "ParentCode":"900-001",
                    "ParentName":"Государственные услуги в социальной сфере ",
                    "ParentId":93092,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120566,
                    "OrgUnitName":"! Администрация главы региона",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":2,
                    "PriorityName":"Высокий",
                    "ProjectCustomer":"Алферов Павел Александрович",
                    "ProjectOwner":"Елсакова Р.В.",
                    "ProjectLeader":"Шмидт Александр",
                    "ProjectAdministrator":"Михеев Игорь",
                    "ParentActivity":"900-001. Государственные услуги в социальной сфере ",
                    "MyRole":"Команда",
                    "SummaryId":0
                },
                {
                    "id":2,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":168799,
                    "IndexParent":"",
                    "Code":"500-218",
                    "Name":"Повышение скорости работы сайта организации",
                    "ActivityPhaseId":40032,
                    "ActivityPhaseName":"Инициация",
                    "ActivityPosition":1,
                    "StartPlan":"\/Date(1461110400000)\/",
                    "StartFact":"",
                    "StartForecast":"\/Date(1472947200000)\/",
                    "FinishPlan":"\/Date(1472947200000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1472947200000)\/",
                    "ParentCode":"900-002",
                    "ParentName":"Энергетическая инфраструктура ТОР «Надеждинский»",
                    "ParentId":93093,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":"",
                    "OrgUnitName":"",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":2,
                    "PriorityName":"Высокий",
                    "ProjectCustomer":"",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Функциональный Администратор",
                    "ProjectAdministrator":"",
                    "ParentActivity":"900-002. Энергетическая инфраструктура ТОР «Надеждинский»",
                    "MyRole":"Куратор",
                    "SummaryId":0
                },
                {
                    "id":3,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":168825,
                    "IndexParent":"",
                    "Code":"500-220",
                    "Name":"респлан",
                    "ActivityPhaseId":40032,
                    "ActivityPhaseName":"Инициация",
                    "ActivityPosition":1,
                    "StartPlan":"\/Date(1456790400000)\/",
                    "StartFact":"",
                    "StartForecast":"\/Date(1456790400000)\/",
                    "FinishPlan":"\/Date(1496275200000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1496275200000)\/",
                    "ParentCode":"900-002",
                    "ParentName":"Энергетическая инфраструктура ТОР «Надеждинский»",
                    "ParentId":93093,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":"",
                    "OrgUnitName":"",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"",
                    "ProjectOwner":"Арестов Александр Филиппович",
                    "ProjectLeader":"Функциональный Администратор",
                    "ProjectAdministrator":"",
                    "ParentActivity":"900-002. Энергетическая инфраструктура ТОР «Надеждинский»",
                    "MyRole":"Руководитель",
                    "SummaryId":0
                },
                {
                    "id":4,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":169099,
                    "IndexParent":"",
                    "Code":"500-222",
                    "Name":"Календарный план, загруженный из mpp",
                    "ActivityPhaseId":40032,
                    "ActivityPhaseName":"Инициация",
                    "ActivityPosition":1,
                    "StartPlan":"",
                    "StartFact":"",
                    "StartForecast":"",
                    "FinishPlan":"",
                    "FinishFact":"",
                    "FinishForecast":"",
                    "ParentCode":"900-002",
                    "ParentName":"Энергетическая инфраструктура ТОР «Надеждинский»",
                    "ParentId":93093,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":"",
                    "OrgUnitName":"",
                    "ProjectTypeId":6,
                    "ProjectTypeName":"Другие проекты",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Системный Администратор",
                    "ProjectAdministrator":"",
                    "ParentActivity":"900-002. Энергетическая инфраструктура ТОР «Надеждинский»",
                    "MyRole":"Куратор",
                    "SummaryId":0
                },
                {
                    "id":5,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":169361,
                    "IndexParent":"",
                    "Code":"500-225",
                    "Name":"Проект без плана ",
                    "ActivityPhaseId":3,
                    "ActivityPhaseName":"Планирование",
                    "ActivityPosition":2,
                    "StartPlan":"\/Date(1468886400000)\/",
                    "StartFact":"",
                    "StartForecast":"\/Date(1468886400000)\/",
                    "FinishPlan":"",
                    "FinishFact":"",
                    "FinishForecast":"",
                    "ParentCode":"900-002",
                    "ParentName":"Энергетическая инфраструктура ТОР «Надеждинский»",
                    "ParentId":93093,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":"",
                    "OrgUnitName":"",
                    "ProjectTypeId":6,
                    "ProjectTypeName":"Другие проекты",
                    "PriorityId":2,
                    "PriorityName":"Высокий",
                    "ProjectCustomer":"",
                    "ProjectOwner":"Руководитель П.",
                    "ProjectLeader":"Функциональный Администратор",
                    "ProjectAdministrator":"",
                    "ParentActivity":"900-002. Энергетическая инфраструктура ТОР «Надеждинский»",
                    "MyRole":"Руководитель",
                    "SummaryId":0
                },
                {
                    "id":6,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":191257,
                    "IndexParent":"",
                    "Code":"500-226",
                    "Name":"Проект АВ",
                    "ActivityPhaseId":40032,
                    "ActivityPhaseName":"Инициация",
                    "ActivityPosition":1,
                    "StartPlan":"\/Date(1470268800000)\/",
                    "StartFact":"",
                    "StartForecast":"\/Date(1470268800000)\/",
                    "FinishPlan":"\/Date(1472601600000)\/",
                    "FinishFact":"\/Date(1477785600000)\/",
                    "FinishForecast":"\/Date(1472601600000)\/",
                    "ParentCode":"900-002",
                    "ParentName":"Энергетическая инфраструктура ТОР «Надеждинский»",
                    "ParentId":93093,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120145,
                    "OrgUnitName":"Министерство спорта и физической культуры",
                    "ProjectTypeId":5,
                    "ProjectTypeName":"Разработка документов",
                    "PriorityId":2,
                    "PriorityName":"Высокий",
                    "ProjectCustomer":"Функциональный Администратор",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Функциональный Администратор",
                    "ProjectAdministrator":"",
                    "ParentActivity":"900-002. Энергетическая инфраструктура ТОР «Надеждинский»",
                    "MyRole":"Функциональный заказчик",
                    "SummaryId":0
                },
                {
                    "id":7,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":201878,
                    "IndexParent":"1",
                    "Code":"500-249",
                    "Name":"Проект тест 06.12",
                    "ActivityPhaseId":40032,
                    "ActivityPhaseName":"Инициация",
                    "ActivityPosition":1,
                    "StartPlan":"\/Date(1480550400000)\/",
                    "StartFact":"",
                    "StartForecast":"\/Date(1480550400000)\/",
                    "FinishPlan":"\/Date(1480982400000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1480982400000)\/",
                    "ParentCode":"900-002",
                    "ParentName":"Энергетическая инфраструктура ТОР «Надеждинский»",
                    "ParentId":93093,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120145,
                    "OrgUnitName":"Министерство спорта и физической культуры",
                    "ProjectTypeId":1,
                    "ProjectTypeName":"Закупка",
                    "PriorityId":2,
                    "PriorityName":"Высокий",
                    "ProjectCustomer":"Системный Администратор",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Системный Администратор",
                    "ProjectAdministrator":"",
                    "ParentActivity":"900-002. Энергетическая инфраструктура ТОР «Надеждинский»",
                    "MyRole":"Куратор",
                    "SummaryId":0
                },
                {
                    "id":8,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":167714,
                    "IndexParent":"r5",
                    "Code":"500-216",
                    "Name":"Подготовка тестовых объектов",
                    "ActivityPhaseId":40034,
                    "ActivityPhaseName":"Закрытие",
                    "ActivityPosition":4,
                    "StartPlan":"\/Date(1456790400000)\/",
                    "StartFact":"\/Date(1501027200000)\/",
                    "StartForecast":"\/Date(1498089600000)\/",
                    "FinishPlan":"\/Date(1493510400000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1499558400000)\/",
                    "ParentCode":"900-003",
                    "ParentName":"Общегородские системы обеспечения предоставления государственных услуг",
                    "ParentId":93111,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120145,
                    "OrgUnitName":"Министерство спорта и физической культуры",
                    "ProjectTypeId":6,
                    "ProjectTypeName":"Другие проекты",
                    "PriorityId":2,
                    "PriorityName":"Высокий",
                    "ProjectCustomer":"Арестов Александр Филиппович",
                    "ProjectOwner":"Системный Администратор",
                    "ProjectLeader":"Функциональный Администратор",
                    "ProjectAdministrator":"Арестов Александр Филиппович",
                    "ParentActivity":"900-003. Общегородские системы обеспечения предоставления государственных услуг",
                    "MyRole":"Руководитель",
                    "SummaryId":0
                },
                {
                    "id":9,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":93635,
                    "IndexParent":"",
                    "Code":"500-084",
                    "Name":"Повышение доступности услуг скорой и неотложной медицинской помощи",
                    "ActivityPhaseId":6,
                    "ActivityPhaseName":"Постпроект",
                    "ActivityPosition":5,
                    "StartPlan":"\/Date(1443830400000)\/",
                    "StartFact":"\/Date(1443830400000)\/",
                    "StartForecast":"\/Date(1443830400000)\/",
                    "FinishPlan":"\/Date(1483660800000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1483660800000)\/",
                    "ParentCode":"900-005",
                    "ParentName":"Государственные услуги в социальной сфере",
                    "ParentId":93114,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120169,
                    "OrgUnitName":"Министерство внутренних дел",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"Жданов Алексей Анатольевич",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Руководитель П.",
                    "ProjectAdministrator":"Потапов Александр Викторович",
                    "ParentActivity":"900-005. Государственные услуги в социальной сфере",
                    "MyRole":"Куратор",
                    "SummaryId":0
                },
                {
                    "id":10,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":93686,
                    "IndexParent":"",
                    "Code":"500-135",
                    "Name":"АИС обеспечения деятельности(и производства) опорных пунктов охраны общественного порядка в городе Москве",
                    "ActivityPhaseId":4,
                    "ActivityPhaseName":"Реализация",
                    "ActivityPosition":3,
                    "StartPlan":"\/Date(1430611200000)\/",
                    "StartFact":"",
                    "StartForecast":"\/Date(1430611200000)\/",
                    "FinishPlan":"\/Date(1457049600000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1457222400000)\/",
                    "ParentCode":"900-005",
                    "ParentName":"Государственные услуги в социальной сфере",
                    "ParentId":93114,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120148,
                    "OrgUnitName":"Министерство целевых программ",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":2,
                    "PriorityName":"Высокий",
                    "ProjectCustomer":"Антипов Александр Васильевич",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Руководитель П.",
                    "ProjectAdministrator":"Иващенко Алексей Борисович",
                    "ParentActivity":"900-005. Государственные услуги в социальной сфере",
                    "MyRole":"Куратор",
                    "SummaryId":0
                },
                {
                    "id":11,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":168832,
                    "IndexParent":"",
                    "Code":"500-221",
                    "Name":"Проект",
                    "ActivityPhaseId":40032,
                    "ActivityPhaseName":"Инициация",
                    "ActivityPosition":1,
                    "StartPlan":"\/Date(1481500800000)\/",
                    "StartFact":"",
                    "StartForecast":"\/Date(1481500800000)\/",
                    "FinishPlan":"\/Date(1533081600000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1533081600000)\/",
                    "ParentCode":"900-005",
                    "ParentName":"Государственные услуги в социальной сфере",
                    "ParentId":93114,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120566,
                    "OrgUnitName":"! Администрация главы региона",
                    "ProjectTypeId":6,
                    "ProjectTypeName":"Другие проекты",
                    "PriorityId":2,
                    "PriorityName":"Высокий",
                    "ProjectCustomer":"Функциональный Администратор",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Функциональный Администратор",
                    "ProjectAdministrator":"",
                    "ParentActivity":"900-005. Государственные услуги в социальной сфере",
                    "MyRole":"Функциональный заказчик",
                    "SummaryId":0
                },
                {
                    "id":12,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":93633,
                    "IndexParent":"1.4",
                    "Code":"500-082",
                    "Name":"Перевод государственной услуги \"Лицензирование розничной продажи алкогольной продукции\" в электронный вид",
                    "ActivityPhaseId":40034,
                    "ActivityPhaseName":"Закрытие",
                    "ActivityPosition":4,
                    "StartPlan":"\/Date(1454803200000)\/",
                    "StartFact":"\/Date(1426464000000)\/",
                    "StartForecast":"\/Date(1442620800000)\/",
                    "FinishPlan":"\/Date(1638662400000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1442620800000)\/",
                    "ParentCode":"900-006",
                    "ParentName":"Государственные услуги в сфере имущественных отношений, землепользования и градостроительства",
                    "ParentId":93115,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120167,
                    "OrgUnitName":"Министерство строительства и архитектуры",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"Семенчишин Александр Николаевич",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Руководитель П.",
                    "ProjectAdministrator":"Антипов Александр Васильевич",
                    "ParentActivity":"900-006. Государственные услуги в сфере имущественных отношений, землепользования и градостроительства",
                    "MyRole":"Куратор",
                    "SummaryId":8
                },
                {
                    "id":13,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":93605,
                    "IndexParent":"",
                    "Code":"500-054",
                    "Name":"Обеспечение выпуска УЭК в 2017 году",
                    "ActivityPhaseId":40034,
                    "ActivityPhaseName":"Закрытие",
                    "ActivityPosition":4,
                    "StartPlan":"\/Date(1470268800000)\/",
                    "StartFact":"\/Date(1429488000000)\/",
                    "StartForecast":"\/Date(1470268800000)\/",
                    "FinishPlan":"\/Date(1500249600000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1500249600000)\/",
                    "ParentCode":"900-008",
                    "ParentName":"Универсальная электронная карта (УЭК)",
                    "ParentId":93117,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120177,
                    "OrgUnitName":"Министерство сельского хозяйства и продовольствия",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"Новак Александр Валентинович",
                    "ProjectOwner":"Суринов Александр Евгеньевич",
                    "ProjectLeader":"Новак Александр Валентинович",
                    "ProjectAdministrator":"Мартынов Аким Александрович",
                    "ParentActivity":"900-008. Универсальная электронная карта (УЭК)",
                    "MyRole":"Зам.руководителя",
                    "SummaryId":0
                },
                {
                    "id":14,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":214274,
                    "IndexParent":"",
                    "Code":"500-327",
                    "Name":"Формирование типового календарного плана",
                    "ActivityPhaseId":40032,
                    "ActivityPhaseName":"Инициация",
                    "ActivityPosition":1,
                    "StartPlan":"\/Date(1493596800000)\/",
                    "StartFact":"\/Date(1493596800000)\/",
                    "StartForecast":"\/Date(1493596800000)\/",
                    "FinishPlan":"\/Date(1535760000000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1535760000000)\/",
                    "ParentCode":"900-008",
                    "ParentName":"Универсальная электронная карта (УЭК)",
                    "ParentId":93117,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120148,
                    "OrgUnitName":"Министерство целевых программ",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"",
                    "ProjectOwner":"kurator1",
                    "ProjectLeader":"Функциональный Администратор",
                    "ProjectAdministrator":"",
                    "ParentActivity":"900-008. Универсальная электронная карта (УЭК)",
                    "MyRole":"Руководитель",
                    "SummaryId":0
                },
                {
                    "id":15,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":93587,
                    "IndexParent":"1.3",
                    "Code":"500-036",
                    "Name":"Обеспечение пунктов приема заявлений на универсальные электронные карты (УЭК) и пунктов выдачи УЭК необходимым оборудованием",
                    "ActivityPhaseId":4,
                    "ActivityPhaseName":"Реализация",
                    "ActivityPosition":3,
                    "StartPlan":"\/Date(1508716800000)\/",
                    "StartFact":"\/Date(1473724800000)\/",
                    "StartForecast":"\/Date(1513123200000)\/",
                    "FinishPlan":"\/Date(1568246400000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1554681600000)\/",
                    "ParentCode":"900-020",
                    "ParentName":"СМИ, межрегиональное сотрудничество, спорт и туризм, реклама",
                    "ParentId":93129,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120566,
                    "OrgUnitName":"! Администрация главы региона",
                    "ProjectTypeId":6,
                    "ProjectTypeName":"Другие проекты",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"Функциональный Администратор",
                    "ProjectOwner":"Полевов Александр Сергеевич",
                    "ProjectLeader":"Функциональный Администратор",
                    "ProjectAdministrator":"Руководитель П.",
                    "ParentActivity":"900-020. СМИ, межрегиональное сотрудничество, спорт и туризм, реклама",
                    "MyRole":"Функциональный заказчик",
                    "SummaryId":0
                },
                {
                    "id":16,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":93561,
                    "IndexParent":"1.1",
                    "Code":"500-010",
                    "Name":"Автоматизация деятельности Департамента торговли и услуг",
                    "ActivityPhaseId":4,
                    "ActivityPhaseName":"Реализация",
                    "ActivityPosition":3,
                    "StartPlan":"\/Date(1421625600000)\/",
                    "StartFact":"\/Date(1448409600000)\/",
                    "StartForecast":"\/Date(1421625600000)\/",
                    "FinishPlan":"\/Date(1518307200000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1518307200000)\/",
                    "ParentCode":"900-028",
                    "ParentName":"Административно-хозяйственное обеспечение",
                    "ParentId":93137,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120167,
                    "OrgUnitName":"Министерство строительства и архитектуры",
                    "ProjectTypeId":4,
                    "ProjectTypeName":"Подготовка КСР",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"Руководитель П.",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Функциональный Администратор",
                    "ProjectAdministrator":"Руководитель П.",
                    "ParentActivity":"900-028. Административно-хозяйственное обеспечение",
                    "MyRole":"Куратор",
                    "SummaryId":0
                },
                {
                    "id":17,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":93659,
                    "IndexParent":"",
                    "Code":"500-108",
                    "Name":"Автоматизация  деятельности Департамента природопользования и охраны окружающей среды  и подведомственных организаций",
                    "ActivityPhaseId":4,
                    "ActivityPhaseName":"Реализация",
                    "ActivityPosition":3,
                    "StartPlan":"\/Date(1431907200000)\/",
                    "StartFact":"\/Date(1431907200000)\/",
                    "StartForecast":"\/Date(1431907200000)\/",
                    "FinishPlan":"\/Date(1452988800000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1476403200000)\/",
                    "ParentCode":"900-028",
                    "ParentName":"Административно-хозяйственное обеспечение",
                    "ParentId":93137,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120174,
                    "OrgUnitName":"Министерство печати и информации",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"Смирнов Александр Александрович",
                    "ProjectOwner":"Смирнов Александр Александрович",
                    "ProjectLeader":"Смирнов Александр Александрович",
                    "ProjectAdministrator":"Функциональный Администратор",
                    "ParentActivity":"900-028. Административно-хозяйственное обеспечение",
                    "MyRole":"Администратор",
                    "SummaryId":0
                },
                {
                    "id":18,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":93621,
                    "IndexParent":"",
                    "Code":"500-070",
                    "Name":"Автоматизация деятельности Департамента капитального ремонта жилищного фонда",
                    "ActivityPhaseId":40034,
                    "ActivityPhaseName":"Закрытие",
                    "ActivityPosition":4,
                    "StartPlan":"\/Date(1429142400000)\/",
                    "StartFact":"\/Date(1453766400000)\/",
                    "StartForecast":"\/Date(1429142400000)\/",
                    "FinishPlan":"\/Date(1456876800000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1456876800000)\/",
                    "ParentCode":"900-029",
                    "ParentName":"Эксплуатация информационных систем и ресурсов",
                    "ParentId":93138,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120174,
                    "OrgUnitName":"Министерство печати и информации",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":1,
                    "PriorityName":"Обычный",
                    "ProjectCustomer":"Функциональный Администратор",
                    "ProjectOwner":"Виланд Анастасия Владимировна",
                    "ProjectLeader":"Руководитель П.",
                    "ProjectAdministrator":"Хуторцев Александер Сергеевич",
                    "ParentActivity":"900-029. Эксплуатация информационных систем и ресурсов",
                    "MyRole":"Функциональный заказчик",
                    "SummaryId":0
                },
                {
                    "id":19,
                    "IndicatorTitle":"Просрочено",
                    "IndicatorId":"3",
                    "IndicatorColor":"#ff6666",
                    "IndicatorOrder":1,
                    "ProjectId":93670,
                    "IndexParent":"",
                    "Code":"500-119",
                    "Name":"Автоматизация деятельности Департамента науки и промышленной политики",
                    "ActivityPhaseId":4,
                    "ActivityPhaseName":"Реализация",
                    "ActivityPosition":3,
                    "StartPlan":"\/Date(1432771200000)\/",
                    "StartFact":"\/Date(1432771200000)\/",
                    "StartForecast":"\/Date(1450310400000)\/",
                    "FinishPlan":"\/Date(1464739200000)\/",
                    "FinishFact":"",
                    "FinishForecast":"\/Date(1443484800000)\/",
                    "ParentCode":"900-029",
                    "ParentName":"Эксплуатация информационных систем и ресурсов",
                    "ParentId":93138,
                    "ParentEntityName":"Portfolio",
                    "ParentEntityTitle":"Портфель",
                    "OrgUnitId":120166,
                    "OrgUnitName":"Министерство социальной защиты населения",
                    "ProjectTypeId":2,
                    "ProjectTypeName":"Капитальное строительство",
                    "PriorityId":2,
                    "PriorityName":"Высокий",
                    "ProjectCustomer":"Мазулин Александр Николаевич",
                    "ProjectOwner":"Функциональный Администратор",
                    "ProjectLeader":"Руководитель П.",
                    "ProjectAdministrator":"Доценко Алексей Викторович",
                    "ParentActivity":"900-029. Эксплуатация информационных систем и ресурсов",
                    "MyRole":"Куратор",
                    "SummaryId":0
                }
            ]
        };
        var viewName = 'MyProjects';
        var params = {
            ExpandGroup: false
        };
        load(container, that.data.data);
        function load(container, data){

            var filterArgs = filterDataByGET(data, data.columns);
            if ((filterArgs === undefined || filterArgs === null) && data.viewSample && data.viewSample.hasOwnProperty('filterArgs')) {
                filterArgs = data.viewSample.filterArgs;
                restoreDatesInFilterArgs(filterArgs, data.columns);
            }

            for (var colIdx in data.columns) {
                var column = data.columns[colIdx];
                if (column.formatter)
                    column.formatter = eval(column.formatter);
                else if (column.url)
                    column.formatter = Grid.LinkFormatter;
                else
                    column.formatter = Grid.DefaultFormatter;
            }

            var viewEl = container;
            viewEl[0].innerHtml = "";

            if (viewEl.height() === 0) {
                try {
                    var resizeContainer = function() {
                        var hasScroll = false;
                        var widthScroll = 0;
                        for (var el = viewEl; !hasScroll && el.length > 0; el = el.parent()) {
                            var sw = el[0].scrollWidth, ow = el[0].offsetWidth;
                            if (sw != ow) {
                                hasScroll = true;
                                widthScroll = el[0].offsetHeight - el[0].clientHeight;
                            }
                        }
                        viewEl.height($(window).height() - viewEl.offset().top - 3 - widthScroll);
                        if (grid) grid.resizeCanvas();
                    };
                    $(window).resize(resizeContainer);
                    $(window).resize();
                } catch (error) {
                }
            }

            var options = {
                enableCellNavigation: true,
                editable: false,
                autoHeight: false,
                doClick: true,
                wideString: Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isWideString,
                initiallyCollapsed: Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isInitiallyCollapsed,
                rowSelectionModel: new Asyst.RowSelectionModel()
            };

            //todo replace
            if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].hasOwnProperty('preprocessFunction'))
                Asyst.Workspace.views[viewName].preprocessFunction(viewEl, data.data, data.columns, options, data.groups);

            if (data.EditFormName) {
                viewEl.css("overflow", "hidden");
                var EditableGrid = Asyst.Models.EditableView.EditableGrid;
                view = EditableGrid.create(viewEl, data.data, data.columns, data.EditFormName, data.KeyName, data.EntityName);
            } else {
                view = Grid.Create(viewEl, data.data, data.columns, options, data.groups, params, data.filters, data.viewSample);

                var grid = view.Grid;
                var dataView = view.DataView;

                if (data.EntityId)
                    grid.EntityId = data.EntityId;
                if (data.EntityName)
                    grid.EntityName = data.EntityName;
                if (data.KeyName)
                    grid.KeyName = data.KeyName;

                if (options.doClick) {
                    grid.onClick.subscribe(function (e, args) {
                        var cell = grid.getCellFromEvent(e);
                        var item = grid.getDataItem(cell.row);
                        if (item.__nonDataRow) return;
                        var column = grid.getColumns()[cell.cell];
                        ViewClick(dataView, item, column, e);
                    });
                }
            }
            view.viewName = viewName;
            window[viewName] = view;

            if (!window['views'] || !views.hasOwnProperty(viewName) || !Asyst.Workspace.views[viewName].isEditable)
                $('#menuItemAdd').hide();
            else
                $('#menuItemAdd').show();

            if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isExtFilterVisible)
                $('.ext-filter-menu').show();
            else
                $('.ext-filter-menu').hide();

            $('#BrowseSearch').keyup(window[viewName].QuickFilterKeyup);
            $('.search-clear').click(window[viewName].QuickFilterClear);
            if (Asyst.Workspace.views && Asyst.Workspace.views[viewName] && Asyst.Workspace.views[viewName].isInitiallyCollapsed) {
                window[viewName].CollapseAllGroups();
            }

            if (params.hasOwnProperty("ExpandGroup"))
                if (params.ExpandGroup == "true")
                    view.ExpandAllGroups();
                else
                    view.CollapseAllGroups();

            var needInvalidate = false;

            if (filterArgs && filterArgs.hasOwnProperty('oper')) {
                view.DataView.setFilter(Grid.ExtFilter);
                filterArgs = $.extend(filterArgs, {gridView: view});
                view.DataView.setFilterArgs(filterArgs);
                view.DataView.refresh();
                needInvalidate = true;
                if (!params.hideFilterPanel)
                    MakeFilterLine(filterArgs);
                ToggleClearFilterButton(true);
            } else {
                view.QuickFilterClear();
                ToggleClearFilterButton(false);
                !(!!data.EditFormName) && Grid.ClearExtFilter(view);
            }

            if (filterArgs && filterArgs.hasOwnProperty('searchString') && filterArgs.searchString !== "") {
                $('#BrowseSearch').val(filterArgs.searchString);
                view.UpdateQuickFilter(filterArgs.searchString);
                ToggleClearFilterButton(true);
                view.DataView.refresh();
                needInvalidate = true;
            }

            if (data.viewSample && data.viewSample.hasOwnProperty('groups')) {
                view.SetGroupsCollapsed(data.viewSample.groups);
                needInvalidate = true;
            }
            if (data.viewSample && data.viewSample.hasOwnProperty('viewport') && data.viewSample.top != -1) {
                view.Grid.scrollToRow(data.viewSample.viewport.top);
                needInvalidate = true;
            }

            //восстанавливаем меню.
            if (Asyst.Workspace.views && Asyst.Workspace.views[viewName])
                $('#viewSelectBtn').text(Asyst.Workspace.views[viewName].title);
            if (data.viewSample && data.viewSample.name != "")
                $('#viewSampleSelectBtn').text(data.viewSample.name);
            else
                $('#viewSampleSelectBtn').text(Globa.ViewSample.locale());
            view.viewSampleMenuRebuild();

            if (needInvalidate) {
                view.Grid.invalidate();
            }
        }
    };

    that.init = function(){
        that.loader_add();
        that.init_data();
        that.load_data(function(data){
            that.loader_remove();
            that.data.gridview = new GridView({
                containerid: that.data.containerid,
                title: that.data.title,
                data: data,
                header: that.data.header,
                render: that.render_data
            });
        });
    };
    that.init();
    return that;
};