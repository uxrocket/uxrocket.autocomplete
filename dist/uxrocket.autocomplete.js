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
            click: 'click.' + rocketName,
            keyup: 'keyup.' + rocketName
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
            data   : rocketName,
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
    var Autocomplete = function(el, options, selector) {
        var $el = $(el);

        this.el = el;
        this.$el = $el;
        this._name = rocketName;
        this._defaults = defaults;
        this.selector = selector;
        this.options = $.extend(true, {}, defaults, options, $el.data());

        this.init();
    };

    Autocomplete.prototype = {
        classList: '',
        terms    : {},

        init         : function() {
            var uxrocket = this.$el.data(ns.rocket) || {};

            // add ready class
            this.$el.addClass(utils.getClassname('ready'));

            // register plugin data to rocket
            uxrocket[ns.data] = {hasWrapper: true, wrapper: ns.wrap, ready: utils.getClassname('ready'), selector: this.selector, options: this.options};
            this.$el.data(ns.rocket, uxrocket);

            // set plugin layout
            this.setLayout();

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

        startLoading: function(){
            this.$icon.addClass(utils.getClassname('loading'));
        },

        stopLoading: function(){
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

                _this.lastTerm = val.toLowerCase();

                if(_length >= _this.options.minLength) {
                    _this.onKeyup(e);
                }
            });
        },

        unbindUIActions: function() {
            this.$el.off('.' + rocketName);
        },

        onKeyup: function(e) {
            console.log(e);

            if(e.keyCode === keys.return) {
                console.log(e);
            }

            utils.callback(this.options.onSearch);
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
                                term: 'as',
                                formdata: fdata
                            },
                            success : function(data) {
                                if(_this.options.cache) {
                                    _this.terms[_this.lastTerm] = data;
                                }

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
                haystack = this.source.itemList ? this.source.itemList : this.source,
                needle = this.lastTerm;

            this.startLoading();

            if(typeof haystack === 'function') {
                return haystack.apply(this);
            }

            // search in local source
            else {
                results = $.map(haystack, function(item) {
                    if(_this.searchArray(item, 'as')) {
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
            console.log(results);

            this.stopLoading();
        },

        serializeForm: function(){
            return $(this.options.formdata).serialize();
        },

        update: function() {
            return ux.update(this.el);
        },

        destroy: function() {
            return ux.destroy(this.el);
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
        });
    };

    ux.update = function(el) {

    };

    ux.destroy = function(el) {
        var $el = el !== undefined ? $(el) : $('.' + utils.getClassname('ready'));

        $el.filter('input').each(function() {
            var _this = $(this),
                _instance = _this.data(ns.data),
                _uxrocket = _this.data(ns.rocket);

            // remove ready class
            _instance.removeClasses();

            // remove plugin events
            _instance.unbindUIActions();

            // remove layout
            _instance.removeLayout();

            // remove plugin data
            _this.removeData(ns.data);

            // remove uxRocket registry
            delete _uxrocket[ns.data];
            _this.data(ns.rocket, _uxrocket);

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