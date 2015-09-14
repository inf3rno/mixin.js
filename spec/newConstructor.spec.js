var o3 = require("o3"),
    newConstructor = o3.newConstructor,
    dummy = o3.dummy;

describe("core", function () {

    describe("newConstructor", function () {

        it("returns always a new constructor", function () {

            var A = newConstructor();
            var B = newConstructor();
            expect(A instanceof Function).toBe(true);
            expect(B instanceof Function).toBe(true);
            expect(A).not.toBe(B);
        });

        describe("last", function () {

            it("contains the last created constructor", function () {

                var A = newConstructor();
                expect(newConstructor.last).toBe(A);
                var B = newConstructor();
                expect(newConstructor.last).toBe(B);
            });
        });

        describe("a new constructor", function () {

            it("defines a unique id to the instance", function () {
                var A = newConstructor();
                var a = new A();
                var a2 = new A();
                expect(a.id).not.toBe(a2.id);
            });

            it("calls the build and init methods if they are set", function () {

                var A = newConstructor();
                var mockInit = jasmine.createSpy();
                var mockBuild = jasmine.createSpy();
                A.prototype.init = mockInit;
                A.prototype.build = mockBuild;
                var a = new A(1, 2, 3);
                expect(mockBuild).toHaveBeenCalled();
                expect(mockInit).toHaveBeenCalledWith(1, 2, 3);
                expect(mockInit.calls.first().object).toBe(a);
            });
        });

    });

});
