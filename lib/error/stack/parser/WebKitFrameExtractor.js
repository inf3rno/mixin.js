var Class = require("../../../Class"),
    ShiftedFrameExtractor = require("./ShiftedFrameExtractor"),
    ThrowingStackStringGenerator = require("./ThrowingStackStringGenerator"),
    StackStringParser = require("./StackStringParser"),
    FileLocation = require("../frame/FileLocation"),
    NonFileLocation = require("../frame/NonFileLocation"),
    Frame = require("../frame/Frame");

module.exports = Class(ShiftedFrameExtractor, {
    prototype: {
        stackStringGenerator: new ThrowingStackStringGenerator(),
        stackStringParser: new StackStringParser({
            stackParser: function (stackString, parseFrameStrings) {
                return parseFrameStrings(stackString.split("\n"));
            },
            frameParser: function (frameString, parseLocationString) {
                var pattern = /^(?:(.*)@)?(.*)$/;
                var match = frameString.match(pattern);
                if (match)
                    return new Frame({
                        functionName: match[1],
                        location: parseLocationString(match[2])
                    });
            },
            locationParsers: {
                file: function (locationString) {
                    var pattern = /^(.*):(\d+):(\d+)$/;
                    var match = locationString.match(pattern);
                    if (match)
                        return new FileLocation({
                            fileName: match[1],
                            lineNumber: Number(match[2]),
                            columnNumber: Number(match[3])
                        });
                },
                native: function (locationString) {
                    var pattern = /^\[native code\]$/;
                    if (locationString.match(pattern))
                        return new NonFileLocation("native");
                }
            }
        })
    }
});