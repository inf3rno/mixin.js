var expect = require("expect.js"),
    sinon = require("sinon"),
    CompositeError = require("../../lib/CompositeError"),
    UserError = require("../../lib/UserError");

module.exports = function () {

    var anInstance;

    this.When("I create a new composite error instance", function (next) {
        anInstance = new CompositeError();
        next();
    });

    this.When("this instance contains other error instances", function (next) {
        anInstance.merge({
            message: "xxx",
            a: new Error("yyy"),
            b: new CompositeError({
                message: "zzz",
                x: new UserError("qqq")
            })
        });
        next();
    });

    this.Then("the stack of this instance should include the stack of the other error instances", function (next) {
        expect(anInstance.toString()).to.be("CompositeError: xxx");
        expect(/CompositeError: xxx/.test(anInstance.stack)).to.be.ok();
        expect(/caused by <a> Error: yyy/.test(anInstance.stack)).to.be.ok();
        expect(/caused by <b> CompositeError: zzz/.test(anInstance.stack)).to.be.ok();
        expect(/caused by <b.x> UserError: qqq/.test(anInstance.stack)).to.be.ok();
        expect(/at .*\.js:\d+:\d+/.test(anInstance.stack)).to.be.ok();
        next();
    });

};