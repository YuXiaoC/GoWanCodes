FN.log('caiyusdk.use.js init success!')

window.SDKDATA = {}
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    callback({
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    })
  },
  login ({ token, data = {}, callback }) {
    console.log('--------------------------------->')
    console.log('登录信息', FN.getURLparams())

    let LoginInfo = FN.getURLparams()
    delete LoginInfo.yisdk_param
    delete LoginInfo.ext_param
    let header = {data: LoginInfo}
    let ext_header = {}
    window.FUSESDK.login({
      ext: JSON.stringify(ext_header),
      data: JSON.stringify(header)
    }).then(res => {
      if (res.code === 0) {
        FN.saveSession('FUSE_USER_INFO', res.data)
        let loginParams = res.data
        loginParams.userName = res.data.ext.UserName
        callback({
          statusCode: 0,
          loginParams: loginParams
        })
      } else {
        callback({
          statusCode: res.code,
          status: res.msg
        })
      }
    })
  },
  roleLogin ({token, data = {}, callback}) {
    console.log('角色信息:', data)
    let roleData = {
      'user_id': FN.getURLparams().user_id,
      'game_appid': FN.getURLparams().game_appid,
      'server_id': data.server_id,
      'server_name': data.server_name,
      'role_id': data.role_id,
      'role_name': data.role_name,
      'level': data.level,
      'sign': FN.getURLparams().sign
    }
    xgGame.jointCreateRole(roleData)
  },
  shareToArk ({token, data = {}, callback}) {
    let shareInfo = {
      'game_appid': FN.getURLparams().game_appid,
      'title': FN.getSession('FUSE_CHANNEL_INFO').game_name,
      'desc': data.summary
    }

    xgGame.shareTips({
      game_appid: FN.getURLparams().game_appid
    }, function (data) {

    })
    xgGame.shareSdk({
      game_appid: shareInfo.game_appid,
      title: shareInfo.title,
      desc: data.summary
    }, function (data) { // 分享结果status 1 分享成功0 分享失败
      if (data.status == 1) {
        callback({
          statusCode: 0,
          aioType: 4, // 1: 个人  4:群聊
          status: '分享成功'
        })
      } else {
        // 分享失败
        callback({
          statusCode: 1,
          status: '分享失败/用户取消分享'
        })
      }
    })
  },
  recharge ({token, data = {}, callback}) {
    console.log('服务端下单后返回信息', data)
    let OrderInfo = {
      'game_appid': FN.getURLparams().game_appid,
      'trade_no': data.order_id,
      'props_name': data.productName,
      'amount': data.amount,
      'user_id': FN.getSession('FUSE_USER_INFO').user_id,
      'channelExt': FN.getURLparams().channelExt,
      'sdkloginmodel': FN.getURLparams().sdkloginmodel,
      'sign': data.ext.game_sign,
      'server_id': data.fuseParams.server_id,
      'server_name': data.fuseParams.server_name,
      'role_id': data.fuseParams.role_id,
      'role_name': data.fuseParams.role_name
    }
    console.log('OrderInfo', OrderInfo)
    // dk_sdk.pay(OrderInfo)
    xgGame.h5paySdk({
      'game_appid': FN.getURLparams().game_appid,
      'trade_no': data.order_id,
      'props_name': data.productName,
      'amount': data.amount,
      'user_id': FN.getSession('FUSE_USER_INFO').user_id,
      'channelExt': FN.getURLparams().channelExt,
      'sdkloginmodel': FN.getURLparams().sdkloginmodel,
      'sign': data.ext.game_sign,
      'server_id': data.fuseParams.server_id,
      'server_name': data.fuseParams.server_name,
      'role_id': data.fuseParams.role_id,
      'role_name': data.fuseParams.role_name
    }, function (data) { console.log('sdk支付', data) })

    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      callback({
        statusCode: 0,
        status: {orderId: data.order_id}
      })
    } else {
      callback({
        statusCode: 0,
        status: '调用支付成功'
      })
    }
  },
  getEXT (data) {
    console.log(data)
    /* 作为拓展参数发送,下单 */
    window.__payData__ = {
      'game_appid': FN.getURLparams().game_appid,
      'sdkloginmodel': FN.getURLparams().sdkloginmodel,
      'channelExt': FN.getURLparams().channelExt,
      'props_name': data.productName
    }
    return window.__payData__
  }
}
