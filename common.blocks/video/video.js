(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'video', target : self });
                    var that = this.obj = {};
                    that.defaults = {};
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._video = null;
                    that.data._video__controls_timer = null;
                    that.data._el = {
                        target: self,
                        parent: self.parent(),
                        video: $('<div class="video" id="' + (new Date()).valueOf() + '"></div>'),
                        video__container: $('<div class="video__container"></div>'),
                        video__controls: $('<div class="video__controls"></div>'),
                        video__controls_left: $('<div class="video__controls_left"></div>'),
                        video__controls_right: $('<div class="video__controls_right"></div>'),
                        loader: $('<span class="spinner spinner_align_center spinner_white"></span>')
                    };
                    that.data._buttons = {
                        play: $('<button class="button" type="button" data-fc="button" data-tooltip="play"><span class="icon icon_svg_settings_white"></span></button>'),
                        stop: $('<button class="button" type="button" data-fc="button" data-tooltip="stop"><span class="icon icon_svg_settings_white"></span></button>'),
                        louder: $('<button class="button" type="button" data-fc="button" data-tooltip="louder"><span class="icon icon_svg_settings_white"></span></button>'),
                        quieter: $('<button class="button" type="button" data-fc="button" data-tooltip="quiter"><span class="icon icon_svg_settings_white"></span></button>'),
                        mute: $('<button class="button" type="button" data-fc="button" data-tooltip="mute"><span class="icon icon_svg_settings_white"></span></button>'),
                        fullscreen: $('<button class="button" type="button" data-fc="button" data-tooltip="fullscreen"><span class="icon icon_svg_settings_white"></span></button>')
                    };
                    that.data._fullscreen = {
                        status: undefined,
                        request: undefined,
                        exit: undefined
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.render = function(){
                        that.render_controls();
                        that.data._el.target.removeClass('video').remove();
                        that.data._el.parent.append(
                            that.data._el.video.append(
                                that.data._el.video__container.append(
                                    that.data._el.target
                                ),
                                that.data._el.video__controls.append(
                                    that.data._el.video__controls_left,
                                    that.data._el.video__controls_right
                                )
                            )
                        );
                    };
                    that.render_controls = function(){
                        that.data._el.video__controls_left.append(
                            that.data._buttons.play,
                            that.data._buttons.stop,
                            that.data._buttons.louder,
                            that.data._buttons.quieter,
                            that.data._buttons.mute
                        );
                        that.data._el.video__controls_right.append(
                            that.data._buttons.fullscreen
                        );
                    };

                    that.controls_hide = function(){
                        if (!that.data._video.paused && !that.data._video.ended) {
                            that.data._el.video__controls.addClass('video__controls_hidden');
                        }
                    };
                    that.controls_show = function(){
                        that.data._el.video__controls.removeClass('video__controls_hidden');
                    };
                    that.controls_timer = function(){
                        clearTimeout(that.data._video__controls_timer);
                        that.controls_show();
                        that.data._video__controls_timer = setTimeout(that.controls_hide, 5000);
                    };

                    that.loader_add = function(){
                        that.data._el.parent.prepend(that.data._el.loader)
                    };
                    that.loader_remove = function(){
                        that.data._el.loader.remove();
                    };

                    that.bind = function(){
                        that.data._el.video.on('mouseout.video', that.controls_hide);
                        that.data._el.video.on('mousemove.video', that.controls_timer);
                        that.data._buttons.play.on('click.video', that.video_play_pause);
                        that.data._buttons.stop.on('click.video', that.video_stop);
                        that.data._buttons.louder.on('click.video', that.video_louder);
                        that.data._buttons.quieter.on('click.video', that.video_quieter);
                        that.data._buttons.mute.on('click.video', that.video_mute);
                        that.data._buttons.fullscreen.on('click.video', that.video_fullscreen);
                        that.data._fullscreen.request = function(){
                            var root = document.documentElement;
                            return root.requestFullscreen ||
                                root.webkitRequestFullscreen ||
                                root.mozRequestFullScreen ||
                                root.msRequestFullscreen;
                        }();
                        that.data._fullscreen.exit = function(){
                            return document.exitFullscreen ||
                                document.webkitExitFullscreen ||
                                document.mozCancelFullScreen ||
                                document.msExitFullscreen;
                        }();
                        that.data._fullscreen.status = function(){
                            return document.fullscreenElement ||
                                document.webkitFullscreenElement ||
                                document.mozFullScreenElement ||
                                document.msFullscreenElement;
                        };
                    };

                    that.video_init = function(){
                        if (!that.data._el.target.attr('id')) {
                            that.data._el.target.attr('id', (new Date()).valueOf());
                        }
                        that.data._video = document.getElementById(that.data._el.target.attr('id'));
                        that.data._video.controls = false;
                    };
                    that.video_play_pause = function(){
                        if (that.data._video.paused || that.data._video.ended) {
                            that.data._video.play();
                            that.data._buttons.play.tooltip('clear');
                            that.data._buttons.play.tooltip('update', 'pause');
                        } else {
                            that.data._video.pause();
                            that.data._buttons.play.tooltip('clear');
                            that.data._buttons.play.tooltip('update', 'play');
                        }
                    };
                    that.video_stop = function(){
                        that.data._video.pause();
                        that.data._video.currentTime = 0;
                    };
                    that.video_louder = function(){
                        that.data._video.volume += that.data._video.volume == 1 ? 0 : 0.1;
                        that.data._video.volume = parseFloat(that.data._video.volume).toFixed(1);
                    };
                    that.video_quieter = function(){
                        that.data._video.volume -= that.data._video.volume == 0 ? 0 : 0.1;
                        that.data._video.volume = parseFloat(that.data._video.volume).toFixed(1);
                    };
                    that.video_mute = function(){
                        that.data._video.muted = !that.data._video.muted;
                    };
                    that.video_fullscreen = function(){
                        if (that.data._fullscreen.request) {
                            if (that.data._fullscreen.status() == null) {
                                that.data._fullscreen.request.call(document.getElementById(that.data._el.video.attr('id')));
                            } else {
                                that.data._fullscreen.exit.call(document);
                            }
                        } else {
                            alert('browser doesn\'t allow fullscreen mode');
                        }
                    };

                    that.init_components = function(){
                        for (var button in that.data._buttons) {
                            that.data._buttons[button].button();
                        }
                    };
                    that.init = function(){
                        that.loader_add();
                        setTimeout(function(){
                            that.render();
                            that.video_init();
                            that.init_components();
                            that.bind();
                            that.loader_remove();
                        }, 100);
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
    $.fn.video = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.video' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="video"]').video();
});