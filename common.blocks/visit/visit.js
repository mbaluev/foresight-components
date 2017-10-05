(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'visit', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        title: 'Паспорта регионов',
                        items: [],
                        headerRenderer: null
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data.private = {
                        subjects: [],
                        sections: [],
                        items: []
                    };
                    that.data.current = {
                        subject: null,
                        section: null,
                        groupings: [],
                        item: null
                    };
                    that.data._el = {
                        target: self,
                        card: $('<div class="card"></div>'),
                        card__header: $([
                            '<div class="card__header">',
                                '<div class="card__header-row">',
                                    '<div class="card__header-column">',
                                        '<label class="card__name">',
                                        '<span class="card__name-text">'+ that.data.title +'</span>',
                                        '</label>',
                                    '</div>',
                                    '<div class="card__header-column" id="subjects"></div>',
                                '</div>',
                            '</div>'
                        ].join('')),
                        card__header_row_tabs: $([
                            '<div class="card__header-row tabs">',
                            '<ul class="tabs__list"></ul>',
                            '</div>'
                        ].join('')),
                        card__main: $('<div class="card__main" style="padding-top: 10px;"></div>'),
                        card__left: $('<div class="card__left"></div>'),
                        card__middle: $('<div class="card__middle" style="border-top: solid 1px #eee;"></div>'),
                        card__middle_scroll: $('<div class="card__middle-scroll"></div>'),
                        card__middle_inner: $('<div class="card__middle-inner"></div>'),
                        menu: $('<div class="menu menu_color_light" data-fc="menu"></div>'),

                        select: $('<select class="select" data-fc="select" data-mode="radio" data-width="300" data-autoclose="true"></select>'),
                        tabs__list: $('<ul class="tabs__list"></ul>'),
                        tabs: [],
                        loader: $('<span class="spinner spinner_align_center"></span>')
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

                    that.render = function(){
                        that.data._el.target.append(
                            that.data._el.card.append(
                                that.data._el.card__header,
                                that.data._el.card__main.append(
                                    that.data._el.card__left.append(
                                        that.data._el.menu
                                    ),
                                    that.data._el.card__middle
                                )
                            )
                        );
                    };
                    that.render_select = function(){
                        that.loader_add();
                        var distinct = {};
                        that.data.private.subjects = [];
                        that.data.items.map(function(d){
                            if (d.subjectnameid in distinct) {
                                distinct[d.subjectnameid]++;
                            } else {
                                distinct[d.subjectnameid] = 1;
                                that.data.private.subjects.push({
                                    subjectname: d.subjectname,
                                    subjectnameid: d.subjectnameid
                                });
                            }
                        });
                        that.data.current.subject = that.data.private.subjects[0];
                        that.data.private.subjects.map(function(d){
                            that.data._el.select.append('<option value="' + d.subjectnameid + '">' + d.subjectname + '</option>');
                        });

                        that.data._el.card__header.find('#subjects').append( that.data._el.select );
                        that.data._el.select.select();
                        that.data._el.select.on('change', function(){
                            var value = $(this).select('value');
                            that.data.current.subject = that.data.private.subjects.filter(function(d){ return d.subjectnameid == value; })[0];
                            that.data.current.subjectnameid = value;
                            that.render_tabs();
                        });
                        that.data._el.select.select('check', that.data.current.subject.subjectnameid);
                        that.loader_remove();
                    };
                    that.render_tabs = function(){
                        that.loader_add();
                        that.data._el.card__middle.empty();
                        that.data._el.card__header_row_tabs.remove();
                        that.data._el.card__header_row_tabs.find('.tabs__list').empty();

                        var distinct = {};
                        that.data.private.sections = [];
                        that.data.items.map(function(d){
                            if (d.sectionnameid in distinct) {
                                distinct[d.sectionnameid]++;
                            } else {
                                distinct[d.sectionnameid] = 1;
                                that.data.private.sections.push({
                                    sectionname: d.sectionname,
                                    sectionnameid: d.sectionnameid
                                });
                            }
                        });
                        that.data.current.section = that.data.private.sections[0];
                        that.data.private.sections.map(function(d,i){
                            var $tab = $([
                                '<li class="tabs__tab'+ (i == 0 ? ' tabs__tab_active' : '') +'" data-id="'+ d.sectionnameid +'">',
                                '<a class="tabs__link link" href="#section_'+ d.sectionnameid +'" data-fc="tab">',
                                '<button class="button" data-fc="button" style="width: auto;">',
                                '<span class="button__text">'+ d.sectionname +'</span>',
                                '</button>',
                                '</a>',
                                '</li>'
                            ].join(''));
                            $tab.on('click', function(){
                                var value = $(this).attr('data-id');
                                that.data.current.section = that.data.private.sections.filter(function(d){ return d.sectionnameid == value; })[0];
                                that.data.current.sectionnameid = value;
                                that.render_menu();
                            });
                            that.data._el.card__header_row_tabs.find('.tabs__list').append($tab);
                        });

                        that.data._el.card__header.append(that.data._el.card__header_row_tabs);
                        that.data._el.card__header_row_tabs.find('[data-fc="tab"]').tabs();
                        that.data._el.card__header_row_tabs.find('.tabs__tab[data-id="'+ that.data.current.section.sectionnameid +'"]').trigger('click');
                        that.loader_remove();
                    };
                    that.render_menu = function(){
                        that.loader_add();
                        that.data._el.card__middle.empty();
                        that.data._el.menu.menu();
                        that.data._el.menu.menu('destroy');
                        that.data._el.menu.empty();

                        that.data.private.items = that.data.items.filter(function(d){
                            return (d.subjectnameid == that.data.current.subject.subjectnameid &&
                                    d.sectionnameid == that.data.current.section.sectionnameid);
                        });

                        var distinct = {};
                        that.data.current.groupings = [];
                        that.data.private.items.map(function(d){
                            if (d.groupingnameid in distinct) {
                                distinct[d.groupingnameid]++;
                            } else {
                                distinct[d.groupingnameid] = 1;
                                that.data.current.groupings.push({
                                    groupingname: d.groupingname,
                                    groupingnameid: d.groupingnameid
                                });
                            }
                        });

                        var $menu__list = $('<ul class="menu__list"></ul>');
                        that.data.current.groupings.map(function(d){
                            var $menu__item = $([
                                '<li class="menu__item" id=' + d.groupingnameid + '>',
                                    '<a class="menu__item-link link">',
                                    '<span class="menu__item-link-content">',
                                        '<span class="menu__item-text">' + d.groupingname + '</span>',
                                        '<span class="menu__icon icon icon_animate icon_svg_right_white"></span>',
                                    '</span>',
                                    '</a>',
                                    '<div class="menu menu__submenu-container">',
                                        '<ul class="menu__list menu__submenu"></ul>',
                                    '</div>',
                                '</li>'
                            ].join(''));
                            that.data.private.items.map(function(item){
                                if (item.groupingnameid == d.groupingnameid) {
                                    var $menu__subitem = $([
                                        '<li class="menu__item" id=' + item.nameid + '>',
                                        '<a class="menu__item-link link">',
                                        '<span class="menu__item-link-content">',
                                            '<span class="menu__item-text">' + item.name + '</span>',
                                        '</span>',
                                        '</a>',
                                        '</li>'
                                    ].join(''));
                                    $menu__item.find('.menu__list').append($menu__subitem);
                                    $menu__subitem.find('.menu__item-link').on('click', function(){
                                        that.data.current.item = item;
                                        that.render_iframe();
                                    });
                                }
                            });
                            $menu__list.append($menu__item);
                        });
                        that.data._el.menu.append($menu__list);
                        that.data._el.menu.menu();
                        that.loader_remove();
                    };
                    that.render_iframe = function(){
                        that.data._el.card__middle.empty();
                        var $iframe_container = $([
                            '<div class="visit__iframe-container">',
                            '<div class="spinner spinner_align_center"></div>',
                            '</div>'
                        ].join(''));
                        that.data._el.card__middle.append($iframe_container);

                        var image = new Image();
                        image.onload = function(){
                            $iframe_container.find('.spinner').remove();
                            $iframe_container.append(
                                $('<iframe id="frame" ischartsinit="chart" src="' + that.data.current.item.link + '"></iframe>')
                            );
                        };
                        image.onerror = function(){
                            $iframe_container.text('error');
                            $iframe_container.find('.spinner').remove();
                        };
                        image.src = that.data.current.item.link;
                    };

                    that.loader_add = function(container){
                        if (!container) {
                            that.data._el.target.before(that.data._el.loader);
                        } else {
                            container.before(that.data._el.loader);
                        }
                    };
                    that.loader_remove = function(){
                        that.data._el.loader.remove();
                    };

                    that.init_components = function(){
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="select"]').select();
                        self.find('[data-tooltip]').tooltip();
                    };
                    that.init = function(){
                        that.nulls();
                        that.render();
                        that.render_select();
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
    $.fn.visit = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.visit' );
        }
    };
})( jQuery );