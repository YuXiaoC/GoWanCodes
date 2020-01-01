FN.log('gowansdk.use.js init success!')

window.SDKDATA = {}

window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    FN.log('融合初始化init')
    callback({
      statusCode: 0,
      status: '初始化成功',
      remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
    })
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    let urlParams = FN.getURLparams()
    let header = {gameId: urlParams.gameId, uid: urlParams.uid, userName: urlParams.userName, time: urlParams.time, sign: urlParams.sign, signType: urlParams.signType}
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
        dk_sdk.reload()
      }
    })
  },
  recharge ({token, data = {}, callback}) {
    console.log('支付信息', data)
    let urlParams = FN.getURLparams()

    CY_GAME_SDK.pay({
      gameId: urlParams.gameId,
      uid: urlParams.uid,
      time: data.ext.time,
      server: data.serverId,
      role: data.roleId,
      goodsId: data.cpProductId,
      goodsName: data.productName,
      money: data.amount / 100,
      cpOrderId: data.order_id,
      ext: '',
      sign: data.ext.game_sign,
      signType: 'md5'
    })
    if (FN.getSession('FUSE_CHANNEL_INFO').game_id === '56') { // 注意: 这个game_id判断值要上线前要,检查清楚
      callback({
        statusCode: 0,
        status: {orderId: data.order_id}
      })
    } else {
      callback({
        statusCode: 0,
        status: '调用支付成功'
      })
    }
  },
  // shareToArk ({token, data = {}, callback}) {
  //   var sdk = window.CY_GAME_SDK

  //   var params = {
  //     gameId: FN.getURLparams().gameId, // 游戏的ID
  //     onShare: {
  //       success: function () { /* 分享好友成功回调 */
  //         callback({
  //           statusCode: 0,
  //           aioType: 4, // 1: 个人  4:群聊
  //           status: '分享成功'
  //         })
  //       }
  //     }
  //   }
  //   sdk.config(params) // 初始化
  //   // console.log({title: data.summary, desc: data.summary, imgUrl: data.picUrl})
  //   sdk.showShare(data.summary, data.summary, data.picUrl)
  //   // sdk.showShare = function (title, desc, imgUrl) {
  //   //   sdk.sendMsgToParent({operation: 'share', param: {title: data.summary, desc: data.summary, imgUrl: data.picUrl}})
  //   // }
  // },
  getEXT (data) {
    let urlParams = FN.getURLparams()
    FN.log(data)
    let {cpProductId, productName, roleId, roleLevel, chargeDesc, roleName, serverId, callbackInfo, amount} = data
    window.__payData__ = {
      gameId: urlParams.gameId,
      uid: urlParams.uid,
      server: serverId,
      role: roleId,
      goodsId: cpProductId,
      goodsName: productName,
      money: amount / 100
    }
    return window.__payData__
  }
}
