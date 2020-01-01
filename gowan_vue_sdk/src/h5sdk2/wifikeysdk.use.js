// wifikey游戏正式地址http://h5game.gowan8.com?yisdk_param=m55hqtTdytnJ7A%3D%3D&ext_param=a5ho
FN.log('wifikeysdk.use.js')
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    callback({
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    })
  },
  login ({ token, data = {}, callback }) {
    let params = FN.getURLparams() // 获取链接参数
    FN.log('header-header-header2', params)
    let gameid = FN.getSession('FUSE_CHANNEL_INFO').game_id
    let deviceid = 'H5'
    let g_token = params.token
    let channel = FN.getSession('FUSE_CHANNEL_INFO').channel
    let header = {gameid, deviceid, token: g_token, channel} // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    FN.log('if1111', header)

    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        FN.log('header-header-header4', res)
        if (res.code === 0) {
          // 存储当前渠道用户信息
          FN.saveSession('FUSE_USER_INFO', res.data)
          // 回传给CP
          callback({
            statusCode: 0,
            loginParams: res.data
          })
          window.__ext__ = res.data
        } else {
          callback({
            statusCode: res.code,
            status: res.msg
          })
        }
      })
    } else {
      callback({
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      })
    }
  },

  recharge ({token, data = {}, callback}) {
    console.log('支付信息', data)
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      callback({
        statusCode: 0,
        status: {orderId: data.order_id}
      })
    } else {
      // callback({
      //   statusCode: 0,
      //   status: '调用支付成功'
      // })
    }
    window.top.location = data.ext.url
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    window.__payData__ = {
      'channel_game': FN.getSession('FUSE_USER_INFO').ext.channel_game,
      'reserved': FN.getSession('FUSE_USER_INFO').ext.reserved,
      'body': data.productName
    }
    return window.__payData__
  },
  shareToArk ({token, data = {}, callback}) {
    callback({
      statusCode: 0,
      aioType: 4, // 1: 个人  4:群聊
      status: '分享成功'
    })
  },

  videoAd ({token, data = {}, callback}) {
    callback({
      statusCode: 0,
      status: '观看完成'
    })
  }
}
