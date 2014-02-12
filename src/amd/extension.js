define(["inheritance"], function (Inheritance) {

    var Extension = Inheritance({
        target: null,
        source: null,
        backup: null,
        isEnabled: false,
        initialize: function (options) {
            this.config(options);
        },
        enable: function () {
            if (this.isEnabled)
                return;
            if (!this.target || !this.source)
                throw new Error("Extension target and source must be set.");
            this.backup = {};
            for (var property in this.source)
                if (this.source.hasOwnProperty(property) && this.target.hasOwnProperty(property) && property !== "constructor")
                    this.backup[property] = this.target[property];
            Inheritance(this.target).mixin(this.source);
            this.isEnabled = true;
        },
        disable: function () {
            if (!this.isEnabled)
                return;
            for (var property in this.source) {
                if (!this.source.hasOwnProperty(property))
                    continue;
                if (this.target[property] !== this.source[property])
                    continue;
                if (this.backup.hasOwnProperty(property))
                    this.target[property] = this.backup[property];
                else
                    delete(this.target[property]);
            }
            delete(this.backup);
            this.isEnabled = false;
        },
        config: function (options) {
            if (!options)
                return;
            if (options.target)
                this.target = Inheritance(options.target).toObject();
            if (options.source)
                this.source = Inheritance(options.source).toObject();
            if (options.isEnabled)
                this.enable();
        }
    }).toFunction();

    return Extension;
});