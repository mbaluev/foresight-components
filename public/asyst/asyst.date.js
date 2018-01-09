if (!Asyst.date) { Asyst.date = {}; }
Asyst.date.convertToGenitive = function(dateStr){
    var regex = new RegExp(Asyst.date.monthNames.join('|'), 'gi');
    var matches = dateStr.match(regex);
    matches.map(function(d){
        var dGenitive = d;
        var lastChar = d.slice(-1);
        if (lastChar == 'ь' || lastChar == 'й') {
            dGenitive = d.substr(0, d.length - 1) + 'я';
        } else {
            dGenitive = d + 'а';
        }
        dateStr.replace(d, dGenitive);
    });
};