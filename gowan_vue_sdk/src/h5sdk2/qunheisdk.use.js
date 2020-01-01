// 文档地址http://open.qunhei.com/Upload/port/
FN.log('qunheisdk.use.js init success!')
// var isOnline = true
window.SDKDATA = {}

window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    console.log('融合初始化data', data)
    window.FUSESDK.h5pub().then(function (res) {
      if (res.code === 0) {
        FN.saveSession('gid', JSON.parse(res.data.ext).gid)
        var initdata = {
          'username': FN.getURLparams().username, // 用户id，群黑登录接口里面username参数
          'gid': JSON.parse(res.data.ext).gid, // 群黑游戏id，可以在后台游戏列表查询
          'qhchannel': FN.getURLparams().qhchannel, // 用户标识，群黑登录接口里面qhchannel参数
          'qhchannelid': FN.getURLparams().qhchannelid, // 用户标识id，群黑登录接口里面qhchannelid参数
          'time': '13556745678'// 用户登录时间戳，群黑登录接口里面time参数
        }
        qhsdk.init(initdata)

        callback({
          statusCode: 0,
          status: '初始化成功',
          remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
        })
      }
    })
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')

    let header = {username: FN.getURLparams().username, serverid: FN.getURLparams().serverid, isadult: FN.getURLparams().isadult, time: FN.getURLparams().time, flag: FN.getURLparams().flag}
    let ext_header = {}
    if (!window.__ext__) {
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
  shareToArk ({token, data = {}, callback}) {
    qhsdk.share()
    onmessage = function (e) {
      e = e || event
      if (e.data == 'shareok') {
        // 分享成功
        callback({
          statusCode: 0,
          aioType: 4, // 1: 个人  4:群聊
          status: '分享成功'
        })
      } else {
        callback({
          statusCode: 1,
          status: '分享失败'
        })
      }
    }
  },
  recharge ({token, data = {}, callback}) {
    console.log('充值信息', data)
    var paydata = {
      'userId': data.fuseParams.user_id,
      'gid': FN.getSession('gid'),
      'roleName': data.fuseParams.role_name,
      'goodsId': data.fuseParams.cp_product_id,
      'goodsName': data.chargeDesc,
      'money': data.amount / 100,
      'ext': FN.getSession('gid') + '||' + data.order_id,
      'serverId': data.fuseParams.server_id,
      'roleId': data.fuseParams.role_id,
      'sign': data.ext.sign
    }
    console.log('paydata', paydata)

    qhsdk.pay(paydata, function (code, msg) {
      // 充值结果通知，code为编号，msg为信息。该结果不能作为发货依据。该回调已经取消！！请使用后端回调判断发货
      // code=1充值成功 ，其他为充值失败。
      // alert(code+','+msg);
    })
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
  getPlatform (token, args) {

  },
  getEXT (data) {
    FN.log(data)
    let {cpProductId, productName, roleId, roleLevel, chargeDesc, roleName, serverId, amount} = data
    window.__payData__ = {
      money: amount / 100,
      userId: FN.getURLparams().username,
      gid: FN.getSession('gid')
    }
    return window.__payData__
  },
  changeRole ({token, data = {}, callback}) {
    FN.log('changeRole-->', data)
    var roledata = {
      'act': 2,
      'serverid': data.server_id,
      'rolename': data.role_name,
      'roleid': data.role_id,
      'level': data.server_level,
      'power': 0
    }
    qhsdk.role(roledata)
  },
  createRole ({token, data = {}, callback}) {
    FN.log('createRole-->', data)
    var roledata = {
      'act': 1,
      'serverid': data.server_id,
      'rolename': data.role_name,
      'roleid': data.role_id,
      'level': data.server_level,
      'power': 0
    }
    qhsdk.role(roledata)
  },
  changeAccount ({token, data = {}, callback}) {
    window.location.reload()
    // 切换帐号必定注销用户信息
    // FN.removeSession('USER_INFO')
    // FN.removeSession('FUSE_USER_INFO')
    // let cbData = {
    //   statusCode: 0,
    //   status: '调用切换帐号成功'
    // }
    // callback(cbData)
  }
}
// 断网重连
// window.addEventListener('online', function () {
//   if (!isOnline) {
//     window.location.reload()
//   }
// })
// window.addEventListener('offline', function () {
//   isOnline = false
// })
