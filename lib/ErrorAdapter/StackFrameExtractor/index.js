var StackFrameExtractor;

if (Error.captureStackTrace)
    StackFrameExtractor = require("./v8");
else
    StackFrameExtractor = require("./mock");

module.exports = StackFrameExtractor;