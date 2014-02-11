var tests = [];
var testFilePattern = /^\/base\/test\/([^\/]+\/)*test-.+\.js$/;
for (var file in window.__karma__.files)
    if (testFilePattern.test(file))
        tests.push(file);

requirejs.config({
    baseUrl: '/base',
    paths: {
        mixin: "src/amd/mixin",
        "mixin-function": "src/amd/extensions/function",
        "mixin-object": "src/amd/extensions/object"
    },
    deps: tests,
    callback: window.__karma__.start
});