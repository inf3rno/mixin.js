var Class = require("../../../Class"),
    Frame = require("../frame/Frame"),
    FileLocation = require("../frame/FileLocation"),
    NativeLocation = require("../frame/NativeLocation");

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
                if (frameObject.isNative())
                    location = new NativeLocation();
                else
                    location = new FileLocation({
                        fileName: frameObject.getFileName(),
                        lineNumber: frameObject.getLineNumber(),
                        columnNumber: frameObject.getColumnNumber()
                    });
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