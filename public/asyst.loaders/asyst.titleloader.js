if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.TitleLoader = {
    obj: function(options){
        var that = this._loader = {};
        that.data = {
            data: null,
            target: null,
            success: null,
            error: null,
            content: null
        };
        that.data = $.extend(that.data, options);
        that.extend = function(options){
            that.data = $.extend(true, {}, that.data, options);
        };
        that.loadTitle = function(){
            return that.data.data.title;
        };
        that.loadContent = function(){
            if (typeof that.data.success == 'function') {
                that.data.success(that.loadTitle);
                that.data.target.find('.widget__body').addClass('widget__body_align_center');
                that.data.target.find('.widget__body-data').removeClass('widget__body-data_type_html');
                that.data.target.find('.widget__body-data').addClass('widget__body-data_type_text_align_center');
                that.data.target.find('.widget__body-data').addClass('widget__body-data_type_text_fontsize');
            }
        };
        return that;
    }
};
Asyst.ContentFormatterLoader = {
    obj: function(options){
        var that = this._loader = {};
        that.data = {
            data: null,
            target: null,
            success: null,
            error: null,
            content: null
        };
        that.data = $.extend(that.data, options);
        that.extend = function(options){
            that.data = $.extend(true, {}, that.data, options);
        };
        that.loadTitle = function(){
            return that.data.data.contentFormatter(that.data.data);
        };
        that.loadContent = function(){
            if (typeof that.data.success == 'function') {
                that.data.success(that.loadTitle);
                that.data.target.find('.widget__body').addClass('widget__body_align_center');
                that.data.target.find('.widget__body-data').removeClass('widget__body-data_type_html');
                that.data.target.find('.widget__body-data').addClass('widget__body-data_type_text_align_center');
                that.data.target.find('.widget__body-data').addClass('widget__body-data_type_text_fontsize');
            }
        };
        return that;
    }
};