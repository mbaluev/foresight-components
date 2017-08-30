if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.HtmlLoader = function(options){
    var that = this._loader = {};
    that.defaults = {
        data: null,
        success: null,
        error: null,
        content: null
    };
    that.data = $.extend(true, {}, that.defaults, options);
    that.loadContent = function(){
        if (that.data.data.html) {
            that.data.content = that.data.data.html;
            if (typeof that.data.success == 'function') { that.data.success(that.data.content); }
        } else {
            that.data.content = 'Нет данных';
            if (typeof that.data.error == 'function') { that.data.error(that.data.content); }
        }
        return that.data.content;
    };
    return that;
};