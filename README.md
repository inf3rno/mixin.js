# Ozone - Javascript Class Framework

[![Build Status](https://travis-ci.org/inf3rno/o3.png?branch=master)](https://travis-ci.org/inf3rno/o3)

This small lib contains prototypal inheritance support for javascript applications.

Ofc. I'd rather use ES6, but until that becomes widely supported, this library will be just enough for programming object-oriented javascript...
Other possible solution to use a compiled javascript relative like TypeScript, Babel or Traceur, which has ES6 class support.

### Examples

#### classes, inheritance, mixin (o3.Class, o3.extend, o3.clone, o3.merge)
```js
var Cat = o3.Class.extend({
    name: undefined,
    build: function (){
        ++Cat.counter;
    },
    init: function (config) {
        this.merge(config);
        if (typeof(this.name) != "string")
            throw new o3.InvalidConfiguration("Invalid cat name.");
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
var kittyClone = clone(kitty);
kittyClone.meow(); // Kitty: meow

console.log(Cat.count()); // 3
console.log(kittyClone === kitty); // false
```

#### watch object property changes (o3.watch, o3.unwatch)

```js
var o = {x:0};

o3.watch(o, "x", console.log);
o.x = 1; // 1 0 x {x:1}
o.x = 2; // 2 1 x {x:2}

o3.unwatch(o, "x", console.log);
o.x = 3; // not logged
o.x = 4; // not logged
```

#### function wrapper (o3.Wrapper, o3.Wrapper.algorithm)

```js
var o = {
    m: function (a, b, c){
        console.log("processing", a, b, c);
        return [a, b, c];
    }
};
o.m = new o3.Wrapper({
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


#### custom errors (o3.UserError, o3.CompositeError)

```js
var CustomError = o3.UserError.extend({
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
    err instanceof o3.UserError,
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
    try {
        throw new o3.UserError("Something really bad happened.");
    }
    catch (cause) {
        throw new o3.CompositeError({
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

## Documentation

No documentation available yet.

*A detailed documentation will be available on GitHub Pages by version 1.0.*

### Installation

Only node.js is supported yet.

*I'll add browserify support and karma tests by 1.0*

#### Package managers

You can install the lib from npm and bower:

```bash
npm install o3
```

```bash
bower install o3
```

#### Manual installation

Just copy paste the directory to the `node_modules` or user browserify on the `index.js` if you want to use it in a browser.
You can override the `module.exports`` part and put the whole code in a closure if you want to use it as an AMD style module or vanilla.js.

#### Requirements

##### Environment requirements

An ES5 capable environment is required at least with

- `Object.create`
- `Object.defineProperty`
- `Object.getOwnPropertyDescriptor`
- `Object.prototype.hasOwnProperty`
- `Array.prototype.forEach // for the tests`

The environment tests are available under the `/spec/environment.spec.js` file.

##### Module dependencies

It requires `events.EventEmitter` for watching property changes.
If you have an environment, which supports `Object.observe`, you won't need this framework.

### Integration

#### Testing

I test with [Jasmine](https://github.com/jasmine/jasmine) 2.2.

By node.js 0.10.36 I used [jasmine-npm](https://github.com/jasmine/jasmine-npm) 2.2.0.

*By browsers I will use [karma](https://github.com/karma-runner/karma) x.x.x & [karma-jasmine](https://github.com/karma-runner/karma-jasmine) x.x.x.
Browser tests will be available by 1.0.*

You must be able to `require("o3")` if you want to run the tests.
If you install the framework with `npm install` then this is not an issue.

If you have installed it manually, than you have the following options.

1. You can set the environment variable `NODE_PATH` to `../` if you use WebStorm,
or you can do it from the terminal before running the tests.

    ```bash
    cd o3
    export NODE_PATH=../
    npm run test
    ```

    Adding the parent folder to the environment variable is like putting the directory into the `node_modules`.
    The directory name must be `o3`, because it is loaded based on that (the name in the `package.json` does not matter in this case).

2. You can use `npm link`.
3. You can use `symlink`.

I never tried out the latter ones, but according to many articles they work.

#### Code completion

No code completion support yet.

*[WebStorm](https://www.jetbrains.com/webstorm/) support will be available by 1.1.
Probably other IDEs and editors will be supported as well.*


## License

MIT - 2015 Jánszky László Lajos