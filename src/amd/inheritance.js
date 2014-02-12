define(function () {

    var Inheritance = function (source) {
        if (source instanceof Inheritance)
            return source;
        if (!(this instanceof Inheritance))
            return new Inheritance(source);

        var isEmpty = true,
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

        if (Inheritance.Cache.has(source))
            return Inheritance.Cache.get(source);

        this.initialize(source);
        return this;
    };

    Inheritance.prototype = {
        constructor: Inheritance,
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
            Inheritance.Cache.set(this.target, this);
        },
        mixin: function () {
            for (var index = 0, length = arguments.length; index < length; ++index) {
                var ancestor = new Inheritance(arguments[index]);
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
            var descendant = new Inheritance(descendantPrototype);
            descendant.ancestors.push(this);
            descendant.mixin.apply(descendant, arguments);
            return descendant;
        },
        hasAncestors: function () {
            for (var index = 0, length = arguments.length; index < length; ++index) {
                var found = false;
                var possibleAncestor = new Inheritance(arguments[index]);
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
                var possibleDescendant = new Inheritance(arguments[index]);
                if (!possibleDescendant.hasAncestors(this))
                    return false;
            }
            return true;
        },
        hasInstance: function (instance) {
            if (instance instanceof this.target)
                return true;
            if (Inheritance.Cache.has(instance.constructor))
                return this.hasDescendants(Inheritance.Cache.get(instance.constructor));
            return false;
        },
        toFunction: function () {
            return this.target;
        },
        toObject: function () {
            return this.target.prototype;
        }
    };

    Inheritance.Cache = {
        storeKey: "__inheritance",
        set: function (target, inheritance) {
            if (Object.defineProperty)
                Object.defineProperty(target, this.storeKey, {
                    value: inheritance,
                    configurable: false,
                    enumerable: false,
                    writeable: false
                });
            else
                target[this.storeKey] = inheritance
        },
        get: function (target) {
            return target[this.storeKey];
        },
        has: function (target) {
            return (target instanceof Function) && target[this.storeKey];
        }
    };

    Inheritance.version = "1.1.1";
    return Inheritance;
});