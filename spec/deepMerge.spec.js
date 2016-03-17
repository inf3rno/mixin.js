var o3 = require(".."),
    deepMerge = o3.deepMerge,
    InvalidArguments = o3.InvalidArguments,
    dummy = o3.dummy;

describe("core", function () {

    describe("deepMerge", function () {

        describe("it is backward compatible with shallowMerge", function () {

            it("accepts any type of object as subject and sources", function () {

                expect(function () {
                    deepMerge({}, []);
                    deepMerge({}, [{}]);
                    deepMerge({}, [{}, {}]);
                    deepMerge(dummy, [dummy, dummy]);
                    deepMerge(new Date(), [new RegExp(), dummy, []]);
                    deepMerge({}, [null]);
                    deepMerge({}, [undefined]);
                }).not.toThrow();

                expect(function () {
                    deepMerge({}, [1, 2, 3]);
                }).toThrow(new InvalidArguments());

                expect(function () {
                    deepMerge(null, []);
                }).toThrow(new InvalidArguments());

                expect(function () {
                    deepMerge(null, [{}]);
                }).toThrow(new InvalidArguments());

                expect(function () {
                    deepMerge(1, [{}]);
                }).toThrow(new InvalidArguments());

                expect(function () {
                    deepMerge({}, [false]);
                }).toThrow(new InvalidArguments());

                expect(function () {
                    deepMerge({}, {});
                }).toThrow(new InvalidArguments());
            });

            it("overrides properties of the subject with the properties of the sources", function () {

                var subject = {};
                deepMerge(subject, [{a: 1}, {b: 2}, {a: 3, c: 4}]);
                expect(subject).toEqual({b: 2, a: 3, c: 4});
            });

            it("overrides native methods of the subject with the ones defined in the sources", function () {
                var subject = {};
                var toString = function () {
                    return "";
                };
                deepMerge(subject, [{toString: toString}]);
                expect(subject.toString).toBe(toString);
            });

            it("returns the subject", function () {

                var subject = {};
                expect(deepMerge(subject, [])).toBe(subject);
                expect(deepMerge(subject, [{a: 1}, {b: 2}])).toBe(subject);
            });

        });

        it("accepts Object instance or nothing as meta", function () {

        });

    });


});
