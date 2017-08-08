var Loader = function(options){
    var that = this.loader = {};
    that.defaults = {
        pagename: null,
        elementname: null,
        content: null,
        success: null,
        error: null
    };
    that.data = $.extend(true, {}, that.defaults, options);
    that.contents = [
        {
            pagename: 'WidgetLibrary',
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
        },
        {
            pagename: 'WidgetLibrary',
            elementname: 'MyPoints',
            content: [
                '<div id="MyPoints"></div>',
                '<script>$(function(){function e(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var t="MyPoints",i=t+"_"+Date.now();$("#"+t).attr("id",i);var o=new Highcharts.Chart({chart:{type:"pie",renderTo:i,width:e().width,height:e().height},title:{text:""},legend:{enabled:!1},exporting:{enabled:!1},credits:{enabled:!1},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},yAxis:{title:{text:""}},plotOptions:{pie:{allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,distance:5,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#666"},formatter:function(){return this.y}}},series:{cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"В работе по плану",y:21,color:"#718396",url:"point?view=MyPoint&Field1Name=IndicatorId&Field1Value=0&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"},{name:"Выполнено",y:27,color:"#3cd79a",url:"point?view=MyPoint&Field1Name=IndicatorId&Field1Value=4&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"},{name:"Просрочено",y:98,color:"#ff6666",url:"point?view=MyPoint&Field1Name=IndicatorId&Field1Value=3&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"}]}]});$(window).resize(function(){o.setSize(e().width,e().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'WidgetLibrary',
            elementname: 'PointsFromMe',
            content: [
                '<div id="PointsFromMe"></div>',
                '<script>$(function(){function e(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var t="PointsFromMe",i=t+"_"+Date.now();$("#"+t).attr("id",i);var o=new Highcharts.Chart({chart:{type:"pie",renderTo:i,width:e().width,height:e().height},title:{text:""},legend:{enabled:!1},exporting:{enabled:!1},credits:{enabled:!1},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},yAxis:{title:{text:""}},plotOptions:{pie:{allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,distance:5,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#666"},formatter:function(){return this.y}}},series:{cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"В работе по плану",y:38,color:"#718396",url:"point?view=PointFromMe&Field1Name=IndicatorId&Field1Value=0&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"},{name:"Выполнено",y:29,color:"#3cd79a",url:"point?view=PointFromMe&Field1Name=IndicatorId&Field1Value=4&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"},{name:"Просрочено",y:133,color:"#ff6666",url:"point?view=PointFromMe&Field1Name=IndicatorId&Field1Value=3&Field2Name=IsMilestone&Field2Value=1&ExpandGroup=true&hideFilterPanel=1&ViewSampleId=null"}]}]});$(window).resize(function(){o.setSize(e().width,e().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'WidgetLibrary',
            elementname: 'MyMeetings',
            content: [
                '<div id="MyMeetings"></div>',
                '<script>$(function(){function e(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var t="MyMeetings",i=t+"_"+Date.now();$("#"+t).attr("id",i);var n=new Highcharts.Chart({chart:{type:"pie",renderTo:i,width:e().width,height:e().height},title:{text:""},legend:{enabled:!1},exporting:{enabled:!1},credits:{enabled:!1},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},yAxis:{title:{text:""}},plotOptions:{pie:{innerSize:"75%",allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,distance:5,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#666"},formatter:function(){return this.y}}},series:{cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"В работе",y:1,color:"#718396",url:"meeting?view=MyMeeting&Field1Name=IndicatorId&Field1Value=0"},{name:"Проведено",y:2,color:"#27bdbe",url:"meeting?view=MyMeeting&Field1Name=IndicatorId&Field1Value=8"},{name:"Просрочено",y:14,color:"#ff6666",url:"meeting?view=MyMeeting&Field1Name=IndicatorId&Field1Value=3"}]}]});$(window).resize(function(){n.setSize(e().width,e().height,!0)})});</script>'
            ].join('')
        },
        {
            pagename: 'WidgetLibrary',
            elementname: 'MyRisksPie',
            content: [
                '<div id="MyRisksPie"></div>',
                '<script>$(function(){function t(){return{width:$("#"+i).closest(".widget__body-data").width(),height:$("#"+i).closest(".widget__body-data").height()}}var e="MyRisksPie",i=e+"_"+Date.now();$("#"+e).attr("id",i);var o=new Highcharts.Chart({chart:{type:"pie",renderTo:i,width:t().width,height:t().height},title:{text:""},legend:{enabled:!1},exporting:{enabled:!1},credits:{enabled:!1},tooltip:{backgroundColor:"rgba(51,51,51,0.85)",borderColor:"transparent",shadow:!1,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#fff"},formatter:function(){return this.point.name+": <b>"+this.y+"</b>"}},yAxis:{title:{text:""}},plotOptions:{pie:{allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!0,distance:5,style:{fontFamily:"Proximanova-Regular",fontSize:"12px",color:"#666"},formatter:function(){return this.y}}},series:{cursor:"pointer",point:{events:{click:function(){location.href=this.options.url}}}}},series:[{data:[{name:"Низкий",y:3,color:"#3cd79a",url:"risk?view=MyActivityRisk&Field1Name=IndicatorId&Field1Value=001&ExpandGroup=true"},{name:"Средний",y:2,color:"#ffb652",url:"risk?view=MyActivityRisk&Field1Name=IndicatorId&Field1Value=002&ExpandGroup=true"},{name:"Высокий",y:2,color:"#ff6666",url:"risk?view=MyActivityRisk&Field1Name=IndicatorId&Field1Value=003&ExpandGroup=true"}]}]});$(window).resize(function(){o.setSize(t().width,t().height,!0)})});</script>'
            ].join('')
        }
    ];
    that.loadContent = function(){
        var elem = that.contents.filter(function(d){
            return d.pagename == that.data.pagename && d.elementname == that.data.elementname;
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