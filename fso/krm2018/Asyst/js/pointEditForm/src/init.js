(function () {
    var workspace = Asyst.Workspace,
        utils = Asyst.Utils,
        root = workspace.PointLinksTable;

    root.Consts = {
        TABLE_CONTAINER: "HandsonPointLinksTable",
        BUTTONS_CONTAINER: "PointLinkHandsonButtons",
        DEFAULT_LINK_TYPE_ID: 1,
        ENTITY_NAME: "PointPoint",
        SAVE_FN_NAME:"AppendPointLink"
    };

    root.init = function (onInitCompleted) {
        var form = workspace.currentForm;

        Asyst.APIv2.DataSet.load({
            name: "VariantsPointLink",
            data: {
                ActivityId: form.EntityId,
                UserLang: "ru"
            },
            success: function (all, tasksArr, projArr) {
                root.RefBooks["Projects"] = utils.arrayToMap(projArr, null, function (item) {
                    return {
						id: item.id,
						name: item.name,
						label: item.name,
						title: item.title
                    }
                });
				
				root.RefBooks["Tasks"] = utils.arrayToMap(tasksArr, null, function (item) {
                    return {
                        id: item.id,
                        name: item.name,
                        label: item.name,
                        code: item.code,
                        projectId: item.projectId,
						title: item.title
                    }
                });

                root.RefBooks["LinkTypes"] = {
                    1: {
                        code: "SS",
                        name: "Начало-Начало(SS)",
                        label: "Начало-Начало(SS)",
                        id: 1

                    },
                    2: {
                        code: "FF",
                        name: "Окончание-Окончание(FF)",
                        label: "Окончание-Окончание(FF)",
                        id: 2
                    },
                    3: {
                        code: "FS",
                        name: "Окончание-Начало(FS)",
                        label: "Окончание-Начало(FS)",
                        id: 3
                    },
                    4: {
                        code: "SF",
                        name: "Начало-Окончание(SF)",
                        label: "Начало-Окончание(SF)",
                        id: 4
                    }
                };
                root.View.load(root.RefBooks);
                onInitCompleted && onInitCompleted.call(null);
            }
        });
    };
})();
