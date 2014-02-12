# API Documentation

## Available Extensions

If you want to know more about extensions please visit the [Inheritance Extensions](../extension.md) section!

### Function.prototype adapter

This adapter extends the `Function.prototype` with the following functions:

    Function mixin(ancestor1, ancestor2, ...) - multiple inheritance
    Function extend(ancestor1, ancestor2, ...) - prototypal inheritance
    Boolean hasAncestors(ancestor1, ancestor2, ...) - ancestor check
    Boolean hasDescendants(descendant1, descendant2, ...) - descendant check
    Boolean hasInstance(instance) - instance check
    Object toObject() - returns the prototype

Example usage:

    var Ancestor1 = function (){
        this.a = 1;
    };
    var Ancestor2 = Object.extend({
        initialize: function (){
            this.b = 2;
        }
    });
    var ancestor3 = {
        initialize: function (){
            this.c = 3;
        }
    };

    var Descendant = Ancestor1.extend(
        Ancestor2,
        {
            initialize: function (){
                Ancestor1.call(this);
                Ancestor2.call(this);
                ancestor3.constructor.call(this);
                this.d = 4;
            }
        }
    );

    var a = new Ancestor1();
    console.log(a); //{a:1}
    var d = new Descendant();
    console.log(d); //{a:1, b:2, c:3, d:4}
