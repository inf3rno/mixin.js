var platform = require("../../platform");

var FrameExtractor;

if (platform.isNode() || platform.isChrome())
    FrameExtractor = require("./v8");
else if (platform.isPhantom())
    FrameExtractor = require("./phantom");
else
    FrameExtractor = require("./mock");

module.exports = FrameExtractor;