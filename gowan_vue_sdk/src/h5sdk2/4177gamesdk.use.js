FN.log('4177game.use.js init success!')

window.SDKDATA = {}
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    console.log('路由参数', FN.getURLparams())
    window.FUSESDK.h5pub().then(function (res) {
      if (res.code === 0) {
        let app_id = JSON.parse(res.data.ext).app_id
        let open_id = FN.getURLparams().open_id
        let channel = FN.getURLparams().channel
        var initdata = {
          app_id,
          open_id,
          channel
        }
        aiaiusdk.init(initdata)
        callback({statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)})
      }
    })
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    let urlParams = FN.getURLparams()
    let header = {open_id: urlParams.open_id, access_token: urlParams.access_token}
    let ext_header = {}
    window.FUSESDK.login({
      ext: JSON.stringify(ext_header),
      data: JSON.stringify(header)
    }).then(res => {
      if (res.code === 0) {
        FN.saveSession('FUSE_USER_INFO', res.data)
        callback({
          statusCode: 0,
          loginParams: res.data
        })
      } else {
        callback({
          statusCode: res.code,
          status: res.msg
        })
      }
    })
  },
  recharge ({token, data = {}, callback}) {
    FN.log('支付信息', data)
    let cpData = data
    let urlParams = FN.getURLparams()
    var paydata = {
      'open_id': urlParams.open_id,
      'access_token': urlParams.access_token,
      'bill_no': data.order_id,
      'role_id': data.roleId,
      'server_id': data.serverId,
      'goods_name': data.productName,
      'total_fee': data.amount / 10,
      'ext': data.ext.ext,
      'sign': data.ext.sign
    }
    console.log('paydata', paydata)
    aiaiusdk.pay(paydata, function (code, msg) {})
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      callback({
        statusCode: 0,
        status: {orderId: cpData.order_id}
      })
    } else {
      callback({
        statusCode: 0,
        status: '调用支付成功'
      })
    }
  },
  createRole ({token, data = {}, callback}) {
    FN.log('4177game.use.js创角', data)
    var roleData = {
      type: 'createRole',
      open_id: data.user_id,
      server_id: data.server_id,
      server_name: data.server_name,
      role_id: data.role_id,
      role_name: data.role_name,
      level: data.role_level,
      power: '无',
      profession: '无',
      vip: data.vip_level,
      coin1: '无',
      coin2: '无',
      ext: '无'
    }
    aiaiusdk.roleRecord(roleData)
  },
  upgradeRole ({token, data = {}, callback}) {
    FN.log('4177game.use.js角色升级', data)
    var roleData = {
      type: 'levelUp',
      open_id: data.user_id,
      server_id: data.server_id,
      server_name: data.server_name,
      role_id: data.role_id,
      role_name: data.role_name,
      level: data.role_level,
      power: '无',
      profession: '无',
      vip: data.vip_level,
      coin1: '无',
      coin2: '无',
      ext: '无'
    }
    aiaiusdk.roleRecord(roleData)
  },
  changeAccount (token, args) {
    var logoutData = {
      open_id: FN.getURLparams().open_id
    }
    aiaiusdk.logout(logoutData)
    let cbData = {
      statusCode: 0,
      status: '切换成功'
    }
    callback(cbData)
  },
  changeRole ({token, data = {}, callback}) {
    FN.log('角色登录/切换角色登录', data)
    var roleData = {
      type: 'enterServer',
      open_id: data.user_id,
      server_id: data.server_id,
      server_name: data.server_name,
      role_id: data.role_id,
      role_name: data.role_name,
      level: data.role_level,
      power: '无',
      profession: '无',
      vip: data.vip_level,
      coin1: '无',
      coin2: '无',
      ext: '无'
    }
    aiaiusdk.roleRecord(roleData)
  },
  getEXT (data) {
    let urlParams = FN.getURLparams()
    FN.log(data)
    let {cpProductId, productName, roleId, roleLevel, chargeDesc, roleName, serverId, callbackInfo, amount} = data
    window.__payData__ = {
      open_id: urlParams.open_id,
      total_fee: amount / 10,
      access_token: urlParams.access_token,
      goods_name: data.productName
    }
    return window.__payData__
  },
  shareToArk ({token, data = {}, callback}) {
    let cbData = {
      statusCode: 0,
      aioType: 4, // 1: 个人  4:群聊
      status: '分享成功'
    }
    callback(cbData)
  },
  videoAd ({token, data = {}, callback}) {
    let cbData = {
      statusCode: 0,
      status: '观看完成'
    }
    callback(cbData)
  }
}
