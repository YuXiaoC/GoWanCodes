// 9g测试地址https://m.9g.com/menu.html?gameid=msdmx
FN.log('9Gsdk.use.js')
window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
    let urlParams = FN.getURLparams()// 获取渠道信息
    var game9g = new Game9G({
      gameid: urlParams.gameid, // 第三方游戏 gameid，进入CP游戏地址时携带的参数
      channel: urlParams.channel, // 渠道标识，进入CP游戏地址时携带的参数
      token: urlParams.token// 9G 用户 token，进入CP游戏地址时携带的参数
    })
    window.game_9g = game9g
    game9g.ready(function (data) {
      console.log((data))
    })
    let result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },
  // 登录
  login ({ token, data = {}, callback }) {
    // 渠道登录方法在这里调用
    let params = FN.getURLparams() // 获取链接参数
    FN.log('header-header-header', params)
    let gameid = params.gameid
    let deviceid = 'H5'
    let g_token = params.token
    let channel = params.channel
    let header = {gameid, deviceid, g_token, channel} // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
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
  // 支付
  recharge ({token, data = {}, callback}) {
    console.log('支付信息', data)
    let userID = FN.getSession('FUSE_USER_INFO').user_id
    let spid = FN.getSession('FUSE_USER_INFO').ext.spid
    let gameID = FN.getSession('FUSE_CHANNEL_INFO').game_id
    let cpData = data
    FN.log('user_info77777777777', cpData.ext.sign)
    var paydata = {
      'orderid': cpData.order_id, // 商户订单号
      'money': cpData.amount, // 订单金额（单位：分），int
      'product': cpData.productName ? cpData.productName : cpData.chargeDesc, // 商品名称，string
      'spid': spid, // 商户ID，string
      'role_id': cpData.roleId, // 角色id，int
      'server_id': cpData.serverId, // 服务器id，int
      'sign': cpData.ext.sign, // 签名，string
      'attach': encodeURIComponent(cpData.order_id + '||' + gameID + '||' + userID) // 附加参数，在支付回调原样返回，string，可选
    }
    console.log('paydata', paydata)
    window.game_9g.pay(paydata)
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
  // 分享
  shareToArk ({token, data = {}, callback}) {
    // alert(new Date().getTime())
    FN.log('shareToArk12111211211', data)
    let channelInfo = FN.getSession('FUSE_CHANNEL_INFO')
    window.game_9g.share({
      title: channelInfo.game_name,
      content: data.summary// 仅发送朋友或群显示，发送朋友圈不显示
    })
    window.game_9g.onShareOK(function () {
      let cbData = {
        statusCode: 0,
        aioType: 4, // 1: 个人  4:群聊
        status: '分享成功'
      }
      callback(cbData)
    })
  },
  // 观看广告
  videoAd ({token, data = {}, callback}) {
    let cpData = {
      statusCode: 0,
      status: '观看完成'
    }
    callback(cpData)
  },
  createRole ({token, data = {}, callback}) {
    FN.log('createRole创角data', data)
    let role = {
      server_id: data.server_id,
      server_name: data.server_name,
      role_id: data.role_id,
      nickname: data.role_name
    }
    game_9g.createRole(role)
  },
  changeRole ({token, data = {}, callback}) {
    FN.log('changeRole切换角色__data', data)
    let role = {
      server_id: data.server_id,
      server_name: data.server_name,
      role_id: data.role_id,
      nickname: data.role_name
    }
    game_9g.createRole(role)
  },
  changeAccount ({token, data = {}, callback}) {
    FN.log('changeAccount切换账号__data', data)
    let role = {
      server_id: data.server_id,
      server_name: data.server_name,
      role_id: data.role_id,
      nickname: data.role_name
    }
    game_9g.createRole(role)
  }
}
var isOnline = true
// 断网重连
window.addEventListener('online', function () {
  if (!isOnline) {
    window.location.reload()
  }
})
