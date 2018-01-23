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
                        video__controls_top: $('<div class="video__controls_top"></div>'),
                        video__controls_bottom: $('<div class="video__controls_bottom"></div>'),
                        video__controls_left: $('<div class="video__controls_left"></div>'),
                        video__controls_middle: $('<div class="video__controls_middle"></div>'),
                        video__controls_right: $('<div class="video__controls_right"></div>'),
                        progress: $('<div class="video__progress" data-tooltip="0"></div>'),
                        progress_value: $('<div class="video__progress_value"></div>'),
                        alertbox: $('<label class="alertbox"><span class="alertbox__text">0:00&nbsp;/&nbsp;0:00</span></label>'),
                        slider_volume: $('<div class="video__volume"></div>'),
                        slider_volume_progress: $('<div class="video__progress" data-tooltip="100"></div>'),
                        slider_volume_progress_value: $('<div class="video__progress_value"></div>'),
                        loader: $('<span class="spinner spinner_align_center spinner_white"></span>')
                    };
                    that.data._buttons = {
                        play: $('<button class="button" type="button" data-fc="button"><span class="icon icon_svg_player_fill_white"></span></button>'),
                        mute: $('<button class="button" type="button" data-fc="button" data-tooltip="Отключить звук"><span class="icon icon_svg_mute_white"></span></button>'),
                        fullscreen: $('<button class="button" type="button" data-fc="button" data-tooltip="Во весь экран"><span class="icon icon_svg_fullscreen_white"></span></button>')
                    };
                    that.data._fullscreen = {
                        status: undefined,
                        request: undefined,
                        exit: undefined
                    };
                    that.data._volume = 100;

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.error = function(){
                        that.data._el.target.attr('controls', 'true');
                        that.data.error = 'Browser doesn\'t support fullscreen mode';
                        that.loader_remove();
                    };

                    that.render = function(){
                        that.render_controls();
                        var data = $.extend(true, {}, that.data);
                        that.data._el.target.removeClass('video').remove();
                        that.data._el.parent.append(
                            that.data._el.video.append(
                                that.data._el.video__container.append(
                                    that.data._el.target
                                ),
                                that.data._el.video__controls.append(
                                    that.data._el.video__controls_top,
                                    that.data._el.video__controls_bottom.append(
                                        that.data._el.video__controls_left,
                                        that.data._el.video__controls_middle,
                                        that.data._el.video__controls_right
                                    )
                                )
                            )
                        );
                        that.data._el.target.data(data);
                    };
                    that.render_controls = function(){
                        that.data._el.video__controls_top.append(
                            that.data._el.progress.append(
                                that.data._el.progress_value
                            )
                        );
                        that.data._el.video__controls_left.append(
                            that.data._buttons.play,
                            that.data._el.alertbox
                        );
                        that.data._el.video__controls_middle.append(
                            that.data._el.slider_volume.append(
                                that.data._el.slider_volume_progress.append(
                                    that.data._el.slider_volume_progress_value
                                )
                            ),
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
                        that.data._buttons.play.button('disable');
                        that.data._buttons.mute.on('click.video', that.video_mute);
                        that.data._buttons.fullscreen.on('click.video', that.video_fullscreen);
                        that.data._video.addEventListener('timeupdate', that.video_update_progress_bar);
                        that.data._el.progress.on('mousemove', that.video_progress_tooltip);
                        that.data._el.progress.on('click drag', that.video_seek);
                        that.data._el.slider_volume_progress.on('mousemove', that.video_volume_tooltip);
                        that.data._el.slider_volume_progress.on('click drag', that.video_volume);
                    };

                    that.video_init = function(){
                        if (!that.data._el.target.attr('id')) {
                            that.data._el.target.attr('id', (new Date()).valueOf());
                        }
                        that.data._video = document.getElementById(that.data._el.target.attr('id'));
                        that.data._video.controls = false;
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
                    that.video_loaded = function(){
                        that.video_init();
                        that.data._video.onloadedmetadata = that.video_set_metadata;
                        that.data._video.oncanplay = that.video_canplay;
                        //that.data._video.onloadeddata = that.video_set_metadata;
                        //that.data._video.onloadstart = that.video_set_metadata;
                    };
                    that.video_set_metadata = function(){
                        that.video_set_progress_text();
                        that.loader_remove();
                    };
                    that.video_canplay = function(){
                        that.data._buttons.play.button('enable');
                    };
                    that.video_play_pause = function(){
                        that.loader_remove();
                        if (that.data._video.paused || that.data._video.ended) {
                            that.data._video.play();
                            that.data._buttons.play.find('.icon').removeClass('icon_svg_player_fill_white').addClass('icon_svg_pause_white');
                        } else {
                            that.data._video.pause();
                            that.data._buttons.play.find('.icon').removeClass('icon_svg_pause_white').addClass('icon_svg_player_fill_white');
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
                        that.data._volume = that.data._video.volume;
                        that.data._video.muted = !that.data._video.muted;
                        if (that.data._video.muted) {
                            that.video_set_volume(0);
                            that.data._buttons.mute.find('.icon').removeClass('icon_svg_mute_white').addClass('icon_svg_unmute_white');
                            that.data._buttons.mute.tooltip('clear');
                            that.data._buttons.mute.tooltip();
                            that.data._buttons.mute.tooltip('update', 'Включить звук');
                        } else {
                            that.video_set_volume(that.data._volume);
                            that.data._buttons.mute.find('.icon').removeClass('icon_svg_unmute_white').addClass('icon_svg_mute_white');
                            that.data._buttons.mute.tooltip('clear');
                            that.data._buttons.mute.tooltip();
                            that.data._buttons.mute.tooltip('update', 'Отключить звук');
                        }
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
                    that.video_update_progress_bar = function(){
                        var value = (100 / that.data._video.duration) * that.data._video.currentTime;
                        that.data._el.progress_value.width(value + '%');
                        that.video_set_progress_text();
                    };
                    that.video_progress_tooltip = function(e){
                        var percent = 100 / that.data._el.progress.width() * e.offsetX;
                        var value = that.data._video.duration / 100 * percent;
                        that.data._el.progress.tooltip();
                        that.data._el.progress.tooltip('update', that.video_seconds_to_time(value));
                    };
                    that.video_seek = function(e){
                        if (e.offsetX < 0) { return; }
                        if (e.offsetX > that.data._el.progress.width()) { return; }
                        var percent = 100 / that.data._el.progress.width() * e.offsetX;
                        var value = that.data._video.duration / 100 * percent;
                        that.data._video.currentTime = value;
                    };
                    that.video_seconds_to_time = function(seconds) {
                        var hours   = Math.floor(seconds / 3600);
                        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
                        var seconds = Math.floor(seconds - (hours * 3600) - (minutes * 60));
                        var time = "";

                        if (hours != 0) {
                            time = hours+":";
                        }
                        if (minutes != 0 || time !== "") {
                            minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
                            time += minutes+":";
                        }
                        seconds = (seconds < 10) ? "0"+seconds : String(seconds);
                        if (time === "") {
                            time = "0:"+seconds;
                        }
                        else {
                            time += seconds;
                        }
                        return time;
                    };
                    that.video_set_progress_text = function(){
                        that.data._el.alertbox.find('.alertbox__text').html(
                            that.video_seconds_to_time(that.data._video.currentTime) + '&nbsp;/&nbsp;' +
                            that.video_seconds_to_time(that.data._video.duration)
                        );
                    };
                    that.video_volume_tooltip = function(e){
                        var volume = Math.floor(100 / that.data._el.slider_volume_progress.width() * e.offsetX);
                        that.data._el.slider_volume_progress.tooltip();
                        that.data._el.slider_volume_progress.tooltip('update', volume);
                    };
                    that.video_volume = function(e){
                        if (e.offsetX < 0) { return ; }
                        if (e.offsetX > that.data._el.slider_volume_progress.width()) { return; }
                        that.data._volume = e.offsetX / that.data._el.slider_volume_progress.width();
                        that.data._video.volume = that.data._volume;
                        that.video_set_volume(that.data._volume);
                        if (that.data._video.muted) {
                            that.video_mute();
                        }
                    };
                    that.video_set_volume = function(value){
                        that.data._el.slider_volume_progress_value.width(value * 100 + '%');
                    };

                    that.init_components = function(){
                        for (var button in that.data._buttons) {
                            that.data._buttons[button].button();
                        }
                    };
                    that.init = function(){
                        that.loader_add();
                        if (that.data._fullscreen.request) {
                            that.video_loaded();
                            that.render();
                            that.init_components();
                            that.bind();
                        } else {
                            that.error();
                        }
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