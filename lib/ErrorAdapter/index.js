var StackFrameExtractor;

if (Error.captureStackTrace)
    StackFrameExtractor = require("./StackFrameExtractor/V8");
else
    console.warn("Generating standard stack trace is not supported in this environment.");

var global = (function () {
    return this;
})();

if (!global.process)
    console.warn("Handling uncaught exceptions is not supported in this environment.");

module.exports = {
    StackFrameExtractor: StackFrameExtractor
};