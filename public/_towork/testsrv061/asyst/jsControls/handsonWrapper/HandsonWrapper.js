var AsystSelectUtils = (function () {
    return {
        getComparableString : function (item) {
            if(!item){
                return "";
            }
            item = item.toString();
            return item.replace(/[^а-яА-Яa-zA-Z0-9]/g,"").toUpperCase();
        },
        getValueFromMapByText: function (map, text) {
            var comparableText = AsystSelectUtils.getComparableString(text);
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    var value = (typeof map[key] === "object" ? (map[key].name || map[key].Name) : map[key]);
                    if (comparableText === AsystSelectUtils.getComparableString(value)) {
                        return Number(key);
                    }
                }
            }
            return -1;
        },
		// Есть ли в массиве объект с определенным id
		isArrayContainsId: function (array, id) {
			var items = array
				.filter(function (el) { return el.id == id; });
			return (items && items.length) ? true : false; // Результат должен быть типа boolean, поэтому прописываем явное преобразование.
		},
		// Преобразовывает объект в массив (для передачи в chosen)
		mapToChosenArray: function (map, withEmpty) {
			var array = [];
			if (withEmpty) {
					array.push({});
			}
			
			for (var key in map) {
				if (map.hasOwnProperty(key)) {
					array.push(map[key]);
				}
			}

			return array;
		}
    }
})();

var AsystSelectEditor = (function () {

    function onBeforeKeyDown(event) {
        var option,
            instance = this,
            editor = instance.getActiveEditor(),
            selectedIndex = editor.select.selectedIndex;

        switch (event.keyCode) {
            case Handsontable.helper.KEY_CODES.ARROW_UP:
            {
                option = editor.select.options[selectedIndex - 1];
                break;
            }
            case Handsontable.helper.KEY_CODES.ARROW_DOWN:
            {
                option = editor.select.options[selectedIndex + 1];
                break;
            }
            case Handsontable.helper.KEY_CODES.ESCAPE:
            {
                editor.cancelChanges();
                break;
            }
            case Handsontable.helper.KEY_CODES.ENTER:
            {
                option = editor.select.options[selectedIndex];
                editor.finishEditing();
                break;
            }
        }

        if (option) {
            editor.select.value = option.value;
            editor.originalValue = option.value;
        }

        event.stopImmediatePropagation();
        event.isImmediatePropagationEnabled = false;
        event.preventDefault();
    }

    function loadOptions(select, hashMap, sortProp, sortOrder, isNullable) {
        var optionsArr, idKey;

        if (isNullable) {
            select.options.add(new Option());
        }

        sortOrder = sortOrder || "ASC";
        optionsArr = [];

        for (idKey in hashMap) {
            if (hashMap.hasOwnProperty(idKey)) {
                var mapItem = hashMap[idKey];
                var sortPropVal = sortProp && mapItem[sortProp] || Number(idKey);
                var sortableOption = {
                    position: sortPropVal,
                    id: idKey,
                    name: ((typeof mapItem === "object" && mapItem !== null) ? mapItem.name : mapItem)
                };
                optionsArr.push(sortableOption);
            }
        }

        if (sortProp) {
            optionsArr = optionsArr.sort(function (first, second) {
                return sortOrder.toUpperCase() === "ASC" ? (first.position - second.position) : (second.position - first.position);
            });
        }

        optionsArr.forEach(function (item) {
            var optionElement = new Option(item.name, item.id);
            Handsontable.Dom.fastInnerHTML(optionElement, item.name);
            select.options.add(optionElement);
        });
    }

    var AsystSelectEditor = Handsontable.editors.BaseEditor.prototype.extend();

    AsystSelectEditor.prototype.init = function () {
        var select, root;
        root = this.instance.rootElement;

        select = document.createElement("SELECT");
        select.style.display = "none";
        select.style.position = "absolute";
        select.style.outline = "5px";
        select.style.borderRadius = "0";
        select.style.padding = "0";
        select.classList.add("select_" + new Date().getTime() + "");

        select.addEventListener("change", function () {
            var self = this,
                td = root.querySelector("td.current");
            td.setAttribute("data-selected-value", self.options[self.selectedIndex].value);
        });

        root.querySelector(".wtSpreader").appendChild(select);
        this.select = select;
    };

    AsystSelectEditor.prototype.prepare = function () {
        var hashMap, sortProp, sortOrder, isNullable, select;

        Handsontable.editors.BaseEditor.prototype.prepare.apply(this, arguments);

        var cellProperties = this.cellProperties;
        hashMap = cellProperties.optionsHashMap;
        sortProp = cellProperties.optionsSortProp;
        sortOrder = cellProperties.optionsSortOrder;
        isNullable = cellProperties.isNullable;
        select = this.select;

        if (!select.options.length) {
            loadOptions(select, hashMap, sortProp, sortOrder, isNullable);
        }
    };

    AsystSelectEditor.prototype.prepareOptions = function (optionsToPrepare) {
        var preparedOptions = {};
        if (optionsToPrepare.constructor === Array) {
            for (var i = 0, len = optionsToPrepare.length; i < len; i++) {
                preparedOptions[optionsToPrepare[i]] = optionsToPrepare[i];
            }
        } else if (typeof optionsToPrepare === 'object') {
            preparedOptions = optionsToPrepare;
        }

        return preparedOptions;
    };

    AsystSelectEditor.prototype.getValue = function () {
        return $(this.select).find("option[value='" + this.select.value + "']").text();
    };

    AsystSelectEditor.prototype.setValue = function (value) {
        this.select.value = value;
    };

    AsystSelectEditor.prototype.open = function () {
        var td = this.TD,
            width = Handsontable.Dom.outerWidth(td),
            height = Handsontable.Dom.outerHeight(td),
            select = this.select,
            BORDER_WIDTH = 2;

        td.classList.add("active-editor");
        // sets select dimensions to match cell size
        select.style.height = (height - (BORDER_WIDTH * 2) + 1) + 'px';
        select.style.setProperty("width", (width - BORDER_WIDTH - 1) + 'px', "important");
        // make sure that list positions matches cell position
        select.style.top = td.offsetTop + (BORDER_WIDTH / 2) + 'px';
        select.style.left = td.offsetLeft + (BORDER_WIDTH / 2) + 'px';
        select.style.margin = '0px';
        select.style.display = '';

        var comparableValue = AsystSelectUtils.getComparableString(this.originalValue);
        for (var i = 0; i < select.options.length; i++) {
            if (AsystSelectUtils.getComparableString(select.options[i].text) === comparableValue) {
                select.options[i].setAttribute('selected', 'selected');
                select.selectedIndex = i;
            } else
                select.options[i].removeAttribute('selected');
        }

        $(this.select).on('keydown', function (event) {
            console.log(event);
        });
        this.instance.addHook('beforeKeyDown', onBeforeKeyDown);
    };

    AsystSelectEditor.prototype.close = function () {
        var select = this.select;
        select.style.display = 'none';
        this.TD.classList.remove("active-editor");
        this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
    };

    AsystSelectEditor.prototype.focus = function () {
        this.select.focus();
    };

    AsystSelectEditor.prototype.getEditedCell = function () {
        var editorSection = this.checkEditorSection(),
            editedCell;
        switch (editorSection) {
            case 'top':
                editedCell = this.instance.view.wt.wtOverlays.topOverlay.clone.wtTable.getCell({
                    row: this.row,
                    col: this.col
                });
                this.select.style.zIndex = 101;
                break;
            case 'corner':
                editedCell = this.instance.view.wt.wtOverlays.topLeftCornerOverlay.clone.wtTable.getCell({
                    row: this.row,
                    col: this.col
                });
                this.select.style.zIndex = 103;
                break;
            case 'left':
                editedCell = this.instance.view.wt.wtOverlays.leftOverlay.clone.wtTable.getCell({
                    row: this.row,
                    col: this.col
                });
                this.select.style.zIndex = 102;
                break;
            default:
                editedCell = this.instance.getCell(this.row, this.col);
                this.select.style.zIndex = '';
                break;
        }
        return editedCell !== -1 && editedCell !== -2 ? editedCell : void 0;
    };

    return AsystSelectEditor;
})();

var AsystSelectRenderer = (function(){

  var AsystSelectRenderer = function(instance, td, row, col, prop, value, cellProperties){
    Handsontable.BaseRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    if (value === null || value === undefined) {
      td.innerHTML = '';
    } else {
      td.innerHTML = value;
    }

    td.innerHTML += '\u00A0<div class="htAutocompleteArrow">▼</div>';
    return td;
  };

  return AsystSelectRenderer;
})();

var AsystSelectValidator = function(value,callback){
    var cellMeta = this;
    if(!value && cellMeta.isNullable){
        callback(true);
    }else{
        var selectedId = Number(AsystSelectUtils.getValueFromMapByText(cellMeta.optionsHashMap,value));
        callback(selectedId !== -1);
    }
};

var AsystSelect = (function () {

    function getInstanse(args) {
        return args[0];
    }

    var AsystSelect = function () {
        this.editor = function AsystSelect() {
            return new AsystSelectEditor(getInstanse(arguments));
        };
        this.editor.name = "AsystSelect";
        this.renderer = AsystSelectRenderer;
        this.validator = AsystSelectValidator;
    };

    return AsystSelect;
})();



var AsystChosenRenderer = (function(){

	var AsystChosenRenderer = function(instance, td, row, col, prop, value, cellProperties){
		var optionsList = 
			(cellProperties.chosenOptions.data && cellProperties.chosenOptions.data.length)
				? cellProperties.chosenOptions.data
				: cellProperties.chosenOptions.allData;

		var values = (value + "").split(",");
		var value = [];
		var titles = [];
		for (var index = 0; index < optionsList.length; index++) {
			if (values.indexOf(optionsList[index].id + "") > -1) {
				value.push(optionsList[index].label);
				titles.push(optionsList[index].title);
			}
		}
		value = value.join(", ");
		td.title = titles
			.filter(function (el) { return el && el.length })
			.join(", ");

		Handsontable.TextCell.renderer.apply(this, arguments);		
	};

	return AsystChosenRenderer;
})();
var AsystChosenValidator = function(value,callback){
    var cellMeta = this;
    if(!value && cellMeta.isNullable){
        callback(true);
    } else {
		var optionsList = 
			(cellMeta.chosenOptions.data && cellMeta.chosenOptions.data.length)
				? cellMeta.chosenOptions.data
				: cellMeta.chosenOptions.allData;
        var isArrayContainsId = AsystSelectUtils.isArrayContainsId(optionsList, value);
        callback(isArrayContainsId);
    }
};
var AsystChosen = (function () {

    function getInstanse(args) {
        return args[0];
    }

    var AsystChosen = function () {
		this.editor = Handsontable.editors.ChosenEditor;
        this.renderer = AsystChosenRenderer;
        this.validator = AsystChosenValidator;
    };

    return AsystChosen;
})();
(function(){
	if (window.Handsontable && Handsontable.editors && Handsontable.editors.ChosenEditor) {

		// Расширяем функционал handsontable-chosen-editor
		var Handsontable_editors_ChosenEditor_prototype_open_Original = Handsontable.editors.ChosenEditor.prototype.open;
		Handsontable.editors.ChosenEditor.prototype.open = function (keyboardEvent) {
			var options = this.options;
			if (options.getData && typeof options.getData === "function") {
				options.data = options.getData(this);
			}

			this.textareaParentStyle.width = options.containerWidth || this.textareaParentStyle.width;
			
			return Handsontable_editors_ChosenEditor_prototype_open_Original.call(this, keyboardEvent);
		};

		//Решаем проблему со скрываемостью chosen'а при выходе за границы диалога
		$('body').on('chosen:showing_dropdown', '.handsontableInputHolder:has(.chosen-container) .handsontableInput', function(evt, params) {
			fixChosenClipping($(evt.currentTarget));
		});	

	}

	// Fixes chosen 'cut-off' when in overflow hidden elements.
	function fixChosenClipping($chosenSelect) {
		// Disable mouse scroll if its dropdown is open.
		$chosenSelect
			.bind('chosen:showing_dropdown', function() {
				$(this).next('.chosen-container')
					.bind("mousewheel", function() {
						return false;
					});
				})
			.bind('chosen:hiding_dropdown', function() {
				$(this).next('.chosen-container')
					.unbind('mousewheel');
				return false;
			});

		// Reposition the dropdown to fixed, so it's always on top.
		var chosenContainer = $chosenSelect.next('.chosen-container');
		chosenContainer
			.bind('mouseenter.chosen', function() {
				setChosenStyles(this);
			})
			.bind('mouseleave.chosen', function() {
				$(this).find('.chosen-drop')
					.removeClass('fixed')
					.attr('style', '');
			});
		setChosenStyles(chosenContainer);
	}
	// Задаем стили chosen'а
	function setChosenStyles(element) {
		var x = $(element).offset().left;
		var y = $(element).offset().top + $(element).height();
		var w = $(element).width();
		var $dropdown = $(element).find('.chosen-drop');

		// If the menu is partially visible, don't change
		// its dropdown to be fixed. This is only needed if your
		// chosen menu might be clipped by a div or something.

		// Find all the parents that might be clipping off.
		var parents = $(element).parents().filter(function() {
			var overflow = $(element).css('overflow');
			return overflow === 'auto' || overflow === 'hidden' || overflow === 'scroll';
		});

		// If at least one parent is clipping off the bottom of
		// the menu, don't proceed any further.
		for (var i = 0; i < parents.length; i++) {
			var parentEdge = $(parents[i]).offset().top + $(parents[i]).outerHeight();
			if (y > parentEdge) {
				$dropdown.css({ 'display': 'none' });
				return false;
			}
		}

		$dropdown.addClass('fixed')
		var top = y - $(document).scrollTop();
		$dropdown.attr('style', 'top: ' + top + 'px !important; left: ' + x + 'px !important; width: ' + w + 'px !important');		
	}
})();



var Table = (function () {

    //region FUNC

    function getCellChangeSet(changesArr) {
        return {
            row: changesArr[0],
            prop: changesArr[1],
            oldVal: changesArr[2],
            newVal: changesArr[3],
            selectedId: changesArr[4]
        };
    }

    function createHandson(options) {
        var handson;

        if (options.readOnly) {
            options.columns.forEach(function (item) {
                item.readOnly = true;
            });
        }
        handson = new Handsontable(options.container, options);
        return handson;
    }

    function getDefaults(options) {
        var defaults = $.extend({
            containerId: "",
            data: [],
            colHeaders: [],
            columns: [],
            storage: {},
            validationRules: [],
            globalRules: [],
            readOnly: false,
            minSpareRows: 0,
            manualColumnResize: true,
            outsideClickDeselects: false
        }, options);

        if (defaults.containerId) {
            defaults.container = document.getElementById(defaults.containerId);
        }

        return defaults;
    }

    function getHtmlForErrors(errors) {
        var rowIndex, errorHtml = "";
        for (rowIndex in errors) {
            if (errors.hasOwnProperty(rowIndex)) {
                errorHtml += "<p><b>В строке " + (Number(rowIndex) + 1) + " найдены следующие ошибки:</b><ul>";
                errorHtml += errors[rowIndex].map(function (item) {
                    return "<li>" + item + "</li>";
                }).join("");
                errorHtml += "</ul></p>";
            }
        }
        return errorHtml;
    }

    function getRowErrors(rules, row, allData) {
        var i, rule, count, errorMessage, errors;

        errors = [];
        count = rules.length;
        for (i = 0; i < count; i++) {
            rule = rules[i];
            errorMessage = rule.call(null, row, allData);
            if (errorMessage) {
                errors.push(errorMessage);
            }
        }
        return errors;
    }

    //endregion FUNC

    //region EventMiddleWare

    function _change(changes, action, storage, callback) {
        var _handson = this,
            changesByRow = {};

        if (action === "loadData" || action === "custom") {
            return;
        }

        changes.forEach(function (changeArr) {
            var cellChangeSet, colIndex, cellMeta, cellEditor, selectedVal;

            cellChangeSet = getCellChangeSet(changeArr);
            colIndex = _handson.propToCol(cellChangeSet.prop);
            cellMeta = _handson.getCellMeta(cellChangeSet.row, colIndex);
            cellEditor = cellMeta.editor;

            if (cellEditor && cellEditor.name === "AsystSelect") {
                if(!cellMeta.optionsHashMap){
                    throw new Error("Для колонки "+ cellChangeSet.prop + " не указан источник выбора вариантов, заполните свойсвтво optionsHashMap в описании колонки");
                }
                selectedVal = AsystSelectUtils.getValueFromMapByText(cellMeta.optionsHashMap, cellChangeSet.newVal);
                selectedVal = Number(selectedVal);
                cellChangeSet.selectedId = !(isNaN(selectedVal) && selectedVal !== -1) ? selectedVal : null;
            }

            var changeSets = changesByRow[cellChangeSet.row];
            if(!changeSets){
                changeSets = changesByRow[cellChangeSet.row] = [];
            }
            changeSets.push(cellChangeSet);
        });

        Object.keys(changesByRow).forEach(function(rowKey){
            callback && callback.call(_handson, changesByRow[rowKey], action);
        });
    }

    //endregion

    //region TableClass
    var Table = function (options) {
        var self = this;
        self.settings = getDefaults(options);
        self.handson = createHandson(self.settings);
    };

    Table.prototype.addRow = function (index, model, options) {
        var handson, modelsArr;

        handson = this.handson;
        index = index || handson.countRows();

        if (model && typeof model === "function") {
            modelsArr = handson.getSourceData();
            modelsArr.splice(index, 0, new model(options || {}));
            handson.render();
        } else {
            handson.alter("insert_row", index);
        }
    };

    Table.prototype.removeRow = function (index) {
        var selectedArea, firstIndex, lastIndex;

        if (index !== undefined && index !== null) {
            this.handson.alter("remove_row", index);
        } else {
            selectedArea = this.handson.getSelected();
            lastIndex = Math.max(selectedArea[2], selectedArea[0]);
            firstIndex = Math.min(selectedArea[2], selectedArea[0]);

            this.handson.alter("remove_row", firstIndex, (lastIndex - firstIndex) + 1);
        }
    };

    Table.prototype.on = function (action, callback) {
        var storage = this.settings.storage,
            handson = this.handson;

        switch (action) {
            case "afterChange":
            {
                this.handson.addHook("afterChange", function (changes, action) {
                    _change.call(handson, changes, action, storage, callback);
                });
            }
                break;
            case "beforeChange":
            {
                this.handson.addHook("beforeChange", function (changes, action) {
                    _change.call(handson, changes, action, storage, callback);
                });
            }
                break;
            default:
            {
                this.handson.addHook(action, callback);
            }
        }

    };

    Table.prototype.updateData = function (data) {
        this.handson.loadData(data);
    };

    Table.prototype.addValidator = function (validatorFunc) {
        this.settings.validationRules.push(validatorFunc);
    };

    Table.prototype.addGlobalValidator = function (validatorFunc) {
        this.settings.globalRules.push(validatorFunc);
    };

    Table.prototype.validate = function () {
        var i, row, rowCount, allData, errors, rowErrors, result;

        result = "";
        this.isValid = true;
        errors = {};
        allData = this.handson.getSourceData();
        rowCount = this.handson.countRows();

        this.settings.globalRules.forEach(function (rule) {
            var message = rule.call(null, allData);
            if (message) {
                result += "<p>" + message + "</p>";
            }
        });

        for (i = 0; i < rowCount; i++) {
            row = this.handson.getSourceDataAtRow(i);
            rowErrors = getRowErrors(this.settings.validationRules, row, allData);
            if (rowErrors.length) {
                errors[i] = rowErrors;
            }
        }
        if (Object.keys(errors).length) {
            result += getHtmlForErrors(errors);
        }
        if (result) {
            this.isValid = false;
        }
        return result;
    };

    Table.prototype.download = function () {
        var expString = TableToCSV.string(this.handson);
        saveAs(new Blob([expString], {type: "application/octet-stream"}), 'filename.csv');
    };
    //endregion

    return Table;
})();

var TableToCSV = (function () {
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                    Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

            }

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = Base64._keyStr.indexOf(input.charAt(i++));
                enc2 = Base64._keyStr.indexOf(input.charAt(i++));
                enc3 = Base64._keyStr.indexOf(input.charAt(i++));
                enc4 = Base64._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }
            return string;
        }
    };

    return {
        string: function (instance) {
            var headers = instance.getColHeader();

            var csv = "\uFEFF\n";
            csv += headers.join(";") + "\n";

            for (var i = 0; i < instance.countRows(); i++) {
                var row = [];
                for (var h in headers) {
                    var prop = instance.colToProp(h);
                    var value = instance.getDataAtRowProp(i, prop);
                    row.push(value)
                }

                csv += row.join(";");
                csv += "\n";
            }

            return csv;
        },

        download: function (instance, filename) {
            var csv = TableToCSV.string(instance);

            var link = document.createElement("a");
            link.setAttribute("href", "data:application/octet-stream;base64," + Base64.encode(csv));
            link.setAttribute("download", filename);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link)
        }
    }

});
