var expect = require("expect.js"),
    Class = require("../../..").Class;

module.exports = function () {
    var ancestor,
        descendant;

    this.Given(/^an ancestor class$/, function (next) {
        ancestor = Class.extend({
            a: {},
            b: function () {
            }
        });
        next();
    });

    this.When(/^I extend the ancestor class$/, function (next) {
        descendant = ancestor.extend();
        next();
    });

    this.Then(/^I should get a descendant class$/, function (next) {
        expect(descendant instanceof Function).to.be.ok();
        next();
    });

    this.Then(/^the descendant inherits properties and methods of the ancestor$/, function (next) {
        expect(descendant.a).to.be(ancestor.a);
        expect(descendant.b).to.be(ancestor.b);
        next();
    });
};