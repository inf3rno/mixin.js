var Class = require("../../../Class");

module.exports = Class(Object, {
    prototype: {
        stackStringGenerator: null,
        stackStringParser: null,
        getNativeFrames: function (error) {
            if (!(error instanceof Error))
                throw new Error("The parameter must be an Error instance.");
            if (!error.stack)
                return [];
            // if error was not thrown, then the stack data is lost, there is no way to retrieve it
            var stackString = String(error.stack);
            return this.stackStringParser.parseStackString(stackString);
        },
        getFramesBefore: function (error, calledFunction) {
            var stackString = this.stackStringGenerator.generateStackString();
            var frames = this.stackStringParser.parseStackString(stackString);
            return this.shiftFrames(frames, [
                calledFunction,
                error.build,
                error.constructor.Stack,
                error.constructor.Stack.prototype.init,
                arguments.callee,
                this.stackStringGenerator.generateStackString
            ]);
        },
        shiftFrames: function (frames, frameShifts) {
            return frames.slice(frameShifts.length);
        }
    }
});