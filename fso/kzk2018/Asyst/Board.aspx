<%@ Page Title="" Language="C#" MasterPageFile="~/Fluid.Master" AutoEventWireup="true" CodeBehind="Board.aspx.cs" Inherits="PRIZ.BoardForm" EnableSessionState="false"%>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    
<style>
    body, html { height: 100%; }
    body { 
	    padding:0px;
        background-color: #32323a; 
    }

    #board {
	    background-color: #32323a;
    }
    #board-messages {
	    margin-top: 160px;
	    background-color: transparent;
	    padding: 0px;
	    overflow: auto;
	    height: 100% !important;
	    border: none;
	    -webkit-border-radius: 0px;
	    -moz-border-radius: 0px;
	    border-radius: 0px;
	    -webkit-box-shadow: none;
	    -moz-box-shadow: none;
	    box-shadow: none;
    }
    .post {
	    padding: 20px;
	    display: table;
	    border-bottom: none;
	    border-top: 1px solid rgba(255,255,255,0.05);
	    width: 100%;
	    box-sizing: border-box;
	    color: #fff;
    }
    .post:hover {
	    background: #28282e;
	    -webkit-transition: all 0.3s ease;
	    -moz-transition: all 0.3s ease;
	    -o-transition: all 0.3s ease;
	    -ms-transition: all 0.3s ease;
	    transition: all 0.3s ease;
    }
    .post-head {
	    color: #aeb2b7;
	    width: 100%;
	    float: none;
    }
    .post-head:after {
	    clear:both;
    }
    .post-time {
	    display: block;
	    margin-right: 0px;
	    float: right;
	    width: 70px;
	    text-align: right;
    }
    .post-user {
	    display: block;
	    line-height: 15px;
    }
    .post-body {
	    margin-left: 0px;
	    margin-top: 10px;
	    font-size: 12px;
    }

    #board-controls {
	    padding: 0px;
	    box-sizing: border-box;
	    width: 100%;
	    margin-top: 0;
	    position: fixed;
	    top: 0px;
	    background-color: #58c9f3;
	    height: 160px;
    }


    #board-controls table { width: 100%; }
    #board-controls table tr {
	    display: block;
    }
    #board-controls table tr td {
	    padding: 0 !important;
	    vertical-align: middle;
	    text-align: right;
	    width: 100%;
    }
    #board-controls table tr td:first-child {
	    padding-right: 20px;
    }
    #board-controls #post-editor {
	    box-sizing: border-box;
	    height: 160px;
	    width: 100%;
	    margin: 0;
	    border: none;
	    padding: 24px 72px 20px 20px;
	    border-radius: 0px;
    }
    #board-controls #post-editor,
    #board-controls #post-editor:focus {
	    outline: none;
    }
    #board-controls .btn-primary {
	    position: absolute;
	    top: 0px;
	    right: 0px;
	    margin: 24px 20px;
	    box-shadow: none;
	    margin-left: 15px;
	    background-color: #58c9f3;
	    background-image: none;
	    border: none !important;
	    text-shadow: none;
	    padding: 13px;
	    width: 32px;
	    height: 32px;
	    box-sizing: border-box;
	    border-radius: 100px;
	    -webkit-border-radius: 100px;
	    background-image: url('/asyst/img/img_send.png');
	    background-color: #3cd79a;
	    background-repeat: no-repeat;
	    background-position: center center;
    }
    #board-controls .btn-primary:hover {
	    opacity: .95;
    }
</style>
    

<script type="text/javascript">
    var board = {};

    board.run = function (selector) {
        var $board = $(selector);

        if ($board.length == 0)
            return;

        var $button = $board.find('#post-button');
        var $editor = $board.find('#post-editor')
        var $messages = $board.find('#board-messages')

        $button.click(function () {
            var body = $editor.val();
            if (body) {
                post(body);
                $editor.val("");
            }
        });

        $editor.keyup(function (e) {
            if(activeOnPaste != null){
                $(activeOnPaste).focus();
                activeOnPaste = null;
            }
            if (e.which == 17) {
                var body = $editor.val();
                if (body) {
                    post(body);
                    $editor.val("");
                }
            }
        });

        var post = function (body) {
            Asyst.protocol.send("/asyst/api/board/", "POST", { Body: body }, true, function () {
                refresh();
            }, function () { }, this);
        }

        function addPost(post) {
            $messages.prepend('<div class="post"><div class="post-head"><div class="post-time">' + formatTime(post.Date) + '</div><div class="post-user">' + post.UserName + '</div></div><div class="post-body">' + post.Body + '</div></div>');
        }

        var refresh = function () {
            var maxPostId = $messages.data("LastId");

            Asyst.protocol.send("/asyst/api/board/", "GET", { LastId: maxPostId }, true, function (data) {
                var hasNew = false;
                for (var i in data) {
                    var post = data[i];
                    addPost(post);
                    if (post.Id > maxPostId)
                        maxPostId = post.Id;
                    hasNew = true;
                }
                $messages.data("LastId", maxPostId);
                if (hasNew)
                    $messages[0].scrollTop = $messages[0].scrollHeight;

                if (Asyst.board && typeof Asyst.board.checkUnread === 'function') {
                    Asyst.board.checkUnread();
                }

            }, function () { }, this);
        }

        var formatTime = function (date) {
            return Asyst.date.format(date, 'dd.MM HH:mm', true);
        }

        var reload = function () {

            $messages.empty();

            var maxPostId = 0;
            Asyst.protocol.send("/asyst/api/board/", "GET", { top: 1, count: 50 }, true, function (data) {
                for (var i in data) {
                    var post = data[i];
                    addPost(post);
                    if (post.Id > maxPostId)
                        maxPostId = post.Id;
                }
                $messages.data("LastId", maxPostId);
                $messages[0].scrollTop = $messages[0].scrollHeight;
            }, function () { }, this);
        }

        reload();

        function doRefresh() {
            refresh();

            setTimeout(doRefresh, 5 * 1000);
        }

        setTimeout(doRefresh, 5 * 1000);
    }

    $(document).ready(function () {
        board.run('#board');
        $('#board #board-messages').css({ 'height': (window.innerHeight - 150) + 'px' });
        $(window).resize(function () {
            $('#board #board-messages').css({ 'height': (window.innerHeight - 150) + 'px' });
        });
        var activeOnPaste = null;
	$('#post-button').keydown(function(e){
		var code = e.which || e.keyCode;
        	if((e.ctrlKey && code == 86) || (e.shiftKey && code == 45)){
            		activeOnPaste = $(this);
            		$('#post-editor').focus(); }
        });
    });
</script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <% Response.Write(Body); %>
</asp:Content>

