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
            onButtonClick    : false
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
        };

    var AutoComplete = function(el, options, selector) {
        var opts = $.extend({}, defaults, options, $(el).data(), {'selector': selector}),
        // cache
            $el = $(el);

        $el.data('uxAutocomplete', opts);

        // set element layout
        setLayout($el);

        // call Ready Callback
        callback(opts.onReady);

        // bind actions
        bindActions($el, opts);

        // set template actions
        setTemplate($el, opts);
    };

    var setLayout = function($el) {
        var columns,
            _opts = $el.data('uxAutocomplete');

        columns = ' ' + $el.context.className.replace('uxitd-autocomplete-ready', '');

        if(_opts.selector.charAt(0) == '.') {
            columns = columns.replace(' ' + _opts.selector.substr(1), '');
            columns = columns.replace(_opts.selector.substr(1) + ' ', '');
        }

        if($el.parent().is('.uxitd-plugin-wrap')) {
            $el.parent().addClass('uxitd-autocomplete-wrap' + columns + ' group');
        }
        else {
            $el.wrap('<span class="uxitd-plugin-wrap uxitd-autocomplete-wrap' + columns + ' group"></span>');
        }

        $el.after('<i class="icon-search"></i>');
    };

    var setSource = function($el, opts) {
        var fdata = null,
            url_pattern = /^(http|https|\/|\.\/|\.\.\/)/,
            source = opts.service,
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

                if(opts.formdata != null) {
                    fdata = $(opts.formdata).serialize();
                }

                $.ajax({
                    url     : source,
                    dataType: 'json',
                    type    : opts.queryType,
                    data    : {
                        type    : opts.type,
                        term    : request.term,
                        formdata: fdata
                    },
                    success : function(data) {
                        response($.map(data.itemList.slice(0, opts.item), function(item) {
                            return setItem(item);
                        }));
                    }
                });
            };
        }

        return sourceFunction;
    };

    var bindActions = function($el, opts) {

        if(typeof opts.props !== 'undefined' && opts.props != '') {
            var props = opts.props.split(':');

            $el.next('.icon-search').addClass('uxitd-autocomplete-icon-clickable').on('click', function(e) {
                e.preventDefault();
                eval(props[1]);
            });
        }

        if(opts.onButtonClick !== false) {
            $el.next('.icon-search').on('click', function() {
                callback(opts.onButtonClick);
            });
        }

        $el.autocomplete({
            open     : function(event, ui) {
                $(".uxitd-autocomplete-category").removeClass('ui-menu-item');

                $(this).autocomplete("widget").css({
                    "width": ($(this).outerWidth() + "px")
                });
            },
            minLength: opts.minLength,
            source   : setSource($el, opts),
            focus    : function(event, ui) {
                if(!opts.arrowNavigation) {
                    event.preventDefault();
                }
            },
            select   : function(event, ui) {
                if(opts.hidden != null) {
                    $(opts.hidden).val(ui.item.id);
                }

                if(opts.arrowSelection === true && event.keyCode == 13 && typeof ui.item.url !== 'undefined') {
					// check if target is blank or not
                    var _target = $("#" + event.currentTarget.id).find(".ui-state-focus a").attr("target");

                    if(_target == '_blank'){
                        window.open(ui.item.url);
                    }
                    else {
                        window.location = ui.item.url;
                    }
                }

                callback(opts.onSelect);
            }
        }).clear({
            clearAlso: opts.hidden,
            onClear  : opts.onClear
        });
    };

    var setTemplate = function($el, opts) {
        var autocomplete = $el.data("uiAutocomplete") ? $el.data("uiAutocomplete") : $el.data("ui-autocomplete"),
            template = {};

        if(opts.template === null) {
            switch(opts.type) {
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
            template = opts.template;
        }

        autocomplete._renderMenu = function(ul, items) {
            var _this = this,
                _list = [],
                currentCategory = "";

            $.each(items, function(index, item) {
                var temp;

                if((opts.type == 'category' || opts.type == 'tree') && typeof item.category !== 'undefined' && item.category != currentCategory) {

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

            if(opts.highlight === true) {
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
            call(fn);
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
                autocomplete;

            if($el.hasClass('uxitd-autocomplete-ready') || $el.hasClass('uxitd-plugin-wrap')) {
                return;
            }

            $el.addClass('uxitd-autocomplete-ready');
            autocomplete = new AutoComplete(this, options, selector);
        });
    };

    // version
    ux.version = '1.4.6';

    // settings
    ux.settings = defaults;
})(jQuery);