var Tree = function (containerId, options) {
    var self = this;

    self.options = $.extend({
    	expandRoots: false, //настройка 1
        selectableRoots: false, // настройка 2
        multipleSelect:false, // настройка 4,
        nodes:[]
    },options);

    function getSettings() {
        return {
            check: {
                enable: (self.options.multipleSelect),
                chkboxType: (self.options.selectableRoots ?  {"Y": "", "N": ""} : {"Y": "s", "N": "ps"})
            },
            view: {
                dblClickExpand: false,
                showLine:false
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
    }

    function fillNodes(zTreeNodes) {
        var i, item, count, result;

        count = zTreeNodes.length;
        result = {};

        for (i = 0; i < count; i++) {
            item = zTreeNodes[i];
            result[item.id] = item;
        }

        return result;
    }

    self.container = $("#" + containerId);
    self.zTree = $.fn.zTree.init(self.container, getSettings(), self.options.nodes);
    self.zTreeNodes = self.zTree.transformToArray(self.zTree.getNodes());
    self.nodes = fillNodes(self.zTreeNodes);

    self.zTree.expandAll(self.options.expandRoots);
};

//#region DELEGATES
Tree.isLeafPredicate = function(item){return !item.isParent};
//#endregion

//#region UTILS
Tree.ExceptArray = function(source, target){
    var newArr = [],arr, j,count,i;
    arr = source.concat(target);

    for (i in arr) {
        var f = arr[i];
        var t = 0;
        count = arr.length;
        for (j = 0; j < count; j++) {
            if (arr[j] === f) {
                t++;
            }
        }
        if (t === 1) {
            newArr.push(f);
        }
    }
    return newArr;
};
//#endregion UTILS

//#region METHODS
Tree.prototype.getNodeById = function (nodeId) {
    return this.nodes[Number(nodeId)];
};

Tree.prototype.checkNode = function (nodeId, isChecked) {
    var node = this.getNodeById(nodeId);
    this.zTree.checkNode(node, isChecked, true, true);
    node.checked = isChecked;
};

Tree.prototype.getCheckedNodes = function () {
    var checkedNodes = [],item, node;

    for(node in this.nodes){
        if(this.nodes.hasOwnProperty(node)) {
            item = this.nodes[node];
            if (item.checked) {
                checkedNodes.push(item)
            }
        }
    }

    if(!this.options.selectableRoots){
        checkedNodes = checkedNodes.filter(Tree.isLeafPredicate);
    }
    return checkedNodes
};

Tree.prototype.on = function (eventName, callback) {
    this.zTree.setting.callback[eventName] = callback;
};

Tree.prototype.search = function (searchText) {
    var visibleNodes = this.zTree.getNodesByParamFuzzy("name", searchText, null),
        i, count, item, parent;

    count = visibleNodes.length;
    for (i = 0; i < count; i++) {
        item = visibleNodes[i];
        parent = item.getParentNode();

        while (parent) {
            visibleNodes.push(parent);
            parent = parent.getParentNode();
        }
    }

    this.zTree.showNodes(this.zTreeNodes);
    this.zTree.hideNodes(Tree.ExceptArray(this.zTreeNodes, visibleNodes));
};

Tree.prototype.getSelectedNodes = function(){
    var selected = this.zTree.getSelectedNodes()[0];
    if(!this.options.selectableRoots && selected.isParent){
        return null;
    }
    return selected;
};

Tree.prototype.reloadNodes = function(nodes) {
	//this.zTree.destroy();
	//this.options.nodes = nodes;
	//new Tree(this.container.attr("id"), this.options);

}

//#endregion METHODS