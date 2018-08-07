/* ===========================================================
* bootstrap-datepicker.js v1.3.0
* http://twitter.github.com/bootstrap/javascript.html#datepicker
* ===========================================================
* Copyright 2011 Twitter, Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* Contributed by Scott Torborg - github.com/storborg
* Loosely based on jquery.date_input.js by Jon Leighton, heavily updated and
* rewritten to match bootstrap javascript approach and add UI features.
* =========================================================== */


/*!!!!
 Changed in asyst for correct Chrome invalide behavior with new russia timezone (rtz+x)
 !!!!!*/

!function ($) {
    jQuery.fn.offsetRelative = function(args) {
        //var el = $('#PlanDate >input');
        var el = this;
        var offset = el.offset();
        var parentOffset = el.offsetParent().offset();
        offset.left -= parentOffset.left;
        offset.top -= parentOffset.top;
        return offset;
    };
    
    var selector = '[data-datepicker]',
      all = [];

    function clearDatePickers(except) {
        var ii;
        for (ii = 0; ii < all.length; ii++) {
            if (all[ii] != except) {
                all[ii].hide();
            }
        }
    }

    function DatePicker(element, options) {
        this.$el = $(element);
        this.DateTimeFormat = this.$el.data('date-time-format');
        this.proxy('show').proxy('ahead').proxy('hide').proxy('keyHandler').proxy('selectDate');

        var options = $.extend({}, $.fn.datepicker.defaults, options);

        if (!this.detectNative()) {
            $.extend(this, options);
            this.$el.data('datepicker', this);
            all.push(this);
            this.init();
        }
        this.$el.data('date-time-format', this.DateTimeFormat);
    }

    DatePicker.prototype = {

        detectNative: function (el) {
            // Attempt to activate the native datepicker, if there is a known good
            // one. If successful, return true. Note that input type="date"
            // requires that the string be RFC3339, so if the format/parse methods
            // have been overridden, this won't be used.
            if (navigator.userAgent.match(/(iPad|iPhone); CPU(\ iPhone)? OS 5_\d/i)) {
                // jQuery will only change the input type of a detached element.
                var $marker = $('<span>').insertBefore(this.$el);
                this.$el.detach().attr('type', 'date').insertAfter($marker);
                $marker.remove();
                return true;
            }
            return false;
        }

    , init: function () {
        var $months = this.nav('months', 1);
        var $years = this.nav('years', 12);

        var $nav = $('<div>').addClass('nav').append($months, $years);

        this.$month = $('.name', $months);
        this.$year = $('.name', $years);

        $calendar = $("<div>").addClass('calendar');

        // Populate day of week headers, realigned by startOfWeek.
        for (var i = 0; i < Asyst.date.shortDayNames.length; i++) {
            $calendar.append('<div class="dow">' + Asyst.date.shortDayNames[(i + Asyst.date.startOfWeek) % 7] + '</div>');
        };

        this.$days = $('<div>').addClass('days');
        $calendar.append(this.$days);

        this.$picker = $('<div>')
          .click(function (e) { e.stopPropagation() })
          .mousedown(function (e) { e.preventDefault() })
          .addClass('datepicker')
          .append($nav, $calendar)
          .insertAfter(this.$el);

        this.$el
          .focus(this.show)
          .click(this.show)
          .change($.proxy(function () { this.selectDate(); }, this));

        this.selectDate();
        this.hide();
    }

    , nav: function (c, months) {
        var $subnav = $('<div>' +
                          '<span class="prev button">&larr;</span>' +
                          '<span class="name"></span>' +
                          '<span class="next button">&rarr;</span>' +
                        '</div>').addClass(c)
        $('.prev', $subnav).click($.proxy(function () { this.ahead(-months, 0) }, this));
        $('.next', $subnav).click($.proxy(function () { this.ahead(months, 0) }, this));
        return $subnav;

    }

    , updateName: function ($area, s) {
        // Update either the month or year field
        var $fg = $('<div>').addClass('fg').append(s);
        $area.empty();
        $area.append($fg);
    }
    , isPoorDate: function (date) {
        var date2 = new Date(date);
        date2.setHours(date2.getHours()+2);
        return (date.getMonth() != date2.getMonth()) || (date.getDate() != date2.getDate());
    }
    ,selectMonth: function (date) {
        var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        if (this.isPoorDate(newMonth)) {
           newMonth = new Date(date.getFullYear(), date.getMonth(), 1,1);
        }

        if (!this.curMonth || !(this.curMonth.getFullYear() == newMonth.getFullYear() &&
                                this.curMonth.getMonth() == newMonth.getMonth())) {

            this.curMonth = newMonth;

            var rangeStart = this.rangeStart(date), rangeEnd = this.rangeEnd(date);
            var num_days = this.daysBetween(rangeStart, rangeEnd);
            this.$days.empty();

            for (var ii = 0; ii <= num_days; ii++) {
                var thisDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + ii);
                if (this.isPoorDate(thisDay)) {
                    thisDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + ii, 1);
                }
                var $day = $('<div>').attr('date', this.format(thisDay));
                $day.text(thisDay.getDate());

                if (thisDay.getMonth() != date.getMonth()) {
                    $day.addClass('overlap');
                };

                this.$days.append($day);
            };

            this.updateName(this.$month, Asyst.date.monthNames[date.getMonth()]);
            this.updateName(this.$year, this.curMonth.getFullYear());

            $('div', this.$days).click($.proxy(function (e) {
                var $targ = $(e.target);

                // The date= attribute is used here to provide relatively fast
                // selectors for setting certain date cells.
                this.update($targ.attr("date"), true);

                // Don't consider this selection final if we're just going to an
                // adjacent month.
                if (!$targ.hasClass('overlap')) {
                    this.hide();
                }

            }, this));

            $("[date='" + this.format(new Date()) + "']", this.$days).addClass('today');

        };

        $('.selected', this.$days).removeClass('selected');
        $('[date="' + this.selectedDateStr + '"]', this.$days).addClass('selected');
    }

    , selectDate: function (date) {
        if (typeof (date) == "undefined") {
            date = this.parse(this.$el.val());
        };
        if (!date) date = new Date();

        this.selectedDate = date;
        this.selectedDateStr = this.format(this.selectedDate);
        this.selectMonth(this.selectedDate);
    }

    , update: function (s, dateOnly) {
        if (dateOnly) {
            var date = this.parse(s);
            var val = this.parse(this.$el.val());
            if (val) {
                if (this.selectedDate) {
                    date.setHours(val.getUTCHours());
                    date.setMinutes(val.getUTCMinutes());
                    date.setSeconds(val.getUTCSeconds());
                    date.setMilliseconds(val.getUTCMilliseconds());
                }
                s = this.format(date);
            }
            this.$el.val(s).change();
        }
        else
            this.$el.val(s).change();
    }

    , show: function (e) {
        e && e.stopPropagation();

        // Hide all other datepickers.
        clearDatePickers(this);

        $('html').on('keydown', this.keyHandler);

		this.position();
		this.bind_reposition(this.$el, this.$picker);
	}

	, position: function() {
		var element = this.$el;
		var picker = this.$picker;
        var offset = element.offsetRelative();
        if (offset) {
			var left = offset.left;
			//if (picker.closest('.modal').length > 0) { left -= picker.closest('.modal').offset().left; }
            picker.css({
                top: offset.top + element.outerHeight() + 2,
                left: left
            }).show();
        }
        else {
			var left = element.left;
			//if (picker.closest('.modal').length > 0) { left -= picker.closest('.modal').offset().left; }
            picker.css({
                top: element.top,
                left: left
            }).show();
        }
	}

	, reposition: function(e) {
		var element = e.data.element;
		var picker = e.data.picker;
        var offset = element.offsetRelative();
        if (offset) {
			var left = offset.left;
			//if (picker.closest('.modal').length > 0) { left -= picker.closest('.modal').offset().left; }
            picker.css({
                top: offset.top + element.outerHeight() + 2,
                left: left
            });
        }
        else {
			var left = element.left;
			//if (picker.closest('.modal').length > 0) { left -= picker.closest('.modal').offset().left; }
            picker.css({
                top: element.top,
                left: left
            });
        }
	}

	, bind_reposition: function(element, picker) {
		$(window).bind('resize', {element: element, picker: picker}, this.reposition);
	}	

    , hide: function () {
        this.$picker.hide();
        $('html').off('keydown', this.keyHandler);
    }

    , keyHandler: function (e) {
        // Keyboard navigation shortcuts.
        switch (e.keyCode) {
            case 9:
            case 27:
                // Tab or escape hides the datepicker. In this case, just return
                // instead of breaking, so that the e doesn't get stopped.
                this.hide(); return;
            case 13:
                // Enter selects the currently highlighted date.
                this.update(this.selectedDateStr); this.hide(); break;
            case 38:
                // Arrow up goes to prev week.
                this.ahead(0, -7); break;
            case 40:
                // Arrow down goes to next week.
                this.ahead(0, 7); break;
            case 37:
                // Arrow left goes to prev day.
                this.ahead(0, -1); break;
            case 39:
                // Arrow right goes to next day.
                this.ahead(0, 1); break;
            default:
                this.hide();
                return;
        }
        e.preventDefault();
    }

    , parse: function (s) {
        return Asyst.date.parse(s, this.DateTimeFormat);
    }

    , format: function (date) {
        return Asyst.date.format(date, this.DateTimeFormat);
    }

    , ahead: function (months, days) {
        // Move ahead ``months`` months and ``days`` days, both integers, can be
        // negative.
        this.selectDate(new Date(this.selectedDate.getFullYear(),
                                 this.selectedDate.getMonth() + months,
                                 this.selectedDate.getDate() + days
                                 ));
    }

    , proxy: function (meth) {
        // Bind a method so that it always gets the datepicker instance for
        // ``this``. Return ``this`` so chaining calls works.
        this[meth] = $.proxy(this[meth], this);
        return this;
    }

    , daysBetween: function (start, end) {
        // Return number of days between ``start`` Date object and ``end``.
        var start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
        var end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
        return (end - start) / 86400000;
    }

    , findClosest: function (dow, date, direction) {
        // From a starting date, find the first day ahead of behind it that is
        // a given day of the week.
        var difference = direction * (Math.abs(date.getDay() - dow - (direction * 7)) % 7);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
    }

    , rangeStart: function (date) {
        // Get the first day to show in the current calendar view.
        return this.findClosest(Asyst.date.startOfWeek,
                                new Date(date.getFullYear(), date.getMonth()),
                                -1);
    }

    , rangeEnd: function (date) {
        // Get the last day to show in the current calendar view.
        return this.findClosest((Asyst.date.startOfWeek - 1) % 7,
                                new Date(date.getFullYear(), date.getMonth() + 1, 0),
                                1);
    }
    };

    /* DATEPICKER PLUGIN DEFINITION
    * ============================ */

    $.fn.datepicker = function (options) {
        return this.each(function () { new DatePicker(this, options); });
    };

    $(function () {
        $(selector).datepicker();
        $('html').click(clearDatePickers);
    });

    $.fn.datepicker.DatePicker = DatePicker;

} (window.jQuery || window.ender);
