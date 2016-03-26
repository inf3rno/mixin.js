var expect = require("expect.js"),
    o3 = require("../../.."),
    UserError = o3.UserError;

module.exports = function () {

    var instance;
    this.When(/^I instantiate the UserError class$/, function (next) {
        instance = new UserError("problem");
        next();
    });

    this.Then(/^the instance should be an UserError instance$/, function (next) {
        expect(instance).to.be.an(UserError);
        next();
    });

    this.Then(/^it should be an Error descendant as well$/, function (next) {
        expect(instance).to.be.an(Error);
        next();
    });

    this.Then(/^it should contain a stack string$/, function (next) {
        expect(instance.toString()).to.be("UserError: problem");
        expect(/UserError: problem/.test(instance.stack)).to.be.ok();
        expect(/at .*\.js:\d+:\d+/.test(instance.stack)).to.be.ok();
        next();
    });

    var cb;
    this.When(/^I try to use Class behavior on the UserError class$/, function (next) {
        cb = function () {
            return UserError.extend({
                x: 1
            });
        };
        next();
    });

    this.Then(/^I should be able to do it$/, function (next) {
        expect(cb).not.to.throwError();
        expect(cb()).to.be.a(Function);
        next();
    });

};