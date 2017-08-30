var DataRows = (function () {
    var slickOptions;

    slickOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        fullWidthRows: true,
        forceFitColumns: true,
        editable: false,
        autoHeight: false,
        wideString: false,
        initiallyCollapsed: false
    };


    function updateGrid(rows) {
    		(rows && this.dataView.setItems(rows));
    		this.grid.measureHeights();
    		this.grid.updateRowCount();
    		this.grid.invalidateAllRows();
    		this.grid.render();
    }

    function resetAllMarkedRows(){
        var iter,
            markedRows = document.querySelectorAll(".grid-canvas .row-selected");

        iter = markedRows.length;
        while(iter--){
            markedRows[iter].classList.remove("row-selected");
        }
    }

    var DataRows = function (options) {
        var self = this;
        self.options = $.extend({
            slickContainer: "",
            searchInput: "",
						selectableRoots : false
        }, options);
        self.dataView = new Slick.Data.DataView();
				self.grid = null;
				self.searchList = null;
				self.columnsArr = null;
				self.slickGrid = null;

        self.dataView.onRowCountChanged.subscribe(function (e, args) {
            updateGrid.call(self);
        });

        self.dataView.onRowsChanged.subscribe(function (e, args) {
        	self.grid.invalidateRows(args.rows);
        	self.grid.render();
        });
				

        $(document).on("input", self.options.slickContainer + "Search", function (e) {
        		self.searchList = $(this).val().split(" ");

            self.dataView.beginUpdate();
            self.dataView.setFilter(function(item) {
            	var mnull = 0, optnull = 0, l = self.searchList.length, len = self.columnsArr.length;
            		for (var i = 0; i < l; i++) {
            			for (var j = 0; j < len; j++) {
            				if (String(item[self.columnsArr[j].field]).toLowerCase().indexOf(String(self.searchList[i]).toLowerCase()) === -1) {
					            mnull++;
				            }
            			}
            			if (mnull === len) {
				            optnull++;
			            }
            			mnull = 0;
            		}
            		return optnull === 0;
            });
            self.dataView.endUpdate();
        });
    };

    DataRows.prototype.loadFromAsystView = function (viewName) {
    	var self = this;

    	Asyst.APIv2.View.load({
    	    viewName: viewName,
    	    data: null,
    	    success: function(slick) {
    	        self.grid = new Slick.Grid(self.options.slickContainer, self.dataView, slick.columns, slickOptions);
    	        self.columnsArr = self.grid.getColumns();
    	        if (!self.options.selectableRoots) {
    	            slick.data = slick.data.filter(function (item) { return Boolean(item.ParentKey); });
    	        }

    	        updateGrid.call(self, slick.data);
    	        //self.slickGrid = grid;
    	    },
    	    async: false
    	});
    };

    DataRows.prototype.on = function (eventName, callback) {
        this.grid[eventName].subscribe(callback);
    };

    DataRows.prototype.markRow = function (id, isSelected,resetAllBeforeMark) {
        var rowNode, parent, rowNum;

        (resetAllBeforeMark && resetAllMarkedRows());

        rowNum = this.dataView.getRowById(id);
        rowNode = this.grid.getCellNode(rowNum, 0);
        if (rowNode) {
            parent = rowNode.parentNode;
            isSelected ? parent.classList.add("row-selected") : parent.classList.remove("row-selected");

        }
    };

    return DataRows;
})();