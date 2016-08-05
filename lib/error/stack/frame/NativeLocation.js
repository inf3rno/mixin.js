var Class = require("../../../Class"),
    Location = require("./Location");

var NativeLocation = Class(Location, {
    prototype: {
        constructor: function () {
        },
        toString: function () {
            return "native";
        }
    }
});

module.exports = NativeLocation;