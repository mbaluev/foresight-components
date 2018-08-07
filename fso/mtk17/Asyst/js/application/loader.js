Loader = {};

Loader.show = function (container, text) {

    if (!Loader.count)
        Loader.count = 1;
    else {
        Loader.count++;
    }

    if (!text)
        text = Globa.Loading.locale();

    if (!Loader.indicator)
        Loader.indicator = $("<span class='loader-indicator'><label>" + text + "</label></span>").appendTo(document.body);
    else
        Loader.indicator.children('label').text(text);

    var c;
    if (container)
        c = $(container);
    else
        c = $('body');

    var w = 940; var h = 600; var x = 0; var y = 0;
    if (c) {
        try {

            var pos = c.position();
            if (pos) {
                x = pos.left;
                y = pos.top;
            }
            w = c.width();
            if (w === 0) w = $(window).width();

            h = c.height();
            if (h === 0) h = $(window).height();
        } catch (error) {
            void (0);
        }
    }

    Loader.indicator
        .css("position", "absolute")
        .css("top", y + h / 2 - Loader.indicator.height() / 2)
        .css("left", x + w / 2 - Loader.indicator.width() / 2);

    Loader.indicator.show();
};

Loader.hide = function(force) {
    if (Loader.indicator) {
        if (Loader.count && Loader.count > 0)
            Loader.count--;

        if (force || !Loader.count || Loader.count === 0) {
            Loader.indicator.fadeOut();
            Loader.count = 0;
        }
    }
};
