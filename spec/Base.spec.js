var o3 = require("o3"),
    Base = o3.Base,
    InvalidArguments = o3.InvalidArguments,
    toArray = o3.toArray;

describe("Base", function () {

    it("is an Object descendant", function () {

        expect(Base.prototype instanceof Object).toBe(true);
    });

    describe("extend", function () {

        it("calls the extend function on the class", function () {

            var My = Base.extend({a: 1}, {b: 2});
            var my = new My();
            expect(My.prototype instanceof Base);
            expect(My.prototype.a).toBe(1);
            expect(My.b).toBe(2);
            expect(my.id).toBeDefined();
        });

    });

    describe("merge", function () {

        it("calls the merge function on the class", function () {

            var My = Base.extend();
            My.merge({a: 1});
            expect(My.a).toBe(1);
        });

    });

    describe("prototpye", function () {

        describe("clone", function () {

            it("calls Object.create() on the instance", function () {

                var a = new Base({
                    x: {},
                    y: 1
                });
                var b = a.clone();
                expect(b).not.toBe(a);
                expect(b.x).toBe(a.x);
                a.y = 2;
                expect(b.y).toBe(a.y);
                b.y = 3;
                expect(b.y).not.toBe(a.y);
            });

            it("calls build on the cloned instance", function () {

                var a = new Base({
                    build: jasmine.createSpy()
                });
                var b = a.clone();
                expect(a.build).toHaveBeenCalled();
                expect(a.build.calls.first().object).toBe(b);
            });

        });

        describe("init", function () {

            it("calls merge, configure in this order", function () {

                var log = jasmine.createSpy();
                var Descendant = Base.extend({
                    build: function () {
                        expect(this.id).toBeDefined();
                        log("build", this, toArray(arguments));
                    },
                    merge: function (a, b) {
                        log("merge", this, toArray(arguments));
                    },
                    configure: function () {
                        log("configure", this, toArray(arguments));
                    }
                });
                var descendant = new Descendant({a: 1}, {b: 2});
                expect(log.calls.argsFor(0)).toEqual(["build", descendant, []]);
                expect(log.calls.argsFor(1)).toEqual(["merge", descendant, [{a: 1}, {b: 2}]]);
                expect(log.calls.argsFor(2)).toEqual(["configure", descendant, []]);
                expect(log.calls.count()).toBe(3);
            });

        });

        describe("merge", function () {

            it("calls the shallowMerge function on the instance", function () {

                var err = new Base();
                err.merge({
                    a: 1
                });
                expect(err.a).toBe(1);
                expect(Base.prototype.a).toBeUndefined();
            });

        });


    });

});