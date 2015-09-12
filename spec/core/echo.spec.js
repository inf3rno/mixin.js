var ih = require("inheritancejs"),
    echo = ih.echo;

describe("core", function () {

    describe("echo", function () {

        it("returns the first argument", function () {
            expect(echo(1, 2, 3)).toBe(1);
            expect(echo()).toBe(undefined);
        });

    });

});
