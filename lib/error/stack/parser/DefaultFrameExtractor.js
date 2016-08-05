var Class = require("../../../Class");

module.exports = Class(Object, {
    prototype: {
        warningSent: false,
        getNativeFrames: function (error) {
            return this.getFramesBefore(error, error.constructor);
        },
        getFramesBefore: function (error, calledFunction) {
            if (!this.warningSent) {
                console.warn("Generating standard stack trace is not supported in this environment.");
                this.warningSent = true;
            }
            return [];
        }
    }
});