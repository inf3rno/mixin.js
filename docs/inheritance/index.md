# [API documentation](../index.md)

## inheritance.js

The *inheritance* module contains the core library with a [wrapper function](#wrap), [constructor wrappers](#Wrapper) and their [factory](#factory), [prototypal](Wrapper.md#extend) and [multiple](Wrapper.md#mixin) inheritance and [type check functions](Wrapper.md#hasInstance).

### <a name="wrap"></a>wrap()

The `module` exports the [`wrap()`](wrap.md) function.

```js
    var wrap = require("inheritance");
    var wrapper = wrap();
```

### <a name="factory"></a>factory

The `factory` is a `WrapperFactory` instance by default and is used by the `wrap()` function in order to create new `Wrapper` instances.
The `factory` must have only a [`createWrapper(source)`](WrapperFactory.md#createWrapper) method.

```js
    var wrap = require("inheritance");
    var factory = wrap.factory;
    var wrapper = factory.createWrapper();
```

### <a name="WrapperFactory"></a>WrapperFactory

The [`WrapperFactory`](WrapperFactory.md)'s main purpose is to create `Wrapper` instances for the `source`s you pass.
It has a `WeakMap` cache by default which stores the `constructor` - `Wrapper` pairs.
You can use it the following way.

```js
    var wrap = require("inheritance");
    var WrapperFactory = wrap.WrapperFactory;
    var myFactory = new WrapperFactory({
        cache: new WeakMap()
    });
    var wrapper = myFactory.createWrapper();
```

The `WeakMap` is partially contained by my [polyfill.js](../polyfill/index.md#WeakMap), but it is part of the EC6 standard.

### <a name="Wrapper"></a>Wrapper

The [`Wrapper`](Wrapper.md)'s purpose to wrap the `constructor` functions and modify their `prototype` the way you want.

```js
    var wrap = require("inheritance");
    var Wrapper = wrap.Wrapper;

    var func = function (){
        this.msg();
    };
    func.prototype.msg = function (){
        console.log("message");
    };

    var wrapper = new Wrapper(func);
    wrapper.mixin({
        msg: function (){
            console.log("other message");
        }
    });

    new func(); //console: "other message"
```

The `Wrapper`s are awaiting `constructor`s. If you pass an `object` to a `Wrapper`, it will generate and set a new `constructor` on it.
