// 深克隆
function deepClone (origin,target) {
    var target = target || {},
    tostr = Object.prototype.toString,
    arrStr = "[object Array]";
    for(var prop in origin){
        // hasOwnProperty
        if(origin.hasOwnProperty(prop)){
            if(typeof origin[prop] == "object"){  //判断属性是引用类型还是原始值
                if(tostr.call(origin[prop]) == arrStr){  // 判断值为数组还是对象
                    target[prop] = []
                }else{
                    target[prop] = {}
                }
                deepClone(origin[prop],target[prop]) // 递归
            }else{
                target[prop] = origin[prop]
            }
        }
    }
}