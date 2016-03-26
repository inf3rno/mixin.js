var expect = require("expect.js"),
    o3 = require("../../.."),
    shallowClone = o3.shallowClone,
    dummy = o3.dummy;

module.exports = function () {

    var result;

    this.When(/^I clone primitives$/, function (next) {
        result = [
            shallowClone(123),
            shallowClone("string"),
            shallowClone(dummy),
            shallowClone(null),
            shallowClone(undefined),
            shallowClone(false)
        ];
        next();
    });

    var original;

    this.When(/^I clone an Array$/, function (next) {
        original = [1, "a", dummy, {}, {
            clone: function () {
                return 1;
            }
        }];
        result = shallowClone(original);
        next();
    });

    this.When(/^I clone a Date/, function (next) {
        original = new Date();
        result = shallowClone(original);
        next();
    });

    this.When(/^I clone a RegExp/, function (next) {
        original = /\w/gm;
        result = shallowClone(original);
        next();
    });

    this.When(/^I clone an Object/, function (next) {
        original = {a: 1, b: 2};
        result = shallowClone(original);
        next();
    });

    this.Then(/^the result should be the same value$/, function (next) {
        expect(result).to.eql([
            123,
            "string",
            dummy,
            null,
            undefined,
            false
        ]);
        next();
    });

    this.Then(/^the result should be a new Array with the same items$/, function (next) {
        expect(result).not.to.be(original);
        expect(result).eql(original);
        expect(result[2]).to.be(original[2]);
        expect(result.length).to.be(original.length);
        next();
    });

    this.Then(/^the result should be a new Date with the same time$/, function (next) {
        expect(result).not.to.be(original);
        expect(result).to.be.a(Date);
        expect(result.toString()).to.be(original.toString());
        next();
    });

    this.Then(/^the result should be a new RegExp with the same pattern and flags$/, function (next) {
        expect(result).not.to.be(original);
        expect(result).to.be.a(RegExp);
        expect(result.toString()).to.be(original.toString());
        next();
    });

    this.Then(/^the result should be a new Object which inherits the properties of the original one$/, function (next) {
        expect(result).not.to.be(original);
        expect(result.a).to.be(1);
        expect(result.b).to.be(2);
        next();
    });
};