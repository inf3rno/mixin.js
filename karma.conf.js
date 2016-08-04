module.exports = function (config) {
    config.set({
        plugins: [
            "karma-browserify",
            "karma-chrome-launcher",
            "karma-phantomjs-launcher",
            "karma-mocha"
        ],
        frameworks: ["browserify", "mocha"],
        files: [
            "yadda.js",
            "index.js",
            "lib/**/*.js",
            {pattern: "lib/**/!(*.js)", included: false},
            "features/**/*.js",
            {pattern: "features/**/!(*.js)", included: false}
        ],
        preprocessors: {
            "index.js": ["browserify"],
            "yadda.js": ["browserify"],
            "lib/**/*.js": ["browserify"],
            "features/**/*.js": ["browserify"]
        },
        client: {
            mocha: {
                reporter: "html",
                ui: "bdd"
            }
        },
        browserify: {
            debug: true
        },
        browsers: ["Chrome", "PhantomJS"],
        reporters: ["progress"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        captureTimeout: 6000,
        singleRun: true
    });
};