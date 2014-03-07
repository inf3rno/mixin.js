# [API documentation](../index.md)

## inheritance-extension.js

The goal of this module to ease the creation of `prototype` (for example `Function.prototype`) extender extensions.

This `module` is a requirement of the [`Object.prototype`](../inheritance-object/index.md) and [`Function.prototype` extensions](../inheritance-function/index.md).

### <a name="Extension"></a>Extension

The `module` exports the [`Extension`](Extension.md) class.

The aim of this class to extend the `prototype` of the given `target` in a disableable way. It uses the `mixin()` function to achieve that.

```js
    var Extension = require("inheritance-extension");

    var func = function (){};
    var extension = new Extension({
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
