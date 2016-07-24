var Class = require("./Class"),
    ErrorAdapter = require("./ErrorAdapter");

var UserError = Class(Error, {
    extend: Class.extend,
    clone: Class.clone,
    merge: Class.merge,
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
        extend: Class.prototype.extend,
        clone: Class.prototype.clone,
        merge: Class.prototype.merge,
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

module.exports = UserError;