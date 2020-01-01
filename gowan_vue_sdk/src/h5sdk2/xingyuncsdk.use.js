FN.log('xingyuncsdk.use.js init success!')

//创建星云div
var oDiv = document.createElement('div');
oDiv.id = 'xingyun-sdk';
document.body.appendChild(oDiv);

window.SDKDATA = {}
window.xingyun_h5_params = {}
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {    
    window.FUSESDK.h5pub().then(function (res) {
      if (res.code === 0) {
        window.xingyun_h5_params = JSON.parse(res.data.ext)
        gameboy.init(
          {
            appid: xingyun_h5_params.appid, // 必填，星云互动游戏应用ID
            url: xingyun_h5_params.url, // 必填，当前页面 URL 地址
            apis: xingyun_h5_params.apis, // 必填，需要使用的JS接口列表, 逗号分隔字符串
            timestamp: xingyun_h5_params.timestamp, // 必填，生成签名的时间戳
            nonce: xingyun_h5_params.nonce, // 必填，生成签名的随机串
            sign_type: xingyun_h5_params.sign_type, // 必填, 生成签名使用的算法
            sign: xingyun_h5_params.sign // 必填，签名，具体算法逻辑看下方的签名算法说明部分
          },
          true // 调试模式, 打开后, 调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        )
        setTimeout(() => {
          callback({statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)})
        }, 500)
      }
    })
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    window.SDKDATA.loginWay = data.loginWay
    // 保存回调函数
    window.SDKDATA.login = {}
    gameboy.login(
      {
        success: function (oauth_result) {
          // alert(oauth_result.code)
          // 登录成功, 返回星云互动用户授权临时验证码
          // oauth_result = {code: "oauth_access_code"}
          let header = { code: oauth_result.code }
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
        fail: function (err) {
          // 操作失败, 返回错误错误信息
          // 例如: err = {code: 100, message: "SDK未完成初始化"}
        }
      }
    )
  },
  recharge ({token, data = {}, callback}) {
    let prepay_params = {'appid': data.ext.appid, 'prepayid': data.ext.prepayid, 'time': data.ext.time, 'nonce': data.ext.nonce, 'sign_type': data.ext.sign_type, 'sign': data.ext.sign}
    gameboy.pay({
      prepay: prepay_params, // 带签名的支付参数, 需要游戏服务器程序进行加密签名
      success: function (status) {
        // 支付请求成功后, 返回支付状态
      },
      fail: function (err) {
        // 操作失败, 返回错误错误信息
        // 例如: err = {code: 100, message: "SDK未完成初始化"}
      }
    })
    callback({
      statusCode: 0,
      status: '调用支付成功'
    })
  },
  changeRole ({token, data = {}, callback}) {
    let {roleName, server_name, role_level} = data
    gameboy.track({
      type: 'login',
      value: {'name': data.roleName, 'server': data.server_name, 'level': data.role_level}, // 统计数据
      success: function () { }, // 发送完成回调
      fail: function (err) { } // 发送失败回调
    })
    gameboy.track({
      type: 'levelup',
      value: {'name': data.roleName, 'server': data.server_name, 'level': data.role_level}, // 统计数据
      success: function () { }, // 发送完成回调
      fail: function (err) { } // 发送失败回调
    })
    callback({
      statusCode: 0,
      status: '切换成功'
    })
  },
  changeAccount (token, args) {
    gameboy.logout({
      success: function () {
        // 登出成功
      }
    })
  },
  getPlatform (token, args) {

  },
  getEXT (data) {
    FN.log(data)
    let {cpProductId, productName, roleId, roleLevel, chargeDesc, roleName, serverId} = data
    window.__payData__ = {
      merchant_id: cpProductId,
      product_name: productName,
      role_id: roleId,
      role_level: roleLevel,
      charge_desc: chargeDesc,
      role_name: roleName,
      server_id: serverId
    }
    return window.__payData__
  }
}
