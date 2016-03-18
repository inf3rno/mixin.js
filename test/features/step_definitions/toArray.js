var expect = require("expect.js"),
    o3 = require("../../.."),
    toArray = o3.toArray,
    InvalidArguments = o3.InvalidArguments;

module.exports = function () {

    var result;

    this.When(/^I call toArray on an arguments object$/, function (next) {
        var fn = function () {
            result = toArray(arguments);
        };
        fn(1, 2, 3);
        next();
    });

    this.Then(/^an Array containing each argument should be returned$/, function (next) {
        expect(result).to.eql([1, 2, 3]);
        next();
    });

    this.When(/^I call toArray on an Object$/, function (next) {
        result = toArray({a: 1, b: 2});
        next();
    });

    this.Then(/^the result should be the enumerable property values of the Object$/, function (next) {
        expect(result).to.eql([1, 2]);
        next();
    });

    this.When(/^I call toArray on an Object with a toArray method$/, function (next) {
        result = toArray({
            toArray: function () {
                return [1, 2, 3, 4];
            }
        });
        next();
    });

    this.Then(/^the result should be the return value of that toArray method$/, function (next) {
        expect(result).to.eql([1, 2, 3, 4]);
        next();
    });

    var arg;
    this.When(/^I call toArray on an Array$/, function (next) {
        arg = [1, 2];
        result = toArray(arg);
        next();
    });

    this.Then(/^I should get the copy of that Array$/, function (next) {
        expect(result).to.eql(arg);
        expect(result).not.to.equal(arg);
        next();
    });

    var fn;
    this.When(/^I call toArray on a primitive$/, function (next) {
        fn = function () {
            toArray("blah");
        };
        next();
    });

    this.When(/^I call toArray on a Function$/, function (next) {
        fn = function () {
            toArray(function () {
            });
        };
        next();
    });

    this.Then(/^it should throw an Error, because of the invalid argument$/, function (next) {
        expect(fn).to.throwError(new InvalidArguments());
        next();
    });

};