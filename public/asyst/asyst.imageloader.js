if (typeof Asyst == typeof undefined) { Asyst = {}; }
Asyst.ImageLoader = function(options){
    var that = this._loader = {};
    that.data = {
        data: null,
        target: null,
        success: null,
        error: null,
        content: null
    };
    that.data = $.extend(that.data, options);
    that.loadImage = function(){
        var obj = {
            spinner: $('<span class="spinner"></span>'),
            widget__image: $('<div class="widget__image"></div>'),
            preloader: new Image()
        };
        obj.preloader.onload = function() {
            obj.spinner.remove();
            obj.widget__image.css('background-image', 'url('+ that.data.data.previewUrl + ')');
            obj.widget__image.on('click', function(){
                console.log(that.data.data.url);
            });
            obj.widget__image.on('mouseover', function(){
                that.data.target.css({ cursor: 'pointer' });
            });
            that.data.target.find('.widget__body').removeClass('widget__body_align_center');
            that.data.target.find('.widget__body-data').addClass('widget__body-data_type_html');
            that.data.target.find('.widget__body-data').css({ padding: '10px 10px 20px' });
            that.data.target.find('.widget__body-data').append(obj.widget__image);
        };
        obj.preloader.onerror = function(){
            if (typeof that.data.error == 'function') {
                that.data.error('Нет данных');
            }
        };
        obj.preloader.src = that.data.data.previewUrl;
        return obj.spinner;
    };
    that.loadContent = function(){
        if (typeof that.data.success == 'function') {
            that.data.success(that.loadImage());
            that.data.target.find('.widget__body').addClass('widget__body_align_center');
            that.data.target.find('.widget__body-data').removeClass('widget__body-data_type_html');
        }
    };
    return that;
};