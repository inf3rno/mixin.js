var tests = [];
var testFilePattern = /^\/base\/test\/([^\/]+\/)*test-.+\.js$/;
for (var file in window.__karma__.files)
    if (testFilePattern.test(file))
        tests.push(file);

requirejs.config({
    baseUrl: '/base',
    paths: {
        inheritance: "src/amd/inheritance",
        "inheritance-function": "src/amd/extensions/function",
        "inheritance-object": "src/amd/extensions/object"
    },
    deps: tests,
    callback: window.__karma__.start
});