var CalendarEvent = function(options){
    var that = this._calendar_event = {};
    that.data = {
        containerid: '',
        events: [],
        title: 'Календарь',
        api: {
            new: function(){},
            click: function(){},
            update: function(){},
            delete: function(){}
        }
    };
    that.data = $.extend(true, {}, that.data, options);
    that.data._el = {
        target: $('#' + that.data.containerid).css({
            width: '100%',
            height: '100%',
            display: 'flex'
        }),
        card: $([
            '<div class="card">',
            '<div class="card__header" style="border:none;">',
            '<div class="card__header-row">',
            '<div class="card__header-column card__header-column_start" id="ce__name"></div>',
            '<div class="card__header-column" id="ce__actions"></div>',
            '</div>',
            '</div>',
            '<div class="card__main">',
            '<div class="card__left" style="border-top: solid 1px #474c63;">',
            '<div class="menu menu_color_light">',
            '<div class="menu__calendar"></div>',
            '</div>',
            '</div>',
            '<div class="card__middle">',
            '<div class="calendar_dark" id="ce__view">',
            '</div>',
            '</div>',
            '</div>'
        ].join('')),
        card__name: $([
            '<label class="card__name">',
            '<span class="card__name-text">' + that.data.title + '</span>',
            '</label>'
        ].join('')),
        card__date: $([
            '<label class="card__name">',
            '<span class="card__name-text"></span>',
            '</label>'
        ].join('')),
        button_toggle_left: $([
            '<button class="button" type="button" data-fc="button" data-toggle="left">',
            '<span class="icon icon_svg_double_right"></span>',
            '</button>'
        ].join('')),
        button_nav: $('<span class="button-group" data-fc="button-group"></span>'),
        button_today: $([
            '<button class="button" type="button" data-fc="button">',
            '<span class="button__text">Сегодня</span>',
            '</button>'
        ].join('')),
        button_prev: $([
            '<button class="button" type="button" data-fc="button">',
            '<span class="icon icon_svg_left"></span>',
            '</button>'
        ].join('')),
        button_next: $([
            '<button class="button" type="button" data-fc="button">',
            '<span class="icon icon_svg_right"></span>',
            '</button>'
        ].join('')),
        select_view: $([
            '<select class="select" data-fc="select">',
            '<option value="month" selected>Месяц</option>',
            '<option value="agendaWeek">Неделя</option>',
            '<option value="agendaDay">День</option>',
            '<option value="listWeek">Повестка дня</option>',
            '</select>'
        ].join('')),
        radio_group: $([
            '<span class="radio-group radio-group_type_button" data-fc="radio-group">',
            '<label class="radio radio_type_button" data-fc="radio">',
            '<button class="button button_toggable_radio" type="button" data-fc="button">',
            '<span class="button__text">Месяц</span>',
            '</button>',
            '<input class="radio__input" type="radio" name="radio-group-button" value="month" hidden="">',
            '</label>',
            '<label class="radio radio_type_button" data-fc="radio">',
            '<button class="button button_toggable_radio" type="button" data-fc="button">',
            '<span class="button__text">Неделя</span>',
            '</button>',
            '<input class="radio__input" type="radio" name="radio-group-button" value="agendaWeek" hidden="">',
            '</label>',
            '<label class="radio radio_type_button" data-fc="radio">',
            '<button class="button button_toggable_radio" type="button" data-fc="button">',
            '<span class="button__text">День</span>',
            '</button>',
            '<input class="radio__input" type="radio" name="radio-group-button" value="agendaDay" hidden="">',
            '</label>',
            '<label class="radio radio_type_button" data-fc="radio">',
            '<button class="button button_toggable_radio" type="button" data-fc="button">',
            '<span class="button__text">Повестка недели</span>',
            '</button>',
            '<input class="radio__input" type="radio" name="radio-group-button" value="listWeek" hidden="">',
            '</label>',
            '</span>'
        ].join('')),
        menu_calendar: $('<div id="ce__menu_calendar"></div>'),
        loader: $('<span class="spinner spinner_align_center"></span>')
    };
    that.data._today = new Date();
    that.data._menu_calendar = null;
    that.data._full_calendar = null;
    that.data._current = {
        view: null,
        date: null,
        day: null,
        month: null,
        year: null
    };

    that.render = function(){
        that.data._el.target.append(
            that.data._el.card
        );
        that.render_header();
    };
    that.render_header = function(){
        that.data._el.card__name.find('.card__name-text').text(that.data.title);
        that.data._el.card.find('#ce__name').append(
            that.data._el.button_toggle_left,
            that.data._el.card__name
        );
        that.data._el.card.find('#ce__actions').append(
            that.data._el.card__date,
            that.data._el.button_nav.append(
                that.data._el.button_prev,
                that.data._el.button_today,
                that.data._el.button_next
            ),
            that.data._el.radio_group
        );
    };
    that.render_card_date = function(date){
        var formattedDate = '';
        if (typeof Asyst != 'undefined') {
            if (Asyst.date) {
                if (typeof Asyst.date.convertToGenitive == 'function') {
                    formattedDate = Asyst.date.convertToGenitive(Asyst.date.format(date, 'dd MMMM yyyy').toLowerCase());
                }
            }
        } else {
            formattedDate = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
        }
        that.data._el.card__date.find('.card__name-text').text(formattedDate);
    };

    that.mc_render = function(){
        that.data._el.card.find('.menu__calendar').append(that.data._el.menu_calendar);
        that.data._el.menu_calendar.css({
            'overflow-x': 'auto',
            'border-bottom': 'solid 1px #eee;'
        });
        that.data._menu_calendar = that.data._el.menu_calendar.calendar({
            initDate: that.data._today,
            items: that.data.events,
            header: { render: false },
            onSelect: function(formattedDate, date){
                that.fc_set_date(date);
            }
        });
    };
    that.mc_select = function(date){
        that.data._menu_calendar.data('_datepicker').selectDate(date._d);
    };
    that.mc_update = function(items){
        that.data._menu_calendar.data('initDate', that.data._current.date);
        that.data._menu_calendar.calendar('update', items);
    };

    that.fc_render = function(){
        that.data._full_calendar = that.data._el.card.find('#ce__view').fullCalendar({
            locale: 'ru',
            header: false,
            defaultDate: null,
            editable: true,
            navLinks: true, // can click day/week names to navigate views
            eventLimit: true, // allow "more" link when too many events
            events: that.data.events,
            viewRender: function(view, element) {
                that.fc_set_title(view.title);
                that.data._current.view = view;
            },
            navLinkDayClick: function(date, jsEvent){
                that.mc_select(date._d);
                that.data._el.radio_group.radio_group('check', 'agendaDay');
                that.data._full_calendar.fullCalendar('changeView', 'agendaDay')
            },
            navLinkWeekClick: function(weekStart, jsEvent){
                that.data._el.radio_group.radio_group('check', 'agendaWeek');
                that.data._full_calendar.fullCalendar('changeView', 'agendaWeek')
            },
            eventRender: function(event, element) {
                if (event.background) {
                    element.css({
                        'background': event.background,
                        'border-color': event.background
                    });
                }
            },
            eventClick: function(event, jsEvent, view) {
                that.data.api.click(event, function(event){

                });
                //console.log('Event: ' + calEvent.title);
                //console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                //console.log('View: ' + view.name);
            },
            eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
                that.data.api.update(event, function(event){
                    that.data.events.map(function(d){
                        if (d.id == event.id) {
                            d = event;
                        }
                    });
                    that.mc_update(that.data.events);
                });
                //console.log(event.title + " end is now " + event.end.format());
                //revertFunc();
            },
            eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
                that.data.api.update(event, function(event){
                    that.data.events = that.data.events.map(function(d){
                        if (d.id == event.id) {
                            return event;
                        } else {
                            return d;
                        }
                    });
                    that.mc_update(that.data.events);
                });
                //console.log(event.title + " was dropped on " + event.start.format());
                //revertFunc();
            },
            dayClick: function(date, jsEvent, view) {
                //console.log('Clicked on: ' + date.format());
                //console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                //console.log('Current view: ' + view.name);
                that.data.api.new(date, function(event){
                    that.data.events.push(event);
                    that.data._full_calendar.fullCalendar('renderEvent', event, true);
                    that.mc_update(that.data.events);
                });
            }
        });
    };
    that.fc_set_date = function(date){
        that.data._current.date = date;
        that.data._current.day = date.getDate();
        that.data._current.month = date.getMonth();
        that.data._current.year = date.getFullYear();
        if (that.data._full_calendar) {
            that.data._full_calendar.fullCalendar('gotoDate', date);
        }
    };
    that.fc_set_size = function(){
        var fc = that.data._el.card.find('#ce__view');
        that.data._full_calendar.fullCalendar('option', 'height', fc.height());
    };
    that.fc_set_title = function(title){
        that.data._el.card__date.find('.card__name-text').text(title);
    };

    that.loader_add = function(){
        that.data._el.target.before(that.data._el.loader)
    };
    that.loader_remove = function(){
        that.data._el.loader.remove();
    };

    that.prepare = function(){
        that.data.events.map(function(d){
            d.name = d.title;
            d.date = moment(d.start, "YYYY-MM-DD");
            d.date = d.date._d;
        })
    };
    that.bind = function(){
        that.data._el.button_today.on('click', function(){
            that.mc_select(that.data._today);
        });
        that.data._el.button_prev.on('click', function(){
            that.data._full_calendar.fullCalendar('prev');
            that.mc_select(that.data._current.view.dateProfile.date._d);
        });
        that.data._el.button_next.on('click', function(){
            that.data._full_calendar.fullCalendar('next');
            that.mc_select(that.data._current.view.dateProfile.date._d);
        });
        that.data._el.select_view.on('change', function(){
            var view = $(this).val();
            that.data._full_calendar.fullCalendar('changeView', view)
        });
        that.data._el.radio_group.on('click', function(){
            var view = $(this).radio_group('value');
            that.data._full_calendar.fullCalendar('changeView', view)
        });
        $(window).resize(function(){
            that.fc_set_size();
        });
    };
    that.init_components = function(){
        that.data._el.card.card();
        that.data._el.button_toggle_left.button();
        that.data._el.button_today.button();
        that.data._el.button_prev.button();
        that.data._el.button_next.button();
        that.data._el.select_view.select({
            width: '200',
            popup_width: 'auto',
            mode: 'radio',
            autoclose: true
        });
        that.data._el.radio_group.radio_group();
        that.data._el.radio_group.radio_group('check', 'month');
    };
    that.init = function(){
        that.loader_add();
        setTimeout(function(){
            that.prepare();
            that.render();
            that.mc_render();
            that.fc_render();
            that.fc_set_size();
            that.init_components();
            that.bind();
            that.loader_remove();
        }, 100);
    };
    that.init();
    return that;
};
