# [API documentation](../index.md) / [inheritance.js](index.md)

## Wrapper class

The `Wrapper` is a class in by the [library core](index.md).
Its instances are created by [`WrapperFactory`](WrapperFactory.md) instances,
however you usually meet them as return values of the [`wrap()`](wrap.md) function.

The main goal of the `Wrapper` class is to manipulate the `prototype` of `constructor` functions.
It implements [prototypal inheritance](#extend), [multiple inheritance](#mixin), [type checks](#hasInstance), and so on...
It is the most important class in this library.

You can extend the library by modifying the `Wrapper` class. You can reach it from the [module](index.md#Wrapper).

```js
    var wrap = require("inheritance");
    var Wrapper = wrap.Wrapper;
    wrap(Wrapper).mixin({
        myFeature: function (){
            console.log("a new Wrapper feature");
        }
    });

    wrap(function (){}).myFeature(); //console: "a new Wrapper feature"
```

*If you have a feature you find very useful, you can always send it in a pull request to this repo.
It can be part of the core behavior, or it can be an extension.*

### <a name="target"></a>target

This property contains the `constructor` the `Wrapper` is working on.

#### Syntax

`Function target`

### <a name="isNative"></a>isNative

This property stores that the `target` constructor was passed as a `source` (`isNative: true`) or was created by the `Wrapper` (`isNative: false`).

#### Syntax

`Boolean isNative`

### <a name="constructor"></a>constructor()

Creates a new `Wrapper` instance and sets its `target`.
If the `source` is a `constructor` then it will be the `target`,
otherwise the `Wrapper` will create a new `constructor` function as `target` and set the `source` as the `prototype` of that.

*The `Wrapper` fixes the `constructor` property of the `prototype`s.
The `WrapperFactory` highly depends on this feature by the sanitization of `prototype` sources.
If you use a code, which is tampering with the `constructor` property of any `object`, then it might interfere with this library.*

#### Syntax

`Wrapper constructor(mixed source)`

#### Parameters

**source**

The `source` parameter can be `function` or `object`.
Every other parameter type will be used as it were an `object`, so passing them may result an unexpected error.

#### Returns

A new `Wrapper` instance.

#### Examples

```js
    var func = function (){};
    var wrapper = new Wrapper(func);
    console.assert(func === wrapper.toFunction());
```

```js
    var obj = {};
    var wrapper = new Wrapper(obj);
    var func = wrapper.toFunction();
    console.assert(func === obj.constructor);
    console.assert(obj === func.prototype);
```

**It is strongly recommended to use the [`wrap()`](wrap.md) function to get the `Wrapper` instances,
because it uses a cached `WrapperFactory` to create them...**

```js
    var obj = {};
    var wrapper = wrap(obj);
    var func = wrapper.toFunction();
    console.assert(func === obj.constructor);
    console.assert(obj === func.prototype);
```

### <a name="mixin"></a>mixin()

You can achieve multiple inheritance by using the `mixin()` method.
The ancestor parameters can be `Wrapper` instances or `source`s which can be used by `wrap()`.

#### Syntax

`Wrapper mixin(mixed source_1, mixed source_2, ...)`

#### Parameters

**source_i**

The `source` parameter is the input of the `wrap()` function.
It will be wrapped and the related `prototype` will be used as copy source.

#### Returns

The original `Wrapper` instance.

#### Examples

```js
	var ancestorWrapper1 = wrap({a: 1});
	var Ancestor2 = function (){
	    console.log("Created new instance.");
	};
	Ancestor2.prototype = {b: 2};
	var ancestorProto3 = {c: 3};

	var descendantWrapper = wrap();
	descendantWrapper.mixin(ancestorWrapper1, Ancestor2, ancestorProto3);
	var Descendant = descendantWrapper.toFunction();
	var descendant = new Descendant(); //console: "Created a new instance."
	console.log(descendant); //{initialize: Ancestor2, a: 1, b: 2, c: 3}
```

The multiple inheritance always copies the values, so the posterior modifications of the `source`s won't affect the descendant.

```js
	var ancestorWrapper = wrap({a: 1});
	var descendantWrapper = wrap();
	descendantWrapper.mixin(ancestorWrapper);
	descendantWrapper.mixin({b: 2});

	console.log(ancestorWrapper.toObject()); //{a: 1, b: 2}
	console.log(descendantWrapper.toObject()); //{a: 1}, the b property is not affected
```

Ofc. this value copy has no effect on complex cases for example like the following.

```js
    var object = {x: 0};
	var ancestorWrapper = wrap(Object.create(object));
	ancestorWrapper.mixin({a: 1});
	var descendantWrapper = wrap();
	descendantWrapper.mixin(ancestorWrapper);
	ancestorWrapper.mixin({b: 2});
	object.y = -1;

    console.log(object); //{x: 0, y: -1}
	console.log(ancestorWrapper.toObject()); //{x: 0, y: -1, a: 1, b: 2}
	console.log(descendantWrapper.toObject()); //{x: 0, y: -1, a: 1}, the y property is affected
```

*It is not recommended by any language to modify ancestor classes latter, because you won't know where you break the code. So do it gently if you don't have other options.*

### <a name="extend"></a>extend()

You can achieve prototypal inheritance by using the `extend()` method.
This creates a child `prototype` by calling `Object.create()` on the related `prototype` of the current `Wrapper`.
So it uses classical prototypal inheritance...
After that the new `prototype` is used as a `wrap()` source, and the child `Wrapper` is returned.

#### Syntax

`Wrapper extend(mixed source_1, mixed source_2, ...)`

#### Parameters

**source_i**

The `source` parameters are the inputs of the `mixin()` method.
So they are for multiple inheritance purposes, you don't need them for prototypal inheritance.

#### Returns

The original `Wrapper` instance.

#### Examples

```js
	var ancestorWrapper = wrap(function (){
		console.log("Created a new instance.");
	});
	var descendantWrapper = ancestorWrapper.extend();
	var Descendant = descendantWrapper.toFunction();
	var descendant = new Descendant(); //console: "Created a new instance."
```

If the `constructor` of the ancestor is native, then by default the `extend()` sets it as `initialize`. Ofc you can override that `constructor` any time.

By prototypal inheritance, the posterior changes of the ancestor will affect the descendant.

```js
    var ancestorWrapper = wrap({
        a: 1
    });
    var descendantWrapper = ancestorWrapper.extend({
        b: 2
    });
    ancestorWrapper.mixin({
        c: 3
    });
    var Descendant = descendantWrapper.toFunction();
    var descendant = new Descendant();
    console.log(descendant); // {a:1, c:3, b:2}
```

You can use prototypal and multiple inheritances in any combination by passing `source` parameters.

```js
	var ancestorWrapper = wrap(function (){
		console.log("Created a new instance.");
	});
	ancestorWrapper.mixin({
	    a: 1
	});
	var descendantWrapper = ancestorWrapper.extend({
	    b: 2,
	    c: 3
	}, {
	    d: 4
	});
	ancestorWrapper.mixin({
	    e: 5
	});
	var Descendant = descendantWrapper.toFunction();
	var descendant = new Descendant(); //console: "Created a new instance."
	console.log(descendant); // {a: 1, b: 2, c: 3, d: 4, e: 5}
```

Calling the `constructor` of every ancestor is almost the same as usual.

```js
    var Ancestor1 = function (){
        this.a = 1;
    };
    var Ancestor2 = wrap({
        initialize: function (){
            this.b = 2;
        }
    }).toFunction();
    var Ancestor3 = wrap({
        initialize: function (){
            this.c = 3;
        }
    }).toFunction();
    var Ancestor4 = wrap({}).toFunction();
    var descendant = wrap(Ancestor1).extend(
        Ancestor2,
        Ancestor3,
        Ancestor4, {
        initialize: function (){
            Ancestor1.call(this);
            Ancestor2.prototype.initialize.call(this);
            Ancestor3.call(this); //yes this one works as well ^^
            Ancestor4.call(this); //this one has undefined init but does not fail
        }
    });
    var Descendant = descendant.toFunction();
    var descendant = new Descendant();
    console.assert(descendant, {initialize: Descendant.prototype.initialize, a: 1, b: 2, c: 3});
```

If the `constructor` of one of the ancestors is generated, you don't have to find it's `initialize` in its `prototype` to avoid recursion, because
the generated `constructor` always calls the `initialize` stored in the ancestor's `prototype`.

You can achieve the same behavior by every method this way:

```js
    descendantWrapper.mixin({
        someMethod: function (){
            Ancestor.prototype.method.call(this); //calls always the method of an ancestor
            this.method(); //calls the method currently stored in the descendant
        }
    });
```

This is how core javascript works.
I think using a workaround to make the call shorter, for example: `this.parent`, `this.superMethod()`, etc... just makes code very slow,
and confuses people. So I am not a big fan of those solutions.


### <a name="hasAncestors"></a>hasAncestors()


The `hasAncestors()` returns `true` when the actual `Wrapper` has every `source` amongst its ancestors. Both multiple inheritance and prototypal inheritance ancestors are accounted.

#### Syntax

`Boolean hasAncestors(mixed source_1, mixed source_2, ...)`

#### Parameters

**source_i**

The `source` parameters are the inputs of the `wrap()` function. So they are converted to `Wrapper` instances.

##### Returns

Whether every `source` is an ancestor of the current `Wrapper`.

#### Examples

```js
    var grandma = wrap();
    var grandpa = wrap();
    var mother = grandma.extend(grandpa);
    var father = wrap();
    var son = father.extend(mother);
    var daughter = mother.extend(father);

    console.assert(mother.hasAncestor(grandma, grandpa), "The mother should recognize her parents.");
    console.assert(son.hasAncestors(mother, father), "The son should recognize his parents.");
    console.assert(son.hasAncestors(grandma, grandpa), "The son should recognize his grandparents.");
```

### <a name="hasDescendants"></a>hasDescendants()

The `hasDescendants(source 1, source 2, ...)` returns `true` when the actual `Wrapper` has every `source` amongst its descendants. Both multiple inheritance and prototypal inheritance ancestors are considered.

#### Syntax

`Boolean hasDescendants(mixed source_1, mixed source_2, ...)`

#### Parameters

**source_i**

The `source` parameters are the inputs of the `wrap()` function. So they are converted to `Wrapper` instances.

#### Returns

Whether every `source` is a descendant of the current `Wrapper`.

#### Examples

```js
    var grandma = wrap();
    var grandpa = wrap();
    var mother = grandma.extend(grandpa);
    var father = wrap();
    var son = father.extend(mother);
    var daughter = mother.extend(father);

    console.assert(mother.hasDescendants(son, daughter), "The mother should recognize her children.");
    console.assert(grandma.hasDescendants(mother), "The grandma should recognize her daughter.");
    console.assert(!grandma.hasDescendants(father), "The grandma should not recognize the husband of her daughter.");
    console.assert(grandma.hasDescendants(son, daughter), "The grandma should recognize his grandchildren.");
```

### <a name="hasInstance"></a>hasInstance()

The `hasInstance()` returns `true` when the actual `Wrapper` contains the `constructor` of the `instance` itself,
or one of the ancestors of it (including both multiple inheritance and prototypal inheritance ancestors).

#### Syntax

`Boolean hasInstance(object instance)`

#### Parameters

**instance**

The `instance` parameter is an `object`. In this context the `function`s are `object`s too, they are `Function` instances...

#### Returns

A new `Wrapper` instance.

#### Examples

```js
    var func = function (){};
    var wrapper = wrap(func);
    var instance = new func();
    console.assert(wrapper.hasInstance(instance));
    console.assert(!wrapper.hasInstance({}), "it should not return true by a random object...");
```

```js
    var wrapper = wrap(Function);
    var instance = function (){}
    console.assert(wrapper.hasInstance(instance));
    console.assert(!wrapper.hasInstance({}));
```

```js
    var grandma = wrap();
    var grandpa = wrap();
    var mother = grandma.extend(grandpa);
    var father = wrap();
    var son = father.extend(mother);
    var daughter = mother.extend(father);

    var Son = son.toFunction();
    var me = new Son();
    console.assert(son.hasInstance(me), "The collective of sons should recognize that I am a member of it.");
    console.assert(grandma.hasInstance(me), "The collective of grandmas should recognize that I am one of the grandsons.");
```

### <a name="toFunction"></a>toFunction()

Returns the `target`, which is a `constructor` function.

#### Syntax

`Function toFunction()`

#### Returns

The `constructor` function related to the current `Wrapper`.

#### Examples

```js
    var func = function (){};
    var wrapper = wrap(func);
    console.assert(func === wrapper.toFunction(), "The toFunction() should return the constructor.");
```

### <a name="toObject"></a>toObject()

Returns the `target.prototype`, which is an `object`.

#### Syntax

`Object toObject()`

#### Returns

The `prototype` of the `constructor` function, which is related to the current `Wrapper`.

#### Examples

```js
    var func = function (){};
    var wrapper = new Inheritance(func);
    console.assert(func.prototype === wrapper.toObject(), "The toObject() should return the prototype.");
```
