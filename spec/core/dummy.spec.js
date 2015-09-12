var ih = require("inheritancejs"),
    dummy = ih.dummy;

describe("core", function () {

    describe("dummy", function () {

        it("does nothing", function () {
            expect(dummy(1, 2, 3)).toBe(undefined);
        });

    });

});
