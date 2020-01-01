FN.log('gowansdk.use.js init success!')

window.SDKDATA = {}
// 苹果渠道正式服游戏ID  gameid  如果请求的 game_id 和这里的game_id一致就是测试服
let testServerArray = '{"game_id":"40","game_id":"40"}'
sessionStorage.setItem('testServerArray', testServerArray)
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    FN.log('融合初始化init')
    // 保存回调函数
    window.SDKDATA.init = {}
    window.SDKDATA.init.callback = res => {
      // res为实际请求的响应结果
      if (typeof callback === 'function') {
        // 可在此处对res进行处理回调给useH5
        callback(FN.wrap(res))
      }
    }
    // 至劲GO玩SDK
    window.zjgwSDK.init().then(res => {
      if (res.code === 0) {
        res.data.setting = data
        FN.saveSession('SDK_INIT_INFO', res.data)
      }
      window.SDKDATA.init.callback(res)
    })
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    window.SDKDATA.loginWay = data.loginWay
    window.SDKDATA.login = {}
    window.SDKDATA.login.callback = (res = {}) => {
      if (typeof callback === 'function') {
        // 可在此处对res进行处理回调给useH5
        // res 为zjgwsdk响应参数为zjgwsdk响应参数
        let { code: statusCode, data, msg: status } = res
        let cpRes = {
          statusCode,
          // status,
          loginParams: {
            ...data,
            userName: data.name,
            statusCode
          }
        }
        callback(cpRes)
      }
    }
  },
  __isChangeUser__: false,
  changeAccount ({ token, callback }) {
    // 切换帐号必定注销用户信息
    FN.removeSession('USER_INFO')
    FN.removeSession('FUSE_USER_INFO')
    // 浮标隐藏
    // document.getElementById('float-ball').remove(0)
    // 直接响应成功，cp会主动使用one方法调用login
    callback({
      statusCode: 0,
      status: '调用切换帐号成功'
    })
  },
  // 获取fromId
  getFromID () {
    return FN.getSession('zjgw').from_id
  },
  recharge ({ token, data = {}, callback }) {
    callback({
      statusCode: 0,
      status: '调用支付成功'
    })
  },
  goToUserCenter ({ token, data = {}, callback }) {
    // 保存回调函数
  },
  flymeChangeAccount ({ token, data = {}, callback }) {
    // 保存回调函数
    // 在外部点击切换帐号时会执行
    window.SDKDATA.flymeChangeAccount = {}
    window.SDKDATA.flymeChangeAccount.callback = (res = {}) => {
      if (typeof callback === 'function') {
        FN.log('toCp:flymeChangeAccount', res)
        callback(res)
      }
    }
  }
}
