require(["mixin"], function (Mixin) {

    var hasName = new Mixin({
        constructor: function (options) {
            this.setName(options.name);
        },
        setName: function (name) {
            this.name = name;
        },
        getName: function () {
            return this.name;
        }
    });

    var hasAddress = function (options) {
        this.address = options.address;
    };
    hasAddress.prototype = {
        getAddress: function () {
            return this.address;
        }
    };

    var hasPhoneNumber = {
        constructor: function (options) {
            this.phoneNumber = options.phoneNumber;
        },
        getPhoneNumber: function () {
            return this.phoneNumber;
        }
    };

    var Entity = function (options) {
        this.store = options.store;
        this.id = this.uniqueId();
    };
    Entity.prototype = {
        constructor: Entity,
        entropySource: 0,
        uniqueId: function () {
            return ++Entity.prototype.entropySource;
        },
        save: function () {
            this.store.save(this.id, {});
        },
        load: function () {
            var data = this.store.load(this.id);
            for (var property in data)
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
        }
    };

    var User = Entity.extend(hasName, hasAddress, hasPhoneNumber, {
        entropySource: 0,
        save: function () {
            this.store.save(this.id, {
                name: this.getName(),
                address: this.getAddress(),
                phoneNumber: this.getPhoneNumber()
            });
        }
    });

    var Store = Object.extend({
        constructor: function () {
            this.data = {};
        },
        save: function (key, value) {
            this.data[key] = value;
        },
        load: function (key) {
            return this.data[key];
        },
        toJSON: function () {
            return JSON.stringify(this.data);
        }
    });

    var store = new Store();
    var user = new User({
        name: "John Smith",
        address: "New York",
        phoneNumber: "1234567890",
        store: store
    });
    var user2 = new User({
        name: "Susanne Corinne",
        address: "Baltimore",
        phoneNumber: "21345673421",
        store: store
    });
    user.save();
    user2.save();

    var data = JSON.parse(store.toJSON());
    console.log(data);

    /* should contain:
     *    {
     *        1: {
     *            name: "John Smith",
     *            address: "New York",
     *            phoneNumber: "1234567890"
     *        },
     *        2: {
     *            name: "Susanne Corinne",
     *            address: "Baltimore",
     *            phoneNumber: "21345673421"
     *        }
     *    }
     */

});


