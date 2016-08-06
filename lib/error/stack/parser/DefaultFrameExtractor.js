var Class = require("../../../Class"),
    noop = require("../../../noop"),
    ShiftedFrameExtractor = require("./ShiftedFrameExtractor"),
    ThrowingStackStringGenerator = require("./ThrowingStackStringGenerator"),
    StackStringParser = require("./StackStringParser");

module.exports = Class(ShiftedFrameExtractor, {
    prototype: {
        stackStringGenerator: new ThrowingStackStringGenerator(),
        stackStringParser: new StackStringParser({
            stackParser: function (stackString, parseFrameStrings) {
                var frameStrings = stackString.split("\n");
                return parseFrameStrings(frameStrings);
            },
            frameParser: noop
        })
    }
});