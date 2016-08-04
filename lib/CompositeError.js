var UserError = require("./UserError"),
    CompositeStack = require("./CompositeStack");

var CompositeError = UserError.extend({
    Stack: CompositeStack,
    prototype: {
        name: "CompositeError"
    }
});

module.exports = CompositeError;