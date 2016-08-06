var Class = require("../../../Class"),
    ShiftedFrameExtractor = require("./ShiftedFrameExtractor"),
    ThrowingStackStringGenerator = require("./ThrowingStackStringGenerator"),
    StackStringParser = require("./StackStringParser"),
    FileLocation = require("../frame/FileLocation"),
    Frame = require("../frame/Frame");

module.exports = Class(ShiftedFrameExtractor, {
    prototype: {
        stackStringGenerator: new ThrowingStackStringGenerator(),
        stackStringParser: new StackStringParser({
            stackParser: function (stackString, parseFrameStrings) {
                var frameStrings = stackString.split("\n");
                frameStrings.shift();
                return parseFrameStrings(frameStrings);
            },
            frameParser: function (frameString, parseLocationString) {
                var pattern = /^\s+at\s+(?:(.*)\s+)?\((.*)\)$/;
                var match = frameString.match(pattern);
                if (match)
                    return new Frame({
                        functionName: match[1],
                        location: parseLocationString(match[2])
                    });
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