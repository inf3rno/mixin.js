var ih = require("inheritancejs");

describe("example", function () {

    describe("1. inheritance, instantiation, configuration, cloning and unique id", function () {

        it("implements inheritance, instantiation, configuration, cloning", function () {

            var log = jasmine.createSpy(),
                Cat = ih.Base.extend({
                    name: undefined,
                    configure: function () {
                        ++Cat.counter;
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

            kitty.merge({
                configure: function (postfix) {
                    this.name += " " + postfix;
                }
            });
            kitty.configure("Cat");
            kitty.meow();
            expect(log).toHaveBeenCalledWith("Kitty Cat: meow");
            kitty.configure("from London");
            kitty.meow();
            expect(log).toHaveBeenCalledWith("Kitty Cat from London: meow");

            var kittyClone = ih.clone(kitty);
            kittyClone.meow();
            expect(log).toHaveBeenCalledWith("Kitty Cat from London: meow");
        });




        it("implements unique id", function () {

            var id1 = ih.id(),
                id2 = ih.id();
            expect(id1).not.toBe(id2);
        });

        it("implements watch, unwatch", function (){

            var o = {};
            var log = jasmine.createSpy();
            ih.watch(o, "x", log);

            expect(log).not.toHaveBeenCalled();

            o.x = 1;
            expect(log).toHaveBeenCalledWith(1, undefined, "x", o);
            o.x = 2;
            expect(log).toHaveBeenCalledWith(2, 1, "x", o);

            log.calls.reset();
            expect(log).not.toHaveBeenCalled();

            ih.unwatch(o, "x", log);
            o.x = 3;
            expect(log).not.toHaveBeenCalled();
        });

    });

});