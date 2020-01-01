// 闪电玩接入文档地址http://www.shandw.com/sdwdoc/template/sdwdoc.html
// 闪电玩-千古宠界游戏测试地址http://www.shandw.com/mi/game/2088937671.html?sdw_test=true
FN.log('shandianwasdk.use.js1111111111111111')
// 时间戳
var _timestamp = Date.parse(new Date()) / 1000
var channel_info = FN.getSession('FUSE_CHANNEL_INFO')
window.FUSESDKAPI = {
  init ({token, data = {}, callback}) {
    let cpData = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(cpData)
  },

  login ({ token, data = {}, callback }) {
    let params = FN.getURLparams() // 获取链接参数
    let deviceid = 'H5'
    let uid = params.uid
    let appid = params.appid
    let nick = params.nick
    let avatar = params.avatar
    let sex = params.sex
    let openid = params.openid ? params.openid : ''
    let time = params.time
    let reurl = params.reurl
    let cburl = params.cburl
    // let paydata = params.paydata
    let sign = params.sign
    let channel = params.channel
    let header = { deviceid, uid, appid, nick, avatar, channel, sex, time, reurl, cburl, sign, openid } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}

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
    let user_info = FN.getSession('FUSE_USER_INFO')
    let productName = data.productName ? data.productName : data.chargeDesc
    var OBJECT = {
      timestamp: _timestamp,
      subject: productName,
      appId: channel_info.app_id,
      gameName: channel_info.game_name,
      accountId: user_info.user_id,
      amount: data.amount,
      cpOrderId: data.order_id,
      paychannel: '',
      complete: function (res) {},
      call_back_url: user_info.ext.cburl,
      merchant_url: user_info.ext.reurl,
      sign: data.ext.sign,
      channel: user_info.ext.g_channel,
      wxopenid: user_info.ext.openid,
      memo: channel_info.game_id
    }
    sdw.chooseSDWPay(OBJECT)
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
    FN.log('ext_Data', data)
    _timestamp = Date.parse(new Date()) / 1000
    let productName = data.productName ? data.productName : data.chargeDesc
    window.__payData__ = {
      'timestamp': _timestamp,
      'wxopenid': FN.getSession('FUSE_USER_INFO').ext.openid,
      'call_back_url': FN.getSession('FUSE_USER_INFO').ext.cburl,
      'merchant_url': FN.getSession('FUSE_USER_INFO').ext.reurl,
      'g_channel': FN.getSession('FUSE_USER_INFO').ext.g_channel,
      'subject': productName
    }
    return window.__payData__
  },
  changeRole ({token, data = {}, callback}) {
    FN.log('------changeRole---->>>>>>>>>>>>>>', window.cpData)
    sdw.postGameInfo({
      appid: channel_info.app_id,
      channel: FN.getSession('FUSE_USER_INFO').ext.g_channel,
      uid: data.user_id,
      sid: data.role_id,
      id: data.user_id,
      sname: data.server_name,
      nick: data.role_name,
      level: data.role_level,
      type: '休闲',
      vip: data.vip_level,
      power: 0,
      new: 0
    })
  },
  createRole ({token, data = {}, callback}) {
    FN.log('createRole', data)
    sdw.postGameInfo({
      appid: channel_info.app_id,
      channel: FN.getSession('FUSE_USER_INFO').ext.g_channel,
      uid: data.user_id,
      sid: data.role_id,
      id: data.user_id,
      sname: data.server_name,
      nick: data.role_name,
      level: data.role_level,
      type: '休闲',
      vip: data.vip_level,
      power: 0,
      new: 1
    })
  },
  activity ({token, data = {}, callback}) {
    FN.log('activity---->', data)
    let type = data.target || ''
    if (type === 'bindAliPay') {
      sdw.showMask('bindAliPay', {
        uid: data.user_id,
        level: data.role_level
      })
    }
    let cbData = {
      status: '调用活动接口成功',
      statusCode: 0
    }
    callback(cbData)
  }
}
