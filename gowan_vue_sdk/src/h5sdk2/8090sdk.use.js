/* 测试地址：
    英雄训练师：http://h.8090.com/enter/index_test.php?gname=yxxls */
FN.log('8090sdk.use.js')
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
    var result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },
  // 登录
  login ({ token, data = {}, callback }) {
    // 渠道登录方法在这里调用

    var Params = FN.getURLparams() // 获取链接参数
    FN.log('urlParams', Params)

    var sign = Params.sign
    var uid = Params.uid
    var gname = Params.gname
    var username = Params.username
    var header = {sign: sign, uid: uid, gname: gname, username: username} // 用于融合登录传递给后端,进行登录校验
    var ext_header = {}
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

          window.GAME_8090_SDK.config({
            share: { /* 分享好友成功回调 即可发放奖励 */
              success: function () {
                console.log('分享', '分享好友成功')
              }
            },
            pay: { /* 支付成功回调方法（仅针对于绑币支付方式有效，该方法不做回调处理，游戏发货请以服务端回调为准） */
              success: function () {
                console.log('支付', '支付成功回调方法')
              }
            },
            uploadGameRole: { /* 角色上报成功回调 */
              success: function () {
                console.log('角色上报', '角色上报成功回调')
              }
            }
          }) // 初始化
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
    var channelInfo = FN.getSession('FUSE_CHANNEL_INFO')
    var params = FN.getURLparams() // 获取链接参数
    var goodsName = data.productName ? data.productName : data.chargeDesc // 商品名称，string
    var paydata = {
      gname: params.gname,
      gamename: channelInfo.game_name,
      username: params.username,
      money: parseInt(data.amount / 100),
      gserver: data.serverId,
      time: data.ext.time,
      goodsName: goodsName,
      sign: data.ext.sign,
      param: data.ext.param
    }
    console.log('paydata', paydata)
    window.GAME_8090_SDK.pay(paydata)
    var cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  // 支付透传参数
  getEXT (data) {
    FN.log('ext_Data', data)
    var params = FN.getURLparams() // 获取链接参数
    window.__payData__ = {
      username: params.username,
      gname: params.gname
    }
    return window.__payData__
  },
  changeRole (p) {
    FN.log('changeRole角色data', p)
    var UrlParams = FN.getURLparams() // 获取链接参数
    var user_info = FN.getSession('FUSE_USER_INFO')
    // 注意：以下属性排列顺序不能随意改，签名所需
    var params = {
      gname: UrlParams.gname,
      username: UrlParams.username,
      server: p.data.server_id,
      role: p.data.role_name,
      level: p.data.role_level,
      power: 0
    }

    var sign = md5(UrlParams.gname + UrlParams.username + params.server + params.role + params.level + user_info.ext.key)
    params['sign'] = sign
    console.log('角色登录params', params)
    window.GAME_8090_SDK.uploadGameRole(params)
    var cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    p.callback(cbData)
  },

  // 分享
  shareToArk ({token, data = {}, callback}) {
    FN.log('shareToArk', data)
    var channelInfo = FN.getSession('FUSE_CHANNEL_INFO')
    window.GAME_8090_SDK.showShare(channelInfo.game_name, data.summary, data.picUrl)
    var cbData = {
      statusCode: 0,
      aioType: 1, // 1: 个人  4:群聊
      status: '分享成功'
    }
    callback(cbData)
  }
}
