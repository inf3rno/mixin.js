var o3 = require("o3"),
    shallowClone = o3.shallowClone,
    newConstructor = o3.newConstructor,
    dummy = o3.dummy;

describe("core", function () {

    describe("shallowClone", function () {

        it("returns the same primitives", function () {
            [
                undefined,
                null,
                "string",
                123,
                true,
                false
            ].forEach(function (value) {
                    expect(shallowClone(value)).toBe(value);
                });
        });

        it("returns a different Array with the same values", function () {

            var a = [{}, 1, 2, 3];
            var b = shallowClone(a);
            expect(b).toEqual(a);
            expect(b).not.toBe(a);
            expect(b[0]).toBe(a[0]);
        });

        it("returns a different Date with the same time", function () {

            var a = new Date();
            var b = shallowClone(a);
            expect(b instanceof Date);
            expect(b).not.toBe(a);
            expect(b.toString()).toBe(a.toString());
        });

        it("returns a different RegExp with the same pattern and flags", function () {

            var a = /\w/gm;
            var b = shallowClone(a);
            expect(b instanceof RegExp);
            expect(b).not.toBe(a);
            expect(b.toString()).toBe(a.toString());
        });

        it("returns a descendant Object created with Object.create", function () {

            var a = {x: {}, y: 1};
            var b = shallowClone(a);
            expect(b).not.toBe(a);
            expect(b.x).toBe(a.x);
            a.y = 2;
            expect(b.y).toBe(a.y);
            b.y = 3;
            expect(b.y).not.toBe(a.y);
        });

        it("returns a new Constructor with a descendant prototype and merged properties by passing a Function", function () {
            var Ancestor = function () {
            };
            Ancestor.x = {};
            var Descendant = shallowClone(Ancestor);
            expect(Descendant instanceof Function).toBe(true);
            expect(Descendant).toBe(newConstructor.last);
            expect(Ancestor).not.toBe(Descendant);
            expect(Descendant.prototype instanceof Ancestor);
            expect(Descendant.x).toBe(Ancestor.x);
        });

    });

});
