// import { Promise } from 'es6-promise-polyfill'

// if (!window.Promise) {
//     window.Promise = Promise
// }

import CC from "../common/cross.callback"

const METHODS = [
  "init",
  "login",
  "changeAccount",
  "recharge",

  "createRole",
  "changeRole",
  "upgradeRole",

  "getUserID",
  "getPTID",
  "getFromID",

  "getGameID",

  "goToGM",
  "checkRealNameAuth",
  "checkBindPhone",

  "goToBindPhone",
  "goToUserCenter",
  "flymeChangeAccount",

  "loginResponse",

  "isApp",
  "isWeb"
]

function addEventCallback(event, fn) {
  let el = window.kkkSDK.eventList
  if (Array.isArray(el[event])) {
    el[event].push(fn)
  } else {
    el[event] = [fn]
  }
  return runFunctionList(el[event])
}

function runFunctionList(fnList) {
  return res => {
    for (let i = 0; i < fnList.length; i++) {
      fnList[i](res)
    }
  }
}

window.kkkSDK = {
  eventList : {},
  callback: {},
  off(event) {

  },
  on(event, fn) {
    let handle = () => {
      window.kkkSDK.one(event, res => {
        fn(res)

        setTimeout(() => {
          handle()
        }, 0)
      })
    }
    handle()
  },
  one(event, fn) {
    let exist = !!window.kkkSDK.eventList[event]

    window.kkkSDK.callback[event] = addEventCallback(event, fn)
    if (!exist) {
      window.kkkSDK[event]().then(res => {
        window.kkkSDK.eventList[event] = null
        window.kkkSDK.callback[event](res)
      })
    }
  },
  listen(event, fn, live = false) {
    let handle = () => {
      CC('listen')({
        event
      }).then(res => {
        fn(res)
        if (live) {
          handle()
        }
      })
    }
    handle()
  }
}


METHODS.forEach(e => {
  window.kkkSDK[e] = (config = {}) => {
    return new Promise((resolve, reject) => {
      CC(e)(config).then(res => {   // 跨域 通过ifram传递信息给useH5.js
        resolve(res)
      })
    })
  }
})

// function inject(container, src, tag = "iframe") {
//   let context = document.createElement(tag)
//   context.id = "i-" + new Date().getTime()
//   context.src = src
//   document.querySelectorAll(container)[0].appendChild(context)
//   return new Promise((resolve, reject) => {
//     context.onload = () => resolve(context)
//   })
// }
//
// inject('body', 'http://ptstatic.3k.com/vconsole.min.js', 'script')
