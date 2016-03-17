var o3 = require(".."),
    dummy = o3.dummy;

describe("core", function () {

    describe("dummy", function () {

        it("does nothing", function () {
            expect(dummy(1, 2, 3)).toBe(undefined);
        });

    });

});
