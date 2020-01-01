import Api from 'api-mock-js'
import configUrl from '../common/config'
// import '../mock/interface.h5sdk'
// import '../mock/interface.gowansdk'
// import '../mock/interface.fusesdk'
import { requestEncrypt, returnDecrypt, requestDecrypt } from './fuse.auth'

if (!window.Api) window.Api = Api
const userAgent = navigator.userAgent.toLowerCase()

const isMobile = /mobile/i.test(userAgent)

const isAndroid = /android/i.test(userAgent)

const isIOS = /iphone|ipad|ipod/i.test(userAgent)

const isWX = /MicroMessenger/i.test(userAgent)

const isPhoneNum = num => {
  return /^1\d{10}$/.test(num)
}
const getSession = key => JSON.parse(sessionStorage.getItem(key) || '{}')
const saveSession = (key, value) => sessionStorage.setItem(key, JSON.stringify(value))
const removeSession = key => sessionStorage.removeItem(key)

const uuid = () => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}

const URL2Obj = u =>
  u
    ? Object.assign(
      ...u
        .split('&')
        .filter(e => e)
        .map(e =>
          ((a, b) => ({
            [a]: b
          }))(...e.split('='))
        )
    )
    : {}
const Obj2URL = o =>
  Object.keys(o)
    .map(e => e + '=' + o[e])
    .join('&')
const observe = (obj, prop, fn = n => {}) => {
  let oldValue
  Object.defineProperty(obj, prop, {
    set (newValue) {
      oldValue = newValue
      fn(newValue)
    },
    get () {
      return oldValue
    }
  })
}

const post = data => {
  let el = document.getElementsByTagName('iframe')[0]
  let ctx = el.contentWindow
  ctx.postMessage(data, '*')
}
window.returnDecrypt = returnDecrypt

Api.config({
  // useMock: true,
  dataType: 'jsonp',
  urlModel: 1
})

const fuseSdkAjax = (...arg) => {
  loadingCom()
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = function (obj) {
    let { ct, ac } = obj
    let newObj = { ...obj }
    delete newObj.ac
    delete newObj.ct
    console.log('fuseSdkAjax__newObj', newObj)
    log(`${arg[0]}(input)`, arg[1])

    return {
      ct,
      ac,
      p: requestEncrypt(JSON.stringify(newObj), KEY).e,
      ts: KEY,
      is_jsdk: 1
    }
  }
  console.log('fuseSdkAjax_payload', payload)
  return new Promise((resolve, reject) => {
    window.Api.require(...payload)
      .then(res => {
        let loa = document.getElementById('loading')
        document.body.removeChild(loa)
        if (res.data && res.data.d) {
          res.data = JSON.parse(returnDecrypt(res.data.d, String(res.data.ts)).d)
        }
        if (res.code != 0) {
          // ... 错误处理

          showMsg(res.msg)
        }
        log(`${arg[0]}(res)`, res)
        resolve(res)
      })
      .catch(e => {
        log('FN._fuse_sdk_ajax error:', e)
      })
  })
}
const gowanSdkAjax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = function (obj) {
    console.log('gowanSdkAjax___obj', obj)
    let { ct, ac } = obj
    let newObj = { ...obj }
    delete newObj.ac
    delete newObj.ct

    log(`${arg[0]}(input)`, arg[1])

    return {
      ct,
      // ac,
      ...(ac ? {
        ac
      } : {}),
      p: requestEncrypt(JSON.stringify(newObj), KEY).e,
      ts: KEY,
      js: 1
    }
  }
  payload[2].domain = payload[2].domain || configUrl.__gowanapiDomain.get()
  console.log('gowanSdkAjax_payload', payload)
  return new Promise((resolve, reject) => {
    Api.require(...payload)
      .then(res => {
        if (res.data && res.data.d) {
          let str = returnDecrypt(res.data.d, String(res.data.ts)).d
          res.data = JSON.parse(str)
        }
        if (res.code != 0) {
          // ... 错误处理
          showMsg(res.msg)
        }
        log(`${arg[0]}(res)`, res)
        resolve(res)
      })
      .catch(e => {
        log('FN.ajax error:', e)
      })
  })
}
const ajax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = function (obj) {
    console.log('ajax_payload[2]-->obj', obj)
    let { ct, ac } = obj
    let newObj = { ...obj }
    delete newObj.ac
    delete newObj.ct
    log(`${arg[0]}(input)`, arg[1])

    return {
      ct,
      ac,
      p: requestEncrypt(JSON.stringify(newObj), KEY).e,
      ts: KEY,
      js: 1
    }
  }
  console.log('ajax_payload_payload', payload)
  return new Promise((resolve, reject) => {
    Api.require(...payload)
      .then(res => {
        if (res.data && res.data.d) {
          res.data = JSON.parse(returnDecrypt(res.data.d, String(res.data.ts)).d)
        }
        if (res.code !== 0) {
          // ... 错误处理
          // window.GLOBAL_API.showMsg(res.msg)
        }
        // log(`${arg[0]}(res)`,res)
        log(`${arg[0]}(res)`, res)
        resolve(res)
      })
      .catch(e => {
        log('FN.ajax error:', e)
      })
  })
}
// 改请求针对直接发起请求不需要带参数的情况（普通general请求函数）
const generalAjax = (...arg) => {
  let payload = [...arg]

  if (!payload[2]) payload[2] = {}
  var decode = false
  // 在payload[2]中如果有个decode字段 bool值为true，表示返回值是否需要解密，false - 则不用
  if (payload[2]['decode']) {
    decode = payload[2]['decode']
    delete payload[2]['decode']
  }

  return new Promise((resolve, reject) => {
    Api.require(...payload)
      .then(res => {
        if (decode) {
          if (res.data && res.data.d) {
            res.data = JSON.parse(returnDecrypt(res.data.d, String(res.data.ts)).d)
          }
          if (res.code != 0) {
            // ... 错误处理
            showMsg(res.msg)
          }
        }
        resolve(res)
      })
      .catch(e => {
        FN.log('FN.ajax error:', e)
      })
  })
}

const getRandomChar = (len, type) => {
  function getChar (chars) {
    return chars.charAt(Math.floor(Math.random() * chars.length))
  }
  let charsNum = '0123456789'
  let charsString = 'qwertyuiopasdfghjklzxcvbnm'
  let chars = '0123456789qwertyuiopasdfghjklzxcvbnm'

  let result = ''
  let useChars = ''

  if (type == 'string') {
    useChars = charsString
  } else if (type == 'number') {
    useChars = charsNum
  } else {
    useChars = chars
  }
  while (len--) {
    result += getChar(useChars)
  }
  return result
}

function inject (container, src, tag = 'iframe') {
  let context = document.createElement(tag)
  context.id = 'i-' + new Date().getTime()
  if (tag === 'link') {
    context.href = src
    context.rel = 'stylesheet'
  } else {
    context.src = src
  }
  document.querySelectorAll(container)[0].appendChild(context)
  return new Promise((resolve, reject) => {
    context.onload = () => resolve(context)
  })
}

function showMsg (txt = '', Autoclose = true) {
  let msg = document.createElement('div')
  msg.innerHTML = `
        <div className="msg" style="
        position: fixed;
        left:50%;
        top:50%;
        margin-left:-2rem;
        font-size: 0.28rem;
        padding: 0.2rem 0.3rem;
        border-radius: 0.08rem;
        background: rgba(0, 0, 0, 0.8);
        line-height: 1.5;
        text-align: center;
        width: 4rem;
        color: #fff;
        word-break:break-all;
        z-index:9999999";
        id="show_tip">
            ${txt}
        </div>
    `
  document.body.appendChild(msg)
  if (Autoclose) {
    setTimeout(() => {
      document.body.removeChild(msg)
    }, 1500)
  } else {
    document.getElementById('show_tip').parentNode.onclick = function () {
      document.body.removeChild(msg)
    }
  }
}
function log (...arg) {
  // if (getSession('init').debug) {
  //   console.log(...arg)
  // }
  console.log(...arg)
}
function hide () {

}

function loadingCom () {
  let loadingElent = document.createElement('div')
  let att = loadingElent.setAttribute('class', 'loading')
  let attId = loadingElent.setAttribute('id', 'loading')
  loadingElent.innerHTML =
`
  <div class="params" style="width:100%;height:100%;position: fixed;background:rgab(0,0,0,.3);">
    <div class="loading-com" style="
    width:1.25rem;
    height:1.25rem;
    top:50%;
    left: 50%;
    margin-left:-.625rem;
    margin-top:-.605rem;
    position: absolute;">
      <img src="https://h5game.gowan8.com/static/img/loading.gif" width="100%">
    </div>
  </div>
  `
  document.body.appendChild(loadingElent)
}
// 获取父节点。
const getParentNode = (item, parentClass) => {
  if (!item || item == document) return
  let temp = item.parentNode
  let parentNode = null
  while (temp != document) {
    if (temp.classList.contains(parentClass)) {
      parentNode = temp
      break
    }
    temp = temp.parentNode
  }
  return parentNode
}
/**
 * @key cookie名
 * @value cookie值
 * @options {expires: 7, domain, path} 一个对象设置cookie是过期时间，域名,路径
 * 使用示例:cookie('zjwl_key','123', {expires: 7, domain: 'gowanme.com'})
 * */
function cookie (key, value, options) {
  var extend = function () {
    var i = 0
    var result = {}
    for (; i < arguments.length; i++) {
      var attributes = arguments[ i ]
      for (var key in attributes) {
        result[key] = attributes[key]
      }
    }
    return result
  }
  var stringifyValue = function (value) {
    try {
      var c = JSON.stringify(value);
      /^[\{\[]/.test(c) && (value = c)
    } catch (e) {
    }
    return encodeURIComponent(value)
  }
  var read = function (s, converter) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    }
    var pluses = /\+/g
    s = decodeURIComponent(s.replace(pluses, ' '))
    if (/^[\{\[]/.test(s)) {
      s = JSON.parse(s)
    }
    return Object.prototype.toString.call(converter) == '[object Function]' ? converter(s) : s
  }

  // Write
  if (arguments.length > 1 && !(Object.prototype.toString.call(value) == '[object Function]')) {
    options = extend(options)
    if (typeof options.expires === 'number') {
      var days = options.expires
      var t = options.expires = new Date()
      t.setMilliseconds(t.getMilliseconds() + days * 864e+5)
    }

    return (document.cookie = [encodeURIComponent(key), '=', stringifyValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
      options.path ? '; path=' + options.path : '/', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''))
  }
  // Read
  var result = key ? undefined : {}
  var cookies = document.cookie ? document.cookie.split('; ') : []
  var l = cookies.length
  for (var i = 0; i < l; i++) {
    var parts = cookies[i].split('=')
    var name = decodeURIComponent(parts.shift())
    var c = parts.join('=')
    if (key === name) {
      result = read(c, value)
      break
    }
    // Prevent storing a cookie that we couldn't decode.
    if (!key && (c = read(c)) !== undefined) {
      result[name] = c
    }
  }
  return result
};
function getCookieAccount () {
  let zjwl_acc = cookie('zjwl_acc')
  if (typeof zjwl_acc === 'undefined') {
    return false
  }
  let zjwl_key = cookie('zjwl_key')
  let res = JSON.parse(FN.requestDecrypt(zjwl_acc, String(zjwl_key)).d)
  return res
}
export default {
  wrap (data) {
    return {
      statusCode: typeof data.statusCode === 'undefined' ? data.code : data.statusCode,
      status: typeof data.status === 'undefined' ? data.msg : data.status
    }
  },
  OS: {
    userAgent,
    isMobile,
    isAndroid,
    isIOS,
    isWX
  },
  uuid,
  isPhoneNum,
  getSession,
  saveSession,
  removeSession,
  observe,
  post,
  URL2Obj,
  Obj2URL,
  fuseSdkAjax,
  gowanSdkAjax,
  ajax,
  generalAjax,
  Api,
  getURLparams: () => URL2Obj(location.search.slice(1)),
  getLocal: key => JSON.parse(localStorage.getItem(key) || '{}'),
  saveLocal: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  removeLocal: key => localStorage.removeItem(key),
  cookie,
  getCookieAccount,
  requestEncrypt,
  requestDecrypt,
  returnDecrypt,
  inject,
  showMsg,
  hide,
  getRandomChar,
  getParentNode,
  log
}
