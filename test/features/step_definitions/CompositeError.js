var expect = require("expect.js"),
    o3 = require("../../.."),
    CompositeError = o3.CompositeError,
    UserError = o3.UserError;

module.exports = function () {

    var instance;
    this.When(/^I instantiate the CompositeError class with Error attributes$/, function (next) {
        instance = new CompositeError({
            message: "xxx",
            a: new Error("yyy"),
            b: new CompositeError({
                message: "zzz",
                x: new UserError("qqq")
            })
        });
        next();
    });

    this.Then(/^the instance should be a CompositeError instance$/, function (next) {
        expect(instance).to.be.an(CompositeError);
        next();
    });

    this.Then(/^it should be an UserError descendant$/, function (next) {
        expect(instance).to.be.an(UserError);
        next();
    });

    this.Then(/^it should have a joined stack with the stacks of the Error attributes$/, function (next) {
        expect(instance.toString()).to.be("CompositeError: xxx");
        expect(/CompositeError: xxx/.test(instance.stack)).to.be.ok();
        expect(/caused by <a> Error: yyy/.test(instance.stack)).to.be.ok();
        expect(/caused by <b> CompositeError: zzz/.test(instance.stack)).to.be.ok();
        expect(/caused by <b.x> UserError: qqq/.test(instance.stack)).to.be.ok();
        expect(/at .*\.js:\d+:\d+/.test(instance.stack)).to.be.ok();
        next();
    });

};