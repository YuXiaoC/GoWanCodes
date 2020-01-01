FN.log('duokusdk.use.js init success!')

window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    let cbData = {statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)}
    callback(cbData)
  },
  login ({ token, data = {}, callback }) {
    console.log('--------------------------------->')
    let AccessToken = FN.getURLparams().accessToken
    console.log('登录信息', AccessToken)
    let header = {AccessToken: AccessToken}
    let ext_header = {}
    window.FUSESDK.login({
      ext: JSON.stringify(ext_header),
      data: JSON.stringify(header)
    }).then(res => {
      if (res.code === 0) {
        FN.saveSession('FUSE_USER_INFO', res.data)
        let loginParams = res.data
        loginParams.userName = res.data.ext.UserName
        // 实例化渠道sdk
        window.dk_sdk.ready({
          zIndex: 99999,
          pin: 0
        }, function () {
          // sdk已经加载完成，可执行游戏的初始化逻辑
        })
        let cbData = {
          statusCode: 0,
          loginParams: loginParams
        }
        callback(cbData)
      } else {
        let cbData = {
          statusCode: res.code,
          status: res.msg
        }
        callback(cbData)
        dk_sdk.reload()
      }
    })
  },
  recharge ({token, data = {}, callback}) {
    console.log('服务端下单后返回信息', data)

    let OrderInfo = {
      'AppID': data.ext.AppID,
      'OrderID': data.order_id,
      'Product': data.productName,
      'Money': (data.amount) / 100,
      'UID': data.fuseParams.user_id,
      'Channel': FN.getSession('FUSE_CHANNEL_INFO').channel,
      'UserName': FN.getSession('FUSE_USER_INFO').ext.UserName,
      'AccessToken': dk_sdk.getAccessToken().AccessToken,
      'Timestamp': data.ext.Timestamp,
      'Signature': data.ext.Signature
    }
    console.log(OrderInfo)
    dk_sdk.pay(OrderInfo)

    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      let cbData = {
        statusCode: 0,
        status: {orderId: data.order_id}
      }
      callback(cbData)
    } else {
      let cbData = {
        statusCode: 0,
        status: '调用支付成功'
      }
      callback(cbData)
    }
  },
  getEXT (data) {
    /* 作为拓展参数发送,下单 */
    window.__payData__ = {
      AccessToken: dk_sdk.getAccessToken().AccessToken
    }
    return window.__payData__
  }
}
