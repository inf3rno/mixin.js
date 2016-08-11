var Class = require("../../../Class"),
    Frame = require("../frame/Frame"),
    FileLocation = require("../frame/FileLocation"),
    NonFileLocation = require("../frame/NonFileLocation"),
    ShiftedFrameExtractor = require("./ShiftedFrameExtractor"),
    StackStringGenerator = require("./StackStringGenerator"),
    StackStringParser = require("./StackStringParser");

module.exports = Class(ShiftedFrameExtractor, {
    prototype: {
        stackStringGenerator: new StackStringGenerator(),
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
        }),
        getFramesBefore: function (error, calledFunction) {
            Error.prepareStackTrace = this.prepareStackTrace;
            var surrogateError = {};
            Error.captureStackTrace(surrogateError, calledFunction);
            var frameObjects = surrogateError.stack;
            delete(Error.prepareStackTrace);
            var frames = [];
            for (var index = 0, length = frameObjects.length; index < length; ++index) {
                var frameObject = frameObjects[index];
                var functionName = frameObject.getFunctionName();
                var location;
                if (frameObject.getFileName() !== undefined)
                    location = new FileLocation({
                        fileName: frameObject.getFileName(),
                        lineNumber: frameObject.getLineNumber(),
                        columnNumber: frameObject.getColumnNumber()
                    });
                else if (frameObject.isEval())
                    location = new NonFileLocation(frameObject.getEvalOrigin() + ", <anonymous>:" + frameObject.getLineNumber() + ":" + frameObject.getColumnNumber());
                else if (frameObject.isNative())
                    location = new NonFileLocation("native");
                else
                    location = new NonFileLocation("unknown");
                frames[index] = new Frame({
                    functionName: functionName,
                    location: location
                })
            }
            return frames;
        },
        prepareStackTrace: function (error, frameObjects) {
            return frameObjects;
        }
    }
});