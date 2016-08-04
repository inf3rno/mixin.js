var Class = require("../Class"),
    FrameExtractor = require("./FrameExtractor");

var Stack = Class.extend({
    prototype: {
        extractor: new FrameExtractor(),
        error: null,
        frames: null,
        init: function (error, calledFunction) {
            if (!(error instanceof Error))
                throw new Error("Stack error must be an Error instance.");
            this.error = error;
            this.frames = this.extractor.getFramesBefore(this.error, calledFunction || this.error.constructor);
        },
        toString: function () {
            var string = "";
            string += this.error.name;
            string += ": " + this.error.message;
            this.frames.forEach(function (frame) {
                string += "\n at " + frame;
            });
            return string;
        }
    }
});

module.exports = Stack;