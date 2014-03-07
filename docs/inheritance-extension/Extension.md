# [API documentation](../index.md) / [inheritance-extension.js](index.md)

## Extension class

This class is exported by the [inheritance-extension.js](index.md) module. This class can extend `prototype`s in a disableable way.

The `Extension` class is applied in both of the [`Object.prototype`](../inheritance-object/index.md) and [`Function.prototype` extensions](../inheritance-function/index.md).

**This is just a recommendation how to create inheritance extensions. You can use you own way if you want, you don't have to implement any specific interface, just use the `wrap()` function and the `Wrapper` methods.**

### <a name="constructor"></a>constructor()

Creates a new `Extension` instance and calls the `config()` method if `options` are set.

#### Syntax

`Extension constructor(Object options = null)`

#### Parameters

**options**

The `options` parameter can be an `Object` literal or `undefined`. It is the same as the `options` parameter in the [config(options)](#config) method.

#### Returns

A new `Extension` instance.

#### Examples

```js
    var extension = new Extension({
        target: function (){},
        source: {
            someNewMethod: function (){}
        },
        isEnabled: true
    });
```

### <a name="config"></a>config()

The `config()` method configures the `Extension` instance. It is called by its `constructor` when the `options` is set.

#### Syntax

`void config(Object options)`

#### Parameters

**options**

The `options` parameter must be an `Object` literal which contains the `isEnabled`, `target`, `source` properties.

If the value of the `isEnabled` property is `true`, then it should `enable()` the `Extension` automatically.

By enabling the `Extension`, it will copy methods from the `prototype` of the `source` property to the `prototype` of the `target` property.

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

The `enable()` method enables the `Extension` instance if it is not enabled yet. By enabling the `Extension`, it will copy methods from the given `source` to the given `target`.

#### Syntax

`void enable()`

#### Examples

```js
    var func = function (){};
    var extension = new Extension({
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

The `disable()` method disables the `Extension` instance if it is enabled. It should rollback the changes made by the `enable()` method.

#### Syntax

`void disable()`

#### Examples

```js
    var func = function (){};
    var extension = new Extension({
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