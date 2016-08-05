var Class = require("../../../Class"),
    Location = require("./Location");

var FileLocation = Class(Location, {
    prototype: {
        options: null,
        constructor: function (options) {
            this.options = options;
        },
        getFileName: function () {
            return this.options.fileName || "";
        },
        getLineNumber: function () {
            if (isNaN(this.options.lineNumber))
                return -1;
            return this.options.lineNumber;
        },
        getColumnNumber: function () {
            if (isNaN(this.options.columnNumber))
                return -1;
            return this.options.columnNumber;
        },
        toString: function () {
            return this.getFileName() + ":" + this.getLineNumber() + ":" + this.getColumnNumber();
        }
    }
});

module.exports = FileLocation;