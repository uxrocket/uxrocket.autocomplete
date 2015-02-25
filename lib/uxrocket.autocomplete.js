/**
 * UX Rocket
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

            // callbacks
            onReady          : false,
            onSelect         : false,
            onClear          : false,
            onButtonClick    : false,
            onRemove         : false
        },

        templates = {
            list    : {
                wrap: '<ul></ul>',
                item: '' +
                    '<li>' +
                    '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                    '       {{{name}}}' +
                    '       {{#if title}}' +
                    '       <br /><em>{{substr title 50}}</em>' +
                    '       {{/if}}' +
                    '   </a>' +
                    '</li>'
            },
            image   : {
                wrap: '<ul></ul>',
                item: '' +
                    '<li>' +
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
                    '   </a>' +
                    '</li>'
            },
            tree    : {
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
                    '   </a>' +
                    '</li>'
            }
        },
		events = {
			click: 'click.uxAutocomplete'
		},
		ns = {
			rocket	  : 'uxRocket',
			data  	  : 'uxAutocomplete',
			ready 	  : 'uxitd-autocomplete-ready',
			rocketWrap: 'uxitd-plugin-wrap',
			wrap 	  : 'uxitd-autocomplete-wrap',
			icon 	  : 'icon-search',
            loading   : 'icon-loading'
		};

    var AutoComplete = function(el, options, selector) {
        var $el = $(el),
			opts = $.extend({}, defaults, options, $el.data(), {'selector': selector});

        $el.data(ns.data, opts);

        // set element layout
        setLayout($el);

        // call Ready Callback
        callback(opts.onReady);

        // bind actions
        bindActions($el);

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


        if(!url_pattern.test(source)) {
            source = eval(source);

            sourceFunction = function(request, response) {
                // check if element is active or not : fix for IE
                if(!$el.is(':focus')){
                    return;
                }

                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");

                response($.map(source.itemList, function(item) {
                    if(matcher.test(item.name)) {
                        return setItem(item);
                    }
                }));
            };
        }
        else {
            sourceFunction = function(request, response) {
                // check if element is active or not : fix for IE
                if(!$el.is(':focus')){
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
                        term    : request.term,
                        formdata: fdata
                    },
                    success : function(data) {
                        response($.map(data.itemList.slice(0, _opts.item), function(item) {
                            return setItem(item);
                        }));
                    }
                });
            };
        }

        return sourceFunction;
    };

    var bindActions = function($el) {
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

        $el.on('autocompletesearch', function(event, ui){
            console.log(event);
            $(this).siblings('.' + ns.icon).addClass(ns.loading);
        });

        $el.on('autocompleteresponse', function(event, ui){
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

                    if(_target == '_blank'){
                        window.open(ui.item.url);
                    }
                    else {
                        window.location = ui.item.url;
                    }
                }

                callback(_opts.onSelect);
            }
        }).clear({
            clearAlso: _opts.hidden,
            onClear  : _opts.onClear
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

                    currentCategory = item.category;
                }

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
        });
    };

    ux.remove = function(el) {
        var $el = el !== undefined ? $(el) : $("." + ns.ready);

        $el.filter('input').each(function() {
            var _this = $(this),
                _instance = _this.data(ns.data),
                _uxrocket = _this.data(ns.rocket);

            // remove ready class
            _this.removeClass(ns.ready);

            // remove plugin events
            _this.off(events.click);

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

            // remove plugin data
            _this.removeData(ns.data);

            // remove uxRocket registry
            delete _uxrocket[ns.data];
            _this.data(ns.rocket, _uxrocket);

            // remove jQueryUI
            _this.autocomplete('destroy');

            callback(_instance.onRemove);
        });
    };

    // version
    ux.version = '1.4.6';

    // settings
    ux.settings = defaults;
})(jQuery);