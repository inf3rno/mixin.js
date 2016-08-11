var expect = require("expect.js"),
    NativeError = require("../..").NativeError;

module.exports = function () {

    var anInstance;

    this.When(/^I create a new native error instance and I wrap that instance$/, function (next) {
        var firstFn = function firstFn() {
            secondFn();
        };
        var secondFn = function secondFn() {
            thirdFn();
        };
        var thirdFn = function thirdFn() {
            try {
                theNotDefinedFunction();
            }
            catch (error) {
                anInstance = new NativeError(error);
            }
        };
        firstFn();
        next();
    });

    this.Then(/^the stack property should contain the type, the message and the stack frames of this native error$/, function (next) {
        expect(/ReferenceError.*theNotDefinedFunction/.test(anInstance.stack)).to.be.ok();
        expect(/thirdFn/.test(anInstance.stack.frames[0])).to.be.ok();
        expect(/secondFn/.test(anInstance.stack.frames[1])).to.be.ok();
        expect(/firstFn/.test(anInstance.stack.frames[2])).to.be.ok();
        next();
    });
};