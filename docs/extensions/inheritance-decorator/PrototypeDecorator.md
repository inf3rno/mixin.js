# [API documentation](../../index.md) / [extensions](../index.md) / [inheritance-decorator.js](index.md)

## PrototypeDecorator class

This class is exported by the [inheritance-decorator.js](index.md) module and is implementing the [`Extension`](../Extension.md) interface.
This class can extend `prototype`s in a back-rollable way.

The `PrototypeDecorator` is applied in both of the [`Object.prototype`](../inheritance-object/index.md) and [`Function.prototype` adapters](../inheritance-function/index.md).

### <a name="constructor"></a>constructor()

Creates a new `PrototypeDecorator` instance and calls the `config()` method if `options` are set.

#### Syntax

`PrototypeDecorator constructor(Object options = null)`

#### Parameters

**options**

The `options` parameter can be an `Object` literal or `undefined`. It is the same as the `options` parameter in the [config(options)](#config) method.

#### Returns

A new `PrototypeDecorator` instance.

#### Examples

```js
    var extension = new PrototypeDecorator({
        target: function (){},
        source: {
            someNewMethod: function (){}
        },
        isEnabled: true
    });
```

### <a name="config"></a>config()

The `config()` method configures the `PrototypeDecorator` instance. It is called by its `constructor` when the `options` is set.

#### Syntax

`void config(Object options)`

#### Parameters

**options**

The `options` parameter must be an `Object` literal which contains the `isEnabled`, `target`, `source` properties.

If the value of the `isEnabled` property is `true`, then it should `enable()` the `PrototypeDecorator` automatically.

By enabling the `PrototypeDecorator`, it will copy methods from the `prototype` of the `source` property to the `prototype` of the `target` property.

#### Examples

```js
    extension.config({
        target: Function,
        source: {
            someNewMethod: function (){}
        },
        isEnabled: true
    });
```

### <a name="enable"></a>enable()

The `enable()` method enables the `PrototypeDecorator` instance if it is not enabled yet. By enabling the `PrototypeDecorator`, it will copy methods from the given `source` to the given `target`.

#### Syntax

`void enable()`

#### Examples

```js
    var func = function (){};
    var extension = new PrototypeDecorator({
        target: func,
        source: {
            someNewMethod: function (){}
        }
    });
    extension.enable();

    var instance = new func();
    instance.someNewMethod();
```

### <a name="disable"></a>disable()

The `disable()` method disables the `PrototypeDecorator` instance if it is enabled. It should rollback the changes made by the `enable()` method.

#### Syntax

`void disable()`

#### Examples

```js
    var func = function (){};
    var extension = new PrototypeDecorator({
        target: func,
        source: {
            someNewMethod: function (){}
        },
        isEnabled: true
    });

    var instance = new func();
    instance.someNewMethod();

    extension.disable();
    console.assert(instance.someNewMethod === undefined, "the new methods should be removed by disable");
```