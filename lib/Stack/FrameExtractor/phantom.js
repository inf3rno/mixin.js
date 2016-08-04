var Class = require("../../Class"),
    Frame = require("../Frame");

module.exports = Class(Object, {
    prototype: {
        getNativeFrames: function (error) {
            if (!(error instanceof Error))
                throw new Error("The parameter must be an Error instance.");
            if (!error.stack)
                return [];
            // if error was not thrown, then the stack data is lost, there is no way to retrieve it
            var phantomStack = error.stack;
            var phantomFrameStrings = phantomStack.split("\n");
            return this.parseFrameStrings(phantomFrameStrings);
        },
        getFramesBefore: function (error, calledFunction) {
            var stackGenerator = new Error();
            try {
                throw stackGenerator;
            } catch (e) {
            }
            var phantomStack = stackGenerator.stack;
            var frameShifts = [
                calledFunction,
                error.build,
                error.constructor.Stack,
                error.constructor.Stack.prototype.init,
                arguments.callee
            ];

            var phantomFrameStrings = this.shiftFrameStrings(phantomStack.split("\n"), frameShifts);
            return this.parseFrameStrings(phantomFrameStrings);
        },
        parseFrameStrings: function (phantomFrameStrings) {
            var frames = [];
            for (var index = 0, length = phantomFrameStrings.length; index < length; ++index)
                frames[index] = this.parseFrameString(phantomFrameStrings[index]);
            return frames;
        },
        shiftFrameStrings: function (rawPhantomFrameStrings, frameShifts) {
            return rawPhantomFrameStrings.slice(frameShifts.length);
        },
        framePattern: /^(?:(.*)@)?(.*)$/,
        locationPattern: /^(.*):(\d+):(\d+)/,
        nativeFunctionPattern: /\[native code\]/,
        parseFrameString: function (phantomFrameString) {
            var frameMatch = phantomFrameString.match(this.framePattern);
            var functionName = frameMatch[1];
            var location = frameMatch[2];

            var locationMatch = location.match(this.locationPattern);
            if (!locationMatch && !location.match(this.nativeFunctionPattern))
                throw new Error("Unrecognized PhantomJS stack frame pattern by frame: \n" + phantomFrameString);

            var fileName,
                lineNumber,
                columnNumber;
            if (locationMatch) {
                fileName = locationMatch[1];
                lineNumber = Number(locationMatch[2]);
                columnNumber = Number(locationMatch[3]);
            }
            else
                fileName = location;

            return new Frame({
                functionName: functionName,
                fileName: fileName,
                lineNumber: lineNumber,
                columnNumber: columnNumber
            });
        }
    }
});