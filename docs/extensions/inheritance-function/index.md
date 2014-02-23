# [API documentation](../../index.md) / [extensions](../index.md)

## inheritance-function.js

This `module` exports the [`functionDecorator`](functionDecorator.md), which is a [`PrototypeDecorator`](../inheritance-decorator/PrototypeDecorator.md) instance.

The `functionDecorator` extends the `Function.prototype` with the following methods: `mixin()`, `extend()`, `hasAncestors()`, `hasDescendants()`, `hasInstance()`, `toObject()`.

Extending the `Function.prototype` is a common way to make `constructor` related features easy accessible, but it is not the only way.
Use this `module` if you feel using the [`wrap()`](../../inheritance/index.md#wrap) function not enough convenient.

#### Examples

```js
    var functionDecorator = require("inheritance-function");
    functionDecorator.enable();

    var Ancestor = Object.extend({
        someOldMethod: function (){}
    });
    Ancestor.mixin({
        anotherOldMethod: function (){}
    });

    var Descendant = Ancestor.extend({
        someNewMethod: function (){}
    });

    var descendant = new Descendant();
    descendant.someOldMethod();
    descendant.anotherOldMethod();
    descendant.someNewMethod();
```