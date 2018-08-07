(function () {
    var root = Asyst.Workspace.PointLinksTable,
        consts = root.Consts,
        refBooks = root.RefBooks,
        utils = Asyst.Utils,
        models = root.Models;


    root.init(function () {
        var schema = root.View,
            pointId = Number(Asyst.Workspace.currentForm.EntityId),
            $container = $("#" + consts.BUTTONS_CONTAINER);

        var table = new Table({
            //cells: getCellProperties,
            containerId: consts.TABLE_CONTAINER,
            columns: schema.columns,
            colHeaders: schema.colHeaders,
            data: []
        });
		table.addValidator(function(){
		});
        table.on("afterChange", function (changes, source) {
            var handson = this;
            if (source === "custom") {
                return;
            }

            changes.forEach(function (changeSet) {
                var rowIndex = changeSet.row;
				var rowModel = handson.getSourceDataAtRow(rowIndex);

				rowModel.update(changeSet);
				
				// Нормализуем данные.
				// Если выбран проект, а выбранная задача относится к другому проекту - очищаем задачу.
				var isDataChanged = rowModel.normalize();
                
                if (rowModel.Task.id && rowModel.LinkType.id) {
                    handson.setDataAtRowProp(changeSet.row, "Task.code", rowModel.Task.code, "custom");
                    if (rowModel.IsValid() == true)
						rowModel.save();
                }
				
				// Валидируем гриду, ибо после изменения ячейки проекта невалидной может стать ячейка задачи
				table.handson.validateCells(function () {});
				
				// Если данные были изменены в результате нормализации - обновляем гриду
				if (isDataChanged) {
					table.handson.render();
				}
            });
        });
        // Включаем редактирование по одному клику, а не по двум
		table.handson.addHook('afterOnCellMouseDown', function (event, coords, td) {
		    if (coords.row >= 0 && coords.col >= 0 && td && td.nodeName && td.nodeName.length && td.nodeName.toLowerCase() == 'td') {
		        setTimeout(function () {
		            var editor = table.handson.getActiveEditor();
		            if (editor && !(editor.cellProperties && editor.cellProperties.readOnly)) {
		                editor.beginEditing();
		            }
		        }, 100);
		    }
		});

        table.on("beforeRemoveRow", function (index, amount, logicalRows) {
            var handson, count, i, row;

            handson = this;
            count = logicalRows.length;
            for (i = 0; i < count; i++) {
                row = handson.getSourceDataAtRow(logicalRows[i]);
                if(row.id) {
                    Asyst.APIv2.Entity.delete({
                        entityName: consts.ENTITY_NAME,
                        dataId: row.id,
                        error: utils.errorFn
                    });
                }
            }
        });

        Asyst.APIv2.DataSet.load({
            name: "PointLinkList",
            data: {
                ActivityId: pointId
            },
            success: function (all, dtoList) {
                var rows = dtoList.map(function (dto) {
                    var rowModel = models.PredecessorRow.fromDto(dto);
                    rowModel.pointId = pointId;
                    return rowModel;
                });
                table.updateData(rows);
            }
        });

        $container.on("click", ".js-add-row", function (e) {
            table.addRow(null, models.PredecessorRow, {
                LinkType: clone(refBooks.LinkTypes[consts.DEFAULT_LINK_TYPE_ID]),
                pointId : pointId
            });
			// Валидируем гриду, ибо добавляемая строка уже является невалидной (в ней не заполнено обязательное поле "Задача")
			table.handson.validateCells(function () {});
        });

        $container.on("click", ".js-remove-row", function (e) {
            table.removeRow();
        });

        $("#tab4").on("shown", function () {
            table.handson.render();
        });
    });
})();