# [API documentation](../index.md) / [inheritance.js](index.md)

## WrapperFactory class

The `WrapperFactory` is a class exported by the [`module`](index.md). It is used by the [`wrap()`](wrap.md) function to create new [`Wrapper`](Wrapper.md) instances.

### <a name="constructor"></a>constructor()

Creates a new `WrapperFactory` instance and calls the `config()` method if `options` are set.

#### Syntax

`WrapperFactory constructor(Object options = null)`

#### Parameters

**options**

The `options` parameter can be an `Object` literal or `undefined`. It is the same as the `options` parameter in the [config(options)](#config) method.

#### Returns

A new `WrapperFactory` instance.

#### Examples

```js
    var factory = new WrapperFactory({
        cache: new WeakMap()
    });
```

### <a name="config"></a>config()

The `config` method configures the `WrapperFactory`. It is called by its `constructor` when the `options` is set.

#### Syntax

`void config(Object options)`

#### Parameters

**options**

The `options` parameter must be an `Object` literal which contains the `cache` property. The value of the `cache` property must be a [`WeakMap`](http://kangax.github.io/es5-compat-table/es6/#WeakMap).

#### Examples

```js
    var factory = new WrapperFactory();
    factory.config({
        cache: new WeakMap()
    });
```

### <a name="createWrapper"></a>createWrapper()

The `createWrapper` should return the `Wrapper` instance related to the `source` parameter. The `Wrapper` instances can manipulate the `constructor` related to the `source` parameter.

#### Syntax

`Wrapper createWrapper(mixed source = {})`

#### Parameters

**source**

The `source` parameter has `mixed` type. It can be `constructor`, `prototype`, `object` and `null` or `undefined`.
The factory `sanitize`s the parameter at first. The result of this procedure will be always a `constructor` or an `object`.
After the `source` is sanitized the factory tries to get the related [`Wrapper`](Wrapper.md) instance from the `cache` set by the [`config()`](#config) method.
If it does not find the related `Wrapper` instance in the `cache` or the `cache` is not set, then it will create a new instance.
The `Wrapper` [`constructor`](Wrapper.md#constructor) is waiting the sanitized `source`.
After all of those steps the `createWrapper()` returns the `Wrapper` instance.

#### Throws

**`Error "Invalid source type."`**

If the `source` parameter is a primitive, but not `null` nor `undefined`, then the sanitization fails, and the function throws this exception.

#### Returns

The return value is a [`Wrapper`](Wrapper.md) instance.

#### Examples

The `wrap()` function can be used as short syntax instead of the `factory.createWrapper()`.

```js
    wrap();
    wrap.factory.createWrappper();
    new wrap.WrapperFactory().createWrapper();
```

Every line above means almost the same.
Of course the [`wrap()`](wrap.md) works only on a single `WrapperFactory` instance called [`factory`](index.md#factory),
but there are no restrictions about how many `WrapperFactory` instance can exist...

In the following examples I could use the short `wrap()` syntax, but I'll use the `createWrapper()` because of the current topic.

Using `constructor` sources.

```js
    var func = function (){};
    var wrapper = factory.createWrapper(func);
    console.assert(func === wrapper.toFunction(), "By constructor sources the Wrapper should work on the source itself.");
    console.assert(func.prototype === wrapper.toObject());
```

*The default parameter of the `Wrapper`s is `constructor`, so nothing special happens here.*

Using `prototype` sources.

```js
    var func = function (){};
    var proto = func.prototype;
    var wrapper = factory.createWrapper(proto);
    console.assert(func === wrapper.toFunction(), "By prototype sources the Wrapper should get their constructors.");
    console.assert(proto === wrapper.toObject());
```

*By `prototype` sources the sanitized `source` will be the `prototype.constructor`.*

Using `object` sources.

```js
    var obj = {};
    var wrapper = factory.createWrapper(obj);
    var func = wrapper.toFunction();
    console.assert(func instanceof Function, "By object sources the Wrapper should get the source itself and create a constructor for it.");
    console.assert(obj === wrapper.toObject());
```

*By `object` (non-`prototype`) sources the sanitized `source` will be the `source` itself. The `Wrapper` will build a `constructor` for the `source` and use the `source` as the `prototype` of that `constructor`.*

Using `null` or `undefined` sources.

```js
    var wrapper = factory.createWrapper();
    var func = wrapper.toFunction();
    var proto = wrapper.toObject();
    console.assert(func instanceof Function, "By empty sources the WrapperFactory should create an object source and pass it to the Wrapper.");
    console.assert(proto instanceof Object);
```

*By `undefined` or `null` source the sanitized `source` wull be a new `object`. After that everything will work the same way as by `object` sources*

Using `Wrapper` sources.

```js
    var wrapper = factory.createWrapper();
    var wrapperWrapper = factory.createWrapper(wrapper);
    console.assert(wrapper === wrapperWrapper, "You cannot wrap a Wrapper instance.");
```

*By `Wrapper` sources you will get back exactly the same `Wrapper` instance you passed.*