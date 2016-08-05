var Class = require("../../../Class"),
    ShiftedFrameExtractor = require("./ShiftedFrameExtractor"),
    ThrowingStackStringGenerator = require("./ThrowingStackStringGenerator"),
    StackStringParser = require("./StackStringParser"),
    FileLocation = require("../frame/FileLocation");

module.exports = Class(ShiftedFrameExtractor, {
    prototype: {
        stackStringGenerator: new ThrowingStackStringGenerator(),
        stackStringParser: new StackStringParser({
            stackParser: function (stackString) {
                var frameStrings = stackString.split("\n");
                frameStrings.shift();
                return frameStrings;
            },
            frameParser: function (frameString) {
                var pattern = /^\s+at\s+(?:(.*)\s+)?\((.*)\)$/;
                var match = frameString.match(pattern);
                return {
                    functionName: match[1],
                    location: match[2]
                };
            },
            locationParsers: {
                file: function (locationString) {
                    var pattern = /^(.*):(\d+):(\d+)/;
                    var match = locationString.match(pattern);
                    if (match)
                        return new FileLocation({
                            fileName: match[1],
                            lineNumber: Number(match[2]),
                            columnNumber: Number(match[3])
                        });
                }
            }
        })
    }
});