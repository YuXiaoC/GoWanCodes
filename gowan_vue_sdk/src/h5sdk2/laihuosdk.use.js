/* 测试地址：
    英雄训练师：http://h.yindaoyuan.com/mediawide.php?s=Game/open_game/game_id/131
    */
FN.log('laihuosdk.use.js')

// 请求地址
var yisdk_protocol = window.location.protocol
var yisdk_host = window.location.host
var yisdk_url = ''
if (yisdk_host.indexOf('gowanme') >= 0) {
  yisdk_url = yisdk_protocol + '//yisdk-api.gowanme.com/'
} else {
  yisdk_url = yisdk_protocol + '//yisdk-api.gowan8.com/'
}

window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
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
    let Params = FN.getURLparams() // 获取链接参数
    FN.log('urlParams', Params)

    let channelExt = Params.channelExt
    let email = Params.email
    let game_appid = Params.game_appid
    let new_time = Params.new_time
    let loginplatform2cp = Params.loginplatform2cp
    let user_id = Params.user_id
    let sdklogindomain = Params.sdklogindomain
    let sdkloginmodel = Params.sdkloginmodel
    let sign = Params.sign
    let header = {
      channelExt,
      email,
      game_appid,
      new_time,
      loginplatform2cp,
      user_id,
      sdklogindomain,
      sdkloginmodel,
      sign
    } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          console.log('xgGame====================', window.xgGame)

          res.data.channelExt = channelExt
          res.data.game_appid = game_appid
          res.data.sdkloginmodel = sdkloginmodel
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
    FN.log('支付信息', data)
    let channelExt = FN.getSession('FUSE_USER_INFO').channelExt
    let game_appid = FN.getSession('FUSE_USER_INFO').game_appid
    let sdkloginmodel = FN.getSession('FUSE_USER_INFO').sdkloginmodel
    FN.log('FUSE_CHANNEL_INFO', FN.getSession('FUSE_CHANNEL_INFO'))

    var payData = {
      amount: data.ext.amount,
      channelExt: data.ext.channelExt,
      game_appid: data.ext.game_appid,
      props_name: data.ext.props_name,
      trade_no: data.ext.trade_no,
      user_id: data.ext.user_id,
      sdkloginmodel: data.ext.sdkloginmodel,
      sign: data.ext.sign,
      server_id: data.serverId,
      server_name: data.serverName,
      role_id: data.roleId,
      role_name: data.roleName
    }
    FN.log('paydata', payData)
    window.xgGame.h5paySdk(payData, function (data) {
      FN.log('payNotify', data)
    })

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  // 支付透传参数
  getEXT (data) {
    let channelExt = FN.getSession('FUSE_USER_INFO').channelExt
    let game_appid = FN.getSession('FUSE_USER_INFO').game_appid
    let sdkloginmodel = FN.getSession('FUSE_USER_INFO').sdkloginmodel
    window.__payData__ = {
      channelExt: channelExt,
      game_appid: game_appid,
      sdkloginmodel: sdkloginmodel,
      props_name: data.productName ? data.productName : data.chargeDesc
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  },
  // 切换角色
  changeRole ({token, data = {}, callback}) {
    FN.log('切换角色', data)

    let user_id = FN.getSession('FUSE_USER_INFO').user_id
    let game_appid = FN.getSession('FUSE_USER_INFO').game_appid
    let game_id = FN.getSession('FUSE_CHANNEL_INFO').game_id

    var repData = {
      user_id: user_id, // 运营方登录时传递的user_id
      game_appid: game_appid, // 游戏编号----运营方为游戏分配的唯一编号
      server_id: data.server_id, // 区服id
      server_name: data.server_name, // 区服名称
      role_id: data.role_id, // 角色id
      role_name: data.role_name, // 角色名
      level: data.role_level // 角色等级
    }

    var ajax_data = Pajax('fuse:logind', repData, {
      domain: yisdk_url + '?ct=api_extend&ac=role_login&channel=laihuo&zjwl_gid=' + game_id + '&is_jsdk=1'
    })

    ajax_data.then(function (data) {
      FN.log('ajax_data', data)
      repData.sign = data.data.sign

      FN.log('repData', repData)
      xgGame.jointCreateRole(repData)
    })
  },
  // 分享
  shareToArk ({token, data = {}, callback}) {
    FN.log('gowan分享', data)
    let game_appid = FN.getSession('FUSE_USER_INFO').game_appid
    let channelInfo = FN.getSession('FUSE_CHANNEL_INFO')

    xgGame.shareSdk({
      game_appid: game_appid,
      title: channelInfo.game_name,
      desc: data.summary
    }, function (data) { // 分享结果status  1分享成功   0分享失败
      console.log(data)
    })
  }
}

// 内部通讯AJAX函数
// api-mock-js
const Pajax = (...arg) => {
  let payload = [...arg]
  let KEY = String(new Date().getTime()).substr(0, 10)
  if (!payload[2]) payload[2] = {}
  payload[2].filter = function (obj) {
    let newObj = { ...obj }

    FN.log(`${arg[0]}(input)`, arg[1])
    return {
      ...obj
    }
  }
  return new Promise((resolve, reject) => {
    Api.require(...payload)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        FN.log('FN.ajax error:', e)
      })
  })
}
