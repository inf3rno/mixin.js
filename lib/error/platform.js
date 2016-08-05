var global = require("./global"),
    Class = require("../Class");

var Platform = Class(Object, {
    prototype: {
        isNode: function () {
            return global.Error.captureStackTrace && !global.window;
        },
        isChrome: function () {
            return global.Error.captureStackTrace && global.window;
        },
        isPhantom: function () {
            return !!this.getPhantom();
        },
        isFirefox: function () {
            return !!global.console.exception;
        },
        getPhantom: function () {
            if (!global.__karma__ || !global.frameElement)
                return global._phantom;
            // note: Karma runs the code in an iframe by default, and the launcher does not copy the _phantom property to that iframe.
            return global.parent._phantom;
        }
    }
});

module.exports = new Platform();