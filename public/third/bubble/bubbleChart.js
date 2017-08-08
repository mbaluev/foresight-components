if (typeof BubbleChart === 'undefined') {
    var BubbleChart = (function(){
        function BubbleChart(containerid, data) {
            this.containerid = containerid;
            this.data = data;
            this.tooltip = this.CustomTooltip("gates_tooltip_" + Date.now(), 240);
            this.layout_gravity = -0.01;
            this.max_radius = 80;
            this.min_radius = 2;
            this.damper = 0.1;
            this.vis = null;
            this.nodes = [];
            this.force = null;
            this.circles = null;
            this.fill_color = d3.scale.ordinal().domain(["low", "medium", "high", 3, 2, 0]).range(["#ff6666", "#00a1f4", "#3cd79a", "#ff6666", "#00a1f4", "#3cd79a"]);
            this.max_amount = d3.max(this.data, function (d) {
                return parseInt(d.total_amount);
            });
            this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, this.max_amount]).range([this.min_radius, this.max_radius]);
            this.total_square = 0;
            this.m_timer = null;
            this.data.forEach((function (_this) {
                return function (d) {
                    var radius = _this.radius_scale(parseInt(d.total_amount));
                    _this.total_square += Math.PI * radius * radius;
                    return _this.total_square;
                };
            })(this));
            this.total_radius = Math.sqrt(this.total_square * 2 / Math.PI);
            this.resize_nodes();
            this.create_nodes();
            this.create_vis();
            this.start();
            this.display_group_all();
            this.bind_resize();
        }
        BubbleChart.prototype.resize_nodes = function () {
            this.width = $(this.containerid).outerWidth();
            this.height = $(this.containerid).outerHeight();
            this.center = {
                x: this.width / 2,
                y: this.height / 2
            };
            this.year_centers = {
                "2008": {
                    x: this.width / 3,
                    y: this.height / 2
                },
                "2009": {
                    x: this.width / 2,
                    y: this.height / 2
                },
                "2010": {
                    x: 2 * this.width / 3,
                    y: this.height / 2
                }
            };
            this.max_radius = ( Math.min(this.width, this.height) / 2 ) * 80 / this.total_radius;
            this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, this.max_amount]).range([this.min_radius, this.max_radius]);
            this.nodes.forEach((function (_this) {
                return function (d) {
                    d.radius = _this.radius_scale(parseInt(d.value));
                };
            })(this));
        };
        BubbleChart.prototype.create_nodes = function () {
            this.data.forEach((function (_this) {
                return function (d) {
                    var node;
                    node = {
                        id: d.id,
                        radius: _this.radius_scale(parseInt(d.total_amount)),
                        value: d.total_amount,
                        name: d.grant_title,
                        org: d.organization,
                        group: d.group,
                        year: d.start_year,
                        projectid: d.projectid,
                        projectname: d.projectname,
                        projectcode: d.projectcode,
                        contractscount: d.contractscount,
                        x: Math.random() * this.width,
                        y: Math.random() * this.height
                    };
                    return _this.nodes.push(node);
                };
            })(this));
            return this.nodes.sort(function (a, b) {
                return b.value - a.value;
            });
        };
        BubbleChart.prototype.resize_vis = function () {
            d3.select(this.containerid).select("svg").attr("width", this.width).attr("height", this.height);
            return this.circles.transition().duration(200).attr("r", function (d) {
                return d.radius;
            });
        };
        BubbleChart.prototype.create_vis = function () {
            var that;
            this.vis = d3.select(this.containerid).append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
            this.circles = this.vis.selectAll("circle").data(this.nodes, function (d) {
                return d.id;
            });
            that = this;
            this.circles.enter().append("circle").attr("r", 0).attr("fill", (function (_this) {
                return function (d) {
                    return _this.fill_color(d.group);
                };
            })(this)).attr("stroke-width", 2).attr("stroke", (function (_this) {
                return function (d) {
                    return d3.rgb(_this.fill_color(d.group)).darker(.25);
                };
            })(this)).attr("id", function (d) {
                return "bubble_" + d.id;
            }).on("mouseover", function (d, i) {
                return that.show_details(d, i, this);
            }).on("mousemove", function (d, i) {
                return that.show_details(d, i, this);
            }).on("mouseout", function (d, i) {
                return that.hide_details(d, i, this);
            });

            return this.circles.transition().duration(2000).attr("r", function (d) {
                return d.radius;
            });
        };
        BubbleChart.prototype.charge = function (d) {
            return -Math.pow(d.radius, 2.0) / 8;
        };
        BubbleChart.prototype.start = function () {
            this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
            //this.vis.selectAll("circle").call(this.force.drag);
            return this.force;
        };
        BubbleChart.prototype.display_group_all = function () {
            this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function (_this) {
                return function (e) {
                    return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function (d) {
                        return d.x;
                    }).attr("cy", function (d) {
                        return d.y;
                    });
                };
            })(this));
            this.force.start();
            return this.hide_years();
        };
        BubbleChart.prototype.move_towards_center = function (alpha) {
            return (function (_this) {
                return function (d) {
                    d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.01) * alpha;
                    return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.01) * alpha;
                };
            })(this);
        };
        BubbleChart.prototype.display_by_year = function () {
            this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function (_this) {
                return function (e) {
                    return _this.circles.each(_this.move_towards_year(e.alpha)).attr("cx", function (d) {
                        return d.x;
                    }).attr("cy", function (d) {
                        return d.y;
                    });
                };
            })(this));
            this.force.start();
            return this.display_years();
        };
        BubbleChart.prototype.move_towards_year = function (alpha) {
            return (function (_this) {
                return function (d) {
                    var target;
                    target = _this.year_centers[d.year];
                    d.x = d.x + (target.x - d.x) * (_this.damper - 0.01) * alpha * 1.1;
                    return d.y = d.y + (target.y - d.y) * (_this.damper - 0.01) * alpha * 1.1;
                };
            })(this);
        };
        BubbleChart.prototype.display_years = function () {
            var years, years_data, years_x;
            years_x = {
                "2008": 160,
                "2009": this.width / 2,
                "2010": this.width - 160
            };
            years_data = d3.keys(years_x);
            years = this.vis.selectAll(".years").data(years_data);
            return years.enter().append("text").attr("class", "years").attr("x", (function (_this) {
                return function (d) {
                    return years_x[d];
                };
            })(this)).attr("y", 40).attr("text-anchor", "middle").text(function (d) {
                return d;
            });
        };
        BubbleChart.prototype.hide_years = function () {
            var years;
            return years = this.vis.selectAll(".years").remove();
        };
        BubbleChart.prototype.show_details = function (data, i, element) {
            var content;
            d3.select(element).attr("stroke", (function (_this) {
                return function (d) {
                    return d3.rgb(_this.fill_color(d.group)).darker();
                };
            })(this));
            content = "<span class=\"value\"> " + data.projectcode + ". " + data.projectname + "</span><br><br>";
            content += "<span class=\"name\">Всего контрактов: </span><span class=\"value\">" + data.contractscount + "</span><br/>";
            content += "<span class=\"name\">На сумму: </span><span class=\"value\">" + data.value + " млн.руб.</span>";
            return this.tooltip.showTooltip(content, d3.event);
        };
        BubbleChart.prototype.hide_details = function (data, i, element) {
            d3.select(element).attr("stroke", (function (_this) {
                return function (d) {
                    return d3.rgb(_this.fill_color(d.group)).darker(.25);
                };
            })(this));
            //d3.select(element).attr("opacity", "1");
            /*d3.select(element).attr("fill", (function(_this) {
             return function(d) {
             return _this.fill_color(d.group);
             };
             })(this));*/
            return this.tooltip.hideTooltip();
        };
        BubbleChart.prototype.bind_resize = function () {
            var that = this;
            $(window).resize(function () {
                resize();
            });
            function resize() {
                if (that.m_timer == null) {
                    that.m_timer = window.setTimeout(function () {
                        that.resize_nodes();
                        that.resize_vis();
                        that.display_group_all();
                        window.clearTimeout(that.m_timer);
                        that.m_timer = null;
                    }, 100);
                }
            }
        };
        BubbleChart.prototype.CustomTooltip = function (tooltipId, width) {
            var tooltipId = tooltipId;
            $("body").append("<div class='tooltip-bubble' id='" + tooltipId + "'></div>");
            if (width) {
                $("#" + tooltipId).css("width", width);
            }
            hideTooltip();
            function showTooltip(content, event) {
                $("#" + tooltipId).html(content);
                $("#" + tooltipId).show();
                updatePosition(event);
            }
            function hideTooltip() {
                $("#" + tooltipId).hide();
            }
            function updatePosition(event) {
                var ttid = "#" + tooltipId;
                var xOffset = 20;
                var yOffset = 10;

                var ttw = $(ttid).width();
                var tth = $(ttid).height();
                var wscrY = $(window).scrollTop();
                var wscrX = $(window).scrollLeft();
                var curX = (document.all) ? event.clientX + wscrX : event.pageX;
                var curY = (document.all) ? event.clientY + wscrY : event.pageY;
                var ttleft = ((curX - wscrX + xOffset * 4 + ttw) > $(window).width()) ? curX - ttw - xOffset : curX + xOffset;
                if (ttleft < wscrX + xOffset) {
                    ttleft = wscrX + xOffset;
                }
                var tttop = ((curY - wscrY + yOffset * 4 + tth) > $(window).height()) ? curY - tth - yOffset : curY + yOffset;
                if (tttop < wscrY + yOffset) {
                    tttop = curY + yOffset;
                }
                $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
            }
            return {
                showTooltip: showTooltip,
                hideTooltip: hideTooltip,
                updatePosition: updatePosition
            };
        };
        return BubbleChart;
    })();
}