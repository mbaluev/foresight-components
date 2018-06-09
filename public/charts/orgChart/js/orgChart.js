var OrgChart = {};
OrgChart.Init = function(options){
    var that = this._orgchart = {};
    that.data = {
        containerid: '',
        data: null,
        dataTree: null,
        root: {
            id: null,
            name: 'ПМ Форсайт'
        },
        func: {
            search: null
        }
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),

        /*
        content: $([
            '<div class="card">',
                '<div class="card__header">',
                    '<div class="card__header-row">',
                        '<div class="card__header-column card__header-column_start">',
                            '<label class="card__name"><span class="card__name-text">Оргструктура</span></label>',
                        '</div>',
                        '<div class="card__header-column card__header-element_stretch" id="orgchart__actions"></div>',
                    '</div>',
                '</div>',
                '<div class="card__main">',
                    '<div class="card__middle">',
                        '<div class="card__middle-scroll" id="orgchart__container" style="overflow: hidden;"></div>',
                    '</div>',
                    '<div class="card__right card__right_border card__right_size_lg"></div>',
                '</div>',
            '</div>'
        ].join('')),
        */
        card: $('<div class="card"></div>'),
        card__header: $('<div class="card__header"></div>'),
        card__header_row: $('<div class="card__header-row"></div>'),
        card__header_name: $([
            '<div class="card__header-column card__header-column_start">',
            '<label class="card__name"><span class="card__name-text">Оргструктура</span></label>',
            '</div>'
        ].join('')),
        card__header_actions: $('<div class="card__header-column card__header-element_stretch"></div>'),
        card__main: $('<div class="card__main"></div>'),
        card__middle: $('<div class="card__middle"></div>'),
        card__middle_container: $('<div class="card__middle-scroll" id="orgchart__container" style="overflow: hidden;"></div>'),
        card__right: $('<div class="card__right card__right_border card__right_size_lg"></div>'),

        input: $([
            '<span class="input input__has-clear card__header-element_stretch" data-width="auto">',
            '<span class="input__box">',
            '<span class="alertbox" data-fc="alertbox">',
            '<span class="icon icon_svg_search"></span>',
            '</span>',
            '<input type="text" class="input__control">',
            '<button class="button" type="button" data-fc="button" tabindex="-1">',
            '<span class="icon icon_svg_close"></span>',
            '</button>',
            '</span>',
            '</span>'
        ].join('')),
        button__left: $([
            '<button class="button" type="button" data-fc="button" data-disabled="true">',
            '<span class="icon icon_svg_left"></span>',
            '</button>'
        ].join('')),
        button__right: $([
            '<button class="button" type="button" data-fc="button" data-disabled="true">',
            '<span class="icon icon_svg_right"></span>',
            '</button>'
        ].join('')),
        button__toggle: $([
            '<button class="button" type="button" data-fc="button" data-toggle="right">',
            '<span class="icon icon_svg_bars"></span>',
            '</button>'
        ].join('')),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };
    that.data._private = {
        selected: {
            orgid: null,
            userid: null
        },
        search: {
            users: [],
            results: [],
            index: [0],
            userid: [0]
        }
    };

    that.prepare = function(){
        that.data.root.children = [];
        that.data.dataTree = $.extend(true, {}, that.data.root);
        that.hierarchy(that.data.data, that.data.dataTree);
    };
    that.hierarchy = function(items, parent){
        items.map(function(item){
            if (item.parentid == parent.id) {
                if (typeof parent.children == 'undefined') { parent.children = []; }
                if (parent.children.filter(function(d){ return d.id == item.id; }).length == 0) {
                    parent.children.push(item);
                    that.hierarchy(items, item);
                }
            }
        });
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.card.append(
                that.data._el.card__header.append(
                    that.data._el.card__header_row.append(
                        that.data._el.card__header_name,
                        that.data._el.card__header_actions.append(
                            that.data._el.input,
                            that.data._el.button__left,
                            that.data._el.button__right,
                            that.data._el.button__toggle
                        )
                    )
                ),
                that.data._el.card__main.append(
                    that.data._el.card__middle.append(
                        that.data._el.card__middle_container
                    ),
                    that.data._el.card__right
                )
            )
        );
    };
    that.render_right = function(){
        that.data.right = {
            caption: 'Заголовок',
            name: 'Название',
            buttons: [],
            tabs: [
                {
                    id: "group",
                    name: 'Подразделение',
                    content: null,
                    padding: 0
                },
                {
                    id: "user",
                    name: 'Сотрудник',
                    content: null,
                    padding: 0
                },
                {
                    id: "results",
                    name: 'Результаты поиска',
                    content: null,
                    padding: 0
                }
            ]
        };
        that.data.right._el = {
            card: $('<div class="card" data-fc="card"></div>'),
            card__header: $('<div class="card__header"></div>'),
            card__header_row_caption: $('<div class="card__header-row"></div>'),
            card__header_row_name: $('<div class="card__header-row"></div>'),
            card__header_row_tabs: $('<div class="card__header-row tabs"></div>'),
            tabs__list: $('<ul class="tabs__list"></ul>'),
            card__main: $('<div class="card__main"></div>'),
            card__middle: $('<div class="card__middle"></div>'),
            card__middle_scroll: $('<div class="card__middle-scroll"></div>'),
            tabs_pane: $('<div class="tabs__pane"></div>')
        };
        that.render_view();
        that.render_header();
        that.render_tabs();
    };
    that.render_view = function(){
        that.data._el.card__right.append(
            that.data.right._el.card.append(
                that.data.right._el.card__header.append(
                    //that.data.right._el.card__header_row_caption,
                    //that.data.right._el.card__header_row_name,
                    that.data.right._el.card__header_row_tabs.append(
                        that.data.right._el.tabs__list
                    )
                ),
                that.data.right._el.card__main.append(
                    that.data.right._el.card__middle.append(
                        that.data.right._el.card__middle_scroll
                    )
                )
            )
        );
    };
    that.render_header = function(){
        that.render_header_caption();
        that.render_header_name();
    };
    that.render_header_caption = function(){
        that.render_header_caption_name();
        that.render_header_caption_buttons();
    };
    that.render_header_caption_name = function(){
        that.data.right._el.card__header_row_caption.append($(
            '<div class="card__header-column">' +
            '<label class="card__caption">' +
            '<span class="card__caption-text">' + that.data.right.caption + '</span>' +
            '</label>' +
            '</div>'
        ));
    };
    that.render_header_caption_buttons = function(){
        var $buttons_column = $('<div class="card__header-column"></div>');
        that.data.right._el.card__header_row_caption.append($buttons_column);
        that.data.right.buttons.forEach(function(button){
            var $button = $(
                '<button class="button button__' + button.name + '" data-fc="button" ' +
                (button.tooltip ? 'data-tooltip="' + button.tooltip + '"' : '') + '>' +
                (button.icon ? '<span class="icon ' + button.icon + '"></span>' : '') +
                (button.caption ? '<span class="button__text"> ' + button.caption + '</span>' : '') +
                '</button>'
            );
            if (button.action) {
                if (typeof that[button.action] === "function") {
                    $button.on('click', that[button.action]);
                }
                if (!that.data._triggers[button.action]) {
                    $button.on('click', function(){
                        self.trigger(button.action + '.fc.modal', [that.data.items]);
                    });
                }
            }
            $buttons_column.append($button);
        });
    };
    that.render_header_name = function(){
        that.data.right._el.card__header_row_name.append($(
            '<div class="card__header-column card__header-column_start card__header-column_flex_1-1-auto">' +
            '<label class="card__name">' +
            '<span class="card__name-text">' + that.data.right.name + '</span>' +
            '</label>' +
            '</div>'
        ));
    };
    that.render_tabs = function(){
        if (that.data.right.tabs.length == 1) {
            that.data.right.tabs[0].active = true;
        } else {
            var has_active_tab = false;
            that.data.right.tabs.forEach(function(tab) {
                if (tab.active) {
                    has_active_tab = true;
                }
            });
            if (!has_active_tab) {
                that.data.right.tabs[0].active = true;
            }
        }
        that.data.right.tabs.forEach(function(tab){
            var $tab__link = $([
                '<a class="tabs__link link" href="#' + tab.id + '" data-fc="tab">',
                '<button class="button" data-fc="button">',
                '<span class="button__text">' + tab.name + '</span>',
                '</button>',
                '</a>'
            ].join(''));
            $tab__link.data('data', tab.data);
            $tab__link.data('onclick', tab.onclick);
            that.data.right._el.tabs__list.append(
                $((tab.active ? '<li class="tabs__tab tabs__tab_active"></li>' : '<li class="tabs__tab"></li>' ))
                    .append(
                    $tab__link
                )
            );
            that.data.right._el.card__middle_scroll.append(
                that.data.right._el.tabs_pane.clone()
                    .attr('id', tab.id)
                    .addClass((tab.active ? 'tabs__pane_active' : ''))
                    .css('padding', tab.padding)
                    .append(tab.content));
        });
    };
    that.render_tab = function(id, content){
        that.data.right._el.card__middle_scroll.find('#' + id).html('').append(
            content
        );
    };
    that.render_tab_control = function(index, item, fieldName, title, fieldId, link){
        if (item) {
            if (typeof item[fieldName] != 'undefined') {
                if (item[fieldName] && item[fieldName] != 'null') {
                    var _el = {
                        control: $('<div class="control control_padding-bottom_none control_padding-left control_padding-right"></div>'),
                        control__caption: $('<div class="control__caption control__caption_size_s"></div>'),
                        control__text: $('<div class="control__text"></div>'),
                        control__container: $('<div class="control__container"></div>'),
                        link: (fieldId ? $('<a class="link" href="' + link + item[fieldId] + '?mode=view" target="_blank"></a>') : $('') )
                    };
                    if (index == 0) { _el.control.addClass('control_padding-top'); }
                    _el.control.append(
                        _el.control__caption.append(
                            _el.control__text.clone().text(title)
                        ),
                        _el.control__container.append(
                            fieldId ?
                                _el.control__text.clone().append(
                                    _el.link.text(item[fieldName])
                                ) :
                                _el.control__text.clone().text(item[fieldName])
                        )
                    );
                    return _el.control;
                }
            }
        }
        return null;
    };
    that.render_tab_group = function(id){
        var group = that.getDataItemById(id);
        if (that.data._private.selected.orgid == id) {
            that.update_tab_group_users();
        } else {
            var _el = {
                card: $('<div class="card" data-fc="card"></div>'),
                card__main: $('<div class="card__main card__main_flex-direction_column"></div>'),
                card__top: $('<div class="card__top"></div>'),
                card__middle: $('<div class="card__middle" style="padding-top: 10px;"></div>'),
                card__middle_scroll: $('<div class="card__middle-scroll" style="border-top: solid 1px #ddd;"></div>')
            };
            that.render_tab('group', _el.card);
            if (group) {
                _el.card.append(
                    _el.card__main.append(
                        _el.card__top,
                        _el.card__middle.append(
                            _el.card__middle_scroll
                        )
                    )
                );
                _el.card__top.append(that.render_tab_control(0, group, 'OrgName', 'Название организации', 'OrgId', '/asyst/OrgUnit/form/auto/'));
                _el.card__top.append(that.render_tab_control(1, group, 'FullName', 'Руководитель', 'UserId', '/asyst/User/form/auto/'));
                _el.card__top.append(that.render_tab_control(2, group, 'Title', 'Должность'));
                _el.card__top.append(that.render_tab_control(3, group, 'PhotoUrl', ''));
                _el.card__top.append(that.render_tab_control(4, group, 'UserCount', 'Количество сотрудников'));
                that.render_tab_group_users(group.OrgId, _el.card__middle_scroll, function($data){
                    _el.card__middle_scroll.append($data);
                });
            }
        }
        that.data._private.selected.orgid = id;
    };
    that.render_tab_group_users = function(orgid, cont, callback){
        that.loader_add(cont);
        if (typeof that.data.func.search == 'function') {
            that.data.func.search(
                that.data.data, orgid, null,
                function(results){
                    var $users = null;
                    if (results) {
                        that.data._private.search.users = results;
                        $users = $('<div class="control"></div>').append(
                            that.render_table_users(results, function(index, userid){
                                that.gotouser(userid);
                            })
                        );
                    }
                    if (typeof callback == 'function') {
                        callback($users);
                    }
                    that.update_tab_group_users();
                    that.loader_remove();
                }
            );
        } else {
            that.loader_remove();
        }
    };
    that.render_tab_user = function(user){
        if (user) { userid = user.id; } else { userid = null; }
        if (that.data._private.selected.userid != userid) {
            var $content = $('<div></div>');
            if (user) {
                $content.append(that.render_tab_control(0, user, 'FullName', 'ФИО', 'UserId', '/asyst/User/form/auto/'));
                $content.append(that.render_tab_control(1, user, 'Title', 'Должность'));
                $content.append(that.render_tab_control(2, user, 'PhotoUrl', ''));
                $content.append(that.render_tab_control(3, user, 'OrgName', 'Название организации', 'OrgId', '/asyst/OrgUnit/form/auto/'));
                $content.append(that.render_tab_control(4, user, 'RoleName', 'Роль'));
                that.data._private.selected.userid = user.UserId;
            }
            that.render_tab('user', $content);
        }
    };
    that.render_tab_results = function(){
        that.render_tab('results', that.render_table_users(that.data._private.search.results, function(index, userid){
            that.goto(index);
        }));
    };
    that.render_table_users = function(arr, onclick){
        var $table = $('<table class="table"></table>');
        var $thead = $([
            '<thead><tr>',
            '<td class="align_left" width="115">ФИО</td>',
            '<td class="align_left">Должность</td>',
            '</tr></thead>'
        ].join(''));
        var $tbody = $('<tbody></tbody>');
        if (arr.length == 0) {
            $tbody.append($('<tr><td colspan="2">Ничего не найдено</td></tr>'));
        } else {
            arr.map(function(res, index){
                var $tr = $([
                    '<tr data-index="' + index + '" data-userid=' + res.UserId + '>',
                    '<td>',
                    '<a class="link" href="/asyst/User/form/auto/' + res.UserId + '?mode=view" target="_blank">' + res.FullName + '</a>',
                    '</td>',
                    '<td>' + (res.Title ? res.Title : '') + '</td>',
                    '</tr>'
                ].join(''));
                $tr.on('click', function(){
                    var index = $(this).data('index');
                    var userid = $(this).data('userid');
                    onclick(index, userid);
                }).on('mouseover', function(){
                    $(this).css('cursor', 'pointer');
                }).on('mouseout', function(){
                    $(this).css('cursor', 'default');
                });
                $tbody.append($tr);
            });
        }
        return $table.append($thead, $tbody);
    };
    that.active_tab = function(id){
        that.data.right._el.tabs__list
            .find('[href="#' + id + '"]')
            .tabs('show');
    };

    that.getDataItemById = function(id){
        var item = that.data.data.filter(function(d){
            return d.id == id;
        });
        if (item.length > 0) {
            item = item[0];
        } else {
            item = null;
        }
        return item;
    };

    that.update_search_index = function(source){
        that.data._private.search.index = [];
        that.data._private.search.userid = [];
        that.data._private.search.results.map(function(result, index){
            if (result.id == source.id) {
                that.data._private.search.index.push(index);
                that.data._private.search.userid.push(result.UserId);
            }
        });
        if (that.data._private.search.index.length == 0) {
            that.data._private.search.index = [-1];
            that.data._private.search.userid = [0];
        }
    };
    that.update_buttons = function(){
        that.data._el.button__left.button('enable');
        that.data._el.button__right.button('enable');
        if (Math.min.apply(null, that.data._private.search.index) <= 0) {
            that.data._el.button__left.button('disable');
        }
        if (Math.max.apply(null, that.data._private.search.index) >= that.data._private.search.results.length - 1) {
            that.data._el.button__right.button('disable');
        }
    };
    that.update_tab_results = function(){
        that.data.right._el.card__middle_scroll
            .find('#results').find('tr').each(function(){
                $(this).find('.link').css('color', '');
                var index = $(this).data('index');
                if (that.data._private.search.index.indexOf(index) >= 0) {
                    $(this).find('.link').css('color', '#ff5940');
                }
            });
    };
    that.update_tab_group_users = function(){
        var scrolled = false;
        that.data.right._el.card__middle_scroll
            .find('#group').find('tr').each(function(){
                $(this).find('.link').css('color', '');
                var userid = $(this).data('userid');
                if (that.data._private.search.userid.indexOf(userid) >= 0) {
                    $(this).find('.link').css('color', '#ff5940');
                    if (!scrolled) {
                        scrolled = true;
                        that.data.right._el.card__middle_scroll.find('#group .card__middle_scroll')
                            .animate({
                                scrollTop: $(this).position().top - 10
                            });
                    }
                }
            });
    };

    // -------------------
    // d3 functions. begin
    // -------------------
    var totalNodes = 0,
        levelNodes = [],
        maxLabelLength = 0,
        duration = 300,
        i = 0,
        root,
        currentNode,
        margin = {
            top: 150, right: 100, bottom: 100, left: 100
        },
        dims = {
            width: 100, height: 150
        },
        padding = {
            top: 100,
            right: 20
        },
        viewerWidth, viewerHeight,
        tree,
        diagonal,
        zoomListener,
        baseSvg,
        svgGroup;

    that.renderTree = function(){
        viewerWidth = that.data._el.card__middle_container.outerWidth();
        viewerHeight = that.data._el.card__middle_container.outerHeight();
        tree = d3.layout.tree().size([viewerWidth, viewerHeight]);

        // define a d3 diagonal projection for use by the node paths later on.
        diagonal = d3.svg.diagonal().projection(function(d) {
            return [d.x, d.y];
        });

        // Call visit function to establish maxLabelLength
        that.visit(that.data.dataTree, function(d) {
            totalNodes++;
            maxLabelLength = Math.max(d.name.length, maxLabelLength);
        }, function(d) {
            return d.children && d.children.length > 0 ? d.children : null;
        });

        // Sort the tree initially incase the JSON isn't in a sorted order.
        that.sortTree();

        // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
        zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", that.zoom);

        // define the baseSvg, attaching a class for styling and the zoomListener
        baseSvg = d3.select('#' + that.data._el.card__middle_container.attr('id')).append("svg")
            .attr("width", viewerWidth)
            .attr("height", viewerHeight)
            .attr("class", "overlay")
            .call(zoomListener);

        // Append a group which holds all nodes and which the zoom Listener can act upon.
        svgGroup = baseSvg.append("g");

        // Define the root
        root = that.data.dataTree;
        root.x0 = viewerWidth / 2;
        //root.y0 = viewerHeight / 2;
        root.y0 = margin.top;

        // Layout the tree initially and center on the root node.
        root.children.forEach(that.collapse);
        that.update(root);
        that.centerNode(root);
    };
    that.resizeTree = function(){
        d3.select("svg").style('display', 'none');
        viewerWidth = that.data._el.card__middle_container.outerWidth();
        viewerHeight = that.data._el.card__middle_container.outerHeight();
        d3.select("svg")
            .style('display', 'block')
            .attr("width", viewerWidth)
            .attr("height", viewerHeight);
        that.centerNode(currentNode);
    };
    // A recursive helper function for performing some setup by walking through all nodes
    that.visit = function(parent, visitFn, childrenFn) {
        if (!parent) return;
        visitFn(parent);
        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                that.visit(children[i], visitFn, childrenFn);
            }
        }
    };
    // sort the tree according to the node names
    that.sortTree = function() {
        tree.sort(function(a, b) {
            return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
    };
    // Define the zoom function for the zoomable tree
    that.zoom = function() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    };
    // Function to center node when clicked/highlighted so node doesn't get lost when collapsing/moving with large amount of children.
    that.centerNode = function(source) {
        currentNode = source;
        scale = zoomListener.scale();
        scale = 1;
        y = -source.y0;
        x = -source.x0;
        x = x * scale + viewerWidth / 2;
        //y = y * scale + viewerHeight / 2;
        y = y * scale + margin.top;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    };
    that.centerNodeId = function(id) {
        var source = search(id);
        centerNode(source);
    };
    // Toggle children function
    that.toggleChildren = function(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
            d._collapsed = true;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
            d._collapsed = false;
        }
        return d;
    };
    that.collapse = function(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(that.collapse);
            d.children = null;
            d._collapsed = true;
        }
    };
    that.expand = function(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(that.expand);
            d._children = null;
            d._collapsed = false;
        }
    };
    // Toggle children on click.
    that.click = function(d) {
        //if (d3.event.defaultPrevented) return; // click suppressed
        d = that.toggleChildren(d);
        that.update(d);
        that.centerNode(d);
    };
    that.update = function(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        levelNodes = [];
        var childCount = function(level, n) {
            if (!levelNodes[level]) { levelNodes.push(1); }
            else { levelNodes[level]++; }
            n.level = level;
            n.index = levelNodes[level] - 1;
            if (n.children && n.children.length > 0) {
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);

        var newWidth = d3.max(levelNodes) * (dims.width + padding.right); // pixels per line
        tree = tree.size([newWidth, viewerHeight]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on dims.height.
        nodes.forEach(function(d) {
            d.y = (d.depth * (dims.height + padding.top)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node").data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });
        that.renderNode(node, source);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });
        that.renderLink(link, source);

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    };
    that.renderNode = function(node, source) {
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.x0 + "," + source.y0 + ")";
            })
            .on("click", function(d){ return that.highlight(d.id); });

        nodeEnter.append("rect")
            .attr('class', 'nodeRect')
            .attr("x", -dims.width/2)
            .attr("y", -dims.height/2)
            .attr("width", dims.width)
            .attr("height", dims.height)
            .style("stroke", function(d) {
                return d._children ? "lightsteelblue" : "#ccc";
            });

        nodeEnter.append("circle")
            .attr('class', 'nodeCircleOut')
            .attr("r", 5)
            .style("fill", function(d) {
                return (d.children || d._children) ? (d._collapsed ? 'lightsteelblue' : '#fff') : 'transparent';
            })
            .style("stroke", function(d) {
                return (d.children || d._children) ? 'steelblue' : 'transparent';
            })
            .attr("transform", function(d) {
                return "translate(0," + dims.height/2 + ")";
            })
            .on("click", function(d){ return that.click(d); });

        nodeEnter.append("text")
            .attr("x", -dims.width/2 + 12)
            .attr("y", -dims.height/2 + 20)
            .attr("width", dims.width)
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            //.attr("text-anchor", "middle")
            .attr("data-tooltip", function(d){ return d.name; })
            .text(function(d) {
                return (d.name.length > 9 ? d.name.substring(0, 9) + '...' : d.name);
            })
            .style("fill-opacity", 0);

        nodeEnter.append("text")
            .attr("x", -dims.width/2 + 12)
            .attr("y", dims.height/2 - 20)
            .attr("width", dims.width)
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("data-tooltip", function(d){
                if (d.FullName && d.FullName != "null") {
                    return (d.Title && d.Title != 'null' ? d.Title + '<br><br>' : '') + d.FullName;
                } else {
                    return '';
                }
            })
            .text(function(d) {
                if (d.FullName && d.FullName != "null") {
                    return (d.FullName.length > 9 ? d.FullName.substring(0, 9) + '...' : d.FullName);
                } else {
                    return '';
                }
            })
            .style("fill-opacity", 0);

        nodeEnter.append("image")
            .attr("x", -dims.width/2 + 10)
            .attr("y", -dims.height/2 + 40)
            .attr("width", function(d) {
                return (d.PhotoUrl && d.PhotoUrl != 'null' ? dims.width - 20 : 0);
            })
            .attr("height", function(d) {
                return (d.PhotoUrl && d.PhotoUrl != 'null' ? dims.width - 25 : 0);
            })
            .attr("href", function(d) {
                var that = this;
                if (d.PhotoUrl && d.PhotoUrl != 'null') {
                    var image = new Image();
                    image.onload = function(){ $(that).attr("href", d.PhotoUrl); };
                    image.onerror = function(){};
                    image.src = d.PhotoUrl;
                }
            });

        // Update the text to reflect whether node has children or not.
        /*
        node.select('text')
            .attr("x", function(d) {
                //return d.children || d._children ? -10 : 10;
                return 0;
            })
            .attr("text-anchor", function(d) {
                //return d.children || d._children ? "end" : "start";
                return "middle";
            })
            .text(function(d) {
                return d.name;
            });
        */

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircleOut")
            .style("fill", function(d) {
                return (d.children || d._children) ? (d._collapsed ? 'lightsteelblue' : '#fff') : 'transparent';
            })
            .style("stroke", function(d) {
                return (d.children || d._children) ? 'steelblue' : 'transparent';
            });

        node.select("rect.nodeRect")
            .style("stroke", function(d) {
                return d.id == source.id ? '#ff5940' : d._children ? "lightsteelblue" : "#ccc";
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        // Fade the text in
        nodeUpdate.selectAll("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.x + "," + source.y + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.selectAll("text")
            .style("fill-opacity", 0);
    };
    that.renderLink = function(link, source) {
        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", function(d){
                var source = {x: d.source.x, y: d.source.y + dims.height/2};
                var target = {x: d.target.x, y: d.target.y - dims.height/2};
                return diagonal({source: source, target: target});
            });

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();
    };
    // search node
    that.search = function(id) {
        var node = null;
        that.visit(that.data.dataTree, function(d) {
            if (d.id == id) {
                node = d;
            }
        }, function(d) {
            return d.children && d.children.length > 0 ? d.children : d._children && d._children.length > 0 ? d._children : null;
        });
        return node;
    };
    that.searchParent = function(id) {
        var node = null;
        that.visit(that.data.dataTree, function(d) {
            if (d.children && d.children.length > 0) {
                if (d.children.filter(function(c){ return c.id == id; }).length > 0) {
                    node = d;
                }
            }
            if (d._children && d._children.length > 0) {
                if (d._children.filter(function(c){ return c.id == id; }).length > 0) {
                    node = d;
                }
            }
        }, function(d) {
            return d.children && d.children.length > 0 ? d.children : d._children && d._children.length > 0 ? d._children : null;
        });
        return node;
    };
    that.toggle = function(id, first) {
        if (typeof first == 'undefined') { first = true; }
        var node = that.search(id);
        var parent = that.searchParent(id);
        if (parent) {
            that.highlight(parent.id, false);
            if (parent._collapsed) {
                that.toggleChildren(parent);
                that.update(parent);
            }
        }
        if (first) {
            that.toggleChildren(node);
            that.update(node);
            that.centerNode(node);
            console.log(node.name);
        }
    };
    that.highlight = function(id, first) {
        if (typeof first == 'undefined') { first = true; }
        var node = that.search(id);
        var parent = that.searchParent(id);
        if (parent) {
            that.highlight(parent.id, false);
            if (parent._collapsed) {
                that.toggleChildren(parent);
                that.update(parent);
            }
        }
        if (first) {
            that.update(node);
            that.centerNode(node);
            that.update_search_index(node);
            that.update_buttons();
            that.render_tab_group(id);
            that.render_tab_user();
            that.update_tab_results();
        }
    };
    // -------------------
    // d3 functions. end
    // -----------------

    that.loader_add = function(cont){
        var target;
        if (cont) {
            target = cont;
        } else {
            target = that.data._el.target;
        }
        target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.input.find('.input__control').on('keydown', function(e){
            if (e.which == 13) {
                that.loader_add();
                var value = that.data._el.input.input('value');
                that.data._private.search.index = [-1];
                that.data._private.search.userid = [0];
                that.data._private.search.results = [];
                if (typeof that.data.func.search == 'function') {
                    that.data.func.search(
                        that.data.data, null, value,
                        function(results){
                            if (!results) { results = []; }
                            that.data._private.search.results = results;
                            that.render_tab_results();
                            if (that.data._private.search.results.length > 0) {
                                that.next();
                            }
                            that.active_tab('results');
                            that.loader_remove();
                        }
                    );
                } else {
                    that.loader_remove();
                }
            }
        });
        that.data._el.input.find('.button').on('click', function(){
            that.data._private.search.index = -1;
            that.data._private.search.results = [];
            that.data._el.button__left.button('disable');
            that.data._el.button__right.button('disable');
            that.data.dataTree.children.forEach(that.collapse);
            that.highlight(that.data.dataTree.id);
            that.render_tab_results();
        });
        that.data._el.button__right.on('click.search', that.next);
        that.data._el.button__left.on('click.search', that.prev);
        $(window).on('resize', that.resizeTree);
    };
    that.prev = function(){
        var index = Math.min.apply(null, that.data._private.search.index);
        index--;
        if (index < 0) { index = 0; }
        that.highlight(that.data._private.search.results[index].id);
        /* update for selected user */
        that.data._private.search.index = [index];
        that.data._private.search.userid = [that.data._private.search.results[index].UserId];
        that.render_tab_user(that.data._private.search.results[index]);
        that.update_buttons();
        that.update_tab_results();
        that.update_tab_group_users();
    };
    that.next = function(){
        var index = Math.max.apply(null, that.data._private.search.index);
        index++;
        if (index == that.data._private.search.results.length) { index = that.data._private.search.results.length - 1; }
        that.highlight(that.data._private.search.results[index].id);
        /* update for selected user */
        that.data._private.search.index = [index];
        that.data._private.search.userid = [that.data._private.search.results[index].UserId];
        that.render_tab_user(that.data._private.search.results[index]);
        that.update_buttons();
        that.update_tab_results();
        that.update_tab_group_users();
        that.update_tab_group_users();
    };
    that.goto = function(index){
        that.highlight(that.data._private.search.results[index].id);
        /* update for selected user */
        that.data._private.search.index = [index];
        that.data._private.search.userid = [that.data._private.search.results[index].UserId];
        that.render_tab_user(that.data._private.search.results[index]);
        that.update_buttons();
        that.update_tab_results();
        that.update_tab_group_users();
    };
    that.gotouser = function(userid){
        var user = that.data._private.search.users.filter(function(d){ return d.UserId == userid; });
        if (user.length > 0) {
            that.render_tab_user(user[0]);
            that.active_tab('user');
        }
    };

    that.init_components = function(){
        that.data._el.input.input();
        that.data._el.button__left.button();
        that.data._el.button__right.button();
        that.data._el.card.card();
        that.data.right._el.card.card();
        that.data.right._el.card.find('[data-fc="tab"]').tabs();
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.render_right();
            that.render_tab_results();
            that.init_components();
            that.bind();
            that.prepare();
            that.renderTree();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
OrgChart.Search = function(data, orgid, value, callback){
    var results = [];
    if (orgid) {
        data.map(function(item){
            if (item.OrgId == orgid) {
                results.push(item);
            }
        });
    }
    if (value) {
        data.map(function(item){
            if (item.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                results.push(item);
            }
        });
    }
    if (typeof callback == 'function') { callback(results); }
};
OrgChart.Asyst = {};
OrgChart.Asyst.Search = function(data, orgid, value, callback){
    Asyst.APIv2.DataSet.load({
        name: 'OrgSearch',
        data: {
            OrgId: orgid,
            Filter: value
        },
        success: function(data){
            var results = [];
            data[0].map(function(d){
                d.id = d.OrgId;
                d.parentid = d.ParentId;
                d.name = d.OrgName;
                results.push(d);
                //var org = results.filter(function(r){ return r.id == d.OrgId; });
                //if (org.length == 0) { results.push(d); }
            });
            if (typeof callback == 'function') { callback(results); }
        }
    });
};