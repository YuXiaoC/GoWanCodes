FN.log('misdk.use.js init success!')

window.SDKDATA = {}
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    callback({statusCode: 0, status: '初始化成功', remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)})
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    let urlParams = FN.getURLparams()
    let header = {gid: urlParams.gid, time: urlParams.time, uid: urlParams.uid, sign: urlParams.sign}
    let ext_header = {}
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
      } else {
        callback({
          statusCode: res.code,
          status: res.msg
        })
      }
    })
  },
  recharge ({token, data = {}, callback}) {
    // console.log('支付信息', data)
    let cpData = data
    let urlParams = FN.getURLparams()
    var sdk = new PAYSDK()

    // 发起支付的时候调用以下方法
    // data：支付参数（见下表）
    var payData = {
      gid: parseInt(urlParams.gid),
      orderId: data.order_id,
      total_fee: data.amount / 100,
      gold: data.productName,
      uid: urlParams.uid,
      serverNum: parseInt(data.serverId),
      playerName: data.roleName,
      time: data.ext.time,
      diamond: parseInt(data.productName),
      playerId: data.roleId,
      sign: data.ext.game_sign,
      extend: ''
    }
    console.log('萝卜玩payData', payData)
    sdk.sdkPay(payData, function (result) {
      // 支付回调
      // result结构如下
      // 0=成功 -1=取消，其他<0=失败
      if (result.code == 0) {

      }
    })
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      callback({
        statusCode: 0,
        status: {orderId: cpData.order_id}
      })
    } else {
      callback({
        statusCode: 0,
        status: '调用支付成功'
      })
    }
  },
  shareToArk ({token, data = {}, callback}) {
    // alert(new Date().getTime())
    var sdk = new PAYSDK()
    var share = {
      gid: FN.getURLparams().gid,
      uid: FN.getURLparams().uid,
      time: new Date().getTime()
    }
    sdk.shareInitialize(share, function (result) {
      // alert(result.code)
      if (result.code === 0) {
        sdk.share(share, function (result) {
          if (result.code == 0) { // 0=成功 -1=取消，其他<0=失败
            callback({
              statusCode: 0,
              aioType: 4, // 1: 个人  4:群聊
              status: '分享成功'
            })
          } else {
            callback({
              statusCode: 1,
              status: '分享失败'
            })
          }
        })
      }
    })

    // var sdk = new PAYSDK()
    // var share = {
    //   gid: FN.getURLparams().gid,
    //   uid: FN.getURLparams().uid,
    //   time: new DataCue().tostring()
    // }
  },
  getEXT (data) {
    let urlParams = FN.getURLparams()
    FN.log(data)
    let {cpProductId, productName, roleId, roleLevel, chargeDesc, roleName, serverId, callbackInfo, amount} = data
    window.__payData__ = {
      gid: urlParams.gid,
      total_fee: amount / 100,
      gold: productName,
      serverNum: serverId,
      playerName: roleName,
      playerId: roleId,
      diamond: parseInt(productName)
    }
    return window.__payData__
  }
}
