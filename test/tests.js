/**
 * @author Bilal Cinarli
 */

describe('Testing UX Rocket Autocomplete', function() {
    var $input, $input2, autocomplete, autocomplete2,
        defaults = $.uxrautocomplete.settings,
        templates = $.uxrautocomplete.templates,
        namespace = $.uxrautocomplete.namespace,
        data = namespace.data;

    before(function() {
        // prepare the elements
        $("#elements")
            .append('<input type="text" name="autocomplete-01" id="ac01" />')
            .append('<input type="text" name="autocomplete-02" id="ac02" />');

        $input = $("#ac01");
        $input2 = $("#ac02");
        $input.addClass('autocomplete');
        $input2.wrap('<label class="uxr-plugin-wrap previously-wrapped"></label>');

        $input.uxrautocomplete();
        $input2.uxrautocomplete();

        autocomplete = $input.data(data);
        autocomplete2 = $input2.data(data);
    });

    describe('Plugin layout', function() {
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

        it('Should not wrapped again, only "classList" should transferred', function() {
            var $parent = $input2.parent();
            expect($parent.is('label, .uxr-plugin-wrap, .uxr-autocomplete-wrap')).to.be.equal(true);
        });
    });

    describe('Plugin template', function() {
        it('Has default template', function() {
            expect(autocomplete.template).to.be.equal(templates.list);
        });
    });

    describe('Update plugin', function() {
        it('Will update plugin settings', function() {

        });
    });

    describe('Destroy/Remove plugin', function() {
        it('Will destroy plugin', function() {
            autocomplete.destroy();

            expect($input.data(data)).to.be.undefined;
        });

        it('Will destroy all autocomplete plugins', function(){
            $.uxrautocomplete.destroy();

            // $input1 is already destroyed in previous test, so we only control the $input2
            expect($input2.data(data)).to.be.undefined;
        });
    });
});