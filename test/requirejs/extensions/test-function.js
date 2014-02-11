define(["mixin-function"], function (FunctionExtension) {

    describe("FunctionExtension", function () {
        it("Enables functions in Function.prototype", function () {
            FunctionExtension.enable();
            var f = function () {
            };
            var o = new f();
            expect(f.toObject()).toBe(f.prototype);
            expect(f.hasInstance(o)).toBeTruthy();
            var f2 = f.extend({
                a: 1
            });
            var o2 = new f2();
            expect(f2.hasAncestors(f)).toBeTruthy();
            expect(f.hasDescendants(f2)).toBeTruthy();
            expect(f.hasInstance(o2)).toBeTruthy();
            expect(f2.hasInstance(o2)).toBeTruthy();
            expect(f2.hasInstance(o)).toBeFalsy();
            expect(o2.a).toEqual(1);
            FunctionExtension.disable();
        });
    });

});