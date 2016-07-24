var UserError = require("./UserError");

var CompositeError = UserError.extend({
    prototype: {
        name: "CompositeError",
        framesToStack: function (key) {
            var stack = UserError.prototype.framesToStack.call(this);
            if (typeof (key) == "string")
                key += ".";
            else
                key = "";
            for (var property in this) {
                var error = this[property];
                if (!(error instanceof Error))
                    continue;
                stack += "\ncaused by <" + key + property + "> ";
                if (error instanceof CompositeError)
                    stack += error.framesToStack(key + property);
                else
                    stack += error.stack;
            }
            return stack;
        }
    }
});

module.exports = CompositeError;