var Class = require("./Class"),
    ErrorAdapter = require("./ErrorAdapter");

var UserError = Class(Error, {
    factory: Class.factory,
    prototype: {
        name: "UserError",
        errorAdapter: new ErrorAdapter.StackFrameExtractor(),
        build: function () {
            var errorAdapter = this.errorAdapter;
            this.frames = errorAdapter.getFramesBefore(this.frames ? this.clone : this.constructor);
            Object.defineProperties(this, {
                stack: {
                    enumerable: false,
                    configurable: false,
                    get: this.framesToStack.bind(this)
                }
            });
        },
        init: function (config) {
            if (typeof (config) == "string")
                config = {message: config};
            this.merge(config);
        },
        framesToStack: function () {
            var stack = "";
            stack += this.name;
            stack += ": " + this.message;
            this.frames.forEach(function (frame) {
                stack += "\n at " + frame;
            });
            return stack;
        }
    }
});
Class.absorb.call(UserError, Class);

module.exports = UserError;