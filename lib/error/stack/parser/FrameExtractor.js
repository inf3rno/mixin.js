var platform = require("../../platform");

var FrameExtractor;

if (platform.isNode() || platform.isChrome())
    FrameExtractor = require("./V8FrameExtractor");
else if (platform.isFirefox())
    FrameExtractor = require("./SpiderMonkeyFrameExtractor");
else if (platform.isInternetExplorer())
    FrameExtractor = require("./ChakraFrameExtractor");
else if (platform.isPhantom())
    FrameExtractor = require("./WebKitFrameExtractor");
else
    FrameExtractor = require("./DefaultFrameExtractor");

module.exports = FrameExtractor;