//зависимые комбобоксы
var DependentCombobox = (function (elementName, dependsElemOnName) {
     var //access = Asyst.Workspace.currentForm.Access,
        $dependsOnSelect = $("select#" + dependsElemOnName),
        $elementSelect = $("select#" + elementName),
        selectValueLocale = "##SelectValue##".locale(),
        idIndex = elementName.indexOf("Id"),
        accessName = idIndex === (elementName.length - 2) ? elementName.substring(0, idIndex) : elementName;
        //accessReadonly = (typeof access != 'undefined' && access.hasOwnProperty(accessName) && access[accessName].IsReadonly);

    function changeHandler() {
        var $elementChosen = $("#" + elementName + "_chosen"),
            access = Asyst.Workspace.currentForm.Access,
            accessReadonly = (typeof access != 'undefined' && access.hasOwnProperty(accessName) && access[accessName].IsReadonly);

        $elementSelect.val("");
        var cb = $elementChosen.find("a span");
        if (!cb || cb.length === 0) {
            return;
        }
        cb[0].innerText = selectValueLocale;

        $elementSelect.change();
        $elementSelect.prop("disabled", $dependsOnSelect.val() === "" || accessReadonly).trigger("chosen:updated");
        if ($dependsOnSelect.val() === '') {
            //выключем комбобокс, приводим в соответствие классы, убираем кнопку очистки
            $elementChosen.addClass("chosen-disabled")
                .removeClass("chosen-container-active");
            $elementChosen.find("a").addClass("chosen-default");
            $elementChosen.find("a abbr").remove();
        } else {
            $elementChosen.removeClass("chosen-disabled");
            $("#" + elementName).trigger("chosen:showing_dropdown");
        }
    }
    function initHandler() {
        var $elementChosen = $("#" + elementName + "_chosen"),
            access = Asyst.Workspace.currentForm.Access,
            accessReadonly = (typeof access != 'undefined' && access.hasOwnProperty(accessName) && access[accessName].IsReadonly);

        $elementSelect.prop("disabled", $dependsOnSelect.val() === "" || accessReadonly).trigger("chosen:updated");
        if ($dependsOnSelect.val() === '') {
            //выключем комбобокс, приводим в соответствие классы, убираем кнопку очистки
            $elementChosen.addClass("chosen-disabled")
                .removeClass("chosen-container-active");
            $elementChosen.find("a").addClass("chosen-default");
            $elementChosen.find("a abbr").remove();
        }
        $dependsOnSelect.unbind("linkedcmbx:updatestate");
    }

    $dependsOnSelect.on("linkedcmbx:updatestate", initHandler);
    $dependsOnSelect.on("change", changeHandler);
});
