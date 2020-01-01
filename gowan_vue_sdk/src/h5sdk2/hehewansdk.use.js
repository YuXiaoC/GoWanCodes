// 接入文档地址https://www.showdoc.cc/148466555022384?page_id=843591083525534
// 游戏测试链接进入http://sharesdk.shishagame.com/tmweb-cm/login.php登录
// 账号：  Provider_qgcj
// 密码：  Provider_Thbf802_Pl961
// 登录后：点击左侧导航 参数信息 ，点击右侧底部按钮“登陆游戏”，后台充值产生的是虚拟订单，不需要支付。
FN.log('hehewansdk.use.js')
var channel_info = FN.getSession('FUSE_CHANNEL_INFO')
var user_info = {}
var _timestamp = Date.parse(new Date()) / 1000
window.FUSESDKAPI = {
  init ({token, data = {}, callback}) {
    callback({
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(channel_info.remote)
    })
  },
  login ({token, data = {}, callback}) {
    FN.log('login--URLparams-->>>>>>>', FN.getURLparams())
    let URLparams = FN.getURLparams()
    let deviceid = 'H5'
    let openid = URLparams.openid
    let gameid = URLparams.gameid
    let platform = URLparams.platform
    let params = URLparams.params
    let timestamp = URLparams.timestamp
    let sign = URLparams.sign
    let header = {openid, deviceid, gameid, platform, params, timestamp, sign}
    let ext_header = {}

    FN.log('login-header-header', header)
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        FN.log('header-header-header4', res)
        if (res.code === 0) {
          // 存储当前渠道用户信息
          FN.saveSession('FUSE_USER_INFO', res.data)
          user_info = FN.getSession('FUSE_USER_INFO')
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
    let URLparams = FN.getURLparams()
    let productName = data.productName ? data.productName : data.chargeDesc
    FN.log('URLparams', URLparams)
    let param = {
      platform: user_info.ext.platform,
      gameid: URLparams.gameid,
      openid: user_info.user_id,
      roleid: data.roleId,
      rolename: data.roleName,
      level: data.roleLevel,
      serverid: data.serverId,
      servername: data.serverName,
      tradename: productName,
      recharge: String(data.amount / 100),
      custom: encodeURIComponent(data.order_id + '_' + channel_info.game_id),
      timestamp: String(Date.parse(new Date()) / 1000),
      params: user_info.ext.params
    }
    console.log('呵呵支付', param)
    sharepay(param)
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
  upgradeRole ({token, data = {}, callback}) {
    FN.log('upgradeRole-------->>>>>>>data', data)
    sharelog({
      platform: user_info.ext.platform,
      openid: user_info.user_id,
      gameid: channel_info.game_id,
      action: data.role_id,
      serverid: data.user_id,
      roleid: data.role_id,
      rolename: data.role_name,
      rolelevel: data.role_level,
      timestamp: _timestamp
    })
  },
  createRole ({token, data = {}, callback}) {
    FN.log('~~~~~createRole~~~~~>>>>>>data', data)
    sharelog({
      platform: user_info.ext.platform,
      openid: user_info.user_id,
      gameid: channel_info.game_id,
      action: data.role_id,
      serverid: data.user_id,
      roleid: data.role_id,
      rolename: data.role_name,
      timestamp: _timestamp
    })
  },
  changeRole ({token, data = {}, callback}) {
    FN.log('~~~~~changeRole~~~~~>>>>>>data', data)
    sharelog({
      platform: user_info.ext.platform,
      openid: user_info.user_id,
      gameid: channel_info.game_id,
      action: data.role_id,
      serverid: data.user_id,
      roleid: data.role_id,
      rolename: data.role_name,
      timestamp: _timestamp
    })
  }
}
