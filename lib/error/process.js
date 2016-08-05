var global = require("./global");

if (!global.process)
    global.process = {};

if (!global.process.on)
    global.process.on = function (type, callback) {
        throw new Error("Handling uncaught exceptions is not supported in this environment.");
    };

module.exports = global.process;