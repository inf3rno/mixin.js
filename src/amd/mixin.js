define(function () {

    var version = "1.1.1";
    var mixinProperty = "__mixin";
    var Mapping = {
        set: function (target, mixin) {
            if (Object.defineProperty)
                Object.defineProperty(target, mixinProperty, {
                    value: mixin,
                    configurable: false,
                    enumerable: false,
                    writeable: false
                });
            else
                target[mixinProperty] = mixin
        },
        get: function (target) {
            if (target)
                return target[mixinProperty];
            return null;
        },
        has: function (target) {
            return target && !!target[mixinProperty];
        }
    };

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

            var isFunction = type == "function" && (source instanceof Function);
            var isPrototype = type == "object" && source && source.constructor && source === source.constructor.prototype;

            var target;
            if (isFunction)
                target = source;
            else if (isPrototype)
                target = source.constructor;

            if (Mapping.has(target))
                return Mapping.get(target);

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
            Mapping.set(target, this);
            this.target = target;
            this.ancestors = [];
            return this;
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
            if (!instance.constructor || !Mapping.has(instance.constructor))
                return false;
            return this.hasDescendants(Mapping.get(instance.constructor));
        },
        toFunction: function () {
            return this.target;
        },
        toObject: function () {
            return this.target.prototype;
        }
    };

    var Extension = {
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

    var Mixin = Mixable.constructor;
    Mixin.prototype = Mixable;
    Mixin.version = version;
    Mixin.Extension = Mixin(Extension).toFunction();

    return Mixin;
});