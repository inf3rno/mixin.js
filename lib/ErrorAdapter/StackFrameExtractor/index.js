var StackFrameExtractor;

if (Error.captureStackTrace)
    StackFrameExtractor = require("./v8-compatible");
else
    StackFrameExtractor = require("./mock");

module.exports = StackFrameExtractor;