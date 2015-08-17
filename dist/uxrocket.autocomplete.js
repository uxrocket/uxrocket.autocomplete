/**
 * UX Rocket
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

        defaults = {
            type           : 'list',
            item           : 10,
            service        : null,
            minLength      : 2,
            queryType      : 'GET',
            hidden         : null,
            template       : null,
            highlight      : true,
            arrowSelection : false,
            arrowNavigation: true,
            cache          : false,

            legacyClass: true,

            // callbacks
            onReady      : false,
            onSearch     : false,
            onSelect     : false,
            onButtonClick: false,
            onClearCache : false,
            onUpdate     : false,
            onRemove     : false
        },
        templates = {
            list    : {
                item: '' +
                      '<li class="uxr-autocomplete-list-item">' +
                      '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                      '       {{{name}}}' +
                      '       {{#if title}}' +
                      '       <br /><em>{{substr title 50}}</em>' +
                      '       {{/if}}' +
                      '   </a>' +
                      '</li>'
            },
            image   : {
                item: '' +
                      '<li class="uxr-autocomplete-list-item">' +
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
                head: '' +
                      '<li class="uxr-autocomplete-category">' +
                      '   <span class="uxr-autocomplete-category-head" title="{{category}}">{{substr category 25}}</span>' +
                      '</li>',
                item: '' +
                      '<li class="uxr-autocomplete-list-item">' +
                      '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                      '       {{{name}}}' +
                      '   </a>' +
                      '</li>'
            },
            tree    : {
                head: '' +
                      '<li class="uxr-autocomplete-category">' +
                      '   <span class="uxr-autocomplete-category-head" title="{{category}}">{{substr category 25}}</span>' +
                      '</li>',
                item: '' +
                      '<li class="uxr-autocomplete-list-item">' +
                      '   <a {{#if url}}href="{{url}}"{{/if}}>' +
                      '       <span class="item-image"><img src="{{image}}"/></span> ' +
                      '       {{{name}}}' +
                      '   </a>' +
                      '</li>'
            }
        },
        events = {
            click: 'click.uxrAutocomplete',
            keyup: 'keyup.uxrAutocomplete'
        },
        keys = {
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
            data   : 'uxrAutocomplete',
            name   : 'autocomplete',
            wrap   : 'uxr-plugin-wrap',
            classes: {
                wrap   : 'wrap',
                ready  : 'ready',
                magnify: 'magnify',
                loading: 'loading'
            }
        };

    // Constructor Method
    var Autocomplete = function(el, options) {
        var $el = $(el);

        this.el = el;
        this.$el = $el;
        this.options = options;

        this.setLayout();

        utils.callback(options.onReady);

        this.bindUIActions();
        this.setTemplate();

        $el.data(ns.data, this);
    };

    Autocomplete.prototype = {
        classList    : '',
        handleClasses: function() {
            this.classList = this.$el.context.className.replace(utils.getClassname('ready'), '');

            if(this.options.selector.charAt(0) === '.') {
                this.classList = this.classList.replace(this.options.selector.substr(1), '');
            }

            this.classList += ' ' + ns.wrap + ' ' + utils.getClassname('wrap');
            this.classList = $.trim(this.classList);
        },

        handleWrapper: function() {
            this.$el.parent().is('.' + ns.wrap) ?
            this.$el.parent().addClass(this.classList) :
            this.$el.wrap('<span class="' + this.classList + '"></span>');
        },

        addIcon: function() {
            this.$el.after('<i class="' + utils.getClassname('magnify') + '"></i>');
        },

        setLayout: function() {
            this.handleClasses();
            this.handleWrapper();
            this.addIcon();
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
                var _length = $(this).val().length;

                if(_length >= _this.options.minLength) {
                    _this.onKeyup(e);
                }
            });
        },

        onKeyup: function(e) {
            var _this = this;

            console.log(e);

            if(e.keyCode === keys.return) {
                console.log(e);
            }

            utils.callback(this.options.onSearch);
        }
    };

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

        getClassname: function(which) {
            return ns.prefix + ns.name + '-' + ns.classes[which];
        }
    };


    ux = $.fn.uxrautocomplete = $.fn.uxitdautocomplete = $.uxrautocomplete = function(options) {
        var selector = this.selector;

        return this.each(function() {
            var $el = $(this),
                uxrocket = $el.data(ns.rocket) || {},
                _opts = $.extend(true, {}, defaults, options, $el.data(), {selector: selector}),
                autocomplete;

            if($el.hasClass(utils.getClassname('ready')) || $el.hasClass(utils.getClassname('wrap'))) {
                return;
            }

            $el.addClass(utils.getClassname('ready'));

            uxrocket[ns.data] = {hasWrapper: true, wrapper: ns.wrap, ready: utils.getClassname('ready'), selector: selector, options: _opts};

            $el.data(ns.rocket, uxrocket);

            autocomplete = new Autocomplete(this, _opts);
        });
    };

// version
    ux.version = '2.0.0';

// default settings
    ux.settings = defaults;
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