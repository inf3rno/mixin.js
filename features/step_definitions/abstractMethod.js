var expect = require("expect.js"),
    abstractMethod = require("../..").abstractMethod;

module.exports = function () {

    var throwsError;

    this.When(/^I try to call an abstract method$/, function (next) {
        throwsError = false;
        try {
            abstractMethod();
        } catch (e) {
            throwsError = true;
        }
        next();
    });

    this.Then(/^it should throw an error$/, function (next) {
        expect(throwsError).to.be.ok();
        next();
    });

};