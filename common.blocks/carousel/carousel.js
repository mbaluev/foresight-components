(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'carousel', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        autoPlay: true,
                        autoPlayDelay: 2500,
                        animationSpeed: 500,
                        allowPlayOnHover: false,
                        circleEnable: true,
                        circlePosition: 'bottom',
                        items: [],
                        type: 'text',
                        onItemClick: null,
                        onItemRender: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        carousel__container: null,
                        carousel__items: null,
                        button_prev: null,
                        button_next: null,
                        carousel__circles: null,
                        carousel__item_list: [],
                        button_circle_list: [],
                        widget__content_nodata: $([
                            '<div class="widget__content widget__content_align_center">',
                            '<div class="widget__text">Нет данных</div>',
                            '</div>'
                        ].join(''))
                    };
                    that.data._private = {
                        sliderTimer: null,
                        allowManipulations: true,
                        i: 0,
                        j: 0,
                        n: 0
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.set_width = function(value){
                        self.css({ width: value });
                    };
                    that.set_height = function(value){
                        self.css({ height: value });
                    };

                    that.render_carousel = function(){
                        that.data._el.carousel__container = $('<div class="carousel__container"></div>');
                        that.data._el.carousel__items = $('<div class="carousel__items"></div>');
                        if (that.data.type == 'image') {
                            that.data._el.carousel__items.addClass('carousel__items_image');
                        }
                        that.data._el.button_prev = $([
                            '<button class="button button_prev" type="button" data-fc="button">',
                            '<span class="icon icon_svg_left"></span>',
                            '</button>'
                        ].join(''));
                        that.data._el.button_next = $([
                            '<button class="button button_next" type="button" data-fc="button">',
                            '<span class="icon icon_svg_right"></span>',
                            '</button>'
                        ].join(''));
                        that.data._el.carousel__circles = $('<div class="carousel__circles"></div>');
                        that.data.items.forEach(function(item){
                            var $item;
                            if (that.data.type == 'text') {
                                $item = $([
                                    '<div class="carousel__item">',
                                    (item.url ? '<a href="' + item.url + '" class="carousel__item-text link">' + item.name + '</a>' : '<span class="carousel__item-text link">' + item.name + '</span>'),
                                    '</div>'
                                ].join(''));
                            }
                            if (that.data.type == 'image') {
                                $item = $([
                                    '<div class="carousel__item">',
                                    (item.url ? '<a href="' + item.url + '" class="carousel__item-image link" style="background-image: url(' + item.image + ')"></a>' : '<span class="carousel__item-image link" style="background-image: url(' + item.image + ')"></span>'),
                                    '<span class="carousel__item-image-text" data-tooltip="' + item.name + '">' + item.name + '</span>',
                                    '</div>'
                                ].join(''));
                            }
                            if (that.data.type == 'custom') {
                                $item = $('<div class="carousel__item"></div>');
                                if (typeof that.data.onItemRender == 'function') {
                                    $item.append(that.data.onItemRender(item));
                                }
                            }
                            if (typeof that.data.onItemClick == 'function') {
                                $item.on('click', function(){
                                    that.data.onItemClick(item);
                                });
                            }
                            that.data._el.carousel__items.append($item);
                            that.data._el.carousel__item_list.push($item);
                            var $button = $([
                                '<button class="button button_circle" type="button" data-fc="button">',
                                '<span class="icon">',
                                '<span class="icon icon__circle"></span>',
                                '</span>',
                                '</button>'
                            ].join('')).button();
                            that.data._el.carousel__circles.append($button);
                            that.data._el.button_circle_list.push($button);
                        });
                        self.append(
                            that.data._el.carousel__container.append(
                                that.data._el.button_prev,
                                that.data._el.carousel__items,
                                that.data._el.button_next
                            ),
                            that.data._el.carousel__circles
                        );
                    };
                    that.render_nodata = function(){
                        if (that.data.items.length == 0) {
                            self.parent().append(that.data._el.widget__content_nodata);
                            self.remove();
                            self = that.data._el.widget__content_nodata;
                            self.data(that.data);
                        }
                    };
                    that.render_dotdotdot = function(){
                        that.data._el.carousel__item_list.map(function(item){
                            item.dotdotdot();
                        });
                        $(window).resize(function(){
                            setTimeout(function(){
                                that.data._el.carousel__item_list.map(function(item){
                                    item.trigger('update');
                                });
                            }, 100);
                        });
                    };

                    that.activate = function(){
                        that.data._private.i = that.data._el.carousel__item_list.length;
                        that.data._private.j = 0;
                        that.data._private.n = that.data._el.carousel__item_list.length;
                        initialize();
                        initSwipe();
                        function initialize(){
                            if (that.data._private.n > 1) {
                                that.data._el.carousel__item_list.forEach(function(item, i){
                                    $(item).css('display', 'none');
                                })
                                $(that.data._el.carousel__item_list[0]).removeAttr('style');
                                if (that.data.circleEnable) {
                                    bindCircles();
                                    bindArrows();
                                }
                                if (that.data.autoPlay) {
                                    that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                    if (!that.data.allowPlayOnHover) {
                                        self.hover(function() {
                                            clearInterval(that.data._private.sliderTimer);
                                        },function() {
                                            that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                        });
                                    }
                                }
                            }
                        }
                        function bindCircles(){
                            that.data._el.button_circle_list.forEach(function(button, i){
                                var $circle = $(button).find('.icon__circle');
                                $circle.attr('class',$circle.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                $circle.addClass('icon__circle_grey');
                                if (i == 0) {
                                    $circle.addClass('icon__circle_blue');
                                }
                                $(button).bind({
                                    'click': function(){
                                        if (that.data._private.allowManipulations) {
                                            if (that.data._private.j != i) {
                                                if (!that.data.allowPlayOnHover) {
                                                    that.data._private.i = that.data._private.j;
                                                    that.data._private.j = i;
                                                    goToSlide(that.data._private.i, that.data._private.j);
                                                } else {
                                                    clearInterval(that.data._private.sliderTimer);
                                                    that.data._private.i = that.data._private.j;
                                                    that.data._private.j = i;
                                                    goToSlide(that.data._private.i, that.data._private.j, function(){
                                                        that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                                    });
                                                }
                                            }
                                        }
                                    },
                                });
                            });
                        }
                        function bindArrows(){
                            that.data._el.button_prev.bind({
                                'click': function(){
                                    if (that.data._private.allowManipulations) {
                                        prev();
                                        if (!that.data.allowPlayOnHover) {
                                            goToSlide(that.data._private.i, that.data._private.j);
                                        } else {
                                            clearInterval(that.data._private.sliderTimer);
                                            goToSlide(that.data._private.i, that.data._private.j, function(){
                                                that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                            });
                                        }
                                    }
                                }
                            });
                            that.data._el.button_next.bind({
                                'click': function(){
                                    if (that.data._private.allowManipulations) {
                                        next();
                                        if (!that.data.allowPlayOnHover) {
                                            goToSlide(that.data._private.i, that.data._private.j);
                                        } else {
                                            clearInterval(that.data._private.sliderTimer);
                                            goToSlide(that.data._private.i, that.data._private.j, function(){
                                                that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                            });
                                        }
                                    }
                                }
                            });
                        }
                        function initSwipe(){
                            that.data._el.carousel__item_list.forEach(function(item){
                                $(item).touchwipe({
                                    wipeLeft: function() {
                                        if (that.data._private.allowManipulations) {
                                            if (that.data._private.i < that.data._private.n-1) {
                                                clearInterval(that.data._private.sliderTimer);
                                                goToSlide(that.data._private.i, that.data._private.i+1, function(){
                                                    that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                                });
                                            }
                                        }
                                    },
                                    wipeRight: function() {
                                        if (that.data._private.allowManipulations) {
                                            if (that.data._private.i > 0) {
                                                clearInterval(that.data._private.sliderTimer);
                                                goToSlide(that.data._private.i, that.data._private.i-1, function(){
                                                    that.data._private.sliderTimer = setInterval(iterate, that.data.autoPlayDelay);
                                                });
                                            }
                                        }
                                    },
                                    preventDefaultEvents: false
                                });
                            })
                        }
                        function iterate(){
                            next();
                            goToSlide(that.data._private.i, that.data._private.j);
                        }
                        function next(){
                            var j = that.data._private.j;
                            that.data._private.i = j;
                            j++;
                            if (j == that.data._private.n) { j = 0; }
                            that.data._private.j = j;

                        };
                        function prev(){
                            var j = that.data._private.j;
                            that.data._private.i = j;
                            j--;
                            if (j < 0) { j = that.data._private.n - 1; }
                            that.data._private.j = j;
                        };
                        function goToSlide(gti, gtj, callback){
                            that.data._private.allowManipulations = false;
                            var $circlei = $(that.data._el.button_circle_list[gti]).find('.icon__circle');
                            var $circlej = $(that.data._el.button_circle_list[gtj]).find('.icon__circle');
                            if (gti < gtj) {
                                $(that.data._el.carousel__item_list[gti])
                                    .animate({left: '-100%'}, that.data.animationSpeed, function(){
                                        $(this).css('display','none').css('left','0');
                                        if (that.data.circleEnable) {
                                            $circlei.attr('class',$circlei.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                            $circlei.addClass('icon__circle_grey');
                                        }
                                    });
                                $(that.data._el.carousel__item_list[gtj]).removeAttr('style').css('left','100%')
                                    .animate({left: '0'}, that.data.animationSpeed, function(){
                                        if (that.data.circleEnable) {
                                            $circlej.attr('class',$circlej.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                            $circlej.addClass('icon__circle_blue');
                                        }
                                        if (callback) { callback(); }
                                        that.data._private.allowManipulations = true;
                                    });
                            } else {
                                $(that.data._el.carousel__item_list[gti])
                                    .animate({left: '100%'}, that.data.animationSpeed, function(){
                                        $(this).css('display','none').css('left','0');
                                        if (that.data.circleEnable) {
                                            $circlei.attr('class',$circlei.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                            $circlei.addClass('icon__circle_grey');
                                        }
                                    });
                                $(that.data._el.carousel__item_list[gtj]).removeAttr('style').css('left','-100%')
                                    .animate({left: '0'}, that.data.animationSpeed, function(){
                                        if (that.data.circleEnable) {
                                            $circlej.attr('class',$circlej.attr('class').replace(/\icon__circle_.*?\b/g, ''));
                                            $circlej.addClass('icon__circle_blue');
                                        }
                                        if (callback) { callback(); }
                                        that.data._private.allowManipulations = true;
                                    });
                            }
                        }
                    };

                    that.init_carousel = function(){
                        that.data._el.carousel__container = self.find('.carousel__container');
                        that.data._el.carousel__items = self.find('.carousel__items');
                        that.data._el.button_prev = self.find('.button_prev');
                        that.data._el.button_next = self.find('.button_next');
                        that.data._el.carousel__circles = self.find('.carousel__circles');
                        self.find('.carousel__item').each(function(i, item){
                            var it = {
                                text: $(this).find('.carousel__item-text').text(),
                                url: $(this).find('.carousel__item-text').attr('href')
                            };
                            that.data.items.push(it);
                            that.data._el.carousel__item_list.push($(item));
                        });
                        self.find('.button_circle').each(function(i, button){
                            that.data._el.button_circle_list.push($(button));
                        });
                        if (that.data._el.carousel__item_list.length != that.data._el.button_circle_list.length) {
                            that.data._el.carousel__item_list.forEach(function(item, i){
                                if (typeof that.data._el.button_circle_list[i] == typeof undefined) {
                                    var $button = $([
                                        '<button class="button button_circle" type="button" data-fc="button">',
                                        '<span class="icon">',
                                        '<span class="icon icon__circle"></span>',
                                        '</span>',
                                        '</button>'
                                    ].join('')).button();
                                    that.data._el.carousel__circles.append($button);
                                    that.data._el.button_circle_list.push($button);
                                }
                            });
                            that.data._el.button_circle_list.forEach(function(button, i){
                                if (typeof that.data._el.carousel__item_list[i] == typeof undefined) {
                                    $(button).remove();
                                }
                            });
                        }
                    };
                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                        self.find('[data-tooltip]').tooltip();
                    };
                    that.init = function() {
                        that.set_width(that.data.width);
                        that.set_height(that.data.height);
                        if (self.children().length == 0) {
                            that.render_carousel();
                        } else {
                            that.init_carousel();
                        }
                        that.render_nodata();
                        if (that.data.type == 'text') {
                            that.render_dotdotdot();
                        }
                        that.init_components();
                        that.activate();
                    };
                    that.init();
                }
                return this;
            });
        },
        destroy : function() {
            return this.each(function() {
                this.obj.destroy();
            });
        }
    };
    $.fn.carousel = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.carousel' );
        }
    };
})( jQuery );
(function($) {
    $.fn.touchwipe = function(settings) {
        var config = {
            min_move_x: 20,
            min_move_y: 20,
            wipeLeft: function() { },
            wipeRight: function() { },
            wipeUp: function() { },
            wipeDown: function() { },
            preventDefaultEvents: true
        };
        if (settings) $.extend(config, settings);
        this.each(function() {
            var startX;
            var startY;
            var isMoving = false;
            function cancelTouch() {
                this.removeEventListener('touchmove', onTouchMove);
                startX = null;
                isMoving = false;
            }
            function onTouchMove(e) {
                if(config.preventDefaultEvents) {
                    e.preventDefault();
                }
                if(isMoving) {
                    var x = e.touches[0].pageX;
                    var y = e.touches[0].pageY;
                    var dx = startX - x;
                    var dy = startY - y;
                    if(Math.abs(dx) >= config.min_move_x) {
                        cancelTouch();
                        if(dx > 0) {
                            config.wipeLeft();
                        } else {
                            config.wipeRight();
                        }
                    }
                    else if(Math.abs(dy) >= config.min_move_y) {
                        cancelTouch();
                        if(dy > 0) {
                            config.wipeDown();
                        } else {
                            config.wipeUp();
                        }
                    }
                }
            }
            function onTouchStart(e) {
                if (e.touches.length == 1) {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                    isMoving = true;
                    this.addEventListener('touchmove', onTouchMove, false);
                }
            }
            if ('ontouchstart' in document.documentElement) {
                this.addEventListener('touchstart', onTouchStart, false);
            }
        });
        return this;
    };
})(jQuery);
$(function(){
    $('[data-fc="carousel"]').carousel();
});