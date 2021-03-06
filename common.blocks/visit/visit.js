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
                        card: $('<div class="card" data-fc="card"></div>'),
                        card__header: $('<div class="card__header"></div>'),
                        card__header_row: $('<div class="card__header-row card__header-column_start"></div>'),
                        card__header_column: $([
                            '<div class="card__header-column">',
                            '<label class="card__name">',
                            '<span class="card__name-text">' + that.data.title + '</span>',
                            '</label>',
                            '</div>'
                        ].join('')),
                        card__header_column_subjects: $('<div class="card__header-column" id="subjects"></div>'),
                        button_toggle_left: $([
                            '<button class="button" type="button" data-fc="button" data-toggle="left">',
                            '<span class="icon icon_svg_double_right"></span>',
                            '</button>'
                        ].join('')),
                        card__header_row_tabs: $([
                            '<div class="card__header-row tabs">',
                            '<ul class="tabs__list"></ul>',
                            '</div>'
                        ].join('')),
                        card__main: $('<div class="card__main"></div>'),
                        card__left: $('<div class="card__left"></div>'),
                        card__middle: $('<div class="card__middle"></div>'),
                        visit__frame_container: $('<div class="visit__frame-container"></div>'),
                        menu: $('<div class="menu menu_color_light" data-fc="menu"></div>'),
                        select: $('<select class="select" data-fc="select" data-mode="radio" data-width="300" data-height="300" data-autoclose="true"></select>'),
                        tabs__list: $('<ul class="tabs__list"></ul>'),
                        tabs: [],
                        loader: $('<span class="spinner spinner_align_center"></span>')
                    };

                    that.destroy = function(){
                        self.removeData();
                        self.remove();
                    };
                    that.set_nulls = function(){
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
                    that.get_subjects = function(){
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
                    };
                    that.get_sections = function(){
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
                    };
                    that.get_items = function(){
                        that.data.private.items = that.data.items.filter(function(d){
                            return (d.subjectnameid == that.data.current.subject.subjectnameid &&
                            d.sectionnameid == that.data.current.section.sectionnameid);
                        });
                    };
                    that.get_groupings = function(){
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
                    };

                    that.render = function(){
                        that.data._el.target.append(
                            that.data._el.card.append(
                                that.data._el.card__header.append(
                                    that.data._el.card__header_row.append(
                                        that.data._el.card__header_column.prepend(
                                            that.data._el.button_toggle_left
                                        ),
                                        that.data._el.card__header_column_subjects
                                    )
                                ),
                                that.data._el.card__main.append(
                                    that.data._el.card__left.append(
                                        that.data._el.menu
                                    ),
                                    that.data._el.card__middle.append(
                                        that.data._el.visit__frame_container
                                    )
                                )
                            )
                        );
                    };
                    that.render_select = function(){
                        that.get_subjects();
                        if (!that.data.current.item) {
                            that.data.current.subject = that.data.private.subjects[0];
                        }
                        that.data.private.subjects.map(function(d){
                            that.data._el.select.append('<option value="' + d.subjectnameid + '">' + d.subjectname + '</option>');
                        });
                        that.data._el.card__header_column_subjects.append( that.data._el.select );
                        that.data._el.select.select();
                        that.data._el.select.on('change', function(){
                            var value = $(this).select('value');
                            that.data.current.subject = that.data.private.subjects.filter(function(d){ return d.subjectnameid == value; })[0];
                            that.render_tabs();
                        });
                        // select option
                        if (typeof that.data.current.subject != 'undefined') {
                            if (typeof that.data.current.subject.subjectnameid != 'undefined') {
                                that.data._el.select.select('check', that.data.current.subject.subjectnameid);
                            }
                        }
                    };
                    that.render_tabs = function(){
                        that.get_sections();
                        that.data._el.card__header_row_tabs.remove();
                        that.data._el.card__header_row_tabs.find('.tabs__list').empty();
                        if (!that.data.current.item) {
                            that.data.current.section = that.data.private.sections[0];
                        }
                        that.data.private.sections.map(function(d,i){
                            var $tab = $([
                                '<li class="tabs__tab'+ (d.sectionnameid == that.data.current.section.sectionnameid ? ' tabs__tab_active' : '') +'" data-id="'+ d.sectionnameid +'">',
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
                                if (that.data.current.item) {
                                    if (that.data.current.section.sectionnameid != that.data.current.item.sectionnameid) {
                                        that.data.current.item = null;
                                    }
                                }
                                that.render_menu();
                            });
                            that.data._el.card__header_row_tabs.find('.tabs__list').append($tab);
                        });
                        that.data._el.card__header.append(that.data._el.card__header_row_tabs);
                        that.data._el.card__header_row_tabs.find('[data-fc="tab"]').tabs();
                        // select tab
                        that.data._el.card__header_row_tabs.find('.tabs__tab[data-id="'+ that.data.current.section.sectionnameid +'"]').trigger('click');
                    };
                    that.render_menu = function(){
                        that.get_items();
                        that.get_groupings();
                        if (!that.data.current.item) {
                            that.data.current.item = that.data.private.items[0];
                        }
                        that.data._el.menu.menu();
                        that.data._el.menu.menu('destroy');
                        that.data._el.menu.empty();
                        var $menu__list = $('<ul class="menu__list"></ul>');
                        that.data._el.menu.append($menu__list);
                        that.data.current.groupings.map(function(d){
                            var $menu__item = $([
                                '<li class="menu__item" id=' + d.groupingnameid + '>',
                                    '<a class="menu__item-link link">',
                                    '<span class="menu__item-link-content">',
                                        '<span class="menu__icon icon icon_animate icon_svg_right"></span>',
                                        '<span class="menu__item-text">' + d.groupingname + '</span>',
                                    '</span>',
                                    '</a>',
                                    '<div class="menu menu__submenu-container">',
                                        '<ul class="menu__list menu__submenu"></ul>',
                                    '</div>',
                                '</li>'
                            ].join(''));
                            $menu__list.append($menu__item);
                            that.data.private.items.map(function(item){
                                if (item.groupingnameid == d.groupingnameid) {
                                    if (item.sectionnameid == 1) {
                                        item.icon = 'icon_svg_document';
                                    } else {
                                        item.icon = 'icon_svg_chart';
                                    }
                                    var $menu__subitem = $([
                                        '<li class="menu__item" id=' + item.nameid + '>',
                                        '<a class="menu__item-link link">',
                                        '<span class="menu__item-link-content">',
                                            (item.icon && item.icon != 'null' ? '<span class="icon ' + item.icon + '"></span>' : ''),
                                            '<span class="menu__item-text">' + item.name + '</span>',
                                        '</span>',
                                        '</a>',
                                        '</li>'
                                    ].join(''));
                                    $menu__item.find('.menu__list').append($menu__subitem);
                                    $menu__subitem.find('.menu__item-link').on('click', function(){
                                        that.data.current.item = item;
                                        that.render_item();
                                    });
                                    if (that.data.current.item) {
                                        if (that.data.current.item.name == item.name) {
                                            that.data.current.item = item;
                                            $menu__item.children('.menu__item-link').addClass('menu__item-link_selected');
                                            $menu__item.children('.menu__item-link').find('.menu__icon').addClass('icon_rotate_0deg');
                                            $menu__item.find('.menu').css('display', 'block');
                                            $menu__subitem.find('.menu__item-link').addClass('menu__item-link_selected');
                                            $menu__subitem.find('.menu__item-link').trigger('click');
                                        }
                                    }
                                }
                            });
                        });
                        that.data._el.menu.menu();
                    };
                    that.render_item = function(){
                        if (that.data.onItemClick) {
                            if (typeof(that.data.onItemClick) == 'function') {
                                that.data.onItemClick(
                                    that.data.current,
                                    that.data._el.visit__frame_container
                                );
                            }
                        }
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
                        self.find('[data-fc="card"]').card();
                        self.find('[data-fc="button"]').button();
                        self.find('[data-fc="select"]').select();
                        self.find('[data-tooltip]').tooltip();
                    };
                    that.init = function(){
                        that.set_nulls();
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