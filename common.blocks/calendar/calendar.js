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
                        eventTooltipColumn: 'date'
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
                                        that.data._el.calendar__row_bottom.append(
                                            that.data._el.calendar__table
                                        )
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
                                                return {
                                                    html: [
                                                        '<div class="datepicker__day">' + currentDate,
                                                        '<div class="datepicker__note">' + items.length + '</div>',
                                                        '</div>'
                                                    ].join('')
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