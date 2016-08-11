var Class = require("../../../Class"),
    Frame = require("../frame/Frame"),
    FileLocation = require("../frame/FileLocation"),
    NonFileLocation = require("../frame/NonFileLocation");

module.exports = Class(Object, {
    prototype: {
        getNativeFrames: function (error) {
            return this.getFramesBefore(error, error.constructor);
        },
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