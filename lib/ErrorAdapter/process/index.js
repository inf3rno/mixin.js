var global = require("./global");

if (!global.process || !global.process.on)
    require("./processPolyfill");

/* note:
 * There is a global.process shim in the Yadda.shims.process, so checking !global.process is not enough by browser testing.
 * I'll try to remove this from Yadda later.
 * */

module.exports = global.process;