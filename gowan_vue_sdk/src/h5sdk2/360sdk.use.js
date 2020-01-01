console.log('360gamesdk.use.js')
window.FUSESDKAPI = {
  init ({ token, data = {}, callback }) {
    console.log('融合初始化data', data)
    window.FUSESDK.h5pub().then(function (res) {
      if (res.code === 0) {
        console.log('pub', res.data)
        FN.saveSession('game_key', JSON.parse(res.data.ext).game_key)
        window.aladdin.init({ game_key: JSON.parse(res.data.ext).game_key })
        callback({
          statusCode: 0,
          status: '初始化成功',
          remote: JSON.parse(FN.getSession('FUSE_CHANNEL_INFO').remote)
        })
      }
    })
  },
  login ({ token, data = {}, callback }) {
    FN.log('融合登录')
    aladdin.getUserInfo().then(function (userInfo) {
      let header = {plat_user_id: userInfo.plat_user_id, sign: userInfo.sign} // 用于融合登录传递给后端,进行登录校验
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
    }).catch(function (error) {
      console.log(error)
    })
  },
  recharge ({token, data = {}, callback}) {
    if (data.ext.data.tid) {
      console.log({tid: data.ext.data.tid, game_key: FN.getSession('game_key')})
      aladdin.pay(data.ext.data.tid).then(function (result) {
        console.log('支付')

        // alert('支付')
        // if (FN.getSession('FUSE_CHANNEL_INFO').channel === '360') {
        //   alert(data.order_id)
        // }
      }).catch(function (error) {
        console.log(error)
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
    }
  },
  getEXT (data) {
    FN.log(data)

    let {cpProductId, productName, roleId, roleLevel, chargeDesc, roleName, serverId, amount} = data
    window.__payData__ = {
      product_name: productName,
      product_id: cpProductId,
      plat_user_id: FN.getSession('FUSE_USER_INFO').user_id,
      amount: amount / 100
    }
    return window.__payData__
  }
}
