define(["inheritance"], function (Inheritance) {

    describe("new Inheritance(source) behavior with depending on validity of the sources", function () {

        it("should not accept invalid sources", function () {
            var invalidSources = {
                boolean: false,
                string: "str",
                number: 0
            };
            for (var type in invalidSources)
                if (invalidSources.hasOwnProperty(type))
                    expect(function () {
                        new Inheritance(invalidSources[type]);
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
                        new Inheritance(validSources[type]);
                    }).not.toThrow();
        });

        it("should work if called as function", function () {
            expect(Inheritance({a: 1}) instanceof Inheritance).toBeTruthy();
        });
    });

    describe("Inheritance.toFunction() and Inheritance.toObject() behavior with valid sources like functions and objects", function () {

        it("should not create new constructor if we add functions as source", function () {
            var Constr = function () {
            };
            var proto = {
                p: 1
            };
            Constr.prototype = proto;
            var wrapper = new Inheritance(Constr);
            var Func = wrapper.toFunction();
            var obj = wrapper.toObject();

            expect(Func).toBe(wrapper.toFunction());
            expect(Func).toBe(Constr);
            expect(obj).toBe(wrapper.toObject());
            expect(obj).toBe(proto);
        });

        it("should not create new constructor by prototypes", function () {
            var Constr = function () {
            };
            var proto = {
                constructor: Constr,
                p: 1
            };
            Constr.prototype = proto;
            var wrapper = new Inheritance(Constr.prototype);
            var Func = wrapper.toFunction();
            var obj = wrapper.toObject();

            expect(Func).toBe(Constr);
            expect(obj).toBe(Constr.prototype);
            expect(obj).toBe(proto);
        });

        it("should work well with native prototypes and constructors", function () {
            var Constr = Function;
            var proto = Function.prototype;

            var wrapper = new Inheritance(Constr.prototype);
            var Func = wrapper.toFunction();
            var obj = wrapper.toObject();

            expect(Func).toBe(Constr);
            expect(obj).toBe(Constr.prototype);
            expect(obj).toBe(proto);
        });

        it("should create new constructor by non-prototypes", function () {
            var Constr = function () {
            };

            var nonPrototypeSources = {
                "null": null,
                "undefined": undefined,
                "object": {},
                "object derivated from null": Object.create(null),
                "instance": new Constr(),
                "object derivated from prototype": Object.create(Constr.prototype)
            };

            for (var type in nonPrototypeSources)
                if (nonPrototypeSources.hasOwnProperty(type)) {
                    var source = nonPrototypeSources[type];
                    var wrapper = new Inheritance(source);
                    var Func = wrapper.toFunction();

                    expect(Func instanceof Function).toBeTruthy();
                    expect(Func).toNotBe(Constr);
                    expect(Func).toNotBe(Object);
                    if (source) {
                        expect(source).toBe(Func.prototype);
                        expect(source).toBe(wrapper.toObject());
                    }
                }
        });

        it("should not do anything by instantiation if the old constructor was empty", function () {
            var source = Object.create(null);
            var wrapper = new Inheritance(source);
            expect(function () {
                var Constr = wrapper.toFunction();
                new Constr();
            }).not.toThrow();
        });

        it("should pass the arguments by instantiation", function () {
            var spy = jasmine.createSpy("mock constructor");
            var wrapper = new Inheritance(spy);
            var instance = new spy("a", "b");
            expect(spy).toHaveBeenCalledWith("a", "b");
        });

    });

    describe("Inheritance.mixin(source 1, source 2, ... source i) behavior with valid sources", function () {

        it("should mixin properties with the source or the prototype of the source", function () {
            var sources = {
                "object": {},
                "prototype": function () {
                }.prototype
            };
            for (var name in sources)
                if (sources.hasOwnProperty(name)) {
                    var source = sources[name];
                    var wrapper = new Inheritance(source);
                    wrapper.mixin({name: name}, {a: 0, b: 2}, {a: 1, c: 3}, {d: 4});
                    expect(source).toEqual({name: name, a: 1, b: 2, c: 3, d: 4});
                }
        });

        it("should mixin, but not call initialize by sources with non-generated constructor", function () {
            var Constr = function () {
            };
            var sources = {
                "function": Constr,
                "prototype": Constr.prototype
            };
            for (var type in sources)
                if (sources.hasOwnProperty(type))
                    expect(function () {
                        var wrapper = new Inheritance(sources[type])
                        wrapper.mixin(function () {
                            throw new Error("$");
                        });
                        var Func = wrapper.toFunction();
                        var instance = new Func();
                        expect(instance.initialize).toBeDefined();
                    }).not.toThrow();
        });

        it("should call ancestor constructors if an aggregator initialize is set", function () {
            var Ancestor1 = function () {
                this.a = 1;
            };
            Ancestor1.prototype.x = 1;
            var Ancestor2 = function () {
                this.b = 2;
            };
            Ancestor2.prototype.y = 2;
            var descendantWrapper = new Inheritance();
            var aggregatedInit = function () {
                Ancestor1.call(this);
                Ancestor2.call(this);
            };
            descendantWrapper.mixin(Ancestor1, Ancestor2, {
                initialize: aggregatedInit
            });
            var Descendant = descendantWrapper.toFunction();
            var instance = new Descendant();
            expect(instance).toEqual({initialize: aggregatedInit, x: 1, y: 2, a: 1, b: 2});
        });

    });

    describe("Inheritance.extend(source 1, source 2, ... source i) behavior with valid sources", function () {

        it("should call the original constructor and store it under the name initialize", function () {
            var Ancestor = function () {
                throw new Error("$");
            };
            var ancestorWrapper = new Inheritance(Ancestor);
            var descendantWrapper = ancestorWrapper.extend();
            var Descendant = descendantWrapper.toFunction();
            expect(Descendant.prototype).toEqual({initialize: Ancestor});
            expect(function () {
                new Descendant();
            }).toThrow("$");
        });

        it("should not store the original constructor if it was generated, but call its initialize", function () {
            var ancestorProto = {
                initialize: function () {
                    throw new Error("$");
                }
            };
            var ancestorWrapper = new Inheritance(ancestorProto);
            var descendantWrapper = ancestorWrapper.extend();
            var Descendant = descendantWrapper.toFunction();
            expect(Descendant.prototype).toEqual({initialize: ancestorProto.initialize});
            expect(function () {
                new Descendant();
            }).toThrow("$");
        });

        it("should inherit the changes of ancestors to the descendants", function () {
            var Ancestor = function () {
            };
            Ancestor.prototype = {
                a: 1
            };
            var ancestorWrapper = new Inheritance(Ancestor);
            var descendantWrapper = ancestorWrapper.extend({b: 2});
            var Descendant = descendantWrapper.toFunction();
            var ancestor = new Ancestor();
            var descendant = new Descendant();
            expect(ancestor).toEqual({a: 1});
            expect(descendant).toEqual({initialize: Ancestor, a: 1, b: 2});
            Ancestor.prototype.x = 1;
            ancestorWrapper.mixin({y: 2});
            expect(ancestor).toEqual({a: 1, x: 1, y: 2});
            expect(descendant).toEqual({initialize: Ancestor, a: 1, b: 2, x: 1, y: 2});
        });

        it("should set the constructor property automatically", function () {
            var ancestorWrapper1 = new Inheritance({});
            var Ancestor1 = ancestorWrapper1.toFunction();
            var ancestor1 = new Ancestor1();
            expect(ancestor1.constructor).toBe(Ancestor1);

            var Ancestor2 = function () {
            };
            var ancestorWrapper2 = new Inheritance(Ancestor2);
            var ancestor2 = new Ancestor2();
            expect(ancestor2.constructor).toBe(Ancestor2);

            var descendantWrapper = ancestorWrapper2.extend(ancestorWrapper1);
            var Descendant = descendantWrapper.toFunction();
            var descendant = new Descendant();
            expect(descendant.constructor).toBe(Descendant);
        });

        it("should call initialize of the ancestor if its generated constructor is called in a context of a descendant instance", function () {
            var ancestorWrapper = new Inheritance({
                initialize: function () {
                    this.a = 1;
                }
            });
            var Ancestor = ancestorWrapper.toFunction();
            var descendantWrapper = ancestorWrapper.extend({
                initialize: function () {
                    Ancestor.call(this);
                    this.b = 2;
                }
            });
            var Descendant = descendantWrapper.toFunction();
            var descendant = new Descendant();
            expect(descendant).toEqual({initialize: Descendant.prototype.initialize, a: 1, b: 2});
        });

    });

    describe("Inheritance.hasAncestors(source 1, source 2, ...)", function () {
        it("should know whether it inherits from an ancestor or not", function () {
            var wA = new Inheritance();
            expect(wA.hasAncestors(wA)).toBeFalsy();
            var wB = wA.extend();
            expect(wB.hasAncestors(wA)).toBeTruthy();
            expect(wA.hasAncestors(wB)).toBeFalsy();
            var wC = wB.extend();
            expect(wC.hasAncestors(wA)).toBeTruthy();
            expect(wC.hasAncestors(wB)).toBeTruthy();
            expect(wA.hasAncestors(wC)).toBeFalsy();
            expect(wB.hasAncestors(wC)).toBeFalsy();

            var wI = new Inheritance();
            var wJ = Inheritance().extend(wI);
            expect(wJ.hasAncestors(wI)).toBeTruthy();
            expect(wI.hasAncestors(wJ)).toBeFalsy();
            var wK = Inheritance().extend(wJ);
            expect(wK.hasAncestors(wI)).toBeTruthy();
            expect(wK.hasAncestors(wJ)).toBeTruthy();
            expect(wI.hasAncestors(wK)).toBeFalsy();
            expect(wJ.hasAncestors(wK)).toBeFalsy();

            var wP = wA.extend(wI);
            var wQ = wB.extend(wJ);
            var wR = wC.extend(wK);
            expect(wP.hasAncestors(wA)).toBeTruthy();
            expect(wP.hasAncestors(wA, wB)).toBeFalsy();
            expect(wP.hasAncestors(wA, wI)).toBeTruthy();
            expect(wQ.hasAncestors(wA, wB, wI, wJ)).toBeTruthy();
            expect(wR.hasAncestors(wA, wB, wC, wI, wJ, wK)).toBeTruthy();
        });
    });

    describe("Inheritance.hasDescendants(source 1, source 2, ...)", function () {
        it("should know whether it inherits to a descendant or not", function () {
            var wA = new Inheritance();
            var wB = wA.extend();
            var wC = wB.extend();
            expect(wB.hasDescendants(wA)).toBeFalsy();
            expect(wB.hasDescendants(wB)).toBeFalsy();
            expect(wB.hasDescendants(wC)).toBeTruthy();

            var wI = new Inheritance();
            var wJ = Inheritance().extend(wI);
            var wK = Inheritance().extend(wJ);
            expect(wJ.hasDescendants(wI)).toBeFalsy();
            expect(wJ.hasDescendants(wJ)).toBeFalsy();
            expect(wJ.hasDescendants(wK)).toBeTruthy();

            var wP = wA.extend(wI);
            var wQ = wB.extend(wJ);
            var wR = wC.extend(wK);
            expect(wB.hasDescendants(wP)).toBeFalsy();
            expect(wB.hasDescendants(wQ)).toBeTruthy();
            expect(wB.hasDescendants(wR)).toBeTruthy();

            expect(wB.hasDescendants(wR, wQ)).toBeTruthy();
            expect(wB.hasDescendants(wR, wP)).toBeFalsy();

            expect(wA.hasDescendants(wB, wC, wP, wQ, wR)).toBeTruthy();
            expect(wI.hasDescendants(wJ, wK, wP, wQ, wR)).toBeTruthy();
        });
    });

    describe("Inheritance.hasInstance(instance)", function () {
        it("should know whether it or its descendant has an instance", function () {
            var wA = new Inheritance();
            var wB = wA.extend();
            var wC = wB.extend();

            var wI = new Inheritance();
            var wJ = Inheritance().extend(wI);
            var wK = Inheritance().extend(wJ);

            var wP = wA.extend(wI);
            var wQ = wB.extend(wJ);
            var wR = wC.extend(wK);

            var C = wC.toFunction();
            var c = new C();
            expect(Inheritance().hasInstance(c)).toBeFalsy();
            expect(wA.hasInstance(c)).toBeTruthy();

            var K = wK.toFunction();
            var k = new K();
            expect(wI.hasInstance(k)).toBeTruthy();

            var R = wR.toFunction();
            var r = new R();
            expect(wA.hasInstance(r)).toBeTruthy();
            expect(wI.hasInstance(r)).toBeTruthy();
            expect(wP.hasInstance(r)).toBeFalsy();
            expect(wQ.hasInstance(r)).toBeFalsy();
            expect(wR.hasInstance(r)).toBeTruthy();
        });
    });

});