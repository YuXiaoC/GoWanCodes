// 测试地址 http://h5sdk.btgame99.com/index.php/index/autologin/gameid/8892/tgid/101/username/testchengshuang/password/123456/type/1/test/1
FN.log('btgamesdk.use.js')
let UrlParmas = FN.getURLparams()
let channel_info = FN.getSession('FUSE_CHANNEL_INFO')
console.log('UrlParmas', UrlParmas)
console.log('channel_info', channel_info)
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
    let loginParams = {
      appid: UrlParmas.appid,
      uid: UrlParmas.uid,
      time: UrlParmas.time,
      sign: UrlParmas.sign,
      token: UrlParmas.token,
      deviceid: 'H5'
    }
    let header = {...loginParams}
    console.log('header--header', header)
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
          callback(cbData)
          window.__ext__ = res.data
        } else {
          let cbData = {
            statusCode: res.code,
            loginParams: res.msg
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
  getEXT (data) {
    FN.log('ext_Data', data)
    let UrlParmas = FN.getURLparams()
    window.__payData__ = {
      app_id: FN.getSession('FUSE_CHANNEL_INFO').app_id,
      // time: Date.parse(new Date()) / 1000
      token: UrlParmas.token
    }
    return window.__payData__
  },
  recharge ({token, data = {}, callback}) {
    FN.log('支付信息', data)
    var paydata = {
      'appid': UrlParmas.appid,
      'uid': UrlParmas.uid,
      'token': UrlParmas.token,
      'amount': (data.amount / 100).toFixed(2), // 单位元，如：1.00
      'serverid': data.serverId,
      'extra_orderno': data.order_id,
      'time': data.ext.time,
      'sign': data.ext.sign
    }
    FN.log('支付信息paydata', paydata)
    window.top.postMessage(JSON.stringify(paydata), 'http://h5sdk.btgame99.com')
  }
}
