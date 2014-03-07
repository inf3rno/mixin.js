define(["module", "inheritance", "inheritance-extension"], function (module, wrap, Extension) {

    var objectExtension = new Extension({
        target: Object,
        source: {
            mixin: function () {
                var descendant = wrap(this);
                descendant.mixin.apply(descendant, arguments);
                return this;
            },
            extend: function () {
                var ancestor = wrap(this);
                var descendant = ancestor.extend.apply(ancestor, arguments);
                return descendant.toObject();
            },
            hasAncestors: function () {
                var descendant = wrap(this);
                return descendant.hasAncestors.apply(descendant, arguments);
            },
            hasDescendants: function () {
                var ancestor = wrap(this);
                return ancestor.hasDescendants.apply(ancestor, arguments);
            },
            instanceOf: function () {
                for (var index = 0, length = arguments.length; index < length; ++index) {
                    var ancestor = wrap(arguments[index]);
                    if (!ancestor.hasInstance(this))
                        return false;
                }
                return true;
            },
            toFunction: function () {
                return wrap(this).toFunction();
            }
        }
    });

    objectExtension.config(module.config());
    return objectExtension;
});