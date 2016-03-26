var expect = require("expect.js"),
    o3 = require("../../.."),
    merge = o3.merge;

module.exports = function () {

    var subject;

    this.When(/^I merge an object having a merge method$/, function (next) {
        subject = {
            merge: function (a, b) {
                this.a = a;
                this.b = b;
            }
        };
        merge(subject, 1, 2);
        next();
    });

    this.When(/^I merge a variable which does not have a merge method$/, function (next) {
        subject = {a: 1, b: 2};
        merge(subject, {c: 3}, {d: 4});
        next();
    });

    this.Then(/^the merge method should be called on the object with the sources$/, function (next) {
        expect(subject.a).to.be(1);
        expect(subject.b).to.be(2);
        next();
    });

    this.Then(/^shallow merge should be called on the variable with the sources$/, function (next) {
        expect(subject.c).to.be(3);
        expect(subject.d).to.be(4);
        next();
    });

};