define(["module", "mixin"], function (module, Mixin) {

    FunctionExtension = new Mixin.Extension({
        target: Function,
        source: {
            mixin: function () {
                var descendant = new Mixin(this);
                descendant.mixin.apply(descendant, arguments);
                return this;
            },
            extend: function () {
                var ancestor = new Mixin(this);
                var descendant = ancestor.extend.apply(ancestor, arguments);
                return descendant.toFunction();
            },
            hasAncestors: function () {
                var descendant = new Mixin(this);
                return descendant.hasAncestors.apply(descendant, arguments);
            },
            hasDescendants: function () {
                var ancestor = new Mixin(this);
                return ancestor.hasDescendants.apply(ancestor, arguments);
            },
            hasInstance: function (instance) {
                var ancestor = new Mixin(this);
                return ancestor.hasInstance(instance);
            },
            toObject: function () {
                return this.prototype;
            }
        }
    });

    FunctionExtension.config(module.config());
    return FunctionExtension;
});