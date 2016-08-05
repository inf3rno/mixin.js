var Class = require("../Class"),
    Stack = require("./stack/Stack");

var UserError = Class(Error, {
    factory: Class.factory,
    Stack: Stack,
    prototype: {
        name: "UserError",
        build: function () {
            Object.defineProperties(this, {
                stack: {
                    enumerable: false,
                    configurable: false,
                    value: new this.constructor.Stack(this, this.stack ? this.clone : this.constructor)
                }
            });
        },
        init: function (config) {
            if (typeof (config) == "string")
                config = {message: config};
            this.merge(config);
        }
    }
});
Class.absorb.call(UserError, Class);

module.exports = UserError;