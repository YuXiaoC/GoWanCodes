console.log('feihuosdk.use.js')
let channelUseJsUrl = decodeURIComponent(decodeURI(FN.getURLparams().js_sdk))
console.log(FN.getURLparams())
let js_sdk_name = FN.getURLparams().js_sdk_name
FN.inject('head', channelUseJsUrl, 'script').then(() => {
  console.log('飞火的加载完毕')
  window[js_sdk_name].init()
})
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    let callbackRes = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(callbackRes)
  },
  login ({token, data = {}, callback}) {
    FN.log('融合登录')

    let header = {uid: FN.getURLparams().uid, time: FN.getURLparams().time, game_id: FN.getURLparams().game_id, js_sdk: channelUseJsUrl, js_sdk_name: FN.getURLparams().js_sdk_name, sign: FN.getURLparams().sign}
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          FN.saveSession('FUSE_USER_INFO', res.data)
          let callbackRes = {
            statusCode: 0,
            loginParams: res.data
          }
          callback(callbackRes)
          window.__ext__ = res.data
        } else {
          let callbackRes = {
            statusCode: res.code,
            status: res.msg
          }
          callback(callbackRes)
        }
      })
    } else {
      let callbackRes = {
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      }
      callback(callbackRes)
    }
  },
  recharge ({token, data = {}, callback}) {
    window[js_sdk_name].pay({
      'server_id': data.serverId,
      'server_name': data.serverName,
      'role_id': data.roleId,
      'role_name': data.roleName,
      'goods_id': data.cpProductId,
      'goods_name': data.chargeDesc,
      'uid': FN.getURLparams().uid,
      'money': data.amount / 100,
      'order_id': data.order_id,
      'ext': data.ext.ext,
      'time': data.ext.time,
      'sign': data.ext.game_sign
    })

    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      let callbackRes = {
        statusCode: 0,
        status: {orderId: data.order_id}
      }
      callback(callbackRes)
    } else {
      let callbackRes = {
        statusCode: 0,
        status: '调用支付成功'
      }
      callback(callbackRes)
    }
  },
  getEXT (data) {
    /* 作为拓展参数发送,下单 */
    window.__payData__ = {
      'server_id': data.serverId,
      'server_name': data.serverName,
      'role_id': data.roleId,
      'role_name': data.roleName,
      'goods_id': data.cpProductId,
      'goods_name': data.chargeDesc,
      'uid': FN.getURLparams().uid,
      'amount': data.amount / 100
    }
    return window.__payData__
  },
  /*
  shareToArk ({token, data = {}, callback}) {
    window[js_sdk_name].showShare(function () {
      let callbackRes = {
        statusCode: 0,
        aioType: 4, // 1: 个人  4:群聊
        status: '分享成功'
      }
      callback(callbackRes)
    })
  }
  */
}
