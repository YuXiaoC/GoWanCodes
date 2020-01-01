// 游戏坛子测试地址http://h.gametanzi.com/mediawide.php?s=Game/open_game/game_id/49
// import md5 from 'blueimp-md5'
FN.log('gametanzi.use.js')
window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
    let urlParams = FN.getURLparams()// 获取渠道信息
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
    let deviceid = 'H5'
    let channelExt = params.channelExt
    let email = params.email
    let game_appid = params.game_appid
    let new_time = params.new_time
    let loginplatform2cp = params.loginplatform2cp
    let user_id = params.user_id
    let sdklogindomain = params.sdklogindomain
    let sdkloginmodel = params.sdkloginmodel
    let sign = params.sign
    let icon = params.icon
    let nickname = params.nickname
    let ext_header = {}

    let header = {deviceid, channelExt, email, game_appid, new_time, loginplatform2cp, user_id, sdklogindomain, sdkloginmodel, sign, icon, nickname}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
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
  // 支付
  recharge ({token, data = {}, callback}) {
	  console.log('支付回调',data);
    let params = FN.getURLparams()
	console.log('参数回调',params);
    // 组装参数
    var jsondata = {
      'amount': data.amount,
      'channelExt': params.channelExt,
      'game_appid': params.game_appid,
      'props_name': data.productName,
      'trade_no': data.order_id,
      'user_id': params.user_id,
      'sdkloginmodel': params.sdkloginmodel,
      'sign': data.ext.sign,
      'server_id': data.serverId,
      'server_name': data.serverName,
      'role_id': data.roleId,
      'role_name': data.roleName
    }
    xgGame.h5paySdk(jsondata, function (data) { console.log(data) })
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    let params = FN.getURLparams()
    // timestamp = Date.parse(new Date()) / 1000
    window.__payData__ = {
      product_name: data.productName,
      channelExt: params.channelExt,
      sdkloginmodel: params.sdkloginmodel
    }
    return window.__payData__
  }
}
