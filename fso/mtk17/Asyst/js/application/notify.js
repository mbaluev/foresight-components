function Notify(title, text, image, time, sticky) {

    $.gritter.add({
        title: title,
        text: text,
        image: image,
        sticky: sticky,
        time: time
    });

    return false;

}

function NotifyError(title, text, time, sticky) {
    if (sticky == undefined)
        sticky = true;
    Notify(title, text, '/asyst/img/notify-icon-error.png', time, sticky);
}

function NotifyInfo(title, text, time, sticky) {
    if (sticky == undefined)
        sticky = true;
    $.extend($.gritter.options, { position: 'bottom-right' });
    Notify(title, text, '/asyst/img/chat-mail.png', time, sticky);
    $.extend($.gritter.options, { position: 'top-right' });
}