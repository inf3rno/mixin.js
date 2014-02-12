define(["module", "inheritance", "inheritance-extension"], function (module, Inheritance, Extension) {

    var extension = new Extension({
        target: Function,
        source: {
            mixin: function () {
                var descendant = new Inheritance(this);
                descendant.mixin.apply(descendant, arguments);
                return this;
            },
            extend: function () {
                var ancestor = new Inheritance(this);
                var descendant = ancestor.extend.apply(ancestor, arguments);
                return descendant.toFunction();
            },
            hasAncestors: function () {
                var descendant = new Inheritance(this);
                return descendant.hasAncestors.apply(descendant, arguments);
            },
            hasDescendants: function () {
                var ancestor = new Inheritance(this);
                return ancestor.hasDescendants.apply(ancestor, arguments);
            },
            hasInstance: function (instance) {
                var ancestor = new Inheritance(this);
                return ancestor.hasInstance(instance);
            },
            toObject: function () {
                return this.prototype;
            }
        }
    });

    extension.config(module.config());
    return extension;
});