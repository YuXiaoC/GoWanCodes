import PS from "pubsub-js"
import Api from "api-mock-js"
import md5 from 'md5'

import { requestEncrypt, returnDecrypt, requestDecrypt } from "./fuse.auth"

import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()
if (!window.Api) window.Api = Api
if (!window.PS) window.PS = PS

const userAgent = navigator.userAgent.toLowerCase()

const isMobile = /mobile/i.test(userAgent)

const isAndroid = /android/i.test(userAgent)

const isIOS = /iphone|ipad|ipod/i.test(userAgent)

const isWX = /MicroMessenger/i.test(userAgent)

const getSession = key => JSON.parse(sessionStorage.getItem(key) || "{}")
const saveSession = (key, value) => sessionStorage.setItem(key, JSON.stringify(value))
const removeSession = key => sessionStorage.removeItem(key)



const uuid = () => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
}

const URL2Obj = u =>
  u
    ? Object.assign(
        ...u
          .split("&")
          .filter(e => e)
          .map(e =>
            ((a, b) => ({
              [a]: b
            }))(...e.split("="))
          )
      )
    : {}
const Obj2URL = o =>
  Object.keys(o)
    .map(e => e + "=" + o[e])
    .join("&")
const observe = (obj, prop, fn = n => {}) => {
  let oldValue
  Object.defineProperty(obj, prop, {
    set(newValue) {
      oldValue = newValue
      fn(newValue)
    },
    get() {
      return oldValue
    }
  })
}

const post = data => {
  let el = document.getElementsByTagName("iframe")[0]
  let ctx = el.contentWindow
  ctx.postMessage(data, "*")
}
window.returnDecrypt = returnDecrypt

const channelAjax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = obj => obj

  return new Promise((resolve, reject) => {
    window.Api.require(...payload)
      .then(res => {
        if (res.data && res.data.d) {
          res.data = JSON.parse(returnDecrypt(res.data.d, String(res.data.ts)).d)
        }
        if (res.code != 0) {
          // ... 错误处理
          // window.GLOBAL_API.showMsg(res.msg)
        }
        resolve(res)
      })
      .catch(e => {
        console.log("FN.ajax error:", e)
      })
  })
}
const ajax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = function(obj) {
    let { ct, ac } = obj
    let newObj = { ...obj }
    delete newObj.ac
    delete newObj.ct
    // FN.log(`${arg[0]}(input)`,arg[1])
	console.log(`${arg[0]}(input)`,arg[1])
    return {
      ct,
      ac,
      p: requestEncrypt(JSON.stringify(newObj), KEY).e,
      ts: KEY,
      js: 1
    }
  }
  return new Promise((resolve, reject) => {
    window.Api.require(...payload)
      .then(res => {
        if (res.data && res.data.d) {
          res.data = JSON.parse(returnDecrypt(res.data.d, String(res.data.ts)).d)
        }
        if (res.code != 0) {
          // ... 错误处理
          // window.GLOBAL_API.showMsg(res.msg)
        }
        // FN.log(`${arg[0]}(res)`,res)
        console.log(`${arg[0]}(res)`,res)
        resolve(res)
      })
      .catch(e => {
        console.log("FN.ajax error:", e)
      })
  })
}

function inject(container, src, tag = "iframe") {
  let context = document.createElement(tag)
  context.id = "i-" + new Date().getTime()
  if (tag === "link") {
    context.href = src
    context.rel = "stylesheet"
  } else {
  	context.src = src
  }
  document.querySelectorAll(container)[0].appendChild(context)
  return new Promise((resolve, reject) => {
    context.onload = () => resolve(context)
  })
}

function showMsg(txt = "") {
  let msg = document.createElement("div")
  msg.innerHTML = `
        <div className="msg" style="
        position: fixed;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        webkitTransform: translate(-50%,-50%);
        font-size: 0.28rem;
        padding: 0.2rem 0.3rem;
        border-radius: 0.08rem;
        background: rgba(0, 0, 0, 0.8);
        line-height: 1.5;
        text-align: center;
        width: 4rem;
        color: #fff;
        word-break:break-all;">
            ${txt}
        </div>
    `
  document.body.appendChild(msg)
  setTimeout(() => {
    document.body.removeChild(msg)
  }, 1500)
}

//提示弹框
function showTip(txt = "") {
  let msg = document.createElement("div");
  msg.style.position = 'relative';
  msg.style.height = '100%';
  msg.style.zIndex = '700';
  msg.innerHTML = `
        <div className="msg" id="show_tip" style="
        position: fixed;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        webkitTransform: translate(-50%,-50%);
        font-size: 0.28rem;
        padding: 0.2rem 0.3rem;
        border-radius: 0.08rem;
        background: rgba(0, 0, 0, 0.8);
        line-height: 1.5;
        text-align: center;
        width: 4.2rem;
        color: #fff;
        word-break:break-all;
        z-index:999">
            ${txt}
        </div>
    `
  document.body.appendChild(msg)
  document.getElementById('show_tip').parentNode.onclick = function(){
    document.body.removeChild(msg)
  }
  // setTimeout(() => {
  //   document.body.removeChild(msg)
  // }, 300000)
}

//微端支付链接判断,微端跳转支付宝和微信支付
function App_alipay(url){
  gowanWebview.clickZfb(url)
}
function App_wxpay(url){
  gowanWebview.clickWx(url)
}



export default {
  wrap(data) {
    return {
      statusCode: typeof data.statusCode == 'undefined'? data.code : data.statusCode,
      status: typeof data.status == 'undefined'? data.msg : data.status
    }
  },
  OS: {
    userAgent,
    isMobile,
    isAndroid,
    isIOS,
    isWX
  },
  md5,
  PS,
  Api,
  uuid,
  getSession,
  saveSession,
  removeSession,
  log: console.warn,
  warn: console.warn,
  observe,
  post,
  channelAjax,
  ajax,
  inject,
  URL2Obj,
  Obj2URL,
  getURLparams: () => URL2Obj(location.search.slice(1)),
  getLocal: key => JSON.parse(localStorage.getItem(key) || "{}"),
  saveLocal: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  removeLocal: key => localStorage.removeItem(key),
  requestEncrypt,
  requestDecrypt,
  returnDecrypt,
  showMsg,
  showTip,
  App_alipay,
  App_wxpay
}
