var OrgChart = function(options){
    var that = this._orgchart = {};
    that.data = {
        data: null,
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({ height: '100%' }),
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
                '</div>',
            '</div>'
        ].join('')),
        input: $([
            '<span class="input input__has-clear card__header-element_stretch" data-width="500">',
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
            '<button class="button" type="button" data-fc="button" data-tooltip="Предыдущий" data-disabled="true">',
            '<span class="icon icon_svg_left"></span>',
            '</button>'
        ].join('')),
        button__right: $([
            '<button class="button" type="button" data-fc="button" data-tooltip="Следующий" data-disabled="true">',
            '<span class="icon icon_svg_right"></span>',
            '</button>'
        ].join('')),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };
    that.data._private = {
        search_results: []
    };

    that.render = function(){
        that.data._el.content.find('#orgchart__actions').append(
            that.data._el.input,
            that.data._el.button__left,
            that.data._el.button__right
        );
        that.data._el.target.append(
            that.data._el.content
        );
    };
    that.renderTree = function(){
        // Calculate total nodes, max label length
        var containerid = 'orgchart__container';
        var totalNodes = 0;
        var levelNodes = [];
        var maxLabelLength = 0;
        var i = 0;
        var duration = 300;
        var root;
        var margin = {
            top: 150, right: 100, bottom: 100, left: 100
        };
        var dims = {
            width: 100, height: 150
        };
        var padding = {
            top: 100,
            right: 20
        };

        // size of the diagram
        var viewerWidth = $('#' + containerid).outerWidth();
        var viewerHeight = $('#' + containerid).outerHeight();
        var tree = d3.layout.tree().size([viewerWidth, viewerHeight]);

        // define a d3 diagonal projection for use by the node paths later on.
        var diagonal = d3.svg.diagonal().projection(function(d) {
            return [d.x, d.y];
        });

        // A recursive helper function for performing some setup by walking through all nodes
        function visit(parent, visitFn, childrenFn) {
            if (!parent) return;
            visitFn(parent);
            var children = childrenFn(parent);
            if (children) {
                var count = children.length;
                for (var i = 0; i < count; i++) {
                    visit(children[i], visitFn, childrenFn);
                }
            }
        }
        visit(that.data.data, function(d) {
            totalNodes++;
            d.id = totalNodes;
            maxLabelLength = Math.max(d.name.length, maxLabelLength);
        }, function(d) {
            return d.children && d.children.length > 0 ? d.children : null;
        });
        // Call visit function to establish maxLabelLength

        // sort the tree according to the node names
        function sortTree() {
            tree.sort(function(a, b) {
                return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
            });
        }
        sortTree();
        // Sort the tree initially incase the JSON isn't in a sorted order.

        // Define the zoom function for the zoomable tree
        function zoom() {
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
        var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
        // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents

        // define the baseSvg, attaching a class for styling and the zoomListener
        var baseSvg = d3.select('#' + containerid).append("svg")
            .attr("width", viewerWidth)
            .attr("height", viewerHeight)
            .attr("class", "overlay")
            .call(zoomListener);

        // Function to center node when clicked/highlighted so node doesn't get lost when collapsing/moving with large amount of children.
        function centerNode(source) {
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
        }
        function centerNodeId(id) {
            var source = search(id);
            centerNode(source);
        }

        // Toggle children function
        function toggleChildren(d) {
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
        }
        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
                d._collapsed = true;
            }
        }
        function expand(d) {
            if (d._children) {
                d.children = d._children;
                d.children.forEach(expand);
                d._children = null;
                d._collapsed = false;
            }
        }

        // Toggle children on click.
        function click(d) {
            //if (d3.event.defaultPrevented) return; // click suppressed
            d = toggleChildren(d);
            update(d);
            centerNode(d);
        }
        function update(source) {
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
            renderNode(node, source);

            // Update the links…
            var link = svgGroup.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                });
            renderLink(link, source);

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
        function renderNode(node, source) {
            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                })
                .on("click", function(d){ return highlight(d.id); });

            nodeEnter.append("rect")
                .attr('class', 'nodeRect')
                .attr("x", -dims.width/2)
                .attr("y", -dims.height/2)
                .attr("width", dims.width)
                .attr("height", dims.height)
                .style("stroke", function(d) {
                    return d._children ? "lightsteelblue" : "#ccc";
                });

            /*
             nodeEnter.append("circle")
             .attr('class', 'nodeCircleIn')
             .attr("r", 5)
             .style("fill", "#fff")
             .attr("transform", function(d) {
             return "translate(0,-" + dims.height/2 + ")";
             });
             */

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
                .on("click", function(d){ return click(d); });

            nodeEnter.append("text")
                .attr("x", function(d) {
                    //return d.children || d._children ? -10 : 10;
                    return 0;
                })
                .attr("dy", ".35em")
                .attr('class', 'nodeText')
                .attr("text-anchor", "middle")
                .text(function(d) {
                    return d.name;
                })
                .style("fill-opacity", 0);

            // Update the text to reflect whether node has children or not.
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
            nodeUpdate.select("text")
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

            nodeExit.select("text")
                .style("fill-opacity", 0);
        }
        function renderLink(link, source) {
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
        }

        // search node
        function search(id) {
            var node = null;
            visit(that.data.data, function(d) {
                if (d.id == id) {
                    node = d;
                }
            }, function(d) {
                return d.children && d.children.length > 0 ? d.children : d._children && d._children.length > 0 ? d._children : null;
            });
            return node;
        }
        function searchParent(id) {
            var node = null;
            visit(that.data.data, function(d) {
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
        }
        function toggle(id) {
            var node = search(id);
            var parent = searchParent(id);
            if (parent) {
                highlight(parent.id);
                if (parent._collapsed) {
                    toggleChildren(parent);
                    update(parent);
                    centerNode(parent);
                }
            }
            toggleChildren(node);
            update(node);
            centerNode(node);
        }
        function highlight(id) {
            var node = search(id);
            var parent = searchParent(id);
            if (parent) {
                highlight(parent.id);
                if (parent._collapsed) {
                    toggleChildren(parent);
                    update(parent);
                    centerNode(parent);
                }
            }
            update(node);
            centerNode(node);
        }

        // Append a group which holds all nodes and which the zoom Listener can act upon.
        var svgGroup = baseSvg.append("g");

        // Define the root
        root = that.data.data;
        root.x0 = viewerWidth / 2;
        //root.y0 = viewerHeight / 2;
        root.y0 = margin.top;

        // Layout the tree initially and center on the root node.
        root.children.forEach(collapse);
        update(root);
        centerNode(root);
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.bind = function(){
        that.data._el.input.find('.input__control').on('keydown', function(e){
            if (e.which == 13) {
                that.loader_add();
                var value = that.data._el.input.input('value');
                that.data._el.button__left.button('disable');
                that.data._el.button__right.button('disable');
                that.data._private.search_results = [];
                /*
                that.data.data.map(function(item){
                    if (item.OrgName.toLowerCase().indexOf(value.toLowerCase()) > 0) {
                        that.data._private.search_results.push(item);
                    }
                });
                console.log(that.data._private.search_results);
                */
                that.data._el.button__left.button('enable');
                that.data._el.button__right.button('enable');
                that.loader_remove();
            }
        });
    };
    that.init_components = function(){
        that.data._el.input.input();
        that.data._el.button__left.button();
        that.data._el.button__right.button();
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.render();
            that.renderTree();
            that.init_components();
            that.bind();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};