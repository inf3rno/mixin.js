var expect = require("expect.js"),
    sinon = require("sinon"),
    UserError = require("../..").UserError;

module.exports = function () {

    var anInstance;

    this.When(/^I create a new user error instance with custom properties$/, function (next) {
        anInstance = new UserError({
            message: "blah",
            a: 1,
            b: 2
        });
        next();
    });

    this.Then(/^this instance should contain the custom properties$/, function (next) {
        expect(anInstance).to.be.an(UserError);
        expect(anInstance.a).to.be(1);
        next();
    });

    this.When(/^I create a new user error instance$/, function (next) {
        var firstFn = function firstFn() {
            secondFn();
        };
        var secondFn = function secondFn() {
            thirdFn();
        };
        var thirdFn = function thirdFn() {
            anInstance = new UserError("the problem");
        };
        firstFn();
        next();
    });

    this.Then(/^the stack property should contain the type, the message and the stack frames of this instance$/, function (next) {
        expect(/UserError: the problem/.test(anInstance.stack)).to.be.ok();
        expect(/thirdFn/.test(anInstance.stack.frames[0])).to.be.ok();
        expect(/secondFn/.test(anInstance.stack.frames[1])).to.be.ok();
        expect(/firstFn/.test(anInstance.stack.frames[2])).to.be.ok();
        next();
    });
};