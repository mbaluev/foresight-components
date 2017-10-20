(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'particles', target : self });
                    var that = this.obj = {};
                    that.const = {
                        COLOR_BLUE: '#4983c4',
                        COLOR_DEFAULT: '#666666',
                        COLOR_PURPLE: '#8e6bf5',
                        COLOR_RED: '#ff5940',
                        COLOR_WHITE: '#ffffff'
                    };
                    that.defaults = {
                        color: 'blue',
                        colorNodes: that.const.COLOR_WHITE,
                        colorBackground: that.const.COLOR_BLUE
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.init_color = function(){
                        if (that.data.color == 'blue'){
                            that.data.colorNodes = that.const.COLOR_WHITE;
                            that.data.colorBackground = that.const.COLOR_BLUE;
                        }
                        if (that.data.color == 'default'){
                            that.data.colorNodes = that.const.COLOR_WHITE;
                            that.data.colorBackground = that.const.COLOR_DEFAULT;
                        }
                        if (that.data.color == 'purple'){
                            that.data.colorNodes = that.const.COLOR_WHITE;
                            that.data.colorBackground = that.const.COLOR_PURPLE;
                        }
                        if (that.data.color == 'red'){
                            that.data.colorNodes = that.const.COLOR_WHITE;
                            that.data.colorBackground = that.const.COLOR_RED;
                        }
                        if (that.data.color == 'white'){
                            that.data.colorNodes = that.const.COLOR_DEFAULT;
                            that.data.colorBackground = that.const.COLOR_WHITE;
                        }
                        self.css({ 'background-color': that.data.colorBackground });
                    };
                    that.init = function(){
                        that.init_color();
                        that.data.id = 'particles_' + Date.now();
                        self.attr('id', that.data.id);
                        particlesJS(that.data.id, {
                            "particles": {
                                "number": {
                                    "value": 80,
                                    "density": {
                                        "enable": true,
                                        "value_area": 800
                                    }
                                },
                                "color": {
                                    "value": that.data.colorNodes
                                },
                                "shape": {
                                    "type": "circle",
                                    "stroke": {
                                        "width": 0,
                                        "color": that.data.colorNodes
                                    },
                                    "polygon": {
                                        "nb_sides": 5
                                    },
                                    "image": {
                                        "src": "img/github.svg",
                                        "width": 100,
                                        "height": 100
                                    }
                                },
                                "opacity": {
                                    "value": 0.5,
                                    "random": false,
                                    "anim": {
                                        "enable": false,
                                        "speed": 1,
                                        "opacity_min": 0.1,
                                        "sync": false
                                    }
                                },
                                "size": {
                                    "value": 3,
                                    "random": true,
                                    "anim": {
                                        "enable": false,
                                        "speed": 40,
                                        "size_min": 0.1,
                                        "sync": false
                                    }
                                },
                                "line_linked": {
                                    "enable": true,
                                    "distance": 150,
                                    "color": that.data.colorNodes,
                                    "opacity": 0.25,
                                    "width": 1
                                },
                                "move": {
                                    "enable": true,
                                    "speed": 3,
                                    "direction": "none",
                                    "random": true,
                                    "straight": false,
                                    "out_mode": "out",
                                    "bounce": false,
                                    "attract": {
                                        "enable": false,
                                        "rotateX": 600,
                                        "rotateY": 1200
                                    }
                                }
                            },
                            "interactivity": {
                                "detect_on": "canvas",
                                "events": {
                                    "onhover": {
                                        "enable": true,
                                        "mode": "grab"
                                    },
                                    "onclick": {
                                        "enable": true,
                                        "mode": "repulse"
                                    },
                                    "resize": true
                                },
                                "modes": {
                                    "grab": {
                                        "distance": 200,
                                        "line_linked": {
                                            "opacity": 0.5
                                        }
                                    },
                                    "bubble": {
                                        "distance": 400,
                                        "size": 5,
                                        "duration": 2,
                                        "opacity": 1,
                                        "speed": 3
                                    },
                                    "repulse": {
                                        "distance": 200,
                                        "duration": 0.4
                                    },
                                    "push": {
                                        "particles_nb": 4
                                    },
                                    "remove": {
                                        "particles_nb": 2
                                    }
                                }
                            },
                            "retina_detect": true
                        });
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
        },
    };
    $.fn.particles = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.particles' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="particles"]').particles();
});