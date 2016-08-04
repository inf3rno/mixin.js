var Stack = require("./Stack"),
    NativeStack = require("./NativeStack");

var CompositeStack = Stack.extend({
    prototype: {
        toString: function (key) {
            var string = Stack.prototype.toString.call(this);
            var prefix = "";
            if (typeof (key) == "string")
                prefix = key + ".";

            for (var property in this.error) {
                var value = this.error[property];
                if (!(value instanceof Error))
                    continue;
                string += "\ncaused by <" + prefix + property + "> ";
                if (value.stack instanceof CompositeStack)
                    string += value.stack.toString(prefix + property);
                else if (value.stack instanceof Stack)
                    string += value.stack.toString();
                else
                    string += new NativeStack(value).toString();
            }
            return string;
        }
    }
});

module.exports = CompositeStack;