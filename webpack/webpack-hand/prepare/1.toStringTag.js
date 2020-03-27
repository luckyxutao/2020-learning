// let obj  = Object.create(null);
// if(!Object.create){
//     Object.create = funtion(proto){
//         function F(){}
//         F.prototype = proto;
//         return new F();
//     }
// }

let argeValue;
let obj = {};
Object.defineProperty(obj,'age',{
    // value : 10
    get(){
        return argeValue;
    },
    set(newVal){
        argeValue = newVal;
    }
});
obj.age = 20;
console.log(obj.age)