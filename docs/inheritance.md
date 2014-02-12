# API Documentation

## The Inheritance function and the Wrapper class

This section describes the basic usage of the `Inheritance()` module.

### Instantiation

You can use the `Inheritance()` function to create new `Inheritance` instances.

	var wrapper = Inheritance(source);
	var wrapper2 = new Inheritance(source2);

The `source` can be an instance of `Object`, `Function` or `null` or `undefined`.

    var wrapper = new Inheritance();
    var wrapper2 = new Inheritance({a: 1});
    var wrapper3 = new Inheritance(function (){});
    // etc...

The `Inheritance` functions are always working on a `constructor`.
You can use the `toFunction()` to get the `constructor` and the `toObject()` to get its `prototype`.

    var func = function (){};
    var wrapper = new Inheritance(func);
    console.assert(func === wrapper.toFunction(), "The toFunction() should return the constructor.");
    console.assert(func.prototype === wrapper.toObject(), "The toObject() should return the prototype.");

If you pass a `prototype` then `Inheritance()` will find its `constructor`.

    var func = function (){};
    var wrapper = new Inheritance(func.prototype);
    console.assert(func === wrapper.toFunction(), "Inheritance(prototype) should find the constructor of the prototype.");

If you pass a regular `object` (not a `prototype`) to the `Inheritance()`, then it will generate a `constructor` for it. After that the `object` will be a `prototype`.

    var object = {a: 1};
    var wrapper = new Inheritance(object);
    var func = wrapper.toFunction();
    console.assert(object.constructor === func);
    console.assert(func.prototype === object);

Ofc. you can use not just object literals, `constructor` generation works by any objects... So you can combine `Inheritance` with libs using any other inheritance approaches.

    var ancestor = function (){};
        ancestor.prototype = {a: 1};
    var object = new Ancestor();
    var func = Inheritance(object).toFunction();
    var instance = new func();
    console.assert(instance.a === ancestor.prototype.a, "Custom prototypal inheritance approach should work.");

If you set an `initialize()` function on the `object` you pass, then the newly generated `constructor` will call it by instantiation.

    var object = {
        initialize: function (){
            console.log("Created a new instance.");
        }
    };
    var wrapper = new Inheritance(object);
    var func = wrapper.toFunction();
    console.assert(func !== object.initialize, "The constructor and the initialize should not be the same.");
    var instance = new func(); //console: "Created a new instance." (the constructor called the initialize)

### Multiple inheritance

You can achieve multiple inheritance by using the `mixin()` function. The ancestor parameters can be `Inheritance` instances or `source`s which can be used by `Inheritance()`.

	var Ancestor1 = new Inheritance({a: 1});
	var Ancestor2 = function (){
	    console.log("Created new instance.");
	};
	Ancestor2.prototype = {b: 2};
	var Ancestor3 = {c: 3};

	var wrapper = new Inheritance();
	wrapper.mixin(Ancestor1, Ancestor2, Ancestor3);
	var Descendant = wrapper.toFunction();
	var instance = new Descendant(); //console: "Created a new instance."
	console.log(instance); //{initialize: Ancestor2, a: 1, b: 2, c: 3}

The multiple inheritance always copies the values, so the posterior modifications of the sources won't affect the descendant.

	var ancestor = new Inheritance({a: 1});
	var descendant = new Inheritance();
	descendant.mixin(ancestor);
	ancestor.mixin({b: 2});

	console.log(ancestor.toObject()); //{a: 1, b: 2}
	console.log(descendant.toObject()); //{a: 1}, the b property is not affected

Ofc. this value copy has no effect on complex cases for example like the following.

    var object = {x: 0};
	var ancestor = new Inheritance(Object.create(object));
	ancestor.mixin({a: 1});
	var descendant = new Inheritance();
	descendant.mixin(ancestor);
	ancestor.mixin({b: 2});
	object.y = -1;

    console.log(object); //{x: 0, y: -1}
	console.log(ancestor.toObject()); //{x: 0, y: -1, a: 1, b: 2}
	console.log(descendant.toObject()); //{x: 0, y: -1, a: 1}, the y property is affected

It is not recommended by any language to modify ancestor classes latter, because you won't know where you break the code. So do it gently if you don't have other options.

### Prototypal inheritance

You can achieve prototypal inheritance by using the `extend()` function. This will create a source with `Object.create()` and generate a new `constructor` for that.

	var ancestor = new Inheritance(function (){
		console.log("Created a new instance.");
	});
	var descendant = ancestor.extend();
	var Descendant = descendant.toFunction();
	var instance = new Descendant(); //console: "Created a new instance."

If the `constructor` of the ancestor is native, then by default the `extend()` set it as `initialize`. Ofc you can override that `constructor` any time.

By prototypal inheritance, the posterior changes of the ancestor will affect the descendant.

    var ancestor = new Inheritance({
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

	var ancestor = new Inheritance(function (){
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
    var Ancestor2 = Inheritance({
        initialize: function (){
            this.b = 2;
        }
    }).toFunction();
    var Ancestor3 = Inheritance({
        initialize: function (){
            this.c = 3;
        }
    }).toFunction();
    var Ancestor4 = Inheritance({}).toFunction();
    var descendant = Inheritance(Ancestor1).extend(
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

    var grandma = Inheritance();
    var grandpa = Inheritance();
    var mother = grandma.extend(grandpa);
    var father = Inheritance();
    var son = father.extend(mother);
    var daughter = mother.extend(father);

The `Inheritance.hasAncestors(source 1, source 2, ...)` returns `true` when the actual `Inheritance` has every `source` amongst its ancestors.

    console.assert(mother.hasAncestor(grandma, grandpa), "The mother should recognize her parents.");
    console.assert(son.hasAncestors(mother, father), "The son should recognize his parents.");
    console.assert(son.hasAncestors(grandma, grandpa), "The son should recognize his grandparents.");

The `Inheritance.hasDescendants(source 1, source 2, ...)` returns `true` when the actual `Inheritance` has every `source` amongst its descendants.

    console.assert(mother.hasDescendants(son, daughter), "The mother should recognize her children.");
    console.assert(grandma.hasDescendants(mother), "The grandma should recognize her daughter.");
    console.assert(!grandma.hasDescendants(father), "The grandma should not recognize the husband of her daughter.");
    console.assert(grandma.hasDescendants(son, daughter), "The grandma should recognize his grandchildren.");

The `Inheritance.hasInstance(instance)` returns `true` when the actual `Inheritance` contains the `constructor` the `instance` or contains one of the ancestors of the `constructor` of the `instance`.

    var Son = son.toFunction();
    var me = new Son();
    console.assert(son.hasInstance(me), "The collective of sons should recognize that I am a member of it.");
    console.assert(grandma.hasInstance(me), "The collective of grandmas should recognize that I am one of the grandsons.");
