var o3 = require("o3"),
    UserError = o3.UserError,
    InvalidArguments = o3.InvalidArguments,
    InvalidResult = o3.InvalidResult,
    InvalidConfiguration = o3.InvalidConfiguration,
    StackTrace = o3.StackTrace;

describe("UserError", function () {

    it("is an Error descendant", function () {

        expect(UserError.prototype instanceof Object).toBe(true);
        expect(UserError.prototype instanceof Error).toBe(true);
        expect(UserError.prototype instanceof SyntaxError).toBe(false);
    });

    describe("constructor", function () {

        it("is almost the same as the Class descendant constructor except stack creation", function () {

            var o = {
                build: jasmine.createSpy(),
                init: jasmine.createSpy(),
                toStackString: jasmine.createSpy().and.callFake(function () {
                    return "str";
                })
            };
            UserError.call(o, 1, 2, 3);
            expect(o.build).toHaveBeenCalled();
            expect(o.init).toHaveBeenCalledWith(1, 2, 3);
            expect(o.stackTrace instanceof StackTrace).toBe(true);
            expect(o.toStackString).not.toHaveBeenCalled();
            expect(o.stack).toBe("str");
            expect(o.toStackString).toHaveBeenCalled();
        });
    });

    describe("extend", function () {

        it("calls the extend function on the class", function () {

            var MyError = UserError.extend({a: 1}, {b: 2});
            var err = new MyError();
            expect(MyError.prototype instanceof UserError);
            expect(MyError.prototype.a).toBe(1);
            expect(MyError.b).toBe(2);
            expect(err.id).toBeDefined();
        });

    });

    describe("prototype", function () {

        describe("merge", function () {

            it("calls the merge function on the instance", function () {

                var err = new UserError();
                err.merge({
                    a: 1
                });
                expect(err.a).toBe(1);
                expect(UserError.prototype.a).toBeUndefined();
            });

            it("transforms message string to source object", function () {

                var err = new UserError();
                err.merge("message");
                expect(err.message).toBe("message");
            });

        });

    });

});

describe("InvalidArguments", function () {

    it("is an UserError descendant", function () {

        expect(InvalidArguments.prototype instanceof UserError).toBe(true);
    });

    describe("Empty", function () {

        it("is an InvalidArguments descendant", function () {

            expect(InvalidArguments.Empty.prototype instanceof InvalidArguments).toBe(true);

        });

    });

});

describe("InvalidResult", function () {

    it("is an UserError descendant", function () {

        expect(InvalidResult.prototype instanceof UserError).toBe(true);
    });

});

describe("InvalidConfiguration", function () {

    it("is an UserError descendant", function () {

        expect(InvalidConfiguration.prototype instanceof UserError).toBe(true);
    });
});

describe("Message building by UserError descendants", function () {

    it("is possible by overriding the init", function () {

        var MyError = UserError.extend({
            init: function (o) {
                this.message = o.x + "," + o.y;
            }
        });
        var err = new MyError({x: 1, y: 2});
        expect(err.message).toBe("1,2");

    });

});