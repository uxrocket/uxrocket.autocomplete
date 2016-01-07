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
            serialize        : 'String', // String || Array || Object
            categoryTextLimit: 25,
            queryType        : 'GET',
            hidden           : null,
            template         : null,
            highlight        : true,
            arrowSelection   : false,
            arrowNavigation  : true,
            cache            : false,
            tabSelect        : false,

            // callbacks
            onReady      : false,
            onSelect     : false,
            onButtonClick: false,
            onClearCache : false,
            onUpdate     : false,
            onRemove     : false
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
            click   : 'click.uxAutocomplete',
            search  : 'autocompletesearch.uxAutocomplete',
            response: 'autocompleteresponse.uxAutocomplete',
            keydown : 'keydown.uxAutocomplete'
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
                    fdata = _opts.serialize === 'String' ? $(_opts.formdata).serialize() : $(_opts.formdata)['serialize' + _opts.serialize]();
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

        if(_opts.tabSelect === true){
            // Tab Key Control
            $el.on(events.keydown, function(e){
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    var autocomplete = $el.data("ui-autocomplete");
                    // Ui Menu Item Regex set ui item
                    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($el.val() ) + "$", "i");
                    autocomplete.widget().children(".ui-menu-item").each(function() {
                        //ui menu item
                        var item = $(this).data("ui-autocomplete-item");
                        if (matcher.test(item.label || item.value || item)) {
                            autocomplete.selectedItem = item;
                            return false;
                        }
                    });

                    if (autocomplete.selectedItem) {
                        autocomplete._trigger( "select", event, {item: autocomplete.selectedItem});
                        $el.val(autocomplete.selectedItem.label);
                    }
                }
            });
        }

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

                console.log(ui.item);

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

    $.fn.serializeObject = function() {
        var _o = {},
            _a = this.serializeArray();

        $.each(_a, function() {
            if(_o[this.name]) {
                if(!_o[this.name].push) {
                    _o[this.name] = [_o[this.name]];
                }
                _o[this.name].push(this.value || '');
            } else {
                _o[this.name] = this.value || '';
            }
        });

        return _o;
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

    ux.clearCache = function(el) {
        var $el = el !== undefined ? $(el) : $("." + ns.ready);

        $el.filter('input').each(function() {
            var _this = $(this),
                _instance = _this.data(ns.data);

            // set cache terms to empty object
            _instance.terms = {};

            _this.data(ns.data, _instance);

            callback(_instance.onClearCache);
        });
    };

    ux.update = function(el) {
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

        $el.filter('input').each(function() {
            var _this = $(this),
                _instance = _this.data(ns.data),
                _uxrocket = _this.data(ns.rocket);

            // remove ready class
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
    ux.version = '1.9.0';

    // settings
    ux.settings = defaults;
})(jQuery);
