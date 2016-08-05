var expect = require("expect.js"),
    noop = require("../..").noop;

module.exports = function () {

    var result;

    this.When(/^I call noop with any argument$/, function (next) {
        result = noop(1, 2, 3);
        next();
    });

    this.Then(/^undefined should be returned$/, function (next) {
        expect(result).to.be(undefined);
        next();
    });

};