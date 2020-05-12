
/* 
* 深克隆
* deepClone (origin,target)
* @parmas 
* origin：源对象
* target：目标对象
*/
function deepClone (origin,target) {
    var target = target || {},
        tostr = Object.prototype.toString,
        arrStr = "[object Array]";
    for(var prop in origin){
        if(origin.hasOwnProperty(prop)){
            if(origin[prop] !== "null" && typeof origin[prop] == "object"){  //判断属性是引用类型还是原始值
                // if(tostr.call(origin[prop]) == arrStr){  // 判断值为数组还是对象
                //     target[prop] = []
                // }else{
                //     target[prop] = {}
                // }
                target[prop] = tostr.call(origin[prop]) == arrStr ? [] : {} // 使用三木运算符代替以上if的写法
                deepClone(origin[prop],target[prop]) // 递归
            }else{
                target[prop] = origin[prop]
            }
        }
    }
    return target
}
