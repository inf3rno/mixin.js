# [API documentation](../index.md)

## [inheritance.js](index.md)

### <a name="wrap"></a>wrap()

The `wrap()` function is the exported value of the *inheritance* `module`.

The `wrap()` function uses the [`module.factory`](index.md#factory) to transform `source`s into [`Wrapper`](Wrapper.md) instances.

#### Syntax

`Wrapper wrap(mixed source)`

#### Parameters

**source**

The `source` param has `mixed` type. It can be `constructor`, `prototype`, `object` and `undefined`.
It is the same as the `source` parameter of the [`WrapperFactory.createWrapper(source)`](WrapperFactory.md#createWrapper).

#### Throws

**`Error "Invalid source type."`**

This exception is thrown by [`WrapperFactory.createWrapper(source)`](WrapperFactory.md#createWrapper) when the `source` parameter is a primitive, but not `null` nor `undefined`.

#### Returns

The return value is a [`Wrapper`](Wrapper.md) instance.

#### Examples

```js
    var wrap = require("inheritance");

    var Display = wrap(function (options){
        if (options)
            this.config(options);
    }).mixin({
        config: function (options){
            this.defaultMessage = options.defaultMessage;
        }
    }).toFunction();

    var ConsoleDisplay = wrap(Display).extend({
        show: function (message){
            console.log(message || this.defaultMessage);
        }
    }).toFunction();

    var display = new ConsoleDisplay({
        defaultMessage: "Hello world!"
    });

    display.show(); //console: "Hello world!"
    display.show("My first message."); //console: "My first message."
```
