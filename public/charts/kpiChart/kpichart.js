;(function(){
    var $ = jQuery;
	var bigNumber = 10000000;
    var kpiOptions = (function(){
        function kpiOptions(id, source){
            this.id = id;
            this.selector = "#" + this.id;
            this.source = source;
            this.data = null;
            this.startDate = null;
            this.endDate = null;
            this.startYear = null;
            this.endYear = null;
            this.makeData();
        };
        kpiOptions.prototype.makeData = function(){
            // ---
            // here convert this.source to kpidata and save to this.data
            // ---
            //this.data = kpidata;			
			var data = [];
			var source = this.source;
			source[0].map(function(item){ 
				data.push({	
					id: item.id,
					parentid: item.parentid,
					name: item.Name,
					kpitypeid: item.kpitypeid,
					impact: item.pctImpact,
					impactsum: null,
					typeid: item.typeid,
					values: Enumerable.From(source[1]).Where('$.ParentId ==='+item.id).Select('{year: Math.floor($.D_MonthId/100), valueunit: $.Unit, unitplan: $.Plan, unitfact:$.Fact, valuepercent: $.Percent}').ToArray()
				});
			});
			this.data = data;
            this.startDate = this.getStartDate();
            this.endDate = this.getEndDate();
        };
        kpiOptions.prototype.getStartDate = function(){
            var minYear ;
            this.data.forEach(function(item, i, arr){
                item.values.forEach(function(value, v, values){
                    if (typeof(minYear) == "undefined" || minYear == null) minYear = value.year;
                    if (value.year < minYear) {
                        minYear = value.year;
                    }
                });
            });
            this.startYear = minYear;
            var date = new Date(minYear, 0, 1);
            return date;
        };
        kpiOptions.prototype.getEndDate = function(){
            var maxYear;
            this.data.forEach(function(item, i, arr){
                item.values.forEach(function(value, v, values){
                    if (typeof(maxYear) == "undefined" || maxYear == null) maxYear = value.year;
                    if (value.year > maxYear){
                        maxYear = value.year;
                    }
                });
            });
            this.endYear = maxYear;
            var date = new Date(maxYear, 11, 1);
            date.setMonth(date.getMonth() + 1);
            return date;
        };
        return kpiOptions;
    })();
    var kpiChart = (function(){
        function kpiChart(options){
            this.options = options;
            this.build();
            this.events();
            this.initBrush();
        };
        kpiChart.prototype.toEmpty = function(value){
			if (value === undefined || value === null)
				return '';
			else return value;
		}
		kpiChart.prototype.makeElementRight = function(element) {
            var result = "";
            var data = this.options.data;

			if (element.typeid == 1){
				result += "<li class='p-node p-expandOpen' itemid='" + element.id + "' data-level-id='" + element.level + "'>";
			}			
			else if (element.typeid == 2){
				result += "<li class='p-node p-node-kpi-list p-expandOpen' itemid='" + element.id + "' data-level-id='" + element.level + "'>";
			}
			else if (element.typeid == 3){
				result +="<li class='p-node p-expandLeaf' itemid='" + element.id + "'>";
			}
			
			result += "<div class='p-node-wrapper'>";
			result += "<div class='p-content' >";
			result += "<div class='p-content-node'>";
			
			var countcol = 0;
			var allwidth = 0;
			for (var i=0;i < element.values.length;i++){
				countcol++;
				var value = element.values[i];
				var offset = i;
				var width = 1/element.values.length;
				if (element.values.length == 24 && countcol%3 == 0) {
					var allwidthright = 100 / 8 * countcol/3;
					//var widhtcalc = Math.floor((100*width)*100)/100;
                    var widhtcalc = ((100*width)*100)/100;
					var delta = allwidthright - allwidth - widhtcalc;
					var ww = widhtcalc + delta;
					result += "<div class='p-caption-item' style='width:" + ww + "%'>";
					allwidth += ww;
				}
				else {
					//result += "<div class='p-caption-item' style='width:" + Math.floor((100*width)*100)/100 + "%'>";
                    result += "<div class='p-caption-item' style='width:" + ((100*width)*100)/100 + "%'>";
					//allwidth += Math.floor((100*width)*100)/100;
                    allwidth += ((100*width)*100)/100;
				}
				
				var percentclass;
				if (value.valuepercent == 100){
					percentclass = "p-success";
				}
				else if(value.valuepercent >= 75){
					percentclass = "p-warning";
				}
				else {
					percentclass = "p-danger";
				}
				
				result += "<div class='p-percent " + percentclass + "' style='width: " + value.valuepercent + "%;'></div>";
				if (element.typeid == 3){
					result += "<div class='p-percent-text'><div class='p-value'>" + value.valuepercent + "% (" + value.unitfact + " " + value.valueunit + " из " + value.unitplan + " " + value.valueunit + ")</div></div>";
				}
				else{
					result += "<div class='p-percent-text'><div class='p-value'>" + value.valuepercent + "%</div></div>";
				}
				result += "</div>"; //caption-item
			}
			
			result += "</div>"; //content-node
			result += "</div>"; //content
			
			var childs = Enumerable.From(data).Where("$.parentid == " + element.id).ToArray();
			if (childs.length > 0){
				result += "<ul class='p-container'>";
				for (var i=0;i<childs.length;i++){
					if (!childs[i].hasOwnProperty('level')){
						childs[i].level = element.level+1;
					}
					result += this.makeElementRight(childs[i]);
				}
				result += "</ul>";
			}
			
			result += "</div>"; //node-wrapper
			result += "</li>";
			return result;
		}
        kpiChart.prototype.makeElementLeft = function(element) {
            var result = "";
            var data = this.options.data;
			var padding;
			var className = ["goal","goal","kpi"][element.typeid-1];
			if (element.typeid == 1){
				padding = 10+20*(element.level-1);
			}
			else if (element.typeid == 2){
				padding = 20*(element.level-1);
			}
			
			if (element.typeid == 3){
				result += "<li class='p-node p-expandLeaf' itemid='" + element.id + "'>";
			}
			else if (element.typeid == 2){
				result += "<li class='p-node p-node-kpi-list p-expandOpen' style='padding-left: " + padding + "px;' itemid='" + element.id + "' data-level-id='" + element.level + "'>";
			}
			else if (element.typeid == 1){
				result += "<li class='p-node p-expandOpen' itemid='" + element.id + "' data-level-id='" + element.level + "'>";
			}
			result += "<div class='p-node-wrapper'>";
			result += "<div class='p-content' " + (element.typeid == 1?"style='padding-left: " + padding + "px;'":"") + ">";
			if (element.typeid == 1 || element.typeid == 2){
				result += "<div class='p-expand' data-itemid='" + element.id + "'></div>";
			}
			result += "	<div class='p-content-node'>";
			
			result += "<div class='p-kpi-dynamic pull-right'>" + (element.kpitypeid == 1?"<div class='p-arrow p-arrow-up'></div>":"") + "</div>";
			result += "<div class='p-kpi-weight pull-right'>" + this.toEmpty(element.impact) + "</div>";
			result += "<div class='p-kpi-summ pull-right'>" + this.toEmpty(element.impactsum) + "</div>";
			if ((element.id-element.typeid*bigNumber) > 0) {
				result += "<div class='p-kpi-name'><a href='/asyst/" + className + "/form/auto/" +(element.id-element.typeid*bigNumber) + "?mode=view' target='_blank'>" + element.name + "</a></div>";
			} 
			else {
				result += "<div class='p-kpi-name'>" + element.name + "</div>";
			}
			
			
			result += "</div>"; //p-content-node
			result += "</div>"; //p-content
			
			var childs = Enumerable.From(data).Where("$.parentid == " + element.id).ToArray();
			if (childs.length > 0){
				result += "<ul class='p-container'>";
				for (var i=0;i<childs.length;i++){
					if (!childs[i].hasOwnProperty('level')){
						childs[i].level = element.level+1;
					}
					result += this.makeElementLeft(childs[i]);
				}
				result += "</ul>";
			}
			
			result += "</div>"; //p-node-wrapper
			result += "</li>"; //p-node
			return result;
        }
        kpiChart.prototype.makeYearHead = function(minYear, maxYear){
			var result = "";
			for(var year = minYear; year <= maxYear;year++){
				for(var quarter=0; quarter < 4; quarter++){
					result += "<div class='p-caption-item'>";
					result += "	<div class='p-caption-years'>";
					result += "		<div class='p-caption-year'><div class='p-value'>" + year + "</div></div>";
					result += "	</div>";
					result += "	<div class='p-caption-quarters'>";
					result += "		<div class='p-caption-quarter'><div class='p-value'>" + (quarter+1) + "-й квартал</div></div>";
					result += "	</div>";
					result += "	<div class='p-caption-months'>";
					for(var month = 0; month<3; month++){
						result += "		<div class='p-caption-month'><div class='p-value'>" + Globa.Months3[quarter*3+month].locale() + "</div></div>";
					}
					result += "	</div>";
					result += "</div>";
				}
			}
			return result;
		}
		kpiChart.prototype.makeLevels = function(maxLevels){
			var result = ""
			for (var i=1;i <= maxLevels;i++){
				result += "				<li " + (i==maxLevels?"class='active'":"")+ "data-level='" + i + "'>" + i + "</li>";
			}
			return result;
		}
		kpiChart.prototype.build = function(){
            this.head = $("<div class='p-row-head'></div>");
            this.content = $("<div class='p-row-content'></div>");
            var data = this.options.data;
            var root = data[0]; //
            root.level = 1;
            var rightPartString = this.makeElementRight(root);
			var leftPartString = this.makeElementLeft(root);
			//var minYear=root.values[0].year, maxYear=root.values[0].year;
			var minYear=9999, maxYear=0, maxLevels=0;
			
			data.map(function(el){ el.values.map(function(val){ 
				if (val.year > maxYear) maxYear = val.year;
				if (val.year < minYear) minYear = val.year;
			}) 
				if (el.level > maxLevels) maxLevels = el.level;
			});
			var yearHeadStr = this.makeYearHead(minYear, maxYear);			
			var levelsStr = this.makeLevels(maxLevels);

            $(this.options.selector).append(
                "<style> .p-caption-item {width: " + 100/(4*(maxYear-minYear+1))+ "%} </style>" + 
                "<div class='p-row-head'>" +
                "	<div class='p-col-kpi-names'>" +
                "		<div class='p-top-buttons'>" +
                "			<ul class='p-top-levels pull-left'>" +
                levelsStr+
                "			</ul>" +
                "			<ul class='p-top-levels pull-right'>" +
                "				<div class='p-arrow p-arrow-left' id='p-hide-show' data-maxLevels='" + maxLevels + "'></div>" +
                "			</ul>" +
                "		</div>" +
                "		<div class='p-kpi-names-head'>" +
                "			<div class='p-kpi-dynamic pull-right'>&nbsp;</div>" +
                "			<div class='p-kpi-weight pull-right'>Вес</div>" +
                "			<div class='p-kpi-summ pull-right'>∑</div>" +
                "			<div class='p-kpi-name'>Наименование цели / показателя</div>" +
                "		</div>" +
                "	</div>" +
                "	<div class='p-col-kpi-values'>" +
                "		<div class='p-col-kpi-values-content' style='width: 100%; margin-left: 0;'>" +
				yearHeadStr+                
                "		</div>" +
                "	</div>" +
                "</div>" +
                "<div class='p-row-content'>" +
                //"	<div class='spinner center'></div>" +
                "	<div class='p-col-kpi-names'>" +
                "		<div class='p-kpi-tree'>" +
                "			<ul class='p-container'>" +
                leftPartString +
                "			</ul>" +
                "		</div>" +
                "		<div class='p-kpi-scale'></div>" +
                "	</div>" +
                "	<div class='p-col-kpi-values'>" +
                "		<div class='p-kpi-tree' style='width: 100%; margin-left: 0;'>" +
                "			<ul class='p-container'>" +
				rightPartString +                
                "			</ul>" +
                "		</div>" +
                "		<div class='p-kpi-scale' id='p-kpi-scale'></div>" +
                "	</div>" +
                "</div>"
            );
			
			var width = $('#p-kpi').parent().parent().width();
			$('#p-kpi').parent().width(width % 2 == 0 ? width : width - 1);
        };
        kpiChart.prototype.events = function(){
            $('.p-kpi .p-expand').each(function(){
                var that = $(this);
                var itemid = that.data('itemid');
                $(this).click(function(){
                    $('.p-kpi li[data-level]').removeClass('active');
                    $('.p-kpi [itemid="'+ itemid +'"]').toggleClass('p-expandOpen');
                    $('.p-kpi [itemid="'+ itemid +'"]').toggleClass('p-expandClosed');
                    $('.p-kpi [itemid="'+ itemid +'"] > .p-node-wrapper > ul.p-container').animate({height: "toggle"}, 150, "easeInQuad", function(){});
                });
            });
            $('.p-kpi li[data-level]').click(function(){
                var that = $(this);
                var level = that.data('level');
                $('.p-kpi li[data-level]').removeClass('active');
                that.addClass('active');
                showLevel(level);
            });
            function showLevel(levelid){
                $('.p-kpi [data-level-id]').each(function(){
                    var datalevelid = $(this).data('level-id');
                    if (datalevelid >= levelid) {
                        //collapse
                        if ($(this).hasClass('p-expandOpen')) $(this).removeClass('p-expandOpen');
                        if (!$(this).hasClass('p-expandClosed')) $(this).addClass('p-expandClosed');
                        $(this).children('.p-node-wrapper').children('ul.p-container').animate({height: "hide"}, 150, "easeInQuad", function(){});
                    } else {
                        //expand
                        if ($(this).hasClass('p-expandClosed')) $(this).removeClass('p-expandClosed');
                        if (!$(this).hasClass('p-expandOpen')) $(this).addClass('p-expandOpen');
                        $(this).children('.p-node-wrapper').children('ul.p-container').animate({height: "show"}, 150, "easeInQuad", function(){});
                    }
                });
            }
            $('#p-hide-show').click(function(){
                $('.p-kpi').toggleClass('p-collapsed');
				
				if ($('.p-kpi').hasClass('p-collapsed')) {
					var maxlevels = $(this).data('maxlevels') - 1;
					
					var minLeftWidth = 0;
					var minLeftWidthEl = $('[data-level-id=' + maxlevels + ']')[0];
					if ($(minLeftWidthEl).hasClass('p-node-kpi-list'))
						minLeftWidth = parseInt(minLeftWidthEl.style.paddingLeft) + 40;
					else 
						minLeftWidth = parseInt($(minLeftWidthEl).find('.p-content')[0].style.paddingLeft) + 40;
					
					$('.p-kpi.p-collapsed .p-col-kpi-names').css('width', minLeftWidth);
					$('.p-kpi.p-collapsed .p-col-kpi-values').css('margin-left', minLeftWidth);
				}
				else {
					$('.p-kpi .p-col-kpi-names').removeAttr('style');
					$('.p-kpi .p-col-kpi-values').removeAttr('style');
				}
            });
			
			// для совпадения вертикальных линий в левой части
			$(window).resize(function(){
				var width = $('#p-kpi').parent().parent().width();
				$('#p-kpi').parent().width(width % 2 == 0 ? width : width - 1);
			});
        };
        kpiChart.prototype.initBrush = function(){
            var self = this;
            var widthContainer, width, height, x, svg, g, dbrush = [],
                options = this.options,
                containerID = "p-kpi-scale",
                containerSelector = "#" + containerID,
                resizeContainerSelector = ".p-col-kpi-values > .p-col-kpi-values-content, .p-col-kpi-values > .p-kpi-tree",
                margin = {
                top: 0,
                bottom: 20,
                right: 0,
                left: 0
            },
                brushHeight = 100;
            init();
            function init(){
				d3.timeFormatDefaultLocale({
					dateTime: "%x, %X",
					date: "%Y.%m.%d",
					time: "%H:%M:%S	",
					periods: ["AM", "PM"],
					days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
					shortDays: ["Вос", "Пон", "Вт", "Ср", "Чет", "Пят", "Суб"],
					months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
					shortMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
				});
                x = d3.scaleTime().domain([options.startDate, options.endDate]);
                svg = d3.select(containerSelector).append("svg");
                g = svg.append("g");
                g.append("g").attr("class", "axis axis--grid").selectAll(".tick").classed("tick--minor", function(d) { return d.getMonth(); });
                g.append("g").attr("class", "axis axis--x").attr("text-anchor", null);
                g.append("g").attr("class", "brush");
                render();
                initresize();
            };
            function render(){
                widthContainer = parseInt(d3.select(containerSelector).style('width'), 10);
                updateDimentions(widthContainer);

                // reset x range
                x.rangeRound([0, width]);

                // do the actual resize...
                svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.select('.axis--grid')
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x)
                        .ticks(d3.timeMonth.every(1))
                        .tickSize(-height)
                        .tickFormat(function() { return null; }));

                svg.select('.axis--x')
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x)
                        .tickFormat(d3.timeFormat("%Y %b"))
                        .tickPadding(0))
                    .selectAll("text")
                    .attr("x", 30);

                svg.select('.brush')
                    .call(d3.brushX()
                        .extent([[0, 0], [width, height]])
                        .on("end", brushended))
                    .call(d3.brushX().move, dbrush.map(x));
            };
            function brushended(){
                if (!d3.event.sourceEvent) return; // Only transition after input.
                if (!d3.event.selection) return; // Ignore empty selections.
                var d0 = d3.event.selection.map(x.invert),
                    d1 = d0.map(d3.timeMonth.round);

                // If empty when rounded, use floor & ceil instead.
                if (d1[0] >= d1[1]) {
                    d1[0] = d3.timeMonth.floor(d0[0]);
                    d1[1] = d3.timeMonth.offset(d1[0]);
                }

                dbrush = d1;
                d3.select(this).transition().call(d3.event.target.move, d1.map(x));

                var monthDiffTotal = options.endDate.getMonth() -  options.startDate.getMonth() + (12 * ( options.endDate.getFullYear() -  options.startDate.getFullYear()));
                var monthDiffSel = d1[1].getMonth() - d1[0].getMonth() + (12 * (d1[1].getFullYear() - d1[0].getFullYear()));
                var monthDiffMargin = d1[0].getMonth() -  options.startDate.getMonth() + (12 * (d1[0].getFullYear() -  options.startDate.getFullYear()));

                var width_total = monthDiffTotal*100/monthDiffSel;
                var width_margin = monthDiffMargin*width_total/monthDiffTotal;

                $(resizeContainerSelector)
                    .css('width', width_total + '%')
                    .css('margin-left', -width_margin + '%');
            };
            function updateDimentions(w){
                width = w - margin.left - margin.right;
                height = brushHeight - margin.top - margin.bottom;
            };
            function initresize(){
                var resizeElement = document.getElementById(containerID);
                addResizeListener(resizeElement, render);
            };
        };
        return kpiChart;
    })();
    $(function(){
		$(document).on("updateKPIChart",function(event, data){
			var contID = "p-kpi";
			Loader.show();
			Asyst.APIv2.DataSet.load({name:'GoalTree',data:data, async:true, success: function(data){
				$('#'+contID).empty();
				var options = new kpiOptions(contID, data);
				var kpichart = new kpiChart(options);
				Loader.hide();
				
			},
			error:function(){
				Loader.hide();
			}
			});
			//var data = null;
			
		});
    });
}).call(this);