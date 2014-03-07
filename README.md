# inheritance.js - 1.2.0

This small lib contains prototypal inheritance and multiple inheritance support for javascript applications.

Ofc. I'd rather use ES6, but until [that become more widely supported](http://kangax.github.io/es5-compat-table/es6/), this library will be just enough for programming javascript object-oriented...

## Requirements

To use the core library you'll need `Object.create` and `WeakMap`.
You can find the required part of these features in the [polyfill.js](docs/polyfill/index.md).

**That file contains only what was necessary to create this library, so please don't use it for other purposes! It won't work.**

## Installation

**Currently only *AMD* modules are available (tested with *require.js* only), but that will change soon.**

### Enhancements coming

I intend to support the following

platforms

 - browsers (Internet Explorer, Firefox, Chrome, Opera)
 - nodeJS

package formats

 - standalone (for `srcipt src`)
 - commonJS
 - AMD

component manager systems

 - npm
 - bower
 - component
 - jam

## Unit tests

I tested the library in a [*karma*](https://github.com/karma-runner) environment on [*Firefox*](http://www.mozilla.org/en-US/firefox/new/) with [*jasmine*](https://github.com/pivotal/jasmine).

I developed the library using [TDD](http://en.wikipedia.org/wiki/Test-driven_development), so the [coverage](http://en.wikipedia.org/wiki/Code_coverage) should be about 100%, but I have not checked yet...

## Example usage

The core module exports a [`wrap()`](docs/inheritance/index.md#wrap) function,
which uses the [`factory`](docs/inheritance/index.md#factory) in order to create [`Wrapper`](docs/inheritance/index.md#Wrapper) instances.
The `Wrapper` instances can manipulate the `prototype` of `constructor` functions.

**I recommend you to create your own extension using [`Wrapper`](docs/inheritance/Wrapper.md) instances returned by the [`wrap()`](docs/inheritance/wrap.md) function, so you can use inheritance in your own style.
I have already created a [`Function.prototype` extension](https://github.com/inf3rno/inheritancejs-function) and an [`Object.prototype` extension](https://github.com/inf3rno/inheritancejs-object).
Both are derived from a base [`Extension`](https://github.com/inf3rno/inheritancejs-extension) class.**

You can use the `Wrapper` instances the following way.

```js
    var GrandFather = wrap({
        age: 80,
        initialize: function (){
            this.canRepairCar = true;
        }
    }).toFunction();

    var GrandMother = wrap(function (){
        this.canMakeCookies = true;
    }).mixin({
        age: 75
    }).toFunction();

    var Mother = wrap(GrandMother).extend(GrandFather, {
        age: 45,
        initialize: function (){
            GrandMother.call(this);
            GrandFather.call(this);
            this.canRideHorse = true;
        }
    }).toFunction();

    var fatherProto = {
        age: 50,
        initialize: function (){
            this.canPaintWall = true;
        }
    };

    var Son = wrap(Mother).extend(
        fatherProto,
        {
            age: 25,
            initialize: function (){
                Mother.call(this);
                fatherProto.constructor.call(this);
                this.canSkate = true;
            }
        }
    ).toFunction();

    var myGrany = new GrandMother();
    console.log(myGrany); //{age: 75, canMakeCookies: true}

    var me = new Son();
    console.log(me); //{age: 25, canRepairCar: true, canMakeCookies: true, canRideHorse: true, canPaintWall: true}

    console.assert(wrap(Son).hasInstance(me));
    console.assert(wrap(GrandMother).hasInstance(me));

    console.assert(wrap(Son).hasAncestor(GrandFather));
    console.assert(wrap(Son).hasAncestor(fatherProto));

    console.assert(wrap(GrandFather).hasDescendant(Mother));
    console.assert(!wrap(GrandMother).hasDescendant(fatherProto));
```

## Documentation

The following sections are available in the documentation.

 - [API Documentation](docs/index.md)
    - [polyfill.js](docs/polyfill/index.md)
    - [inheritance.js](docs/inheritance/index.md)

## Contribution

If you have found a bug, or you have an enhancement idea, please don't hesitate, [write it to me](https://github.com/inf3rno/inheritancejs/issues), or send a pull request.

## License

The MIT License (MIT)

Copyright (c) 2014 Jánszky László Lajos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.