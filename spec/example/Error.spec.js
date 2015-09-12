var o3 = require("o3");

describe("example", function () {

    describe("2. wrapper, user errors", function () {

        it("implements wrapper", function () {

            var m = jasmine.createSpy();
            var o = {
                m: m
            };
            var p = jasmine.createSpy().and.callFake(function () {
                return o3.toArray(arguments);
            });
            o.m = new o3.Wrapper({
                algorithm: o3.Wrapper.algorithm.cascade,
                preprocessors: [p],
                done: o.m
            }).toFunction();
            o.m(1, 2, 3);
            expect(m).toHaveBeenCalledWith(1, 2, 3);
            expect(p).toHaveBeenCalledWith(1, 2, 3);
        });

        it("implements UserError", function () {

            var MyError = o3.UserError.extend({
                    name: "MyError"
                }),
                MyErrorDescendant = MyError.extend({
                    message: "Something really bad happened."
                }),
                AnotherDescendant = MyError.extend(),
                throwMyErrorDescendant = function () {
                    throw new MyErrorDescendant();
                };

            expect(throwMyErrorDescendant).toThrow(new MyErrorDescendant());

            try {
                throwMyErrorDescendant();
            } catch (err) {
                expect(err instanceof MyErrorDescendant).toBe(true);
                expect(err instanceof MyError).toBe(true);
                expect(err instanceof o3.UserError).toBe(true);
                expect(err instanceof Error).toBe(true);

                expect(err instanceof AnotherDescendant).toBe(false);
                expect(err instanceof SyntaxError).toBe(false);

                expect(err.stack).toBeDefined();
                expect(err.stack).toContain(err.name);
                expect(err.stack).toContain(err.message);
                expect(err.stack).toContain("throwMyErrorDescendant");
            }

        });

        it("implements CompositeError", function () {

            var MyCompositeError = o3.CompositeError.extend({
                    name: "MyError",
                    message: "Something really bad caused this."
                }),
                throwMyUserError = function () {
                    throw new o3.UserError("Something really bad happened.");
                },
                throwMyCompositeError = function () {
                    try {
                        throwMyUserError();
                    }
                    catch (cause) {
                        throw new MyCompositeError({
                            myCause: cause
                        });
                    }
                };

            expect(throwMyCompositeError).toThrow(new MyCompositeError());

            try {
                throwMyCompositeError();
            } catch (err) {
                expect(err instanceof MyCompositeError).toBe(true);
                expect(err instanceof o3.CompositeError).toBe(true);
                expect(err instanceof o3.UserError).toBe(true);
                expect(err.myCause instanceof o3.UserError).toBe(true);
                expect(err.stack).toBeDefined();
                expect(err.stack).toContain(err.name);
                expect(err.stack).toContain(err.message);
                expect(err.stack).toContain(err.myCause.stack);
                expect(err.stack).toContain("throwMyCompositeError");
                expect(err.stack).toContain("throwMyUserError");
            }

        });

    });

});