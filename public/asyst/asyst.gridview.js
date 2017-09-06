if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.GridView = function(options){
    var that = this._gridview = {};
    that.data = {
        containerid: 'container',
        name: null,
        
        gridview: null,
        title: '',
        data: null,
        header: {
            views: [],
            reload: {},
            settings: [],
            search: {}
        }
    };
    that.data = $.extend(that.data, options);
    that.data._el = {
        loader: $('<span class="spinner"></span>')
    };
    that.loader_add = function(){
        $('.fs-view__main').each(function(i, item){
            if (('innerHTML' in item) && (i == $('.fs-view__main').length-1)){
                $(this).append(that.data._el.loader);
            }
        });
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.init_data = function(){};
    that.load_data = function(callback){
        if (typeof callback == 'function') { callback(); }
    };
    that.render_data = function(){};

    that.init = function(){
        that.loader_add();
        that.init_data();
        that.load_data(function(){
            that.loader_remove();
            that.data.gridview = new GridView({
                containerid: that.data.containerid,
                title: that.data.title,
                data: that.data.data,
                header: that.data.header,
                render: that.render_data
            });
        });
    };
    that.init();
    return that;
};