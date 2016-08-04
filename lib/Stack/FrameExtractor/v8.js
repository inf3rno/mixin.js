var Class = require("../../Class");

module.exports = Class(Object, {
    prototype: {
        getNativeFrames: function (error) {
            return this.getFramesBefore(error, error.constructor);
        },
        getFramesBefore: function (error, calledFunction) {
            Error.prepareStackTrace = this.prepareStackTrace;
            var surrogateError = {};
            Error.captureStackTrace(surrogateError, calledFunction);
            var frames = surrogateError.stack;
            delete(Error.prepareStackTrace);
            return frames;
        },
        prepareStackTrace: function (error, frames) {
            return frames;
        }
    }
});