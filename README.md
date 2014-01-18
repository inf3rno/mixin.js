# mixin.js - 1.0.0

This small lib contains prototypal inheritance and multiple inheritance support to ease the pain by creating complex javascript applications.

## Requirements

You'll need **require.js** only. I always use *require.js* on client side, but maybe later I'll add a standalone version.

## Supported platforms

### Browser support

The library should work in **every browser**, because it uses core javascript only.

I tested it in firefox only. If you want to contribute, please run the unit tests in your favorite browser, and [send me a report](https://github.com/inf3rno/mixin.js/issues/1) about they fail or not!

### NodeJS support

Currently **NodeJS is not supported**, I'll add it later. I need this library for client side applications...

## Configuration

The *Function.prototype* and *Object.prototype* extensions are not enabled by default.
You can enable them from the *require.js* config, or manually with the `extensions.enable(Function extendable, ...)` function.

Enable extension from *require.js* config:

    require.config({
        config: {
            mixin: {
                extensions: [Function] //enable Function.prototype extension
            }
        },
        paths: {
            mixin: "../src/mixin"
        }
    });

Enable extension manually:

	define(["mixin"], function (Mixin){
		Mixin.extensions.enable(Object); //enable Object.prototype extension

		//...
	});

Your can check whether an extension is enabled from your code with the `extensions.require(Function extendable, ...)`:

	define(["mixin"], function (Mixin){
		Mixin.extensions.require(Function); //should throw Error if the Function.prototype extension is not enabled

		//...
	});

I suggest you to use *require.js* to enable these extensions, that's why I did not write an *isEnabled* function.

## Documentation

### Instantiation

You can use the `Mixin` function to create new `Mixin` instances.

	var m = Mixin(source);
	var m2 = new Mixin(source);

Each `Mixin` instance contains one constructor **F** and one prototype **o**. You can get them with the `toFunction()` and `toObject()` functions.

	var m = new Mixin();
	var F = m.toFunction(); //F.prototype = o
	var o = m.toObject(); //o.constructor ? F - this depends on what type of source we used

The **F** is not always the same as the `o.constructor` but the `F.prototype` is always the same as the **o**.

#### source parameter

The `Mixin(source)` function requires one **source** parameter, which can be

##### undefined

	var m = new Mixin(); //in this case the Mixin will generate a function and an empty object
	// F -> function (){}
	// o -> {}

##### function

	var MyClass = function (){
		this.a = 1;
	};
	MyClass.prototype = {
		b: 2
	};

	var m = new Mixin(MyClass);
	// F -> MyClass
	// o -> MyClass.prototype

##### prototype

	var MyClass = function (){
		this.a = 1;
	};
	MyClass.prototype = {
		constructor: MyClass //the constructor is Object by default, you have to set it properly if you want to use this object as the prototype of MyClass
		b: 2
	};

	var m = new Mixin(MyClass.prototype);
	// F -> MyClass
	// o -> MyClass.prototype

##### object

	var myObject = {
		constructor: function (){ //you can set here one or more constructor if you want, Object is not considered as a constructor
			this.a = 1;
		},
		b: 2
	};

	var mixin = new Mixin(myObject);
	// F -> function (){myObject.constructor()}
	// o -> myObject

So if you pass a function or a prototype as source, the **F** will be the original constructor, but if you pass an object as source, then the **F** will be a generated function which calls the constructor of the passed object. This is because the core javascript works the same way, you can use an object as prototype of many different functions...

### Multiple inheritance

You can achieve multiple inheritance by using the `mixin(Mixin ancestor1, Mixin ancestor2, ...)` function. The ancestor parameters can be `Mixin` instances or `source`s to create `Mixin` instances.

	var A1 = new Mixin({a:1});
	var A2 = function (){};
	A2.prototype = {b:2};
	var A3 = {c:3};

	var m = new Mixin();
	m.mixin(A1, A2, A3);
	var F = m.toFunction();
	var instance = new F();
	console.log(instance); //{a:1, b:2, c:3}

The multiple inheritance always copies properties or constructors, so the posterior modifications of the sources won't affect the descendant.

#### With properties

	var A = new Mixin();
	var m = new Mixin();
	A.mixin({a:1});
	m.mixin(A);
	A.mixin({b:2});

	console.log(m.toObject()); //{a:1}, the b property is not affected
	console.log(A.toObject()); //{a:1, b:2}

#### Or with constructors

	var A1 = function (){
		this.a = 1;
	};
	var A2 = {
		constructor: function (){
			this.b = 2;
		}
	};
	var m = new Mixin({
		constructor: function (){
			this.m = 3;
		}
	});
	m.mixin(A1, A2);
	A2.constructor = function (){
		this.b = 2;
		this.c = 3;
	};
	var F = m.toFunction();
	var i = new F();
	console.log(i); //{a:1, b:2, m:3}, c is not affected by the posterior change

It is important that your cannot use constructor inheritance if your descendant `Mixin` uses a function or a prototype as source.

	var id = 0;
	var m = new Mixin(Object.prototype);
	m.mixin({ //throw Error - you cannot extend Object constructor with a unique id generator, sorry
		constructor: function (){
			this.id = ++id;
		}
	});

or

	var m = new Mixin(function (){this.a = 1});
	m.mixin({ //throw Error
		constructor: function (){this.b = 2}
	});

This will fail because the **F** in here was given with the source parameter, so it cannot be overridden by a generated function.

### Prototypal inheritance

You can achieve prototypal inheritance by using the `extend()` function. By multiple inheritance the **F** is always generated and the **o** is inherited.

	var A = new Mixin(function (){
		this.a = 1;
	});
	var D = A.extend();
	D.mixin({
		constructor: function (){
			this.b = 2;
		}
	});
	var F = D.toFunction();
	var i = new F();
	console.log(i); // {a:1, b:2}

Of course you can use combined prototypal and multiple inheritance in a short way:

	var A = new Mixin(function (){
		this.a = 1;
	});
	var D = A.extend({
		constructor: function (){
			this.b = 2;
		}
	});
	var F = D.toFunction();
	var i = new F();
	console.log(i); // {a:1, b:2}

By prototypal inheritance the original constructor is always inherited, you cannot override it. If you want to override the original constructor, you have to trick.


    var A = new Mixin(function (){
        this.a = 1;
    });
    var d = Object.create(A.toFunction());
    d.constructor = function (){
        this.b = 2;
    };
    var D = new Mixin(d);
    var F = D.toFunction();
    var i = new F();
    console.log(i); // {b:2}

This is because we usually use inheritance to add a new feature, not to remove an old feature. This is a constraint you can live with I think.

By prototypal inheritance, the posterior changes of the ancestor will affect the descendant.

    var A = new Mixin({
        constructor: function (){
            this.a = 1;
        }
    });
    var D = A.extend({
        constructor: function (){
            this.b = 2;
        }
    });
    A.mixin({
        constructor: function (){
            this.c = 3;
        }
    });
    var F = D.toFunction();
    var i = new F();
    console.log(i); // {a:1, c:3, b:2}

Be aware that always the constructors of the ancestor *(a,c)* run at first and the constructors of the descendant *(b)* run at second.

### Extensions

You can use 2 extensions to forget the instantiation of `Mixin`. You can enable extensions the way I wrote by the *Configuration* section.

#### Function.prototype extension

This extension extends the `Function.prototype` with 3 additional functions:

    Function mixin(ancestor1, ancestor2, ...) - multiple inheritance
    Function extend(ancestor1, ancestor2, ...) - prototypal inheritance
    Object toObject() - returns the prototype

Example usage:

    var A = Object.extend({
        constructor: function (){
            this.a = 1;
        }
    });
    var I = {
        constructor: function (){
            this.i = 2;
        }
    };

    var D = A.extend(
        I,
        {
            constructor: function (){
                this.d = 3;
            }
        }
    );

    var a = new A();
    console.log(a); //{a:1}
    var d = new D();
    console.log(d); //{a:1, i:2, d:3}


#### Object.prototype extension

This extension extends the `Object.prototype` with 3 additional functions:

    Object mixin(ancestor1, ancestor2, ...) - multiple inheritance
    Object extend(ancestor1, ancestor2, ...) - prototypal inheritance
    Function toFunction() - returns the original constructor by prototypes or the generated constructor by objects

Example usage:

    var oA = {
        constructor: function (){
            this.a = 1;
        }
    };

    var I = {
        constructor: function (){
            this.i = 2;
        }
    };

    var oD = oA.extend(
        I,
        {
            constructor: function (){
                this.d = 3;
            }
        }
    );

    var A = oA.toFunction();
    var D = oD.toFunction();

    var a = new A();
    console.log(a); //{a:1}
    var d = new D();
    console.log(d); //{a:1, i:2, d:3}

Of course your can combine the 2 extensions if you want. Usually the `Function.prototype` extension is more than enough, and nobody will like you if you override the `Object.prototype`.

## Contribution

If you want to contribute, you can send a pull request about the following topics:

- standalone version
- nodejs version
- minified version
- browser specific fix

I have to create a build environment to make those different versions, but I usually don't have time for this kind of stuff.

## Issues

If you have found a bug, or you have an enhancement idea, please don't hesitate, [write it to me](https://github.com/inf3rno/mixin.js/issues).