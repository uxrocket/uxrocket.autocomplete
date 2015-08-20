/**
 * @author Bilal Cinarli
 */

describe('Testing UX Rocket Autocomplete', function() {
    var $inputs = {},
        autocomplete = {},
        defaults = $.uxrautocomplete.settings,
        templates = $.uxrautocomplete.templates,
        namespace = $.uxrautocomplete.namespace,
        data = namespace.data,
        customTemplate = {
            item: '<li><a>{{$name}}</a></li>'
        },
    // string
        dataSource = [{"name": "ActionScript", "id": "01", "category": "A"}, {"name": "AppleScript", "id": "02", "category": "A"}, {"name": "Asp", "id": "03", "category": "A"}, {
            "name"    : "Basic",
            "id"      : "04",
            "category": "B"
        }, {"name": "Erlang", "id": 10, "category": "E"}, {"name": "Fortran", "id": 11, "category": "F"}, {"name": "Haskell", "id": 13, "category": "H"}, {
            "name"    : "Java",
            "id"      : 14,
            "category": "J"
        }, {"name": "JavaScript", "id": 15, "category": "J"}, {"name": "Scala", "id": 21, "category": "S"}, {"name": "İstanbul", "id": 15, "category": "İ"}],
    // chained
        source = {
            new  : dataSource,
            older: {
                "itemList": dataSource
            }
        };

    before(function() {
        // prepare the elements
        $("#elements")
            .append('<input type="text" name="autocomplete-01" id="ac01" data-service="dataSource" />')
            .append('<input type="text" name="autocomplete-02" id="ac02" />')
            .append('<input type="text" name="autocomplete-03" id="ac03" data-service="source.new" />')
            .append('<input type="text" name="autocomplete-04" id="ac04" />');

        $inputs["_01"] = $("#ac01");
        $inputs["_02"] = $("#ac02");
        $inputs["_03"] = $("#ac03");
        $inputs["_04"] = $("#ac04");

        $inputs._01.addClass('autocomplete');

        $inputs._02.data('service', source.older);
        $inputs._02.wrap('<label class="uxr-plugin-wrap previously-wrapped"></label>');

        $inputs._03.data('template', customTemplate);

        $inputs._04.data('service', function() {
            console.log("function source")
        });

        $.each($inputs, function(item) {
            $inputs[item].uxrautocomplete();

            autocomplete[item] = $inputs[item].data(data);
        });
    });

    describe('Properties', function() {
        it('uxrautocomplete.version', function() {
            expect($.uxrautocomplete).to.have.property('version');
        });

        it('uxrautocomplete.settings', function() {
            expect($.uxrautocomplete).to.have.property('settings');
        });

        it('unique _instance', function() {
            var instances = [];

            $.each(autocomplete, function(item) {
                expect(autocomplete[item]._instance).to.exist;
                expect($.inArray(autocomplete[item]._instance, instances)).to.be.equal(-1);

                instances.push(autocomplete[item]._instance);
            });
        });
    });

    describe('Source Setup', function() {
        it('String Source', function() {
            expect(autocomplete._01.source).to.be.an('array');
            expect(autocomplete._01.source).to.be.deep.equal(dataSource);
        });

        it('Chained String Source', function() {
            expect(autocomplete._03.source).to.be.an('array');
            expect(autocomplete._03.source).to.be.deep.equal(source.new);
        });

        it('Object/Array Source', function() {
            expect(autocomplete._02.source).to.be.an('object');
            expect(autocomplete._02.source).to.be.deep.equal(source.older);
        });

        it('Function Source', function() {
            expect(autocomplete._04.source).to.be.an('function');
        });
    });

    describe('Layout Setup', function() {
        it('Ready Class: "uxr-autocomplete-ready"', function() {
            expect($inputs._01.hasClass('uxr-autocomplete-ready')).to.be.equal(true);
        });

        it('Wrapper Classlist', function() {
            expect(autocomplete._01.classList).to.be.equal('autocomplete uxr-plugin-wrap uxr-autocomplete-wrap');
        });

        it('Should wrapped with <span> if not wrapped before', function() {
            var $parent = $inputs._01.parent();
            expect($parent.is('span, .uxr-autocomplete-wrap')).to.be.equal(true);
        });

        it('Should not wrapped again, only "classList" should transferred', function() {
            var $parent = $inputs._02.parent();
            expect($parent.is('label, .uxr-plugin-wrap, .uxr-autocomplete-wrap')).to.be.equal(true);
        });

        it('Should show loading indicator', function() {
            autocomplete._01.startLoading();
            expect(autocomplete._01.$icon.hasClass('uxr-autocomplete-loading')).to.be.equal(true);
        });

        it('Should stop loading indicator', function() {
            autocomplete._01.stopLoading();
            expect(autocomplete._01.$icon.hasClass('uxr-autocomplete-loading')).to.be.false;
        });

        it('Each element should have results container', function() {
            $.each(autocomplete, function(item) {
                expect($("ul#" + autocomplete[item].id).length).to.be.equal(1);
            });
        });
    });

    describe('Template Setup', function() {
        it('Default template set to "list"', function() {
            expect(autocomplete._01.template).to.be.deep.equal(templates.list);
        });

        it('Template can be overwritten', function() {
            expect(autocomplete._03.template).to.be.deep.equal(customTemplate);
        });
    });


    describe('Public Methods', function() {
        describe('Clear Cache', function() {
            it('Will clear the search cache', function() {
                autocomplete._01.clearCache();

                expect(autocomplete._01.terms).to.be.empty;
            });
        });

        describe('Update', function() {
            it('Will update plugin settings', function() {

            });
        });

        describe('Destroy/Remove', function() {
            it('Will destroy plugin', function() {
                autocomplete._01.destroy();

                expect($inputs._01.data(data)).to.be.undefined;
            });

            it('Will destroy all autocomplete plugins', function() {
                $.uxrautocomplete.destroy();

                // $input1 is already destroyed in previous test, so we only control the $input2
                expect($inputs._02.data(data)).to.be.undefined;
            });
        });
    });
});