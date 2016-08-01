var Class = require("../../Class");

var warningSent = false;

module.exports = Class(Object, {
    prototype: {
        getFramesBefore: function (calledFunction) {
            if (!warningSent) {
                console.warn("Generating standard stack trace is not supported in this environment.");
                warningSent = true;
            }
            return [];
        }
    }
});