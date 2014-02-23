# [API documentation](../../index.md) / [extensions](../index.md)

## inheritance-decorator.js

The goal of this module to ease the creation of `prototype` (for example `Function.prototype`) appender [`Extension`](../Extension.md) implementations.

This `module` is a requirement of the [`Object.prototype`](../inheritance-object/index.md) and [`Function.prototype` adapters](../inheritance-function/index.md).

### <a name="PrototypeDecorator"></a>PrototypeDecorator

The `module` exports the [`PrototypeDecorator`](PrototypeDecorator.md) class.

The aim of this class to extend the `prototype` of the given `target` in a back-rollable way.

```js
    var PrototypeDecorator = require("inheritance-decorator");

    var func = function (){};
    var extension = new PrototypeDecorator({
        target: func,
        source: {
            customMethod: function (){
                console.log("custom method called");
            }
        },
        isEnabled: true
    });

    var instance = new func();
    instance.customMethod(); //console: "custom method called"

    extension.disable(); //rolls back the customMethod property
    instance.customMethod(); //error: customMethod is not a function
```
