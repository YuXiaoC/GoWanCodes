FN.log('gowansdk.use.js init success!')

window.SDKDATA = {}

window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    console.log('融合初始化', data)
    window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
      if (window.orientation === 180 || window.orientation === 0) {
        // alert('竖屏状态！');
      }
      if (window.orientation === 90 || window.orientation === -90) {
        // alert('横屏状态！');
      }
    }, false)

    FN.log('融合初始化init')
    // 保存回调函数
    window.SDKDATA.init = {}
    window.SDKDATA.init.callback = res => {
      // res为实际请求的响应结果
      if (typeof callback === 'function') {
        // 可在此处对res进行处理回调给useH5
        // callback(FN.wrap(res))
        callback({statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)})
      } else {
        callback({statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)})
      }
    }
    // 至劲GO玩（千禧）SDK
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
    FN.log('window.SDKDATA------>', window.SDKDATA)
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
    FN.log('changeAccount切换账号')
    // 切换帐号必定注销用户信息
    FN.removeSession('USER_INFO')
    FN.removeSession('FUSE_USER_INFO')
    // 浮标隐藏
    // document.getElementById('float-ball').remove(0)
    // 直接响应成功，cp会主动使用one方法调用login
    let cbData = {
      statusCode: 0,
      status: '调用切换帐号成功'
    }
    callback(cbData)
  },
  // 获取fromId
  getFromID () {
    return FN.getSession('zjgw').from_id
  },
  recharge ({ token, data = {}, callback }) {
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') {
      let cbData = {
        statusCode: 0,
        status: {orderId: data.order_id}
      }
      callback(cbData)
    } else {
      let cbData = {
        statusCode: 0,
        status: '成功调用'
      }
      callback(cbData)
    }
  },
  goToUserCenter ({ token, data = {}, callback }) {
    // 保存回调函数
  },
  flymeChangeAccount ({ token, data = {}, callback }) {
    FN.log('flymeChangeAccount---->')
    // 保存回调函数
    // 在外部点击切换帐号时会执行
    window.SDKDATA.flymeChangeAccount = {}
    window.SDKDATA.flymeChangeAccount.callback = (res = {}) => {
      if (typeof callback === 'function') {
        FN.log('toCp:flymeChangeAccount', res)
        callback(res)
      }
    }
  },
  getLimiOrderId ({token, data = {}, callback}) {
    let order_id = FN.getSession('limiorder')
    let cbData = {
      statusCode: 0,
      status: {orderId: order_id}
    }
    callback(cbData)
  }
}
// 支付通知游戏发货
function payForCallback (res) {
  console.log('支付通知游戏发货_cpData', res)
  if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') {
    FN.post({
      type: 'CC',
      token,
      payload: {
        statusCode: 0,
        status: {
          orderId: cpData.order_id
        }
      }
    })
  }
}
