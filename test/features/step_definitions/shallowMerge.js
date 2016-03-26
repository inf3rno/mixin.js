var expect = require("expect.js"),
    o3 = require("../../.."),
    shallowMerge = o3.shallowMerge,
    InvalidArguments = o3.InvalidArguments;

module.exports = function () {

    var tests;
    this.When(/^I try to merge primitives$/, function (next) {
        tests = [function () {
            shallowMerge(1, [{}, {}]);
        }, function () {
            shallowMerge({}, [1, 2])
        }];
        next();
    });

    this.When(/^I try to merge with sources without giving an array$/, function (next) {
        tests = [function () {
            shallowMerge({}, {});
        }];
        next();
    });

    var subject,
        result;

    this.When(/^I shallow merge an object with multiple source objects$/, function (next) {
        subject = {a: 1, b: 2};
        result = shallowMerge(subject, [{b: 3, c: 5, d: 6}, {
            c: 7, e: 8, toString: function () {
                return "x";
            }
        }]);
        next();
    });

    this.Then(/^it should throw an Error, because (?:only objects can be merged|sources must be an array of objects)$/, function (next) {
        tests.forEach(function (test) {
            expect(test).to.throwError(new InvalidArguments());
        });
        next();
    });

    this.Then(/^the result should be the subject$/, function (next) {
        expect(result).to.be(subject);
        next();
    });

    this.Then(/^it should contain the properties of the sources$/, function (next) {
        expect(subject.d).to.be(6);
        expect(subject.e).to.be(8);
        next();
    });

    this.Then(/^the source properties should override the subject properties$/, function (next) {
        expect(subject.b).to.be(3);
        next();
    });

    this.Then(/^the source properties should override each other in the source order$/, function (next) {
        expect(subject.c).to.be(7);
        next();
    });

    this.Then(/^the native methods like toString should be overridden as well$/, function (next) {
        expect(subject.toString()).to.be("x");
        next();
    });
};