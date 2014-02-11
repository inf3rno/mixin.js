define(["module"], function (module) {


    var version = "1.1.0";
    var Mixable = {
        constructor: function (source) {
            if (!(this instanceof Mixin))
                return new Mixin(source);
            if (source instanceof Mixin)
                return source;

            var type = typeof(source);
            var isValidSource = {
                "object": true,
                "undefined": true,
                "function": true
            }.hasOwnProperty(type);
            if (!isValidSource)
                throw new Error("Invalid source type of " + type + ".");

            var isFunction = type == "function";
            var isPrototype = type == "object" && source && source.constructor && source === source.constructor.prototype;

            var target;
            if (isFunction)
                target = source;
            if (isPrototype)
                target = source.constructor;

            if (target && target.__mixin)
                return target.__mixin;

            if (!target) {
                if (!source)
                    source = {};
                target = function () {
                    if (target.prototype.initialize instanceof Function)
                        target.prototype.initialize.apply(this, arguments);
                };
                target.prototype = source;
                this.hasGeneratedConstructor = true;
            }
            target.prototype.constructor = target;
            target.__mixin = this;
            this.target = target;
            this.ancestors = [];
        },
        mixin: function () {
            for (var index = 0, length = arguments.length; index < length; ++index) {
                var ancestor = new Mixin(arguments[index]);
                var ancestorPrototype = ancestor.toObject();
                for (var property in ancestorPrototype)
                    if (ancestorPrototype[property] !== Object.prototype[property] && property !== "constructor")
                        this.target.prototype[property] = ancestorPrototype[property];
                if (!ancestor.hasGeneratedConstructor)
                    this.target.prototype.initialize = ancestor.toFunction();
                this.ancestors.push(ancestor);
            }
            return this;
        },
        extend: function () {
            var descendantPrototype = Object.create(this.target.prototype);
            if (!this.hasGeneratedConstructor)
                descendantPrototype.initialize = this.target;
            var descendant = new Mixin(descendantPrototype);
            descendant.ancestors.push(this);
            descendant.mixin.apply(descendant, arguments);
            return descendant;
        },
        hasAncestors: function () {
            for (var index = 0, length = arguments.length; index < length; ++index) {
                var found = false;
                var possibleAncestor = new Mixin(arguments[index]);
                for (var ancestorIndex = 0, ancestorCount = this.ancestors.length; ancestorIndex < ancestorCount; ++ancestorIndex) {
                    var ancestor = this.ancestors[ancestorIndex];
                    if (ancestor === possibleAncestor || ancestor.hasAncestors(possibleAncestor)) {
                        found = true;
                        break;
                    }
                }
                if (!found)
                    return false;
            }
            return true;
        },
        hasDescendants: function () {
            for (var index = 0, length = arguments.length; index < length; ++index) {
                var possibleDescendant = new Mixin(arguments[index]);
                if (!possibleDescendant.hasAncestors(this))
                    return false;
            }
            return true;
        },
        hasInstance: function (instance) {
            if (instance instanceof this.target)
                return true;
            if (!instance.constructor || !instance.constructor.__mixin)
                return false;
            return this.hasDescendants(instance.constructor.__mixin);
        },
        toFunction: function () {
            return this.target;
        },
        toObject: function () {
            return this.target.prototype;
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
                    var mixin = new Mixin(this);
                    mixin.mixin.apply(mixin, arguments);
                    return this;
                },
                extend: function () {
                    var mixin = new Mixin(this);
                    var child = mixin.extend.apply(mixin, arguments);
                    return child.toObject();
                },
                hasAncestors: function () {
                    var mixin = new Mixin(this);
                    return mixin.hasAncestors.apply(mixin, arguments);
                },
                hasDescendants: function () {
                    var mixin = new Mixin(this);
                    return mixin.hasDescendants.apply(mixin, arguments);
                },
                instanceOf: function () {
                    for (var index = 0, length = arguments.length; index < length; ++index) {
                        var mixin = new Mixin(arguments[index]);
                        if (!mixin.hasInstance(this))
                            return false;
                    }
                    return true;
                },
                toFunction: function () {
                    var mixin = new Mixin(this);
                    return mixin.toFunction();
                }
            }
        },
        {
            enabled: false,
            extend: Function,
            source: {
                mixin: function () {
                    var mixin = new Mixin(this);
                    mixin.mixin.apply(mixin, arguments);
                    return this;
                },
                extend: function () {
                    var mixin = new Mixin(this);
                    var child = mixin.extend.apply(mixin, arguments);
                    return child.toFunction();
                },
                hasAncestors: function () {
                    var mixin = new Mixin(this);
                    return mixin.hasAncestors.apply(mixin, arguments);
                },
                hasDescendants: function () {
                    var mixin = new Mixin(this);
                    return mixin.hasDescendants.apply(mixin, arguments);
                },
                hasInstance: function (instance) {
                    var mixin = new Mixin(this);
                    return mixin.hasInstance(instance);
                },
                toObject: function () {
                    return this.prototype;
                }
            }
        }
    ];
    Mixin.extensions.enable = function () {
        for (var index = 0, length = arguments.length; index < length; ++index) {
            var target = arguments[index];
            var hasFound = false;
            for (var extensionIndex = 0, extensionCount = this.length; extensionIndex < extensionCount; ++extensionIndex) {
                var extension = this[extensionIndex];
                if (extension.extend !== target)
                    continue;
                if (!extension.enabled) {
                    var mixin = new Mixin(target);
                    mixin.mixin(extension.source);
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
            var target = arguments[index];
            var hasFound = false;
            for (var extensionIndex = 0, extensionCount = this.length; extensionIndex < extensionCount; ++extensionIndex) {
                var extension = this[extensionIndex];
                if (extension.extend !== target)
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