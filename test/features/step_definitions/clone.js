var expect = require("expect.js"),
    o3 = require("../../.."),
    clone = o3.clone;

module.exports = function () {

    var result;

    this.When(/^I clone an object having a clone method$/, function (next) {
        result = clone({
            clone: function () {
                return {a: 1};
            }
        });
        next();
    });

    var original = [1, 2, 3];
    this.When(/^I clone a variable which does not have a clone method$/, function (next) {
        result = clone(original);
        next();
    });

    this.Then(/^the result of the clone method should be returned$/, function (next) {
        expect(result).to.eql({a: 1});
        next();
    });

    this.Then(/^the shallow cloned variable should be returned$/, function (next) {
        expect(result).to.eql(original);
        expect(result).not.to.be(original);
        next();
    });

};