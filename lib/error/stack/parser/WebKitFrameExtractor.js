var Class = require("../../../Class"),
    ShiftedFrameExtractor = require("./ShiftedFrameExtractor"),
    ThrowingStackStringGenerator = require("./ThrowingStackStringGenerator"),
    StackStringParser = require("./StackStringParser"),
    FileLocation = require("../frame/FileLocation"),
    NativeLocation = require("../frame/NativeLocation");

module.exports = Class(ShiftedFrameExtractor, {
    prototype: {
        stackStringGenerator: new ThrowingStackStringGenerator(),
        stackStringParser: new StackStringParser({
            stackParser: function (stackString) {
                return stackString.split("\n");
            },
            frameParser: function (frameString) {
                var pattern = /^(?:(.*)@)?(.*)$/;
                var match = frameString.match(pattern);
                return {
                    functionName: match[1],
                    location: match[2]
                };
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
                        return new NativeLocation();
                }
            }
        })
    }
});