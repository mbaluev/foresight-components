(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'gallery', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        title: 'Фотогалерея',
                        items: []
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        target: self,
                        card: $('<div class="card" data-fc="card"></div>'),
                        card__header: $('<div class="card__header"></div>'),
                        card__header_row: $('<div class="card__header-row"></div>'),
                        card__header_column: $([
                            '<div class="card__header-column">',
                                '<label class="card__name">',
                                '<span class="card__name-text">' + that.data.title + '</span>',
                                '</label>',
                            '</div>'
                        ].join('')),
                        card__header_column_search: $('<div class="card__header-column card__header-element_stretch"></div>'),
                        input: $([
                            '<span class="input input__has-clear card__header-element_stretch" data-fc="input">',
                                '<span class="input__box">',
                                    '<span class="alertbox" data-fc="alertbox">',
                                        '<span class="icon icon_svg_search"></span>',
                                    '</span>',
                                    '<input type="text" class="input__control">',
                                    '<button class="button" type="button" data-fc="button" tabindex="-1">',
                                        '<span class="icon icon_svg_close"></span>',
                                    '</button>',
                                '</span>',
                            '</span>',
                        ].join('')),
                        button_toggle_left: $([
                            '<button class="button" type="button" data-fc="button" data-toggle="left">',
                            '<span class="icon icon_svg_double_right"></span>',
                            '</button>'
                        ].join('')),
                        card__main: $('<div class="card__main"></div>'),
                        card__left: $('<div class="card__left"></div>'),
                        card__backdrop: $('<div class="card__backdrop"></div>'),
                        card__middle: $('<div class="card__middle"></div>'),
                        card__middle_scroll: $('<div class="card__middle-scroll"></div>'),
                        card__middle_inner: $('<div class="card__middle-inner"></div>'),
                        menu: $('<div class="menu menu_color_light" data-fc="menu"></div>'),
                        tabs: []
                    };
                    that.data.private = {
                        datatree: [],
                        datalevel: -1,
                        search: {
                            text: null,
                            timer: null
                        }
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

                    that.render = function(){
                        that.data._el.target.append(
                            that.data._el.card.append(
                                that.data._el.card__header.append(
                                    that.data._el.card__header_row.append(
                                        that.data._el.card__header_column.prepend(
                                            that.data._el.button_toggle_left
                                        ),
                                        that.data._el.card__header_column_search.append(
                                            that.data._el.input
                                        )
                                    )
                                ),
                                that.data._el.card__main.append(
                                    that.data._el.card__left.append(
                                        that.data._el.menu
                                    ),
                                    that.data._el.card__middle.append(
                                        that.data._el.card__middle_scroll.append(
                                            that.data._el.card__middle_inner
                                        )
                                    ),
                                    that.data._el.card__backdrop
                                )
                            )
                        );
                    };
                    that.render_data = function(){
                        var $menu__list = $('<ul class="menu__list"></ul>');
                        renderMenu(that.data.private.datatree, $menu__list);
                        that.data._el.menu.append($menu__list);
                        that.data._el.menu.menu();
                        function renderMenu(data, container){
                            var result = false,
                                padding = 10;
                            data.forEach(function(d){
                                if (!d.item.fileid) {
                                    result = true;
                                    padding = 10;
                                    for (var i = 0; i < d.item.level; i++) { padding += 20; }
                                    //d.item.icon = 'icon_svg_folder';
                                    var $menu__item = $([
                                            '<li class="menu__item" id=' + d.item.id + '>',
                                            '<a class="menu__item-link link" style="padding-left: '+ padding +'px">',
                                            '<span class="menu__item-link-content">',
                                                '<span class="menu__icon icon icon_animate icon_svg_right"></span>',
                                                (d.item.icon && d.item.icon != 'null' ? '<span class="icon ' + d.item.icon + '"></span>' : ''),
                                                '<span class="menu__item-text">' + d.item.name + '</span>',
                                            '</span>',
                                            '</a>',
                                            '</li>'
                                        ].join(''));
                                    var $menu__submenu = $('<div class="menu menu__submenu-container"></div>');
                                    var $menu__list = $('<ul class="menu__list menu__submenu"></ul>');
                                    $menu__item.append(
                                        $menu__submenu.append(
                                            $menu__list
                                        )
                                    );
                                    if (d.child) {
                                        if (!renderMenu(d.child, $menu__list)) {
                                            d.item.icon = 'icon_svg_images';
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
                                                    renderPanel(d);
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
                        function renderPanel(d){
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
                        }
                        function renderImageBlock(item, cont){
                            var $imageblock = $([
                                '<div class="gallery__image-block" data-url="' + item.url + '">',
                                '<a class="gallery__image-link" href="' + item.url + '"',
                                'data-description="' + item.description + '"',
                                'data-lightbox="lightbox-' + item.parentid + '">',
                                '<div class="spinner spinner_align_center"></div>',
                                '<div class="gallery__image"></div>',
                                '<div class="gallery__error">',
                                '<div class="icon icon_svg_close"></div>',
                                '<div class="gallery__error-info">Ошибка</div>',
                                '</div>',
                                '<div class="gallery__filename"></div>',
                                '</a></div>'
                            ].join('')).appendTo(cont);
                            $imageblock.find('.spinner').show();
                            $imageblock.find('.gallery__image').css('opacity', 0);
                            $imageblock.find('.gallery__image').css('background-image', 'url(/converter/converter?file=' + item.guid + ')');
                            var tempImg = new Image();
                            tempImg.src = '/converter/converter?file=' + item.guid;
                            tempImg.onload = function() {
                                $imageblock.find('.spinner').hide();
                                $imageblock.find('.gallery__image').css('opacity', 1);
                            };
                            tempImg.onerror = function() {
                                $imageblock.find('.spinner').hide();
                                $imageblock.find('.gallery__image').hide();
                                $imageblock.find('.gallery__error').css('display', 'flex');
                                $imageblock.find('.gallery__image-link').on('click', function(e){
                                    e.preventDefault();
                                    return false;
                                }).removeAttr('data-lightbox');
                            };
                        }
                    };
                    that.filter = function(){
                        filter(that.data.private.datatree, that.data.private.search.text.toLowerCase().trim());
                        function filter(arr, text){
                            arr.map(function(d){
                                if (d.item.name.toLowerCase().indexOf(text) >= 0) {
                                    self.find('.menu__item' + '#' + d.item.id).show();
                                } else {
                                    self.find('.menu__item' + '#' + d.item.id).hide();
                                }
                            });
                        }
                    };
                    that.bind = function(){
                        that.data._el.input.on('keyup', function(){
                            clearTimeout(that.data.private.search.timer);
                            that.data.private.search.text = $(this).input('value');
                            that.data.private.search.timer = setTimeout(that.filter, 300);
                        });
                    };

                    that.init_components = function(){
                        self.find('[data-fc="card"]').card();
                        self.find('[data-fc="button"]').button();
                        self.find('[data-tooltip]').tooltip();
                        self.find('[data-fc="input"]').input();
                    };
                    that.init = function(){
                        that.nulls();
                        that.prepare();
                        that.render();
                        that.render_data();
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