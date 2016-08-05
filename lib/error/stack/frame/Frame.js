var Class = require("../../../Class"),
    Location = require("./Location");

var Frame = Class(Object, {
    prototype: {
        constructor: function (options) {
            this.functionName = options.functionName || "";
            if (!(options.location instanceof Location))
                throw new Error("The location argument must be a Location instance.");
            this.location = options.location;
        },
        getFunctionName: function () {
            return this.functionName;
        },
        getLocation: function () {
            return this.location;
        },
        toString: function () {
            return this.getFunctionName() + " (" + this.getLocation() + ")";
        }
    }
});

module.exports = Frame;