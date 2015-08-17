/**
 * @author Bilal Cinarli
 */

describe('Testing UX Rocket Autocomplete', function() {
    var $input = $(document.createElement('input')),
        $input2 = $(document.createElement('input'));
    $input.addClass('autocomplete');
    $input2.wrap('<label class="uxr-plugin-wrap previously-wrapped"></label>');

    $input.uxrautocomplete();
    $input2.uxrautocomplete();

    var autocomplete = $input.data('uxrAutocomplete'),
        autocomplete2 = $input2.data('uxrAutocomplete');

    it('Has Ready Class', function() {
        expect($input.hasClass('uxr-autocomplete-ready')).to.be.equal(true);
    });

    it('Has Class List', function() {
        expect(autocomplete.classList).to.be.equal('autocomplete uxr-plugin-wrap uxr-autocomplete-wrap');
    });

    it('Should wrapped with <span> if not wrapped before', function() {
        var $parent = $input.parent();
        expect($parent.is('span, .uxr-autocomplete-wrap')).to.be.equal(true);
    });

    it('Should not wrapped again, only "classList" should transferred', function(){
        var $parent = $input2.parent();
        expect($parent.is('label, .uxr-plugin-wrap, .uxr-autocomplete-wrap')).to.be.equal(true);
    });
});