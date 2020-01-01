function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement("iframe")
  WVJBIframe.style.display = "none"
  WVJBIframe.src = "https://__bridge_loaded__"
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

function setupClientContext(fn = b => b) {
  return new Promise((resolve, reject) => {
    if (FN.OS.isIOS) {
      // client mock begin
      /*
      window.WebViewJavascriptBridge = {}
      window.WebViewJavascriptBridge.registerHandler = (sign, fn) => {
        PS.subscribe('registerHandler', (msg, data) => {
          fn(data)
        })
      }
      window.WebViewJavascriptBridge.callHandler = (sign, data) => {
        PS.publish('registerHandler', data)
      }
      setTimeout(() => {
        PS.publish('registerHandler', {
          type: '16',
          data: {
            statusCode: 0
          }
        })
      }, 2000)
      setTimeout(() => {
        PS.publish('registerHandler', {
          type: '2',
          data: {
            statusCode: 0,
            loginParams: {
              test: 222
            }
          }
        })
      }, 3000)
      setTimeout(() => {
        PS.publish('registerHandler', {
          type: '2',
          data: {
            statusCode: 0,
            loginParams: {
              test: 444
            }
          }
        })
      }, 5000)
      return resolve()
      // client mock end */

      PS.subscribe("initWebView", (msg, data) => {
        resolve()
      })
      setupWebViewJavascriptBridge(function(bridge) {
        setTimeout(() => {
          // FN.log('iOS client init callback')
			console.log('iOS client init callback')
          PS.publish("initWebView", {
            bridge
          })
        }, 0)
      })
      // for H5
      setTimeout(() => {
        reject()
      }, 500)
    } else {
      // client mock begin
      /*
      window.BRIDGE.H5CallClient = json => window.BRIDGE.clientCallH5(JSON.stringify(json))
      return resolve()
      // client mock end */

      resolve()
    }
  })
}

function publish(data) {
  // FN.log('client>>>',data)
  switch (Number(data.type)) {
    case 1:
      PS.publish("client.init", data)
      break
    case 2:
      PS.publish("client.login", data)
      break
    case 3:
      PS.publish("client.changeAccount", data)
      break
    case 4:
      PS.publish("client.recharge", data)
      break
    case 5:
      PS.publish("client.createRole", data)
      break
    case 6:
      PS.publish("client.changeRole", data)
      break
    case 7:
      PS.publish("client.upgradeRole", data)
      break
    case 8:
      PS.publish("client.getUserID", data)
      break
    case 9:
      PS.publish("client.getPTID", data)
      break
    case 10:
      PS.publish("client.getFromID", data)
      break
    case 11:
      PS.publish("client.goToGM", data)
      break
    case 12:
      PS.publish("client.checkRealNameAuth", data)
      break
    case 13:
      PS.publish("client.checkBindPhone", data)
      break
    case 14:
      PS.publish("client.goToBindPhone", data)
      break
    case 15:
      PS.publish("client.goToUserCenter", data)
      break
    case 16:
      PS.publish("client.flymeChangeAccount", data)
      break
    case 17:
      PS.publish("client.getGameID", data)
      break
    default:
      PS.publish("client.null", data)
      break
  }
}

function callHandler(data) {
  if (FN.OS.isIOS) {
    // FN.log('you call', data)
	console.log('you call', data)
    WebViewJavascriptBridge.callHandler("JsToOC", data)
  } else {
    // FN.log('you call', data)
	console.log('you call', data)
    window.BRIDGE.H5CallClient(JSON.stringify(data))
  }
}

export default {
  setup() {
    return new Promise((resolve, reject) => {
      if (!window.BRIDGE) {
        window.BRIDGE = {}
      }
      setupClientContext().then(() => {
        if (FN.OS.isIOS) {
          WebViewJavascriptBridge.registerHandler("MesFromOC", data => {
            publish(data)
          })
        } else {
          window.BRIDGE.clientCallH5 = data => {
            publish(JSON.parse(data))
          }
        }
        resolve()
      }).catch(e => {
        // FN.log("use H5")
			console.log("use H5")
        resolve()
      })
    })
  },
  listen(event, callback = n => n) {
    PS.subscribe(`client.${event}`, (msg, data) => callback(data))
  },
  emit(event, payload = {}) {
    return new Promise((resolve, reject) => {
      PS.subscribeOnce(`client.${event}`, (msg, data) => {
        resolve(data)
      })
      callHandler(payload)
    })
  },
  callHandler
}
