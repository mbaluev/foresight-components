/**
 * Created by mbaluev on 09.03.2017.
 */

// Warn if overriding existing method
if (Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

// Warn if overriding existing method
if (Array.prototype.findIndex) console.warn("Overriding existing Array.prototype.findIndex.");
// attach the .findIndex method to Array's prototype to call it on any array
Array.prototype.findIndex = function(condition) {
    var index = -1;
    this.some(function(el, i) {
        if (condition(el)) {
            index = i;
            return true;
        }
    });
    return index;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "findIndex", {enumerable: false});

(function () {
    var root = Asyst.Workspace.d3VizualizationData = {};
    $(function(){
        loadAllDataVizualization();
    });

    // Загрузка данных для визуализации
    function loadAllDataVizualization() {
        root.data = {};
        root.data.nodes = [];
        root.data.links = [];
        root.data.dictionaries = {};
        var filter = [
            { type: 'select', width: '210px', index: 1, multiple: true, dictionary: 'level', id: 'levelid', name: 'levelname', placeholder: 'Уровень' },
            { type: 'input', width: '300px', placeholder: 'Начните вводить текст' },
        ];
        //рендерим дом
        root.ktdom = new Asyst.Workspace.Points.ktDom("wrapper", filter);
        //загружаем данные
        root.ktdom.loader_add("#wrapper", "loading", "Загрузка данных");
        /*Asyst.API.DataSet.load('ktChartData', { 'UserLang': 'RU' }, true, successLoad, null);*/
        //берем данные из файла ../data/orgChartData.js
        successLoad(null, orgChartData);
    }
    function successLoad(data, orgChartData) {
        var root, level, targetIndex, sourceIndex, dictionaries;
        root = Asyst.Workspace.d3VizualizationData;
        dictionaries = root.data.dictionaries;

        root.ktdom.loader_remove("loading");
        root.ktdom.loader_add("#wrapper", "parsing", "Разбор данных");

        calculate_level(orgChartData);
        calculate_index(orgChartData);
        function calculate_level(data){
            calculate(data.filter(function(d){ return d.parent == null; }), 1);
            function calculate(array, n){
                if (array.length != 0) {
                    array.forEach(function(item) {
                        item.level = n;
                        var children = data.filter(function(d){ return d.parent == item.id; });
                        calculate(children, n+1);
                    });
                }
            };
        }
        function calculate_index(data){
            var data_count_by_y = {};
            data.map(function(a){
                if (a.level in data_count_by_y) {
                    a.index = data_count_by_y[a.level];
                    data_count_by_y[a.level] ++;
                } else {
                    a.index = 0;
                    data_count_by_y[a.level] = 0;
                }
            });
            var arr = Object.keys( data_count_by_y ).map(function ( key ) { return data_count_by_y[key]; });
            var max = Math.max.apply( null, arr );
            data.map(function(item){
                item.index = item.index * max / data_count_by_y[item.level];
            });
        }

        dictionaries.level = orgChartData.map(function(d){ return { id: d.level, name: 'Уровень ' + d.level }; });
        dictionaries.level = dictionaries.level.filter(function(item, i, arr) { return arr.findIndex(function(d){ return d.id == item.id; }) === i; });

        if (orgChartData) {
            var nodes = Asyst.Workspace.d3VizualizationData.data.nodes;
            var links = Asyst.Workspace.d3VizualizationData.data.links;
            for (var i = 0; i < orgChartData.length; i++) {
                nodes.push({
                    id: orgChartData[i]['id'],
                    pointid: orgChartData[i]['id'],
                    levelid: orgChartData[i]['level'],
                    levelname: 'Уровень ' + orgChartData[i]['level'],
                    index: orgChartData[i]['index']
                });
            }
            for (var i = 0; i < orgChartData.length; i++) {
                if (orgChartData[i]['parent'] != null) {
                    sourceIndex = nodes.findIndex(function(d) { return d.id == orgChartData[i]['id']; });
                    targetIndex = nodes.findIndex(function(d) { return d.id == orgChartData[i]['parent']; });
                    links.push({
                        source: sourceIndex,
                        target: targetIndex
                    });
                }
            }
        }

        var onConnect = function(nodes, callback_success){ callback_success(); };
        var onDisconnect = function(sourcePointid, targetPointid, callback_success){ callback_success(); };
        var options = new Asyst.Workspace.Points.ktOptions(root, onConnect, onDisconnect);
        var chart = new Asyst.Workspace.Points.ktChart(options);

        root.ktoptions = options;
        root.ktchart = chart;
    }
})();
