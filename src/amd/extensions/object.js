define(["module", "inheritance", "inheritance-extension"], function (module, Inheritance, Extension) {

    var extension = new Extension({
        target: Object,
        source: {
            mixin: function () {
                var descendant = new Inheritance(this);
                descendant.mixin.apply(descendant, arguments);
                return this;
            },
            extend: function () {
                var ancestor = new Inheritance(this);
                var descendant = ancestor.extend.apply(ancestor, arguments);
                return descendant.toObject();
            },
            hasAncestors: function () {
                var descendant = new Inheritance(this);
                return descendant.hasAncestors.apply(descendant, arguments);
            },
            hasDescendants: function () {
                var ancestor = new Inheritance(this);
                return ancestor.hasDescendants.apply(ancestor, arguments);
            },
            instanceOf: function () {
                for (var index = 0, length = arguments.length; index < length; ++index) {
                    var ancestor = new Inheritance(arguments[index]);
                    if (!ancestor.hasInstance(this))
                        return false;
                }
                return true;
            },
            toFunction: function () {
                var mixin = new Inheritance(this);
                return mixin.toFunction();
            }
        }
    });

    extension.config(module.config());
    return extension;
});