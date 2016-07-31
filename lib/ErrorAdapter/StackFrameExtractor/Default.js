var Class = require("../../Class");

module.exports = Class(Object, {
    prototype: {
        getFramesBefore: function (calledFunction) {
            return [];
        }
    }
});