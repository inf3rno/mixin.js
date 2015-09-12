# inheritancejs - Javascript Class Framework

[![Build Status](https://travis-ci.org/inf3rno/inheritancejs.png?branch=master)](https://travis-ci.org/inf3rno/inheritancejs)

This small lib contains prototypal inheritance support for javascript applications.

Ofc. I'd rather use ES6, but until that becomes widely supported, this library will be just enough for programming object-oriented javascript...
Other possible solution to use a compiled javascript relative like TypeScript, Babel or Traceur, which has ES6 class support.

## Documentation

No real documentation yet.

*A detailed documentation will be available on GitHub Pages by version 1.0. Until then only a few examples are available in the current md file.*

### Installation

Only node.js is supported yet.

*I'll add browserify support and karma tests by 1.0*

#### Package managers

You can install the lib from npm and bower:

```bash
npm install inheritancejs
```

```bash
bower install inheritancejs
```

#### Manual installation

You should add the parent lib to NODE_PATH by manual installation (copy-paste).

```bash
export NODE_PATH=../
# you should add the parent directory to NODE_PATH to support require("inheritancejs") by a local copy
# another possible solutions are npm link and symlink
```

#### Requirements

##### Environment requirements

An ES5 capable environment is required at least with

- `Object.create`
- `Object.defineProperty`
- `Object.getOwnPropertyDescriptor`
- `Object.prototype.hasOwnProperty`
- `Array.prototype.forEach`

The environment tests are available under the `/spec/environment.spec.js` file.

##### Module dependencies

It requires `events.EventEmitter` for watching property changes.

*By environments supporting `Object.observe`, the `events.EventEmitter` won't be needed.*

### Examples

#### 1. inheritance, instantiation, configuration, cloning, unique id, watch, unwatch
```js
var Cat = ih.Base.extend({
    name: undefined,
    configure: function () {
        if (typeof(this.name) != "string")
            throw new ih.InvalidConfiguration("Invalid cat name.");
        ++Cat.counter;
    },
    meow: function () {
        console.log(this.name + ": meow");
    }
}, {
    counter: 0,
    count: function () {
        return this.counter;
    }
});
```

```js
var kitty = new Cat({name: "Kitty"});
var killer = new Cat({name: "Killer"});

kitty.meow(); // Kitty: meow
killer.meow(); // Killer: meow

console.log(Cat.count()); // 2
```

```js
kitty.merge(
    configure: function (postfix) {
        this.name += " " + postfix;
    }
);
kitty.configure("Cat");
kitty.meow(); // Kitty Cat: meow

kitty.configure("from London");
kitty.meow(); // Kitty Cat from London: meow
```

```js
var kittyClone = clone(kitty);
kittyClone.meow(); // Kitty Cat from London: meow
```

```js
var id1 = ih.id();
var id2 = ih.id();

console.log(id1 != id2); // true
```

```js
var o = {x:0};

ih.watch(o, "x", console.log);
o.x = 1; // 1 0 x {x:1}
o.x = 2; // 2 1 x {x:2}

ih.unwatch(o, "x", log);
o.x = 3; // not logged
o.x = 4; // not logged
```

#### 2. wrapper, custom errors, plugins, hashSet

```js
var o = {
    m: function (a, b, c){
        console.log("processing", a, b, c);
        return [a, b, c];
    }
};
o.m = new ih.Wrapper({
    algorithm: Wrapper.algorithm.cascade,
    preprocessors: [
        function (a, b, c) {
            console.log("reversing", a, b, c);
            return [c, b, a];
        }
    ],
    done: o.m
}).toFunction();
console.log("results", o.m(1, 2, 3))
// reversing [1, 2, 3]
// processing [3, 2, 1]
// results [3, 2, 1]
```

```js
var CustomError = ih.UserError.extend({
    name: "CustomError"
});
var CustomErrorSubType = CustomError.extend({
    message: "Something really bad happened."
});
var AnotherSubType = CustomError.extend();

var err = new CustomErrorSubType();

// all true
console.log(
    err instanceof CustomErrorSubType,
    err instanceof CustomError,
    err instanceof ih.UserError,
    err instanceof Error
);

// all false
console.log(
    err instanceof AnotherSubType,
    err instanceof SyntaxError
);
```

```js
  console.log(err.toString());
  // CustomError Something really bad happened.

  console.log(err.stack);
  // prints the stack, something like:
  /*
      CustomError Something really bad happened.
          at null.<anonymous> (/README.md:71:11)
          ...
  */

```

```js
try {
    throw err;
} catch (err) {

}
```

```js
try {
    try {
        throw new ih.UserError("Something really bad happened.");
    }
    catch (cause) {
        throw new ih.CompositeError({
            message: "Something really bad caused this.",
            myCause: cause
        });
    }
catch (err) {
    console.log(err.toString());
    // CompositeError Something really bad caused this.

    console.log(err.stack);
    // prints the stack, something like:
    /*
        CompositeError Something really bad caused this.
            at null.<anonymous> (/README.md:71:11)
            ...
        caused by <myCause> UserError Something really bad happened.
            at null.<anonymous> (/README.md:68:9)
            ...
    */
}
```

```js
var plugin = new ih.Plugin({
    test: function () {
        throw new Error();
    },
    setup: function () {
        console.log("Installing plugin.");
    }
});

if (plugin.compatible())
    plugin.install(); // won't install because of failing test

console.log(plugin.installed); // false
```

```js
var dependency = require("dependency");
var plugin = new ih.Plugin({
    // ...
});
plugin.dependency(dependency);
plugin.install(); // installs dependency before setup
```

```js
var o = new ih.Base(),
    o2 = new ih.Base(),
    o3 = new ih.Base();
var hashSet = new ih.HashSet();

hashSet.addAll(o, o2, o3);
console.log(hashSet.containsAll(o, o2, o3)); // true

hashSet.remove(o2);
console.log(hashSet.containsAll(o, o2, o3)); // false
console.log(hashSet.containsAll(o, o3)); // true
console.log(hashSet.contains(o2)); // false

for (var id in hashSet.items)
    console.log(hashSet.items[id]); // o, o2, o3

var items = hashSet.toArray();
for (var index in items)
    console.log(items[index]); // o, o2, o3
```

### Integration

#### Testing

I test with [Jasmine](https://github.com/jasmine/jasmine) 2.2.

By node.js 0.10.36 I used [jasmine-npm](https://github.com/jasmine/jasmine-npm) 2.2.0.

*By browsers I will use [karma](https://github.com/karma-runner/karma) x.x.x & [karma-jasmine](https://github.com/karma-runner/karma-jasmine) x.x.x.
Browser tests will be available by 1.0

#### Code completion

No code completion support yet.

*[WebStorm](https://www.jetbrains.com/webstorm/) support will be available by 1.1.
Probably other IDEs and editors will be supported as well.*


## License

MIT - 2015 Jánszky László Lajos