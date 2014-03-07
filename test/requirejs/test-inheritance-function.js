define(["inheritance-function"], function (functionExtension) {

    describe("FunctionExtension", function () {
        it("Enables functions in Function.prototype", function () {
            functionExtension.enable();
            var Ancestor = function () {
            };
            var ancestor = new Ancestor();
            expect(Ancestor.toObject()).toBe(Ancestor.prototype);
            expect(Ancestor.hasInstance(ancestor)).toBeTruthy();
            var Descendant = Ancestor.extend({
                prop: 1
            });
            var descendant = new Descendant();
            expect(Descendant.hasAncestors(Ancestor)).toBeTruthy();
            expect(Ancestor.hasDescendants(Descendant)).toBeTruthy();
            expect(Ancestor.hasInstance(descendant)).toBeTruthy();
            expect(Descendant.hasInstance(descendant)).toBeTruthy();
            expect(Descendant.hasInstance(ancestor)).toBeFalsy();
            expect(descendant.prop).toEqual(1);
            functionExtension.disable();
        });
    });

});