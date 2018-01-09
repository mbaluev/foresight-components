if (!Asyst.date) { Asyst.date = {}; }
Asyst.date.convertToGenitive = function(dateStr){
    var lastChar = dateStr.slice(-1);
    if (lastChar == 'ь' || lastChar == 'я') {
        return dateStr.substr(0, dateStr.length - 1) + 'я';
    } else {
        return dateStr + 'а';
    }
};