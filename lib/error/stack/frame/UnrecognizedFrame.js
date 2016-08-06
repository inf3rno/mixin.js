var Class = require("../../../Class"),
    Frame = require("./Frame");

var UnrecognizedFrame = Class(Frame, {
    prototype: {
        frameString: null,
        constructor: function (frameString) {
            var match = frameString.match(/^\s+at\s+(.+)$/);
            this.frameString = match ? match[1] : frameString;
        },
        getFunctionName: function () {
        },
        getLocation: function () {
        },
        toString: function () {
            return "[" + this.frameString + "]";
        }
    }
});

module.exports = UnrecognizedFrame;