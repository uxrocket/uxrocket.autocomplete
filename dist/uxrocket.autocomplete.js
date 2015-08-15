/**
 * UX Rocket
 * jQuery based autocomplete
 * @author Bilal Cinarli
 * @dependency Handlebars
 */

(function(factory) {
    "use strict";
    if(typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else if(typeof exports === "object" && typeof require === "function") {
        // Browserify
        factory(require("jquery"));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    "use strict";

    var ux, // local shorthand

        defaults = {
            type             : "list",
            item             : 10,
            service          : null,
            minLength        : 2,
            categoryTextLimit: 25,
            queryType        : "GET",
            hidden           : null,
            template         : null,
            highlight        : true,
            arrowSelection   : false,
            arrowNavigation  : true,
            cache            : false,

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
        events = {
            click: "click.uxrAutocomplete",
            keyup: "keyup.uxrAutocomplete"
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
            prefix : "uxr-",
            rocket : "uxRocket",
            data   : "uxrAutocomplete",
            name   : "autocomplete",
            wrap   : "uxr-plugin-wrap",
            classes: {
                wrap   : "wrap",
                ready  : "ready",
                magnify: "magnify",
                loading: "loading"
            }
        };

    // Constructor Method
    var Autocomplete = function(el, options) {
        var $el = $(el);

        this.el = el;
        this.$el = $el;
        this.setLayout();

        utils.callback(options.onReady);
    };

    Autocomplete.prototype = {
        setLayout: function() {
            var _opts = this.$el.data(ns.data),
                classes = this.$el.context.className.replace(utils.getClassname("ready"), "");

            if(_opts.selector.charAt(0) === ".") {
                classes = classes.replace(_opts.selector.substr(1), "");
            }

            classes += " " + ns.wrap + " " + utils.getClassname("wrap");
            classes = $.trim(classes);

            this.$el.parent().is("." + ns.wrap) ? this.$el.parent().addClass(classes) : this.$el.wrap("<span class='" + classes + "'></span>");

            this.$el.after("<i class='" + utils.getClassname("magnify") + "'></i>");
        },

        bindUIActions: function() {
            var _this = this;

            _this.$el.on(events.keyup, function(e) {
                _this.onKeyup(e);
            });
        },

        onKeyup: function(e) {
            var _this = this,
                _opts = _this.$el.data(ns.data);

            utils.callback(_opts.onSearch);
        }
    };

    var utils = {
        callback: function(fn) {
            // if callback string is function call it directly
            if(typeof fn === "function") {
                fn.apply(this);
            }

            // if callback defined via data-attribute, call it via new Function
            else {
                if(fn !== false) {
                    var func = new Function("return " + fn);
                    func();
                }
            }
        },

        getClassname: function(which) {
            return ns.prefix + ns.name + "-" + ns.classes[which];
        }
    };


    ux = $.fn.uxautocomplete = $.fn.uxitdautocomplete = $.uxautocomplete = function(options) {
        var selector = this.selector;

        return this.each(function() {
            var $el = $(this),
                uxrocket = $el.data(ns.rocket) || {},
                options = $.extend(true, {}, defaults, options, $el.data(), {selector: selector}),
                autocomplete;

            if($el.hasClass(utils.getClassname("ready")) || $el.hasClass(utils.getClassname("wrap"))) {
                return;
            }

            $el.addClass(utils.getClassname("ready"));

            uxrocket[ns.data] = {hasWrapper: true, wrapper: ns.wrap, ready: utils.getClassname("ready"), selector: selector, options: options};

            $el.data(ns.rocket, uxrocket);
            $el.data(ns.data, options);

            autocomplete = new Autocomplete(this, options);
        });
    };

    // version
    ux.version = "2.0.0";

    // default settings
    ux.settings = defaults;
}));

// Old IE polyfill
Object.keys = Object.keys ||
              function(o, k, r) {
                  r = [];
                  for(k in o) {
                      r.hasOwnProperty.call(o, k) && r.push(k);
                  }
                  return r;
              };