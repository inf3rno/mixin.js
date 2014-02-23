# [API documentation](../index.md) / [extensions](index.md)

## Extension interface

There aren't any restrictions about how an `Extension` of [inheritance.js](../inheritance/index.md)  should be implemented, however I recommend the following interface:

### <a name="constructor"></a>constructor()

Creates a new instance implementing the `Extension` interface and calls the `config()` method if `options` are set.

#### Syntax

`Extension constructor(Object options = null)`

#### Parameters

**options**

The `options` parameter can be an `Object` literal or `undefined`. It is the same as the `options` parameter in the [config(options)](#config) method.

#### Returns

A new instance which implements the `Extension` interface.

#### Examples

```js
    var extension = new ConcreteExtension({
        isEnabled: true
    });
```

### <a name="config"></a>config()

The `config()` method configures the `Extension` implementation. It is called by its `constructor` when the `options` is set.

#### Syntax

`void config(Object options)`

#### Parameters

**options**

The `options` parameter must be an `Object` literal which contains the `isEnabled` property. If it's value is `true`, it should `enable()` the `Extension` automatically.

The `options` can contain other properties which are dependent of the concrete implementation of `Extension`.

#### Examples

```js
    var extension = new ConcreteExtension();
    extension.config({
        isEnabled: true
    });
```

### <a name="enable"></a>enable()

The `enable()` method enables the `Extension` implementation if it is not enabled yet. Without calling this method, you should not be able to use the `Extension` implementation.

It can be auto-called by the `config()`, when you pass the `isEnabled: true` flag.

#### Syntax

`void enable()`

#### Examples

```js
    var extension = new ConcreteExtension();
    extension.enable();
```

### <a name="disable"></a>disable()

The `disable()` method disables the `Extension` implementation if it is not disabled yet. It should rollback the changes made by the `enable()` method.

#### Syntax

`void disable()`

#### Examples

```js
    var extension = new ConcreteExtension({
        isEnabled: true
    });
    extension.disable();
```