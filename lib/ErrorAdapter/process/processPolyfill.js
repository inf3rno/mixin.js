var global = require("./global");

if (!global.process)
    global.process = {};

global.process.on = function (type, callback) {
    throw new Error("Handling uncaught exceptions is not supported in this environment.");
};