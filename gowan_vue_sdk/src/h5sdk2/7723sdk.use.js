/*测试地址：
    英雄训练师：http://m.h5.7723.com/login?gameid=1435&agentid=68
*/
FN.log('7723sdk.use.js')

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
    let Params = FN.getURLparams() // 获取链接参数
    FN.log('urlParams', Params)

    let userId = Params.userId
    let userName = Params.userName
    let time = Params.time
    let sign  = Params.sign 
    let header = {
      time,
      userId,
      sign,
    } // 用于融合登录传递给后端,进行登录校验
    let ext_header = {}
    if (!window.__ext__) {
      window.FUSESDK.login({
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(header)
      }).then(res => {
        if (res.code === 0) {
          FN.log('BZPAY', BZPAY)
          BZPAY.announcement(res.data.ext.gameId,res.data.ext.agentid,userName);

          // 存储当前渠道用户信息
          res.data.userName = userName
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
    var userId = FN.getSession('FUSE_USER_INFO').user_id
    var userName = FN.getSession('FUSE_USER_INFO').userName
    let cpData = data

    var payData = {
        userId: userId,
        userName: userName,
        gameId: cpData.ext.gameId,
        goodsId: data.cpProductId,
        goodsName: data.productName ? data.productName : data.chargeDesc,
        money: cpData.ext.money,    //元，服务端
        egretOrderId: cpData.order_id,
        channelExt: '',
        ext: cpData.ext.ext,
        gameUrl: '',
        time: cpData.ext.time,
        agentid: cpData.ext.agentid,
        sign: cpData.ext.sign
    };
    FN.log('paydata', payData)
    BZPAY.callPay(
        userId,
        userName,
        cpData.ext.gameId,
        data.cpProductId,
        data.productName ? data.productName : data.chargeDesc,
        cpData.ext.money,    //元，服务端
        cpData.order_id,
        '',
        cpData.ext.ext,
        '',
        cpData.ext.time,
        cpData.ext.agentid,
        cpData.ext.sign
    )

    let cbData = {
      statusCode: 0,
      status: '调用支付成功'
    }
    callback(cbData)
  },
  //支付透传参数
  getEXT (data) {

    window.__payData__ = {
      goodsId: data.cpProductId,
      goodsName: data.productName ? data.productName : data.chargeDesc,
    }
    FN.log('__payData__', __payData__)
    return window.__payData__
  },
}