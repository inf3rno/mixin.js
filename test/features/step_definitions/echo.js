var expect = require("expect.js"),
    o3 = require("../../.."),
    echo = o3.echo;

module.exports = function () {

    var result;

    this.When(/^I call echo with a single argument$/, function (next) {
        result = echo("a");
        next();
    });

    this.When(/^I call echo with multiple arguments$/, function (next) {
        result = echo(1, 2, 3);
        next();
    });

    this.Then(/^the argument should be returned$/, function (next) {
        expect(result).to.be("a");
        next();
    });

    this.Then(/^the first argument should be returned$/, function (next) {
        expect(result).to.be(1);
        next();
    });

};