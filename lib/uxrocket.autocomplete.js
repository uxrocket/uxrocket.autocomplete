/**
 * UX Rocket
 * jQuery based autocomplete
 * @author Bilal Cinarli
 * @dependency Handlebars
 */

!function(root, factory) {
    if(typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(root.jQuery);
    }
}(this, function($) {
    "use strict";

    var ux;

    ux = $.fn.uxautocomplete = $.uxautocomplete = function(options) {
        var selector = this.selector;

        return this.each(function() {

        });
    }
});