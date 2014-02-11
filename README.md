# mixin.js - 1.1.0

This small lib contains prototypal inheritance and multiple inheritance support to ease the pain by creating complex javascript applications.

# Warning!

**If everything goes well, mixin.js will get a new name soon.**

After that I'll add support for component management systems: npm, bower, jam, component, etc...

## Requirements

There are no requirements, this library uses core javascript only.

## Supported platforms

### Browser support

The library should work in **every browser**, because it uses core javascript only.

I tested in firefox with require.js. If you have troubles with other browsers, please [send me a report](https://github.com/inf3rno/mixin.js/issues/1)!

### NodeJS support

Coming soon...

## Configuration

The *Function.prototype* and *Object.prototype* extensions are not enabled by default. You can enable them in several ways...

Enable extension from *require.js* config:

    require.config({
        config: {
            mixin: {
                extensions: [Function] //enables Function.prototype extension
            }
        }
    });

or manually with `Mixin.config` for example in *AMD style*:

	define(["mixin"], function (Mixin){
        Mixin.config({
             extensions: [Function] //enables Function.prototype extension
        });

        //...
	});

Enable extension one by one manually:

    Mixin.extensions.enable(Object); //enables Object.prototype extension

You can check whether an extension is enabled from your code in a similar way:

	Mixin.extensions.require(Object); //should throw Error if the Object.prototype extension is not enabled

Usually the `config()` function is more than enough.

## Documentation

### Instantiation

You can use the `Mixin()` function to create new `Mixin` instances.

	var mixin = Mixin(source);
	var mixin2 = new Mixin(source2);

The `source` can be an instance of `Object`, `Function` or `null` or `undefined`.

    var mixin = new Mixin();
    var mixin2 = new Mixin({a: 1});
    var mixin3 = new Mixin(function (){});
    // etc...

The `Mixin` functions are always working on a `constructor`.
You can use the `toFunction()` to get the `constructor` and the `toObject()` to get its `prototype`.

    var func = function (){};
    var mixin = new Mixin(func);
    console.assert(func === mixin.toFunction(), "The toFunction() should return the constructor.");
    console.assert(func.prototype === mixin.toObject(), "The toObject() should return the prototype.");

If you pass a `prototype` then `Mixin()` will find its `constructor`.

    var func = function (){};
    var mixin = new Mixin(func.prototype);
    console.assert(func === mixin.toFunction(), "Mixin(prototype) should find the constructor of the prototype.");

If you pass a regular `object` (not a `prototype`) to the `Mixin()`, then it will generate a `constructor` for it. After that the `object` will be a `prototype`.

    var object = {a: 1};
    var mixin = new Mixin(object);
    var func = mixin.toFunction();
    console.assert(object.constructor === func);
    console.assert(func.prototype === object);

Ofc. you can use not just object literals, `constructor` generation works by any objects... So you can combine `Mixin` with libs using any other inheritance approaches.

    var ancestor = function (){};
        ancestor.prototype = {a: 1};
    var object = new Ancestor();
    var func = Mixin(object).toFunction();
    var instance = new func();
    console.assert(instance.a === ancestor.prototype.a, "Custom prototypal inheritance approach should work.");

If you set an `initialize()` function on the `object` you pass, then the newly generated `constructor` will call it by instantiation.

    var object = {
        initialize: function (){
            console.log("Created a new instance.");
        }
    };
    var mixin = new Mixin(object);
    var func = mixin.toFunction();
    console.assert(func !== object.initialize, "The constructor and the initialize should not be the same.");
    var instance = new func(); //console: "Created a new instance." (the constructor called the initialize)

### Multiple inheritance

You can achieve multiple inheritance by using the `mixin()` function. The ancestor parameters can be `Mixin` instances or `source`s which can be used by `Mixin()`.

	var Ancestor1 = new Mixin({a: 1});
	var Ancestor2 = function (){
	    console.log("Created new instance.");
	};
	Ancestor2.prototype = {b: 2};
	var Ancestor3 = {c: 3};

	var mixin = new Mixin();
	mixin.mixin(Ancestor1, Ancestor2, Ancestor3);
	var Descendant = mixin.toFunction();
	var instance = new Descendant(); //console: "Created a new instance."
	console.log(instance); //{initialize: Ancestor2, a: 1, b: 2, c: 3}

The multiple inheritance always copies the values, so the posterior modifications of the sources won't affect the descendant.

	var ancestor = new Mixin({a: 1});
	var descendant = new Mixin();
	descendant.mixin(ancestor);
	ancestor.mixin({b: 2});

	console.log(ancestor.toObject()); //{a: 1, b: 2}
	console.log(descendant.toObject()); //{a: 1}, the b property is not affected

Ofc. this value copy has no effect on complex cases for example like the following.

    var object = {x: 0};
	var ancestor = new Mixin(Object.create(object));
	ancestor.mixin({a: 1});
	var descendant = new Mixin();
	descendant.mixin(ancestor);
	ancestor.mixin({b: 2});
	object.y = -1;

    console.log(object); //{x: 0, y: -1}
	console.log(ancestor.toObject()); //{x: 0, y: -1, a: 1, b: 2}
	console.log(descendant.toObject()); //{x: 0, y: -1, a: 1}, the y property is affected

It is not recommended by any language to modify ancestor classes latter, because you won't know where you break the code. So do it gently if you don't have other options.

### Prototypal inheritance

You can achieve prototypal inheritance by using the `extend()` function. This will create a source with `Object.create()` and generate a new `constructor` for that.

	var ancestor = new Mixin(function (){
		console.log("Created a new instance.");
	});
	var descendant = ancestor.extend();
	var Descendant = descendant.toFunction();
	var instance = new Descendant(); //console: "Created a new instance."

If the `constructor` of the ancestor is native, then by default the `extend()` set it as `initialize`. Ofc you can override that `constructor` any time.

By prototypal inheritance, the posterior changes of the ancestor will affect the descendant.

    var ancestor = new Mixin({
        a: 1
    });
    var descendant = ancestor.extend({
        b: 2
    });
    ancestor.mixin({
        c: 3
    });
    var Descendant = descendant.toFunction();
    var instance = new Descendant();
    console.log(instance); // {a:1, c:3, b:2}

### Combined inheritance

Ofc. you can use prototypal and multiple inheritances in any combination.

	var ancestor = new Mixin(function (){
		console.log("Created a new instance.");
	});
	ancestor.mixin({
	    a: 1
	});
	var descendant = ancestor.extend({
	    b: 2,
	    c: 3
	}, {
	    d: 4
	});
	ancestor.mixin({
	    e: 5
	});
	var Descendant = descendant.toFunction();
	var instance = new Descendant(); //console: "Created a new instance."
	console.log(instance); // {a: 1, b: 2, c: 3, d: 4, e: 5}

Calling the `constructor` of every ancestor is almost the same as usual.

    var Ancestor1 = function (){
        this.a = 1;
    };
    var Ancestor2 = Mixin({
        initialize: function (){
            this.b = 2;
        }
    }).toFunction();
    var Ancestor3 = Mixin({
        initialize: function (){
            this.c = 3;
        }
    }).toFunction();
    var Ancestor4 = Mixin({}).toFunction();
    var descendant = Mixin(Ancestor1).extend(
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
    var instance = new Descendant();
    console.assert(instance, {initialize: Descendant.prototype.initialize, a: 1, b: 2, c: 3});

If the `constructor` of one of the ancestors is generated, you don't have to find it's `initialize` in its `prototype` to avoid recursion, because
the generated `constructor` always calls the `initialize` stored in its `prototype`...

As you can see I am not a big fan of the `super()` methods or anything like that...

### Checking types

You can use 3 functions in order to check type. Let's assume we have the following family tree.

    var grandma = Mixin();
    var grandpa = Mixin();
    var mother = grandma.extend(grandpa);
    var father = Mixin();
    var son = father.extend(mother);
    var daughter = mother.extend(father);

The `Mixin.hasAncestors(source 1, source 2, ...)` returns `true` when the actual `Mixin` has every `source` amongst its ancestors.

    console.assert(mother.hasAncestor(grandma, grandpa), "The mother should recognize her parents.");
    console.assert(son.hasAncestors(mother, father), "The son should recognize his parents.");
    console.assert(son.hasAncestors(grandma, grandpa), "The son should recognize his grandparents.");

The `Mixin.hasDescendants(source 1, source 2, ...)` returns `true` when the actual `Mixin` has every `source` amongst its descendants.

    console.assert(mother.hasDescendants(son, daughter), "The mother should recognize her children.");
    console.assert(grandma.hasDescendants(mother), "The grandma should recognize her daughter.");
    console.assert(!grandma.hasDescendants(father), "The grandma should not recognize the husband of her daughter.");
    console.assert(grandma.hasDescendants(son, daughter), "The grandma should recognize his grandchildren.");

The `Mixin.hasInstance(instance)` returns `true` when the actual `Mixin` contains the `constructor` the `instance` or contains one of the ancestors of the `constructor` of the `instance`.

    var Son = son.toFunction();
    var me = new Son();
    console.assert(son.hasInstance(me), "The collective of sons should recognize that I am a member of it.");
    console.assert(grandma.hasInstance(me), "The collective of grandmas should recognize that I am one of the grandsons.");

### Extensions

You can use 2 extensions to forget the instantiation of `Mixin`. You can enable extensions the way I wrote by the *Configuration* section.

#### Function.prototype extension

This extension extends the `Function.prototype` with 6 additional functions:

    Function mixin(ancestor1, ancestor2, ...) - multiple inheritance
    Function extend(ancestor1, ancestor2, ...) - prototypal inheritance
    Boolean hasAncestors(ancestor1, ancestor2, ...) - ancestor check
    Boolean hasDescendants(descendant1, descendant2, ...) - descendant check
    Boolean hasInstance(instance) - instance check
    Object toObject() - returns the prototype

Example usage:

    var Ancestor1 = function (){
        this.a = 1;
    };
    var Ancestor2 = Object.extend({
        initialize: function (){
            this.b = 2;
        }
    });
    var ancestor3 = {
        initialize: function (){
            this.c = 3;
        }
    };

    var Descendant = Ancestor1.extend(
        Ancestor2,
        {
            initialize: function (){
                Ancestor1.call(this);
                Ancestor2.call(this);
                ancestor3.constructor.call(this);
                this.d = 4;
            }
        }
    );

    var a = new Ancestor1();
    console.log(a); //{a:1}
    var d = new Descendant();
    console.log(d); //{a:1, b:2, c:3, d:4}


#### Object.prototype extension

This extension extends the `Object.prototype` with 3 additional functions:

    Object mixin(ancestor1, ancestor2, ...) - multiple inheritance
    Object extend(ancestor1, ancestor2, ...) - prototypal inheritance
    Boolean hasAncestors(ancestor1, ancestor2, ...) - ancestor check
    Boolean hasDescendants(descendant1, descendant2, ...) - descendant check
    Boolean instanceOf(ancestor1, ancestor2, ..., constructor, ...) - instance check
    Function toFunction() - returns the constructor

Example usage:

    var ancestor1 = {
        initialize: function (){
            this.a = 1;
        }
    };
    var Ancestor2 = function (){
        this.b = 2;
    };

    var descendant = ancestor1.extend(
        Ancestor2,
        {
            initialize: function (){
                ancestor1.toFunction().call(this);
                Ancestor2.call(this);
                this.c = 3;
            }
        }
    );

    var Ancestor1 = ancestor1.toFunction();
    var Descendant = descendant.toFunction();

    var a = new Ancestor1();
    console.log(a); //{a:1}
    var d = new Descendant();
    console.log(d); //{a:1, b:2, c:3}

Of course your can combine the 2 extensions if you want. Usually the `Function.prototype` extension is more than enough, and nobody will like you if you override the `Object.prototype`.

## Contribution

If you have found a bug, or you have an enhancement idea, please don't hesitate, [write it to me](https://github.com/inf3rno/mixin.js/issues).

## License

Mixin.js is licensed under the [WTFPL](http://www.wtfpl.net/) license, so feel free to do wtf you want with it... ;-)