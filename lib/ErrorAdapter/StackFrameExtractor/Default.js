var Class = require("../../Class");

module.exports = Class(Object, {
    prototype: {
        getFramesBeforeCall: function (calledFunction) {
            return [];
        }
    }
});