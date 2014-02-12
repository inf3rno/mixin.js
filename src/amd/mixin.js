define(function () {

    var version = "1.1.1";

    var storeKey = "__mixin";
    var MixinCache = {
        set: function (target, mixin) {
            if (Object.defineProperty)
                Object.defineProperty(target, storeKey, {
                    value: mixin,
                    configurable: false,
                    enumerable: false,
                    writeable: false
                });
            else
                target[storeKey] = mixin
        },
        get: function (target) {
            return target[storeKey];
        },
        has: function (target) {
            return target && (target instanceof Function) && !!target[storeKey];
        }
    };

    var mixinPrototype = {
        constructor: function (source) {
            if (source instanceof Mixin)
                return source;
            if (!(this instanceof Mixin))
                return new Mixin(source);

            var isEmpty,
                isPrimitive = true,
                isPrototype = false;
            isEmpty = source === undefined || source === null;
            if (!isEmpty)
                isPrimitive = typeof(source) != "object" && typeof(source) != "function";
            if (!isPrimitive)
                isPrototype = !(source instanceof Function) && source.constructor && source === source.constructor.prototype;

            if (isEmpty)
                source = {};
            else if (isPrimitive)
                throw new Error("Invalid source type.");
            else if (isPrototype)
                source = source.constructor;

            if (MixinCache.has(source))
                return MixinCache.get(source);

            this.initialize(source);
            return this;
        },
        initialize: function (source) {
            this.ancestors = [];
            this.isNative = source instanceof Function;
            if (this.isNative)
                this.target = source;
            else {
                this.target = function () {
                    if (source.initialize instanceof Function)
                        source.initialize.apply(this, arguments);
                };
                this.target.prototype = source;
            }
            this.target.prototype.constructor = this.target;
            MixinCache.set(this.target, this);
        },
        mixin: function () {
            for (var index = 0, length = arguments.length; index < length; ++index) {
                var ancestor = new Mixin(arguments[index]);
                var ancestorPrototype = ancestor.toObject();
                for (var property in ancestorPrototype)
                    if (ancestorPrototype[property] !== Object.prototype[property] && property !== "constructor")
                        this.target.prototype[property] = ancestorPrototype[property];
                if (ancestor.isNative)
                    this.target.prototype.initialize = ancestor.toFunction();
                this.ancestors.push(ancestor);
            }
            return this;
        },
        extend: function () {
            var descendantPrototype = Object.create(this.target.prototype);
            if (this.isNative)
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
            if (MixinCache.has(instance.constructor))
                return this.hasDescendants(MixinCache.get(instance.constructor));
            return false;
        },
        toFunction: function () {
            return this.target;
        },
        toObject: function () {
            return this.target.prototype;
        }
    };

    var extensionPrototype = {
        target: null,
        source: null,
        backup: null,
        isEnabled: false,
        initialize: function (options) {
            this.config(options);
        },
        enable: function () {
            if (this.isEnabled)
                return;
            if (!this.target || !this.source)
                throw new Error("Extension target and source must be set.");
            this.backup = {};
            for (var property in this.source)
                if (this.source.hasOwnProperty(property) && this.target.hasOwnProperty(property) && property !== "constructor")
                    this.backup[property] = this.target[property];
            Mixin(this.target).mixin(this.source);
            this.isEnabled = true;
        },
        disable: function () {
            if (!this.isEnabled)
                return;
            for (var property in this.source) {
                if (!this.source.hasOwnProperty(property))
                    continue;
                if (this.target[property] !== this.source[property])
                    continue;
                if (this.backup.hasOwnProperty(property))
                    this.target[property] = this.backup[property];
                else
                    delete(this.target[property]);
            }
            delete(this.backup);
            this.isEnabled = false;
        },
        config: function (options) {
            if (!options)
                return;
            if (options.target)
                this.target = Mixin(options.target).toObject();
            if (options.source)
                this.source = Mixin(options.source).toObject();
            if (options.isEnabled)
                this.enable();
        }
    };

    var Mixin = mixinPrototype.constructor;
    Mixin.prototype = mixinPrototype;
    Mixin.version = version;
    Mixin.Extension = Mixin(extensionPrototype).toFunction();

    return Mixin;
});