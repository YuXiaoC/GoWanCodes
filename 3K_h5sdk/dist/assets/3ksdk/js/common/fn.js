import PS from "pubsub-js"
import Api from "api-mock-js"
// import Api from './api'

import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

import { requestEncrypt, returnDecrypt, requestDecrypt } from "../../../../js/common/fuse.auth"

const transformArray = fakeArray => {
  return Array.prototype.slice.call(fakeArray)
}

const getCss = function(o, key) {
  return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key]
}

const floatBallAutoAdjust = target => {
  let nowLeft = parseFloat(getCss(target, "left"))
  let targetW = parseFloat(getCss(target, "width"))

  target.classList = 'show'
  clearTimeout(window.floatBallTimeoutId)
  window.floatBallTimeoutId = setTimeout(() => {
    target.classList.add("transtion")
    if (nowLeft + targetW / 2 > window.innerWidth / 2) {
      target.style.left = window.innerWidth - targetW + "px"
      target.classList.add("reverse")
    } else {
      target.style.left = 0
    }

    window.floatBallTimeoutId = setTimeout(() => {
      target.classList.add("fade")

      window.floatBallTimeoutId = setTimeout(() => {
        target.classList.add("sleep")
      }, 3000)
    }, 2000)
  }, 2000)
}

const startDrag = (source, target) => {
  // source触发拖拽节点， target移动节点
  source.addEventListener("touchstart", e => {
    startDrag.params.offsetX =
      (e.clientX || e.touches[0].clientX) - parseFloat(getCss(target, "left"))
    startDrag.params.offsetY =
      (e.clientY || e.touches[0].clientY) - parseFloat(getCss(target, "top"))
    startDrag.params.targetW = parseFloat(getCss(target, "width"))
    startDrag.params.targetH = parseFloat(getCss(target, "height"))
    startDrag.params.flag = true

    target.className = "show"
    clearTimeout(window.floatBallTimeoutId)
  })
  source.addEventListener("click", e => {
    startDrag.params.flag = false
    floatBallAutoAdjust(target)
  })
  if (!startDrag.params.hasBindDocument) {
    startDrag.params.hasBindDocument = true
    document.body.addEventListener("touchend", e => {
      if (!startDrag.params.hasMove) return
      let nowLeft = parseFloat(target.style.left)
      let nowTop = parseFloat(target.style.top)
      if (nowLeft + startDrag.params.targetW > window.innerWidth) {
        target.style.left = window.innerWidth - startDrag.params.targetW + "px"
      } else if (nowLeft < 0) target.style.left = 0
      if (nowTop + startDrag.params.targetH > window.innerHeight) {
        target.style.top = window.innerHeight - startDrag.params.targetW + "px"
      } else if (nowTop < 0) {
        target.style.top = 0
      }
      setTimeout(() => {
        // alert(111)
        startDrag.params.flag = false
        startDrag.params.hasMove = false
      }, 100)

      floatBallAutoAdjust(target)
    })
    document.body.addEventListener("touchmove", e => {
      if (startDrag.params.flag) {
        clearTimeout(window.floatBallTimeoutId)
        target.className = "show"

        startDrag.params.hasMove = true
        let nowX = e.clientX || e.touches[0].clientX
        let nowY = e.clientY || e.touches[0].clientY
        target.style.left = nowX - startDrag.params.offsetX + "px"
        target.style.top = nowY - startDrag.params.offsetY + "px"
      }
    })
  }
}

startDrag.params = {
  offsetX: 0, // 点击处与目标left偏差
  offsetY: 0,
  flag: false,
  hasMove: false,
  hasBindDocument: false
}

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

const isPhoneNum = num => {
  return /^1\d{10}$/.test(num)
}

const isPassword = pwd => {
  return /^[0-9a-zA-z]{6,20}$/.test(pwd)
}

const userAgent = navigator.userAgent.toLowerCase()

const isMobile = /mobile/i.test(userAgent)

const isAndroid = /android/i.test(userAgent)

const isIOS = /iphone|ipad|ipod/i.test(userAgent)

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
          window.GLOBAL_API.showMsg(res.msg)
        }
        resolve(res)
      })
      .catch(e => {
        console.log("FN.ajax error:", e)
      })
  })
}

const _3k_sdk_ajax = (...arg) => {
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
      // ac,
      ...(ac ? {
        ac
      } : {}),
      p: FN.requestEncrypt(JSON.stringify(newObj), KEY).e,
      ts: KEY,
      js: 1
    }
  }
  payload[2].domain = payload[2].domain || window.__3kapiDomain.get()
  return new Promise((resolve, reject) => {
    // FN.log('3KSDK:', ...payload)
    window.Api.require(...payload)
      .then(res => {
        if (res.data && res.data.d) {
          let str = returnDecrypt(res.data.d, String(res.data.ts)).d
          res.data = JSON.parse(str)
        }
        if (res.code != 0) {
          // ... 错误处理
          window.GLOBAL_API.showMsg(res.msg)
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
  context.src = src
  document.querySelectorAll(container)[0].appendChild(context)
  return new Promise((resolve, reject) => {
    context.onload = () => resolve()
  })
}

const getRandomChar = (len, type) => {
  function getChar(chars) {
    return chars.charAt(Math.floor(Math.random() * chars.length))
  }
  let charsNum = "0123456789"
  let charsString = "qwertyuiopasdfghjklzxcvbnm"
  let chars = "0123456789qwertyuiopasdfghjklzxcvbnm"

  let result = ""
  let useChars = ""

  if (type == "string") {
    useChars = charsString
  } else if (type == "number") {
    useChars = charsNum
  } else {
    useChars = chars
  }
  while (len--) {
    result += getChar(useChars)
  }
  return result
}

export default {
  OS: {
    userAgent,
    isMobile,
    isAndroid,
    isIOS
  },
  PS,
  Api,
  uuid,
  getSession,
  saveSession,
  removeSession,
  transformArray,
  floatBallAutoAdjust,
  startDrag,
  getParentNode,
  isPhoneNum,
  isPassword,
  log: console.warn,
  warn: console.warn,
  observe,
  post,
  ajax,
  _3k_sdk_ajax,
  inject,
  getURLparams: () => URL2Obj(location.search.slice(1)),
  getLocal: key => JSON.parse(localStorage.getItem(key) || "{}"),
  saveLocal: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  removeLocal: key => localStorage.removeItem(key),
  requestEncrypt,
  returnDecrypt,
  requestDecrypt,
  getRandomChar
}
