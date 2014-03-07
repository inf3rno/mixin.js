# [API documentation](../index.md)

## polyfill.js

This file contains the javascript core requirements of the library for the case they are not implemented.

### <a name="hasOwnProperty"></a>Object.prototype.hasOwnProperty()

Defined by ES3. Checks whether a property was set on the instance or on the `prototype`. It is impossible to make perfect polyfill by constants.
[Read more...](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)

It is required by the [inheritancejs-extension](https://github.com/inf3rno/inheritancejs-extension) module.

#### Examples

```js
    var func = function (){};
    func.prototype.a = 1;
    var o = new func();
    o.b = 2;

    console.assert(!o.hasOwnProperty("a"), "should not return true by the property set on the prototype");
    console.assert(o.hasOwnProperty("b"), "should return true by the property set on the instance");
```

### <a name="create"></a>Object.create()

Defined by ES5. Creates a new instance from a `prototype` without calling the `constructor` of that `prototype`.
[Read more...](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

It is required by prototypal inheritance; by the [`extend()`](../inheritance/Wrapper.md#extend) method of the [`Wrapper`](../inheritance/Wrapper.md) class in the library core.

#### Examples

```js
    var a = {
        a: 1
    };
    var o = Object.create(a);
    o.b = 2;

    console.assert(!o.hasOwnProperty("a"));
    console.assert(o.hasOwnProperty("b"));
```

### <a name="defineProperty"></a>Object.defineProperty()

Defined by ES5. Defines a property on an object. It can set the value of that property, and the visibility as well. It is not possible to make a perfect polyfill by setting property visiblity.
[Read more...](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

It is required for the `WeakMap` polyfill, however it is possible to emulate `WeakMap` without this function, but that solution is very slow.

#### Examples

```js
    var a = {};
    Object.defineProperty(a, "prop", {
        value: 2,
        configurable: false,
        enumerable: false,
        writeable: false
    });

    console.assert(a.prop === 2);
```

### <a name="WeakMap"></a>WeakMap()

Defined by ES6. Returns a `Map` which is capable of having `object` or `function` keys.
A regular `object` which is usually used as `Map` can have only `string` keys.
[Read more...](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

It is required by creating a `constructor` - [`Wrapper`](../inheritance/Wrapper.md) cache for the [`WrapperFactory`](../inheritance/WrapperFactory.md) in the library core.

#### Examples

```js
    var map = new WeakMap();
    var a = {};

    console.assert(!map.has(a));
    console.assert(map.get(a) === undefined);

    map.set(a, "a");
    console.assert(map.has(a));
    console.assert(map.get(a) === "a");
```
