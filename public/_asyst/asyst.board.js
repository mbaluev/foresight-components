var Asyst; 

if (!Asyst) {
    Asyst = {};
}

(function () {
    'use strict';

    if (!Asyst.board) {
        Asyst.board = {};
    }

    var unreadCount = 0;
	var playRefresh = false;
	var playCheckUnread = true;
	var open = false;
	var maxPostId = 0;
	var hasNew = false;
	var opencnt = 0;

	var $indicator = $('<span class="notification-bubble"></span>');

    if (typeof Asyst.board.getUnreadCount !== 'function') {
        Asyst.board.getUnreadCount = function() {
            return unreadCount;
        };
    }

    if (typeof Asyst.board.make !== 'function') {
		Asyst.board.make = function(selector, open_button) {         
            var self = this;
			var $el = $(selector);

			var $board				= $("<div id='board' class='right-stat-bar'></div>");
			var $board_messages		= $("<div id='board-messages' class='panel-body'></div>");
			var $board_controls		= $("<div id='board-controls' class='panel auto'></div>");
			var $board_input_div	= $("<div id='board-input'></div>");
			var $board_input		= $("<textarea type='text' id='board-text' name='board-text' placeholder='Введите сообщение'>");
			var $board_btn			= $("<div id='board_btn'><div class='c-btn send'></div></div>");
			
			$board_input_div.append($board_input);
			$board_controls.append($board_input_div, $board_btn);
			$board.append($board_messages);

			var $post				= $("<div class='post'></div>");
			var $post_head			= $("<div class='post-head'></div>");
			var $post_time			= $("<div class='post-time'></div>");
			var $post_user			= $("<div class='post-user'></div>");
			var $post_body			= $("<div class='post-body'></div>");

			$post_head.append($post_time, $post_user);
			$post.append($post_head, $post_body);

			$el.append($board_controls, $board);
			$el.splitter({type: 'h', accessKey: 'M', sizeTop: 160});
			$board.niceScroll({
				cursorcolor: "#58c9f3",
				cursorborder: "0px solid #fff",
				cursorborderradius: "0px",
				cursorwidth: "3px",
				autohidemode: true,
				horizrailenabled: false,
				nativeparentscrolling: true
			});

			/* ------------------- */
			/* --- bind events --- */

			$(window).resize(function(){
				var $window = $(this);
				var windowWidth = $window.width();
				if ($window.width() < 768){
					$board.width(windowWidth);
				    $board_controls.width(windowWidth);
				    $el.find('.hsplitbar').width(windowWidth);
				} else {
					$board.width('240px');
				    $board_controls.width('240px');
				    $el.find('.hsplitbar').width('240px');
				}
			});
			$('body').bind('rightsidebar.toggle', function(e){
				open = $el.hasClass('open-right-bar');
				if (open){
					$indicator.hide();
					playRefresh = true;
					playCheckUnread = false;
					if (opencnt === 0){
						reload();
					} else {
						if (hasNew){
							hasNew = false;
							refresh();
						} else {
							clear();
							reload();
						}
					}
					opencnt++;
				} else {
					playRefresh = false;
					playCheckUnread = true;
				}
			});
			$board_btn.click(function () {
				var body = $board_input.val();
				if (body) {
					post(body);
					$board_input.val("");
				}
			});
			$board_input.keyup(function (e) {
				if (e.which == 13) {
					$board_btn.click();
				}
			});

			/* --- bind events --- */
			/* ------------------- */

		    var addPost = function(post, isnew) {
		        var $new_post = $post.clone();
		        $new_post.find('.post-time').html(formatTime(post.Date));
		        $new_post.find('.post-user').html(post.UserName);
		        $new_post.find('.post-body').html(post.Body);
		        if (isnew) {
		            $new_post.addClass('new');
		        }
		        $board_messages.prepend($new_post);
		        $board.getNiceScroll().doScrollPos(0, 0);
		    };

		    var formatTime = function(date) {
		        return Asyst.date.format(date, 'dd.MM HH:mm', true);
		    };

		    var post = function (body) {
		        Asyst.protocol.send(
					"/asyst/api/board/",
					"POST",
					{ Body: body },
					true,
					function () { refresh(); },
					function () { },
					this
				);
		    };

		    var reload = function () {
		        Asyst.protocol.send("/asyst/api/board/", "GET", { top: 1, count: 50 }, true, function (data) {
		            var l = data.length;
		            for (var i in data) {
		                var post = data[l - i - 1];
		                addPost(post, false);
		                if (post.Id > maxPostId)
		                    maxPostId = post.Id;
		            }
		        }, function () { }, this);
		    };
						
		    var refresh = function () {
		        if (playRefresh) {
		            Asyst.protocol.send("/asyst/api/board/", "GET", { LastId: maxPostId }, true, function (data) {
		                var l = data.length;
		                for (var i in data) {
		                    var post = data[l - i - 1];
		                    addPost(post, true);
		                    if (post.Id > maxPostId)
		                        maxPostId = post.Id;
		                }
		                //console.log('refresh');
		            }, function () { }, this);
		        }
		    };

		    var clear = function () {
		        $board_messages.empty();
		        $indicator.hide();
		    };

			self.setIndicator(open_button);
			setInterval(refresh, 5 * 1000);
		};
	}

    if (typeof Asyst.board.checkUnread !== 'function') {
        Asyst.board.checkUnread = function (callback, error, context) {
            var result;

            var xhr = $.ajax({
                url: '/asyst/api/board',
                type: 'GET',
                async: true,
                cache: false,
                data: '{ "action" : "checkUnread"}',
                dataType: "json",
                processData: false,
                success: function (response) {
                    var result = "";
                    if (response || response == 0) {
                        result = response;
                        if (result && result.thisIsError == true) {
                            if (error)
                                error(result.message, result.info, context);
                            else if (!async)
                                throw { error: result.message, info: result.info, toString: function () { return result.message; }, context: context };

                            return;
                        }
                    }
                    if (callback)
                        callback(result, context);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var text = "";
                    if (jqXHR)
                        text = jqXHR.responseText;

                    if (error)
                        error(errorThrown, text, context);
                    else if (!async)
                        throw { error: errorThrown, info: text, toString: function () { return errorThrown; }, context: context };
                }
            });

            return xhr;
        };
    }

    if (typeof Asyst.board.setIndicator !== 'function') {
        Asyst.board.setIndicator = function (selector, callback) {
            var self = this;
            var $el = $(selector);
            $el.append($indicator);

            var check = function () {
				if (playCheckUnread){
					self.checkUnread(function (count) {
						if (isFinite(count))
							unreadCount = count;
						else
							unreadCount = 0;

						if (callback)
							callback(unreadCount, $indicator);
						else {
							if ($indicator.length > 0) {
								$indicator.hide();
								if (unreadCount > 0) {
									hasNew = true;
									$indicator.show();
									$indicator.text(unreadCount);
									$indicator.css({ "text-decoration": "blink" });
								}
							}
						}
					},
					function () {
					},
					self);
					//console.log('check unread');
					return true;
				}
            };

            check();
            setInterval(check, 5 * 1000);
        };
    }

} ());