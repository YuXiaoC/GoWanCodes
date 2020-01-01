// 游戏测试地址http://down.youxifan.com/SebOpMc
FN.log('yxfansdk.use.js')
window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    let cpData = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(cpData)
  },

  login ({ token, data = {}, callback }) {
    // 渠道登录方法在这里调用
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
          let cbData = {
            statusCode: 0,
            loginParams: res.data
          }
          callback(cbData)
          window.__ext__ = res.data
        } else {
          let cbData = {
            statusCode: res.code,
            status: res.msg
          }
          callback(cbData)
        }
      })
    } else {
      let cbData = {
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      }
      callback(cbData)
    }
  },

  recharge ({token, data = {}, callback}) {
    console.log('支付信息', data)
    let gameName = FN.getSession('FUSE_CHANNEL_INFO').game_name
    let gameID = FN.getSession('FUSE_CHANNEL_INFO').game_id
    let cpData = data
    // FN.log('user_info77777777777', cpData.ext.sign)
    var paydata = {
      amount: data.amount / 100, // 金额(元，最低一元)
      roleid: data.roleId, // 游戏角色id
      serverid: data.serverId, // 充值服务器id
      productname: gameName, // 充值的游戏名称
      attach: encodeURIComponent(gameID + '||' + cpData.order_id) // 附加参数，在支付回调原样返回，string，可选
    }
    console.log('paydata', paydata)
    YXFH5SDK.openPay(paydata)
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      let cbData = {
        statusCode: 0,
        status: {orderId: cpData.order_id}
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

  shareToArk ({token, data = {}, callback}) {
    FN.log('shareToArk12111211211', data)
    let cbData = {
      statusCode: 0,
      aioType: 4, // 1: 个人  4:群聊
      status: '分享成功'
    }
    callback(cbData)
  },

  videoAd ({token, data = {}, callback}) {
    let cpData = {
      statusCode: 0,
      status: '观看完成'
    }
    callback(cpData)
  }
}
