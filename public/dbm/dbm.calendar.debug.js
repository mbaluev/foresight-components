(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'calendar', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        items: [],
                        columns: [],
                        events: {
                            render: false,
                            TitleColumn: 'date',
                            TooltipColumn: 'date',
                            maxItems: 3
                        },
                        renderEvents: false,
                        eventTitleColumn: 'date',
                        eventTooltipColumn: 'date',
                        onSelect: null,
                        onSelectAllowed: true,
                        useItemsLength: true
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._today = new Date();
                    that.data._datepicker = null;
                    that.data._selectedItems = [];
                    that.data._showModal = false;
                    that.data._el = {
                        target: self.addClass('calendar'),
                        calendar__container: $('<div class="calendar__container"></div>'),
                        card: $('<div class="card"></div>'),
                        card__header: $([
                            '<div class="card__header">',
                            '<div class="card__header-row">',
                            '<div class="card__header-column" id="name"></div>',
                            '<div class="card__header-column" id="actions"></div>',
                            '</div>',
                            '</div>'
                        ].join('')),
                        button_today: $([
                            '<button class="button" type="button" data-fc="button">',
                            '<span class="button__text">Сегодня</span>',
                            '</button>',
                        ].join('')),
                        card__name: $([
                            '<label class="card__name">',
                            '<span class="card__name-text card__name-text">' + that.data._today.getDate() + '</span>',
                            '</label>',
                        ].join('')),
                        card__count: $([
                            '<label class="card__name">',
                            '<span class="card__name-text">Событий: 3</span>',
                            '</label>',
                        ].join('')),
                        card__main: $('<div class="card__main card__main_flex-direction_column"></div>'),
                        calendar__row_top: $('<div class="calendar__row calendar__row_top"></div>'),
                        calendar__row_bottom: $('<div class="calendar__row calendar__row_bottom"></div>'),
                        calendar__datepicker: $('<div class="calendar__datepicker"></div>'),
                        calendar__table: $('<div class="calendar__table"></div>')
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.prepare_data = function(){
                        that.data.items.map(function(item){
                            for (var key in item){
                                if (item.hasOwnProperty(key)) {
                                    if (item[key] == 'null') {
                                        item[key] = '';
                                    }
                                }
                            }
                        });
                    };
                    that.render = function(){
                        that.data._el.card__header.find('#name').append(
                            that.data._el.card__name
                        );
                        that.data._el.card__header.find('#actions').append(
                            //that.data._el.card__count,
                            that.data._el.button_today
                        );
                        that.data._el.target.append(
                            that.data._el.calendar__container.append(
                                that.data._el.card.append(
                                    that.data._el.card__header,
                                    that.data._el.card__main.append(
                                        that.data._el.calendar__row_top.append(
                                            that.data._el.calendar__datepicker
                                        ),
                                        (that.data.columns.length > 0 ? that.data._el.calendar__row_bottom.append(
                                            that.data._el.calendar__table
                                        ) : null)
                                    )
                                )
                            )
                        );
                    };
                    that.render_datepicker = function(){
                        that.data._el.calendar__datepicker.datepicker({
                            onRenderCell: function (date, cellType) {
                                self.find('[data-tooltip]').tooltip();
                                self.find('[data-tooltip]').tooltip('hide');
                                if (date) {
                                    var currentDate = date.getDate(),
                                        items = that.data.items.filter(function(it){
                                            return it.date && typeof it.date == 'object';
                                        }).filter(function(it){
                                            return  it.date.getDate() == date.getDate() &&
                                                it.date.getMonth() == date.getMonth() &&
                                                it.date.getFullYear() == date.getFullYear();
                                        });
                                    if (cellType == 'day') {
                                        if (that.data.events.render) {
                                            return {
                                                html: [
                                                    '<div class="datepicker__day-container">',
                                                    '<div class="datepicker__day-border">',
                                                        '<div class="datepicker__day">' + currentDate + '</div>',
                                                        items.map(function(item, i){
                                                            return (i < that.data.events.maxItems ? [
                                                                '<div class="datepicker__event">',
                                                                    '<a class="datepicker__event-link link" href="' + item.url + '" target="_blank" onclick="event.cancelBubble = true; if(event.stopPropagation){ event.stopPropagation(); }" data-tooltip="' + item[that.data.events.TooltipColumn] + '">',
                                                                    '<div class="datepicker__indicator"><img src="/asyst/gantt/img/svg/' + item.indicator + '.svg"></div>',
                                                                    '<div class="datepicker__event-text" ',
                                                                    item.background ? 'style="background-color: ' + item.background + '; color: ' + item.color + '; border: none;"' : '',
                                                                    '>' + item[that.data.events.TitleColumn] + '</div>',
                                                                    '</a>',
                                                                '</div>'
                                                            ].join('') : '')
                                                        }).join(''),
                                                        '<div class="datepicker__more">',
                                                            (items.length - that.data.events.maxItems > 0 ? 'еще ' + (items.length - that.data.events.maxItems) : ''),
                                                        '</div>',
                                                    '</div>',
                                                    '</div>'
                                                ].join('')
                                            };
                                        } else {
                                            if (items.length > 0) {
                                                if (that.data.useItemsLength) {
                                                    return {
                                                        html: [
                                                            '<div class="datepicker__day">' + currentDate,
                                                            '<div class="datepicker__note">' + items.length,
                                                            '</div>',
                                                            '</div>'
                                                        ].join('')
                                                    }
                                                } else {
                                                    return {
                                                        html: [
                                                            '<a class="datepicker__day"',
                                                            (items[0]['url'] ? 'href="' + items[0]['url'] + '"' +
                                                            (items[0]['target'] ? 'target="' + items[0]['target'] + '"' : '') : ''),
                                                            '>' + currentDate,

                                                            '<div class="datepicker__note"',
                                                            (items[0]['background'] ?
                                                                ' style="background-color:' + items[0]['background'] + '"' : ''
                                                            ) + '>' + items[0]['count'],
                                                            '</div>',

                                                            '</a>'
                                                        ].join('')
                                                    }
                                                }
                                            }
                                            else {
                                                return {
                                                    html: '<div class="datepicker__day">' + currentDate + '</div>'
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            onSelect: function onSelect(formattedDate, date) {
                                self.find('[data-tooltip]').tooltip();
                                self.find('[data-tooltip]').tooltip('hide');
                                if (date) {
                                    that.data._selectedItems = that.data.items.filter(function(it){
                                        return it.date && typeof it.date == 'object';
                                    }).filter(function(it){
                                        return  it.date.getDate() == date.getDate() &&
                                            it.date.getMonth() == date.getMonth() &&
                                            it.date.getFullYear() == date.getFullYear();
                                    });
                                    that.data.date = date;
                                    that.data.formattedDate = formattedDate;
                                    that.data._el.card__name.find('.card__name-text').text(formattedDate);
                                    that.data._el.card__name.find('.card__name-text').text(formattedDate);
                                    if (that.data.events.render) {
                                        if (that.data._selectedItems.length > 0) {
                                            if (that.data._showModal) {
                                                that.render_modal();
                                            }
                                        }
                                    } else {
                                        that.data._el.calendar__table.empty().append(that.render_table());
                                        that.data._el.calendar__table.find('[data-tooltip]').tooltip();
                                    }
                                    if (typeof that.data.onSelect == 'function' && that.data.onSelectAllowed) {
                                        that.data.onSelect(formattedDate, date);
                                    }
                                }
                            }
                        });
                        if (that.data.events.render) {
                            that.data._el.calendar__row_bottom.remove();
                            that.data._el.calendar__datepicker.find('.datepicker--cells-days').addClass('datepicker__cells-days-border');
                        }
                        that.data._datepicker = that.data._el.calendar__datepicker.data().datepicker;
                        that.data._datepicker.selectDate(new Date(that.data._today.getFullYear(), that.data._today.getMonth(), that.data._today.getDate()));
                        that.data._showModal = true;
                    };
                    that.render_table = function(){
                        var $table = $('<table class="table"></table>'),
                            $thead = $('<thead></thead>'),
                            $tbody = $('<tbody></tbody>'),
                            $tr = $('<tr></tr>'),
                            $td = $('<td></td>');
                        $table.append(
                            $thead.append(
                                $tr.clone().append(
                                    that.data.columns.map(function(column){
                                        return $td.clone().html(column.title);
                                    })
                                )
                            ),
                            $tbody.append(
                                that.data._selectedItems.map(function(item){
                                    return $tr.clone().append(
                                        that.data.columns.map(function(column){
                                            return $td.clone().html(item[column.fieldname]);
                                        })
                                    )
                                })
                            )
                        );
                        return $table;
                    };
                    that.render_modal = function(){
                        var modal_options = {
                            buttons: [
                                {
                                    name: 'destroy',
                                    action: 'destroy',
                                    icon: 'icon_svg_close'
                                }
                            ],
                            header: {
                                caption: 'События',
                                name: that.data.formattedDate
                            },
                            content: { tabs: [] }
                        };
                        render_general_tab(data, modal_options.content.tabs, true);
                        $('<span class="modal__"></span>').appendTo('body').modal__(modal_options);
                        function render_general_tab(data, tabs, active){
                            tabs.push({
                                id: 'general',
                                name: '',
                                active: active,
                                content: $('<div class="card__table"></div>').append(that.render_table())
                            });
                        };
                    };

                    that.bind = function(){
                        that.data._el.button_today.on('click', function(){
                            //that.data._showModal = false;
                            that.data._datepicker.selectDate(new Date(that.data._today.getFullYear(), that.data._today.getMonth(), that.data._today.getDate()));
                            //that.data._showModal = true;
                        });
                    };
                    that.select_date = function(date){
                        that.data._datepicker.selectDate(date);
                    };
                    that.set_date = function(date){
                        that.data.onSelectAllowed = false;
                        that.data._datepicker.selectDate(date);
                        that.data.onSelectAllowed = true;
                    };

                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                    };
                    that.init = function(){
                        that.prepare_data();
                        that.render();
                        that.render_datepicker();
                        that.init_components();
                        that.bind();
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
        select_date : function(date) {
            return this.each(function() {
                this.obj.select_date(date);
            });
        },
        set_date : function(date) {
            return this.each(function() {
                this.obj.set_date(date);
            });
        }
    };
    $.fn.calendar = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.calendar' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="calendar"]').calendar();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'button', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        disabled: false,
                        checked: false,
                        hidden: false,
                        width: 'auto',
                        popup_animation: true
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._handlers = null;
                    that.data._el = {
                        popup: $('<div class="popup"></div>')
                    };

                    that.destroy = function(){
                        if (that.data._el.popup.data('_widget')) {
                            that.data._el.popup.popup('destroy');
                        }
                        self.removeData();
                        self.remove();
                    };
                    that.disable = function(){
                        self.removeClass('button_hovered');
                        self.removeClass('button_clicked_out');
                        self.addClass('button_disabled');
                        //save handlers and unbind events
                        if ($._data(self[0], "events")) {
                            that.data._handlers = {};
                            for (var type in $._data(self[0], "events")) {
                                that.data._handlers[type] = $._data(self[0], "events")[type].slice(0);
                            }
                            self.off();
                        }
                        that.data.disabled = true;
                    };
                    that.enable = function(){
                        self.removeClass('button_clicked_out');
                        self.removeClass('button_disabled');
                        //bind disabled handlers
                        if (that.data._handlers) {
                            for (var type in that.data._handlers) {
                                that.data._handlers[type].forEach(function(ev){
                                    self.on(ev.type + '.' + ev.namespace, ev.handler);
                                });
                            }
                        }
                        that.data._handlers = null;
                        that.data.disabled = false;
                    };
                    that.hide = function(){
                        self.removeClass('button_clicked_out');
                        self.addClass('button_hidden');
                        that.data.hidden = true;
                    };
                    that.show = function(){
                        self.removeClass('button_clicked_out');
                        self.removeClass('button_hidden');
                        that.data.hidden = false;
                    };

                    that.check = function(){
                        self.addClass('button_checked');
                        self.attr('data-checked', 'true');
                        that.data.checked = true;
                    };
                    that.uncheck = function(){
                        self.removeClass('button_checked');
                        self.attr('data-checked', 'false');
                        that.data.checked = false;
                    };

                    that.hover = function(){
                        self.addClass('button_hovered');
                    };
                    that.unhover = function(){
                        self.removeClass('button_hovered');
                    };
                    that.click = function(){
                        self.addClass('button_clicked');
                        self.removeClass('button_clicked_out');
                        $('body').one('mouseup.button.private touchend.button.private', that.unclick);
                    };
                    that.unclick = function(){
                        self.addClass('button_clicked_out');
                        self.removeClass('button_clicked');
                    };

                    that.set_width = function(value){
                        self.css('width', value);
                    };
                    that.set_text = function(value){
                        self.find('.button__text').text(value);
                    };

                    that.bind = function(){
                        //bind private events
                        self.on('mouseover.button.private', that.hover);
                        self.on('mouseout.button.private', that.unhover);
                        self.on('mousedown.button.private touchstart.button.private', that.click);
                        //bind trigger events
                        if (that.data.trigger) {
                            self.on('click.button.trigger', function(e){
                                e.preventDefault();
                                self.find('.' + that.data.triggercontainer).trigger(that.data.trigger);
                            });
                        }
                    };
                    that.bind_checkbox = function(){
                        self.bindFirst('click.button.check', null, null, function(e){
                            e.preventDefault();
                            if (that.data.checked) {
                                that.uncheck();
                            } else {
                                that.check();
                            }
                        });
                    };
                    that.bind_radio = function(){
                        self.bindFirst('click.button.radio', null, null, function(e){
                            e.preventDefault();
                            if (!that.data.checked) {
                                that.check();
                            }
                        });
                    };

                    that.init_components = function(){
                        if (that.data.toggle == "popup") {
                            that.data._el.popup = $(that.data.target);
                            that.data._el.popup.popup({
                                source: self,
                                animation: that.data.popup_animation
                            });
                        }
                    };
                    that.init = function() {
                        that.set_width(that.data.width);
                        that.init_components();
                        that.bind();
                        if (self.hasClass('button_toggable_check')) {
                            that.data['_widget']['type'] = 'button.checkbox';
                            that.init_check();
                            that.bind_checkbox();
                        }
                        if (self.hasClass('button_toggable_radio')) {
                            that.data['_widget']['type'] = 'button.radio';
                            that.init_check();
                            that.bind_radio();
                        }
                        if (that.data.disabled) {
                            that.disable();
                        } else {
                            that.enable();
                        }
                        if (that.data.hidden) {
                            that.hide();
                        } else {
                            that.show();
                        }
                        that.set_width(that.data.width);
                    };
                    that.init_check = function(){
                        if (that.data.checked) {
                            that.check();
                        } else {
                            that.uncheck();
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
        },
        disable : function() {
            return this.each(function() {
                this.obj.disable();
            });
        },
        enable : function() {
            return this.each(function() {
                this.obj.enable();
            });
        },
        unhover : function() {
            return this.each(function() {
                this.obj.unhover();
            });
        },
        hover : function() {
            return this.each(function() {
                this.obj.hover();
            });
        },
        hide : function() {
            return this.each(function() {
                this.obj.hide();
            });
        },
        show : function() {
            return this.each(function() {
                this.obj.show();
            });
        },
        set_width : function(value) {
            return this.each(function() {
                this.obj.set_width(value);
            });
        },
        set_text : function(value) {
            return this.each(function() {
                this.obj.set_text(value);
            });
        },
        check : function() {
            return this.each(function() {
                this.obj.check();
            });
        },
        uncheck : function() {
            return this.each(function() {
                this.obj.uncheck();
            });
        }
    };
    $.fn.button = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.button' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="button"]').button();
});
(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'card', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        hiddenLeft: false,
                        hiddenRight: false
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);
                    that.data._el = {
                        button_toggle_left: self.closestChild('[data-toggle="left"]'),
                        button_toggle_right: self.closestChild('[data-toggle="right"]'),
                        card__main: self.closestChild('.card__main'),
                        card__left: self.closestChild('.card__left'),
                        card__right: self.closestChild('.card__right'),
                        card__backdrop: self.closestChild('.card__backdrop')
                    };

                    that.destroy = function(){
                        self.removeData();
                    };

                    that.hide_left = function(){
                        that.data._el.button_toggle_left.find('.icon').toggleClass('icon_rotate_180deg');
                        that.data._el.card__left.addClass('card__left_hidden');
                        that.data._el.card__backdrop.remove();
                        $(window).trigger('resize');
                    };
                    that.hide_right = function(){
                        that.data._el.button_toggle_right.find('.icon').toggleClass('icon_rotate_180deg');
                        that.data._el.card__right.addClass('card__right_hidden');
                        that.data._el.card__backdrop.remove();
                        $(window).trigger('resize');
                    };

                    that.show_left = function(){
                        that.data._el.button_toggle_left.find('.icon').toggleClass('icon_rotate_180deg');
                        that.data._el.card__left.removeClass('card__left_hidden');
                        that.data._el.card__main.append(
                            that.data._el.card__backdrop.one('click', function(){
                                that.hide_left();
                                that.hide_right();
                            })
                        );
                        $(window).trigger('resize');
                    };
                    that.show_right = function(){
                        that.data._el.button_toggle_right.find('.icon').toggleClass('icon_rotate_180deg');
                        that.data._el.card__right.removeClass('card__right_hidden');
                        that.data._el.card__main.append(
                            that.data._el.card__backdrop.one('click', function(){
                                that.hide_left();
                                that.hide_right();
                            })
                        );
                        $(window).trigger('resize');
                    };

                    that.toggle_left = function(){
                        if (that.data._el.card__left.hasClass('card__left_hidden')) {
                            that.show_left();
                        } else {
                            that.hide_left();
                        }
                    };
                    that.toggle_right = function(){
                        if (that.data._el.card__right.hasClass('card__right_hidden')) {
                            that.show_right();
                        } else {
                            that.hide_right();
                        }
                    };

                    that.bind = function(){
                        if (that.data._el.button_toggle_left) {
                            if (that.data._el.button_toggle_left.length > 0) {
                                that.data._el.button_toggle_left.on('click', function(){
                                    that.toggle_left();
                                });
                            }
                        }
                        if (that.data._el.button_toggle_right) {
                            if (that.data._el.button_toggle_right.length > 0) {
                                that.data._el.button_toggle_right.on('click', function(){
                                    that.toggle_right();
                                });
                            }
                        }
                    };

                    that.init_components = function(){
                        if (that.data._el.card__backdrop.length == 0) {
                            that.data._el.card__backdrop = $('<div class="card__backdrop">');
                        }
                        if (that.data._el.button_toggle_left) {
                            if (that.data._el.button_toggle_left.length > 0) {
                                that.data._el.button_toggle_left.button();
                                if (that.data.hiddenLeft) {
                                    that.hide_left();
                                } else {
                                    that.show_left();
                                }
                                setTimeout(function(){
                                    that.data._el.button_toggle_left.find('.icon').addClass('icon_animate');
                                }, 500);
                            }
                        }
                        if (that.data._el.button_toggle_right) {
                            if (that.data._el.button_toggle_right.length > 0) {
                                that.data._el.button_toggle_right.button();
                                if (that.data.hiddenRight) {
                                    that.hide_right();
                                } else {
                                    that.show_right();
                                }
                                setTimeout(function(){
                                    that.data._el.button_toggle_right.find('.icon').addClass('icon_animate');
                                }, 500);
                            }
                        }
                    };
                    that.init = function(){
                        that.init_components();
                        that.bind();
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
    $.fn.card = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.card' );
        }
    };
})( jQuery );
$(function(){
    $('[data-fc="card"]').card();
});