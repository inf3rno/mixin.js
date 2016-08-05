var UserError = require("./UserError"),
    CompositeStack = require("./stack/CompositeStack");

var CompositeError = UserError.extend({
    Stack: CompositeStack,
    prototype: {
        name: "CompositeError"
    }
});

module.exports = CompositeError;