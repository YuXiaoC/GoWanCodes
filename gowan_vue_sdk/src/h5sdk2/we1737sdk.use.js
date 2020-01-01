FN.log('we1737sdk.use.js')

window.FUSESDKAPI = {

  init ({token, data = {}, callback}) {
    // 渠道初始化方法在这里调用
    let result = {
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    }
    callback(result)
  },
  // 登录
  login ({token, data = {}, callback}) {
    // 渠道登录方法在这里调用
    let Params = FN.getURLparams() // 获取链接参数
    FN.log('urlParams', Params)

    let user_id = Params.user_id
    let game_id = Params.game_id
    let sign = Params.sign
    let header = {
      user_id,
      sign
    } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          res.data.user_id = user_id
          res.data.we1737game_id = game_id
          // 存储当前渠道用户信息
          FN.saveSession('FUSE_USER_INFO', res.data)
          // 回传给CP
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
  // 支付
  recharge ({token, data = {}, callback}) {
    FN.log('支付信息', data)
    let user_id = FN.getSession('FUSE_USER_INFO').user_id
    let we1737game_id = FN.getSession('FUSE_USER_INFO').we1737game_id
    FN.log('FUSE_CHANNEL_INFO', FN.getSession('FUSE_CHANNEL_INFO'))

    var gameUrl = 'http://www.my1737.com/Pay/order/common'

    var payData = {
      user_id: user_id,
      game_id: we1737game_id,
      goods_name: data.productName ? data.productName : data.chargeDesc,
      no: data.order_id,
      total_fee: data.ext.total_fee,
      sign: data.ext.sign,
      ext: data.ext.ext
    }
    FN.log('paydata', payData)

    var urlParams = ''
    for (var i in payData) {
      urlParams += i + '=' + payData[i] + '&'
    }
    urlParams = urlParams.substring(0, urlParams.length - 1)

    location.href = gameUrl + '?' + urlParams

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  }
}
