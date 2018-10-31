(function($){
    var methods = {
        init : function(options) {
            return this.each(function(){
                var self = $(this), data = self.data('_widget');
                if (!data) {
                    self.data('_widget', { type: 'search', target : self });
                    var that = this.obj = {};
                    that.defaults = {
                        source: null,
                        func: function(){},
                        areas: 'entitysearch',
                        usesp: false,
                        search_delay: 300
                    };
                    that.data = self.data();
                    that.options = $.extend(true, {}, that.defaults, that.data, options);

                    /* save widget options to self.data */
                    self.data(that.options);

                    that.data._el = {
                        search: $('<div class="search"></div>'),
                        search__view: $('<div class="search__view search__view_hidden"></div>'),
                        search__backdrop: $('<div class="search__backdrop"></div>'),
                        search__dialog: $('<div class="search__dialog"></div>'),
                        search__header: $('<div class="search__header"></div>'),
                        search__header_row_input: $('<div class="search__header-row"></div>'),
                        input: $([
                            '<span class="input" data-fc="input" data-placeholder="Поиск">',
                            '<span class="input__box">',
                            '<span class="alertbox">',
                            '<span class="icon icon_svg_search_white"></span>',
                            '</span>',
                            '<input type="text" class="input__control">',
                            '<button class="button" data-fc="button" type="button" tabindex="-1" data-tooltip="Очистить">',
                            '<span class="icon icon_svg_close_white"></span>',
                            '</button>',
                            '</span>',
                            '</span>'
                        ].join('')),
                        search__header_row_filter: $('<div class="search__header-row"></div>'),
                        search__body: $('<div class="search__body"></div>'),
                        results: $('<table class="table"></table>')
                    };
                    that.data._private = {
                        timeout_id: null,
                        xhr: null,
                        search_text: null,
                        search_current_text: null,
                        search_results: null
                    };

                    that.destroy = function(){
                        that.hide();
                        setTimeout(function(){
                            self.removeData();
                            self.remove();
                        }, 500);
                    };
                    that.hide = function(){
                        if (that.data._el.search__view.hasClass('search__view_visible')) {
                            that.data._el.search__view.removeClass('search__view_visible');
                            setTimeout(function(){
                                that.data._el.search__view.addClass('search__view_hidden');
                                $(window).off('keyup.search');
                            }, 100);
                        }
                    };
                    that.show = function(){
                        that.data._el.search__view.removeClass('search__view_hidden');
                        setTimeout(function(){
                            that.data._el.search__view.addClass('search__view_visible');
                            that.focus();
                            that.bind_hide();
                        }, 100);
                    };
                    that.focus = function(){
                        that.data._el.input.input('focus');
                    };
                    that.render = function(){
                        $('body').append(
                            that.data._el.search.append(
                                that.data._el.search__view.append(
                                    that.data._el.search__backdrop,
                                    that.data._el.search__dialog.append(
                                        that.data._el.search__header.append(
                                            that.data._el.search__header_row_input.append(
                                                that.data._el.input
                                            )
                                        ),
                                        that.data._el.search__body
                                    )
                                )
                            )
                        );
                    };
                    that.render_error = function(text){
                        that.data._el.results.remove();
                        that.data._el.results = $(
                            '<table class="table"><thead><tr><td class="table__td_no_border">' + text + '</td></tr></thead></table>'
                        );
                        that.data._el.search__body.append(
                            that.data._el.results
                        );
                    };
                    that.render_results = function(data){
                        if (!jQuery.isArray(data)) {
                            that.render_error(Globa.RecordNotFound.locale());
                        } else {
                            if (data.length > 0) {
                                that.data._el.results.remove();
                                var table = $('<table class="table"></table>');
                                var tbody = $('<tbody></tbody>');
                                var tr = $('<tr></tr>');
                                var td = $('<td></td>');
                                var a = $('<a class="link"></a>');
                                data.map(function(d){
                                    if (d.hasOwnProperty('__type__') && (d.__type__ == 'filesearch' || d.__type__ == 'documentsearch')) {
                                        tbody.append(
                                            tr.clone().append(
                                                td.clone().text('Файл'),
                                                td.clone().append(
                                                    a.clone().text(d.Name)
                                                        .attr('href', d.Url)
                                                )
                                            )
                                        );
                                    } else {
                                        tbody.append(
                                            tr.clone().append(
                                                td.clone().text(d.EntityTitle),
                                                td.clone().append(
                                                    a.clone().text(d.Name)
                                                        .attr('href', '/asyst/' + d.EntityName + '/form/auto' + d.Id + '?mode=view&back' + encodeURIComponent(location.href))
                                                )
                                            )
                                        );
                                    }
                                });
                                that.data._el.search__body.append(
                                    that.data._el.results.empty().append(table.append(tbody))
                                );
                            } else {
                                that.render_error(Globa.RecordNotFound.locale());
                            }
                        }
                    };

                    that.search = function(){
                        that.data._private.search_text = that.data._el.input.input('value');
                        if (!that.data._private.search_text) {
                            this.clear();
                        } else {
                            if (that.data._private.timeout_id) {
                                clearTimeout(that.data._private.timeout_id);
                                that.data._private.timeout_id = null;
                            }
                            that.data._private.timeout_id = setTimeout(function(){
                                if (that.data._private.search_current_text != that.data._private.search_text) {
                                    if (that.data._private.xhr) {
                                        that.data._private.xhr.abort();
                                        that.data._private.xhr = null;
                                    }
                                    that.data._private.search_current_text = that.data._private.search_text;
                                    // processing

                                    that.data._private.timeout_id = null;
                                    var success = function(data) {
                                        that.data._private.xhr = null;
                                        that.render_results(data);
                                    };
                                    var error = function() {
                                        that.data._private.xhr = null;
                                    };
                                    var exists = function(namespace) {
                                        var tokens = namespace.split('.');
                                        return tokens.reduce(function(prev, curr) {
                                            return (typeof prev == "undefined") ? prev : prev[curr];
                                        }, window);
                                    };
                                    if (typeof exists(that.data.func) == 'function') {
                                        that.data._private.xhr = eval(that.data.func)(that.data._private.search_current_text,
                                            success, error, null, that.data.areas, that.data.usesp);
                                    } else {
                                        that.render_error('search method does not exist');
                                    }
                                }
                            }, that.data.search_delay);
                        }
                    };
                    that.clear = function(){
                        that.data._private.search_text = '';
                        that.data._private.search_current_text = '';
                        that.data._el.results.empty();
                    };

                    that.bind = function(){
                        if (that.data.source) {
                            that.data.source.on('click', that.show);
                            that.data._el.search__backdrop.on('click', that.hide);
                            that.bind_search();
                        }
                    };
                    that.bind_hide = function(){
                        $(window).on('keyup.search', function(e){
                            if (e.keyCode == 27) {
                                that.hide();
                            }
                        });
                    };
                    that.bind_search = function(){
                        var keyup = function (e) {
                            switch (e.keyCode) {
                                case 27: // escape
                                    that.hide();
                                    break;
                                default: // search
                                    that.search();
                            }
                            e.stopPropagation();
                            e.preventDefault();
                        };
                        var keydown = function (e) {
                            switch (e.keyCode) {
                                case 27: // escape
                                    e.preventDefault();
                                    break;
                                case 13: // enter. stop processing to prevent submit form
                                    e.preventDefault();
                                    break;
                            }
                            e.stopPropagation();
                        };
                        that.data._el.input.on('keydown keypress', keydown);
                        that.data._el.input.on('keyup', keyup);
                    };

                    that.init_components = function(){
                        self.find('[data-fc="alertbox"]').alertbox();
                        self.find('[data-fc="button"]').button({
                            popup_animation: false
                        });
                        self.find('[data-fc="checkbox"]').checkbox();
                        self.find('[data-fc="input"]').input({
                            popup_animation: false
                        });
                        self.find('[data-fc="radio"]').radio();
                        self.find('[data-fc="radio-group"]').radio_group();
                        self.find('[data-fc="select"]').select({
                            popup_animation: false,
                            autoclose: true
                        });
                        self.find('[data-fc="tab"]').tabs();
                        self.find('[data-fc="tumbler"]').tumbler();
                        self.find('[data-fc="widget"]').widget();
                    };
                    that.init = function(){
                        that.render();
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
        },
        hide : function() {
            return this.each(function() {
                this.obj.hide();
            });
        },
        show : function() {
            return this.each(function() {
                this.obj.show();
            });
        }
    };
    $.fn.search = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.search' );
        }
    };
})( jQuery );
