// 测试地址http://g.tcy365.com/pc/index.html?gamecode=qgcjsy&channelid=1000001303&loginmode=30000&ext=1#/
FN.log('tcy365sdk.use.js')
var isOnline = true
window.addEventListener('online', function () {
  if (!isOnline) {
    window.location.reload()
  }
})
window.addEventListener('offline', function () {
  isOnline = false
})
// 以上代码是断网重新连接
function loadScript (url, callback) {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (this.readyState == 'loaded' || this.readyState == 'complete') {
        this.onreadystatechange = null
        if (callback) callback()
      }
    }
  } else {
    script.onload = function () {
      if (callback) callback()
    }
  }
  script.src = url
  document.body.appendChild(script)
}

let UrlParmas = FN.getURLparams()

// g.tcy365.com/game/h5sdk?AppId=7000001
/* 动态加载js */
loadScript('//g.tcy365.com/game/h5sdk?AppId=' + UrlParmas.AppId, function () {
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
      let AppId = UrlParmas.AppId
      let UserId = UrlParmas.UserId
      let NickName = UrlParmas.NickName
      let Timestamp = UrlParmas.Timestamp
      let Ext = UrlParmas.Ext
      let Sign = UrlParmas.Sign
      let deviceid = 'H5'

      let header = {AppId, UserId, NickName, Timestamp, Ext, Sign, deviceid}
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
    recharge ({token, data = {}, callback}) {
      FN.log('支付信息', data)
      var productName = data.productName ? data.productName : data.chargeDesc
      TCYSDK.start('TCYSDK_PAY', {
        'ProductSubject': productName,
        // 商品标题，如果超长则自动截断
        'Price': data.ext.Price,
        'ProductBody': productName, // 商品详情， 如果超长则自动截断
        'OutOrderInfo': data.ext.OutOrderInfo,
        'OutOrderInfoSign': data.ext.OutOrderInfoSign,
        'Ext': data.ext.ext
      },
      function (type, data) {
        if (type === 'TCYSDK_PAY_ERROR') {
          alert(data) // 可根据不同返回结果做相应操作
        }
      })
    },
    getEXT (data) {
      FN.log('ext_Data', data)
      var productName = data.productName ? data.productName : data.chargeDesc
      window.__payData__ = { product_name: productName }
      return window.__payData__
    },
    changeRole ({token, data = {}, callback}) {
      FN.log('changeRole角色登录/切换角色', data)

      /* 登陆 */
      TCYSDK.start('TCYSDK_LOGIN', {
        'AppId': UrlParmas.AppId,
        'ServerId': data.server_id
      })
      TCYSDK.start('TCYSDK_PUT_ROLE', {

        'AppId': UrlParmas.AppId,

        'ServerId': data.server_id,

        'RoleName': data.role_name,

        'GameLevel': data.role_level,

        'CreateTime': (new Date()).getTime() // 创角时间，13位毫秒时间戳

      })
    },
    upgradeRole ({token, data = {}, callback}) {
      FN.log('upgradeRole角色升级', data)

      TCYSDK.start('TCYSDK_PUT_ROLE', {

        'AppId': UrlParmas.AppId,

        'ServerId': data.server_id,

        'RoleName': data.role_name,

        'GameLevel': data.role_level,

        'CreateTime': (new Date()).getTime() // 创角时间，13位毫秒时间戳

      })
    }
  }
})
