var o3 = require("o3"),
    mixin = o3.mixin,
    InvalidArguments = o3.InvalidArguments;

describe("core", function () {

    describe("mixin", function () {

        it("accepts constructor as subject and objects as property and static property sources", function () {
            expect(function () {
                mixin(function () {
                });
                mixin(function () {
                }, {});
                mixin(function () {
                }, {}, {});
                mixin(function () {
                }, null, undefined);
            }).not.toThrow();

            expect(function () {
                mixin({});
            }).toThrow(new InvalidArguments());

            expect(function () {
                mixin(function () {
                }, {}, {}, {});
            }).toThrow(new InvalidArguments());

            expect(function () {
                mixin(function () {
                }, 1);
            }).toThrow(new InvalidArguments());

            expect(function () {
                mixin(function () {
                }, null, 1);
            }).toThrow(new InvalidArguments());

        });

        it("mixins the properties of the subject with the given ones", function () {
            var subject = function () {
            };
            var x = {}, x2 = {};
            subject.prototype.x = x;
            mixin(subject, {x: x2});
            expect(subject.prototype.x).not.toBe(x);
            expect(subject.prototype.x).toBe(x2);
        });

        it("mixins the static properties of the subject with the given ones", function () {
            var subject = function () {
            };
            var x = {}, x2 = {};
            subject.x = x;
            mixin(subject, null, {x: x2});
            expect(subject.x).not.toBe(x);
            expect(subject.x).toBe(x2);
        });

        it("returns the subject", function () {

            var subject = function () {
            };
            expect(mixin(subject)).toBe(subject);
        });
    });

});
