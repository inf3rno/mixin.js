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
                    }).toThrow("Invalid source type.");
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

        it("should work well with native prototypes and constructors", function () {
            var Constructor = Function;
            var p = Function.prototype;

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

        it("should mixin, but not call initialize by sources with non-generated constructor", function () {
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
                            throw new Error("$");
                        });
                        var C = M.toFunction();
                        var i = new C();
                        expect(i.initialize).toBeDefined();
                    }).not.toThrow();
        });

        it("should call ancestor constructors if an aggregator initialize is set", function () {
            var A = function () {
                this.a = 1;
            };
            A.prototype.x = 1;
            var B = function () {
                this.b = 2;
            };
            B.prototype.y = 2;
            var M = new Mixin();
            var agg = function () {
                A.call(this);
                B.call(this);
            };
            M.mixin(A, B, {
                initialize: agg
            });
            var C = M.toFunction();
            var i = new C();
            expect(i).toEqual({initialize: agg, x: 1, y: 2, a: 1, b: 2});
        });

    });

    describe("Mixin.extend(source 1, source 2, ... source i) behavior with valid sources", function () {

        it("should call the original constructor and store it under the name initialize", function () {
            var AC = function () {
                throw new Error("$");
            };
            var AM = new Mixin(AC);
            var DM = AM.extend();
            var DC = DM.toFunction();
            expect(DC.prototype).toEqual({initialize: AC});
            expect(function () {
                new DC();
            }).toThrow("$");
        });

        it("should not store the original constructor if it was generated, but call its initialize", function () {
            var oA = {
                initialize: function () {
                    throw new Error("$");
                }
            };
            var AM = new Mixin(oA);
            var DM = AM.extend();
            var DC = DM.toFunction();
            expect(DC.prototype).toEqual({initialize: oA.initialize});
            expect(function () {
                new DC();
            }).toThrow("$");
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
            expect(d).toEqual({initialize: A, a: 1, b: 2});
            A.prototype.x = 1;
            MA.mixin({y: 2});
            expect(a).toEqual({a: 1, x: 1, y: 2});
            expect(d).toEqual({initialize: A, a: 1, b: 2, x: 1, y: 2});
        });

        it("should set the constructor property automatically", function () {
            var M = new Mixin({});
            var F = M.toFunction();
            var i = new F();
            expect(i.constructor).toBe(F);

            var F2 = function () {
            };
            var M2 = new Mixin(F2);
            var i2 = new F2();
            expect(i2.constructor).toBe(F2);

            var M3 = M2.extend(M);
            var F3 = M3.toFunction();
            var i3 = new F3();
            expect(i3.constructor).toBe(F3);
        });

        it("should call initialize of the ancestor if its generated constructor is called in a context of a descendant instance", function () {
            var ancestor = new Mixin({
                initialize: function () {
                    this.a = 1;
                }
            });
            var Ancestor = ancestor.toFunction();
            var descendant = ancestor.extend({
                initialize: function () {
                    Ancestor.call(this);
                    this.b = 2;
                }
            });
            var Descendant = descendant.toFunction();
            var instance = new Descendant();
            expect(instance).toEqual({initialize: Descendant.prototype.initialize, a: 1, b: 2});
        });

    });

    describe("Mixin.hasAncestors(source 1, source 2, ...)", function () {
        it("should know whether it inherits from an ancestor or not", function () {
            var A = new Mixin();
            expect(A.hasAncestors(A)).toBeFalsy();
            var B = A.extend();
            expect(B.hasAncestors(A)).toBeTruthy();
            expect(A.hasAncestors(B)).toBeFalsy();
            var C = B.extend();
            expect(C.hasAncestors(A)).toBeTruthy();
            expect(C.hasAncestors(B)).toBeTruthy();
            expect(A.hasAncestors(C)).toBeFalsy();
            expect(B.hasAncestors(C)).toBeFalsy();

            var I = new Mixin();
            var J = Mixin().extend(I);
            expect(J.hasAncestors(I)).toBeTruthy();
            expect(I.hasAncestors(J)).toBeFalsy();
            var K = Mixin().extend(J);
            expect(K.hasAncestors(I)).toBeTruthy();
            expect(K.hasAncestors(J)).toBeTruthy();
            expect(I.hasAncestors(K)).toBeFalsy();
            expect(J.hasAncestors(K)).toBeFalsy();

            var P = A.extend(I);
            var Q = B.extend(J);
            var R = C.extend(K);
            expect(P.hasAncestors(A)).toBeTruthy();
            expect(P.hasAncestors(A, B)).toBeFalsy();
            expect(P.hasAncestors(A, I)).toBeTruthy();
            expect(Q.hasAncestors(A, B, I, J)).toBeTruthy();
            expect(R.hasAncestors(A, B, C, I, J, K)).toBeTruthy();
        });
    });

    describe("Mixin.hasDescendants(source 1, source 2, ...)", function () {
        it("should know whether it inherits to a descendant or not", function () {
            var A = new Mixin();
            var B = A.extend();
            var C = B.extend();
            expect(B.hasDescendants(A)).toBeFalsy();
            expect(B.hasDescendants(B)).toBeFalsy();
            expect(B.hasDescendants(C)).toBeTruthy();

            var I = new Mixin();
            var J = Mixin().extend(I);
            var K = Mixin().extend(J);
            expect(J.hasDescendants(I)).toBeFalsy();
            expect(J.hasDescendants(J)).toBeFalsy();
            expect(J.hasDescendants(K)).toBeTruthy();

            var P = A.extend(I);
            var Q = B.extend(J);
            var R = C.extend(K);
            expect(B.hasDescendants(P)).toBeFalsy();
            expect(B.hasDescendants(Q)).toBeTruthy();
            expect(B.hasDescendants(R)).toBeTruthy();

            expect(B.hasDescendants(R, Q)).toBeTruthy();
            expect(B.hasDescendants(R, P)).toBeFalsy();

            expect(A.hasDescendants(B, C, P, Q, R)).toBeTruthy();
            expect(I.hasDescendants(J, K, P, Q, R)).toBeTruthy();
        });
    });

    describe("Mixin.hasInstance(instance)", function () {
        it("should know whether it or its descendant has an instance", function () {
            var A = new Mixin();
            var B = A.extend();
            var C = B.extend();

            var I = new Mixin();
            var J = Mixin().extend(I);
            var K = Mixin().extend(J);

            var P = A.extend(I);
            var Q = B.extend(J);
            var R = C.extend(K);

            var Fc = C.toFunction();
            var c = new Fc();
            expect(Mixin().hasInstance(c)).toBeFalsy();
            expect(A.hasInstance(c)).toBeTruthy();

            var Fk = K.toFunction();
            var k = new Fk();
            expect(I.hasInstance(k)).toBeTruthy();

            var Fr = R.toFunction();
            var r = new Fr();
            expect(A.hasInstance(r)).toBeTruthy();
            expect(I.hasInstance(r)).toBeTruthy();
            expect(P.hasInstance(r)).toBeFalsy();
            expect(Q.hasInstance(r)).toBeFalsy();
            expect(R.hasInstance(r)).toBeTruthy();
        });
    });

    describe("Mixin.Extension(options)", function () {

        var target = function () {
        };
        var proto = target.prototype;
        var key = "property";
        var value = function () {
        };
        var source = {};
        source[key] = value;
        var extension = new Mixin.Extension({
            target: target,
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