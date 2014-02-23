define(["inheritance-object"], function (objectDecorator) {

    describe("ObjectExtension", function () {
        it("Enables functions in Object.prototype", function () {
            objectDecorator.enable();
            var Ancestor = function () {
            };
            var ancestorProto = {
                constructor: Ancestor
            };
            Ancestor.prototype = ancestorProto;
            var ancestor = new Ancestor();
            expect(ancestorProto.toFunction()).toBe(Ancestor);
            expect(ancestor.instanceOf(ancestorProto)).toBeTruthy();
            expect(ancestor.instanceOf(Ancestor)).toBeTruthy();
            var descendantProto = ancestorProto.extend({
                prop: 1
            });
            var Descendant = descendantProto.toFunction();
            var descendant = new Descendant();
            expect(descendantProto.hasAncestors(ancestorProto)).toBeTruthy();
            expect(ancestorProto.hasDescendants(descendantProto)).toBeTruthy();
            expect(descendant.instanceOf(ancestorProto)).toBeTruthy();
            expect(descendant.instanceOf(descendantProto)).toBeTruthy();
            expect(ancestor.instanceOf(descendantProto)).toBeFalsy();
            expect(descendant.prop).toEqual(1);
            objectDecorator.disable();
        });
    });

});