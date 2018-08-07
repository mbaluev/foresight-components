(function () {
    var root = Asyst.Workspace.PointLinksTable,
        consts = root.Consts,
        utils = Asyst.Utils,
        refBooks = root.RefBooks;

    //region FUNC
    function prepareLagString(lag) {
        var lagNum = Number(lag);
        if (isNaN(lagNum)) {
            return "";
        }
		else if (lagNum > 0) {
            return "+" + lagNum;
        }
        return "" + lagNum;
    }
    //endregion

    //region PredecessorRow class
    var PredecessorRow = function (options) {
        options = options || {};
        this.id = options.id || null;
        this.pointId = options.pointId || null;
        this.Project = options.Project || utils.newIdName();
        this.Task = options.Task || utils.newIdName();
        this.LinkType = options.LinkType || utils.newIdName();
        this.lag = options.lag || "";
    };
	
	PredecessorRow.prototype.IsValid = function() {
        if (isNaN(this.lag) || Math.abs(this.lag) > 2147483647) 
			return false;
		else
            return true;
    }

    PredecessorRow.prototype.toDto = function () {
        var self = this;
		return {
            name: consts.SAVE_FN_NAME,
            data: {
				pointPointId: self.id,
                pointId: self.pointId,
                previousPointId: self.Task.id,
                linkType: self.LinkType.code,
                lag: prepareLagString(self.lag)
            },
            success: function (all, ppId) {
                if (ppId.constructor === Array && ppId.length === 1 && ppId[0].hasOwnProperty("PointPointId")) {
                    self.id = ppId[0].PointPointId;
                } else {
                    var c = "";
                    ppId.map(function(item, index) { c += item.text + "<br/>"; });
                    NotifyError(Globa.ErrorOnCheckSave.locale(), c);
                }
            },
		    error: function (error, text) {
		        if (error == Globa.LicenseError) {
		            return;
		        }
		        else if (error == Globa.ErrorTooLongText.locale()) {
		            ErrorHandler(error, Globa.SavingError.locale());
		        }
		        else if (error == Globa.ErrorOnCheckSave.locale()) {
		            NotifyError(error, text);
		        }
		        else {
		            ErrorHandler(Globa.SavingError.locale(), Globa.SavingError.locale());
		        }
		    }
        }
    };

	// Нормализовать данные.
	// Если выбран проект, а выбранная задача относится к другому проекту - очищаем задачу.
	// Возвращает true, если нормализация была произведена (т.е. значения полей изменились). Иначе - false.
	PredecessorRow.prototype.normalize = function() {
        if (this.Project && this.Project.id && this.Task && this.Task.id && this.Task.projectId != this.Project.id) {
			this.Task = utils.newIdName();
			return true;
		}
		
		return false;
    }
	
    PredecessorRow.prototype.update = function (changeSet) {
		var self = this,
            selectedId = changeSet.selectedId;

        if (selectedId !== undefined) {
            utils.deepValue(self, utils.getFieldIdPath(changeSet.prop), (selectedId === -1 ? null : selectedId));
        }
        utils.deepValue(self, changeSet.prop, changeSet.newVal);

		if (self.Task && self.Task.id) {
			var task = refBooks.Tasks[self.Task.id];
			if (task) {
			    self.Task.projectId = task.projectId;
				self.Task.name = task.name;
				self.Task.code = task.code;
			}
		}
		if (self.LinkType && self.LinkType.id) {
			var linkType = refBooks.LinkTypes[self.LinkType.id];
			if (linkType) {
				self.LinkType.name = linkType.name;
				self.LinkType.code = linkType.code;
			}
		}
	};

    PredecessorRow.prototype.save = function () {
        var self = this;
        Asyst.APIv2.DataSet.load(self.toDto());
        console.log("save", self.toDto());
    };

    PredecessorRow.fromDto = function (dto) {
        var row = new PredecessorRow({
            id: dto.id,
            lag: dto.lag
        });

        var task = refBooks.Tasks[dto.previousPointId];
        if (task) {
            row.Task = {
                id: dto.previousPointId,
				projectId: dto.previousPointProjectId,
                name: task.name,
                code: task.code
            }
            row.Project = {
				id: dto.previousPointProjectId
			};
        }

        dto.linkType = dto.linkType || "FS";
        var linkTypeArr = Object.keys(refBooks.LinkTypes).filter(function (key) {
            var item = refBooks.LinkTypes[key];
            return item.code === dto.linkType;
        });

        if (linkTypeArr.length) {
            var linkTypeId = Number(linkTypeArr[0]);
            var linkType = refBooks.LinkTypes[linkTypeId];
            row.LinkType = {
                id: linkTypeId,
                name: linkType.name,
                code: linkType.code
            };
        }
        return row;
    };

    //endregion

    root.Models = {
        PredecessorRow: PredecessorRow
    };

})();