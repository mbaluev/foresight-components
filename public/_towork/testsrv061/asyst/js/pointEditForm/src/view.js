(function () {
    var root = Asyst.Workspace.PointLinksTable;

    root.View.load = function (refBooks) {
        var taskSelect = new AsystChosen();
		var linkTypeSelect = new AsystChosen();
		var projectSelect = new AsystChosen();

        root.View = {
            columns: [{
                data: "Project.id", // [Posmitniy, 2017-01] Поменял name на id
                width: 260,
                renderer: projectSelect.renderer,
                editor: projectSelect.editor,
				chosenOptions: {
					containerWidth: "260px",
					width: "260px",
					data: AsystSelectUtils.mapToChosenArray(refBooks["Projects"], true),
					allow_single_deselect: true
				}
            }, {
                data: "Task.id", // [Posmitniy, 2017-01] Поменял name на id
                width: 340,
                renderer: taskSelect.renderer,
                editor: taskSelect.editor,
                validator: taskSelect.validator,
				chosenOptions: {
					containerWidth: "340px",
					width: "340px",
					allData: AsystSelectUtils.mapToChosenArray(refBooks["Tasks"]),
					getData: function (editor) {
					    debugger;
						var rowData = editor.instance.getSourceDataAtRow(editor.row);
						var projectId = rowData
							? (rowData.Project ? rowData.Project.id : null)
							: null;

						var tasks = editor.options.allData || [];
						if (projectId) {
						    tasks = tasks.filter(function (el) { return el.projectId == projectId; });
						}
						return tasks;
					}
				}
            }, {
                data: "LinkType.id", // [Posmitniy, 2017-01] Поменял name на id
                width: 170,
                renderer: linkTypeSelect.renderer,
                editor: linkTypeSelect.editor,
                validator: taskSelect.validator,
				chosenOptions: {
					containerWidth: "170px",
					width: "170px",
					data: AsystSelectUtils.mapToChosenArray(refBooks["LinkTypes"])
				}
            }, {
                data: "lag",
                width: 160,
				validator: function(val, callback){
					if (isNaN(val) || Math.abs(val) > 2147483647) {
						callback(false);
					} else {
						callback(true);
					}
				}
				
            }],
            colHeaders: ["Название проекта", "Название задачи", "Тип связи", "Задержка"]
        }
    }
})();