var Dashboard = function(options){
    var that = this._dashboard = {};
    that.const = {
        CONTENT_LOADING: '<span class="spinner"></span>',
        CONTENT_NODATA: 'Нет данных',
        CONTENT_ERROR: 'Ошибка загрузки',
        BORDER_COLOR_BLUE: '#5a97f2',
        BORDER_COLOR_DEFAULT: '#ccc',
        BORDER_COLOR_PURPLE: '#8e6bf5',
        BORDER_COLOR_RED: '#ff5940',
        CONTENT_TYPE_TEXT: 'text',
        CONTENT_TYPE_HTML: 'html',
        CONTENT_TYPE_COUNT: 'count'
    };
    that.data = {
        items: [],
        library: [],
        loader: null,
        grid: null
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid),
        tumbler: $([
            '<span class="header__column-item tumbler" id="tumbler_edit-page">',
            '<span class="tumbler__box">',
            '<div class="tumbler__sticker tumbler__sticker_position_left">',
            '<div class="tumbler__sticker-label">Вкл</div>',
            '</div>',
            '<div class="tumbler__sticker tumbler__sticker_position_right">',
            '<div class="tumbler__sticker-label">Выкл</div>',
            '</div>',
            '<button class="button" type="button" data-fc="button">',
            '<span class="icon icon_svg_edit"></span>',
            '<span class="button__anim"></span>',
            '</button>',
            '</span>',
            '<input class="tumbler__input" type="checkbox" name="_tumbler" hidden/>',
            '</span>'
        ].join('')).tumbler(),
        button_group: $('<span class="button-group header__column-item"></span>'),
        button_add: $([
            '<button class="button button_hidden" type="button" data-hidden="true" id="button_add-widget">',
            '<span class="icon icon_svg_plus"></span>',
            '<span class="button__text mobile mobile_hide">Добавить</span>',
            '<span class="button__anim"></span>',
            '</button>'
        ].join('')).button(),
        button_save: $([
            '<button class="button button_hidden" type="button" data-hidden="true" id="button_save-grid">',
            '<span class="icon icon_svg_save"></span>',
            '<span class="button__text mobile mobile_hide">Сохранить</span>',
            '<span class="button__anim"></span>',
            '</button>',
        ].join('')).button(),
        loader: $('<span class="spinner"></span>')
    };

    that.render_tumbler = function(){
        that.data._el.tumbler
            .on('on.fc.tumbler', function(){
                that.loader_add();
                setTimeout(function(){
                    that.data._el.button_add.button('show');
                    that.data._el.button_save.button('show');
                    that.data.grid.widget_grid('edit_mode');
                    that.loader_remove();
                }, 100);
            })
            .on('off.fc.tumbler', function(){
                that.loader_add();
                setTimeout(function(){
                    that.data._el.button_add.button('hide');
                    that.data._el.button_save.button('hide');
                    that.data.grid.widget_grid('view_mode');
                    that.loader_remove();
                }, 100);
            });
        $('.header__column-right').prepend(that.data._el.tumbler);
    };
    that.render_buttons = function(){
        that.data._el.button_add.on('click', function(){
            var item = {
                x: 0,
                y: 0,
                width: 2,
                height: 4,
                settings: {
                    name: "Новый виджет",
                    collapsed: false
                }
            };
            that.data.grid.widget_grid('add_widget', item, function(data){
                console.log(data);
            });
        });
        that.data._el.button_save.on('click', function(){
            that.data.grid.widget_grid('save', function(data){
                that.data._el.tumbler.tumbler('uncheck');
                console.log(data);
            });
        });
        that.data._el.button_group.append(
            that.data._el.button_add,
            that.data._el.button_save
        );
        $('.header__column-right').prepend(that.data._el.button_group);
    };
    that.render_grid = function(){
        that.data.grid = that.data._el.target
            .widget_grid({
                items: that.data.items,
                loader: that.data.loader,
                library: that.data.library,
                widget_buttons: [
                    {
                        id: 'button_settings',
                        icon: 'icon_svg_settings',
                        mode: 'edit',
                        click: function(widget, data){
                            that.settings(widget, data);
                        }
                    },
                    {
                        id: 'button_remove',
                        icon: 'icon_svg_trash',
                        mode: 'edit',
                        click: function(widget, data){
                            debugger;
                            that.data.grid.widget_grid('remove_widget', data.id);
                        }
                    }
                ]
            });
    };

    /* modal for settings - begin */
    that.settings = function(widget, data){
        var modal_options = {
            buttons: [
                {
                    name: 'save',
                    action: 'save',
                    icon: 'icon_svg_ok'
                },
                {
                    name: 'destroy',
                    action: 'destroy',
                    icon: 'icon_svg_close'
                }
            ],
            header: {
                caption: 'Настройки виджета',
                name: data.name
            },
            content: { tabs: [] },
            data: data
        };
        that.settings_render_general_tab(data, modal_options.content.tabs);
        that.settings_render_source_tab(data, modal_options.content.tabs);

        $('<span class="modal__"></span>').appendTo('body')
            .modal__(modal_options)
            .on('save.fc.modal', function(){
                var reload = false;
                $(this).find('[data-field]').each(function(){
                    var t = $(this), val = t[t.data('fc').replace('-','_')]('value');
                    if ((t.data('field') == 'pagename' ||
                        t.data('field') == 'elementname') &&
                        data[t.data('field')] != val) {
                        reload = true;
                    }
                    _.set(widget.data(), t.data('field'), val);
                });
                widget.widget('set_name');
                widget.widget('set_color');
                if (reload) {
                    widget.widget('set_content');
                }
                $(this).modal__('destroy');
            });
    };
    that.settings_render_general_tab = function(data, tabs){
        tabs.push({
            id: 'general',
            name: 'Основные',
            active: true,
            content: $([

                '<div class="control">' +
                '<div class="control__caption">' +
                '<div class="control__text">Скрывать по умолчанию</div>' +
                '</div>' +
                '<div class="control__container">' +
                '<label class="checkbox" data-fc="checkbox" data-field="collapsed"' +
                (data.collapsed ? 'data-checked="true"' : '') + '>' +
                '<input class="checkbox__input" type="checkbox" name="collapsed"/>' +
                '<label class="checkbox__label"></label>' +
                '</label>' +
                '</div>' +
                '</div>' +

                '<div class="control">' +
                '<div class="control__caption">' +
                '<div class="control__text">Заголовок</div>' +
                    //'<div class="control__icons">' +
                    //'<span class="icon icon_svg_star_red"></span>' +
                    //'<span class="icon icon_svg_star_green"></span>' +
                    //'<span class="icon icon_svg_info"></span>' +
                    //'</div>' +
                '</div>' +
                '<div class="control__container">' +
                '<span class="input input__has-clear" data-fc="input" data-field="name">' +
                '<span class="input__box">' +
                '<input type="text" class="input__control" value="' + data.name + '">' +
                '<button class="button" type="button" data-fc="button">' +
                '<span class="icon icon_svg_close"></span>' +
                '</button>' +
                '</span>' +
                '</span>' +
                '</div>' +
                '</div>' +

                '<div class="control">' +
                '<div class="control__caption">' +
                '<div class="control__text">Цвет</div>' +
                '</div>' +
                '<div class="control__container">' +
                '<select class="select" name="color" data-fc="select" data-field="color">' +
                '<option value="' + that.const.BORDER_COLOR_DEFAULT + '" ' + (data.color == that.const.BORDER_COLOR_DEFAULT ? 'selected' : '' ) + '>Серый</option>' +
                '<option value="' + that.const.BORDER_COLOR_BLUE + '" ' + (data.color == that.const.BORDER_COLOR_BLUE ? 'selected' : '' ) + '>Синий</option>' +
                '<option value="' + that.const.BORDER_COLOR_PURPLE + '" ' + (data.color == that.const.BORDER_COLOR_PURPLE ? 'selected' : '' ) + '>Фиолетовый</option>' +
                '<option value="' + that.const.BORDER_COLOR_RED + '" ' + (data.color == that.const.BORDER_COLOR_RED ? 'selected' : '' ) + '>Красный</option>' +
                '</select>' +
                '</div>' +
                '</div>'

            ].join(''))
        });
    };
    that.settings_render_source_tab = function(data, tabs){
        if (data.library) {
            var $control__library = $([
                    '<div class="control">',
                    '<div class="control__caption">',
                    '<div class="control__text">Источник данных</div>',
                    '</div>',
                    '<div class="control__container">',
                    '<select class="select" name="pagename" data-fc="select" data-field="pagename" data-mode="radio-check" data-height="350"></select>',
                    '</div>',
                    '</div>'
                ].join('')),
                $control__widgets = $([
                    '<div class="control">',
                    '<div class="control__caption">',
                    '<div class="control__text">Виджет</div>',
                    '</div>',
                    '<div class="control__container">',
                    '<select class="select" name="elementname" data-fc="select" data-field="elementname" data-mode="radio-check" data-height="350"></select>',
                    '</div>',
                    '</div>'
                ].join(''));
            data.library.forEach(function(item){
                var $option = $('<option value="' + item.value + '" ' + (item.value == data.pagename ? 'selected="selected"' : '') + '>' + item.text + '</option>');
                if (item.value == data.pagename) {
                    item.items.forEach(function(item){
                        var $option = $('<option value="' + item.value + '" ' + (item.value == data.elementname ? 'selected="selected"' : '') + '>' + item.text + '</option>');
                        $control__widgets.find('.select').append($option);
                    });
                }
                $control__library.find('.select').append($option);
            });
            $control__library.find('.select').on('change', function(e){
                var values = $(this).data('_value'),
                    items = [];
                values.forEach(function(item){
                    var library = data.library.filter(function(d){ return d.value == item.value; });
                    if (library.length > 0) {
                        library = library[0];
                        if (library.items) {
                            items.push.apply(items, library.items)
                        }
                    }
                });
                $control__widgets.find('.select').select('update', items);
            });
            tabs.push({
                id: 'source',
                name: 'Источник данных',
                content:
                    $('<div></div>').append($control__library, $control__widgets)
            });
        }
    };
    /* modal for settings - end */

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

    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render_tumbler();
            that.render_buttons();
            that.render_grid();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};

var Loader = function(options){
    var that = this.loader = {};
    that.defaults = {
        data: null,
        success: null,
        error: null,
        content: null,
    };
    that.data = $.extend(true, {}, that.defaults, options);
    that.contents = [
        {
            pagename: 'LibraryCount',
            elementname: 'MyLov',
            content: '<div class="widget__content widget__content_align_center"><div class="widget__count">0</div></div>'
        },
        {
            pagename: 'LibraryCount',
            elementname: 'LovFromMe',
            content: '<div class="widget__content widget__content_align_center"><div class="widget__count">0</div></div>'
        },
        {
            pagename: 'LibraryCount',
            elementname: 'ChReqForMe',
            content: '<div class="widget__content widget__content_align_center"><div class="widget__count">0</div></div>'
        },
        {
            pagename: 'LibraryCount',
            elementname: 'ChReqFromMe',
            content: '<div class="widget__content widget__content_align_center"><div class="widget__count">0</div></div>'
        },
        {
            pagename: 'LibraryCount',
            elementname: 'MyInitCPO',
            content: '<div class="widget__content widget__content_align_center"><div class="widget__count">0</div></div>'
        },
        {
            pagename: 'LibraryCount',
            elementname: 'ChListForMe',
            content: '<div class="widget__content widget__content_align_center"><div class="widget__count">0</div></div>'
        },
        {
            pagename: 'LibraryCount',
            elementname: 'MyDocs',
            content: '<div class="widget__content widget__content_align_center"><div class="widget__count">0</div></div>'
        },
        {
            pagename: 'LibraryCount',
            elementname: 'MyProjectMoveToNextPhase',
            content: '<div class="widget__content widget__content_align_center"><div class="widget__count">0</div></div>'
        },
        {
            pagename: 'LibraryChart',
            elementname: 'MyPoints',
            content: [
                '<div id="MyPoints"></div>',
                '<script>$(function(){function e(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var t="MyPoints",i=t+"_"+Date.now();$("#"+t).attr("id",i);var o=new Highcharts.Chart({chart:{type:"pie",renderTo:i,width:e().width,height:e().height},title:{text:""},legend:{enabled:!1},exporting:{enabled:!1},credits:{enabled:!1},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},yAxis:{title:{text:""}},plotOptions:{pie:{allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,distance:5,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#666"},formatter:function(){return this.y}}},series:{cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"В работе по плану",y:21,color:"#718396",url:"point?view=MyPoint&Field1Name=IndicatorId&Field1Value=0&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"},{name:"Выполнено",y:27,color:"#3cd79a",url:"point?view=MyPoint&Field1Name=IndicatorId&Field1Value=4&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"},{name:"Просрочено",y:98,color:"#ff6666",url:"point?view=MyPoint&Field1Name=IndicatorId&Field1Value=3&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"}]}]});$(window).resize(function(){o.setSize(e().width,e().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'LibraryChart',
            elementname: 'PointsFromMe',
            content: [
                '<div id="PointsFromMe"></div>',
                '<script>$(function(){function e(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var t="PointsFromMe",i=t+"_"+Date.now();$("#"+t).attr("id",i);var o=new Highcharts.Chart({chart:{type:"pie",renderTo:i,width:e().width,height:e().height},title:{text:""},legend:{enabled:!1},exporting:{enabled:!1},credits:{enabled:!1},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},yAxis:{title:{text:""}},plotOptions:{pie:{allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,distance:5,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#666"},formatter:function(){return this.y}}},series:{cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"В работе по плану",y:38,color:"#718396",url:"point?view=PointFromMe&Field1Name=IndicatorId&Field1Value=0&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"},{name:"Выполнено",y:29,color:"#3cd79a",url:"point?view=PointFromMe&Field1Name=IndicatorId&Field1Value=4&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"},{name:"Просрочено",y:133,color:"#ff6666",url:"point?view=PointFromMe&Field1Name=IndicatorId&Field1Value=3&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"}]}]});$(window).resize(function(){o.setSize(e().width,e().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'LibraryChart',
            elementname: 'MyMeetings',
            content: [
                '<div id="MyMeetings"></div>',
                '<script>$(function(){function e(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var t="MyMeetings",i=t+"_"+Date.now();$("#"+t).attr("id",i);var n=new Highcharts.Chart({chart:{type:"pie",renderTo:i,width:e().width,height:e().height},title:{text:""},legend:{enabled:!1},exporting:{enabled:!1},credits:{enabled:!1},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},yAxis:{title:{text:""}},plotOptions:{pie:{innerSize:"75%",allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,distance:5,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#666"},formatter:function(){return this.y}}},series:{cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"В работе",y:1,color:"#718396",url:"meeting?view=MyMeeting&Field1Name=IndicatorId&Field1Value=0"},{name:"Проведено",y:2,color:"#27bdbe",url:"meeting?view=MyMeeting&Field1Name=IndicatorId&Field1Value=8"},{name:"Просрочено",y:14,color:"#ff6666",url:"meeting?view=MyMeeting&Field1Name=IndicatorId&Field1Value=3"}]}]});$(window).resize(function(){n.setSize(e().width,e().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'LibraryChart',
            elementname: 'MyOrders',
            content: [
                '<div id="MyOrders"></div>',
                '<script>$(function(){function e(){return{width:$("#"+r).closest(".widget__body-data").width(),height:$("#"+r).closest(".widget__body-data").height()}}var t="MyOrders",r=t+"_"+Date.now();$("#"+t).attr("id",r);var o=new Highcharts.Chart({chart:{renderTo:r,type:"column",margin:[25,25,25,25],width:e().width,height:e().height},title:{text:""},legend:{enabled:!1},credits:{enabled:!1},exporting:{enabled:!1},yAxis:{title:{text:""},labels:{enabled:!1},gridLineColor:"#eeeeee",tickColor:"#eeeeee"},xAxis:{title:{text:""},labels:{enabled:!1},gridLineColor:"#eeeeee",tickColor:"#eeeeee"},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},plotOptions:{column:{shadow:!1,dataLabels:{enabled:!0,color:"#333",style:{fontFamily:"Proximanova-Regular",fontSize:"12px",textShadow:!1},formatter:function(){return this.y}}},series:{pointPadding:-.15,cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"Выполнено",y:2,color:"#3cd79a",url:"order?view=MyOrder&Field1Name=IndicatorId&Field1Value=4&ExpandGroup=true"},{name:"Отклонено / Отложено",y:4,color:"#32323a",url:"order?view=MyOrder&Field1Name=IndicatorId&Field1Value=19&ExpandGroup=true"},{name:"Просрочено",y:7,color:"#ff6666",url:"order?view=MyOrder&Field1Name=IndicatorId&Field1Value=3&ExpandGroup=true"}]}]});$(window).resize(function(){o.setSize(e().width,e().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'LibraryChart',
            elementname: 'MyInitiative',
            content: [
                '<div id="MyInitiative"></div>',
                '<script>$(function(){function e(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var t="MyInitiative",i=t+"_"+Date.now();$("#"+t).attr("id",i);var o=new Highcharts.Chart({chart:{renderTo:i,type:"column",margin:[25,25,25,25],width:e().width,height:e().height},title:{text:""},legend:{enabled:!1},credits:{enabled:!1},exporting:{enabled:!1},yAxis:{title:{text:""},labels:{enabled:!1},gridLineColor:"#eeeeee",tickColor:"#eeeeee"},xAxis:{title:{text:""},labels:{enabled:!1},gridLineColor:"#eeeeee",tickColor:"#eeeeee"},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},plotOptions:{column:{shadow:!1,dataLabels:{enabled:!0,color:"#333",style:{fontFamily:"Proximanova-Regular",fontSize:"12px",textShadow:!1},formatter:function(){return this.y}}},series:{pointPadding:-.15,cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"Черновик / Доработка",y:2,color:"#718396",url:"initiative?view=MyInitiativeView&Field1Name=IndicatorId&Field1Value=0&ExpandGroup=true"},{name:"Утверждена / Архив",y:2,color:"#3cd79a",url:"initiative?view=MyInitiativeView&Field1Name=IndicatorId&Field1Value=4&ExpandGroup=true"},{name:"Отклонена",y:1,color:"#32323a",url:"initiative?view=MyInitiativeView&Field1Name=IndicatorId&Field1Value=19&ExpandGroup=true"}]}]});$(window).resize(function(){o.setSize(e().width,e().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'LibraryChart',
            elementname: 'ForMeInitiative',
            content: [
                '<div id="ForMeInitiative"></div>',
                '<script>$(function(){function e(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var t="ForMeInitiative",i=t+"_"+Date.now();$("#"+t).attr("id",i);var o=new Highcharts.Chart({chart:{renderTo:i,type:"column",margin:[25,25,25,25],width:e().width,height:e().height},title:{text:""},legend:{enabled:!1},credits:{enabled:!1},exporting:{enabled:!1},yAxis:{title:{text:""},labels:{enabled:!1},gridLineColor:"#eeeeee",tickColor:"#eeeeee"},xAxis:{title:{text:""},labels:{enabled:!1},gridLineColor:"#eeeeee",tickColor:"#eeeeee"},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},plotOptions:{column:{shadow:!1,dataLabels:{enabled:!0,color:"#333",style:{fontFamily:"Proximanova-Regular",fontSize:"12px",textShadow:!1},formatter:function(){return this.y}}},series:{pointPadding:-.15,cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"Черновик / Доработка",y:1,color:"#718396",url:"initiative?view=ForMeInitiativeView&Field1Name=IndicatorId&Field1Value=0&ExpandGroup=true"}]}]});$(window).resize(function(){o.setSize(e().width,e().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'LibraryChart',
            elementname: 'MyRisksPie',
            content: [
                '<div id="MyRisksPie"></div>',
                '<script>$(function(){function t(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var e="MyRisksPie",i=e+"_"+Date.now();$("#"+e).attr("id",i);var o=new Highcharts.Chart({chart:{type:"pie",renderTo:i,width:t().width,height:t().height},title:{text:""},legend:{enabled:!1},exporting:{enabled:!1},credits:{enabled:!1},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},yAxis:{title:{text:""}},plotOptions:{pie:{allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,distance:5,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#666"},formatter:function(){return this.y}}},series:{cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"Низкий",y:3,color:"#3cd79a",url:"risk?view=MyActivityRisk&Field1Name=IndicatorId&Field1Value=001&ExpandGroup=true"},{name:"Средний",y:2,color:"#ffb652",url:"risk?view=MyActivityRisk&Field1Name=IndicatorId&Field1Value=002&ExpandGroup=true"},{name:"Высокий",y:2,color:"#ff6666",url:"risk?view=MyActivityRisk&Field1Name=IndicatorId&Field1Value=003&ExpandGroup=true"}]}]});$(window).resize(function(){o.setSize(t().width,t().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'LibraryChart',
            elementname: 'RiskMatrix',
            content: [
                '<link href="charts/riskmatrix/jquery.riskmatrix.css"/>',
                '<script src="charts/riskmatrix/jquery.riskmatrix.js" type="text/javascript"></script>',
                '<div id="RiskMatrix" style="height:100%;"></div>',
                '<script>$(function(){var a="RiskMatrix",i=a+"_"+Date.now();$("#"+a).attr("id",i),$("#"+i).createRiskMatrix({OXName:"Вероятность",OYName:"Влияние",Probability:["Низкая","Средняя","Высокая"],Impact:["Низкое","Среднее","Высокое"],Color:["riskBGGreen","riskBGGreen","riskBGYellow","riskBGRed","riskBGRed","riskBGRed"],Data:[{Code:"Р-0001",Name:"",Probability:"Низкая",Impact:"Среднее",CSS:"riskBadgeGreen",URL:"/asyst/Risk/form/auto/10024?mode=view&back=/"},{Code:"Р-0002",Name:"",Probability:"Средняя",Impact:"Высокое",CSS:"riskBadgeRed",URL:"/asyst/Risk/form/auto/10025?mode=view&back=/"},{Code:"Р-0009",Name:"",Probability:"Низкая",Impact:"Высокое",CSS:"riskBadgeYellow",URL:"/asyst/Risk/form/auto/10032?mode=view&back=/"},{Code:"Р-0014",Name:"",Probability:"Низкая",Impact:"Высокое",CSS:"riskBadgeYellow",URL:"/asyst/Risk/form/auto/10037?mode=view&back=/"},{Code:"Р-0015",Name:"",Probability:"Высокая",Impact:"Высокое",CSS:"riskBadgeRed",URL:"/asyst/Risk/form/auto/10038?mode=view&back=/"},{Code:"Р-0022",Name:"",Probability:"Низкая",Impact:"Среднее",CSS:"riskBadgeGreen",URL:"/asyst/Risk/form/auto/30045?mode=view&back=/"},{Code:"Р-0042",Name:"",Probability:"Низкая",Impact:"Среднее",CSS:"riskBadgeGreen",URL:"/asyst/Risk/form/auto/40068?mode=view&back=/"}]}),$("#"+i+" .riskCell").each(function(){var a=$(this).find(".riskBadge").length;a>3&&($(this).find(".riskBadge").slice(3).addClass("riskBadgeHide"),$(this).append(\'<span class="riskBadgeCount">и еще \'+(a-3)+" ...</span>"))});var e=$("#"+i+" .riskTotalLabel").html();$(".riskTable").on("click",".riskBadgeCount",function(){var a=$(this).parent().find(".riskBadge").length;$("#"+i+" .riskTotalLabel").html(a);var e=$(this).parent().parent().find(".riskRowLabel").not("[rowspan]").find("div").text();$("#"+i+" tr .riskRowLabel").not("[rowspan]").find("div").not(":contains("+e+")").css("fontSize","0");var t=$(this).parent().index();4==t&&(t=3);var s=$("#"+i+" .riskColLabel").eq(t-1).text();$("#"+i+" .riskColLabel").not("[colspan]").not(":contains("+s+")").css("fontSize","0");var r=$(this).parent().attr("class");r=r.split(" "),r=r[1];var o=$(this).parent().html(),d=$(".riskTable").width(),l=$("#"+i+" .riskTotalLabel").width();$(".riskTable").append(\'<div style="width:\'+(d-l)+\'" class="riskBadges \'+r+\'"><div>\'+o+"<p>Назад</p></div></div>")}),$(".riskTable").on("click",".riskBadges",function(){$(this).remove(),$("#"+i+" .riskTotalLabel").html(e),$("#"+i+" tr .riskRowLabel").not("[rowspan]").find("div").attr("style",""),$("#"+i+" tr .riskColLabel").not("[rowspan]").attr("style","")}),$(window).resize(function(){var a=$(".riskTable").width(),e=$("#"+i+" .riskTotalLabel").width();$(".riskTable .riskBadges").width(a-e)})});</script>',
                '<style>.riskBadges{height: 382px;height: 338px;position: absolute;top: 0;right: 0;width: 100%;cursor:pointer;text-align: center;overflow-y: auto;}.riskBadgeHide{ display:none !important; }.riskBadges .riskBadgeHide{ display:inline-block !important; }.riskBadgeCount{ display: inline-block;width: 100%;text-align: center;color: #fff;cursor:pointer;font-size: 14px;/*height: 100%;line-height: 112px;*/ }.riskBadges .riskBadgeCount{ display:none; }.riskBadges > div{padding:15px 0;}.riskBadges > div p{color:#fff;font-size: 18px;margin-top: 7px;}.riskBadges .riskBadge{float:none;display: inline-block;}.riskTable { border-collapse: collapse; }.riskTable > tbody> tr > td:first-child { border-left: none; }.riskTable > tbody> tr > td:last-child { border-right: none; }.riskBadge { font-size: 10px; margin: 3px; padding: 2px 5px; line-height:20px; cursor: pointer; }.riskBadgeGreen { color: #5faf61; border: solid 1px #5faf61; }.riskBadgeYellow { color: #fa8f42; border: solid 1px #fa8f42; }.riskBadgeRed { color: #ff5940; border: solid 1px #ff5940; }.riskBGGreen {}.riskBGYellow {}.riskBGRed {}.riskCell { border: 1px solid #ddd; width: 30%; text-align: center; }.riskTotalLabel { border: 1px solid #ddd; background-color: #fafafa; font-size: 40px; padding: 5px 0; text-align: center; color: #333; width: 25px !important; }.riskColLabel { border-left: 1px solid #ddd; background-color: #fafafa; border: 1px solid #ddd; font-size: 12px; text-align: center; height: 22px; }.riskRowLabel { border: 1px solid #ddd; background-color: #fafafa; font-size: 12px; text-align: center; }.riskVert { -ms-transform:rotate(270deg); -moz-transform:rotate(270deg);  -webkit-transform:rotate(270deg); -o-transform:rotate(270deg); }</style>'
            ].join('')
        },
        {
            pagename: 'LibraryChart',
            elementname: 'MyContractBubble',
            content: [
                '<link href="charts/bubble/bubble.css" rel="stylesheet">',
                '<script src="charts/bubble/bubble_chart.js" type="text/javascript"></script>',
                '<div id="MyContractBubble" style="height:100%;"></div>',
                '<script>$(function(){var o="MyContractBubble",t=o+"_"+Date.now();$("#"+o).attr("id",t),chart=new BubbleChart("#"+t,[{id:93561,projectid:93561,projectcode:"500-010",projectname:"Автоматизация деятельности Департамента торговли и услуг",contractscount:1,total_amount:45,plansum:45,group:3,indicatorid:3,indicatorcolor:"#ff6666"},{id:93587,projectid:93587,projectcode:"500-036",projectname:"Обеспечение пунктов приема заявлений на универсальные электронные карты (УЭК) и пунктов выдачи УЭК необходимым оборудованием",contractscount:1,total_amount:45,plansum:45,group:0,indicatorid:0,indicatorcolor:"#718396"},{id:168799,projectid:168799,projectcode:"500-218",projectname:"Повышение скорости работы сайта организации",contractscount:1,total_amount:44444,plansum:44444,group:0,indicatorid:0,indicatorcolor:"#718396"},{id:191257,projectid:191257,projectcode:"500-226",projectname:"Проект АВ",contractscount:1,total_amount:23,plansum:23,group:3,indicatorid:3,indicatorcolor:"#ff6666"}])});</script>'
            ].join('')
        },
        {
            pagename: 'LibraryTable',
            elementname: 'MyProjects',
            content: '<div class="widget__content widget__content_scroll"><table class="table"><thead><tr><td>Название</td><td class="mobile mobile_hide">Ответственный</td><td class="mobile mobile_hide align_right">План, м.р.</td><td class="mobile mobile_hide align_right">Стоимость, м.р.</td></tr></thead><tbody> <tr><td><a class="link" href="/asyst/Contract/form/auto/156652?mode=view&amp;back=/">700-001. Осуществление строительных работ "Лыжная база"</a></td><td class="mobile mobile_hide">Алферов Павел Александрович</td><td class="mobile mobile_hide align_right">1,50</td><td class="mobile mobile_hide align_right">1,80</td></tr><tr><td><a class="link" href="/asyst/Contract/form/auto/167691?mode=view&amp;back=/">700-003. Обновление 1С до новой версии</a></td><td class="mobile mobile_hide">Бочкарев Денис Юрьевич</td><td class="mobile mobile_hide align_right">456,00</td><td class="mobile mobile_hide align_right">567,00</td></tr><tr><td><a class="link" href="/asyst/Contract/form/auto/167702?mode=view&amp;back=/">700-004. Разработка и внедрение системы кадастрового учета и мониторинга</a></td><td class="mobile mobile_hide">Алферов Павел Александрович</td><td class="mobile mobile_hide align_right">250,00</td><td class="mobile mobile_hide align_right">242,00</td></tr><tr><td><a class="link" href="/asyst/Contract/form/auto/167707?mode=view&amp;back=/">700-006. Разработка документации по внедрению единого реестра городских справочников</a></td><td class="mobile mobile_hide">Бугров Александр Владимирович</td><td class="mobile mobile_hide align_right">45,00</td><td class="mobile mobile_hide align_right">9223372036854776,00</td></tr><tr><td><a class="link" href="/asyst/Contract/form/auto/167709?mode=view&amp;back=/">700-008. Разработка проектной документации для формирования раздела</a></td><td class="mobile mobile_hide">Виланд Анастасия Владимировна</td><td class="mobile mobile_hide align_right">567,00</td><td class="mobile mobile_hide align_right">569,00</td></tr><tr><td><a class="link" href="/asyst/Contract/form/auto/167717?mode=view&amp;back=/">700-010. Печать УЭК</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide align_right">45,00</td><td class="mobile mobile_hide align_right"> </td></tr><tr><td><a class="link" href="/asyst/Contract/form/auto/191258?mode=view&amp;back=/">700-014. Контракт тест</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide align_right">23,00</td><td class="mobile mobile_hide align_right"> </td></tr><tr><td><a class="link" href="/asyst/Contract/form/auto/201978?mode=view&amp;back=/">700-015. контракт на поставку</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide align_right">44444,00</td><td class="mobile mobile_hide align_right"> </td></tr></tbody></table></div>'
        },
        {
            pagename: 'LibraryTable',
            elementname: 'MyContracts',
            content: '<div class="widget__content widget__content_scroll"><table class="table"><thead><tr><td>Название</td><td class="mobile mobile_hide">Руководитель</td><td class="mobile mobile_hide">Стадия</td><td class="mobile mobile_hide">Моя роль</td></tr></thead><tbody> <tr><td><a class="link" href="/asyst/Project/form/auto/93561?mode=view&amp;back=/">500-010. Автоматизация деятельности Департамента торговли и услуг</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide">Реализация</td><td class="mobile mobile_hide">Куратор</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/93587?mode=view&amp;back=/">500-036. Обеспечение пунктов приема заявлений на универсальные электронные карты (УЭК) и пунктов выдачи УЭК необходимым оборудованием</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide">Реализация</td><td class="mobile mobile_hide">Функциональный заказчик</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/93605?mode=view&amp;back=/">500-054. Обеспечение выпуска УЭК в 2017 году</a></td><td class="mobile mobile_hide">Новак Александр Валентинович</td><td class="mobile mobile_hide">Закрытие</td><td class="mobile mobile_hide">Зам.руководителя</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/93621?mode=view&amp;back=/">500-070. Автоматизация деятельности Департамента капитального ремонта жилищного фонда</a></td><td class="mobile mobile_hide">Руководитель П.</td><td class="mobile mobile_hide">Закрытие</td><td class="mobile mobile_hide">Функциональный заказчик</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/93633?mode=view&amp;back=/">500-082. Перевод государственной услуги "Лицензирование розничной продажи алкогольной продукции" в электронный вид</a></td><td class="mobile mobile_hide">Руководитель П.</td><td class="mobile mobile_hide">Закрытие</td><td class="mobile mobile_hide">Куратор</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/93635?mode=view&amp;back=/">500-084. Повышение доступности услуг скорой и неотложной медицинской помощи</a></td><td class="mobile mobile_hide">Руководитель П.</td><td class="mobile mobile_hide">Постпроект</td><td class="mobile mobile_hide">Куратор</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/93659?mode=view&amp;back=/">500-108. Автоматизация деятельности Департамента природопользования и охраны окружающей среды и подведомственных организаций</a></td><td class="mobile mobile_hide">Смирнов Александр Александрович</td><td class="mobile mobile_hide">Реализация</td><td class="mobile mobile_hide">Администратор</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/93670?mode=view&amp;back=/">500-119. Автоматизация деятельности Департамента науки и промышленной политики</a></td><td class="mobile mobile_hide">Руководитель П.</td><td class="mobile mobile_hide">Реализация</td><td class="mobile mobile_hide">Куратор</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/93686?mode=view&amp;back=/">500-135. АИС обеспечения деятельности(и производства) опорных пунктов охраны общественного порядка в городе Москве</a></td><td class="mobile mobile_hide">Руководитель П.</td><td class="mobile mobile_hide">Реализация</td><td class="mobile mobile_hide">Куратор</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/156658?mode=view&amp;back=/">500-215. Working Program of "West Qurna II" Project</a></td><td class="mobile mobile_hide">Шмидт Александр</td><td class="mobile mobile_hide">Реализация</td><td class="mobile mobile_hide">Команда</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/167714?mode=view&amp;back=/">500-216. Подготовка тестовых объектов</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide">Закрытие</td><td class="mobile mobile_hide">Руководитель</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/168799?mode=view&amp;back=/">500-218. Повышение скорости работы сайта организации</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide">Инициация</td><td class="mobile mobile_hide">Куратор</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/168825?mode=view&amp;back=/">500-220. респлан</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide">Инициация</td><td class="mobile mobile_hide">Руководитель</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/168832?mode=view&amp;back=/">500-221. Проект</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide">Инициация</td><td class="mobile mobile_hide">Функциональный заказчик</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/169099?mode=view&amp;back=/">500-222. Календарный план, загруженный из mpp</a></td><td class="mobile mobile_hide">Системный Администратор</td><td class="mobile mobile_hide">Инициация</td><td class="mobile mobile_hide">Куратор</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/169361?mode=view&amp;back=/">500-225. Проект без плана </a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide">Планирование</td><td class="mobile mobile_hide">Руководитель</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/191257?mode=view&amp;back=/">500-226. Проект АВ</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide">Инициация</td><td class="mobile mobile_hide">Функциональный заказчик</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/201878?mode=view&amp;back=/">500-249. Проект тест 06.12</a></td><td class="mobile mobile_hide">Системный Администратор</td><td class="mobile mobile_hide">Инициация</td><td class="mobile mobile_hide">Куратор</td></tr><tr><td><a class="link" href="/asyst/Project/form/auto/214274?mode=view&amp;back=/">500-327. Формирование типового календарного плана</a></td><td class="mobile mobile_hide">Функциональный Администратор</td><td class="mobile mobile_hide">Инициация</td><td class="mobile mobile_hide">Руководитель</td></tr></tbody></table></div>'
        },
        {
            pagename: 'LibraryMisc',
            elementname: 'Logo',
            content: [
                '<style>',
                '.box_full { width: 100%; height: 100%; padding: 20px 40px 40px; box-sizing: border-box; }',
                '.box_center { width: 100%; height: 100%; background-image: url(/asyst/anon/logo.png); background-repeat: no-repeat; background-position: center center; box-sizing: border-box; background-size: contain; }',
                '.foresight { background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i0KHQu9C+0LlfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyMzguMTA5cHgiIGhlaWdodD0iMjM4LjEwOXB4IiB2aWV3Qm94PSIwIDAgMjM4LjEwOSAyMzguMTA5IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMzguMTA5IDIzOC4xMDkiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIGZpbGw9IiNGRjY2NjYiIGQ9Ik0xNjMuOTM4LDEzNS41MjJsNzEuNDQzLDM0LjE1OGMxLjA2NC0xLjc0NywxLjY1OS0zLjc4MiwxLjY1OS01LjkwNlYzNi40NzFjMC00LjQ5NS0zLjE0Ni04LjM3NS03LjU0NS05LjMwNGwtMC4xNDYtMC4wMzFjLTQuMTg0LTAuODgzLTguNDQsMS4xMzQtMTAuNDA3LDQuOTI5TDE2My45MzgsMTM1LjUyMnoiLz48cGF0aCBmaWxsPSIjRkZFMTY1IiBkPSJNMTMwLjYzMSwyLjQ3bDAuMDAxLDkyLjY3OGwtNDcuMzQ0LTAuMDAxYy0yLjA3LDAtMy45NzYtMS4xMjgtNC45NzEtMi45NDFMNDAuMzE5LDIyLjk1OWMtMS40MDYtMi41NjQsMC4xMzYtNS43NSwzLjAxOS02LjIzOEwxMjUuMjg0LDIuODZDMTI3LjA1NSwyLjU2MiwxMjguODQ1LDIuNDMyLDEzMC42MzEsMi40NyIvPjxwYXRoIGZpbGw9IiNGRjY2NjYiIGQ9Ik0xMzAuNjMzLDk1LjE0OGgzLjExYzIuMDkyLDAsNC4wMTQtMS4xNTEsNC45OTktMi45OTZsMzkuNzkyLTc0LjQwNWMxLjMzNC0yLjQ5NC0wLjA5NS01LjU3Mi0yLjg2LTYuMTYzbC0zOS43MzctOC40OTRjLTEuNzQ5LTAuMzczLTMuNTIzLTAuNTgtNS4zMDUtMC42MTlMMTMwLjYzMyw5NS4xNDh6Ii8+PHBhdGggZmlsbD0iI0ZGRTE2NSIgZD0iTTEyMi42MzYsMTIyLjI3MWw0LjI1Mi03Ljk1MWMxLjUxNi0yLjgzMy0wLjUzNy02LjI1Ny0zLjc0OS02LjI1N0g5NC4yMDRjLTMuMjMzLDAtNS4yODMsMy40NjQtMy43MjksNi4yOTdsOC43NCwxNS45MjhMMTIyLjYzNiwxMjIuMjcxeiIvPjxwYXRoIGZpbGw9IiMyMDlFRDUiIGQ9Ik05OS4yMTYsMTMwLjI4N2wyMy40Mi04LjAxOGwtMTAuMDI5LDE4Ljc1M2MtMS41OTIsMi45NzktNS44NTMsMy03LjQ3NywwLjA0TDk5LjIxNiwxMzAuMjg3eiIvPjxwYXRoIGZpbGw9IiMyMDlFRDUiIGQ9Ik0xNjMuOTM4LDEzNS41MjJsNzEuNDQzLDM0LjE1OGMtMS4wNDUsMS43MTItMi41NDQsMy4xNDgtNC4zODUsNC4xMmwtMTE0LjYxMyw2MC41MzRjLTMuNjk1LDEuOTUtOC4xNjMsMS43MTItMTEuNjI5LTAuNjIyTDYuMDc1LDE2Ny4yNTVjLTEuNTgzLTEuMDY2LTIuODQ2LTIuNDk1LTMuNzA2LTQuMTM2bDc3Ljc3NS0yNi4zOTd2MC4wMDFsMjQuMzA5LDQ1LjU1MmMxLjcyNCwzLjIzMiw1LjA4OSw1LjI1LDguNzUzLDUuMjVoMTcuMTIzYzMuNjY5LDAsNy4wMzgtMi4wMjIsOC43NjEtNS4yNjRMMTYzLjkzOCwxMzUuNTIyeiIvPjxwYXRoIGZpbGw9IiNGRkUxNjUiIGQ9Ik04MC4xNDUsMTM2LjcyM0wyMS43MjcsMjcuMjQ4Yy0yLjAwOS0zLjc2NS02LjE5OS01LjgyMi0xMC40MDYtNS4xMTFsLTEuNjkyLDAuMjg3Yy01LjA2NSwwLjg1Ny04LjU1OSw0Ljk5MS04LjU1OSw5LjgzMVYxNTcuODVjMCwxLjg2NCwwLjQ1OCwzLjY2NywxLjMsNS4yNzFMODAuMTQ1LDEzNi43MjN6Ii8+PC9nPjwvc3ZnPg==); }',
                '</style>',
                '<div class="box_full">',
                '<div class="box_center foresight"></div>',
                '</div>'
            ].join('')
        }
    ];
    that.loadContent = function(){
        var elem = that.contents.filter(function(d){
            return d.pagename == that.data.data.pagename && d.elementname == that.data.data.elementname;
        });
        if (elem.length > 0) {
            that.data.content = elem[0].content;
            if (typeof that.data.success == 'function') { that.data.success(that.data.content); }
        } else {
            that.data.content = 'Нет данных';
            if (typeof that.data.error == 'function') { that.data.error(that.data.content); }
        }
        return that.data.content;
    };
    return that;
};