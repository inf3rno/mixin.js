var expect = require("expect.js"),
    o3 = require("../../.."),
    dummy = o3.dummy;

module.exports = function () {

    var result;

    this.When(/^I call dummy with any argument$/, function (next) {
        result = dummy(1, 2, 3);
        next();
    });

    this.Then(/^undefined should be returned$/, function (next) {
        expect(result).to.be(undefined);
        next();
    });

};