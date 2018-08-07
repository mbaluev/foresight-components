Highcharts.setOptions({
    colors: ['#3cd79a', '#718396', '#ffb652', '#ff6666', '#27bdbe', '#00a1f4', '#58c9f3', '#ef83c9', '#9a60c2', '#02cfaa', '#495764'],
    credits: { enabled: false },
    exporting: { enabled: false },
    plotOptions: { series: { dataLabels: { style: { color: 'contrast', fontSize: '11px', fontWeight: 'normal', textOutline: '0px' } } } },
	noData: { style: { fontSize: '18px', color: '#718396', fontWeight: 'nornmal', fontFamily: 'Segoe UI' } },
    lang: { 
			contextButtonTitle: "Параметры",
			decimalPoint: ",",
			thousandsSep: " ",
			drillUpText: "Обратно: {series.name}",
			loading: "Загрузка...",
			noData: "Нет данных",
			printChart: "Печать",
            viewData: "Данные",
            zoomIn: "Ближе",
            zoomOut: "Дальше",
			resetZoom: "Вернуть масштаб",
			resetZoomTitle: "Вернуть масштаб к первоначальному",
			numericSymbols: [ "тыс" , "млн" , "млрд" , "трлн" , "квдр" , "квнт"],
			months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
			shortMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
			weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
			shortWeekdays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
		  }   	
});	