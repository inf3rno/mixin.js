var Class = require("../../../Class"),
    Location = require("./Location");

var NonFileLocation = Class(Location, {
    prototype: {
        locationString: null,
        constructor: function (locationString) {
            var match = locationString.match(/^\[(.+)\]$/);
            this.locationString = match ? match[1] : locationString;
        },
        toString: function () {
            return this.locationString;
        }
    }
});

module.exports = NonFileLocation;