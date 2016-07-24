var Class = require("./Class"),
    ErrorAdapter = require("./ErrorAdapter");

var UserError = Class(Error, {
    extend: Class.extend,
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
        merge: Class.prototype.merge,
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

module.exports = UserError;