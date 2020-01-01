/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 177);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(31);
var defined = __webpack_require__(17);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ 11:
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ 13:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(15);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 15:
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 17:
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends2 = __webpack_require__(24);

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

FN.log('3ksdk.use.js init success!');

window.SDKDATA = {};

window.SDKAPI = {
    init: function init(_ref) {
        var token = _ref.token,
            _ref$data = _ref.data,
            data = _ref$data === undefined ? {} : _ref$data,
            callback = _ref.callback;

        // 保存回调函数
        window.SDKDATA.init = {};
        window.SDKDATA.init.callback = function (res) {
            // res为实际请求的响应结果
            if (typeof callback == 'function') {
                // 可在此处对res进行处理回调给useH5
                callback(FN.wrap(res));
            }

            if (res.code == 0) {
                if (res.data.login_notice.title) {
                    window.GLOBAL_DATA.ajaxInfo.login_notice = {
                        title: res.data.login_notice.title,
                        content: res.data.login_notice.content
                    };
                }

                if (res.data.init_notice.title) {
                    window.GLOBAL_API.showPopbox({
                        type: 'notice',
                        id: 1
                    });
                } else if (res.data.init_notice.image) {
                    window.GLOBAL_API.showPopbox({
                        type: 'notice',
                        id: 2
                    });
                }
            }
        };
        window.gw8SDK.init().then(function (res) {
            if (res.code == 0) {
                res.data.setting = data;
                FN.saveSession('SDK_INIT_INFO', res.data);
            }
            window.SDKDATA.init.callback(res);
        });
    },
    login: function login(_ref2) {
        var token = _ref2.token,
            _ref2$data = _ref2.data,
            data = _ref2$data === undefined ? {} : _ref2$data,
            callback = _ref2.callback;


        window.SDKDATA.loginWay = data.loginWay;
        // 保存回调函数
        window.SDKDATA.login = {};
        window.SDKDATA.login.callback = function () {
            var res = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (typeof callback == 'function') {
                // 可在此处对res进行处理回调给useH5
                // res 为3ksdk响应参数
                var statusCode = res.code,
                    _data = res.data,
                    status = res.msg;

                var cpRes = {
                    statusCode: statusCode,
                    // status,
                    loginParams: (0, _extends3.default)({}, _data, {
                        userName: _data.name,
                        statusCode: statusCode
                    })
                };
                callback(cpRes);
            }
        };

        // 去除自动登录，但是会保留登录过的用户信息
        window.GLOBAL_API.showPopbox({
            type: 'form',
            id: 1
            // close: data.loginWay == 'changeAccountByCp'
        });
        // if (FN.getSession('USER_INFO').user_id && data.loginWay == 'default') {
        //     window.GLOBAL_API.showFloatBall()
        //     // 初始化侧边栏
        //     window.GLOBAL_API.initSlideBar()

        //     window.SDKDATA.login.callback({
        //         code: 0,
        //         msg: '自动登录成功',
        //         data: FN.getSession('USER_INFO')
        //     })
        // } else {
        //     window.GLOBAL_API.showPopbox({
        //         type: 'form',
        //         id: 1,
        //         // close: data.loginWay == 'changeAccountByCp'
        //     })
        // }
    },

    __isChangeUser__: false,
    changeAccount: function changeAccount(_ref3) {
        var token = _ref3.token,
            callback = _ref3.callback;

        // 切换帐号必定注销用户信息
        FN.removeSession('USER_INFO');
        FN.removeSession('FUSE_USER_INFO');

        // 隐藏浮标
        window.GLOBAL_API.hideFloatBall();
        window.GLOBAL_API.hideSlideBar();

        window.SDKAPI.__isChangeUser__ = true;
        // 直接响应成功，cp会主动使用one方法调用login
        window.PS.publish(token, {
            statusCode: 0,
            status: '调用切换帐号成功'
        });

        // 原先代码
        // 自动模拟触发一次cp登录请求
        window.JSSDK.login({
            token: token,
            args: []
            // data: {
            //     loginWay: 'changeAccountByCp'
            // },
            // callback: (data = {}) => {
            //     window.SDKAPI.__isChangeUser__ = true
            //     window.PS.publish(token, data)
            // }
        });
    },
    getFromID: function getFromID() {
        return FN.getSession('gw8').from_id;
    },
    recharge: function recharge(_ref4) {
        var token = _ref4.token,
            _ref4$data = _ref4.data,
            data = _ref4$data === undefined ? {} : _ref4$data,
            callback = _ref4.callback;
        var amount = data.amount,
            roleId = data.roleId,
            roleName = data.roleName,
            serverId = data.serverId,
            serverName = data.serverName,
            order_id = data.order_id;

        var _FN$getSession = FN.getSession('USER_INFO'),
            name = _FN$getSession.name,
            old_id = _FN$getSession.old_id;

        function wxpay(config) {
            FN.log('wxpay:', config);
            var appId = config.appId,
                timeStamp = config.timeStamp,
                nonceStr = config.nonceStr,
                signType = config.signType,
                paySign = config.paySign,
                redirectUrl = config.redirectUrl;

            WeixinJSBridge.invoke('getBrandWCPayRequest', {
                appId: appId, //公众号名称，由商户传入
                timeStamp: timeStamp, //时间戳，自1970年以来的秒数
                nonceStr: nonceStr, //随机串
                package: config.package,
                signType: signType, //微信签名方式：
                paySign: paySign //微信签名
            }, function (res) {
                if (res.err_msg == 'get_brand_wcpay_request:ok') {
                    FN.log('执行微信支付成功', res);
                }
            });
        }

        window.gw8SDK.rechargeList({
            cookie_uuid: FN.getLocal('gw8').cookie_uuid,
            uid: old_id,
            user_name: name, //	string	必填	用户名
            fee: amount, //	int	必填	充值金额，单位分
            server_id: serverId, //	int	必填	分服编号
            server_name: serverName, //	string		分服名称
            role_id: roleId, //	string	必填	角色id
            callback_info: order_id, //	string	必填	回调信息
            notify_url: FN.getSession('FUSE_CHANNEL_INFO').pay_notify, //	string	必填	通知地址
            app_name: 'app_name',
            h5sdk_url: window.location.href
        }).then(function (res) {
            if (res.code !== 0) return;

            if (FN.OS.isWX) {
                wxpay(res.data);
                return;
            }

            var _res$data$pay_list = res.data.pay_list,
                h5alipay = _res$data$pay_list.h5alipay,
                h5wechatpay = _res$data$pay_list.h5wechatpay;

            var div = window.GLOBAL_API.getRechargeBox({
                amount: res.data.fee,
                alipay: window.__3kapi_cz.get() + h5alipay,
                wxpay: window.__3kapi_cz.get() + h5wechatpay
            });
            document.body.appendChild(div);
            document.getElementById('recharge-close').onclick = function () {
                document.body.removeChild(div);
            };
        });
    },
    goToUserCenter: function goToUserCenter(_ref5) {
        var token = _ref5.token,
            _ref5$data = _ref5.data,
            data = _ref5$data === undefined ? {} : _ref5$data,
            callback = _ref5.callback;

        // 保存回调函数
        window.GLOBAL_API.showSlideBar();
        if (typeof callback == 'function') {
            callback({
                statusCode: 0,
                status: '成功'
            });
        }
    },
    flymeChangeAccount: function flymeChangeAccount(_ref6) {
        var token = _ref6.token,
            _ref6$data = _ref6.data,
            data = _ref6$data === undefined ? {} : _ref6$data,
            callback = _ref6.callback;

        // 保存回调函数
        // 在外部点击切换帐号时会执行
        window.SDKDATA.flymeChangeAccount = {};
        window.SDKDATA.flymeChangeAccount.callback = function () {
            var res = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (typeof callback == 'function') {
                FN.log('toCp:flymeChangeAccount', res);
                // console.log(callback)
                // console.log(token)
                callback(res);
            }
        };
    }
};

/***/ }),

/***/ 18:
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ 2:
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(41);
var enumBugKeys = __webpack_require__(25);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(26)('keys');
var uid = __webpack_require__(22);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ 22:
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(39);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ 25:
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(18);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(17);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(13);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ 32:
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(5);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 37:
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(60), __esModule: true };

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(11)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(4) && !__webpack_require__(11)(function () {
  return Object.defineProperty(__webpack_require__(19)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(9);
var toIObject = __webpack_require__(10);
var arrayIndexOf = __webpack_require__(51)(false);
var IE_PROTO = __webpack_require__(21)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(10);
var toLength = __webpack_require__(27);
var toAbsoluteIndex = __webpack_require__(52);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(18);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(2);
var ctx = __webpack_require__(14);
var hide = __webpack_require__(7);
var has = __webpack_require__(9);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(62);
module.exports = __webpack_require__(2).Object.assign;


/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(20);
var gOPS = __webpack_require__(37);
var pIE = __webpack_require__(32);
var toObject = __webpack_require__(28);
var IObject = __webpack_require__(31);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(11)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(6);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(61) });


/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var createDesc = __webpack_require__(16);
module.exports = __webpack_require__(4) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(3);
var IE8_DOM_DEFINE = __webpack_require__(40);
var toPrimitive = __webpack_require__(33);
var dP = Object.defineProperty;

exports.f = __webpack_require__(4) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 9:
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ })

/******/ });
//# sourceMappingURL=gowansdk.use.js.map