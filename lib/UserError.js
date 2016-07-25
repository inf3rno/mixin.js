var Class = require("./Class"),
    ErrorAdapter = require("./ErrorAdapter");

var UserError = Class(Error, {
    errorAdapter: new ErrorAdapter.StackFrameExtractor(),
    factory: function () {
        return function () {
            var errorAdapter = this.constructor.errorAdapter;
            this.frames = errorAdapter.getFramesBeforeCall(arguments.callee);
            Object.defineProperties(this, {
                stack: {
                    enumerable: false,
                    configurable: false,
                    get: this.framesToStack.bind(this)
                }
            });
            this.init.apply(this, arguments);
            return this;
        };
    },
    prototype: {
        name: "UserError",
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