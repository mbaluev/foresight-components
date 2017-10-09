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
                            '<span class="card__name-text card__name-text_no-margin">' + that.data._today.getDate() + '</span>',
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
                                var currentDate = date.getDate(),
                                    items = that.data.items.filter(function(it){
                                        return typeof it.date == 'object';
                                    }).filter(function(it){
                                        return  it.date.getDate() == date.getDate() &&
                                                it.date.getMonth() == date.getMonth() &&
                                                it.date.getFullYear() == date.getFullYear();
                                    });
                                if (cellType == 'day') {
                                    if (items.length > 0) {
                                        if (that.data.renderEvents) {
                                            return {
                                                html: [
                                                    '<div class="datepicker__day">' + currentDate + '</div>',
                                                    items.map(function(item){
                                                        return [
                                                            '<div class="datepicker__event">',
                                                                '<a class="datepicker__event-link link" href="#" data-tooltip="' + item[that.data.eventTooltipColumn] + '">',
                                                                    '<div class="datepicker__indicator"><img src="/asyst/gantt/img/svg/' + item.indicator + '.svg"></div>',
                                                                    '<div class="datepicker__event-text" style="background-color: ' + item.background + '; color: ' + item.color + '; border: none;">' + item[that.data.eventTitleColumn] + '</div>',
                                                                '</a>',
                                                            '</div>'
                                                        ].join('')
                                                    }).join('')
                                                ].join('')
                                            };
                                        } else {
                                            return {
                                                html: [
                                                    '<div class="datepicker__day">' + currentDate,
                                                    '<div class="datepicker__note">' + items.length + '</div>',
                                                    '</div>'
                                                ].join('')
                                            }
                                        }
                                    } else {
                                        return {
                                            html: '<div class="datepicker__day">' + currentDate + '</div>'
                                        }
                                    }
                                }
                            },
                            onSelect: function onSelect(formattedDate, date) {
                                self.find('[data-tooltip]').tooltip();
                                self.find('[data-tooltip]').tooltip('hide');
                                if (date) {
                                    that.data._selectedItems = that.data.items.filter(function(it){
                                        return typeof it.date == 'object';
                                    }).filter(function(it){
                                        return  it.date.getDate() == date.getDate() &&
                                            it.date.getMonth() == date.getMonth() &&
                                            it.date.getFullYear() == date.getFullYear();
                                    });
                                    that.data.date = date;
                                    that.data.formattedDate = formattedDate;
                                    that.data._el.card__name.find('.card__name-text').text(formattedDate);
                                    that.data._el.card__name.find('.card__name-text').text(formattedDate);
                                    that.render_table();
                                }
                            }
                        });
                        that.data._datepicker = that.data._el.calendar__datepicker.data().datepicker;
                        that.data._datepicker.selectDate(new Date(that.data._today.getFullYear(), that.data._today.getMonth(), that.data._today.getDate()));
                    };
                    that.render_table = function(){
                        var $table = $('<table class="table"></table>'),
                            $thead = $('<thead></thead>'),
                            $tbody = $('<tbody></tbody>'),
                            $tr = $('<tr></tr>'),
                            $td = $('<td></td>');
                        that.data._el.calendar__table.empty().append(
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
                            )
                        );
                        that.data._el.calendar__table.find('[data-tooltip]').tooltip();
                    };

                    that.bind = function(){
                        that.data._el.button_today.on('click', function(){
                            that.data._datepicker.selectDate(new Date(that.data._today.getFullYear(), that.data._today.getMonth(), that.data._today.getDate()));
                        });
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