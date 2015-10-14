var o3 = require("o3"),
    FunctionWrapper = o3.FunctionWrapper,
    InvalidArguments = o3.InvalidArguments,
    dummy = o3.dummy,
    uniqueDummy = function () {
        return function () {
        };
    };

describe("FunctionWrapper", function () {

    describe("prototype", function () {

        describe("build", function () {

            it("clones the preprocessors Array", function () {

                var wrapper = new FunctionWrapper({
                    preprocessors: [dummy]
                });
                var wrapper2 = Object.create(wrapper);
                expect(wrapper2.preprocessors).toBe(wrapper.preprocessors);
                wrapper2.build();
                expect(wrapper2.preprocessors).not.toBe(wrapper.preprocessors);
                expect(wrapper2.preprocessors).toEqual(wrapper.preprocessors);
            });

            it("clones the properties Object", function () {

                var wrapper = new FunctionWrapper({
                    properties: {
                        a: {}
                    }
                });
                var wrapper2 = Object.create(wrapper);
                expect(wrapper2.properties).toBe(wrapper.properties);
                wrapper2.build();
                expect(wrapper2.properties).not.toBe(wrapper.properties);
                expect(wrapper2.properties.a).toBe(wrapper.properties.a);
            });

        });

        describe("merge", function () {

            it("accepts only object, null or undefined as sources", function () {

                expect(function () {
                    new FunctionWrapper().merge({});
                }).not.toThrow();

                expect(function () {
                    new FunctionWrapper().merge();
                }).not.toThrow();

                expect(function () {
                    new FunctionWrapper().merge(null);
                }).toThrow(new InvalidArguments.Nested({path: [0]}));

                expect(function () {
                    new FunctionWrapper().merge({}, {});
                }).not.toThrow();

                expect(function () {
                    new FunctionWrapper().merge("a");
                }).toThrow(new InvalidArguments.Nested({path: [0]}));
            });


            it("accepts only an Array of Functions as preprocessors", function () {

                expect(function () {
                    new FunctionWrapper().merge({
                        preprocessors: []
                    });
                    new FunctionWrapper().merge({
                        preprocessors: [dummy, dummy]
                    });
                }).not.toThrow();

                expect(function () {
                    new FunctionWrapper().merge({
                        preprocessors: {}
                    })
                }).toThrow(new FunctionWrapper.ArrayRequired());

                expect(function () {
                    new FunctionWrapper().merge({
                        preprocessors: [dummy, {}]
                    })
                }).toThrow(new FunctionWrapper.PreprocessorRequired());

            });

            it("accepts only a Function as done", function () {

                expect(function () {
                    new FunctionWrapper().merge({
                        done: dummy
                    })
                }).not.toThrow();

                expect(function () {
                    new FunctionWrapper().merge({
                        done: {}
                    })
                }).toThrow(new FunctionWrapper.FunctionRequired());

            });

            it("accepts only a Function as algorithm", function () {

                expect(function () {
                    new FunctionWrapper().merge({
                        algorithm: dummy
                    })
                }).not.toThrow();

                expect(function () {
                    new FunctionWrapper().merge({
                        algorithm: {}
                    })
                }).toThrow(new FunctionWrapper.AlgorithmRequired());

            });

            it("accepts only Object instance as properties", function () {

                expect(function () {
                    new FunctionWrapper().merge({
                        properties: {}
                    });
                }).not.toThrow();

                [
                    "string",
                    1,
                    false,
                    undefined,
                    null
                ].forEach(function (invalidProperties) {
                        expect(function () {
                            new FunctionWrapper().merge({
                                properties: invalidProperties
                            })
                        }).toThrow(new InvalidArguments.Nested({path: [0, "properties"]}));
                    });
            });

            it("returns the context itself", function () {

                var o = {};
                expect(FunctionWrapper.prototype.merge.call(o)).toBe(o);
            });

            it("merges pushes preprocessors if given", function () {

                var x = uniqueDummy(),
                    y = uniqueDummy(),
                    z = uniqueDummy(),
                    q = uniqueDummy(),
                    r = uniqueDummy(),
                    a = [
                        x
                    ],
                    b = [y, z],
                    c = [q, r],
                    o = {
                        preprocessors: a
                    };
                FunctionWrapper.prototype.merge.call(o, {
                    preprocessors: b
                }, {
                    preprocessors: c
                });
                expect(o.preprocessors).toBe(a);
                expect(o.preprocessors).toEqual([x, y, z, q, r]);
            });

            it("overrides done if given", function () {

                var a = uniqueDummy();
                var b = uniqueDummy();
                expect(a).not.toBe(b);
                var o = {
                    done: a
                };
                FunctionWrapper.prototype.merge.call(o, {
                    done: b
                });
                expect(o.done).toBe(b);
            });

            it("overrides algorithm if given", function () {

                var a = uniqueDummy();
                var b = uniqueDummy();
                var o = {
                    algorithm: a
                };
                FunctionWrapper.prototype.merge.call(o, {
                    algorithm: b
                });
                expect(o.algorithm).toBe(b);
                expect(a).not.toBe(b);
            });

            it("merges properties if given", function () {
                var a = {a: 1, b: 2},
                    b = {b: 3, c: 4},
                    o = {
                        properties: {}
                    };
                FunctionWrapper.prototype.merge.call(o, {
                    properties: a
                }, {
                    properties: b
                });
                expect(o.properties).not.toBe(a);
                expect(o.properties).not.toBe(b);
                expect(o.properties).toEqual({a: 1, b: 3, c: 4});
            });

        });

        describe("toFunction", function () {

            it("extends the results returned by the algorithm with the properties given in options", function () {

                var log = jasmine.createSpy();
                var wrapper = new FunctionWrapper({
                    algorithm: function (wrapper) {
                        log(wrapper);
                        return log;
                    },
                    properties: {
                        a: 1,
                        b: 2
                    }
                });
                expect(log).not.toHaveBeenCalled();
                var fn = wrapper.toFunction();
                expect(log).toHaveBeenCalledWith(wrapper);
                expect(fn).toBe(log);
                expect(fn.a).toBe(1);
                expect(fn.b).toBe(2);
                expect(fn.wrapper).toBe(wrapper);
            });

        });

    });

    describe("algorithm", function () {

        describe("cascade", function () {

            it("applies the preprocessors on the context while using always the return value of the previous preprocessor as arguments", function () {

                var context = {};
                var pp1 = jasmine.createSpy().and.callFake(function (a, b, c) {
                    expect(this).toBe(context);
                    return [c, b, a];
                });
                var pp2 = jasmine.createSpy().and.callFake(function (c, b, a) {
                    expect(this).toBe(context);
                    return [c, a, b];
                });

                var wrapper = new FunctionWrapper({
                    preprocessors: [pp1, pp2],
                    algorithm: FunctionWrapper.algorithm.cascade
                });
                var fn = wrapper.toFunction();

                expect(pp1).not.toHaveBeenCalled();
                expect(pp2).not.toHaveBeenCalled();
                fn.call(context, 1, 2, 3);
                expect(pp1).toHaveBeenCalledWith(1, 2, 3);
                expect(pp2).toHaveBeenCalledWith(3, 2, 1);
            });

            it("applies done on the context with the arguments when no preprocessor defined", function () {

                var context = {};
                var done = jasmine.createSpy().and.callFake(function (a, b, c) {
                    expect(this).toBe(context);
                    return [c, b, a];
                });

                var wrapper = new FunctionWrapper({
                    done: done,
                    algorithm: FunctionWrapper.algorithm.cascade
                });
                var fn = wrapper.toFunction();

                expect(done).not.toHaveBeenCalled();
                expect(fn.call(context, 1, 2, 3)).toEqual([3, 2, 1]);
                expect(done).toHaveBeenCalledWith(1, 2, 3);
            });

            it("applies done on the context with the return value of the last preprocessor as arguments", function () {

                var pp1 = jasmine.createSpy().and.callFake(function (a, b, c) {
                    return [c, b, a];
                });
                var pp2 = jasmine.createSpy().and.callFake(function (c, b, a) {
                    return [c, a, b];
                });
                var done = jasmine.createSpy();
                var wrapper = new FunctionWrapper({
                    preprocessors: [pp1, pp2],
                    done: done,
                    algorithm: FunctionWrapper.algorithm.cascade
                });
                var fn = wrapper.toFunction();

                expect(pp1).not.toHaveBeenCalled();
                expect(pp2).not.toHaveBeenCalled();
                expect(done).not.toHaveBeenCalled();
                fn(1, 2, 3);
                expect(pp1).toHaveBeenCalledWith(1, 2, 3);
                expect(pp2).toHaveBeenCalledWith(3, 2, 1);
                expect(done).toHaveBeenCalledWith(3, 1, 2);
            });

            it("accepts only Array as preprocessor result", function () {

                var wrapper = new FunctionWrapper({
                    preprocessors: [
                        function () {
                            return "a";
                        }
                    ],
                    algorithm: FunctionWrapper.algorithm.cascade
                });
                var fn = wrapper.toFunction();
                expect(fn).toThrow(new FunctionWrapper.InvalidPreprocessor());
            });

        });

        describe("firstMatch", function () {

            it("applies done on the context with the arguments when no preprocessor defined", function () {

                var context = {};
                var done = jasmine.createSpy().and.callFake(function (a, b, c) {
                    expect(this).toBe(context);
                    return [c, b, a];
                });

                var wrapper = new FunctionWrapper({
                    done: done,
                    algorithm: FunctionWrapper.algorithm.firstMatch
                });
                var fn = wrapper.toFunction();

                expect(done).not.toHaveBeenCalled();
                expect(fn.call(context, 1, 2, 3)).toEqual([3, 2, 1]);
                expect(done).toHaveBeenCalledWith(1, 2, 3);
            });

            it("applies done on the context with the return value of the first matching preprocessor", function () {

                var pp1 = jasmine.createSpy();
                var pp2 = jasmine.createSpy().and.callFake(function (a, b, c) {
                    return [c, b, a];
                });
                var pp3 = jasmine.createSpy();
                var done = jasmine.createSpy();
                var wrapper = new FunctionWrapper({
                    preprocessors: [pp1, pp2, pp3],
                    done: done,
                    algorithm: FunctionWrapper.algorithm.firstMatch
                });
                var fn = wrapper.toFunction();

                expect(pp1).not.toHaveBeenCalled();
                expect(pp2).not.toHaveBeenCalled();
                expect(pp3).not.toHaveBeenCalled();
                expect(done).not.toHaveBeenCalled();
                fn(1, 2, 3);
                expect(pp1).toHaveBeenCalledWith(1, 2, 3);
                expect(pp2).toHaveBeenCalledWith(1, 2, 3);
                expect(pp3).not.toHaveBeenCalled();
                expect(done).toHaveBeenCalledWith(3, 2, 1);
            });

            it("accepts only Array or undefined as preprocessor result", function () {

                var wrapper = new FunctionWrapper({
                    preprocessors: [
                        function () {
                            return "a";
                        }
                    ],
                    algorithm: FunctionWrapper.algorithm.firstMatch
                });
                var fn = wrapper.toFunction();
                expect(fn).toThrow(new FunctionWrapper.InvalidPreprocessor());
            });

        });

        describe("firstMatchCascade", function () {

            it("applies done on the context with the arguments when no preprocessor defined", function () {

                var context = {};
                var done = jasmine.createSpy().and.callFake(function (a, b, c) {
                    expect(this).toBe(context);
                    return [c, b, a];
                });

                var wrapper = new FunctionWrapper({
                    done: done,
                    algorithm: FunctionWrapper.algorithm.firstMatch
                });
                var fn = wrapper.toFunction();

                expect(done).not.toHaveBeenCalled();
                expect(fn.call(context, 1, 2, 3)).toEqual([3, 2, 1]);
                expect(done).toHaveBeenCalledWith(1, 2, 3);
            });

            it("applies done on the context with the return value of the first matching preprocessor called in cascade until no match", function () {

                var pp1 = jasmine.createSpy().and.callFake(function (a) {
                    if (a == 1)
                        return [2];
                });
                var pp2 = jasmine.createSpy().and.callFake(function (a) {
                    if (a == 3)
                        return [4];
                });
                var pp3 = jasmine.createSpy().and.callFake(function (a) {
                    if (a == 2)
                        return [3];
                });
                var done = jasmine.createSpy();
                var wrapper = new FunctionWrapper({
                    preprocessors: [pp1, pp2, pp3],
                    done: done,
                    algorithm: FunctionWrapper.algorithm.firstMatchCascade
                });
                var fn = wrapper.toFunction();

                expect(pp1).not.toHaveBeenCalled();
                expect(pp2).not.toHaveBeenCalled();
                expect(pp3).not.toHaveBeenCalled();
                expect(done).not.toHaveBeenCalled();
                fn(1);
                expect(pp1.calls.count()).toBe(4);
                expect(pp1).toHaveBeenCalledWith(1);
                expect(pp1).toHaveBeenCalledWith(2);
                expect(pp1).toHaveBeenCalledWith(3);
                expect(pp1).toHaveBeenCalledWith(4);
                expect(pp2.calls.count()).toBe(3);
                expect(pp2).toHaveBeenCalledWith(2);
                expect(pp2).toHaveBeenCalledWith(3);
                expect(pp2).toHaveBeenCalledWith(4);
                expect(pp3.calls.count()).toBe(2);
                expect(pp3).toHaveBeenCalledWith(2);
                expect(pp3).toHaveBeenCalledWith(4);
                expect(done.calls.count()).toBe(1);
                expect(done).toHaveBeenCalledWith(4);
            });

            it("accepts only Array or undefined as preprocessor result", function () {

                var wrapper = new FunctionWrapper({
                    preprocessors: [
                        function () {
                            return "a";
                        }
                    ],
                    algorithm: FunctionWrapper.algorithm.firstMatchCascade
                });
                var fn = wrapper.toFunction();
                expect(fn).toThrow(new FunctionWrapper.InvalidPreprocessor());
            });

        });

    });

});