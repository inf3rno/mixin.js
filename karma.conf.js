module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['jasmine', 'requirejs'],
        files: [
            {pattern: 'test/bootstrap.js', included: true},
            {pattern: 'test/**/*.js', included: false},
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'vendor/**/*.js', included: false}
        ],
        exclude: [

        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Firefox'],
        captureTimeout: 6000,
        singleRun: false
    });
};
