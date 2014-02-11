define(["mixin-object"], function (ObjectExtension) {

    describe("FunctionExtension", function () {
        it("Enables functions in Function.prototype", function () {
            ObjectExtension.enable();
            var f = function () {
            };
            var p = {
                constructor: f
            };
            f.prototype = p;
            var o = new f();
            expect(p.toFunction()).toBe(f);
            expect(o.instanceOf(p)).toBeTruthy();
            expect(o.instanceOf(f)).toBeTruthy();
            var p2 = p.extend({
                a: 1
            });
            var f2 = p2.toFunction();
            var o2 = new f2();
            expect(p2.hasAncestors(p)).toBeTruthy();
            expect(p.hasDescendants(p2)).toBeTruthy();
            expect(o2.instanceOf(p)).toBeTruthy();
            expect(o2.instanceOf(p2)).toBeTruthy();
            expect(o.instanceOf(p2)).toBeFalsy();
            expect(o2.a).toEqual(1);
            ObjectExtension.disable();
        });
    });

});