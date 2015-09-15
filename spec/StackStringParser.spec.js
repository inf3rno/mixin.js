var o3 = require("o3"),
    StackTrace = o3.StackTrace,
    StackFrame = o3.StackFrame,
    StackStringParser = o3.StackStringParser;

describe("StackStringParser.prototype", function () {

    describe("parse", function () {

        it("accepts only stack string", function () {

            var parser = new StackStringParser();
            expect(function () {
                parser.parse({});
            }).toThrow(new StackStringParser.StackStringRequired());
        });

        it("creates trace from the stack string", function () {
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

            expect(parser.parse(stackString)).toEqual(
                new StackTrace({
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
                })
            );
        });
    });

});