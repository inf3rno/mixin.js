var Class = require("../Class"),
    NativeStack = require("./stack/NativeStack");

var NativeError = Class(Error, {
    factory: Class.factory,
    Stack: NativeStack,
    prototype: {
        name: "NativeError",
        init: function (error) {
            Object.defineProperties(this, {
                stack: {
                    enumerable: false,
                    configurable: false,
                    value: new this.constructor.Stack(error)
                }
            });
        }
    }
});

module.exports = NativeError;