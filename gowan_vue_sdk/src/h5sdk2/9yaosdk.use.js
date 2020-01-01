// h5SDK对接文档地址http://s14zt8bak.yaohihi.com/jishudoc/web/#/12?page_id=107
// 测试地址http://sdk.jiuyao666.com/index.php/H5sdk/account_login?gameid=2379
// 测试帐号密码:账号：h5test，密码：123456
window.addEventListener('offline', function () {
  // alert('已断网，点击重载')
  window.location.reload()
});
(function () {
  var jysdk = function () {}
  jysdk.prototype = {
    pay: function (data) {
      window.top.postMessage(data, '*')
    },
    share: function (data) {
      window.top.postMessage(data, '*')
    },
    login: function (data) {
      window.top.postMessage(data, '*')
    }
  }
  window.jysdk = new jysdk()
})()
// 以上的函数是九妖渠道自身的js文件里面的代码。。。。
FN.log('jiuyaosdk.use.js')
let UrlParmas = FN.getURLparams()
let channel_info = FN.getSession('FUSE_CHANNEL_INFO')
console.log('UrlParmas', UrlParmas)
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
    let appid = parseInt(UrlParmas.appid)
    let uid = UrlParmas.uid
    let deviceid = 'H5'
    let time = parseInt(UrlParmas.time)
    let j_token = UrlParmas.token
    let sign = UrlParmas.sign
    let header = {appid, uid, deviceid, token: j_token, sign, time}
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
      'api': 'pay',
      'appid': channel_info.app_id,
      'uid': UrlParmas.uid,
      'token': UrlParmas.token,
      'amount': (data.amount / 100).toFixed(2), // 单位元，如：1.00
      'serverid': data.serverId,
      'extra_orderno': data.order_id,
      'time': data.ext.time,
      'sign': data.ext.sign
    }
    FN.log('支付信息paydata', paydata)
    jysdk.pay(paydata)
  }
  // flymeChangeAccount ({token, data = {}, callback}) {
  //   // alert(11)
  //   window.location.reload()
  // }
}
