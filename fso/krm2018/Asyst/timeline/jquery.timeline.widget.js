jQuery.fn.timeline = function (settings) {
    
    var settings = jQuery.extend({
        width: 10000,
        array: [{ name: "Name", tooltip: "Tooltip", finish: "01.03.2012", status: -1}],
		isAdaptiveContainer : true
    }, settings);

    return this.each(function () 
	{

		//var mon = ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'];
        var mon = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        var i = 0;
        var emptyWidth = settings.isAdaptiveContainer ? 0 : 50;
        var unit = settings.isAdaptiveContainer ? "%" : "px";
        
		var today = new Date();
		var mindate = today;
		var maxdate = today;
		var isempty = true;

        for (i = 0; i < settings.array.length; i++) {
			if (settings.array[i].finish != "") {
				if (isempty) {
					isempty = false;
					data = strtodate(settings.array[i].finish);				
					mindate = data;
					maxdate = data;
				} else {
					data = strtodate(settings.array[i].finish);
					if (data < mindate) mindate = data;
					if (data > maxdate) maxdate = data;
				}
			}
        }

		if (!isempty) {
			if (mindate == maxdate) {
				mindate = new Date(mindate.getFullYear(), mindate.getMonth() - 6, 1);
				maxdate = new Date(maxdate.getFullYear(), maxdate.getMonth() + 6, 1);
			}

			var monthDiff = maxdate.getMonth() - mindate.getMonth() + (12 * (maxdate.getFullYear() - mindate.getFullYear()));
			mindate.setMonth(mindate.getMonth() - (emptyWidth / (settings.width / monthDiff)) - 1);
			maxdate.setMonth(maxdate.getMonth() + 1);

			var startDate = new Date(mindate.getFullYear(), mindate.getMonth(), 1);
			
			var finishDate = maxdate; 
			finishDate.setMonth(finishDate.getMonth() + 1); 
			finishDate = new Date(finishDate.getFullYear(), finishDate.getMonth(), 1);

			var daysTotal = days_between(startDate, finishDate);
			var monTotal = days_between(startDate, finishDate);
			var onedayWidth = settings.width / daysTotal;

			//first point
			if (settings.array[0].finish != "") { 
				settings.array[0].left = days_between(startDate, strtodate(settings.array[0].finish)) * onedayWidth - emptyWidth;
				settings.array[0].width = emptyWidth;

				var row = "";
				
				row += "<div style='position: absolute; left: " + settings.array[0].left + unit+"; top: 5px; width: " + settings.array[0].width + unit+"; max-width: " + (settings.array[0].width - 5) + unit+"; z-index: 100;' ";
				row += "class='tlEvent tlDivEvent" + settings.array[0].status + " tlDivEventEmpty' data-container='body' data-html='true' title='" + settings.array[0].tooltip + "'>" + settings.array[0].name + "</div>";
				
				row += "<div style='position: absolute; left: " + settings.array[0].left + unit+"; top: 20px; width: " + settings.array[0].width + unit+"; max-width: " + settings.array[0].width + unit+"; z-index: 100;' ";
				row += "class='tlEvent tlDiv" + settings.array[0].status + " tlDiv";
				
				row += " tlDivSepLast" + settings.array[0].status;
				row += "' data-container='body' data-html='true' title='" + settings.array[0].tooltip + "'></div>";
				
				jQuery(this).append(row);
			}
			//end

			for (i = 1; i < settings.array.length; i++) {
				if (settings.array[i].finish != "") { 
					
					settings.array[i].left = days_between(strtodate(settings.array[i - 1].finish), startDate) * onedayWidth;
					settings.array[i].width = days_between(strtodate(settings.array[i - 1].finish), strtodate(settings.array[i].finish)) * onedayWidth;
					if (settings.array[i - 1].finish == "") { 
						settings.array[i].left = days_between(startDate, strtodate(settings.array[i].finish)) * onedayWidth - emptyWidth; 
						settings.array[i].width = emptyWidth; 
					}
					
					var row = "";
					
					row += "<div style='position: absolute; left: " + settings.array[i].left + unit+"; top: 5px; width: " + settings.array[i].width + unit+"; max-width: " + settings.array[i].width + unit+"; z-index: " + (100 - i) + ";' ";
					row += "class='tlEvent tlDivEvent" + settings.array[i].status;
					if (settings.array[i - 1].finish == "") { row += " tlDivEventEmpty"; }
					row += "' data-container='body' data-html='true' title='" + settings.array[i].tooltip + "'>" + settings.array[i].name + "</div>";

					row += "<div style='position: absolute; left: " + settings.array[i].left + unit+"; top: 20px; width: " + settings.array[i].width + unit+"; max-width: " + settings.array[i].width + unit+"; z-index: " + (100 - i) + ";' ";
					row += "class='tlEvent tlDiv" + settings.array[i].status;

					if (settings.array[i - 1].finish == "") { row += " tlDiv"; }
					row += " tlDivSepLast" + settings.array[i].status;
					row += "' data-container='body' data-html='true' title='" + settings.array[i].tooltip + "'></div>";
					jQuery(this).append(row);
				}
			}

			$("div[title]").tooltip();

			var timelineYears = "<br/><br/>";
			timelineYears += "<div id='timelineYears' style='width: " + (settings.isAdaptiveContainer ? "100%" : settings.width.toString() + unit) +"; position: absolute;'>";

			var months = (finishDate.getYear() - startDate.getYear()) * 12 + (finishDate.getMonth() - startDate.getMonth());
			var onemonthWidth = (settings.width) / months;

			var finishMonth = finishDate.getYear().toString() + finishDate.getMonth().toString();
			var years = "";
			var k = 0;
			var l = 0;
			var h = 14;
			do {
				if (startDate.getMonth() == 11) h = 30; else h = 14;
				var cls = 'tlTick';
				if (startDate.getMonth() == today.getMonth() && startDate.getFullYear() == today.getFullYear())
					cls += ' tlTickCurrent';
				timelineYears += "<div class='" + cls + "' style='width: " + onemonthWidth + unit+"; float: left; height: " + h +"px;'>" + mon[startDate.getMonth()] + "</div>";

				k = k + 1;
				if (startDate.getMonth() == 11 || startMonth == finishMonth - 1)
				{ years += "<div style='width: " + (onemonthWidth * k) + unit+"; float: left; position: absolute; top: 18px; left: " + l + unit+";' class='tlYear'>" + startDate.getFullYear().toString() + "</div>"; l += onemonthWidth * k; k = 0; }

				startDate.setMonth(startDate.getMonth() + 1);
				var startMonth = startDate.getYear().toString() + startDate.getMonth().toString();

			} while (startMonth != finishMonth);

			//timelineYears  += "</tr>";
			timelineYears += years;

			//timelineYears  += "</table>";
			timelineYears += "</div>";

			jQuery(this).append(timelineYears);
		}
	});
};

function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return difference_ms > 0 ? Math.round(difference_ms / ONE_DAY) : 0;

};

function months_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms / ONE_DAY);

};

function strtodate(str)
{
   var dateArray = str.split(".");
   return new Date(dateArray[2], dateArray[1]-1, dateArray[0]);
};
