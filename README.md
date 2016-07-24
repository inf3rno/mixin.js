# Ozone - Javascript Class Framework

[![Build Status](https://travis-ci.org/inf3rno/o3.png?branch=master)](https://travis-ci.org/inf3rno/o3)

The Ozone class framework contains enhanced class support and error handling to ease the development of object-oriented javascript applications in an ES5 environment.
Another alternative to get a better class support to use ES6 classes and compilers like Babel, Traceur or TypeScript until native ES6 support arrives.

## Documentation

### Installation

```bash
npm install o3
```

```bash
bower install o3
```

#### Requirements

An ES5 capable environment is required with

- `Object.create`
- ES5 compatible property enumeration: `Object.defineProperty`, `Object.getOwnPropertyDescriptor`, `Object.prototype.hasOwnProperty`, etc.
- `Array.prototype.forEach`

#### Testing

I used [Yadda](https://github.com/acuminous/yadda) to write BDD tests.

### Usage

In this documentation I used the framework as follows:

```js
var o3 = require("o3),
    Class = o3.Class,
    noop = o3.noop,
    UserError = o3.UserError,
    CompositeError = o3.CompositeError;
```

### Inheritance

#### Inheriting from native classes (Error in these examples)

You can extend native classes by calling the Class() function.

```js
var UserError = Class(Error, {
    prototype: {
        message: "blah",
        constructor: function UserError() {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}); 
```

An alternative to call Class.extend() with the Ancestor as the context. The Class() function uses this in the background.

```js
var UserError = Class.extend.call(Error, {
    prototype: {
        message: "blah",
        constructor: function UserError() {
            Error.captureStackTrace(this, this.constructor);
        }
    }
});
```

#### Inheriting from custom classes

You can use Class.extend() by any other class, not just by native classes.

```js
var Ancestor = Class(Object, {
    prototype: {
        a: 1,
        b: 2
    }
});

var Descendant = Class.extend.call(Ancestor, {
    prototype: {
        c: 3
    }
});
```

Or you can simply add it as a static method, so you don't have to pass context any time you want to use it. The only drawback, that this static method will be inherited as well.

```js
var Ancestor = Class(Object, {
    extend: Class.extend,
    prototype: {
        a: 1,
        b: 2
    }
});

var Descendant = Ancestor.extend({
    prototype: {
        c: 3
    }
});
```

#### Inheriting from the Class class

You can inherit the extend() method and other utility methods from the Class class. Probably this is the simplest solution if you need the Class API and you don't need to inherit from special native classes like Error. 

```js
var Ancestor = Class.extend({
    prototype: {
        a: 1,
        b: 2
    }
});

var Descendant = Ancestor.extend({
    prototype: {
        c: 3
    }
});
```

#### Inheritance with clone and merge

The static extend() method uses the clone() and merge() utility methods to inherit from the ancestor and add properties from the config.

```js
var MyClass = Class.clone.call(Object, function MyClass(){
    // ...
});
Class.merge.call(MyClass, {
    prototype: {
        x: 1, 
        y: 2
    }
});
```

Or with utility methods.

```js
var MyClass = Class.clone(function MyClass() {
    // ...
}).merge({
    prototype: {
        x: 1,
        y: 2
    }
});
```

### Constructors

#### Using a custom constructor

You can pass your custom constructor as a config option by creating the class.

```js
var MyClass = Class(Object, {
    prototype: {
        constructor: function () {
            // ...
        }
    }
});
```

#### Using a custom factory to create the constructor

Or you can pass a static factory method to create your custom constructor.

```js
var MyClass = Class(Object, {
    factory: function () {
        return function () {
            // ...
        }
    }
});
```

#### Using an inherited factory to create the constructor

By inheritance the constructors of the descendant classes will be automatically created as well.

```js
var Ancestor = Class(Object, {
    factory: function () {
        return function () {
            // ...
        }
    }
});
var Descendant = Class(Ancestor, {});
```

#### Using the default factory to create the constructor

You don't need to pass anything if you need a noop function as constructor. The Class.factory() will create a noop constructor by default.

```js
var MyClass = Class(Object, {});
```

In fact you don't need to pass any arguments to the Class function if you need an empty class inheriting from the Object native class.

```js
var MyClass = Class();
```

### Instantiation

#### Creating new instance with the new operator

Ofc. you can create a new instance in the javascript way.

```js
var MyClass = Class();
var my = new MyClass();
```

#### Creating new instance with clone

You can create a new instance by cloning the prototype of the class.

```js
var MyClass = Class();
var my = Class.prototype.clone.call(MyClass.prototype);
```

Or you can inherit the utility methods to make this easier.

```js
var MyClass = Class.extend();
var my = MyClass.prototype.clone();
```

#### Cloning instances

You can clone an existing instance with the clone method.

```js
var MyClass = Class.extend();
var my = MyClass.prototype.clone();
var my2 = my.clone();
```

Be aware that this is prototypal inheritance with Object.create(), so the inherited properties won't be enumerable.

#### Using clone in the constructor

You can use the same behavior both by cloning and by creating a new instance using the constructor

```js
var MyClass = Class.extend({
    lastIndex: 0,
    prototype: {
        index: undefined,
        constructor: function MyClass() {
            return MyClass.prototype.clone();
        },
        clone: function () {
            var instance = Class.prototype.clone.call(this);
            instance.index = ++MyClass.lastIndex;
            return instance;
        }
    }
});

var my1 = new MyClass();
var my2 = MyClass.prototype.clone();
var my3 = my1.clone();
var my4 = my2.clone();
```

Be aware that this way the constructor will drop the instance created with the `new` operator.

Be aware that the clone() method is used by inheritance, so creating the prototype of a descendant class will use the clone() method as well.

```js
var Descendant = MyClass.clone(function Descendant() {
    return Descendant.prototype.clone();
});

var my5 = Descendant.prototype;
var my6 = new Descendant();
// ...
```

### Errors

#### Creating custom errors

You can create custom Error sub-classes by extending the UserError class.

```js
var MyError = UserError.extend({
    prototype: {
        name: "MyError"
    }
});

try {
    throw new MyError("problem");
}
catch (theProblem) {
    if (!(theProblem instanceof MyError))
        throw theProblem;
    console.log(theProblem);
        // MyError: problem
    console.log(theProblem.stack);
        // MyError: problem
            // at (example.js:2:16)
            // at ...
            // ...
}
```

#### Creating composite errors

You can create composite errors by the usage of the CompositeError class if you want to report about complex problems, which can only be described by a hierarchy of error objects.

```js
var MyCompositeError = CompositeError.extend({
    prototype: {
        name: "MyCompositeError"
    }
});

try {
    try {
        throw new MyError("problem");
    }
    catch (theProblem) {
        throw new MyCompositeError({
            message: "complex problem",
            theSource: theProblem
        })
    }
}
catch (theComplexProblem) {
    console.log(theComplexProblem.stack);
        // MyCompositeError: complex problem
            // at (example.js:5:32)
            // at ...
            // ...
        // caused by <theSource> MyError: problem
            // at (example.js:2:16)
            // at ...
            // ...
}
```

The CompositeError can be a great help for example by nested validation errors or by reporting about multiple parallel async failures.

## License

MIT - 2015 Jánszky László Lajos