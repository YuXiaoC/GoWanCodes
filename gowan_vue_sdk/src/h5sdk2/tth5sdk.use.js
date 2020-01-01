FN.log('tth5.use.js')

let UrlParmas = FN.getURLparams()

var _zjLoginCallback = null
var _zjRechargeCallback = null

window.TZAppReady = function () {

}
window.loginCallback = function (result) {
  FN.log('result:' + JSON.stringify(result))
  if (result.result == 0) {
    let header = {
      'childUserID': result.data.childUserID, // 用户标识,用于 TZ 服务端与 CP 服
      'accessToken': result.data.accessToken,
      'deviceid': 'H5'
    }
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
          let cbData = {
            statusCode: 0,
            loginParams: res.data
          }
          _zjLoginCallback(cbData)
          window.__ext__ = res.data
        } else {
          let cbData = {
            statusCode: res.code,
            loginParams: res.msg
          }
          _zjLoginCallback(cbData)
        }
      })
    } else {
      let cbData = {
        statusCode: '0',
        status: FN.getSession('FUSE_USER_INFO')
      }
      _zjLoginCallback(cbData)
    }
  } else {
    alert(result.msg)
  }
}

window.rechargeCallback = function (rs) {
  /* if(rs.result == 0){
      alert("支付成功");
  }else{
    alert(rs.msg);
  } */
}
window.FUSESDKAPI = {
  init ({token, data = {}, callback}) {
    let cbData = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(cbData)
  },
  login ({token, data = {}, callback}) {
    let loginData = {
      'cmd': 'login',
      'req': {},
      'callbackName': 'loginCallback'
    }
    _zjLoginCallback = callback // 暂存回调函数
    window.TZAppBridge(loginData)
  },
  recharge: function ({ token, data = {}, callback }) {
    let user_info = FN.getSession('FUSE_USER_INFO')

    let product_name = data.productName ? data.productName : data.chargeDesc
    let payData = {
      'cmd': 'pay',
      'req': {
        'appKey': data.ext.appKey,
        'gameId': data.ext.gameId,
        'roleName': data.roleName,
        'serverID': data.serverId,
        'childUserID': user_info.user_id,
        'cpOrderID': data.order_id,
        'cpFee': (data.amount / 100).toFixed(2),
        'subject': product_name,
        'body': product_name,
        'exInfo': data.ext.exInfo,
        'bundleID': data.ext.bundleID,
        'cpCallbackUrl': data.ext.cpCallbackUrl
      },
      'callbackName': 'rechargeCallback'
    }
    _zjRechargeCallback = callback // 暂存回调函数
    window.TZAppBridge(payData)
  }

}
