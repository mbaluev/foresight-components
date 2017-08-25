
$(function(){
	//var $search_text.val(getParameterByName('text'));
});

/* -------------------------- */
/* ----- jQuery.fn.docs ----- */
/* -------------------------- */

(function($){
	jQuery.fn.docs = function(options){
		options = $.extend({
			data: [],
			countPerPage: 5, //количество документов на странице
			filter: {"text":"", "pagenum":"1", "doctypes":[], "author":"-1", "entitytype":""}
		}, options);

		var rdata = Enumerable.From(options.data);
		var tdata = Enumerable.Empty(); // по типам документов
		var adata = Enumerable.Empty(); // по авторам
		var edata = Enumerable.Empty(); // по типам карточек
		var uniqueExtensions = Enumerable.From(options.data).Distinct("$.ext.toLowerCase()").OrderBy("$.ext").Select("{ext:$.ext, icon:$.icon}");
		var uniqueAuthors =  Enumerable.From(options.data).Distinct("$.creationAuthorId").OrderBy("$.userName").Select("{creationAuthorId:$.creationAuthorId, userName:$.userName}").Where("$.creationAuthorId!=0");
		var uniqueEntities =  Enumerable.From(options.data).Distinct("$.entityName").OrderBy("$.entityTitle").Select("{entityName:$.entityName, entityTitle:$.entityTitle}");

		var docs = function(){
			var $row_search_line = $('<div class="row"></div>');
			var $search_line = render_search_line();
			$(this).append($row_search_line.append($search_line));
			if (rdata.Count() > 0){
				var $row_search_results = render();
				$(this).append($row_search_results);
			}
		};

		function search(text){
			var newurl = updateURLParameter(window.location.href, 'text', text);
			window.location.href = newurl;
		};

		function updateURLParameter(url, param, paramVal){
			var newAdditionalURL = "";
			var tempArray = url.split("?");
			var baseURL = tempArray[0];
			var additionalURL = tempArray[1];
			var temp = "";
			if (additionalURL) {
				tempArray = additionalURL.split("&");
				for (i=0; i<tempArray.length; i++){
					if(tempArray[i].split('=')[0] != param){
						newAdditionalURL += temp + tempArray[i];
						temp = "&";
					}
				}
			}
			var rows_txt = temp + "" + param + "=" + paramVal;
			return baseURL + "?" + newAdditionalURL + rows_txt;
		}

		function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

		function render_search_line(text){
			var $result = $('<div class="col-lg-12"></div>');
			var $panel = $('<div class="panel auto"></div>');
			var $search_input = $('<div id="search_input"></div>');
			var $search_text = $('<input type=text id="search_text" name="search_text" placeholder="Введите текст для поиска">');
			$search_input.append($search_text);
			var $search_btn = $('<div id="search_btn">Найти</div>');

			//--- searching
			$.cookie.json = true;
			if (($.cookie('filter') != null) && ($.cookie('filter').text == getParameterByName('text'))) { 
				options.filter = $.cookie('filter');
			} else {
				$.removeCookie('filter', {path:'/'}); 
				options.filter.text = getParameterByName('text');
			}

			$search_text.val(getParameterByName('text'));
			$search_text.keypress(function (e) {
				if (e.which == 13) {
					search($(this).val());
				}
			});
			$search_btn.click(function(){
				search($search_text.val());
			});

			$panel.append($search_input, $search_btn);
			$result.append($panel);
			return $result;
		}

		function render(){
			var $result = $('<div class="row"></div>');
			var $col_documents = $('<div class="col-lg-9"></div>');
			var $panel_documents = $('<div class="panel auto"><div class="documents"></div></div>');
			var $col_filter = $('<div class="col-lg-3"></div>');
			var $panel_filter = $('<div class="panel auto"></div>');
			var $filter = $('<div class="filter"></div>');

			// количество элементов
			var $countblock = $('<div class="filter_block count"></div>');
			var $countblockcaption = $('<div class="caption">&nbsp;&nbsp;документов</div>');
			var $countblockspan = $('<span></span>');
			$countblockcaption.prepend($countblockspan);
			$countblock.append($countblockcaption);
			$filter.append($countblock);

			// подгружаем фильтр из куки и рендерим результат
			var ldoctypes = Enumerable.From(options.filter.doctypes);
			if (ldoctypes.Count() > 0)
				ldoctypes.ForEach(function(item){
					var endata = rdata.Where('$.ext.toLowerCase()=="' + item + '"');
					tdata = tdata.Concat(endata);
				});
			if (parseInt(options.filter.author) > 0)
				adata = rdata.Where('$.creationAuthorId=="' + options.filter.author + '"');
			if (options.filter.entitytype.length > 0)
				edata = rdata.Where('$.entityName=="' + options.filter.entitytype + '"');
			render_list(tdata, adata, edata, $panel_documents, $countblockspan, options.filter.pagenum);
			// конец

			if (uniqueExtensions.Count() > 0){
				var $doctypes = $('<div class="filter_block"></div>');
				var $doctypescaption = $('<div class="caption">Типы документов</div>');
				var $doctypescontent = $('<div class="content"></div>')
				var $ul = $('<ul></ul>');
				uniqueExtensions.ForEach(function(item){
					var $li = $('<li ext="' + item.ext + '"></li>');
					if (item.icon != ""){
						var $img = $('<img src="' + item.icon + '">');
						$li.append($img);
					}
					var $span = $('<span>' + item.ext + '</span>');
					var $checkbox = $('<input type="checkbox" value="' + item.ext + '">');
					ldoctypes.ForEach(function(fitem){
						if (fitem == item.ext)
							$checkbox.attr('checked', true);
					});
					$checkbox.change(function() {
						var endata = rdata.Where('$.ext.toLowerCase()=="' + item.ext + '"');
						if ($(this).is(':checked')){
							options.filter.doctypes = Enumerable.From(options.filter.doctypes).Concat([item.ext]).Distinct("$").ToArray();
							tdata = tdata.Concat(endata);
						} else {
							options.filter.doctypes = Enumerable.From(options.filter.doctypes).Except([item.ext]).ToArray();
							tdata = tdata.Except(endata);
						}
						render_list(tdata, adata, edata, $panel_documents, $countblockspan, 1);
					});
					$li.append($checkbox, $span);
					$ul.append($li);
				});
				$doctypescontent.append($ul);
				var $clear = $('<div class="clear"></div>');
				$doctypes.append($doctypescaption, $doctypescontent, $clear);
				$filter.append($doctypes);
			}

			if (uniqueAuthors.Count() > 0){
				var $authors = $('<div class="filter_block"></div>');
				var $authorscaption = $('<div class="caption">Авторы</div>');
				var $authorscontent = $('<div class="content"></div>')
				var $select = $('<select id="authos" name="authors"><option value="-1">Все</option></select>');
				uniqueAuthors.ForEach(function(item){
					var $option = $('<option value="' + item.creationAuthorId + '">' + item.userName + '</option>');
					if (parseInt(options.filter.author) == parseInt(item.creationAuthorId))
						$option.attr('selected', 'selected');
					$select.append($option);
				});
				$select.change(function() {
					options.filter.author = $(this).val();
					adata = rdata.Where('$.creationAuthorId=="' + $(this).val() + '"');
					render_list(tdata, adata, edata, $panel_documents, $countblockspan, 1);
				});
				$authorscontent.append($select);
				var $clear = $('<div class="clear"></div>');
				$authors.append($authorscaption, $authorscontent, $clear);
				$filter.append($authors);
			}

			if (uniqueEntities.Count() > 0){
				var $entities = $('<div class="filter_block"></div>');
				var $entitiescaption = $('<div class="caption">Тип карточки</div>');
				var $entitiescontent = $('<div class="content"></div>')
				var $select = $('<select id="entities" name="entities"><option value="">Все</option></select>');
				uniqueEntities.ForEach(function(item){
					var $option = $('<option value="' + item.entityName + '">' + item.entityTitle + '</option>');
					if (options.filter.entitytype == item.entityName)
						$option.attr('selected', 'selected');
					$select.append($option);
				});
				$select.change(function() {
					options.filter.entitytype = $(this).val();
					edata = rdata.Where('$.entityName=="' + $(this).val() + '"');
					render_list(tdata, adata, edata, $panel_documents, $countblockspan, 1);
				});
				$entitiescontent.append($select);
				var $clear = $('<div class="clear"></div>');
				$entities.append($entitiescaption, $entitiescontent, $clear);
				$filter.append($entities);
			}

			$panel_filter.append($filter);
			$col_documents.append($panel_documents);
			$col_filter.append($panel_filter);
			$result.append($col_filter, $col_documents);
			return $result;
		}

		function render_list(data1, data2, data3, container, countcontainer, pagenum) {
			if (data1.Count() == 0) { data1 = Enumerable.From(rdata); }
			if (data2.Count() == 0) { data2 = Enumerable.From(rdata); }
			if (data3.Count() == 0) { data3 = Enumerable.From(rdata); }
			var ldata = data1.Intersect(data2).Intersect(data3).OrderBy("$.fileId");
			
			countcontainer.text(ldata.Count());
			show_page(ldata, container, pagenum)

			return ldata.Count();
		}

		function show_page(pdata, container, pagenum){
			var dochtml = '';
			container.find('.documents').html('');
			pdata.Skip(options.countPerPage * (pagenum-1)).Take(options.countPerPage).ForEach(function(doc){
				dochtml +=
					'<div class="document">' +
						'<div class="icon_block">';
				if (doc.icon != ""){
					dochtml += '<img src="' + doc.icon + '">';
				}
				dochtml += 
						'</div>' +
						'<div class="info_block">' +
							'<div class="date">' + doc.creationDate + '</div>' +
							'<div class="size">' + filesize(doc.fileLength, {base: 2}) + '</div>' +
							'<div class="version">Версия ' + doc.vers + '</div>' +
						'</div>' +
						'<div class="name_block">' +
							'<div class="name">' +
								'<a href="' + doc.url + '" target="_blank">' + doc.name + doc.ext + '</a>' +
							'</div>' +
							'<div class="author">Автор: ' + doc.userName + '</div>' +
							'<div class="entity">' +
								'<a href="/asyst/' + doc.entityName + '/form/auto/' + doc.dataId + '?mode=view&back=">' + doc.entityTitle + ': ' + doc.dataName + '</a>' +
							'</div>' +
						'</div>' +
					'</div>';
			});
			container.find('.documents').append(dochtml);
			render_pager(pdata, container, pagenum);

			//обновление куки фильтра
			options.filter.pagenum = pagenum;
			$.cookie('filter', options.filter, { expires: 7, path: '/' });
		}

		function render_pager(psdata, container, pagenum){
			container.find('.page_panel').remove();
			var countPages = Math.ceil(psdata.Count()/options.countPerPage);
			if (countPages > 1) {
				var $pagehtml = $('<div class="page_panel"></div>');
				var $ul = $('<ul></ul>');
				var ulhtml = '';
				var icrop = Math.floor(pagenum/10);
				if (pagenum % 10 == 0){ 
					icrop -= 1; 
				}
				var ifrom = icrop*10;
				var ito = (ifrom+10 < countPages) ? ifrom+10 : countPages;
				if (ifrom > 0) {
					var $li = $('<li></li>');
					var $a = $('<a href="#" pagenum="' + ifrom + '">Меньше</li>');
					$li.append($a);
					$a.click(function() {
						show_page(psdata, container, $(this).attr("pagenum"));
					});
					$ul.append($li);
				}
				for (var i=ifrom+1; i<=ito; i++) {
					var $li = $('<li></li>');
					var $a = $('<a href="#" pagenum="' + i + '">' + i + '</li>');
					if (i == pagenum) { $li.addClass("selected"); }
					$li.append($a);
					$a.click(function() {
						show_page(psdata, container, $(this).attr("pagenum"));
						$(this).parent().parent().find('.selected').removeClass("selected");
						$(this).parent().addClass("selected");
					});
					$ul.append($li);
				}
				if (ito < countPages) {
					var $li = $('<li></li>');
					var $a = $('<a href="#" pagenum="' + (ito+1) + '">Больше</li>');
					$li.append($a);
					$a.click(function() {
						show_page(psdata, container, $(this).attr("pagenum"));
					});
					$ul.append($li);
				}
				if (countPages > 10) {
					var $li = $('<li class="summary">Всего страниц: ' + countPages + '</li>');
					$ul.append($li);
				}
				$pagehtml.append($ul);
				container.append($pagehtml);
			}
		}

		return this.each(docs);
	};
})(jQuery);