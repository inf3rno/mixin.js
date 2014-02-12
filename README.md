# inheritance.js - 1.1.1

This small lib contains prototypal inheritance and multiple inheritance support for javascript applications.

## Installation

Currently only **AMD** packed files are available for **require.js**, but that will change soon.

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

I tested the library in a `karma` environment on **Firefox** with `jasmine`.

I developed the library using TDD, so the coverage must be about 100%, but I have not checked yet...

## Example usage

With the `Function.prototype` adapter:

```js
    var GrandFather = Object.extend({
        age: 80,
        initialize: function (){
            this.canRepairCar = true;
        }
    });
    var GrandMother = function (){
        this.canMakeCookies = true;
    }.mixin({
        age: 75
    });
    var Mother = GrandMother.extend(GrandFather, {
        age: 45,
        initialize: function (){
            GrandMother.call(this);
            GrandFather.call(this);
            this.canRideHorse = true;
        }
    });
    var fatherProto = {
        age: 50,
        initialize: function (){
            this.canPaintWall = true;
        }
    };

    var Son = Mother.extend(
        fatherProto,
        {
            age: 25,
            initialize: function (){
                Mother.call(this);
                fatherProto.constructor.call(this);
                this.canSkate = true;
            }
        }
    );

    var myGrany = new GrandMother();
    console.log(myGrany); //{age: 75, canMakeCookies: true}

    var me = new Son();
    console.log(me); //{age: 25, canRepairCar: true, canMakeCookies: true, canRideHorse: true, canPaintWall: true}

    console.assert(Son.hasInstance(me));
    console.assert(GrandMother.hasInstance(me));

    console.assert(Son.hasAncestor(GrandFather));
    console.assert(Son.hasAncestor(fatherProto));

    console.assert(GrandFather.hasDescendant(Mother));
    console.assert(!GrandMother.hasDescendant(fatherProto));
```

You can use the core `Wrapper` in a similar way.

```js
    var GrandFather = Inheritance(Object).extend({
        age: 80,
        initialize: function (){
            this.canRepairCar = true;
        }
    }).toFunction();

    var GrandMother = Inheritance(function (){
        this.canMakeCookies = true;
    }).mixin({
        age: 75
    }).toFunction();
```

If you want to use a `Wrapper` function, you have to call the `Inheritance()` before. The arguments of the `Wrapper` functions are automatically wrapped.

## Documentation

The following sections are available in the documentation.

 - [The Inheritance function and the Wrapper class](docs/inheritance.md)
 - [Inheritance Extensions](docs/extension.md)
 - Available Extensions
    - [`Function.prototype` adapter](docs/extensions/function.md)
    - [`Object.prototype` adapter](docs/extensions/object.md)

## Contribution

If you have found a bug, or you have an enhancement idea, please don't hesitate, [write it to me](https://github.com/inf3rno/inheritance.js/issues).

## License

Inheritance.js is licensed under the [WTFPL](http://www.wtfpl.net/) license... ;-)