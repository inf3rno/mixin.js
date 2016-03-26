var expect = require("expect.js"),
    o3 = require("../../.."),
    StackStringParser = o3.StackStringParser,
    StackTrace = o3.StackTrace,
    StackFrame = o3.StackFrame;

module.exports = function () {

    var result;
    this.When(/^I parse a stack string$/, function (next) {
        var stackString = [
                "Error",
                "	at module.exports.extend.configure (http://example.com/o3.js:75:31)",
                "	at new Descendant (http://example.com/o3.js:11:27)",
                "	at custom (http://example.com/spec/example.spec.js:222:23)",
                "	at Class.<anonymous> (http://example.com/spec/example.spec.js:224:13)",
                "	at http://example.com/spec/example.spec.js:10:20",
                "	at Array.forEach (native)"
            ].join("\n"),
            parser = new StackStringParser();
        result = parser.parse(stackString);
        next();
    });

    this.Then(/^the result should be a StackTrace$/, function (next) {
        expect(result).to.be.a(StackTrace);
        next();
    });

    this.Then(/^it should contain the StackFrames with the description, path, row, col properties$/, function (next) {
        expect(result).to.eql(new StackTrace({
            frames: [
                new StackFrame({
                    description: "custom",
                    path: "http://example.com/spec/example.spec.js",
                    row: 222,
                    col: 23
                }),
                new StackFrame({
                    description: "Class.<anonymous>",
                    path: "http://example.com/spec/example.spec.js",
                    row: 224,
                    col: 13
                }),
                new StackFrame({
                    description: "",
                    path: "http://example.com/spec/example.spec.js",
                    row: 10,
                    col: 20
                }),
                new StackFrame({
                    description: "Array.forEach",
                    path: "native",
                    row: -1,
                    col: -1
                })
            ]
        }));
        next();
    });

};