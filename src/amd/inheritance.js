define(function () {

    var WrapperFactory = function (options) {
        if (options)
            this.config(options);
    };
    WrapperFactory.prototype = {
        constructor: WrapperFactory,
        config: function (options) {
            this.cache = options.cache;
        },
        createWrapper: function (source) {
            var wrapper;
            if (source instanceof Wrapper)
                wrapper = source;
            else {
                var sanitizedSource = this.sanitizeSource(source);
                wrapper = this.cacheWrapper(sanitizedSource) || this.newWrapper(sanitizedSource);
            }
            return wrapper;
        },
        sanitizeSource: function (source) {
            var sanitizedSource;

            var isEmpty = true,
                isPrimitive = true,
                isPrototype = false;
            isEmpty = source === undefined || source === null;
            if (!isEmpty)
                isPrimitive = typeof(source) != "object" && typeof(source) != "function";
            if (!isPrimitive)
                isPrototype = !(source instanceof Function) && source.constructor && source === source.constructor.prototype;

            if (isEmpty)
                sanitizedSource = {};
            else if (isPrimitive)
                throw new Error("Invalid source type.");
            else if (isPrototype)
                sanitizedSource = source.constructor;
            else
                sanitizedSource = source;

            return sanitizedSource;
        },
        cacheWrapper: function (sanitizedSource) {
            if ((sanitizedSource instanceof Function) && this.cache && this.cache.has(sanitizedSource))
                return this.cache.get(sanitizedSource);
        },
        newWrapper: function (sanitizedSource) {
            var wrapper = new Wrapper(sanitizedSource);
            if (this.cache)
                this.cache.set(wrapper.target, wrapper);
            return wrapper;
        }
    };

    var Wrapper = function (source) {
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
    };
    Wrapper.prototype = {
        constructor: Wrapper,
        mixin: function () {
            for (var index = 0, length = arguments.length; index < length; ++index) {
                var ancestor = wrap(arguments[index]);
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
            if (this.isNative && !(descendantPrototype.initialize instanceof Function))
                descendantPrototype.initialize = this.target;
            var descendant = wrap(descendantPrototype);
            descendant.ancestors.push(this);
            descendant.mixin.apply(descendant, arguments);
            return descendant;
        },
        hasAncestors: function () {
            for (var index = 0, length = arguments.length; index < length; ++index) {
                var found = false;
                var possibleAncestor = wrap(arguments[index]);
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
                var possibleDescendant = wrap(arguments[index]);
                if (!possibleDescendant.hasAncestors(this))
                    return false;
            }
            return true;
        },
        hasInstance: function (instance) {
            if (instance instanceof this.target)
                return true;
            return this.hasDescendants(wrap(instance.constructor));
        },
        toFunction: function () {
            return this.target;
        },
        toObject: function () {
            return this.target.prototype;
        }
    };

    var wrap = function (source) {
        return wrap.factory.createWrapper.apply(wrap.factory, arguments);
    };
    wrap.factory = new WrapperFactory({
        cache: new WeakMap()
    });
    wrap.Wrapper = Wrapper;
    wrap.WrapperFactory = WrapperFactory;
    return wrap;
});