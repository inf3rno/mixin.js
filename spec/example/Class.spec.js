var o3 = require("../..");

describe("example", function () {

    describe("inheritance, instantiation, cloning", function () {

        it("implements inheritance, instantiation, cloning", function () {

            var log = jasmine.createSpy(),
                Cat = o3.Class.extend({
                    name: undefined,
                    build: function () {
                        ++Cat.counter;
                    },
                    init: function (config) {
                        this.merge(config);
                        if (typeof(this.name) != "string")
                            throw new o3.InvalidConfiguration("Invalid cat name.");
                    },
                    meow: function () {
                        log(this.name + ": meow");
                    }
                }, {
                    counter: 0,
                    count: function () {
                        return this.counter;
                    }
                }),
                kitty = new Cat({name: "Kitty"}),
                killer = new Cat({name: "Killer"});

            kitty.meow();
            expect(log).toHaveBeenCalledWith("Kitty: meow");
            expect(log).not.toHaveBeenCalledWith("Killer: meow");
            killer.meow();
            expect(log).toHaveBeenCalledWith("Killer: meow");
            expect(Cat.count()).toBe(2);

            var kittyClone = o3.clone(kitty);
            kittyClone.meow();
            expect(log).toHaveBeenCalledWith("Kitty: meow");
            expect(Cat.count()).toBe(3);
        });

    });

});