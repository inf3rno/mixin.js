module.exports = {
    noop: require("./noop"),
    Class: require("./Class"),
    UserError: require("./error/UserError"),
    CompositeError: require("./error/CompositeError"),
    NativeError: require("./error/NativeError")
};