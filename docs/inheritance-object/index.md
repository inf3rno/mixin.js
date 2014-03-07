# [API documentation](../index.md)

## inheritance-object.js

This `module` exports the [`objectExtension`](objectExtension.md), which is a [`Extension`](../inheritance-extension/Extension.md) instance.

The `objectExtension` extends the `Object.prototype` with the following methods: `mixin()`, `extend()`, `hasAncestors()`, `hasDescendants()`, `instanceOf()`, `toFunction()`.

**It is not recommended to use this `module` unless you are using your custom classes only, and you are aware the result of modifying the `Object.prototype`.**

#### Examples

```js
    var objectExtension = require("inheritance-object");
    objectExtension.enable();

    var ancestorProto = {
        someOldMethod: function (){}
    };
    ancestorProto.mixin({
        anotherOldMethod: function (){}
    });

    var descendantProto = ancestorProto.extend({
        someNewMethod: function (){}
    });
    var Descendant = descendantProto.toFunction();

    var descendant = new Descendant();
    descendant.someOldMethod();
    descendant.anotherOldMethod();
    descendant.someNewMethod();
```