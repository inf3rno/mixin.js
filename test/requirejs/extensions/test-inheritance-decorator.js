define(["inheritance-decorator"], function (PrototypeDecorator) {

    describe("PrototypeDecorator(options)", function () {

        var Target = function () {
        };
        var proto = Target.prototype;
        var key = "property";
        var value = function () {
        };
        var source = {};
        source[key] = value;
        var extension = new PrototypeDecorator({
            target: Target,
            source: source
        });

        it("should not enable extensions by default", function () {
            expect(proto[key]).toBeUndefined();
            expect(extension.isEnabled).toBeFalsy();
        });

        it("should enable extension by enable()", function () {
            extension.enable();
            expect(proto[key]).toBeDefined();
            expect(extension.isEnabled).toBeTruthy();
        });

        it("should restore undefined by disable()", function () {
            extension.disable();
            expect(proto[key]).toBeUndefined();
            expect(extension.isEnabled).toBeFalsy();
        });

        it("should restore original value by disable()", function () {
            proto[key] = 123;
            extension.enable();
            expect(proto[key] instanceof Function).toBeTruthy();
            extension.disable();
            expect(proto[key]).toEqual(123);
            delete(proto[key]);
        });

        it("should not restore value by disable() if something overrides the enabled value", function () {
            proto[key] = 123;
            extension.enable();
            expect(proto[key] instanceof Function).toBeTruthy();
            proto[key] = 321;
            extension.disable();
            expect(proto[key]).toEqual(321);
            delete(proto[key]);
        });

        it("should not behave different by calling enable() and disable() series", function () {
            extension.enable();
            extension.enable();
            expect(proto[key]).toBeDefined();
            expect(extension.isEnabled).toBeTruthy();
            extension.disable();
            extension.disable();
            expect(proto[key]).toBeUndefined();
            expect(extension.isEnabled).toBeFalsy();
        });

        it("should enable extension by config()", function () {
            extension.config({
                isEnabled: true
            });
            expect(extension.isEnabled).toBeTruthy();
            extension.disable();
        });

    });

});