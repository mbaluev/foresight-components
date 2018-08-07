if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.ContentLoader = {
    contents: [],
    obj: function(options){
        var that = this.loader = {};
        that.defaults = {
            data: null,
            success: null,
            error: null,
            content: null,
            contents: []
        };
        that.data = $.extend(true, {}, that.defaults, options);
        that.extend = function(options){
            that.data = $.extend(true, {}, that.data, options);
        };
        that.loadContent = function(){
            var elem = that.data.contents.filter(function(d){
                return d.pageid == that.data.data.pageid && d.elementid == that.data.data.elementid;
            });
            if (elem.length > 0) {
                that.data.content = elem[0].content;
                if (typeof that.data.success == 'function') { that.data.success(that.data.content); }
            } else {
                that.data.content = 'Нет данных';
                if (typeof that.data.error == 'function') { that.data.error(that.data.content); }
            }
            return that.data.content;
        };
        return that;
    }
};

