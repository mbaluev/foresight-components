(function ($) {
    $.fn.treeComboBox = function (settings) {
        var $choicesList, $modal, $dropContainer, choiceTemplate, tree, $placeholder, $choicesListContainer, dataRows, $attachedSelect, containerId, modalId, options;

        options = $.extend({
            expandRoots: true, //настройка 1
            selectableRoots: true, // настройка 2
            multipleSelect: true, // настройка 4,
            nodes: [],
            maxHeight: 0,
            modalDataRowsView: "",
            attachedSelect: null,
            linkedElements: null,
            readonly: false
        }, settings);


        //#region VARS_INIT

        var $container = this;
        $container.css("margin-left",0);
        containerId = $container.attr("id");
        var ztreeId = containerId + "ZTree";
        modalId = containerId + "SlickModal";

        $attachedSelect = $(options.attachedSelect);

        var viewModes = {
            singleSelect: function (onInitCompleted) {
                $container.find(".tree-choice").addClass("single-select");

                tree.on("onClick", function () {
                    var selected = tree.getSelectedNodes();
                    (options.linkedElements && updateLinkedTrees());
                    (selected && setSingleSelectedNode(selected));
                });

                onInitCompleted && onInitCompleted.call(null);

            },
            multipleSelect: function (onInitCompleted) {
                tree.on("beforeClick", function (treeId, treeNode) {
                    tree.checkNode(treeNode.id, !treeNode.checked);
                    return false;
                });
                tree.on("onCheck", function () {
                    renderNodes();
                    (options.linkedElements && updateLinkedTrees());
                });

                onInitCompleted && onInitCompleted.call(null);
            }
        };

        //#endregion /VARS_INIT

        //#region FUNC
        function renderNodes() {
            var checkedNodes = tree.getCheckedNodes(),
                checkedNodesLength = checkedNodes.length, i, node, result;

            result = [];
            $attachedSelect.find("option").removeAttr("selected");
            for (i = 0; i < checkedNodesLength; i++) {
                node = checkedNodes[i];
                result.push(getChoice(node));
                dataRows && dataRows.markRow(node.id, true);
                $attachedSelect.find("option[value=" + node.id + "]").attr("selected", "selected");
            }
            $choicesList.html(result.join(""));

            updateView();
        }

        function setContainerPlaceholder() {
            $choicesList.find("li").length ? $placeholder.addClass("hidden") : $placeholder.removeClass("hidden");
        }

        function getChoice(node, classes) {
            return node && choiceTemplate
                    .replace(/\$CHOICE_NAME\$/, node.name || "")
                    .replace(/\$CHOICE_ID\$/, node.id || 0)
                    .replace(/\$CLASSES\$/, (classes || ""));
        }

        function updateTreePosition() {
            var height = $choicesList.height();
            $dropContainer.css({top: height + "px"});
        }

        function setMaxZIndex() {
            var maxZIndex, allIndexes;

            allIndexes = [].slice.call($(".tree-drop-container")).map(function (item) {
                return Number($(item).css("z-index"))
            });
            maxZIndex = Math.max.apply(null, allIndexes);
            if (Number($dropContainer.css("z-index")) <= maxZIndex) {
                maxZIndex++;
                $dropContainer.css("z-index", maxZIndex);
            }

        }

        function openTree() {
            if (!$dropContainer.is(":visible")) {
                $choicesList.addClass("tree-opened");
                updateTreePosition();
                options.maxHeight && $container.find(".ztree").css({
                    "max-height": (options.maxHeight + "px"),
                    "overflow-y": "auto"
                });
                setMaxZIndex();
                $dropContainer.show();
            }
        }

        function closeTree() {
            $choicesList.removeClass("tree-opened");
            $dropContainer.hide();
        }

        function updateView() {
            setContainerPlaceholder();
            updateTreePosition();
        }

        function initHtml() {

            choiceTemplate = '<li class="tree-choice $CLASSES$"><span>$CHOICE_NAME$</span><a class="tree-choice-close cursor-pointer" data-choice-id="$CHOICE_ID$"><i class="icon-remove"></i></a></li>';

            $container.addClass("tree-container relative").attr("tab-index", 0);
            $container.html('<div class="tree-choice-container not-selectable relative"><ul class="tree-choices tree-not-init"></ul><div class="tree-btn-modal-container"><button class="btn btn-default tree-btn-modal">...</button></div><div class="absolute tree-container-placeholder hidden"><span>Выберите значение</span></div></div><div class="tree-drop-container absolute" style="display:none;"><div class="relative"><input id="citySel" class="tree-input" type="text" value="" placeholder="Введите часть названия для поиска" tabindex="-1"/><i class="tree-icon-search absolute icon-search"></i><i class="tree-icon-clear absolute icon-remove hidden"></i></div><ul id="' + ztreeId + '" class="ztree"></ul></div><div class="modalfade hide tree-modal-box" tabindex="-1" role="dialog"aria-hidden="true"><div class="modal-body auto-max-height"><div class="control-group"><input type="text" id="' + modalId + 'Search" class="tree-modal-box-input" placeholder="Введите часть названия для поиска"/></div><div id="' + containerId + 'SlickModal" class="grid"></div><ul class="tree-choices tree-not-init modal-choices" data-tree-id="' + containerId + '"></ul></div><div class="modal-footer"><button type="button" class="btn" data-dismiss="modal" aria-hidden="true">ОК</button></div></div>');
            $placeholder = $container.find(".tree-container-placeholder");
            $choicesListContainer = $container.find(".tree-choice-container");
            $choicesList = $container.find(".tree-choices");
            $dropContainer = $container.find(".tree-drop-container");
            $modal = $container.find(".tree-modal-box");

        }

        function setSingleSelectedNode(node) {
            if (!(options.selectableRoots || node.pId)) {
                return;
            }
            $choicesList.html(getChoice(node, "single-select"));
            setContainerPlaceholder();
            dataRows && dataRows.markRow(node.id, true, true);
            $attachedSelect.find("option").removeAttr("selected");
            $attachedSelect.find("option[value=" + node.id + "]").attr("selected", "selected");
            $container.find(".tree-input").val("").trigger("input");
            closeTree();
        }

        function loadModalDataRows(callback) {
            var viewName;
            viewName = options.modalDataRowsView;
            if (!viewName) {
                $container.find(".tree-btn-modal-container").css({display: "none", width: 0});
                $container.find(".tree-choices,.tree-drop-container").css({width: "100%"});
                return;
            }

            dataRows = new DataRows({
                slickContainer: "#" + modalId,
                searchInput: ".tree-modal-box-input",
                selectableRoots: options.selectableRoots
            });


            dataRows.loadFromAsystView(viewName);
            dataRows.on("onDblClick", function (e) {
                var cell = this.getCellFromEvent(e),
                    dataItem = this.getDataItem(cell.row);

                if (options.multipleSelect) {
                    tree.checkNode(dataItem.id, true);
                    dataRows.markRow(dataItem.id, true);
                } else {
                    var node = tree.getNodeById(dataItem.id);
                    setSingleSelectedNode(node);
                }
                (options.linkedElements && updateLinkedTrees());
            });
        }

        function removeChoice(item) {
            var choiceId = Number(item.dataset.choiceId);
            dataRows && dataRows.markRow(choiceId, false);
            if (options.multipleSelect) {
                tree.checkNode(choiceId, false);
                $(item).parents(".tree-choice").hide().remove();
            } else {
                $choicesList.find(".tree-choice").hide().remove();
            }
            if (options.attachedSelectId) {
                $attachedSelect.find("option[value=" + choiceId + "]").removeAttr("selected", false);
            }
            updateView();
        }

        function updateLinkedTrees() {
            var i, item, count, treeContainer, arr;

            arr = options.linkedElements.split(",");
            count = arr.length;
            for (i = 0; i < count; i++) {
                item = arr[i];
                treeContainer = "#TreeComboBox" + item;
                if ($(treeContainer).length) {
                    $(treeContainer).remove();
                    Asyst.Workspace.currentForm.LoadSelect(item, $("select#", item).val());
                }
            }
        }

        //#endregion FUNC

        initHtml();
        setContainerPlaceholder();
        tree = new Tree(ztreeId, options);
        loadModalDataRows();
        renderNodes();
        options.multipleSelect ? viewModes.multipleSelect() : viewModes.singleSelect();

        $choicesList.removeClass("tree-not-init");

        if (!options.readonly) {

            $choicesListContainer.on("click", function (e) {
                var target = e.target,
                    isCloseBtn = (target.classList.contains("tree-btn-modal") || target.classList.contains("icon-remove") || target.parentNode.classList.contains("tree-choice-close"));
                e.preventDefault();

                if (!isCloseBtn) {
                    ($choicesList.hasClass("tree-opened")) ? closeTree() : openTree();
                }
            });

            $container.on("click", ".tree-choice-close", function () {
                removeChoice(this);
            });

            $container.on("click", ".tree-btn-modal", function () {
                closeTree();
                $modal.modal({backdrop: "static"});
            });

            $container.on("input", ".tree-input", function () {
                var clearBtn = $container.find(".tree-icon-clear");
                $(this).val() ? clearBtn.removeClass("hidden") : clearBtn.addClass("hidden");
                tree.search($(this).val());
            });

            $container.on("click", ".tree-icon-clear", function () {
                $container.find(".tree-input").val("").trigger("input");
            });

            $(document).on("mousedown", function (event) {
                var target = $(event.target);
                if (!(target.hasClass("tree-choices") || target.hasClass("tree-drop-container") || target.parents(".tree-container").length)) {
                    closeTree();
                }
            });

            $(document).on("dblclick", "#" + modalId + " .slick-cell", function (e) {
                dataRows.grid.onDblClick.notify(null, e, dataRows.grid);
            });

            $(document).on("click", ".modal-choices .tree-choice-close", function () {
                //TODO:Мега костылище
                var self = $(this),
                    container = self.parents(".modal-choices").data("treeId"),
                    ztree = container + "ZTree",
                    modal = container + "SlickModal",
                    choiceId = self.data("choiceId"),
                    selectId = (container + "").replace("TreeComboBox", "");

                var treeObj = $.fn.zTree.getZTreeObj(ztree);
                var nodes = treeObj.getNodesByParam("id", choiceId, null);
                treeObj.checkNode(nodes[0], false, true, true);
                self.parents(".tree-choice").hide().remove();

                $("#" + modal + " .slick-row:contains('" + self.parent().text().trim() + "')").removeClass("row-selected");
                $("select#" + selectId).find("option[value=" + choiceId + "]").removeAttr("selected", false);
                $("#" + container).find(".tree-choice.single-select").remove();
            });

            $(document).on("hide", ".tree-modal-box", function () {
                $(this).find(".tree-modal-box-input").val("").trigger("input");
            });
        } else {
            $container.addClass("readonly");
        }

        $(window).resize(function () {
            updateTreePosition();
        });
    }
})(jQuery);