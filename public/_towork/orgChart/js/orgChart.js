/**
 * Created by mbaluev on 15.11.2016.
 */

;(function(){
    // [CHANGE] Создаю неймспейсы
    // begin
    window.Asyst = window.Asyst || {};
    Asyst.Workspace = Asyst.Workspace || {};
    var root = Asyst.Workspace.Points = {};
    //end

    var $ = jQuery;
    var ktDom = root.ktDom = (function(){
        function ktDom(id, filter){
            var self = this;
            this.id = id;
            this.selector = "#" + this.id;
            this.filter_obj = {
                filter: filter,
                filter_apply: [],
                filter_timeout: null,
                filter_old_input_value: "",
                filter_input_delay: 500,
                objects: {
                    select_y: null,
                    select_color: null,
                    btn_apply_filter: null,
                    btn_clear_filter: null,
                    btn_legend: null,
                    btn_info: null,
                    btn_full_screen: null,
                    input_filters: []
                }
            };
            this.loaders = [];
            this.options = null;
            this.data = null;
            self.init();
            self.create();
            // create elements
            self.filter_create();
            self.legend_create();
            self.graph_create();
            self.info_create();
        };

        ktDom.prototype.time_start = function(){
            var self = this;
            self.timer2 = Date.now();
        };
        ktDom.prototype.time_console = function(text){
            var self = this;
            console.log(Date.now() - self.timer2 + ' ms ' + text);
            self.timer2 = Date.now();
        };

        ktDom.prototype.init = function(){
            var self = this;
            self.timer = null;
            self.options = {
                _width_legend: 150,
                _width_info: 400
            };
            self.options.width_legend = 0;
            self.options.width_info = 0;
            self.class = {
                panel_filter: "panel-filter",
                panel_filter_functions: "pf-functions",
                panel_filter_buttons: "pf-buttons",
                panel_filter_filters: "pf-filters",
                panel_loader: "panel-loader",
                panel_main: "panel-main",
                panel_graph: "panel-graph",
                panel_legend: "panel-legend",
                panel_info: "panel-info",
                panel_info_header: "pi-header",
                panel_info_body: "pi-body",
            };
            self.dom = {
                spinner_overlay: $('<div class="spinner-overlay"></div>'),
                spinner_container: $('<div class="spinner-container"></div>'),
                spinner: $('<div class="spinner center"></div>'),
                spinner_text: $('<div class="spinner-text"></div>'),
                panel_loader: $('<div class="' + self.class.panel_loader + '"></div>'),
                panel_main: $('<div class="' + self.class.panel_main + '"></div>'),
                panel_filter: $('<div class="' + self.class.panel_filter + '"></div>'),
                panel_legend: $('<div class="' + self.class.panel_legend + ' hide"></div>'),
                panel_graph: $('<div class="' + self.class.panel_graph + '"></div>'),
                panel_info: $('<div class="' + self.class.panel_info + ' hide"></div>'),

                card__header: $([
                    '<div class="card__header">',
                        '<div class="card__header-row">',
                            '<div class="card__header-column ' + self.class.panel_filter_functions + '"></div>',
                            '<div class="card__header-column ' + self.class.panel_filter_buttons + '"></div>',
                        '</div>',
                        '<div class="card__header-row">',
                            '<div class="card__header-column ' + self.class.panel_filter_filters + '"></div>',
                        '</div>',
                    '</div>'
                ].join('')),

                card: $([
                    '<div class="card">',
                        '<div class="card__header">',
                            '<div class="card__header-row tabs"></div>',
                        '</div>',
                        '<div class="card__main"></div>',
                    '</div>',
                ].join('')),
                tabs__list: $('<ul class="tabs__list"></ul>'),
                tabs_array: {
                    filtered: $([
                        '<li class="tabs__tab tabs__tab_active">',
                            '<a class="tabs__link link" href="#filtered" data-fc="tab">',
                                '<button class="button" data-fc="button" data-width="110">',
                                    '<span class="button__text">Точки (0)</span>',
                                '</button>',
                            '</a>',
                        '</li>',
                    ].join('')),
                    selected: $([
                        '<li class="tabs__tab">',
                            '<a class="tabs__link link" href="#selected" data-fc="tab">',
                                '<button class="button" data-fc="button" data-width="120">',
                                    '<span class="button__text">Выбранные (0)</span>',
                                '</button>',
                            '</a>',
                        '</li>',
                    ].join('')),
                    connected: $([
                        '<li class="tabs__tab">',
                            '<a class="tabs__link link" href="#connected" data-fc="tab">',
                                '<button class="button" data-fc="button" data-width="130">',
                                    '<span class="button__text">Точка</span>',
                                '</button>',
                            '</a>',
                        '</li>',
                    ].join(''))
                },
                tabs__content: $('<div class="card__middle-scroll tabs__content"></div>'),
                tabs__pane_array: {
                    filtered: $('<div class="tabs__pane tabs__pane_active" id="filtered"></div>'),
                    selected: $('<div class="tabs__pane" id="selected"></div>'),
                    connected: $('<div class="tabs__pane" id="connected"></div>')
                },

                select_report_calendar: null,
            };
        };
        ktDom.prototype.create = function(){
            var self = this;
            $(self.selector).append(self.dom.panel_main);
            self.dom.panel_legend.css({
                width: self.options.width_legend
            });
            self.dom.panel_graph.css({
                left: self.options.width_info,
                right: self.options.width_legend
            });
            self.dom.panel_info.css({
                width: self.options.width_info
            });
            self.dom.panel_main.append(
                self.dom.panel_filter.append(self.dom.card__header),
                self.dom.panel_legend,
                self.dom.panel_graph,
                self.dom.panel_info
            );
        };

        ktDom.prototype.graph_create = function(){
            var self = this;
            self.dom.panel_graph.css('top', self.dom.panel_filter.height());
        };

        ktDom.prototype.filter_create = function(){
            var self = this;

            /*y-dimentions*/
            var $yselect = $('<select id="y-dimention" data-placeholder="Ось Y"></select>');
            $yselect.append($('<option value="byLevel" selected="selected">Ось Y: по уровню КТ</option>'));
            $yselect.append($('<option value="byPortfolio">Ось Y: по портфелю</option>'));
            $yselect.append($('<option value="byProject">Ось Y: по проекту</option>'));
            $yselect.append($('<option value="byStatus">Ось Y: по статусу КТ</option>'));
            $yselect.append($('<option value="byLeader">Ось Y: по ответственному</option>'));
            self.dom.card__header.find('.' + self.class.panel_filter_functions).append($yselect);
            $yselect.select({ width: '230px', autoclose: true });
            self.filter_obj.objects.select_y = $yselect;

            /*filter color functions*/
            var $cselect = $('<select id="colortype" data-placeholder="Цвет"></select>');
            $cselect.append($('<option value="colorByLevelId" selected="selected">Цвет: по уровню КТ</option>'));
            $cselect.append($('<option value="colorByPortfolioId">Цвет: по портфелю</option>'));
            $cselect.append($('<option value="colorByProjectId">Цвет: по проекту</option>'));
            $cselect.append($('<option value="colorByStatusId">Цвет: по статусу КТ</option>'));
            $cselect.append($('<option value="colorByLeaderId">Цвет: по ответственному</option>'));
            self.dom.card__header.find('.' + self.class.panel_filter_functions).append($cselect);
            $cselect.select({ width: '230px', autoclose: true });
            self.filter_obj.objects.select_color = $cselect;

            /*-------*/
            /*buttons*/
            /*-------*/

            /*apply filter*/
            $btngroup = $('<span class="button-group" data-fc="button-group"></span>');
            $btn = $([
                '<button class="button" type="button" data-fc="button" data-tooltip="Применить фильтр">',
                '<span class="icon icon_svg_ok"></span>',
                '</button>'
            ].join(''));
            $btngroup.append($btn);
            self.filter_obj.objects.btn_apply_filter = $btn;

            /*clear filter*/
            $btn = $([
                '<button class="button" type="button" data-fc="button" data-tooltip="Очистить фильтр">',
                '<span class="icon icon_svg_trash"></span>',
                '</button>'
            ].join(''));
            $btngroup.append($btn);
            self.filter_obj.objects.btn_clear_filter = $btn;

            /*show-hide info*/
            $btn = $([
                '<button class="button" type="button" data-fc="button" data-tooltip="Скрыть / показать панель информации">',
                '<span class="icon icon_svg_info"></span>',
                '</button>'
            ].join(''));
            $btngroup.append($btn);
            self.filter_obj.objects.btn_info = $btn;

            /*show-hide legend*/
            $btn = $([
                '<button class="button" type="button" data-fc="button" data-tooltip="Скрыть / показать легенду">',
                '<span class="icon icon_svg_bars"></span>',
                '</button>'
            ].join(''));
            $btngroup.append($btn);
            self.filter_obj.objects.btn_legend = $btn;

            self.dom.card__header.find('.' + self.class.panel_filter_buttons).append($btngroup);
            self.dom.card__header.find('.' + self.class.panel_filter_buttons).find('[data-fc="button"]').button();
            self.dom.card__header.find('.' + self.class.panel_filter_buttons).find('[data-tooltip]').tooltip();

            /*-------------*/
            /*filter fileds*/
            /*-------------*/

            /*pre-render filter fields*/
            self.filter_obj.filter.forEach(function(d){
                if (d.type == 'select') {
                    var $select = $('<select data-placeholder="' + d.placeholder + '"></select>');
                    self.dom.card__header.find('.' + self.class.panel_filter_filters).append($select);
                    $select.select({ width: d.width });
                    self.filter_obj.objects.input_filters.push({ id: d.id, type: d.type, input: $select });
                }
                if (d.type == 'input') {
                    var $input = $([
                        '<span class="input input__has-clear" data-fc="input">',
                        '<span class="input__box">',
                        '<input type="text" class="input__control" placeholder="' + d.placeholder + '">',
                        '<button class="button" type="button" data-fc="button">',
                        '<span class="icon icon_svg_close"></span>',
                        '</button>',
                        '</span>',
                        '</span>'
                    ].join(''));
                    self.dom.card__header.find('.' + self.class.panel_filter_filters).append($input);
                    $input.input({ width: d.width });
                    self.filter_obj.objects.input_filters.push({ id: d.id, type: d.type, input: $input });
                }
            });
        };
        ktDom.prototype.filter_bind_events = function(){
            var self = this,
                chart = self.chart,
                options = self.chart.options,
                objects = self.chart.objects,
                functions = self.chart.functions,
                data = self.chart.options.data;

            self.filter_obj.objects.select_y.on('change', function(){
                options.yCurrent = $(this).select('value');
                self.loader_add("#wrapper", "change_y", "Обновление диаграммы");
                setTimeout(function() {
                    chart.graph_calculate();
                    chart.graph_render_yaxis();
                    chart.graph_show_nodes();
                    chart.brush_calculate();
                    chart.brush_render_yaxis();
                    chart.brush_show_nodes();
                    self.loader_remove("change_y");
                    self.loader_add("#wrapper", "update_filtered_panel", "Обновление панели информации");
                    setTimeout(function() {
                        self.info_filtered_render();
                        self.loader_remove("update_filtered_panel");
                    }, 10);
                }, 10);
            });
            self.filter_obj.objects.select_color.on('change', function(){
                functions.color = functions.colors[$(this).select('value')];
                options.colorField = options.colorFields[$(this).select('value')];
                self.loader_add("#wrapper", "change_color", "Обновление");
                setTimeout(function(){
                    chart.graph_show_nodes();
                    self.legend_render();
                    self.loader_remove("change_color");
                }, 10);
            });
            self.filter_obj.objects.btn_legend.on('click', function(){
                self.dom.panel_legend.toggleClass('hide');
                if (self.dom.panel_legend.hasClass('hide')) {
                    self.options.width_legend = 0;
                } else {
                    self.options.width_legend = self.options._width_legend;
                }
                $(window).trigger('resize');
            });
            self.filter_obj.objects.btn_info.on('click', function(){
                $(this).find('.i').toggleClass('i-arrowright');
                $(this).find('.i').toggleClass('i-arrowleft');
                self.dom.panel_info.toggleClass('hide');
                if (self.dom.panel_info.hasClass('hide')) {
                    self.options.width_info = 0;
                } else {
                    self.options.width_info = self.options._width_info;
                }
                $(window).trigger('resize');
            });
            self.filter_obj.objects.btn_clear_filter.on('click', function(){

                // set defaults
                var yCurrentOld = options.yCurrent;
                options.yCurrent = "byLevel";
                var colorCurrent = "colorByLevelId";
                functions.color = functions.colors[colorCurrent];
                options.colorField = options.colorFields[colorCurrent];

                // set selects defaults
                self.filter_obj.objects.select_y.select('check', options.yCurrent);
                self.filter_obj.objects.select_color.select('check', colorCurrent);

                // clear filter inputs
                self.filter_obj.objects.input_filters.forEach(function(obj){
                    obj.input[obj.input.data('_widget').type.replace('-','_')]('clear');
                });

                if (self.filter_obj.filter_apply.length > 0) {
                    clear_all_filters();
                } else {
                    self.loader_add("#wrapper", "clear_filter_options", "Обновление диаграммы");
                    setTimeout(function(){
                        if (chart.objects.selection) {
                            chart.brush_clear_selection();
                            chart.graph_calculate();
                            chart.graph_render_xaxis();
                        }
                        chart.graph_show_nodes();
                        self.legend_render();
                        self.loader_remove("clear_filter_options");
                        self.loader_add("#wrapper", "update_filtered_panel", "Обновление панели информации");
                        setTimeout(function(){
                            self.info_filtered_render();
                            self.loader_remove("update_filtered_panel");
                        }, 10);
                    }, 10);
                }
            });
            self.filter_obj.objects.btn_apply_filter.on('click', function(){
                init_filters();
                set_filter();
                apply_filter();
            });

            // rerender and buind events filters
            self.filter_obj.objects.input_filters.forEach(function(obj){
                obj.input[obj.input.data('_widget').type.replace('-','_')]('destroy');
            });
            self.filter_obj.objects.input_filters = [];
            self.filter_obj.filter.sort(function(a,b){ return b.index - a.index; }).forEach(function(d){
                if (d.type == 'select') {
                    var $select = $('<select ' + (d.multiple ? 'data-mode="check"' : ' data-mode="radio-check"') + ' data-dictionary="' + d.dictionary + '" data-id="' + d.id + '" data-name="' + d.name + '" data-placeholder="' + d.placeholder + '"></select>');
                    self.dom.card__header.find('.' + self.class.panel_filter_filters).append($select);
                    self.chart.options.data.dictionaries[d.dictionary].forEach(function(x) {
                        if (x.id) {
                            var $option = $('<option value="' + x.id + '">' + x.name + '</option>');
                            $select.append($option);
                        }
                    });
                    $select.select({ width: d.width, height: '300px' });
                    self.filter_obj.objects.input_filters.push({ id: d.id, type: d.type, input: $select });
                    $select.on('change', function(){
                        remove_filter(d.id);
                        var value = $(this).select('value');
                        if (value) {
                            add_filter(d.id, d.id, 'equal', value);
                        }
                    });
                }
                if (d.type == 'input') {
                    var $input = $([
                        '<span class="input input__has-clear" data-fc="input" data-width="' + d.width + '">',
                        '<span class="input__box">',
                        '<input type="text" class="input__control" placeholder="' + d.placeholder + '">',
                        '<button class="button" type="button" data-fc="button">',
                        '<span class="icon icon_svg_close"></span>',
                        '</button>',
                        '</span>',
                        '</span>'
                    ].join(''));
                    self.dom.card__header.find('.' + self.class.panel_filter_filters).append($input);
                    $input.input({ width: d.width });
                    self.filter_obj.objects.input_filters.push({ id: d.id, type: d.type, input: $input });
                    $input.on('keyup', function(e){
                        if (e.keyCode == 13) {
                            var value = $(this).input('value');
                            self.filter_obj.filter_old_input_value = value;
                            remove_filter('text');
                            add_filter('text', 'name, code, projectname, portfolioname, leadername', 'contains', [value]);
                            set_filter();
                            apply_filter();
                        }
                    });
                }
            });

            function clear_all_filters(){
                self.filter_obj.filter_apply = [];
                chart.brush_clear_selection();
                set_filter();
                apply_filter();
            };
            function remove_filter(id){
                self.filter_obj.filter_apply = self.filter_obj.filter_apply.filter(function(d) {
                    return d.id !== id;
                });
            };
            function add_filter(id, fields, method, values){
                self.filter_obj.filter_apply.push({
                    id: id,
                    fields: fields.split(','),
                    method: method,
                    values: values,
                });
            };
            function init_filters(){
                self.filter_obj.objects.input_filters.forEach(function(d){
                    if (d.type == 'select') {
                        var value = d.input.select('value');
                        remove_filter(d.id);
                        if (value.length > 0) {
                            add_filter(d.id, d.id, 'equal', value);
                        }
                    } else if (d.type == 'input') {
                        var value = d.input.input('value');
                        self.filter_obj.filter_old_input_value = value;
                        remove_filter('text');
                        add_filter('text', 'name, code, projectname, portfolioname, leadername', 'contains', [value]);
                        set_filter();
                        apply_filter();
                    }
                });
            };
            function set_filter(){
                //set all filtered
                data.nodes.forEach(function(d){ d._filtered = true; });
                data.links.forEach(function(d){ d._filtered = true; });
                //apply filter for nodes

                //filter nodes
                self.filter_obj.filter_apply.forEach(function(f){
                    if (f.method == 'equal') {
                        data.nodes
                            .filter(function(d){ return d._filtered; })
                            .forEach(function(d){
                                d._filtered = false;
                                f.values.forEach(function(fvalue){
                                    if (fvalue == "null") {
                                        if (d[f.fields[0]] == null)
                                            d._filtered = true;
                                    } else {
                                        if (d[f.fields[0]] == fvalue)
                                            d._filtered = true;
                                    }
                                });
                            });
                    } else if (f.method == 'contains') {
                        data.nodes
                            .filter(function(d){ return d._filtered; })
                            .forEach(function(d){
                                d._filtered = false;
                                f.fields.forEach(function(ffield){
                                    if (d[ffield.trim()])
                                        if (d[ffield.trim()].toLowerCase().includes(f.values[0].toLowerCase()))
                                            d._filtered = true;
                                });
                            });
                    }
                });
                //filter links
                data.links.filter(function(d){ return d._filtered; })
                    .forEach(function(d){ d._filtered = d.source._filtered && d.target._filtered; });
            };
            function apply_filter(){
                self.loader_add("#wrapper", "filtering", "Обновление диаграммы");
                setTimeout(function(){
                    chart.get_nodes_filtered();
                    chart.visible_nodes_filtered();

                    chart.data_extend_for_y_scalable_filtered();
                    chart.data_extend_for_y_scalable_filtered_mini();
                    if (data.filtered.length > 0) {
                        chart.graph_calculate();
                        chart.graph_render_yaxis();
                        chart.brush_calculate();
                        chart.brush_render_yaxis();
                    }
                    chart.graph_show_nodes();
                    chart.brush_show_nodes();

                    self.legend_render();
                    self.loader_remove("filtering");
                    self.loader_add("#wrapper", "update_filtered_panel", "Обновление панели информации");
                    setTimeout(function(){
                        self.info_filtered_render();
                        self.loader_remove("update_filtered_panel");
                    }, 10);
                }, 10);
            };
        };

        ktDom.prototype.legend_create = function(){
            var self = this;
            self.dom.panel_legend.css('top', self.dom.panel_filter.height());
        };
        ktDom.prototype.legend_render = function(){
            var self = this,
                chart = self.chart,
                options = self.chart.options,
                objects = self.chart.objects,
                functions = self.chart.functions,
                data = self.chart.options.data;

            self.dom.panel_legend.html('');
            data.nodes.forEach(function(d){ d._visible_legend = true; });
            data.mini.forEach(function(d){ d._visible_legend = true; });
            data.links.forEach(function(d){ d._visible_legend = true; });
            data.dictionaries[options.colorField.dictionary].forEach(function (x) {
                //extend legend item properties
                x[options.colorField.id] = x.id;
                if (options.colorField.id == "reportstatusterm") { x.name = functions.getReportStatusTermName(x); }
                if (!x.name) { x.name = '<пусто>'; }

                if (data.filtered.filter(function(d){ return d[options.colorField.id] == x.id; }).length > 0) {
                    //render legend item
                    var $legend_item = $('<div class="legend-item"></div>');
                    var $legend_circle = $('<div class="legend-circle"></div>');
                    $legend_circle.css('background-color', functions.color(x));
                    $legend_circle.css('border-color', functions.color(x));
                    var $legend_name = $('<div class="legend-name"></div>');
                    $legend_name.text(x.name);
                    $legend_item.append($legend_circle, $legend_name);
                    $legend_item.data('visible', true);

                    //bind legend item click
                    $legend_item.on('click', function(){
                        $(this).toggleClass('legend-hidden');
                        var visible = $(this).data('visible');
                        $(this).data('visible', !visible);
                        //filter nodes
                        data.nodes
                            .filter(function(d){ return d[options.colorField.id] == x.id })
                            .forEach(function(d){ d._visible_legend = !visible; });
                        //filter mini nodes
                        data.mini
                            .filter(function(d){ return d[options.colorField.id] == x.id })
                            .forEach(function(d){ d._visible_legend = !visible; });
                        //filter links
                        data.links.forEach(function(d){ d._visible_legend = d.source._visible_legend && d.target._visible_legend; });
                        //update
                        chart.graph_show_nodes();
                        chart.brush_show_nodes();
                    });
                    self.dom.panel_legend.append($legend_item);
                }
            });
        };

        ktDom.prototype.info_create = function(){
            var self = this;
            self.dom.panel_info.css({
                top: self.dom.panel_filter.height()
            });
            // tabs
            self.dom.tabs__list.append(
                self.dom.tabs_array.filtered,
                self.dom.tabs_array.selected
            );
            self.dom.card.find('.tabs').append(self.dom.tabs__list);
            // tabs content
            self.dom.tabs__content.append(
                self.dom.tabs__pane_array.filtered,
                self.dom.tabs__pane_array.selected
            );
            self.dom.card.find('.card__main').append(self.dom.tabs__content);
            // panel-info
            self.dom.panel_info.append(self.dom.card);
            self.dom.card.find('[data-fc="tab"]').tabs();
        };
        ktDom.prototype.info_bind_events = function(){
            var self = this,
                chart = self.chart,
                data = self.chart.options.data;

            /*tabs events click*/
            self.dom.tabs_array.filtered
                .on("click", function(){
                    chart.visible_nodes_filtered();
                    chart.graph_show_nodes(0);
                    chart.brush_show_nodes(0);
                });
            self.dom.tabs_array.selected
                .on("click", function(){
                    chart.visible_nodes_selected();
                    chart.graph_show_nodes(0);
                    chart.brush_show_nodes(0);
                });
            self.dom.tabs_array.connected
                .on("click", function(){
                    chart.get_nodes_connected(data.connected_n);
                    chart.visible_nodes_connected();
                    chart.graph_show_nodes(0);
                    chart.brush_show_nodes(0);
                    self.info_connected_render(data.connected_n);
                })
                .on("mouseover", function() {
                    chart.node_mouseover(data.connected_n);
                })
                .on("mouseout", function() {
                    chart.node_mouseout(data.connected_n);
                });
        };
        ktDom.prototype.info_filtered_render = function(){
            var self = this,
                chart = self.chart,
                options = self.chart.options,
                data = self.chart.options.data,
                functions = self.chart.functions;

            //render tab info
            self.dom.tabs_array.filtered.find('[data-fc="tab"]').tabs('set_text', 'Точки (' + data.filtered.length + ')');

            /*render tab content*/
            var $ul = $('<ul></ul>');
            data.dictionaries[options.yTickData].forEach(function(dat){
                var count = data.filtered.filter(function(d){ return d[options.yfieldId] == dat.id; }).length,
                    count_selected = data.filtered.filter(function(d){ return d[options.yfieldId] == dat.id && d._selected; }).length;
                if (count > 0) {
                    var $li = $(
                        '<li class="sub-menu dcjq-parent-li" data-y=' + dat.id + '>' +
                        '  <a href="javascript:;" class="dcjq-parent">' +
                        '    <span>' + dat.name + '</span>' +
                        '    <span class="counts">' +
                        '       <span class="dcjq-count selected">' + (count_selected > 0 ? count_selected : "") + '</span>' +
                        '       <span class="dcjq-count" style="color:' + functions.colorCounts(dat.id) + ';">' + count + '</span>' +
                        '    </span>' +
                        '  </a>' +
                        '  <ul class="sub" style="display: none;">' +
                        '  </ul>' +
                        '</li>'
                    );
                    data.filtered.filter(function(d){ return d[options.yfieldId] == dat.id; }).forEach(function(d){
                        var $itm = $('<li data-pointid="' + d.pointid + '"></li>');
                        var $lnk = $('<a href="javascript:;" data-pointid="' + d.pointid + '">' + d.code + '. ' + d.name + '</a>')
                            .attr('class', d._selected ? 'selected' : '');
                        var $btn = $('<div class="btn btn-xs show-kt-info">Подробнее</div>');
                        $lnk.on('click', function(){
                                if (d)
                                    if (d._visible && d._visible_legend)
                                        if (window.event.ctrlKey) {
                                            chart.node_select(d);
                                            chart.node_mouseout(d);
                                        } else {
                                            chart.node_open(d);
                                        }
                            })
                            .on("contextmenu", function(e){
                                e.preventDefault();
                                if (d)
                                    if (d._visible && d._visible_legend)
                                        chart.node_select(d);
                                chart.node_mouseout(d);
                            })
                            .on("mouseover", function() {
                                if (d)
                                    if (d._visible && d._visible_legend)
                                        chart.node_mouseover(d);
                            })
                            .on("mouseout", function() {
                                if (d)
                                    if (d._visible && d._visible_legend)
                                        chart.node_mouseout(d);
                            });
                        $btn.on('click', function(e){
                            e.stopPropagation();
                        });
                        $li.find('ul.sub').append($itm.append($lnk));
                    });
                    $ul.append($li);
                }
            });
            self.dom.tabs__pane_array.filtered.html('');
            self.dom.tabs__pane_array.filtered.append($ul);
            if ($.fn.dcAccordion) {
                $ul.dcAccordion({
                    menuClose: false,
                    eventType: 'click',
                    autoClose: false,
                    saveState: true,
                    disableLink: true,
                    speed: '50',
                    showCount: false,
                    autoExpand: true,
                    classExpand: 'dcjq-current-parent'
                });
            };
        };
        ktDom.prototype.info_filtered_update = function(_d){
            var self = this,
                chart = self.chart,
                objects = self.chart.objects,
                options = self.chart.options,
                data = self.chart.options.data,
                dimentions = self.chart.dimentions,
                functions = self.chart.functions;
            var count_selected = data.filtered.filter(function(d){ return d[options.yfieldId] == _d[options.yfieldId] && d._selected; }).length;
            self.dom.tabs__pane_array.filtered.find('a[data-pointid=' + _d.pointid + ']').toggleClass('selected');
            self.dom.tabs__pane_array.filtered.find('li[data-y=' + _d[options.yfieldId] + '] .dcjq-count.selected').text(count_selected > 0 ? count_selected : "");
        };
        ktDom.prototype.info_selected_render = function(){
            var self = this,
                chart = self.chart,
                objects = self.chart.objects,
                options = self.chart.options,
                data = self.chart.options.data,
                functions = self.chart.functions;

            /*render tab info*/
            self.dom.tabs_array.selected.find('[data-fc="tab"]').tabs('set_text', 'Выбранные (' + data.selected.length + ')');

            /*render tab content*/
            var $ul = $('<ul></ul>');
            var $li = $(
                '<li class="sub-menu dcjq-parent-li">' +
                '  <a href="javascript:;" class="dcjq-parent">' +
                '    <span>Выбранные точки</span>' +
                '    <span class="counts">' +
                '       <div class="btn btn-xs" id="clear_selected">Очистить</div>' +
                '       <div class="btn btn-xs" id="join_selected">Соединить</div>' +
                '    </span>' +
                '  </a>' +
                '  <ul class="sub" id="draggable">' +
                '  </ul>' +
                '</li>'
            );
            $li.find('#clear_selected').click(function(e){
                e.stopPropagation();
                chart.clear_nodes_selected();
            });
            $li.find('#join_selected').click(function(e){
                e.stopPropagation();
                chart.on_connect();
            });
            var $itm = $('<li class="nodata"></li>');
            var $lnk = $('<a>Не выбрано ни одной точки</a>');
            $li.find('ul.sub').append($itm.append($lnk));
            $ul.append($li);
            self.dom.tabs__pane_array.selected.html('');
            self.dom.tabs__pane_array.selected.append($ul);
            if ($.fn.dcAccordion) {
                $ul.dcAccordion({
                    menuClose: false,
                    eventType: 'click',
                    autoClose: false,
                    saveState: true,
                    disableLink: true,
                    speed: '50',
                    showCount: false,
                    autoExpand: true,
                    classExpand: 'dcjq-current-parent'
                });
            };
            $ul.find('li.sub-menu > a').trigger('click');

            /*
            make selected points draggable
            https://github.com/RubaXa/Sortable
            */
            var drag = document.getElementById('draggable');
            Sortable.create(drag, {
                group: 'selected',
                animation: 100,
                onUpdate: function(evt){
                    var node = data.selected[evt.oldIndex];
                    data.selected.splice(evt.oldIndex, 1);
                    data.selected.splice(evt.newIndex, 0, node);
                }
            });
        };
        ktDom.prototype.info_selected_update = function(_d){
            var self = this,
                chart = self.chart,
                objects = self.chart.objects,
                options = self.chart.options,
                data = self.chart.options.data,
                functions = self.chart.functions;

            /*update tab info*/
            self.dom.tabs_array.selected.find('[data-fc="tab"]').tabs('set_text', 'Выбранные (' + data.selected.length + ')');

            /*update tab content*/
            var $itm, $lnk, level;
            var $ul = self.dom.tabs__pane_array.selected.find('ul.sub');
            if (data.selected.length > 0) {
                level = _d.level;
                if (_d._selected) {
                    if (data.selected.length == 1)
                        $ul.find('li.nodata').remove();

                    $itm = $('<li data-pointid="' + _d.pointid + '"></li>');
                    $lnk = $('<a href="javascript:;" data-pointid="' + _d.pointid + '">' + _d.code + '. ' + _d.name + '</a>')
                        .attr('class', _d._selected ? 'selected' : '');

                    $lnk.on('click', function(){
                            if (window.event.ctrlKey) {
                                chart.node_select(_d);
                                chart.node_mouseout(_d);
                            } else {
                                chart.node_open(_d);
                            }
                        })
                        .on("contextmenu", function(e){
                            e.preventDefault();
                            chart.node_select(_d);
                            chart.node_mouseout(_d);
                        })
                        .on("mouseover", function() {
                            chart.node_mouseover(_d);
                        })
                        .on("mouseout", function() {
                            chart.node_mouseout(_d);
                        });

                    $ul.append($itm.append($lnk));
                } else {
                    $ul.find('li[data-pointid=' + _d.pointid + ']').remove();
                }
            } else {
                $itm = $('<li class="nodata"></li>');
                $lnk = $('<a>Не выбрано ни одной точки</a>');
                $ul.html('').append($itm.append($lnk));
            }
        };
        ktDom.prototype.info_connected_render = function(_d){
            var self = this,
                chart = self.chart;
            if (self.dom.tabs__list.find('li').length == 2){

                self.dom.tabs__list.append(self.dom.tabs_array.connected);
                self.dom.tabs__content.append(self.dom.tabs__pane_array.connected);
                self.dom.tabs__pane_array.connected.html('');

                self.dom.card.find('[data-fc="tab"]').data('_widget', '');
                self.dom.card.find('[data-fc="tab"]').tabs();

                var $ktinfo = $('<div class="ktinfo"></div>');
                var $ktsource = $('<div class="ktsource"></div>');
                var $kttarget = $('<div class="kttarget"></div>');

                self.dom.tabs__pane_array.connected.append($ktinfo);
                self.dom.tabs__pane_array.connected.append($ktsource);
                self.dom.tabs__pane_array.connected.append($kttarget);

                /*render tab content source*/
                var $sul = $('<ul></ul>');
                var $sli = $(
                    '<li class="sub-menu dcjq-parent-li">' +
                    '  <a href="javascript:;" class="dcjq-parent">' +
                    '    <span>Предшественники</span>' +
                    '    <span class="counts">' +
                    '       <span class="dcjq-count selected"></span>' +
                    '       <span class="dcjq-count"></span>' +
                    '    </span>' +
                    '  </a>' +
                    '  <ul class="sub">' +
                    '  </ul>' +
                    '</li>'
                );
                var $sitm = $('<li class="nodata"></li>');
                var $slnk = $('<a>Нет точек</a>');
                $sli.find('ul.sub').append($sitm.append($slnk));
                $sul.append($sli);
                $ktsource.append($sul);
                if ($.fn.dcAccordion) {
                    $sul.dcAccordion({
                        menuClose: false,
                        eventType: 'click',
                        autoClose: false,
                        saveState: true,
                        disableLink: true,
                        speed: '50',
                        showCount: false,
                        autoExpand: true,
                        classExpand: 'dcjq-current-parent'
                    });
                };
                //$sul.find('li.sub-menu > a').trigger('click');

                /*render tab content target*/
                var $tul = $('<ul></ul>');
                var $tli = $(
                    '<li class="sub-menu dcjq-parent-li">' +
                    '  <a href="javascript:;" class="dcjq-parent">' +
                    '    <span>Последователи</span>' +
                    '    <span class="counts">' +
                    '       <span class="dcjq-count selected"></span>' +
                    '       <span class="dcjq-count"></span>' +
                    '    </span>' +
                    '  </a>' +
                    '  <ul class="sub">' +
                    '  </ul>' +
                    '</li>'
                );
                var $titm = $('<li class="nodata"></li>');
                var $tlnk = $('<a>Нет точек</a>');
                $tli.find('ul.sub').append($titm.append($tlnk));
                $tul.append($tli);
                $kttarget.append($tul);
                if ($.fn.dcAccordion) {
                    $tul.dcAccordion({
                        menuClose: false,
                        eventType: 'click',
                        autoClose: false,
                        saveState: true,
                        disableLink: true,
                        speed: '50',
                        showCount: false,
                        autoExpand: true,
                        classExpand: 'dcjq-current-parent'
                    });
                };
                //$tul.find('li.sub-menu > a').trigger('click');
            }
            self.info_connected_render_list(_d);
        };
        ktDom.prototype.info_connected_update = function(_d){
            var self = this,
                chart = self.chart,
                objects = self.chart.objects,
                options = self.chart.options,
                data = self.chart.options.data,
                dimentions = self.chart.dimentions,
                functions = self.chart.functions;

            var $kttarget = self.dom.tabs__pane_array.connected.find('.kttarget');
            var $ktsource = self.dom.tabs__pane_array.connected.find('.ktsource');

            var count_selected_s = data.connected_s.filter(function(obj){ return obj._selected; }).length;
            $ktsource.find('.dcjq-count').text(data.connected_s.length);
            $ktsource.find('.dcjq-count.selected').text(count_selected_s > 0 ? count_selected_s : '');
            var count_selected_t = data.connected_t.filter(function(obj){ return obj._selected; }).length;
            $kttarget.find('.dcjq-count').text(data.connected_t.length);
            $kttarget.find('.dcjq-count.selected').text(count_selected_t > 0 ? count_selected_t : '');

            if (_d) {
                self.dom.tabs__pane_array.connected.find('a[data-pointid=' + _d.pointid + ']').toggleClass('selected');
            } else {
                data.connected_s.forEach(function(d){
                    return d.selected ?
                        self.dom.tabs__pane_array.connected.find('a[data-pointid=' + d.pointid + ']').addClass('selected') :
                        self.dom.tabs__pane_array.connected.find('a[data-pointid=' + d.pointid + ']').removeClass('selected');
                });
                data.connected_t.forEach(function(d){
                    return d.selected ?
                        self.dom.tabs__pane_array.connected.find('a[data-pointid=' + d.pointid + ']').addClass('selected') :
                        self.dom.tabs__pane_array.connected.find('a[data-pointid=' + d.pointid + ']').removeClass('selected');
                });
            }
        };
        ktDom.prototype.info_connected_render_list = function(_d){
            var self = this,
                chart = self.chart,
                objects = self.chart.objects,
                options = self.chart.options,
                data = self.chart.options.data,
                dimentions = self.chart.dimentions,
                functions = self.chart.functions;

            /*update tab info*/
            self.dom.tabs_array.connected.find('[data-fc="tab"]').tabs('set_text', _d.code + ". " + _d.name);

            var $ktinfo = self.dom.tabs__pane_array.connected.find('.ktinfo');
            var $kttarget = self.dom.tabs__pane_array.connected.find('.kttarget');
            var $ktsource = self.dom.tabs__pane_array.connected.find('.ktsource');

            /*update tab content info*/
            $ktinfo.html('');
            $ktinfo.append('<div class="trow"><div class="name">Название</div><div class="value"><a href="/asyst/Point/form/auto/' + _d.pointid + '?mode=view&back=/asyst/page/ktChart">' + _d.code + '. ' + _d.name + '</a></div></div>');
            $ktinfo.append('<div class="trow"><div class="name">Ответственный</div><div class="value">' + _d.leadername + '</div></div>');
            $ktinfo.append('<div class="trow"><div class="name">Дата</div><div class="value">' + _d._date + '</div></div>');
            $ktinfo.append('<div class="trow"><div class="name">Статус</div><div class="value">' + _d.statusname + '</div></div>');
            $ktinfo.append('<div class="trow"><div class="name">Проект</div><div class="value">' + _d.projectname + '</div></div>');
            $ktinfo.append('<div class="trow"><div class="name">Портфель</div><div class="value">' + _d.portfolioname + '</div></div>');

            /*update tab content source*/
            var $sitm, $sbtn, $slnk;
            var $sul = $ktsource.find('ul.sub');
            $sul.html('');
            if (data.connected_s.length > 0) {
                var count_selected_s = data.connected_s.filter(function(obj){ return obj._selected; }).length;
                $ktsource.find('.dcjq-count').text(data.connected_s.length);
                $ktsource.find('.dcjq-count.selected').text(count_selected_s > 0 ? count_selected_s : '');
                data.connected_s.forEach(function(d){
                    $sitm = $('<li data-pointid="' + d.pointid + '"></li>');
                    $sbtn = $('<div class="btn btn-xs" data-source-pointid="' + d.pointid + '" data-target-pointid="' + _d.pointid + '">Разъединить</div>');
                    $slnk = $('<a href="javascript:;" data-pointid="' + d.pointid + '">' + d.code + '. ' + d.name + '</a>')
                        .attr('class', d._selected ? 'selected' : '');

                    $sbtn.on('click', function(){
                        var tdata = $(this).data();
                        chart.on_disconnect(_d, tdata.sourcePointid, tdata.targetPointid);
                    });
                    $slnk.on('click', function(){
                            if (window.event.ctrlKey) {
                                chart.node_select(d);
                                chart.node_mouseout(d);
                            } else {
                                chart.node_open(d);
                            }
                        })
                        .on("contextmenu", function(e){
                            e.preventDefault();
                            chart.node_select(d);
                            chart.node_mouseout(d);
                        })
                        .on("mouseover", function() {
                            chart.node_mouseover(d);
                        })
                        .on("mouseout", function() {
                            chart.node_mouseout(d);
                        });

                    $sul.append($sitm.append($sbtn, $slnk));
                });
            } else {
                $ktsource.find('.dcjq-count').text('');
                $sitm = $('<li class="nodata"></li>');
                $slnk = $('<a>Нет точек</a>');
                $sul.append($sitm.append($slnk));
            }

            /*update tab content target*/
            var $titm, $tbtn, $tlnk;
            var $tul = $kttarget.find('ul.sub');
            $tul.html('');
            if (data.connected_t.length > 0) {
                var count_selected_t = data.connected_t.filter(function(obj){ return obj._selected; }).length;
                $kttarget.find('.dcjq-count').text(data.connected_t.length);
                $kttarget.find('.dcjq-count.selected').text(count_selected_t > 0 ? count_selected_t : '');
                data.connected_t.forEach(function(d){
                    $titm = $('<li data-pointid="' + d.pointid + '"></li>');
                    $tbtn = $('<div class="btn btn-xs" data-source-pointid="' + _d.pointid + '" data-target-pointid="' + d.pointid + '">Разъединить</div>');
                    $tlnk = $('<a href="javascript:;" data-pointid="' + d.pointid + '">' + d.code + '. ' + d.name + '</a>')
                        .attr('class', d._selected ? 'selected' : '');

                    $tbtn.on('click', function(){
                        var tdata = $(this).data();
                        chart.on_disconnect(_d, tdata.sourcePointid, tdata.targetPointid);
                    });
                    $tlnk.on('click', function(){
                            if (window.event.ctrlKey) {
                                chart.node_select(d);
                                chart.node_mouseout(d);
                            } else {
                                chart.node_open(d);
                            }
                        })
                        .on("contextmenu", function(e){
                            e.preventDefault();
                            chart.node_select(d);
                            chart.node_mouseout(d);
                        })
                        .on("mouseover", function() {
                            chart.node_mouseover(d);
                        })
                        .on("mouseout", function() {
                            chart.node_mouseout(d);
                        });

                    $tul.append($titm.append($tbtn, $tlnk));
                });
            } else {
                $kttarget.find('.dcjq-count').text('');
                $titm = $('<li class="nodata"></li>');
                $tlnk = $('<a>Нет точек</a>');
                $tul.append($titm.append($tlnk));
            }
        };

        ktDom.prototype.info_show_tab = function(id){
            var self = this;
            self.dom.tabs_array[id].find('[data-fc="button"]').trigger('click');
            self.dom.tabs_array[id].find('[data-fc="tab"]').tabs('show');
        };

        ktDom.prototype.loader_add = function(selector, id, text){
            var self = this;
            if (self.loaders.filter(function(l){ return l.id == id || l.selector == selector}).length == 0) {
                var _loader = self.dom.panel_loader.clone().append(
                    self.dom.spinner_overlay.clone(),
                    self.dom.spinner_container.clone().append(
                        self.dom.spinner.clone(),
                        self.dom.spinner_text.clone().text(text)
                    )
                );
                $(selector).append(_loader);
                self.loaders.push({
                    id: id,
                    selector: selector,
                    loader: _loader,
                    timer: Date.now()
                });
            }
        };
        ktDom.prototype.loader_remove = function(id) {
            var self = this;
            self.loaders.forEach(function(d, i){
                if (d.id == id) {
                    d.loader.remove();
                    self.loaders.splice(i, 1);
                    console.log(Date.now() - d.timer + ' ms ' + d.id);
                }
            });
        };

        ktDom.prototype.resize = function(){
            var self = this;
            self.dom.panel_legend.css({
                width: self.options.width_legend,
                top: self.dom.panel_filter.height()
            });
            self.dom.panel_graph.css({
                right: self.options.width_legend,
                left: self.options.width_info,
                top: self.dom.panel_filter.height()
            });
            self.dom.panel_info.css({
                width: self.options.width_info,
                top: self.dom.panel_filter.height()
            });
        };

        return ktDom;
    })();
    var ktOptions = root.ktOptions = (function(){ // [CHANGE] Класс ktOptions кладу также и в неймспейс помимо изначальной переменной
        function ktOptions(root, onConnect, onDisconnect){
            this.ktdom = root.ktdom;
            this.data = root.data;
            this.onConnect = onConnect;
            this.onDisconnect = onDisconnect;

            //this.filter_obj = root.ktdom.filter_obj;

            this.margin = { top: 25, right: 20, bottom: 150, left: 20 };
            this.miniHeight = this.margin.bottom - 25;
            this.durationCount = 500;
            this.nodeRaius = 3;
            this.opacity = { in: 1, link: .75, out: 0 };
            this.today = new Date();
            this.yMaxCaptionCount = 17;
            this.yCaptionLength = 30;
            this.caption = 'Визуализация иерархии контрольных точек';
        };
        return ktOptions;
    })();
    var ktChart = root.ktChart = (function(){ // [CHANGE] Класс ktChart кладу также и в неймспейс помимо изначальной переменной
        function ktChart(options){
            var self = this;
            self.options = options;
            self.options.ktdom.chart = self;
            self.options.ktdom.loader_remove("parsing");
            self.options.ktdom.loader_add("#wrapper", "rendering", "Построение диаграммы");
            self.options.resize_timer = null;
            self.options.resize_timeout = 250;

            setTimeout(function(){
                self.time_start(); // для отладки скорости выполнения функций

                self.init();
                //self.date_locale();
                self.data_extend();
                self.data_extend_for_y_scalable();
                self.data_extend_for_y_scalable_filtered();
                self.data_extend_mini();
                self.set_dimentions();
                self.graph_build();
                self.brush_build();
                self.init_resize();

                self.options.ktdom.filter_bind_events();
                self.options.ktdom.info_bind_events();
                self.options.ktdom.legend_render();

                self.options.ktdom.info_filtered_render();
                self.options.ktdom.info_selected_render();

                self.options.ktdom.loader_remove("rendering");
            }, 10);
        };

        ktChart.prototype.time_start = function(){
            var self = this;
            self.timer2 = Date.now();
        };
        ktChart.prototype.time_console = function(text){
            var self = this;
            console.log(Date.now() - self.timer2 + ' ms ' + text);
            self.timer2 = Date.now();
        };

        ktChart.prototype.init = function(){
            var self = this,
                options = self.options;

            self.dimentions = {
                width: self.options.ktdom.dom.panel_graph.width(),
                height: self.options.ktdom.dom.panel_graph.height(),
                chartwidth: null,
                chartheight: null,
            };

            self.objects = {
                svg: null,
                main: null,
                mini: null,

                defs: null,
                def: null,
                nodes: null,
                node: null,
                links: null,
                link: null,
                xaxis: null,
                xaxis_top: null,
                yaxis: null,
                grid: null,
                today: null,

                voronoi: null,
                force: null,
                x: null,
                y: null,
                kx: null,
                ky: null,

                brusharea: null,
                brush: null,
                brushselection: null,
                mnodes: null,
                mnode: null,
                mgrid: null,
                mx: null,
                my: null,
                mforce: null,
                mtoday: null,
            };
            self.functions = {};
            self.functions.parseTimeDot = d3.timeParse("%d.%m.%Y");
            self.functions.schemeCategory10 = d3.scaleOrdinal(d3.schemeCategory10);
            self.functions.schemeCategory20 = d3.scaleOrdinal(d3.schemeCategory20);
            self.functions.schemeCategory20b = d3.scaleOrdinal(d3.schemeCategory20b);
            self.functions.schemeCategory20c = d3.scaleOrdinal(d3.schemeCategory20c);
            self.functions.colors = {
                colorByLevelId: function(d){
                    var colores = ["#f655a0", "#b05df4", "#8e6bf5", "#5a97f2", "#00b7f4", "#33cc66"];
                    if (d) {
                        if (typeof(d) == 'object')
                            return colores[options.data.dictionaries.level.findIndex(function(_d){ return _d.id == d.levelid; })];
                        else
                            return colores[options.data.dictionaries.level.findIndex(function(_d){ return _d.id == d; })];
                    }
                    return "#888";
                }
            };
            self.functions.yInit = {
                byLevel: function(objects){
                    options.maxY = options.maxLevel;
                    options.yfieldId = "levelid";
                    options.yfield = "_levelindex";
                    options.yfieldPosition = "_level_position_index";
                    options.yTickData = "level";
                    //self.functions.colorCounts = self.functions.colors['colorByLevelId'];
                    self.functions.colorCounts = function(){ return "#333"; };
                },
            };

            self.functions.color = self.functions.colors['colorByLevelId'];

            self.options.colorFields = {
                colorByLevelId: { dictionary: 'level', id: 'levelid', name: 'levelname' }
            };
            self.options.colorField = self.options.colorFields['colorByLevelId'];

            self.options.yCurrent = "byLevel";
            self.options.yCurrent_ky = 1;
        };
        ktChart.prototype.init_resize = function(){
            var self = this;
            $(window).resize(function(){
                clearTimeout(self.options.resize_timer);
                self.options.ktdom.resize();
                self.options.ktdom.loader_add("#wrapper", "resize", "Обновление");
                self.options.resize_timer = setTimeout(function(){
                    self.set_dimentions();
                    self.graph_resize();
                    self.brush_resize();
                    self.options.ktdom.loader_remove("resize");
                }, self.options.resize_timeout);
            });
        };

        ktChart.prototype.date_locale = function(){
            d3.timeFormatDefaultLocale({
                dateTime: "%x, %X",
                date: "%Y.%m.%d",
                time: "%H:%M:%S ",
                periods: ["AM", "PM"],
                days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
                shortDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                shortMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
            })
        };
        ktChart.prototype.data_extend = function(){
            var self = this,
                options = self.options,
                functions = self.functions,
                data = self.options.data;

            data.nodes.forEach(function(d) {
                d.radius = options.nodeRaius;
                d._filtered = true;
                d._selected = false;
                d._connected = false;
                d._visible = true;
                d._visible_legend = true;
                d._viztype = 'filtered';
            });
            data.links.forEach(function(d) {
                d._filtered = true;
                d._selected = false;
                d._connected = false;
                d._visible = true;
                d._visible_legend = true;
                d.source = data.nodes[d.source];
                d.target = data.nodes[d.target];
            });

            data.filtered = [];
            data.selected = [];
            data.connected = [];
            data.connected_n = {};
            data.connected_s = [];
            data.connected_t = [];
            self.get_nodes_filtered();
        };
        ktChart.prototype.data_extend_for_y_scalable = function() {
            var self = this,
                options = self.options,
                data = self.options.data,
                dictionaries = data.dictionaries;

            data.nodes.forEach(function(d) {
                d._levelindex = dictionaries.level.findIndex(function(_d){ return _d.id == d.levelid});
            });

            options.maxLevel = d3.max(data.nodes, function(d) { return d._levelindex; }) + 1;

            options.pointStep = 1;

            dictionaries.level.forEach(function(d){
                var data_level = data.nodes.filter(function(_d){ return _d.levelid == d.id; });
                var data_level_date_arr = d3.nest().key(function(d){ return d.index; }).entries(data_level);
                data_level_date_arr.forEach(function(g){
                    g.values
                        .forEach(function(___d, j, array){
                            ___d._level_position = (1/(array.length+1)) * (j+1);
                            ___d._level_position_index = j;
                            options.pointStep = options.pointStep > 1/(array.length+1) ? 1/(array.length+1) : options.pointStep;
                        });
                });
            });
        };
        ktChart.prototype.data_extend_for_y_scalable_filtered = function() {
            var self = this,
                options = self.options,
                data = self.options.data,
                dictionaries = data.dictionaries;

            dictionaries.level_filtered = dictionaries.level.filter(function(_d){ return data.filtered.filter(function(_f){ return _f.levelid == _d.id; }).length > 0; });

            data.filtered.forEach(function(d) {
                d._levelindex_filtered = dictionaries.level_filtered.findIndex(function(_d){ return _d.id == d.levelid});
            });

            options.maxLevel_filtered = d3.max(data.filtered, function(d) { return d._levelindex_filtered; }) + 1;
        };
        ktChart.prototype.data_extend_for_y_scalable_filtered_mini = function() {
            var self = this,
                data = self.options.data;

            data.filtered.forEach(function(d) {
                var _d_mini = data.mini.filter(function(_d){ return _d.pointid == d.pointid; });
                if (_d_mini.length > 0){
                    _d_mini[0]._levelindex_filtered = d._levelindex_filtered;
                }
            });
        };
        ktChart.prototype.data_extend_mini = function(){
            var self = this,
                options = self.options,
                functions = self.functions,
                data = self.options.data;

            data.mini = [];
            data.nodes.forEach(function(d) {
                data.mini.push($.extend(true, {}, d));
            });
        };

        ktChart.prototype.set_dimentions = function(){
            var self = this;
            var options = self.options,
                dimentions = self.dimentions,
                dom = self.options.ktdom.dom;

            dimentions.width = dom.panel_graph.width();
            dimentions.height = dom.panel_graph.height();
            dimentions.chartwidth = dimentions.width - options.margin.left - options.margin.right;
            dimentions.chartheight = dimentions.height - options.margin.top - options.margin.bottom;
        };

        ktChart.prototype.graph_build = function(){
            var self = this;
            self.graph_init_dom();
            self.graph_set_size();
            self.graph_calculate();
            self.graph_render_xaxis();
            self.graph_render_yaxis();
            self.graph_show_nodes(0);
        };
        ktChart.prototype.graph_init_dom = function(){
            var self = this;
            var data = self.options.data,
                objects = self.objects,
                functions = self.functions,
                ktdom = self.options.ktdom;

            objects.svg = d3.select('.' + ktdom.class.panel_graph).append("svg").attr("transform", "translate(0,0)");
            objects.main = objects.svg.append('g').attr('class', 'main');

            objects.xaxis_top = objects.main.append("g").attr("class", "axis axis--x-top");
            objects.xaxis = objects.main.append("g").attr("class", "axis axis--x");
            objects.yaxis = objects.main.append("g").attr("class", "axis axis--y");
            objects.yaxis
                .selectAll("text").attr("x", 0).attr("y", 20);
            objects.grid = objects.main.append("g").attr("class", "grid");

            objects.links = objects.main.append('g').attr('class', 'links');
            objects.nodes = objects.main.append('g').attr('class', 'nodes');

            /*
            objects.defs = objects.main.append("svg:defs");
            objects.def = objects.defs.selectAll("marker").data(data.links)
            objects.def
                .enter().append("svg:marker")
                .attr("id", function(d) { return d.source.pointid + '-' + d.target.pointid; })
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", 0)
                .attr("markerWidth", 8)
                .attr("markerHeight", 8)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5")
                .style("fill", function(d){ return functions.color(d.source); });
            objects.def = objects.defs.selectAll("marker");
            */

            objects.node = objects.nodes.selectAll("g")
                .data(data.nodes)
                .enter().append("g");

            objects.node.append("circle")
                .attr("id", function(d) { return d.pointid; })
                .attr("class", function(d) { return "circle-" + d.pointid; })
                .attr("r", function(d) { return d.radius; })
                .style("fill", function(d) { return functions.color(d); })

            objects.node.append("path")
                .style("pointer-events", "all")
                .on("click", function(d, i) {
                    if (d)
                        if (d.data._visible && d.data._visible_legend)
                            if (d3.event.ctrlKey) {
                                self.node_select(d.data);
                            } else {
                                self.node_open(d.data);
                            }
                })
                .on("contextmenu", function(d, i){
                    d3.event.preventDefault();
                    if (d)
                        if (d.data._visible && d.data._visible_legend)
                            self.node_select(d.data);
                })
                .on("mouseover", function(d, i) {
                    if (d)
                        if (d.data._visible && d.data._visible_legend)
                            self.node_mouseover(d.data);
                })
                .on("mouseout", function(d, i) {
                    if (d)
                        if (d.data._visible && d.data._visible_legend)
                            self.node_mouseout(d.data);
                });

            objects.link = objects.links.selectAll(".link").data(data.links);
            objects.link
                .enter().append("path")
                .attr("class", "link")
                //.attr("marker-end", function(d) { return "url(#" + d.source.pointid + '-' + d.target.pointid + ")"; })
                .style('stroke', function(d){ return functions.color(d.source); })
                .style('fill', 'none');
            objects.link = objects.links.selectAll(".link");

            objects.today = objects.main.append("line").attr("class", "today");
        };
        ktChart.prototype.graph_set_size = function(){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects;

            objects.svg.attr("width", dimentions.width).attr("height", dimentions.height);
            objects.main.attr("width", dimentions.width).attr("height", dimentions.chartheight).attr('transform', 'translate(0,' + options.margin.top + ')');
            objects.x = d3.scaleLinear().range([options.margin.left * 2, dimentions.chartwidth]);
            objects.y = d3.scaleLinear().range([dimentions.chartheight, 0]);
        };
        ktChart.prototype.graph_calculate = function(){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            functions.yInit[options.yCurrent](objects);

            if (objects.selection) {
                objects.x.domain(objects.selection);
            } else {
                objects.x.domain(d3.extent(data.nodes, function(d) { return d.index; }));
            }
            objects.y.domain([options.maxY, 0]);

            data.nodes.forEach(function(d){
                d.x = objects.x(d.index);
                d.y = objects.y(d[options.yfield] + .5);
                /*
                if (d[options.yfieldPosition] % 2 == 0) {
                    d.y = objects.y(d[options.yfield] + .5 + d[options.yfieldPosition]/2 * options.pointStep);
                } else {
                    d.y = objects.y(d[options.yfield] + .5 + (-d[options.yfieldPosition]/2 - 1/2) * options.pointStep);
                }
                */
            });
            objects.voronoi = d3.voronoi()
                .extent([[0, 0], [dimentions.width, dimentions.chartheight]])
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; });
        }
        ktChart.prototype.graph_render_xaxis = function(){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            objects.xaxis
                //.transition().duration(options.durationCount)
                .call(d3.axisBottom(objects.x))
                .attr("transform", "translate(0," + dimentions.chartheight + ")");

            objects.xaxis_top
                //.transition().duration(options.durationCount)
                .call(d3.axisBottom(objects.x))
                .attr("transform", "translate(0,-" + (options.margin.top-1) + ")");

            objects.today
                //.transition().duration(options.durationCount)
                .attr("x1", objects.x(options.today)).attr("y1", 0)
                .attr("x2", objects.x(options.today)).attr("y2", dimentions.chartheight);
        };
        ktChart.prototype.graph_render_yaxis = function(){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            if (options.maxY <= options.yMaxCaptionCount) {
                objects.yaxis
                    //.transition().duration(options.durationCount)
                    .call(d3.axisRight(objects.y).ticks(options.maxY))
                    .selectAll("text")
                    .text(function(d){
                        var caption = "";
                        if (data.dictionaries[options.yTickData][d]) {
                            if (data.dictionaries[options.yTickData][d].name) {
                                caption = data.dictionaries[options.yTickData][d].name.toString();
                            }
                        }
                        return caption.length > options.yCaptionLength ? caption.substring(0, options.yCaptionLength) + "..." : caption;
                    })
                    .attr("transform", "translate(" + options.margin.left + ",0)").attr("x", -8).attr("y", 20);

                objects.yaxis.selectAll(".tick")
                    .filter(function(d){ return d === options.maxY; })
                    .remove();

                objects.grid
                    //.transition().duration(options.durationCount)
                    .call(make_y_gridlines().tickSize(-dimentions.width))
                    .attr("transform", "translate(0,0)");
            } else {
                objects.yaxis.selectAll(".tick").remove();
                objects.grid.selectAll(".tick").remove();
            }

            function make_y_gridlines() {
                return d3.axisLeft(objects.y).ticks(options.maxY);
            };
        };
        ktChart.prototype.graph_show_nodes = function(durationCount){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            /*no transition*/
            objects.node.selectAll("circle")
                .style("fill", function(d) { return d._selected ? "#ff4800" : functions.color(d); });
            /*
            objects.defs.selectAll("marker").select("path")
                .style("fill", function(d){ return d._selected ? '#ff4800' : functions.color(d.source); });
            */
            objects.link
                .style('stroke', function(d){ return d._selected ? "#ff4800" : functions.color(d.source); });

            /*transition*/
            objects.node.selectAll("circle")
                .transition().duration(durationCount)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr('r',function(d){ return d.pointid == data.connected_n.pointid ? d.radius * 2 : d.radius; })
                .style("opacity", function(d){ return d._visible ? (d._visible_legend ?  options.opacity.in : options.opacity.out) : options.opacity.out; });

            objects.link
                .transition().duration(durationCount)
                .style("opacity", function(d){ return d._visible ? (d._visible_legend ?  options.opacity.link : options.opacity.out) : options.opacity.out; })
                .attr("d", function(d){
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy)*3;
                    return 'M ' + d.source.x + ' ' + d.source.y +
                           'L ' + d.target.x + ' ' + d.target.y;
                    /*
                    return "M" +
                        d.source.x + "," +
                        d.source.y + "A" +
                        dr + "," + dr + " 0 0,1 " +
                        d.target.x + "," +
                        d.target.y;
                    */
                })

            objects.nodes.selectAll("path")
                .data(objects.voronoi(data.nodes).polygons())
                .transition().duration(durationCount)
                .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });
        };
        ktChart.prototype.graph_resize = function(){
            var self = this;
            self.graph_set_size();
            self.graph_calculate();
            self.graph_render_xaxis();
            self.graph_render_yaxis();
            self.graph_show_nodes(0);
        };

        ktChart.prototype.brush_build = function(){
            var self = this;
            self.brush_init_dom();
            self.brush_set_size();
            self.brush_calculate();
            self.brush_render_yaxis();
            self.brush_show_nodes(0);
        };
        ktChart.prototype.brush_init_dom = function(){
            var self = this;
            var data = self.options.data,
                objects = self.objects;

            objects.mini = objects.svg.append('g').attr('class','mini');

            objects.mini.append("rect")
                .attr("class", "rectband")
                .style("opacity", .6)
                .style("stroke", "black")
                .style("cursor", "move");

            objects.mgrid = objects.mini.append("g").attr("class", "grid");

            objects.brusharea = objects.mini.append("g").attr("class", "brush");

            objects.mnodes = objects.mini.append("g")
                .attr("class", "mnodes");
            objects.mnode = objects.mnodes.selectAll("g")
                .data(data.mini)
                .enter().append("g");
            objects.mnode.append("circle")
                .attr("id", function(d) {
                    return d.pointid;
                })
                .attr("class", function(d) { return "circle-" + d.pointid; })
                .attr("r", 1)
                .style("fill", function(d) { return '#fff'; });

            objects.mtoday = objects.mini.append("line").attr("class", "mtoday");
        };
        ktChart.prototype.brush_set_size = function(){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects;

            objects.mnodes.attr("width", dimentions.width).attr("height", options.miniHeight);
            objects.mini.attr("width", dimentions.width).attr("height", options.miniHeight).attr('transform', 'translate(0,' + (dimentions.height - options.miniHeight) + ')');
            objects.mini.select("rect").attr('width', dimentions.width).attr("height", options.miniHeight);

            objects.brush = d3.brushX().extent([[options.margin.left * 2, 0], [dimentions.chartwidth, options.miniHeight]]).on("end", brushended);
            objects.mini.select(".brush").call(objects.brush);

            objects.mx = d3.scaleLinear().range([options.margin.left * 2, dimentions.chartwidth]);
            objects.my = d3.scaleLinear().range([self.options.miniHeight - 20, 20]);

            function brushended(){
                if (!d3.event.sourceEvent) return; // Only transition after input.
                // check empty selections.
                if (!d3.event.selection) {
                    objects.selection = null;
                    objects.x.domain(d3.extent(data.nodes, function(d) { return d.index; }));
                } else {
                    objects.selection = d3.event.selection.map(objects.mx.invert);
                    objects.x.domain(objects.selection);
                    objects.brusharea.transition().duration(options.durationCount).call(objects.brush.move, objects.selection.map(objects.mx));
                }
                self.graph_calculate();
                self.graph_render_xaxis();
                self.graph_show_nodes(options.durationCount);
            }
        };
        ktChart.prototype.brush_calculate = function(){
            var self = this;
            var data = self.options.data,
                options = self.options,
                objects = self.objects;

            objects.mx.domain(d3.extent(data.mini, function(d) { return d.index; }));
            objects.my.domain([options.maxY, 0]);

            data.mini.forEach(function(d){
                d.x = objects.mx(d.index);
                d.y = objects.my(d[options.yfield] + .5);
                /*
                if (d[options.yfieldPosition] % 2 == 0) {
                    d.y = objects.my(d[options.yfield] + .5 + d[options.yfieldPosition]/2 * options.pointStep);
                } else {
                    d.y = objects.my(d[options.yfield] + .5 + (-d[options.yfieldPosition]/2 - 1/2) * options.pointStep);
                }
                */
            });
        };
        ktChart.prototype.brush_render_yaxis = function(){
            var self = this;
            var options = self.options,
                dimentions = self.dimentions,
                objects = self.objects;

            if (options.maxY <= options.yMaxCaptionCount) {
                objects.mgrid.call(make_y_gridlines().tickSize(-dimentions.width)).attr("transform", "translate(0,0)");
                function make_y_gridlines() {
                    return d3.axisLeft(objects.my).ticks(options.maxY);
                };
            } else {
                objects.mgrid.selectAll(".tick").remove();
            }
            objects.mtoday
                //.transition().duration(options.durationCount)
                .attr("x1", objects.mx(options.today)).attr("y1", 0)
                .attr("x2", objects.mx(options.today)).attr("y2", self.options.miniHeight);
        };
        ktChart.prototype.brush_update_selection = function(){
            var self = this;
            var objects = self.objects;
            if (objects.selection) {
                objects.brusharea
                    //.transition().duration(options.durationCount)
                    .call(objects.brush.move, objects.selection.map(objects.mx));
            }
        };
        ktChart.prototype.brush_clear_selection = function(){
            var self = this;
            var data = self.options.data,
                objects = self.objects;
            if (objects.selection) {
                objects.selection = null;
                objects.x.domain(d3.extent(data.nodes, function(d){ return d.date; }));
                objects.brusharea.call(objects.brush.move, null);
            }
        };
        ktChart.prototype.brush_show_nodes = function(durationCount) {
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            data.mini.map(function(_m){
                _m.visible = false;
                var _arr = data.nodes.filter(function(_d){ return _d.pointid == _m.pointid});
                if (_arr.length > 0)
                    _m._visible = _arr[0]._visible;
            })

            /*no transition*/
            objects.mnode.selectAll("circle")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            /*transition*/
            objects.mnode.selectAll("circle")
                .transition().duration(durationCount)
                .style("opacity", function(d){ return d._visible ? (d._visible_legend ?  options.opacity.in : options.opacity.out) : options.opacity.out; });
        };
        ktChart.prototype.brush_resize = function(){
            var self = this;
            self.brush_set_size();
            self.brush_calculate();
            self.brush_render_yaxis();
            self.brush_update_selection();
            self.brush_show_nodes(0);
        };

        ktChart.prototype.node_mouseover = function(_d){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            d3.select('.circle-' + _d.pointid)
                .attr('r',function(d){
                    if (d._visible) {
                        $('circle#' + d.pointid).tooltip({
                            follow: false,
                            tooltip: [
                                '<div class="trow"><div class="name">Название</div><div class="value">' + d.code + '. ' + d.name + '</div></div>',
                                '<div class="trow"><div class="name">Ответственный</div><div class="value">' + (d.leadername ? d.leadername : '') + '</div></div>',
                                '<div class="trow"><div class="name">Дата</div><div class="value">' + (d._date?d._date:'') + '</div></div>',
                                '<div class="trow"><div class="name">Статус</div><div class="value">' + d.statusname + '</div></div>',
                                '<div class="trow"><div class="name">Проект</div><div class="value">' + d.projectname + '</div></div>',
                                '<div class="trow"><div class="name">Портфель</div><div class="value">' + d.portfolioname + '</div></div>'
                            ].join('')
                        });
                        $('circle#' + d.pointid).tooltip('show', d3.event);
                        return d.radius * 3;
                    }
                });
        };
        ktChart.prototype.node_mouseout = function(_d){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            d3.select('.circle-' + _d.pointid)
                .attr('r',function(d){
                    if (d._visible) {
                        $('circle#' + d.pointid).tooltip('hide');
                        return  d.pointid == data.connected_n.pointid ? d.radius * 2 : d.radius;
                    }
                });
        };
        ktChart.prototype.node_open = function(_d){
            var self = this;
            self.get_nodes_connected(_d);
            self.node_mouseout(_d);
            self.options.ktdom.info_show_tab('connected');
        };
        ktChart.prototype.node_select = function(_d){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            /*select node on viz*/
            d3.select('.circle-' + _d.pointid)
                .style('fill',function(d){
                    d._selected = !d._selected;
                    return d._selected ? '#ff4800' : functions.color(d);
                });

            /*update data._selected array*/
            if (_d._selected){
                data.selected.push(_d);
            } else {
                data.selected.forEach(function(d, i){
                    if (d.pointid == _d.pointid) {
                        data.selected.splice(i, 1);
                    }
                });
            }

            self.link_select(_d);
            self.options.ktdom.info_filtered_update(_d);
            self.options.ktdom.info_selected_update(_d);
            self.options.ktdom.info_connected_update(_d);
        };
        ktChart.prototype.link_select = function(_d){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            data.links.forEach(function(l){
                var _selected = false;
                if (l.source.pointid == _d.pointid){
                    data.selected.forEach(function(s, i){
                        if (l.target.pointid == s.pointid) {
                            l._selected = _d._selected;
                            _selected = l._selected;
                        }
                    });
                } else if (l.target.pointid == _d.pointid) {
                    data.selected.forEach(function(s, i){
                        if (l.source.pointid == s.pointid) {
                            l._selected = _d._selected;
                            _selected = l._selected;
                        }
                    });
                }
            });

            objects.link
                .style("stroke", function(d){
                    return d._selected ? '#ff4800' : functions.color(d.source);
                });
            objects.defs.selectAll("marker").select("path")
                .style("fill", function(d){
                    return d._selected ? '#ff4800' : functions.color(d.source);
                });
        };

        ktChart.prototype.get_nodes_filtered = function(){
            var self = this;
            var data = self.options.data;
            data.filtered = [];
            data.nodes.forEach(function(d){
                if (d._filtered) data.filtered.push(d);
            });
            data.filtered.sort(function(a,b){
                if (a.name > b.name) { return 1; }
                if (a.name < b.name) { return -1; }
                return 0;
            });
        };
        ktChart.prototype.get_nodes_connected = function(_d){
            var self = this;
            var data = self.options.data;
            data.connected = [_d];
            data.connected_n = _d;
            data.connected_s = [];
            data.connected_t = [];
            if (_d.pointid) {
                data.links.forEach(function(l){ l._connected = false; });
                data.nodes.forEach(function(d){
                    if (d.pointid == _d.pointid) {
                        d._connected = true;
                    } else {
                        var _connected = false;
                        data.links.forEach(function(l){
                            if (l.source.pointid == d.pointid && l.target.pointid == _d.pointid){
                                _connected = true;
                                d._connected = true;
                                l._connected = true;
                                data.connected.push(d);
                                data.connected_s.push(d);
                            } else if (l.target.pointid == d.pointid && l.source.pointid == _d.pointid) {
                                _connected = true;
                                d._connected = true;
                                l._connected = true;
                                data.connected.push(d);
                                data.connected_t.push(d);
                            }
                        });
                        if (!_connected) d._connected = false;
                    }
                });
            }
            data.connected.sort(function(a,b){
                if (a.name > b.name) { return 1; }
                if (a.name < b.name) { return -1; }
                return 0;
            });
            data.connected_s.sort(function(a,b){
                if (a.name > b.name) { return 1; }
                if (a.name < b.name) { return -1; }
                return 0;
            });
            data.connected_t.sort(function(a,b){
                if (a.name > b.name) { return 1; }
                if (a.name < b.name) { return -1; }
                return 0;
            });
        };
        ktChart.prototype.visible_nodes_filtered = function(){
            var self = this;
            var data = self.options.data;
            data.nodes.forEach(function(d){
                d._visible = d._filtered;
                d._viztype = 'filtered';
            });
            data.links.forEach(function(d){
                d._visible = d._filtered;
            });
        };
        ktChart.prototype.visible_nodes_selected = function(){
            var self = this;
            var data = self.options.data;
            data.nodes.forEach(function(d){
                d._visible = d._selected;
                d._viztype = 'selected';
            });
            data.links.forEach(function(d){
                d._visible = d._selected;
            });
        };
        ktChart.prototype.visible_nodes_connected = function(){
            var self = this;
            var data = self.options.data;
            data.nodes.forEach(function(d){
                d._visible = d._connected;
                d._viztype = 'connected';
            });
            data.links.forEach(function(d){
                d._visible = d._connected;
            });
        };
        ktChart.prototype.clear_nodes_selected = function(){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            /*update data*/
            data.selected = [];
            data.nodes.forEach(function(d){ d._selected = false; });
            data.links.forEach(function(d){ d._selected = false; });

            /*update colors on viz*/
            objects.node.select('circle').attr("fill", function(d){ return functions.color(d); });
            objects.link.style("stroke", function(d){ return functions.color(d.source); });
            objects.defs.selectAll("marker").select("path").attr("fill", function(d){ return functions.color(d.source); });

            /*update tabs*/
            self.options.ktdom.info_selected_update();
            self.options.ktdom.info_connected_update();
            self.options.ktdom.info_filtered_render();
            self.options.ktdom.info_show_tab('filtered');
        };
        ktChart.prototype.connect_nodes_selected = function(){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            data.selected.forEach(function(d, i, nodes){
                if (i > 0) {
                    var source = nodes[i-1];
                    var target = nodes[i];
                    var links = data.links.filter(function(d){ return d.source.pointid == source.pointid && d.target.pointid == target.pointid;  });
                    if (links.length == 0)
                        data.links.push({
                            source: source,
                            target: target,
                            _connected: false,
                            _filtered: source._filtered && target._filtered,
                            _selected: true,
                            _visible: true,
                            _visible_legend: true,
                        });
                }
            });

            /* add arrows */
            objects.def = objects.defs.selectAll("marker").data(data.links)
            objects.def
                .enter().append("svg:marker")
                .attr("id", function(d) { return d.source.pointid + '-' + d.target.pointid; })
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", 0)
                .attr("markerWidth", 8)
                .attr("markerHeight", 8)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5")
                .style("fill", function(d){ return functions.color(d.source); });
            objects.def = objects.defs.selectAll("marker");

            /* add links */
            objects.link = objects.links.selectAll(".link").data(data.links)
            objects.link
                .enter().append("path")
                .attr("class", "link")
                .attr("marker-end", function(d) { return "url(#" + d.source.pointid + '-' + d.target.pointid + ")"; })
                .style('fill', 'none');
            objects.link = objects.links.selectAll(".link");

            self.graph_show_nodes(0);
        };
        ktChart.prototype.disconnect_nodes_selected = function(_d, sourcePointid, targetPointid){
            var self = this;
            var data = self.options.data,
                options = self.options,
                dimentions = self.dimentions,
                objects = self.objects,
                functions = self.functions;

            data.links.forEach(function(d, i, links){
                if (d.source.pointid == sourcePointid && d.target.pointid == targetPointid)
                    links.splice(i,1);
            });
            data.connected_s.forEach(function(d, i, snodes){
                if (d.pointid == sourcePointid) {
                    snodes.splice(i,1);
                    data.connected.splice(data.connected.indexOf(d), 1);
                    data.nodes.filter(function(f){ return f.index == d.index; })[0]._connected = false;
                }
            });
            data.connected_t.forEach(function(d, i, tnodes){
                if (d.pointid == targetPointid){
                    tnodes.splice(i,1);
                    data.connected.splice(data.connected.indexOf(d), 1);
                    data.nodes.filter(function(f){ return f.index == d.index; })[0]._connected = false;
                }
            });

            /* remove arrows */
            objects.def = objects.def.data(data.links);
            objects.def.exit().remove();

            /* remove links */
            objects.link = objects.link.data(data.links);
            objects.link.exit().remove();

            self.options.ktdom.info_connected_render(_d);
            self.graph_show_nodes(0);
        };

        ktChart.prototype.on_connect = function(){
            var self = this;
            var data = self.options.data,
                options = self.options;
            options.onConnect(data.selected, function(){
                self.connect_nodes_selected();
            });
        };
        ktChart.prototype.on_disconnect = function(_d, sourcePointid, targetPointid){
            var self = this;
            var options = self.options;
            options.onDisconnect(sourcePointid, targetPointid, function(){
                self.disconnect_nodes_selected(_d, sourcePointid, targetPointid);
            });
        };

        return ktChart;
    })();

    // [CHANGE] Инициализация плагина вынесена в файл ktChart.model.js
}).call(this);
