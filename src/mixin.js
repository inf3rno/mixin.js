define(["module"], function (module) {
    var version = "1.0.0";
    var Mixable = {
        constructor: function (source) {
            if (!(this instanceof Mixin))
                return new Mixin(source);
            var type = typeof(source);
            var isValidType = {
                "object": true,
                "undefined": true,
                "function": true
            }.hasOwnProperty(type);
            var isFunction = type == "function";
            var isPrototype = type == "object" && source && source.constructor && source === source.constructor.prototype;

            if (!isValidType)
                throw new Error("Invalid source type of " + type + ".");

            if (isFunction)
                this.F = source;
            else if (isPrototype)
                this.F = source.constructor;
            else {
                if (!source)
                    source = {};
                var recursiveConstructor = function (constructors, args) {
                    if (constructors instanceof Array)
                        for (var index = 0, length = constructors.length; index < length; ++index)
                            recursiveConstructor.call(this, constructors[index], args);
                    else
                        constructors.apply(this, args);
                };
                this.F = function () {
                    recursiveConstructor.call(this, this.constructor, arguments);
                };
                this.F.isGenerated = true;
                this.F.prototype = source;
                if (!(source.constructor instanceof Array)) {
                    var constructors = [];
                    if ((source.constructor instanceof Function) && !source.constructor.isGenerated && source.constructor != Object)
                        constructors.push(source.constructor);
                    source.constructor = constructors;
                }
            }
        },
        mixin: function () {
            for (var index = 0, length = arguments.length; index < length; ++index) {
                var source = arguments[index];
                var M;
                if (source instanceof Mixin)
                    M = source;
                else
                    M = new Mixin(source);
                var o = M.toObject();
                for (var property in o)
                    if (o[property] !== Object.prototype[property] && property != "constructor")
                        this.F.prototype[property] = o[property];
                var F = M.toFunction();
                var constructors;
                if (F.isGenerated)
                    constructors = o.constructor;
                else
                    constructors = [F];
                if (constructors.length) {
                    if (!this.F.isGenerated)
                        throw new Error("Cannot mixin constructors by native or non-generated functions.");
                    var recursiveFlatten = function (constructors) {
                        for (var index = 0, length = arguments.length; index < length; ++index)
                            if (arguments[index] instanceof Array)
                                recursiveFlatten.apply(this, arguments[index]);
                            else
                                this.push(arguments[index]);
                        return this;
                    };
                    this.F.prototype.constructor.push.apply(this.F.prototype.constructor, recursiveFlatten.apply([], constructors));
                }
            }
            return this;
        },
        extend: function () {
            var source = Object.create(this.F.prototype);
            source.constructor = [];
            if (this.F.isGenerated)
                source.constructor.push(this.F.prototype.constructor);
            else
                source.constructor.push(this.F);
            var child = new Mixin(source);
            child.mixin.apply(child, arguments);
            return child;
        },
        toFunction: function () {
            return this.F;
        },
        toObject: function () {
            return this.F.prototype;
        }
    };

    var Mixin = Mixable.constructor;
    Mixin.prototype = Mixable;
    Mixin.extensions = [
        {
            enabled: false,
            extend: Object,
            source: {
                mixin: function () {
                    var m = new Mixin(this);
                    m.mixin.apply(m, arguments);
                    return this;
                },
                extend: function () {
                    var m = new Mixin(this);
                    var c = m.extend.apply(m, arguments);
                    return c.toObject();
                },
                toFunction: function () {
                    var m = new Mixin(this);
                    return m.toFunction();
                }
            }
        },
        {
            enabled: false,
            extend: Function,
            source: {
                mixin: function () {
                    var m = new Mixin(this);
                    m.mixin.apply(m, arguments);
                    return this;
                },
                extend: function () {
                    var m = new Mixin(this);
                    var c = m.extend.apply(m, arguments);
                    return c.toFunction();
                },
                toObject: function () {
                    return this.prototype;
                }
            }
        }
    ];
    Mixin.extensions.enable = function () {
        for (var index = 0, length = arguments.length; index < length; ++index) {
            var Constructor = arguments[index];
            var hasFound = false;
            for (var j = 0, l = this.length; j < l; ++j) {
                var extension = this[j];
                if (extension.extend !== Constructor)
                    continue;
                if (!extension.enabled) {
                    var M = new Mixin(Constructor);
                    M.mixin(extension.source);
                    extension.enabled = true;
                }
                hasFound = true;
                break;
            }
            if (!hasFound)
                throw new Error("Extension is not defined!");
        }
    };
    Mixin.extensions.require = function () {
        for (var index = 0, length = arguments.length; index < length; ++index) {
            var Constructor = arguments[index];
            var hasFound = false;
            for (var j = 0, l = this.length; j < l; ++j) {
                var extension = this[j];
                if (extension.extend !== Constructor)
                    continue;
                if (!extension.enabled)
                    throw new Error("Required extensions are not all enabled!");
                hasFound = true;
                break;
            }
            if (!hasFound)
                throw new Error("Extension is not defined!");
        }
    };
    Mixin.config = function (options) {
        if (!options || !options.extensions)
            return;
        if (!(options.extensions instanceof Array))
            options.extensions = [options.extensions];
        this.extensions.enable.apply(this.extensions, options.extensions);
    };
    Mixin.version = version;
    Mixin.config(module.config());
    return Mixin;
});