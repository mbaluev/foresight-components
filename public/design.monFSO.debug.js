/*var settings = {
	widget: $widget,
	CoordComListId: CoordComListId,
	DataSetName: DataForSovietWidget,
	top: {
		container: $('.top-list-container'),
		slider: $('<div class="top-list__slider top-list"></div>'),
		itemWidth: {
			min: 200,
			max: 215
		}
	},
	other: {
		container: $('.other-members-container'),
		slider: $('<div class="other-members__slider"></div>'),
		width: 150
	},
	sliderPadding: 40
};*/

if (typeof Asyst != typeof undefined) {
	(function () {
		Asyst.initMembersWidget = function (settings) {
			//Зависимости
			var API = Asyst.API,
				Workspace = Asyst.Workspace,
				SLIDER_PADDING = settings.sliderPadding,
				NO_IMG_SRC = '/asyst/components/images/monFSO/logo_none.jpg',
				$widget = settings.widget,
				widgetData = [],
				slickSliders = [],

			//ТОПы
				$topContainerEl = settings.top.container,
				$topSliderEl = settings.top.slider,
				topCount = 0,
				topItemMinWidth = settings.top.itemWidth.min,
				topItemMaxWidth = settings.top.itemWidth.max,
				topContainerMaxWidth,
				topContainerMinWidth,

			//Остальные
				$otherContainerEl = settings.other.container,
				$otherSliderEl = settings.other.slider,
				otherItemWidth = settings.other.width,
				otherMembersContainerWidth,
				otherSlideCount = 0;

			init();

			$(window).resize($.debounce(250, function() {
				destroy();
				createWidgetElements(widgetData);
			}));

			function destroy() {
				topCount = 0;

				slickSliders.map(function (slider, i) {
					slider.slick('unslick');
				});

				$topSliderEl.children().remove();
				$topSliderEl.remove();
				$otherSliderEl.remove();
			}

			/**
			 * Функция инициализации виджета
			 */
			function init () {
				if (widgetData.length === 0) {
					getData(settings.DataSetName, createWidgetElements);
				} else {
					createWidgetElements(widgetData);
				}
			}

			/**
			 * Создает элементы виджета состава Правительственной комиссии
			 * @param data Данные состава Правительственной комиссии, Array
			 */
			function createWidgetElements(data) {
				setSliderItems (data, $topSliderEl, $otherSliderEl);
				calcTopContainerWidth();
				renderMemberBlocks();
			}

			/**
			 * Отрисовывает блоок ТОП и Остальных участников
			 */
			function renderMemberBlocks() {
				var widgetWidth = $widget.width();

				if ($(window).width() > 780) {

					if (topContainerMaxWidth > widgetWidth * 0.7) {
						if (topContainerMinWidth > widgetWidth * 0.7) {
							topContainerMinWidth = widgetWidth * 0.7;
							otherMembersContainerWidth = widgetWidth - topContainerMinWidth;


							setWidthCSStoEl($topContainerEl, topContainerMinWidth);
							$topContainerEl.append($topSliderEl);

							setWidthCSStoEl($otherContainerEl, otherMembersContainerWidth);
							$otherContainerEl.append($otherSliderEl);

							//TOP slider
							topSlideCount = calcSliderItemCount(topItemMinWidth, topContainerMinWidth, SLIDER_PADDING);

							//Other slider
							otherSlideCount = calcSliderItemCount(otherItemWidth, otherMembersContainerWidth, SLIDER_PADDING);
							initSlider($otherSliderEl, otherSlideCount, function () {
								initSlider($topSliderEl, topSlideCount);
							});
						} else {
							otherMembersContainerWidth = widgetWidth - topContainerMinWidth;

							setWidthCSStoEl($topContainerEl, topContainerMinWidth);
							$topContainerEl.append($topSliderEl);
							$topContainerEl.find('.top-list__item').css('width', topItemMinWidth + 'px');

							setWidthCSStoEl($otherContainerEl, otherMembersContainerWidth);
							$otherContainerEl.append($otherSliderEl);

							//Other slider
							otherSlideCount = calcSliderItemCount(otherItemWidth, otherMembersContainerWidth, SLIDER_PADDING);
							initSlider($otherSliderEl, otherSlideCount);
						}
					} else {
						otherMembersContainerWidth = widgetWidth - topContainerMaxWidth;

						setWidthCSStoEl($topContainerEl, topContainerMaxWidth);
						$topContainerEl.append($topSliderEl);
						$topContainerEl.find('.top-list__item').css('width', topItemMaxWidth + 'px');

						setWidthCSStoEl($otherContainerEl, otherMembersContainerWidth);

						$otherContainerEl.append($otherSliderEl);

						//Other slider
						otherSlideCount = calcSliderItemCount(otherItemWidth, otherMembersContainerWidth, SLIDER_PADDING);
						initSlider($otherSliderEl, otherSlideCount);
					}
				} else {
					debugger;
					if (topContainerMaxWidth > widgetWidth) {
						if (topContainerMinWidth > widgetWidth) {
							topContainerMinWidth = widgetWidth;
							otherMembersContainerWidth = widgetWidth;


							setWidthCSStoEl($topContainerEl, topContainerMinWidth);
							$topContainerEl.append($topSliderEl);

							setWidthCSStoEl($otherContainerEl, otherMembersContainerWidth);
							$otherContainerEl.append($otherSliderEl);

							//TOP slider
							topSlideCount = calcSliderItemCount(topItemMinWidth, topContainerMinWidth, SLIDER_PADDING);

							//Other slider
							otherSlideCount = calcSliderItemCount(otherItemWidth, otherMembersContainerWidth, SLIDER_PADDING);
							initSlider($otherSliderEl, otherSlideCount, function () {
								initSlider($topSliderEl, topSlideCount);
							});
						} else {
							topContainerMinWidth = widgetWidth;
							otherMembersContainerWidth = widgetWidth;

							setWidthCSStoEl($topContainerEl, topContainerMinWidth);
							$topContainerEl.append($topSliderEl);
							$topContainerEl.find('.top-list__item').css('width', topItemMinWidth + 'px');

							setWidthCSStoEl($otherContainerEl, otherMembersContainerWidth);
							$otherContainerEl.append($otherSliderEl);

							//Other slider
							otherSlideCount = calcSliderItemCount(otherItemWidth, otherMembersContainerWidth, SLIDER_PADDING);
							initSlider($otherSliderEl, otherSlideCount);
						}
					} else {
						topContainerMaxWidth = widgetWidth;
						otherMembersContainerWidth = widgetWidth;

						setWidthCSStoEl($topContainerEl, topContainerMaxWidth);
						$topContainerEl.append($topSliderEl);
						$topContainerEl.find('.top-list__item').css('width', topItemMaxWidth + 'px');

						setWidthCSStoEl($otherContainerEl, otherMembersContainerWidth);

						$otherContainerEl.append($otherSliderEl);

						//Other slider
						otherSlideCount = calcSliderItemCount(otherItemWidth, otherMembersContainerWidth, SLIDER_PADDING);
						initSlider($otherSliderEl, otherSlideCount);
					}
				}
			}

			/**
			 * Добавляет элементы в блоки с ТОПами и Остальными
			 * @param data Данные элементов
			 * @param$topSliderEl jquery элемент
			 * @param$otherSliderEl jquery элемент
			 */
			function setSliderItems (data,$topSliderEl,$otherSliderEl) {
				data.map(function (item, i) {
					var sliderItem = '';

					if (item.IsTop) {
						topCount += 1;

						sliderItem = getTopItemHtml(item.Name, item.Position, item.src);
						$topSliderEl.append(sliderItem);
					} else {
						sliderItem = getOtherItemHtml(item.Name, item.Position, item.src)
						$otherSliderEl.append(sliderItem);
					}
				})
			}

			/**
			 * Возвращает разметку для элемента категории ТОП
			 * @param name Имя
			 * @param position Должность
			 * @param imgSrc URL фотографии
			 * @returns {string} Строка с разметкой элемента
			 */
			function getTopItemHtml (name, position, imgSrc) {
				return '<div class="top-list__item members__item" style="">\n' +
					'                <div class="item__img-container">\n' +
					'                    <img src="' + (imgSrc ? imgSrc : NO_IMG_SRC) + '" alt="">\n' +
					'                </div>\n' +
					'                <div class="item__info">\n' +
					'                    <div class="info__name">' + name + '</div>\n' +
					'                    <div class="info__position">' + position + '</div>\n' +
					'                </div>\n' +
					'            </li>';
			}

			/**
			 * Возвращает разметку для элемента обычной категории
			 * @param name Имя
			 * @param position Должность
			 * @param imgSrc URL фотографии
			 * @returns {string} Строка с разметкой элемента
			 */
			function getOtherItemHtml (name, position, imgSrc) {
				return '<div class="slider__item__item members__item">\n' +
					'                <div class="item__img-container">\n' +
					'                    <img src="' + (imgSrc ? imgSrc : NO_IMG_SRC) + '" alt="">\n' +
					'                </div>\n' +
					'                <div class="item__info">\n' +
					'                    <div class="info__name">' + name + '</div>\n' +
					'                    <div class="info__position">' + position + '</div>\n' +
					'                </div>\n' +
					'            </div>';
			}

			/**
			 * Получает из Датасета данные для виджета и вызывает функцию для работы с ними.
			 * @param datasetParams объект параметров Датасета
			 * @param callback Функция, которая вызывается при загрузке Датасета. Принимает объекта с данными
			 */
			function getData (DataSetName, callback) {
				API.DataSet.load(
					DataSetName,
					{
						CoordComListId: settings.CoordComListId,
						IsTop: null
					},
					false,
					function (data) {
						if (data && data[0] && data[0].length > 0) {
							widgetData = data[0];
							callback(widgetData);
						}
					}
				)
			}

			/**
			 * Возвращает количество элементов минимальной ширины, которые могу уместиться в блоке заданной ширины
			 * @param itemMinWidth Минимальная ширина элемента
			 * @param containerWidth Ширина контейнера слайдера
			 * @param padding Паддинг контейнера
			 * @returns {number} Количество эелементов, которые могут уместиться в слайдер
			 */
			function calcSliderItemCount (itemMinWidth, containerWidth, padding) {
				return Math.floor((containerWidth - padding) / itemMinWidth);
			}

			/**
			 * Возвращает ширину виджет, в котором будут отрисовываться блоки с ТОПами и Остальными
			 * @param $widget jquery элемент Виджет
			 */
			function getWidgetWidth ($widget) {
				return $widget.width();
			}

			/**
			 * Рассчитывает минимальную и максимальную ширину контейнера для ТОП
			 * @param topCount количество элементов в блоке ТОП
			 * @param topItemMinWidth минимальная ширина одного элемента ТОП
			 * @param topItemMaxWidth максимальная ширина одного элемента ТОП
			 * @returns {{max: number, min: *}}
			 */
			function calcTopContainerWidth () {
				var max = topCount * topItemMaxWidth,
					min = topCount * topItemMinWidth;


				topContainerMaxWidth = max;
				topContainerMinWidth = min;
			}

			/**
			 * Инициализирует слайдер
			 * @param $el jquery элемент
			 * @param slidesToShow количество слайдов для показа
			 */
			function initSlider($el, slidesToShow, callback) {
				$el.on('init', function(e, slick) {
					debugger;
					slickSliders.push($el);

					if (typeof callback === 'function') {
						callback();
					}
				});

				$el.slick({
					slidesToShow: slidesToShow,
					slidesToScroll: 1,
					arrows: true,
					adaptiveHeight: true,
					infinite: false
				});
			}

			/**
			 * Устанавливает значение ширины у элемента $el
			 * @param $el jquery элемент
			 * @param width Значение ширины, int
			 */
			function setWidthCSStoEl($el, width) {
				$el.css('width', width + 'px');
			}
		};
	}) (Asyst);
}
