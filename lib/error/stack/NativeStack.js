var Stack = require("./Stack");

var NativeStack = Stack.extend({
    prototype: {
        init: function (error) {
            if (!(error instanceof Error))
                throw new Error("Stack error must be an Error instance.");
            this.error = error;
            this.frames = this.extractor.getNativeFrames(this.error);
        }
    }
});

module.exports = NativeStack;