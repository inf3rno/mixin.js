module.exports = function (config) {
    config.set({
        basePath: '../../',
        frameworks: ['jasmine', 'requirejs'],
        files: [
            {pattern: 'test/requirejs/bootstrap.js', included: true},
            {pattern: "test/requirejs/karma.conf.js", served: false},
            {pattern: 'test/requirejs/**/*.js', included: false},
            {pattern: 'src/amd/**/*.js', included: false}
        ],
        exclude: [

        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Firefox'],
        captureTimeout: 6000,
        singleRun: false
    });
};
