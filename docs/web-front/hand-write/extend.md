# 继承
```javascript
'use strict'
function Car(brand, color, price) {
    this.brand = brand;
    this.color = color;
    this.price = price
}
Car.type = "车"

Car.prototype.sell = function() {
    console.log("我是"+ this.color + "色的" + this.brand + ", 我的售价是" + this.price);
}

function BMW(brand, color, price) {
    Car.call(this, brand, color, price);
}

//子类继承父类静态属性
var staticKeys = Object.entries(Car);
for(var i = 0; i < staticKeys.length; i++) {
    var key = staticKeys[i][0];
    var value = staticKeys[i][1];
    BMW[key] = value;
}
console.log(BMW.type);//车

// var __proto = Object.create(Car.prototype);
// __proto.constructor = BMW;
// BMW.prototype = __proto;
BMW.prototype = Object.create(Car.prototype, {
    constructor:{
        value: BMW,
        writable:false
    }
});
// BMW.prototype = 123
var bmw = new BMW("宝马", "红", "30万");
bmw.sell();

```