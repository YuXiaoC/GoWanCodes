// 测试地址 https://h5.gowanme.com/?yisdk_param=nJ9hm-DY2NPN&ext_param=a5lp
// 文档地址 https://developer.huawei.com/consumer/cn/service/hms/catalog/fastgame.html?page=fastapp_fastgame_devguide
FN.log('huaweisdk.use.js')
let UrlParmas = FN.getURLparams()
let channel_info = FN.getSession('FUSE_CHANNEL_INFO')
var isOnline = true
window.addEventListener('online', function () {
  if (!isOnline) {
    window.location.reload()
  }
})
window.addEventListener('offline', function () {
  isOnline = false
})
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
    var params = {
      'appid': channel_info.app_id,
      'forceLogin': 0
    }
    window.HwFastappObject.gameLogin(JSON.stringify(params))
    var hadLogin = false
    if (!hadLogin) {
      window.HwFastappObject.onGameLoginResult = function onGameLoginResult (str) {
        FN.log('str', str)
        if (str.code === 0) {
          HwFastappObject.onGameLoginResult = function onGameLoginResult (str) {
            success = 0
            showFloatWindow()
          }
          hadLogin = true
          let gameUserData = str.gameUserData
          let header = {...gameUserData}
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
        } else {
          alert('授权失败！')
        }
      }
    }
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    window.__payData__ = {
      product_name: data.productName
    }
    return window.__payData__
  },
  recharge ({token, data = {}, callback}) {
    FN.log('支付信息', data)
    var paydata = {
      'amount': (data.amount / 100).toFixed(2), // 单位元，如：1.00
      'applicationID': channel_info.app_id, // 应用ID，在华为开发者联盟上获取的APP ID。
      'productDesc': data.productName, // 商品描述
      'productName': data.productName,
      'requestId': data.order_id, // 订单号
      'serviceCatalog': 'X6', // 商品类型
      'merchantId': data.ext.merchantId, // 商户id
      'merchantName': data.ext.merchantName, // 商户名称
      'sign': data.ext.sign, // 签名
      'sdkChannel': 0,
      'publicKey': data.ext.publicKey, // 公钥
      'extReserved': data.ext.extReserved
    }
    FN.log('支付信息paydata', paydata)
    var param2 = {orderInfo: JSON.stringify(paydata)}
    HwFastappObject.pay(JSON.stringify(param2))
    HwFastappObject.onPayResult = function onPayResult (str) {
      FN.log('支付结果: ' + str.code + ',message: ' + str.data)
    }
  },
  changeRole ({token, data = {}, callback}) {
    FN.log('changeRole角色登录data', data)
    var params = {
      'appid': channel_info.app_id, // 在华为开发者联盟上创建快游戏后分配的唯一标识
      'area': data.server_name, // 游戏区服
      'rank': data.role_level, // 角色等级
      'role': data.role_name // 角色名称
    }
    HwFastappObject.savePlayerInfo(JSON.stringify(params))

    HwFastappObject.onSavePlayerInfoResult = function onSavePlayerInfoResult (str) {
      FN.log('角色登录存储用户信息结果0代表成功', str)
      // document.getElementById('resultsave').innerHTML = str.code
    }
  },
  createRole ({token, data = {}, callback}) {
    FN.log('create创角data', data)
    var params = {
      'appid': channel_info.app_id, // 在华为开发者联盟上创建快游戏后分配的唯一标识
      'area': data.server_name, // 游戏区服
      'rank': data.role_level, // 角色等级
      'role': data.role_name // 角色名称
    }
    HwFastappObject.savePlayerInfo(JSON.stringify(params))

    HwFastappObject.onSavePlayerInfoResult = function onSavePlayerInfoResult (str) {
      FN.log('创角存储用户信息结果0代表成功', str)
    }
  }
}

system.onmessage = function (data) {
  console.log('system.onmessage--------->', data)
  if (data == 'showfloatwindow') {
    if (success == 0) {
      showFloatWindow()
    }
  }
  if (data == 'hidefloatwindow') {
    hideFloatWindow()
  }
}
// 显示浮标
function showFloatWindow () {
  var params = {'appid': channel_info.app_id}
  HwFastappObject.showFloatWindow(JSON.stringify(params))
}
// 隐藏浮标
function hideFloatWindow () {
  var params = {'appid': channel_info.app_id}
  HwFastappObject.hideFloatWindow(JSON.stringify(params))
}
