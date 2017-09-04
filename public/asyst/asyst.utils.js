(function () {
    var root = Asyst;
    root.Utils = {
        /**
         * Формирует из массива объектов один объект
         * где ключем будет или key или Id внутреннего объекта, значением или Name или результат функции mapFn
         * @param data {Array} массив объектов
         * @param key {String} свойство внутреннего объекта, используется как ключ для нового по умолчанию ключ "Id"
         * @param mapFn {Function} функция для формирования выборки из объекта, по умолчанию значение из поля "Name"
         * @result {Object}
         * */
        arrayToMap: function (data, key, mapFn) {
            var map = {};

            key = key || null;
            mapFn = mapFn || null;

            data.forEach(function (item, index) {
                map[(item[key] || item.id)] = mapFn && mapFn.call(null, item, index) || item.name;
            });
            return map;
        },
        /**
         * Получение или обновление значения в объекте по переданному пути к свойству
         * @obj {Object} объект где искать свойства
         * @path {String} строка с путем до свойства
         * @newVal {Any} новое значение, если оно не передано будет возвращено текущее
         * */
        deepValue: function (obj, path, newVal) {
            var i, pathArr, count;

            pathArr = path.split('.');
            count = pathArr.length - 1;

            for (i = 0; i < count; i++) {
                obj = obj[pathArr[i]];
            }
            if (newVal !== undefined) {
                obj[pathArr[count]] = newVal;
            }
            return obj[pathArr[count]];
        },
        /**
         * Заменяет последнюю часть пути у объекта на Id, используется для обновления значений Id модели
         * для справочников
         * @param fieldName {string} путь в для замены
         * @return string {string} путь с конечным свойством Id
         * @example
         * getFieldIdPath("MyTestObj.InnerObject.name") -> "MyTestObj.InnerObject.id"
         * */
        getFieldIdPath: function (fieldName) {
            var fieldNameArr = fieldName.split(".");

            if (fieldNameArr.length < 2) {
                return fieldName;
            }

            var lastIndex = fieldNameArr.length - 1;
            if (fieldNameArr[lastIndex] === "name") {
                fieldNameArr[lastIndex] = "id";
            }
            return fieldNameArr.join(".");
        },
        /**
         * Округление числа до переданного порядка.
         * @param num {number} число для округления
         * @param order {number} порядок округления
         * @return number {number}
         * */
        round: function (num, order) {
            if (isNaN(num)) {
                console.error("Function Utils.round - argument \"num\" is NaN");
            }
            order = order || 2;
            var multiplier = Math.pow(10, order);
            return Math.round(num * multiplier) / multiplier;
        },
        /**
         * Возвращает индекс в массиве по передааному предикату
         * @param array {Array} массив для поиска индекса
         * @param predicate {function} функция - предикат, которой на вход передается элемент массива
         * @return number {number} индекс первого найденного элемента или -1
         * */
        indexByPredicate: function (array, predicate) {
            var i, count;
            count = array.length;
            for (i = 0; i < count; i++) {
                if (predicate(array[i])) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * Возвращает новый пустой объект заглушку с полями id,name
         * @returns {object}  
         */
        newIdName: function () {
            return {
                id: null,
                name: ""
            }
        },
        /**
         * Вызывает стандартное окно ошибки для приложения с заданным 
         * заголовком и сообщением
         * @param {string} title заголовок сообщения
         * @param {string} message текст сообщения
         * @returns {function} вызов функции NotifyError
         */
        errorFn: function (title, message) {
            NotifyError((title || "Ошибка получения данных"), (message || "При загрузке данных произошла ошибка, перезагрузите страницу для корректной работы приложения <button class='btn btn-default' onclick='location.reload()'>Перезагрузить<i class='icon-refresh'></i></button>"));
        },

        /**
         * Получает значение куки по её имени
         * @param {string} name имя куки для получения
         * @returns {string} значение установленной куки. undefined в случае отсутствия
         */
        getCookie: function (name) {
            var matches = document.cookie.match(new RegExp(
              "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        },
        /**
         * 
         * @param {} name 
         * @param {} value 
         * @param {} options 
         * @returns {} 
         */
        setCookie: function (name, value, options) {
            options = options || {};

            var expires = options.expires;

            if (typeof expires == "number" && expires) {
                var d = new Date();
                d.setTime(d.getTime() + expires * 1000);
                expires = options.expires = d;
            }
            if (expires && expires.toUTCString) {
                options.expires = expires.toUTCString();
            }

            value = encodeURIComponent(value);

            var updatedCookie = name + "=" + value;

            for (var propName in options) {
                updatedCookie += "; " + propName;
                var propValue = options[propName];
                if (propValue !== true) {
                    updatedCookie += "=" + propValue;
                }
            }

            document.cookie = updatedCookie;
        },
        deleteCookie: function (name, options) {
            options.expires = -1;
            setCookie(name, "", options);
        }
    };
})();

/**
 * Перенесено из application.js
 * */

function setParameter(href, name, value) {
    var url = href;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var aditionalURL = tempArray[1];
    var temp = "";
    if (aditionalURL) {
        tempArray = aditionalURL.split("&");
        for (var i in tempArray) {
            if (tempArray[i].indexOf(name) !== 0) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    return baseURL + "?" + newAdditionalURL + temp + name + "=" + encodeURIComponent(value);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * получение разобранной строки get-запроса
 * */
function splitGETString() {
    var tmp;
    var tmp2;
    var param = {};

    var get = location.search; // строка GET запроса
    if (get != '') {
        tmp = (get.substr(1)).split('&'); // разделяем переменные
        for (var i = 0; i < tmp.length; i++) {
            tmp2 = tmp[i].split('='); // массив param будет содержать
            param[tmp2[0]] = tmp2[1]; // пары ключ(имя переменной)->значение
        }
    }
    return param;
}

function IsBootstrap3() {
    //return (typeof $.fn.typeahead !== 'undefined' ? '2.3.2' : '3.0.0');
    return (typeof $.fn.typeahead === 'undefined');
}

function equals(a, b) {
    var v1 = a;
    var v2 = b;

    if (v1 === null || v1 === undefined || (jQuery.isArray(v1) && v1.length === 0))
        v1 = '';
    else if (jQuery.isArray(v1) && v1.length === 1)
        v1 = v1[0];

    if (v2 === null || v2 === undefined || (jQuery.isArray(v2) && v2.length === 0))
        v2 = '';
    else if (jQuery.isArray(v2) && v2.length === 1)
        v2 = v2[0];

    if (v1 == v2)
        return true;
    else if (jQuery.isArray(v1) && jQuery.isArray(v2)) {
        return arrayEquals(v1, v2);
    }
    else
        return false;
}

function arrayEquals(a, b) {
    a.sort();
    b.sort();

    if (a === b) {
        return true;
    }
    if ((a == null || b == null) || (a.length != b.length)) {
        return false;
    }

    for (var i = 0; i < a.length; ++i) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()) + "";
}

//http://stackoverflow.com/questions/18638900/javascript-crc32
function crc32(str) {
    var makeCRCTable = function () {
        var c;
        var crcTable = [];
        for (var n = 0; n < 256; n++) {
            c = n;
            for (var k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            crcTable[n] = c;
        }
        return crcTable;
    };
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}

function countWordForm(number, oneForm, fourForm, fiveForm) {
    var result;
    number = number % 100;

    if (number >= 11 && number <= 19)
        result = fiveForm;
    else {
        number = number % 10;
        if (number == 1)
            result = oneForm;
        else if (number == 2 || number == 3 || number == 4)
            result = fourForm;
        else
            result = fiveForm;
    }

    return result;
}

function toHtml(text) {
    if (text || text === false) {
        var $html = $('<div/>').html(text);
        return $html.text().replace(/'/g, '&apos;').replace(/"/g, '&quot;');
    }
    else
        return '';
}

function StringToHtml(s) {
    if (typeof (s) == "string")
        return s.replace(/\n\r?/g, '<br />');
    else
        return s;
}

function getPageCookie(name) {
    return getCookie(window.location.pathname + name);
}

function getCookie(name) {
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset);
            if (end == -1) {
                end = cookie.length;
            }
            setStr = unescape(cookie.substring(offset, end));
        }
    }
    return (setStr);
}

function setPageCookie(name, value, expires) {
    setCookie(window.location.pathname + name, value, expires);
}

function setCookie(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

function removeCookie(name) {
    setCookie(name, "", -1);
}

function getTimeStamp() {
    var id = new Date().valueOf();
    while (id == new Date().valueOf())
    { }
    return new Date().valueOf();
}