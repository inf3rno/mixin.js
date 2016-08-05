module.exports = function (config) {

    var options = {
        plugins: [
            "karma-browserify",
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-ie-launcher",
            "karma-opera-launcher",
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
        browsers: [
            "Chrome",
            "Firefox",
            "IE",
            //"Opera", // the Karma Opera Launcher does not work on Windows
            "PhantomJS"
        ],
        reporters: ["progress"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        captureTimeout: 6000,
        singleRun: true
    };

    if (process.env.TRAVIS) {
        options.customLaunchers = {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        };
        options.browsers = [
            "Chrome_travis_ci",
            "Firefox",
            //"IE", // MSIE is not supported by Travis
            "Opera",
            "PhantomJS"
        ];
    }

    config.set(options);
};