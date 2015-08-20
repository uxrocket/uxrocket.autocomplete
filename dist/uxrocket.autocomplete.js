/**
 * UX Rocket
<<<<<<< HEAD
 * jQuery based accordion
 * @author Bilal Cinarli
 * @dependency jQueryUI Autocomplete
 * @dependency Handlebars
 * @dependency UX Rocket Clear
 */

;
(function($) {
    var ux, // local shorthand

        defaults = {
            type             : "list",
            item             : 10,
            service          : null,
            minLength        : 2,
            formdata         : null,
            categoryTextLimit: 25,
            queryType        : 'GET',
            hidden           : null,
            template         : null,
            highlight        : true,
            arrowSelection   : false,
            arrowNavigation  : true,
            cache            : false,

            // callbacks
            onReady      : false,
            onSelect     : false,
=======
 * jQuery based autocomplete
 * @author Bilal Cinarli
 * @dependency Handlebars
 */

(function(factory) {
    'use strict';
    if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if(typeof exports === 'object' && typeof require === 'function') {
        // Browserify
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    'use strict';

    var ux, // local shorthand
        i = 1,
        rocketName = 'uxrAutocomplete',

        defaults = {
            type           : 'list',
            item           : 10,
            service        : null,
            minLength      : 2,
            queryType      : 'GET',
            formdata       : null,
            hidden         : null,
            template       : null,
            highlight      : true,
            arrowSelection : false,
            arrowNavigation: true,
            cache          : false,

            // callbacks
            onReady      : false,
            onSearch     : false,
            onSelect     : false,
            onEnter      : false,
>>>>>>> 2.x
            onButtonClick: false,
            onClearCache : false,
            onUpdate     : false,
            onRemove     : false
        },
<<<<<<< HEAD

        templates = {
            list    : {
                wrap: '<ul></ul>',
                item: '' +
                      '<li>' +
=======
        templates = {
            list    : {
                item: '' +
                      '<li class="uxr-autocomplete-list-item">' +
>>>>>>> 2.x
                      '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                      '       {{{name}}}' +
                      '       {{#if title}}' +
                      '       <br /><em>{{substr title 50}}</em>' +
                      '       {{/if}}' +
                      '   </a>' +
                      '</li>'
            },
            image   : {
<<<<<<< HEAD
                wrap: '<ul></ul>',
                item: '' +
                      '<li>' +
=======
                item: '' +
                      '<li class="uxr-autocomplete-list-item">' +
>>>>>>> 2.x
                      '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                      '       <span class="item-image"><img src="{{image}}"/></span> ' +
                      '       {{{name}}}' +
                      '       {{#if title}}' +
                      '       <br /><em>{{substr title 50}}</em>' +
                      '       {{/if}}' +
                      '   </a>' +
                      '</li>'
            },
            category: {
<<<<<<< HEAD
                wrap: '<ul></ul>',
                head: '' +
                      '<li class="uxitd-autocomplete-category ui-autocomplete-category">' +
                      '   <span class="uxitd-category-head" title="{{category}}">{{substr category 25}}</span>' +
                      '</li>',
                item: '' +
                      '<li>' +
                      '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                      '       {{{name}}}' +
                      '       {{#if title}}' +
                      '       <br /><em>{{substr title 50}}</em>' +
                      '       {{/if}}' +
=======
                head: '' +
                      '<li class="uxr-autocomplete-category">' +
                      '   <span class="uxr-autocomplete-category-head" title="{{category}}">{{substr category 25}}</span>' +
                      '</li>',
                item: '' +
                      '<li class="uxr-autocomplete-list-item">' +
                      '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                      '       {{{name}}}' +
>>>>>>> 2.x
                      '   </a>' +
                      '</li>'
            },
            tree    : {
<<<<<<< HEAD
                wrap: '<ul></ul>',
                head: '' +
                      '<li class="uxitd-autocomplete-category ui-autocomplete-category">' +
                      '   <span class="uxitd-category-head" title="{{category}}">{{substr category 25}}</span>' +
                      '</li>',
                item: '' +
                      '<li>' +
                      '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                      '       <span class="item-image"><img src="{{image}}"/></span> ' +
                      '       {{{name}}}' +
                      '       {{#if title}}' +
                      '       <br /><em>{{substr title 50}}</em>' +
                      '       {{/if}}' +
=======
                head: '' +
                      '<li class="uxr-autocomplete-category">' +
                      '   <span class="uxr-autocomplete-category-head" title="{{category}}">{{substr category 25}}</span>' +
                      '</li>',
                item: '' +
                      '<li class="uxr-autocomplete-list-item">' +
                      '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                      '       <span class="item-image"><img src="{{image}}"/></span> ' +
                      '       {{{name}}}' +
>>>>>>> 2.x
                      '   </a>' +
                      '</li>'
            }
        },
        events = {
<<<<<<< HEAD
            click   : 'click.uxAutocomplete',
            search  : 'autocompletesearch.uxAutocomplete',
            response: 'autocompleteresponse.uxAutocomplete'
        },
        ns = {
            rocket    : 'uxRocket',
            data      : 'uxAutocomplete',
            ready     : 'uxitd-autocomplete-ready',
            rocketWrap: 'uxitd-plugin-wrap',
            wrap      : 'uxitd-autocomplete-wrap',
            icon      : 'icon-search',
            loading   : 'icon-loading'
        };

    var AutoComplete = function(el, options, selector) {
        var $el = $(el),
            opts = $.extend({}, defaults, options, $el.data(), {'selector': selector});

        // terms object for caching
        opts.terms = {};

        $el.data(ns.data, opts);

        // set element layout
        setLayout($el);

        // call Ready Callback
        callback(opts.onReady);

        // bind actions
        bindUIActions($el);

        // set template actions
        setTemplate($el);
    };

    var setLayout = function($el) {
        var columns,
            _opts = $el.data(ns.data);

        columns = ' ' + $el.context.className.replace(ns.ready, '');

        if(_opts.selector.charAt(0) == '.') {
            columns = columns.replace(' ' + _opts.selector.substr(1), '');
            columns = columns.replace(_opts.selector.substr(1) + ' ', '');
        }

        if($el.parent().is('.' + ns.rocketWrap)) {
            $el.parent().addClass(ns.wrap + columns + ' group');
        }
        else {
            $el.wrap('<span class="' + ns.rocketWrap + ' ' + ns.wrap + columns + ' group"></span>');
        }

        $el.after('<i class="' + ns.icon + '"></i>');
    };

    var setSource = function($el) {
        var _opts = $el.data(ns.data),
            fdata = null,
            url_pattern = /^(http|https|\/|\.\/|\.\.\/)/,
            source = _opts.service,
            sourceFunction;


        if(!url_pattern.test(source) || typeof source === "object") {
            if(typeof source === "string") {
                // we get source from "data-service" attribute,
                // so we need to change its format to js array
                source = eval(source);
            }
            // in older versions the js array or json object should
            // encapsulated with "itemList" node.
            var items = source.itemList || source;

            sourceFunction = function(request, response) {
                // check if element is active or not : fix for IE
                if(!$el.is(':focus')) {
                    return;
                }

                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");

                response($.map(items, function(item) {
                    if(matcher.test(item.name)) {
                        return setItem(item);
                    }
                }));
            };
        }
        else {
            sourceFunction = function(request, response) {
                var term = request.term;

                // check if element is active or not : fix for IE
                if(!$el.is(':focus')) {
                    return;
                }

                if(_opts.cache && term in _opts.terms) {
                    var items = _opts.terms[term].itemList || _opts.terms[term];

                    response($.map(items.slice(0, _opts.item), function(item) {
                        return setItem(item);
                    }));
                    return;
                }

                if(_opts.formdata != null) {
                    fdata = $(_opts.formdata).serialize();
                }

                $.ajax({
                    url     : source,
                    dataType: 'json',
                    type    : _opts.queryType,
                    data    : {
                        type    : _opts.type,
                        term    : term,
                        formdata: fdata
                    },
                    success : function(data) {
                        if(_opts.cache) {
                            _opts.terms[term] = data;
                            $el.data(ns.data, _opts);
                        }

                        var items = data.itemList || data;

                        response($.map(items.slice(0, _opts.item), function(item) {
                            return setItem(item);
                        }));
                    }
                });
            };
        }

        return sourceFunction;
    };

    var bindUIActions = function($el) {
        var _opts = $el.data(ns.data);

        if(typeof _opts.props !== 'undefined' && _opts.props != '') {
            var props = _opts.props.split(':');

            $el.next('.' + ns.icon).addClass('uxitd-autocomplete-icon-clickable').on(events.click, function(e) {
                e.preventDefault();
                eval(props[1]);
            });
        }

        if(_opts.onButtonClick !== false) {
            $el.next('.' + ns.icon).on(events.click, function() {
                callback(_opts.onButtonClick);
            });
        }

        $el.on(events.search, function(event, ui) {
            $(this).siblings('.' + ns.icon).addClass(ns.loading);
        });

        $el.on(events.response, function(event, ui) {
            $(this).siblings('.' + ns.loading).removeClass(ns.loading);
        });

        $el.autocomplete({
            open     : function(event, ui) {
                $(".uxitd-autocomplete-category").removeClass('ui-menu-item');

                $(this).autocomplete("widget").css({
                    "width": ($(this).outerWidth() + "px")
                });
            },
            minLength: _opts.minLength,
            source   : setSource($el),
            focus    : function(event, ui) {
                if(!_opts.arrowNavigation) {
                    event.preventDefault();
                }
            },
            select   : function(event, ui) {
                if(_opts.hidden != null) {
                    $(_opts.hidden).val(ui.item.id);
                }

                if(_opts.arrowSelection === true && event.keyCode == 13 && typeof ui.item.url !== 'undefined') {
                    // check if target is blank or not
                    var _target = $("#" + event.currentTarget.id).find(".ui-state-focus a").attr("target");

                    if(_target == '_blank') {
                        window.open(ui.item.url);
                    }
                    else {
                        window.location = ui.item.url;
                    }
                }

                callback(_opts.onSelect);
            }
        });
    };

    var setTemplate = function($el) {
        var autocomplete = $el.data("uiAutocomplete") ? $el.data("uiAutocomplete") : $el.data("ui-autocomplete"),
            _opts = $el.data(ns.data),
            template = {};

        if(_opts.template === null) {
            switch(_opts.type) {
                default:
                case 'list':
                    template = templates.list;
                    break;
                case 'image':
                    template = templates.image;
                    break;
                case 'category':
                    template = templates.category;
                    break;
                case 'tree':
                    template = templates.tree;
                    break;
            }
        }

        else {
            template = _opts.template;
        }

        autocomplete._renderMenu = function(ul, items) {
            var _this = this,
                _list = [],
                currentCategory = "";

            $.each(items, function(index, item) {
                var temp;

                if((_opts.type == 'category' || _opts.type == 'tree') && typeof item.category !== 'undefined' && item.category != currentCategory) {

                    var categoryHead = Handlebars.compile(template.head)(item);

                    _list.push(categoryHead);
=======
            click: 'click.' + rocketName,
            keyup: 'keyup.' + rocketName,
            blur : 'blur.' + rocketName
        },
        keys = {
            codes : {
                13: 'return',
                27: 'esc',
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            },
            return: 13,
            esc   : 27,
            left  : 37,
            up    : 38,
            right : 39,
            down  : 40
        },
        ns = {
            prefix : 'uxr-',
            rocket : 'uxRocket',
            data   : rocketName,
            name   : 'autocomplete',
            wrap   : 'uxr-plugin-wrap',
            classes: {
                wrap     : 'wrap',
                ready    : 'ready',
                magnify  : 'magnify',
                loading  : 'loading',
                select   : 'select',
                category : 'category',
                option   : 'option',
                matched  : 'matched',
                highlight: 'highlight',
                selected : 'selected'
            }
        };

    // Constructor Method
    var Autocomplete = function(el, options, selector) {
        var $el = $(el);

        this._instance = i;
        this._name = rocketName;
        this._defaults = defaults;

        this.el = el;
        this.$el = $el;
        this.id = 'uxr-autocomplete-select-' + i;

        this.selector = selector;
        this.terms = {};
        this.options = $.extend(true, {}, defaults, options, $el.data());

        i++;

        this.lastTerm = 'as';

        this.init();
    };

    $.extend(Autocomplete.prototype, {
        init         : function() {
            var uxrocket = this.$el.data(ns.rocket) || {};

            // add ready class
            this.$el.addClass(utils.getClassname('ready'));

            // register plugin data to rocket
            uxrocket[ns.data] = {hasWrapper: true, wrapper: ns.wrap, ready: utils.getClassname('ready'), selector: this.selector, options: this.options};
            this.$el.data(ns.rocket, uxrocket);


            // set plugin layout
            this.setLayout();

            this.prepareContainer();
            this.prepareSource();

            utils.callback(this.options.onReady);

            this.bindUIActions();
            this.setTemplate();
        },
        handleClasses: function() {
            this.classList = this.$el.context.className.replace(utils.getClassname('ready'), '');

            if(this.selector.charAt(0) === '.') {
                this.classList = this.classList.replace(this.selector.substr(1), '');
            }

            this.classList += ns.wrap + ' ' + utils.getClassname('wrap');
            this.classList = $.trim(this.classList);
        },

        removeClasses: function() {
            this.$el.removeClass(utils.getClassname('ready'));
            this.$el.parent().removeClass(this.classList.replace(ns.wrap, ''));
        },

        handleWrapper: function() {
            this.$el.parent().is('.' + ns.wrap) ?
            this.$el.parent().addClass(this.classList) :
            this.$el.wrap('<span class="' + this.classList + '"></span>');
        },

        addIcon: function() {
            this.$el.after('<i class="' + utils.getClassname('magnify') + '"></i>');
            this.$icon = this.$el.next('.' + utils.getClassname('magnify'));
        },

        setLayout: function() {
            this.handleClasses();
            this.handleWrapper();
            this.addIcon();
        },

        startLoading: function() {
            this.$icon.addClass(utils.getClassname('loading'));
        },

        stopLoading: function() {
            this.$icon.removeClass(utils.getClassname('loading'));
        },

        removeLayout: function() {
            var _this = this,
                uxrocket = _this.$el.data(ns.rocket);

            // remove or reformat wrap
            if(Object.keys && Object.keys(uxrocket).length === 1) {
                _this.$el.unwrap();
            }

            else {
                _this.$el.parent().removeClass(ns.wrap);
            }

            _this.$el.next('.' + utils.getClassname('magnify')).remove();
        },

        setTemplate: function() {
            this.template = null;

            if(this.options.template === null) {
                this.template = templates[this.options.type] || templates.list;
            }
            else {
                this.template = this.options.template;
            }
        },

        bindUIActions: function() {
            var _this = this;

            _this.$el.on(events.keyup, function(e) {
                var val = $(this).val(),
                    _length = val.length;

                if(_length >= _this.options.minLength) {
                    _this.onKeyup(e);
                }

                if(_length === 0) {
                    _this.hideContainer();
                }
            });

            _this.$el.on(events.blur, function() {
                _this.onBlur();
            });

            _this.$list.on(events.click, '.' + utils.getClassname('option'), function(e) {
                e.preventDefault();
                _this.select(e);
            });
        },

        select: function($selected) {
            var selected = $selected instanceof jQuery ? $selected : $($selected.currentTarget);

            selected.siblings().removeClass(utils.getClassname('selected')).end().addClass(utils.getClassname('selected'));
            this.setValue(selected);
            this.hideContainer();

            utils.callback(this.options.onSelect);
        },

        setValue: function(selected) {
            var text = selected.text().trim();

            if(text === '') {
                text = this.lastTerm;
            }

            this.$el.val(text);
        },

        unbindUIActions: function() {
            this.$el.off('.' + rocketName);
        },

        onKeyup: function(e) {
            var _this = this;

            if(e.keyCode === keys.up || e.keyCode === keys.down) {
                this.onVerticalArrow(keys.codes[e.keyCode]);
            }

            else if(e.keyCode === keys.return) {
                if(this.$list.is(':visible')) {
                    this.select(this.$list.find('.' + utils.getClassname('highlight')));
                }
            }

            else if(e.keyCode === keys.esc) {
                this.hideContainer();
            }

            else {
                this.lastTerm = this.$el.val().toLowerCase();
                this.search();
            }
        },

        onBlur: function() {
            var _this = this;

            setTimeout(function(){
                _this.hideContainer();
            }, 150);
        },

        onVerticalArrow: function(updown) {
            var selected,
                direction = updown === 'up' ? 'prev' : 'next',
                highlighted = this.$list.find('.' + utils.getClassname('highlight'));

            if(!this.$list.is(':visible') && this.lastTerm.length >= this.options.minLength) {
                this.$list.show();
            }

            if(!highlighted.length) {
                selected = this.$list.find('.' + utils.getClassname('option')).first().addClass(utils.getClassname('highlight'));
            }

            else {
                selected = highlighted.removeClass(utils.getClassname('highlight'))[direction]().addClass(utils.getClassname('highlight'));
            }

            this.setValue(selected);
        },

        prepareContainer: function() {
            var $ul = $('<ul></ul>');

            this.setPosition($ul);

            $ul.attr('id', this.id).addClass(utils.getClassname('select')).css('display', 'none').appendTo('body');

            this.$list = $ul;
        },

        prepareSource: function() {
            var _this = this,
                rgx_url = /^(http|https|\/|\.\/|\.\.\/)/,
                source = this.options.service;

            this.source = source;

            if(typeof source === 'string') {
                if(!rgx_url.test(source)) {
                    this.source = utils.getStringVariable(source);
                }

                // there will be ajax
                else {
                    this.source = function() {
                        var fdata = _this.serializeForm();

                        $.ajax({
                            url     : source,
                            dataType: 'json',
                            type    : this.options.queryType,
                            data    : {
                                term    : this.lastTerm,
                                type    : this.options.type,
                                formdata: fdata
                            },
                            success : function(data) {
                                var items = data.itemList || data;

                                _this.showResults(items);
                            }
                        });
                    };
                }
            }
        },

        search: function() {
            var _this = this,
                results,
                haystack = this.source.itemList ? this.source.itemList : this.source;

            this.startLoading();

            if(this.isCached()) {
                this.showResults(this.terms[this.lastTerm]);
                return;
            }

            // ajax results or custom source function
            if(typeof haystack === 'function') {
                return haystack.apply(this);
            }

            // search in local source
            else {
                results = $.map(haystack, function(item) {
                    if(_this.searchArray(item, _this.lastTerm)) {
                        return item;
                    }
                });

                this.showResults(results);
            }
        },

        searchArray: function(item, needle) {
            return item.name.toLowerCase().indexOf(needle) > -1;
        },

        showResults: function(results) {
            var list = this.compileTemplate(results);

            // before show results, callback the onSearch function
            utils.callback(this.options.onSearch);

            this.cache(results);

            $('#' + this.id).html(list).show();

            this.stopLoading();
        },

        setPosition: function($ul) {
            var offset = this.$el.offset(),
                top = offset.top + this.el.offsetHeight,
                left = offset.left,
                width = this.el.offsetWidth;

            return $ul.css({top: top, left: left, minWidth: width});
        },

        hideContainer: function() {
            $('#' + this.id).delay(100).hide();
        },

        compileTemplate: function(results) {
            var _this = this,
                list = [],
                itemTemplate = Handlebars.compile(this.template.item),
                categoryTemplate = this.template.head ? Handlebars.compile(this.template.head) : false,
                currentCategory = '';

            $.each(results, function(index, item) {
                var rendered;

                rendered = _this.renderItem(item, itemTemplate);

                if((_this.options.type === 'category' || _this.options.type === 'tree') && typeof item.category !== 'undefined' && item.category !== currentCategory) {

                    var category = $(categoryTemplate(item));

                    category.addClass(utils.getClassname('category'))
                        .attr('role', 'presentation');

                    list.push(category);
>>>>>>> 2.x

                    currentCategory = item.category;
                }

<<<<<<< HEAD
                temp = _this._renderItemData(ul, item);

                _list.push(temp);
            });

            ul.append(_list);

            if(currentCategory != "") {
                ul.addClass('uxitd-category');
            }
        };

        autocomplete._create = function() {
            var _this = this;

            _this._super();
            _this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        };

        autocomplete._renderItemData = function(ul, item) {
            var rendered,
                listItem = Handlebars.compile(template.item)(item);

            rendered = listItem;

            if(_opts.highlight === true) {
                rendered = listItem.replace(
                    new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"),
                    '<span class="matched">$1</span>');
            }

            return $(rendered)
                .addClass('ui-menu-item')
                .data("ui-autocomplete-item", item)
                .attr('role', 'presentation');
        };
    };

    // fallback for 0.x.x versions
    var setItem = function(item) {
        if(typeof item.value === 'undefined') {
            item.value = item.name;
        }

        /**
         * Fallback for old data json format
         * @deprecated visiblename
         */
        if(typeof item.visiblename !== 'undefined') {
            item.value = item.visiblename;
        }

        return item;
    };

    // global callback
    var callback = function(fn) {
        // if callback string is function call it directly
        if(typeof fn === 'function') {
            fn.apply(this);
        }

        // if callback defined via data-attribute, call it via new Function
        else {
            if(fn !== false) {
                var func = new Function('return ' + fn);
                func();
            }
        }
    };

    // jquery bindings
    ux = $.fn.uxitdautocomplete = $.uxautocomplete = function(options) {
        var selector = this.selector;

        return this.each(function() {
            var $el = $(this),
                uxrocket = $el.data('uxRocket') || {},
                autocomplete;

            if($el.hasClass(ns.ready) || $el.hasClass(ns.rocketWrap)) {
                return;
            }

            $el.addClass(ns.ready);

            uxrocket[ns.data] = {'hasWrapper': true, 'wrapper': ns.wrap, 'ready': ns.ready, 'selector': selector, 'options': options};

            $el.data(ns.rocket, uxrocket);

            autocomplete = new AutoComplete(this, options, selector);
=======
                list.push(rendered);
            });

            return list;
        },

        renderItem: function(item, template) {
            var _this = this,
                rendered = template(item);

            if(_this.options.highlight === true) {
                rendered = rendered.replace(
                    new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + _this.lastTerm + ')(?![^<>]*>)(?![^&;]+;)', 'gi'),
                    '<span class="' + utils.getClassname('matched') + '">$1</span>');
            }

            return $(rendered)
                .addClass(utils.getClassname('option'))
                .data('uxrAutocompleteItem', item)
                .attr('role', 'presentation');
        },

        serializeForm: function() {
            return $(this.options.formdata).serialize();
        },

        cache: function(results) {
            // cache option set to true
            if(this.options.cache === true) {
                this.terms[this.lastTerm] = results;
            }
        },

        isCached: function() {
            var cached = false;

            if(this.terms[this.lastTerm] !== undefined) {
                cached = true;
            }

            return cached;
        },

        clearCache: function() {
            return ux.clearCache(this.el);
        },

        update: function() {
            return ux.update(this.el);
        },

        destroy: function() {
            return ux.destroy(this.el);
        }
    });

    var utils = {
        callback: function(fn) {
            // if callback string is function call it directly
            if(typeof fn === 'function') {
                fn.apply(this);
            }

            // if callback defined via data-attribute, call it via new Function
            else {
                if(fn !== false) {
                    var func = function() {
                        return fn;
                    };
                    func();
                }
            }
        },

        getStringVariable: function(str) {
            var val;
            // check if it is chained
            if(str.indexOf('.') > -1) {
                var chain = str.split('.'),
                    chainVal = window[chain[0]];

                for(var i = 1; i < chain.length; i++) {
                    chainVal = chainVal[chain[i]];
                }

                val = chainVal;
            }

            else {
                val = window[str];
            }

            return val;
        },

        getClassname: function(which) {
            return ns.prefix + ns.name + '-' + ns.classes[which];
        }
    };


    ux = $.fn.uxrautocomplete = $.fn.uxitdautocomplete = $.uxrautocomplete = function(options) {
        var selector = this.selector;

        return this.each(function() {
            if($.data(this, ns.data)) {
                return;
            }

            // Bind the plugin and attach the instance to data
            $.data(this, ns.data, new Autocomplete(this, options, selector));
>>>>>>> 2.x
        });
    };

    ux.clearCache = function(el) {
<<<<<<< HEAD
        var $el = el !== undefined ? $(el) : $("." + ns.ready);

        $el.filter('input').each(function() {
            var _this = $(this),
                _instance = _this.data(ns.data);
=======
        var $el = el !== undefined ? $(el) : $('.' + utils.getClassname('ready'));

        $el.each(function() {
            var _instance = $(this).data(ns.data);
>>>>>>> 2.x

            // set cache terms to empty object
            _instance.terms = {};

<<<<<<< HEAD
            _this.data(ns.data, _instance);

            callback(_instance.onClearCache);
=======
            utils.callback(_instance.options.onClearCache);
>>>>>>> 2.x
        });
    };

    ux.update = function(el) {
<<<<<<< HEAD
        var $el = el !== undefined ? $(el) : $("." + ns.ready);

        $el.filter('input').each(function() {
            var _this = $(this),
                _instance = _this.data(ns.data),
                _rocket = _this.data(ns.rocket);

            // first remove jQuery UI Autocomplete
            _this.autocomplete('destroy');


            // remove previous instance data
            // since we are removing the rocket data no need to clear cache separately
            _this.removeData(ns.data);

            // add new options
            _instance = $.extend({}, defaults, _rocket[ns.data]['options'], $(this).data());

            // register new instance data
            _this.data(ns.data, _instance);

            _this.off(events.click + ' ' + events.search + ' ' + events.response);

            bindUIActions(_this);

            setTemplate(_this);

            callback(_instance.onUpdate);
        });
    };

    ux.remove = function(el) {
        var $el = el !== undefined ? $(el) : $("." + ns.ready);
=======

    };

    ux.destroy = function(el) {
        var $el = el !== undefined ? $(el) : $('.' + utils.getClassname('ready'));
>>>>>>> 2.x

        $el.filter('input').each(function() {
            var _this = $(this),
                _instance = _this.data(ns.data),
                _uxrocket = _this.data(ns.rocket);

            // remove ready class
<<<<<<< HEAD
            _this.removeClass(ns.ready);

            // remove plugin events
            _this.off(events.click + ' ' + events.search + ' ' + events.response);

            // remove icon and wrapper
            _this.next('.' + ns.icon).remove();

            if(_uxrocket[ns.data].hasWrapper) {
                if(Object.keys && Object.keys(_uxrocket).length == 1) {
                    _this.unwrap();
                }

                else {
                    _this.parent().removeClass(ns.wrap);
                }
            }
=======
            _instance.removeClasses();

            // remove plugin events
            _instance.unbindUIActions();

            // remove layout
            _instance.removeLayout();
>>>>>>> 2.x

            // remove plugin data
            _this.removeData(ns.data);

            // remove uxRocket registry
            delete _uxrocket[ns.data];
            _this.data(ns.rocket, _uxrocket);

<<<<<<< HEAD
            // remove jQueryUI
            _this.autocomplete('destroy');

            callback(_instance.onRemove);
        });
    };

    // version
    ux.version = '1.8.1';

    // settings
    ux.settings = defaults;
})(jQuery);
=======
            utils.callback(_instance.options.onRemove);
        });
    };

// version
    ux.version = '2.0.0';

// default settings
    ux.settings = defaults;
    ux.templates = templates;
    ux.namespace = ns;
}))
;

// Old IE polyfill
Object.keys = Object.keys ||
              function(o, k, r) {
                  r = [];
                  for(k in o) {
                      r.hasOwnProperty.call(o, k) && r.push(k);
                  }
                  return r;
              };
>>>>>>> 2.x
