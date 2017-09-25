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
                        columns: []
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._today = new Date();
                    that.data._datepicker = null;
                    that.data._selectedItems = [];
                    that.data._el = {
                        input: $('<input type="hidden">'),
                        calendar__row_top: $('<div class="calendar__row calendar__row_top"></div>'),
                        calendar__row_bottom: $('<div class="calendar__row calnder__row_bottom"></div>'),
                        calendar__info: $([
                            '<div class="calendar__info">',
                                '<div class="calendar__info-day">' + that.data._today.getDate() + '</div>',
                                '<div class="calendar__info-date">Среда, Июнь 2017</div>',
                                '<div class="calendar__info-count">6 событий</div>',
                                '<button class="button" type="button" data-fc="button">',
                                    '<span class="button__text">Сегодня</span>',
                                '</button>',
                            '</div>'
                        ].join('')),
                        calendar__datepicker: $('<div class="calendar__datepicker"></div>'),
                        calendar__table: $('<div class="calendar__table"></div>')
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };

                    that.render = function(){
                        self.append(
                            that.data._el.calendar__row_top.append(
                                that.data._el.calendar__info,
                                that.data._el.calendar__datepicker
                            ),
                            that.data._el.calendar__row_bottom.append(
                                that.data._el.calendar__table
                            )
                        );
                    };
                    that.render_datepicker = function(){
                        that.data._el.calendar__datepicker.datepicker({
                            onRenderCell: function (date, cellType) {
                                var currentDate = date.getDate(),
                                    items = that.data.items.filter(function(it){
                                    return  it.date.getDate() == date.getDate() &&
                                            it.date.getMonth() == date.getMonth() &&
                                            it.date.getFullYear() == date.getFullYear();
                                });
                                if (cellType == 'day' && items.length > 0) {
                                    return {
                                        html: currentDate + '<span class="datepicker__note">' + items.length + '</span>'
                                    }
                                }
                            },
                            onSelect: function onSelect(formattedDate, date) {
                                that.data._selectedItems = that.data.items.filter(function(it){
                                    return  it.date.getDate() == date.getDate() &&
                                        it.date.getMonth() == date.getMonth() &&
                                        it.date.getFullYear() == date.getFullYear();
                                });
                                that.data.date = date;
                                that.data.formattedDate = formattedDate;
                                that.data._el.calendar__info.find('.calendar__info-day').text(date.getDate());
                                that.data._el.calendar__info.find('.calendar__info-date').text(formattedDate);
                                that.data._el.calendar__info.find('.calendar__info-count').text('Событий: ' + that.data._selectedItems.length);
                                that.render_table();
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
                    };

                    that.bind = function(){
                        that.data._el.calendar__info.find('.button').on('click', function(){
                            that.data._datepicker.selectDate(new Date(that.data._today.getFullYear(), that.data._today.getMonth(), that.data._today.getDate()));
                        });
                    };

                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                    };
                    that.init = function(){

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