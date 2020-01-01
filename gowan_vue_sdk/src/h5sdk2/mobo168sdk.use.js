// 对接需求文档大全
// 提取链接：https://pan.baidu.com/s/1G6D6FmxzizwYDG1YC8rP1w  密码：dnnp
// 测试地址 http://h5.duantian.cn/open/index.html#101593
FN.log('mobo168sdk.use.js')
let urlParams = FN.getURLparams()// 获取渠道信息
console.log('urlParams', urlParams)
window.FUSESDKAPI = {

  init ({ token, data = {}, callback }) {
    // 渠道初始化方法在这里调用
    let result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },
  // 登录
  login ({ token, data = {}, callback }) {
    // 渠道登录方法在这里调用
    let deviceid = 'H5'
    let ext_header = {}
    let header = {deviceid, ...urlParams}
    FN.log('login-header-->', header)
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
            status: res.msg
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
  // 支付
  recharge ({token, data = {}, callback}) {
    let USER_IFO = FN.get('FUSE_USER_INFO')
    let params = FN.getURLparams()
    // 组装参数
    var pay_data = {
      'app_key': params.channelExt,
      'open_id': USER_IFO.user_id,
      'total_fee': (data.amount / 100).toFixed(2), // 支付金额（单位元），精确到小数点后两位
      'game_orderno': data.order_id,
      'subject': data.productName,
      'notify_url': params.sdkloginmodel,
      'timestamp': data.ext.sign,
      'nonce': params.nonce,
      'signature': data.serverNa
    }
    game.pay(pay_data)
  },
  getEXT (data) {
    FN.log('ext_Data', data)
    let params = FN.getURLparams()
    timestamp = Date.parse(new Date()) / 1000
    window.__payData__ = {
      product_name: data.productName,
      channelExt: params.channelExt,
      sdkloginmodel: params.sdkloginmodel
    }
    return window.__payData__
  }
}
