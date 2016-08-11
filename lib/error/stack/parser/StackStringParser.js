var Class = require("../../../Class"),
    NonFileLocation = require("../frame/NonFileLocation"),
    UnrecognizedFrame = require("../frame/UnrecognizedFrame");

module.exports = Class(Object, {
    prototype: {
        stackParser: null,
        frameParser: null,
        locationParsers: null,
        constructor: function (options) {
            Class.prototype.merge.call(this, options);
        },
        parseStackString: function (stackString) {
            return this.stackParser(stackString, this.parseFrameStrings.bind(this));
        },
        parseFrameStrings: function (frameStrings) {
            var frames = [];
            for (var index = 0, length = frameStrings.length; index < length; ++index)
                frames[index] = this.parseFrameString(frameStrings[index]);
            return frames;
        },
        parseFrameString: function (frameString) {
            var frame = this.frameParser(frameString, this.parseLocationString.bind(this));
            if (!frame)
                frame = new UnrecognizedFrame(frameString);
            return frame;
        },
        parseLocationString: function (locationString) {
            var location;
            for (var type in this.locationParsers) {
                var locationParser = this.locationParsers[type];
                location = locationParser(locationString);
                if (location)
                    break;
            }
            if (!location)
                location = new NonFileLocation(locationString);
            return location;
        }
    }
});