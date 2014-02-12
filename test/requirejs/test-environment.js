define(function () {

    describe("jasmine behavior about exceptions", function () {
        it("should not late bind the evaluation of toThrow", function () {
            var i = 2;
            while (i--)
                expect(function () {
                    throw new Error(i);
                }).toThrow(String(i))
        });
    });

});