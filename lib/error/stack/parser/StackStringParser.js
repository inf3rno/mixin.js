var Class = require("../../../Class"),
    Frame = require("../frame/Frame");

module.exports = Class(Object, {
    prototype: {
        stackParser: function (stackString) {
            return stackString.split("\n");
        },
        frameParser: function (frameString) {
            throw new Error("Unrecognized frame pattern by frame: \n" + frameString);
        },
        locationParsers: {},
        constructor: function (options) {
            Class.prototype.merge.call(this, options);
        },
        parseStackString: function (stackString) {
            var frameStrings = this.stackParser(stackString);
            var frames = [];
            for (var index = 0, length = frameStrings.length; index < length; ++index)
                frames[index] = this.parseFrameString(frameStrings[index]);
            return frames;
        },
        parseFrameString: function (frameString) {
            var functionNameAndLocation = this.frameParser(frameString);
            return new Frame({
                functionName: functionNameAndLocation.functionName,
                location: this.parseLocationString(functionNameAndLocation.location)
            });
        },
        parseLocationString: function (locationString) {
            for (var type in this.locationParsers) {
                var locationParser = this.locationParsers[type];
                var location = locationParser(locationString);
                if (location)
                    return location;
            }
        }
    }
});