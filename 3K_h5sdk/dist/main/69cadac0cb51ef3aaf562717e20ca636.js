require = (function(r, e, n) {
  function t(n, o) {
    function i(r) {
      return t(i.resolve(r))
    }
    function f(e) {
      return r[n][1][e] || e
    }
    if (!e[n]) {
      if (!r[n]) {
        var c = "function" == typeof require && require
        if (!o && c) return c(n, !0)
        if (u) return u(n, !0)
        var l = new Error("Cannot find module '" + n + "'")
        throw ((l.code = "MODULE_NOT_FOUND"), l)
      }
      i.resolve = f
      var a = (e[n] = new t.Module())
      r[n][0].call(a.exports, i, a, a.exports)
    }
    return e[n].exports
  }
  function o() {
    ;(this.bundle = t), (this.exports = {})
  }
  var u = "function" == typeof require && require
  ;(t.Module = o), (t.modules = r), (t.cache = e), (t.parent = u)
  for (var i = 0; i < n.length; i++) t(n[i])
  return t
})(
  {
    15: [
      function(require, module, exports) {
        "use strict"
        Object.defineProperty(exports, "__esModule", { value: !0 })
        var e = require("babel-runtime/regenerator"),
          n = o(e),
          t = require("babel-runtime/helpers/asyncToGenerator"),
          i = o(t),
          r = require("babel-runtime/core-js/json/stringify"),
          u = o(r),
          c = require("babel-runtime/core-js/promise"),
          a = o(c),
          l = require("../common/fn"),
          s = o(l)
        function o(e) {
          return e && e.__esModule ? e : { default: e }
        }
        var b = s.default.PS,
          d = s.default.log
        function f(e) {
          if (window.WebViewJavascriptBridge) return e(WebViewJavascriptBridge)
          if (window.WVJBCallbacks) return window.WVJBCallbacks.push(e)
          window.WVJBCallbacks = [e]
          var n = document.createElement("iframe")
          ;(n.style.display = "none"),
            (n.src = "https://__bridge_loaded__"),
            document.documentElement.appendChild(n),
            setTimeout(function() {
              document.documentElement.removeChild(n)
            }, 0)
        }
        function p() {
          arguments.length > 0 && void 0 !== arguments[0] && arguments[0]
          return new a.default(function(e, n) {
            s.default.OS.isIOS
              ? (b.subscribe("initWebView", function(n, t) {
                  e()
                }),
                setTimeout(function() {
                  n()
                }, 100))
              : e()
          })
        }
        function h(e) {
          switch (Number(e.type)) {
            case 1:
              b.publish("client.init", e)
              break
            case 2:
              b.publish("client.login", e)
              break
            case 3:
              b.publish("client.changeAccount", e)
              break
            case 4:
              b.publish("client.recharge", e)
              break
            case 5:
              b.publish("client.createRole", e)
              break
            case 6:
              b.publish("client.changeRole", e)
              break
            case 7:
              b.publish("client.upgradeRole", e)
              break
            case 8:
              b.publish("client.getUserID", e)
              break
            case 9:
              b.publish("client.getPTID", e)
              break
            case 10:
              b.publish("client.getFromID", e)
              break
            case 11:
              b.publish("client.goToGM", e)
              break
            case 12:
              b.publish("client.checkRealNameAuth", e)
              break
            case 13:
              b.publish("client.checkBindPhone", e)
              break
            case 14:
              b.publish("client.goToBindPhone", e)
              break
            case 15:
              b.publish("client.goToUserCenter", e)
              break
            case 16:
              b.publish("client.flymeChangeAccount", e)
              break
            default:
              b.publish("client.null", e)
          }
        }
        function w(e) {
          s.default.OS.isIOS
            ? WebViewJavascriptBridge.callHandler("JsToOC", e)
            : window.BRIDGE.H5CallClient((0, u.default)(e))
        }
        f(function(e) {
          setTimeout(function() {
            b.publish("initWebView", { bridge: e })
          }, 0)
        }),
          (window.PS = b),
          (exports.default = {
            setup: (function() {
              var e = (0, i.default)(
                n.default.mark(function e() {
                  return n.default.wrap(
                    function(e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              window.BRIDGE || (window.BRIDGE = {}),
                              e.abrupt(
                                "return",
                                p()
                                  .then(function() {
                                    s.default.OS.isIOS
                                      ? WebViewJavascriptBridge.registerHandler(
                                          "MesFromOC",
                                          function(e) {
                                            h(e)
                                          }
                                        )
                                      : (window.BRIDGE.clientCallH5 = function(e) {
                                          h(JSON.parse(e))
                                        })
                                  })
                                  .catch(function(e) {
                                    s.default.log("Client.setup:", e)
                                  })
                              )
                            )
                          case 2:
                          case "end":
                            return e.stop()
                        }
                    },
                    e,
                    this
                  )
                })
              )
              return function() {
                return e.apply(this, arguments)
              }
            })(),
            listen: function(e) {
              var n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : function(e) {
                      return e
                    }
              b.subscribe("client." + e, function(e, t) {
                return n(t)
              })
            },
            emit: function(e) {
              var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
              return new a.default(function(t, i) {
                b.subscribeOnce("client." + e, function(e, n) {
                  return t(n)
                }),
                  w(n)
              })
            }
          })
      },
      {
        "babel-runtime/regenerator": 47,
        "babel-runtime/helpers/asyncToGenerator": 49,
        "babel-runtime/core-js/json/stringify": 63,
        "babel-runtime/core-js/promise": 50,
        "../common/fn": 14
      }
    ],
    48: [
      function(require, module, exports) {
        "use strict"
        exports.__esModule = !0
        var e = require("../core-js/object/assign"),
          r = t(e)
        function t(e) {
          return e && e.__esModule ? e : { default: e }
        }
        exports.default =
          r.default ||
          function(e) {
            for (var r = 1; r < arguments.length; r++) {
              var t = arguments[r]
              for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
            }
            return e
          }
      },
      { "../core-js/object/assign": 51 }
    ],
    40: [
      function(require, module, exports) {
        "use strict"
        Object.defineProperty(exports, "__esModule", { value: !0 })
        var e = require("babel-runtime/helpers/extends"),
          t = a(e)
        function a(e) {
          return e && e.__esModule ? e : { default: e }
        }
        function r() {
          var e = [
              { roleid: 1 + new Date().getTime(), intimacy: 0, nexusId: 0, nexusName: "" },
              { roleid: 2 + new Date().getTime(), intimacy: 0, nexusId: 0, nexusName: "" },
              { roleid: 3 + new Date().getTime(), intimacy: 0, nexusId: 0, nexusName: "" }
            ],
            a = {
              roleId: new Date().getTime(),
              roleName: "梵蒂冈",
              roleLevel: "80",
              serverId: "5566",
              serverName: "啦啦啦",
              vipLevel: "90"
            },
            r = (0, t.default)({}, a, {
              userMoney: "9000",
              roleCTime: new Date().getTime(),
              gender: "",
              professionId: 0,
              profession: "僵尸",
              power: 0,
              partyid: "4444",
              partyname: "okok",
              partyroleid: 0,
              partyrolename: "tTTt",
              friendList: e
            })
          return {
            "type-1": {
              isLandscape: !1,
              floatLocation: 0,
              rate: 100,
              productName: "金币",
              debug: !0
            },
            "type-2": {},
            "type-3": {},
            "type-4": (0, t.default)(
              {
                amount: 600,
                productId: "StardustRomance3K60",
                productName: "60个水晶",
                callbackURL: location.href,
                callbackInfo: "888",
                chargeDesc: "......",
                chargeMount: 100,
                rate: 300,
                lastMoney: "900"
              },
              a,
              { sociaty: "适当" }
            ),
            "type-5": (0, t.default)({}, r),
            "type-6": (0, t.default)({}, r),
            "type-7": (0, t.default)({}, r),
            "type-8": {},
            "type-9": {},
            "type-10": {},
            "type-11": { url: "http://3k.com" },
            "type-12": {},
            "type-13": {},
            "type-14": {},
            "type-15": {}
          }
        }
        exports.default = r
      },
      { "babel-runtime/helpers/extends": 48 }
    ],
    12: [
      function(require, module, exports) {
        "use strict"
        var e = require("../client/client.sdk"),
          n = l(e),
          t = require("../common/fn"),
          o = l(t),
          a = require("../client/jsCallClient.data"),
          c = l(a)
        function l(e) {
          return e && e.__esModule ? e : { default: e }
        }
        console.log("I am useClient")
        var u = {
          init: 1,
          login: 2,
          changeAccount: 3,
          recharge: 4,
          createRole: 5,
          changeRole: 6,
          upgradeRole: 7,
          getUserID: 8,
          getPTID: 9,
          getFromID: 10,
          goToGM: 11,
          checkRealNameAuth: 12,
          checkBindPhone: 13,
          goToBindPhone: 14,
          goToUserCenter: 15
        }
        window.CLIENTSDK = {}
        var g = ["login", "changeAccount", "recharge", "flymeChangeAccount"],
          i = ["init", "getUserID", "getPTID", "getFromID", "checkRealNameAuth", "checkBindPhone"],
          r = ["createRole", "changeRole", "upgradeRole"],
          d = ["goToGM", "goToBindPhone", "goToUserCenter"],
          f = [].concat(g, i, r, d)
        f.forEach(function(e) {
          window.CLIENTSDK[e] = function(t, a) {
            o.default.log("now all", e, t, a),
              n.default
                .emit(e, { type: u[e], data: a[0] })
                .then(function(e) {
                  o.default.post({ type: "CC", token: t, payload: e })
                })
                .catch(function(e) {
                  o.default.warn("Client.emit:", e)
                })
          }
        })
        var h = (0, c.default)()
        n.default.listen("login", function(e) {
          o.default.log("I am login", e), o.default.log("login 成功")
        }),
          n.default.listen("changeAccount", function(e) {
            o.default.log("I am changeAccount", e), o.default.log("changeAccount 成功")
          }),
          n.default.listen("flymeChangeAccount", function(e) {
            o.default.log("I am flymeChangeAccount", e),
              o.default.log("flymeChangeAccount 成功"),
              n.default.emit("changeAccount", { type: 3, data: h["type-3"] })
          })
      },
      { "../client/client.sdk": 15, "../common/fn": 14, "../client/jsCallClient.data": 40 }
    ]
  },
  {},
  [12]
)
