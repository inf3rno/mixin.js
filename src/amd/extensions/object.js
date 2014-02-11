define(["module", "mixin"], function (module, Mixin) {

    var ObjectExtension = new Mixin.Extension({
        target: Object,
        source: {
            mixin: function () {
                var descendant = new Mixin(this);
                descendant.mixin.apply(descendant, arguments);
                return this;
            },
            extend: function () {
                var ancestor = new Mixin(this);
                var descendant = ancestor.extend.apply(ancestor, arguments);
                return descendant.toObject();
            },
            hasAncestors: function () {
                var descendant = new Mixin(this);
                return descendant.hasAncestors.apply(descendant, arguments);
            },
            hasDescendants: function () {
                var ancestor = new Mixin(this);
                return ancestor.hasDescendants.apply(ancestor, arguments);
            },
            instanceOf: function () {
                for (var index = 0, length = arguments.length; index < length; ++index) {
                    var ancestor = new Mixin(arguments[index]);
                    if (!ancestor.hasInstance(this))
                        return false;
                }
                return true;
            },
            toFunction: function () {
                var mixin = new Mixin(this);
                return mixin.toFunction();
            }
        }
    });

    ObjectExtension.config(module.config());
    return ObjectExtension;
});