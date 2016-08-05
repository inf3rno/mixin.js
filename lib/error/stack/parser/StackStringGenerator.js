var Class = require("../../../Class");

var StackStringGenerator = Class(Object, {
    prototype: {
        constructor: function () {
        },
        generateStackString: function () {
            return String(new Error().stack);
        }
    }
});

module.exports = StackStringGenerator;