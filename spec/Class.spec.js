var o3 = require(".."),
    Class = o3.Class,
    InstantiatingAbstractClass = o3.InstantiatingAbstractClass,
    InvalidArguments = o3.InvalidArguments,
    toArray = o3.toArray;

describe("Class", function () {

    it("is an Object descendant", function () {

        expect(Class.prototype instanceof Object).toBe(true);
    });

    describe("constructor", function () {

        it("cannot be called, since this is an abstract class", function () {

            expect(function () {
                new Class();
            }).toThrow(new InstantiatingAbstractClass());
        });
    });

    describe("extend", function () {

        it("is a combination of clone and mixin", function () {

            var f = function () {
            };
            f.extend = Class.extend;
            f.clone = jasmine.createSpy().and.callFake(function () {
                return f;
            });
            f.mixin = jasmine.createSpy();
            f.extend(1, 2);
            expect(f.clone).toHaveBeenCalledWith();
            expect(f.mixin).toHaveBeenCalledWith(1, 2);
        });
    });

    describe("clone", function () {

        it("creates a new descendant, which inherits Class methods and is not abstract", function () {

            var My = Class.clone();
            expect(My instanceof Function).toBe(true);
            expect(My).not.toBe(Class);
            expect(My.clone).toBe(Class.clone);
            expect(My.prototype instanceof Class);

            expect(function () {
                new My();
            }).not.toThrow();
        });

        describe("a new descendant constructor", function () {

            it("calls the build and init methods if they are set", function () {

                var A = Class.clone();
                var mockBuild = jasmine.createSpy();
                var mockInit = jasmine.createSpy();
                A.prototype.build = mockBuild;
                A.prototype.init = mockInit;
                var a = new A(1, 2, 3);
                expect(mockBuild).toHaveBeenCalled();
                expect(mockInit).toHaveBeenCalledWith(1, 2, 3);
                expect(mockInit.calls.first().object).toBe(a);
            });
        });
    });

    describe("mixin", function () {

        it("merges prototype and static properties by calling merge functions", function () {

            var f = function () {
            };
            f.merge = jasmine.createSpy();
            f.prototype.merge = jasmine.createSpy();
            f.mixin = Class.mixin;
            f.mixin(1, 2);
            expect(f.merge).toHaveBeenCalledWith(2);
            expect(f.prototype.merge).toHaveBeenCalledWith(1);
        });
    });

    describe("merge", function () {

        it("calls the shallowMerge function on the class", function () {
            var My = Class.clone();
            My.merge({a: 1});
            expect(My.a).toBe(1);
        });

    });

    describe("prototpye", function () {

        describe("init", function () {

            it("calls merge", function () {

                var log = jasmine.createSpy();
                var Descendant = Class.extend({
                    merge: log
                });
                var descendant = new Descendant({a: 1}, {b: 2});
                expect(log).toHaveBeenCalledWith({a: 1}, {b: 2});
            });

        });

        describe("clone", function () {

            it("calls Object.create() on the instance", function () {

                var a = new (Class.clone())({
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

                var a = new (Class.clone())({
                    build: jasmine.createSpy()
                });
                var b = a.clone();
                expect(a.build).toHaveBeenCalled();
                expect(a.build.calls.first().object).toBe(b);
            });

        });

        describe("merge", function () {

            it("calls the shallowMerge function on the instance", function () {

                var err = new (Class.clone())();
                err.merge({
                    a: 1
                });
                expect(err.a).toBe(1);
                expect(Class.prototype.a).toBeUndefined();
            });

        });


    });

});