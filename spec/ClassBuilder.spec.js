var o3 = require(".."),
    ClassBuilder = o3.ClassBuilder,
    InvalidArguments = o3.InvalidArguments,
    InvalidStateTransition = o3.InvalidStateTransition,
    dummy = o3.dummy;

describe("ClassBuilder", function () {

    describe("setConstructor", function () {

        it("accepts only functions", function () {

            [
                null,
                undefined,
                123,
                false,
                {},
                /r/
            ].forEach(function (subject) {
                    expect(function () {
                        var classBuilder = new ClassBuilder();
                        classBuilder.setConstructor(subject);
                    }).toThrow(new InvalidArguments());
                });

            expect(function () {
                var classBuilder = new ClassBuilder();
                classBuilder.setConstructor(function () {
                });
            }).not.toThrow();
        });

        it("throws error when the previous constructor is not released", function () {
            var classBuilder = new ClassBuilder();
            classBuilder.setConstructor(function () {
            });
            expect(function () {
                classBuilder.setConstructor(function () {
                });
            }).toThrow(new InvalidStateTransition());
            expect(function () {
                classBuilder.release();
                classBuilder.setConstructor(function () {
                });
            }).not.toThrow();
        });
    });

    describe("inherit", function () {

        it("inherits the prototype and the static properties from the given class", function () {

            var Ancestor = function () {
            };
            Ancestor.x = 1;
            Ancestor.y = 1;
            Ancestor.prototype = {
                a: 1,
                b: 1
            };

            var Descendant = function () {
            };
            Descendant.x = 2;
            Descendant.z = 2;
            Descendant.prototype = {
                a: 2,
                b: 2,
                c: 2
            };

            var classBuilder = new ClassBuilder();
            classBuilder.setConstructor(Descendant);
            classBuilder.inherit(Ancestor);
            expect(Descendant.x).toBe(1);
            expect(Descendant.y).toBe(1);
            expect(Descendant.z).toBe(2);
            expect(Descendant.prototype.a).toBe(1);
            expect(Descendant.prototype.b).toBe(1);
            expect(Descendant.prototype.c).not.toBeDefined();
        });

    });

    describe("setPrototype", function () {

        it("accepts only objects", function () {

            var classBuilder = new ClassBuilder();
            classBuilder.setConstructor(function () {
            });

            [
                null,
                undefined,
                123,
                false,
                dummy
            ].forEach(function (prototype) {
                    expect(function () {
                        classBuilder.setPrototype(prototype);
                    }).toThrow(new InvalidArguments());
                });

            [
                /r/,
                new Date(),
                {}
            ].forEach(function (prototype) {
                    expect(function () {
                        classBuilder.setPrototype(prototype);
                    }).not.toThrow();
                });
        });

        it("sets the constructor property on the prototype", function () {

            var classBuilder = new ClassBuilder();
            var f = function () {
            };
            var p = {};
            classBuilder.setConstructor(f);
            classBuilder.setPrototype(p);
            expect(p.constructor).toBe(f);
        });
    });

    describe("mergeStatic", function () {

        it("merges static properties to the constructor", function () {

            var f = function () {
            };
            f.a = 1;
            f.c = 1;
            var sp = {
                a: 2,
                b: 2
            };
            var classBuilder = new ClassBuilder();
            classBuilder.setConstructor(f);
            classBuilder.mergeStatic(sp);
            expect(f.a).toBe(2);
            expect(f.b).toBe(2);
            expect(f.c).toBe(1);
        });
    });

    describe("mergePrototype", function () {

        it("merges properties to the prototype", function () {

            var f = function () {
            };
            f.prototype.a = 1;
            f.prototype.c = 1;
            var sp = {
                a: 2,
                b: 2
            };
            var classBuilder = new ClassBuilder();
            classBuilder.setConstructor(f);
            classBuilder.mergePrototype(sp);
            expect(f.prototype.a).toBe(2);
            expect(f.prototype.b).toBe(2);
            expect(f.prototype.c).toBe(1);
        });
    });

    describe("release", function () {

        it("releases the constructor", function () {

            var f = function () {
            };
            var classBuilder = new ClassBuilder();
            classBuilder.setConstructor(f);
            expect(classBuilder.release()).toBe(f);
            expect(classBuilder.release()).not.toBeDefined();
        });
    });

});