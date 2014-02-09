define(["mixin"], function (Mixin) {

    describe("jasmine behavior about exceptions", function () {
        it("should not late bind the evaluation of toThrow", function () {
            var i = 2;
            while (i--)
                expect(function () {
                    throw new Error(i);
                }).toThrow(String(i))
        });
    });

    describe("new Mixin(source) behavior with depending on validity of the sources", function () {

        it("should not accept invalid sources", function () {
            var invalidSources = {
                boolean: false,
                string: "str",
                number: 0
            };
            for (var type in invalidSources)
                if (invalidSources.hasOwnProperty(type))
                    expect(function () {
                        new Mixin(invalidSources[type]);
                    }).toThrow("Invalid source type of " + type + ".");
        });

        it("should accept valid sources", function () {
            var validSources = {
                "null": null,
                "undefined": undefined,
                "object": {},
                "function": function () {
                },
                "prototype": function () {
                }.prototype,
                "object derivated from null": Object.create(null),
                "instance": new (function () {
                }),
                "object derivated from prototype": Object.create(function () {
                }.prototype)
            };
            for (var type in validSources)
                if (validSources.hasOwnProperty(type))
                    expect(function () {
                        new Mixin(validSources[type]);
                    }).not.toThrow();
        });

        it("should work if called as function", function () {
            expect(Mixin({a: 1}) instanceof Mixin).toBeTruthy();
        });
    });

    describe("Mixin.toFunction() and Mixin.toObject() behavior with valid sources like functions and objects", function () {

        it("should not create new constructor if we add functions as source", function () {
            var Constructor = function () {
            };
            var p = {
                p: 1
            };
            Constructor.prototype = p;
            var M = new Mixin(Constructor);
            var F = M.toFunction();
            var o = M.toObject();

            expect(F).toBe(M.toFunction());
            expect(F).toBe(Constructor);
            expect(o).toBe(M.toObject());
            expect(o).toBe(p);
        });

        it("should not create new constructor by prototypes", function () {
            var Constructor = function () {
            };
            var p = {
                constructor: Constructor,
                p: 1
            };
            Constructor.prototype = p;
            var M = new Mixin(Constructor.prototype);
            var F = M.toFunction();
            var o = M.toObject();

            expect(F).toBe(Constructor);
            expect(o).toBe(Constructor.prototype);
            expect(o).toBe(p);
        });

        it("should create new constructor by non-prototypes", function () {
            var Constructor = function () {
            };

            var nonp = {
                "null": null,
                "undefined": undefined,
                "object": {},
                "object derivated from null": Object.create(null),
                "instance": new Constructor(),
                "object derivated from prototype": Object.create(Constructor.prototype)
            };

            for (var type in nonp)
                if (nonp.hasOwnProperty(type)) {
                    var o = nonp[type];
                    var M = new Mixin(o);
                    var F = M.toFunction();

                    expect(F instanceof Function).toBeTruthy();
                    expect(F).toNotBe(Constructor);
                    expect(F).toNotBe(Object);
                    if (o) {
                        expect(o).toBe(F.prototype);
                        expect(o).toBe(M.toObject());
                    }
                }
        });

        it("should call the old constructor from the newly created by instantiation", function () {
            var F = function () {
                throw new Error("$");
            };
            var o = Object.create(F.prototype);
            var M = new Mixin(o);
            expect(function () {
                var Constructor = M.toFunction();
                new Constructor();
            }).toThrow("$");
        });

        it("should not do anything by instantiation if the old constructor was empty", function () {
            var o = Object.create(null);
            var M = new Mixin(o);
            expect(function () {
                var Constructor = M.toFunction();
                new Constructor();
            }).not.toThrow();
        });

        it("should pass the arguments by instantiation", function () {
            var spy = jasmine.createSpy("mock constructor");
            var M = new Mixin(spy);
            var i = new spy("a", "b");
            expect(spy).toHaveBeenCalledWith("a", "b");
        });

        it("should not cause infinite loop by misusage of multiple mixins", function () {
            var Constructor = function () {
            };
            var o = {
                constructor: Constructor
            };
            var M = new Mixin(o);
            var F = M.toFunction();
            expect(F).toNotBe(Constructor);
            var M2 = new Mixin({constructor: F});
            var F2 = M2.toFunction();
            expect(F2).toNotBe(F);
            expect(function () {
                new F2();
            }).not.toThrow();
        });

        it("should not override constructor arrays by multiple mixins", function () {
            var C = function () {
            };
            var o = {constructor: C};
            var M = new Mixin(o);
            expect(M.toObject().constructor).toEqual([C]);
            var M2 = new Mixin(o);
            expect(M.toObject().constructor).toBe(M2.toObject().constructor);
            expect(M.toObject().constructor).toEqual([C]);
        });

    });

    describe("Mixin.mixin(source 1, source 2, ... source i) behavior with valid sources", function () {

        it("should mixin properties with the source or the prototype of the source", function () {
            var sources = {
                "object": {},
                "prototype": function () {
                }.prototype
            };
            for (var name in sources)
                if (sources.hasOwnProperty(name)) {
                    var o = sources[name];
                    var M = new Mixin(o);
                    M.mixin({name: name}, {a: 0, b: 2}, {a: 1, c: 3}, {d: 4});
                    expect(o).toEqual({name: name, a: 1, b: 2, c: 3, d: 4});
                }
        });

        it("should not mixin constructors by function source or prototype source", function () {
            var F = function () {
            };
            var sources = {
                "function": F,
                "prototype": F.prototype
            };
            for (var type in sources)
                if (sources.hasOwnProperty(type))
                    expect(function () {
                        var M = new Mixin(sources[type])
                        M.mixin(function () {
                        });
                    }).toThrow("Cannot mixin constructors by native or non-generated functions.");
        });

        it("should mixin constructors by non-prototype source", function () {
            var spy = jasmine.createSpy("mock constructor");
            var o = {constructor: spy};
            var M = new Mixin(o);
            M.mixin(spy, {constructor: spy}, Object.create(spy.prototype));
            var F = M.toFunction();
            new F();
            expect(spy).toHaveBeenCalled();
            expect(spy.callCount).toBe(4);
        });

        it("should mixin constructors of non-generated functions even if someone tempered with their prototype", function () {
            var spy = jasmine.createSpy("mock constructor");
            spy.prototype = {};
            var M = new Mixin();
            M.mixin(spy);
            var F = M.toFunction();
            new F();
            expect(spy).toHaveBeenCalled();
        });

        it("should not inherit changes of already mixed in constructors and properties", function () {
            var M = new Mixin();
            var A = new Mixin({
                constructor: function () {
                    this.a = 1
                }
            });
            var M2 = A.extend({
                constructor: function () {
                    this.b = 2
                }
            });
            M.mixin(M2);
            M2.mixin({
                constructor: function () {
                    this.c = 3
                },
                d: 4
            });
            A.mixin({
                constructor: function () {
                    this.e = 5;
                }
            });
            var F = M.toFunction();
            var F2 = M2.toFunction();
            var i = new F();
            var i2 = new F2();

            expect(i).toEqual({a: 1, b: 2, c: undefined, d: undefined, e: undefined});
            expect(i2).toEqual({a: 1, b: 2, c: 3, d: 4, e: 5});
        });
    });

    describe("Mixin.extend(source 1, source 2, ... source i) behavior with valid sources", function () {

        it("should inherit all the functions and constructors from the ancestor to the descendant", function () {
            var AC = function () {
                this.a = 1;
            };
            AC.prototype = {
                x: 1
            };
            var DC = function () {
                this.b = 2
            };
            var DDC = function () {
                this.c = 3;
            };
            var DDDC = function () {
                this.d = 4;
            };
            var AM = new Mixin(AC);
            var DM = AM.extend({
                y: 2,
                constructor: DC
            });
            var DDM = DM.extend(DDC);
            var DDDM = DDM.extend({constructor: DDDC});

            var Ap = AM.toObject();
            var Dp = DM.toObject();
            var DDp = DDM.toObject();
            var DDDp = DDDM.toObject();
            expect(Ap).toEqual({
                constructor: Object,
                x: 1
            });
            expect(Dp).toEqual({
                constructor: [AC, DC],
                x: 1,
                y: 2
            });
            expect(DDp).toEqual({
                constructor: [
                    [AC, DC],
                    DDC
                ],
                x: 1,
                y: 2
            });
            expect(DDDp).toEqual({
                constructor: [
                    [
                        [AC, DC],
                        DDC
                    ],
                    DDDC
                ],
                x: 1,
                y: 2
            });

            var A = AM.toFunction();
            var D = DM.toFunction();
            var DD = DDM.toFunction();
            var DDD = DDDM.toFunction();
            expect(A).toNotBe(D);
            var a = new A();
            var d = new D();
            var dd = new DD();
            var ddd = new DDD();
            expect(a).toEqual({a: 1, x: 1});
            expect(d).toEqual({a: 1, b: 2, x: 1, y: 2});
            expect(dd).toEqual({a: 1, b: 2, c: 3, x: 1, y: 2});
            expect(ddd).toEqual({a: 1, b: 2, c: 3, d: 4, x: 1, y: 2});

        });

        it("should inherit the changes of ancestors to the descendants", function () {
            var A = function () {
            };
            A.prototype = {
                a: 1
            };
            var MA = new Mixin(A);
            var MD = MA.extend({b: 2});
            var D = MD.toFunction();
            var a = new A();
            var d = new D();
            expect(a).toEqual({a: 1});
            expect(d).toEqual({a: 1, b: 2});
            A.prototype.x = 1;
            MA.mixin({y: 2});
            expect(a).toEqual({a: 1, x: 1, y: 2});
            expect(d).toEqual({a: 1, b: 2, x: 1, y: 2});
        });

        it("should inherit the changes of the constructors from ancestors to descendants", function () {
            var MA = new Mixin({constructor: function () {
                this.a = 1
            }});
            var MB = MA.extend({constructor: function () {
                this.b = 2
            }});
            var A = MA.toFunction();
            var B = MB.toFunction();
            var a = new A();
            var b = new B();
            MA.mixin({constructor: function () {
                this.c = 3;
            }});
            var a2 = new A();
            var b2 = new B();
            expect(a).toEqual({a: 1});
            expect(a2).toEqual({a: 1, c: 3});
            expect(b).toEqual({a: 1, b: 2});
            expect(b2).toEqual({a: 1, b: 2, c: 3});
        });
    });

    describe("Mixin.extensions", function () {
        it("should not enable extensions by default", function () {
            expect(Object.prototype.mixin).toBeUndefined();
            expect(Function.prototype.mixin).toBeUndefined();
        });

        it("should die if a required extension is not enabled", function () {
            expect(function () {
                Mixin.extensions.require(Object);
            }).toThrow("Required extensions are not all enabled!");
        });

        it("should die if a required extension is unknown", function () {
            expect(function () {
                Mixin.extensions.require(null);
            }).toThrow("Extension is not defined!");
        });

        it("should enable extension by enable()", function () {
            Mixin.extensions.enable(Function);
            expect(Function.prototype.mixin).toBeDefined();
            expect(Object.prototype.mixin).toBeUndefined();
        });

        it("should not enable unknown extensions", function () {
            expect(function () {
                Mixin.extensions.enable(null);
            }).toThrow("Extension is not defined!");
        });

        it("should die if one of the required extensions is not enabled", function () {
            expect(function () {
                Mixin.extensions.require(Function, Object);
            }).toThrow("Required extensions are not all enabled!");
        });

        it("should enable extension by setting require.config which is passed to Mixin.config()", function () {
            Mixin.config({
                extensions: [Object]
            });
            expect(Function.prototype.mixin).toBeDefined();
            expect(Object.prototype.mixin).toBeDefined();
        });

        it("should not die if require.config is not set", function () {
            expect(function () {
                Mixin.config();
            }).not.toThrow();
        });

        it("should not die if all required extension is enabled", function () {
            expect(function () {
                Mixin.extensions.require(Function, Object);
            }).not.toThrow();
        });

        it("should recognize custom extensions as well", function () {
            var o = {};
            Mixin.extensions.push({
                extend: o,
                source: {
                    a: 1
                }
            });
            expect(function () {
                Mixin.extensions.require(o);
            }).toThrow("Required extensions are not all enabled!");
            expect(function () {
                Mixin.extensions.enable(o);
            }).not.toThrow();
            expect(function () {
                Mixin.extensions.require(o);
            }).not.toThrow();
            expect(o).toEqual({a: 1});
        });
    });

});