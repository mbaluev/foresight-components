(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'gallery', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        items: []
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        target: self,
                        card: $('<div class="card"></div>'),
                        card__header: $([
                            '<div class="card__header">',
                            '<div class="card__header-row">',
                            '<div class="card__header-column">',
                            '<label class="card__name">',
                            '<span class="card__name-text">Фотогалерея</span>',
                            '</label>',
                            '</div>',
                            '</div>',
                            '</div>'
                        ].join('')),
                        card__main: $('<div class="card__main"></div>'),
                        card__left: $('<div class="card__left"></div>'),
                        card__middle: $('<div class="card__middle"></div>'),
                        card__middle_scroll: $('<div class="card__middle-scroll"></div>'),
                        card__middle_inner: $('<div class="card__middle-inner"></div>'),
                        menu: $('<div class="menu menu_color_light" data-fc="menu"></div>'),
                        tabs: []
                    };
                    that.data.private = {
                        datatree: [],
                        datalevel: -1
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.nulls = function(){
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
                    that.prepare = function(){
                        that.data.items.map(function(d){ that.data.private.datatree.push({ item: d }) });
                        that.data.private.datatree = prepareData(that.data.private.datatree, that.data.private.datalevel, null);
                        function prepareData(data, datalevel, parentid){
                            var roots = data.filter(function(d){ return d.item.parentid == parentid; });
                            datalevel++;
                            roots.forEach(function(root){
                                root.item.level = datalevel;
                                if (!root.item.fileid)
                                    root.child = prepareData(data, datalevel, root.item.id);
                            });
                            datalevel--;
                            return roots;
                        }
                    };

                    that.prerender = function(){
                        that.data._el.target.append(
                            that.data._el.card.append(
                                that.data._el.card__header,
                                that.data._el.card__main.append(
                                    that.data._el.card__left.append(
                                        that.data._el.menu
                                    ),
                                    that.data._el.card__middle.append(
                                        that.data._el.card__middle_scroll.append(
                                            that.data._el.card__middle_inner
                                        )
                                    )
                                )
                            )
                        );
                    };
                    that.render = function(){
                        var $menu__list = $('<ul class="menu__list"></ul>');
                        renderData(that.data.private.datatree, $menu__list);
                        that.data._el.menu.append($menu__list);
                        that.data._el.menu.menu();

                        function renderData(data, container){
                            var result = false,
                                padding = 10;
                            data.forEach(function(d){
                                if (!d.item.fileid) {
                                    result = true;
                                    padding = 10;
                                    for (var i = 0; i < d.item.level; i++) { padding += 10; }
                                    var $menu__item = $([
                                            '<li class="menu__item" id=' + d.item.id + '>',
                                            '<a class="menu__item-link link" style="padding-left: '+ padding +'px">',
                                            '<span class="menu__item-link-content">',
                                            (d.item.icon && d.item.icon != 'null' ? '<span class="icon ' + d.item.icon + '"></span>' : ''),
                                            '<span class="menu__item-text">' + d.item.name + '</span>',
                                            '</span>',
                                            '</a>',
                                            '</li>'
                                        ].join('')),
                                        $menu__submenu = $('<div class="menu menu__submenu-container"></div>'),
                                        $menu__list = $('<ul class="menu__list menu__submenu"></ul>'),
                                        $menu__icon = $('<span class="menu__icon icon icon_animate icon_svg_right_white"></span>');
                                    $menu__item.append(
                                        $menu__submenu.append(
                                            $menu__list
                                        )
                                    );
                                    $menu__item.find('.menu__item-link-content').append($menu__icon);
                                    if (d.child) {
                                        if (!renderData(d.child, $menu__list)) {
                                            $menu__item = $([
                                                '<li class="menu__item" id=' + d.item.id + '>',
                                                '<a class="menu__item-link link" style="padding-left: '+ padding +'px">',
                                                '<span class="menu__item-link-content">',
                                                (d.item.icon && d.item.icon != 'null' ? '<span class="icon ' + d.item.icon + '"></span>' : ''),
                                                '<span class="menu__item-text">' + d.item.name + '</span>',
                                                '</span>',
                                                '</a>',
                                                '</li>'
                                            ].join(''));
                                            $menu__item.on('click', function(e){
                                                console.log(d.item.id);
                                                if (!d._loaded) {
                                                    renderDataPanel(d);
                                                }
                                                that.data._el.card__middle.find('.tabs__pane').hide();
                                                that.data._el.card__middle.find('.tabs__pane[data-id="' + d.item.id + '"]').show();
                                            });
                                        }
                                    }
                                    container.append($menu__item);
                                }
                            });
                            return result;
                        }
                        function renderDataPanel(d){
                            //set flag loaded
                            d._loaded = true;

                            //render panel
                            var $tab = $('<div class="tabs__pane tabs__pane_active" data-id="' + d.item.id + '"></div>').hide();
                            that.data._el.tabs.push($tab);
                            that.data._el.card__middle_inner.append($tab);

                            // render images
                            d.child.forEach(function(d) {
                                var item = d.item;
                                var _guid = item.url.replace('/asyst/api/file/get/','')
                                var _slash = _guid.indexOf('/');
                                _guid = _guid.substring(0,_slash);
                                item.guid = _guid;
                                renderImageBlock(item, $tab);
                            });
                            function renderImageBlock(item, cont){
                                var $imageblock = $([
                                    '<div class="gallery__image-block" data-url="' + item.url + '">',
                                    '<a class="gallery__image-link" href="' + item.url + '"',
                                        'data-description="' + item.description + '"',
                                        'data-lightbox="lightbox-' + item.parentid + '">',
                                    '<div class="spinner spinner_align_center"></div>',
                                    '<div class="gallery__image"></div>',
                                    '<div class="gallery__filename"></div>',
                                    '</a></div>'
                                ].join('')).appendTo(cont);
                                $imageblock.find('.spinner').show();
                                $imageblock.find('.gallery__image').css('opacity', 0);
                                $imageblock.find('.gallery__image').css('background-image', 'url(/converter/converter?file=' + item.guid + ')');
                                //$imageblock.find('.gallery__image').css('background-image', 'url(' + item.url + ')');
                                var tempImg = new Image();
                                tempImg.src = '/converter/converter?file=' + item.guid;
                                //tempImg.src = item.url;
                                tempImg.onload = function() {
                                    $imageblock.find('.gallery__image').css('opacity', 1);
                                    $imageblock.find('.spinner').hide();
                                };
                            }
                        }
                    };

                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                        self.find('[data-tooltip]').tooltip();
                    };
                    that.init = function(){
                        that.nulls();
                        that.prepare();
                        that.prerender();
                        that.render();
                        that.init_components();
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
    $.fn.gallery = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.gallery' );
        }
    };
})( jQuery );