# API Documentation

Welcome to the documentation of *inheritance.js*!

This small library contains prototypal inheritance and multiple inheritance support for javascript applications.

It is recommended to use *ES6* instead of this, if it is [supported](http://kangax.github.io/es5-compat-table/es6/) on your target platform.

## Directory structure

Currently there are multiple files in this library, each for different purpose. You can find them in the `src/` directory.

 - src/
    - [polyfill.js](polyfill/index.md) - This file contains the javascript core requirements of the library for the case they are not implemented.
    - ${packageType}/ - Each of the package types (*AMD*, *commonJS*, *standalone*) have different sub-folders.
        - [inheritance.js](inheritance/index.md) - This file contains the core of the library, multiple inheritance, prototypal inheritance and all of the related stuff.
        - [extensions/](extensions/index.md) - This folder contains several adapters for different environments and frameworks.
            - [inheritance-decorator.js](extensions/inheritance-decorator/index.md) - This file contains the base class of prototype decorator extensions.
            - [inheritance-function.js](extensions/inheritance-function/index.md) - This file contains the `Function.prototype` decorator extension.
            - [inheritance-object.js](extensions/inheritance-object/index.md) - This file contains the `Object.prototype` decorator extension.

