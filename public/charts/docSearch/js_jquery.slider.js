(function($){
	$.fn.slider = function(options) {
		var options = $.extend({
			elementClass: '.news-content',
			elementClassForCirclePages: '.info-right',
			autoPlay: true,
			autoPlayDelay: 5000,	// miliseconds
			animationSpeed: 500,	// miliseconds
			allowCirlcePages: true,
			allowPlayOnHover: false
		}, options);
		var make = function() {
			var sliderTimer, el = $(this), allowManipulations = true, i = 0, j = i + 1, n = el.find(options.elementClass).length;
			initialize();
			initSwipe();
			function initialize(){
				el.css('overflow', 'hidden');
				if (n > 1) {
					el.find(options.elementClass).css('display', 'none');
					el.find(options.elementClass + ':eq(' + i + ')').css('display', 'block');
					if (options.allowCirlcePages) {
						createCirclePages();
						el.find(options.elementClassForCirclePages).find('.page-circle:eq(' + i + ')').addClass('active'); 
					}
					if (options.autoPlay) {
						sliderTimer = setInterval(iterate, options.autoPlayDelay);
						if (!options.allowPlayOnHover) {
							el.hover(function() {
								clearInterval(sliderTimer);
							},function() {
								sliderTimer = setInterval(iterate, options.autoPlayDelay);
							});
						}
					}
				} else {
					el.find(options.elementClass).css('display', 'block');
				}
			}
			function initSwipe(){
				el.find(options.elementClass).each(function(){
					$(this).touchwipe({
						wipeLeft: function() {
							if (allowManipulations) {
								if (i < n-1) {
									clearInterval(sliderTimer);
									//goToSlide(i, i+1);
									goToSlide(i, i+1, function(){ sliderTimer = setInterval(iterate, options.autoPlayDelay); });
								}
							}
						},
						wipeRight: function() {
							if (allowManipulations) {
								if (i > 0) {
									clearInterval(sliderTimer);
									//goToSlide(i, i-1);
									goToSlide(i, i-1, function(){ sliderTimer = setInterval(iterate, options.autoPlayDelay); });
								}
							}
						},
						preventDefaultEvents: false
					});
				})
			}
			function iterate(){
				goToSlide(i, j);
			}
			function createCirclePages(){
				var $pagecircles = $('<div class="page-circles"></div>');
				for (var c=0;c<n;c++){
					var $pagecircle = $('<div class="page-circle"></div>');
					if (c==0) $pagecircle.addClass('first');
					$pagecircles.append($pagecircle);
				}
				$pagecircles.find('.page-circle').each(function(){
					$(this).bind({
						'mouseover': function(){ 
							$(this).css('cursor','pointer'); 
						}
					});
				});
				el.find(options.elementClassForCirclePages).append($pagecircles);
				bind_click_all();
				function bind_click_all(){
					el.find(options.elementClassForCirclePages).find('.page-circle').each(function(cj){
						$(this).bind({
							'click': function(){
								if (allowManipulations) {
									if (i != cj) {
										if (!options.allowPlayOnHover) {
											goToSlide(i, cj);
										} else {
											clearInterval(sliderTimer);
											goToSlide(i, cj, function(){ 
												sliderTimer = setInterval(iterate, options.autoPlayDelay);
											});
										}
									}
								}
							},
						});
					});
				}
			}
			function goToSlide(gti, gtj, callback){
				allowManipulations = false;
				if (gti < gtj) {
					el.find(options.elementClass + ':eq(' + gti + ')')
						.animate({left: '-100%'}, options.animationSpeed, function(){
							$(this).css('display','none').css('left','0');
							if (options.allowCirlcePages) { el.find(options.elementClassForCirclePages).find('.page-circle:eq(' + gti + ')').removeClass('active'); }
						});
					el.find(options.elementClass + ':eq(' + gtj + ')').css('display','block').css('left','100%')
						.animate({left: '0'}, options.animationSpeed, function(){
							if (options.allowCirlcePages) { el.find(options.elementClassForCirclePages).find('.page-circle:eq(' + gtj + ')').addClass('active'); }
							i = gtj;
							gtj++; if (gtj==n) { gtj=0; }
							j = gtj;
							if(callback) { callback(); }
							allowManipulations = true;
					});
				} else {
					el.find(options.elementClass + ':eq(' + gti + ')')
						.animate({left: '100%'}, options.animationSpeed, function(){
							$(this).css('display','none').css('left','0');
							if (options.allowCirlcePages) { el.find(options.elementClassForCirclePages).find('.page-circle:eq(' + gti + ')').removeClass('active'); }
						});
					el.find(options.elementClass + ':eq(' + gtj + ')').css('display','block').css('left','-100%')
						.animate({left: '0'}, options.animationSpeed, function(){
							if (options.allowCirlcePages) { el.find(options.elementClassForCirclePages).find('.page-circle:eq(' + gtj + ')').addClass('active'); }
							i = gtj;
							gtj++; if (gtj==n) { gtj=0; }
							j = gtj;
							if(callback) { callback(); }
							allowManipulations = true;
					});
				}
			}
		};
		return this.each(make);
	};
})(jQuery);

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
